let gess=Math.ceil(Math.random()*100)
//nconsole.log('gess=',gess)
let tds=document.getElementsByTagName('td')
for(let i=0;i<tds.length;i+=1){
	tds[i].innerHTML='<button onclick="check(this.innerText)">'+(i+1)+'</button>'
}
let notice=document.getElementById('notice')
function check(number){
	console.log(number)
	if(number>gess)notice.innerText=('a bit too high')
	if(number<gess)notice.innerText=('a bit too low')
	if(number==gess){
		notice.innerText=('great job!!!')
		playSounddone()
		gess=Math.ceil(Math.random()*100)
		//console.log('gess=',gess)
	}
}
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Change 'block' to 'inline-block'
installBtn.style.display = 'inline-block';

window.addEventListener('beforeinstallprompt', (e) => {
  // 1. Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // 2. Stash the event so it can be triggered later.
  deferredPrompt = e;
  // 3. Update UI notify the user they can install the PWA
  installBtn.style.display = 'block';

  installBtn.addEventListener('click', () => {
    // 4. Hide the app provided install promotion
    installBtn.style.display = 'none';
    // 5. Show the install prompt
    deferredPrompt.prompt();
    // 6. Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    });
  });
});
// Check for updates every time the page loads
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;
      newWorker.addEventListener('statechange', () => {
        // If the new worker is installed, reload to apply the update
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          console.log('New version found! Reloading...');
          window.location.reload();
        }
      });
    });
  });
}
navigator.serviceWorker.addEventListener('controllerchange', () => {
  // Show the message
  document.getElementById('update-message').style.display = 'block';

  // Wait a tiny bit so they can see the message, then refresh
  setTimeout(() => {
    window.location.reload();
  }, 1500); // 1.5 seconds delay
});
