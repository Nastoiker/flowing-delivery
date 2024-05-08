export default () => ({
  port: parseInt(process.env.PORT),
  database: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_TYPE as 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    logQueryParameters: (process.env.LOG_QUERY_PARAMETERS ?? 'true') === 'true',
  },
});
