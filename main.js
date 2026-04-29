// Secure Initialization
let gess = Math.ceil(Math.random() * 100);
let tds = document.getElementsByTagName('td');
let notice = document.getElementById('notice');

// Set up event handler securely without inline onclick
window.check = function(number) {
    let guessNum = parseInt(number);
    console.log("Guessed:", guessNum);
    
    if (isNaN(guessNum)) return; // Sanity check

    if (guessNum > gess) {
        notice.textContent = 'a bit too high'; // Use textContent
    } else if (guessNum < gess) {
        notice.textContent = 'a bit too low';
    } else if (guessNum === gess) {
        notice.textContent = 'great job!!!';
        if (typeof playSounddone === 'function') {
            playSounddone();
        }
        gess = Math.ceil(Math.random() * 100);
    }
};

// Populate table safely
for (let i = 0; i < tds.length; i += 1) {
    let btn = document.createElement('button');
    let btnText = i + 1;
    btn.textContent = btnText; // Set text only
    btn.addEventListener('click', () => window.check(btnText));
    
    tds[i].innerHTML = ''; // Clear existing
    tds[i].appendChild(btn); // Append safe node
}

// URL parameter handling
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
if (mode !== "desktop" && mode !== 'mobile' ) {
    // Ensure installBtn exists in DOM
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'inline-block';
    }
}
