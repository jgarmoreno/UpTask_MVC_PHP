<?php

namespace Model;

class Usuario extends ActiveRecord {
    protected static $tabla = 'usuarios';
    protected static $columnasDB = ['id', 'nombre', 'email', 'password', 'token', 'confirmado'];

    public $id;
    public $nombre;
    public $email;
    public $password;
    public $password2;
    public $password_actual;
    public $password_nuevo;
    public $token;
    public $confirmado;

    public function __construct($args = [])
    {
        $this-> id = $args['id'] ?? null;
        $this-> nombre = $args['nombre'] ?? '';
        $this-> email = $args['email'] ?? '';
        $this-> password = $args['password'] ?? '';
        $this-> password2 = $args['password2'] ?? null; // Se puede poner como null o '', porque este no va a la BD. Solo se usa para asegurar que el password1 sea correcto.
        $this-> password_actual = $args['password_actual'] ?? '';
        $this-> password_nuevo = $args['password_nuevo'] ?? null; // Se puede poner como null o '', porque este no va a la BD. Solo se usa para asegurar que el password1 sea correcto.
        $this-> token = $args['token'] ?? '';
        $this-> confirmado = $args['confirmado'] ?? 0;
    }

    //  Validar login de usuarios

    public function validarLogin() : array {
        if(!$this->email) {
            self::$alertas['error'][] = 'El email es obligatorio';
        }
        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)){
            self::$alertas['error'][] = 'Email no válido';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'La contraseña no puede ir vacía';
        }
        return self::$alertas;
    }

    // Validación para cuentas nuevas
    public function validarNuevaCuenta() : array {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'Debes escribir un nombre de usuario';
        }
        if(!$this->email) {
            self::$alertas['error'][] = 'Debes escribir un email';
        }
        if(!$this->password) {
            self::$alertas['error'][] = 'Debes escribir una contraseña';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'La contraseña debe tener al menos 6 caracteres';
        }
        if($this->password !== $this->password2) {
            self::$alertas['error'][] = 'Las contraseñas deben coincidir';
        }
        return self::$alertas;
    }
    public function hashearPassword() : void {
        $this -> password = password_hash($this->password, PASSWORD_BCRYPT);
    }
    public function crearToken() : void {
        $this -> token = md5(uniqid());
    }
    public function validarEmail() : array {
        if(!$this->email) {
            self::$alertas['error'][] = 'El email es obligatorio';
        }
        if(!filter_var($this->email, FILTER_VALIDATE_EMAIL)){
            self::$alertas['error'][] = 'Email no válido';
        }
        return self::$alertas;
    }
    public function validarPassword() : array {
        if(!$this->password) {
            self::$alertas['error'][] = 'Debes escribir una contraseña';
        }
        if(strlen($this->password) < 6) {
            self::$alertas['error'][] = 'La contraseña debe tener al menos 6 caracteres';
        }
        if($this->password !== $this->password2) {
            self::$alertas['error'][] = 'Las contraseñas deben coincidir';
        }
        return self::$alertas;
    }
    public function validar_perfil() : array {
        if(!$this->nombre) {
            self::$alertas['error'][] = 'El nombre no puede ir vacío';
        }
        if(!$this->email) {
            self::$alertas['error'][] = 'El correo es obligatorio';
        }
        return self::$alertas;
    }
    public function nuevo_password() : array {
        if(!$this->password_actual) {
            self::$alertas['error'][] = 'Debes escribir tu contraseña actual';
        }
        if(!$this->password_nuevo) {
            self::$alertas['error'][] = 'Debes escribir una nueva contraseña';
        }
        if(strlen($this->password_nuevo) < 6 ) {
            self::$alertas['error'][] = 'La contraseña debe tener al menos 6 caracteres';
        }
        return self::$alertas;
    }
    public function comprobar_password(): bool {
        return password_verify($this->password_actual, $this->password);
    }
}