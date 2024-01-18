import request from 'supertest';
import { app } from './setup';
import { mockAdminUser } from './mocked-data';

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
