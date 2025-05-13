// utils.js

const STORAGE_KEY = 'scout_santacruz_products';

export function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function loadProductsLocally() {
  return loadProducts();
}

export function safeLoadProducts() {
  try {
    return loadProducts();
  } catch (error) {
    console.error('Failed to load products from localStorage:', error);
    return [];
  }
}

export async function fetchProducts() {
  const response = await fetch('data/products.json');
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return await response.json();
}

// Back to dashboard
export function goBack() {
    window.location.href = 'admin.html';
}

// Navigate to Add Product page
export function goToAdd() {
    window.location.href = 'add-product.html';
}

// Navigate to Orders page
export function goToOrders() {
    window.location.href = 'orders.html';
}

export function saveProductsLocally(products) {
    saveProducts(products);
}

window.goBack = goBack;
window.goToAdd = goToAdd;
window.goToOrders = goToOrders;
window.loadProducts = loadProducts;
window.loadProducts = loadProducts;
window.saveProducts = saveProducts;

