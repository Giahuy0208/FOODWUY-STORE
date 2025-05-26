const loginForm = document.getElementById("loginForm");
const closePopupBtn = document.getElementById("closePopup");
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value.trim();

  if (!email || !password) {
    alert("Vui lòng nhập email và mật khẩu.");
    return;
  }

    welcomeMessage.textContent = `Bạn đã đăng nhập thành công!`;
  successPopup.classList.add("active");

  // Reset form
  form.reset();
});

// Xử lý đóng popup và chuyển trang
closePopupBtn.addEventListener("click", () => {
  successPopup.classList.remove("active");
  
  // Đợi hiệu ứng đóng popup hoàn thành rồi mới chuyển trang
  setTimeout(() => {
    window.location.href = "../index.html";
  }, 300);
});
