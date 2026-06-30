db.collection("platillos").onSnapshot((coleccion) => {
    coleccion.docChanges().forEach((registro) => {
        if (registro.type === "added") {
            agregarALista(registro.doc.data(), registro.doc.id);
        }
    });

    M.FormSelect.init(document.querySelectorAll('select'));
});

function agregarALista(platillo, id) {
    const selectPlatillos = document.getElementById('listaPlatillo');

    selectPlatillos.innerHTML += `
        <option value="${id}">
            ${platillo.nombre} - $${platillo.precio}
        </option>
    `;
}


const formularioPedido = document.getElementById("formPedido");

formularioPedido.addEventListener("submit", (e) => {
    e.preventDefault();

    const pedidoNuevo = {
        platilloId: formularioPedido.platillo.value,
        nombre: formularioPedido.nombre.value,
        direccion: formularioPedido.direccion.value
    };

    db.collection("pedidos").add(pedidoNuevo)
        .then(() => {
            Swal.fire({
                title: "¡Muy bien!",
                text: "Pedido guardado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar"
            });

            formularioPedido.reset();
            M.FormSelect.init(document.querySelectorAll("select"));
        })
        .catch((error) => {
            console.error(error);

            Swal.fire({
                title: "¡Error!",
                text: "No se pudo guardar el pedido",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        });
});

document.getElementById("btnUbi").addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(exito, error);
    }else{
        Swal.fire({
            title: "¡Error!",
            text: "No se pudo obtener la ubicación",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
});

function exito(posicion){
    let latitud = posicion.coords.latitude;
    let longitud = posicion.coords.longitud;
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitud}&format=json`, {
        headers: {
            'User-Agent': 'UberRodrigo (rodrigo_arvisu@hotmail.com)'
        }
    })
    .then(respuesta => respuesta.json())
    .then(data => alert(data.display_name))
    .catch(error => console.error(error));
}

function error(err) {
    Swal.fire({
        title: "¡Error!",
        text: "No se pudo obtener la ubicación: " + err.message,
        icon: "error",
        confirmButtonText: "Aceptar"
    });
    console.log(error);
}