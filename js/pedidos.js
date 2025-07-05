const hojaID = '149AZ8LZUXG2W2CMTtvU93hlvPZEwMk4Efd6rODXK4S4';
const pedidosSheet = 'pedidos';
const productosSheet = 'productos';

const pedidosURL = `https://opensheet.elk.sh/${hojaID}/${pedidosSheet}`;
const productosURL = `https://opensheet.elk.sh/${hojaID}/${productosSheet}`;

let productos = [];
let productosPorID = {};
let pedidos = [];

async function cargarPedidos() {
  try {
    const resProductos = await fetch(productosURL);
    productos = await resProductos.json();
    productos.forEach(p => {
      const idNum = parseInt(p.id);
      if (!isNaN(idNum)) productosPorID[idNum] = p;
    });

    const resPedidos = await fetch(pedidosURL);
    pedidos = await resPedidos.json();

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
    <th data-col="Marca temporal">Fecha</th>
    <th data-col="estado">Estado</th>
    <th data-col="items">Items</th>
    <th data-col="monto">Monto</th>
    <th data-col="nombre">Nombre</th>
    <th data-col="email">Email</th>
    <th data-col="telefono">Teléfono</th>
    <th data-col="direccion">Dirección</th>
    <th data-col="notas">Notas</th>
  `;
  html += '</tr><tr class="filtros">';
  ["Marca temporal", "estado", "items", "monto", "nombre", "email", "telefono", "direccion", "notas"].forEach(col => {
    html += `<td><input type="text" data-filtro="${col}" placeholder="Filtrar..."/></td>`;
  });
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
    html += `<td>${pedido['notas'] || ''}</td>`;
    html += '</tr>';
  });

  html += '</tbody></table>';
  document.getElementById('tabla-pedidos-container').innerHTML = html;

  document.querySelectorAll('.tabla-pedidos th').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.getAttribute('data-col');
      if (!col) return;
      const ordenAsc = th.classList.toggle('orden-asc');
      th.classList.toggle('orden-desc', !ordenAsc);

      const dataOrdenada = [...data].sort((a, b) => {
        const aVal = (a[col] || '').toString().toLowerCase();
        const bVal = (b[col] || '').toString().toLowerCase();
        return ordenAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      renderTabla(dataOrdenada);
    });
  });

  setTimeout(() => {
    document.querySelectorAll('input[data-filtro]').forEach(input => {
      input.addEventListener('input', () => {
        const filtros = {};
        document.querySelectorAll('input[data-filtro]').forEach(i => {
          const val = i.value.trim().toLowerCase();
          if (val) filtros[i.dataset.filtro] = val;
        });

        const filtrados = pedidos.filter(pedido => {
          return Object.entries(filtros).every(([col, val]) =>
            (pedido[col] || '').toLowerCase().includes(val)
          );
        });

        renderTabla(filtrados);
      });
    });
  }, 0);
}

function parsearItems(itemsString) {
  if (!itemsString || typeof itemsString !== 'string' || itemsString.trim() === '') {
    return '-';
  }

  try {
    const items = JSON.parse(itemsString);
    return items.map(item => {
      const producto = productosPorID[item.id];
      return producto ? `${producto.nombre} (x${item.cantidad})` : `Producto ID ${item.id} (x${item.cantidad})`;
    }).join(', ');
  } catch (err) {
    return `❌ Error JSON`;
  }
}

document.addEventListener('DOMContentLoaded', cargarPedidos);
