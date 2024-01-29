'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataType } = require('sequelize-typescript');

module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('ingredient_cocktails', 'required', {
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      }),
    ];
  },

  async down(queryInterface, Sequelize) {},
};
