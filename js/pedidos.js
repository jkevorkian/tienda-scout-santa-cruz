const hojaID = '149AZ8LZUXG2W2CMTtvU93hlvPZEwMk4Efd6rODXK4S4';
const pedidosSheet = 'pedidos';
const productosSheet = 'productos';

const pedidosURL = `https://opensheet.elk.sh/${hojaID}/${pedidosSheet}`;
const productosURL = `https://opensheet.elk.sh/${hojaID}/${productosSheet}`;

let productos = []; // Array of products
let productosPorID = {}; // Map of product.id -> producto
let pedidos = [];

async function cargarPedidos() {
  try {
    const resProductos = await fetch(productosURL);
    productos = await resProductos.json();
    productosPorID = {};
    productos.forEach(p => {
      const idNum = parseInt(p.id);
      if (!isNaN(idNum)) productosPorID[idNum] = p;
    });

    console.log("Productos cargados:", productos);

    const resPedidos = await fetch(pedidosURL);
    pedidos = await resPedidos.json();
    console.log("Pedidos cargados:", pedidos);

    renderTabla(pedidos);
  } catch (err) {
    console.error("Error cargando datos:", err);
    document.getElementById('tabla-pedidos-container').innerHTML = '<p>Error al cargar pedidos.</p>';
  }
}

function renderTabla(data) {
  if (!data.length) {
    document.getElementById('tabla-pedidos-container').innerHTML = '<p>No hay pedidos.</p>';
    return;
  }

  let html = '<table class="tabla-pedidos"><thead><tr>';
  html += `
    <th>Fecha</th>
    <th>Estado</th>
    <th>Items</th>
    <th>Monto</th>
    <th>Nombre</th>
    <th>Email</th>
    <th>Teléfono</th>
    <th>Dirección</th>
  `;
  html += '</tr></thead><tbody>';

  data.forEach(pedido => {
    const monto = parseFloat(pedido['monto']);
    html += '<tr>';
    html += `<td>${pedido['Marca temporal'] || ''}</td>`;
    html += `<td>${pedido['estado'] || ''}</td>`;
    html += `<td>${parsearItems(pedido['items'])}</td>`;
    html += `<td>$${!isNaN(monto) ? monto.toLocaleString() : '0'}</td>`;
    html += `<td>${pedido['nombre'] || ''}</td>`;
    html += `<td>${pedido['email'] || ''}</td>`;
    html += `<td>${pedido['telefono'] || ''}</td>`;
    html += `<td>${pedido['direccion'] || ''}</td>`;
    html += '</tr>';
  });

  html += '</tbody></table>';
  document.getElementById('tabla-pedidos-container').innerHTML = html;
}


function parsearItems(itemsString) {
  if (!itemsString || typeof itemsString !== 'string' || itemsString.trim() === '') {
    console.warn("Items vacío o indefinido:", itemsString);
    return '-';
  }

  try {
    console.log("Intentando parsear Items:", itemsString);
    const items = JSON.parse(itemsString);
    return items.map(item => {
      const producto = productosPorID[item.id];
      return producto ? `${producto.nombre} (x${item.cantidad})` : `Producto ID ${item.id} (x${item.cantidad})`;
    }).join(', ');
  } catch (err) {
    console.error("❌ Error parseando Items JSON:", err, itemsString);
    return `❌ Error JSON`;
  }
}

document.getElementById('filtro').addEventListener('input', function () {
  const texto = this.value.toLowerCase();
  const filas = document.querySelectorAll('.tabla-pedidos tbody tr');
  filas.forEach(fila => {
    fila.style.display = fila.textContent.toLowerCase().includes(texto) ? '' : 'none';
  });
});

document.addEventListener('DOMContentLoaded', cargarPedidos);
