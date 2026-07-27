/* ==========================================================================
   GNARLIE.CTH - MASTER ENGINE SCRIPT (main.js)
   ========================================================================== */

// --------------------
// 1. STATE MANAGEMENT
// --------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateMiniCart();
}

// --------------------
// 2. MINI CART DROPDOWN UPDATE
// --------------------
function updateMiniCart() {
  const miniCart = document.querySelector('.mini-cart');
  if (!miniCart) return;

  if (cart.length === 0) {
    miniCart.innerHTML = '<p class="empty-msg">CART: EMPTY</p>';
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  miniCart.innerHTML = `
    <p><strong>${totalItems} ITEMS</strong> | <strong class="price-highlight">R${totalPrice}</strong></p>
    <a href="cart.html" class="btn">VIEW CART</a>
  `;
}

// --------------------
// 3. ADD TO CART HANDLER
// --------------------
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;

  const product = btn.getAttribute('data-product');
  const price = parseInt(btn.getAttribute('data-price'), 10);
  const sizeId = btn.getAttribute('data-size');
  const sizeSelect = document.getElementById(sizeId);
  const size = sizeSelect ? sizeSelect.value : 'DEFAULT';

  // Check if item already exists in cart with same size
  const existingItem = cart.find(item => item.product === product && item.size === size);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, price, size, quantity: 1 });
  }

  saveCart();

  // Show inline feedback link (View Cart)
  const viewCartLink = btn.nextElementSibling;
  if (viewCartLink && viewCartLink.classList.contains('view-cart-link')) {
    viewCartLink.classList.remove('hidden');
  }

  // Visual feedback on button
  const originalText = btn.textContent;
  btn.textContent = 'ADDED TO CART ✓';
  btn.style.background = '#0088cc';
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 1500);
});

// --------------------
// 4. RENDER CART (cart.html)
// --------------------
function renderCart() {
  const tbody = document.querySelector('#cart-table tbody');
  const totalElement = document.getElementById('cart-total');
  
  if (!tbody) return;

  tbody.innerHTML = '';

  if (cart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem;">YOUR CART IS CURRENTLY EMPTY.</td></tr>`;
    if (totalElement) totalElement.textContent = 'R0';
    return;
  }

  let grandTotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${item.product}</strong></td>
      <td>${item.size}</td>
      <td>R${item.price}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="qty">
      </td>
      <td>R${itemTotal}</td>
      <td><button class="remove" data-index="${index}">✕</button></td>
    `;
    tbody.appendChild(row);
  });

  if (totalElement) {
    totalElement.textContent = `R${grandTotal}`;
  }
}

// --------------------
// 5. CART TABLE INTERACTIONS (QUANTITY & REMOVE)
// --------------------
document.addEventListener('input', (e) => {
  if (e.target.classList.contains('qty')) {
    const index = parseInt(e.target.dataset.index, 10);
    const newQty = parseInt(e.target.value, 10);

    if (newQty > 0) {
      cart[index].quantity = newQty;
      saveCart();
      renderCart();
    }
  }
});

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove')) {
    const index = parseInt(e.target.dataset.index, 10);
    cart.splice(index, 1);
    saveCart();
    renderCart();
  }
});

// --------------------
// 6. INITIALIZATION
// --------------------
document.addEventListener('DOMContentLoaded', () => {
  updateMiniCart();
  if (document.querySelector('#cart-table')) {
    renderCart();
  }
});
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.add-to-cart');
  if (!btn) return;

  // Prevent form submission/page reload if inside a form
  e.preventDefault();

  const product = btn.getAttribute('data-product');
  const price = parseInt(btn.getAttribute('data-price'), 10) || 0;
  
  // Mobile-safe select lookup: Try ID first, then relative search in same card
  const sizeId = btn.getAttribute('data-size');
  let sizeSelect = sizeId ? document.getElementById(sizeId) : null;
  
  if (!sizeSelect) {
    const parentCard = btn.closest('.dash-card, .postcard, .product-detail, .card');
    if (parentCard) sizeSelect = parentCard.querySelector('select');
  }

  const size = sizeSelect ? sizeSelect.value : 'M'; // Defaultfallback

  // Add/Increment in cart array
  const existingItem = cart.find(item => item.product === product && item.size === size);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ product, price, size, quantity: 1 });
  }

  saveCart();

  // Mobile feedback
  const originalText = btn.textContent;
  btn.textContent = 'ADDED ✓';
  btn.style.background = '#0088cc';
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 1500);
});
/* ==========================================================================
   INBUILT SVG NAVIGATION ENGINE (STACKED ICON + TEXT)
   ========================================================================== */
function transformNavToIcons() {
  const navLinks = document.querySelectorAll('#mainNav a');
  if (!navLinks.length) return;

  const navConfig = {
    'index.html': {
      label: 'HOME',
      svg: `<svg class="nav-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square" stroke-linejoin="miter">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>`
    },
    'shop.html': {
      label: 'SHOP',
      svg: `<svg class="nav-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square" stroke-linejoin="miter">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>`
    },
    'product.html': {
      label: 'PRODUCT',
      svg: `<svg class="nav-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square" stroke-linejoin="miter">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>`
    },
    'cart.html': {
      label: 'CART',
      svg: `<svg class="nav-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="square" stroke-linejoin="miter">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>`
    }
  };

  navLinks.forEach(link => {
    const rawHref = link.getAttribute('href') || '';
    const cleanHref = rawHref.split('#')[0]; // Handles product.html#item-01 etc.
    
    if (navConfig[cleanHref]) {
      const { svg, label } = navConfig[cleanHref];
      link.innerHTML = `
        ${svg}
        <span class="nav-label">${label}</span>
      `;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  transformNavToIcons();
});