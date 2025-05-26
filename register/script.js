const form = document.getElementById("registerForm");
const closePopupBtn = document.getElementById("closePopup");


form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullname = form.fullname.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  // Simple validation
  if (!fullname || !email || !password || !confirmPassword) {
    alert("Vui lòng điền đầy đủ thông tin.");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp.");
    return;
  }

    welcomeMessage.textContent = `Chào mừng ${fullname}, bạn đã đăng ký thành công!`;
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
