const hojaID = '149AZ8LZUXG2W2CMTtvU93hlvPZEwMk4Efd6rODXK4S4';
const hojaNombre = 'productos';
const url = `https://opensheet.elk.sh/${hojaID}/${hojaNombre}`;

async function cargarStock() {
  const res = await fetch(url);
  const productos = await res.json();

  let html = `
    <table class="tabla-stock">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
  `;
  productos.forEach(prod => {
    html += `
      <tr>
        <td>${prod.nombre}</td>
        <td>${prod.stock || 'Sin dato'}</td>
      </tr>
    `;
  });
  html += '</tbody></table>';

  document.getElementById('stock-container').innerHTML = html;
}

document.addEventListener('DOMContentLoaded', cargarStock);