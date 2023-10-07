import { Model, DataType, Table, Column, ForeignKey } from 'sequelize-typescript';
import { Users } from '../users/users.model';

@Table({ tableName: 'token', createdAt: false, updatedAt: false })
export class Token extends Model<Token> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  token: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expireAt: string;

  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId: number;
}
