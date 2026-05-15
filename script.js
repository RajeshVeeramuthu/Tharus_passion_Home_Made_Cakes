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

function getSelectedWeight(card) {
  const selected = card.querySelector(".weight-box input[type='radio']:checked");
  return selected ? Number(selected.value) : 1;
}

function getSelectedWeightLabel(card) {
  const selected = card.querySelector(".weight-box input[type='radio']:checked");
  return selected ? selected.nextElementSibling?.textContent.trim() || "1 KG" : "1 KG";
}

function shouldUseWeightOptions(card) {
  const badge = card.querySelector(".kg-badge")?.innerText.trim().toLowerCase() || "";
  if (badge.includes("kg")) return true;
  const packMatch = badge.match(/(\d+)/);
  if (!packMatch) return false;
  const count = Number(packMatch[1]);
  return (badge.includes("pack") || badge.includes("box")) && count >= 5;
}

function updateCardTotal(card) {
  const basePrice = Number(card.dataset.basePrice || card.querySelector(".price").innerText.replace(/[^0-9]/g, "")) || 0;
  const qty = Number(card.querySelector(".qty-box input").value) || 1;
  const weight = getSelectedWeight(card);
  const weightPrice = Math.round(basePrice * weight);
  const total = weightPrice * qty;
  const totalDiv = card.querySelector(".total-price");
  const priceSpan = card.querySelector(".price");
  const badge = card.querySelector(".kg-badge");
  const label = currentLang === "ta" ? "மொத்தம்:" : "Total:";
  const weightLabel = getSelectedWeightLabel(card);

  if (priceSpan) {
    priceSpan.innerText = `₹${weightPrice}`;
  }
  if (badge) {
    badge.innerText = weightLabel;
  }
  if (totalDiv) {
    totalDiv.innerHTML = `${label} ₹${total}`;
  }
}

function updateTotal(button) {
  const card = button.closest(".cake-card");
  if (card) {
    updateCardTotal(card);
  }
}

function handleWeightChange(event) {
  const card = event.target.closest(".cake-card");
  if (card) {
    updateCardTotal(card);
  }
}

// ═══════════════════════════════════════════
// OPEN ORDER MODAL
// ═══════════════════════════════════════════

function openOrderModal(cakeName, kg, price, button) {
  const card = button.closest(".cake-card");
  const qty = Number(card.querySelector(".qty-box input").value) || 1;
  const weightLabel = getSelectedWeightLabel(card);
  const total = Number(card.querySelector(".total-price").innerText.replace(/[^0-9]/g, "")) || 0;

  document.getElementById("cakeName").value = cakeName;
  document.getElementById("cakeKg").value = weightLabel;
  document.getElementById("cakeQty").value = qty;
  document.getElementById("cakeTotal").value = total;

  new bootstrap.Modal(document.getElementById("orderModal")).show();
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".cake-card").forEach(card => {
    const kgBadge = card.querySelector(".kg-badge")?.innerText.trim() || "";
    if (!kgBadge.toLowerCase().includes("kg")) {
      return;
    }

    const priceSpan = card.querySelector(".price");
    const basePrice = Number(priceSpan?.innerText.replace(/[^0-9]/g, "")) || 0;
    card.dataset.basePrice = basePrice;

    const groupName = `weight-${Math.random().toString(36).substr(2, 6)}`;
    const weightBox = document.createElement("div");
    weightBox.className = "weight-box";
    weightBox.innerHTML = `
      <span data-en="Weight:" data-ta="எடை:">Weight:</span>
      <label>
        <input type="radio" name="${groupName}" value="0.5" data-label="500g">
        <span data-en="500g" data-ta="500 கிராம்">500g</span>
      </label>
      <label>
        <input type="radio" name="${groupName}" value="1" data-label="1kg" checked>
        <span data-en="1kg" data-ta="1 கிலோ">1kg</span>
      </label>
      <label>
        <input type="radio" name="${groupName}" value="2" data-label="2kg">
        <span data-en="2kg" data-ta="2 கிலோ">2kg</span>
      </label>
      <label>
        <input type="radio" name="${groupName}" value="3" data-label="3kg">
        <span data-en="3kg" data-ta="3 கிலோ">3kg</span>
      </label>
      <label>
        <input type="radio" name="${groupName}" value="4" data-label="4kg">
        <span data-en="4kg" data-ta="4 கிலோ">4kg</span>
      </label>
    `;

    priceSpan.parentElement.insertAdjacentElement("afterend", weightBox);
    weightBox.addEventListener("change", handleWeightChange);
    updateCardTotal(card);
  });
});

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

/* ─────────────────────────────
   POPUP OPEN/CLOSE
─────────────────────────────*/

const openBtn = document.getElementById("openCakePopup");
const popup = document.getElementById("cakePopup");
const closeBtn = document.getElementById("closeCakePopup");

openBtn.addEventListener("click", () => {
  popup.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  popup.classList.remove("active");
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.classList.remove("active");
  }
});

/* ─────────────────────────────
   WHATSAPP SUBMIT
─────────────────────────────*/

document
  .getElementById("customCakeForm")
  .addEventListener("submit", function (e) {

    e.preventDefault();

    const name =
      document.getElementById("customerName1").value;

    const mobile =
      document.getElementById("customerMobile").value;

    const theme =
      document.getElementById("cakeTheme").value;

    const description =
      document.getElementById("cakeDescription").value;
      const address     = document.getElementById("address1").value;

    const message =
`🎂 *CUSTOM CAKE ORDER*

👤 Name: ${name}
📞 Mobile: ${mobile}

🎉 Theme:
${theme}

📝 Cake Description:
${description}
📍 Address:
${address}

📸 I will send reference images separately.`;

    const whatsappURL =
`https://wa.me/916382130293?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");

});
