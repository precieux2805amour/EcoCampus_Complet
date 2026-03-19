const express = require('express')
const bodyParser = require('body-parser')
const usersRoute = require('./routes/user')
const alertsRoute = require('./routes/alert')
const imagesRoute = require('./routes/image');
const path = require('path');
const notifRoute = require('./routes/notification');
const adminRoute = require("./routes/admin");
const app = express()
const cors = require("cors");

app.use(bodyParser.json())

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/images",imagesRoute)
app.use("/users",usersRoute)
app.use("/alerts",alertsRoute)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/notif",notifRoute)
app.use("/admin", adminRoute);
//app.use('/uploads', express.static('uploads')); // Servir les fichiers statiques du répertoire uploads


module.exports = app