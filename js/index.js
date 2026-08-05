let contenido = "";

document.addEventListener("DOMContentLoaded", function () {
  // Menú de navegación
  const menus = document.querySelectorAll(".side-menu");
  M.Sidenav.init(menus, { edge: "right" });

  // Formulario para agregar platillo
  const forms = document.querySelectorAll(".side-form");
  M.Sidenav.init(forms, { edge: "left" });
});

function mostarPlatillo(platillo, id) {
  let fotoPlatillo;

  if (platillo.imagen) {
    fotoPlatillo = "data:image/png;base64," + platillo.imagen;
  } else {
    fotoPlatillo = "img/sin-imagen.png";
  }

  contenido = `
    <div class="card-panel recipe white row" id="${id}" data-id="${id}">
      <img src="${fotoPlatillo}" class="recipe-img" alt="Foto de ${platillo.nombre}">

      <div class="recipe-details">
        <div class="recipe-title">${platillo.nombre}</div>

        <div class="recipe-ingredientes">
          ${platillo.ingredientes}
        </div>

        <div class="recipe-price">
          $${platillo.precio}
        </div>

        <div class="recipe-delete">
          <img src="img/icono-bote.png" class="icono-bote" data-id="${id}">
        </div>
      </div>
    </div>
  `;

  document.querySelector(".recipes").innerHTML += contenido;
}

function actualizarPlatillo(platillo, id) {
  const tarjeta = document.getElementById(id);

  tarjeta.querySelector(".recipe-title").innerHTML = platillo.nombre;
  tarjeta.querySelector(".recipe-ingredientes").innerHTML = platillo.ingredientes;
  tarjeta.querySelector(".recipe-price").innerHTML = "$" + platillo.precio;
}

const removeRecipe = (id) => {
  const platillo = document.querySelector(`.recipe[data-id="${id}"]`);
  platillo.remove();
};

// Cámara
let streaming = false;
let streamActual = null;
const width = 320;
let height = 0;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const foto = document.getElementById("foto");
const fotoInput = document.getElementById("fotoBase64");
const btnFoto = document.getElementById("btn-foto");
const btnTomarFoto = document.getElementById("btn-tomar-foto");

btnFoto.addEventListener("click", function () {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: {
          ideal: "environment"
        }
      },
      audio: false
    })
    .then((stream) => {
      streamActual = stream;
      streaming = false;

      video.srcObject = stream;
      video.style.display = "block";
      foto.style.display = "none";

      btnTomarFoto.style.display = "flex";
      video.play();
    })
    .catch((error) => {
      console.log("No fue posible acceder a la cámara:", error);
    });
});

video.addEventListener("canplay", () => {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth / width);

    if (isNaN(height) || height === 0) {
      height = width / (4 / 3);
    }

    video.setAttribute("width", width);
    video.setAttribute("height", height);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    streaming = true;
  }
});

function detenerCamara() {
  if (streamActual) {
    streamActual.getTracks().forEach((track) => track.stop());
    streamActual = null;
  }

  btnTomarFoto.style.display = "none";
  video.pause();
  video.srcObject = null;
  video.style.display = "none";
}

function tomarFoto() {
  const contexto = canvas.getContext("2d");

  if (width && height) {
    canvas.width = width;
    canvas.height = height;

    contexto.drawImage(video, 0, 0, width, height);

    const fotoFinal = canvas.toDataURL("image/png");

    foto.src = fotoFinal;
    foto.style.display = "block";

    fotoInput.value = fotoFinal.replace("data:image/png;base64,", "");

    
    detenerCamara();
  } else {
    limpiarFoto();
  }
}

btnTomarFoto.addEventListener("click", tomarFoto);

function limpiarFoto() {
  const contexto = canvas.getContext("2d");

  contexto.fillStyle = "orange";
  contexto.fillRect(0, 0, canvas.width, canvas.height);

  foto.src = "";
  foto.style.display = "none";
}