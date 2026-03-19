const models = require('../models');



async function getAdminNotifications(req, res) {
    try {
        // Rechercher toutes les notifications où collectorId est 0
        const notifications = await models.Notification.findAll({
            where: { collectorId: 1 },
            include: [
                {
                    model: models.User,
                    attributes: ['id', 'name', 'surname', 'tel'] // Remplacement de 'email' par 'tel'
                },
                {
                    model: models.Alert,
                    attributes: ['id', 'description', 'statut', 'longitude', 'latitude']
                }
            ],
            order: [['createdAt', 'DESC']] // Trier par date de création décroissante
        });

        // Vérifier si des notifications ont été trouvées
        if (notifications.length === 0) {
            return res.status(404).json({ message: "Aucune notification trouvée." });
        }

        // Retourner les notifications trouvées
        res.status(200).json({ notifications });
    } catch (error) {
        console.error("Erreur lors de la récupération des notifications :", error);
        res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des notifications.", error });
    }
}



// Backend: notificationsController.js

const getNotificationByAlertId = async (req, res) => {
  const alertId  = req.params.alertId;
  console.log( alertId)
  try {
    const notifications = await models.Notification.findAll({
      where: { alertId: alertId }
    });

    if (notifications.length > 0) {
      res.status(200).json({ notifications });
    } else {
      res.status(404).json({
        message: "Aucune notification trouvée pour cette alerte."
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur s'est produite lors de la récupération des notifications.",
      error: error
    });
  }
};


module.exports = {
    
    getAdminNotifications,

    getNotificationByAlertId
};
