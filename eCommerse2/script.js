// Shop details
const SHOP = {
  name: "JK eCommerse",
  whatsapp: "918960597012",
  email: "bhaskarsachan32@gmail.com",
  upi: "bhaskarsachan31@pingpay",
  deliveryCharge: 60,
  freeDeliveryAbove: 1500
};

// Sample products: replace with your actual inventory.
const products = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    category: "Outerwear",
    price: 899,
    size: "M",
    condition: "Very good",
    description: "Classic blue denim jacket with a relaxed fit.",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Everyday White Tee",
    category: "Tops",
    price: 299,
    size: "S",
    condition: "Like new",
    description: "A clean cotton tee for everyday outfits.",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Relaxed Blue Jeans",
    category: "Bottoms",
    price: 649,
    size: "L",
    condition: "Very good",
    description: "Relaxed-fit jeans with a timeless blue wash.",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Soft Knit Sweater",
    category: "Tops",
    price: 549,
    size: "M",
    condition: "Good",
    description: "A cosy neutral knit that layers easily.",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Retro Shoulder Bag",
    category: "Accessories",
    price: 399,
    size: "One size",
    condition: "Very good",
    description: "A vintage-inspired everyday bag.",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Classic Beige Coat",
    category: "Outerwear",
    price: 1199,
    size: "L",
    condition: "Very good",
    description: "A timeless beige coat for smart casual looks.",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Pleated Midi Skirt",
    category: "Bottoms",
    price: 499,
    size: "S",
    condition: "Like new",
    description: "A lightweight pleated skirt.",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Striped Button Shirt",
    category: "Tops",
    price: 449,
    size: "M",
    condition: "Good",
    description: "A relaxed striped shirt.",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=80"
  },
  {
  id: 9,
  name: "Black Oversized T-Shirt",
  category: "Tops",
  price: 399,
  size: "L",
  condition: "New",
  description: "Comfortable black oversized cotton T-shirt.",
  image: "black-tshirt.jpg"
}
];

const sizes = ["XS", "S", "M", "L", "XL", "One size"];

let selectedCategory = "All";
let cart = [];

// Restore cart from browser storage.
try {
  const saved = JSON.parse(localStorage.getItem("jkCart") || "[]");

  if (Array.isArray(saved)) {
    cart = saved
      .filter(item =>
        item &&
        products.some(product => product.id === item.id) &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 99
      )
      .map(item => ({
        id: item.id,
        quantity: item.quantity,
        size: sizes.includes(item.size)
          ? item.size
          : products.find(product => product.id === item.id).size
      }));
  }
} catch (_) {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem("jkCart", JSON.stringify(cart));
  } catch (_) {
    // Cart still works if browser storage is unavailable.
  }
}

function money(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[character]));
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => {
    const product = products.find(product => product.id === item.id);
    return sum + product.price * item.quantity;
  }, 0);

  const delivery =
    subtotal === 0 || subtotal > SHOP.freeDeliveryAbove
      ? 0
      : SHOP.deliveryCharge;

  return {
    subtotal,
    delivery,
    total: subtotal + delivery
  };
}

// Display products.
function renderProducts() {
  const search = document
    .getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();

  const filtered = products.filter(product => {
    const matchesCategory =
      selectedCategory === "All" ||
      selectedCategory === product.category;

    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  const grid = document.getElementById("productGrid");

  if (!filtered.length) {
    grid.innerHTML = "<p>No products found. Try another search.</p>";
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${escapeHtml(product.image)}"
          alt="${escapeHtml(product.name)}"
          loading="lazy">

        <span class="condition-tag">
          ${escapeHtml(product.condition)}
        </span>
      </div>

      <h3>${escapeHtml(product.name)}</h3>

      <p class="product-description">
        ${escapeHtml(product.description)}
      </p>

      <p class="product-note">
        Sample listing · Confirm availability on WhatsApp
      </p>

      <div class="price-row">
        <span class="price">${money(product.price)}</span>

        <button
          class="add-button"
          onclick="addToCart(${product.id})">
          + Add to cart
        </button>
      </div>
    </article>
  `).join("");
}

function setCategory(category, button) {
  selectedCategory = category;

  document.querySelectorAll(".filter-button").forEach(item => {
    item.classList.remove("selected");
  });

  button.classList.add("selected");
  renderProducts();
}

function addToCart(productId) {
  const product = products.find(product => product.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    if (existing.quantity >= 99) {
      showToast("Maximum quantity is 99.");
      return;
    }

    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      quantity: 1,
      size: product.size
    });
  }

  updateCartCount();
  showToast("Added to your cart!");
}

function updateCartCount() {
  saveCart();

  document.getElementById("cartCount").textContent =
    cart.reduce((sum, item) => sum + item.quantity, 0);
}

function showPage(page) {
  document.getElementById("explorePage")
    .classList.toggle("hidden", page !== "explore");

  document.getElementById("cartPage")
    .classList.toggle("hidden", page !== "cart");

  document.getElementById("exploreNav")
    .classList.toggle("active", page === "explore");

  document.getElementById("cartNav")
    .classList.toggle("active", page === "cart");

  if (page === "cart") {
    renderCart();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function renderCart() {
  const container = document.getElementById("cartItems");

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <h2>Your cart is empty.</h2>
        <p>Add something you love from the collection.</p>

        <button
          class="dark-button"
          onclick="showPage('explore')">
          Explore collection
        </button>
      </div>
    `;
  } else {
    container.innerHTML = cart.map(item => {
      const product = products.find(
        product => product.id === item.id
      );

      return `
        <article class="cart-item">
          <img
            src="${escapeHtml(product.image)}"
            alt="${escapeHtml(product.name)}">

          <div>
            <h3>${escapeHtml(product.name)}</h3>

            <p>
              ${escapeHtml(product.condition)} ·
              ${escapeHtml(product.category)}
            </p>

            <label>
              Size:
              <select
                class="size-select"
                onchange="changeSize(${product.id}, this.value)">
                ${sizes.map(size => `
                  <option
                    value="${size}"
                    ${size === item.size ? "selected" : ""}>
                    ${size}
                  </option>
                `).join("")}
              </select>
            </label>

            <div class="quantity-controls">
              <button
                aria-label="Decrease quantity"
                onclick="changeQuantity(${product.id}, -1)">
                −
              </button>

              <span>${item.quantity}</span>

              <button
                aria-label="Increase quantity"
                onclick="changeQuantity(${product.id}, 1)">
                +
              </button>
            </div>

            <button
              class="remove-button"
              onclick="removeFromCart(${product.id})">
              Remove
            </button>
          </div>

          <strong>
            ${money(product.price * item.quantity)}
          </strong>
        </article>
      `;
    }).join("");
  }

  const totals = calculateTotals();

  document.getElementById("subtotal").textContent =
    money(totals.subtotal);

  document.getElementById("delivery").textContent =
    totals.delivery === 0 ? "FREE" : money(totals.delivery);

  document.getElementById("total").textContent =
    money(totals.total);
}

function changeQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  if (item.quantity + change > 99) {
    showToast("Maximum quantity is 99.");
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }

  updateCartCount();
  renderCart();
}

function changeSize(productId, size) {
  const item = cart.find(item => item.id === productId);

  if (item && sizes.includes(size)) {
    item.size = size;
    saveCart();
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);

  updateCartCount();
  renderCart();
  showToast("Item removed.");
}

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// Checkout
function checkout() {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  document.getElementById("orderDraft").classList.add("hidden");

  const totals = calculateTotals();

  document.getElementById("checkoutTotal").textContent =
    `Subtotal ${money(totals.subtotal)} + ` +
    `delivery ${money(totals.delivery)} = ` +
    money(totals.total);

  updatePaymentView();
  document.getElementById("checkoutDialog").showModal();
}

function updatePaymentView() {
  const isUpi =
    document.getElementById("paymentMethod").value === "upi";

  document.getElementById("upiInstructions")
    .classList.toggle("hidden", !isUpi);

  document.getElementById("codInstructions")
    .classList.toggle("hidden", isUpi);

  const total = calculateTotals().total;

  document.getElementById("qrAmount").textContent =
    "Amount to enter: " + money(total);

  const params = new URLSearchParams({
    pa: SHOP.upi,
    pn: SHOP.name,
    am: total.toFixed(2),
    cu: "INR",
    tn: "JK eCommerse order - confirm on WhatsApp"
  });

  document.getElementById("upiPayLink").href =
    "upi://pay?" + params.toString();

  if (isUpi) {
    drawPaymentQr();
  }
}

// Pre-generated QR matrix for:
// upi://pay?pa=bhaskarsachan31%40pingpay&pn=JK+eCommerse&cu=INR
//
// This QR contains the UPI ID but no fixed payment amount.
// If you change the UPI ID, regenerate this QR matrix too.
const paymentQrRows = `
00000000000000000000000000000000000000000
00000000000000000000000000000000000000000
00000000000000000000000000000000000000000
00000000000000000000000000000000000000000
00001111111010010100111000100011111110000
00001000001000100100110011001010000010000
00001011101010111111010011010010111010000
00001011101000101000111011110010111010000
00001011101001101111011001101010111010000
00001000001010101010000001001010000010000
00001111111010101010101010101011111110000
00000000000001000001101100010000000000000
00001010001101001010100100000001001010000
00001101100000110111000110010011000010000
00000001001010111001010111010011111010000
00001111110101100100001100100010010100000
00001010011111011101101101011011010100000
00000010100110101000100111001110011110000
00000000001110000101001101111110110010000
00001010100111001100001010010100110100000
00001010011001111000000100001010010010000
00000100000110101011000110011111001010000
00001111001100011011000100111110001010000
00000100110111001001000000100001100000000
00000101011001001111100110011010000110000
00000000010101101100110110001011010110000
00001111001111001101011101110100100010000
00000001110111110000100010101100010100000
00001100111010100110000010001111100000000
00000000000010011111000111111000101110000
00001111111011001001101100001010110010000
00001000001001010011101100111000100000000
00001011101000100110000010011111110110000
00001011101001001011001110011000100110000
00001011101011101101011100100001111110000
00001000001000011000101010111111110000000
00001111111010110001100010011100010010000
00000000000000000000000000000000000000000
00000000000000000000000000000000000000000
00000000000000000000000000000000000000000
00000000000000000000000000000000000000000
`.trim().split("\n");

function drawPaymentQr() {
  const canvas = document.getElementById("upiQr");
  const context = canvas.getContext("2d");

  const scale = 8;
  const count = paymentQrRows.length;

  canvas.width = count * scale;
  canvas.height = count * scale;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#000000";

  paymentQrRows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === "1") {
        context.fillRect(
          x * scale,
          y * scale,
          scale,
          scale
        );
      }
    });
  });
}

function downloadQr() {
  drawPaymentQr();

  const link = document.createElement("a");
  link.download = "JK-eCommerse-UPI-QR.png";
  link.href = document.getElementById("upiQr").toDataURL("image/png");

  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied!");
  } catch (_) {
    showToast("Please select and copy the text manually.");
  }
}

function copyUpi() {
  copyText(SHOP.upi);
}

function copyOrder() {
  copyText(document.getElementById("orderText").value);
}

// Create WhatsApp order draft.
document.getElementById("checkoutForm")
  .addEventListener("submit", function(event) {
    event.preventDefault();

    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }

    if (!this.reportValidity()) return;

    const data = new FormData(this);
    const totals = calculateTotals();

    const customer = data.get("customer").trim();
    const address = data.get("address").trim();

    if (!customer || address.length < 10) {
      showToast("Please enter your name and complete address.");
      return;
    }

    const reference =
      "JK-" +
      Date.now().toString(36).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const lines = [
      SHOP.name + " — Order request",
      "Reference: " + reference,
      "",
      "Name: " + customer,
      "Mobile: " + data.get("phone"),
      "Address: " + address,
      "PIN: " + data.get("pincode"),
      "Landmark: " + (data.get("landmark").trim() || "—"),
      "Customer confirms address within 20 km of LPU.",
      "",
      "Items:"
    ];

    cart.forEach(item => {
      const product = products.find(
        product => product.id === item.id
      );

      lines.push(
        product.name +
        " | Size: " + item.size +
        " | Qty: " + item.quantity +
        " | " + money(product.price * item.quantity)
      );
    });

    const paymentDescription =
      data.get("payment") === "cod"
        ? "Cash on Delivery — payable on delivery"
        : "UPI — receipt NOT verified; manual verification required";

    lines.push(
      "",
      "Subtotal: " + money(totals.subtotal),
      "Delivery: " + money(totals.delivery),
      "Total: " + money(totals.total),
      "Payment: " + paymentDescription,
      "",
      "Please confirm stock, delivery eligibility and total."
    );

    const message = lines.join("\n");

    document.getElementById("orderText").value = message;

    document.getElementById("whatsappOrderLink").href =
      "https://wa.me/" +
      SHOP.whatsapp +
      "?text=" +
      encodeURIComponent(message);

    document.getElementById("orderDraft")
      .classList.remove("hidden");

    document.getElementById("orderDraft")
      .scrollIntoView({ behavior: "smooth" });
  });

renderProducts();
updateCartCount();
