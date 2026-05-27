@echo off
REM =========================================
REM PCQLand Deployment Script (Windows/Linux)
REM =========================================
echo.
echo === PCQLand Deployment ===
echo.

REM 1. Check PHP
php -v > NUL 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PHP not found in PATH.
    exit /b 1
)

REM 2. Install dependencies
echo [1/7] Installing Composer dependencies...
call composer install --no-dev --optimize-autoloader --no-interaction
if %errorlevel% neq 0 (
    echo ERROR: Composer install failed.
    exit /b 1
)

REM 3. Copy production .env
echo [2/7] Setting up production .env...
if not exist .env (
    copy .env.production .env
    echo WARNING: Edit .env with your production values and run again.
    echo Run: php artisan key:generate
    exit /b 0
)

REM 4. Run migrations
echo [3/7] Running database migrations...
php artisan migrate --force
if %errorlevel% neq 0 (
    echo ERROR: Migration failed.
    exit /b 1
)

REM 5. Cache config, routes, views
echo [4/7] Caching config...
php artisan config:cache
if %errorlevel% neq 0 echo WARNING: config:cache failed

echo [5/7] Caching routes...
php artisan route:cache
if %errorlevel% neq 0 echo WARNING: route:cache failed

echo [6/7] Caching views...
php artisan view:cache
if %errorlevel% neq 0 echo WARNING: view:cache failed

REM 6. Set permissions (Linux only)
echo [7/7] Setting storage permissions...
if not "%OS%"=="Windows_NT" (
    chmod -R 775 storage bootstrap/cache
    chown -R www-data:www-data storage bootstrap/cache
)

echo.
echo === Deployment complete! ===
echo.
echo Remember to:
echo   - Update .env with live RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
echo   - Configure MAIL_* settings for email delivery
echo   - Set up cron: * * * * * php artisan schedule:run
echo   - Set APP_ENV=production and APP_DEBUG=false in .env
echo.
pause
