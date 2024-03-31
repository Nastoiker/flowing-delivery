FROM postgres:13.8

EXPOSE 5432 
RUN ls -la

COPY ./init docker-entrypoint-initdb.d

RUN chmod -R +x ./docker-entrypoint-initdb.d