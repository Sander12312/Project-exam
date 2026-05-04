const cartItemsContainer = document.querySelector("#cart-items");
const cartTotal = document.querySelector("#cart-total");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function increaseQuantity(id) {
  const cart = getCart();
  const product = cart.find((item) => item.id === id);

  if (product) {
    product.quantity += 1;
  }

  saveCart(cart);
  renderCart();
}

function decreaseQuantity(id) {
  let cart = getCart();
  const product = cart.find((item) => item.id === id);

  if (product) {
    product.quantity -= 1;

    if (product.quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }
  }

  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Total cost: 0.00 kr";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const unitPrice = item.discountedPrice;
    const itemTotal = unitPrice * item.quantity;

    total += itemTotal;

    cartItemsContainer.innerHTML += `
      <article class="cart-item">
        <button class="cart-remove" data-id="${item.id}" aria-label="Remove item">×</button>

        <div class="cart-item-top">
          <div class="cart-item-left">
            <img src="${item.image}" alt="${item.alt}" class="cart-item-image">

            <div class="cart-controls">
              <button class="decrease" data-id="${item.id}" type="button">−</button>
              <span>${item.quantity}</span>
              <button class="increase" data-id="${item.id}" type="button">+</button>
            </div>
          </div>

          <div class="cart-item-right">
            <h2 class="cart-item-title">${item.title}</h2>
            <p class="cart-item-description">
              ${item.description || "Description"}
            </p>
          </div>
        </div>

        <div class="cart-item-bottom">
          <p class="cart-item-price">${unitPrice.toFixed(2)} kr</p>
        </div>
      </article>
    `;
  });

  cartTotal.textContent = `Total cost: ${total.toFixed(2)} kr`;

  document.querySelectorAll(".increase").forEach((button) => {
    button.addEventListener("click", () => {
      increaseQuantity(button.dataset.id);
    });
  });

  document.querySelectorAll(".decrease").forEach((button) => {
    button.addEventListener("click", () => {
      decreaseQuantity(button.dataset.id);
    });
  });

  document.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", () => {
      removeItem(button.dataset.id);
    });
  });
}
const clearCartButton = document.querySelector("#clear-cart-button");

if (clearCartButton) {
  clearCartButton.addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
  });
}
renderCart();