


const models = require('../models');
const Validator = require('fastest-validator');
const { Expo } = require('expo-server-sdk'); // Import du SDK Expo
const geolib = require('geolib');
const { Op } = require('sequelize');
const fs = require('fs');
const path = require('path');
const winston = require('winston'); // Import Winston pour le logging

// Configurer Winston pour le logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

function isAlphaNumericWithLettersAndNumbers(str) {
    const isAlphaNumeric = /^[a-zA-Z0-9]+$/;
    return isAlphaNumeric.test(str);
}

// Nouvelle fonction pour vérifier si une alerte existe dans un rayon de 10m
async function isAlertWithinRadius(newAlertLocation) {
    const existingAlerts = await models.Alert.findAll({
        where: {
            [Op.or]: [{ statut: "envoyé" }, { statut: "en cours" }],
            longitude: { [Op.ne]: null },
            latitude: { [Op.ne]: null }
        },
        attributes: ['id', 'description', 'longitude', 'latitude']
    });

    for (let alert of existingAlerts) {
        const alertLocation = { latitude: alert.latitude, longitude: alert.longitude };
        const distance = geolib.getDistance(newAlertLocation, alertLocation);

        if (distance <= 0.5) {
            logger.info(`Alerte trouvée à ${distance} mètres.`, { alert });
            return alert;
        }
    }

    return null;
}

async function findNearestCollector(alertLocation) {
    if (!alertLocation || typeof alertLocation.latitude !== 'number' || typeof alertLocation.longitude !== 'number') {
        throw new Error("alertLocation doit contenir des propriétés latitude et longitude au format numérique.");
    }

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const collectors = await models.User.findAll({
        where: {
            statut: 'collector',
            updatedAt: { [Op.gte]: tenMinutesAgo }
        },
        attributes: ['id', 'name', 'surname', 'tel', 'pushToken', 'longitude', 'latitude', 'updatedAt']
    });

    if (collectors.length === 0) {
        logger.warn("Aucun collecteur trouvé.");
        return null;
    }

    const validCollectors = collectors.filter(collector =>
        typeof collector.longitude === 'number' && typeof collector.latitude === 'number'
    );

    if (validCollectors.length === 0) {
        logger.warn("Je n'ai pas trouvé de collecteur valide.");
        return null;
    }

    const collectorsWithinRadius = validCollectors.filter(collector =>
        geolib.isPointWithinRadius(
            { latitude: collector.latitude, longitude: collector.longitude },
            alertLocation,
            2000
        )
    );

    if (collectorsWithinRadius.length === 0) {
        logger.warn("Aucun collecteur trouvé dans un rayon de 2 km.");
        return null;
    }

    const nearestCollector = geolib.findNearest(alertLocation, collectorsWithinRadius.map(collector => ({
        ...collector,
        longitude: collector.longitude,
        latitude: collector.latitude,
    })));

    logger.info("Collecteur le plus proche trouvé.", { nearestCollector });
    return nearestCollector;
}


const expo = new Expo();  // Initialiser le SDK Expo

async function sendExpoNotification(pushTokens, message) {
    let notifications = [];

    for (let pushToken of pushTokens) {
        // Vérifier si le token est un token Expo valide
        if (!Expo.isExpoPushToken(pushToken)) {
            console.error(`Push token ${pushToken} n'est pas un Expo Push Token valide`);
            continue;
        }

        notifications.push({
            to: pushToken,
            sound: 'default',
            title: message.title,
            body: message.body,
            data: message.data,
        });
    }

    let chunks = expo.chunkPushNotifications(notifications);
    let tickets = [];

    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Erreur lors de l\'envoi des notifications Expo:', error);
        }
    }

    return tickets;
}


// Fonction pour envoyer des notifications uniquement via Expo
async function sendNotification(pushTokens, message) {
    // Extraire uniquement les tokens Expo en tant que chaînes de caractères
    const expoTokens = pushTokens
        .filter(tokenObj => Expo.isExpoPushToken(tokenObj.token))
        .map(tokenObj => tokenObj.token); // Extrait seulement les tokens sous forme de chaînes

    // Log pour vérifier les tokens après l'extraction
    logger.info("Tokens Expo extraits pour notification :", { expoTokens });

    if (expoTokens.length > 0) {
        await sendExpoNotification(expoTokens, message);
        logger.info('Notifications push envoyées avec succès via Expo.');
    } else {
        logger.warn("Aucun token Expo valide trouvé pour l'envoi des notifications.");
    }
}


async function save(req, res) {
    const alert = {
        description: req.body.description,
        image: req.file ? req.file.filename : null,
        collectorId: null,
        userId: req.userData.userId,
        statut: "envoyé",
        longitude: req.body.longitude ? Number(req.body.longitude) : null,
        latitude: req.body.latitude ? Number(req.body.latitude) : null,
    };

    if (alert.longitude === null || alert.latitude === null || isNaN(alert.longitude) || isNaN(alert.latitude)) {
        return res.status(400).json({ message: "Coordonnées non valides" });
    }

    try {
        // Vérification de la proximité d'alertes existantes
        const newAlertLocation = { latitude: alert.latitude, longitude: alert.longitude };
        const nearbyAlert = await isAlertWithinRadius(newAlertLocation);

        if (nearbyAlert) {
            return res.status(409).json({
                message: "Alerte déjà existante dans un rayon de 10 mètres",
                alert: nearbyAlert
            });
        }

        // Création de la nouvelle alerte
        const newAlert = await models.Alert.create(alert);
        logger.info("Nouvelle alerte créée avec succès.", { newAlert });

        const imageUrl = req.file ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}` : null;

        // Recherche du collecteur le plus proche
        let nearestCollector = await findNearestCollector({ latitude: alert.latitude, longitude: alert.longitude });

        if (nearestCollector) {
            const collectorId = nearestCollector.dataValues.id;

            if (!nearestCollector.dataValues.pushToken) {
                logger.error("Push token du collecteur manquant.");
                return res.status(500).json({ message: "Erreur interne : Push token du collecteur manquant" });
            }

            const newNotification = await models.Notification.create({
                message: "Nouvelle alerte",
                alertId: newAlert.id,
                userId: alert.userId,
                collectorId: collectorId
            });

            const pushToken = nearestCollector.dataValues.pushToken;

            const messages = [{
                token: pushToken,
                notification: {
                    title: 'Nouvelle alerte',
                    body: 'Une nouvelle alerte a été créée.'
                },
                data: {
                    alertId: String(newAlert.id),
                    userId: String(alert.userId),
                    collectorId: String(collectorId)
                }
            }];

            await sendNotification(messages, {
                title: 'Nouvelle alerte',
                body: 'Une nouvelle alerte a été créée.',
                data: {
                    alertId: String(newAlert.id),
                    userId: String(alert.userId),
                    collectorId: String(collectorId)
                }
            });
        } else {
            logger.warn("Aucun collecteur trouvé, création d'une notification pour les administrateurs...");

            const notificationData = {
                message: "Nouvelle alerte, aucun collecteur dans un rayon de 2km",
                alertId: newAlert.id,
                userId: alert.userId,
                collectorId: 1
            };

            const createdNotification = await models.Notification.create(notificationData);

            const adminUsers = await models.User.findAll({
                where: { statut: 'admin' }
            });

            if (adminUsers.length === 0) {
                logger.error("Aucun administrateur trouvé.");
                return res.status(500).json({ message: "Erreur interne : Aucun administrateur trouvé" });
            }

            const adminMessages = adminUsers
                .filter(admin => admin.pushToken)
                .map(admin => ({
                    token: admin.pushToken,
                    notification: {
                        title: 'Nouvelle alerte',
                        body: 'Aucun collecteur n\'a été trouvé dans un rayon de 2km.'
                    },
                    data: { alertId: String(newAlert.id) }
                }));

            if (adminMessages.length === 0) {
                logger.error("Aucun token push valide pour les administrateurs.");
                return res.status(500).json({ message: "Erreur interne : Aucun token push valide pour les administrateurs" });
            }

            await sendNotification(adminMessages, {
                title: 'Nouvelle alerte',
                body: 'Aucun collecteur n\'a été trouvé dans un rayon de 2km.',
                data: { alertId: String(newAlert.id) }
            });
        }

        res.status(201).json({
            message: "Alerte créée avec succès",
            alert: {
                ...newAlert.toJSON(),
                imageUrl: imageUrl
            }
        });
    } catch (error) {
        logger.error("Erreur lors de la création de l'alerte ou de la notification.", { error });
        res.status(500).json({ message: "Quelque chose s'est mal passé", error: error });
    }
}

module.exports = { save };





async function getAlertById(req, res) {
    const alertId = req.params.id;
    console.log(`La fonction getAlertById a été appelée avec l'ID: ${alertId}`);

    try {
        const alert = await models.Alert.findByPk(alertId);
        console.log(alert); // Ajoutez ceci pour voir l'objet d'alerte

        if (!alert) {
            return res.status(404).json({ message: "Alerte non trouvée" });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = alert.image ? `${baseUrl}/uploads/${alert.image}` : null;
        console.log(imageUrl); // Ajoutez ceci pour vérifier l'URL de l'image

        const alertWithImageUrl = {
            ...alert.toJSON(),
            imageUrl: imageUrl
        };

        res.status(200).json(alertWithImageUrl);
        console.log("réponse envoyé avec succès");
    } catch (error) {
        console.error("Erreur au cours de la recherche de l'alerte :", error);
        return res.status(500).json({ message: "Une erreur s'est produite", error });
    }
}



async function show(req, res) {
    const userId = req.userData.userId;

    try {
        const alerts = await models.Alert.findAll({ 
            where: { userId: userId }, 
            attributes: { exclude: ['collectorId'] }
        });

        if (alerts.length > 0) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const alertsWithImageUrl = alerts.map(alert => {
                const imageUrl = alert.image ? `${baseUrl}/uploads/${alert.image}` : null;
                console.log('Alert ID:', alert.id, 'Image URL:', imageUrl);
                return {
                    ...alert.toJSON(),
                    imageUrl: imageUrl
                };
            });

            res.status(200).json(alertsWithImageUrl);
        } else {
            res.status(404).json({
                message: "No alerts found for this user!"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    }
}

module.exports = {
    show
};


async function showC(req, res) {
    const userId = req.userData.userId;

    try {
        const alerts = await models.Alert.findAll({
            where: { collectorId: userId },
            attributes: { exclude: ['userId'] }
        });

        if (alerts.length > 0) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const alertsWithImageUrl = alerts.map(alert => {
                const imageUrl = alert.image ? `${baseUrl}/uploads/${alert.image}` : null;
                console.log('Alert ID:', alert.id, 'Image URL:', imageUrl);
                return {
                    ...alert.toJSON(),
                    imageUrl: imageUrl
                };
            });

            res.status(200).json(alertsWithImageUrl);
            
        } 
        else {
            res.status(404).json({
                message: "Aucune alerte trouvée pour cet utilisateur !"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Une erreur s'est produite !",
            error: error
        });
    }
}


async function index(req, res) {
    try {
        const alerts = await models.Alert.findAll();

        if (alerts.length > 0) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;

            const alertsWithImageUrl = alerts.map(alert => {
                const imageUrl = alert.image ? `${baseUrl}/uploads/${alert.image}` : null;
                console.log('Alert ID:', alert.id, 'Image URL:', imageUrl);
                return {
                    ...alert.toJSON(),
                    imageUrl: imageUrl
                };
            });

            res.status(200).json(alertsWithImageUrl);
        } else {
            res.status(404).json({
                message: "No alerts found!"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    }
}



async function indexC(req, res) {
    try {
        const alerts = await models.Alert.findAll({
            attributes: { exclude: ['userId'] }
        });
        res.status(200).json(alerts);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong!",
            error: error
        });
    }
}

const showDC = async (req, res) => {
  const collectorId = req.params.collectorId;

  try {
    const alerts = await models.Alert.findAll({
      where: {
        collectorId: collectorId,
        statut: 'traité',
      },
    });

    if (alerts.length > 0) {
      res.status(200).json(alerts);
    } else {
      res.status(404).json({
        message: 'Aucune alerte traité par ce collecteur',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Une erreur s\'est produite',
      error: error.message,
    });
  }
};

const showDU = async (req, res) => {
  const userId = req.params.userId;

  try {
    const alerts = await models.Alert.findAll({
      where: {
        userId: userId,
      },
    });

    if (alerts.length > 0) {
      res.status(200).json(alerts);
    } else {
      res.status(404).json({
        message: 'No alerts found for this user',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Une erreur s\'est produite',
      error: error.message,
    });
  }
};



async function update(req, res) {
  const id = req.params.alertId;
  const userId = req.userData.userId; // Supposons que l'ID de l'utilisateur soit stocké dans req.userData.userId
  let updatedStatus;

  // Log des valeurs reçues
  console.log('Received Params:', req.params);
  console.log('Received ID:', id);
  console.log('Received userId:', userId);
  console.log('Received File:', req.file); // Journalisation du fichier reçu
  console.log('Received Body:', req.body); // Journalisation du corps de la requête

  try {
    // Récupérer l'alerte actuelle
    const alert = await models.Alert.findOne({ where: { id: id } });
    console.log('Fetched Alert:', alert);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    // Vérifier et traiter l'image si une nouvelle image est envoyée
    if (req.file) {
      console.log('New file received:', req.file.filename);
      const oldImagePath = alert.image ? path.join(__dirname, 'uploads', alert.image) : null;
      const newImagePath = req.file.filename;

      // Remplacer l'ancienne image par la nouvelle
      if (oldImagePath) {
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          } else {
            console.log('Old image deleted:', oldImagePath);
          }
        });
      }

      // Mettre à jour le nom du fichier de l'image dans l'alerte
      alert.image = newImagePath;
    }

    // Déterminer le nouveau statut et mettre à jour le collectorId si nécessaire
    if (alert.statut === 'envoyé') {
      updatedStatus = 'en cours';
      alert.collectorId = userId; // Mettre à jour le collectorId
      console.log('Status updated to "en cours" and collectorId set to', userId);
    } else if (alert.statut === 'en cours') {
      if (req.file) {
        updatedStatus = 'traité';
        console.log('Status updated to "traité"');
      } else {
        return res.status(400).json({
          message: "Image requise pour marquer comme traité"
        });
      }
    } else {
      return res.status(400).json({
        message: "Invalid alert status"
      });
    }

    // Assigner les valeurs avant sauvegarde
    alert.statut = updatedStatus;
    alert.userId = alert.userId || req.userData.userId; // S'assurer que userId n'est pas nul
    alert.collectorId = alert.collectorId || userId; // S'assurer que collectorId n'est pas nul

    console.log('Final Alert Data:', alert);

    await alert.save();

    console.log('Update Result:', alert);

    // Construit l'URL de l'image
    const imageUrl = alert.image ? `${req.protocol}://${req.get('host')}/uploads/${alert.image}` : null;
    console.log('Image URL:', imageUrl);

    res.status(200).json({
      message: "Alert updated successfully",
      alert: {
        ...alert.toJSON(),
        imageUrl: imageUrl
      }
    });
  } catch (error) {
    console.error('Error during alert update:', error);
    res.status(500).json({
      message: "Something went wrong",
      error: error
    });
  }
}


async function destroy(req, res) {
    const id = req.params.id;
    const userId = req.userData.userId;

    try {
        const result = await models.Alert.destroy({ where: { id: id, userId: userId } });
        if (result) {
            res.status(200).json({
                message: "Alert deleted successfully"
            });
        } else {
            res.status(404).json({
                message: "Alert not found"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}

async function assignCollector(req, res) {

    const alertId = req.params.alertId;
    const { collectorId } = req.body;

    console.log("Alert ID:", alertId);
    console.log("Collector ID:", collectorId);

    try {

        // Vérifier si les données existent
        if (!alertId || !collectorId) {
            return res.status(400).json({
                message: "alertId ou collectorId manquant"
            });
        }

        // Chercher l'alerte
        const alert = await models.Alert.findByPk(alertId);

        if (!alert) {
            return res.status(404).json({
                message: "Alerte non trouvée"
            });
        }

        // Chercher le collecteur
        const collector = await models.User.findByPk(collectorId);

        if (!collector) {
            return res.status(404).json({
                message: "Collecteur non trouvé"
            });
        }

        // Vérifier que c'est bien un collecteur
        if (collector.statut !== "collector") {
            return res.status(400).json({
                message: "L'utilisateur sélectionné n'est pas un collecteur"
            });
        }

        // Attribution
        alert.collectorId = collectorId;
        await alert.save();

        return res.status(200).json({
            message: `Collecteur ${collector.name} ${collector.surname} attribué avec succès`
        });

    } catch (error) {

        console.error("Erreur attribution:", error);

        return res.status(500).json({
            message: "Erreur lors de l'attribution du collecteur"
        });

    }

}


module.exports = {
    save: save,
    show: show,
    index: index,
    update: update,
    destroy: destroy,
    showDU:showDU,
    showDC:showDC,
    indexC:indexC,
    showC:showC,
    assignCollector,
    getAlertById
    }

