/**
 * Main file to draw and animate character movements
 */
let character_image;  
let characterHeight;
let characterWidth;
let character_x = 150;
let character_y = 25;
let character_energy = 100;
let currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/I-1.png';
let characterGraphicsMoving = ['W-21.png', 'W-22.png','W-23.png', 'W-24.png','W-25.png', 'W-26.png'];
let characterGraphicsStanding = ['I-1.png','I-1.png','I-1.png','I-2.png','I-2.png','I-2.png','I-3.png','I-3.png','I-3.png','I-4.png','I-4.png','I-4.png','I-5.png','I-5.png','I-5.png','I-6.png','I-6.png','I-6.png','I-7.png','I-7.png','I-7.png','I-8.png','I-8.png','I-8.png','I-9.png','I-9.png','I-9.png','I-10.png','I-10.png','I-10.png'];
let characterGraphicsJumping = ['J-31.png','J-31.png','J-32.png','J-32.png','J-33.png','J-33.png','J-34.png','J-34.png','J-35.png','J-35.png','J-36.png','J-36.png','J-37.png','J-37.png','J-38.png','J-38.png','J-39.png','J-39.png'];
let characterGraphicsSleeping = ['I-11.png','I-11.png','I-11.png','I-12.png','I-12.png','I-12.png','I-13.png','I-13.png','I-13.png','I-14.png','I-14.png','I-14.png','I-15.png','I-15.png','I-15.png','I-16.png','I-16.png','I-16.png','I-17.png','I-17.png','I-17.png','I-18.png','I-18.png','I-18.png','I-19.png','I-19.png','I-19.png', 'I-20.png', 'I-20.png', 'I-20.png'];
let characterGraphicsWounded = ['H-41.png', 'H-41.png', 'H-41.png', 'H-42.png', 'H-42.png', 'H-42.png', 'H-43.png', 'H-43.png', 'H-43.png'];
let characterGraphicsDead = ['D-51.png','D-51.png','D-51.png','D-52.png','D-52.png','D-52.png','D-53.png','D-53.png','D-53.png','D-54.png','D-54.png','D-54.png','D-55.png','D-55.png','D-55.png','D-56.png','D-56.png', 'D-56.png','D-57.png','D-57.png','D-57.png'];
let characterGraphicIndex = 0;


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
        return img.src.endsWith(currentCharacterImg.substring(currentCharacterImg.length-10, currentCharacterImg.length));
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