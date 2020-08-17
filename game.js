 // Main script to handle basic game configurations and functions
 
 let canvas;
 let ctx;
 let bg_elements = 0;
 let collectedBottles = 0;
 let placedBottles = [508, 1560, 2008, 3070, 4500, 5800, 6400];
 let bottle_y = 430;
 let bottleThrowTime = 0;
 let thrownBottleX = 0;
 let thrownBottleY = 0;

 let isMovingRight = false;
 let isMovingLeft = false;
 let isSleeping = false;
 let isWounded = false;
 let isDead = false;
 let isJumping = false;
 let timePassedSinceJump = 0; 
 let lastJumpStarted = 0;
 
 let chickens = [];
 let bossTurning = false;
 let bossIsWounded = false;
 let boss_energy = 100;
 
 let gameFinished = false;
 let gameStarted = false;
 let currentTime = new Date().getTime();
 let timeSinceLastKeydown = 0;
 let updateIntervals = []; // array of interval-functions that are carried out



 // ----------- Game config
 let LEVEL_LENGTH = 8; // indicates how often canvas-length is repeated (canvas-length = 1080px)
 let JUMP_TIME = 450; // in ms
 let GAME_SPEED = 16;
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
 let AUDIO_CHICKEN_SQUASHED = new Audio ('./audio/squash.mp3');
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
    // activate full game logic (collision checks, animation of enemies, key-listener etc.) when start-btn clicked
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
            createChicken(pollitoPath, 0.8 * canvas.width), 
            createChicken(gallinitaPath, 1* canvas.width ),
            createChicken(gallinitaPath, 2.3 * canvas.width), 
            createChicken(pollitoPath, 3.0 * canvas.width), 
            createChicken(pollitoPath, 4.2 * canvas.width),   
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
            } else if (boss_energy < 100) {   // if boss_energy is reduced, he will attack
                BOSS_POSITION_X -= 15;
            } else if (boss_energy < 60) {   // if boss_energy is reduced, he will attack
                BOSS_POSITION_X -= 20;
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

    /**
     * End of game functions
     */

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

    function gameOver() {
        isDead = true;
        characterDefeatedAt = new Date().getTime();
        AUDIO_BACKGROUND_MUSIC.pause();
        AUDIO_RUNNING.pause(); // pauses running audio when game over
        AUDIO_LOST.play();
        setTimeout(refreshIntervals, 2000);
    }

    function refreshIntervals() {
        // Clears intervals for collision detection etc. to stop them when game is finished/over
        updateIntervals.forEach((interval) => {
            clearInterval(interval)
        });
        updateIntervals = [];
    }
 