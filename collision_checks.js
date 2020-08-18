/**
  * Check for collisions
  */

 function checkForCollision() {
    // overall-function to initiate collision-checks
    let updateCollisionInterval = setInterval(function(){   
        checkChickenCollision();
        checkBottleCollision();
        checkBossBottleCollision();
        checkBossCollision();
    }, 40);
    updateIntervals.push(updateCollisionInterval);  // push interval-variable to array to enable clearing of interval if game ends
}

function checkBossBottleCollision() {
    timeSinceLastBottleCollision = new Date().getTime() - timeOfBottleCollision;
    if (timeSinceLastBottleCollision > DURATION_WOUNDED_STATE) {
        bossIsWounded = false;
    }
    // Reduce boss energy if he's hit by bottle and not in wounded-state from previous bottle
    let collisionTrue = checkCollisionCondition(thrownBottleX, 80, BOSS_POSITION_X + bg_elements, BOSS_WIDTH, thrownBottleY, 65, BOSS_POSITION_Y, BOSS_HEIGHT); 
    if (collisionTrue && !bossIsWounded) {
        timeOfBottleCollision = new Date().getTime();
        AUDIO_BREAKING_BOTTLE.play();
        reduceBossEnergy();
        AUDIO_CHICKEN.play();
    }
} 
function checkBossCollision() {
    // Character energy reduced if he collides with enemy AND enough time has passed since last collision
    if (checkCollisionCondition( character_x, characterWidth - 60, BOSS_POSITION_X + bg_elements, BOSS_WIDTH -100, character_y, characterHeight, BOSS_POSITION_Y, BOSS_HEIGHT)) {        
        reduceCharacterEnergy();
        bossAttack = true;
        AUDIO_PAIN.play();
    }
}

function reduceBossEnergy() {
    // Reduce boss energy and trigger wounded-animation
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

function checkCollisionCondition(collider_1_x, collider_1_width, collider_2_x, collider_2_width, collider_1_y, collider_1_height, collider_2_y, collider_2_height) {
    // defines range for x-position in which collision is detected
    let x_condition = ((collider_1_x - collider_1_width/2) < (collider_2_x + collider_2_width/2) && (collider_1_x + collider_1_width/2) > (collider_2_x - collider_2_width/2));
    // defines range for y-position in which collision is detected
    let y_condition = ((collider_1_y + collider_1_height) > collider_2_y) && (collider_1_y < (collider_2_y + collider_2_height)) ;
    return (x_condition && y_condition);
}

function checkChickenCollision() {
    timeSinceLastCollision = new Date().getTime() - timeOfCollision;
    if (timeSinceLastCollision > DURATION_WOUNDED_STATE) {    // wounded state prevents from jumping and triggers wounded-animation
        isWounded = false;
    }
    for (let i = 0; i < chickens.length; i++) {
        let collisionTrue = verifyChickenCollision(i);
        verifyChickenDeath(i, collisionTrue);
        let chickenDeath = chickens[i].isHurt;
        verifyCharacterWounded(chickenDeath, collisionTrue);
    }
}

function verifyCharacterWounded(chickenDeath, collisionTrue) {
    // Character energy reduced if he collides with enemy AND enough time has passed since last collision
    if (!chickenDeath && (timeSinceLastCollision > DURATION_WOUNDED_STATE) && collisionTrue) {         
        timeOfCollision = new Date().getTime();
        reduceCharacterEnergy();
        isWounded = true;
        AUDIO_PAIN.play();
    }  
}

function verifyChickenCollision(i) {
    let chicken = chickens[i];
    let chickenWidth = canvas.width * chicken.scale_x; 
    let chicken_x = chicken.position_x + bg_elements;  // calculates absolute position of chicken by taking background-movement into account
    characterWidth = character_image.width * 0.35 - 60;

    let collisionTrue = checkCollisionCondition(character_x, characterWidth, chicken_x, chickenWidth, character_y, characterHeight, chicken.position_y, 80);
    return collisionTrue;
}

function verifyChickenDeath(i, collisionTrue) {
    // Chicken killed if character jumps on it
    if (isJumping && collisionTrue) {
        AUDIO_CHICKEN_SQUASHED.play();
        chickens[i].isHurt = true;
        chickens[i].position_y = 440;
    }
    return 
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
function checkBottleCollision() {
    // check collision to pick-up bottle
    for (let i = 0; i < placedBottles.length; i++) {
       let bottleWidth = (canvas.width * 0.125); 
       let bottle_x = placedBottles[i] + bg_elements;  

       if (checkCollisionCondition(bottle_x, bottleWidth, character_x, (characterWidth -75), character_y, characterHeight, bottle_y, 100 )) { 
           pickBottle(i);
       }; 
   };
}
function pickBottle(i) {
    placedBottles[i] = -2000; // moves bottle outside of visible canvas when picked
    AUDIO_BOTTLE.play();
    collectedBottles += COLLISION_BOTTLE_FILL;
}
