'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn(
        'ingredient_cocktails',
        'amount',
        Sequelize.INTEGER,
      ),
    ];
  },

  async down(queryInterface, Sequelize) {},
};
