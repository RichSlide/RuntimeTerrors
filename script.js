
const startGame = document.querySelector('#startGame');
const mainMenu = document.querySelector('.mainMenu');
const displayTimer = document.querySelector('#timer');
const bars = document.querySelector('#bars');
const displayWin = document.querySelector('#winDecision');
const restart = document.querySelector('#restart');
const changeWin = document.querySelector('#changeWin');
const displayWinCount = document.querySelector('#winCount');
const player1WinsDisplay = document.querySelector('#player1Count');
const player2WinsDisplay = document.querySelector('#player2Count');
let l = 0
let r = 0
//Health Bars (request change value when attacked)
const firstBar = document.querySelector('#firstBar');
const secondBar = document.querySelector('#secondBar');
firstBar.value = 100;
secondBar.value = 100;


let canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let keyPresses = {};
const gravity = 0.4;
let currentLoopIndex = 0;
let frameCount = 0;

let timeLeft = 31;
let player1Wins = 0;
let player2Wins = 0;
let removeEndScreen = true;

let character = new Image();
character.src = "Run.png"
let context = canvas.getContext('2d');

context.fillRect(0, 0, canvas.width, canvas.height)
make_base();

//Start Game button event
startGame.addEventListener('click', e => {

  canvas.classList.remove('hidden');
  mainMenu.classList.add('hidden');
  displayTimer.classList.remove('hidden');
  bars.classList.remove('hidden');
  player.position.x = -player.width / 5 + 50
  enemy.offset.y = -88




  //Countdown timer

  let timer = setInterval(function() {
    if (timeLeft <= 1) {
      clearInterval(timer);
      console.log("Timer has reached zero");
    }
    timeLeft -= 1;
    console.log(timeLeft);

    displayTimer.innerHTML = timeLeft;

  }, 1000);

});
restart.addEventListener('click', e => {

  removeEndScreen = false;
  if (timeLeft === 0) {
    timeLeft = 30;
    let timer = setInterval(function() {
      if (timeLeft <= 1) {
        clearInterval(timer);
        console.log("Timer has reached zero");
      }
      timeLeft -= 1;
      console.log(timeLeft);

      displayTimer.innerHTML = timeLeft;

    }, 1000);
  }
  player.health = 100;
  enemy.health = 100;
  timeLeft = 31;

  displayWin.classList.add("hidden");

});

function make_base() {
  base_image = new Image();
  base_image.src = "https://44.media.tumblr.com/2ce4a735f4dbb8f133fd81fbaabd0af8/tumblr_nespxwV7Ze1rnbw6mo2_r1_1280.gif";
  base_image.onload = function() {
    context.drawImage(base_image, 0, 0, canvas.width, canvas.height);
  }
}




class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
    this.position = position
    this.height = 0;
    this.width = 0;
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0;
    this.framesElapsed = 0
    this.framesHold = 1
    this.offset = offset

  }

  draw() {

    context.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    )
    // if (this.isAttacking) {
    //   context.fillStyle = 'green'
    //   context.fillRect(this.attackBox.position.x, this.attackBox.position.y, 150, 100)

    // }
  }
  animateFrames() {
    this.framesElapsed++
    if (this.framesElapsed % this.framesHold === 0) {


      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      }
      else
        this.framesCurrent = 0;
    }
  }


  update() {
    this.draw()
    this.animateFrames()
  }

}
class Fighter extends Sprite {

  constructor({ position, velocity, color = 'red', offset, offsetB, imageSrc, scale = 3, framesMax = 1, sprites }) {
    super({ position, imageSrc, scale, framesMax, offset })
    this.framesCurrent = 0;
    this.framesElapsed = 0
    this.framesHold = 7
    this.velocity = velocity
    this.height = this.image.height;
    this.width = this.image.width;
    this.attackBox = {
      position: {
        x: this.position.x + this.image.width,
        y: this.position.y + 1000
      },
      offset,
      offsetB,

      width: 200,
      height: 200

    }
    this.offsetB = {
      x: 0,
      y: 0
    },
      this.color = color
    this.isAttacking
    this.health = 100
    this.status = 1
    this.sprites = sprites



    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image()
      sprites[sprite].image.src = sprites[sprite].imageSrc
    }

  }

  update() {

    this.animateFrames()
   
    if (player.velocity.y < 0) {
      player.image = player.sprites.jump.image
      player.framesMax = player.sprites.jump.framesMax
    }
    if (player.velocity.y > 2) {
      player.image = player.sprites.fall.image
      player.framesMax = player.sprites.fall.framesMax
    }
    if (player.velocity.y === 0 && player.velocity.x ===0&&!keyPresses.s) {
      player.image = player.sprites.idle.image
      player.framesMax = player.sprites.idle.framesMax
    }

     if (enemy.velocity.y < 0) {
      enemy.image = enemy.sprites.jump.image
      enemy.framesMax = enemy.sprites.jump.framesMax
    }
    if (enemy.velocity.y > 2) {
      enemy.image = enemy.sprites.fall.image
      enemy.framesMax = enemy.sprites.fall.framesMax
    }
    if (enemy.velocity.y === 0 && enemy.velocity.x ===0&&!keyPresses.ArrowDown) {
      enemy.image = enemy.sprites.idle.image
      enemy.framesMax = enemy.sprites.idle.framesMax
    }


    if(keyPresses.s)
    {
      l=0
    }
if (!keyPresses.s&&player.framesCurrent>=4) {
    l = 1
  }
  if (!keyPresses.ArrowDown&&enemy.framesCurrent>=4) {
    r = 1
  }
if (keyPresses.ArrowDown)
{
  r=0
}
   if (l === 0) {
    player.attack()
    
  
    player.image = player.sprites.attack1.image
    player.framesMax = player.sprites.attack1.framesMax
   
    }
     if (r === 0) {
    enemy.attack()
    
  
    enemy.image = enemy.sprites.attack1.image
    enemy.framesMax = enemy.sprites.attack1.framesMax
   
    }
    enemy.offsetB.x = -200
    enemy.offsetB.y = -50
    player.offsetB.x=120

    player.width = player.image.width + 100
    player.height = player.image.height - 52
    enemy.width = enemy.image.width
    enemy.height = enemy.image.height

    // determineWinner({ player, enemy, timeLeft })
    firstBar.value = player.health
    secondBar.value = enemy.health
    this.draw()
    this.attackBox.position.x = this.position.x + this.width / 3.5 + this.offsetB.x //SHIFTS RIGHT ONE OVER TO LEFT
    this.attackBox.position.y = this.position.y + this.height * this.scale / 2 + 25 + this.offsetB.y
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x
    this.velocity.y += gravity;
    if (this.position.y + this.height * this.scale + this.velocity.y + this.offset.y >= canvas.height) {
      this.velocity.y = 0;

    }
    if ((this.position.x + this.width / 4 + this.velocity.x <= 0)) {
      this.velocity.x = 0
      this.position.x = -this.width / 4;
    }
    if (this.position.x + this.width / 4 >= canvas.width) {
      this.velocity.x = 0
      this.position.x = canvas.width - this.width / 4;
    }//fix for both players
    if ((player.attackBox.position.x + 120 >= enemy.attackBox.position.x) && (player.attackBox.position.x + 200 <= enemy.position.x + 50 + enemy.width / 3) && (player.attackBox.position.y + 60 >= enemy.attackBox.position.y) && (player.attackBox.position.y <= enemy.attackBox.position.y + 60) && player.isAttacking) {
      player.isAttacking = false;
      console.log("player hit")
      enemy.health -= 5

    }
    if ((enemy.attackBox.position.x <= player.attackBox.position.x + 60) && (enemy.attackBox.position.x + 200 >= player.attackBox.position.x - 30) && (enemy.attackBox.position.y + 150 >= player.attackBox.position.y) && (enemy.attackBox.position.y <= player.attackBox.position.y + 60) && enemy.isAttacking) {
      enemy.isAttacking = false;
      console.log("enemy hit")
      player.health -= 8
    }
    if (!removeEndScreen) {
      player.position.x = -999
      enemy.position.x = 2000
      timeLeft = 30
    }

    if (player.health === enemy.health) {
      displayWin.classList.add("hidden");
      displayWinCount.classList.add("hidden");
      removeEndScreen = true;
    }
    if (player.health <= 0) {
      if (removeEndScreen) {
        displayWin.classList.remove("hidden");
        displayWinCount.classList.remove("hidden");
        changeWin.innerHTML = "Player 1 Won";
        player1Wins += 1;
        player1WinsDisplay.innerHTML = "Player 1 Wins [" + player1Wins + "]";
        player2WinsDisplay.innerHTML = "Player 2 Wins [" + player2Wins + "]";
        removeEndScreen = false;
      }

    }
    if (enemy.health <= 0) {
      if (removeEndScreen) {
        displayWin.classList.remove("hidden");
        displayWinCount.classList.remove("hidden");
        changeWin.innerHTML = "Player 2 Won";
        player2Wins += 1;
        player1WinsDisplay.innerHTML = "Player 1 Wins [" + player1Wins + "]";
        player2WinsDisplay.innerHTML = "Player 2 Wins [" + player2Wins + "]";
        removeEndScreen = false;
      }

    }
    if (timeLeft <= 0) {

      if (player.health > enemy.health) {
        if (removeEndScreen) {
          displayWin.classList.remove("hidden");
          displayWinCount.classList.remove("hidden");
          changeWin.innerHTML = "Player 1 Won";
          player1Wins += 1;
          player1WinsDisplay.innerHTML = "Player 1 Wins [" + player1Wins + "]";
          player2WinsDisplay.innerHTML = "Player 2 Wins [" + player2Wins + "]";
          removeEndScreen = false;
        }

      } if (enemy.health > player.health) {
        if (removeEndScreen) {
          displayWin.classList.remove("hidden");
          displayWinCount.classList.remove("hidden");
          changeWin.innerHTML = "Player 2 Won";
          player2Wins += 1;
          player1WinsDisplay.innerHTML = "Player 1 Wins [" + player1Wins + "]";
          player2WinsDisplay.innerHTML = "Player 2 Wins [" + player2Wins + "]";
          removeEndScreen = false;
        }


      } if (displayWin.classList.contains("hidden")) {
        if (enemy.health === player.health) {
          if (removeEndScreen) {
            displayWin.classList.remove("hidden");
            displayWinCount.classList.remove("hidden");
            changeWin.innerHTML = "Tie";
            player1WinsDisplay.innerHTML = "Player 1 Wins [" + player1Wins + "]";
            player2WinsDisplay.innerHTML = "Player 2 Wins [" + player2Wins + "]";
            removeEndScreen = false;
          }
        }
      }
    }
  }

  //   if (player.health <= 0)
  //     player.status = 0;
  //   if (enemy.health <= 0)
  //     enemy.status = 0
  // determineWinner({ player, enemy, timeLeft })
  // }

  attack() {
    this.isAttacking = true;
    setTimeout((e) => {
      this.isAttacking = false
    }, 100)

  }
}


// Huntress(Player 1) Animation sprites
const player = new Fighter({
  position: {
    x: -300,
    y: -100
  },
  velocity: {
    x: 0,
    y: 10
  },
  offset: {
    x: 0,
    y: 0
  },

  width: 999,
  height: 999,
  imageSrc: 'Idle.png',
  framesMax: 8,
  scale: 5,

  sprites: {
    idle: {
      imageSrc: 'Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: 'Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: 'Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: 'Attack1.png',
      framesMax: 5
    },
    takeHit: {
      imageSrc: 'TakeHit - white silhouette.png',
      framesMax: 3
    },
    death: {
      imageSrc: 'Death.png',
      framesMax: 8
    }
  },
  attackBox: {

    width: 160,
    height: 50,
  },
  offsetB: {
    x: 0,
    y: 0
  },

})


const enemy = new Fighter({
  position: {
    x: 1200,
    y: -100
  },
  velocity: {
    x: 0,
    y: 10
  },
  offset: {
    x: 0,
    y: 0
  },

  imageSrc: 'Idle1.png',
  framesMax: 10,
  scale: 4.2,
  sprites: {
    idle: {
      imageSrc: 'Idle1.png',
      framesMax: 10
    },
    run: {
      imageSrc: 'Run1.png',
      framesMax: 8
    },
    jump: {
      imageSrc: 'GoingUp.png',
      framesMax: 3
    },
    fall: {
      imageSrc: 'GoingDown.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: 'Attack2.png',
      framesMax: 7
    },
    takeHit: {
      imageSrc: 'takeHit1.png',
      framesMax: 3
    },
    death: {
      imageSrc: 'Death1.png',
      framesMax: 11
    }
  },
  attackBox: {

    width: 160,
    height: 50
  },
  offsetB: {
    x: 100,
    y: 50
  },

})

animate()

function animate() {
  window.requestAnimationFrame(animate);
  make_base()
  // context.fillStyle='black' // CHANGE 
  // context.fillRect(0,0, canvas.width, canvas.height)

  player.update()
  enemy.update()
}


window.addEventListener('keydown', keyDownListener);

function keyDownListener(event) {

  keyPresses[event.key] = true;

  console.log(keyPresses)

  console.log(keyPresses)


  movement()

}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {


  keyPresses[event.key] = false;
  
  console.log(keyPresses)
  player.velocity.x = 0;
  movement()

}


function movement() {


  //attack!

 


    if (player.velocity.x == 0 && player.velocity.y == 0) {
      player.image = player.sprites.idle.image
      player.framesMax = player.sprites.idle.framesMax
    }

   if (keyPresses.a) {
  
      player.velocity.x = -5;
        if(l==1){
      player.image = player.sprites.run.image
      player.framesMax = player.sprites.run.framesMax
        }
      console.log("Left")
      // running animation
      //redraws the character after button is pressed
    }
    else if (keyPresses.d) {
      player.velocity.x = 5;
       if(l==1){
      player.image = player.sprites.run.image
      player.framesMax = player.sprites.run.framesMax
       }
      console.log("Right")
      //redraws the character after button is pressed
    }
    else {
      
      player.velocity.x = 0;
       if(l==1){
      player.image = player.sprites.idle.image
      player.framesMax = player.sprites.idle.framesMax
       }
      //idle animation
    }
    // SPACE BAR JUMP
    // if (keyPresses[" "] && player.velocity.y === 0) {
    //   console.log("Jumping")
    //   player.velocity.y = -20
    // }

    if (keyPresses.w && player.velocity.y === 0) {
      console.log("Jumping")
      player.velocity.y = -20
       if(l==1){
      player.image = player.sprites.jump.image
      player.framesMax = player.sprites.jump.framesMax
       }
    }
    //AFTER JUMPING, FALL

  
   


  
  
    if  (enemy.velocity.x === 0 && enemy.velocity.y == 0) {
       if(r==1){
      enemy.image = enemy.sprites.idle.image
      enemy.framesMax = enemy.sprites.idle.framesMax
       }
    }

    if (keyPresses.ArrowLeft) {
      enemy.velocity.x = -5;
 if(r==1){
enemy.image=enemy.sprites.run.image
   enemy.framesMax=enemy.sprites.run.framesMax
 }
      console.log("Left")
      // running animation
      //redraws the character after button is pressed
    }
    else if (keyPresses.ArrowRight) {
      enemy.velocity.x = 5;
       if(r==1){
enemy.image=enemy.sprites.run.image
   enemy.framesMax=enemy.sprites.run.framesMax
 } console.log("Right")
       
     
      //redraws the character after button is pressed
    }
    else {
      enemy.velocity.x = 0;
      // player.image=player.sprites.idle.image
      // player.framesMax=player.sprites.idle.framesMax
      //idle animation
    }
    if (keyPresses["ArrowUp"] && enemy.velocity.y === 0) {
      console.log("Jumping")
      enemy.velocity.y = -20
       if(l==1){

       }
    }
  }




  function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
  }

