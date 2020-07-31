 let canvas;
 let ctx;
 let character_x = 150;
 let character_y = 25;
 let isMovingRight = false;
 let isMovingLeft = false;
 let bg_elements = 0;
 let lastJumpStarted = 0;



 // ----------- Game config
 let JUMP_TIME = 300; // in ms
 let GAME_SPEED = 0.5;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    setInterval(function(){
        draw();
        }, 200);

    listenForKeys();
 }

 function draw() {
    drawBackground();
    updateCharacter();
    requestAnimationFrame(draw);

 }

function updateCharacter(){
    let base_image = new Image();
    base_image.src = 'img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png' ;

    let timePassedSinceJump = new Date().getTime() - lastJumpStarted;

    
    if (timePassedSinceJump < JUMP_TIME) {
        character_y -= 1;
    } else {
        // check falling

        if (character_y < 25){
            character_y += 1;
        }
    }
    if (base_image.complete) {
        ctx.drawImage(base_image, character_x, character_y, base_image.width * 0.35, base_image.height *  0.35);
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

    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/1.png', - canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/2.png', 0, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/1.png', canvas.width, 1.2);
    addBackgroundObject('img/5.Fondo/Capas/1.suelo-fondo1/2.png', 2 * canvas.width, 1.2);
   

 }

 function addBackgroundObject(src, offset, scale){
    let base_image = new Image();
    base_image.src = src;
    if (base_image.complete) {
        ctx.drawImage(base_image, offset + bg_elements, -100, canvas.width , canvas.height * scale);
    };
 }

 function listenForKeys() {
     document.addEventListener("keydown", e => {
        const k = e.key;
        if (k == 'ArrowRight') {
            isMovingRight = true;
           // character_x += 5;
        };
        if (k == 'ArrowLeft') {
            isMovingLeft = true;
           // character_x -= 5;
        };
        
        // prevent double-jumping
        let timePassedSinceJump = new Date().getTime() - lastJumpStarted;
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
       
     });
     
 }