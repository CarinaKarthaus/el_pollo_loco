 let canvas;
 let ctx;
 let character_image;  
 let character_x = 150;
 let character_y = 25;
 let isMovingRight = false;
 let isMovingLeft = false;
 let isJumping = false;
 let bg_elements = 0;
 let timePassedSinceJump; 
 let lastJumpStarted = 0;
 let fondImg = ['1.png', '2.png'];
 let currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
 let characterGraphicsMoving = ['W-21.png', 'W-22.png','W-23.png', 'W-24.png','W-25.png', 'W-26.png'];
 let characterGraphicsStanding = ['I-1.png','I-1.png','I-1.png','I-1.png','I-2.png','I-2.png','I-2.png','I-2.png','I-3.png','I-3.png','I-3.png','I-3.png','I-4.png','I-4.png','I-4.png','I-4.png','I-5.png','I-5.png','I-5.png','I-5.png','I-6.png','I-6.png','I-6.png','I-6.png','I-7.png','I-7.png','I-7.png','I-7.png','I-8.png','I-8.png','I-8.png','I-8.png','I-9.png','I-9.png','I-9.png','I-9.png','I-10.png','I-10.png','I-10.png','I-10.png'];
 let characterGraphicsJumping = ['J-31.png','J-32.png','J-33.png','J-34.png','J-35.png','J-36.png','J-37.png','J-38.png','J-39.png','J-40.png'];
 let characterGraphicIndex = 0;
 let cloudOffset = 0;

 let chickenGraphics = ['1.Paso_derecho.png', '2.Centro.png', '3.Paso_izquierdo.png'];



 // ----------- Game config
 let JUMP_TIME = 400; // in ms
 let GAME_SPEED = 10;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    checkForRunning();
    calculateCloudOffset();
    draw();
   

    listenForKeys();
 }

 function calculateCloudOffset(){
     setInterval(function() {
         cloudOffset += 1;
    }, 100);
 }

 function checkForRunning() {
     setInterval(function() {
        // Change graphic for running character
        if (isMovingRight || isMovingLeft) {
            let index = characterGraphicIndex % characterGraphicsMoving.length;
            currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/' + characterGraphicsMoving[index];
        // Change graphics for jumping character
        } else if (isJumping) {
            let index = characterGraphicIndex % characterGraphicsJumping.length;
            currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/' + characterGraphicsJumping[index];
        }
        // Change graphics for standing character
        else if (!isMovingLeft && !isMovingRight && !isJumping) {
            let index = characterGraphicIndex % characterGraphicsStanding.length;
            currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/' + characterGraphicsStanding[index];
        }
        characterGraphicIndex++;
     }, 50)
 }

 function draw() {
     setInterval(function() {
        drawBackground();
        updateCharacter();
        drawChicken();
     }, 30);

    //requestAnimationFrame(draw);
 }
 function drawChicken() {
    let gallinitaPath = 'img/3.Secuencias_Enemy_básico/Versión_Gallinita/';
    let pollitoPath = 'img/3.Secuencias_Enemy_básico/Versión_pollito/';
  
    let chickens = [
        createChicken(gallinitaPath, 2* canvas.width ),
        createChicken(pollitoPath, 1.5 * canvas.width), 
        createChicken(pollitoPath, 3 * canvas.width)
    ]
    let currentChickenIndex = 0;
    for (k = 0; k < chickens.length; k++) {
        let chicken = chickens[k];
        let index = currentChickenIndex % chickenGraphics.length;
        addBackgroundObject(chicken.img_path + chickenGraphics[index], chicken.position_x, chicken.position_y, chicken.scale_x ,chicken.scale_y);
        currentChickenIndex++;
    }
    
}
function createChicken(imgPath, position_x) {
   // if (type == 'gallinita') (imgPath = gallinitaPath);
   // if (type == 'pollito') (imgPath = pollitoPath);
    return {
        'img_path':     imgPath,
        'position_x':   position_x,
        'position_y':   430,
        'scale_x':      0.1,
        'scale_y':      0.2
    }
}

function updateCharacter(){
    character_image = new Image();
    character_image.src = currentCharacterImg ;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
    
    if (timePassedSinceJump < JUMP_TIME) {
        character_y -= GAME_SPEED * 1.5;
    } else {
        // check falling

        if (character_y < 25){
            character_y += GAME_SPEED * 1.5;
        }
    }
    if (character_image.complete) {
        if (isMovingLeft) {
            // flip character img horizontally when moving left
            ctx.save();
            ctx.translate(character_image.width -60, 0);
            ctx.scale(-1,1);
        };

        ctx.drawImage(character_image, character_x, character_y, Math.floor(character_image.width * 0.35), Math.floor(character_image.height *  0.35));
        ctx.restore();    
    };
}

 function drawBackground(){ 
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();
 }

 function drawGround() {
    if (isMovingRight) {
        bg_elements -= GAME_SPEED;
    } else if (isMovingLeft) {
        bg_elements += GAME_SPEED;
    }
    // creates background automatically 
    let currentFondIndex = 0;
     for (let i=0; i < 10; i++) {
        let index = currentFondIndex % fondImg.length;
        addBackgroundObject('img/5.Fondo/Capas/5.cielo_1920-1080px.png', i * canvas.width, 0, 1, 1.2);
        addBackgroundObject('img/5.Fondo/Capas/3.Fondo3/' + fondImg[index], i * canvas.width, 0, 1, 1.2, 0.8);
        addBackgroundObject('img/5.Fondo/Capas/2.Fondo2/' + fondImg[index], i * canvas.width, 0, 1, 1.2);
        addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/' + fondImg[index], i * canvas.width, 0, 1, 1.2);
        addBackgroundObject('img/5.Fondo/Capas/4.nubes/' + fondImg[index], i * canvas.width - cloudOffset, 0, 1, 1, 1);
        currentFondIndex++;
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

 function listenForKeys() {
     document.addEventListener("keydown", e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            isMovingRight = true;
        };
        if (k == 'ArrowLeft') {
            isMovingLeft = true;
        };

        if (e.code == 'Space' && timePassedSinceJump < JUMP_TIME *2) (isJumping = true);

        // prevent double-jumping
        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2){
            lastJumpStarted = new Date().getTime();
        } 
     }); 
     
     document.addEventListener("keyup", e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            isMovingRight = false;
           // character_x += 5;
        };
        if (k == 'ArrowLeft') {
            isMovingLeft = false;
           // character_x -= 5;
        };

        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) (isJumping = false);
       
     });
     
 }