import { Model, DataType, Table, Column, ForeignKey } from 'sequelize-typescript';
import { Cocktails } from './cocktails.model';
import { Ingredients } from '../ingredients/ingredients.model';

@Table({
  tableName: 'ingredient_cocktails',
  createdAt: false,
  updatedAt: false,
})
export class IngredientCocktails extends Model<IngredientCocktails> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Cocktails)
  @Column({ type: DataType.INTEGER, allowNull: false })
  cocktailId: number;

  @ForeignKey(() => Ingredients)
  @Column({ type: DataType.INTEGER, allowNull: false })
  ingredientId: number;

  @Column({ type: DataType.INTEGER })
  amount: number;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  required: boolean;
}
