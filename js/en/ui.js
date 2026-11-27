/* Удобства: сжимающаяся панель серий на телефоне, поиск по сайту, метки «новое» */
(function(){
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function ls(k,v){try{if(v===undefined) return JSON.parse(localStorage.getItem(k)||"null"); localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
var bar=document.querySelector(".epbar"), tabs=document.getElementById("tabs");
if(!bar||!tabs) return;
function rd(){return (window.SF&&SF.read)||1}
function norm(s){return String(s||"").toLowerCase().replace(/ё/g,"е").replace(/\s+/g," ").trim()}
function hsh(s){var h=5381; for(var i=0;i<s.length;i++) h=((h<<5)+h+s.charCodeAt(i))|0; return (h>>>0).toString(36)}
function goTo(el){var b=Math.max(0,bar.getBoundingClientRect().bottom); window.scrollTo({top:el.getBoundingClientRect().top+scrollY-b-16,behavior:RM?"auto":"smooth"})}
function openTab(t){var b=tabs.querySelector('.tab[data-tab="'+t+'"]'); if(b&&b.getAttribute("aria-selected")!=="true") b.click()}
function flash(el){el.classList.remove("ui-flash"); void el.offsetWidth; el.classList.add("ui-flash"); setTimeout(function(){el.classList.remove("ui-flash")},2600)}

/* ---------- 1. панель серий на телефоне ----------
   верх панели уезжает вместе со страницей (это обычная прокрутка браузера, поэтому плавно), прилипает только ряд вкладок;
   целиком панель показывается кнопкой «19 ▾» и прячется обратно, как только листаешь дальше */
var mq=matchMedia("(max-width:820px)"), mini=false, open=false, oy=0, raf=0;
var chip=H("button","ep-chip"); chip.type="button"; chip.setAttribute("aria-label","Show episode picker"); tabs.insertBefore(chip,tabs.firstChild);
function chipTxt(){chip.textContent=rd()+" ▾"}
function mx(){return Math.max(0,tabs.offsetTop-4)}
function fit(){bar.style.setProperty("--epc",(mq.matches?mx():0)+"px")}
function setOpen(on){if(on===open) return; open=on; oy=scrollY; bar.classList.add("ep-anim"); bar.style.transform=on?"translate3d(0,"+mx()+"px,0)":""; document.body.classList.toggle("ep-open",on);
  clearTimeout(setOpen.t); setOpen.t=setTimeout(function(){bar.classList.remove("ep-anim")},400)}
function check(){raf=0;
  var top=bar.getBoundingClientRect().top+(open?-mx():0), m=mq.matches&&top<-mx()*0.55;
  if(m!==mini){mini=m; document.body.classList.toggle("ep-mini",m); chipTxt(); if(!m) setOpen(false)}
  if(open&&Math.abs(scrollY-oy)>40) setOpen(false)}
chip.onclick=function(){if(mini||open) setOpen(!open)};
addEventListener("scroll",function(){if(!raf) raf=requestAnimationFrame(check)},{passive:true});
addEventListener("resize",function(){fit(); check()});
mq.addEventListener&&mq.addEventListener("change",function(){fit(); setOpen(false); check()});
var epn=document.getElementById("ep-name"); if(epn) new MutationObserver(function(){chipTxt(); fit()}).observe(epn,{childList:true,characterData:true,subtree:true});
if(window.ResizeObserver) new ResizeObserver(function(){fit()}).observe(bar);
fit(); chipTxt(); check();

/* ---------- единый список того, что есть на сайте ---------- */
var TABN={people:"People",weird:"Unexplained",evidence:"Clues",theories:"Theories",questions:"Questions",ts1lore:"SOS1",ts1:"Links to SOS1"};
var SEL={weird:".item",evidence:".item",ts1lore:".item, details.retell",theories:"article",questions:"li",ts1:".mx, .curse, .tc2"};
function ver(v){if(!Array.isArray(v)) return v; var r=v[0][1]; v.forEach(function(x){if(x[0]<=rd()) r=x[1]}); return r}
function title(el){var t=el.querySelector("h3,h4,summary,.th-head h3,figcaption,b,strong"); var s=(t?txt(t):txt(el))||""; s=s.replace(/\s+/g," ").trim(); return s.length>70?s.slice(0,68)+"…":s}
function locked(el){return !!el.closest(".locked")}
function txt(el){var out=[], w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT), n; while((n=w.nextNode())){var p=n.parentNode; if(p&&/^(SCRIPT|STYLE)$/.test(p.tagName)) continue; var v=n.nodeValue.trim(); if(v) out.push(v)} return out.join(" ").replace(/\s*▶\s*/g," · ")}
function units(){
  var out=[];
  var P=window.SF&&SF.people?SF.people():[];
  P.forEach(function(p){
    var nm=ver(p.n), role=ver(p.role)||"", facts=(p.f||[]).filter(function(f){return f[0]<=rd()});
    out.push({tab:"people",type:"File",key:"p:"+p.id,title:nm,role:role,text:nm+" "+role+" "+facts.map(function(f){return f[1]}).join(" "),facts:facts,locked:p.ep>rd(),person:p.id,allFacts:(p.f||[])});
  });
  Object.keys(SEL).forEach(function(t){
    var s=document.getElementById("tab-"+t); if(!s) return;
    s.querySelectorAll(SEL[t]).forEach(function(el){
      if(t==="questions"&&el.parentNode.closest("li")) return;
      var ti=title(el); if(!ti) return;
      out.push({tab:t,type:TABN[t],key:t+":"+(el.id||hsh(norm(ti))),title:ti,text:txt(el),el:el,locked:locked(el)});
    });
  });
  return out;
}

/* ---------- 2. поиск ---------- */
var sb=H("button","tab-search"); sb.type="button"; sb.setAttribute("aria-label","Search the case");
sb.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M13 13l4.5 4.5"/></svg>';
tabs.insertBefore(sb,chip.nextSibling);
var sv=null;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function snip(text,q){var t=String(text).replace(/\s+/g," "), n=norm(t), i=n.indexOf(q); if(i<0) return esc(t.slice(0,110))+(t.length>110?"…":"");
  var a=Math.max(0,i-45), b=Math.min(t.length,i+q.length+65);
  return (a?"…":"")+esc(t.slice(a,i))+"<mark>"+esc(t.slice(i,i+q.length))+"</mark>"+esc(t.slice(i+q.length,b))+(b<t.length?"…":"")}
function search(){
  if(sv) return; var last=document.activeElement;
  sv=H("div","ui-search"); sv.setAttribute("role","dialog"); sv.setAttribute("aria-modal","true"); sv.setAttribute("aria-label","Search the case");
  sv.innerHTML='<div class="us-box"><div class="us-top"><input type="search" placeholder="Tape, Miranda, hellebore…" aria-label="What are we looking for" autocomplete="off" enterkeyhint="search"><button type="button" class="us-x" aria-label="Close">✕</button></div><p class="us-hint">Searching files, the unexplained, clues, questions, theories and SOS1. Only what\'s unlocked up to your episode.</p><ol class="us-res"></ol></div>';
  document.body.appendChild(sv); document.body.classList.add("noscroll");
  var inp=sv.querySelector("input"), res=sv.querySelector(".us-res"), hint=sv.querySelector(".us-hint"), U=units().filter(function(u){return !u.locked});
  U.forEach(function(u){u.n=norm(u.text); u.nt=norm(u.title)});
  function close(){if(!sv) return; sv.remove(); sv=null; document.body.classList.remove("noscroll"); document.removeEventListener("keydown",key); try{last&&last.focus()}catch(e){}}
  function key(e){if(e.key==="Escape") close()}
  document.addEventListener("keydown",key);
  sv.querySelector(".us-x").onclick=close; sv.addEventListener("click",function(e){if(e.target===sv) close()});
  var t=0; inp.addEventListener("input",function(){clearTimeout(t); t=setTimeout(run,120)});
  function run(){
    var q=norm(inp.value); res.innerHTML=""; hint.hidden=!!q; if(q.length<2) return;
    var hits=U.filter(function(u){return u.n.indexOf(q)>=0}).sort(function(a,b){return (b.nt.indexOf(q)>=0)-(a.nt.indexOf(q)>=0)}).slice(0,40);
    if(!hits.length){res.appendChild(H("li","us-none","Nothing found. Maybe it'll unlock in the next episodes 👀")); return}
    hits.forEach(function(u){
      var li=H("li"), b=H("button","us-item"); b.type="button";
      var src=u.person?(u.facts.filter(function(f){return norm(f[1]).indexOf(q)>=0}).map(function(f){return f[1]})[0]||u.role):u.text;
      b.innerHTML='<span class="us-type">'+esc(u.type)+'</span><b>'+esc(u.title)+'</b><span class="us-snip">'+snip(src,q)+'</span>';
      b.onclick=function(){close(); openTab(u.tab);
        setTimeout(function(){
          if(u.person){var c=document.querySelector('#people [data-id="'+u.person+'"], #people-past [data-id="'+u.person+'"]'); if(c){goTo(c); flash(c)} if(window.SF&&SF.person) setTimeout(function(){SF.person(u.person)},RM?0:450); return}
          var el=u.el; if(el.tagName==="ARTICLE"&&!el.classList.contains("open")){var hd=el.querySelector(".th-head"); if(hd) hd.click()}
          if(el.tagName==="DETAILS") el.open=true;
          goTo(el); flash(el)},80)};
      li.appendChild(b); res.appendChild(li)});
  }
  setTimeout(function(){inp.focus()},50);
}
sb.onclick=search;
addEventListener("keydown",function(e){if((e.key==="/"&&!/input|textarea/i.test((document.activeElement||{}).tagName||""))||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k")){e.preventDefault(); search()}});

/* ---------- 3. метки «новое» с прошлого визита ---------- */
var SK="sentfor_seen", seen=ls(SK), first=!seen; seen=seen||{};
var news={}, pnews={};
function scan(){
  news={}; pnews={};
  units().forEach(function(u){
    if(u.person){
      var fk=(u.allFacts||[]).map(function(f){return "f:"+u.person+":"+hsh(norm(f[1]))});
      if(first){seen[u.key]=1; fk.forEach(function(k){seen[k]=1}); return}
      if(u.locked) return;
      var vis=(u.allFacts||[]).filter(function(f){return f[0]<=rd()}).map(function(f){return "f:"+u.person+":"+hsh(norm(f[1]))});
      if(!seen[u.key]) pnews[u.person]="new"; else {var n=vis.filter(function(k){return !seen[k]}).length; if(n) pnews[u.person]=n}
      return}
    if(first){seen[u.key]=1; return}
    if(!u.locked&&!seen[u.key]) (news[u.tab]=news[u.tab]||[]).push(u);
  });
  if(first){ls(SK,seen); first=false}
  paintNew();
}
function paintNew(){
  document.querySelectorAll(".ui-new").forEach(function(e){e.classList.remove("ui-new")});
  tabs.querySelectorAll(".tab[data-new]:not(.pp-tabbtn)").forEach(function(t){t.removeAttribute("data-new")});
  Object.keys(news).forEach(function(t){news[t].forEach(function(u){u.el.classList.add("ui-new")}); var tb=tabs.querySelector('.tab[data-tab="'+t+'"]'); if(tb) tb.setAttribute("data-new",news[t].length)});
  var pn=Object.keys(pnews).length; var pt=tabs.querySelector('.tab[data-tab="people"]'); if(pt&&pn) pt.setAttribute("data-new",pn);
  paintPeople();
}
function paintPeople(){
  document.querySelectorAll("#people .person, #people-past .person").forEach(function(c){
    var id=c.getAttribute("data-id"), v=id&&pnews[id], old=c.querySelector(".ui-pnew"); if(old) old.remove(); c.classList.toggle("ui-new",!!v);
    if(v){var s=H("span","ui-pnew",v==="new"?"new":"+"+v+" "+(v===1?"fact":v<5?"facts":"facts")); c.appendChild(s)}});
}
/* увиденным считается то, что было на открытой вкладке хотя бы 3 секунды */
function markTab(t){
  if(t==="people"){var P=window.SF&&SF.people?SF.people():[]; P.forEach(function(p){if(p.ep>rd()) return; seen["p:"+p.id]=1; (p.f||[]).forEach(function(f){if(f[0]<=rd()) seen["f:"+p.id+":"+hsh(norm(f[1]))]=1})})}
  else (news[t]||[]).forEach(function(u){seen[u.key]=1});
  ls(SK,seen);
}
var mt=0; function cur(){var b=tabs.querySelector('.tab[aria-selected="true"]'); return b&&b.getAttribute("data-tab")}
function arm(){clearTimeout(mt); var t=cur(); if(t) mt=setTimeout(function(){markTab(t)},3000)}
tabs.addEventListener("click",function(e){if(e.target.closest(".tab[data-tab]")) setTimeout(arm,50)});
var pg=document.getElementById("people"); if(pg) new MutationObserver(paintPeople).observe(pg,{childList:true});
if(epn) new MutationObserver(function(){setTimeout(scan,60)}).observe(epn,{childList:true,characterData:true,subtree:true});
function boot(){scan(); arm()}
if(document.readyState==="complete") setTimeout(boot,300); else addEventListener("load",function(){setTimeout(boot,300)});
window.SFseenReset=function(){try{localStorage.removeItem(SK)}catch(e){}};

/* ---------- кнопка «назад» на телефоне закрывает окно, а не уходит с сайта ---------- */
var OV=".me-sheet, #pmodal:not([hidden]), .vhs:not([hidden]), .sphone:not([hidden]), .smap-lb:not([hidden]), .smap-card:not([hidden]), .ui-search, .f13-arch, .f13-desk, .pp-del, .hwg:not([hidden]), .pr-ov";
var pushed=false, skip=0, ovT=0;
function ppOpen(){var r=document.querySelector(".pp"); return r&&!r.hidden}
function openOv(){return ppOpen()||document.querySelector(".inv-wrap.full, .gz-reader")?null:document.querySelector(OV)}
function syncOv(){clearTimeout(ovT); ovT=setTimeout(function(){
  var o=openOv();
  if(o&&!pushed){try{history.pushState({ui:1},""); pushed=true}catch(e){}}
  else if(!o&&pushed&&history.state&&history.state.ui){pushed=false; skip++; try{history.back()}catch(e){skip--}}
},60)}
new MutationObserver(syncOv).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["hidden"]});
addEventListener("popstate",function(){
  if(skip){skip--; return}
  if(!pushed) return; pushed=false;
  var o=openOv(); if(!o) return;
  var x=o.querySelector('.pm-close, .me-x, .us-x, .f13-x, .vhs-x, [aria-label="Close"], [aria-label="Close photo"]');
  if(x) x.click(); else document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
});
addEventListener("load",function(){setTimeout(function(){document.body.classList.add("bgm")},2500)});
/* плавная загрузка: запоминаем место на странице, после обновления возвращаем и показываем */
function curTab(){var b=tabs.querySelector('.tab[aria-selected="true"]'); return b&&b.getAttribute("data-tab")||""}
addEventListener("pagehide",function(){try{sessionStorage.setItem("sentfor_y",JSON.stringify({y:Math.round(scrollY),t:curTab()}))}catch(e){}});
setTimeout(function(){
  var d=document.documentElement, done=false;
  function show(){if(done) return; done=true;
    var s=window.SFy; if(s&&s.t===curTab()&&!/^#./.test(location.hash)) window.scrollTo(0,Math.min(s.y,document.documentElement.scrollHeight));
    requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.remove("ld","ld-all")})})}
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(show); setTimeout(show,450);
},0);
})();
