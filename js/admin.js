import { loadProductsLocally, saveProductsLocally, goBack, goToAdd, goToOrders } from './utils.js';

let products = [];

// Ensure DOM is fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('admin-product-list');
    const manageProductsBtn = document.getElementById('manageProductsBtn');
    const productsSection = document.getElementById('products-section');

    // Event listener for "Manage Products" button
    manageProductsBtn?.addEventListener('click', () => {
        loadProducts();
        productsSection.classList.remove('hidden');
    });

    // Event delegation for dynamically created buttons
    productsContainer.addEventListener('click', (event) => {
        const target = event.target;

        if (target.matches('.edit-btn')) {
            const productId = target.dataset.id;
            editProduct(productId);
        } else if (target.matches('.delete-btn')) {
            const productId = target.dataset.id;
            deleteProduct(productId);
        }
    });
});

// Load products from localStorage or static JSON file
async function loadProducts() {
    try {
        // Attempt to load products from localStorage
        products = loadProductsLocally();

        // If no products in localStorage, fetch from static JSON file
        if (!products || products.length === 0) {
            const response = await fetch('data/products.json');
            if (!response.ok) throw new Error('Failed to fetch products.json');
            products = await response.json();
            saveProductsLocally(products); // Save to localStorage for future use
        }

        renderProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        productsContainer.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    }
}

// Change active slide in the carousel
function changeSlide(productId, direction) {
    const productElement = document.querySelector(`.product-item[data-id="${productId}"]`);
    if (!productElement) return;

    const slides = productElement.querySelectorAll('.carousel-slide');
    let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

    // Remove 'active' class from current slide
    slides[activeIndex].classList.remove('active');

    // Calculate new index based on direction
    activeIndex = (activeIndex + direction + slides.length) % slides.length;

    // Add 'active' class to the new slide
    slides[activeIndex].classList.add('active');
}

// Render products in admin section
function renderProducts(products) {
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No products yet.</p>';
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <div class="product-item" data-id="${product.id}">
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <p>${product.description || 'No description available'}</p>
            
            <div class="carousel">
                ${product.images.map((img, index) => `
                    <img src="${img}" class="carousel-slide ${index === 0 ? 'active' : ''}" alt="${product.name} image">
                `).join('')}
                <div class="carousel-controls">
                    <button class="prev-slide" data-id="${product.id}">&#10094;</button>
                    <button class="next-slide" data-id="${product.id}">&#10095;</button>
                </div>
            </div>

            <button class="edit-btn" data-id="${product.id}">Edit</button>
            <button class="delete-btn" data-id="${product.id}">Delete</button>
        </div>
    `).join('');

    // Attach carousel event listeners
    document.querySelectorAll('.prev-slide').forEach(button => {
        button.addEventListener('click', () => changeSlide(button.dataset.id, -1));
    });
    document.querySelectorAll('.next-slide').forEach(button => {
        button.addEventListener('click', () => changeSlide(button.dataset.id, 1));
    });
}

// Edit a product
function editProduct(id) {
    window.location.href = `edit-product.html?id=${id}`;
}

// Delete a product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== parseInt(id, 10));
        saveProductsLocally(products);
        renderProducts(products);
        alert('Product deleted successfully.');
    }
}
