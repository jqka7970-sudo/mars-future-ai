/**********************
 * CONFIG
 **********************/
const WIDTH = 960;
const HEIGHT = 540;
const ROUND_TIME = 90;
const MAX_ROUND = 30;

/**********************
 * GAME STATE
 **********************/
const GameState = {
  IDLE: "IDLE",
  PLAYING: "PLAYING",
  CLEAR: "CLEAR",
  FAIL: "FAIL"
};

let state = GameState.IDLE;
let round = 1;
let timeLeft = ROUND_TIME;
let score = 0;

/**********************
 * PATH (랜타디 스타일)
 **********************/
const path = [
  { x: -20, y: 270 },
  { x: 200, y: 270 },
  { x: 200, y: 420 },
  { x: 760, y: 420 },
  { x: 760, y: 120 },
  { x: 980, y: 120 }
];

/**********************
 * PHASER
 **********************/
const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#120000",
  scene: { create, update }
};

new Phaser.Game(config);

/**********************
 * GLOBALS
 **********************/
let enemies;
let towers;
let bullets;
let timerEvent;
let startText;
let uiText;

/**********************
 * CREATE
 **********************/
function create() {
  const cx = WIDTH / 2;

  enemies = this.add.group();
  towers = this.add.group();
  bullets = this.add.group();

  // UI
  uiText = this.add.text(cx, 20, uiString(), {
    fontSize: "12px",
    color: "#ff2e2e"
  }).setOrigin(0.5, 0);

  startText = this.add.text(cx, HEIGHT / 2, "GAME START", {
    fontSize: "18px",
    color: "#ffffff"
  }).setOrigin(0.5).setInteractive();

  startText.on("pointerdown", () => {
    if (state === GameState.IDLE) startRound.call(this);
  });

  // 타워 설치
  this.input.on("pointerdown", p => {
    if (state !== GameState.PLAYING) return;
    placeTower(this, p.x, p.y);
  });
}

/**********************
 * ROUND CONTROL
 **********************/
function startRound() {
  state = GameState.PLAYING;
  startText.setVisible(false);
  timeLeft = ROUND_TIME;

  timerEvent = this.time.addEvent({
    delay: 1000,
    repeat: ROUND_TIME,
    callback: () => {
      timeLeft--;
      if (timeLeft <= 0) failGame.call(this);
    }
  });

  spawnWave(this, round);
}

function clearRound() {
  state = GameState.IDLE;
  round++;
  score += round * 1000 + timeLeft * 50;
  startText.setText("NEXT ROUND").setVisible(true);

  if (round > MAX_ROUND) {
    startText.setText("ALL CLEAR");
  }
}

function failGame() {
  state = GameState.FAIL;
  this.add.text(WIDTH / 2, HEIGHT / 2 + 80, "MISSION FAILED", {
    fontSize: "14px",
    color: "#ff0000"
  }).setOrigin(0.5);
}

/**********************
 * ENEMY
 **********************/
function spawnWave(scene, r) {
  const count = 5 + r * 2;

  for (let i = 0; i < count; i++) {
    scene.time.delayedCall(i * 600, () => {
      const e = scene.add.rectangle(path[0].x, path[0].y, 18, 18, 0xff5555);
      e.hp = 3 + r;
      e.speed = 50 + r * 2;
      e.i = 0;
      enemies.add(e);
    });
  }
}

/**********************
 * TOWER
 **********************/
function placeTower(scene, x, y) {
  const t = scene.add.circle(x, y, 10, 0x00ffcc);
  t.range = 120;
  t.cooldown = 500;
  t.lastShot = 0;
  towers.add(t);
}

/**********************
 * UPDATE LOOP
 **********************/
function update(time, delta) {
  if (state !== GameState.PLAYING) return;

  // 적 이동
  enemies.getChildren().forEach(e => {
    const target = path[e.i + 1];
    if (!target) {
      e.destroy();
      return;
    }

    const dx = target.x - e.x;
    const dy = target.y - e.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 2) {
      e.i++;
    } else {
      e.x += (dx / dist) * e.speed * delta / 1000;
      e.y += (dy / dist) * e.speed * delta / 1000;
    }
  });

  // 타워 공격
  towers.getChildren().forEach(t => {
    if (time < t.lastShot + t.cooldown) return;

    const target = enemies.getChildren().find(e =>
      Phaser.Math.Distance.Between(t.x, t.y, e.x, e.y) < t.range
    );

    if (target) {
      shoot(this, t, target);
      t.lastShot = time;
    }
  });

  // 탄환
  bullets.getChildren().forEach(b => {
    b.x += b.vx;
    b.y += b.vy;

    if (Phaser.Math.Distance.Between(b.x, b.y, b.tx, b.ty) < 5) {
      b.target.hp--;
      if (b.target.hp <= 0) {
        b.target.destroy();
        score += 100;
      }
      b.destroy();
    }
  });

  // 웨이브 종료 체크
  if (enemies.countActive() === 0 && timeLeft > 0) {
    clearRound();
  }

  uiText.setText(uiString());
}

/**********************
 * BULLET
 **********************/
function shoot(scene, tower, enemy) {
  const angle = Phaser.Math.Angle.Between(tower.x, tower.y, enemy.x, enemy.y);
  const b = scene.add.circle(tower.x, tower.y, 3, 0xffffff);
  b.vx = Math.cos(angle) * 6;
  b.vy = Math.sin(angle) * 6;
  b.tx = enemy.x;
  b.ty = enemy.y;
  b.target = enemy;
  bullets.add(b);
}

/**********************
 * UI STRING
 **********************/
function uiString() {
  return `ROUND ${round}/${MAX_ROUND}   TIME ${timeLeft}s   SCORE ${score}`;
}
