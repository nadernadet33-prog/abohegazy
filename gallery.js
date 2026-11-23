/* معرض الصور + نافذة التكبير */
var projs=[].slice.call(document.querySelectorAll('.proj')),cur=0,lb=document.getElementById('lb');
function show(i){
  cur=(i+projs.length)%projs.length;
  var p=projs[cur],box=document.getElementById('lbImg');
  box.innerHTML='';box.style.background='';
  if(p.dataset.src){var im=document.createElement('img');im.src=p.dataset.src;im.alt=p.querySelector('h3').textContent;box.appendChild(im)}
  else{box.style.background=p.dataset.bg||'#555'}
  document.getElementById('lbCap').textContent=p.querySelector('h3').textContent+' | '+p.querySelector('small').textContent;
  if(!lb.open&&lb.showModal)lb.showModal();
}
projs.forEach(function(p,i){
  if(p.dataset.src){p.style.setProperty('--img','url("'+p.dataset.src+'")');p.classList.add('has-img')}
  p.tabIndex=0;p.setAttribute('role','button');
  p.addEventListener('click',function(){show(i)});
  p.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i)}});
});
lb.querySelector('.lb-x').addEventListener('click',function(){lb.close()});
lb.querySelector('.lb-p').addEventListener('click',function(){show(cur-1)});
lb.querySelector('.lb-n').addEventListener('click',function(){show(cur+1)});
lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});

