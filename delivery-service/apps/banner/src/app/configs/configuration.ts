export default () => ({
  database: {
    username: process.env.DB_BANNER_USER || 'bannerService-user',
    password: process.env.DB_BANNER_PASSWORD || '12345',
    database: process.env.DB_BANNER_NAME || 'bannerService',
    port: 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_TYPE || 'postgres') as 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    logQueryParameters: (process.env.LOG_QUERY_PARAMETERS ?? 'true') === 'true',
  },
});
