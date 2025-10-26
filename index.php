<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;

// Load environment variables if a .env file exists; otherwise rely on the host environment
$envPath = __DIR__ . '/.env';
if (file_exists($envPath) && is_readable($envPath)) {
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();
} else {
    // No .env on filesystem (e.g. Railway, Vercel, other hosts). Rely on environment variables.
    // Log a message in error log to help debugging deployments.
    if (php_sapi_name() !== 'cli') {
        error_log("[info] No .env file found at $envPath; relying on environment variables.");
    }
}

// Initialize Twig
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/templates');

// Get Twig configuration from environment with proper fallbacks
$twigCache = getenv('TWIG_CACHE') ?: ($_ENV['TWIG_CACHE'] ?? 'false');
$twigDebug = getenv('TWIG_DEBUG') ?: ($_ENV['TWIG_DEBUG'] ?? 'false');

$twig = new \Twig\Environment($loader, [
    'cache' => ($twigCache === 'true') ? __DIR__ . '/cache' : false,
    'debug' => ($twigDebug === 'true'),
]);

// Add debug extension if enabled
if ($twigDebug === 'true') {
    $twig->addExtension(new \Twig\Extension\DebugExtension());
}

// Determine API base URL from environment so server can inject a runtime value
// (use VITE_API_BASE_URL if set by host, otherwise fallback to API_BASE_URL or localhost)
$apiBase = getenv('VITE_API_BASE_URL') ?: getenv('API_BASE_URL') ?: ($_ENV['VITE_API_BASE_URL'] ?? ($_ENV['API_BASE_URL'] ?? 'http://localhost:4000'));
$twig->addGlobal('API_BASE_URL', trim($apiBase, "\"' "));

// Simple router
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

// Serve static files (CSS, JS, images)
if (preg_match('/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/', $path)) {
    return false;
}

// Remove trailing slash
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}

// Route handling
try {
    switch ($path) {
        case '/':
            echo $twig->render('pages/landing.twig');
            break;
        
        case '/login':
            echo $twig->render('pages/login.twig', ['showFooter' => false]);
            break;
        
        case '/signup':
            echo $twig->render('pages/signup.twig', ['showFooter' => false]);
            break;
        
        case '/dashboard':
            echo $twig->render('pages/dashboard.twig');
            break;
        
        case '/tickets':
            echo $twig->render('pages/tickets.twig');
            break;
        
        default:
            http_response_code(404);
            echo $twig->render('pages/not_found.twig');
            break;
    }
} catch (\Twig\Error\LoaderError $e) {
    http_response_code(500);
    echo "Template not found: " . $e->getMessage();
} catch (Exception $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}
