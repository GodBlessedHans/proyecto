const orderList = document.getElementById("orderList");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const addButtons = document.querySelectorAll(".add-btn");

const cart = [];

function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderCart() {
  if (cart.length === 0) {
    orderList.innerHTML = '<p class="empty">Todavia no agregas frituras.</p>';
    totalPrice.textContent = formatCOP(0);
    return;
  }

  const html = cart
    .map((item) => {
      return `
        <div class="order-item">
          <span>${item.name}</span>
          <strong>${formatCOP(item.price)}</strong>
        </div>
      `;
    })
    .join("");

  orderList.innerHTML = html;
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length >= 3) {
    const withDiscount = total * 0.88;
    totalPrice.textContent = `${formatCOP(withDiscount)} (Promo Neon)`;
  } else {
    totalPrice.textContent = formatCOP(total);
  }
}

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    cart.push({ name, price });
    renderCart();

    button.textContent = "Listo";
    setTimeout(() => {
      button.textContent = "Agregar";
    }, 750);
  });
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Agrega al menos una fritura antes de confirmar.");
    return;
  }

  cart.length = 0;
  renderCart();
  alert("Preventa creada. Tu modulo NeoCrunch enviara la orden al instante.");
});
