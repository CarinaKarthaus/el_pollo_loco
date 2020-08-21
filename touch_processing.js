// Script for detecting finger touch on mobile devices
let touchpointX;
let touches = [];

//moveOnMobile();

document.addEventListener('touchstart', function(e) {
    touches = e.touches;
    for (let i = 0; i < touches.length; i++) {
        if (e) {
            touchpointX = touches[i].pageX;
            console.log('touchpointX: ' + touchpointX);    
        } 
        moveOnMobile();
       // touches.splice(i, 1);
    }
})

document.addEventListener('touchend', function(e) {
    isMovingLeft = false;    
    isMovingRight = false;
} )


function moveOnMobile() {
    let thirdOfScreen = $(window).width() / 3; 
    if (touchpointX < thirdOfScreen) {  // move left if touch is on left part of screen
        isMovingLeft = true;
    } else if (touchpointX >= thirdOfScreen) { // move right if touch is on right part of screen
        isMovingRight = true;
    } 
}