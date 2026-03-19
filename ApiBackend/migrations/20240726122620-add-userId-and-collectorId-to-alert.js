'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Alerts', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Nom de la table Users
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Alerts', 'collectorId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Users', // Nom de la table Users
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Alerts', 'userId');
    await queryInterface.removeColumn('Alerts', 'collectorId');
  }
};
