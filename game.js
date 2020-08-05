 let canvas;
 let ctx;
 let character_image;  
 let character_x = 150;
 let character_y = 25;
 let character_energy = 100;
 let isMovingRight = false;
 let isMovingLeft = false;
 let bg_elements = 0;
 let timePassedSinceJump = 0; 
 let lastJumpStarted = 0;
 let fondImg = ['1.png', '2.png'];
 let currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
 let characterGraphicsMoving = ['W-21.png', 'W-22.png','W-23.png', 'W-24.png','W-25.png', 'W-26.png'];
 let characterGraphicsStanding = ['I-1.png','I-1.png','I-1.png','I-2.png','I-2.png','I-2.png','I-3.png','I-3.png','I-3.png','I-4.png','I-4.png','I-4.png','I-5.png','I-5.png','I-5.png','I-6.png','I-6.png','I-6.png','I-7.png','I-7.png','I-7.png','I-8.png','I-8.png','I-8.png','I-9.png','I-9.png','I-9.png','I-10.png','I-10.png','I-10.png'];
 let characterGraphicsJumping = ['J-31.png','J-31.png','J-32.png','J-32.png','J-33.png','J-33.png','J-34.png','J-34.png','J-35.png','J-35.png','J-36.png','J-36.png','J-37.png','J-37.png','J-38.png','J-38.png','J-39.png','J-39.png'];
 let characterGraphicIndex = 0;
 let cloudOffset = 0;
 let chickenGraphics = ['1.Paso_derecho.png', '2.Centro.png', '3.Paso_izquierdo.png'];
 let allImgArrays = [characterGraphicsMoving, characterGraphicsStanding, characterGraphicsJumping, chickenGraphics, chickenGraphics];
 let allImgArraysPaths = ['./img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/', './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/', './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/', './img/3.Secuencias_Enemy_básico/Versión_Gallinita/', './img/3.Secuencias_Enemy_básico/Versión_pollito/' ];
 let chickens = [];
// let healthBarImg = ['0_.png','20_.png','40_.png','60_.png','80_.png','100_.png'];
// let healthIndex = 0;
 
 let images = []; // check if this array is needed



 // ----------- Game config
 let JUMP_TIME = 400; // in ms
 let GAME_SPEED = 12;
 let AUDIO_RUNNING = new Audio ('./audio/running.mp3');
 let AUDIO_JUMP = new Audio ('./audio/jump.mp3');
 let COLLISION_ENERGY_LOSS = 20;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    preloadImages();
    createChickenList();
    checkForRunning();
    calculateCloudOffset();
    draw();
    listenForKeys();
    calculateChickenPosition();
    checkForCollision();
 }

 function checkForCollision() {
     setInterval(function(){
        for (let i = 0; i < chickens.length; i++) {
             let chicken = chickens[i];
             let chickenWidth = canvas.width * chicken.scale_x - 10; 
             let chicken_x = bg_elements + chicken.position_x;  // calculates absolute position of chicken by taking background-movement into account
             let characterHeight = character_image.height * 0.35;

             if ((chicken_x - chickenWidth) < character_x && (chicken_x + chickenWidth) > character_x) { // defines range for x-position in which collision is detected
                    if ((character_y + characterHeight) > chicken.position_y) {
                    character_energy -= COLLISION_ENERGY_LOSS;
                } 
            } 
            if (character_energy <= 0) {
                alert('Game over!');
            }
        }
     },50);
 }

 function calculateChickenPosition() {
     setInterval( function() {
        for (let i=0; i < chickens.length; i++) {
            let chicken = chickens[i];
            chicken.position_x -= chicken.speed; 
         }
     }, 100);
 }


 function createChickenList(){
    let gallinitaPath = './img/3.Secuencias_Enemy_básico/Versión_Gallinita/';
    let pollitoPath = './img/3.Secuencias_Enemy_básico/Versión_pollito/';
  
    chickens = [
        createChicken(gallinitaPath, 2* canvas.width ),
        createChicken(pollitoPath, 1.8 * canvas.width), 
        createChicken(pollitoPath, 3 * canvas.width), 
        createChicken(gallinitaPath, 4.2 * canvas.width)
    ]
 }
 

function preloadImages(){
   /*
    for (let i = 0; i < preloadImages.arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preloadImages.arguments[i];
    } */

    for (let j = 0; j < allImgArrays.length; j++ ) {
        let currentArray = allImgArrays[j];
    
        for (let k=0; k < currentArray.length; k++) {
            let image = new Image();
            image.src = allImgArraysPaths[j] + currentArray[k];
            images.push(image.src); // push image-path to images-array (which contains all image-paths)
        }
    }
} 

 function calculateCloudOffset(){
     setInterval(function() {
         cloudOffset += 1;
    }, 100);
 }

 function checkForRunning() {  
    let interval = setInterval(function() {
        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        let isJumping = timePassedSinceJump < JUMP_TIME * 2;

        // Change graphic for running character
        if (isMovingRight || isMovingLeft) {
            AUDIO_RUNNING.play(); // plays audio when moving
            let index = characterGraphicIndex % characterGraphicsMoving.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/' + characterGraphicsMoving[index];

        } 
        // Change graphics for jumping character
        if (isJumping) { // Pepe is jumping
            let index = characterGraphicIndex % characterGraphicsJumping.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/' + characterGraphicsJumping[index];

        }
        // Change graphics for standing character
        else if (!isMovingLeft && !isMovingRight && !isJumping) {
            let index = characterGraphicIndex % characterGraphicsStanding.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/' + characterGraphicsStanding[index];

            //clearInterval(interval); // stops current interval
            //checkForRunning(100); // calls function with prolonged interval-time to slow down animation of standing character
        }
        if (!isMovingLeft && !isMovingRight || isJumping) {
            AUDIO_RUNNING.pause(); // pauses running audio when standing or jumping
        }
        characterGraphicIndex++;
     }, 50);
  }

 function draw() {
     setInterval(function() {
        drawBackground();
        updateCharacter();
        drawChicken();
        drawEnergyBar();
     }, 30);

    //requestAnimationFrame(draw);
 }

 function drawEnergyBar() {
     let energyBarPath = './img/7.Marcadores/Barra/Marcador vida/azul/' + character_energy + '_.png';
     addBackgroundObject( energyBarPath, 730 - bg_elements, 80, 0.3, 0.15, 0,6);

 }

 function drawChicken() {
    for (let k = 0; k < chickens.length; k++) {
        let chicken = chickens[k];
        addBackgroundObject(chicken.img_path + chickenGraphics[k], chicken.position_x, chicken.position_y, chicken.scale_x ,chicken.scale_y);
    }
    
}
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
    if (isMovingRight) {
        bg_elements -= GAME_SPEED;
    } else if (isMovingLeft) {
        bg_elements += GAME_SPEED;
    }
    // creates background automatically 
    let currentFondIndex = 0;
     for (let i=0; i < 10; i++) {
        let index = currentFondIndex % fondImg.length;
        addBackgroundObject('./img/5.Fondo/Capas/5.cielo_1920-1080px.png', i * canvas.width, 0, 1, 1.2);
        addBackgroundObject('./img/5.Fondo/Capas/3.Fondo3/' + fondImg[index], i * canvas.width, 0, 1, 1.2, 0.8);
        addBackgroundObject('./img/5.Fondo/Capas/2.Fondo2/' + fondImg[index], i * canvas.width, 0, 1, 1.2);
        addBackgroundObject('./img/5.Fondo/Capas/1.suelo-fondo1/' + fondImg[index], i * canvas.width, 0, 1, 1.2);
        addBackgroundObject('./img/5.Fondo/Capas/4.nubes/' + fondImg[index], i * canvas.width - cloudOffset, 75, 1, 0.8, 1);
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
        if (e.code == 'Space') {
            characterGraphicIndex = 0;
            AUDIO_JUMP.play();
        }

        // prevent double-jumping
        timePassedSinceJump = new Date().getTime() - lastJumpStarted;
        if (e.code == 'Space' && timePassedSinceJump > JUMP_TIME * 2) { 
            lastJumpStarted = new Date().getTime();
        } 
     }); 
     
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