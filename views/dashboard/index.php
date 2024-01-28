<?php include_once __DIR__ . '/header-dashboard.php'; ?>

    <?php if(count($proyectos) === 0) { ?>
        <div class="noproyectos">
            <p>No has creado ningún proyecto</p>
            <a class="btn-crear" href="/crear-proyecto">Crear proyecto</a>
        </div>

    <?php } else {?>
        <ul class="listado-proyectos">
            <?php foreach($proyectos as $proyecto) { ?>
                <a href="/proyecto?id=<?php echo $proyecto->url; ?>">
                    <li class="proyecto">
                            <?php echo $proyecto->proyecto; ?>
                    </li>
                </a>
                <?php } ?>
        </ul>
    <?php } ?>    

<?php include_once __DIR__ . '/footer-dashboard.php'; ?>