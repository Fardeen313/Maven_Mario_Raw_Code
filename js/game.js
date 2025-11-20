const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let mario = { x: 50, y: 300, width: 40, height: 40, velocityY: 0 };
let gravity = 1;
let isJumping = false;

let obstacles = [
  { x: 400, y: 320, width: 50, height: 30 },
  { x: 600, y: 300, width: 50, height: 50 }
];

function drawMario() {
  ctx.fillStyle = 'red';
  ctx.fillRect(mario.x, mario.y, mario.width, mario.height);
}

function drawObstacles() {
  ctx.fillStyle = 'green';
  obstacles.forEach(ob => {
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });
}

function update() {
  mario.velocityY += gravity;
  mario.y += mario.velocityY;

  if (mario.y >= 300) {
    mario.y = 300;
    mario.velocityY = 0;
    isJumping = false;
  }

  obstacles.forEach(ob => {
    ob.x -= 2;
    if (ob.x + ob.width < 0) {
      ob.x = 800 + Math.random() * 200;
    }
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMario();
  drawObstacles();
  requestAnimationFrame(update);
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !isJumping) {
    mario.velocityY = -15;
    isJumping = true;
  }
});

update();
