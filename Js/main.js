/* ==========================================================================
   1. GLOBAL STATE MANAGEMENT & PERSISTENCE
   ========================================================================== */

// Initialize cart state array from localStorage to retain items across page navigations.
// If localStorage is empty or null, fallback to an empty array [].
let cart = JSON.parse(localStorage.getItem('gnarlie_cart')) || [];

/**
 * Helper function to synchronize current JS cart state to localStorage.
 * Call this every time items are added, updated, or removed.
 */
function saveCartState() {
  localStorage.setItem('gnarlie_cart', JSON.stringify(cart));
}

/* ==========================================================================
   2. CONTENT DATA FOR SHOWROOM MODALS (HOME PAGE)
   ========================================================================== */

// Structured HTML content payloads served dynamically inside home page modals.
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

// Cart Side Drawer DOM Elements
const cartToggle = document.getElementById('cartToggle');
const cartClose = document.getElementById('cartClose');
const cartDrawer = document.getElementById('cartDrawer');
const cartCount = document.getElementById('cartCount');
const cartDrawerCount = document.getElementById('cartDrawerCount');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalAmount = document.getElementById('cartTotalAmount');

// Home Page Modal DOM Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// Footer Element
const exploreBtn = document.getElementById('exploreBtn');

/* ==========================================================================
   4. SIDE DRAWER CART ENGINE
   ========================================================================== */

/**
 * Toggles the open/closed CSS state class on the sliding cart drawer.
 */
function toggleCart() {
  if (cartDrawer) {
    cartDrawer.classList.toggle('open');
  }
}

// Bind trigger listeners safely with null-checks to prevent errors on non-drawer pages
if (cartToggle) cartToggle.addEventListener('click', toggleCart);
if (cartClose) cartClose.addEventListener('click', toggleCart);

/**
 * Adds an item to the global cart state array, saves to storage, and refreshes UI.
 * @param {string} name - Product title (with size if applicable)
 * @param {number} price - Unit item cost in ZAR (R)
 * @param {string} image - Optional preview thumbnail path
 */
function addToCart(name, price, image = 'Assets/GNARLIE CAMO LOGO.png') {
  const existingIndex = cart.findIndex(item => item.name === name);
  
  if (existingIndex > -1) {
    // Increment quantity if item with exact name/size combination already exists
    cart[existingIndex].qty += 1;
  } else {
    // Push new product object into cart array
    cart.push({ name, price, qty: 1, image });
  }

  saveCartState(); // Sync array to localStorage
  updateCartUI();   // Update sliding drawer UI elements

  // Auto-open sliding drawer on item add if present on current page
  if (cartDrawer) cartDrawer.classList.add('open');
}

/**
 * Removes item completely at specified index from cart state.
 * @param {number} index - Position of item in cart array
 */
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCartState();
  updateCartUI();

  // If cart.html render function exists in current scope, execute re-render
  if (typeof renderCartPage === 'function') {
    renderCartPage();
  }
}

/**
 * Updates or decreases item quantity. Removes element if quantity drops to 0.
 * @param {number} index - Index of target product
 * @param {number} delta - Change amount (+1 or -1)
 */
function updateQuantity(index, delta) {
  if (cart[index]) {
    cart[index].qty += delta;
    
    // If quantity hits 0 or lower, scrub item from state
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }

    saveCartState();
    updateCartUI();

    // Re-render full manifest table if currently on cart.html
    if (typeof renderCartPage === 'function') {
      renderCartPage();
    }
  }
}

/**
 * Recalculates total items/pricing and repopulates side cart drawer markup.
 */
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Update header/badge indicator counts
  if (cartCount) cartCount.textContent = totalItems;
  if (cartDrawerCount) cartDrawerCount.textContent = totalItems;
  if (cartTotalAmount) cartTotalAmount.textContent = `R${totalPrice.toFixed(2)}`;

  // Populate HTML inside side drawer element container
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
   5. HOME PAGE MODAL SYSTEM
   ========================================================================== */

// Find and attach click listeners to all showroom cards on home page
const showroomCards = document.querySelectorAll('.showroom-card');
if (showroomCards.length > 0) {
  showroomCards.forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-modal');
      // Read data payload matching card key and display overlay
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

/**
 * Closes modal overlay window.
 */
function closeModal() {
  if (modalOverlay) modalOverlay.classList.remove('active');
}

// Close listeners for modal close button and background overlay backdrop
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

/* ==========================================================================
   6. FOOTER INTERACTION HANDLER
   ========================================================================== */

if (exploreBtn) {
  exploreBtn.addEventListener('click', () => {
    alert('GNARLIE.CTH — Redefining streetwear conversion.');
  });
}

/* ==========================================================================
   7. SHOP PAGE ENGINE & CATEGORY SWITCHING
   ========================================================================== */

// Category dictionary map for pill dynamic headers
const categoryNames = {
  tees: "Tee-Shirts",
  hoodies: "Hoodies",
  pants: "Pants",
  accessories: "Accessories"
};

/**
 * Size selector engine for inline product cards.
 * Highlights active size pill and deselects siblings within the same parent row.
 * @param {HTMLElement} btnElement - Clicked size button
 */
function selectSize(btnElement) {
  const parent = btnElement.closest('.size-selector-row');
  if (!parent) return;

  // Clear existing active flags on row siblings
  parent.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  // Set active flag on target clicked size
  btnElement.classList.add('active');
}

/**
 * Formats data from inline card elements and triggers `addToCart`.
 * @param {HTMLElement} buttonElement - Clicked "Add to Cart" button inside product card
 */
function handleAddFromCard(buttonElement) {
  const card = buttonElement.closest('.inline-product-card');
  if (!card) return;

  // Read card UI values safely with optional chaining fallbacks
  const title = card.querySelector('.tile-info h4')?.textContent || "Product";
  const priceText = card.querySelector('.tile-info .price')?.textContent || "R0";
  const activeSizeBtn = card.querySelector('.size-btn.active');
  const size = activeSizeBtn ? activeSizeBtn.textContent : 'M';
  const imgElement = card.querySelector('.tile-img-container img');
  const imgSrc = imgElement ? imgElement.getAttribute('src') : 'Assets/GNARLIE CAMO LOGO.png';

  // Sanitize raw text to extract float number (e.g., "R550.00" -> 550)
  const numericPrice = parseFloat(priceText.replace(/[^0-9.-]+/g, "")) || 0;

  // Commit item to cart system with active size string appended
  addToCart(`${title} (${size})`, numericPrice, imgSrc);
}

/**
 * Dynamic Category Switching Core Engine:
 * Hides Frame 2 persuasion cards, rebuilds primary/secondary pill rows, 
 * updates grid headers, and displays matching category product cards.
 * @param {string} categoryKey - Category identifier ('tees', 'hoodies', 'pants', 'accessories')
 */
function selectCategory(categoryKey) {
  const primaryPillsContainer = document.getElementById('primaryPills');
  const secondaryPillsContainer = document.getElementById('secondaryPills');
  const persuasionSection = document.getElementById('persuasionSection');
  const productGridSection = document.getElementById('productGridSection');
  const activeCategoryHeading = document.getElementById('activeCategoryHeading');
  const allCards = document.querySelectorAll('.inline-product-card');

  // Step 1: Hide Frame 2 Persuasion / Pitch Banners
  if (persuasionSection) {
    persuasionSection.style.display = 'none';
  }

  // Step 2: Render unselected pill category buttons into secondary top container
  if (secondaryPillsContainer) {
    const remainingCategories = Object.keys(categoryNames).filter(key => key !== categoryKey);
    secondaryPillsContainer.innerHTML = remainingCategories.map(key => `
      <button class="pill-btn" onclick="selectCategory('${key}')">${categoryNames[key]}</button>
    `).join('');
  }

  // Step 3: Render primary selected pill inside lower active container
  if (primaryPillsContainer) {
    primaryPillsContainer.innerHTML = `
      <button class="pill-btn active-pill" onclick="selectCategory('${categoryKey}')">${categoryNames[categoryKey]}</button>
    `;
  }

  // Step 4: Update section header text to match selected category
  if (activeCategoryHeading) {
    activeCategoryHeading.textContent = `— ${categoryNames[categoryKey] || categoryKey} —`;
  }

  // Step 5: Remove hidden state class and reveal grid container section
  if (productGridSection) {
    productGridSection.classList.remove('hidden');
    productGridSection.style.display = 'block';
  }

  // Step 6: Filter product cards by matching `data-category` attributes
  allCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (cardCategory === categoryKey) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/**
 * Binds initial click event listeners to pre-rendered category pill elements on page load.
 */
function initShopPage() {
  const primaryPills = document.querySelectorAll('#primaryPills .pill-btn');
  
  primaryPills.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.currentTarget.getAttribute('data-category');
      if (category) {
        selectCategory(category);
      }
    });
  });

  // Perform initial UI pass with persisted cart items on page load
  updateCartUI();
}

// Automatically sync drawer state UI when DOM content completes loading
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});