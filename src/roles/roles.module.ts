import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
// import { RolesController } from './roles.controller';
import { Users } from '../users/users.model';
import { Roles } from './roles.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRoles } from './user-roles.model';

@Module({
  providers: [RolesService],
  controllers: [],
  imports: [SequelizeModule.forFeature([Roles, Users, UserRoles])],
  exports: [RolesService],
})
export class RolesModule {}
