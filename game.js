 let canvas;
 let ctx;
 let character_image;  
 let characterHeight;
 let characterWidth;
 let character_x = 150;
 let character_y = 25;
 let character_energy = 100;
 let collectedBottles = 80;
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
 let chickenGraphics = ['1.Paso_derecho.png','1.Paso_derecho.png','1.Paso_derecho.png', '2.Centro.png', '2.Centro.png', '2.Centro.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png', '3.Paso_izquierdo.png' ];
 let currentChickenIndex = 0;
 let allImgArrays = [characterGraphicsMoving, characterGraphicsStanding, characterGraphicsJumping, chickenGraphics, chickenGraphics];
 let allImgArraysPaths = ['./img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/', './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/', './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/', './img/3.Secuencias_Enemy_básico/Versión_Gallinita/', './img/3.Secuencias_Enemy_básico/Versión_pollito/' ];
 let chickens = [];
 let placedBottles = [1560, 3070, 4500, 6800, 508, 7400];
 let bottle_y = 430;
 let bottleGraphicsStatic = ['1.Marcador.png', '2.Botella_enterrada1.png', '2.Botella_enterrada2.png'];
 let bottleGraphicsRotating = ['botella_rotación1.png','botella_rotación1.png', 'botella_rotación2.png', 'botella_rotación2.png', 'botella_rotación3.png', 'botella_rotación3.png', 'botella_rotación4.png', 'botella_rotación4.png'];
 let bottleThrowTime = 0;
 let thrownBottleX = 0;
 let thrownBottleY = 0;
 let boss_energy = 100;
 let boss_x = 1000;
 let boss_y = 130;
 let bottle_base_image = new Image();

 
 let images = []; // check if this array is needed



 // ----------- Game config
 let JUMP_TIME = 500; // in ms
 let GAME_SPEED = 11;
 let AUDIO_RUNNING = new Audio ('./audio/running.mp3');
 let AUDIO_JUMP = new Audio ('./audio/jump.mp3');
 let AUDIO_BOTTLE = new Audio ('./audio/bottle.mp3');
 let COLLISION_ENERGY_LOSS = 20;
 let COLLISION_BOTTLE_FILL = 20;

 function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    preloadImages();
    createChickenList();
    checkForRunning();
    calculateCloudOffset();
    calculateChickenPosition();
    calculateBottleThrow();
    draw();
    listenForKeys();
    checkForCollision();
 }

 function checkForCollision() {
     setInterval(function(){
        checkChickenCollision();
        checkBottleCollision();
        checkBossCollision();
     }, 50);
 }

 function checkBossCollision() {
     if ( checkCollisionCondition(thrownBottleX, 30, boss_x, 300, thrownBottleY, 50, boss_y)) {
        if (boss_energy > 0) {
            boss_energy -= COLLISION_ENERGY_LOSS;
            console.log('boss_energy: ' + boss_energy)    
        } else {
            console.log('Congrats, you won!');
        }
    }
} 

function checkCollisionCondition(collider_1_x, collider_1_width, collider_2_x, collider_2_width, collider_2_y, collider_2_height, collider_1_y) {
    collider_1_x += bg_elements; // add movement of background
     // defines range for x-position in which collision is detected
    let x_condition = ((collider_1_x - collider_1_width/2) < (collider_2_x + collider_2_width/2) && (collider_1_x + collider_1_width/2) > (collider_2_x + collider_2_width/2));
    // defines range for y-position in which collision is detected
    let y_condition = ((collider_2_y + collider_2_height) > collider_1_y) ;
    return (x_condition && y_condition);
}

function checkChickenCollision() {
    for (let i = 0; i < chickens.length; i++) {
        let chicken = chickens[i];
        let chickenWidth = canvas.width * chicken.scale_x - 20; 
        let chicken_x = chicken.position_x;  // calculates absolute position of chicken by taking background-movement into account
        characterWidth = character_image.width * 0.35 - 125;
        
        if (checkCollisionCondition(chicken_x, chickenWidth, character_x, characterWidth, character_y, characterHeight, chicken.position_y)) {             
            character_energy -= COLLISION_ENERGY_LOSS;  // reduce energy when hit by enemy

            if (character_energy <= 0) {
                alert('Game over!');    // game over if character energy
                AUDIO_RUNNING.pause(); // pauses running audio when game over
            }
        }
    }
}

 function checkBottleCollision() {
     // check collision to pick-up bottle
     for (let i = 0; i < placedBottles.length; i++) {
        let bottleWidth = (canvas.width * 0.125); 
        let bottle_x = placedBottles[i];  

        if (checkCollisionCondition(bottle_x, bottleWidth, character_x, characterWidth, character_y, characterHeight, bottle_y)) { 
            placedBottles.splice(i, 1);  // removes bottle from canvas when picked up
            AUDIO_BOTTLE.play();
            collectedBottles += COLLISION_BOTTLE_FILL;
    }; 
   };
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
        createChicken(gallinitaPath, 4.5* canvas.width ),
        createChicken(pollitoPath, 3.3 * canvas.width), 
        createChicken(pollitoPath, 5.6 * canvas.width)
    ]
 }
 

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

 function calculateCloudOffset(){
     setInterval(function() {
         cloudOffset += 1;
    }, 100);
 }

 function calculateBottleThrow(){
    setInterval(function(){
       if (bottleThrowTime) {
           let timePassed = new Date().getTime() - bottleThrowTime;
           let gravity = Math.pow(9.81, timePassed / 300);
           thrownBottleX = character_x + 60 + timePassed * 0.9;
           thrownBottleY = 260 - (timePassed * 0.55 - gravity);

           let i = 0;
           let index = i % bottleGraphicsRotating.length;
           bottle_base_image.src = './img/6.botella/Rotación/' + bottleGraphicsRotating[index];
           i++;
       }
    }, 50);
}

 function checkForRunning() {  
    setInterval(function() {
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

 function drawBottleThrow() { 
    ctx.drawImage(bottle_base_image, thrownBottleX, thrownBottleY, bottle_base_image.width * 0.3, bottle_base_image.height *  0.25);
 }

 function drawBottleBar() {
    let bottleBarPath = './img/7.Marcadores/Barra/Marcador_botella/Azul/' + collectedBottles + '_.png';
    addBackgroundObject( bottleBarPath, 25 - bg_elements, 100, 0.3, 0.15, 0,6);

}
 function drawBottles() {
     for (let i = 0; i < placedBottles.length; i++) {
         let index = i % bottleGraphicsStatic.length;
         let bottleImg = './img/6.botella/' + bottleGraphicsStatic[index];
         let bottle_x = placedBottles[i]; 
         addBackgroundObject(bottleImg, bottle_x, bottle_y, 0.125, 0.225);
     }
 }

 function drawEnergyBar() {
     let energyBarPath = './img/7.Marcadores/Barra/Marcador vida/azul/' + character_energy + '_.png';
     addBackgroundObject( energyBarPath, 730 - bg_elements, 100, 0.3, 0.15, 0,6); 
     
     let energyBarPathBoss = './img/7.Marcadores/Barra/Marcador vida/naranja/' + boss_energy + '_.png';
     addBackgroundObject( energyBarPathBoss, 1050, 150, 0.2, 0.10, 0,6);

 }

 function drawChicken() {
    for (let k = 0; k < chickens.length; k++) {
        let index = currentChickenIndex % chickenGraphics.length;
        let chicken = chickens[k];
        addBackgroundObject(chicken.img_path + chickenGraphics[index], chicken.position_x, chicken.position_y, chicken.scale_x ,chicken.scale_y);
        currentChickenIndex++;
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

    // Load from cache
    // Javasript find in array, filter Array, Sort Array
    character_image = images.find(function(img) {
        return img.src == currentCharacterImg;
    });

    if(!character_image) { // Image is not in cache, load from hdd
        character_image = new Image();
        character_image.src = currentCharacterImg ;
    }

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
        drawCharacter();
    }
}

function drawCharacter() {
    characterHeight = character_image.height *  0.35;
    characterWidth = character_image.width * 0.35;
    if (isMovingLeft) {
        // flip character img horizontally when moving left
        ctx.save();
        ctx.translate(character_image.width -60, 0);
        ctx.scale(-1,1);
    };
    ctx.drawImage(character_image, character_x, character_y, characterWidth, characterHeight);
    ctx.restore();    
}

 function drawBackground(){ 
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGround();
 }

 function drawGround() {
    if (isMovingRight) {
        bg_elements -= GAME_SPEED;
    } else if (isMovingLeft && bg_elements < 800) {
        bg_elements += GAME_SPEED;
    }
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

        if (k == 'd' && collectedBottles > 0) {
            let timePassed = new Date().getTime() - bottleThrowTime;
            if (timePassed > 1000) {
                collectedBottles -= COLLISION_BOTTLE_FILL; 
                bottleThrowTime = new Date().getTime();
            }}
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