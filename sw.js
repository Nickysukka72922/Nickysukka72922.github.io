let deferredPrompt;

// 1. Capture the event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Don't hide the button yet! Just save the event.
  document.getElementById('installBtn').style.display = 'block';
});

// 2. You can now call this function from a menu or a link whenever you want!
function triggerInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt = null;
  } else {
    alert("This app is already installed or your browser doesn't support it yet!");
  }
}
