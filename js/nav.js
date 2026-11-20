/* Нижняя панель разделов (телефон) и «Моё дело». Выключить у себя: ?nav=off, включить обратно: ?nav */
(function(){
function ls(k,v){try{if(v===undefined) return localStorage.getItem(k); if(v===null) localStorage.removeItem(k); else localStorage.setItem(k,v)}catch(e){return null}}
if(/[?&]nav=off\b/.test(location.search)) ls("sentfor_navtest","0"); else if(/[?&]nav\b/.test(location.search)) ls("sentfor_navtest",null);
var ON=ls("sentfor_navtest")!=="0"; if(!ON) return;
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
var tabs=document.getElementById("tabs"), bar=document.querySelector(".epbar"); if(!tabs||!bar) return;
document.body.classList.add("nav2");
var IC={
  case:'<path d="M4 7h16v12H4zM9 7V5h6v2"/><path d="M4 12h16"/>',
  inv:'<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l5 5"/>',
  ts1:'<path d="M12 3c-4 4-6 7-6 10a6 6 0 0012 0c0-3-2-6-6-10z"/>',
  world:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
  me:'<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'};
var G=[{k:"case",n:"Дело",t:["people","weird","evidence"]},{k:"inv",n:"Разбор",t:["pred","threads","gazeta","questions","theories"]},{k:"ts1",n:"ТС1",t:["ts1lore","ts1"]},{k:"world",n:"Сентфор",t:["map","poppy","gossip","game"]},{k:"me",n:"Моё дело"}];
function grpOf(t){for(var i=0;i<G.length;i++) if(G[i].t&&G[i].t.indexOf(t)>=0) return G[i]; return G[0]}
function cur(){var b=tabs.querySelector('.tab[aria-selected="true"]'); return b&&b.getAttribute("data-tab")||"people"}

/* нижняя панель */
var nav=H("nav","bn"); nav.setAttribute("aria-label","Разделы");
G.forEach(function(g){var b=H("button","bn-i"); b.type="button"; b.setAttribute("data-g",g.k);
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+IC[g.k]+'</svg><span>'+g.n+'</span>';
  b.onclick=function(){if(g.k==="me"){me(); return} go(g)}; nav.appendChild(b)});
/* внутрь .wrap: тогда окна сайта (досье, выбор серии, кассета) открываются поверх панели, а не под ней */
(document.querySelector(".wrap")||document.body).appendChild(nav);
function go(g){
  /* только вкладки, которые сейчас есть и не скрыты (газета в тесте, карта до 19-й серии) */
  var ok=g.t.filter(function(x){var b=tabs.querySelector('.tab[data-tab="'+x+'"]'); return b&&!b.hidden&&x!=="poppy"&&x!=="gossip"});
  var last=ls("sentfor_navlast_"+g.k), t=ok.indexOf(last)>=0?last:ok[0]; if(!t) return;
  var b=tabs.querySelector('.tab[data-tab="'+t+'"]'); if(b) b.click();
  paint(g.k);
  /* после того как чужие вкладки скрылись — прокрутить строку к открытой вкладке */
  if(b) requestAnimationFrame(function(){var r=b.parentNode; if(r.scrollWidth>r.clientWidth) r.scrollLeft=b.offsetLeft-r.clientWidth/2+b.offsetWidth/2});
}
function paint(gk){
  var g=gk?G.filter(function(x){return x.k===gk})[0]:grpOf(cur());
  nav.querySelectorAll(".bn-i").forEach(function(b){b.classList.toggle("on",b.getAttribute("data-g")===g.k)});
  tabs.querySelectorAll(".tab[data-tab]").forEach(function(b){b.classList.toggle("ingrp",g.t.indexOf(b.getAttribute("data-tab"))>=0)});
}
new MutationObserver(function(){var t=cur(), g=grpOf(t); ls("sentfor_navlast_"+g.k,t); paint()}).observe(tabs,{attributes:true,subtree:true,attributeFilter:["aria-selected"]});
setTimeout(paint,400);
/* точка на кнопке нижней панели, если во вкладках этой группы что-то новое */
function marks(){nav.querySelectorAll(".bn-i").forEach(function(b){var g=G.filter(function(x){return x.k===b.getAttribute("data-g")})[0];
  var n=g&&g.t&&g.t.some(function(t){var e=tabs.querySelector('.tab[data-tab="'+t+'"]'); return e&&!e.hidden&&(e.hasAttribute("data-new")||e.classList.contains("tab-pred")||e.classList.contains("has-new"))});
  b.classList.toggle("has-new",!!n)})}
new MutationObserver(marks).observe(tabs,{attributes:true,subtree:true,childList:true,attributeFilter:["data-new","class","hidden"]});
setTimeout(marks,400); setTimeout(marks,2500);

/* «Моё дело» */
var hdr=document.querySelector("header .hdr-row");
/* одна кнопка вместо счётчика пасхалок: «Моё дело · пасхалки 15/21» */
var em=document.querySelector(".egg-meter");
if(hdr){var hb=H("button","me-btn"); hb.type="button"; hb.onclick=me;
  function hbPaint(){hb.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+IC.me+'</svg><span class="me-l">Моё дело</span><span class="me-e">пасхалки <b>'+eggs()+'</b></span>'; hb.classList.toggle("ping",!!(em&&em.classList.contains("ping")))}
  if(em){em.parentNode.insertBefore(hb,em); new MutationObserver(hbPaint).observe(em,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["class"]})} else hdr.appendChild(hb);
  hbPaint()}
function eggs(){var m=document.querySelector(".egg-meter b"); return m?m.textContent.replace(/\s/g,""):"0/21"}
function caseNo(){var n=ls("sentfor_caseno"); if(!n){n=String(1000+Math.floor(Math.random()*9000)); ls("sentfor_caseno",n)} return n}
function rank(got,tot){var r=tot?got/tot:0; return got>=tot&&tot?"Легенда Сентфора":r>=.75?"Старший детектив":r>=.45?"Детектив":r>=.2?"Следователь":"Стажёр"}
function me(){
  if(document.querySelector(".me-sheet")) return;
  var sh=H("div","me-shade"), s=H("div","me-sheet"); s.setAttribute("role","dialog"); s.setAttribute("aria-modal","true"); s.setAttribute("aria-label","Моё дело");
  var rd=(window.SF&&SF.read)||1, nm=document.getElementById("ep-name"), ln=document.getElementById("lb-nadin"), ldx=document.getElementById("lb-dex");
  var eg=eggs().split("/"), got=+eg[0]||0, tot=+eg[1]||0, cursed=document.body.classList.contains("f13-cursed");
  var row=function(lbl,val,sub,btns,cls){return '<div class="me-row'+(cls?" "+cls:"")+'"><div class="me-f"><small>'+lbl+'</small><b>'+val+'</b>'+(sub?'<span>'+sub+'</span>':'')+'</div><div class="me-acts">'+btns+'</div></div>'};
  var b=function(a,t,c){return '<button type="button" class="me-b'+(c?" "+c:"")+'" data-a="'+a+'">'+t+'</button>'};
  s.innerHTML='<button type="button" class="me-x" aria-label="Закрыть">✕</button>'+
    '<div class="me-head"><svg class="me-fp" viewBox="0 0 100 120" aria-hidden="true"><path d="M50 10c-22 0-38 17-38 40v22M88 72V50c0-23-16-40-38-40M50 22c-15 0-27 12-27 28v28M77 78V50c0-16-12-28-27-28M50 34c-9 0-16 7-16 16v34M66 86V50c0-9-7-16-16-16M50 46v46M26 92c4 8 8 14 14 18M74 96c-4 7-9 12-15 16"/></svg>'+
      '<div class="me-hd"><span class="me-tag">совершенно секретно</span><h3>Моё дело</h3><p class="me-no">№ '+caseNo()+'</p></div>'+
      '<span class="me-stamp">'+rank(got,tot)+'</span></div>'+
    row("Дочитал(а) до","серии "+rd,nm?nm.textContent:"",b("ep","Сменить"))+
    row("Пасхалки",'<span class="me-eg">'+got+'</span> из '+tot,'<span class="me-bar"><i style="width:'+(tot?Math.round(got/tot*100):0)+'%"></i></span>',b("eggs","Список"))+
    (document.querySelector(".f13-badge")?row("Награда","🐈‍⬛ Пережил(а) пятницу, 13-е",'<span class="me-cur-t">Проклятая тема '+(cursed?"включена":"выключена")+'</span>',(document.querySelector(".f13-tape")?b("tapes","📼 Кассеты"):"")+'<button type="button" class="me-b me-cur">'+(cursed?"Выключить":"Включить")+'</button>'):"")+
    '<div class="me-row"><div class="me-faces">'+(ln&&ln.src?'<img src="'+ln.src+'" alt="">':'')+(ldx&&ldx.src?'<img src="'+ldx.src+'" alt="">':'')+'</div><div class="me-f"><small>Внешность</small><b>Надин и Декс</b></div><div class="me-acts">'+b("look","Изменить")+'</div></div>'+
    '<div class="me-tr"><small>Другое устройство</small><p>Дело хранится только в этом браузере. Чтобы продолжить на телефоне или компьютере, перенеси его кодом.</p><div class="me-btns">'+b("send","📲 Перенести отсюда","pri")+b("take","Ввести код")+'</div></div>'+
    (window.SFscare?'<div class="me-row me-last"><div class="me-f"><small>Пугалки</small><b class="me-scare">'+(SFscare.off()?"выключены":"включены")+'</b><span>'+(SFscare.off()?"Никаких скримеров и страшных видео, и в будущих обновлениях тоже.":"Скримеры, страшные видео и звуки.")+'</span></div><div class="me-acts">'+(SFscare.seen()&&!SFscare.off()?b("replay","▶ Финал"):"")+'<button type="button" class="me-b me-tg">'+(SFscare.off()?"Включить":"Выключить")+'</button></div></div>':"");
  document.body.appendChild(sh); document.body.appendChild(s); document.body.classList.add("noscroll");
  requestAnimationFrame(function(){requestAnimationFrame(function(){sh.classList.add("on"); s.classList.add("on")})});
  function close(cb){s.classList.remove("on"); sh.classList.remove("on"); document.body.classList.remove("noscroll"); setTimeout(function(){s.remove(); sh.remove(); if(cb) cb()},260)}
  s.querySelector(".me-x").onclick=function(){close()}; sh.onclick=function(){close()};
  document.addEventListener("keydown",function k(e){if(!s.isConnected){document.removeEventListener("keydown",k); return} if(e.key==="Escape") close()});
  var tg=s.querySelector(".me-tg"); if(tg) tg.onclick=function(){var off=SFscare.off(); SFscare.set(off); close(function(){me()})};
  var cu=s.querySelector(".me-cur"); if(cu) cu.onclick=function(){var x=document.querySelector(".f13-badge"); if(x) x.click(); var on=document.body.classList.contains("f13-cursed"); cu.textContent=on?"Выключить":"Включить"; s.querySelector(".me-cur-t").textContent="Проклятая тема "+(on?"включена":"выключена")};
  s.querySelectorAll("[data-a]").forEach(function(x){x.onclick=function(){var a=x.getAttribute("data-a"); close(function(){
    if(a==="ep"){var y=bar.getBoundingClientRect().top+scrollY; window.scrollTo({top:Math.max(0,y-120),behavior:"smooth"}); var ch=document.querySelector(".ep-chip"); if(ch) setTimeout(function(){ch.click()},350)}
    else if(a==="eggs"){var m=document.querySelector(".egg-meter"); if(m) m.click()}
    else if(a==="tapes"){var t=document.querySelector(".f13-tape"); if(t) t.click()}
    else if(a==="replay"){if(window.SFscare) SFscare.play()}
    else if(a==="look"){var l=document.getElementById("look-open"); if(l) l.click()}
    else if(window.SFtransfer) SFtransfer(a)})}});
}
window.SFme=me;
})();
