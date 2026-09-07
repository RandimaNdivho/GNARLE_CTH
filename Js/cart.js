// --- Renders full Dispatch Terminal Table on cart.html ---
function renderCartPage() {
  const cartTableBody = document.getElementById('cart-items-body');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');

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
    return;
  }

  let subtotal = 0;

  cartTableBody.innerHTML = currentCart.map((item, index) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    // Extract size bracket from title if formatted like "Item Name (M)"
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