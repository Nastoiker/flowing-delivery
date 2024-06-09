export default () => ({
  database: {
    username: process.env.DB_EVENT_USER || 'eventService-user',
    password: process.env.DB_EVENT_PASSWORD || '12345',
    database: process.env.DB_EVENT_NAME || 'eventService',
    port: 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: (process.env.DB_TYPE || 'postgres') as 'postgres',
    logging: process.env.DB_LOGGING === 'true',
    logQueryParameters: (process.env.LOG_QUERY_PARAMETERS ?? 'true') === 'true',
  },
});
