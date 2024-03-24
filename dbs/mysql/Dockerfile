FROM mysql:8.0-oracle

EXPOSE 3306 33060

COPY ./init docker-entrypoint-initdb.d
COPY ./dump.sql .

RUN chmod -R +x ./docker-entrypoint-initdb.d