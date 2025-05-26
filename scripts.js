const orderButtons = document.querySelectorAll(".order-food");
const addButtons = document.querySelectorAll(".add-food");

const orderPopup = document.getElementById("orderPopup");
const closePopupBtn = document.getElementById("closePopup");
const foodNameInput = document.getElementById("foodName");
const orderForm = document.getElementById("orderForm");

const cartIcon = document.getElementById("cart-icon");
const headerCartBtn = document.getElementById("headerCartBtn");
const cartCount = document.getElementById("cart-count");

const cartPopup = document.getElementById("cartPopup");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");

const cartOrderForm = document.getElementById("cartOrderForm");
const cusNameInput = document.getElementById("cusName");
const cusPhoneInput = document.getElementById("cusPhone");
const cusAddressInput =
  document.querySelector("#cartOrderForm input[name='diachi']") ||
  document.getElementById("diachi");

if (!window.localStorage) {
  console.error("Trình duyệt không hỗ trợ localStorage!");
  showNotification("Lỗi", "Trình duyệt của bạn không hỗ trợ lưu trữ giỏ hàng!", "error");
}

let cart = [];
try {
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  if (Array.isArray(storedCart)) {
    cart = storedCart;
  }
} catch (e) {
  console.error("Lỗi khi đọc giỏ hàng từ localStorage:", e);
}

const saveCartToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const priceNumber = (txt) => parseInt(txt.replace(/[^\d]/g, ""), 10) || 0;

const updateCartCount = () => {
  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;
  const headerCount = document.getElementById("cart-count-header");
  if (headerCount) headerCount.textContent = totalQty;
};
updateCartCount();
const updateCartPopup = () => {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Giỏ hàng đang trống.</p>";
    cartTotalSpan.textContent = "0 VND";
    return;
  }

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">${(item.price * item.qty).toLocaleString()} VND</span>
      </div>
      <div class="quantity-control">
        <button class="qty-btn qty-decrease" data-index="${index}">-</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn qty-increase" data-index="${index}">+</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
    total += item.price * item.qty;
  });

  cartTotalSpan.textContent = total.toLocaleString() + " VND";

  const increaseButtons = cartItemsDiv.querySelectorAll(".qty-increase");
  const decreaseButtons = cartItemsDiv.querySelectorAll(".qty-decrease");

  increaseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      cart[idx].qty++;
      updateCartCount();
      updateCartPopup();
      saveCartToLocalStorage();
      triggerAnimation(cartIcon, "cart-shake");
    });
  });

  decreaseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-index"));
      cart[idx].qty--;
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      updateCartCount();
      updateCartPopup();
      saveCartToLocalStorage();
      triggerAnimation(cartIcon, "cart-shake");
    });
  });
};

const notificationPopup = document.getElementById("notificationPopup");
const confirmPopup = document.getElementById("confirmPopup");
const closeNotification = document.getElementById("closeNotification");
const closeConfirm = document.getElementById("closeConfirm");
const notificationOkBtn = document.getElementById("notificationOkBtn");
const confirmCancelBtn = document.getElementById("confirmCancelBtn");
const confirmOkBtn = document.getElementById("confirmOkBtn");

function showNotification(title, message, type = "success") {
  document.getElementById("notificationTitle").textContent = title;
  document.getElementById("notificationMessage").textContent = message;

  const iconContainer = document.querySelector(".notification-icon");
  const okBtn = document.getElementById("notificationOkBtn");

  if (type === "success") {
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60">
        <path fill="#2ecc71" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.7 14.3L6.7 12l1.4-1.4 2.2 2.2 5.6-5.6 1.4 1.4-7 7z"/>
      </svg>
    `;
    okBtn.textContent = "OK";
    okBtn.classList.remove("error");
  } else if (type === "error") {
    iconContainer.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60">
        <path fill="#e74c3c" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z"/>
      </svg>
    `;
    okBtn.textContent = "Đóng";
    okBtn.classList.add("error");
  }

  notificationPopup.style.display = "flex";
}

function showConfirmation(title, message, onConfirm) {
  document.getElementById("confirmTitle").textContent = title;
  document.getElementById("confirmMessage").textContent = message;

  const newConfirmOkBtn = confirmOkBtn.cloneNode(true);
  confirmOkBtn.parentNode.replaceChild(newConfirmOkBtn, confirmOkBtn);

  newConfirmOkBtn.addEventListener("click", () => {
    confirmPopup.style.display = "none";
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  });

  confirmPopup.style.display = "flex";
}

closeNotification.addEventListener("click", () => {
  notificationPopup.style.display = "none";
});

closeConfirm.addEventListener("click", () => {
  confirmPopup.style.display = "none";
});

notificationOkBtn.addEventListener("click", () => {
  notificationPopup.style.display = "none";
});

confirmCancelBtn.addEventListener("click", () => {
  confirmPopup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === notificationPopup) {
    notificationPopup.style.display = "none";
  }
  if (e.target === confirmPopup) {
    confirmPopup.style.display = "none";
  }
});

const clearCartBtn = document.getElementById("clearCartBtn");
if (clearCartBtn) {
  clearCartBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      showNotification("Thông báo", "Giỏ hàng đã trống!", "error");
      return;
    }

    showConfirmation(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
      () => {
        cart = [];
        updateCartCount();
        updateCartPopup();
        saveCartToLocalStorage();
        triggerAnimation(cartIcon, "cart-shake");
        showNotification("Thành công!", "Đã xóa tất cả sản phẩm khỏi giỏ hàng.");
      }
    );
  });
}

orderButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    let food = btn.closest(".food-card");

    // Nếu không có .food-card (ví dụ như trong sp1.html), tìm theo class khác
    if (!food) {
      const title = document.querySelector(".food-title")?.textContent?.trim();
      if (title) foodNameInput.value = title;
      orderPopup.style.display = "flex";
      return;
    }

    const name = food.querySelector(".food-title").textContent.trim();
    foodNameInput.value = name;
    orderPopup.style.display = "flex";
  });
});

closePopupBtn.addEventListener("click", () => {
  orderPopup.style.display = "none";
});

orderForm.addEventListener("submit", (e) => {
  e.preventDefault();
  showNotification(
    "Đặt hàng thành công!",
    `Cảm ơn bạn ${orderForm.customerName.value} đã đặt ${orderForm.quantity.value} món ${orderForm.foodName.value}. Chúng tôi sẽ liên hệ qua số ${orderForm.phone.value} và giao đến địa chỉ ${orderForm.diachi.value}.`
  );
  orderForm.reset();
  orderPopup.style.display = "none";
});

function triggerAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}

addButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    let food = btn.closest(".food-card");

    // Trường hợp là sp1.html
    if (!food) {
      const name = document.querySelector(".food-title")?.textContent?.trim();
      const priceText =
        document.querySelector(".fprice")?.textContent ||
        document.querySelector(".food-price")?.textContent;
      const price = priceNumber(priceText);

      if (!name || !price) {
        showNotification("Lỗi", "Không thể thêm sản phẩm vào giỏ!", "error");
        return;
      }

      const existingItem = cart.find((item) => item.name === name);
      if (existingItem) {
        existingItem.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }

      updateCartCount();
      saveCartToLocalStorage();
      showNotification("Thành công!", `Đã thêm ${name} vào giỏ hàng!`);
      return;
    }

    // Trường hợp thông thường
    food.classList.add("added-effect");
    setTimeout(() => {
      food.classList.remove("added-effect");
    }, 500);

    const img = food.querySelector(".food-img");
    const cartIcon = document.getElementById("cart-icon");

    const imgClone = img.cloneNode(true);
    const rect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    imgClone.classList.add("fly-img");
    imgClone.style.top = rect.top + "px";
    imgClone.style.left = rect.left + "px";
    imgClone.style.width = rect.width + "px";
    imgClone.style.height = rect.height + "px";
    document.body.appendChild(imgClone);

    setTimeout(() => {
      const deltaX =
        cartRect.left + cartRect.width / 2 - (rect.left + rect.width / 2);
      const deltaY =
        cartRect.top + cartRect.height / 2 - (rect.top + rect.height / 2);

      imgClone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
      imgClone.style.opacity = 0;
    }, 10);

    setTimeout(() => {
      imgClone.remove();
      triggerAnimation(cartIcon, "cart-shake");
    }, 500);

    const name = food.querySelector(".food-title").textContent.trim();
    const price = priceNumber(food.querySelector(".food-price").textContent);

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    updateCartCount();
    saveCartToLocalStorage();
  });
});

const showCartPopup = () => {
  updateCartPopup();
  cartPopup.style.display = "flex";
};

cartIcon.addEventListener("click", showCartPopup);

if (headerCartBtn) {
  headerCartBtn.addEventListener("click", showCartPopup);
}

closeCartBtn.addEventListener("click", () => {
  cartPopup.style.display = "none";
});

cartOrderForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    showNotification("Thông báo", "Giỏ hàng của bạn đang trống!", "error");
    return;
  }

  showNotification(
    "Đặt hàng thành công!",
    `Cảm ơn bạn ${cusNameInput.value} đã đặt hàng. Tổng tiền: ${cartTotalSpan.textContent}. Chúng tôi sẽ liên hệ qua số ${cusPhoneInput.value} và giao đến địa chỉ ${cusAddressInput.value}.`
  );

  cart = [];
  updateCartCount();
  updateCartPopup();
  saveCartToLocalStorage();
  cartPopup.style.display = "none";
  cartOrderForm.reset();
});

const contactBtn = document.getElementById("contactBtn");
const footerContactBtn = document.getElementById("footerContactBtn");
const contactPopup = document.getElementById("contactPopup");
const closeContact = document.getElementById("closeContact");

contactBtn.addEventListener("click", () => {
  contactPopup.style.display = "flex";
});
footerContactBtn.addEventListener("click", () => {
  contactPopup.style.display = "flex";
});
closeContact.addEventListener("click", () => {
  contactPopup.style.display = "none";
});
contactPopup.addEventListener("click", (e) => {
  if (e.target === contactPopup) contactPopup.style.display = "none";
});

const aboutUsBtn = document.getElementById("aboutUsBtn");
const aboutUsPopup = document.getElementById("aboutUsPopup");
const closeAboutUs = document.getElementById("closeAboutUs");

aboutUsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  aboutUsPopup.style.display = "flex";
});

closeAboutUs.addEventListener("click", () => {
  aboutUsPopup.style.display = "none";
});

aboutUsPopup.addEventListener("click", (e) => {
  if (e.target === aboutUsPopup) {
    aboutUsPopup.style.display = "none";
  }
});

const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const currentScroll = window.scrollY;

    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    button.classList.add('active');

    const tabId = button.getAttribute('data-tab');
    document.getElementById(`${tabId}-container`).classList.add('active');

    if (tabId === "food") {
      setupPagination("food-container", "food-pagination", 9);
    } else if (tabId === "drink") {
      setupPagination("drink-container", "drink-pagination", 9);
    }

    setTimeout(() => {
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    }, 0);
  });
});

const loginPopup = document.getElementById("loginPopup");
const closeLoginPopup = document.getElementById("closeLoginPopup");
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  loginPopup.style.display = "flex";
});

document.getElementById("registerBtn").addEventListener("click", () => {
  window.location.href = "register/register.html";
});

closeLoginPopup.addEventListener("click", () => {
  loginPopup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === loginPopup) {
    loginPopup.style.display = "none";
  }
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = loginForm.loginUsername.value;
  const password = loginForm.loginPassword.value;

  loginForm.reset();
  loginPopup.style.display = "none";

  showNotification("Thành công!", `Xin chào ${username}, bạn đã đăng nhập thành công!`);
});

const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let currentIndex = 0;

const dotsContainer = document.getElementById("sliderDots");

slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.classList.add("slider-dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    currentIndex = index;
    showSlide(currentIndex);
  });
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".slider-dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
      dots[i].classList.add("active");
    }
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

setInterval(nextSlide, 3000);

nextBtn.addEventListener("click", () => {
  nextSlide();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

function setupPagination(containerId, paginationId, itemsPerPage = 9) {
  const container = document.getElementById(containerId);
  const items = Array.from(container.querySelectorAll(".food-card"));
  const pagination = document.getElementById(paginationId);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  function showPage(page) {
    items.forEach((item, i) => {
      const visible = (i >= (page - 1) * itemsPerPage && i < page * itemsPerPage);
      item.style.display = visible ? "" : "none";
    });

    const rows = container.querySelectorAll(".main-food");
    rows.forEach(row => {
      const visibleCards = row.querySelectorAll(".food-card:not([style*='display: none'])");
      row.style.display = visibleCards.length > 0 ? "flex" : "none";
    });

    const buttons = pagination.querySelectorAll("button");
    buttons.forEach(btn => btn.classList.remove("active"));
    if (buttons[page - 1]) buttons[page - 1].classList.add("active");

    const searchBox = document.getElementById("search");
    if (searchBox) {
      searchBox.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.addEventListener("click", () => showPage(i));
    pagination.appendChild(btn);
  }

  if (items.length > 0) showPage(1);
}

document.addEventListener("DOMContentLoaded", () => {
  setupPagination("food-container", "food-pagination", 9);
  setupPagination("drink-container", "drink-pagination", 9);
});

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
  updateCartCount();
});

window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash;

  const params = new URLSearchParams(hash.replace('#', '').replaceAll('&', '&'));
  const tab = params.get('tab');
  const scrollTarget = params.get('scroll');

  if (tab === 'drink') {
    const drinkBtn = document.querySelector('[data-tab="drink"]');
    if (drinkBtn) {
      drinkBtn.click();

      // Sau khi tab được bật, scroll xuống mục tương ứng (nếu có)
      setTimeout(() => {
        if (scrollTarget) {
          const targetEl = document.getElementById(scrollTarget);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 400);
    }
  }
});

