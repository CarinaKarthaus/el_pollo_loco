/**
 * Script for detecting finger touch on mobile devices
 */ 

function startupMobileListeners() {
    document.addEventListener('touchstart', handleStart, false);
    document.addEventListener('touchend', handleEnd, false);
    document.addEventListener('touchmove', handleMove, false);
}

function handleStart(e) {
    for (let i = 0; i < e.touches.length; i++) {
        if (e) {
            touchpointX = e.touches[i].pageX;
            touchpointY = e.touches[i].screenY;
        } 
        moveOnMobile();
    }
}

function handleEnd() {
        isMovingLeft = false;    
        isMovingRight = false;
    } 

function handleMove(e) {
    for (let i = 0; i < e.touches.length; i++) {
        let touchpointY = e.touches[i].pageY;
        Y_touchpoints.push(touchpointY);
    }
    checkForJump();
}

function checkForJump() {
    let heightDifference = Y_touchpoints[0] - Y_touchpoints[Y_touchpoints.length -1];

    if (heightDifference >= 80 && !isWounded) {       // trigger jump when touchmove exceeds 80px in y-direction and character isn't wounded
        triggerJump();
    }
}

function triggerJump() {
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
          code: 'Space'
        })
    );    
}

/**
 * Move character on mobile by detection & localization of finger touch
 */
function moveOnMobile() {
    touchStart();
    let relativeCharacterPosition = (character_x + characterWidth/2) / canvas.width;    // relative character-position on canvas
    let absoluteCharacterPosition = relativeCharacterPosition * $(window).width() ;     // absolute character-position on mobile screen in px
    detectMovingDirection(absoluteCharacterPosition);
}

function detectMovingDirection(absoluteCharacterPosition) {
    if (touchpointX < absoluteCharacterPosition) {  // move left if touch is placed left from character
        isMovingLeft = true;
    } else if (touchpointX >= absoluteCharacterPosition) { // move right if touch is placed right from character
        isMovingRight = true;
    } 
}

/**
 * Detect time of touch-start to identify single & double-taps
 */
function touchStart() {
    if (clickTimer == null) {
        clickTimer = setTimeout(function () {
            clickTimer = null;
        }, 500)
    } else {
        detectDoubleTap();
    }
}

function detectDoubleTap() {
    clearTimeout(clickTimer);
    clickTimer = null;
    document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: 'd'
        })
    ); 
}


