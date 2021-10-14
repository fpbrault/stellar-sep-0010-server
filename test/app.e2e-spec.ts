/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as StellarSdk from 'stellar-sdk';
import { AppModule } from './../src/app.module';

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
    const keypair = StellarSdk.Keypair.random();

    describe('AuthModule', () => {
      it('generates a valid SEP-0010 challenge transaction', async () => {
        const response = await request(app.getHttpServer())
          .get(
            '/auth?account=' +
              keypair.publicKey() +
              '&home_domain=stellar.beign.es&client_domain=stellar.beign.es',
          )
          .expect(200);

        const data = response.body;
        expect(data).toMatchObject({
          network_passphrase: expect.any(String),
          transaction: expect.any(String),
        });
      });
      it('authenticates user with valid transaction and provides a jwt token', async () => {
        const transaction = StellarSdk.Utils.buildChallengeTx(
          keypair,
          keypair.publicKey(),
          'stellar.beign.es',
          300,
          StellarSdk.Networks.TESTNET,
          'stellar.beign.es/auth',
        );

        const response = await request(app.getHttpServer())
          .post('/auth')
          .send({
            transaction: transaction,
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
            sub: keypair.publicKey(),
            exp: expect.any(Number),
            iat: expect.any(Number),
          }),
        });
      });
    });
  });
});
