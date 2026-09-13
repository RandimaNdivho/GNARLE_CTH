/* ==========================================================================
   1. GLOBAL STATE MANAGEMENT & PERSISTENCE
   ========================================================================== */

let cart = JSON.parse(localStorage.getItem('gnarlie_cart')) || [];
let activeGender = 'all';
let currentCategory = null;

const categoryNames = {
  tees: "Tee-Shirts",
  hoodies: "Hoodies",
  pants: "Pants",
  accessories: "Accessories"
};

function saveCartState() {
  localStorage.setItem('gnarlie_cart', JSON.stringify(cart));
}

/* ==========================================================================
   2. CONTENT DATA FOR SHOWROOM MODALS (HOME PAGE)
   ========================================================================== */

const modalData = {
  style: {
    title: "HOW TO STYLE — FIT COMBOS",
    content: `
      <p style="margin-bottom: 15px;">Curated pairings for the current season:</p>
      <div style="display: flex; flex-direction: column; gap: 15px;">
        <div style="border: 1px solid #eee; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong>GNARLIE Heavyweight Tee + Wide Cargo</strong>
            <p style="font-size: 0.8rem; color: #666;">R1100.00 Total</p>
          </div>
          <button onclick="addToCart('Fit Combo #1', 1100)" style="background:#000; color:#fff; border:none; padding:8px 12px; cursor:pointer; font-weight:bold;">ADD FIT</button>
        </div>
      </div>
    `
  },
  drop: {
    title: "THE DROP — LATEST PIECES",
    content: `
      <p style="margin-bottom: 15px;">Centerpiece releases available now:</p>
      <div style="border: 1px solid #eee; padding: 12px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong>GNARLIE Signature Hoodie</strong>
          <p style="font-size: 0.8rem; color: #666;">R850.00</p>
        </div>
        <button onclick="addToCart('Signature Hoodie', 850)" style="background:#000; color:#fff; border:none; padding:8px 12px; cursor:pointer; font-weight:bold;">ADD TO CART</button>
      </div>
    `
  },
  vault: {
    title: "THE VAULT — EARLY ACCESS",
    content: `
      <p style="margin-bottom: 15px;">Enter your email to gain priority access to our next studio drop.</p>
      <input type="email" placeholder="enter your email..." style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid #ccc;">
      <button onclick="alert('Access Granted.'); closeModal();" style="width: 100%; background:#000; color:#fff; border:none; padding:12px; cursor:pointer; font-weight:bold;">REQUEST ACCESS</button>
    `
  }
};

/* ==========================================================================
   3. SAFE DOM ELEMENT REFERENCES
   ========================================================================== */

const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartDrawer = document.getElementById('cartDrawer');
const cartCount = document.getElementById('cartCount');
const cartDrawerCount = document.getElementById('cartDrawerCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalAmount = document.getElementById('cartTotalAmount');

const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const exploreBtn = document.getElementById('exploreBtn');

/* ==========================================================================
   4. SIDE DRAWER CART ENGINE
   ========================================================================== */

function toggleCart() {
  if (cartDrawer) {
    cartDrawer.classList.toggle('open');
  }
}

if (cartToggle) cartToggle.addEventListener('click', toggleCart);
if (cartClose) cartClose.addEventListener('click', toggleCart);

function addToCart(name, price, image = 'Assets/GNARLIE CAMO LOGO.png') {
  const existingIndex = cart.findIndex(item => item.name === name);
  
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ name, price, qty: 1, image });
  }

  saveCartState();
  updateCartUI();

  if (cartDrawer) cartDrawer.classList.add('open');
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCartState();
  updateCartUI();

  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
}

function updateQuantity(index, delta) {
  if (cart[index]) {
    cart[index].qty += delta;
    
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }

    saveCartState();
    updateCartUI();

    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  }
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (cartCount) cartCount.textContent = totalItems;
  if (cartDrawerCount) cartDrawerCount.textContent = totalItems;
  if (cartTotalAmount) cartTotalAmount.textContent = `R${totalPrice.toFixed(2)}`;

  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
      return;
    }

    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #eee;">
        <div>
          <strong>${item.name}</strong>
          <p style="font-size:0.8rem; color:#666; margin:0;">R${item.price.toFixed(2)} x ${item.qty}</p>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; font-size:1rem;" aria-label="Remove item">✕</button>
      </div>
    `).join('');
  }
}

/* ==========================================================================
   5. HOME PAGE MODAL & FOOTER HANDLERS
   ========================================================================== */

const showroomCards = document.querySelectorAll('.showroom-card');
if (showroomCards.length > 0) {
  showroomCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-modal');
      if (modalData[key] && modalOverlay && modalBody) {
        modalBody.innerHTML = `
          <h3 style="font-size:1.3rem; margin-bottom:15px; font-weight:900;">${modalData[key].title}</h3>
          ${modalData[key].content}
        `;
        modalOverlay.classList.add('active');
      }
    });
  });
}

function closeModal() {
  if (modalOverlay) modalOverlay.classList.remove('active');
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    alert('GNARLIE.CTH — Redefining streetwear conversion.');
  });
}

/* ==========================================================================
   6. SHOP PAGE ENGINE & DYNAMIC DATABASE RENDERER
   ========================================================================== */

function selectSize(btnElement) {
  const parent = btnElement.closest('.size-selector-row');
  if (!parent) return;

  parent.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
}

function handleAddFromCard(buttonElement) {
  const card = buttonElement.closest('.inline-product-card');
  if (!card) return;

  const title = card.querySelector('.tile-info h4')?.textContent || "Product";
  const priceText = card.querySelector('.tile-info .price')?.textContent || "R0";
  const activeSizeBtn = card.querySelector('.size-btn.active');
  const size = activeSizeBtn ? activeSizeBtn.textContent : 'M';
  const imgElement = card.querySelector('.tile-img-container img');
  const imgSrc = imgElement ? imgElement.getAttribute('src') : 'Assets/GNARLIE CAMO LOGO.png';

  const numericPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, "")) || 0;

  addToCart(`${title} (${size})`, numericPrice, imgSrc);
}

function setGenderFilter(genderKey) {
  activeGender = genderKey;

  document.querySelectorAll('.gender-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-gender') === genderKey);
  });

  if (currentCategory) {
    selectCategory(currentCategory);
  }
}

function selectCategory(categoryKey) {
  currentCategory = categoryKey;

  const primaryPillsContainer = document.getElementById('primaryPills');
  const secondaryPillsContainer = document.getElementById('secondaryPills');
  const persuasionSection = document.getElementById('persuasionSection');
  const productGridSection = document.getElementById('productGridSection');
  const activeCategoryHeading = document.getElementById('activeCategoryHeading');
  const productGrid = document.getElementById('productGrid');

  // 1. Hide Persuasion Banners
  if (persuasionSection) persuasionSection.style.display = 'none';

  // 2. Render Secondary Pills
  if (secondaryPillsContainer) {
    const remainingCategories = Object.keys(categoryNames).filter(key => key !== categoryKey);
    secondaryPillsContainer.innerHTML = remainingCategories.map(key => `
      <button class="pill-btn" onclick="selectCategory('${key}')">${categoryNames[key]}</button>
    `).join('');
  }

  // 3. Render Primary Active Pill
  if (primaryPillsContainer) {
    primaryPillsContainer.innerHTML = `
      <button class="pill-btn active-pill" onclick="selectCategory('${categoryKey}')">${categoryNames[categoryKey]}</button>
    `;
  }

  // 4. Update Header Title
  if (activeCategoryHeading) {
    const genderTag = activeGender !== 'all' ? `${activeGender.toUpperCase()}'S ` : '';
    activeCategoryHeading.textContent = `— ${genderTag}${categoryNames[categoryKey] || categoryKey} —`;
  }

  // 5. Reveal Product Grid Section
  if (productGridSection) {
    productGridSection.classList.remove('hidden');
    productGridSection.style.display = 'block';
  }

  // 6. Filter & Render from Centralized PRODUCTS_DATABASE
  if (productGrid && typeof PRODUCTS_DATABASE !== 'undefined') {
    const filteredProducts = PRODUCTS_DATABASE.filter(item => {
      const categoryMatch = item.category === categoryKey;
      const genderMatch = activeGender === 'all' || item.gender === activeGender || item.gender === 'unisex';
      return categoryMatch && genderMatch;
    });

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `
        <p style="grid-column: 1/-1; text-align: center; padding: 40px; font-weight: bold; letter-spacing: 0.1em;">
          NO DISPATCHES AVAILABLE FOR THIS SELECTION.
        </p>
      `;
      return;
    }

    productGrid.innerHTML = filteredProducts.map(product => {
      let buttonText = "+ ADD TO CART";
      let buttonDisabled = "";

      if (product.status === "sold-out") {
        buttonText = "SOLD OUT";
        buttonDisabled = "disabled style='opacity: 0.5; cursor: not-allowed;'";
      } else if (product.status === "pre-order") {
        buttonText = "PRE-ORDER NOW";
      }

      return `
        <article class="inline-product-card" data-category="${product.category}" data-gender="${product.gender}">
          <div class="tile-img-container">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="tile-info">
            <h4>${product.title}</h4>
            <p class="price">R${product.price}</p>
          </div>
          <div class="size-selector-row">
            ${product.sizes.map((size, idx) => `
              <button class="size-btn ${idx === 1 || product.sizes.length === 1 ? 'active' : ''}" onclick="selectSize(this)">${size}</button>
            `).join('')}
          </div>
          <button class="inline-add-btn camo-accent-btn" onclick="handleAddFromCard(this)" ${buttonDisabled}>${buttonText}</button>
        </article>
      `;
    }).join('');
  }
}

function initShopPage() {
  updateCartUI();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});
