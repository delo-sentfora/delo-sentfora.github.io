/* Школьная газета Надин «Тени Сентфора»: выпуски, которые листаются как настоящая газета.
   Пока тестовая: видна только после ?gazeta (выключить: ?gazeta=0). */
(function(){
var TK="sentfor_gztest";
try{if(/[?&]gazeta=0\b/.test(location.search)) localStorage.removeItem(TK); else if(/[?&]gazeta\b/.test(location.search)) localStorage.setItem(TK,"1")}catch(e){}
var on=false; try{on=localStorage.getItem(TK)==="1"}catch(e){}
var tabBtn=document.querySelector('.tab[data-tab="gazeta"]'), sec=document.getElementById("tab-gazeta");
if(!on){if(tabBtn) tabBtn.remove(); if(sec) sec.remove(); return}
if(tabBtn) tabBtn.hidden=false;

/* ---------- выпуски ---------- */
var IMG="img/";
function ph(src,cap,cls){return '<figure class="gz-ph '+(cls||"")+'"><img src="'+IMG+src+'" alt="" loading="lazy">'+(cap?'<figcaption>'+cap+'</figcaption>':'')+'</figure>'}
var ISSUES=[
{n:1,ep:1,date:"Friday, October 17",cover:"school_hall.webp",title:"Forty minutes in the dark",pages:[
/* 1 — обложка */
'<div class="gz-mast"><div class="gz-mast-top"><span>School newspaper</span><span>Saintfour High</span></div><h1>Shadows of Saintfour</h1><div class="gz-mast-bot"><span>Issue No. 1</span><span>Friday, October 17</span></div></div>'+
'<div class="gz-kick">School</div><h2 class="gz-lead">Forty minutes in the dark</h2>'+ph("school_hall.webp","The second-floor hallway after the blackout","gz-wide gz-cover")+
'<p class="gz-drop">On Wednesday at 11:42 the power went out in the whole school. The administration hasn\'t named the cause yet.</p>',
/* 2 */
'<div class="gz-sec">Opinion</div><h3 class="gz-big">A word from the editor</h3>'+
'<p class="gz-drop">The school paper is back. We write about what\'s happening at school and in town, honestly and without rumors.</p><p class="gz-sign">N. Ross, editor-in-chief</p>'+
'<hr class="gz-rule"><div class="gz-sec">School</div><h3>Pink smoke in chemistry</h3>'+ph("gossip/chem.webp","Evacuation from the chemistry lab","gz-mid")+
'<p>On Thursday, chemistry class ended in an evacuation. No one was hurt.</p>',
/* 3 */
'<div class="gz-sec">Announcements</div><div class="gz-ads">'+
'<div><b>Found:</b> a shoe, left one. Pick it up at the newsroom.</div>'+
'<div><b>The library</b>is open until 5 PM.</div>'+
'<div><b>The photo club</b>is looking for newcomers.</div>'+
'<div class="hl"><b>The paper needs</b>writers and photographers.</div>'+
'</div><hr class="gz-rule"><div class="gz-sec">Town</div><h3>Saintfour Diner</h3>'+ph("gossip/diner.webp","After school, 4:30 PM","gz-mid")+
'<div class="gz-score">Editors\' rating<b>4 / 5</b></div>',
/* 4 — последняя */
'<div class="gz-sec">Photo of the week</div>'+ph("gossip/corridor.webp","Monday, 8:05 AM","gz-full")+
'<div class="gz-imprint"><h4>Shadows of Saintfour</h4><p><b>Editors:</b> Nadine Ross, Miranda Martinez</p></div>'
]}
];

/* ---------- раздел со списком выпусков ---------- */
function R(){return window.SF?SF.read:19}
var list=document.getElementById("gz-list");
function paintList(){
  if(!list) return; list.innerHTML="";
  var vis=ISSUES.filter(function(x){return x.ep<=R()});
  if(!vis.length){list.innerHTML='<p class="gz-none">The first issue unlocks after episode 1.</p>'; return}
  vis.forEach(function(x){var b=document.createElement("button"); b.type="button"; b.className="gz-card";
    b.innerHTML='<div class="gz-mini"><div class="gz-mini-m">Shadows of Saintfour</div><img src="'+IMG+x.cover+'" alt=""><div class="gz-mini-h">'+x.title+'</div></div><b>Issue No.'+x.n+'</b><span>'+x.date+'</span>';
    b.onclick=function(){open(x)}; list.appendChild(b)})}
paintList();

/* ---------- читалка ---------- */
var BW=340, BH=500;               /* размер страницы в «газетных» пикселях, дальше масштабируем под экран */
var rd=null;
function el(t,c,h){var e=document.createElement(t); if(c) e.className=c; if(h!=null) e.innerHTML=h; return e}
function loadFonts(){if(document.getElementById("gz-fonts")) return; var l=document.createElement("link"); l.id="gz-fonts"; l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap"; document.head.appendChild(l)}

function open(iss){
  loadFonts(); close(true);
  var o=el("div","gz-reader"); o.setAttribute("role","dialog"); o.setAttribute("aria-label","The “Shadows of Saintfour” newspaper, issue No."+iss.n);
  var top=el("div","gz-top"), stage=el("div","gz-stage"), book=el("div","gz-book"), bot=el("div","gz-bot");
  var x=el("button","gz-x","✕"); x.type="button"; x.setAttribute("aria-label","Close the newspaper"); x.onclick=function(){close()};
  top.appendChild(el("b","","Shadows of Saintfour · No."+iss.n)); top.appendChild(x);
  var prev=el("button","gz-nav p","‹"), next=el("button","gz-nav n","›"), cnt=el("span","gz-cnt","");
  prev.type=next.type="button"; prev.setAttribute("aria-label","Back"); next.setAttribute("aria-label","Next");
  bot.appendChild(prev); bot.appendChild(cnt); bot.appendChild(next);
  stage.appendChild(book); o.appendChild(top); o.appendChild(stage); o.appendChild(bot);
  var hint=el("div","gz-hint","Swipe or use the arrows"); stage.appendChild(hint);
  document.body.appendChild(o); document.documentElement.classList.add("gz-lock");
  rd={o:o,iss:iss,book:book,stage:stage,cnt:cnt,prev:prev,next:next,cur:0,leaves:[],mode:null,busy:false};
  try{history.pushState({gz:1},"")}catch(e){}
  build(0); setTimeout(function(){hint.classList.add("off")},2600);
  prev.onclick=function(){turn(-1)}; next.onclick=function(){turn(1)};
  gestures(stage);
}
function close(silent){
  if(!rd) return; var o=rd.o; rd=null; o.remove(); document.documentElement.classList.remove("gz-lock");
  if(!silent&&history.state&&history.state.gz) try{history.back()}catch(e){}
}
window.addEventListener("popstate",function(){if(rd) close(true)});
window.addEventListener("keydown",function(e){if(!rd) return; if(e.key==="ArrowRight") turn(1); else if(e.key==="ArrowLeft") turn(-1); else if(e.key==="Escape") close()});
var rsz; window.addEventListener("resize",function(){if(!rd) return; clearTimeout(rsz); rsz=setTimeout(function(){build(pageNow())},150)});

function pageEl(html,i,total){
  var p=el("div","gz-page"+(i===0?" cover":""));
  if(i>0) p.appendChild(el("div","gz-run",'<span>Shadows of Saintfour</span><span>No.'+rd.iss.n+' · '+rd.iss.date+'</span>'));
  p.appendChild(el("div","gz-body",html));
  if(i>0) p.appendChild(el("div","gz-folio",String(i+1)));
  return p}

/* книга: на широком экране разворот, на телефоне по одной странице */
/* Газета всегда собрана как настоящая: листы с двумя сторонами.
   На широком экране виден разворот, на телефоне — одна страница, а «камера» переезжает между левой и правой. */
function build(keepPage){
  var pages=rd.iss.pages, N=pages.length, st=rd.stage, w=st.clientWidth-24, h=st.clientHeight-16;
  var book=w/h>1.05&&w>=700, mode=book?"book":"phone";
  var s=book?Math.min(w/(BW*2),h/BH):Math.min(w/BW,h/BH);
  rd.mode=mode; rd.s=s; var B=rd.book; B.innerHTML=""; B.className="gz-book "+mode;
  B.style.width=BW*2*s+"px"; B.style.height=BH*s+"px";
  rd.leaves=[]; var n=Math.ceil(N/2);
  for(var k=0;k<n;k++){
    var lf=el("div","gz-leaf"), f=el("div","gz-face front"), b=el("div","gz-face back"), fi=2*k, bi=2*k+1;
    var pf=pageEl(pages[fi],fi,N); f.appendChild(pf); scaleIn(pf,s);
    if(bi<N){var pb=pageEl(pages[bi],bi,N); b.appendChild(pb); scaleIn(pb,s)} else b.classList.add("blank");
    f.appendChild(el("i","gz-shade")); b.appendChild(el("i","gz-shade"));
    lf.appendChild(f); lf.appendChild(b); B.appendChild(lf); rd.leaves.push(lf)}
  var pg=Math.max(0,Math.min(N-1,keepPage||0));
  rd.p=pg; rd.cur=Math.floor((pg+1)/2);
  if(book&&pg===N-1&&N%2===0) rd.cur=n;
  B.classList.add("noanim"); place(); B.offsetWidth; B.classList.remove("noanim");
}
function scaleIn(p,s){p.style.width=BW+"px"; p.style.height=BH+"px"; p.style.transform="scale("+s+")"}
/* раскладка: перевёрнутые листы слева, остальные справа */
function place(){
  var L=rd.leaves, c=rd.cur, n=L.length, N=rd.iss.pages.length;
  L.forEach(function(lf,k){if(lf.classList.contains("moving")) return; var fl=k<c; lf.classList.toggle("fl",fl); lf.style.transform=fl?"rotateY(-180deg)":"rotateY(0deg)"; lf.style.zIndex=fl?k+1:n-k+1});
  var sh=0, label;
  if(rd.mode==="book"){if(c===0) sh=-25; else if(c===n) sh=25;
    var a=c===0?[1]:c===n?[N]:[2*c,Math.min(N,2*c+1)]; label=a.length>1?a[0]+"–"+a[1]:a[0];
    rd.prev.disabled=c===0; rd.next.disabled=c===n}
  else{sh=rd.p%2?25:-25; label=rd.p+1; rd.prev.disabled=rd.p===0; rd.next.disabled=rd.p===N-1}
  rd.book.style.setProperty("--shift",sh+"%");
  rd.cnt.textContent=label+" / "+N;
}
function pageNow(){return rd.mode==="book"?(rd.cur===0?0:Math.min(rd.iss.pages.length-1,2*rd.cur-1)):rd.p}
/* нужен ли переворот листа для шага d (на телефоне часть шагов — просто переезд к соседней странице) */
function flips(d){if(rd.mode==="book") return true; return d>0?rd.p%2===0:rd.p%2===1}
function canTurn(d){var N=rd.iss.pages.length;
  if(rd.mode==="book") return d>0?rd.cur<rd.leaves.length:rd.cur>0;
  return d>0?rd.p<N-1:rd.p>0}
function turn(d){if(!rd||rd.busy||!canTurn(d)) return;
  if(!flips(d)){rd.p+=d; place(); return}
  var k=d>0?rd.cur:rd.cur-1, lf=rd.leaves[k];
  rd.busy=true; lf.classList.add("moving","flip"); lf.style.zIndex=99; lf.offsetWidth;
  rd.cur+=d; if(rd.mode==="phone") rd.p+=d; place(); lf.style.transform=d>0?"rotateY(-180deg)":"rotateY(0deg)";
  setTimeout(function(){if(!rd) return; lf.classList.remove("moving","flip"); rd.busy=false; place()},640)}
function shade(lf,t){[].slice.call(lf.querySelectorAll(".gz-shade")).forEach(function(s){s.style.opacity=t?Math.sin(Math.PI*t)*.5:""})}

/* пальцем: тянешь страницу — она загибается за пальцем */
function gestures(st){
  var g=null;
  st.addEventListener("pointerdown",function(e){if(!rd||rd.busy||e.target.closest("button")) return; if(e.pointerType==="mouse"&&e.button>0) return;
    var r=rd.book.getBoundingClientRect(); g={x:e.clientX,y:e.clientY,t:Date.now(),side:rd.mode==="phone"?(e.clientX>st.getBoundingClientRect().left+st.clientWidth/2?1:-1):(e.clientX>r.left+r.width/2?1:-1),w:r.width/2,lf:null,d:0}; try{st.setPointerCapture(e.pointerId)}catch(x){}});
  st.addEventListener("pointermove",function(e){if(!g||!rd) return; var dx=e.clientX-g.x;
    if(!g.lf){if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(e.clientY-g.y)) return; var d=dx<0?1:-1; if(!canTurn(d)){g=null; return}
      if(!flips(d)){g.pan=d; g.lf=null; return}
      g.d=d; var k=d>0?rd.cur:rd.cur-1; g.lf=rd.leaves[k]; g.lf.classList.add("moving","drag"); g.lf.style.zIndex=99; g.lf.style.visibility="visible"}
    if(g.pan) return;
    var t=Math.max(0,Math.min(1,(g.d>0?-dx:dx)/g.w)), ang=g.d>0?-180*t:-180*(1-t);
    g.lf.style.transform="rotateY("+ang+"deg)"; g.p=t; shade(g.lf,t)});
  function up(e){if(!g||!rd){g=null; return} var gg=g; g=null;
    if(gg.pan){if(Math.abs(e.clientX-gg.x)>40) turn(gg.pan); return}
    if(!gg.lf){/* касание: справа — дальше, слева — назад */ if(Date.now()-gg.t<350&&Math.abs(e.clientX-gg.x)<8) turn(gg.side); return}
    var lf=gg.lf; lf.classList.remove("drag"); var done=gg.p>.3;
    if(done){rd.cur+=gg.d; if(rd.mode==="phone") rd.p+=gg.d} rd.busy=true;
    var endFl=gg.d>0?done:!done; lf.style.transform=endFl?"rotateY(-180deg)":"rotateY(0deg)"; shade(lf,0);
    setTimeout(function(){if(!rd) return; lf.classList.remove("moving"); rd.busy=false; place()},520)}
  st.addEventListener("pointerup",up); st.addEventListener("pointercancel",function(){if(g&&g.lf){var lf=g.lf; g=null; lf.classList.remove("drag","moving"); place()} else g=null});
}

/* смена серии: выпуски открываются по сериям */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest('.tab[data-tab="gazeta"],#ep-btns button'); if(b) setTimeout(paintList,30)});
})();
