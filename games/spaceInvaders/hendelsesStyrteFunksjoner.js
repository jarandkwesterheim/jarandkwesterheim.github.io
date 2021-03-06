//cookies
var highscore = 0;
function setCookie(score) {
  document.cookie = "highscore=" + score;
}
function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function checkCookie() {
  highscore = getCookie("highscore");
}

//canvas
var canvas = document.querySelector("#canvas");
    canvas.width = 1440; //document.width is obsolete
    canvas.height = 1080; //document.height is obsolete

var currentXPos = 0;
var currentYPos = 0;
var keyPress = 0;

//moving spaceship cover
document.body.onmousemove = function(evt) {
  var divElement = document.querySelector(".divElement");
  var mousePosX = evt.clientX;
  if (mousePosX > 1058) {
    mousePosX = 1058;
  }

  divElement.style.cssText = 'left: ' +mousePosX +'px';
  return currentXPos = mousePosX,currentYPos = evt.clientY;
}
document.body.onkeydown = function(event) {
  keyPress = event.keyCode;
  if (keyPress == 65 || keyPress == 68) {
    addPSpeed(keyPress);
  }
  else if (keyPress == 32) {
    checkSpacebar(keyPress);
  }
}

//variables for background image      1:arcade    2:neonrider
var background = 1;
var backgroundList = {
  1:'https://thumbs.gfycat.com/DopeyHideousGelding-small.gif',
  2:'https://thumbs.gfycat.com/EntireLateAidi-small.gif',
  3:'https://media3.giphy.com/media/sCIA4mXdrMc6c/source.gif',
}
document.body.style = 'background-image: url("' +backgroundList[background]; +'");';



//variables
var ctx = canvas.getContext("2d");
WIDTH = canvas.width;
HEIGHT = canvas.height;
var consoleDisplay = document.querySelector("#display");


//variables for player position and id
var player_y = 800;
var player_id = "player";


//variables for TIMING
var reloadTime = 700;
var wavePause = 2000;
var enemyGenTime = 1000;


//variables for bullet and bulletanimations
// bullet_x = currentXPos   needs to be a part of the update()
var bullet_y = 700;
var bullet_spdX = 0;
var bullet_spdY = -10;
var bullet_width = 7;
var bullet_height = 20;
var bullet_color = "yellow";

var bulletCount = 0;
var ammoCount = 0;
var bulletOffSet = 0;
var chamber = document.querySelector("#chamber");



//variables for enemy and enemy animations
//var enemy_x = Math.random()*1050+45;    needs to be a part of update()
var enemy_y = -100;
var enemy_spdX = 0;
var enemy_spdY = 4;
var enemy_width = 40;
var enemy_height = 40;
var enemy_color = "red";

var enemyCount = 0;


//variables for score
var currentScore = -1;
var maxScore = 10;


//variables for health
var currentHealth = 4;
var minHealth = 0;


var player = {
  x:currentXPos,
  y:player_y,
  spdX:0,
  r:75,
  name:player,
  id:player_id
}

//functions to generate, call, time, reload and fire bullets
var bulletList = {};
Bullet("B1",-40,-40,0,0,40,40,"yellow");


var reloadTimer = setInterval(addAmmo,reloadTime);
function addAmmo() {
  if (ammoCount < 6) {
    ammoCount++;
    chamber.innerHTML += '<img src="media/chamberBullet.png" alt="">';
  }
}
function removeAmmo() {
  ammoCount--;
  chamber.innerHTML = "";
  for (var i = 0; i < ammoCount; i++) {
    chamber.innerHTML += '<img src="media/chamberBullet.png" alt="">';
  }
  clearInterval(reloadTimer);
  reloadTimer = setInterval(addAmmo,reloadTime);
}
function fireBullet() {
  if (ammoCount > 0) {
    bulletCount++;
    Bullet("B"+bulletCount,currentXPos-3.5+bulletOffSet,bullet_y,bullet_spdX,bullet_spdY,bullet_width,bullet_height,bullet_color);
    bulletOffSet = -bulletOffSet;
    removeAmmo();
  }
}
function checkSpacebar(keyPress) {
  if (keyPress == 32) {
    fireBullet();
  }
}
function addPSpeed(keyPress) {
  //ad keyfunciton to move player
}


function Bullet(id,x,y,spdX,spdY,widht,height,color) {
  var bullet = {
    x:x,
    y:y,
    spdX:spdX,
    spdY:spdY,
    width:widht,
    height:height,
    color:color,
    id:id
  }
  bulletList[id] = bullet;
}


//functions to generate, sort, call and space enemies
var enemyList = {};
Enemy("B1",-40,-40,0,0,40,40,"red");


var wavePauseInterval = setInterval(generateWave,wavePause);
function generateWave() {
  clearInterval(wavePauseInterval);
  var generateEnemyInterval = setInterval(generateEnemy,enemyGenTime);
}

function generateEnemy() {
  if (currentScore < maxScore) {
    enemyCount++;
    Enemy("E"+enemyCount,Math.random()*960+45,enemy_y,enemy_spdX,enemy_spdY,enemy_width,enemy_height,enemy_color);
  }
  else {
    ammoCount = 6;
    maxScore = maxScore*2-1;
    enemy_spdY= enemy_spdY*1.3;
  }
}

function Enemy(id,x,y,spdX,spdY,width,height,color){
  var enemy = {
    x:x,
    y:y,
    spdX:spdX,
    spdY:spdY,
    width:width,
    height:height,
    color:color,
    id:id
  }
  enemyList[id] = enemy;
}



//test collision
testCollisionX = function(bullet,enemy) {
  if (bullet.x + bullet.width >= enemy.x && bullet.x <= enemy.x+enemy.width && bullet.y < enemy.y+enemy.height) {
    currentScore++;
    enemy.spdY = 0;
    bullet.spdY = 0;
    bullet.x = -400;
    enemy.x = -500;
  }
}


//test Health
function testHealth() {
  if (currentHealth <= minHealth) {
    if (currentScore > highscore) {
      setCookie(currentScore);
    }
    status = "kill";
  }
}

function updateEntity(something) {
  something.x += something.spdX;
  something.y += something.spdY;
  ctx.fillStyle = something.color;
  ctx.fillRect(something.x,something.y,something.width,something.height);
  if (something.y > 825) {
    currentHealth--;
    something.spdY = 0;
    something.x = -500;
    something.y = 300;
    testHealth();
  }
}


var status = "alive";
update();
function update() {
  if (status == "alive") {
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    updateEntity(player);
    for (var keyB in bulletList){
      updateEntity(bulletList[keyB]);
    }
    for (var keyE in enemyList){
      updateEntity(enemyList[keyE]);
      for (var keyB in bulletList){
        testCollisionX(bulletList[keyB],enemyList[keyE]);
      }
    }
    checkCookie();
    consoleDisplay.innerHTML = "Score: " +currentScore +"<br>Health: " +currentHealth +"<br>Highscore: " +highscore;
    requestAnimationFrame(update);
  }
  else {
    var menu = document.querySelector("#menu");
    var menuSCore = document.querySelector("#menu--score");
    var menuHighscore = document.querySelector("#menu--highscore");
    menu.style.cssText = "  top: 540px;left: 720px;";
    menuSCore.innerHTML = "Your Score: " +currentScore;
    menuHighscore.innerHTML = "<br>Your Highscore: " +highscore;
  }
}

function restartVariables() {
  reloadTime = 700;
  wavePause = 2000;
  enemyGenTime = 1000;
  ammoCount = 0;
  currentScore = -1;
  maxScore = 10;
  currentHealth = 4;
  enemyList = {};
  bulletList = {};
  enemy_spdY = 4;
}
function restartGame() {
  status = "alive";
  var menu = document.querySelector("#menu");
  menu.style.cssText = "  top: -540px;left: -720px;";
  chamber.innerHTML = '';
  restartVariables();
  update();
}
