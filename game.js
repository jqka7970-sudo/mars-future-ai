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
