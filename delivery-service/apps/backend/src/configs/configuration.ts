export default () => ({
    port: parseInt(process.env.PORT || '3004'),
    database: {
      username: process.env.FILE_SERVICE_DB_USER || 'CopyStar-user',
      password: process.env.FILE_SERVICE_DB_PASSWORD || 12345,
      database: process.env.FILE_SERVICE_DB_NAME || 'CopyStar',
      port: 5432,
      host: process.env.FILE_SERVICE_DB_HOST || 'localhost',
      dialect: (process.env.FILE_SERVICE_DB_TYPE || 'postgres') as 'postgres',
      logging: process.env.FILE_SERVICE_DB_LOGGING === 'true',
      logQueryParameters:
        (process.env.FILE_SERVICE_DB_LOG_QUERY_PARAMETERS ?? 'true') === 'true',
    },
  });