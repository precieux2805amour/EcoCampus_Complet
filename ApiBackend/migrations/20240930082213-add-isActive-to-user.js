'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Users', 'isActive', {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,  // Par défaut, l'utilisateur est actif
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'isActive');
    }
};
