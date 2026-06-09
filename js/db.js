db.collection("platillos").onSnapshot((coleccion) => {
    coleccion.forEach((registro) => {
        mostarPlatillo(registro.data(), registro.id);
    });
}); 