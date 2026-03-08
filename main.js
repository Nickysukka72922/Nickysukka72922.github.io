let deferredPrompt;
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
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e; // The browser finally "plugs in" the event
  console.log("✅ Event captured! The button is now 'active'.");
  installBtn.style.display = 'inline-block';
});

installBtn.addEventListener('click', () => {
  if (!deferredPrompt) {
    console.error("❌ Error: The 'deferredPrompt' is empty. The browser hasn't given the signal yet.");
    return;
  }

  // Trigger the prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
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
