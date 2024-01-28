<?php include_once __DIR__ . '/header-dashboard.php'; ?>

<div class="contenedor-sm">
    <?php include_once __DIR__ . '/../templates/alertas.php'; ?>

    <a href="/perfil" class="enlace">Volver al perfil</a>

    <form class="formulario" method="POST" action="/cambiar-password">
        <div class="campo">
            <label for="passwordActual">Contraseña actual</label>
            <input type="password" name="password_actual" placeholder="Contraseña actual" id="passwordActual">
        </div>
        <div class="campo">
            <label for="passwordNuevo">Nueva contraseña</label>
            <input type="password" name="password_nuevo" placeholder="Nueva contraseña" id="passwordNuevo">
        </div>

        <input type="submit" value="Guardar cambios">
    </form>
</div>

<?php include_once __DIR__ . '/footer-dashboard.php'; ?>