// --- Bilum Haus PNG Shop Script ---
// Author: Belok Wosiyu

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0);

// --- Add item to cart ---
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  total += price;
  updateCartDisplay();
  saveCart();
  alert(`${productName} added to your cart ✅`);
}

// --- Update cart section on page ---
function updateCartDisplay() {
  const cartList = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total");

  cartList.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${index + 1}. ${item.name} - K${item.price} 
      <button class="remove-btn" onclick="removeItem(${index})">❌</button>`;
    cartList.appendChild(li);
  });

  totalDisplay.textContent = `Total: K${total}`;
}

// --- Remove item from cart ---
function removeItem(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCartDisplay();
  saveCart();
}

// --- Save cart to localStorage ---
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// --- Handle order submission ---
function sendOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !address || !phone) {
    alert("Please fill in all checkout details.");
    return;
  }

  // Build WhatsApp message
  let message = `🧺 *Bilum Haus PNG Order*%0A`;
  message += `👤 Name: ${name}%0A`;
  message += `🏠 Address: ${address}%0A`;
  message += `📞 Phone: ${phone}%0A%0A`;
  message += `🛍 *Items Ordered:*%0A`;

  cart.forEach((item) => {
    message += `- ${item.name}: K${item.price}%0A`;
  });

  message += `%0A💰 *Total:* K${total}%0A%0A`;
  message += `Thank you for supporting local PNG craftswomen 🇵🇬`;

  // WhatsApp number (yours)
  const phoneNumber = "67573745735";
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  // Open WhatsApp
  window.open(url, "_blank");

  // Clear cart and form
  clearCart();
  document.getElementById("checkout-form").reset();

  alert("Order sent to WhatsApp ✅ Thank you for your purchase!");
}

// --- Clear cart ---
function clearCart() {
  cart = [];
  total = 0;
  localStorage.removeItem("cart");
  updateCartDisplay();
}

// --- Display cart on page load ---
document.addEventListener("DOMContentLoaded", updateCartDisplay);
