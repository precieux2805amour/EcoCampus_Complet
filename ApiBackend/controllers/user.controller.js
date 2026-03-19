const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bcrypt_ = require('phc-bcrypt')
require('dotenv').config();

async function signUp(req, res) {
  try {
    // Vérifiez si le numéro de téléphone existe déjà
    const existingUser = await models.User.findOne({ where: { tel: req.body.tel } });
    if (existingUser) {
      return res.status(409).json({ message: "Le numéro de téléphone existe déjà" });
    }

    /* Hash du mot de passe
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);*/

    // Création de l'utilisateur
    const user = {
      name: req.body.name,
      surname: req.body.surname,
      tel: req.body.tel,
      password: req.body.password,
      statut: req.body.statut || 'user'  // Valeur par défaut si non fournie
    };

    await models.User.create(user);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
}

async function login(req, res) {
  try {
    console.log("Starting login process");

    // Vérifier si le téléphone est fourni
    if (!req.body.tel) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    // Vérifier si le mot de passe est fourni
    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Rechercher l'utilisateur
    console.log("Finding user with phone:", "+229" + req.body.tel);

    const user = await models.User.findOne({
      where: { tel: "+229" + req.body.tel },
    });

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.id);

    // Comparer les mots de passe
    console.log("Comparing passwords");

    const isMatch = await bcryptjs.compare(req.body.password, user.password);

    if (!isMatch) {
      console.log("Passwords do not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Passwords match");

    // 🔴 Vérification si le compte est actif
    if (!user.isActive) {
      console.log("User account is disabled");

      return res.status(403).json({
        message: "Account disabled. Contact administrator.",
      });
    }

    // Génération du token
    console.log("Generating token");

    const token = jwt.sign(
      {
        tel: user.tel,
        userId: user.id,
        statut: user.statut,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    console.log("Authentication successful");

    return res.status(200).json({
      message: "Authentication successful",
      token: token,
      statut: user.statut,
      userId: user.id,
    });

  } catch (error) {
    console.error("Error during login process:", error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}


async function getProfil(req, res) {
  try {
    const user = await models.User.findOne({ where: { id: req.userData.userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      surname: user.surname,
      tel: user.tel,
      statut: user.statut,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function updateProfil(req, res) {
  try {
    // Récupérer l'utilisateur dans la base de données
    const user = await models.User.findOne({ where: { id: req.userData.userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Vérifier si le mot de passe envoyé correspond à celui dans la base de données
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Mettre à jour les autres champs si le mot de passe est correct
    const updatedData = {
      name: req.body.name || user.name,
      surname: req.body.surname || user.surname,
      tel: req.body.tel || user.tel,
      statut: user.statut
    };

    // Effectuer la mise à jour
    await models.User.update(updatedData, { where: { id: req.userData.userId } });

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}


const getUser = async (req, res) => {
  const userId = req.params.userId;
  console.log('La fonction getUser a été appelée'); // Log au début
  console.log(`Récupération de l'utilisateur avec l'ID: ${userId}`); // Log avant de rechercher l'utilisateur

  try {
    const user = await models.User.findByPk(userId);
    console.log(`Utilisateur trouvé: ${user ? 'Oui' : 'Non'}`); // Log si l'utilisateur a été trouvé

    if (user) {
      console.log('Utilisateur récupéré avec succès:', user); // Log l'utilisateur récupéré
      res.status(200).json(user);
    } else {
      console.log('Utilisateur non trouvé'); // Log si l'utilisateur n'a pas été trouvé
      res.status(404).json({
        message: 'Utilisateur non trouvé',
      });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error); // Log l'erreur pour le débogage
    res.status(500).json({
      message: 'Une erreur s\'est produite',
      error: error.message, // Optionnel : inclure le message d'erreur dans la réponse
    });
  }
};

module.exports = { getUser };

const userList = async (req, res) => {
  console.log('La fonction userList a été appelée'); // Log au début

  try {
    console.log('Récupération des utilisateurs de la base de données'); // Avant de faire la requête à la base de données
    const users = await models.User.findAll();
    console.log('Utilisateurs récupérés avec succès:', users); // Après avoir récupéré avec succès les utilisateurs
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error); // Log l'erreur pour le débogage
    res.status(500).json({
      message: "Quelque chose s'est mal passé",
      error: error.message // Optionnel : inclure le message d'erreur dans la réponse
    });
  }
};

async function destroy(req, res) {
    const id = req.params.id;

    try {
        // Mettre à jour le statut de l'utilisateur à 'inactif' ou 'false'
        const result = await models.User.update(
            { isActive: false },  // Supposant que le modèle utilisateur ait un champ 'isActive'
            { where: { id: id } }
        );

        if (result[0] > 0) {
            res.status(200).json({
                message: "Compte désactivé avec succès"
            });
        } else {
            res.status(404).json({
                message: "Compte inexistant"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Quelque chose s'est mal passé",
            error: error
        });
    }
}

const activateUser = async (req, res) => {
    const userId = req.params.id;  // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête

    try {
        // Mettre à jour le champ isActive à true pour activer l'utilisateur
        const result = await models.User.update(
            { isActive: true },  // Mettre à jour le champ isActive à true
            { where: { id: userId } }  // Trouver l'utilisateur par son ID
        );

        if (result[0] > 0) {
            // Si l'utilisateur a été trouvé et activé
            return res.status(200).json({
                message: "Compte activé avec succès"
            });
        } else {
            // Si l'utilisateur n'existe pas
            return res.status(404).json({
                message: "Utilisateur non trouvé"
            });
        }
    } catch (error) {
        console.error('Erreur lors de l\'activation du compte:', error);
        // Gérer les erreurs internes du serveur
        return res.status(500).json({
            message: "Erreur interne du serveur",
            error: error.message
        });
    }
};


async function updateLocation(req, res) {
    const userId = req.params.userId;
    const { longitude, latitude } = req.body;
    console.log(longitude, latitude);
    if (!longitude || !latitude) {
        return res.status(400).json({ message: "Longitude et latitude sont nécessaires." });
    }

    try {
        const user = await models.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        user.longitude = longitude;
        user.latitude = latitude;
        await user.save();

        res.status(200).json({ message: "Coordonnées mises à jour avec succès.", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Quelque chose s'est mal passé", error });
    }
}

// Dans user.controller.js

 async function savePushToken(req, res) {
  try {
    const { pushToken } = req.body;
    console.log(`voici mon pushtoken ${pushToken}` )
    const userId = req.params.userId
    console.log(`voici mon userId ${userId}`)
    // Récupérer l'utilisateur avec l'ID fourni
    const user = await models.User.findByPk(userId);
    console.log(user)
    if (user && user.statut === 'collector' || user && user.statut === 'admin' ) {
      // Mettre à jour le push token si l'utilisateur est un collecteur
      await user.update({ pushToken });
      res.status(200).json({ message: 'Push token enregistré avec succès.' });
    } else {
      res.status(400).json({ message: 'L\'utilisateur n\'est pas un collecteur ou n\'existe pas.' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du push token:', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
};

const { Op } = require('sequelize'); // Ensure that Sequelize operators are imported



async function getCollectors(req, res) {

    try {

        const collectors = await models.User.findAll({
            where: {
                statut: 'collector'
            },
            attributes: [
                'id',
                'name',
                'surname',
                'tel',
                'pushToken',
                'longitude',
                'latitude',
                'updatedAt'
            ]
        });

        if (!collectors || collectors.length === 0) {
            return res.status(404).json({
                message: "Aucun collecteur disponible."
            });
        }

        res.status(200).json({ collectors });

    } catch (error) {

        console.error("Erreur récupération collecteurs :", error);

        res.status(500).json({
            message: "Erreur serveur lors de la récupération des collecteurs"
        });

    }
}

// Fonction pour changer le mot de passe
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userData.userId; // L'ID de l'utilisateur est récupéré depuis le token JWT
    console.log( `l'identifiant est ${userId}`)
    // Récupérer l'utilisateur depuis la base de données
    const user = await models.User.findByPk(userId);
    console.log( `l'utilisateur est- ${user}`)
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparer l'ancien mot de passe avec celui stocké dans la base de données
    const isMatch = await bcryptjs.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    }

    // Si l'ancien mot de passe est correct, hacher le nouveau mot de passe
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    // Mettre à jour le mot de passe de l'utilisateur dans la base de données
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


//module.exports = { getCollectors };
module.exports = {
  signUp,
  userList,
  login,
  getProfil,
  updateProfil,
  savePushToken,
  destroy,
  updateLocation,
  getCollectors,
  changePassword,
  activateUser
};
