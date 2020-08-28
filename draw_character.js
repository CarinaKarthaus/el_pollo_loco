/**
 * Main file to draw and animate character movements
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
        requestAnimationFrame(drawCharacter);
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