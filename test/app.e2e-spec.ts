/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('Authentication', () => {
    let jwtToken: string;

    describe('AuthModule', () => {
      it('authenticates user with valid transaction and provides a jwt token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth')
          .send({
            transaction:
              'AAAAAgAAAACgGsgRTcnGCG4fxZ0FqA74qH1M5V23COm4kwttDsWcawAAAMgAAAAAAAAAAAAAAAEAAAAAYVOLaQAAAABhU4yVAAAAAAAAAAIAAAABAAAAAFfiYSlBtYn0t91Nb4LJZ6J04NgfI82pebF6oEL/Zx+kAAAACgAAAB1odHRwczovL3N0ZWxsYXIuYmVpZ24uZXMgYXV0aAAAAAAAAAEAAABAamo4d0ZwYU90ZVErMGhUNm1XYURqQ2NCcGhXYk5PQjh4aXZ0bjlFUUZJR2REcDhQZVZYWktoZDZkOWozUVZEQQAAAAEAAAAAoBrIEU3JxghuH8WdBagO+Kh9TOVdtwjpuJMLbQ7FnGsAAAAKAAAAD3dlYl9hdXRoX2RvbWFpbgAAAAABAAAAHWh0dHBzOi8vc3RlbGxhci5iZWlnbi5lcy9hdXRoAAAAAAAAAAAAAAEOxZxrAAAAQPaeElhJldFothPDubAktxUBiyfGcbeONXOXq7x3BAYff8s+JaFksc2ajdKTsp9I7gvHAuhJllXM9zLPBhKaIwI=',
          })
          .expect(201);

        jwtToken = response.body.token;

        expect(jwtToken).toMatch(
          /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/,
        );
      });
    });

    describe('Protected', () => {
      it('gets protected resource with jwt authenticated request', async () => {
        const response = await request(app.getHttpServer())
          .get('/profile')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        const data = response.body;
        expect(data).toMatchObject({
          token: expect.objectContaining({
            iss: 'https://stellar.beign.es/auth',
            sub: 'GBL6EYJJIG2YT5FX3VGW7AWJM6RHJYGYD4R43KLZWF5KAQX7M4P2ITVI',
            exp: expect.any(Number),
            iat: expect.any(Number),
          }),
        });
      });
    });
  });
});
