#Stage 1 - creating project build
FROM node:20.11.1 as builder

#install all dependencies
ARG WORK_DIR='/app'
USER 0
WORKDIR $WORK_DIR

COPY --chown=1001:0 package*.json /app/

# Install Angular CLI globally
RUN npm install -g npm@10.9.0
RUN npm install -g @angular/cli

RUN npm i --force

#copy all the files and create a build
COPY --chown=1001:0 . .
RUN ng build
USER 1001

#Stage 2 - watching project build by nginx
FROM registry.access.redhat.com/ubi8/nginx-120
USER 0
RUN dnf update -y && dnf upgrade -y
USER 1001

#replace nginx config with project config
ARG WORK_DIR='/app'
COPY --chown=1001:0 nginx/nginx.conf "${NGINX_CONF_PATH}"

#taking project build from first stage
COPY --from=builder --chown=1001:0 $WORK_DIR/dist/browser .
RUN chmod -R 775 .

FROM postgres
WORKDIR /docker-entrypoint-initdb.d
ADD init.sql /docker-entrypoint-initdb.d
EXPOSE 5432

#execute nginx
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]