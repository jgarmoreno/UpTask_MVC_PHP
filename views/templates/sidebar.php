<aside class="sidebar">
        <div class="contenedor-sidebar">
            <a href="/dashboard">
                <h2>UpTask</h2>
            </a>
            <div class="cerrar-menu">
                <img id="cerrar-menu" src="build/img/cerrar.svg" alt="imagen cerrar menu">
            </div>
        </div>
    <nav class="sidebar-nav">
        <a class="<?php echo($titulo === 'Proyectos') ? 'activo' : ''; ?>" href="/dashboard">Proyectos</a>
        <a class="<?php echo($titulo === 'Crea un nuevo proyecto') ? 'activo' : ''; ?>" href="/crear-proyecto">Crear proyecto</a>
        <a class="<?php echo($titulo === 'Tu perfil') ? 'activo' : ''; ?>" href="/perfil">Tu perfil</a>
    </nav>
    <div class="cerrar-sesion-mobile">
        <a href="/logout" class="cerrar-sesion">Cerrar sesión</a>
    </div>
</aside>