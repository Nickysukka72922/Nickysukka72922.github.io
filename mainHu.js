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
		setTimeout(1000)
		notice.innerText=('')
		gess=Math.ceil(Math.random()*100)
		//console.log('gess=',gess)
	}
}
