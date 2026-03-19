const express = require('express');
const alertController = require('../controllers/notif.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();


// ==============================
// 🔔 Notifications liées à une alerte
// ==============================

router.get(
  '/notification/:alertId',
  checkAuthMiddleware,
  checkRole('user', 'collector', 'admin'),
  alertController.getNotificationByAlertId
);


// ==============================
// 🖥 Notifications Admin (EcoBack)
// ==============================

router.get(
  "/getAdminNotifications",
  checkAuthMiddleware,
  checkRole('admin'),
  alertController.getAdminNotifications
);

module.exports = router;