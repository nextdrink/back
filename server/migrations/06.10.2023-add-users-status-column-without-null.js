'use strict';

const { DataType } = require('sequelize-typescript');
const statusEnum = {
  pending: 'pending',
  active: 'active',
  blocked: 'blocked',
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('users', 'status', {
        type: DataType.ENUM(...Object.values(statusEnum)),
        allowNull: false,
        defaultValue: statusEnum.pending,
      }),
    ];
  },

  async down(queryInterface, Sequelize) {},
};
