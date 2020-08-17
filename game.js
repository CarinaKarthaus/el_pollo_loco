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
 let currentTime = new Date().getTime();
 let timeSinceLastKeydown = 0;
 let timeSinceLastCollision = 4000;
 let timeOfCollision = 0;
 let bossDefeatedAt = 0;
 let characterDefeatedAt = 0;
 let timeSinceLastBottleCollision = 1000;
 let timeOfBottleCollision; 
 let gameFinished = false;
 let gameStarted = false;
 let bossAttack = false;
 let bossTurning = false;
 let updateIntervals = []; // array of interval-functions that are carried out
 let isJumping = false;


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
 let BOSS_POSITION_Y = 130;
 let BOSS_WIDTH = 350;
 let BOSS_HEIGHT = 400;
 let COLLISION_ENERGY_LOSS = 20;
 let COLLISION_BOTTLE_FILL = 20;
 let DURATION_WOUNDED_STATE = 800;

 AUDIO_BACKGROUND_MUSIC.loop = true;
 AUDIO_BACKGROUND_MUSIC.volume = 0.5;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    preloadImages();
    draw();
 }
 function startGame() {
    gameStarted = true;
    AUDIO_BACKGROUND_MUSIC.play();
    runGameLogic();
 }

 function runGameLogic() {
    createChickenList();
    calculateDrawingDetails();
    listenForKeys();
    checkForCollision();
    document.getElementById('restart-btn').classList.remove('d-none'); // makes restart btn visible
    document.getElementById('start-btn').classList.add('d-none'); // hides start-btn 
 }

 /**
  * Check for collisions
  */

    function checkForCollision() {
        let updateCollisionInterval = setInterval(function(){
            checkChickenCollision();
            checkBottleCollision();
            checkBossBottleCollision();
            checkBossCollision();
        }, 50);

        updateIntervals.push(updateCollisionInterval);
    }

    function checkBossBottleCollision() {
        timeSinceLastBottleCollision = new Date().getTime() - timeOfBottleCollision;
        if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) {
            bossIsWounded = false;
        }
        let collisionTrue = checkCollisionCondition(thrownBottleX, 80, BOSS_POSITION_X + bg_elements, BOSS_WIDTH, thrownBottleY, 65, BOSS_POSITION_Y, BOSS_HEIGHT); 
        if (collisionTrue && !bossIsWounded) {
            timeOfBottleCollision = new Date().getTime();
            AUDIO_BREAKING_BOTTLE.play();
            reduceBossEnergy();
        }
    } 
    function checkBossCollision() {
        // Character energy reduced if he collides with enemy AND enough time has passed since last collision
        if (checkCollisionCondition( character_x, characterWidth - 60, BOSS_POSITION_X + bg_elements, BOSS_WIDTH -100, character_y, characterHeight, BOSS_POSITION_Y, BOSS_HEIGHT)) {        
            reduceCharacterEnergy();
            bossAttack = true;
            AUDIO_PAIN.play();
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
        AUDIO_BACKGROUND_MUSIC.pause();
        setTimeout(function() {
            AUDIO_WIN.play();
        }, 1500);
        gameFinished = true;
        gameStarted = false;

        refreshIntervals(); 
    }

    function refreshIntervals() {
        // Clears intervals for collision detection etc. to stop them when game is finished/over
        updateIntervals.forEach((interval) => {
            clearInterval(interval)
        });
        updateIntervals = [];
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
        if (timeSinceLastCollision > DURATION_WOUNDED_STATE) {    // wounded state prevents from jumping and triggers wounded-animation
            isWounded = false;
        }
        for (let i = 0; i < chickens.length; i++) {
            let collisionTrue = verifyChickenCollision(i);
            verifyChickenDeath(i, collisionTrue);
            let chickenDeath = chickens[i].isHurt;
            verifyCharacterWounded(chickenDeath, collisionTrue);
        }
    }

    function verifyCharacterWounded(chickenDeath, collisionTrue) {
        // Character energy reduced if he collides with enemy AND enough time has passed since last collision
        if (!chickenDeath && (timeSinceLastCollision > DURATION_WOUNDED_STATE) && collisionTrue) {         
            timeOfCollision = new Date().getTime();
            reduceCharacterEnergy();
            isWounded = true;
            AUDIO_PAIN.play();
        }  
    }

    function verifyChickenCollision(i) {
        let chicken = chickens[i];
        let chickenWidth = canvas.width * chicken.scale_x; 
        let chicken_x = chicken.position_x + bg_elements;  // calculates absolute position of chicken by taking background-movement into account
        characterWidth = character_image.width * 0.35 - 60;

        let collisionTrue = checkCollisionCondition(character_x, characterWidth, chicken_x, chickenWidth, character_y, characterHeight, chicken.position_y, 80);
        return collisionTrue;
    }

    function verifyChickenDeath(i, collisionTrue) {
        // Chicken killed if character jumps on it
        if (isJumping && collisionTrue) {
            chickens[i].isHurt = true;
            chickens[i].position_y = 440;
        }
        return 
    }

    function reduceCharacterEnergy() {
        character_energy -= COLLISION_ENERGY_LOSS;  // reduce energy when hit by enemy
        if (bossAttack) {       
            character_energy == 0;  // immediate death when character collides with boss
        }        
        if (character_energy <= 0) {
            isDead = true;
            characterDefeatedAt = new Date().getTime();
            AUDIO_BACKGROUND_MUSIC.pause();
            AUDIO_RUNNING.pause(); // pauses running audio when game over
            AUDIO_LOST.play();
            refreshIntervals();
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
            'scale_x':      0.09,
            'scale_y':      0.2,
            'speed':        (Math.random() * 10), // generates random speed between 1 and 10 px
            'isHurt':       false   
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
            createChicken(pollitoPath, 5.6 * canvas.width),   
            createChicken(pollitoPath, 5 * canvas.width), 
            createChicken(gallinitaPath, 6.5* canvas.width ),
            createChicken(pollitoPath, 8 * canvas.width)
        ]
    }

    function calculateChickenPosition() {
        let updateChickenInterval = setInterval( function() {
            for (let i=0; i < chickens.length; i++) {
                let chicken = chickens[i];
                chicken.position_x -= chicken.speed; 
            }
        }, 50);

        updateIntervals.push(updateChickenInterval);
    }

    function calculateBossPosition() {
        let updateBossInterval = setInterval( function() {
            if (boss_energy == 100)  {      // if boss enery is intact, he is moving around his initial spot
                calculatePatrollingBoss();
            } 
            else if (boss_energy < 100) {   // if boss_energy is reduced, he will attack
                BOSS_POSITION_X -= 10;
            }
        }, 100);
        updateIntervals.push(updateBossInterval);
    }

    function calculatePatrollingBoss() {
        if (BOSS_POSITION_X > (6800) && !bossTurning) {
            BOSS_POSITION_X -= 5;
        } if (BOSS_POSITION_X <= (6800)) {
            bossTurning = true;
        } if (BOSS_POSITION_X <= 7000 && bossTurning) {
            BOSS_POSITION_X += 5;  
        } if (BOSS_POSITION_X >= (7000)) {
            bossTurning = false;
        }   
    }

 /**
  * Create and calculate character 
  */
    function calculateDrawingDetails() {
        checkCharacterMovement();
        calculateCloudOffset();
        calculateChickenPosition();
        calculateBottleThrow();
        calculateBossPosition();
    }

    function checkCharacterMovement() {  
        let updateCharacterInterval = setInterval(function() {
            timePassedSinceJump = new Date().getTime() - lastJumpStarted;
            checkIfSleeping();
            animateCharacter();
            characterGraphicIndex++;
        }, 50);

        updateIntervals.push(updateCharacterInterval);
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
        isJumping = (timePassedSinceJump < JUMP_TIME * 2) && !isWounded;
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

 