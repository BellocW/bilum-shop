let cart = [];

function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

function updateCart() {
  const list = document.getElementById("cart-items");
  const totalElement = document.getElementById("total");
  list.innerHTML = "";

  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const li = document.createElement("li");
    li.textContent = `${item.name} - K${item.price}`;
    list.appendChild(li);
  });

  totalElement.textContent = `Total: K${total}`;
}

function sendOrder(event) {
    event.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;

  const message = cart.map(i => `${i.name} - K${i.price}`).join("\n");
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  const fullMessage = encodeURIComponent(`Order from Bilum Haus PNG:\n${message}\nTotal: K${total}`);
  window.open(`https://wa.me/67573745735?text=${fullMessage}`, "_blank");
}
