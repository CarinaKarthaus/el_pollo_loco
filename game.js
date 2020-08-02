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
 let currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
 let characterGraphicsMoving = ['W-21.png', 'W-22.png','W-23.png', 'W-24.png','W-25.png', 'W-26.png'];
 let characterGraphicsStanding = ['I-1.png','I-2.png','I-3.png','I-4.png','I-5.png','I-6.png','I-7.png','I-8.png','I-9.png','I-10.png'];
 let characterGraphicsJumping = ['J-31.png','J-32.png','J-33.png','J-34.png','J-35.png','J-36.png','J-37.png','J-38.png','J-39.png','J-40.png'];
 let characterGraphicIndex = 0;



 // ----------- Game config
 let JUMP_TIME = 400; // in ms
 let GAME_SPEED = 15;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setInterval(function(){
        checkForRunning();
        draw();
    }, 50);

    listenForKeys();
 }

 function checkForRunning() {
     setInterval(function() {
          // Change graphic for running character
        if (isMovingRight || isMovingLeft) {
            if (characterGraphicIndex < 5) (characterGraphicIndex++);
            else (characterGraphicIndex = 0);
            currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/' + characterGraphicsMoving[characterGraphicIndex];
            
        } else if (isJumping) {
            if (characterGraphicIndex < 10) (characterGraphicIndex++);
            else (characterGraphicIndex = 0);
            currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/' + characterGraphicsJumping[characterGraphicIndex];
        }
        
        
        else if (!isMovingLeft && !isMovingRight && !isJumping) {
            if (characterGraphicIndex < 9) (characterGraphicIndex++);
            else (characterGraphicIndex = 0);
            currentCharacterImg = 'img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/' + characterGraphicsStanding[characterGraphicIndex];
        }
     }, 100)
 }

 function draw() {
    requestAnimationFrame(drawBackground);
    requestAnimationFrame(updateCharacter);
   // requestAnimationFrame(draw);
   // requestAnimationFrame(updateCharacter);

 }

function updateCharacter(){
    character_image = new Image();
    character_image.src = currentCharacterImg ;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;

    
    if (timePassedSinceJump < JUMP_TIME) {
        character_y -= GAME_SPEED * 2;
    } else {
        // check falling

        if (character_y < 25){
            character_y += GAME_SPEED * 2;
        }
    }
    if (character_image.complete) {
        if (isMovingLeft) {
            // flip character img horizontally when moving left
            ctx.save();
            ctx.translate(character_image.width, 0);
            ctx.scale(-1,1);
        };

        ctx.drawImage(character_image, character_x, character_y, character_image.width * 0.35, character_image.height *  0.35);
        ctx.restore();    

    };

}

 function drawBackground(){
   
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();
 }

 function drawGround() {
    /* ctx.fillStyle = '#FFE699';
    ctx.fillRect(0, 375, canvas.width, canvas.height - 375); */

    if (isMovingRight) {
        bg_elements -= GAME_SPEED;
    } else if (isMovingLeft) {
        bg_elements += GAME_SPEED;
    }

    addBackgroundObject('img/5.Fondo/Capas/5.cielo_1920-1080px.png', - canvas.width +50, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/3.Fondo3/1.png', - canvas.width, 1.2, 0.8);
    addBackgroundObject('img/5.Fondo/Capas/2.Fondo2/1.png', - canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/1.png', - canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/4.nubes/2.png', - canvas.width, 1);

    addBackgroundObject('img/5.Fondo/Capas/5.cielo_1920-1080px.png', 0 +50, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/3.Fondo3/2.png', 0, 1.2, 0.8);
    addBackgroundObject('img/5.Fondo/Capas/2.Fondo2/2.png', 0, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/2.png', 0, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/4.nubes/2.png', 0, 1);

    addBackgroundObject('img/5.Fondo/Capas/5.cielo_1920-1080px.png', canvas.width +50, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/3.Fondo3/1.png', canvas.width, 1.2, 0.8);
    addBackgroundObject('img/5.Fondo/Capas/2.Fondo2/1.png', canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/1.png', canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/4.nubes/1.png', canvas.width, 1);

    addBackgroundObject('img/5.Fondo/Capas/5.cielo_1920-1080px.png', 2 * canvas.width +1, 1.2);  
    addBackgroundObject('img/5.Fondo/Capas/3.Fondo3/2.png', 2 * canvas.width, 1.2, 0.8);   
    addBackgroundObject('img/5.Fondo/Capas/2.Fondo2/2.png', 2 * canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/2.png', 2 * canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/4.nubes/2.png', 2 * canvas.width, 1);
   
   

 }

 function addBackgroundObject(src, offsetX, scale, opacity){
     if (opacity) {
         ctx.globalAlpha = opacity;
     }
    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, offsetX + bg_elements, -100, canvas.width , canvas.height * scale);
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
        if (e.code == 'Space' && timePassedSinceJump < JUMP_TIME *2) (isJumping = true);
        else if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) (isJumping = false);
       
     });
     
 }