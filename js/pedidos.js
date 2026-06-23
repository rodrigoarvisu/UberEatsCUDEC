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

