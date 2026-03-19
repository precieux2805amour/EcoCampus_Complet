'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Alerts', 'collectorId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Modifier la contrainte allowNull à true pour collectorId
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Alerts', 'collectorId', {
      type: Sequelize.INTEGER,
      allowNull: false, // Revenir à la contrainte allowNull à false pour collectorId
      references: {
        model: 'Users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
};
