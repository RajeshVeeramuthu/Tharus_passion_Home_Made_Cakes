// SEARCH FUNCTION

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", function () {

  let filter = searchInput.value.toLowerCase();

  let items = document.querySelectorAll(".product-item");

  items.forEach(item => {

    let name = item.getAttribute("data-name").toLowerCase();

    if (name.includes(filter)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }

  });

});

// QTY INCREASE

function increaseQty(button) {

  let qtyInput = button.parentElement.querySelector("input");

  let qty = parseInt(qtyInput.value);

  qty++;

  qtyInput.value = qty;

  updateTotal(button);

}

// QTY DECREASE

function decreaseQty(button) {

  let qtyInput = button.parentElement.querySelector("input");

  let qty = parseInt(qtyInput.value);

  if (qty > 1) {
    qty--;
  }

  qtyInput.value = qty;

  updateTotal(button);

}

// UPDATE TOTAL PRICE

function updateTotal(button) {

  let card = button.closest(".cake-card");

  let priceText = card.querySelector(".price").innerText;

  let price = parseInt(priceText.replace("₹", ""));

  let qty = parseInt(card.querySelector(".qty-box input").value);

  let total = price * qty;

  card.querySelector(".total-price").innerText =
    `Total: ₹${total}`;

}

// OPEN MODAL

function openOrderModal(cakeName, kg, price, button) {

  let card = button.closest(".cake-card");

  let qty = parseInt(card.querySelector(".qty-box input").value);

  let total = qty * price;

  document.getElementById("cakeName").value = cakeName;
  document.getElementById("cakeKg").value = kg;
  document.getElementById("cakeQty").value = qty;
  document.getElementById("cakeTotal").value = total;

  let modal = new bootstrap.Modal(document.getElementById("orderModal"));

  modal.show();

}

// FORM SUBMIT

document.getElementById("orderForm").addEventListener("submit", function (e) {

  e.preventDefault();

  let cakeName = document.getElementById("cakeName").value;
  let kg = document.getElementById("cakeKg").value;
  let qty = document.getElementById("cakeQty").value;
  let total = document.getElementById("cakeTotal").value;

  let customerName = document.getElementById("customerName").value;
  let mobileNo = document.getElementById("mobileNo").value;
  let altMobileNo = document.getElementById("altMobileNo").value;
  let address = document.getElementById("address").value;

  // YOUR WHATSAPP NUMBER

  let phoneNumber = "916382130293";

  // WHATSAPP MESSAGE

  let message =
`🍰 ORDER DETAILS 🍰

Cake Name: ${cakeName}
KG / Pack: ${kg}
Quantity: ${qty}
Total Price: ₹${total}

----------------------------

👤 CUSTOMER DETAILS

Name: ${customerName}
Mobile No: ${mobileNo}
Alternative Mobile No: ${altMobileNo}

Address:
${address}`;

  let whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");

});