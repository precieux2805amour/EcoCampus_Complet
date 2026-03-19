const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const checkAuthMiddleware = require('../middleware/check-auth');
const checkRole = require('../middleware/checkRole');

router.get("/dashboard",
    checkAuthMiddleware,
    checkRole('admin'),
    adminController.getDashboard);

module.exports = router;