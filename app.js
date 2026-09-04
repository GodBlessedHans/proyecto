const orderList = document.getElementById("orderList");
const totalPrice = document.getElementById("totalPrice");
const checkoutBtn = document.getElementById("checkoutBtn");
const profileBtn = document.getElementById("profileBtn");
const profilePanel = document.getElementById("profilePanel");
const profileBackdrop = document.getElementById("profileBackdrop");
const closeProfileBtn = document.getElementById("closeProfileBtn");
const profileItems = document.getElementById("profileItems");
const profileTotal = document.getElementById("profileTotal");
const profileStatus = document.getElementById("profileStatus");
const profileList = document.getElementById("profileList");
const addButtons = document.querySelectorAll(".add-btn");

const cart = [];

function formatCOP(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function toggleProfile(open) {
  const isOpen = typeof open === "boolean" ? open : profilePanel.hidden;
  profilePanel.hidden = !isOpen;
  profileBackdrop.hidden = !isOpen;
  profilePanel.setAttribute("aria-hidden", String(!isOpen));
  profileBtn.setAttribute("aria-expanded", String(isOpen));
}

function renderProfile() {
  profileItems.textContent = String(cart.length);

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  profileTotal.textContent = Number.isFinite(total) ? formatCOP(total) : "Revisar";
  profileStatus.textContent = cart.length === 0 ? "Sin pedidos" : "Activo";

  if (cart.length === 0) {
    profileList.innerHTML = "<li>Sin actividad reciente.</li>";
    return;
  }

  const lastItems = cart.slice(-3).reverse();
  profileList.innerHTML = lastItems.map((item) => `<li>${item.name}</li>`).join("");
}

function renderCart() {
  if (cart.length === 0) {
    orderList.innerHTML = '<p class="empty">Todavia no agregas frituras.</p>';
    totalPrice.textContent = formatCOP(0);
    renderProfile();
    return;
  }

  const html = cart
    .map((item, index) => {
      return `
        <div class="order-item">
          <span>${item.name}</span>
          <div>
            <strong>${formatCOP(item.price)}</strong>
            <button class="remove-btn" data-index="${index}" aria-label="Quitar ${item.name}">Quitar</button>
          </div>
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

  renderProfile();
}

orderList.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement) || !target.classList.contains("remove-btn")) {
    return;
  }

  const index = Number(target.dataset.index);
  if (Number.isNaN(index)) {
    return;
  }

  cart.splice(index, 1);
  renderCart();
});

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

profileBtn.addEventListener("click", () => {
  toggleProfile();
});

closeProfileBtn.addEventListener("click", () => {
  toggleProfile(false);
});

profileBackdrop.addEventListener("click", () => {
  toggleProfile(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !profilePanel.hidden) {
    toggleProfile(false);
  }
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Agrega al menos una fritura antes de confirmar.");
    return;
  }

  cart.length = 0;
  renderCart();
  toggleProfile(false);
  alert("Preventa creada. Tu modulo NeoCrunch enviara la orden al instante.");
});

renderProfile();
