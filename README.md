# Software License Key E-commerce Platform

This workspace contains the initial scaffold for a Laravel-based software license key e-commerce platform.

## What is included

- Laravel-style folder structure for controllers, models, views, and routes
- Core database migration skeletons for users, categories, products, pricing slabs, license keys, orders, and order items
- Public route scaffolding and starter homepage view
- Initial service class for dynamic product pricing

## Next steps

1. Install PHP 8.3+ and Composer on your machine.
2. Run `composer install` from the project root.
3. Copy `.env.example` to `.env` and configure your database credentials.
4. Run `php artisan key:generate`.
5. Run `php artisan migrate`.

## Notes

- This project was scaffolded manually because PHP and Composer were not available in the current environment.
- Once PHP/Composer are installed, you can continue by installing Laravel dependencies and completing the implementation.
