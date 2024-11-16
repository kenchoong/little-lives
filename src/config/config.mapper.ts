import { ConfigEnvironmentType } from './@types';
import { size, toNumber } from 'lodash';

export const configuration = (): ConfigEnvironmentType => ({
  /**
   * =============================
   * SERVER SHARED ENVIRONMENT
   * =============================
   */
  // map environment value https://stackoverflow.com/a/59805161/4332049
  environment: process.env['NODE' + '_ENV'] ?? 'production',

  /**
   * =============================
   * SERVER PROJECT ENVIRONMENT
   * =============================
   * NOTE: Add more project according project setup
   */
  appointment: {
    port: parseInt(process.env['PORT'] || '3334', 10),

    // graphql
    graphqlPlayground: process.env['PROJECT_GRAPHQL_PLAYGROUND'] === 'true',
    graphqlSubscription:
      process.env['PROJECT_GRAPHQL_SUBSCRIPTIONS'] === 'true',

    // timed otp / secured token expiration
    timeTokenExpiration: parseInt(
      process.env['PROJECT_OTP_EXPIRATION_TIME'] || '15',
      10,
    ),
    securedTokenExpiration: parseInt(
      process.env['PROJECT_TOKEN_EXPIRATION_TIME'] || '60',
      10,
    ),

    // database connection
    database: {
      type: process.env['PROJECT_DB_CONNECTION'] ?? 'postgres',
      host: process.env['PROJECT_DB_HOST'] ?? 'localhost',
      port: parseInt(process.env['PROJECT_DB_PORT'] || '5432', 10),
      username: process.env['PROJECT_DB_USERNAME'] ?? 'postgres',
      password: process.env['PROJECT_DB_PASSWORD'] ?? 'postgres',
      database: process.env['PROJECT_DB_DATABASE'] ?? 'database',
      logging: process.env['PROJECT_DB_DEBUG'] === 'true',
      ssl: process.env['PROJECT_DB_SSL_CERT'],
    },

    testing: {
      database: {
        type: process.env['PROJECT_DB_CONNECTION_TEST'] ?? 'postgres',
        host: process.env['PROJECT_DB_HOST_TEST'] ?? 'localhost',
        port: parseInt(process.env['PROJECT_DB_PORT_TEST'] || '5432', 10),
        username: process.env['PROJECT_DB_USERNAME_TEST'] ?? 'postgres',
        password: process.env['PROJECT_DB_PASSWORD_TEST'] ?? 'postgres',
        database: process.env['PROJECT_DB_DATABASE_TEST'] ?? 'database',
        logging: process.env['PROJECT_DB_DEBUG_TEST'] === 'true',
        ssl: process.env['PROJECT_DB_SSL_CERT_TEST'],
      },
    },
  },
});
