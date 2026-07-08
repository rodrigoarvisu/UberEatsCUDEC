let contenido = "";


document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});

function mostarPlatillo(platillo, id){
  contenido = `
  <div class='card-panel recipe white row' id='${id}' data-id='${id}'>
       <div class='recipe-details'> 
            <div class='recipe-title'> 
                ${platillo.nombre}
            </div>

            <div class='recipe-ingredientes'> 
                ${platillo.ingredientes}
            </div>

            <div class='recipe-price'>
                ${'$' + platillo.precio}
            </div>
            <div class="recipe-delete">
            <i data-id='${id}'>
            </i>
            <img src="img/icono-bote.png" class="icono-bote" data-id='${id}'>
            </div>
       </div>
  </div>
  `;
  document.querySelector(".recipes")
  .innerHTML += contenido;
}

function actualizarPlatillo(platillo, id) {
  let tarjeta = document.getElementById(`${id}`);
  tarjeta.querySelector(".recipe-title").innerHTML = platillo.nombre;
  tarjeta.querySelector(".recipe-ingredientes").innerHTML = platillo.ingredientes;
  tarjeta.querySelector(".recipe-price").innerHTML = '$' + platillo.precio;
}

const removeRecipe = (id) => {
  const platillo = document.querySelector(`.recipe[data-id="${id}"]`);
  platillo.remove();
}

let  streaming = false;
const width = 320;
let height = 0;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const foto = document.getElementById('foto');
const btnFoto = document.getElementById('btn-foto');

btnFoto.addEventListener('click', function() {
   navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
   })
   .then((stream) => {
    video.srcObject = stream;
    video.play();
   })
   .catch((error) => {
    console.log(error);
   });
})



