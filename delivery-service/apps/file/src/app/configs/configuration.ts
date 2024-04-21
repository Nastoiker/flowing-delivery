export default () => ({
  port: parseInt(process.env.PORT || '3004'),
  database: {
    username: process.env.DB_USER || 'Delivery-user',
    password: process.env.DB_PASSWORD || '12345',
    database: process.env.DB_NAME || 'Delivery-users',
    port: 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_TYPE || 'postgres') as 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    logQueryParameters: (process.env.LOG_QUERY_PARAMETERS ?? 'true') === 'true',
  },
});
