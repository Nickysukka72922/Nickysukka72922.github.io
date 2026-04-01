let deferredPrompt;
// Generate initial random number
let gess = Math.ceil(Math.random() * 100);

// Set up the grid buttons
let tds = document.getElementsByTagName('td');
for (let i = 0; i < tds.length; i += 1) {
  tds[i].innerHTML = '<button onclick="check(this.innerText)">' + (i + 1) + '</button>';
}

let notice = document.getElementById('notice');

// Make check globally available so the HTML inline onclick can see it
window.check = function(number) {
  let guessNum = parseInt(number);
  console.log("Guessed:", guessNum);

  if (guessNum > gess) {
    notice.innerText = 'a bit too high';
  } else if (guessNum < gess) {
    notice.innerText = 'a bit too low';
  } else if (guessNum === gess) {
    notice.innerText = 'great job!!!';
    
    // Play sound if available
    if (typeof playSounddone === 'function') {
      playSounddone();
    }
    
    // Reset the game with a new number
    gess = Math.ceil(Math.random() * 100);
  }
};

// PWA Install Logic
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e; 
  console.log("Event captured! The button is now active.");
  
  // Only show the button if NOT in desktop mode
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  
  if (mode !== "desktop" && mode !== 'mobile' ) {
    installBtn.style.display = 'inline-block';
  }
});

installBtn.addEventListener('click', () => {
  if (!deferredPrompt) {
    console.error("Error: The 'deferredPrompt' is empty.");
    return;
  }

  deferredPrompt.prompt();

  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install');
    } else {
      console.log('User dismissed the install');
    }
    deferredPrompt = null; 
    installBtn.style.display = 'none';
  });
});
