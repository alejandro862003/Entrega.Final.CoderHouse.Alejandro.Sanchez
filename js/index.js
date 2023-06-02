//Obtener referencia a todos los botones con la clase'button'
const Clickboton = document.querySelectorAll('.button');

//Arreglo para almacenar los elementos del carrito
let carrito = [];

//Obtener referencia al elemento tbody de la tabla
const tbody = document.querySelector('.tbody');

//Obtener referencia al elemento que muestra el total de los items
const itemsTotal = document.querySelector('.itemsTotal');

//Agregar evento de click a cada boton
Clickboton.forEach(btn => {
  btn.addEventListener('click', addCarritoItems);
});

//Funcion para agregar un item al carrito
function addCarritoItems(e) {
  const button = e.target;
  const items = button.closest('.card');
  const itemsTitulo = items.querySelector('.card-title').textContent;
  const itemsPrecios = items.querySelector('.precio').textContent;
  const itemsImagen = items.querySelector('.card-img-top').src;

  const newItems = {
    titulos: itemsTitulo,
    precios: itemsPrecios,
    img: itemsImagen,
    cantidad: 1
  };

  addItemCarrito(newItems);
}

//Funcion para agregar un item al carrito
function addItemCarrito(newItems) {
  const alert = document.querySelector('.alert');
  setTimeout(function() {
    alert.classList.add('hide');
    tbody.scrollIntoView({ behavior:'smooth'});
  }, 2000);
  alert.classList.remove('hide');

  const ImputElemento = tbody.getElementsByClassName('input__elemento');

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].titulos.trim() === newItems.titulos.trim()) {
      carrito[i].cantidad++;
      const imputValue = ImputElemento[i];
      imputValue.value++;

      CarritoTotal();
      return null;
    }
  }

  carrito.push(newItems);
  renderCarrito();
}

// Funcion para renderizar el carrito
function renderCarrito() {
  tbody.innerHTML = '';
  carrito.map((items, index) => {
    const tr = document.createElement('tr');
    tr.classList.add('ItemCarrito');
    const Content = `
      <th scope="row">1</th>
      <td class="table__productos">
        <img src=${items.img} alt="">
        <h6 class="title">${items.titulos}</h6>
      </td>
      <td class="table__price"><p>${items.precios}</p></td>
      <td class="table__cantidad">
        <input type="number" min="1" value=${items.cantidad} class="input__elemento">
        <button class="delete btn btn-danger">x</button>
      </td>
    `;
    tr.innerHTML = Content;
    tbody.append(tr);

    tr.querySelector(".delete").addEventListener('click', removerItemsCarrito);
    tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad);
  });
  CarritoTotal();
}

// Funcion para actualizar el total del carrito
function CarritoTotal() {
  let Total = 0;
  const ItemCarritoTotal = document.querySelector('.ItemCarritoTotal');
  carrito.forEach(items => {
    if (items.precios) {
      const precios = Number(items.precios.replace("$", ""));
      if (!isNaN(precios)) {
        Total += precios * items.cantidad;
      }
    }
  });

  ItemCarritoTotal.innerHTML = `Total $${Total}`;
  addLocalStorage();
}

// Funcion para eliminar un item del carrito
function removerItemsCarrito(e) {
  const botonEliminar = e.target;
  const tr = botonEliminar.closest(".ItemCarrito");
  const titulos = tr.querySelector('.title').textContent;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].titulos.trim() === titulos.trim()) {
      carrito.splice(i, 1);
    }
  }

  const alert = document.querySelector('.remove');
  setTimeout(function() {
    alert.classList.add('remove');
  }, 2000);
  alert.classList.remove('remove');

  tr.remove();
  CarritoTotal();
}

// Funcion para actualizar la cantidad de un item en el carrito
function sumaCantidad(e) {
  const sumaImput = e.target;
  const tr = sumaImput.closest(".ItemCarrito");
  const titulos = tr.querySelector('.title').textContent;
  carrito.forEach(items => {
    if (items.titulos.trim() === titulos) {
      sumaImput.value < 1 ? (sumaImput.value = 1) : sumaImput.value;
      items.cantidad = sumaImput.value;
      CarritoTotal();
    }
  });
}

//Funcion para guardar el carrito en el almacenamiento local
function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

//Funcion que se ejecuta al cargar la pagina
window.onload = function() {
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if (storage) {
    carrito = storage;
    renderCarrito();
  }
};

//Obtener referencia al boton de compra
const buyButton = document.querySelector('.buy');
buyButton.addEventListener('click', () => {
  if (carrito.length === 0) {
    mostrarMensajeCompra();
  } else {
    finalizarCompra();
  }
});


let primeraCompra = true;

function finalizarCompra() {
  if (primeraCompra) {
    resetearCarrito();
    mostrarMensajeExito();
    primeraCompra = false;
    successMessage.scrollIntoView({behavior: 'smooth'});
    setTimeout(() => {
      successMessage.classList.add('d-none');
      location.reload();
    }, 3000);
  } else {
    seguirComprando();
    buyMessage.scrollIntoView({behavior:'smooth'});
    setTimeout(() => {
      buyMessage.classList.add('d-none');
      location.reload();
    }, 4000);
  }
}

// Obtener referencia al botón
const cancelarComprasButton = document.getElementById('cancelarCompras');

// Agregar evento click al botón
cancelarComprasButton.addEventListener('click', cancelarCompras);

// Función para cancelar compras
function cancelarCompras() {
  // Limpiar el carrito y el almacenamiento local
  carrito = [];
  localStorage.removeItem('carrito');
  
  // Renderizar el carrito vacío
  renderCarrito();

  // Recargar la página
  location.reload();
}

//Funcion para resetear el carrito
function resetearCarrito() {
  carrito = [];
  localStorage.removeItem('carrito');
  renderCarrito();
}




//Funcion para mostrar un mensaje
function mostrarMensajeExito() {
  const successMessage = document.getElementById('success-message');
  successMessage.classList.remove('d-none');
  setTimeout(() => {
    successMessage.classList.add('d-none');
    location.reload();
  }, 3000);
}

function mostrarMensajeCompra() {
  const buyMessage = document.getElementById('buy-message');
  buyMessage.classList.remove('d-none');
  setTimeout(() => {
    buyMessage.classList.add('d-none');
    location.reload();
  }, 4000);
}

//Obtener referencia al formulario
const formulario = document.querySelector('#miFormulario');
const modalExito = document.querySelector('#modalExito');

//Evento submit del formulario
formulario.addEventListener('submit', function(event) {
  event.preventDefault();

  if (formulario.checkValidity() === false) {
    event.stopPropagation();
    formulario.classList.add('was-validated');
  } else {
    guardarDatos();
    enviarResultados();
  }
});

//Funcion para guardar los datos del formulario en el almacenamiento local
function guardarDatos() {
  const datos = {
    nombre: document.querySelector('#nombre').value,
    email: document.querySelector('#email').value,
    mensaje: document.querySelector('#mensaje').value
  };

  const datosJson = JSON.stringify(datos);
  localStorage.setItem('formularioDatos', datosJson);
}

//Funcion para simular el envio de resultados al servidor
function enviarResultados() {
  // Simulación de envío de resultados al servidor
  setTimeout(function() {
    // Limpiar el formulario
    formulario.reset();
    formulario.classList.remove('was-validated');

    // Mostrar ventana modal de éxito
    modalExito.style.display = 'block';
    modalExito.classList.add('show');

    // Cerrar la ventana modal después de 3 segundos
    setTimeout(function() {
      closeModal();
    }, 3000);

    // Eliminar los datos guardados en el almacenamiento local
    localStorage.removeItem('formularioDatos');
  }, 1000);
}

// Cargar los datos del formulario guardados en el almacenamiento local
function cargarDatosGuardados() {
  const datosJson = localStorage.getItem('formularioDatos');

  if (datosJson) {
    const datos = JSON.parse(datosJson);
    document.querySelector('#nombre').value = datos.nombre;
    document.querySelector('#email').value = datos.email;
    document.querySelector('#mensaje').value = datos.mensaje;
  }
}

cargarDatosGuardados();

// Cerrar la ventana modal al hacer clic en el botón de cerrar
const modalCerrar = modalExito.querySelector('.close');
modalCerrar.addEventListener('click', function() {
  closeModal();
});

function closeModal() {
  modalExito.style.display = 'none';
  modalExito.classList.remove('show');
}



document.addEventListener('DOMContentLoaded', function() {
  const links = document.querySelectorAll('a[data-bs-target^="#"]');
  links.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const target = document.querySelector(this.getAttribute('data-bs-target'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
          });
        }
      });
    });
});