const GameState = {
  IDLE: "IDLE",
  PLAYING: "PLAYING",
  CLEAR: "CLEAR",
  FAIL: "FAIL",
  END: "END"
};

let currentRound = 1;
const maxRound = 30;
let gameState = GameState.IDLE;
let timeLeft = 90;
let score = 0;

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#120000",
  scene: {
    create,
    update
  }
};

const game = new Phaser.Game(config);
const GameState = {
  IDLE: "IDLE",
  PLAYING: "PLAYING",
  CLEAR: "CLEAR",
  FAIL: "FAIL",
  END: "END"
};

let currentRound = 1;
const maxRound = 30;
let gameState = GameState.IDLE;
let timeLeft = 90;
let score = 0;

const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: "#120000",
  scene: {
    create,
    update
  }
};

const game = new Phaser.Game(config);
function startRound() {
  gameState = GameState.PLAYING;
  startText.setVisible(false);

  timeLeft = 90;
  updateTimerText();

  this.time.addEvent({
    delay: 1000,
    repeat: 89,
    callback: () => {
      timeLeft--;
      updateTimerText();
      if (timeLeft <= 0) {
        failRound.call(this);
      }
    }
  });
}
function updateTimerText() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const s = (timeLeft % 60).toString().padStart(2, "0");
  timerText.setText(`TIME ${m}:${s}`);
}
function failRound() {
  gameState = GameState.FAIL;

  this.add.text(
    this.cameras.main.width / 2,
    this.cameras.main.height / 2 + 60,
    "TIME OVER",
    {
      fontFamily: "'Press Start 2P'",
      fontSize: "14px",
      color: "#ff0000"
    }
  ).setOrigin(0.5);
}
const pathPoints = [
  { x: -20, y: 270 },
  { x: 200, y: 270 },
  { x: 200, y: 420 },
  { x: 760, y: 420 },
  { x: 760, y: 120 },
  { x: 980, y: 120 }
];
let enemies;
enemies = this.add.group();
function spawnEnemy(scene) {
  const enemy = scene.add.rectangle(
    pathPoints[0].x,
    pathPoints[0].y,
    18,
    18,
    0xff5555
  );

  enemy.pathIndex = 0;
  enemy.speed = 60; // px per second

  enemies.add(enemy);
}
scene: {
  create,
  update
}
function update(time, delta) {
  if (gameState !== GameState.PLAYING) return;

  enemies.getChildren().forEach(enemy => {
    const target = pathPoints[enemy.pathIndex + 1];
    if (!target) return;

    const dx = target.x - enemy.x;
    const dy = target.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 2) {
      enemy.pathIndex++;
      if (enemy.pathIndex >= pathPoints.length - 1) {
        enemy.destroy(); // 기지 도달 (나중에 HP 감소)
      }
      return;
    }

    const vx = (dx / dist) * enemy.speed * (delta / 1000);
    const vy = (dy / dist) * enemy.speed * (delta / 1000);

    enemy.x += vx;
    enemy.y += vy;
  });
}
spawnEnemy(this);
