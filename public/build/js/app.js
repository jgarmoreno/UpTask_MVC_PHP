const mobileMenuBtn=document.querySelector("#mobile-menu"),sidebar=document.querySelector(".sidebar"),cerrarMenuMobile=document.querySelector("#cerrar-menu");mobileMenuBtn&&(mobileMenuBtn.addEventListener("click",(function(){sidebar.classList.add("mostrar")})),cerrarMenuMobile.addEventListener("click",(function(){sidebar.classList.remove("mostrar")})));