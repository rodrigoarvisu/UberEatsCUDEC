db.collection("platillos").onSnapshot((coleccion) => {
    coleccion.docChanges().forEach((registro) => {
        if (registro.type == "added") {
            mostarPlatillo(registro.doc.data(), registro.doc.id);
        }
        if (registro.type === "modified") {
            actualizarPlatillo(registro.doc.data(), registro.doc.id);
        }
        if (registro.type === "removed") {
            removeRecipe(registro.doc.id);
        }
    });
}); 

const formularioAgregar = document.querySelector("form");
formularioAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    const platilloNuevo = {
        nombre: formularioAgregar.title.value,
        ingredientes: formularioAgregar.ingredients.value,
        precio: formularioAgregar.precio.value,
    }

    db.collection("platillos").add(platilloNuevo)
    .catch((error) => {
        console.log(error);
        Swal.fire({
        title: '¡Error!',
        text: 'Ocurrio un error', 
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
    });

    formularioAgregar.title.value = "";
    formularioAgregar.ingredients.value = "";
    formularioAgregar.precio.value = "";
    Swal.fire({
        title: '¡Muy bien!',
        text: 'Platillo agregado correctamente', 
        icon: 'success',
        confirmButtonText: 'Aceptar'
    });
});


const platilloBorrar = document.querySelector(".recipes");
platilloBorrar.addEventListener("click", (e) => {
    if (e.target.classList.contains("icono-bote")) {

        const id = e.target.dataset.id;

        Swal.fire({
            title: '¿Eliminar platillo?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {

            if (result.isConfirmed) {

                db.collection("platillos")
                  .doc(id)
                  .delete()
                  .then(() => {
                      Swal.fire(
                          'Eliminado',
                          'El platillo fue eliminado correctamente',
                          'success'
                      );
                  })
                  .catch((error) => {
                      console.error(error);

                      Swal.fire(
                          'Error',
                          'No se pudo eliminar el platillo',
                          'error'
                      );
                  });

            }

        });
    }
});

