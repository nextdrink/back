import request from 'supertest';
import { app } from './setup';
import { mockActiveUser, mockAdminUser } from './mocked-data';

export const loginAdmin = async (): Promise<string> => {
  let token: string;
  await request(app.getHttpServer())
    .post('/auth/login')
    .send(mockAdminUser)
    .expect((response: request.Response) => {
      const { accessToken } = response.body;
      token = accessToken;
    });
  return token;
};

export const loginActiveUser = async (): Promise<string> => {
  let token: string;
  await request(app.getHttpServer())
    .post('/auth/login')
    .send(mockActiveUser)
    .expect((response: request.Response) => {
      const { accessToken } = response.body;
      token = accessToken;
    });
  return token;
};
