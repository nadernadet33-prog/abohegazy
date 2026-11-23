var roomsEl=document.getElementById('rooms'),lvlEl=document.getElementById('lvl'),lastText='';
function buildLevels(){
  var cur=lvlEl.value;lvlEl.innerHTML='';
  Object.keys(LVL).forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=LVL[k];lvlEl.appendChild(o)});
  lvlEl.value=cur&&LVL[cur]?cur:'mid';
}
function addRoom(type,l,w){
  var d=document.createElement('div');d.className='room';
  var opts=Object.keys(FACTOR).map(function(k){return '<option'+(k===type?' selected':'')+'>'+k+'</option>'}).join('');
  d.innerHTML='<select aria-label="نوع الغرفة">'+opts+'</select>'+
    '<input type="number" min="0" step="0.1" inputmode="decimal" placeholder="الطول (م)" aria-label="الطول بالمتر" value="'+(l||'')+'">'+
    '<input type="number" min="0" step="0.1" inputmode="decimal" placeholder="العرض (م)" aria-label="العرض بالمتر" value="'+(w||'')+'">'+
    '<button type="button" class="rm" aria-label="احذف الغرفة">حذف</button><div class="rc"></div>';
  d.querySelector('.rm').addEventListener('click',function(){d.remove();calc()});
  roomsEl.appendChild(d);calc();
}
function calc(){
  var lv=lvlEl.value,area=0,lines=[],txt=[];
  Array.prototype.forEach.call(roomsEl.children,function(r){
    var t=r.querySelector('select').value,ins=r.querySelectorAll('input');
    var l=parseFloat(ins[0].value)||0,w=parseFloat(ins[1].value)||0,a=l*w;
    r.querySelector('.rc').textContent=a>0?('المساحة '+a.toFixed(1)+' م²'):'أدخل الطول والعرض';
    if(a>0){area+=a;lines.push('<li><span>'+t+'</span><span>'+a.toFixed(1)+' م²</span></li>');txt.push(t+' '+l+'×'+w+' م ('+a.toFixed(1)+' م²)')}
  });
  document.getElementById('total').textContent=area.toFixed(1)+' م²';
  document.getElementById('breakdown').innerHTML=lines.join('');
  lastText=area>0?('أهلًا، أنا مهتم بتصميم وتشطيب ('+LVL[lv]+'): '+txt.join('، ')+'. إجمالي المساحة '+area.toFixed(1)+' م². عايز أحجز معاينة.'):'';
}
lvlEl.addEventListener('change',calc);
roomsEl.addEventListener('input',calc);
document.getElementById('addRoom').addEventListener('click',function(){addRoom('غرفة نوم')});
document.getElementById('sendEst').addEventListener('click',function(){
  if(!lastText){alert('أدخل مقاسات غرفة واحدة على الأقل');return}
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(lastText),'_blank','noopener');
});
buildLevels();addRoom('غرفة معيشة');addRoom('غرفة نوم');

