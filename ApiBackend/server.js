const http = require('http');

const app = require('./app');

const port = 3000;

const host ='0.0.0.0'
const server = http.createServer(app)

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('EcoCampus', 'root','', {
  host: '127.0.0.1',
  dialect: 'mysql', // ou 'postgres', 'sqlite', etc.
});

sequelize.sync({ alter: true })  // alter: true permet de modifier les tables existantes pour correspondre aux modèles
  .then(() => {
    console.log('Base de données synchronisée avec succès !');
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation de la base de données :', err);
  });
server.listen(port,host)

// Démarrage serveur + message visible
server.listen(port, host, () => {
  console.log(`🚀 Server running on http://${host}:${port}`);
});

const cors = require("cors");
app.use(cors());