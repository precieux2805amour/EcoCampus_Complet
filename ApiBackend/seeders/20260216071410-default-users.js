'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        surname: 'Principal',
        tel: '+2290167650560',
        password: '$2a$10$gtQogDSDmu/pop.i/fd8K.UXhm8k9HQFGrNDaZXQskid.1ANoQV.q',
        statut: 'admin',
        isActive: true,
        pushToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Collector',
        surname: 'Test',
        tel: '+2290167650561',
        password: '$2a$10$hM5FeJ0/i.Q.3vHpfa.M4.BeI/OYOQIw5bdG/dqWn39UQTAn.Ko2O',
        statut: 'collector',
        longitude: 2.3566,
        latitude: 6.4897,
        isActive: true,
        pushToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      tel: ['+2290167650560', '+2290167650561']
    });
  }
};