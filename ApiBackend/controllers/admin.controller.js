const { User, Alert } = require("../models");
const { Op } = require("sequelize");

exports.getDashboard = async (req, res) => {
  try {

    /* =========================
       📊 ALERTES
    ==========================*/

    const totalAlerts = await Alert.count();

    const sentAlerts = await Alert.count({
      where: { statut: "envoyé" }
    });

    const inProgressAlerts = await Alert.count({
      where: { statut: "en cours" }
    });

    const treatedAlerts = await Alert.count({
      where: { statut: "traité" }
    });

    /* =========================
       👥 UTILISATEURS
    ==========================*/

    const totalUsers = await User.count();

    const activeUsers = await User.count({
      where: { isActive: true }
    });

    const inactiveUsers = await User.count({
      where: { isActive: false }
    });

    const totalCollectors = await User.count({
      where: { statut: "collector" }
    });

    /* =========================
       🆕 5 dernières alertes
    ==========================*/

    const recentAlerts = await Alert.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "description", "statut", "createdAt"]
    });

    /* =========================
       🆕 5 nouveaux utilisateurs
    ==========================*/

    const recentUsers = await User.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "surname", "tel", "statut", "createdAt"]
    });

    /* =========================
       📈 Alertes aujourd’hui
    ==========================*/

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAlerts = await Alert.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    /* =========================
       📤 Réponse finale
    ==========================*/

    res.status(200).json({
      stats: {
        totalAlerts,
        sentAlerts,
        inProgressAlerts,
        treatedAlerts,
        todayAlerts,
        totalUsers,
        activeUsers,
        inactiveUsers,
        totalCollectors
      },
      recentAlerts,
      recentUsers
    });

  } catch (error) {
    console.error("Erreur dashboard:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};