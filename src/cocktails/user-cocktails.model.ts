import {
  Model,
  DataType,
  Table,
  Column,
  ForeignKey,
} from 'sequelize-typescript';
import { Cocktails } from './cocktails.model';
import { Users } from '../users/users.model';

@Table({ tableName: 'user_cocktails', createdAt: false, updatedAt: false })
export class UserCocktails extends Model<UserCocktails> {
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

  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
