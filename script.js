const text = "WELCOME";
const welcomeEl = document.getElementById("welcome");
const startEl = document.getElementById("start");

let index = 0;

function typeText() {
  if (index < text.length) {
    welcomeEl.textContent += text[index];
    index++;
    setTimeout(typeText, 150);
  } else {
    setTimeout(() => {
      startEl.classList.remove("hidden");
    }, 600);
  }
}

typeText();

// 클릭 시 게임 페이지로 이동
document.addEventListener("click", () => {
  window.location.href = "game.html"; // 나중에 실제 게임 주소
});
