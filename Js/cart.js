// --- WhatsApp Checkout Engine ---
const WHATSAPP_BUSINESS_NUMBER = "27660460301";

function checkoutViaWhatsApp() {
  const currentCart = JSON.parse(localStorage.getItem('gnarlie_cart')) || [];

  if (currentCart.length === 0) {
    alert("YOUR DISPATCH MANIFEST IS EMPTY.");
    return;
  }

  let subtotal = 0;
  
  // Build formatted text message for WhatsApp
  let message = `*G★N DISPATCH MANIFEST // NEW ORDER*\n`;
  message += `===============================\n\n`;

  currentCart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const sizeMatch = item.name.match(/\(([^)]+)\)/);
    const size = sizeMatch ? sizeMatch[1] : 'M';
    const cleanName = item.name.replace(/\s*\([^)]*\)/, '');

    message += `*${index + 1}. ${cleanName}*\n`;
    message += `   • Size: ${size}\n`;
    message += `   • Qty: ${item.qty}\n`;
    message += `   • Price: R${itemTotal}\n\n`;
  });

  message += `===============================\n`;
  message += `*TOTAL AMOUNT: R${subtotal}*\n`;
  message += `===============================\n\n`;
  message += `Please confirm stock availability and payment details for delivery.`;

  // Encode text for URL format
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;

  // Redirect to WhatsApp
  window.open(whatsappURL, '_blank');
}

// --- Renders full Dispatch Terminal Table on cart.html ---
function renderCartPage() {
  const cartTableBody = document.getElementById('cart-items-body');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartTableBody) return;

  const currentCart = JSON.parse(localStorage.getItem('gnarlie_cart')) || [];

  if (currentCart.length === 0) {
    cartTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding: 40px; font-weight: bold;">
          DISPATCH MANIFEST EMPTY. <a href="shop.html" style="color:#000; text-decoration:underline;">RETURN TO SHOP</a>
        </td>
      </tr>
    `;
    if (subtotalEl) subtotalEl.textContent = 'R0';
    if (totalEl) totalEl.textContent = 'R0';
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.onclick = null;
    }
    return;
  }

  let subtotal = 0;

  cartTableBody.innerHTML = currentCart.map((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const sizeMatch = item.name.match(/\(([^)]+)\)/);
    const size = sizeMatch ? sizeMatch[1] : 'M';
    const cleanName = item.name.replace(/\s*\([^)]*\)/, '');

    return `
      <tr>
        <td class="product-cell">
          <div class="cart-item-preview">
            <img src="${item.image || 'Assets/GNARLIE CAMO LOGO.png'}" alt="${cleanName}">
            <span class="item-name">${cleanName}</span>
          </div>
        </td>
        <td class="size-cell"><span class="size-badge">${size}</span></td>
        <td class="price-cell">R${item.price}</td>
        <td class="qty-cell">
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
          </div>
        </td>
        <td class="total-cell">R${itemTotal}</td>
        <td class="action-cell">
          <button class="remove-btn" onclick="removeFromCart(${index})" aria-label="Remove item">&times;</button>
        </td>
      </tr>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `R${subtotal}`;
  if (totalEl) totalEl.textContent = `R${subtotal}`;
}

/* --- DRAWER CHECKOUT DIRECT ROUTE --- */
function initDrawerCheckout() {
  const drawerCheckoutBtn = document.querySelector('.cart-drawer .checkout-btn')
    || document.querySelector('.cart-drawer button.checkout')
    || document.getElementById('drawerCheckoutBtn');

  if (drawerCheckoutBtn) {
    // Clone and replace to strip any legacy alert event listeners
    const cleanBtn = drawerCheckoutBtn.cloneNode(true);
    drawerCheckoutBtn.parentNode.replaceChild(cleanBtn, drawerCheckoutBtn);

    cleanBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!cart || cart.length === 0) {
        alert("YOUR CART IS CURRENTLY EMPTY.");
        return;
      }

      // Close drawer and route directly to checkout details page
      if (cartDrawer) cartDrawer.classList.remove('open');
      window.location.href = "checkout.html";
    });
  }
}

// Call inside updateCartUI or on load
document.addEventListener('DOMContentLoaded', () => {
  initDrawerCheckout();
});
