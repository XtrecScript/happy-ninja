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
  var world;
  var test;
  var death;
  var sa = 0;

  //Cargando los assets necesarios
  var play = function(game) {}
  play.prototype = {
    preload: function() {
      game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      game.scale.setScreenSize(true);
      game.load.image("ninja", "assets/1.png");
      game.load.image("container", "assets/container.png");
      game.load.audio("jump","assets/jump.mp3");
      game.load.audio("world", "assets/world.mp3");
      game.load.audio("death","assets/death.mp3");

      game.load.spritesheet("ninje" , "assets/ninja2.png" , 43 ,54);
      game.load.spritesheet("background", "assets/background.png" , 941, 479);
      game.load.spritesheet("questions","assets/q1.png", 600, 197);
      game.load.spritesheet("questions2","assets/q2.png", 600, 197);
      game.load.spritesheet("button_a","assets/button_a.png",66,66);
      game.load.spritesheet("button_b","assets/button_b.png",66,66);
      game.load.spritesheet("button_c","assets/button_c.png",66,66);
      game.load.spritesheet("button_d","assets/button_d.png",66,66);
      // game.load.image("questions", "assets/q1.png");

      game.load.image("pole", "assets/pole.png");
      game.load.image("powerbar", "assets/powerbar3.png");
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
      scoreText = game.add.text(background.width/2, 10, "-", {
        font: "bold 52px Arial",
        boundsAlignH: "center", 
        boundsAlignV: "middle"
      });
      bestText = game.add.text(background.width/2, 70, "-", {
        font: "bold 18px Arial"
        
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

      //Diferentes fondos
      background.animations.add("b1", [0,], 3, true);
      background.animations.add("b2", [1,], 3, true);
      background.animations.add("b3", [2,], 3, true);
      background.animations.add("b4", [3,], 3, true);

      //Diferentes preguntas
      questions = game.add.sprite(180,25,"questions")
      questions.animations.add("q1", [1,], 3, true);
      questions.visible = false;

      questions2 = game.add.sprite(180,25,"questions2")
      questions2.animations.add("q2", [0,], 3, true);
      questions2.visible = false;

      //Lo de cada boton (A)
      button_a = game.add.sprite(220, 240, "button_a")
      button_a.visible = false;
      button_a.inputEnabled = true;
      button_a.input.useHandCursor = true;
      button_a.events.onInputDown.add(pressA, this);
      button_a.animations.add("b1", [1,], 3, true)

      //Lo de cada boton (B)
      button_b = game.add.sprite(600, 240, "button_b")
      button_b.visible = false;
      button_b.inputEnabled = true;
      button_b.input.useHandCursor = true;
      button_b.events.onInputDown.add(pressB, this);
      button_b.animations.add("b2", [1,], 3, true)

      //Lo de cada boton (b)
      button_c = game.add.sprite(220, 320, "button_c")
      button_c.visible = false;
      button_c.inputEnabled = true;
      button_c.input.useHandCursor = true;
      button_c.events.onInputDown.add(pressC, this);
      button_c.animations.add("b3", [1,], 3, true)
      
      //Lo de cada boton (d)
      button_d = game.add.sprite(600, 320, "button_d")
      button_d.visible = false;
      button_d.inputEnabled = true;
      button_d.input.useHandCursor = true;
      button_d.events.onInputDown.add(pressD, this);
      button_d.animations.add("b4", [1,], 3, true)

      // El pregutas 2
      button_a2 = game.add.sprite(220, 240, "button_a")
      button_a2.visible = false;
      button_a2.inputEnabled = true;
      button_a2.input.useHandCursor = true;
      button_a2.events.onInputDown.add(pressA2, this);
      button_a2.animations.add("b1", [1,], 3, true)

      //Lo de cada boton (B)
      button_b2 = game.add.sprite(600, 240, "button_b")
      button_b2.visible = false;
      button_b2.inputEnabled = true;
      button_b2.input.useHandCursor = true;
      button_b2.events.onInputDown.add(pressB2, this);
      button_b2.animations.add("b2", [1,], 3, true)

      //Lo de cada boton (b)
      button_c2 = game.add.sprite(220, 320, "button_c")
      button_c2.visible = false;
      button_c2.inputEnabled = true;
      button_c2.input.useHandCursor = true;
      button_c2.events.onInputDown.add(pressC2, this);
      button_c2.animations.add("b3", [1,], 3, true)
      
      //Lo de cada boton (d)
      button_d2 = game.add.sprite(600, 320, "button_d")
      button_d2.visible = false;
      button_d2.inputEnabled = true;
      button_d2.input.useHandCursor = true;
      button_d2.events.onInputDown.add(pressD2, this);
      button_d2.animations.add("b4", [1,], 3, true)
      

      //Musica
      music = game.add.audio("jump");
      world = game.add.audio("world");
      death = game.add.audio("death");
      world.play();      
    },

    update: function() {
      game.physics.arcade.collide(ninje, poleGroup, checkLanding);
      
      
      //Preguntas
      if(time>= 2){
        questions.visible = true;
        questions.animations.play("q1")
        button_a.animations.play("b1")
        button_a.visible = true;
        button_b.animations.play("b2")
        button_b.visible = true;
        button_c.animations.play("b3")
        button_c.visible = true;
        button_d.animations.play("b4")
        button_d.visible = true;
        
      }

      if(time>= 4){
        questions2.visible = true;
        questions2.animations.play("q2")
        button_a2.animations.play("b1")
        button_a2.visible = true;
        button_b2.animations.play("b2")
        button_b2.visible = true;
        button_c2.animations.play("b3")
        button_c2.visible = true;
        button_d2.animations.play("b4")
        button_d2.visible = true;
        
      }
      //Muerte
      if (ninje.y > game.height) {
        die();
        death.play();
      }

      //Fondos
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
  
  //Presiono el A
  function pressA () {
    console.log("pressA");
    pa()
}

  //Presiono el B
  function pressB () {
    console.log("pressB");
    pb()
}

  //Presiono el C
  function pressC () {
    console.log("pressC");
    pc()
}

  //Presiono el D
  function pressD () {
    console.log("pressD");
    pd()
}

  //Pregunta funciones
  function pressA2 () {
    console.log("pressA");
    die()
}
  function pressB2 () {
    die()
} 
  function pressC2 () {
    die()
} 

  function pressD2 () {
    console.log("pressA");
    questions2.destroy();
    button_a2.destroy();
    button_b2.destroy();
    button_c2.destroy();
    button_d2.destroy();
}

  //Pregunta 1
  function pa(){
      console.log("condiA")
      questions.destroy();
      button_a.destroy();
      button_b.destroy();
      button_c.destroy();
      button_d.destroy();
    }
  function pb(){ 
    die()
  }

  function pc(){
    die()
  }

  function pd(){
    die()
  }





  //Score
  function updateScore() {
    scoreText.text = + score;
    bestText.text = +topScore;
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
    music.play();
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
    world.stop();
    questions.destroy();
    button_a.destroy();
    button_b.destroy();
    button_c.destroy();
    button_d.destroy();
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
