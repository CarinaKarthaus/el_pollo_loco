/**
  * Check for collisions
  */

    /**
     * Overall-function to initiate collision-checks
     */
    function checkForCollision() {
        let updateCollisionInterval = setInterval(function(){   
            checkChickenCollision();
            checkBottleCollision();
            checkBossBottleCollision();
            checkBossCollision();
        }, 30);
        updateIntervals.push(updateCollisionInterval);  // push interval-variable to array to enable clearing of interval if game ends
    }

    /**
     * General function to check if collision has happened according to x- & y-coordinates
     */
    function checkCollisionCondition(collider_1_x, collider_1_width, collider_2_x, collider_2_width, collider_1_y, collider_1_height, collider_2_y, collider_2_height) {
        // defines range for x-position in which collision is detected
        let x_condition = ((collider_1_x - collider_1_width/2) < (collider_2_x + collider_2_width/2) && (collider_1_x + collider_1_width/2) > (collider_2_x - collider_2_width/2));
        // defines range for y-position in which collision is detected
        let y_condition = ((collider_1_y + collider_1_height) > collider_2_y) && (collider_1_y < (collider_2_y + collider_2_height)) ;
        return (x_condition && y_condition);
    }

    /**
     * Check if boss is hit by bottle; trigger hurt-animation if true
     */
    function checkBossBottleCollision() {
        timeSinceLastBottleCollision = new Date().getTime() - timeOfBottleCollision;
        if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) {    // boss is immune if still in wounded state
            bossIsWounded = false;
        }
        let collisionTrue = checkCollisionCondition(thrownBottleX, 80, BOSS_POSITION_X + bg_elements, BOSS_WIDTH, thrownBottleY, 65, BOSS_POSITION_Y, BOSS_HEIGHT); 
        if (collisionTrue && !bossIsWounded) {
            hurtBossAnimation();
        }
    } 

    function hurtBossAnimation(){
        timeOfBottleCollision = new Date().getTime();
        AUDIO_BREAKING_BOTTLE.play();
        reduceBossEnergy();
        AUDIO_CHICKEN.play();
    }

    /**
     * Check if character collides with boss; immediate death, if true
     */
    function checkBossCollision() {
        if (checkCollisionCondition( character_x, characterWidth - 60, BOSS_POSITION_X + bg_elements, BOSS_WIDTH -100, character_y, characterHeight, BOSS_POSITION_Y, BOSS_HEIGHT)) {        
            reduceCharacterEnergy();
            bossAttack = true;
            AUDIO_PAIN.play();
        }
    }
    
    /**
     * Reduce boss energy and trigger wounded- or levelFinish-animation
     */
    function reduceBossEnergy() {
        if (boss_energy > 0) {
            boss_energy -= COLLISION_ENERGY_LOSS;
            bossIsWounded = true;
        } 
        // Trigger levelFinish-Animation if boss energy <= 0
        if (boss_energy <= 0 && bossDefeatedAt == 0) {
            bossDefeatedAt = new Date().getTime();
            finishLevel();
        }
    }

    function checkChickenCollision() {
        timeSinceLastCollision = new Date().getTime() - timeOfCollision;
        if (timeSinceLastCollision > DURATION_WOUNDED_STATE) {    // wounded state prevents from jumping and triggers wounded-animation
            isWounded = false;
        }
        executeCollisionConsequence();
    }

    /**
     * Check and execute collision consequence (either death of chicken or wound of character) depending on applicable condition
     */
    function executeCollisionConsequence() {
        for (let i = 0; i < chickens.length; i++) {
            let collisionTrue = verifyChickenCollision(i);
            verifyChickenDeath(i, collisionTrue);
            let chickenDeath = chickens[i].isHurt;
            verifyCharacterWounded(chickenDeath, collisionTrue);
        }
    }

    /**
     * Character energy reduced if he collides with enemy AND enough time has passed since last collision
     */
    function verifyCharacterWounded(chickenDeath, collisionTrue) {
        if (!chickenDeath && (timeSinceLastCollision > DURATION_WOUNDED_STATE) && collisionTrue) {         
            timeOfCollision = new Date().getTime();
            reduceCharacterEnergy();
            isWounded = true;
            AUDIO_PAIN.play();
        }  
    }

    /**
     * Check if character and chicken have collided
     */
    function verifyChickenCollision(i) {
        let chicken = chickens[i];
        let chickenWidth = canvas.width * chicken.scale_x; 
        let chicken_x = chicken.position_x + bg_elements;  // calculates absolute position of chicken by taking background-movement into account
        characterWidth = character_image.width * 0.35 - 60;

        let collisionTrue = checkCollisionCondition(character_x, characterWidth, chicken_x, chickenWidth, character_y, characterHeight, chicken.position_y, 80);
        return collisionTrue;
    }

    /**
     * Chicken killed if character jumps on it
     */
    function verifyChickenDeath(i, collisionTrue) {
        if (isJumping && collisionTrue) {
            AUDIO_CHICKEN_SQUASHED.play();
            chickens[i].isHurt = true;
            chickens[i].position_y = 440;
        }
    }

    function reduceCharacterEnergy() {
        character_energy -= COLLISION_ENERGY_LOSS;  // reduce energy when hit by enemy
        if (bossAttack) {       
            character_energy == 0;  // immediate death when character collides with boss
        }        
        if (character_energy <= 0) {
            gameOver();
        }
    }

    /**
     * Check if character has touched bottle to pick it up 
     */
    function checkBottleCollision() {
        for (let i = 0; i < placedBottles.length; i++) {
        let bottleWidth = (canvas.width * 0.125); 
        let bottle_x = placedBottles[i] + bg_elements;  

        if (checkCollisionCondition(bottle_x, bottleWidth, character_x, (characterWidth -75), character_y, characterHeight, bottle_y, 100 )) { 
            pickBottle(i);
        }; 
    };
    }

    /**
     * Trigger sounds, remove bottle from visible canvas and add it to bottle-bar
     */
    function pickBottle(i) {
        placedBottles[i] = -2000; // moves bottle outside of visible canvas when picked
        AUDIO_BOTTLE.play();
        collectedBottles += COLLISION_BOTTLE_FILL;
    }
