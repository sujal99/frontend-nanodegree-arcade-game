/* global ctx */
/* global Resources */
// Enemies our player must avoid
var Enemy = function() {
    "use strict";
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
    "use strict";
    return this.row * 60.0 + (this.row - 1) * 23;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    "use strict";
    this.x += dt * this.velocity;
    if (this.x > ctx.canvas.width)  {
        this.row = getRandomIntInclusive(1, 3);
        this.x = -101 * getRandomIntInclusive(3, 5);
        this.y = this.ypos();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function () {
    "use strict";
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
};

Player.prototype.update = function() {
    "use strict";
    if(this.isCollision(this) === true) {
        this.row = this.initRow;
        this.col = this.initCol;
        this.x = this.col * 101;
        this.y = this.row * 60.0 + (this.row - 1) * 23;
        if (this.score) --this.score;
    } else if (this.row === 0) {
        this.row = this.initRow;
        this.col = this.initCol;
        this.x = this.col * 101;
        this.y = this.row * 60.0 + (this.row - 1) * 23;
        ++this.score;
    } else {
        this.x = this.col * 101;
        this.y = this.row * 60.0 + (this.row - 1) * 23;
    }
};

Player.prototype.isCollision = function (aPlayer) {
    "use strict";
    for (var i = 0, len = allEnemies.length; i < len; i++) {
        var aEnemy = allEnemies[i];
        if (isInterSect({left:aEnemy.x, top:aEnemy.y, right:aEnemy.x  + aEnemy.width, bottom:aEnemy.y + aEnemy.height},
        {left:aPlayer.x, top:aPlayer.y, right:aPlayer.x  + aPlayer.width, bottom:aPlayer.y + aPlayer.height}) === true) {
            return true;
        }
    }
    return false;
};

Player.prototype.render = function () {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(dir) {
    "use strict";
    if (dir === 'left') {
        if (this.col > 0) --this.col;
    } else if (dir == 'right') {
        if (this.col < 4) ++this.col;
    }  else if (dir == 'up') {
        if (this.row > 0) --this.row;
    } else {
        if (this.row < 5) ++this.row;
    }
};

var App = (function(global) {
    "use strict";
    var allEnemies = [];
    for (var i = 0; i < 5; ++i) {
        allEnemies[i] = new Enemy();
    }
    var player = new Player();
    this.allEnemies = allEnemies;
    this.player = player;
})(this);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    "use strict";
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


function isInterSect(r1, r2) {
    "use strict";
    var val = (((r2.right > r1.left && r2.left > r1.right) || (r2.right < r1.left && r2.left < r1.right)) ||
        ((r2.top > r1.bottom && r2.bottom > r1.top) || (r2.top < r1.bottom && r2.bottom < r1.top)));
    return !val;
}

function getRandomIntInclusive(min, max) {
    "use strict";
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
