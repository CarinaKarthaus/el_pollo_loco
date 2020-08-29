/**
 * Main file to draw and animate character movements
 */
    /**
     * Updates current position and image on canvas
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
    /**
     * Draws character on canvas 
     */
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

    /**
     * Flip character img horizontally when moving left
     */
    function flipCharacterImage() {
        ctx.save();
        ctx.translate(character_image.width -60, 0);
        ctx.scale(-1,1);
    }
    /**
     * Change graphics and sound for running character
     */
    function animateRunningCharacter(){
        if (isMovingRight || isMovingLeft) {
            AUDIO_RUNNING.play(); // plays audio when moving
            let index = characterGraphicIndex % characterGraphicsMoving.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/2.Secuencia_caminata/' + characterGraphicsMoving[index];
        }
    } 

    /**
     * Change graphics for jumping character
     */
    function animateJumpingCharacter() {
        if (isJumping) { // Pepe is jumping
            let index = characterGraphicIndex % characterGraphicsJumping.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/3.Secuencia_salto/' + characterGraphicsJumping[index];
        }
    }

    /**
     * Change graphics for standing character
     */
    function animateStandingCharacter() {
        if (!isMovingLeft && !isMovingRight && !isJumping) {
            let index = characterGraphicIndex % characterGraphicsStanding.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/IDLE/' + characterGraphicsStanding[index];
        }    
    }

    /**
     * Changes graphics for sleeping character (after inactivity)
     */
    function animateSleepingCharacter() {
        if (isSleeping && !isMovingLeft && !isMovingRight && !isJumping) {
            let index = characterGraphicIndex % characterGraphicsSleeping.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/1.IDLE/LONG_IDLE/' + characterGraphicsSleeping[index];
        }
    }

    /**
     * Change graphics for wounded character
     */
    function animateWoundedCharacter() {
        if (isWounded) {
            let index = characterGraphicIndex % characterGraphicsWounded.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/4.Herido/' + characterGraphicsWounded[index];
        }    
    }
    /**
     * Changes graphics when character dies
     */
    function animateDeadCharacter() {
        if (isDead) {
            let timePassed = new Date().getTime() - characterDefeatedAt;
            character_x -= timePassed / 20;
            let index = characterGraphicIndex % characterGraphicsDead.length;
            currentCharacterImg = './img/2.Secuencias_Personaje-Pepe-corrección/5.Muerte/' + characterGraphicsDead[index];
        }
    }