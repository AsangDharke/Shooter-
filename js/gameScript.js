// This is the Script of our Game Try, Using References from W3Schools.

var myGamePiece, myCursor;
var par = document.querySelector("#test");
var play = document.querySelector("#play");
var myObstacles = [], myEnemies = [], myCoin = [];
var myScore, myPlayerExp, myPlayerLevel, myAcquired, superBulletBar, superBullet; 
var myPlayer, myBackground, myShot = [], mySound, myMusic, bullet, auraSound, superBulletSound;



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
   myAcquired = new component('Image', 30, 30, 'images/auraAnim1.png', 650, 0);
   superBulletBar = new component('block', 10, -10, 'rgba(100, 100, 0, 0.5)', 20, 200);
   superBullet = new component('Image', 50, 200, 'images/superbullet.png', 650, 0);  
  //  myCoin = new component("Image", 21,20, 'images/coin.png', 650, 0); 
   myScore = new component("Label", "30px", "Tahoma", "black", 280, 40);
   myPlayerExp = new component("Label", '15px', 'Tahoma', 'gold', 20, 30);
   myPlayerLevel = new component('Label', '20px', 'Tahoma', 'green', 20, 50); 
   myBackground = new component('Image', 656, 300, "images/Background.png", 0, 0);
  //  mystartSound = new sound("audio/Secure the Artifact.mp3");
   myMusic = new sound("audio/Music.mp3");
   hit = new sound('audio/perfect hit.mp3'); 
   shot = new sound('audio/b_throw.mp3');
   auraSound = new sound('audio/pickup.mp3');
   superBulletSound = new sound('audio/UnleashSuper.wav'); 
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
    
    // most methods below will make use of this context here. 
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
  },
  // defining properties for the game main logic. 
  // defeated is used to calculate the score of enemies defeated. 
  Defeated : 0, 
  NextLevel: 0,
  difficulty: 0,
  DiffSet : 100,
  baseDiff : 0.1,
  EnemyInterval : 0
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


  // in later versions of the game, we'll use the cursor to collect our items on screen. 
  // when u click the item, it'll glide over to the player position as a sign it has been collected by the player. 
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
      // we want to print out a text, so we use the text fill canvas methods.
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
    var myImage = myGameArea.context;

    this.update = function() 
    {
      myImage.drawImage(this.image,
      this.x,
      this.y,
      this.width, this.height);
    }
    // this is setting the default speed, it'll be easier to make an enemy component and 
    // set a parameter for it's predefined speed, but this one is practical purposes, we'll get
    // more professional with time. 
    this.speedX = 1; 
    this.exp = 0;
    this.Level = 0; 
    this.spdLev = 0; 
    this.baseExp = 0.03;
    this.maxExp = 1000; 
     

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
      if(this.x < 0)
        this.x = 0; 
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

    this.giveAuraSpeed = function() {
      this.speedX = -0.5; 
    }

    this.addSpeed = function(n) {
      // n changes as the level increases. 
      this.speedX += n;
    }

    this.giveBulletSpeed = function() {
      this.speedX = 15; 
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

    // as long as something moves then it is alive. if it doesn't move, it's considered dead. 
    this.is_alive = function() {
      if(this.speedX > 0 || this.speedX < 0)
        return true; 
        else
          return false; 
    }

    // every object is entitled to this feedback logic. very useful. 
    this.feedback = true; 

    // this is the method for object(image) explosion, a property of the component object. 
    // we can merge these functions into one, then choose with a variable for better readability. 
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

    this.particleCollection = function(obj){
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
            var source = 'images/auracol' + idx + '.png';
            obj.image.src = source;
            idx++;  
          }
      }
    }

    this.acquiredAnim = function(obj){
      var idx = 1; 
      var levitation = setInterval(hover, 200); 
          function hover () {
          if (idx > 4)
          {
            obj.image.src = '';
            idx = 1; 
            clearInterval(levitation);
          }     
          else
          {
            var source = 'images/auraAnim' + idx + '.png';
            obj.image.src = source;
            idx++;  
          }
      }
    }


    this.bulletExplosion = function(obj){
      var idx = 1; 
      var explosion = setInterval(scatter, 200); 
          function scatter () {
          if (idx > 6)
          {
            obj.image.src = '';
            idx = 1; 
            clearInterval(explosion);
          }     
          else
          {
            var source = 'images/bframe' + idx + '.png';
            obj.image.src = source;
            idx++;  
          }
      }
    }
  }
}

// creating an object constructor to handle sound.
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
  // if(myGameArea.frameNo == 1 || everyinterval(150))
  if(everyinterval(150))
  {
      x = myGameArea.scene.width;
      minHeight = 20;
      maxHeight = 200;
      height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      minGap = 50;
      maxGap = 200;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new component("block", 10, height, 'darkred', x, 0));
      myObstacles.push(new component("block", 10, x - height - gap, "darkred", x, height + gap));
  }

  // Generating myEnemies
  // if(myGameArea.frameNo == 1 || everyinterval(70 - myGameArea.EnemyInterval))
  if(everyinterval(70 - myGameArea.EnemyInterval))
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
      {
        myGameArea.stop();
        myMusic.stop(); 
      }
    }
  }

  // testing if bullet hits the enemy.
  for(i = 0; i < wave; i++)
  {
    if(myEnemies[i].crashWith(bullet))
    {
      if(myEnemies[i].is_alive() && bullet.is_alive())
      {
        bullet.bulletExplosion(bullet); 
        myEnemies[i].particleExplosion(myEnemies[i]);  
        myEnemies[i].x+=3;
        // stopping the speed of the enemy and the bullet is a signal that they are no longer alive. 
        myEnemies[i].speedX = 0;
        bullet.speedX = 0;
        // upon enemy dead, the player gains experience.  
        myPlayer.exp += 3; 
        myGameArea.Defeated+=1; 
        }
      }

      // scripting for when superBullet is unleashed
    if(myEnemies[i].crashWith(superBullet) && myEnemies[i].is_alive()){
      {
          console.log("Hit"); 
          myEnemies[i].particleExplosion(myEnemies[i]);  
          myEnemies[i].x+=6;
          myEnemies[i].speedX = 0;
          myPlayer.exp += 3; 
          myGameArea.Defeated+=1; 
      }  
  }

    // when an enemy dies, it is no longer alive. 
    // also, it's feedback is still true, so while both of this are true. 
    // we calculate our logic to see, if a coin shall be instantiated. 
    // if it is/ or not, we change that(or 'this') particular feedback to false and move on to the next one. 
    if(!myEnemies[i].is_alive() && myEnemies[i].feedback)
    {
      var coinNum, match; 
      coinNum = 5; 
      // random number between 1 to 5. 
      match = Math.ceil(Math.random() * 5);
      console.log(match);  
      if(coinNum == match)
      {
        // when a coin is dropped, it's a perfect hit sound. 
        hit.play(); 
        // we need this coin to remain static in animation until it has been picked up. 
        // so we create a coin image on the spot the enemy died, that is, instantiate an image object of coin as source. 
        // Until the coin is picked up, before it disappears, or it does after some time. 
        myCoin.push(new component('Image', 21, 20, 'images/auraball.png', myEnemies[i].x, myEnemies[i].y));
      }
      myEnemies[i].feedback = false; 
    }
  }

  // now writing logic for when our Player crash with our Aura/token/coin. 
  var coinCount = myCoin.length; 
  for(i = 0; i < coinCount; i++) {
    if(myPlayer.crashWith(myCoin[i]))
    {
      if(myCoin[i].is_alive())
      {
      // Play aura collection animation.
        myCoin[i].particleCollection(myCoin[i]);
           // we instantiate a label to tell us how much we've acquired.
        myAcquired = new component('Image', 30, 50, 'images/auraAnim1.png', myCoin[i].x, myCoin[i].y - myCoin[i].height);
        myAcquired.acquiredAnim(myAcquired);  

      // Play sound. 
        auraSound.play(); 

      // Script out what happens when picked up. basically, our superBullet bar has to charge up. 
        myCoin[i].speedX = 0; 

        if(superBulletBar.height >= -100)
        {
          superBulletBar.height -=20;
        }

        if(superBulletBar.height < -100) 
        {
          superBulletBar = new component("block", 10, -100, 'gold', 20, 200);
          // this max property was created here and Hoisting is taken advantage of 
          superBulletBar.max = true;    
        }7
      } 
    }
  }

  // This is our logic proper for calculating the level up sequence of our playable character. 
  // basically, it takes the Max experience and measures it. 
  // starts at 3% and for each level, the required measure of the total experience is met and checked witht he current exp. 
  // when it matches or is greater, the measure is increased by 2%, this makes it harder to go to the next level than the previous. 
  var measure; 
  measure = myPlayer.maxExp * myPlayer.baseExp; 
  if(myPlayer.exp >= measure && measure <= myPlayer.maxExp)
  {
    myPlayer.Level+=1; 
    myPlayer.baseExp += 0.02;
    // increases character movement speed on level up. 
    myPlayer.spdLev += 0.4; 
    myPlayer.exp = 0;  
  }

  myGameArea.clear();
  // remember, it's after you clear the game area before you can activate the updates effect. 
  myBackground.update();
  myBackground.speedX = -0.5;
  // myBackground.movement();
  myGameArea.frameNo += 1;
  // the following numbers below are keycodes for keyboard buttons 'asdwi'
  // condition for the up(w) key

  if(myGameArea.key && myGameArea.key == 119 ) {
          myPlayer.image.src = 'images/pUpMove.gif';
          myPlayer.speedY-=2.5 + myPlayer.spdLev;
    }

    // condition for the down(s) key
  if(myGameArea.key && myGameArea.key == 115 ) {
          myPlayer.image.src = 'images/pDnMove.gif';
          myPlayer.speedY+=2.5 + myPlayer.spdLev;
    }

    // condition for the Left(a)/backward key
  if(myGameArea.key && myGameArea.key == 97  ) {
          myPlayer.image.src = myPlayer.color;
          myPlayer.speedX-=2 + myPlayer.spdLev;
    }

    // condition for the right(d) key
  if(myGameArea.key && myGameArea.key == 100 ) {
          myPlayer.image.src = 'images/pmove.gif';
          myPlayer.speedX +=3 + myPlayer.spdLev;
    }

    // condition for the Shot Key(i).
  if(myGameArea.key && myGameArea.key == 105 ) {
          if(bullet.x > myGameArea.scene.width || bullet.speedX == 0) 
          {
            shot.play();
            bullet = new component("Image", 20,20, 'images/throw.png', myPlayer.x, myPlayer.y); 
            bullet.giveBulletSpeed();  
          }
    }

    // condiiton for supershot key(i).
  if(myGameArea.key && myGameArea.key == 107 ) {
    if(superBulletBar.max == true) 
    {
      // play sound
      superBulletSound.play(); 
      // then Instantiate. 
      superBullet = new component("Image", 216, 200, 'images/superbullet.png', myPlayer.x, myPlayer.y - myPlayer.height); 
      superBullet.giveBulletSpeed(); 
      superBulletBar.height = -10;
      superBulletBar = new component('block', 10, -10, 'rgba(100, 100, 0, 0.5)', 20, 200);
      superBulletBar.max = false;  
    }
  }
    
    // keep to date every coin on the screen. 
    for(i = 0; i < coinCount; i++)
    { 
        myCoin[i].movement(); 
        myCoin[i].update();
    }

    superBullet.movement(); 
    superBullet.update(); 
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

  // moving the array of obstacles and updating them to keep them on view.
  for(i = 0; i < size; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  } 

  // we'll use this to manipulate the difficulty sequence as you progress. 
  for(i = 0; i < wave; i++) {
    if(myEnemies[i].is_alive())
    {
      myEnemies[i].giveSpeed();
      if(myGameArea.NextLevel == true) {
        myEnemies[i].addSpeed(myGameArea.difficulty); 
      } 
    }  
  }

  for(i = 0; i < coinCount; i++){
    if(myCoin[i].is_alive())
    {
      myCoin[i].giveAuraSpeed(); 
    }
  }
   
  // this is the difficulty logic, to calculate the difficulty of the game at certain instances. 
  // it follows similar logic as that of the LevelUp sequence. 
  var diffMeasure; 
  diffMeasure = myGameArea.DiffSet * myGameArea.baseDiff; 
  if(myGameArea.Defeated >= diffMeasure && diffMeasure <= myGameArea.DiffSet){
    myGameArea.difficulty+=1; 
    myGameArea.baseDiff+=0.1; 
    myGameArea.Defeated = 0; 
    console.log("difficulty + 1"); 
    myGameArea.NextLevel = true; 
    if(myGameArea.difficulty >= 2) {
      myGameArea.EnemyInterval = 10; 
    }

  }

  // moving the array of enemies and updating them to keep them on view per interval.
  for(i= 0; i < wave; i++) {
    myEnemies[i].x -= myEnemies[i].speedX;
    myEnemies[i].update();
  }

  myScore.text = "SCORE: " + myGameArea.Defeated;
  myPlayerExp.text = "EXP: " + myPlayer.exp;
  myPlayerLevel.text = "LEVEL: " + myPlayer.Level; 
  myPlayerLevel.update();  
  myPlayerExp.update(); 
  myScore.update();
  myPlayer.update();
  myAcquired.update(); 
  superBulletBar.update(); 
  myPlayer.stopkeyMove();
  upButton.update();
  downButton.update();
  leftButton.update();
  rightButton.update();

  // trying to optimize the game by removing obstacles when they leave the game canvas. 
// for(i = 0; i < size; i++)
// {
//   if(myObstacles[i].x < 0)
//   {
//     var junk = myObstacles.shift(); 
//     junk = null; 
//   }
// }
}

function stopMove(){
  myPlayer.speedX = 0;
  myPlayer.speedY = 0;
}

// this section is for our events.
play.addEventListener('click', startGame);
// use the touchstart event to handle touchscreens like mobile or touchscreens.
