class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }
    preload() {
        // load images/tile sprites
        this.load.image('crab', './assets/crab.png');
        this.load.image('fish', './assets/fish.png');
        this.load.image('ocean', './assets/ocean.png');
        this.load.image('rarefish', './assets/rarefish.png');

        // load music
        // music from https://opengameart.org/content/ocean-theme 
        this.load.audio('music', './assets/music.ogg');
        // load spritesheet
this.load.spritesheet('splash', './assets/splash.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
      }
create() {
  if (!this.music){
    this.music = this.sound.add('music', {
      loop: true
  })
  /* Play music. */
  this.music.play()
  }

    // place tile sprite
this.starfield = this.add.tileSprite(0, 0, 640, 480, 'ocean').setOrigin(0, 0);
    // teal UI background
this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00C48A).setOrigin(0, 0);

// blues/sand borders
this.add.rectangle(0, 0, borderUISize, game.config.height, 0x232dae).setOrigin(0, 0);
this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0x232dae).setOrigin(0, 0);
this.add.rectangle(0, 0, game.config.width, borderUISize, 0xadfffc).setOrigin(0, 0); // top
this.add.rectangle(0, game.config.height - borderUISize -6 , game.config.width, borderUISize +6, 0xfbe499).setOrigin(0, 0); // bottom

// add rocket (p1)
this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'crab').setOrigin(0.5, 0);
  // define keys
  keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
  keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
// add spaceships (x3)
    this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'rarefish', 0, 30).setOrigin(0, 0);
    this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'fish', 0, 20).setOrigin(0,0);
    this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'fish', 0, 10).setOrigin(0,0);

    this.ship01.moveSpeed = 5;

    // animation config
this.anims.create({
    key: 'splash',
    frames: this.anims.generateFrameNumbers('splash', { start: 0, end: 9, first: 0}),
    frameRate: 30
});
// initialize score
this.p1Score = 0;
  // display score
  let scoreConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'right',
    padding: {
      top: 5,
      bottom: 5,
    },
    fixedWidth: 100
  }
  this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);


// create a game clock that will countdown until game over
this.gameClock = game.settings.gameTimer;
// create an object to populate the text configuration members
let gameClockConfig =
{
    fontFamily: "Courier",
    fontSize: "20px",
    backgroundColor: "#f3b141",
    color: "#843605",
    align: "left",
    padding: {top: 5, bottom: 5},
    fixedWidth: 140
};

 // add the timer text
 this.timeLeft = this.add.text
 (400, 54, "Timer: " + this.formatTime(this.gameClock), gameClockConfig );

 this.timedEvent = this.time.addEvent( 
              {
                delay: 1000,
                callback: () =>
                {
                    this.gameClock -= 1000; 
                    this.timeLeft.text = "Timer: " +
                        this.formatTime(this.gameClock);
                },
                scope: this,
                loop: true
            }
        );

  // GAME OVER flag
this.gameOver = false;
  // 60-second play clock
scoreConfig.fixedWidth = 0;
this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
    this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
    this.gameOver = true;
  }, null, this);
  }
  update() {

  // check key input for restart
  if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
    this.scene.restart();
}

    if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
      this.scene.start("menuScene");
  }

    this.starfield.tilePositionX -= 4;
    if (!this.gameOver) {
    this.p1Rocket.update();
    this.ship01.update();               // update spaceships (x3)
    this.ship02.update();
    this.ship03.update();
    }
    // check collisions
if(this.checkCollision(this.p1Rocket, this.ship03)) {
    this.p1Rocket.reset();
    this.shipExplode(this.ship03);   
  }
  if (this.checkCollision(this.p1Rocket, this.ship02)) {
    this.p1Rocket.reset();
    this.shipExplode(this.ship02);
  }
  if (this.checkCollision(this.p1Rocket, this.ship01)) {
    this.p1Rocket.reset();
    this.shipExplode(this.ship01);
  }

  }
  checkCollision(rocket, ship) {
    // simple AABB checking
    if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
            return true;
    } else {
        return false;
    }
  }
  shipExplode(ship) {
    // temporarily hide ship
    ship.alpha = 0;
    // create explosion sprite at ship's position
    let boom = this.add.sprite(ship.x, ship.y, 'splash').setOrigin(0, 0);
    boom.anims.play('splash');             // play explode animation
    boom.on('animationcomplete', () => {    // callback after anim completes
      ship.reset();                         // reset ship position
      ship.alpha = 1;                       // make ship visible again
      boom.destroy();                       // remove explosion sprite
      
    });       
      // score add and repaint
  this.p1Score += ship.points;
  this.scoreLeft.text = this.p1Score;  
  this.sound.play('splashSound');
  }


formatTime(ms)
{
    let s = ms/1000;
    let min = Math.floor(s/60);
    let sec = s%60;
    sec = sec.toString().padStart(2, "0");
    return `${min}:${sec}`;
}
}