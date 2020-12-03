/**
 * Script for detecting finger touch on mobile devices
 */ 


function startupMobileListeners() {
    document.addEventListener('touchstart', handleStart, false);
    document.addEventListener('touchend', handleEnd, false);
    document.addEventListener('touchmove', handleMove, false);
}

/**
 * Detect and handle touch-start on mobile; open fullscreen when user touch detected
 * @param {string} e - touch event 
 */
function handleStart(e) {
    document.documentElement.requestFullscreen();
    for (let i = 0; i < e.touches.length; i++) {
        if (e) {
            touchpointX = e.touches[i].pageX;
            touchpointY = e.touches[i].screenY;
        } 
        moveOnMobile();
    }
}

/**
 * Stop character-movement when touch ended
 */
function handleEnd() {
        isMovingLeft = false;    
        isMovingRight = false;
} 

/**
 * Detect and handle touch-move on mobile
 * @param {string} e - touch event
 */
function handleMove(e) {
    for (let i = 0; i < e.touches.length; i++) {
        let touchpointY = e.touches[i].pageY;
        Y_touchpoints.push(touchpointY);
    }
    checkForJump();
}

function checkForJump() {
    let heightDifference = Y_touchpoints[0] - Y_touchpoints[Y_touchpoints.length -1];

    // trigger jump when touchmove exceeds 80px in y-direction and character isn't wounded
    if (heightDifference >= 80 && !isWounded) {       
        triggerJump();
    }
}
/**
 * Simulate keydown-event when jump is triggered on mobile
 */
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

/**
 * Detect moving direction of character depending on point of touch on screen
 * @param {number} absoluteCharacterPosition - x-position of character on current screen in px
 */
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

function toggleFullScreen() {
    let doc = window.document;
    let docEl = doc.documentElement;
  
    let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }


