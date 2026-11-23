/* قبل وبعد */
Array.prototype.forEach.call(document.querySelectorAll('.ba'),function(b){
  if(b.dataset.before)b.querySelector('.ba-before').style.backgroundImage='url("'+b.dataset.before+'")';
  if(b.dataset.after)b.querySelector('.ba-after').style.backgroundImage='url("'+b.dataset.after+'")';
  b.querySelector('input').addEventListener('input',function(e){b.style.setProperty('--p',e.target.value+'%')});
});

