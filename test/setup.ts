import * as bcrypt from 'bcryptjs';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { RolesService } from '../src/roles/roles.service';
import { UsersService } from '../src/users/users.service';
import { mockAdminUser } from './mocked-data';
import { ROLES } from '../src/constants';

export let app;
async function initServer() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  await app.init();
}

global.beforeAll(async () => {
  await initServer();

  const rolesService = app.get(RolesService);
  const usersService = app.get(UsersService);

  const adminUser = await usersService.getUserByEmail(mockAdminUser.email);

  if (!adminUser) {
    // create roles
    rolesService.roleRepository.bulkCreate([
      { value: 'user', description: 'user' },
      { value: 'admin', description: 'admin' },
    ]);

    // create admin user for testing admin endpoints
    const hashPassword = await bcrypt.hash(mockAdminUser.password, 5);
    const user = await usersService.usersRepository.create({ ...mockAdminUser, password: hashPassword });
    const role = await rolesService.getRoleByValue(ROLES.ADMIN);
    await user.$set('roles', [role.id]);
  }
});
