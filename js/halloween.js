/* Хэллоуин: гирлянда, паук, охота на пять тыкв. Само выключается 9 ноября 2026 (последний день — 8 ноября) */
(function(){
var END=new Date(2026,10,9,0,0,0);
if(new Date()>=END&&!/[?&]halloween/.test(location.search)) return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches, NS="http://www.w3.org/2000/svg";
function S(t,a){var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); return e}
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
document.body.classList.add("hw");
/* /#tykvy — сбросить найденные тыквы и кровавую луну (для проверки) */
if(location.hash==="#tykvy"){try{localStorage.removeItem("sentfor_pumpkins"); localStorage.removeItem("sentfor_bloodmoon")}catch(e){} history.replaceState(null,"",location.pathname+location.search)}
addEventListener("hashchange",function(){if(location.hash==="#tykvy"){try{localStorage.removeItem("sentfor_pumpkins"); localStorage.removeItem("sentfor_bloodmoon")}catch(e){} location.replace(location.pathname+location.search)}});

/* тыква: общая отрисовка для гирлянды и охоты */
function pkPath(s){return "M"+(-s*.5)+" "+(-s*.12)+"l"+(s*.2)+" "+(-s*.28)+"l"+(s*.2)+" "+(s*.28)+"z M"+(s*.1)+" "+(-s*.12)+"l"+(s*.2)+" "+(-s*.28)+"l"+(s*.2)+" "+(s*.28)+"z M"+(-s*.55)+" "+(s*.18)+"q"+(s*.55)+" "+(s*.5)+" "+(s*1.1)+" 0 l"+(-s*.22)+" "+(s*.08)+" l"+(-s*.1)+" "+(-s*.12)+" l"+(-s*.12)+" "+(s*.12)+" l"+(-s*.12)+" "+(-s*.12)+" l"+(-s*.1)+" "+(s*.12)+"z"}
function pumpkin(x,y,s,i){
  var g=S("g",{"class":"hw-pk",transform:"translate("+x+","+y+")",style:"--d:"+(i*0.37%2.2).toFixed(2)+"s"});
  g.appendChild(S("line",{x1:0,y1:-s*1.15,x2:0,y2:-s*.75,stroke:"#3d4a2c","stroke-width":1.4}));
  g.appendChild(S("ellipse",{"class":"b",cx:0,cy:0,rx:s,ry:s*.82}));
  g.appendChild(S("ellipse",{"class":"r",cx:-s*.42,cy:0,rx:s*.38,ry:s*.8}));
  g.appendChild(S("ellipse",{"class":"r",cx:s*.42,cy:0,rx:s*.38,ry:s*.8}));
  g.appendChild(S("rect",{x:-s*.14,y:-s*1.05,width:s*.28,height:s*.32,rx:1,fill:"#4a5a32"}));
  g.appendChild(S("path",{"class":"f",d:pkPath(s)}));
  return g}

/* подпись под «Дело № ТС2» */
var cs=document.querySelector("header .case"), tag=null, cnt=null;
if(cs){tag=H("div","hw-tag","Счастливого Хэллоуина"); cs.parentNode.insertBefore(tag,cs.nextSibling)}
/* счётчик тыкв: плашка рядом с «Пасхалками» */
var row=document.querySelector("header .hdr-row"), pkIc=[];
if(row){cnt=H("div","hw-meter"); cnt.setAttribute("role","status");
  var ml=H("span","hm-lbl","Найди 5 тыкв"), mb=H("b",""), mi=H("span","hm-pk"), mn=H("span","hm-note","до 8 ноября");
  for(var q=0;q<5;q++){var sv0=S("svg",{viewBox:"-12 -14 24 26","aria-hidden":"true"}); sv0.appendChild(pumpkin(0,0,10,q)); mi.appendChild(sv0); pkIc.push(sv0)}
  cnt.appendChild(ml); cnt.appendChild(mb); cnt.appendChild(mi); cnt.appendChild(mn); row.appendChild(cnt)}

/* гирлянда */
var gar=H("div","hw-garland"); gar.setAttribute("aria-hidden","true"); document.body.insertBefore(gar,document.body.firstChild);
function drawGarland(){
  var W=document.documentElement.clientWidth, n=Math.max(4,Math.min(13,Math.round(W/(W<600?95:110)))), sag=W<600?14:24;
  var sv=S("svg",{width:W,height:70,viewBox:"0 0 "+W+" 70"}), d="M-10 6", pts=[];
  for(var i=0;i<n;i++){var x0=W*i/n-10, x1=W*(i+1)/n+10, mx=(x0+x1)/2; d+=" Q"+mx+" "+(6+sag*2)+" "+x1+" 6"; pts.push([mx,6+sag])}
  sv.appendChild(S("path",{d:d,fill:"none",stroke:"#2b2f26","stroke-width":1.6}));
  pts.forEach(function(p,i){sv.appendChild(pumpkin(p[0],p[1]+(W<600?15:12),W<600?12:10,i))});
  gar.innerHTML=""; gar.appendChild(sv)}
drawGarland(); var rz; addEventListener("resize",function(){clearTimeout(rz); rz=setTimeout(drawGarland,200)});

/* кровавая луна после всех тыкв */
var BL="sentfor_bloodmoon"; try{if(localStorage.getItem(BL)==="1") document.body.classList.add("hw-blood")}catch(e){}

/* паутина с пауком */
var web=H("div","hw-web"); web.setAttribute("aria-hidden","true");
var ws=S("svg",{viewBox:"0 0 120 120",width:120,height:120}), wp="";
for(var a=0;a<=90;a+=15){var r=a*Math.PI/180; wp+="M120 0 L"+(120-Math.sin(r)*120).toFixed(1)+" "+(Math.cos(r)*120).toFixed(1)+" "}
[28,50,74,100].forEach(function(R){var s="";for(var a=0;a<=90;a+=15){var r=a*Math.PI/180,x=120-Math.sin(r)*R,y=Math.cos(r)*R;s+=(a?" Q"+(120-Math.sin(r-.13)*R*.9).toFixed(1)+" "+(Math.cos(r-.13)*R*.9).toFixed(1)+" ":"M")+x.toFixed(1)+" "+y.toFixed(1)} wp+=s+" "});
ws.appendChild(S("path",{d:wp,fill:"none",stroke:"rgba(220,226,235,.32)","stroke-width":.7}));
web.appendChild(ws); document.body.appendChild(web);
var sp=H("button","hw-spider"); sp.type="button"; sp.setAttribute("aria-label","Паук на паутине");
sp.innerHTML='<i class="th"></i><svg viewBox="0 0 40 34" aria-hidden="true"><g stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"><path d="M14 14 Q6 6 2 10M14 17 Q5 15 1 20M15 20 Q7 24 4 30M16 22 Q11 28 10 33M26 14 Q34 6 38 10M26 17 Q35 15 39 20M25 20 Q33 24 36 30M24 22 Q29 28 30 33"/></g><ellipse cx="20" cy="20" rx="7" ry="8" fill="#141414"/><circle cx="20" cy="11" r="4.5" fill="#1b1b1b"/><circle cx="18.4" cy="10.4" r="1" fill="#ff5a3c"/><circle cx="21.6" cy="10.4" r="1" fill="#ff5a3c"/></svg>';
web.appendChild(sp);
var away=false;
sp.addEventListener("click",function(){if(away) return; away=true; sp.classList.add("up"); setTimeout(function(){sp.classList.remove("up"); away=false},RM?2000:7000)});

/* охота: три тыквы спрятаны на сайте */
var PK="sentfor_pumpkins", got={}; try{got=JSON.parse(localStorage.getItem(PK)||"{}")||{}}catch(e){}
var SPOTS=[["tab-people","p1","Первая тыква. Где-то спрятаны ещё четыре."],["torch","p2","В темноте и не такое найдёшь."],["tab-evidence","p4","Затесалась среди улик."],["tab-theories","p3","Нашлась среди теорий."],["tab-ts1","p5","Эта прикатилась из 1986 года."]];
function nGot(){return SPOTS.filter(function(s){return got[s[1]]}).length}
var TOT=SPOTS.length;
function upd(){if(!cnt) return; var n=nGot(), done=n===TOT;
  cnt.querySelector(".hm-lbl").textContent=done?"Все тыквы найдены":"Найди "+TOT+" тыкв"; cnt.querySelector("b").textContent=n+" / "+TOT;
  pkIc.forEach(function(e,i){e.classList.toggle("on",i<n)}); cnt.classList.toggle("done",done);
  var old=cnt.querySelector(".hw-reset"); if(old) old.remove();
  if(done){var r=H("button","hw-reset","искать заново"); r.type="button"; r.onclick=function(){try{localStorage.removeItem(PK); localStorage.removeItem(BL)}catch(e){} location.reload()}; cnt.appendChild(r)}}
upd();
function toast(title,msg){var t=H("div","toast hw-toast"); t.setAttribute("role","status"); t.appendChild(H("b","",title)); t.appendChild(document.createTextNode(msg)); document.body.appendChild(t); setTimeout(function(){t.remove()},4200)}
SPOTS.forEach(function(s){
  var host=document.getElementById(s[0]); if(!host) return;
  var b=H("button","hw-hunt "+s[1]+(got[s[1]]?" got":"")); b.type="button"; b.setAttribute("aria-label","Тыква");
  var sv=S("svg",{viewBox:"-14 -16 28 28"}); sv.appendChild(pumpkin(0,0,11,0)); b.appendChild(sv); host.appendChild(b);
  b.addEventListener("click",function(){
    b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    if(got[s[1]]) return; got[s[1]]=1; try{localStorage.setItem(PK,JSON.stringify(got))}catch(e){} b.classList.add("got"); upd();
    var n=nGot(); if(n===TOT) finale(); else toast("Тыква "+n+" из "+TOT,s[2])})});

/* все тыквы: над Сентфором встаёт кровавая луна */
function finale(){
  var o=H("div","hw-fin"); o.setAttribute("role","dialog"); o.setAttribute("aria-modal","true"); o.setAttribute("aria-label","Кровавая луна");
  o.innerHTML='<div class="fin-bg"></div>'+
    '<div class="fin-txt"><b>Кровавая луна над Сентфором</b><p>Ты нашёл(а) все пять тыкв. Говорят, когда луна краснеет, тени в Сентфоре выходят на улицы. А тыквы смотрят их глазами.</p><p class="fin-s">До 8 ноября тыквы на сайте будут смотреть белыми глазами.</p><button type="button">Посмотреть</button></div>';
  document.body.appendChild(o); document.body.classList.add("noscroll");
  requestAnimationFrame(function(){requestAnimationFrame(function(){o.classList.add("on")})});
  var bt=o.querySelector("button"); setTimeout(function(){bt.focus()},400);
  function done(){document.body.classList.remove("noscroll"); o.classList.remove("on"); document.body.classList.add("hw-blood"); try{localStorage.setItem(BL,"1")}catch(e){} setTimeout(function(){o.remove()},700); window.scrollTo({top:0,behavior:RM?"auto":"smooth"})}
  bt.onclick=done; o.addEventListener("keydown",function(e){if(e.key==="Escape") done()})}
/* хэллоуинские портреты в «Людях» и в досье (до 8 ноября) */
/* Надин: костюм по внешности (ea…), цвет волос не важен. у Декса две внешности: зачёсанные волосы (dex_1) и растрёпанная чёлка (dex_2, она же по умолчанию) */
var COSTUME={"dex":"img/hw_dex.webp","dex_1":"img/hw_dex_1.webp","dex_2":"img/hw_dex.webp","howard":"img/hw_howard.webp","nadin_ea":"img/hw_nadin_ea2.webp","nadin_eu":"img/hw_nadin_eu.webp","nadin_af":"img/hw_nadin_af.webp","nadin_la":"img/hw_nadin_la.webp","rudi":"img/hw_rudi.webp","poppy":"img/hw_poppy.webp","darren":"img/hw_darren.webp","alice":"img/hw_alice.webp","brother_ea":"img/hw_brother_ea.webp","brother_eu":"img/hw_brother_eu.webp","brother_la":"img/hw_brother_la.webp","brother_af":"img/hw_brother_af.webp","olivia":"img/hw_olivia.webp","abigail":"img/hw_abigail.webp","liam":"img/hw_liam.webp","ted":"img/hw_ted.webp"};
function costume(){
  document.querySelectorAll("#tab-people .person .pol img, #pm-body .pm-pol img").forEach(function(im){
    var m=(im.getAttribute("src")||"").match(/img\/([a-z0-9_]+)\.webp$/); if(!m) return; var k=m[1], c=COSTUME[k]||COSTUME[k.replace(/_(black|blond|brown|red)$/,"")]; if(c) im.src=c})}
costume(); new MutationObserver(costume).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["src"]});
})();
