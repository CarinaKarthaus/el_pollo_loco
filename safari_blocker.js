// Script to block use of Safari-browser and forward to Chrome

let ua = navigator.userAgent.toLowerCase(); 
if (ua.indexOf('safari') != -1) { 
    if (ua.indexOf('chrome') > -1) {
        console.log('Chrome') // Chrome
    } else {
        document.getElementById('wrapper').classList.add('safari-overlay');
        document.getElementById('safari-blocker-msg').remove('d-none');
    }
}

function switchToChrome() {
    // move to Chrome-browser when button is clicked in Safari
    let protocol = location.href.substring(0,location.href.indexOf(':'));
    let url = location.href.substring(location.href.indexOf(':'));

    if (protocol === "http") {
        location.href = "googlechrome" + url;
    }
    else {
        location.href = "googlechromes" + url;
    }
}