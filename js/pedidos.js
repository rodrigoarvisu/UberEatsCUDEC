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

            const nombrePlatillo =
            document.querySelector("#listaPlatillo option:checked").text.split(" - $")[0];

            document.getElementById("nombre-platillo").textContent = nombrePlatillo;


            document.getElementById("test").innerHTML = "";

                new QRCode("test", {
                   text: document.querySelector("#listaPlatillo option:checked").text.split(" - $")[0],
                   width: 128,
                   height: 128,
                   colorDark: "#000000",
                   colorLight: "#ffffff",
                   correctLevel: QRCode.CorrectLevel.H
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
    let longitud = posicion.coords.longitude;
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitud}&lon=${longitud}&format=json`, {
        headers: {
            'User-Agent': 'UberRodrigo (rodrigo_arvisu@hotmail.com)'
        }
    })
    .then(respuesta => respuesta.json())
    .then(data => {
        document.getElementById("direccion").value = data.display_name;
        M.updateTextFields();
        var map = L.map('mapa').setView([latitud, longitud], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">'
        }).addTo(map); 
        var marker = L.marker([latitud, longitud]).addTo(map);
    Swal.fire({
        title: "Ubicación obtenida",
        text: data.display_name,
        icon: "success",
        confirmButtonText: "Aceptar"
       });
    })
    .catch(error => console.error(error));
}

function error(error) {
    Swal.fire({
        title: "¡Error!",
        text: "No se pudo obtener la ubicación: " + error.message,
        icon: "error",
        confirmButtonText: "Aceptar"
    });
    console.log(error);
}