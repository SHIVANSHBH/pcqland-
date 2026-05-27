FROM php:8.3-fpm-alpine

RUN apk add --no-cache nginx supervisor curl postgresql-dev oniguruma-dev \
    && docker-php-ext-install pdo_pgsql pgsql mbstring fileinfo

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . /app
WORKDIR /app

RUN COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-req=php+ \
    && chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

COPY docker/nginx.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf

RUN echo "APP_KEY=\${APP_KEY:-base64:3xVTWk+6pXUls39755TdBIkKbYtm7acaaNK4xiJ/4Y0=}" > /app/.env

EXPOSE 8080

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
