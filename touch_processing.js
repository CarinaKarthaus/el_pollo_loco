// Script for detecting finger touch on mobile devices
let touchpointX;
let Y_touchpoints = new Array();
let ongoingTouches = new Array();
let jumpOnMobile = false;


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
            console.log('touchpointX: ' + touchpointX);  
            console.log('touchpointY: ', touchpointY);  
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
        // let idx = ongoingTouchIndexById(touches[i].identifier);
        let touchpointY = e.touches[i].pageY;
        Y_touchpoints.push(touchpointY);
    }
    checkForJump();
}

function checkForJump() {
    let heightDifference = Y_touchpoints[0] - Y_touchpoints[Y_touchpoints.length -1];
    console.log(heightDifference);

    if (heightDifference >= 60) {       // trigger jump when touchmove exceeds 20px in y-direction
        document.dispatchEvent(
            new KeyboardEvent("keydown", {
              code: 'Space'
            })
        );    
    }
}

function moveOnMobile() {
    let relativeCharacterPosition = (character_x + characterWidth/2) / canvas.width;    // relative character-position on canvas
    let absoluteCharacterPosition = relativeCharacterPosition * $(window).width() ;     // absolute character-position on mobile screen 
    if (touchpointX < absoluteCharacterPosition) {  // move left if touch is placed left from character
        isMovingLeft = true;
    } else if (touchpointX >= absoluteCharacterPosition) { // move right if touch is placed right from character
        isMovingRight = true;
    } 
}

function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      let id = ongoingTouches[i].identifier;
      
      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  } 


