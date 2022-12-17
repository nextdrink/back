import { Model, DataType, Table, Column, ForeignKey } from 'sequelize-typescript';
import { Users } from '../users/users.model';
import { Roles } from './roles.model';

@Table({ tableName: 'user_roles', createdAt: false, updatedAt: false })
export class UserRoles extends Model<UserRoles> {
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ForeignKey(() => Users)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @ForeignKey(() => Roles)
  @Column({ type: DataType.INTEGER })
  roleId: number;
}
