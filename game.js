 // Main script to handle basic game configurations and functions

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    preloadImages();
    draw();
 }
 
 /**
  * Start game by activating full game logic, arranging UI etc. when start-btn clicked
  */
 function startGame() {
    gameStarted = true;
    AUDIO_BACKGROUND_MUSIC.play();
    runGameLogic();
    arrangeUI();
 }

 /**
  * Activate full game logic (collision checks, animation of enemies, key-listener etc.)
  */
 function runGameLogic() {
    createChickenList();
    calculateDrawingDetails();
    listenForKeys();
    checkForCollision();
    moveOnMobile();
 }

 /** 
  * Arrange btns and remove overlays & instructions when game started
  */
 function arrangeUI() {
    arrangeBtns();
    document.getElementById('heading').classList.add('h1-mobile'); //adapts for mobile-view
    document.getElementById('overlay').classList.add('d-none'); // removes overlay
    document.getElementById('instructions').classList.add('d-none');    // removes command-instructions
    document.getElementById('mobile-instructions').classList.add('d-none');
 }

 function arrangeBtns() {
    document.getElementById('restart-btn').classList.remove('d-none'); // makes restart btn visible
    document.getElementById('start-btn').classList.add('d-none'); // hides start-btn 
    document.getElementById('restart-btn').classList.add('restart-btn-mobile'); //adapts btn for mobile-view
    document.getElementById('btn-box').classList.add('btn-box-mobile'); //adapts for mobile-view
    document.getElementById('fullscreen-btn').classList.remove('d-none'); // makes fullscreen-btn visible
 }

function openFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) { /* Firefox */
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { /* IE/Edge */
        canvas.msRequestFullscreen();
    }
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
            createChicken(gallinitaPath, 5 * canvas.width),             
            createChicken(pollitoPath, 0.8 * canvas.width), 
            createChicken(gallinitaPath, 1* canvas.width ),
            createChicken(gallinitaPath, 2.3 * canvas.width), 
            createChicken(pollitoPath, 3.0 * canvas.width), 
            createChicken(gallinitaPath, 4.2 * canvas.width),   
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
        }, 30);
        updateIntervals.push(updateChickenInterval);
    }

    function calculateBossPosition() {
        let updateBossInterval = setInterval( function() {
            adaptBossMovements();
            currentBossIndex++; 
        }, 30);
        updateIntervals.push(updateBossInterval);
    }

    /**
     * Adapt boss movements according to energy level
     */
    function adaptBossMovements() {
        if (boss_energy == 100)  {      // if boss enery is intact, he is moving around his initial spot
            calculatePatrollingBoss();
        } else if (boss_energy < 100) {   // if boss_energy is reduced, he will attack
            BOSS_POSITION_X -= 20;
        } else if (boss_energy < 60) {   // if boss_energy is reduced, he will attack
            BOSS_POSITION_X -= 25;
        }
    }

    /**
     * Calculate boss-position when patrolling back and forth
     */
    function calculatePatrollingBoss() {
        bossPatrollingForward();
        bossPatrollingBackward();
    }

    function bossPatrollingForward() {
        if (BOSS_POSITION_X > (6800) && !bossTurning) {
            BOSS_POSITION_X -= 5;
        } if (BOSS_POSITION_X <= (6800)) {
            bossTurning = true;
        }
    }

    function bossPatrollingBackward() {
        if (BOSS_POSITION_X <= 7000 && bossTurning) {
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
        changeBossAnimations();
        calculateBossPosition();
    }

    function checkCharacterMovement() {  
        let updateCharacterInterval = setInterval(function() {
            timePassedSinceJump = new Date().getTime() - lastJumpStarted;
            checkIfSleeping();
            animateCharacter();
            characterGraphicIndex++;
        }, 30);

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

    /**
     * Check conditions for character-movements and animate if true
     */
    function animateCharacter() {
        isJumping = (timePassedSinceJump < JUMP_TIME * 2) && !isWounded;
        animateRunningCharacter();
        animateJumpingCharacter();
        animateStandingCharacter();
        animateSleepingCharacter();
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
        startupMobileListeners();
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
        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2 && !isWounded) {
            characterGraphicIndex = 0;
            AUDIO_JUMP.play();
        }
    }

    /**
     * Prevent double-jumping or jumping when character is wounded
     */
    function preventJumping(e) {
        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        let jumpingCondition = e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2 && !isWounded;
        if (jumpingCondition) { 
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
        AUDIO_BACKGROUND_MUSIC.pause();
        setTimeout(function() {
            AUDIO_WIN.play();
        }, 1200);
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
        setTimeout(refreshIntervals, 3000);
    }

    /**
     * Clears intervals for collision detection etc. to stop them when game is finished/over
     */
    function refreshIntervals() {
        updateIntervals.forEach((interval) => {
            clearInterval(interval)
        });
        updateIntervals = [];
    }
 