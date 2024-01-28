<div class="contenedor reestablecer">
    <?php include_once __DIR__ . '/../templates/nombre-sitio.php'; ?>

    <div class="contenedor-sm">
        <p class="descripcion-pagina">Introduce una nueva contraseña</p>

        <?php include_once __DIR__ . '/../templates/alertas.php'; ?>

        <?php if($mostrar) { ?>

        <form class="formulario" method="POST">
            <div class="campo">
                <label for="password">Nueva contraseña</label>
                <input type="password" id="password" placeholder="Tu contraseña" name="password">
            </div>
            <div class="campo">
                <label for="password2">Repite la contraseña</label>
                <input type="password" id="password2" placeholder="Introduzca de nuevo la contraseña" name="password2">
            </div>
            
            <input type="submit" class="boton" value="Reestablecer contraseña">
        </form>
        
        <?php } ?>    

        <div class="acciones">
            <a href="/">¿Ya tienes una cuenta? Inicia sesión</a>
            <a href="/olvide-cuenta">He olvidado mi contraseña</a>
        </div>
    </div> <!-- .contenedor-sm -->
</div>
