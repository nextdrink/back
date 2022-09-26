import {
  Model,
  DataType,
  Table,
  Column,
  ForeignKey,
  BelongsToAssociation, BelongsToMany
} from 'sequelize-typescript';
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
  @Column({ type: DataType.INTEGER })
  cocktailId: number;

  @ForeignKey(() => Ingredients)
  @Column({ type: DataType.INTEGER })
  ingredientId: number;

  @Column({ type: DataType.INTEGER })
  amount: number;
}
