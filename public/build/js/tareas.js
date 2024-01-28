!function(){!async function(){try{const t="/api/tareas?id="+d(),a=await fetch(t),o=await a.json();e=o.tareas,n()}catch(e){console.log(e)}}();let e=[],t=[];document.querySelector("#agregar-tarea").addEventListener("click",(function(){o()}));function a(a){const o=a.target.value;t=""!==o?e.filter(e=>e.estado===o):[],n()}function n(){!function(){const e=document.querySelector("#listado-tareas");for(;e.firstChild;)e.removeChild(e.firstChild)}(),function(){const t=e.filter(e=>"0"===e.estado),a=document.querySelector("#pendientes");0===t.lenght?a.disabled=!0:a.disabled=!1}(),function(){const t=e.filter(e=>"1"===e.estado),a=document.querySelector("#completadas");0===t.length?a.disabled=!0:a.disabled=!1}();const a=t.length?t:e;if(0===a.length){const e=document.querySelector("#listado-tareas"),t=document.createElement("LI");return t.textContent="No hay ninguna tarea asignada en el proyecto",t.classList.add("no-tareas"),void e.appendChild(t)}const r={0:"Pendiente",1:"Completada"};a.forEach(t=>{const a=document.createElement("LI");a.dataset.tareaId=t.id,a.classList.add("tarea");const i=document.createElement("P");i.textContent=t.nombre,i.ondblclick=function(){o(editar=!0,{...t})};const s=document.createElement("DIV");s.classList.add("opciones");const l=document.createElement("BUTTON");l.classList.add("estado-tarea"),l.classList.add(""+r[t.estado].toLowerCase()),l.textContent=r[t.estado],l.dataset.estadoTarea=t.estado,l.ondblclick=function(){!function(e){const t="1"===e.estado?"0":"1";e.estado=t,c(e)}({...t})};const u=document.createElement("BUTTON");u.classList.add("eliminar-tarea"),u.dataset.idTarea=t.id,u.textContent="Eliminar",u.ondblclick=function(){!function(t){Swal.fire({title:"¿Desea eliminar esta tarea?",showCancelButton:!0,confirmButtonText:"Eliminar",cancelButtonText:"Cancelar"}).then(a=>{a.isConfirmed&&async function(t){const{estado:a,id:o,nombre:r}=t,c=new FormData;c.append("id",o),c.append("nombre",r),c.append("estado",a),c.append("proyectoId",d());try{const a=$_ENV.APP_URL,o="/api/tarea/eliminar",r=a.concat(o),d=await fetch(r,{method:"POST",body:c}),i=await d.json();i.resultado&&(Swal.fire("Tarea eliminada",i.mensaje,"success"),e=e.filter(e=>e.id!==t.id),n())}catch(e){}}(t)})}({...t})},s.appendChild(l),s.appendChild(u),a.appendChild(i),a.appendChild(s);document.querySelector("#listado-tareas").appendChild(a)})}function o(t=!1,a={}){const o=document.createElement("DIV");o.classList.add("modal"),o.innerHTML=`\n            <form class="formulario nueva-tarea">\n                <legend>${t?"Editar tarea":"Añade una nueva tarea"}</legend>\n                <div class="campo">\n                    <label>Tarea</label>\n                    <input type="text" name="tarea" placeholder="${a.nombre?a.nombre:"Nombre"}" id="tarea" value="${a.nombre?a.nombre:""}" />\n                </div>\n                <div class="opciones">\n                    <input type="submit" class="submit-nueva-tarea" value="${t?"Guardar cambios":"Añadir tarea"}" />\n                    <button type="button" class="cerrar-modal">Cancelar</button>\n                </div>\n            </form>\n        `,setTimeout(()=>{document.querySelector(".formulario").classList.add("animar")},100),o.addEventListener("click",(function(i){if(i.preventDefault(),i.target.classList.contains("cerrar-modal")){document.querySelector(".formulario").classList.add("cerrar"),setTimeout(()=>{o.remove()},500)}if(i.target.classList.contains("submit-nueva-tarea")){const o=document.querySelector("#tarea").value.trim();if(""===o)return void r("Debes añadir un nombre a tu tarea","error",document.querySelector(".formulario legend"));t?(a.nombre=o,c(a)):async function(t){const a=new FormData;a.append("nombre",t),a.append("proyectoId",d());try{const o=$_ENV.APP_URL,c="/api/tarea",d=o.concat(c),i=await fetch(d,{method:"POST",body:a}),s=await i.json();if(r(s.mensaje,s.tipo,document.querySelector(".formulario legend")),"exito"===s.tipo){const a=document.querySelector(".modal");setTimeout(()=>{a.remove()},3e3);const o={id:String(s.id),nombre:t,estado:"0",proyectoId:s.proyectoId};e=[...e,o],n()}}catch(e){console.log(e)}}(o)}})),document.querySelector(".dashboard").appendChild(o)}function r(e,t,a){const n=document.querySelector(".alerta");n&&n.remove();const o=document.createElement("DIV");o.classList.add("alerta",t),o.textContent=e,a.parentElement.insertBefore(o,a.nextElementSibling),setTimeout(()=>{o.remove()},5e3)}async function c(t){const{estado:a,id:o,nombre:r,proyectoId:c}=t,i=new FormData;i.append("id",o),i.append("nombre",r),i.append("estado",a),i.append("proyectoId",d());try{const t=$_ENV.APP_URL,c="/api/tarea/actualizar",d=t.concat(c),s=await fetch(d,{method:"POST",body:i}),l=await s.json();if("exito"===l.respuesta.tipo){Swal.fire("Tarea actualizada",l.mensaje,"success");const t=document.querySelector(".modal");t&&t.remove(),e=e.map(e=>(e.id===o&&(e.estado=a,e.nombre=r),e)),n()}}catch(e){console.log(e)}}function d(){const e=new URLSearchParams(window.location.search);return Object.fromEntries(e.entries()).id}document.querySelectorAll('#filtros input[type="radio"]').forEach(e=>{e.addEventListener("input",a)})}();