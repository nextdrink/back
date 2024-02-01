'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { DataType } = require('sequelize-typescript');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ingredientCocktailsUnitEnum = {
  g: 'g',
  ml: 'ml',
};

module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('ingredient_cocktails', 'unit', {
        type: DataType.ENUM(...Object.values(ingredientCocktailsUnitEnum)),
        allowNull: false,
        defaultValue: ingredientCocktailsUnitEnum.ml,
      }),
    ];
  },

  async down(queryInterface, Sequelize) {},
};
