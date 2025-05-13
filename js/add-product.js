// Example for js/orders.js
import { loadProducts, saveProducts, goBack } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('add-product-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const link = document.getElementById('link').value.trim();
    const images = document.getElementById('images').value
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

    if (!name || isNaN(price) || !link || images.length === 0) {
        alert('Please fill in all fields correctly.');
        return;
    }

    const newProduct = {
        id: Date.now(),
        name,
        price,
        link,
        images
    };

    let products = loadProducts();
    products.push(newProduct);
    saveProducts(products);

    alert('Product added successfully!');
    window.location.href = 'admin.html';
  });
});
