'use strict';
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
        alertId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Alerts',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // Assurez-vous que ce modèle existe
                key: 'id'
            }
        },
        collectorId: {
            type: DataTypes.INTEGER,
            allowNull: false
            // Pas de référence étrangère car collectorId est un user avec le statut "collector"
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {});

    Notification.associate = function(models) {
        Notification.belongsTo(models.Alert, { foreignKey: 'alertId' });
        Notification.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Notification;
};
