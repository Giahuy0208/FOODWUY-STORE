const fullText = document.getElementById("text").innerText;
const textElement = document.getElementById("text");
const toggleLink = document.getElementById("docthem");

const shortText = fullText.slice(0, 100) + "...";

let isExpanded = false;

// Ban đầu hiển thị rút gọn
textElement.innerText = shortText;

toggleLink.addEventListener("click", function (e) {
  e.preventDefault();
  isExpanded = !isExpanded;

  if (isExpanded) {
    textElement.innerText = fullText;
    toggleLink.innerText = "Thu gọn";
  } else {
    textElement.innerText = shortText;
    toggleLink.innerText = "Đọc thêm";
  }
});