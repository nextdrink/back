import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { app } from './setup';
import { mockAdminUser } from './mocked-data';
import { loginActiveUser, loginAdmin } from './helper';

let adminToken: string;
let userToken: string;
const usersPath = 'users';
const cocktailId = 1;
const ingredientId = 1;

describe('users Controller (e2e)', () => {
  beforeAll(async () => {
    userToken = await loginActiveUser();
    adminToken = await loginAdmin();
  });

  describe('Successfully cases', () => {
    it('Should get all users', async () => {
      return request(app.getHttpServer())
        .get(`/${usersPath}`)
        .set('Authorization', 'Bearer ' + adminToken)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].email).toBe(mockAdminUser.email);
        })
        .expect(HttpStatus.OK);
    });

    it('Should add favorite cocktail', async () => {
      return request(app.getHttpServer())
        .post(`/${usersPath}/addCocktail`)
        .send({ cocktailId })
        .set('Authorization', 'Bearer ' + userToken)
        .expect((response: request.Response) => {
          expect(response.body.cocktailId).toBe(cocktailId);
        })
        .expect(HttpStatus.CREATED);
    });

    it('Should get favorite cocktails', async () => {
      return request(app.getHttpServer())
        .get(`/${usersPath}/getCocktails`)
        .set('Authorization', 'Bearer ' + userToken)
        .expect((response: request.Response) => {
          expect(response.body[0].id).toBe(cocktailId);
        })
        .expect(HttpStatus.OK);
    });

    it('Should add ingredient', async () => {
      return request(app.getHttpServer())
        .post(`/${usersPath}/addIngredient`)
        .send({ ingredientId })
        .set('Authorization', 'Bearer ' + userToken)
        .expect((response: request.Response) => {
          expect(response.body.ingredientId).toBe(ingredientId);
        })
        .expect(HttpStatus.CREATED);
    });

    it('Should get ingredients', async () => {
      return request(app.getHttpServer())
        .get(`/${usersPath}/getIngredients`)
        .set('Authorization', 'Bearer ' + userToken)
        .expect((response: request.Response) => {
          expect(response.body[0].id).toBe(ingredientId);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get my bar', async () => {
      return request(app.getHttpServer())
        .get(`/${usersPath}/myBar`)
        .set('Authorization', 'Bearer ' + userToken)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(cocktailId);
        })
        .expect(HttpStatus.OK);
    });

    describe('Removed cases', () => {
      it('Should remove favorite cocktail', async () => {
        return request(app.getHttpServer())
          .delete(`/${usersPath}/removeCocktails`)
          .send({ cocktailsId: [cocktailId] })
          .set('Authorization', 'Bearer ' + userToken)
          .expect((response: request.Response) => {
            expect(response.body.cocktailsId.length).toBe(1);
          })
          .expect(HttpStatus.OK);
      });

      it('Should remove ingredient', async () => {
        return request(app.getHttpServer())
          .delete(`/${usersPath}/removeIngredients`)
          .send({ ingredientsId: [ingredientId] })
          .set('Authorization', 'Bearer ' + userToken)
          .expect((response: request.Response) => {
            expect(response.body.ingredientsId.length).toBe(1);
          })
          .expect(HttpStatus.OK);
      });
    });
  });

  describe('Failed cases', () => {
    it('Should not get all users for non-admin user', async () => {
      return request(app.getHttpServer())
        .get(`/${usersPath}`)
        .set('Authorization', 'Bearer ' + userToken)
        .expect(HttpStatus.FORBIDDEN);
    });

    it('Should not get all users without token', async () => {
      return request(app.getHttpServer()).get(`/${usersPath}`).expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not add favorite cocktail', async () => {
      return request(app.getHttpServer())
        .post(`/${usersPath}/addCocktail`)
        .send({ cocktailId })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not get favorite cocktails', async () => {
      return request(app.getHttpServer()).get(`/${usersPath}/getCocktails`).expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not add ingredient', async () => {
      return request(app.getHttpServer())
        .post(`/${usersPath}/addIngredient`)
        .send({ ingredientId })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not get ingredients', async () => {
      return request(app.getHttpServer()).get(`/${usersPath}/getIngredients`).expect(HttpStatus.UNAUTHORIZED);
    });

    it('Should not get my bar', async () => {
      return request(app.getHttpServer()).get(`/${usersPath}/myBar`).expect(HttpStatus.UNAUTHORIZED);
    });

    describe('Removed cases', () => {
      it('Should not remove favorite cocktail', async () => {
        return request(app.getHttpServer())
          .delete(`/${usersPath}/removeCocktails`)
          .send({ cocktailsId: [cocktailId] })
          .expect(HttpStatus.UNAUTHORIZED);
      });

      it('Should not remove ingredient', async () => {
        return request(app.getHttpServer())
          .delete(`/${usersPath}/removeIngredients`)
          .send({ ingredientsId: [ingredientId] })
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
