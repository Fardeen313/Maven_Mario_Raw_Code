// Phaser 3 platformer - Mario-like (placeholder art)
// Works on mobile (touch buttons) and desktop (arrow keys / WASD)

const width = Math.min(window.innerWidth, 1280);
const height = Math.min(window.innerHeight, 720);

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: width,
  height: height,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player, cursors, platforms, enemies, finishFlag;
let leftBtn, rightBtn, jumpBtn;
let isLeft=false, isRight=false, isJump=false;
let gameOver = false;

function preload() {
  this.load.image('bg', 'assets/images/bg.png');
  this.load.spritesheet('player', 'assets/images/player_sprites.png', { frameWidth: 48, frameHeight: 64 });
  this.load.image('tiles', 'assets/images/tiles.png');
}

function create() {
  // background
  this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'bg').setOrigin(0).setScrollFactor(0);

  // platforms group
  platforms = this.physics.add.staticGroup();
  const groundY = this.scale.height - 48;
  // create extended ground using repeated tiles sprite
  const ground = platforms.create(this.scale.width/2, groundY, 'tiles').setScale(this.scale.width/200, 1).refreshBody();

  // small platform
  platforms.create(300, groundY - 120, 'tiles').setScale(2,1).refreshBody();

  // finish flag
  finishFlag = this.add.rectangle(2800, groundY - 120, 20, 140, 0xffd700);
  this.physics.add.existing(finishFlag, true);

  // player
  player = this.physics.add.sprite(100, groundY - 200, 'player');
  player.setBounce(0.05);
  player.setCollideWorldBounds(true);
  player.body.setSize(32, 52).setOffset(8, 12);

  // animations
  this.anims.create({
    key: 'idle',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 0 }),
    frameRate: 5,
    repeat: -1
  });
  this.anims.create({
    key: 'run',
    frames: this.anims.generateFrameNumbers('player', { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  // enemies
  enemies = this.physics.add.group();
  createEnemy(this, 600, groundY - 40, 100);
  createEnemy(this, 1000, groundY - 40, 200);
  createEnemy(this, 1600, groundY - 40, 140);

  // collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(enemies, platforms);
  this.physics.add.collider(enemies, enemies);
  this.physics.add.overlap(player, enemies, onPlayerHit, null, this);
  this.physics.add.overlap(player, finishFlag, onReachFinish, null, this);

  // controls
  cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.addKeys('W,A,S,D');

  leftBtn = document.getElementById('leftBtn');
  rightBtn = document.getElementById('rightBtn');
  jumpBtn = document.getElementById('jumpBtn');

  // touch events
  leftBtn.addEventListener('touchstart', ()=> isLeft=true); leftBtn.addEventListener('touchend', ()=> isLeft=false);
  rightBtn.addEventListener('touchstart', ()=> isRight=true); rightBtn.addEventListener('touchend', ()=> isRight=false);
  jumpBtn.addEventListener('touchstart', ()=> isJump=true); jumpBtn.addEventListener('touchend', ()=> isJump=false);

  // mouse events for desktop touch-like use
  leftBtn.addEventListener('mousedown', ()=> isLeft=true); leftBtn.addEventListener('mouseup', ()=> isLeft=false);
  rightBtn.addEventListener('mousedown', ()=> isRight=true); rightBtn.addEventListener('mouseup', ()=> isRight=false);
  jumpBtn.addEventListener('mousedown', ()=> isJump=true); jumpBtn.addEventListener('mouseup', ()=> isJump=false);

  // camera & world bounds
  this.cameras.main.startFollow(player, true, 0.09, 0.09);
  this.cameras.main.setBounds(0,0,3000,this.scale.height);
  this.physics.world.setBounds(0,0,3000,this.scale.height);

  // instructions
  this.add.text(16, 16, 'Use arrow keys/WASD or on-screen buttons to move and jump.', { fontSize: '14px', fill: '#fff' }).setScrollFactor(0);
}

function update() {
  if (gameOver) return;

  const onGround = player.body.blocked.down || player.body.touching.down;
  const left = cursors.left.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('A'), 0) || isLeft;
  const right = cursors.right.isDown || this.input.keyboard.checkDown(this.input.keyboard.addKey('D'), 0) || isRight;
  const jump = Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('W')) || isJump;

  const speed = 220;
  if (left) {
    player.setVelocityX(-speed);
    player.flipX = true;
    player.anims.play('run', true);
  } else if (right) {
    player.setVelocityX(speed);
    player.flipX = false;
    player.anims.play('run', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('idle', true);
  }

  if (jump && onGround) {
    player.setVelocityY(-480);
    isJump = false;
  }

  if (player.y > this.scale.height + 300) {
    doGameOver(this);
  }

  enemies.children.iterate(function(e) {
    if (!e) return;
    if (!e.patrol) return;
    if (e.x <= e.patrol.minX) e.setVelocityX(e.patrol.speed);
    if (e.x >= e.patrol.maxX) e.setVelocityX(-e.patrol.speed);
  }, this);
}

function createEnemy(scene, x, y, range) {
  const en = scene.physics.add.sprite(x, y, 'tiles');
  en.setCollideWorldBounds(true);
  en.setImmovable(true);
  en.body.allowGravity = false;
  const speed = 80;
  en.setVelocityX(-speed);
  en.patrol = { minX: x - range, maxX: x + range, speed: speed };
  enemies.add(en);
  return en;
}

function onPlayerHit(playerObj, enemy) {
  doGameOver(this);
}

function onReachFinish() {
  this.add.text(this.cameras.main.scrollX + 100, 80, 'YOU WIN! 🎉', { fontSize: '40px', fill: '#fff' });
  this.physics.pause();
  gameOver = true;
}

function doGameOver(scene) {
  scene.add.text(scene.cameras.main.scrollX + 100, 80, 'GAME OVER', { fontSize: '40px', fill: '#ff0000' });
  scene.physics.pause();
  gameOver = true;
}
