'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Supprimer les contraintes de clé étrangère existantes
    await queryInterface.removeConstraint('Alerts', 'Alerts_collectorId_foreign_idx');
    await queryInterface.removeConstraint('Alerts', 'Alerts_ibfk_1');
    await queryInterface.removeConstraint('Alerts', 'Alerts_ibfk_2');
  },

  down: async (queryInterface, Sequelize) => {
    // Ajouter les contraintes de clé étrangère à nouveau si nécessaire
    await queryInterface.addConstraint('Alerts', {
      fields: ['collectorId'],
      type: 'foreign key',
      name: 'Alerts_collectorId_foreign_idx',
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('Alerts', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'Alerts_ibfk_1',
      references: {
        table: 'Users',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Ajustez les noms et champs si nécessaire
  }
};
