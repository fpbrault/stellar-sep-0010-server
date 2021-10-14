import * as StellarSdk from 'stellar-sdk';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  source: {
    keypair: StellarSdk.Keypair.fromSecret(process.env.SERVER_PRIVATE_KEY),
    secretKey: process.env.SERVER_PRIVATE_KEY,
  },
  homeDomain: process.env.HOME_DOMAIN,
  networkPassphrase: 'Test SDF Network ; September 2015',
  jwtSecret: process.env.JWT_SECRET,
  horizonServer: 'https://horizon-testnet.stellar.org',
});
