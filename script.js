// ===== Product data =====
const products = [
  { id: 1, name: "Wireless Earbuds Pro", cat: "audio", emoji: "🎧", price: 1499, mrp: 2999, rating: 4.3, color: "#FFE8CC" },
  { id: 2, name: "Studio Headphones X2", cat: "audio", emoji: "🎵", price: 3299, mrp: 4999, rating: 4.5, color: "#D9E8FF" },
  { id: 3, name: "Mini Bluetooth Speaker", cat: "audio", emoji: "🔊", price: 899, mrp: 1499, rating: 4.1, color: "#E4F7E0" },
  { id: 4, name: "SmartFit Watch Series 4", cat: "wearables", emoji: "⌚", price: 2999, mrp: 4499, rating: 4.4, color: "#FDE2E4" },
  { id: 5, name: "Fitness Band Lite", cat: "wearables", emoji: "📟", price: 1199, mrp: 1799, rating: 4.0, color: "#E2F0F7" },
  { id: 6, name: "AR Smart Glasses", cat: "wearables", emoji: "🕶️", price: 5999, mrp: 8999, rating: 4.2, color: "#F0E4F7" },
  { id: 7, name: "UltraBook Air 14\"", cat: "computing", emoji: "💻", price: 42999, mrp: 51999, rating: 4.6, color: "#E8E4F7" },
  { id: 8, name: "Mechanical Keyboard RGB", cat: "computing", emoji: "⌨️", price: 2499, mrp: 3499, rating: 4.3, color: "#FFF0CC" },
  { id: 9, name: "Wireless Mouse Pro", cat: "computing", emoji: "🖱️", price: 799, mrp: 1299, rating: 4.1, color: "#E0F7EF" },
  { id: 10, name: "Smart LED Bulb (4-pack)", cat: "home", emoji: "💡", price: 999, mrp: 1599, rating: 4.2, color: "#FFF6D9" },
  { id: 11, name: "Video Doorbell 2K", cat: "home", emoji: "🔔", price: 3499, mrp: 4999, rating: 4.0, color: "#E4EDF7" },
  { id: 12, name: "Robot Vacuum Mini", cat: "home", emoji: "🤖", price: 8999, mrp: 12999, rating: 4.3, color: "#F7E4EC" },
  { id: 13, name: "Mirrorless Camera M50", cat: "photography", emoji: "📷", price: 34999, mrp: 41999, rating: 4.7, color: "#E4F7F5" },
  { id: 14, name: "Compact Tripod Stand", cat: "photography", emoji: "🎥", price: 699, mrp: 999, rating: 3.9, color: "#F7EEE4" },
  { id: 15, name: "Instant Print Camera", cat: "photography", emoji: "📸", price: 4499, mrp: 5999, rating: 4.4, color: "#EDE4F7" },
];

// ===== State =====
let activeCategory = "all";
let searchTerm = "";
const cart = {}; // { productId: qty }

// ===== DOM refs =====
const productGrid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");
const resultsLabel = document.getElementById("resultsLabel");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const categoryStrip = document.getElementById("categoryStrip");
const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("closeCart");
const cartBody = document.getElementById("cartBody");
const cartEmptyMsg = document.getElementById("cartEmptyMsg");
const cartBadge = document.getElementById("cartBadge");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartDelivery = document.getElementById("cartDelivery");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const rupee = (n) => `₹${n.toLocaleString("en-IN")}`;

const categoryLabels = {
  all: "All products",
  audio: "Audio",
  wearables: "Wearables",
  computing: "Computing",
  home: "Smart Home",
  photography: "Photography",
};

// ===== Rendering products =====
function getFilteredProducts() {
  return products.filter((p) => {
    const matchesCat = activeCategory === "all" || p.cat === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });
}

function renderProducts() {
  const filtered = getFilteredProducts();
  resultsLabel.textContent = categoryLabels[activeCategory];
  resultsCount.textContent = `${filtered.length} item${filtered.length !== 1 ? "s" : ""}`;
  productGrid.innerHTML = "";
  emptyState.hidden = filtered.length !== 0;

  filtered.forEach((p) => {
    const qty = cart[p.id] || 0;
    const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-thumb" style="background:${p.color}">${p.emoji}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-meta">
        <span class="rating-badge">${p.rating} ★</span>
        <span>bestseller</span>
      </div>
      <div class="price-row">
        <span class="price">${rupee(p.price)}</span>
        <span class="price-strike">${rupee(p.mrp)}</span>
        <span class="discount">${discountPct}% off</span>
      </div>
      ${
        qty === 0
          ? `<button class="add-btn" data-id="${p.id}">Add to Cart</button>`
          : `<div class="stepper">
               <button data-action="dec" data-id="${p.id}">−</button>
               <span>${qty}</span>
               <button data-action="inc" data-id="${p.id}">+</button>
             </div>`
      }
    `;
    productGrid.appendChild(card);
  });
}

// ===== Cart logic =====
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderProducts();
  renderCart();
}
function incQty(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderProducts();
  renderCart();
}
function decQty(id) {
  if (!cart[id]) return;
  cart[id] -= 1;
  if (cart[id] <= 0) delete cart[id];
  renderProducts();
  renderCart();
}
function removeFromCart(id) {
  delete cart[id];
  renderProducts();
  renderCart();
}

function cartTotals() {
  let subtotal = 0;
  let count = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    const p = products.find((prod) => prod.id === Number(id));
    if (p) {
      subtotal += p.price * qty;
      count += qty;
    }
  });
  const delivery = subtotal > 0 && subtotal < 999 ? 49 : 0;
  return { subtotal, delivery, total: subtotal + delivery, count };
}

function renderCart() {
  const entries = Object.entries(cart);
  cartBody.innerHTML = "";

  if (entries.length === 0) {
    cartBody.appendChild(cartEmptyMsg);
  } else {
    entries.forEach(([id, qty]) => {
      const p = products.find((prod) => prod.id === Number(id));
      if (!p) return;
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-thumb" style="background:${p.color}">${p.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${rupee(p.price)} × ${qty}</div>
        </div>
        <div class="cart-item-controls">
          <button data-action="dec" data-id="${p.id}">−</button>
          <span>${qty}</span>
          <button data-action="inc" data-id="${p.id}">+</button>
        </div>
        <button class="remove-link" data-action="remove" data-id="${p.id}">Remove</button>
      `;
      cartBody.appendChild(row);
    });
  }

  const { subtotal, delivery, total, count } = cartTotals();
  cartSubtotal.textContent = rupee(subtotal);
  cartDelivery.textContent = delivery === 0 ? "Free" : rupee(delivery);
  cartTotal.textContent = rupee(total);
  cartBadge.textContent = count;
  checkoutBtn.disabled = count === 0;
  checkoutBtn.style.opacity = count === 0 ? 0.5 : 1;
}

// ===== Event listeners =====
productGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.classList.contains("add-btn")) addToCart(id);
  else if (btn.dataset.action === "inc") incQty(id);
  else if (btn.dataset.action === "dec") decQty(id);
});

cartBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = Number(btn.dataset.id);
  if (btn.dataset.action === "inc") incQty(id);
  else if (btn.dataset.action === "dec") decQty(id);
  else if (btn.dataset.action === "remove") removeFromCart(id);
});

categoryStrip.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
  chip.classList.add("active");
  activeCategory = chip.dataset.cat;
  renderProducts();
});

searchInput.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderProducts();
});

function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}
function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}
cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
overlay.addEventListener("click", closeCartDrawer);

checkoutBtn.addEventListener("click", () => {
  const { count, total } = cartTotals();
  if (count === 0) return;
  alert(`Order placed! ${count} item(s) · Total ${rupee(total)}\n\nThis is a demo checkout — no payment was processed.`);
  Object.keys(cart).forEach((id) => delete cart[id]);
  renderProducts();
  renderCart();
  closeCartDrawer();
});

// ===== Init =====
renderProducts();
renderCart();
