 // Main script to handle basic game configurations and functions
 
 let canvas;
 let ctx;
 let character_image;  
 let characterHeight;
 let characterWidth;
 let character_x = 150;
 let character_y = 25;
 let character_energy = 100;
 let collectedBottles = 80;
 let isMovingRight = false;
 let isMovingLeft = false;
 let bg_elements = 0;
 let timePassedSinceJump = 0; 
 let lastJumpStarted = 0;
 let chickens = [];
 let placedBottles = [1560, 3070, 4500, 6800, 508, 7400];
 let bottle_y = 430;
 let bottleThrowTime = 0;
 let thrownBottleX = 0;
 let thrownBottleY = 0;
 let boss_energy = 100;
 let boss_x = 1000;
 let boss_y = 130;



 // ----------- Game config
 let JUMP_TIME = 500; // in ms
 let GAME_SPEED = 11;
 let AUDIO_RUNNING = new Audio ('./audio/running.mp3');
 let AUDIO_JUMP = new Audio ('./audio/jump.mp3');
 let AUDIO_BOTTLE = new Audio ('./audio/bottle.mp3');
 let COLLISION_ENERGY_LOSS = 20;
 let COLLISION_BOTTLE_FILL = 20;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    preloadImages();
    createChickenList();
    checkCharacterMovement();
    calculateCloudOffset();
    calculateChickenPosition();
    calculateBottleThrow();
    draw();
    listenForKeys();
    checkForCollision();
 }

 /**
  * Check for collisions
  */

    function checkForCollision() {
        setInterval(function(){
            checkChickenCollision();
            checkBottleCollision();
            checkBossCollision();
        }, 50);
    }

    function checkBossCollision() {
        if ( checkCollisionCondition(thrownBottleX, 30, boss_x, 300, thrownBottleY, 50, boss_y)) {
            if (boss_energy > 0) {
                boss_energy -= COLLISION_ENERGY_LOSS;
                console.log('boss_energy: ' + boss_energy)    
            } else {
                console.log('Congrats, you won!');
            }
        }
    } 

    function checkCollisionCondition(collider_1_x, collider_1_width, collider_2_x, collider_2_width, collider_2_y, collider_2_height, collider_1_y) {
        collider_1_x += bg_elements; // add movement of background
        // defines range for x-position in which collision is detected
        let x_condition = ((collider_1_x - collider_1_width/2) < (collider_2_x + collider_2_width/2) && (collider_1_x + collider_1_width/2) > (collider_2_x + collider_2_width/2));
        // defines range for y-position in which collision is detected
        let y_condition = ((collider_2_y + collider_2_height) > collider_1_y) ;
        return (x_condition && y_condition);
    }

    function checkChickenCollision() {
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            let chickenWidth = canvas.width * chicken.scale_x - 20; 
            let chicken_x = chicken.position_x;  // calculates absolute position of chicken by taking background-movement into account
            characterWidth = character_image.width * 0.35 - 125;
            
            if (checkCollisionCondition(chicken_x, chickenWidth, character_x, characterWidth, character_y, characterHeight, chicken.position_y)) {        
                reduceCharacterEnergy();
            }
        }
    }

    function reduceCharacterEnergy() {
        character_energy -= COLLISION_ENERGY_LOSS;  // reduce energy when hit by enemy
    
        if (character_energy <= 0) {
            alert('Game over!');    // game over if character energy
            AUDIO_RUNNING.pause(); // pauses running audio when game over
        }
    }

    function checkBottleCollision() {
        // check collision to pick-up bottle
        for (let i = 0; i < placedBottles.length; i++) {
           let bottleWidth = (canvas.width * 0.125); 
           let bottle_x = placedBottles[i];  
   
           if (checkCollisionCondition(bottle_x, bottleWidth, character_x, characterWidth, character_y, characterHeight, bottle_y)) { 
               pickBottle(i);
           }; 
       };
    }

    function pickBottle(i) {
        placedBottles[i] = -2000; // moves bottle outside of visible canvas when picked
        // .splice(i, 1);  // removes bottle from canvas when picked up
        AUDIO_BOTTLE.play();
        collectedBottles += COLLISION_BOTTLE_FILL;
    }


/**
 * Create and calculate enemies
 */

    function createChicken(imgPath, position_x) {
        return {
            'img_path':     imgPath,
            'position_x':   position_x,
            'position_y':   430,
            'scale_x':      0.1,
            'scale_y':      0.2,
            'speed':        (Math.random() * 5) // generates random speed between 1 and 5 px
        }
    }

   function createChickenList(){
        let gallinitaPath = './img/3.Secuencias_Enemy_básico/Versión_Gallinita/';
        let pollitoPath = './img/3.Secuencias_Enemy_básico/Versión_pollito/';
    
        chickens = [
            createChicken(gallinitaPath, 2* canvas.width ),
            createChicken(pollitoPath, 1.8 * canvas.width), 
            createChicken(gallinitaPath, 4.5* canvas.width ),
            createChicken(pollitoPath, 3.3 * canvas.width), 
            createChicken(pollitoPath, 5.6 * canvas.width)
        ]
    }

    function calculateChickenPosition() {
        setInterval( function() {
            for (let i=0; i < chickens.length; i++) {
                let chicken = chickens[i];
                chicken.position_x -= chicken.speed; 
            }
        }, 100);
    }


 /**
  * Create and calculate character 
  */
    function checkCharacterMovement() {  
        setInterval(function() {
            timePassedSinceJump = new Date().getTime() - lastJumpStarted;
            let isJumping = timePassedSinceJump < JUMP_TIME * 2;

            animateRunningCharacter();
            animateJumpingCharacter(isJumping);
            animateStandingCharacter(isJumping);
            if (!isMovingLeft && !isMovingRight || isJumping) {
                AUDIO_RUNNING.pause(); // pauses running audio when standing or jumping
            }
            characterGraphicIndex++;
        }, 50);
    }

    function calculateJumpingSequence(timePassedSinceJump) {
        if (timePassedSinceJump < JUMP_TIME) {
            // character rises until max. duration of JUMP_TIME is reached
            character_y -= GAME_SPEED * 1.5;
        } else if (character_y < 25) {
            // character falls until ground is reached 
            character_y += GAME_SPEED * 1.5;
        }
    }

/**
 * Check player commands 
 */

    function listenForKeys() {
        document.addEventListener("keydown", e => {
            const k = e.key;

            checkKeydown(k, e);
            preventDoubleJumping(e); 
            initiateBottleThrow(k);
        }); 

        checkKeyup();
    }

    function checkKeyup() {
        document.addEventListener("keyup", e => {
            const k = e.key;
            if (k == 'ArrowRight') {
                isMovingRight = false;
                };
            if (k == 'ArrowLeft') {
                isMovingLeft = false;
            }; 
        });
    }

    function initiateBottleThrow(k) {
        if (k == 'd' && collectedBottles > 0) {
            let timePassed = new Date().getTime() - bottleThrowTime;
            if (timePassed > 1000) {
                collectedBottles -= COLLISION_BOTTLE_FILL; 
                bottleThrowTime = new Date().getTime();
            }
        }
    }

    function preventDoubleJumping(e) {
        // prevent double-jumping
        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) { 
            lastJumpStarted = new Date().getTime();
        } 
    }

    function checkKeydown(k, e) {
        if (k == 'ArrowRight') {
            isMovingRight = true;
        };
        if (k == 'ArrowLeft') {
            isMovingLeft = true;
        };
        if (e.code == 'Space') {
            characterGraphicIndex = 0;
            AUDIO_JUMP.play();
        }
    }