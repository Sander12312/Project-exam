const payButton = document.querySelector(".payment-button");

if (payButton) {
  payButton.addEventListener("click", (event) => {
    const name = document.querySelector('input[name="name"]').value.trim();
    const cardNumber = document.querySelector('input[name="card-number"]').value.replace(/\s|-/g, "").trim();
    const cvc = document.querySelector('input[name="cvc"]').value.trim();
    const expirationDate = document.querySelector('input[name="expiration-date"]').value.trim();

    if (!name || !cardNumber || !cvc || !expirationDate) {
      event.preventDefault();
      alert("Please fill in all fields.");
      return;
    }

    if (cardNumber.length < 12 || isNaN(cardNumber)) {
      event.preventDefault();
      alert("Invalid card number.");
      return;
    }

    if (cvc.length < 3 || isNaN(cvc)) {
      event.preventDefault();
      alert("CVC must be at least 3 digits.");
      return;
    }

    if (expirationDate.length < 4) {
      event.preventDefault();
      alert("Invalid expiration date.");
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.discountedPrice * item.quantity, 0);
    localStorage.setItem("lastOrderTotal", total.toFixed(2));

    localStorage.removeItem("cart");

  });
}