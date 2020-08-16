// Script to handle calculation and drawing of animations

let fondImg = ['1.png', '2.png'];
let currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
let characterGraphicsMoving = ['W-21.png', 'W-22.png','W-23.png', 'W-24.png','W-25.png', 'W-26.png'];
let characterGraphicsStanding = ['I-1.png','I-1.png','I-1.png','I-2.png','I-2.png','I-2.png','I-3.png','I-3.png','I-3.png','I-4.png','I-4.png','I-4.png','I-5.png','I-5.png','I-5.png','I-6.png','I-6.png','I-6.png','I-7.png','I-7.png','I-7.png','I-8.png','I-8.png','I-8.png','I-9.png','I-9.png','I-9.png','I-10.png','I-10.png','I-10.png'];
let characterGraphicsJumping = ['J-31.png','J-31.png','J-32.png','J-32.png','J-33.png','J-33.png','J-34.png','J-34.png','J-35.png','J-35.png','J-36.png','J-36.png','J-37.png','J-37.png','J-38.png','J-38.png','J-39.png','J-39.png'];
let characterGraphicsSleeping = ['I-11.png','I-11.png','I-11.png','I-12.png','I-12.png','I-12.png','I-13.png','I-13.png','I-13.png','I-14.png','I-14.png','I-14.png','I-15.png','I-15.png','I-15.png','I-16.png','I-16.png','I-16.png','I-17.png','I-17.png','I-17.png','I-18.png','I-18.png','I-18.png','I-19.png','I-19.png','I-19.png', 'I-20.png', 'I-20.png', 'I-20.png'];
let characterGraphicsWounded = ['H-41.png', 'H-41.png', 'H-41.png', 'H-42.png', 'H-42.png', 'H-42.png', 'H-43.png', 'H-43.png', 'H-43.png'];
let characterGraphicsDead = ['D-51.png','D-51.png','D-51.png','D-52.png','D-52.png','D-52.png','D-53.png','D-53.png','D-53.png','D-54.png','D-54.png','D-54.png','D-55.png','D-55.png','D-55.png','D-56.png','D-56.png', 'D-56.png','D-57.png','D-57.png','D-57.png'];
let characterGraphicIndex = 0;
let cloudOffset = 0;
let chickenGraphics = ['1.Paso_derecho.png','1.Paso_derecho.png','1.Paso_derecho.png', '2.Centro.png', '2.Centro.png', '2.Centro.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png' ];
let currentChickenIndex = 0;
let bottleGraphicsStatic = ['1.Marcador.png', '2.Botella_enterrada1.png', '2.Botella_enterrada2.png'];
let bottleGraphicsRotating = ['botella_rotación1.png','botella_rotación1.png', 'botella_rotación2.png', 'botella_rotación2.png', 'botella_rotación3.png', 'botella_rotación3.png', 'botella_rotación4.png', 'botella_rotación4.png'];
let bossGraphicsWalking = ['G1.png', 'G1.png', 'G1.png', 'G2.png','G2.png','G2.png', 'G3.png', 'G3.png', 'G3.png', 'G4.png', 'G4.png', 'G4.png' ];
let bossGraphicsAngry = ['G5.png','G5.png','G5.png', 'G6.png', 'G6.png', 'G6.png', 'G7.png', 'G7.png', 'G7.png', 'G8.png', 'G8.png', 'G8.png', 'G9.png', 'G9.png', 'G9.png', 'G10.png', 'G10.png', 'G10.png', 'G11.png','G11.png','G11.png', 'G12.png', 'G12.png', 'G12.png' ];
let bossGraphicsAttacking = ['G13.png','G13.png','G13.png', 'G14.png', 'G14.png', 'G14.png', 'G15.png', 'G15.png', 'G15.png', 'G16.png', 'G16.png', 'G16.png', 'G17.png', 'G17.png', 'G17.png', 'G18.png', 'G18.png', 'G18.png', 'G19.png','G19.png','G19.png', 'G20.png', 'G20.png', 'G20.png'];
let bossGraphicsWounded = ['G21.png', 'G21.png', 'G21.png','G22.png', 'G22.png', 'G22.png','G23.png', 'G23.png', 'G23.png'];
let bossGraphicsDead = ['G24.png','G24.png','G24.png','G25.png','G25.png','G25.png','G26.png','G26.png','G26.png'];
let currentBossIndex = 0;
let bossImgPath;
let allImgArrays = [characterGraphicsMoving, characterGraphicsStanding, characterGraphicsJumping, characterGraphicsSleeping, characterGraphicsWounded, characterGraphicsDead, chickenGraphics, chickenGraphics, bossGraphicsWalking, bossGraphicsAngry, bossGraphicsAttacking, bossGraphicsWounded, bossGraphicsDead];
let allImgArraysPaths = ['./img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/', './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/', './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/', './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/LONG_IDLE/', './img/2.Secuencias_Personaje-Pepe-corrección/4.Herido/' ,'./img/2.Secuencias_Personaje-Pepe-corrección/5.Muerte/' ,'./img/3.Secuencias_Enemy_básico/Versión_Gallinita/', './img/3.Secuencias_Enemy_básico/Versión_pollito/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/2.Ateción-ataque/1.Alerta/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/2.Ateción-ataque/2.Ataque/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/3.Herida/', './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/4.Muerte/' ];
let bottle_base_image = new Image();

let images = []; // check if this array is needed

function draw() {
    setInterval(function() {
        drawBackground();
        updateCharacter();
        drawFinalBoss();
        if (gameFinished || isDead) {
            drawFinalScreens();
        }
         else if (gameStarted) {
            drawSideElements();
        }
    }, 50);
   //requestAnimationFrame(draw);
}

function drawSideElements() {
    drawBars();
    drawChicken();
    drawBottles();
    drawBottleThrow();
}

/**
 * Draw final screens for win or defeat
 */

function drawFinalScreens() {
    if (gameFinished) {
        drawWinScreen();
    } else if (isDead) {
        drawDefeatScreen();
    } 
}

function drawWinScreen() {
    prepareNotification();
    ctx.fillText('Congrats!', canvas.width/2, 200);
    ctx.fillText(' You won!', canvas.width/2, 300 );
}

function drawDefeatScreen() {
    prepareNotification();
    ctx.fillText('Oh nooo!', canvas.width/2, 200);
    ctx.fillText(' You lost!', canvas.width/2, 300 );
}
function prepareNotification() {
    ctx.font = '90px Bradley Hand ITC';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
}

/**
 * Image cache
 */

    function preloadImages(){
        for (let j = 0; j < allImgArrays.length; j++ ) {
            let currentArray = allImgArrays[j];
        
            for (let k=0; k < currentArray.length; k++) {
                let image = new Image();
                image.src = allImgArraysPaths[j] + currentArray[k];
                // console.log('Preload image', allImgArraysPaths[j] + currentArray[k]);
                images.push(image.src); // push image-path to images-array (which contains all image-paths)
            }
        }
    } 

/**
 * Draw bottle and energy bars
 */

    function drawBars() {
        drawCharacterEnergyBar();
        drawBossEnergyBar();  
        drawBottleBar();
    }

    function drawCharacterEnergyBar() {
        // draws energy bar for main character
        let energyBarPath = './img/7.Marcadores/Barra/Marcador vida/azul/' + character_energy + '_.png';
        if (character_energy <=0) {
            energyBarPath = './img/7.Marcadores/Barra/Marcador vida/azul/0_.png';
        }
        addBackgroundObject( energyBarPath, 730 - bg_elements, 100, 0.3, 0.15, 0,6); 
     }

     function drawBossEnergyBar() {
        // draws energy bar for final boss enemy
        let energyBarPathBoss = './img/7.Marcadores/Barra/Marcador vida/naranja/' + boss_energy + '_.png';
        if (boss_energy <=0) {
            energyBarPathBoss = './img/7.Marcadores/Barra/Marcador vida/naranja/0_.png';
        }
        addBackgroundObject( energyBarPathBoss, BOSS_POSITION_X + 50, 150, 0.2, 0.10, 0,6);
     }

     function drawBottleBar() {
         let bottleBarPath;
        if (collectedBottles <= 100) {
            bottleBarPath = './img/7.Marcadores/Barra/Marcador_botella/Azul/' + collectedBottles + '_.png';
        } else {
            bottleBarPath = './img/7.Marcadores/Barra/Marcador_botella/Azul/100_.png';
        }
        addBackgroundObject( bottleBarPath, 25 - bg_elements, 100, 0.3, 0.15, 0,6);
     }


/**
 * Draw & animate enemies
 */

    function drawFinalBoss() {
        let index;
        changeBossAnimations(index);
        addBackgroundObject(bossImgPath, BOSS_POSITION_X, boss_y, 0.4 , 0.9);
        currentBossIndex++;            
    }

    function changeBossAnimations(index){
        // Change boss-graphics depending on energy-level
        animateWalkingBoss(index);
        animateAttackingBoss(index);
        animateWoundedBoss(index);
        animateBossDefeat(index);
    }
    
    function animateWalkingBoss(index) {
        if (boss_energy == 100) {
            index = currentBossIndex % bossGraphicsWalking.length;
            bossImgPath = './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/' + bossGraphicsWalking[index];
        } 
    }
    function animateWoundedBoss(index) {
        if (bossIsWounded) {
            index = currentBossIndex % bossGraphicsWounded.length;
            bossImgPath = './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/3.Herida/' + bossGraphicsWounded[index];
        } 
    }
    function animateAttackingBoss(index) {
        if (boss_energy == 80) {
            index = currentBossIndex % bossGraphicsAngry.length;
            bossImgPath = './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/2.Ateción-ataque/1.Alerta/' + bossGraphicsAngry[index];
        } else if (boss_energy <= 80 && boss_energy > 0) {
            index = currentBossIndex % bossGraphicsAttacking.length;
            bossImgPath = './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/2.Ateción-ataque/2.Ataque/' + bossGraphicsAttacking[index];
        }
    }
    function animateBossDefeat(index) {
        if (bossDefeatedAt > 0) {
            let timePassed = new Date().getTime() - bossDefeatedAt;
            BOSS_POSITION_X += timePassed / 20;
            boss_y -= timePassed / 10;
            index = currentBossIndex % bossGraphicsDead.length;
            bossImgPath = './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/4.Muerte/' + bossGraphicsDead[index];
        }
    }

    function drawChicken() {
        for (let k = 0; k < chickens.length; k++) {
            let index = currentChickenIndex % chickenGraphics.length;
            let chicken = chickens[k];
            addBackgroundObject(chicken.img_path + chickenGraphics[index], chicken.position_x, chicken.position_y, chicken.scale_x ,chicken.scale_y);
            currentChickenIndex++;
        }   
    }

/** 
 * Draw and animate background
 */

    function drawBackground(){ 
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGround();
    }

    function drawGround() {
        if (!isDead) {
            calculateBgMovement();
        }
        drawFond();
    }

    function drawFond() {
        // creates background automatically 
        let currentFondIndex = 0;
        for (let i=-1; i < LEVEL_LENGTH; i++) {
            let index = currentFondIndex % fondImg.length;
            addBackgroundObject('./img/5.Fondo/Capas/5.cielo_1920-1080px.png', i * canvas.width, 0, 1, 1.2);
            addBackgroundObject('./img/5.Fondo/Capas/3.Fondo3/' + fondImg[index], i * canvas.width, 0, 1, 1.2, 0.8);
            addBackgroundObject('./img/5.Fondo/Capas/2.Fondo2/' + fondImg[index], i * canvas.width, 0, 1, 1.2);
            addBackgroundObject('./img/5.Fondo/Capas/1.suelo-fondo1/' + fondImg[index], i * canvas.width, 0, 1, 1.2);
            addBackgroundObject('./img/5.Fondo/Capas/4.nubes/' + fondImg[index], i * canvas.width - cloudOffset, 75, 1, 0.8, 1);
            currentFondIndex++;
        }
    }

    function calculateBgMovement() {
        if (isMovingRight) {
            bg_elements -= GAME_SPEED;
        } else if (isMovingLeft && bg_elements < 800) {
            bg_elements += GAME_SPEED;
        }
    }

    function addBackgroundObject(src, offsetX, offsetY, scaleX, scaleY, opacity){
        if (opacity) {
            ctx.globalAlpha = opacity;
        }    
	
        let base_image = new Image();
            base_image.src = src;
            if (base_image.complete) {
                ctx.drawImage(base_image, offsetX + bg_elements, -100 + offsetY, (canvas.width +1) * scaleX , canvas.height * scaleY);
            };
            ctx.globalAlpha = 1;
    }


        /*  Test version: preloading addBackgroundObjectImages
        function addBackgroundObject(src, offsetX, offsetY, scaleX, scaleY, opacity){
        if (opacity) {
            ctx.globalAlpha = opacity;
        }
        let base_image = images.find(function(img) {
            return img.src == src;
        });

        if (!base_image) {
            base_image = new Image();
            base_image.src = src;
        }
        if (base_image.complete) {
            ctx.drawImage(base_image, offsetX + bg_elements, -100 + offsetY, (canvas.width +1) * scaleX , canvas.height * scaleY);
        };
        ctx.globalAlpha = 1;
    }
    */


    function calculateCloudOffset(){
        setInterval(function() {
            cloudOffset += 1;
       }, 100);
    }


/**
 * Draw and animate character movements
 */

    function updateCharacter(){
        checkImageCache(); // check if character images are preloaded in cache 
        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        calculateJumpingSequence(timePassedSinceJump);
        
        if (character_image.complete) {
            drawCharacter();
        }
    }

    /**
     * Checks image cache for character-images
     */
    function checkImageCache() {
        // Load from cache
        character_image = images.find(function(img) {
            return img.src == currentCharacterImg;
        });

        if(!character_image) { // Image is not in cache, load from hdd
            character_image = new Image();
            character_image.src = currentCharacterImg ;
        }
    }

    function drawCharacter() {
        characterHeight = character_image.height *  0.35;
        characterWidth = character_image.width * 0.35;
        if (isMovingLeft) {
           flipCharacterImage();
        };
        ctx.drawImage(character_image, character_x, character_y, characterWidth, characterHeight);
        ctx.restore();    
    }
    function flipCharacterImage() {
         // flip character img horizontally when moving left
         ctx.save();
         ctx.translate(character_image.width -60, 0);
         ctx.scale(-1,1);
    }

    function animateRunningCharacter(){
        // Change graphics and sound for running character
        if (isMovingRight || isMovingLeft) {
            AUDIO_RUNNING.play(); // plays audio when moving
            let index = characterGraphicIndex % characterGraphicsMoving.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/' + characterGraphicsMoving[index];
        }
    } 
    function animateJumpingCharacter(isJumping) {
        // Change graphics for jumping character
        if (isJumping) { // Pepe is jumping
            let index = characterGraphicIndex % characterGraphicsJumping.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/' + characterGraphicsJumping[index];
        }
    }
    function animateStandingCharacter(isJumping) {
        // Change graphics for standing character
        if (!isMovingLeft && !isMovingRight && !isJumping) {
            let index = characterGraphicIndex % characterGraphicsStanding.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/' + characterGraphicsStanding[index];
        }    
    }

    function animateSleepingCharacter(isJumping) {
        //changes graphics for sleeping character (after inactivity)
        if (isSleeping && !isMovingLeft && !isMovingRight && !isJumping) {
            let index = characterGraphicIndex % characterGraphicsSleeping.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/LONG_IDLE/' + characterGraphicsSleeping[index];
        }
    }

    function animateWoundedCharacter() {
        // Change graphics for wounded character
        if (isWounded) {
            let index = characterGraphicIndex % characterGraphicsWounded.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/4.Herido/' + characterGraphicsWounded[index];
        }    
    }

    function animateDeadCharacter() {
        // changes graphics when character dies
        if (isDead) {
            let timePassed = new Date().getTime() - characterDefeatedAt;
            character_x -= timePassed / 20;
            let index = characterGraphicIndex % characterGraphicsDead.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/5.Muerte/' + characterGraphicsDead[index];
        }
    }

/**
 * Draw bottles & bottle throw
 */

    function drawBottles() {
        for (let i = 0; i < placedBottles.length; i++) {
            let index = i % bottleGraphicsStatic.length;
            let bottleImg = './img/6.botella/' + bottleGraphicsStatic[index];
            let bottle_x = placedBottles[i]; 
            addBackgroundObject(bottleImg, bottle_x, bottle_y, 0.125, 0.225);
        }
    }
    function calculateBottleThrow(){
        let i = 0;
        setInterval(function(){
           if (bottleThrowTime) {
                animateBottleThrow(i);           
                i++;
           }
        }, 50);
    }  

     function animateBottleThrow(i) {
        let timePassed = new Date().getTime() - bottleThrowTime;
        let gravity = Math.pow(9.81, timePassed / 300);
        thrownBottleX = character_x + 60 + timePassed * 0.9;
        thrownBottleY = 260 - (timePassed * 0.55 - gravity);
        
        let index = i % bottleGraphicsRotating.length;
        bottle_base_image.src = './img/6.botella/Rotación/' + bottleGraphicsRotating[index];    // changes bottle-img to animate rotation
    }
    
     function drawBottleThrow() { 
        ctx.drawImage(bottle_base_image, thrownBottleX, thrownBottleY, bottle_base_image.width * 0.3, bottle_base_image.height *  0.25);
     }

  