let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Render cart summary
function renderSummary() {
  const summary = document.getElementById('checkout-summary');
  if (!summary) return;

  if (cart.length === 0) {
    summary.innerHTML = "<p>Your cart is empty. <a href='shop.html'>Go back to shop</a></p>";
    return;
  }

  let total = 0;
  let html = "<h2>Order Summary</h2><ul>";

  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    html += `<li>${item.product} (Size: ${item.size}) x ${item.quantity} — R${lineTotal}</li>`;
  });

  html += `</ul><p><strong>Total: R${total}</strong></p>`;
  summary.innerHTML = html;
}

renderSummary();

// Checkout form → WhatsApp + confirmation
document.getElementById('checkout-form').addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const province = document.getElementById('province').value.trim();
  const postal = document.getElementById('postal').value.trim();

  if (!name || !email || !phone || !address || !city || !province || !postal) {
    alert("Please fill in all shipping details.");
    return;
  }

  let message = `GNARLIE Order:\n\nCustomer: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}, ${city}, ${province}, ${postal}\n\nItems:\n`;
  let total = 0;

  cart.forEach(item => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;
    message += `${item.product} (Size: ${item.size}) x ${item.quantity} — R${lineTotal}\n`;
  });

  message += `\nTotal: R${total}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/27660460301?text=${encodedMessage}`;

  // Hide form, show confirmation
  document.getElementById('checkout-form').classList.add('hidden');
  document.getElementById('confirmation').classList.remove('hidden');

  // Redirect to WhatsApp after short delay
  setTimeout(() => {
    window.location.href = whatsappUrl;
  }, 2000);
});
