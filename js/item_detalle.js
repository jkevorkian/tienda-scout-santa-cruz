const hojaID = '149AZ8LZUXG2W2CMTtvU93hlvPZEwMk4Efd6rODXK4S4';
const hojaNombre = 'productos';
const url = `https://opensheet.elk.sh/${hojaID}/${hojaNombre}`;

// Obtener ID del producto desde la URL
const params = new URLSearchParams(window.location.search);
const itemId = parseInt(params.get('id'));

async function cargarDetalle() {
    try {
        const res = await fetch(url);
        const productos = await res.json();

        if (!productos[itemId]) {
            document.getElementById('item-detalle-container').innerHTML = '<p>Producto no encontrado.</p>';
            return;
        }

        const prod = productos[itemId];

        // Obtener imágenes
        let imagenes = [];
        if (prod.imagenes) {
            imagenes = prod.imagenes.includes('|')
                ? prod.imagenes.split('|').map(url => url.trim())
                : [prod.imagenes.trim()];
        }
        if (imagenes.length === 0 || !imagenes[0]) {
            imagenes = ['https://www.carrielou.co.uk/image/cache/placeholder-550x550.png'];
        }

        let currentIndex = 0;

        const container = document.getElementById('item-detalle-container');
        container.innerHTML = `
      <div class="detalle-producto">
        <div class="carrusel">
          <button class="prev">&#10094;</button>
          <img src="${imagenes[0]}" alt="${prod.nombre}" class="imagen-activa fade">
          <button class="next">&#10095;</button>
        </div>
        <div class="detalle-info">
          <h2>${prod.nombre}</h2>
          <p>${prod.descripcion}</p>
          <p><strong>Precio: $${prod.precio}</strong></p>
          <div class="botones-compra">
            <button class="btn-comprar" onclick="agregarAlCarrito(${itemId})">Añadir al carrito</button>
            <button class="btn-comprar" onclick="comprar(${itemId})">Comprar</button>
          </div>
        </div>
    `;

        const img = container.querySelector('.carrusel img');
        const prev = container.querySelector('.prev');
        const next = container.querySelector('.next');
        img.addEventListener('click', () => {
            crearLightbox(imagenes, currentIndex);
        });

        const cambiarImagen = (i) => {
            img.classList.remove('fade');
            void img.offsetWidth;
            img.src = imagenes[i];
            img.classList.add('fade');
        };

        prev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
            cambiarImagen(currentIndex);
        });

        next.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % imagenes.length;
            cambiarImagen(currentIndex);
        });

    } catch (err) {
        console.error("Error al cargar el detalle:", err);
        document.getElementById('item-detalle-container').innerHTML = '<p>Error al cargar el producto.</p>';
    }
}

function crearLightbox(imagenes, startIndex) {
    let currentIndex = startIndex;

    // Create lightbox container
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');

    // Inner content
    lightbox.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-prev">&#10094;</button>
        <img src="${imagenes[currentIndex]}" alt="zoomed image">
        <button class="lightbox-next">&#10095;</button>
      </div>
    `;

    document.body.appendChild(lightbox);

    const img = lightbox.querySelector('img');
    const prev = lightbox.querySelector('.lightbox-prev');
    const next = lightbox.querySelector('.lightbox-next');

    const updateImage = (i) => {
        img.src = imagenes[i];
    };

    prev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
        updateImage(currentIndex);
    });

    next.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % imagenes.length;
        updateImage(currentIndex);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.remove();
    });

    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') {
            lightbox.remove();
            document.removeEventListener('keydown', onKey);
        }
    });
}

function comprar(id) {
    const almacenado = localStorage.getItem('carrito');
    const carrito = almacenado ? JSON.parse(almacenado) : [];

    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ id: id, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    window.location.href = `confirmacion_compra.html`;
}

function agregarAlCarrito(id) {
  const almacenado = localStorage.getItem('carrito');
  const carrito = almacenado ? JSON.parse(almacenado) : [];

  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarToast("Producto añadido al carrito");
  actualizarContadorCarrito();
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = mensaje;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = totalItems;
}



document.addEventListener('DOMContentLoaded', () => {
  cargarDetalle();
  actualizarContadorCarrito();
});

