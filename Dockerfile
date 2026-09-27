# Use official PHP image with Apache
FROM php:8.2-apache

# Enable Apache mod_rewrite for custom routing
RUN a2enmod rewrite

# Install MySQL extension for PHP
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Copy your application files into the web root
COPY . /var/www/html/

# Expose port 80
EXPOSE 80