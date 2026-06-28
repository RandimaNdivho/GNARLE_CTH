// --------------------
// CART STORAGE SETUP
// --------------------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateMiniCart();
}

// --------------------
// ADD TO CART (product.html)
// --------------------
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const product = button.getAttribute('data-product');
    const price = parseInt(button.getAttribute('data-price'));
    const sizeId = button.getAttribute('data-size');
    const size = document.getElementById(sizeId).value;

    cart.push({ product, price, size, quantity: 1 });
    saveCart();

    alert(`Added ${product} (Size: ${size}) to cart!`);

    const viewCartLink = button.nextElementSibling;
    if (viewCartLink && viewCartLink.classList.contains('view-cart-link')) {
      viewCartLink.classList.remove('hidden');
    }
  });
});

// --------------------
// MINI CART DROPDOWN (header)
// --------------------
function updateMiniCart() {
  const miniCart = document.querySelector('.mini-cart');
  if (!miniCart) return;

  miniCart.innerHTML = '';

  if (cart.length === 0) {
    miniCart.innerHTML = '<p>Your cart is empty</p>';
    return;
  }

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;
  });

  miniCart.innerHTML = `
    <p><strong>${totalItems}</strong> items | <strong>R${totalPrice}</strong></p>
    <a href="cart.html" class="btn">View Cart</a>
  `;
}

// --------------------
// RENDER CART (cart.html)
// --------------------
function renderCart() {
  const tbody = document.querySelector('#cart-table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.product}</td>
      <td>${item.size}</td>
      <td>R${item.price}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="qty">
      </td>
      <td>R${item.price * item.quantity}</td>
      <td><button class="remove" data-index="${index}">X</button></td>
    `;
    tbody.appendChild(row);
    total += item.price * item.quantity;
  });

  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = `R${total}`;
  }

  saveCart();
}

// --------------------
// CART INTERACTIONS
// --------------------
document.addEventListener('input', e => {
  if (e.target.classList.contains('qty')) {
    const index = e.target.dataset.index;
    cart[index].quantity = parseInt(e.target.value);
    renderCart();
  }
});

document.addEventListener('click', e => {
  if (e.target.classList.contains('remove')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    renderCart();
  }
});

const checkoutBtn = document.querySelector('.checkout');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    window.location.href = "checkout.html";
  });
}

// --------------------
// INITIALIZE
// --------------------
updateMiniCart();
if (document.querySelector('#cart-table')) {
  renderCart();
}
