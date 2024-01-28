<?php

namespace Model;

class Proyecto extends ActiveRecord {
    protected static $tabla = 'proyectos';
    protected static $columnasDB = ['id', 'proyecto', 'url', 'propietarioId'];

    public $id;
    public $proyecto;
    public $url;
    public $propietarioId;

    public function __construct($args = [])
    {
        $this -> id = $args['id'] ?? null;
        $this -> proyecto = $args['proyecto'] ?? '';
        $this -> url = $args['url'] ?? '';
        $this -> propietarioId = $args['propietarioId'] ?? null;
    }

    public function validarProyecto() {
        if(!$this->proyecto) {
            self::$alertas['error'][] = 'Es obligatorio establecer un nombre para tu proyecto'; 
        }
        return self::$alertas;
    }
}