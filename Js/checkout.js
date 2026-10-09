const WHATSAPP_BUSINESS_NUMBER = "27660460301";

// Render Order Summary on Page Load
function initCheckoutPage() {
  const summaryBox = document.getElementById('checkoutSummary');
  const currentCart = JSON.parse(localStorage.getItem('gnarlie_cart')) || [];

  if (!summaryBox) return;

  if (currentCart.length === 0) {
    summaryBox.innerHTML = `
      <p style="font-size: 0.8rem; font-weight: 700; text-align: center; margin: 0;">YOUR MANIFEST IS EMPTY.</p>
    `;
    return;
  }

  let subtotal = 0;
  let summaryHTML = `<h4 style="font-size: 0.85rem; font-weight: 900; margin: 0 0 0.75rem 0; letter-spacing: 1px;">ORDER MANIFEST</h4>`;

  currentCart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    
    const sizeMatch = item.name.match(/\(([^)]+)\)/);
    const size = sizeMatch ? sizeMatch[1] : 'M';
    const cleanName = item.name.replace(/\s*\([^)]*\)/, '');

    summaryHTML += `
      <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem;">
        <span>${cleanName} (${size}) x${item.qty}</span>
        <strong>R${itemTotal}</strong>
      </div>
    `;
  });

  summaryHTML += `
    <hr style="border: none; border-top: 1px solid #ddd; margin: 0.75rem 0;">
    <div style="display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 900;">
      <span>GRAND TOTAL</span>
      <span>R${subtotal}</span>
    </div>
  `;

  summaryBox.innerHTML = summaryHTML;
}

// Process Form & Redirect to WhatsApp
function processWhatsAppOrder(e) {
  if (e) e.preventDefault();

  const currentCart = JSON.parse(localStorage.getItem('gnarlie_cart')) || [];
  if (currentCart.length === 0) {
    alert("YOUR CART IS EMPTY.");
    return;
  }

  const nameEl = document.getElementById('custName');
  const phoneEl = document.getElementById('custPhone');
  const addressEl = document.getElementById('custAddress');

  const name = nameEl ? nameEl.value.trim() : '';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const address = addressEl ? addressEl.value.trim() : '';

  if (!name || !phone || !address) {
    alert("Please complete all shipping fields.");
    return;
  }

  let subtotal = 0;
  let message = `*G★N DISPATCH MANIFEST // NEW ORDER*\n`;
  message += `===============================\n\n`;

  message += `*CUSTOMER DETAILS:*\n`;
  message += `• *Name:* ${name}\n`;
  message += `• *Contact:* ${phone}\n`;
  message += `• *Address:* ${address}\n\n`;

  message += `===============================\n`;
  message += `*ORDER ITEMS:*\n\n`;

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
  message += `*GRAND TOTAL: R${subtotal}*\n`;
  message += `===============================\n\n`;
  message += `Awaiting payment instructions and dispatch confirmation.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${encodedMessage}`;

  // Direct location update ensures mobile browsers won't block popups
  window.location.href = whatsappURL;
}

document.addEventListener('DOMContentLoaded', () => {
  initCheckoutPage();

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', processWhatsAppOrder);
  }
});