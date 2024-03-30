FROM postgres:16.2-alpine

EXPOSE 5432 
RUN ls -la

COPY ./init docker-entrypoint-initdb.d

RUN chmod -R +x ./docker-entrypoint-initdb.d