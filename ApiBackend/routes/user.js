const express = require('express');
const userController = require('../controllers/user.controller');
const checkAuth = require('../middleware/check-auth');
const checkRole = require('../middleware/checkRole');

const router = express.Router();


// ========================
// 🔓 ROUTES PUBLIQUES
// ========================

// Connexion (tous rôles)
router.post("/login", userController.login);

// Inscription (mobile user uniquement)
router.post("/sign-up", userController.signUp);



// ========================
// 🔐 ROUTES CONNECTÉES (Tous rôles)
// ========================

router.get(
  "/getprofil",
  checkAuth,
  checkRole('user', 'collector', 'admin'),
  userController.getProfil
);

router.patch(
  "/updateprofil",
  checkAuth,
  checkRole('user', 'collector', 'admin'),
  userController.updateProfil
);

router.put(
  "/change-password",
  checkAuth,
  checkRole('user', 'collector', 'admin'),
  userController.changePassword
);



// ========================
// 📍 COLLECTOR
// ========================

router.put(
  "/update-location/:userId",
  checkAuth,
  checkRole('collector'),
  userController.updateLocation
);



// ========================
// 🖥 ADMIN (EcoBack)
// ========================

// Liste utilisateurs
router.get(
  "/list",
  checkAuth,
  checkRole('admin'),
  userController.userList
);

// Activer utilisateur
router.patch(
  "/active/:id",
  checkAuth,
  checkRole('admin'),
  userController.activateUser
);

// Désactiver / soft delete
router.patch(
  "/:id",
  checkAuth,
  checkRole('admin'),
  userController.destroy
);

// Voir liste des collecteurs
router.get(
  "/collectors",
  checkAuth,
  checkRole('admin'),
  userController.getCollectors
);

router.put(
  "/save-push-token/:userId",
  checkAuth,
  checkRole('user', 'collector', 'admin'),
  userController.savePushToken
);

module.exports = router;