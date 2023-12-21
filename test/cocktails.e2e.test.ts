import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { app } from './setup';
import { CocktailsService } from '../src/cocktails/cocktails.service';
import { mockAdminUser, mockCocktail } from './mocked-data';

let token: string;
const cocktailsPath = 'cocktails';

describe('Cocktails Controller (e2e)', () => {
  beforeAll(async () => {
    const cocktailsService = app.get(CocktailsService);
    await cocktailsService.cocktailsRepository.bulkCreate([
      mockCocktail,
      { ...mockCocktail, name: { en: 'test2', uk: 'тест2' } },
    ]);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send(mockAdminUser)
      .expect((response: request.Response) => {
        const { accessToken } = response.body;
        console.log(response.body, 'response.body');
        token = accessToken;
      });
  });
  // afterAll(async () => {});

  describe('Successfully cases', () => {
    it('Should get all cocktails with default lang(en)', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].name).toBe(mockCocktail.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get all cocktails with uk lang', async () => {
      return request(app.getHttpServer())
        .get(`/uk/${cocktailsPath}`)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
          expect(response.body[0].name).toBe(mockCocktail.name.uk);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get cocktail by id with default lang', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/1`)
        .expect((response: request.Response) => {
          expect(response.body.name).toBe(mockCocktail.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get all admin cocktails', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/admin/all`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.length).toBe(2);
        })
        .expect(HttpStatus.OK);
    });

    it('Should get admin cocktail by id', async () => {
      return request(app.getHttpServer())
        .get(`/${cocktailsPath}/admin/1`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.name.en).toBe(mockCocktail.name.en);
        })
        .expect(HttpStatus.OK);
    });

    it('Should create cocktail', async () => {
      return request(app.getHttpServer())
        .post(`/${cocktailsPath}/admin`)
        .send({ ...mockCocktail, name: { en: 'test3', uk: 'тест3' } })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.name.en).toBe('test3');
        })
        .expect(HttpStatus.CREATED);
    });

    it('Should create cocktail', async () => {
      return request(app.getHttpServer())
        .put(`/${cocktailsPath}/admin/3`)
        .send({ ...mockCocktail, name: { en: 'test33', uk: 'тест33' } })
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          expect(response.body.name.en).toBe('test33');
        })
        .expect(HttpStatus.OK);
    });

    it('Should delete cocktail', async () => {
      return request(app.getHttpServer())
        .delete(`/${cocktailsPath}/admin/id/3`)
        .set('Authorization', 'Bearer ' + token)
        .expect((response: request.Response) => {
          console.log(response.body, 'response.body');
        })
        .expect(HttpStatus.OK);
    });
  });

  // describe('Failed cases', () => {
  // TODO to be continue....
  // });
});
