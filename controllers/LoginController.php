<?php 

namespace Controllers;

use MVC\Router;
use Classes\Email;
use Model\Usuario;


class LoginController {
    public static function login(Router $router) {
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = new Usuario($_POST);
            
            $alertas = $usuario->validarLogin();

            if(empty($alertas)) {
                // Verificar que el usuario exista
                $usuario = Usuario::where('email', $usuario -> email);

                if(!$usuario || !$usuario->confirmado) {
                    Usuario::setAlerta('error', 'El usuario no existe o no está confirmado');
                } else {
                    // El usuario existe
                    if( password_verify($_POST['password'], $usuario->password) ) {
                        // Iniciar la sesión del usuario
                        session_start();
                        $_SESSION['id'] = $usuario -> id;
                        $_SESSION['nombre'] = $usuario -> nombre;
                        $_SESSION['email'] = $usuario -> email;
                        $_SESSION['login'] = true;

                        // Redireccionar
                        header('Location: /dashboard');
                    } else {
                        Usuario::setAlerta('error', 'La contraseña es incorrecta');
                    }
                }
            }
        }
        $alertas = Usuario::getAlertas();

        // Render a la vista
        $router -> render('auth/login', [
            'titulo' => 'Iniciar sesión',
            'alertas' => $alertas
        ]);
    }
    public static function logout() {
        session_start();
        $_SESSION = [];
        header('Location: /');

    }
    public static function crear(Router $router) {
        $alertas = [];
        $usuario = new Usuario;

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario->sincronizar($_POST);
            $alertas = $usuario->validarNuevaCuenta();

            if(empty($alertas)) {
                $existeUsuario = Usuario::where('email', $usuario->email); // Para revisar si existe el email

                if($existeUsuario) {
                    Usuario::setAlerta('error', 'El usuario ya está registrado');
                    $alertas = Usuario::getAlertas();
                } else {
                    // Hashear el password
                    $usuario -> hashearPassword();

                    // Eliminar password2 del objeto (no de la BD, la BD no contempla ese campo)
                    unset($usuario -> password2);

                    // Generar token
                    $usuario->crearToken();

                    // Crear un nuevo usuario
                    $resultado = $usuario -> guardar();

                    // Enviar email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);

                    $email->enviarConfirmacion();
                    if($resultado) {
                        header('Location: /confirmar-cuenta');
                    }


                }
            }
    
        }
        $router -> render('auth/crear', [
            'titulo' => 'Crea tu cuenta',
            'usuario' => $usuario,
            'alertas' => $alertas
        ]);
    }
    public static function olvide(Router $router) {
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $usuario = new Usuario($_POST);
            $alertas = $usuario->validarEmail();

            if(empty($alertas)){
                // Buscar el usuario
                $usuario = Usuario::where('email', $usuario->email);

                if($usuario && $usuario -> confirmado) {
                    // Generar un nuevo token
                    $usuario->crearToken();
                    unset($usuario->password2);

                    // Actualizar el usuario
                    $usuario->guardar();
                    // Enviar el email
                    $email = new Email($usuario->email, $usuario->nombre, $usuario->token);
                    $email->enviarInstrucciones();
                    // Imprimir la alerta
                    Usuario::setAlerta('exito', 'Hemos enviado las instrucciones a tu correo personal');

                } else {
                    Usuario::setAlerta('error', 'El email no existe o no está confirmado');
                }
            }
        }
        $alertas = Usuario::getAlertas();

        $router -> render('auth/olvide', [
            'titulo' => 'Olvidé mi contraseña',
            'alertas' => $alertas
        ]);
    }
    public static function reestablecer(Router $router) {
        $token = s($_GET['token']);
        $mostrar = true;

        if(!$token) {
            header('Location: /');
        }
        // Identificar el usuario a través del token
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            Usuario::setAlerta('error', 'Token no válido');
            $mostrar = false;
        }

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Añadir nuevo password
            $usuario->sincronizar($_POST);

            // Validar el password
            $alertas = $usuario->validarPassword();
            if(empty($alertas)) {
                // Hashear el nuevo password
                $usuario->hashearPassword();
                unset($usuario->password2);
                // Eliminar el token
                $usuario->token = null;
                // Guardar el nuevo usuario en BD
                $resultado = $usuario->guardar();
                // Redireccionar
                if($resultado) {
                    header('Location: /');
                }
            }
        }

        $alertas = Usuario::getAlertas();
        $router -> render('auth/reestablecer', [
            'titulo' => 'Reestablece tu cuenta',
            'alertas' => $alertas,
            'mostrar' => $mostrar
        ]);
    }
    public static function mensaje(Router $router) {

        $router -> render('auth/mensaje', [
            'titulo' => 'Confirma tu cuenta'
        ]);
    }
    public static function confirmar(Router $router) {
        $token = s($_GET['token']);
        
        if(!$token) {
            header('Location: /');
        }

        // Encontrar al usuario con este token
        $usuario = Usuario::where('token', $token);

        if(empty($usuario)) {
            // Token NO VÁLIDO
            Usuario::setAlerta('error', 'Token no válido');
        } else {
            // Token Válido, confirmar cuenta
            $usuario->confirmado = 1;
            $usuario->token = null;
            unset($usuario->password2);

            $usuario->guardar();
            Usuario::setAlerta('exito', 'Tu cuenta fue creada satisfactoriamente');
        }
        $alertas = Usuario::getAlertas();

        $router -> render('auth/confirmar', [
            'titulo' => 'Cuenta confirmada',
            'alertas' => $alertas
        ]);
    }
}