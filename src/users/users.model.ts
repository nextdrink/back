import { Model, DataType, Table, Column, BelongsToMany } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { UserCocktails } from '../cocktails/user-cocktails.model';
import { Cocktails } from '../cocktails/cocktails.model';
import { UserIngredients } from '../ingredients/user-ingredients.model';
import { Ingredients } from '../ingredients/ingredients.model';
import { Roles } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';

interface UserCreationAttr {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class Users extends Model<Users, UserCreationAttr> {
  @ApiProperty({ example: 1 })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'mykola@ukr.net' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'dskE3!{0kEz' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @BelongsToMany(() => Cocktails, () => UserCocktails)
  cocktails: Cocktails[];

  @BelongsToMany(() => Ingredients, () => UserIngredients)
  ingredients: Ingredients[];

  @BelongsToMany(() => Roles, () => UserRoles)
  roles: Roles[];
}
