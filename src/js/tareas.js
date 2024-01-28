(function() {

    obtenerTareas();
    let tareas = [];
    let filtradas = [];

    // Botón para mostrar el modal de agregar tarea
    const nuevaTareaBtn = document.querySelector('#agregar-tarea');
    nuevaTareaBtn.addEventListener('click', function() {
        mostrarFormulario();
    });

    // Filtros de búsqueda
    const filtros = document.querySelectorAll('#filtros input[type="radio"]');
    filtros.forEach( radio => {
        radio.addEventListener('input', filtrarTareas);
    });
    
    function filtrarTareas(e) {
        const filtro = e.target.value;
        if(filtro !== '') {
            filtradas = tareas.filter(tarea => tarea.estado === filtro);
        } else {
            filtradas = [];
        }
        mostrarTareas();
    }

    async function obtenerTareas() {
        try {
            const id = obtenerProyecto();
            const url = `/api/tareas?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();

            tareas = resultado.tareas;
            mostrarTareas();
        } catch (error) {
            console.log(error);
        }
    }

    function mostrarTareas() {
        limpiarTareas();
        totalPendientes();
        totalCompletas();


        const arrayTareas = filtradas.length ? filtradas : tareas;

        if(arrayTareas.length === 0) {
            const contenedorTareas = document.querySelector('#listado-tareas');

            const textoNoTareas = document.createElement('LI');
            textoNoTareas.textContent = 'No hay ninguna tarea asignada en el proyecto';
            textoNoTareas.classList.add('no-tareas');

            contenedorTareas.appendChild(textoNoTareas);

            return;
        }

        const estados = {
            0: 'Pendiente',
            1: 'Completada'
        }

        arrayTareas.forEach(tarea => {
            const contenedorTarea = document.createElement('LI');
            contenedorTarea.dataset.tareaId = tarea.id;
            contenedorTarea.classList.add('tarea');

            const nombreTarea = document.createElement('P');
            nombreTarea.textContent = tarea.nombre;
            nombreTarea.ondblclick = function() {
                mostrarFormulario(editar = true, {...tarea});
            }

            const opcionesDiv = document.createElement('DIV');
            opcionesDiv.classList.add('opciones');
            
            // Botones
            const btnEstadoTarea = document.createElement('BUTTON');
            btnEstadoTarea.classList.add('estado-tarea');
            btnEstadoTarea.classList.add(`${estados[tarea.estado].toLowerCase()}`);
            btnEstadoTarea.textContent = estados[tarea.estado];
            btnEstadoTarea.dataset.estadoTarea = tarea.estado;
            btnEstadoTarea.ondblclick = function() {
                cambiarEstadoTarea({...tarea});
            }

            const btnEliminarTarea = document.createElement('BUTTON');
            btnEliminarTarea.classList.add('eliminar-tarea');
            btnEliminarTarea.dataset.idTarea = tarea.id;
            btnEliminarTarea.textContent = 'Eliminar';
            btnEliminarTarea.ondblclick = function() {
                confirmarEliminarTarea({...tarea});
            }

            // Agregando los botones al Div de opciones
            opcionesDiv.appendChild(btnEstadoTarea);
            opcionesDiv.appendChild(btnEliminarTarea);

            // Agregando el nombre de la tarea y el div de opciones al contenedor de la tarea
            contenedorTarea.appendChild(nombreTarea);      
            contenedorTarea.appendChild(opcionesDiv);

            const listadoTareas = document.querySelector('#listado-tareas');
            listadoTareas.appendChild(contenedorTarea); 
        });
    }

    function totalPendientes() {
        const totalPendientes = tareas.filter(tarea => tarea.estado === "0");
        const pendientesRadio = document.querySelector('#pendientes');

        if(totalPendientes.lenght === 0) {
            pendientesRadio.disabled = true;
        } else {
            pendientesRadio.disabled = false;
        }
    }
    function totalCompletas() {
        const totalCompletas = tareas.filter(tarea => tarea.estado === "1");
        const completasRadio = document.querySelector('#completadas');

        if(totalCompletas.length === 0) {
            completasRadio.disabled = true;
        } else {
            completasRadio.disabled = false;
        }
    }

    function mostrarFormulario(editar = false, tarea = {}) {
        const modal = document.createElement('DIV');
        modal.classList.add('modal');
        modal.innerHTML = `
            <form class="formulario nueva-tarea">
                <legend>${editar ? 'Editar tarea' : 'Añade una nueva tarea'}</legend>
                <div class="campo">
                    <label>Tarea</label>
                    <input type="text" name="tarea" placeholder="${tarea.nombre ? tarea.nombre : 'Nombre'}" id="tarea" value="${tarea.nombre ? tarea.nombre : ''}" />
                </div>
                <div class="opciones">
                    <input type="submit" class="submit-nueva-tarea" value="${editar ? 'Guardar cambios' : 'Añadir tarea'}" />
                    <button type="button" class="cerrar-modal">Cancelar</button>
                </div>
            </form>
        `;

        setTimeout(() => {
            const formulario = document.querySelector('.formulario');
            formulario.classList.add('animar');
        }, 100);

        modal.addEventListener('click', function(e) {
            e.preventDefault();

            if(e.target.classList.contains('cerrar-modal')) {
                const formulario = document.querySelector('.formulario');
                formulario.classList.add('cerrar');
                setTimeout(() => {
                    modal.remove();
                }, 500);
            }
            if(e.target.classList.contains('submit-nueva-tarea')){
                const nombreTarea = document.querySelector('#tarea').value.trim();
                if(nombreTarea === '') {
                    // Mostrar una alerta de error si no hay nombre
                    mostrarAlerta('Debes añadir un nombre a tu tarea', 'error', document.querySelector('.formulario legend'));
                    return;
                }

                if(editar) {
                    tarea.nombre = nombreTarea;
                    actualizarTarea(tarea);
                } else {
                    agregarTarea(nombreTarea);
                }
            }
        })
        document.querySelector('.dashboard').appendChild(modal);
    }

    function mostrarAlerta(mensaje, tipo, referencia) {
        // Prevenir mostrar muchas alertas
        const alertaPrevia = document.querySelector('.alerta');
        if(alertaPrevia) {
            alertaPrevia.remove();
        }
        // Alerta
        const alerta = document.createElement('DIV');
        alerta.classList.add('alerta', tipo);
        alerta.textContent = mensaje;
        // Inserta la alerta antes del legend del formulario
        referencia.parentElement.insertBefore(alerta, referencia.nextElementSibling);
        // Eliminar la alerta pasado un tiempo
        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }
    
    async function agregarTarea(tarea) {
        // Construir la petición a la API
        const datos = new FormData();
        datos.append('nombre', tarea);
        datos.append('proyectoId', obtenerProyecto());

        try {
            const dominio = $_ENV['APP_URL'];
            const path = "/api/tarea";
            const url = dominio.concat(path);
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();

            mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.formulario legend'));
            if(resultado.tipo === 'exito') {
                const modal = document.querySelector('.modal');
                setTimeout(() => {
                    modal.remove();
                }, 3000);
                // Agregar el objeto de tarea al global de tarea (Esto es para evitar recagar la página cuando se crea una tarea, consume servidor). Lo trae por Virtual Dom, es una implementación en lugar de un consumo de recursos o crear de nuevo el código.
                const tareaObj = {
                    id: String(resultado.id),
                    nombre: tarea,
                    estado: "0",
                    proyectoId: resultado.proyectoId
                }
                tareas = [...tareas, tareaObj];
                mostrarTareas();
            }
        } catch (error) {
            console.log(error);
        }
    }
    function cambiarEstadoTarea(tarea) {
        const nuevoEstado = tarea.estado === "1" ? "0" : "1";
        tarea.estado = nuevoEstado;
        actualizarTarea(tarea);
    }
    async function actualizarTarea(tarea) {
        const {estado, id, nombre, proyectoId} = tarea;
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());

        // for( let valor of datos.values()) {
        //     console.log(valor);
        // }
        try {
            const dominio = $_ENV['APP_URL'];
            const path = "/api/tarea/actualizar";
            const url = dominio.concat(path);
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();
            if(resultado.respuesta.tipo === 'exito') {
                Swal.fire(
                    'Tarea actualizada',
                    resultado.mensaje,
                    'success'
                );

                const modal = document.querySelector('.modal');
                if(modal) {
                    modal.remove();
                }

                tareas = tareas.map(tareaMemoria => {
                    if(tareaMemoria.id === id) {
                        tareaMemoria.estado = estado;
                        tareaMemoria.nombre = nombre;
                    }
                    return tareaMemoria;
                });
                mostrarTareas();
            }
        } catch (error) {
            console.log(error);
        }
    }
    function confirmarEliminarTarea(tarea) {
        Swal.fire({
            title: "¿Desea eliminar esta tarea?",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar"
          }).then((result) => {
            if (result.isConfirmed) {
                eliminarTarea(tarea)
            }
          });
    }
    async function eliminarTarea(tarea) {
        const {estado, id, nombre} = tarea;
        const datos = new FormData();
        datos.append('id', id);
        datos.append('nombre', nombre);
        datos.append('estado', estado);
        datos.append('proyectoId', obtenerProyecto());
        try {
            const dominio = $_ENV['APP_URL'];
            const path = "/api/tarea/eliminar";
            const url = dominio.concat(path);
            const respuesta = await fetch(url, {
                method: 'POST',
                body: datos
            });
            const resultado = await respuesta.json();
            if(resultado.resultado) {
                // mostrarAlerta(resultado.mensaje, resultado.tipo, document.querySelector('.contenedor-nueva-tarea'));
                Swal.fire('Tarea eliminada', resultado.mensaje, 'success');
                tareas = tareas.filter(tareaMemoria => tareaMemoria.id !== tarea.id);
                mostrarTareas();
            }
        } catch (error) {
            
        }
    }

    function obtenerProyecto() {
        const proyectoParams = new URLSearchParams(window.location.search);
        const proyecto = Object.fromEntries(proyectoParams.entries());
        return proyecto.id;
    }
    function limpiarTareas() {
        const listadoTareas = document.querySelector('#listado-tareas');
        while(listadoTareas.firstChild) {
            listadoTareas.removeChild(listadoTareas.firstChild);
        }
    }
})();


