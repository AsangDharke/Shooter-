// This is the Script of our Game Try, Using References from W3Schools.

var myGamePiece, myCursor;
var par = document.querySelector("#test");
var play = document.querySelector("#play");
var myObstacles = [], myEnemies = [];
var myScore;
var myPlayer, myBackground, myShot = [], mySound, myMusic, bullet;

// Here lies our Functions declarations and their definitions.

// this function is used to start the game. Remember functions are objects.
function startGame(){
   myGameArea.start();
   // rgba stands for red, greeen, blue, alpha. alpha (0(fully transparent) - 1(solid))
   // deals with the transparency of the color of the component in this case.
   // now initializing the components used in the Gameplay.
   myPlayer = new component("Image", 29, 27, 'images/Player.gif', 40, 150);
   myCursor = new component("cursor", 10, 10, 'red', 150, 200);
   upButton = new component("block", 20, 20, 'rgba(0,0,200,0.3)', 30, 230);
   downButton = new component("block", 20, 20, 'rgba(0,0,200,0.3)', 30, 270);
   leftButton = new component("block", 20, 20, 'rgba(0,0,200,0.3)', 10, 250);
   rightButton = new component("block", 20, 20, 'rgba(0,0,200,0.3)', 50, 250);
   bullet = new component("Image", 20,20, 'images/throw.png', 650, 0);
   myScore = new component("Label", "30px", "Tahoma", "black", 280, 40);
   myBackground = new component('Image', 656, 300, "images/Background.png", 0, 0);
  //  mystartSound = new sound("audio/Secure the Artifact.mp3");
   myMusic = new sound("audio/Music.mp3");
   hit = new sound('audio/perfect hit.mp3'); 
   shot = new sound('audio/throw.mp3'); 
   myMusic.play();
  //  mystartSound.play(); 
} // end startGame.


// Making an Object for the Game Area.
var myGameArea = {
  // defining a scene for the game.
  scene : document.querySelector("#GameCanvas"),
  start : function(){
    this.scene.width = 600;
    this.scene.height = 300;
    this.scene.style = 'border: 1px solid lightgrey';
    this.scene.style.cursor = 'none';
    this.context = this.scene.getContext("2d");
    document.body.appendChild(this.scene);
    this.frameNo = 0;
    // setInterval is a type of method that takes a function and number in milliseconds
    // it will run that function each time the milliseconds(seconds) ellapse.
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keypress', keyStart);
    window.addEventListener('keyup', keyStop);
    window.addEventListener('mousemove', cursormove);
    window.addEventListener('mousedown', cursormove);
    window.addEventListener('mouseup', cursorStop);
  },
  clear : function()
  {
    this.context.clearRect(0,0,this.scene.width, this.scene.height);
  },
  stop : function()
  {
    clearInterval(this.interval);
  }
}

function everyinterval(n) {
  // i believe the only situation this condition is true is when frameNo becomes n.
  if ((myGameArea.frameNo / n) % 1 == 0 ) {return true;}
  return false;
}

// this function is used to get the code of the character pressed of the keypress event.
function keyStart(e){
  // myGameArea.key is now creating a new property because we know originally it
  // wasn't there, remember you can just create them on the fly when it comes to js.
  myGameArea.key =  e.keyCode;
};

function cursormove(e){
  // the page method is used to record the coordinates of mouse movemet.
  // the gamearea x and y coordinates are given to our mouse current x and y
  // paged location. when we create a game piece and give it these cordinates
  // then update it's movement each time, it'll act as if we're moving the piece
  // with the mouse.
  myGameArea.x = e.pageX;
  myGameArea.y = e.pageY;
}

function keyStop(){
  myGameArea.key = false;
}

function cursorStop(){
  myGameArea.x = false;
  myGameArea.y = false;
}

/* These are the defined properties of this component. we can create
 other components with other predefined qualities as well, or we could
 manipulate this one, it all depends on the purpose for its creation.
 this is based on the game logic you want to use, and what you're after.
 create as many as you can if it will serve the purpose */
function component(type, width, height, color, x, y)
{
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  // this.gravity = 0.05;
  // this.gravitySpeed = 0;
  this.x = x;
  this.y = y;
  this.color = color;
  if(this.type == 'block')
  {
    // as we've added 'this' to update anonymous function, it means to whatever
    // object that uses this object prototype, update will be a part of its property
    // and it alone. another object that takes this will have it's own unique.
    // this is like addressing a 'new' or polymorphism in C++.

    // this function is necessary for redrawing the changes and it'll seem like an animation.
      this.update = function () {
      var sprite = myGameArea.context;
      sprite.fillStyle = color;
      sprite.fillRect(this.x, this.y, this.width, this.height);
    }
      // this function is to manipulate the movement of the block component.
      // don't forget, it needs to be part of the changing frames in the interval.

      this.clicked = function()
      {
        var myLft = this.x;
        var myRgt = this.x + (this.width);
        var myTp = this.y;
        var myBtm = this.y + (this.height);
        var clicked = true;
        if((myLft > myGameArea.x) || (myRgt < myGameArea.x)
            ||(myTp > myGameArea.y) || (myBtm < myGameArea.y))
            { clicked = false; }
            return clicked;
      }
  }

  if(this.type == 'cursor')
  {
    this.update = function(){
      var sprite = myGameArea.context;
        // the path to begin drawing the arc is done by this method.
      sprite.beginPath();
        // stroke style set. not fill style since we're stroking the arc.
      sprite.strokeStyle = color;
      sprite.arc(this.x, this.y, 4, 0, 360);
      sprite.stroke();
    }
  }

  if(this.type == 'Label')
  {
    this.update = function() {
      var Label = myGameArea.context;
      // we want to print out a text right, we use the text fill canvas methods.
      Label.font = this.width + " " + this.height;
      Label.fillStyle = color;
      Label.fillText(this.text, this.x, this.y);
    }
  }

  if(this.type == "Image") {
    // javascript has an inbuilt image object. 
    this.image = new Image();
    this.image.src = color;
  }

  if(this.type == "Image")
  {
    var Player = myGameArea.context;
    this.update = function() {
      Player.drawImage(this.image,
      this.x,
      this.y,
      this.width, this.height);
    }
    // this is setting the default speed, it'll be easier to make an enemy component and 
    // set a parameter for it's defined speed, but this one is practical purposes, we'll get
    // more professional with time. 
    this.speedX = 1; 

    this.movement = function()
    {
      // this changes the x and y coordinates of the object that takes this prototype
      // at a given instance. increasing the speedX and speedY will affect how
      // fast that object will move.
      // this.gravitySpeed += this.gravity;
      this.x+= this.speedX;
      this.y+= this.speedY; // + this.gravitySpeed;
      this.hitbottom();
    }

    this.hitbottom = function() {
      var rockbottom = myGameArea.scene.height - this.height;
      if(this.y > rockbottom) {
        this.y = rockbottom;
      }
      //preventing the sprite from going all the way out top, hightop you could say.
      if(this.y < 0) {
        this.y = 0;
      }
    }

    // comment out this function if you want the onscreen buttons to work properly.
    this.stopkeyMove = function() {
      this.speedX = 0;
      this.speedY = 0;
    }

    // giving speed to the created object by using this method. 
    this.giveSpeed = function() {
      this.speedX = 1.5; 
    }

    this.crashWith = function(otherobj) {
      // it's x coordinate is at the top left.
        var myleft = this.x;
      // it's right coordinate is at the top right, which is the point on it's
      // top left + the width all the way to the point on the top right.
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
              crash = false;
            } 
            return crash;
    }
    this.is_alive = function() {
      if(this.speedX > 0)
        return true; 
        else
          return false; 
    }

    // this is the method for image explosion, a property of the component object. 
    this.particleExplosion = function(obj){
      var idx = 1; 
      var explosion = setInterval(scatter, 200); 
          function scatter () {
          if (idx > 3)
          {
            obj.image.src = ''; 
            idx = 1; 
            clearInterval(explosion);
          }     
          else
          {
            var source = 'images/pframe' + idx + '.png';
            obj.image.src = source;
            idx++;  
          }
      }
    }
  }
}

// creating and object constructor to handle sound.
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.stop = function() {
    this.sound.pause();
  }
}

// this function is called by our set interval method in the start() function.
// it is used to update the game frames to give that sense of animation.
function updateGameArea(){
  // getting the coordinates of our next following blocks. we can also manipulate the size
  // if we so desire, and we can hence make them random to increase difficulty of the game.
  var x;

  // Generating Blocks
  if(myGameArea.frameNo == 1 || everyinterval(150))
  {
      x = myGameArea.scene.width;
      minHeight = 20;
      maxHeight = 200;
      height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      minGap = 50;
      maxGap = 200;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new component("block", 10, height, 'green', x, 0));
      myObstacles.push(new component("block", 10, x - height - gap, "green", x, height + gap));
  }

  // Generating myEnemies
  if(myGameArea.frameNo == 1 || everyinterval(80))
  {
    x = myGameArea.scene.width;
    maxHeight = myGameArea.scene.height;
    minHeight = 30;
    height = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight );
    myEnemies.push(new component('Image', 42,34,'images/ghoul.png', x, height)); 
  }

  var i, size, wave;
  wave = myEnemies.length;
  size = myObstacles.length;

  // testing if any of the obstacles collides with our Player character.
  for(i = 0; i < size; i++)
  {
    if(myPlayer.crashWith(myObstacles[i]))
    {
      myGameArea.stop();
      myMusic.stop();
    }
  }

  // testing if player hits Enemy
  for(i = 0; i < wave; i++ ) {
    if(myPlayer.crashWith(myEnemies[i]))
    {
      if(myEnemies[i].is_alive())
        myGameArea.stop();
    }
  }

  // testing if bullet hits the enemy.
  for(i = 0; i < wave; i++)
  {
    if(myEnemies[i].crashWith(bullet))
    {
      if(myEnemies[i].is_alive())
      {
        hit.play();  
        myEnemies[i].x+=3;
        myEnemies[i].speedX = 0;
        // bullet.speedX = 0; 
        myEnemies[i].particleExplosion(myEnemies[i]); 
      }
    }
  }

  myGameArea.clear();
  myBackground.update();
  myBackground.speedX = -0.5;
  // myBackground.movement();
  myGameArea.frameNo += 1;
  // the following numbers below are keycodes for keyboard buttons 'asdwi'
  // condition for the up(w) key
  if(myGameArea.key && myGameArea.key == 119 ) {
          myPlayer.image.src = 'images/pUpMove.gif';
          myPlayer.speedY-=2.5;
    }
    // condition for the down(s) key
  if(myGameArea.key && myGameArea.key == 115 ) {
          myPlayer.image.src = 'images/pDnMove.gif';
          myPlayer.speedY+=2.5;
    }
    // condition for the Left(a) key
  if(myGameArea.key && myGameArea.key == 97  ) {
          myPlayer.image.src = myPlayer.color;
          myPlayer.speedX-=2;
    }
    // condition for the right(d) key
  if(myGameArea.key && myGameArea.key == 100 ) {
          myPlayer.image.src = 'images/pmove.gif';
          myPlayer.speedX+=3;
    }
    // condition for the Shot Key(i).
  if(myGameArea.key && myGameArea.key == 105 ) {
          shot.play(); 
          bullet.speedX = 15;
          if(bullet.x > myGameArea.scene.width)
              bullet = new component("Image", 20,20, 'images/throw.png', myPlayer.x, myPlayer.y);      
    }
    
    bullet.movement();
    bullet.update();
    myPlayer.movement();

  // if myGameArea x and y coordinates at not zero or empty, pass them to our cursor piece.
  if (myGameArea.x && myGameArea.y) {
        myCursor.x = myGameArea.x;
        myCursor.y = myGameArea.y;
    }
  // we can manipulate anything as the frame changes with this update function
  // this is how we can get our components and other things to move.

  myCursor.update();
  if(myGameArea.x && myGameArea.y)
  {
    if(upButton.clicked())
    {
      myPlayer.y-= 2;
    }
    if(downButton.clicked())
    {
      myPlayer.y+=2;
    }
    if(leftButton.clicked())
    {
      myPlayer.x-=2;
    }
    if(rightButton.clicked())
    {
      myPlayer.x+=2;
    }
  }
  //moving the array of obstacles and updating them to keep them on view.
  for(i = 0; i < size; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }

  for(i = 0; i < wave; i++) {
    if(myEnemies[i].is_alive())
        myEnemies[i].giveSpeed(); 
  }

  // moving the array of enemies and updating them to keep them on view per interval.
  for(i= 0; i < wave; i++) {
    myEnemies[i].x -= myEnemies[i].speedX;
    myEnemies[i].update();
  }

  myScore.text = "SCORE: " + myGameArea.frameNo;
  myScore.update();
  myPlayer.update();
  myPlayer.stopkeyMove();
  upButton.update();
  downButton.update();
  leftButton.update();
  rightButton.update();
}

function stopMove(){
  myPlayer.speedX = 0;
  myPlayer.speedY = 0;
}

// this section is for our events.
play.addEventListener('click', startGame);
// use the touchstart event to handle touchscreens like mobile or touchscreens.
