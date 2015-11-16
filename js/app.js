/* global ctx */
/* global Resources */

var Pos = function(row, col) {
    this.row = row;
    this.col = col;
};

// Enemies our player must avoid
var Enemy = function() {
    'use strict';
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.row = getRandomIntInclusive(1, 3);
    this.x = -101 * getRandomIntInclusive(3, 5);
    this.y = this.ypos();
    this.velocity = [50, 125, 200][getRandomIntInclusive(0, 2)];
    this.sprite = 'images/enemy-bug.png';
    this.height = 60.0;
    this.width = 60.0;
};

Enemy.prototype.ypos = function () {
    'use strict';
    return this.row * 60.0 + (this.row - 1) * 23;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    'use strict';
    this.x += dt * this.velocity;
    if (this.x > ctx.canvas.width)  {
        this.row = getRandomIntInclusive(1, 3);
        this.x = -101 * getRandomIntInclusive(3, 5);
        this.y = this.ypos();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function () {
    'use strict';
    this.initRow = 5;
    this.initCol = 2;
    this.row = this.initRow;
    this.col = this.initCol;
    this.x = this.col * 101;
    this.y = this.row * 60.0 + (this.row - 1) * 23;
    this.sprite = 'images/char-boy.png';
    this.height = 60.0;
    this.width = 60.0;
    this.score = 0;
    this.collectibles = [];
};

Player.prototype.update = function(isCollision) {
    'use strict';
    this.isCollectible(this);
    if(isCollision) {
        this.row = this.initRow;
        this.col = this.initCol;
        this.x = this.col * 101;
        this.y = this.row * 60.0 + (this.row - 1) * 23;
        if (this.score) --this.score;
        return true;
    } else if (this.row === 0) {
        this.row = this.initRow;
        this.col = this.initCol;
        this.x = this.col * 101;
        this.y = this.row * 60.0 + (this.row - 1) * 23;
        ++this.score;
        return true;
    } else {
        this.x = this.col * 101;
        this.y = this.row * 60.0 + (this.row - 1) * 23;
        return false;
    }
};

Player.prototype.isCollectible = function (aPlayer) {
    'use strict';
    var collected = [];
    allCollectibles.forEach(function(collectible, i){
        if (this.row === collectible.pos.row && this.col === collectible.pos.col) {
            collected.push(i);
            this.collectibles.push(collectible);
        }
    }, this);
    for (var i = 0, len = collected.length; i < len; ++i) {
        allCollectibles.splice(collected[i], 1);
    }
};

Player.prototype.render = function () {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
    'use strict';
    if (dir === 'left') {
        if (this.col > 0) --this.col;
    } else if (dir === 'right') {
        if (this.col < 4) ++this.col;
    }  else if (dir === 'up') {
        if (this.row > 0) --this.row;
    } else {
        if (this.row < 5) ++this.row;
    }
};

var Collectible = function(image, pos) {
    'use strict';
    this.pos = pos;
    this.sprite = image;
    this.name = null;
};

Collectible.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x(), this.y());
};

Collectible.prototype.x = function() {
    return this.pos.col * 101;
};

Collectible.prototype.y = function() {
   return this.pos.row * 60.0 + (this.pos.row - 1) * 23;
};

var AchievementDisplay = function(player) {
    this.sprites = [
        {image:'images/Gem\ Blue.png', count:0, name: 'blue'},
        {image:'images/Gem\ Green.png', count:0, name: 'green'},
        {image:'images/Gem\ Orange.png', count:0, name: 'orange'}
    ];
    this.player = player;
    this.x = 0.0;
    this.y = 606.0;
    this.spriteWidth = 101.0;
};

AchievementDisplay.prototype.render = function() {
    this.player.collectibles.forEach(function(collectible, i){
        if (collectible.name === this.sprites[0].name) {
            this.sprites[0].count += 1;
        } else if (collectible.name === this.sprites[1].name) {
            this.sprites[1].count += 1;
        } else if (collectible.name === this.sprites[2].name){
            this.sprites[2].count += 1;
        }
    }, this);
    this.player.collectibles.splice(0, this.player.collectibles.length);
    ctx.save();
    for (var i = 0, len = this.sprites.length; i < len; ++i) {
        ctx.drawImage(Resources.get(this.sprites[i].image),
            this.x + i * this.spriteWidth, this.y);
        ctx.fillStyle = 'white';
        ctx.font = 'normal normal 700 36px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.sprites[i].count.toString(), 50.0 + i * 101.0, 606.0 + 100.0);
    }
    ctx.restore();
};

(function(global) {
    'use strict';
    var allEnemies = [];
    var allCollectibles = [];
    for (var i = 0; i < 5; ++i) {
        allEnemies[i] = new Enemy();
    }
    var player = new Player();
    global.playableRows = 3;
    global.playableCols = 5;
    global.allEnemies = allEnemies;
    global.allCollectibles = allCollectibles;
    global.player = player;
    global.achivementDisplay = new AchievementDisplay(player);
})(this);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    'use strict';
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

function isInterSect(r1, r2) {
    'use strict';
    var val = (((r2.right > r1.left && r2.left > r1.right) ||
    (r2.right < r1.left && r2.left < r1.right)) ||
    ((r2.top > r1.bottom && r2.bottom > r1.top) ||
    (r2.top < r1.bottom && r2.bottom < r1.top)));
    return !val;
}

function getRandomIntInclusive(min, max) {
    'use strict';
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
