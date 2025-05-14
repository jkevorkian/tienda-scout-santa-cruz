const hojaID = '149AZ8LZUXG2W2CMTtvU93hlvPZEwMk4Efd6rODXK4S4';
const hojaNombre = 'pedidos';
const url = `https://opensheet.elk.sh/${hojaID}/${hojaNombre}`;

let pedidos = [];
let ordenColumna = null;
let ordenAsc = true;

async function cargarPedidos() {
  const respuesta = await fetch(url);
  pedidos = await respuesta.json();
  renderTabla(pedidos);
}

function renderTabla(data) {
  if (!data.length) {
    document.getElementById('tabla-pedidos-container').innerHTML = '<p>No hay pedidos.</p>';
    return;
  }
  const columnas = Object.keys(data[0]);
  let html = '<table class="tabla-pedidos"><thead><tr>';
  columnas.forEach(col => {
    html += `<th data-col="${col}">${col} <span class="orden"></span></th>`;
  });
  html += '</tr></thead><tbody>';
  data.forEach(pedido => {
    html += '<tr>';
    columnas.forEach(col => {
      html += `<td>${pedido[col]}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  document.getElementById('tabla-pedidos-container').innerHTML = html;

  // Eventos de orden
  document.querySelectorAll('.tabla-pedidos th').forEach(th => {
    th.onclick = () => ordenarPorColumna(th.dataset.col);
    th.querySelector('.orden').textContent =
      ordenColumna === th.dataset.col ? (ordenAsc ? '▲' : '▼') : '';
  });
}

function ordenarPorColumna(col) {
  if (ordenColumna === col) {
    ordenAsc = !ordenAsc;
  } else {
    ordenColumna = col;
    ordenAsc = true;
  }
  const datosOrdenados = [...pedidos].sort((a, b) => {
    if (!isNaN(a[col]) && !isNaN(b[col])) {
      return ordenAsc ? a[col] - b[col] : b[col] - a[col];
    }
    return ordenAsc
      ? String(a[col]).localeCompare(String(b[col]))
      : String(b[col]).localeCompare(String(a[col]));
  });
  renderTabla(datosOrdenados);
}

document.getElementById('filtro').addEventListener('input', function () {
  const texto = this.value.toLowerCase();
  const filtrados = pedidos.filter(pedido =>
    Object.values(pedido).some(val =>
      String(val).toLowerCase().includes(texto)
    )
  );
  renderTabla(filtrados);
});

document.addEventListener('DOMContentLoaded', cargarPedidos);