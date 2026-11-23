/* نموذج الحجز: يتحفظ في Netlify Forms ويفتح واتساب */
document.getElementById('f').addEventListener('submit',function(e){
  e.preventDefault();
  var form=e.target,d=new FormData(form),st=document.getElementById('fstatus');
  document.getElementById('est').value=lastText||'';
  var msg='أهلًا، أنا '+d.get('name')+'. عايز معاينة لـ '+d.get('type')+(d.get('area')?' مساحتها '+d.get('area')+' م²':'')+'. رقمي: '+d.get('phone')+'.'+(d.get('message')?' '+d.get('message'):'');
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank','noopener');
  st.textContent='اتفتح واتساب برسالتك، ابعتها وهنتواصل معاك قريبًا.';form.reset();
});
