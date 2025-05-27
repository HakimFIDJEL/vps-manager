export const DOCKER_TEMPLATES = {
  webApp: `version: '3'

services:
  apache:
    image: php:8.2-apache
    volumes:
      - ./src:/var/www/html
    labels:
      - traefik.enable=true
      - traefik.http.routers.apache.rule=Host("app.localhost")

  node:
    image: node:latest
    working_dir: /app
    volumes:
      - ./app:/app
    command: npm run dev

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: app
    volumes:
      - mysql_data:/var/lib/mysql

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      PMA_HOST: mysql
    labels:
      - traefik.enable=true
      - traefik.http.routers.pma.rule=Host("pma.localhost")

  traefik:
    image: traefik:v2.10
    command:
      - --api.insecure=true
      - --providers.docker=true
    ports:
      - 80:80
      - 8080:8080
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  mysql_data:
    driver: local

networks:
  default:
    name: web
    driver: bridge`,

  dataScience: `version: '3'

services:
  jupyter:
    image: jupyter/datascience-notebook
    ports:
      - 8888:8888
    volumes:
      - jupyter_data:/home/jovyan/work
    environment:
      JUPYTER_ENABLE_LAB: 'yes'

  postgres:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: data
    volumes:
      - postgres_data:/var/lib/postgresql/data

  metabase:
    image: metabase/metabase
    ports:
      - 3000:3000
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: data
      MB_DB_PORT: 5432
      MB_DB_USER: postgres
      MB_DB_PASS: postgres
      MB_DB_HOST: postgres

volumes:
  jupyter_data:
    driver: local
  postgres_data:
    driver: local

networks:
  analytics:
    driver: bridge`,

  minimal: `version: '3'

services:
  app:
    image: nginx:alpine
    volumes:
      - app_data:/usr/share/nginx/html
    ports:
      - 8080:80
    networks:
      - web

volumes:
  app_data:
    driver: local

networks:
  web:
    driver: bridge`
};
