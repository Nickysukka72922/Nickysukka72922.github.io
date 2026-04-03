let gess = Math.ceil(Math.random() * 100);
let tds = document.getElementsByTagName('td');
for (let i = 0; i < tds.length; i += 1) {
  tds[i].innerHTML = '<button onclick="check(this.innerText)">' + (i + 1) + '</button>';
}

let notice = document.getElementById('notice');

window.check = function(number) {
  let guessNum = parseInt(number);
  console.log("Guessed:", guessNum);

  if (guessNum > gess) {
    notice.innerText = 'a bit too high';
  } else if (guessNum < gess) {
    notice.innerText = 'a bit too low';
  } else if (guessNum === gess) {
    notice.innerText = 'great job!!!';
    
    if (typeof playSounddone === 'function') {
      playSounddone();
    }
    
    gess = Math.ceil(Math.random() * 100);
  }
};

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  
  if (mode !== "desktop" && mode !== 'mobile' ) {
    installBtn.style.display = 'inline-block';
  }
;
