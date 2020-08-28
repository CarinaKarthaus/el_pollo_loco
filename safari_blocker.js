// Script to block use of Safari-browser and forward to Chrome

/**
 * Detect Safari-browser and trigger blocker-msg and overlay for background
 */
function isSafari() {
    let isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;

    if (isSafari) {
        document.getElementById('wrapper').classList.add('safari-overlay');
        document.getElementById('safari-blocker-msg').classList.remove('d-none');
    } 
}

/**
 * Copies URL to clipboard by creating dummy-element, copying and removing it 
 */
function copyUrl() {
    let dummy = document.createElement('input');
    url = window.location.href;

    document.body.appendChild(dummy);
    dummy.value = url;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}

/**
 * Displays message when URL is copied to clipboard
 */
function clipboardMsg() {
    let msg = document.getElementById("alarmmsg");
    msg.style.display = 'initial';
    msg.innerHTML = ' Copied to clipboard';

    fadeOut(msg);
}

/**
 * Let's clipboard message fade out 
 */
function fadeOut(element) {
    let op = 1;  // initial opacity
    let timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.2;
    }, 50);
}