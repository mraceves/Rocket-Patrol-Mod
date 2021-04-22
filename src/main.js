let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;




//    SCORE BREAK DOWN
//  +60  Redesign the game's artwork, UI, and sound to change its theme/aesthetic
//         - The game is Ocean Patrol, which has a more aquatic theme. All assets are change to reflect theme.
//         - rocket and ships are now crab and fish. explosion animation now has a ripple like effect. sounds are more aquatic sounding.
//
//  +20  Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points
//         - New rarefish type that is smaller and moces faster, worth the most points, harder to hit
//
//  +10  Display the time remaining (in seconds) on the screen
// 
//  +10 Create a new title screen
//         - title screen shows new title, and new background image of fun crab.
//
//  Total: 100
//
//  Other changes that might be included in above scoring
//  +5  Add your own (copyright-free) background music to the Play scene
//         - music from https://opengameart.org/content/ocean-theme
//
//  +5  Create a new scrolling tile sprite for the background
//         - now ocean background with seaweed
//  
//  +10 Replace the UI borders with new artwork 
//       - UI boarders color change to create more ocean visuals
//
//  +20 Create new artwork for all of the in-game assets
//