let gess=Math.ceil(Math.random()*100)
//nconsole.log('gess=',gess)
let tds=document.getElementsByTagName('td')
for(let i=0;i<tds.length;i+=1){
	tds[i].innerHTML='<button onclick="check(this.innerText)">'+(i+1)+'</button>'
}
let notice=document.getElementById('notice')
function check(number){
	console.log(number)
	if(number>gess)notice.innerText=('kicsit túl magasan')
	if(number<gess)notice.innerText=('kicsit alacsonyra')
	if(number==gess){
		notice.innerText=('remek munka!!!')
		playSounddone()
		gess=Math.ceil(Math.random()*100)
		//console.log('gess=',gess)
	}
}
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

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
