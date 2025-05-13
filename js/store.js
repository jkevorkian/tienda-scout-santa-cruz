// store.js
import { loadProducts } from './utils.js';

let products = [];

function loadAndRenderProducts() {
    products = loadProducts();
    renderProducts();
  }
  
  // then just call:
document.addEventListener('DOMContentLoaded', loadAndRenderProducts);  

function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        const div = document.createElement('div');
        div.className = "product";
        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <div class="carousel">
                ${product.images.map(img => `<img src="${img}" alt="${product.name} image">`).join('')}
            </div>
            <a href="${product.link}" target="_blank">
                <button>Buy Now</button>
            </a>
        `;
        productList.appendChild(div);
    });
}
