
/* طلب مخصص: تشطيبات وأثاث، كل واحد بيتبعت لوحده على واتساب */
(function(){
function $(id){return document.getElementById(id)}
var MAXP=6;

/* رقم واتساب في التلميح */
function fillNum(){var n='0'+String(WA).replace(/^20/,'');Array.prototype.forEach.call(document.querySelectorAll('.waNum'),function(e){e.textContent=n.replace(/^(\d{4})(\d{3})(\d{4})$/,'$1 $2 $3')})}
fillNum();

/* التبديل بين تشطيبات وأثاث */
var TABS=[['tabFin','finForm'],['tabFur','furForm']];
function pick(i){TABS.forEach(function(t,k){var b=$(t[0]);b.setAttribute('aria-selected',k===i?'true':'false');b.tabIndex=k===i?0:-1;$(t[1]).hidden=k!==i})}
TABS.forEach(function(t,i){$(t[0]).addEventListener('click',function(){pick(i)})});

/* رفع الصور */
function Photos(input,box){
  var files=[],urls=[];
  function draw(){
    urls.forEach(function(u){URL.revokeObjectURL(u)});urls=[];box.textContent='';
    files.forEach(function(f,i){
      var u=URL.createObjectURL(f);urls.push(u);
      var fg=document.createElement('figure'),im=new Image(),x=document.createElement('button');
      im.src=u;im.alt='صورة المكان '+(i+1);
      x.type='button';x.textContent='×';x.setAttribute('aria-label','شيل الصورة '+(i+1));
      x.addEventListener('click',function(){files.splice(i,1);draw()});
      fg.appendChild(im);fg.appendChild(x);box.appendChild(fg);
    });
  }
  input.addEventListener('change',function(){
    Array.prototype.forEach.call(input.files,function(f){if(files.length<MAXP&&/^image\//.test(f.type))files.push(f)});
    input.value='';draw();fillNum();
  });
  return {get:function(){return files.slice()},clear:function(){files=[];draw()}};
}

/* الإرسال: مشاركة بالصور لو المتصفح بيدعم، وإلا رابط واتساب بالنص */
function deliver(build,files,st,done){
  var text=build(false);
  function openWA(){
    var w=window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text),'_blank','noopener');
    st.textContent=files.length?'اتفتح واتساب برسالتك. ارفق صور المكان من زر المرفقات داخل المحادثة وابعتها.':'اتفتح واتساب برسالتك، ابعتها وهنتواصل معاك قريبًا.';
    if(!w){st.appendChild(document.createTextNode(' '));var a=document.createElement('a');a.href='https://wa.me/'+WA+'?text='+encodeURIComponent(text);a.target='_blank';a.rel='noopener';a.textContent='اضغط هنا لفتح واتساب';st.appendChild(a)}
    done();
  }
  var data={files:files,text:text},can=false;
  try{can=files.length&&navigator.share&&navigator.canShare&&navigator.canShare(data)}catch(e){}
  can=false;if(!can){openWA();return}
  text=build(true);var copied=false;
  navigator.share(data).then(function(){
    st.textContent=copied?'تم. لو النص ما ظهرش مع الصور، الصقه في المحادثة (اتنسخ تلقائيًا).':'تم. لو النص ما ظهرش مع الصور، اكتبه في المحادثة.';
    done();
  }).catch(function(e){
    if(e&&e.name==='AbortError'){st.textContent='اتلغى الإرسال. بياناتك لسه موجودة وتقدر تبعتها تاني.';return}
    text=build(false);openWA();
  });
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(text).then(function(){copied=true},function(){});
}
function who(d){return 'الاسم: '+d.get('name')+'\nالموبايل: '+d.get('phone')+(d.get('address')?'\nالمنطقة: '+d.get('address'):'')}

/* ===== تشطيبات ===== */
var finForm=$('finForm'),finPh=Photos($('finPh'),$('finTh')),finSt=$('finSt');
finForm.addEventListener('submit',function(e){
  e.preventDefault();
  var d=new FormData(finForm),works=d.getAll('work'),files=finPh.get();
  var t=function(att){return 'أهلًا، عايز طلب *تشطيبات*\nنوع المكان: '+d.get('type')+'\nالمساحة: '+d.get('area')+' م²'+
    (works.length?'\nالشغل المطلوب: '+works.join('، '):'')+
    '\n'+who(d)+(d.get('message')?'\nملاحظات: '+d.get('message'):'')+
    (files.length?'\nصور المكان: '+files.length+(att?' (مرفقة)':' (هبعتها هنا في المحادثة)'):'')};
  deliver(t,files,finSt,function(){finForm.reset();finPh.clear()});
});

/* ===== أثاث ===== */
var CAT=[
 ['غرف النوم',['سرير','دولاب ملابس','كومودينو','تسريحة','دريسنج','شيزلونج أو بوف']],
 ['المعيشة والاستقبال',['أنتريه','ركنة','كنبة','ترابيزة وسط','وحدة تلفزيون','مكتبة','نيش أو بوفيه','كونسول ومرآة','جزامة']],
 ['السفرة',['سفرة','بوفيه سفرة']],
 ['المطبخ',['مطبخ كامل','وحدات سفلية','وحدات علوية','ركنة مطبخ','ترابيزة وكراسي مطبخ']],
 ['غرف الأطفال',['سرير أطفال','سرير دورين','دولاب أطفال','مكتب مذاكرة','وحدة ألعاب وتخزين']],
 ['المكتب',['مكتب','كرسي مكتب','مكتبة ملفات','ترابيزة اجتماعات','ريسبشن']],
 ['الحمامات والتخزين',['وحدة حمام','دولاب حمام','دولاب مدخل']],
 ['الحدائق والخارجي',['طقم جلسة حديقة','برجولة','ترابيزة خارجية']],
 ['ديكور مكمل',['ستائر','بانوهات حيطة','سجاد','إضاءة أو نجف','باب'] ]
];
var furForm=$('furForm'),furPh=Photos($('furPh'),$('furTh')),furSt=$('furSt'),listEl=$('furList'),pickEl=$('furPick');
var items=[],chipBy={};
function counts(){var c={};items.forEach(function(it){c[it.name]=(c[it.name]||0)+1});return c}
function syncChips(){
  var c=counts();
  Object.keys(chipBy).forEach(function(n){var b=chipBy[n];b.textContent=c[n]?n+' ×'+c[n]:n;b.setAttribute('aria-pressed',c[n]?'true':'false')});
}
function renderEmpty(){
  var e=listEl.querySelector('.empty');
  if(!items.length&&!e){var p=document.createElement('p');p.className='empty';p.textContent='لسه ما اخترتش قطعة. اضغط على أي قطعة من فوق أو أضف قطعة تانية.';listEl.appendChild(p)}
  if(items.length&&e)e.remove();
}
function addItem(name){
  var it={name:name,f:{}},box=document.createElement('div'),h=document.createElement('div'),st=document.createElement('strong'),rm=document.createElement('button'),dims=document.createElement('div');
  box.className='fi';h.className='fi-h';dims.className='dims';
  st.textContent=name;rm.type='button';rm.className='rm';rm.textContent='شيل';rm.setAttribute('aria-label','شيل '+name);
  rm.addEventListener('click',function(){items.splice(items.indexOf(it),1);box.remove();syncChips();renderEmpty()});
  h.appendChild(st);h.appendChild(rm);box.appendChild(h);
  [['l','الطول (سم)'],['w','العرض (سم)'],['h','الارتفاع (سم)'],['q','العدد']].forEach(function(d){
    var lb=document.createElement('label'),sp=document.createElement('span'),inp=document.createElement('input');
    sp.textContent=d[1];inp.type='number';inp.min=d[0]==='q'?'1':'0';inp.step=d[0]==='q'?'1':'any';inp.inputMode=d[0]==='q'?'numeric':'decimal';
    if(d[0]==='q')inp.value='1';
    lb.appendChild(sp);lb.appendChild(inp);dims.appendChild(lb);it.f[d[0]]=inp;
  });
  box.appendChild(dims);
  var lb=document.createElement('label'),sp=document.createElement('span'),nt=document.createElement('input');
  sp.textContent='تفاصيل القطعة (اختياري)';nt.maxLength=200;nt.placeholder='الخامة، اللون، أو أي تفاصيل';
  lb.appendChild(sp);lb.appendChild(nt);box.appendChild(lb);it.f.n=nt;
  items.push(it);renderEmpty();listEl.appendChild(box);syncChips();
  return box;
}
CAT.forEach(function(g){
  var wrap=document.createElement('div'),h=document.createElement('h4'),row=document.createElement('div');
  wrap.className='fp-g';row.className='fp-chips';h.textContent=g[0];
  g[1].forEach(function(n){
    var b=document.createElement('button');b.type='button';b.textContent=n;b.setAttribute('aria-pressed','false');
    b.addEventListener('click',function(){addItem(n).querySelector('input').focus()});
    chipBy[n]=b;row.appendChild(b);
  });
  wrap.appendChild(h);wrap.appendChild(row);pickEl.appendChild(wrap);
});
renderEmpty();
function addCustom(){
  var i=$('furCu'),v=i.value.trim();
  if(!v){i.focus();return}
  addItem(v);i.value='';
}
$('furCuAdd').addEventListener('click',addCustom);
$('furCu').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();addCustom()}});

furForm.addEventListener('submit',function(e){
  e.preventDefault();
  if(!items.length){furSt.textContent='اختار قطعة أثاث واحدة على الأقل قبل ما تبعت الطلب.';return}
  var d=new FormData(furForm),files=furPh.get();
  var lines=items.map(function(it,k){
    var p=[];
    if(it.f.l.value)p.push('الطول '+it.f.l.value);
    if(it.f.w.value)p.push('العرض '+it.f.w.value);
    if(it.f.h.value)p.push('الارتفاع '+it.f.h.value);
    var s=(k+1)+') '+it.name+' × '+(it.f.q.value||1)+(p.length?'\n    المقاس: '+p.join(' × ')+' سم':'\n    المقاس: يتحدد بعد المعاينة');
    if(it.f.n.value.trim())s+='\n    تفاصيل: '+it.f.n.value.trim();
    return s;
  });
  var t=function(att){return 'أهلًا، عايز طلب *أثاث*\n'+lines.join('\n')+'\n'+who(d)+(d.get('message')?'\nملاحظات: '+d.get('message'):'')+
    (files.length?'\nصور المكان: '+files.length+(att?' (مرفقة)':' (هبعتها هنا في المحادثة)'):'')};
  deliver(t,files,furSt,function(){
    furForm.reset();furPh.clear();items=[];listEl.textContent='';syncChips();renderEmpty();
  });
});
})();
