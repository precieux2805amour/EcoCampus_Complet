const express = require('express');
const alertController = require('../controllers/alert.controller');
const checkAuthMiddleware = require('../middleware/check-auth');
const checkRole = require('../middleware/checkRole');
const imageUploader = require('../helpers/image-uploader');

const router = express.Router();


// 🔹 USER — créer une alerte
router.post(
  "/create",
  checkAuthMiddleware,
  checkRole('user'),
  imageUploader.upload.single('image'),
  alertController.save
);


// 🔹 USER — voir ses alertes
router.get(
  "/show",
  checkAuthMiddleware,
  checkRole('user'),
  alertController.show
);


// 🔹 COLLECTOR — voir ses alertes assignées
router.get(
  "/showC",
  checkAuthMiddleware,
  checkRole('collector'),
  alertController.showC
);


// 🔹 ADMIN — voir toutes les alertes
router.get(
  "/all",
  checkAuthMiddleware,
  checkRole('admin'),
  alertController.index
);


//🔹 collector — voir toutes les alertes
router.get(
  "/allc",
  checkAuthMiddleware,
  checkRole('collector'),
  alertController.index
);


// 🔹 ADMIN — voir alertes d’un collector spécifique
router.get(
  "/collector/:collectorId",
  checkAuthMiddleware,
  checkRole('admin'),
  alertController.showDC
);


// 🔹 ADMIN — voir alertes d’un user spécifique
router.get(
  "/user/:userId",
  checkAuthMiddleware,
  checkRole('admin'),
  alertController.showDU
);


// 🔹 COLLECTOR — mettre à jour une alerte (traitée)
router.patch(
  "/:alertId",
  checkAuthMiddleware,
  checkRole('collector'),
  imageUploader.upload.single('image'),
  alertController.update
);


// 🔹 ADMIN — supprimer une alerte
router.delete(
  "/:id",
  checkAuthMiddleware,
  checkRole('admin'),
  alertController.destroy
);


// 🔹 ADMIN — assigner un collecteur
router.patch(
  "/assign/:alertId",
  checkAuthMiddleware,
  checkRole('admin'),
  alertController.assignCollector
);


// 🔹 Accessible à tous rôles connectés
router.get(
  "/getAlertById/:id",
  checkAuthMiddleware,
  checkRole('admin', 'collector', 'user'),
  alertController.getAlertById
);


module.exports = router;