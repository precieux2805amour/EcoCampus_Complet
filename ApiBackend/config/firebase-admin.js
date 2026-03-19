const admin = require('firebase-admin');
const serviceAccount = require('./ecocampus-7ae0e-firebase-adminsdk-4z8u4-090aeb0684.json');  // Remplace par le chemin correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'ecocampus-7ae0e' 
});

module.exports = admin;
