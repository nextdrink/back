import { Model, DataType, Table, Column, ForeignKey } from 'sequelize-typescript';
import { Ingredients } from './ingredients.model';
import { Users } from '../users/users.model';

@Table({
  tableName: 'user_ingredients',
  createdAt: false,
  updatedAt: false,
})
export class UserIngredients extends Model<UserIngredients> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Ingredients)
  @Column({ type: DataType.INTEGER })
  ingredientId: number;

  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
