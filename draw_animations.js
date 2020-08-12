// Script to handle calculation and drawing of animations

let fondImg = ['1.png', '2.png'];
let currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
let characterGraphicsMoving = ['W-21.png', 'W-22.png','W-23.png', 'W-24.png','W-25.png', 'W-26.png'];
let characterGraphicsStanding = ['I-1.png','I-1.png','I-1.png','I-2.png','I-2.png','I-2.png','I-3.png','I-3.png','I-3.png','I-4.png','I-4.png','I-4.png','I-5.png','I-5.png','I-5.png','I-6.png','I-6.png','I-6.png','I-7.png','I-7.png','I-7.png','I-8.png','I-8.png','I-8.png','I-9.png','I-9.png','I-9.png','I-10.png','I-10.png','I-10.png'];
let characterGraphicsJumping = ['J-31.png','J-31.png','J-32.png','J-32.png','J-33.png','J-33.png','J-34.png','J-34.png','J-35.png','J-35.png','J-36.png','J-36.png','J-37.png','J-37.png','J-38.png','J-38.png','J-39.png','J-39.png'];
let characterGraphicIndex = 0;
let cloudOffset = 0;
let chickenGraphics = ['1.Paso_derecho.png','1.Paso_derecho.png','1.Paso_derecho.png', '2.Centro.png', '2.Centro.png', '2.Centro.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png' ];
let currentChickenIndex = 0;
let bottleGraphicsStatic = ['1.Marcador.png', '2.Botella_enterrada1.png', '2.Botella_enterrada2.png'];
let bottleGraphicsRotating = ['botella_rotación1.png','botella_rotación1.png', 'botella_rotación2.png', 'botella_rotación2.png', 'botella_rotación3.png', 'botella_rotación3.png', 'botella_rotación4.png', 'botella_rotación4.png'];
let allImgArrays = [characterGraphicsMoving, characterGraphicsStanding, characterGraphicsJumping, chickenGraphics, chickenGraphics];
let allImgArraysPaths = ['./img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/', './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/', './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/', './img/3.Secuencias_Enemy_básico/Versión_Gallinita/', './img/3.Secuencias_Enemy_básico/Versión_pollito/' ];
let bottle_base_image = new Image();

let images = []; // check if this array is needed

function draw() {
    setInterval(function() {
       drawBackground();
       drawEnergyBar();
       drawBottleBar();
       updateCharacter();
       drawChicken();
       drawBottles();
       drawBottleThrow();
       drawFinalBoss();
    }, 30);

   //requestAnimationFrame(draw);
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

    function drawEnergyBar() {
        // draws energy bar for main character
        let energyBarPath = './img/7.Marcadores/Barra/Marcador vida/azul/' + character_energy + '_.png';
        addBackgroundObject( energyBarPath, 730 - bg_elements, 100, 0.3, 0.15, 0,6); 
        
        // draws energy bar for final boss enemy
        let energyBarPathBoss = './img/7.Marcadores/Barra/Marcador vida/naranja/' + boss_energy + '_.png';
        addBackgroundObject( energyBarPathBoss, 1050, 150, 0.2, 0.10, 0,6);
    }

    function drawBottleBar() {
        let bottleBarPath = './img/7.Marcadores/Barra/Marcador_botella/Azul/' + collectedBottles + '_.png';
        addBackgroundObject( bottleBarPath, 25 - bg_elements, 100, 0.3, 0.15, 0,6);
     }


/**
 * Draw & animate enemies
 */

    function drawFinalBoss() {
        let k = 0;
        while(k < 4) {
            let index = (k+1) % 5;
            let bossImgPathWalking = './img/4.Secuencias_Enemy_gigantón-Doña_Gallinota-/1.Caminata/G';
            addBackgroundObject(bossImgPathWalking + index + '.png', boss_x, boss_y, 0.4 , 0.9);
            k++;
            // if (k == 4) {
            //      k = 0;
            // }
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
        calculateBgMovement();
        drawFond();
    }

    function drawFond() {
        // creates background automatically 
        let currentFondIndex = 0;
        for (let i=-1; i < 10; i++) {
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

  