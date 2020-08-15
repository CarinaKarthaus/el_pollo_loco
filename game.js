 // Main script to handle basic game configurations and functions
 
 let canvas;
 let ctx;
 let character_image;  
 let characterHeight;
 let characterWidth;
 let character_x = 150;
 let character_y = 25;
 let character_energy = 100;
 let collectedBottles = 100;
 let isMovingRight = false;
 let isMovingLeft = false;
 let isSleeping = false;
 let isWounded = false;
 let bossIsWounded = false;
 let isDead = false;
 let bg_elements = 0;
 let timePassedSinceJump = 0; 
 let lastJumpStarted = 0;
 let chickens = [];
 let placedBottles = [508, 1560, 3070, 4500, 5800, 6400];
 let bottle_y = 430;
 let bottleThrowTime = 0;
 let thrownBottleX = 0;
 let thrownBottleY = 0;
 let boss_energy = 100;
 let boss_y = 130;
 let currentTime = new Date().getTime();
 let timeSinceLastKeydown = 0;
 let timeSinceLastCollision = 4000;
 let timeOfCollision = 0;
 let bossDefeatedAt = 0;
 let characterDefeatedAt = 0;
 let timeSinceLastBottleCollision = 1000;
 let timeOfBottleCollision; 
 let gameFinished = false;


 // ----------- Game config
 let LEVEL_LENGTH = 8; // indicates how often canvas-length is repeated (canvas-length = 1080px)
 let JUMP_TIME = 450; // in ms
 let GAME_SPEED = 18;
 let AUDIO_RUNNING = new Audio ('./audio/running.mp3');
 let AUDIO_JUMP = new Audio ('./audio/jump.mp3');
 let AUDIO_BOTTLE = new Audio ('./audio/bottle.mp3');
 let AUDIO_THROW = new Audio ('./audio/throw.mp3');
 let AUDIO_CHICKEN = new Audio ('./audio/chicken.mp3');
 let AUDIO_BREAKING_BOTTLE = new Audio ('./audio/breaking_bottle.mp3');
 let AUDIO_BACKGROUND_MUSIC = new Audio ('./audio/background_music.mp3');
 let AUDIO_WIN = new Audio ('./audio/win.mp3');
 let AUDIO_PAIN = new Audio ('./audio/pain.mp3');
 let AUDIO_LOST = new Audio ('./audio/defeat.mp3');
 let BOSS_POSITION_X = 7000;
 let COLLISION_ENERGY_LOSS = 20;
 let COLLISION_BOTTLE_FILL = 20;
 let DURATION_WOUNDED_STATE = 1000;

 AUDIO_BACKGROUND_MUSIC.loop = true;
 AUDIO_BACKGROUND_MUSIC.volume = 0.2;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    preloadImages();
    createChickenList();
    calculateDrawingDetails();
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
        }, 200);
    }

    function checkBossCollision() {
        timeSinceLastBottleCollision = new Date().getTime() - timeOfBottleCollision;
        if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) {
            bossIsWounded = false;
        }
        if (checkCollisionCondition(thrownBottleX, 80, BOSS_POSITION_X + bg_elements, 350, thrownBottleY, 65, boss_y, 400)) {
            timeOfBottleCollision = new Date().getTime();
            AUDIO_BREAKING_BOTTLE.play();
            reduceBossEnergy();
        }
    } 

    function reduceBossEnergy() {
        // Reduce boss energy and trigger wounded-animation
        if (boss_energy > 0) {
            boss_energy -= COLLISION_ENERGY_LOSS;
            bossIsWounded = true;
        } 
        // Trigger levelFinish-Animation if boss energy <= 0
        if (boss_energy <= 0 && bossDefeatedAt == 0) {
            bossDefeatedAt = new Date().getTime();
            finishLevel();
        }
    }

    function finishLevel() {
        AUDIO_CHICKEN.play();
        setTimeout(function() {
            AUDIO_WIN.play();
        }, 1500);
        gameFinished = true;
    }

    function checkCollisionCondition(collider_1_x, collider_1_width, collider_2_x, collider_2_width, collider_1_y, collider_1_height, collider_2_y, collider_2_height) {
        // defines range for x-position in which collision is detected
        let x_condition = ((collider_1_x - collider_1_width/2) < (collider_2_x + collider_2_width/2) && (collider_1_x + collider_1_width/2) > (collider_2_x - collider_2_width/2));
        // defines range for y-position in which collision is detected
        let y_condition = ((collider_1_y + collider_1_height) > collider_2_y) && (collider_1_y < (collider_2_y + collider_2_height)) ;
        return (x_condition && y_condition);
    }

    function checkChickenCollision() {
        timeSinceLastCollision = new Date().getTime() - timeOfCollision;
        if (timeSinceLastCollision > DURATION_WOUNDED_STATE) {    // wounded state lasts 1000ms (>> prevents jumping and triggers wounded-animation)
            isWounded = false;
        }
        for (let i = 0; i < chickens.length; i++) {
            let chicken = chickens[i];
            let chickenWidth = canvas.width * chicken.scale_x; 
            let chicken_x = chicken.position_x + bg_elements;  // calculates absolute position of chicken by taking background-movement into account
            characterWidth = character_image.width * 0.35 - 60;

            // Character energy reduced if he collides with enemy AND enough time has passed since last collision
            if (timeSinceLastCollision > DURATION_WOUNDED_STATE && checkCollisionCondition( character_x, characterWidth, chicken_x, chickenWidth, character_y, characterHeight, chicken.position_y, 50)) {        
                timeOfCollision = new Date().getTime();
                reduceCharacterEnergy();
                isWounded = true;
                AUDIO_PAIN.play();
            }
        }
    }

    function reduceCharacterEnergy() {
        character_energy -= COLLISION_ENERGY_LOSS;  // reduce energy when hit by enemy
        
        if (character_energy <= 0) {
            //alert('Game over!');    // game over if character energy
            isDead = true;
            characterDefeatedAt = new Date().getTime();
            AUDIO_RUNNING.pause(); // pauses running audio when game over
            AUDIO_LOST.play();
        }
    }

    function checkBottleCollision() {
        // check collision to pick-up bottle
        for (let i = 0; i < placedBottles.length; i++) {
           let bottleWidth = (canvas.width * 0.125); 
           let bottle_x = placedBottles[i] + bg_elements;  
   
           if (checkCollisionCondition(bottle_x, bottleWidth, character_x, (characterWidth -75), character_y, characterHeight, bottle_y, 100 )) { 
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
            'speed':        (Math.random() * 10) // generates random speed between 1 and 10 px
        }
    }

   function createChickenList(){
        let gallinitaPath = './img/3.Secuencias_Enemy_básico/Versión_Gallinita/';
        let pollitoPath = './img/3.Secuencias_Enemy_básico/Versión_pollito/';
    
        chickens = [
            createChicken(pollitoPath, 1.8 * canvas.width), 
            createChicken(gallinitaPath, 2* canvas.width ),
            createChicken(gallinitaPath, 2.8 * canvas.width), 
            createChicken(pollitoPath, 3.3 * canvas.width), 
            createChicken(gallinitaPath, 4.5* canvas.width ),
            createChicken(pollitoPath, 5.6 * canvas.width),   
            createChicken(pollitoPath, 5 * canvas.width), 
            createChicken(gallinitaPath, 6.5* canvas.width ),
            createChicken(pollitoPath, 8 * canvas.width)
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
    function calculateDrawingDetails() {
        checkCharacterMovement();
        calculateCloudOffset();
        calculateChickenPosition();
        calculateBottleThrow();
    }

    function checkCharacterMovement() {  
        setInterval(function() {
            timePassedSinceJump = new Date().getTime() - lastJumpStarted;
            checkIfSleeping();
            animateCharacter();
            characterGraphicIndex++;
        }, 50);
    }

    function checkIfSleeping() {
        currentTime = new Date().getTime();
            if ((currentTime - timeSinceLastKeydown) > 5000) {
                isSleeping = true;
            } else {
                isSleeping = false;
            }
    }

    function animateCharacter() {
        let isJumping = (timePassedSinceJump < JUMP_TIME * 2) && !isWounded;
        // Check conditions for character-movements and animate if true
        animateRunningCharacter();
        animateJumpingCharacter(isJumping);
        animateStandingCharacter(isJumping);
        animateSleepingCharacter(isJumping);
        animateWoundedCharacter();
        animateDeadCharacter();
        if (!isMovingLeft && !isMovingRight || isJumping) {
            AUDIO_RUNNING.pause(); // pauses running audio when standing or jumping
        }
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
                saveKeydownTime(k, e); 
                preventJumping(e); 
                initiateBottleThrow(k);     
            }); 
            checkKeyup(); 
    }

    function saveKeydownTime(k, e) {
        // save time of last keydown to detect inactivity
        if (k || e.code) {
            timeSinceLastKeydown = new Date().getTime();        
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

    function preventJumping(e) {
        // prevent double-jumping or jumping when character is wounded
        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2 && !isWounded) { 
            lastJumpStarted = new Date().getTime();
        } 
    }

    function initiateBottleThrow(k) {
        if (k == 'd' && collectedBottles > 0) {
            let timePassed = new Date().getTime() - bottleThrowTime;

            if (timePassed > 1000) {
                AUDIO_THROW.play();
                collectedBottles -= COLLISION_BOTTLE_FILL; 
                bottleThrowTime = new Date().getTime();
            }
        }
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

 