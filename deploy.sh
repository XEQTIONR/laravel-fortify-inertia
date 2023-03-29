#! /bin/bash

tar -xf vendor.tar.gz
rm vendor.tar.gz

php artisan config:cache
php artisan route:cache
php artisan view:cache
