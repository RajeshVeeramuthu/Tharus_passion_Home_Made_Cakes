// ═══════════════════════════════════════════
// LANGUAGE TOGGLE (EN / Tamil)
// ═══════════════════════════════════════════

let currentLang = "en";

function toggleLanguage() {
  currentLang = currentLang === "en" ? "ta" : "en";
  applyLanguage(currentLang);

  const label = document.getElementById("langLabel");
  label.textContent = currentLang === "en" ? "தமிழ்" : "English";

  // swap body font class
  document.body.classList.toggle("lang-ta", currentLang === "ta");

  // swap html lang attribute (good for SEO & accessibility)
  document.documentElement.lang = currentLang === "ta" ? "ta" : "en";
}

function applyLanguage(lang) {
  // text nodes with data-en / data-ta
  document.querySelectorAll(`[data-${lang}]`).forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });

  // placeholder attributes
  document.querySelectorAll(`[data-placeholder-${lang}]`).forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
  });
}

// ═══════════════════════════════════════════
// SEARCH FUNCTION
// ═══════════════════════════════════════════

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {
  const filter = searchInput.value.toLowerCase();
  document.querySelectorAll(".product-item").forEach(item => {
    const name = item.getAttribute("data-name").toLowerCase();
    item.style.display = name.includes(filter) ? "block" : "none";
  });
});

// ═══════════════════════════════════════════
// QTY CONTROLS
// ═══════════════════════════════════════════

function increaseQty(button) {
  const qtyInput = button.parentElement.querySelector("input");
  qtyInput.value = parseInt(qtyInput.value) + 1;
  updateTotal(button);
}

function decreaseQty(button) {
  const qtyInput = button.parentElement.querySelector("input");
  let qty = parseInt(qtyInput.value);
  if (qty > 1) qty--;
  qtyInput.value = qty;
  updateTotal(button);
}

// ═══════════════════════════════════════════
// UPDATE TOTAL PRICE
// ═══════════════════════════════════════════

function updateTotal(button) {
  const card  = button.closest(".cake-card");
  const price = parseInt(card.querySelector(".price").innerText.replace("₹", ""));
  const qty   = parseInt(card.querySelector(".qty-box input").value);
  const total = price * qty;

  const totalDiv = card.querySelector(".total-price");
  const label    = currentLang === "ta" ? "மொத்தம்:" : "Total:";
  totalDiv.innerHTML = `${label} ₹${total}`;
}

// ═══════════════════════════════════════════
// OPEN ORDER MODAL
// ═══════════════════════════════════════════

function openOrderModal(cakeName, kg, price, button) {
  const card  = button.closest(".cake-card");
  const qty   = parseInt(card.querySelector(".qty-box input").value);
  const total = qty * price;

  document.getElementById("cakeName").value  = cakeName;
  document.getElementById("cakeKg").value    = kg;
  document.getElementById("cakeQty").value   = qty;
  document.getElementById("cakeTotal").value = total;

  new bootstrap.Modal(document.getElementById("orderModal")).show();
}

// ═══════════════════════════════════════════
// FORM SUBMIT → WHATSAPP
// ═══════════════════════════════════════════

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const cakeName    = document.getElementById("cakeName").value;
  const kg          = document.getElementById("cakeKg").value;
  const qty         = document.getElementById("cakeQty").value;
  const total       = document.getElementById("cakeTotal").value;
  const customerName = document.getElementById("customerName").value;
  const mobileNo    = document.getElementById("mobileNo").value;
  const altMobileNo = document.getElementById("altMobileNo").value;
  const address     = document.getElementById("address").value;

  // YOUR WHATSAPP NUMBER
  const phoneNumber = "916382130293";

  const message =
`🍰 ORDER DETAILS 🍰

Cake Name : ${cakeName}
KG / Pack : ${kg}
Quantity  : ${qty}
Total     : ₹${total}

----------------------------

👤 CUSTOMER DETAILS

Name              : ${customerName}
Mobile No         : ${mobileNo}
Alt. Mobile No    : ${altMobileNo || "N/A"}

📍 Address:
${address}`;

  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
});
