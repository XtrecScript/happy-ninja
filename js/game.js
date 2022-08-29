window.onload = function() { 

  
  //Declaracion de variables
  var innerWidth = window.innerWidth;
  var innerHeight = window.innerHeight;
  var gameRatio = innerWidth / innerHeight;
  var game = new Phaser.Game(Math.floor(480 * gameRatio), 480, Phaser.CANVAS);
  var ninja;
  var ninjaGravity = 800;
  var ninjaJumpPower;
  var score = 0; 
  var scoreText;
  var bestText;
  var topScore;
  var powerBar;
  var angle;
  var powerTween;
  var placedPoles;
  var poleGroup;
  var minPoleGap = 100;
  var maxPoleGap = 300;
  var ninjaJumping;
  var ninjaFallingDown;
  var time;
  var music; 

  //Cargando los assets necesarios
  var play = function(game) {}
  play.prototype = {
    preload: function() {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setScreenSize(true);
      game.load.image("ninja", "assets/1.png");
      game.load.image("container", "assets/container.png");
      game.load.audio("jump","assets/jump.mp3");

      game.load.spritesheet("ninje" , "assets/ninja2.png" , 43 ,54);
      game.load.spritesheet("background", "assets/background.png" , 941, 479);

      game.load.image("pole", "assets/pole.png");
      game.load.image("powerbar", "assets/powerbar3.png")
      game.load.image("angle" , "assets/angle.png");
    },

    create: function() {
      background = game.add.sprite(0,0, 'background');
      game.add.sprite(50, 20, "container");
      ninjaJumping = false;
      ninjaFallingDown = false;
      score = 0;
      placedPoles = 0;
      time = 0;
      poleGroup = game.add.group();
      topScore = localStorage.getItem("topFlappyScore") == null ? 0 : localStorage.getItem("topFlappyScore");
      scoreText = game.add.text(411, 10, "-", {
        font: "bold 50px Arial",
        boundsAlignH: "center", 
        boundsAlignV: "middle"
      });
      bestText = game.add.text(465, 10, "-", {
        font: "bold 16px Arial"
        
      });
      updateScore();

      game.physics.startSystem(Phaser.Physics.ARCADE);
      ninja = game.add.sprite(80, 0, "ninja");
      ninja.anchor.set(0.5);
      ninja.lastPole = 1;
      game.physics.arcade.enable(ninja);
      ninja.body.gravity.y = ninjaGravity;
      game.input.onDown.add(prepareToJump, this);
      game.input.onDown.add(prepareAngle, this);
      addPole(80);
      

      ninje = game.add.sprite(80, 150, "ninje")
      ninje.animations.add("stand", [0,], 3, true);
      ninje.animations.add("jump", [1,], 3, true);
      ninje.anchor.set(0.5);
      ninje.lastPole = 1;
      game.physics.arcade.enable(ninje);
      ninje.body.gravity.y = ninjaGravity;

      background.animations.add("b1", [0,], 3, true);
      background.animations.add("b2", [1,], 3, true);
      background.animations.add("b3", [2,], 3, true);
      background.animations.add("b4", [3,], 3, true);
      
      music = game.add.audio("jump");
      music.play();

      
    },

    update: function() {
      game.physics.arcade.collide(ninje, poleGroup, checkLanding);
      
      

      if (ninje.y > game.height) {
        die();
      }
      if (time >= 4){
        background.animations.play("b2")
      }
      if (time > 6){
        background.animations.play("b3")
      }
      if (time > 8){
        background.animations.play("b4")
      }
    }
  }
  game.state.add("Play", play);
  game.state.start("Play");

  function updateScore() {
    scoreText.text = "ㅤ" + score;
    bestText.text = "\n"+"\n"+"\n" +topScore;
  }


  //Funcion para el angulo
   function prepareAngle() {
    if (ninje.body.velocity.y == 0) {
       angle = game.add.sprite(ninje.x, ninje.y - 150, "angle");
       angle.width = 0;
       angleTween = game.add.tween(angle).to({
         width: 100
       }, 1000, "Linear", true);
       game.input.onDown.remove(prepareAngle, this);
       game.input.onUp.add(jump, this);
       ninje.animations.play("stand");
     }
   }

  //Funcion para la barra de fuerza
  function prepareToJump() {
    if (ninje.body.velocity.y == 0) {
      powerBar = game.add.sprite(50, 20, "powerbar");
      powerBar.width = 0;
      powerTween = game.add.tween(powerBar).to({
        width: 100
      }, 1000, "Linear", true);
      game.input.onDown.remove(prepareToJump, this);
      game.input.onUp.add(jump, this);
      ninje.animations.play("stand");
      time++;
      console.log(time);
    }
  }

    function prepareToJump() {
    if (ninje.body.velocity.y == 0) {
      powerBar = game.add.sprite(50, 20, "powerbar");
      powerBar.width = 0;
      powerTween = game.add.tween(powerBar).to({
        width: 100
      }, 1000, "Linear", true);
      game.input.onDown.remove(prepareToJump, this);
      game.input.onUp.add(jump, this);
      ninje.animations.play("stand");
      time++;
      console.log(time);
    }
  }

  

  //Funcion para saltar utilizando las funciones de arriba
  function jump() {
    ninjaJumpPower = -powerBar.width * 3 - 100
    powerBar.destroy();
    game.tweens.removeAll();
    ninje.body.velocity.y = ninjaJumpPower * 2;
    ninjaJumping = true;
    powerTween.stop();
    angleTween.stop();
    angle.destroy();
    game.input.onUp.remove(jump, this);
    ninje.animations.play("jump");
  }

  //Funcion para anadir nuevos postes
  function addNewPoles() {
    var maxPoleX = 1;
    poleGroup.forEach(function(item) {
      maxPoleX = Math.max(item.x, maxPoleX)
    });
    var nextPolePosition = maxPoleX + game.rnd.between(minPoleGap, maxPoleGap);
    addPole(nextPolePosition);
  }

  function addPole(poleX) {
    if (poleX < game.width * 2) {
      placedPoles++;
      var pole = new Pole(game, poleX, game.rnd.between(250, 380));
      game.add.existing(pole);
      pole.anchor.set(0.5, 0);
      poleGroup.add(pole);
      var nextPolePosition = poleX + game.rnd.between(minPoleGap, maxPoleGap);
      addPole(nextPolePosition);
    }
  }

  //Funcion de muerte 
  function die() {
    localStorage.setItem("topFlappyScore", Math.max(score, topScore,));
    game.state.start("Play");
  }


  //Funcion para sumar puntos y checkear si estas en una plataforma
  function checkLanding(n, p) {
    if (p.y >= n.y + n.height / 2) {
      var border = n.x - p.x
      if (Math.abs(border) > 30) {
        n.body.velocity.x = border * 2;
        n.body.velocity.y = -200;
       }
      var poleDiff = p.poleNumber - n.lastPole;
      if (poleDiff > 0) {
        score += Math.pow(2, poleDiff);
        updateScore();
        n.lastPole = p.poleNumber;
      }
      if (ninjaJumping) {
        ninjaJumping = false;
        game.input.onDown.add(prepareToJump, this);
        game.input.onDown.add(prepareAngle,this);
        ninje.animations.play("stand");
      }
    } else {
      ninjaFallingDown = true;
      poleGroup.forEach(function(item) {
        item.body.velocity.x = 0;
      });
    }
  }
  Pole = function(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, "pole");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.immovable = true;
    this.poleNumber = placedPoles;
  };
  Pole.prototype = Object.create(Phaser.Sprite.prototype);
  Pole.prototype.constructor = Pole;
  Pole.prototype.update = function() {
    if (ninjaJumping && !ninjaFallingDown) {
      this.body.velocity.x = ninjaJumpPower;
    } else {
      this.body.velocity.x = 0
    }
    if (this.x < -this.width) {
      this.destroy();
      addNewPoles();
    }
  }
}
