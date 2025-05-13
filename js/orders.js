// orders.js
import { goBack } from './utils.js';

let orders = [];
let products = [];

async function loadOrders() {
  // Load products for lookup
  const localProducts = loadProductsLocally();
  products = localProducts || await fetchProducts();

  // Load orders
  const response = await fetch('data/orders.json');
  orders = await response.json();
  renderOrders();
}

function renderOrders() {
  const filter = document.getElementById('status-filter').value;
  const sortOrder = document.getElementById('sort-order').value;
  let filtered = orders.filter(o => filter === 'All' || o.status === filter);

  filtered.sort((a, b) => {
    return sortOrder === 'asc'
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  const container = document.getElementById('orders-list');
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<p>No orders found.</p>';
    return;
  }

  filtered.forEach(order => {
    const div = document.createElement('div');
    div.className = 'order-card';
    div.innerHTML = `
      <h3>Order #${order.orderId}</h3>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
      <p><strong>Status:</strong>
        <select data-id="${order.orderId}" class="status-select">
          <option${order.status==='Pending'? ' selected':''}>Pending</option>
          <option${order.status==='Completed'? ' selected':''}>Completed</option>
          <option${order.status==='Cancelled'? ' selected':''}>Cancelled</option>
        </select>
      </p>
      <h4>Items:</h4>
      <ul>
        ${order.items.map(item => {
          const prod = products.find(p => p.id === item.productId) || {};
          return `<li>${prod.name || 'Unknown'} x ${item.quantity}</li>`;
        }).join('')}
      </ul>
      <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
    `;
    container.appendChild(div);
  });

  // Add listeners to status selects
  document.querySelectorAll('.status-select').forEach(sel => {
    sel.addEventListener('change', e => {
      const id = Number(e.target.dataset.id);
      const order = orders.find(o => o.orderId === id);
      order.status = e.target.value;
    });
  });
}

// Filters and sorting
document.addEventListener('DOMContentLoaded', loadOrders);
document.getElementById('status-filter')?.addEventListener('change', renderOrders);
document.getElementById('sort-order')?.addEventListener('change', renderOrders);