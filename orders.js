
/* صفحة الطلبات: بتتبني من كروت الأعمال نفسها فأي عمل جديد بيظهر فيها تلقائيًا */
(function(){
function $(id){return document.getElementById(id)}
var sel={},custom=[],tiles={},built=false,groups=[];
var grid=$('ordGrid'),chips=$('ordCats'),list=$('ordList'),form=$('ordForm'),st=$('ordStatus'),bar=$('ordBar'),nav=$('navOrd'),lbBtn=$('lbOrder');
function T(i){return projs[i].querySelector('h3').textContent}
function D(i){return projs[i].querySelector('small').textContent}
function catOf(p){var l=p.parentElement.previousElementSibling;return l?l.textContent.trim():'أعمال'}
function ids(){return Object.keys(sel).map(Number).sort(function(a,b){return a-b})}
function chip(label,key){
  var b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-pressed',key===''?'true':'false');
  b.addEventListener('click',function(){
    Array.prototype.forEach.call(chips.children,function(x){x.setAttribute('aria-pressed','false')});
    b.setAttribute('aria-pressed','true');
    groups.forEach(function(g){g.el.hidden=!!key&&g.key!==key});
  });
  chips.appendChild(b);
}
function build(){
  if(built)return;built=true;
  var order=[],by={};
  projs.forEach(function(p,i){var c=catOf(p);if(!by[c]){by[c]=[];order.push(c)}by[c].push(i)});
  chip('الكل','');
  order.forEach(function(c){
    chip(c,c);
    var g=document.createElement('div');g.className='ord-cat';
    var h=document.createElement('h3');h.textContent=c;g.appendChild(h);
    var gr=document.createElement('div');gr.className='ord-grid';g.appendChild(gr);
    by[c].forEach(function(i){
      var el=document.createElement('article'),im=null;el.className='ord-item';
      if(projs[i].dataset.src){im=new Image();im.loading='lazy';im.src=projs[i].dataset.src;im.alt=T(i);im.addEventListener('click',function(){show(i)});el.appendChild(im)}
      var d=document.createElement('div'),h4=document.createElement('h4'),sm=document.createElement('small'),bt=document.createElement('button');
      bt.type='button';bt.className='btn';
      d.appendChild(h4);d.appendChild(sm);d.appendChild(bt);el.appendChild(d);
      bt.addEventListener('click',function(){toggle(i)});
      tiles[i]={el:el,im:im,h:h4,s:sm,b:bt};gr.appendChild(el);
    });
    groups.push({key:c,el:g});grid.appendChild(g);
  });
  refresh();
}
function refresh(){
  Object.keys(tiles).forEach(function(k){
    var t=tiles[k],i=+k,on=!!sel[i];
    t.h.textContent=T(i);t.s.textContent=D(i);
    if(t.im&&projs[i].dataset.src&&t.im.getAttribute('src')!==projs[i].dataset.src)t.im.src=projs[i].dataset.src;
    t.el.classList.toggle('on',on);
    t.b.textContent=on?'تمت الإضافة ✓':'أضف للطلب';
    t.b.setAttribute('aria-pressed',on?'true':'false');
  });
}
function qtySel(cur,fn){
  var q=document.createElement('select');q.setAttribute('aria-label','الكمية');
  for(var k=1;k<=9;k++){var o=document.createElement('option');o.value=k;o.textContent=k;if(k===cur)o.selected=true;q.appendChild(o)}
  q.addEventListener('change',function(){fn(+q.value)});return q;
}
function rmBtn(fn){
  var rm=document.createElement('button');rm.type='button';rm.className='rm';rm.textContent='×';rm.setAttribute('aria-label','شيل من الطلب');
  rm.addEventListener('click',fn);return rm;
}
function renderList(){
  list.textContent='';
  var n=ids();
  if(!n.length&&!custom.length){var e=document.createElement('li');e.className='empty';e.textContent='لسه ما اخترتش حاجة. اضغط «أضف للطلب» على أي عمل، أو اكتب طلبك الخاص.';list.appendChild(e);return}
  n.forEach(function(i){
    var li=document.createElement('li'),sp=document.createElement('span');
    sp.textContent=T(i);
    li.appendChild(sp);li.appendChild(qtySel(sel[i],function(v){sel[i]=v}));li.appendChild(rmBtn(function(){toggle(i)}));list.appendChild(li);
  });
  custom.forEach(function(c,k){
    var li=document.createElement('li'),sp=document.createElement('span'),tg=document.createElement('span');
    li.className='cu';tg.className='tag';tg.textContent='طلب خاص';
    sp.appendChild(tg);sp.appendChild(document.createTextNode(c.t));
    if(c.d){var sm=document.createElement('small');sm.textContent=c.d;sp.appendChild(sm)}
    li.appendChild(sp);li.appendChild(qtySel(c.q,function(v){c.q=v}));
    li.appendChild(rmBtn(function(){custom.splice(k,1);update()}));list.appendChild(li);
  });
}
function updLb(){
  if(!lbBtn)return;
  lbBtn.textContent=sel[cur]?'تمت الإضافة، اضغط للشيل':'أضف للطلب';
}
function update(){
  if(built)refresh();
  renderList();
  var n=ids().length+custom.length;
  nav.textContent=n?'الطلبات ('+n+')':'الطلبات';
  $('ordBarN').textContent=n;
  bar.hidden=!n;
  updLb();
}
function toggle(i){if(sel[i])delete sel[i];else sel[i]=1;update()}
function onRoute(){build();update()}

var _show=show;
show=function(i){_show(i);updLb()};
lbBtn.addEventListener('click',function(){toggle(cur)});
$('lbGo').addEventListener('click',function(){$('lb').close()});
bar.addEventListener('click',function(){$('ordBox').scrollIntoView()});

form.addEventListener('submit',function(e){
  e.preventDefault();
  var n=ids();
  if(!n.length&&!custom.length){st.textContent='اختار عمل واحد على الأقل أو اكتب طلبك الخاص قبل ما تبعت الطلب.';return}
  var d=new FormData(form);
  var lines=n.map(function(i,k){return (k+1)+') '+T(i)+' ('+catOf(projs[i])+') × '+sel[i]});
  custom.forEach(function(c){lines.push((lines.length+1)+') طلب خاص: '+c.t+(c.d?' - '+c.d:'')+' × '+c.q)});
  $('ordItems').value=lines.join(' | ');
  var msg='أهلًا، أنا '+d.get('name')+'. عايز أطلب:\n'+lines.join('\n')+'\nرقمي: '+d.get('phone')+'.'+(d.get('address')?'\nالمنطقة: '+d.get('address'):'')+(d.get('message')?'\nملاحظات: '+d.get('message'):'');
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
  st.textContent='اتفتح واتساب برسالتك، ابعتها وهنتواصل معاك قريبًا.';form.reset();sel={};custom=[];update();
});
$('cuAdd').addEventListener('click',function(){
  var t=$('cuT').value.trim(),m=$('cuMsg');
  if(!t){m.textContent='اكتب اسم الطلب الأول.';$('cuT').focus();return}
  custom.push({t:t,d:$('cuD').value.trim(),q:1});
  $('cuT').value='';$('cuD').value='';m.textContent='اتضاف لطلبك، تقدر تشوفه في قايمة «طلبك».';
  update();
});
window.addEventListener('hashchange',onRoute);
onRoute();
})();
