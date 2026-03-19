module.exports = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.userData) {
      return res.status(401).json({
        message: "Non authentifié"
      });
    }

    if (!allowedRoles.includes(req.userData.statut)) {
      return res.status(403).json({
        message: "Accès interdit : rôle insuffisant"
      });
    }

    next();
  };
};