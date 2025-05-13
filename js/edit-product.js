// edit-product.js
import { goBack } from './utils.js';
  
  (async function() {
    // Get product ID from URL
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    if (!id) {
      alert('No product ID provided.');
      goBack();
      return;
    }
  
    // Load products
    const localData = loadProductsLocally();
    const products = localData || await fetchProducts();
  
    // Find product
    const product = products.find(p => p.id === id);
    if (!product) {
      alert('Product not found.');
      goBack();
      return;
    }
  
    // Populate form
    document.getElementById('product-id').value = product.id;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('link').value = product.link;
    document.getElementById('images').value = product.images.join('\n');
  
    // Render carousel preview
    const carousel = document.getElementById('carousel-preview');
    carousel.innerHTML = product.images.map(src => `<img src="${src}" alt="" class="carousel-img">`).join('');
  })();
  
  // On form submit, update product
  document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const id     = Number(document.getElementById('product-id').value);
    const name   = document.getElementById('name').value.trim();
    const price  = parseFloat(document.getElementById('price').value);
    const link   = document.getElementById('link').value.trim();
    const images = document.getElementById('images').value
                     .split('\n')
                     .map(u => u.trim())
                     .filter(u => u);
  
    if (!name || isNaN(price) || !link || images.length === 0) {
        alert('Please fill in all fields correctly.');
        return;
    }
  
    // Load and update products
    const products = loadProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) {
      alert('Error: product not found.');
      return;
    }
  
    products[idx] = { id, name, price, link, images };
    saveProducts(products);

  
    alert('Product updated successfully!');
    window.location.href = 'admin.html';
  });