const hojaID = '149AZ8LZUXG2W2CMTtvU93hlvPZEwMk4Efd6rODXK4S4'; //ID real del Google Sheet
const hojaNombre = 'productos'; // nombre de la hoja dentro del sheet
const url = `https://opensheet.elk.sh/${hojaID}/${hojaNombre}`;

async function cargarProductos() {
    try {
      const respuesta = await fetch(url);
      const productos = await respuesta.json();
  
      console.log("Datos recibidos:", productos);
  
      const contenedor = document.getElementById('productos');
  
      productos.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'producto';
      
        // Obtener imágenes como array
        let imagenes = [];
      
        if (prod.imagenes) {
          imagenes = prod.imagenes.includes('|')
            ? prod.imagenes.split('|').map(url => url.trim())
            : [prod.imagenes.trim()];
        }
      
        // Imagen de reemplazo si no hay ninguna
        if (imagenes.length === 0 || !imagenes[0]) {
          imagenes = ['https://www.carrielou.co.uk/image/cache/placeholder-550x550.png'];
        }
      
        const imagenID = `carrusel-${index}`;
      
        const galeriaHTML = `
          <div class="carrusel" id="${imagenID}">
            <button class="prev">&#10094;</button>
            <img src="${imagenes[0]}" alt="${prod.nombre}" class="imagen-activa fade">
            <button class="next">&#10095;</button>
          </div>
        `;
      
        let stockMsg = '';
        if (parseInt(prod.stock) <= 0) {
          stockMsg = `<p style="color:#e53935;font-weight:bold;">Sin stock</p>`;
        }
      
        card.innerHTML = `
          ${galeriaHTML}
          <h3>${prod.nombre}</h3>
          <p>${prod.descripcion}</p>
          <p><strong>$${prod.precio}</strong></p>
          ${stockMsg}
        `;

        contenedor.appendChild(card);
        card.addEventListener('click', (e) => {
          if (e.target.closest('button.prev') || e.target.closest('button.next')) return;
          window.location.href = `html/item_detalle.html?id=${index}`;
        });
        contenedor.appendChild(card);
      
        // Lógica del carrusel
        let currentIndex = 0;
        const carrusel = document.getElementById(imagenID);
        const imgTag = carrusel.querySelector('img');
        const prevBtn = carrusel.querySelector('.prev');
        const nextBtn = carrusel.querySelector('.next');
      
        const cambiarImagen = (indice) => {
          imgTag.classList.remove('fade'); // reiniciar animación
          void imgTag.offsetWidth; // trigger reflow
          imgTag.src = imagenes[indice];
          imgTag.classList.add('fade');
        };
      
        prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + imagenes.length) % imagenes.length;
          cambiarImagen(currentIndex);
        });
      
        nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % imagenes.length;
          cambiarImagen(currentIndex);
        });
      });
      
      
      
      
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }
  
document.addEventListener('DOMContentLoaded', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = totalItems;
});
document.addEventListener('DOMContentLoaded', cargarProductos);
