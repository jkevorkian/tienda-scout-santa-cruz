const hojaID = '149AZ8LZUXG2W2CMTtvU93hlvPZEwMk4Efd6rODXK4S4';
const hojaNombre = 'productos';
const url = `https://opensheet.elk.sh/${hojaID}/${hojaNombre}`;

let productos = [];
let carrito = [];

async function cargarProductos() {
    try {
        const res = await fetch(url);
        productos = await res.json();
        cargarCarrito();
    } catch (err) {
        console.error("Error cargando productos:", err);
    }
}

function cargarCarrito() {
    const almacenado = localStorage.getItem('carrito');
    carrito = almacenado ? JSON.parse(almacenado) : [];

    renderCarrito();
    validarFormulario();
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function renderCarrito() {
    const lista = document.getElementById('carrito-lista');
    lista.innerHTML = '';

    if (carrito.length === 0) {
        lista.innerHTML = '<p>No hay productos en el carrito.</p>';
        document.getElementById('precio-total').textContent = '$0';
        return;
    }

    carrito.forEach((item, index) => {
        const prod = productos.find(p => parseInt(p.id) === item.id || productos.indexOf(p) === item.id);
        const precioUnit = parseFloat(prod.precio);
        const subtotal = (precioUnit * item.cantidad).toFixed(2);

        const div = document.createElement('div');
        div.className = 'item-carrito';
        div.innerHTML = `
      <span><strong>${prod.nombre}</strong> - $${precioUnit}</span>
      <div class="stepper">
        <button type="button" onclick="cambiarCantidad(${index}, -1)">-</button>
        <span>${item.cantidad}</span>
        <button type="button" onclick="cambiarCantidad(${index}, 1)">+</button>
        <button class="eliminar" onclick="eliminarItem(${index})">✕</button>
      </div>
      <p>Subtotal: $${subtotal}</p>
    `;
        lista.appendChild(div);
    });

    const total = carrito.reduce((acc, item) => {
        const prod = productos.find(p => parseInt(p.id) === item.id || productos.indexOf(p) === item.id);
        return acc + parseFloat(prod.precio) * item.cantidad;
    }, 0);

    document.getElementById('precio-total').textContent = `$${total.toFixed(2)}`;
}

function cambiarCantidad(index, delta) {
    carrito[index].cantidad += delta;
    if (carrito[index].cantidad < 1) carrito[index].cantidad = 1;
    guardarCarrito();
    renderCarrito();
    validarFormulario();
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    guardarCarrito();
    renderCarrito();
    validarFormulario();
}

function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const valido = nombre && (email || telefono) && carrito.length > 0;
    document.getElementById('btn-comprar').disabled = !valido;
}

document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();

    ['nombre', 'email', 'telefono'].forEach(id => {
        document.getElementById(id).addEventListener('input', validarFormulario);
    });

document.getElementById('form-compra').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  const monto = carrito.reduce((acc, item) => {
    const prod = productos.find(p => parseInt(p.id) === item.id || productos.indexOf(p) === item.id);
    return acc + parseFloat(prod.precio) * item.cantidad;
  }, 0);

  const payload = {
    estado: 'pendiente',
    items_id: carrito,
    monto: parseFloat(monto.toFixed(2)),
    aclaraciones: `Nombre: ${nombre} | Email: ${email} | Tel: ${telefono} | Dirección: ${direccion}`
  };

  const query = encodeURIComponent(JSON.stringify(payload));
  const scriptURL = `https://script.google.com/macros/s/AKfycbyEpwdZTjDYsUA28pobduqicPIp8JoVVl2Y_Gw-f4gOTz06MQ77-b-7aC2y47Forq_l/exec?payload=${query}`;

  try {
    const res = await fetch(scriptURL);
    const result = await res.json();
    if (result.success) {
      alert('✅ Pedido registrado con éxito (ID: ' + result.id + ')');
      localStorage.removeItem('carrito');
      location.reload();
    } else {
      alert('❌ Ocurrió un error al registrar el pedido: ' + result.error);
    }
  } catch (err) {
    console.error('Error al enviar pedido:', err);
    alert('❌ Error de conexión con el servidor.');
  }
});
});
window.cambiarCantidad = cambiarCantidad;
window.eliminarItem = eliminarItem;
