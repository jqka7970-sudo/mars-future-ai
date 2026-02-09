const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 임시 플레이어 ID (나중에 localStorage로 교체)
const playerId = "MARS-" + Math.random().toString(36).substring(2, 6).toUpperCase();
document.getElementById("playerId").textContent = `ID: ${playerId}`;

// 테스트용 배경 그리기
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff2e2e";
  ctx.font = "16px 'Press Start 2P'";
  ctx.textAlign = "center";
  ctx.fillText("MARS DEFENSE ONLINE", canvas.width / 2, canvas.height / 2 - 20);

  ctx.font = "10px 'Press Start 2P'";
  ctx.fillText("GAME SYSTEM READY", canvas.width / 2, canvas.height / 2 + 20);
}

draw();
