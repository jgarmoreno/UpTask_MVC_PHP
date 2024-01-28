<?php 

require_once __DIR__ . '/../includes/app.php';

use MVC\Router;
use Controllers\LoginController;
use Controllers\DashboardController;
use Controllers\TareaController;

$router = new Router();

// Login
$router -> get('/', [LoginController::class,'login']);
$router -> post('/', [LoginController::class,'login']);
$router -> get('/logout', [LoginController::class,'logout']);

// Crear cuenta
$router -> get('/crear-cuenta', [LoginController::class,'crear']);
$router -> post('/crear-cuenta', [LoginController::class,'crear']);

// Olvidé password
$router -> get('/olvide-cuenta', [LoginController::class,'olvide']);
$router -> post('/olvide-cuenta', [LoginController::class,'olvide']);

// Resetear password
$router -> get('/reestablecer-cuenta', [LoginController::class,'reestablecer']);
$router -> post('/reestablecer-cuenta', [LoginController::class,'reestablecer']);

// Confirmar cuenta
$router -> get('/confirmar-cuenta', [LoginController::class,'mensaje']);
$router -> get('/cuenta-confirmada', [LoginController::class,'confirmar']);

// Zona de proyectos
$router -> get('/dashboard', [DashboardController::class, 'index']);
$router -> get('/crear-proyecto', [DashboardController::class, 'crear_proyecto']);
$router -> post('/crear-proyecto', [DashboardController::class, 'crear_proyecto']);
$router -> get('/proyecto', [DashboardController::class, 'proyecto']);
$router -> get('/perfil', [DashboardController::class, 'perfil']);
$router -> post('/perfil', [DashboardController::class, 'perfil']);
$router -> get('/cambiar-password', [DashboardController::class, 'cambiar_password']);
$router -> post('/cambiar-password', [DashboardController::class, 'cambiar_password']);

// API para las tareas
$router -> get('/api/tareas', [TareaController::class, 'index']);
$router -> post('/api/tarea', [TareaController::class, 'crear']);
$router -> post('/api/tarea/actualizar', [TareaController::class, 'actualizar']);
$router -> post('/api/tarea/eliminar', [TareaController::class, 'eliminar']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();