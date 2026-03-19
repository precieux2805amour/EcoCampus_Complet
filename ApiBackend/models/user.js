'use strict';
const bcrypt = require('bcryptjs');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Alert, { foreignKey: 'userId', as: 'alerts' });
    }

    async matchPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

  User.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    tel: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pushToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
   isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,  // Le compte est actif par défaut
            allowNull: false,
        },
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    statut: {
      type: DataTypes.ENUM('user', 'collector', 'admin'),
      defaultValue: 'user'
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate(async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  });

  return User;
};
