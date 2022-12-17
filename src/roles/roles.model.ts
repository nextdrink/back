import { Model, DataType, Table, Column, BelongsToMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Users } from '../users/users.model';
import { UserRoles } from './user-roles.model';

interface RoleCreationAttr {
  value: string;
  description: string;
}

@Table({ tableName: 'roles' })
export class Roles extends Model<Roles, RoleCreationAttr> {
  @ApiProperty({ example: 1 })
  @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
  id: number;

  @ApiProperty({ example: 'admin' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @ApiProperty({ example: 'admin is a super role' })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @BelongsToMany(() => Users, () => UserRoles)
  users: Users[];
}
