import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { app } from './setup';
import { statusEnum } from '../src/users/enums/status.enum';
import { TokenService } from '../src/token/token.service';
import { UsersService } from '../src/users/users.service';
import { RolesService } from '../src/roles/roles.service';
import { mockUser, changedPassword, mockAdminUser } from './mocked-data';
import { ROLES } from '../src/constants';
import * as bcrypt from 'bcryptjs';

let token: string;
const authPath = 'auth';

describe('AuthController (e2e)', () => {
  beforeAll(async () => {
    const rolesService = app.get(RolesService);
    const usersService = app.get(UsersService);
    rolesService.roleRepository.bulkCreate([
      { value: 'user', description: 'user' },
      { value: 'admin', description: 'admin' },
    ]);

    // create admin user for testing admin endpoints
    const hashPassword = await bcrypt.hash(mockAdminUser.password, 5);
    const user = await usersService.usersRepository.create({ ...mockAdminUser, password: hashPassword });
    const role = await rolesService.getRoleByValue(ROLES.ADMIN);
    await user.$set('roles', [role.id]);
  });

  describe('Successfully cases', () => {
    it('Should register new user', async () => {
      return request(app.getHttpServer())
        .post(`/${authPath}/registration`)
        .send(mockUser)
        .expect((response: request.Response) => {
          const { text } = response;
          token = text;
          expect(typeof token).toBe('string');
          expect(token.length).toBeGreaterThan(10);
        })
        .expect(HttpStatus.CREATED);
    });

    it('Should confirm new user', () => {
      return request(app.getHttpServer()).get(`/${authPath}/confirm?token=${token}`).expect(HttpStatus.OK);
    });

    it('Should login new user', () => {
      return request(app.getHttpServer())
        .post(`/${authPath}/login`)
        .send(mockUser)
        .expect((response: request.Response) => {
          const { accessToken, status, roles, usersIngredientsIds, usersCocktailsIds } = response.body;
          expect(typeof accessToken).toBe('string');
          expect(accessToken.length).toBeGreaterThan(10);

          expect(status).toBe(statusEnum.active);

          expect(Array.isArray(roles)).toBe(true);
          expect(Array.isArray(usersIngredientsIds)).toBe(true);
          expect(Array.isArray(usersCocktailsIds)).toBe(true);
        })
        .expect(HttpStatus.CREATED);
    });

    it('Should create request for forgot password', () => {
      return request(app.getHttpServer())
        .post(`/${authPath}/forgotPassword`)
        .send({ email: mockUser.email })
        .expect(HttpStatus.CREATED);
    });

    it('Should create request for change password', async () => {
      const tokenService = app.get(TokenService);
      const { token } = await tokenService.tokenRepository.findOne({
        order: [['id', 'DESC']],
      });
      return request(app.getHttpServer())
        .patch(`/${authPath}/changePassword`)
        .send({ token, password: changedPassword })
        .expect(HttpStatus.OK);
    });
  });

  describe('Failed cases', () => {
    it('Should not register existing user', async () => {
      return request(app.getHttpServer())
        .post(`/${authPath}/registration`)
        .send(mockUser)
        .expect((response: request.Response) => {
          const { statusCode, message } = response.body;
          expect(message).toBe(`User with email ${mockUser.email} already exists`);
          expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should not login existing user with wrong password', async () => {
      return request(app.getHttpServer())
        .post(`/${authPath}/login`)
        .send({ ...mockUser, password: '123wrongPassword' })
        .expect((response: request.Response) => {
          const { message } = response.body;
          expect(message).toBe('wrong user data');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not login non-existing user', async () => {
      return request(app.getHttpServer())
        .post(`/${authPath}/login`)
        .send({ ...mockUser, email: 'wrong@email.com' })
        .expect((response: request.Response) => {
          const { message } = response.body;
          expect(message).toBe('wrong user data');
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not login new user with status "pending"', async () => {
      const userService = app.get(UsersService);
      await userService.usersRepository.update({ status: statusEnum.pending }, { where: { email: mockUser.email } });
      return request(app.getHttpServer())
        .post(`/${authPath}/login`)
        .send({ ...mockUser, password: changedPassword })
        .expect((response: request.Response) => {
          const { statusCode, message } = response.body;
          expect(message).toBe('Forbidden resource');
          expect(statusCode).toBe(HttpStatus.FORBIDDEN);
        })
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should not confirm non-existing token', async () => {
      return request(app.getHttpServer())
        .get(`/${authPath}/confirm?token=${token + '123'}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not reset password for non-existing user', async () => {
      return request(app.getHttpServer())
        .post(`/${authPath}/forgotPassword`)
        .send({ email: 'wrong@email.com' })
        .expect((response: request.Response) => {
          const { statusCode, message } = response.body;
          expect(message).toBe('User with email wrong@email.com not found');
          expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Should not change password with wrong token', async () => {
      return request(app.getHttpServer())
        .patch(`/${authPath}/changePassword`)
        .send({ token: 'wrong token', password: mockUser.password })
        .expect((response: request.Response) => {
          const { statusCode, message } = response.body;
          expect(message).toBe('Unauthorized');
          expect(statusCode).toBe(HttpStatus.UNAUTHORIZED);
        })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
