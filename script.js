// --- Bilum Haus PNG Shop Script ---
// Author: Belok Wosiyu

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = cart.reduce((sum, item) => sum + item.price, 0);

// Add item to cart
function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  total += price;
  updateCartDisplay();
  saveCart();
  alert(`${productName} added to your cart ✅`);
}

// Update cart display
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

// Remove item
function removeItem(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  updateCartDisplay();
  saveCart();
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Send order via WhatsApp
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

  const phoneNumber = "67573745735";
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, "_blank");

  clearCart();
  document.getElementById("checkout-form").reset();
  alert("Order sent to WhatsApp ✅ Thank you for your purchase!");
}

// Clear cart
function clearCart() {
  cart = [];
  total = 0;
  localStorage.removeItem("cart");
  updateCartDisplay();
}

// Display cart when page loads
document.addEventListener("DOMContentLoaded", updateCartDisplay);

// --- Contact Page WhatsApp Message ---
function sendContactMessage(event) {
  event.preventDefault();

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;

  const whatsappMessage = 
    `📬 *New Inquiry - Bilum Haus PNG*%0A` +
    `👤 Name: ${name}%0A` +
    `📧 Email: ${email}%0A%0A` +
    `💬 Message:%0A${message}%0A%0A` +
    `Sent from Bilum Haus PNG website`;

  const phoneNumber = "67573745735";
  const url = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
  window.open(url, "_blank");
}

// --- Image Carousel Functionality ---
let currentSlide = 0;
const slides = document.querySelectorAll(".slides img");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
      dots[i].classList.add("active");
    }
  });
  currentSlide = index;
}

function changeSlide(step) {
  currentSlide += step;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  if (currentSlide >= slides.length) currentSlide = 0;
  showSlide(currentSlide);
}

function setSlide(index) {
  showSlide(index);
}

// Auto-slide every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);

// --- Auto-Fading Testimonials ---
const testimonials = document.querySelectorAll(".testimonial");
let testimonialIndex = 0;

function showNextTestimonial() {
  testimonials.forEach((t, i) => {
    t.style.display = i === testimonialIndex ? "block" : "none";
  });
  testimonialIndex = (testimonialIndex + 1) % testimonials.length;
}

// Initially show first testimonial
showNextTestimonial();
setInterval(showNextTestimonial, 6000);

// --- Newsletter Signup Form ---
const newsletterForm = document.getElementById("newsletter-form");
const newsletterMsg = document.getElementById("newsletter-msg");

newsletterForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const email = document.getElementById("newsletter-email").value;

  if (email) {
    // Here you could integrate with an actual mailing service
    newsletterMsg.textContent = `Thank you for subscribing, ${email}! 🎉`;
    newsletterForm.reset();
  } else {
    newsletterMsg.textContent = "Please enter a valid email address.";
    newsletterMsg.style.color = "red";
  }
});

// --- Add Product Dynamically (with image upload) ---
const addProductForm = document.getElementById("add-product-form");
const uploadMsg = document.getElementById("upload-msg");

addProductForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("new-product-name").value;
  const price = parseFloat(document.getElementById("new-product-price").value);
  const imgFile = document.getElementById("new-product-img").files[0];

  if (!name || !price || !imgFile) {
    uploadMsg.textContent = "Please fill in all fields!";
    uploadMsg.style.color = "red";
    return;
  }

  const reader = new FileReader();

  reader.onload = function(e) {
    const imgData = e.target.result; // Base64 image string

    // Create new product element
    const productGrid = document.querySelector(".product-grid");
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${imgData}" alt="${name}">
      <h3>${name}</h3>
      <p class="price">K${price}</p>
      <button onclick="addToCart('${name}', ${price})">Add to Cart</button>
    `;
    productGrid.appendChild(div);

    // Save product in local storage
    let storedProducts = JSON.parse(localStorage.getItem("products")) || [];
    storedProducts.push({ name, price, img: imgData });
    localStorage.setItem("products", JSON.stringify(storedProducts));

    uploadMsg.textContent = `Product "${name}" uploaded successfully! 🎉`;
    uploadMsg.style.color = "green";
    addProductForm.reset();
  };

  reader.readAsDataURL(imgFile); // Convert image to Base64
});

// Load stored products from local storage on page load
window.addEventListener("load", () => {
  const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
  const productGrid = document.querySelector(".product-grid");

  storedProducts.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">K${product.price}</p>
      <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
    `;
    productGrid.appendChild(div);
  });
});

// --- Supabase Config ---
const SUPABASE_URL = "https://ahgevvbddypbhqpcpphq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZ2V2dmJkZHlwYmhxcGNwcGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0ODk5NTUsImV4cCI6MjA3ODA2NTk1NX0.A394-FBis32AKYT_CLVephAItIPkopMXhRDmnmfc6vk"; // found in Project Settings → API → anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
