/* vibe: морозник по краю, фонарик, Неизвестный, 02:59, Старый Сентфор, медведь */
(function(){
var NS="http://www.w3.org/2000/svg", NEP=window.SFNEP||19;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
function R(){return window.SF?SF.read:1}
function S(t,a){var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); return e}
function H(t,c,txt){var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e}
function egg(k){if(window.SFegg) window.SFegg(k)}
function flower(x,y,s,cls){var o=S("g",{transform:"translate("+x.toFixed(1)+" "+y.toFixed(1)+")"}), g=S("g",{"class":cls||""}); o.appendChild(g); o.fl=g;
  for(var i=0;i<5;i++) g.appendChild(S("ellipse",{"class":"pt",cx:0,cy:-s*.55,rx:s*.42,ry:s*.62,transform:"rotate("+(i*72)+")"}));
  g.appendChild(S("circle",{"class":"cn",r:s*.24})); return o}

/* ---------- 1. морозник растёт по краю ---------- */
var stem=document.getElementById("stem"), lastRead=0;
function drawStem(){
  if(!stem) return; var r=R(), W=stem.clientWidth, Ht=stem.clientHeight; if(!W||!Ht) return;
  var small=W<30, svg=S("svg",{viewBox:"0 0 "+W+" "+Ht,preserveAspectRatio:"xMidYMax meet"}), cx=W/2, amp=W*(small?.22:.18), top=Ht*.04, d="M"+cx+" "+Ht;
  for(var y=Ht;y>=top;y-=10){d+=" L"+(cx+Math.sin(y/95)*amp+Math.sin(y/37)*amp*.25).toFixed(1)+" "+y.toFixed(1)}
  var ghost=S("path",{"class":"st-ghost",d:d}), live=S("path",{"class":"st-live",d:d});
  svg.appendChild(ghost); svg.appendChild(live); stem.innerHTML=""; stem.appendChild(svg);
  var L=live.getTotalLength(), seg=L/NEP;
  live.style.strokeDasharray=L+" "+L;
  var prev=lastRead||0; if(prev===r) live.style.transition="none";
  live.style.strokeDashoffset=String(L-seg*prev); live.getBoundingClientRect();
  live.style.strokeDashoffset=String(L-seg*r);
  var fs=(small?7.6:9)*(Ht<520?.75:1), eps=(window.SF&&SF.eps)||{};
  for(var i=1;i<=NEP;i++){var p=live.getPointAtLength(seg*i-seg*.15), side=i%2?1:-1;
    if(i<=r){
      var lf=S("path",{"class":"leaf",d:"M"+p.x+" "+(p.y+fs*.8)+" q"+(side*fs*1.3)+" "+(-fs*.2)+" "+(side*fs*1.6)+" "+(-fs*1.3)+" q"+(-side*fs*.9)+" "+(fs*.3)+" "+(-side*fs*1.6)+" "+(fs*1.3)+"z"});
      svg.appendChild(lf);
      var f=flower(p.x+side*fs*.35,p.y,fs*(i===r?1.25:1),"fl"+(i===r?" now":""));
      if(i<=prev||RM) f.fl.style.animation="none"; else f.fl.style.animationDelay=(.25+(i-prev)*.12)+"s";
      var t=S("title",{}); t.textContent="Серия "+i+(eps[i]?": «"+eps[i]+"»":""); f.fl.appendChild(t); f.fl.insertBefore(S("circle",{"class":"hit",r:fs*1.6}),f.fl.firstChild); f.fl.addEventListener("click",touchFrost); svg.appendChild(f);
    } else svg.appendChild(S("circle",{"class":"bud",cx:p.x,cy:p.y,r:fs*.28}));
  }
  lastRead=r; stem._w=W; stem._h=Ht;
}
/* перерисовываем только когда реально изменился размер (поворот экрана), а не при каждом
   прятании адресной строки на iPhone */
var st; function stemResize(){clearTimeout(st); st=setTimeout(function(){if(!stem) return; if(stem.clientWidth===stem._w&&stem.clientHeight===stem._h) return; lastRead=R(); drawStem()},250)}
window.addEventListener("resize",stemResize); window.addEventListener("orientationchange",function(){stemResize(); setTimeout(stemResize,600)});
if(window.ResizeObserver&&stem) new ResizeObserver(stemResize).observe(stem);

/* ---------- 2. фонарик в «Необъяснимом» ---------- */
var zone=document.getElementById("torch"), veil=zone&&zone.querySelector(".torch-veil"), tbtn=document.getElementById("torch-btn");
var cx0=null, cy0=null, TK="sentfor_torch";
function torchAt(){if(!zone) return; var b=zone.getBoundingClientRect(), x=cx0==null?innerWidth/2:cx0, y=cy0==null?innerHeight*.5:cy0;
  zone.style.setProperty("--tx",(x-b.left+10)+"px"); veil.style.setProperty("--tx",(x-b.left+10)+"px"); veil.style.setProperty("--ty",(y-b.top+14)+"px");
  if(window.SFtorchHook) try{SFtorchHook(x+10,y+14,parseFloat(veil.style.getPropertyValue("--tr"))||170,zone.classList.contains("lit"))}catch(e){}}
function setLit(on){zone.classList.toggle("lit",on); setTimeout(torchAt,0); tbtn.textContent=on?"Выключить свет":"Включить свет"; tbtn.setAttribute("aria-pressed",String(on)); try{localStorage.setItem(TK,on?"1":"0")}catch(e){}}
if(zone){
  var lit=false; try{lit=localStorage.getItem(TK)==="1"}catch(e){} setLit(lit);
  tbtn.onclick=function(){setLit(!zone.classList.contains("lit"))};
  /* на планшете круг света больше, иначе на большом экране он теряется */
  function torchR(){var touch=matchMedia("(hover:none)").matches, m=Math.min(innerWidth,innerHeight); veil.style.setProperty("--tr",(touch&&innerWidth>700?Math.round(Math.max(200,m*.34)):(innerWidth<=700?165:175))+"px")}
  torchR(); addEventListener("resize",torchR); addEventListener("orientationchange",function(){setTimeout(torchR,300)});
  addEventListener("pointermove",function(e){if(e.pointerType==="mouse"){cx0=e.clientX; cy0=e.clientY; torchAt()}},{passive:true});
  /* на телефоне: фонарик держится в середине экрана и плавно едет за прокруткой,
     а короткое нажатие переводит свет туда, куда нажали */
  if(matchMedia("(hover:none)").matches){
    var tx=innerWidth/2, ty=innerHeight*.45, gx=tx, gy=ty, moved=false, sx=0, sy=0, raf2=0, lastTap=0;
    function anim(){cx0+= (gx-cx0)*.18; cy0+=(gy-cy0)*.18; torchAt(); if(Math.abs(gx-cx0)>.5||Math.abs(gy-cy0)>.5) raf2=requestAnimationFrame(anim); else raf2=0}
    function go(x,y){gx=x; gy=y; if(!raf2) raf2=requestAnimationFrame(anim)}
    cx0=tx; cy0=ty;
    addEventListener("touchstart",function(e){var t=e.touches[0]; sx=t.clientX; sy=t.clientY; moved=false},{passive:true});
    var held=false;
    addEventListener("touchmove",function(e){var t=e.touches[0]; if(Math.abs(t.clientX-sx)+Math.abs(t.clientY-sy)>10) moved=true;
      /* на планшете свет идёт за пальцем, пока его держишь */
      if(innerWidth>700&&zone.contains(e.target)){held=true; lastTap=Date.now(); go(t.clientX,t.clientY)}},{passive:true});
    addEventListener("touchend",function(e){var t=e.changedTouches[0]; if((!moved||held)&&zone.contains(e.target)){lastTap=Date.now()+(held?1500:0); go(t.clientX,t.clientY)} held=false},{passive:true});
    addEventListener("scroll",function(){if(Date.now()-lastTap>400) go(innerWidth/2,innerHeight*.45); else torchAt()},{passive:true});
  } else {
    addEventListener("touchstart",function(e){var t=e.touches[0]; cx0=t.clientX; cy0=t.clientY; torchAt()},{passive:true});
    addEventListener("touchmove",function(e){var t=e.touches[0]; cx0=t.clientX; cy0=t.clientY; torchAt()},{passive:true});
  }
  addEventListener("scroll",torchAt,{passive:true});
  zone.addEventListener("focusin",function(e){var b=e.target.getBoundingClientRect(); cx0=b.left+b.width/2; cy0=b.top+b.height/2; torchAt()});
  torchAt();
  /* фонарик иногда мигает */
  (function flick(){setTimeout(function(){if(!RM&&!document.body.classList.contains("rune-on")&&!zone.classList.contains("lit")&&!zone.closest("[hidden]")){var base=parseFloat(veil.style.getPropertyValue("--tr"))||170, seq=[.35,1,.2,.9,1], i=0;
    (function step(){if(i>=seq.length){veil.style.setProperty("--tr",base+"px"); return} veil.style.setProperty("--tr",(base*seq[i++])+"px"); setTimeout(step,70)})()} flick()},9000+Math.random()*14000)})();
}

/* ---------- 7. розовый медведь ---------- */
var bear=document.getElementById("bear"), actx=null, talking=false;
function curve(k){var n=2048,c=new Float32Array(n);for(var i=0;i<n;i++){var x=i*2/n-1;c[i]=(1+k)*x/(1+k*Math.abs(x))}return c}
function bearVoice(){
  var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return 0;
  try{actx=actx||new AC(); if(actx.state==="suspended") actx.resume()}catch(e){return 0}
  var c=actx, t0=c.currentTime+.06;
  var out=c.createGain(); out.gain.value=.5;
  var sh=c.createWaveShaper(); sh.curve=curve(24);
  var hp=c.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=420;
  var lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=2900;
  sh.connect(hp); hp.connect(lp); lp.connect(out); out.connect(c.destination);
  var nb=c.createBuffer(1,c.sampleRate*3,c.sampleRate), nd=nb.getChannelData(0); for(var i=0;i<nd.length;i++) nd[i]=Math.random()*2-1;
  /* мотор */
  var mo=c.createOscillator(), mg=c.createGain(); mo.type="square"; mo.frequency.value=52; mg.gain.value=0; mo.connect(mg); mg.connect(sh);
  mg.gain.setValueAtTime(.025,t0); mg.gain.setValueAtTime(0,t0+2.7); mo.start(t0); mo.stop(t0+2.8);
  /* слоги: [время, длит, F1, F2, тон] */
  var syl=[[0,.32,780,1250,182],[.62,.3,330,1400,168],[1.55,.36,760,1350,138]];
  syl.forEach(function(s){var st=t0+s[0], o=c.createOscillator(); o.type="sawtooth";
    o.frequency.setValueAtTime(s[4],st); for(var j=1;j<8;j++) o.frequency.setValueAtTime(s[4]*(1+(Math.random()-.5)*.16),st+j*.045); o.frequency.linearRampToValueAtTime(s[4]*.78,st+s[1]);
    var v=c.createOscillator(), vg=c.createGain(); v.frequency.value=6; vg.gain.value=7; v.connect(vg); vg.connect(o.frequency);
    var g=c.createGain(); g.gain.setValueAtTime(0,st); g.gain.linearRampToValueAtTime(.9,st+.03); g.gain.setValueAtTime(.8,st+s[1]-.06); g.gain.linearRampToValueAtTime(0,st+s[1]);
    [[s[2],7,1],[s[3],9,.55]].forEach(function(F){var bp=c.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=F[0]; bp.Q.value=F[1]; var fg=c.createGain(); fg.gain.value=F[2]*3; o.connect(bp); bp.connect(fg); fg.connect(g)});
    g.connect(sh); o.start(st); v.start(st); o.stop(st+s[1]+.02); v.stop(st+s[1]+.02)});
  /* хрип и треск */
  var ns=c.createBufferSource(); ns.buffer=nb; var nh=c.createBiquadFilter(); nh.type="bandpass"; nh.frequency.value=2400; nh.Q.value=.6; var ng=c.createGain(); ng.gain.value=0;
  ns.connect(nh); nh.connect(ng); ng.connect(sh);
  for(var k=0;k<46;k++){var tt=t0+Math.random()*2.6; ng.gain.setValueAtTime(Math.random()*.5,tt); ng.gain.setValueAtTime(0,tt+.008+Math.random()*.03)}
  syl.forEach(function(s){ng.gain.setValueAtTime(.12,t0+s[0]); ng.gain.setValueAtTime(0,t0+s[0]+s[1])});
  ns.start(t0); ns.stop(t0+2.8);
  return 1;
}
if(bear){
  bear.onclick=function(){if(talking) return; talking=true; bear.classList.add("talk");
    var say=H("div","bear-say"); bear.parentNode.appendChild(say); bearVoice();
    var parts=[[60,"я…"],[680,"лю…"],[1150,"<i>кх…</i>"],[1610,"…бя"]];
    parts.forEach(function(p){setTimeout(function(){say.innerHTML+=(say.innerHTML?" ":"")+p[1]},p[0])});
    setTimeout(function(){bear.classList.remove("talk"); talking=false; setTimeout(function(){say.remove()},1600); egg("bear")},2700)};
}

/* ---------- 2b. Неизвестный пишет ---------- */
var UK="sentfor_unk", unkDone=false, seen=0, unk=null, away=false;
/* сообщение показывается, пока пасхалка не получена: если нажали «Ничего.» или закрыли — оно вернётся в следующий раз */
try{unkDone=!!(JSON.parse(localStorage.getItem("sentfor_eggs_v2")||"{}")||{}).unk}catch(e){}
function unkClose(){if(!unk) return; var u=unk; unk=null; u.remove()}
function unkVanish(text){if(!unk) return; var u=unk; unk=null; u.classList.add("gone"); setTimeout(function(){u.classList.remove("gone"); u.innerHTML=""; u.appendChild(H("div","unk-del",text)); setTimeout(function(){u.style.transition="opacity 1s"; u.style.opacity="0"; setTimeout(function(){u.remove()},1000)},2600)},700)}
function showUnk(){
  unkDone=true;
  unk=H("div","unk"); unk.setAttribute("role","dialog"); unk.setAttribute("aria-label","Сообщение от Неизвестного"); unk.setAttribute("aria-live","polite");
  var top=H("div","unk-top"); top.appendChild(H("span","unk-name","Неизвестный")); var x=H("button","unk-x","×"); x.type="button"; x.setAttribute("aria-label","Закрыть"); x.onclick=unkClose; top.appendChild(x);
  var body=H("div","unk-body"), dots=H("div","unk-b unk-dots"); dots.innerHTML="<span></span><span></span><span></span>"; body.appendChild(dots);
  unk.appendChild(top); unk.appendChild(body); document.body.appendChild(unk);
  setTimeout(function(){if(!unk) return; dots.remove(); var pb=H("div","unk-b pic"), im=new Image(); im.src="img/unknown.webp"; im.alt="Фото со спины в тёмном коридоре"; pb.appendChild(im); body.appendChild(pb);
    setTimeout(function(){if(!unk) return; body.appendChild(H("div","unk-b","Он тебя нашёл."));
      var acts=H("div","unk-acts"), b1=H("button","","Ничего."), b2=H("button","","(Отправить текстовое сообщение.)"); b1.type=b2.type="button";
      b1.onclick=function(){unkVanish("Сообщения исчезли.")};
      b2.onclick=function(){acts.remove(); var f=H("form"), inp=H("input"), sb=H("button","","→"); inp.placeholder="Кто ты?"; inp.setAttribute("aria-label","Ответ Неизвестному"); sb.type="submit"; sb.setAttribute("aria-label","Отправить"); f.appendChild(inp); f.appendChild(sb); unk.appendChild(f); inp.focus();
        f.onsubmit=function(e){e.preventDefault(); var v=inp.value.trim()||"Кто ты?"; f.remove(); body.appendChild(H("div","unk-b me",v)); setTimeout(function(){body.appendChild(H("div","unk-st","не доставлено")); setTimeout(function(){unkVanish("Переписка удалена."); setTimeout(function(){egg("unk")},2200)},1400)},900)}};
      acts.appendChild(b1); acts.appendChild(b2); unk.appendChild(acts)},1100)},2200);
}
document.addEventListener("visibilitychange",function(){if(document.hidden){away=true} else if(away&&unk){unkVanish("Пока тебя не было, сообщения исчезли.")}});
setInterval(function(){if(document.hidden||unkDone) return; if(R()<4) return; seen+=5; if(seen>=60) showUnk()},5000);

/* ---------- 3. 02:59 ---------- */
var vt=document.querySelector(".vcr-time"), fired=false;
function pad(n){return (n<10?"0":"")+n}
function tick(){var d=new Date(), on=(d.getHours()===2&&d.getMinutes()===59)||location.hash==="#0259";
  document.body.classList.toggle("t259",on); if(on&&!fired){fired=true; setTimeout(function(){egg("h0259")},1800)}}
tick(); setInterval(tick,5000); addEventListener("hashchange",tick);
(function slip(){setTimeout(function(){if(vt&&!document.hidden&&!document.body.classList.contains("t259")&&!document.body.classList.contains("rune-on")){var d=new Date(); vt.innerHTML=pad(d.getHours())+"<i>:</i>"+pad(d.getMinutes()); vt.classList.add("slip");
  setTimeout(function(){vt.innerHTML="02<i>:</i>59"; vt.classList.remove("slip")},RM?1500:650)} slip()},30000+Math.random()*45000)})();

/* ---------- 4. Старый Сентфор ---------- */
var ob=document.getElementById("old-btn"), fx=null, hud=null, air=100, masked=false, airT=null;
function rootPath(x,y,ang,len,w,g,depth){
  var d="M"+x.toFixed(1)+" "+y.toFixed(1), pts=[], seg=Math.max(10,len/14);
  for(var i=0;i<14;i++){ang+=(Math.random()-.5)*.7; x+=Math.cos(ang)*seg; y+=Math.sin(ang)*seg; d+=" L"+x.toFixed(1)+" "+y.toFixed(1); pts.push([x,y,ang])}
  var p=S("path",{"class":"rt",d:d,"stroke-width":w}); g.appendChild(p);
  if(w>2.5){var h=S("path",{"class":"rt hl",d:d,"stroke-width":Math.max(1,w*.25)}); g.appendChild(h)}
  var out=[[p,depth]];
  if(depth<2) for(var b=0;b<2;b++){var q=pts[4+Math.floor(Math.random()*7)]; out=out.concat(rootPath(q[0],q[1],q[2]+(Math.random()<.5?-1:1)*(.5+Math.random()*.6),len*.55,w*.5,g,depth+1))}
  if(depth>=1&&Math.random()<.7){var e=pts[pts.length-1]; out.push([flower(e[0],e[1],5+Math.random()*4,"of"),depth+2]); g.appendChild(out[out.length-1][0])}
  return out}
function buildFx(){
  fx=H("div"); fx.id="oldfx"; fx.setAttribute("aria-hidden","true");
  var W=innerWidth, Hh=innerHeight, svg=S("svg",{viewBox:"0 0 "+W+" "+Hh,preserveAspectRatio:"none"}), g=S("g",{}); svg.appendChild(g);
  var all=[], n=Math.max(4,Math.round(W/170)), base=Math.min(W,Hh);
  for(var i=0;i<n;i++) all=all.concat(rootPath((i+.5)*W/n+(Math.random()-.5)*60,Hh+8,-Math.PI/2+(Math.random()-.5)*.6,base*(.35+Math.random()*.25),7+Math.random()*4,g,0));
  [[-8,1],[W+8,-1]].forEach(function(s){for(var i=0;i<3;i++) all=all.concat(rootPath(s[0],Hh*(.15+i*.3+Math.random()*.1),(s[1]>0?0:Math.PI)+(Math.random()-.5)*.6,base*(.22+Math.random()*.15),6,g,0))});
  all.forEach(function(a){var el=a[0], dl=a[1]*.9+Math.random()*.6;
    if(el.tagName==="path"){var L=el.getTotalLength?0:0; el.style.strokeDasharray="3000"; el.style.strokeDashoffset=RM?"0":"3000"; if(!RM){el.style.transition="stroke-dashoffset "+(3.5+Math.random()*2)+"s ease-out "+dl+"s"}}
    else el.fl.style.animationDelay=(RM?0:dl+2.5)+"s"});
  fx.appendChild(svg); var fog=H("div","fog"); fx.appendChild(fog);
  for(var s=0;s<14;s++){var sp=H("span","spore"); sp.style.left=Math.random()*100+"%"; sp.style.top=(60+Math.random()*50)+"%"; sp.style.animationDuration=(14+Math.random()*16)+"s"; sp.style.animationDelay=(-Math.random()*20)+"s"; fx.appendChild(sp)}
  document.body.appendChild(fx);
  requestAnimationFrame(function(){requestAnimationFrame(function(){svg.querySelectorAll("path").forEach(function(p){p.style.strokeDashoffset="0"})})});
}
function buildHud(){
  hud=H("div","old-hud"); hud.setAttribute("role","group"); hud.setAttribute("aria-label","Старый Сентфор");
  hud.innerHTML='<div class="air"><span>Заражение</span><i><b></b></i><em>0%</em></div><p>Воздух отравлен. Без маски здесь долго не продержаться.</p><div class="row"><button type="button" class="m">Надеть маску</button><button type="button" class="x">Вернуться</button></div>';
  hud.querySelector(".m").onclick=function(){masked=!masked; document.body.classList.toggle("mask",masked); this.classList.toggle("on",masked); this.textContent=masked?"Снять маску":"Надеть маску"; hud.querySelector("p").textContent=masked?"Маска фильтрует яд, но не до конца. Не задерживайся.":"Воздух отравлен. Без маски здесь долго не продержаться."};
  hud.querySelector(".x").onclick=function(){leaveOld()};
  document.body.appendChild(hud);
}
function airUI(){var b=hud.querySelector(".air"), inf=100-air; b.querySelector("b").style.width=inf+"%"; b.querySelector("em").textContent=Math.floor(inf)+"%"; b.classList.toggle("low",air<25);
  if(air<25) hud.querySelector("p").textContent="Пора уходить, пока не поздно."}
function enterOld(){
  if(fx) fx.remove(); buildFx(); if(!hud) buildHud(); hud.hidden=false; air=100; masked=false; document.body.classList.remove("mask");
  var m=hud.querySelector(".m"); m.classList.remove("on"); m.textContent="Надеть маску"; hud.querySelector("p").textContent="Воздух отравлен. Без маски здесь долго не продержаться."; airUI();
  requestAnimationFrame(function(){document.body.classList.add("old")});
  ob.textContent="Вернуться в Новый Сентфор";
  var tb=document.querySelector('.tab[data-tab="ts1lore"]'), sec=document.getElementById("tab-ts1lore");
  if(tb&&sec){tb.click(); setTimeout(function(){var bar=document.querySelector(".epbar"); window.scrollTo({top:sec.getBoundingClientRect().top+scrollY-(bar?bar.offsetHeight:0)-16,behavior:RM?"auto":"smooth"})},60)}
  clearInterval(airT); airT=setInterval(function(){if(document.hidden) return; air=Math.max(0,air-(masked?.2:1.4)); airUI(); if(air<=0) crash()},250);
}
function leaveOld(late){
  clearInterval(airT); document.body.classList.remove("old","mask"); if(hud) hud.hidden=true; ob.textContent="В Старый Сентфор";
  var f=fx; fx=null; if(f) setTimeout(function(){f.remove()},1300);
}
function crash(){
  clearInterval(airT); if(hud) hud.hidden=true;
  var cr=H("div"); cr.id="crash"; cr.setAttribute("role","alert");
  var cv=document.createElement("canvas"); cv.width=160; cv.height=90; cr.appendChild(cv); cr.appendChild(H("div","bars"));
  var sls=[]; for(var i=0;i<6;i++){var sl=H("div","sl"); cr.appendChild(sl); sls.push(sl)}
  var h=H("h3","","Заражение"); cr.appendChild(h); cr.appendChild(H("p","","морозник в лёгких"));
  document.body.appendChild(cr); document.body.classList.add("crash");
  var cx=cv.getContext("2d"), img=cx.createImageData(160,90), t0=Date.now(), raf;
  (function noise(){var d=img.data; for(var i=0;i<d.length;i+=4){var v=Math.random()*255|0; d[i]=v; d[i+1]=v*.8; d[i+2]=v; d[i+3]=255} cx.putImageData(img,0,0);
    sls.forEach(function(sl){sl.style.setProperty("--t",Math.random()*100+"%"); sl.style.setProperty("--h",(2+Math.random()*30)+"px"); sl.style.setProperty("--x",((Math.random()-.5)*80)+"px")});
    if(Date.now()-t0<2600) raf=requestAnimationFrame(noise)})();
  setTimeout(function(){h.textContent="Попробуй снова"},1300);
  setTimeout(function(){
    leaveOld(); document.body.classList.remove("crash");
    var tb=document.querySelector('.tab[data-tab="people"]'); if(tb) tb.click(); window.scrollTo({top:0});
    cr.style.transition="opacity .6s"; cr.style.opacity="0"; setTimeout(function(){cancelAnimationFrame(raf); cr.remove()},650);
    var t=H("div","toast"); t.setAttribute("role","status"); t.appendChild(H("b","","Попробуй снова")); t.appendChild(document.createTextNode("Старый Сентфор не отпускает тех, кто медлит. Надень маску раньше.")); document.body.appendChild(t); setTimeout(function(){t.remove()},5000); setTimeout(function(){egg("crash")},5200);
  },2700);
}
if(ob) ob.onclick=function(){document.body.classList.contains("old")?leaveOld():enterOld()};


/* ---------- морозник обвивает кнопки серий ---------- */
var vineN=0;
function drawVine(){
  var box=document.getElementById("ep-btns"); if(!box) return;
  [].slice.call(box.querySelectorAll(".vine")).forEach(function(v){v.remove()});
  var bs=[].slice.call(box.querySelectorAll(".ep-btn")); if(bs.length<2) return;
  var r=R(), K=1, c=bs.map(function(b){return [b.offsetLeft+b.offsetWidth/2,b.offsetTop+b.offsetHeight/2,b.offsetWidth/2]});
  var step=c[1][0]-c[0][0], cy=c[0][1], A=c[0][2]-1, A2=c[0][2]*.5, W=box.scrollWidth, Hh=box.scrollHeight, id="vc"+(++vineN);
  var x0=c[0][0]-step*.6, xr=c[r-1][0]+step*.5, xe=c[c.length-1][0]+step*.4;
  function yy(x,a){return cy+a*Math.sin(Math.PI*(x-c[0][0])/step)}
  function path(a,from,to){var d=""; for(var x=from;x<=to+.01;x+=2) d+=(d?" L":"M")+x.toFixed(1)+" "+yy(x,a).toFixed(1); return d}
  function mk(cls){var v=S("svg",{"class":"vine "+cls,width:W,height:Hh,viewBox:"0 0 "+W+" "+Hh}); v.style.width=W+"px"; v.style.height=Hh+"px"; return v}
  var back=mk("vback"), front=mk("vfront");
  back.appendChild(S("path",{"class":"vm",d:path(A,x0,xr)})); back.appendChild(S("path",{"class":"vt",d:path(-A2,x0,xr)}));
  if(xe>xr){back.appendChild(S("path",{"class":"vd",d:path(A,xr,xe)}))}
  var defs=S("defs",{}), cE=S("clipPath",{id:id+"e"}), cO=S("clipPath",{id:id+"o"});
  c.forEach(function(p,i){if(i>=r) return; (i%2?cO:cE).appendChild(S("circle",{cx:p[0],cy:p[1],r:p[2]+1}))});
  defs.appendChild(cE); defs.appendChild(cO); front.appendChild(defs);
  front.appendChild(S("path",{"class":"vm",d:path(A,x0,xr),"clip-path":"url(#"+id+"e)"}));
  front.appendChild(S("path",{"class":"vt",d:path(-A2,x0,xr),"clip-path":"url(#"+id+"o)"}));
  for(var k=0;k<r;k++){var px=c[k][0]+step*.5; if(px>xr) break; var up=Math.sin(Math.PI*(px-c[0][0])/step)<0, py=yy(px,A), s=up?-1:1;
    back.appendChild(S("path",{"class":"lf",d:"M"+px+" "+py+" q"+(-4*K)+" "+(s*3*K)+" "+(-7*K)+" "+(s*7*K)+" q"+(5*K)+" "+(-s*1*K)+" "+(7*K)+" "+(-s*7*K)+"z"}));
    if(k<r-1&&k%2===0){var f=flower(px+2.5*K,py+s*1.5*K,4.2*K,""); back.appendChild(f)}}
  var cur=c[r-1], fn=flower(cur[0]+cur[2]*.72,cur[1]-cur[2]*.78,6*K,"now"); front.appendChild(fn);
  box.insertBefore(back,box.firstChild); box.appendChild(front);
}
var vt2; window.addEventListener("resize",function(){clearTimeout(vt2); vt2=setTimeout(drawVine,200)}); window.addEventListener("orientationchange",function(){setTimeout(drawVine,400); setTimeout(drawVine,900)});
/* ---------- радио: Everything Black ---------- */
var radio=document.getElementById("radio"), rsay=document.getElementById("radio-say"), rbusy=false;
function radioSound(){
  var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
  try{actx=actx||new AC(); if(actx.state==="suspended") actx.resume()}catch(e){return}
  var c=actx, t0=c.currentTime+.05, dur=2.1, out=c.createGain(); out.gain.value=.9; out.connect(c.destination);
  /* мягкое шипение старой плёнки */
  var nb=c.createBuffer(1,c.sampleRate*dur,c.sampleRate), d=nb.getChannelData(0), last=0;
  for(var i=0;i<d.length;i++){var w=Math.random()*2-1; last=(last+.02*w)/1.02; d[i]=last*3.5; if(Math.random()<.0004) d[i]+=(Math.random()<.5?-1:1)*.6}
  var n=c.createBufferSource(); n.buffer=nb; var lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=1400;
  var ng=c.createGain(); ng.gain.setValueAtTime(0,t0); ng.gain.linearRampToValueAtTime(.09,t0+.25); ng.gain.setValueAtTime(.09,t0+1.5); ng.gain.linearRampToValueAtTime(0,t0+dur);
  n.connect(lp); lp.connect(ng); ng.connect(out); n.start(t0); n.stop(t0+dur);
  /* тёмный аккорд, который «настраивается» */
  [110,130.81,164.81].forEach(function(f,k){var o=c.createOscillator(), g=c.createGain(), fl=c.createBiquadFilter(); o.type="triangle";
    o.frequency.setValueAtTime(f*.97,t0); o.frequency.exponentialRampToValueAtTime(f,t0+.9); fl.type="lowpass"; fl.frequency.setValueAtTime(300,t0); fl.frequency.linearRampToValueAtTime(900,t0+1.4);
    g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(.05-k*.01,t0+.8); g.gain.setValueAtTime(.05-k*.01,t0+1.5); g.gain.linearRampToValueAtTime(0,t0+dur);
    o.connect(fl); fl.connect(g); g.connect(out); o.start(t0); o.stop(t0+dur+.05)});
}

var ytPlaying=false, ytF=null;
addEventListener("message",function(e){if(!/youtube/.test(e.origin||"")) return; try{var d=typeof e.data==="string"?JSON.parse(e.data):e.data; if(d&&d.info&&d.info.playerState===1){ytPlaying=true; var h=rsay.querySelector(".rs-hint"); if(h) h.remove()}}catch(er){}});
function radioStop(){if(ytF){ytF.remove(); ytF=null} rsay.hidden=true; rsay.classList.remove("show-yt"); radio.classList.remove("on"); rbusy=false; var ab=document.getElementById("allblack"); if(ab) ab.classList.remove("on")}
if(radio){radio.onclick=function(){
  if(!rsay.hidden&&!rbusy){radioStop(); return}
  if(rbusy) return; rbusy=true; ytPlaying=false; radio.classList.add("on"); rsay.hidden=false; rsay.classList.remove("show-yt"); rsay.innerHTML='<span class="st">ш-ш-ш… кх… ш-ш…</span>'; radioSound();
  var ab=document.getElementById("allblack"); if(!ab){ab=H("div"); ab.id="allblack"; ab.setAttribute("aria-hidden","true"); document.body.appendChild(ab)}
  /* в просмотрщике артефактов YouTube внутри страницы запрещён; на своём хостинге плеер встроится */
  var EMBED=!/claude|anthropic|usercontent|^$|localhost/.test(location.hostname);
  /* плеер создаём сразу в момент нажатия: Safari разрешает звук только внутри жеста */
  if(EMBED){ytF=document.createElement("iframe");
    ytF.src="https://www.youtube-nocookie.com/embed/mWKDZRJWdF4?start=50&autoplay=1&playsinline=1&rel=0&enablejsapi=1&origin="+encodeURIComponent(location.origin);
    ytF.title="Everything Black — Unlike Pluto feat. Mike Taylor"; ytF.allow="autoplay; encrypted-media; picture-in-picture"; ytF.setAttribute("allowfullscreen","");
    ytF.addEventListener("load",function(){try{ytF.contentWindow.postMessage(JSON.stringify({event:"listening",id:"radio",channel:"widget"}),"*")}catch(er){}});
    rsay.appendChild(ytF)}
  setTimeout(function(){
    var st=rsay.querySelector(".st"); if(st) st.remove();
    var t=H("div","rs-title"); t.innerHTML='♪ Everything Black<br><span class="st">Unlike Pluto feat. Mike Taylor</span>'; rsay.insertBefore(t,rsay.firstChild); rsay.classList.add("show-yt");
    var row=H("div","rs-row"), a=H("a",EMBED?"":"rs-play",EMBED?"▶ открыть на YouTube":"▶ Слушать с 0:50"), x=H("button","rs-x",EMBED?"выключить":"закрыть"); a.href="https://youtu.be/mWKDZRJWdF4?t=50"; a.target="_blank"; a.rel="noopener"; x.type="button"; x.onclick=radioStop; row.appendChild(a); row.appendChild(x); rsay.appendChild(row);
    ab.classList.add("on")},1700);
  /* если браузер (Safari на iPhone) не дал включить звук сам, подсказываем */
  if(EMBED) setTimeout(function(){if(!ytPlaying&&ytF&&!rsay.hidden&&!rsay.querySelector(".rs-hint")){var h=H("div","rs-hint","Нажми ▶ на плеере: браузер не даёт включить музыку сам"); ytF.parentNode.insertBefore(h,ytF.nextSibling)}},3400);
  setTimeout(function(){ab.classList.remove("on"); egg("song")},7000);
  setTimeout(function(){rbusy=false},7200)}}
/* ---------- пасхалки: морозник, зеркало, часы, 18:06 ---------- */
var visOn=false;
function touchFrost(){if(R()<5||visOn) return; visOn=true; var veil=H("div","vis-veil"); veil.setAttribute("aria-hidden","true"); document.body.appendChild(veil); setTimeout(function(){veil.remove()},3400); document.body.classList.add("vision");
  ["идём…","идём…","не уходи…"].forEach(function(w,k){setTimeout(function(){var d=H("div","whisp",w); d.style.left=(10+Math.random()*70)+"vw"; d.style.top=(20+Math.random()*55)+"vh"; document.body.appendChild(d); setTimeout(function(){d.remove()},2500)},300+k*800)});
  setTimeout(function(){document.body.classList.remove("vision"); visOn=false; egg("frost")},3300)}
var mir=document.getElementById("mirror"), wimg=document.getElementById("whisper-img");
function placeMirror(){if(!mir||!wimg||!wimg.offsetWidth) return; var w=wimg.offsetWidth, h=wimg.offsetHeight;
  var fh=wimg.naturalWidth?w*wimg.naturalHeight/wimg.naturalWidth:h*1.25, off=(fh-h)/2;
  mir.style.left=(wimg.offsetLeft+w*.375)+"px"; mir.style.top=(wimg.offsetTop+fh*.229-off)+"px"; mir.style.width=mir.style.height=(w*.25)+"px"}
if(mir){wimg.addEventListener("load",placeMirror); addEventListener("resize",placeMirror); setTimeout(placeMirror,300); if(window.ResizeObserver) new ResizeObserver(placeMirror).observe(wimg);
  var mt=null, shown=false;
  function look(){if(shown||R()<4) return; shown=true; mir.classList.add("show"); setTimeout(function(){mir.classList.remove("show"); shown=false; egg("mirror")},1100)}
  mir.addEventListener("pointerenter",function(e){if(e.pointerType==="mouse"){clearTimeout(mt); mt=setTimeout(look,650)}});
  mir.addEventListener("pointerleave",function(){clearTimeout(mt)});
  mir.addEventListener("click",function(e){e.preventDefault(); look()})}
var clicks=[];
if(vt) vt.addEventListener("click",function(){var n=Date.now(); clicks=clicks.filter(function(t){return n-t<1500}); clicks.push(n);
  if(clicks.length>=3&&!vt.classList.contains("go")){clicks=[]; vt.innerHTML="03<i>:</i>00"; vt.classList.add("go"); document.body.classList.add("t259");
    setTimeout(function(){vt.innerHTML="02<i>:</i>59"; vt.classList.remove("go"); document.body.classList.remove("t259"); egg("clock")},1300)}});
var calledOnce=false;
function ringTone(){var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; try{actx=actx||new AC(); if(actx.state!=="running") return}catch(e){return}
  var c=actx, t0=c.currentTime+.05; for(var k=0;k<2;k++){[440,480].forEach(function(f){var o=c.createOscillator(), g=c.createGain(); o.frequency.value=f; g.gain.setValueAtTime(0,t0+k*1.2); g.gain.linearRampToValueAtTime(.06,t0+k*1.2+.02); g.gain.setValueAtTime(.06,t0+k*1.2+.8); g.gain.linearRampToValueAtTime(0,t0+k*1.2+.85); o.connect(g); g.connect(c.destination); o.start(t0+k*1.2); o.stop(t0+k*1.2+.9)})}}
function missedCall(){if(calledOnce||R()<3) return; calledOnce=true;
  var c=H("div","call"); c.setAttribute("role","status"); var im=new Image(); im.src="img/miranda_p.webp"; im.alt=""; c.appendChild(im);
  var who=H("div","who"); who.appendChild(H("b","","Миранда")); var st=H("span","","входящий вызов…"); who.appendChild(st); c.appendChild(who);
  var bt=H("div","btns"); bt.innerHTML='<i class="no"></i><i class="yes"></i>'; c.appendChild(bt); document.body.appendChild(c); ringTone();
  setTimeout(function(){c.classList.add("missed"); st.textContent="Пропущенный вызов · 18:06"},2600);
  setTimeout(function(){c.style.transition="opacity .8s"; c.style.opacity="0"; setTimeout(function(){c.remove()},800); egg("call1806")},6500)}
function tick1806(){var d=new Date(); if((d.getHours()===18&&d.getMinutes()===6)||location.hash==="#1806") missedCall()}
tick1806(); setInterval(tick1806,5000); addEventListener("hashchange",tick1806);
/* ---------- пасхалка: монета ---------- */
var cb=document.getElementById("coin"), ci=document.getElementById("coin-img"), cr=document.getElementById("coin-res"), cBusy=false;
if(cb) cb.addEventListener("click",function(e){e.preventDefault(); if(cBusy||R()<8) return; cBusy=true; cr.hidden=true; ci.classList.remove("flip"); void ci.offsetWidth; ci.classList.add("flip");
  setTimeout(function(){cr.textContent=Math.random()<.5?"Орёл":"Решка"; cr.hidden=false; ci.classList.remove("flip"); cBusy=false; egg("coin")},1500)});
/* ---------- пасхалки: руна и дверь в башне ---------- */
var rn=document.getElementById("rune"), runeT=null;
if(rn) rn.addEventListener("click",function(e){e.preventDefault(); if(R()<14) return; rn.classList.remove("lit"); void rn.offsetWidth; rn.classList.add("lit");
  var b=rn.getBoundingClientRect(), w=H("div","rune-wave"); w.style.setProperty("--x",(b.left+b.width/2)+"px"); w.style.setProperty("--y",(b.top+b.height/2)+"px"); document.body.appendChild(w); setTimeout(function(){w.remove()},1900);
  document.body.classList.add("rune-on"); clearTimeout(runeT); runeT=setTimeout(function(){document.body.classList.remove("rune-on")},60000);
  setTimeout(function(){egg("rune")},700)});
var td=document.getElementById("tdoor"), ty=document.getElementById("tyear");
if(td&&ty){var yi=ty.querySelector("input");
  td.addEventListener("click",function(e){e.preventDefault(); if(R()<15) return; ty.hidden=!ty.hidden; if(!ty.hidden){yi.value=""; yi.focus()}});
  ty.addEventListener("submit",function(e){e.preventDefault(); var v=yi.value.trim();
    if(v!=="1986"){ty.classList.remove("no"); void ty.offsetWidth; ty.classList.add("no"); yi.value=""; yi.placeholder="заперто"; return}
    ty.hidden=true; yi.placeholder="год?"; var o=H("div","y86"); o.appendChild(H("div","play","PLAY ▶")); o.appendChild(H("b","","1986")); o.appendChild(H("span","","Добро пожаловать в Сентфор.")); var np=H("div","y86-news"); np.appendChild(H("i","","Сентфор · октябрь 1986")); np.appendChild(H("strong","","Жители Сентфора готовятся к Хеллоуину!")); o.appendChild(np); document.body.appendChild(o); setTimeout(function(){o.remove(); egg("door86")},4700)})}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".sp-btn"); if(!b) return; var t=b.parentNode.querySelector(".sp-txt"); if(t){t.hidden=false; b.remove()}});
/* ---------- переходы между вкладками ---------- */
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a.jump[data-jump]"); if(!a) return; e.preventDefault();
  if(window.SFclose) window.SFclose(); var id=a.getAttribute("data-jump"); if(id.indexOf("mx-")===0&&window.SFmxOpen) window.SFmxOpen(id); var t=document.getElementById(id); if(!t) return; var sec=t.closest("section[data-tab]"); var tb=sec&&document.querySelector('.tab[data-tab="'+sec.getAttribute("data-tab")+'"]'); if(tb) tb.click();
  setTimeout(function(){var bar=document.querySelector(".epbar"); window.scrollTo({top:t.getBoundingClientRect().top+scrollY-(bar?bar.offsetHeight:0)-16,behavior:RM?"auto":"smooth"}); t.classList.remove("flash"); void t.offsetWidth; t.classList.add("flash"); if(window.SFitem&&t.classList.contains("item")&&t.closest("#tab-weird,#tab-evidence")) setTimeout(function(){window.SFitem(t)},500)},80)});

/* подписи карточек: уменьшить шрифт, если слово не влезает */
(function(){function fit(){document.querySelectorAll("#tab-evidence .pins .pol figcaption,#tab-weird .pins .pol figcaption,#tab-people .pins .pol figcaption").forEach(function(c){c.style.fontSize=""; if(!c.offsetWidth) return; c.style.overflowWrap="normal"; var f=parseFloat(getComputedStyle(c).fontSize), n=0; while((c.scrollWidth>c.clientWidth+1||c.scrollHeight>c.clientHeight+1)&&f>16&&n<14){f-=1; n++; c.style.fontSize=f+"px"} c.style.overflowWrap=""})}
var t; addEventListener("resize",function(){clearTimeout(t); t=setTimeout(fit,200)}); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit); setTimeout(fit,400);
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest(".tab")) setTimeout(fit,60)})})();

/* ---------- кассеты: видеомагнитофон ---------- */
(function(){
var TAPES={
 shmb:{kind:"video",src:"video/tower-tape.mp4",tall:true,date:"",cues:[]},
 miranda:{kind:"video",src:"video/miranda-tape.mp4",date:"",cues:[]},
 window:{kind:"voice",img:"img/tape9.webp",date:"",audio:"audio/tape-window.mp3",stop:15.68,glitches:[1.78, 2.98, 3.98, 4.72, 5.58, 6.96, 7.89, 8.27, 9.44, 10.7, 11.87, 12.02, 13.79, 15.68],cues:[[0.94,2.08,"В опасности…"],[2.43,3.28,"запомни…"],[3.62,5.02,"Дату над дверью…"],[5.15,5.88,"вырезать."],[6.43,7.26,"И тогда…"],[7.44,8.57,"в нужное время…"],[8.99,9.74,"Не зли…"],[10.03,11.0,"Кукла…"],[11.39,14.09,"Изменения зашли слишком далеко…"],[14.42,16.13,"их не спасти."]],lines:["В опасности…","запомни…","Дату над дверью…","вырезать.","И тогда…","в нужное время…","Не зли…","Кукла…","Изменения зашли слишком далеко…","их не спасти."]}
};
window.SFtapes=TAPES;
var box=document.getElementById("vhs"), tv=document.getElementById("vhs-tv"), v=document.getElementById("vhs-v"), deck=document.getElementById("vhs-deck"), cas=document.getElementById("vhs-cas"),
 osd=document.getElementById("vhs-osd"), dt=document.getElementById("vhs-date"), sub=document.getElementById("vhs-sub"), bPlay=document.getElementById("vhs-play"), bAgain=document.getElementById("vhs-again"), bX=document.getElementById("vhs-x"), note=document.getElementById("vhs-note"), cv=document.getElementById("vhs-noise");
var cur=null, playing=false, token=0, hiss=null, lastF=null, raf=0;
if(box&&box.parentNode!==document.body) document.body.appendChild(box); /* поверх всего, а не внутри .wrap */
function rd(){return (window.SF&&SF.read)||1}
/* шум на экране */
var cx=cv.getContext("2d"), idata=cx.createImageData(320,240);
function noise(){var d=idata.data; for(var i=0;i<d.length;i+=4){var g=Math.random()*255|0; d[i]=d[i+1]=d[i+2]=g; d[i+3]=255} cx.putImageData(idata,0,0); raf=requestAnimationFrame(noise)}
/* шипение плёнки */
function startHiss(){var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; try{window._vac=window._vac||new AC(); var c=window._vac; if(c.state==="suspended") c.resume();
  var len=c.sampleRate*2, b=c.createBuffer(1,len,c.sampleRate), d=b.getChannelData(0), last=0; for(var i=0;i<len;i++){var w=Math.random()*2-1; last=(last+.02*w)/1.02; d[i]=last*3.2}
  var n=c.createBufferSource(); n.buffer=b; n.loop=true; var lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=1600; var g=c.createGain(); g.gain.value=0; g.gain.linearRampToValueAtTime(.07,c.currentTime+.4);
  n.connect(lp); lp.connect(g); g.connect(c.destination); n.start(); hiss={n:n,g:g,c:c}}catch(e){}}
function stopHiss(){if(!hiss) return; try{hiss.g.gain.linearRampToValueAtTime(0,hiss.c.currentTime+.25); var n=hiss.n; setTimeout(function(){try{n.stop()}catch(e){}},300)}catch(e){} hiss=null}
/* голос */
function ruVoice(){if(!window.speechSynthesis) return null; var vs=speechSynthesis.getVoices().filter(function(x){return (window.SFLANG==="en"?/^en/i:/^ru/i).test(x.lang)}); if(!vs.length) return null;
  function rank(x){var n=x.name; if(/natural|neural/i.test(n)&&/svetlana|dariya|polina/i.test(n)) return 0; if(/google/i.test(n)) return 1; if(/milena|alena|katya|svetlana|dariya|irina|female|жен/i.test(n)) return 2; if(/pavel|yuri|dmitry|maxim|male|муж/i.test(n)) return 9; return 5}
  return vs.slice().sort(function(a,b){return rank(a)-rank(b)})[0]}
/* треск и провалы между словами */
function crackle(dur){var c=window._vac; if(!c||!hiss) return; try{var len=c.sampleRate*dur|0, b=c.createBuffer(1,len,c.sampleRate), d=b.getChannelData(0); for(var i=0;i<len;i++){var e=Math.sin(Math.PI*i/len); d[i]=(Math.random()*2-1)*e*(Math.random()<.08?1:.35)}
  var s=c.createBufferSource(); s.buffer=b; var f=c.createBiquadFilter(); f.type="bandpass"; f.frequency.value=900+Math.random()*1800; f.Q.value=.7; var g=c.createGain(); g.gain.value=.22; s.connect(f); f.connect(g); g.connect(c.destination); s.start()}catch(e){}}
function sayLines(lines,my){
  var i=0, voice=ruVoice(); if(!voice){note.hidden=false; note.textContent="На этом устройстве нет русского голоса, поэтому запись идёт только текстом."}
  function next(){ if(my!==token||!playing) return; if(i>=lines.length){sub.textContent=""; osd.textContent="■ STOP"; playing=false; bPlay.textContent="▶ Ещё раз"; stopHiss(); return}
    var t=lines[i++]; sub.textContent=t; box.classList.remove("glitch"); void box.offsetWidth; box.classList.add("glitch");
    var gap=380+Math.random()*600; crackle(.18+Math.random()*.25);
    if(voice){var u=new SpeechSynthesisUtterance(t.replace(/…/g,"")); u.voice=voice; u.lang=voice.lang; u.rate=.86; u.pitch=1.08; u.volume=.8;
      u.onend=function(){crackle(.12+Math.random()*.3); setTimeout(next,gap)}; u.onerror=function(){setTimeout(next,gap)}; setTimeout(function(){if(my===token&&playing) speechSynthesis.speak(u)},160)}
    else setTimeout(next,1200+t.length*45+gap)}
  setTimeout(next,700);
}
/* запись с плёнки: готовый звук + субтитры */
var au=new Audio(); au.preload="none";
var band=document.createElement("div"); band.className="vhs-band"; tv.appendChild(band); var lastT=0;
function hard(){box.classList.remove("glitch-hard"); void box.offsetWidth; box.classList.add("glitch-hard"); band.style.top=(15+Math.random()*60)+"%"; setTimeout(function(){box.classList.remove("glitch-hard")},420)}
au.addEventListener("timeupdate",function(){if(!cur||!cur.cues) return; var t=au.currentTime, s="";
  if(t<lastT-.5){lastT=0; box.classList.remove("chew")} if(cur.stop&&t>=cur.stop&&!box.classList.contains("chew")) box.classList.add("chew"); if(cur.glitches) cur.glitches.forEach(function(g){if(g>lastT&&g<=t+.05) hard()}); lastT=t; cur.cues.forEach(function(c){if(t>=c[0]&&t<c[1]) s=c[2]}); if(sub.textContent!==s){sub.textContent=s; if(s){box.classList.remove("glitch"); void box.offsetWidth; box.classList.add("glitch")}}});
au.addEventListener("error",function(){ /* файла нет: читаем голосом устройства */ if(cur&&cur.audio&&playing){cur.audio=null; play()} });
var cnt=document.getElementById("vhs-count"), vw=box.querySelector(".vwin"), t0=0, cntT=0;
function fmt(x){x=Math.max(0,x|0); return "0:"+("0"+((x/60)|0)).slice(-2)+":"+("0"+(x%60)).slice(-2)}
function tick(){ if(!cur) return; var el, dur;
  if(cur.audio&&au.duration){el=au.currentTime; dur=au.duration} else {el=playing?(Date.now()-t0)/1000:el||0; dur=(cur.lines||[]).length*1.9+1}
  if(cnt) cnt.textContent=fmt(el); if(vw) vw.style.setProperty("--p",Math.min(1,el/dur).toFixed(3)) }
setInterval(function(){if(cur&&playing) tick()},250);
au.addEventListener("ended",function(){playing=false; osd.textContent="■ STOP"; bPlay.textContent="▶ Ещё раз"; sub.textContent=""; stopHiss()});
function open(id){
  var T=TAPES[id]; if(!T) return; if(window.SFclose) window.SFclose(); lastF=document.activeElement; cur=T; token++; note.hidden=true; sub.textContent=""; box.classList.remove("chew"); box.classList.toggle("tall",!!T.tall); t0=Date.now(); if(cnt) cnt.textContent="0:00:00"; if(vw) vw.style.setProperty("--p",0);
  box.hidden=false; document.body.classList.add("noscroll"); dt.textContent=T.date||"";
  if(T.kind==="video"){deck.hidden=true; v.hidden=false; v.src=T.src; v.currentTime=0}
  else {v.hidden=true; v.removeAttribute("src"); deck.hidden=false; cas.src=T.img}
  cancelAnimationFrame(raf); noise(); play();
  bPlay.focus();
}
function play(){
  if(!cur) return; playing=true; box.classList.remove("paused"); osd.textContent="▶ PLAY"; bPlay.textContent="❚❚ Пауза"; var my=++token;
  if(cur.kind==="video"){var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){}); }
  else if(cur.audio){ /* шипение уже в файле */ if(au.getAttribute("src")!==cur.audio){au.src=cur.audio} var pa=au.play(); if(pa&&pa.catch) pa.catch(function(e){ if(e&&e.name==="NotSupportedError"&&cur){cur.audio=null; play()} })}
  else {startHiss(); if(window.speechSynthesis) speechSynthesis.cancel(); sayLines(cur.lines,my)}
}
function pause(){
  playing=false; box.classList.add("paused"); osd.textContent="❚❚ PAUSE"; bPlay.textContent="▶ Дальше"; token++;
  if(cur&&cur.kind==="video") v.pause(); else {if(window.speechSynthesis) speechSynthesis.cancel(); try{au.pause()}catch(e){} stopHiss()}
}
function close(){
  if(!cur) return; pause(); try{au.currentTime=0}catch(e){} cur=null; box.hidden=true; document.body.classList.remove("noscroll"); cancelAnimationFrame(raf); v.removeAttribute("src"); try{v.load()}catch(e){} if(lastF&&lastF.focus) lastF.focus()
}
bPlay.onclick=function(){if(playing) pause(); else {if(cur&&cur.kind==="voice"&&osd.textContent==="■ STOP"){} play()}};
bAgain.onclick=function(){if(!cur) return; pause(); if(cur.kind==="video"){v.currentTime=0} try{au.currentTime=0}catch(e){} lastT=0; t0=Date.now(); box.classList.remove("chew"); play()};
bX.onclick=close; box.addEventListener("click",function(e){if(e.target===box) close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&cur) close()});
/* субтитры к видео */
v.addEventListener("timeupdate",function(){if(!cur||!cur.cues) return; var t=v.currentTime, s=""; cur.cues.forEach(function(c){if(t>=c[0]&&t<c[1]) s=c[2]}); sub.textContent=s});
v.addEventListener("ended",function(){playing=false; osd.textContent="■ STOP"; bPlay.textContent="▶ Ещё раз"; sub.textContent=""});
if(window.speechSynthesis&&speechSynthesis.onvoiceschanged!==undefined) speechSynthesis.onvoiceschanged=function(){};
window.SFtape=open;
/* значок ▶ на карточках */
function marks(){var R=rd(); document.querySelectorAll("[data-tape]").forEach(function(it){var f=it.querySelector(":scope>figure"); if(!f) return; var m=f.querySelector(".tape-play"); if(!m){m=document.createElement("span"); m.className="tape-play"; m.textContent="▶"; m.setAttribute("aria-hidden","true"); f.appendChild(m)} it.classList.toggle("tape-off",+it.getAttribute("data-tape-from")>R)})}
marks(); window.SFtapeMarks=marks;
})();
/* ---------- карточки улик и необъяснимого: наведение и всплывающее окно ---------- */
(function(){
  var m=document.getElementById("pmodal"), body=document.getElementById("pm-body"), cur=null, moved=[], lastF=null;
  var HOVER=window.matchMedia&&matchMedia("(hover:hover) and (pointer:fine)").matches;
  var pop=document.createElement("div"); pop.className="im-pop"; pop.hidden=true; document.body.appendChild(pop);
  var popIt=null, popMoved=[], tShow=null, tHide=null;
  function take(it,box){var a=[]; [].slice.call(it.querySelectorAll(":scope>.note")).forEach(function(n){a.push([n,it,n.nextSibling]); box.appendChild(n)}); return a}
  function give(a){for(var i=a.length-1;i>=0;i--){var x=a[i]; if(x[2]&&x[2].parentNode===x[1]) x[1].insertBefore(x[0],x[2]); else x[1].appendChild(x[0])}}
  function capOf(it){var c=it.querySelector(":scope>figure figcaption"); return c?c.textContent:""}
  function hidePop(){clearTimeout(tShow); clearTimeout(tHide); if(!popIt) return; give(popMoved); popMoved=[]; popIt=null; pop.hidden=true; pop.innerHTML=""}
  function showPop(it){
    if(it.classList.contains("locked")||cur) return; if(popIt===it) return; hidePop();
    popIt=it; pop.innerHTML=""; var h=document.createElement("h4"); h.textContent=capOf(it); pop.appendChild(h);
    var box=document.createElement("div"); box.className="im-notes"; pop.appendChild(box); popMoved=take(it,box);
    pop.hidden=false; var fig=it.querySelector(":scope>figure"), r=(fig||it).getBoundingClientRect(), w=pop.offsetWidth, ph=pop.offsetHeight;
    var x=r.right+14; if(x+w>innerWidth-8) x=r.left-w-14; if(x<8) x=Math.max(8,Math.min(innerWidth-w-8,r.left));
    var y=Math.max(8,Math.min(innerHeight-ph-8,r.top)); pop.style.left=x+"px"; pop.style.top=y+"px";
  }
  function soonHide(){clearTimeout(tShow); clearTimeout(tHide); tHide=setTimeout(hidePop,180)}
  pop.addEventListener("mouseenter",function(){clearTimeout(tHide)}); pop.addEventListener("mouseleave",soonHide);
  window.addEventListener("scroll",function(){if(popIt) hidePop()},{passive:true});
  document.querySelectorAll("#tab-evidence .item, #tab-weird .item").forEach(function(it){
    if(!it.querySelector(":scope>.note")) return; var fig=it.querySelector(":scope>figure"); if(!fig) return;
    fig.addEventListener("click",function(e){if(e.target.closest("button,a,input,form,label,.emf,.coin-res")) return; openItem(it)});
    if(HOVER){fig.addEventListener("mouseenter",function(){clearTimeout(tHide); clearTimeout(tShow); tShow=setTimeout(function(){showPop(it)},160)}); fig.addEventListener("mouseleave",soonHide)}
  });
  function closeItem(){if(!cur) return; give(moved); moved=[]; cur=null; m.hidden=true; body.innerHTML=""; document.body.classList.remove("noscroll"); if(lastF&&lastF.focus) lastF.focus()}
  function openItem(it){
    if(it.classList.contains("locked")) return;
    hidePop(); if(window.SFclose) window.SFclose(); if(cur){give(moved); moved=[]}
    lastF=document.activeElement; cur=it; body.innerHTML="";
    var top=document.createElement("div"); top.className="pm-top im-top";
    var fig=it.querySelector(":scope>figure"), cap=capOf(it);
    if(fig){var cl=fig.cloneNode(true); cl.classList.add("pm-pol"); cl.removeAttribute("id"); cl.querySelectorAll("[id]").forEach(function(x){x.removeAttribute("id")}); cl.querySelectorAll("button,form,.emf,figcaption").forEach(function(x){x.remove()}); cl.querySelectorAll("img").forEach(function(i){i.loading="eager"}); cl.querySelectorAll("video").forEach(function(v){v.remove()}); cl.querySelectorAll("img[data-vid]").forEach(function(i){i.hidden=false; if(window.SFvidPlay) SFvidPlay(i)}); top.appendChild(cl)}
    var hd=document.createElement("div"); var h=document.createElement("h3"); h.className="pm-name"; h.id="pm-title"; h.textContent=cap; hd.appendChild(h);
    var ep=+it.getAttribute("data-ep")||0; if(ep&&window.EPS_&&EPS_[ep]){var f=document.createElement("p"); f.className="pm-first"; f.textContent="Впервые: серия "+ep+" «"+EPS_[ep]+"»"; hd.appendChild(f)}
    top.appendChild(hd); body.appendChild(top);
    var sub=document.createElement("h4"); sub.className="pm-sub"; sub.textContent="Что известно по сериям"; body.appendChild(sub);
    var tp=it.getAttribute("data-tape"); if(tp&&window.SFtape&&+it.getAttribute("data-tape-from")<=((window.SF&&SF.read)||1)){var pb=document.createElement("button"); pb.type="button"; pb.className="im-play"; pb.textContent="▶ Включить запись"; pb.onclick=function(){closeItem(); window.SFtape(tp)}; hd.appendChild(pb)}
    var fl=it.getAttribute("data-film"); if(fl&&window.SFfilm&&!(window.SFnoScare&&SFnoScare())){var fb=document.createElement("button"); fb.type="button"; fb.className="im-play"; fb.textContent="▶ Включить мультик"; fb.onclick=function(){closeItem(); window.SFfilm(fl,it.getAttribute("data-film-cred"))}; hd.appendChild(fb)}
    var box=document.createElement("div"); box.className="im-notes"; body.appendChild(box); moved=take(it,box);
    m.hidden=false; document.body.classList.add("noscroll"); document.getElementById("pm-close").focus();
  }
  document.getElementById("pm-close").addEventListener("click",closeItem);
  m.addEventListener("click",function(e){if(e.target===m) closeItem(); else if(e.target.closest("a.jump")) closeItem()},true);
  pop.addEventListener("click",function(e){if(e.target.closest("a.jump")) hidePop()},true);
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){if(cur) closeItem(); hidePop()}});
  var pc=window.SFclose; window.SFclose=function(){closeItem(); hidePop(); if(pc) pc()};
  window.SFitem=openItem;
})();
/* ---------- панель пасхалок ---------- */
var emb=document.getElementById("egg-meter"), emp=document.getElementById("egg-panel");
/* список пасхалок живёт прямо в body: внутри шапки Safari рисовал поверх него часы 02:59 */
if(emp) document.body.appendChild(emp);
if(emb&&emp){emb.onclick=function(e){e.stopPropagation(); emp.hidden=!emp.hidden; emb.setAttribute("aria-expanded",String(!emp.hidden))};
  document.addEventListener("click",function(e){if(!emp.hidden&&!emp.contains(e.target)){emp.hidden=true; emb.setAttribute("aria-expanded","false")}});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!emp.hidden){emp.hidden=true; emb.setAttribute("aria-expanded","false"); emb.focus()}})}
/* ---------- обновление по серии ---------- */
function vibe(){
  drawStem(); drawVine(); setTimeout(function(){if(typeof placeMirror==='function') placeMirror()},50);
  var r=R();
  if(bear) bear.hidden=r<4;
  if(ob){ob.hidden=r<5; if(r<5&&document.body.classList.contains("old")) leaveOld()}
}
window.SFvibe=vibe; vibe();

/* ---------- измеритель поля ---------- */
var emf=document.getElementById("emf"), emfBusy=false;
function ctx(){var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return null; try{actx=actx||new AC(); if(actx.state==="suspended") actx.resume()}catch(e){return null} return actx}
function emfSound(){
  var c=ctx(); if(!c) return; var t0=c.currentTime+.05, out=c.createGain(); out.gain.value=.55; out.connect(c.destination);
  var bp=c.createBiquadFilter(); bp.type="bandpass"; bp.frequency.value=2300; bp.Q.value=3; bp.connect(out);
  var o=c.createOscillator(); o.type="square"; o.frequency.value=2300; var g=c.createGain(); g.gain.value=0; o.connect(g); g.connect(bp);
  var t=t0, iv=.3; while(t<t0+1.7){g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.32,t+.004); g.gain.setValueAtTime(.32,t+Math.min(.03,iv*.5)); g.gain.linearRampToValueAtTime(0,t+Math.min(.034,iv*.55)); t+=iv; iv=Math.max(.045,iv*.8)}
  g.gain.setValueAtTime(0,t0+1.72); g.gain.linearRampToValueAtTime(.26,t0+1.76); g.gain.setValueAtTime(.26,t0+3.1); g.gain.linearRampToValueAtTime(0,t0+3.25);
  var lfo=c.createOscillator(), lg=c.createGain(); lfo.frequency.value=17; lg.gain.value=60; lfo.connect(lg); lg.connect(o.frequency);
  o.frequency.setValueAtTime(2300,t0+1.7); o.frequency.linearRampToValueAtTime(2700,t0+3.2);
  o.start(t0); lfo.start(t0); o.stop(t0+3.4); lfo.stop(t0+3.4);
  var n=c.sampleRate*3.4|0, b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0);
  for(var i=0;i<n;i++){var tt=i/c.sampleRate, p=tt<3.1?.00012+.0016*Math.min(1,tt/1.8):0; if(Math.random()<p){for(var j=0;j<70&&i+j<n;j++) d[i+j]+=(Math.random()*2-1)*Math.exp(-j/9)*.9}}
  var cs=c.createBufferSource(); cs.buffer=b; var hp=c.createBiquadFilter(); hp.type="highpass"; hp.frequency.value=900; var cg=c.createGain(); cg.gain.value=.5; cs.connect(hp); hp.connect(cg); cg.connect(out); cs.start(t0);
}
if(emf){
  var needle=document.getElementById("emf-needle"), leds=emf.querySelectorAll(".emf-leds i");
  emf.addEventListener("click",function(e){
    e.stopPropagation(); if(emfBusy||R()<8) return; emfBusy=true; emf.classList.add("live"); emfSound();
    var st=performance.now(), ang=-58;
    (function f(now){var t=Math.max(0,(now-st)/1000), lvl;
      if(t<1.7) lvl=Math.pow(t/1.7,1.6); else if(t<3.2) lvl=1; else lvl=Math.max(0,1-(t-3.2)/.9);
      var target=-58+lvl*118+(lvl>.05?(Math.random()-.5)*(lvl>.95?7:4):0); ang+=(target-ang)*.35;
      needle.setAttribute("transform","rotate("+ang.toFixed(1)+" 60 64)");
      var k=Math.round(lvl*5); leds.forEach(function(l,i){l.classList.toggle("on",i<k&&!(lvl>=1&&i===4&&Math.random()<.3))});
      if(t<4.2) requestAnimationFrame(f); else {needle.setAttribute("transform","rotate(-58 60 64)"); leds.forEach(function(l){l.classList.remove("on")}); emf.classList.remove("live"); emfBusy=false; egg("field")}
    })(st);
  });
}


/* ---------- теории сворачиваются ---------- */
document.querySelectorAll("#tab-theories .card").forEach(function(c,i){
  var h=c.querySelector("h3"), tag=c.querySelector(".tag"); if(!h) return;
  var body=document.createElement("div"); body.className="th-body";
  var kids=[].slice.call(c.children).filter(function(x){return x!==h&&x!==tag});
  kids.forEach(function(x){body.appendChild(x)});
  var btn=document.createElement("button"); btn.type="button"; btn.className="th-head"; btn.setAttribute("aria-expanded","false");
  c.insertBefore(btn,h); btn.appendChild(h);
  var more=document.createElement("span"); more.className="th-more"; more.textContent="развернуть"; btn.appendChild(more);
  c.appendChild(body);
  btn.addEventListener("click",function(){var o=c.classList.toggle("open"); btn.setAttribute("aria-expanded",String(o))});
});
})();
/* «Поддержать»: закрывать по тапу мимо и по Esc */
(function(){var d=document.getElementById("don"); if(!d) return;
  document.addEventListener("click",function(e){if(d.open&&!d.contains(e.target)) d.open=false});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&d.open) d.open=false});
  d.addEventListener("toggle",function(){if(d.open){var em=document.getElementById("egg-panel"); if(em&&!em.hidden){var b=document.getElementById("egg-meter"); b&&b.click()} try{va("event",{name:"donate_open"})}catch(e){}}});
})();

/* Оживлённые картинки: img[data-vid] → зацикленное видео без звука поверх картинки, пока карточка на экране.
   Картинка остаётся под видео и видна, пока видео не заиграло (iPhone, экономия трафика, ошибки). При выключенных пугалках — только картинка. */
(function(){
  function off(){return !!(window.SFnoScare&&SFnoScare())}
  function wrap(im){var w=im.parentNode; if(w&&w.classList&&w.classList.contains("vid-wrap")) return w; w=document.createElement("span"); w.className="vid-wrap"; im.parentNode.insertBefore(w,im); w.appendChild(im); return w}
  window.SFvid=function(im){if(off()) return null; var b=im.getAttribute("data-vid"); if(!b) return null; var w=wrap(im), v=w.querySelector("video"); if(v) return v;
    v=document.createElement("video"); v.muted=true; v.defaultMuted=true; v.loop=true; v.playsInline=true; v.autoplay=true;
    ["muted","loop","playsinline","webkit-playsinline","autoplay"].forEach(function(a){v.setAttribute(a,"")}); v.preload="auto"; v.setAttribute("aria-hidden","true");
    ["mp4","webm"].forEach(function(t){var s=document.createElement("source"); s.src=b+"."+t; s.type="video/"+t; v.appendChild(s)});
    v.addEventListener("playing",function(){v.classList.add("on")});
    v.addEventListener("error",function(){v.remove()},true);
    w.appendChild(v); return v};
  function play(v){if(!v) return; v.muted=true; var p=v.play(); if(p&&p.catch) p.catch(function(){})}
  window.SFvidPlay=function(im){play(SFvid(im))};
  if(!("IntersectionObserver" in window)) return;
  var io=new IntersectionObserver(function(es){es.forEach(function(en){var im=en.target.querySelector("img[data-vid]"); if(!im) return; var w=im.parentNode, v=w&&w.classList.contains("vid-wrap")?w.querySelector("video"):null;
    var it=im.closest(".item"), ok=en.isIntersecting&&!off()&&!(it&&it.classList.contains("locked"));
    if(ok) play(v||SFvid(im)); else if(v){v.pause(); if(off()) v.remove()}})},{threshold:.35});
  function scan(){document.querySelectorAll("img[data-vid]").forEach(function(im){if(!im.closest(".pm-pol")) io.observe(im.closest("figure")||im.parentNode)})}
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",scan); else scan();
})();

/* Мультик со звуком на весь экран (кнопка в открытой карточке) */
(function(){
  var ov=null;
  function close(){if(!ov) return; var v=ov.querySelector("video"); if(v){v.pause(); v.removeAttribute("src"); v.load()} ov.remove(); ov=null; document.body.classList.remove("noscroll"); document.removeEventListener("keydown",key)}
  function key(e){if(e.key==="Escape") close()}
  window.SFfilm=function(b,cred){close(); ov=document.createElement("div"); ov.className="film-ov"; ov.setAttribute("role","dialog"); ov.setAttribute("aria-modal","true");
    var x=document.createElement("button"); x.type="button"; x.className="film-x"; x.setAttribute("aria-label","Закрыть"); x.textContent="×"; x.onclick=close;
    var v=document.createElement("video"); v.controls=true; v.autoplay=true; v.playsInline=true; v.setAttribute("playsinline",""); v.poster=b.replace("video/","img/")+".webp"; v.src=b+".mp4";
    v.addEventListener("ended",function(){close(); if(window.SFegg) SFegg("pokapoka")});
    ov.appendChild(v); ov.appendChild(x); if(cred){var cr=document.createElement("div"); cr.className="film-cred-ov"; cr.textContent=cred; ov.appendChild(cr)} ov.addEventListener("click",function(e){if(e.target===ov) close()});
    document.body.appendChild(ov); document.body.classList.add("noscroll"); document.addEventListener("keydown",key); x.focus();
    var p=v.play(); if(p&&p.catch) p.catch(function(){})};
})();
