/* Мини-игра «Не дай им дойти»: существа ползут по коридору к Надин, их сжигает луч фонарика, морозники дают очки */
(function(){
var root=document.getElementById("game"); if(!root) return;
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
var BK="sentfor_game_best", best=0; try{best=+localStorage.getItem(BK)||0}catch(e){}
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}

/* разметка */
var hud=H("div","g-hud"), hScore=H("span","g-score"), hLives=H("span","g-lives"), hCombo=H("span","g-combo"), hBest=H("span","g-best"), hFlash=H("button","g-flash");
hFlash.type="button"; hFlash.innerHTML='<img src="img/game_flower_black.webp" alt="" loading="lazy"><b class="g-fn"></b>'; hFlash.setAttribute("aria-label","Flash"); hFlash.style.cssText="position:absolute;left:12px;bottom:12px;z-index:3"; hFlash.disabled=true; hFlash.title="Black hellebore: burn everyone on screen (space)";
hud.appendChild(hScore); hud.appendChild(hLives); hud.appendChild(hCombo); hud.appendChild(hBest);
var stage=H("div","g-stage"), cv=H("canvas"), ov=H("div","g-ov"); stage.style.position="relative";
cv.setAttribute("aria-label","Playing field: a dark school hallway"); var hPause=H("button","g-pause"); hPause.type="button"; hPause.setAttribute("aria-label","Pause"); hPause.title="Pause (Esc)"; hPause.innerHTML='<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="5" y="4" width="3.4" height="12" rx="1"/><rect x="11.6" y="4" width="3.4" height="12" rx="1"/></svg>';
hPause.style.cssText="position:absolute;right:12px;top:12px;z-index:3"; hPause.hidden=true; hPause.onclick=function(){pause()};
stage.appendChild(cv); stage.appendChild(hFlash); stage.appendChild(hPause); stage.appendChild(ov);
root.appendChild(hud); root.appendChild(stage);
var cx=cv.getContext("2d"), dk=document.createElement("canvas"), dx=dk.getContext("2d"), bgc=document.createElement("canvas"), bx=bgc.getContext("2d");
var W=0,Hh=0,DPR=1, VPX=0,VPY=0, FX0=0,FX1=0,FY0=0,FY1=0;

/* где в картинке коридора точка схода, дальняя дверь и пол у зрителя (доли картинки) */
var HALL={aspect:1, vx:.51, vy:.46, fx0:.462, fx1:.556, fy0:.37, fy1:.566, nx0:.1, nx1:.9}, NX0=0, NX1=0, COV={s:1,ox:0,oy:0};
function geo(){var iw=1000*HALL.aspect, ih=1000, sc=Math.max(W/iw,Hh/ih); COV={s:sc,ox:(W-iw*sc)/2,oy:(Hh-ih*sc)*.45};
  function X(f){return COV.ox+f*iw*sc} function Y(f){return COV.oy+f*ih*sc}
  VPX=X(HALL.vx); VPY=Y(HALL.vy); FX0=X(HALL.fx0); FX1=X(HALL.fx1); FY0=Y(HALL.fy0); FY1=Y(HALL.fy1); NX0=Math.max(0,X(HALL.nx0)); NX1=Math.min(W,X(HALL.nx1))}
function size(){
  var bar=document.querySelector(".epbar"), bh=bar&&getComputedStyle(bar).position==="sticky"?bar.offsetHeight:0, cw=Math.min(760,(root.parentNode.clientWidth||600));
  var maxH=Math.max(380,Math.min(innerHeight-bh-80,800)), A=Math.min(HALL.aspect,1.6), w=Math.round(Math.min(cw,maxH*A)), h=Math.round(Math.min(maxH,w/(w<560?.62:.8)));
  stage.style.height=h+"px"; root.style.maxWidth=w+"px"; DPR=Math.min(2,window.devicePixelRatio||1); W=w; Hh=h;
  [cv,dk,bgc].forEach(function(c){c.width=Math.round(w*DPR); c.height=Math.round(h*DPR)});
  cv.style.width=w+"px"; cv.style.height=h+"px";
  geo();
  drawBg(); if(state!=="play") frame(0)}


/* картинки: коридор, Надин со спины и «двое с корнями» */
var IM={}; [["hall","img/game_hall.webp"],["nadin","img/game_nadin.webp"],["r1","img/game_root1.webp"],["r2","img/game_root2.webp"],["r3","img/game_root3.webp"],["flower","img/game_flower.webp"],["flowerB","img/game_flower_black.webp"]].forEach(function(a){var o={img:new Image(),ready:false}; o.img.onload=function(){o.ready=true; if(a[0]==="hall"&&W) drawBg(); if(state!=="play"&&W) frame(0)}; o.src=a[1]+"?v=3"; IM[a[0]]=o});
/* картинки игры качаем, только когда открыли вкладку */
var imGo=false; function loadIM(){if(imGo) return; imGo=true; Object.keys(IM).forEach(function(k){IM[k].img.src=IM[k].src})}
(function(){var s=document.getElementById("tab-game"); if(!s){loadIM(); return} if(!s.hidden) loadIM(); else new MutationObserver(function(_,ob){if(!s.hidden){loadIM(); ob.disconnect()}}).observe(s,{attributes:true,attributeFilter:["hidden"]})})();
var tmp=document.createElement("canvas"), tx=tmp.getContext("2d");
function rootFig(c,o,p,sc,alpha){
  var im=IM["r"+o.root].img, h=Hh*rootH(o)*sc, w=h*im.width/im.height, a=(o.dead?Math.max(0,1-o.dead*1.6):1)*alpha*(o.fin==null?1:o.fin);
  if(a<=0) return; var heat=Math.min(1,o.heat/o.hp);
  c.save(); c.translate(p.x,p.y); c.rotate(Math.sin(t*2.2+o.ph)*.035); c.translate(0,Math.abs(Math.sin(t*4+o.ph))*-h*.015); if(o.flip) c.scale(-1,1); c.globalAlpha=a;
  if(false){tmp.width=Math.max(1,Math.round(w*DPR)); tmp.height=Math.max(1,Math.round(h*DPR)); tx.globalCompositeOperation="source-over"; tx.clearRect(0,0,tmp.width,tmp.height); tx.drawImage(im,0,0,tmp.width,tmp.height);
    tx.globalCompositeOperation="source-atop"; tx.fillStyle="rgba(28,14,10,"+(heat*.82)+")"; tx.fillRect(0,0,tmp.width,tmp.height); c.drawImage(tmp,-w/2,-h,w,h)}
  else{if(o.big){var pu=.65+.35*Math.sin(t*4+o.ph); c.shadowColor="rgba(255,25,25,"+(.95*pu)+")"; c.shadowBlur=(10+8*pu)*DPR; c.drawImage(im,-w/2,-h,w,h); c.shadowBlur=(20+12*pu)*DPR; c.drawImage(im,-w/2,-h,w,h); c.drawImage(im,-w/2,-h,w,h); c.shadowBlur=0; c.shadowColor="transparent"} c.drawImage(im,-w/2,-h,w,h)}
  if(o.flash>0&&alpha>=1){c.globalCompositeOperation="lighter"; c.globalAlpha=a*o.flash*.5; c.drawImage(im,-w/2,-h,w,h)}
  c.restore()}

/* перспектива: u=0 — у Надин, u=1 — дальняя стена */
function lerp(a,b,t){return a+(b-a)*t}
function floorAt(u,l){var xl=lerp(NX0,FX0,u), xr=lerp(NX1,FX1,u), y=lerp(Hh,FY1,u); return {x:(xl+xr)/2+l*(xr-xl)/2, y:y, s:(xr-xl)/Math.max(1,NX1-NX0)}}
function depth(k){return 1-1/(1+k*2.2)} /* k: 0..∞ равные шаги вглубь */

/* коридор рисуется один раз */
function quad(c,p,fill,stroke){c.beginPath(); c.moveTo(p[0][0],p[0][1]); for(var i=1;i<p.length;i++) c.lineTo(p[i][0],p[i][1]); c.closePath(); if(fill){c.fillStyle=fill; c.fill()} if(stroke){c.strokeStyle=stroke; c.stroke()}}
function drawBg(){
  var c=bx; c.setTransform(DPR,0,0,DPR,0,0); c.clearRect(0,0,W,Hh);
  if(IM.hall.ready){var im=IM.hall.img, s=Math.max(W/im.width,Hh/im.height), iw=im.width*s, ih=im.height*s; c.drawImage(im,(W-iw)/2,(Hh-ih)*.45,iw,ih); return}
  quad(c,[[0,0],[W,0],[FX1,FY0],[FX0,FY0]],"#14161c");
  var fl=c.createLinearGradient(0,FY1,0,Hh); fl.addColorStop(0,"#1a1d22"); fl.addColorStop(1,"#3a352e");
  quad(c,[[0,Hh],[W,Hh],[FX1,FY1],[FX0,FY1]],fl);
  var wl=c.createLinearGradient(0,0,FX0,0); wl.addColorStop(0,"#24303d"); wl.addColorStop(1,"#12161c");
  quad(c,[[0,0],[FX0,FY0],[FX0,FY1],[0,Hh]],wl);
  var wr=c.createLinearGradient(W,0,FX1,0); wr.addColorStop(0,"#24303d"); wr.addColorStop(1,"#12161c");
  quad(c,[[W,0],[FX1,FY0],[FX1,FY1],[W,Hh]],wr);
  /* дальняя стена с дверью */
  quad(c,[[FX0,FY0],[FX1,FY0],[FX1,FY1],[FX0,FY1]],"#0c0d11");
  var dw=(FX1-FX0)*.42, dh=(FY1-FY0)*.78; quad(c,[[VPX-dw/2,FY1-dh],[VPX+dw/2,FY1-dh],[VPX+dw/2,FY1],[VPX-dw/2,FY1]],"#050506","#262a33");
  c.fillStyle="rgba(217,58,67,.8)"; c.font="700 "+Math.max(7,dw*.18)+"px 'Fira Sans Extra Condensed',sans-serif"; c.textAlign="center"; c.fillText("EXIT",VPX,FY1-dh-4);
  /* шкафчики на стенах */
  c.lineWidth=1;
  for(var side=0;side<2;side++){
    for(var k=0;k<16;k++){
      var u0=depth(k*.32), u1=depth(k*.32+.27); if(u1>.985) break;
      var xa=side?lerp(W,FX1,u0):lerp(0,FX0,u0), xb=side?lerp(W,FX1,u1):lerp(0,FX0,u1);
      var ta=lerp(Hh*.08,FY0+(FY1-FY0)*.25,u0), tb=lerp(Hh*.08,FY0+(FY1-FY0)*.25,u1), ba=lerp(Hh*.82,FY1-(FY1-FY0)*.05,u0), bb=lerp(Hh*.82,FY1-(FY1-FY0)*.05,u1);
      var a=.55*(1-u0); quad(c,[[xa,ta],[xb,tb],[xb,bb],[xa,ba]],"rgba(44,66,92,"+(.35+a*.6)+")","rgba(10,12,16,.9)");
      var sy=lerp(ta,ba,.18), sy2=lerp(tb,bb,.18); c.strokeStyle="rgba(10,12,16,.7)";
      for(var j=0;j<3;j++){c.beginPath(); c.moveTo(xa,sy+j*3*(1-u0)); c.lineTo(xb,sy2+j*3*(1-u1)); c.stroke()}
    }
  }
  /* плитка на полу */
  c.strokeStyle="rgba(0,0,0,.35)";
  for(var k2=0;k2<20;k2++){var u=depth(k2*.25); if(u>.99) break; var y=lerp(Hh,FY1,u); c.beginPath(); c.moveTo(lerp(0,FX0,u),y); c.lineTo(lerp(W,FX1,u),y); c.stroke()}
  for(var l=-1;l<=1.001;l+=.25){var a1=floorAt(0,l), a2=floorAt(1,l); c.beginPath(); c.moveTo(a1.x,a1.y); c.lineTo(a2.x,a2.y); c.stroke()}
  /* лампы на потолке */
  for(var k3=0;k3<6;k3++){var u3=depth(k3*.5+.2), y3=lerp(0,FY0,u3), w3=(lerp(W,FX1,u3)-lerp(0,FX0,u3))*.18; c.fillStyle="rgba(200,210,220,.08)"; c.fillRect(VPX-w3/2,y3-2,w3,Math.max(2,6*(1-u3)))}
}

/* силуэт Надин со спины с фонариком */
function nadin(c){
  if(IM.nadin.ready){var im=IM.nadin.img, h=Hh*.46, w=h*im.width/im.height; c.drawImage(im,W*.56-w/2,Hh-h*.86,w,h); return}
  var s=Hh*.2, x=VPX, y=Hh+4; c.save(); c.translate(x,y); c.fillStyle="#05060a";
  c.beginPath(); c.ellipse(0,-s*.86,s*.12,s*.14,0,0,7); c.fill();
  c.beginPath(); c.moveTo(-s*.15,-s*.86); c.quadraticCurveTo(-s*.2,-s*.5,-s*.13,-s*.42); c.lineTo(s*.13,-s*.42); c.quadraticCurveTo(s*.2,-s*.5,s*.15,-s*.86); c.fill();
  c.beginPath(); c.moveTo(-s*.26,0); c.quadraticCurveTo(-s*.3,-s*.55,-s*.1,-s*.66); c.lineTo(s*.1,-s*.66); c.quadraticCurveTo(s*.3,-s*.55,s*.26,0); c.fill();
  c.beginPath(); c.moveTo(s*.16,-s*.6); c.quadraticCurveTo(s*.32,-s*.5,s*.3,-s*.38); c.lineTo(s*.25,-s*.38); c.quadraticCurveTo(s*.25,-s*.48,s*.12,-s*.52); c.fill();
  c.fillStyle="#2b2f37"; c.fillRect(s*.24,-s*.44,s*.09,s*.045);
  c.restore()}
function handPos(){if(IM.nadin.ready){var im=IM.nadin.img, h=Hh*.46, w=h*im.width/im.height; return {x:W*.56-w/2+w*.03, y:Hh-h*.86+h*.646}} var s=Hh*.2; return {x:VPX+s*.3, y:Hh+4-s*.42}}

/* состояние */
var state="intro", score=0, lives=3, t=0, spawnT=0, flowerT=0, bigT=0, shadows=[], flowers=[], parts=[], beam={x:0,y:0,tx:0,ty:0}, beamR=0, dark=0, shake=0, hurt=0, last=0, raf=0, eggDone=false, kills=0, combo=0, mult=1, flashes=0, flashFx=0, superT=0, texts=[];
function reset(){score=0; lives=3; t=0; spawnT=.6; flowerT=4; bigT=38; shadows=[]; flowers=[]; parts=[]; burns=[]; dark=0; shake=0; hurt=0; kills=0; combo=0; mult=1; flashes=0; flashFx=0; superT=35+Math.random()*15; texts=[]; beam.x=beam.tx=W/2; beam.y=beam.ty=Hh*.55; hudUp()}
function diff(){return Math.min(1,t/120)}
function lane(){var best=0,bd=-1; for(var i=0;i<7;i++){var c=Math.random()*1.7-.85, m=9; shadows.forEach(function(o){if(!o.dead&&o.d>.45) m=Math.min(m,Math.abs(o.l-c))}); if(m>bd){bd=m; best=c}} return best}
function sideSpawn(){var sd=Math.random()<.5?-1:1, u=.18+Math.random()*.3, d=1-Math.sqrt(1-u);
  shadows.push({d:d, l:sd*1.08, lt:sd*(.45+Math.random()*.35), fin:0, side:true, hits:0, sp:(.07+.1*diff())*(RM?.7:1), heat:0, big:false, hp:.75, ph:Math.random()*6, dead:0, root:roots()?1+(Math.random()*3|0):0, flip:sd>0});
  var p=floorAt(u,sd*1.0), h=Hh*.4*p.s; for(var i=0;i<(RM?6:22);i++) parts.push({x:p.x+(Math.random()-.5)*h*.2,y:p.y-Math.random()*h,vx:-sd*(20+Math.random()*60),vy:-10-Math.random()*25,r:1.5+Math.random()*2.5,a:.6,f:1.1,ash:true,c:"70,74,86"});
  shake=Math.max(shake,.12)}
function spawn(big){shadows.push({d:1, l:lane(), hits:0, sp:(big?.05:.075+.13*diff())*(RM?.7:1)*(.85+Math.random()*.3), heat:0, big:!!big, hp:big?2.4:.75, ph:Math.random()*6, dead:0, root:roots()?1+(Math.random()*3|0):0, flip:Math.random()<.5})}
function rootH(o){return o.root===2?.4:o.root===3?.6:.56}
function roots(){return IM.r1.ready&&IM.r2.ready&&IM.r3.ready&&((window.SF&&SF.read)||1)>=4}
var CANDLE='<svg viewBox="0 0 20 40" aria-hidden="true"><defs><linearGradient id="cw" x1="0" x2="1"><stop offset="0" stop-color="#b9ab90"/><stop offset=".45" stop-color="#f4ead6"/><stop offset="1" stop-color="#a99a7e"/></linearGradient><radialGradient id="cf" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#fffbe8"/><stop offset=".35" stop-color="#ffd27a"/><stop offset=".75" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></radialGradient><radialGradient id="ch"><stop offset="0" stop-color="#ffb24a" stop-opacity=".55"/><stop offset=".5" stop-color="#ff9a3a" stop-opacity=".18"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient></defs><ellipse class="halo" cx="10" cy="9" rx="10" ry="10" fill="url(#ch)"/><g class="fl"><path d="M10 2.5C12.6 6.5 13.4 9.4 12.4 11.6 11.7 13.2 8.3 13.2 7.6 11.6 6.6 9.4 7.4 6.5 10 2.5Z" fill="url(#cf)"/><path d="M10 7.5C11 9.2 11.2 10.6 10.7 11.6 10.4 12.2 9.6 12.2 9.3 11.6 8.8 10.6 9 9.2 10 7.5Z" fill="#7ab0ff" opacity=".55"/></g><path class="smoke" d="M10 12C8 9 12 7 10 4" stroke="rgba(200,200,210,.5)" stroke-width="1" fill="none"/><line x1="10" y1="11.5" x2="10" y2="14.5" stroke="#2a2420" stroke-width="1.1"/><path d="M4.5 15.5Q10 13.6 15.5 15.5V37.5Q10 39 4.5 37.5Z" fill="url(#cw)"/><path d="M6 15.2Q6.4 19 5.8 21.5Q5.4 23 6.3 23.4Q7.2 23 7 21Q6.8 18 7.6 15.1Z" fill="#fbf4e4"/><path d="M12.8 15.3Q13.4 17.2 13 18.6Q12.8 19.6 13.5 19.7Q14.2 19.4 14 17.8Q13.8 16.4 14.2 15.4Z" fill="#fbf4e4"/><ellipse cx="10" cy="15.5" rx="5.5" ry="1.3" fill="#e9dcc2"/></svg>';
function hudUp(){hScore.textContent="Score: "+score; hCombo.textContent=mult>1?"×"+mult:""; hCombo.classList.toggle("hot",mult>=3); hFlash.disabled=!flashes||state!=="play"; hFlash.querySelector(".g-fn").textContent=flashes?flashes:""; hFlash.classList.toggle("ready",flashes>0); hLives.innerHTML=""; for(var i=0;i<3;i++){var h=H("span","cdl"+(i<lives?" on":"")); h.innerHTML=CANDLE; h.style.setProperty("--d",(i*.37).toFixed(2)+"s"); hLives.appendChild(h)} hBest.textContent="Best: "+best}

/* отрисовка тени */
function shadowFig(c,o,p,sc){
  if(o.ash) return;
  if(o.root){rootFig(c,o,p,sc,1); return}
  var h=Hh*.34*sc, w=h*.42, wob=Math.sin(t*3+o.ph)*.06; c.save(); c.translate(p.x,p.y);
  var a=(o.dead?Math.max(0,1-o.dead*1.6):1)*(o.fin==null?1:o.fin); c.globalAlpha=a;
  c.fillStyle="#030305";
  c.shadowColor=o.big?"rgba(140,20,30,.55)":"rgba(90,100,130,.35)"; c.shadowBlur=16*sc*DPR;
  c.beginPath(); c.moveTo(-w*.5,0);
  for(var i=0;i<=6;i++){var xx=-w*.5+w*i/6; c.lineTo(xx,-h*.04*(i%2?1.6:.4)*(1+Math.sin(t*6+i+o.ph)*.4))}
  c.quadraticCurveTo(w*.62,-h*.4,w*.32,-h*.62); c.quadraticCurveTo(w*(.7+wob),-h*.55,w*.78,-h*.4); c.quadraticCurveTo(w*.5,-h*.7,w*.24,-h*.76);
  c.quadraticCurveTo(w*.3,-h,0,-h); c.quadraticCurveTo(-w*.3,-h,-w*.24,-h*.76);
  c.quadraticCurveTo(-w*.5,-h*.7,-w*.78,-h*.4); c.quadraticCurveTo(-w*(.7-wob),-h*.55,-w*.32,-h*.62); c.quadraticCurveTo(-w*.62,-h*.4,-w*.5,0);
  c.fill(); c.restore()}
function shadowEyes(c,o,p,sc){
  if(o.ash) return;
  if(o.root){rootFig(c,o,p,sc,.13); return}
  var h=Hh*.34*sc, a=o.dead?Math.max(0,1-o.dead*2):1, bl=(Math.sin(t*2.3+o.ph)>.96)?.2:1; c.save(); c.globalAlpha=a*bl;
  c.fillStyle=o.big?"#ff3b3b":"#e8ecf2"; c.shadowColor=c.fillStyle; c.shadowBlur=8*DPR;
  var ey=p.y-h*.86, ex=h*.07; c.beginPath(); c.ellipse(p.x-ex,ey,Math.max(1,h*.022),Math.max(.8,h*.012),0,0,7); c.ellipse(p.x+ex,ey,Math.max(1,h*.022),Math.max(.8,h*.012),0,0,7); c.fill(); c.restore()}
function fR(){return Math.max(8,Math.min(W,Hh)*.022)}
function flower(c,f,glow){
  var r=fR()*(f.sup?1.25:1), grow=Math.min(1,f.t*2.4), k=1-Math.pow(1-grow,3), a=1, x=f.x, y=f.y, rot=f.rot+Math.sin(t*.9+f.rot)*.15;
  if(f.got){var g=f.got/.6, e=g*g; a=1-g; k*=1+g*.6; x=lerp(f.x,W*.12,e); y=lerp(f.y,-10,e); rot+=g*3}
  else if(f.life<0){var q=-f.life/.6; a=1-q; k*=1-q*.85; rot+=q*2.5}
  if(a<=0||k<=0) return; c.save(); c.translate(x,y+Math.sin(t*1.6+f.rot)*r*.08); c.globalAlpha=a;
  if(glow){var pul=.6+.4*Math.sin(t*3+f.rot); var gg=c.createRadialGradient(0,0,0,0,0,r*2.6*k); var gc=f.sup?"255,190,80":"170,90,255"; gg.addColorStop(0,"rgba("+gc+","+((f.sup?.55:.32)*pul)+")"); gg.addColorStop(1,"rgba("+gc+",0)"); c.fillStyle=gg; c.beginPath(); c.arc(0,0,r*2.6*k,0,7); c.fill()}
  c.rotate(rot); var d=r*2*k;
  var fim=f.sup?IM.flowerB:IM.flower; if(fim.ready){c.globalAlpha=a; c.drawImage(fim.img,-d/2,-d/2,d,d)}
  c.restore()}
function frame(dt){
  var c=cx; c.setTransform(DPR,0,0,DPR,0,0);
  var sx=shake&&!RM?(Math.random()-.5)*shake*14:0, sy=shake&&!RM?(Math.random()-.5)*shake*14:0;
  c.clearRect(0,0,W,Hh); c.save(); c.translate(sx,sy);
  c.drawImage(bgc,0,0,W,Hh);
  var list=shadows.slice().sort(function(a,b){return b.d-a.d});
  
  list.forEach(function(o){var p=floorAt(uOf(o.d),o.l*(.55+.45*o.d)); shadowFig(c,o,p,p.s*(o.big?1.5:1))});
  /* темнота + луч */
  var d=dx; d.setTransform(DPR,0,0,DPR,0,0); d.globalCompositeOperation="source-over"; d.clearRect(0,0,W,Hh);
  d.fillStyle="rgba(3,4,8,"+(state==="play"?.58:.5)+")"; d.fillRect(0,0,W,Hh);
  var R=beamR*(dark>0?(Math.random()<.5?0:.15):1);
  if(R>2){d.globalCompositeOperation="destination-out";
    var hp=handPos(), ang=Math.atan2(beam.y-hp.y,beam.x-hp.x), nx=Math.cos(ang+1.5708)*R*.85, ny=Math.sin(ang+1.5708)*R*.85;
    d.fillStyle="rgba(0,0,0,.28)"; d.beginPath(); d.moveTo(hp.x,hp.y); d.lineTo(beam.x+nx,beam.y+ny); d.lineTo(beam.x-nx,beam.y-ny); d.closePath(); d.fill();
    var g=d.createRadialGradient(beam.x,beam.y,0,beam.x,beam.y,R); g.addColorStop(0,"rgba(0,0,0,1)"); g.addColorStop(.55,"rgba(0,0,0,.9)"); g.addColorStop(1,"rgba(0,0,0,0)");
    d.fillStyle=g; d.beginPath(); d.arc(beam.x,beam.y,R,0,7); d.fill()}
  c.drawImage(dk,0,0,W,Hh);
  if(R>2){var wg=c.createRadialGradient(beam.x,beam.y,0,beam.x,beam.y,R); wg.addColorStop(0,"rgba(255,236,190,.12)"); wg.addColorStop(1,"rgba(255,236,190,0)"); c.fillStyle=wg; c.beginPath(); c.arc(beam.x,beam.y,R,0,7); c.fill()}
  flowers.forEach(function(f){flower(c,f,true)});
  list.forEach(function(o){var p=floorAt(uOf(o.d),o.l*(.55+.45*o.d)); shadowEyes(c,o,p,p.s*(o.big?1.5:1))});
  burnDraw(c);
  nadin(c);
  texts.forEach(function(q){var life=q.big?1.1:.9, a=Math.max(0,1-q.t/life); c.save(); c.globalAlpha=a; c.textAlign="center"; c.font=(q.big?"700 "+Math.round(Math.min(W,Hh)*.06)+"px":"700 "+Math.round(Math.min(W,Hh)*.042)+"px")+" 'Fira Sans Extra Condensed',Arial Narrow,sans-serif"; c.shadowColor="rgba(0,0,0,.8)"; c.shadowBlur=6; c.fillStyle="rgb("+q.col+")"; c.fillText(q.txt,q.x,q.y); c.restore()});
  parts.forEach(function(q){c.fillStyle="rgba("+q.c+","+Math.max(0,q.a)+")"; if(q.glow){c.beginPath(); c.arc(q.x,q.y,q.r,0,7); c.fill()} else c.fillRect(q.x,q.y,q.r,q.r*.7)});
  c.restore();
  if(flashFx>0){c.fillStyle="rgba(255,246,220,"+(flashFx*.85)+")"; c.fillRect(0,0,W,Hh)}
  if(hurt>0){c.fillStyle="rgba(217,58,67,"+(hurt*.45)+")"; c.fillRect(0,0,W,Hh)}
  /* полосы как на кассете */
  if(dark>0||hurt>0){c.fillStyle="rgba(255,255,255,.05)"; for(var i=0;i<4;i++) c.fillRect(0,Math.random()*Hh,W,2+Math.random()*6)}
}
function uOf(dd){return 1-(1-dd)*(1-dd)}

function step(dt){
  t+=dt; shake=Math.max(0,shake-dt*2.5); hurt=Math.max(0,hurt-dt*1.6); dark=Math.max(0,dark-dt);
  beam.x+=(beam.tx-beam.x)*Math.min(1,dt*14); beam.y+=(beam.ty-beam.y)*Math.min(1,dt*14);
  beamR=Math.min(W,Hh)*(.21-.04*diff());
  spawnT-=dt; if(spawnT<=0){if(t>18&&Math.random()<.22+.13*diff()) sideSpawn(); else spawn(false); spawnT=(1.7-1.05*diff())*(RM?1.4:1)*(.7+Math.random()*.6); if(diff()>.4&&Math.random()<.25) spawn(false)}
  bigT-=dt; if(bigT<=0){spawn(true); dark=1.6; bigT=40+Math.random()*15}
  flowerT-=dt; if(flowerT<=0){var fx,fy,tr=0; do{fx=W*(.08+Math.random()*.84); fy=Hh*(.12+Math.random()*.74); tr++}while(tr<8&&Math.abs(fx-W*.56)<W*.16&&fy>Hh*.55); flowers.push({x:fx,y:fy,life:3.2,t:0,rot:Math.random()*6}); flowerT=8+Math.random()*7}
  superT-=dt; if(superT<=0){var sx3,sy3,tr2=0; do{sx3=W*(.1+Math.random()*.8); sy3=Hh*(.12+Math.random()*.6); tr2++}while(tr2<8&&Math.abs(sx3-W*.56)<W*.16&&sy3>Hh*.55); flowers.push({x:sx3,y:sy3,life:2.4,t:0,rot:Math.random()*6,sup:true}); superT=45+Math.random()*20}
  flashFx=Math.max(0,flashFx-dt*1.8); texts.forEach(function(q){q.t+=dt; q.y-=dt*(q.big?18:34)}); texts=texts.filter(function(q){return q.t<(q.big?1.1:.9)});
  flowers.forEach(function(f){f.t+=dt; if(f.got) f.got+=dt; else f.life-=dt}); flowers=flowers.filter(function(f){return f.got?f.got<.6:f.life>-.6});
  shadows.forEach(function(o){
    if(o.dead){o.dead+=dt; return}
    if(o.side){o.fin=Math.min(1,o.fin+dt*2.5); o.l+=(o.lt-o.l)*Math.min(1,dt*2.2)}
    var p=floorAt(uOf(o.d),o.l*(.55+.45*o.d)), sc=p.s*(o.big?1.5:1), h=Hh*(o.root?rootH(o):.34)*sc, cy=p.y-h*.55;
    var lit=beamR>2&&dark<=0&&uOf(o.d)<.62&&Math.hypot(beam.x-p.x,beam.y-cy)<beamR*.75+h*.18;
    o.d-=o.sp*dt*(lit?.45:1); o.flash=Math.max(0,(o.flash||0)-dt*4);
    if(o.d<=.03){o.dead=.001; lives--; combo=0; mult=1; hurt=1; shake=1; hudUp(); if(navigator.vibrate) try{navigator.vibrate(120)}catch(e){} if(lives<=0) end()}
  });
  shadows=shadows.filter(function(o){return !o.dead||o.dead<.7});
  burnStep(dt);
  parts.forEach(function(q){if(q.d>0){q.d-=dt; return} q.x+=q.vx*dt+(q.ash?Math.sin(t*3+q.y*.05)*10*dt:0); q.y+=q.vy*dt; q.vy+=(q.ash?-14:30)*dt; q.vx*=q.ash?.995:1; q.a-=dt*(q.f||1.2)}); parts=parts.filter(function(q){return q.a>0});
}

/* смерть: огонь прожигает фигуру от места, куда светил фонарик; край тлеет, сгоревшее осыпается пеплом */
var snap=document.createElement("canvas"), sx2=snap.getContext("2d"), burns=[];
function noiseField(w,h,hx,hy){
  var f=new Float32Array(w*h), cs=[12,5], amp=[.7,.3], md=0;
  var maxd=Math.max(Math.hypot(hx,hy),Math.hypot(w-hx,hy),Math.hypot(hx,h-hy),Math.hypot(w-hx,h-hy));
  for(var o=0;o<2;o++){var c=Math.max(3,Math.round(Math.min(w,h)/cs[o])), gw=Math.ceil(w/c)+2, gh=Math.ceil(h/c)+2, g=new Float32Array(gw*gh);
    for(var i=0;i<g.length;i++) g[i]=Math.random();
    for(var y=0;y<h;y++){var fy=y/c, y0=fy|0, ty=fy-y0; ty=ty*ty*(3-2*ty);
      for(var x=0;x<w;x++){var fx=x/c, x0=fx|0, tx2=fx-x0; tx2=tx2*tx2*(3-2*tx2);
        var a=g[y0*gw+x0], b=g[y0*gw+x0+1], c2=g[(y0+1)*gw+x0], d=g[(y0+1)*gw+x0+1];
        f[y*w+x]+=amp[o]*((a+(b-a)*tx2)+((c2+(d-c2)*tx2)-(a+(b-a)*tx2))*ty)}}}
  for(var y2=0;y2<h;y2++) for(var x2=0;x2<w;x2++){var i2=y2*w+x2; f[i2]=.58*Math.hypot(x2-hx,y2-hy)/maxd+.42*f[i2]}
  return f}
function ashify(o,p,sc){
  var h=Hh*(o.root?rootH(o):.34)*sc, k=Math.min(1.5,DPR);
  var x0=Math.max(0,Math.floor(p.x-h*.8)), x1=Math.min(W,Math.ceil(p.x+h*.8)), y0=Math.max(0,Math.floor(p.y-h*1.1)), y1=Math.min(Hh,Math.ceil(p.y+6));
  if(x1-x0<3||y1-y0<3) return;
  snap.width=Math.round(W*k); snap.height=Math.round(Hh*k); sx2.setTransform(k,0,0,k,0,0); sx2.clearRect(0,0,W,Hh);
  var keep=o.dead, sd=DPR; o.dead=0; o.ash=false; DPR=k; if(o.root) rootFig(sx2,o,p,sc,1); else shadowFig(sx2,o,p,sc); DPR=sd; o.dead=keep;
  var bx0=Math.round(x0*k), by0=Math.round(y0*k), bw=Math.round((x1-x0)*k), bh=Math.round((y1-y0)*k), img;
  try{img=sx2.getImageData(bx0,by0,bw,bh)}catch(e){burst(p.x,p.y-h*.5,h); return}
  var cvb=document.createElement("canvas"); cvb.width=bw; cvb.height=bh;
  var hx=(Math.min(Math.max(beam.x,x0),x1)-x0)*k, hy=(Math.min(Math.max(beam.y,y0),y1)-y0)*k;
  burns.push({cv:cvb, ctx:cvb.getContext("2d"), src:img.data, out:cvb.getContext("2d").createImageData(bw,bh), f:noiseField(bw,bh,hx,hy), w:bw, h:bh, x:x0, y:y0, k:k, p:-.08, dur:RM?.8:1.35});
  shake=Math.max(shake,.25)}
function burnStep(dt){
  burns.forEach(function(b){
    b.p+=dt/b.dur; var p=b.p, E=.07, C=.13, s=b.src, o=b.out.data, f=b.f, n=b.w*b.h, emit=RM?3:12, cand=[];
    for(var i=0;i<n;i++){var j=i*4, a=s[j+3]; if(a<8){o[j+3]=0; continue}
      var v=f[i]-p;
      if(v<0){o[j+3]=0; continue}
      if(v<E){var t2=v/E; o[j]=255; o[j+1]=235-150*t2|0; o[j+2]=150-130*t2|0; o[j+3]=a; if(cand.length<400&&(i&7)===0) cand.push(i); continue}
      if(v<C){var q=(v-E)/(C-E), m=.12+.5*q; o[j]=s[j]*m+30*(1-q)|0; o[j+1]=s[j+1]*m+8*(1-q)|0; o[j+2]=s[j+2]*m|0; o[j+3]=a; continue}
      o[j]=s[j]; o[j+1]=s[j+1]; o[j+2]=s[j+2]; o[j+3]=a}
    b.ctx.putImageData(b.out,0,0);
    for(var e=0;e<emit&&cand.length;e++){var ii=cand[Math.random()*cand.length|0], px=b.x+(ii%b.w)/b.k, py=b.y+((ii/b.w)|0)/b.k, ember=Math.random()<.3;
      parts.push({x:px,y:py,r:ember?.7+Math.random()*.9:1.5+Math.random()*2.5,ash:true,vx:(Math.random()-.5)*26+6,vy:-(15+Math.random()*45),a:ember?1:.8,f:ember?1.8+Math.random():.55+Math.random()*.4,
        c:ember?"255,"+(90+Math.random()*120|0)+","+(30+Math.random()*40|0):(22+Math.random()*26|0)+","+(20+Math.random()*22|0)+","+(20+Math.random()*18|0),glow:ember})}
  });
  burns=burns.filter(function(b){return b.p<1.1})}
function burnDraw(c){burns.forEach(function(b){c.drawImage(b.cv,b.x,b.y,b.w/b.k,b.h/b.k);
})}
function burst(x,y,h){for(var i=0;i<(RM?8:24);i++){var a=Math.random()*6.28, v=20+Math.random()*90; parts.push({x:x,y:y+(Math.random()-.5)*h*.6,vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,r:2+Math.random()*2,a:1,c:Math.random()<.5?"20,20,24":"200,60,50"})}}
function hitAt(px,py){
  var best=null, bd=9;
  shadows.forEach(function(o){if(o.dead) return; var u=uOf(o.d); if(u>.66) return;
    var p=floorAt(u,o.l*(.55+.45*o.d)), sc=p.s*(o.big?1.5:1), h=Hh*(o.root?rootH(o):.34)*sc, w=h*(o.root===2?.68:.5);
    if(px>p.x-w*.55&&px<p.x+w*.55&&py>p.y-h*1.02&&py<p.y){if(o.d<bd){bd=o.d; best={o:o,p:p,sc:sc}}}});
  if(!best) return false; var o=best.o; o.hits++; o.flash=1;
  if(o.hits>=(o.big?3:1)) kill(o,best.p,best.sc)
  else{shake=Math.max(shake,.15); o.d=Math.min(1,o.d+.04)}
  return true}
function kill(o,p,sc){
  ashify(o,p,sc); o.dead=.001; o.ash=true; kills++; combo++;
  var nm=combo>=10?4:combo>=6?3:combo>=3?2:1, pts=(o.big?5:1)*nm; score+=pts;
  var h=Hh*(o.root?rootH(o):.34)*sc; texts.push({x:p.x,y:p.y-h*1.05,txt:"+"+pts,t:0,col:nm>1?"255,200,90":"240,236,226"});
  if(nm>mult) texts.push({x:W/2,y:Hh*.22,txt:"STREAK ×"+nm,t:0,big:true,col:"255,170,70"});
  mult=nm; hudUp(); checkEgg()}
function miss(px,py){if(combo>=3) texts.push({x:px,y:py,txt:"miss",t:0,col:"200,200,210"}); combo=0; if(mult>1){mult=1; hudUp()}}
function useFlash(){if(!flashes||state!=="play") return; flashes--; flashFx=1; shake=Math.max(shake,.5);
  shadows.forEach(function(o){if(o.dead) return; var u=uOf(o.d); if(u>.97) return; var p=floorAt(u,o.l*(.55+.45*o.d)); kill(o,p,p.s*(o.big?1.5:1))});
  hudUp()}
hFlash.addEventListener("click",function(){useFlash()});
document.addEventListener("keydown",function(e){if(!root.offsetParent) return; if(e.key==="Escape"||e.key==="p"||e.key==="P"||e.key==="з"||e.key==="З"){if(state==="play"){e.preventDefault(); pause()} else if(state==="pause"){e.preventDefault(); resume()} return}if(state==="play"&&(e.code==="Space"||e.key===" ")&&root.offsetParent){e.preventDefault(); useFlash()}});
function checkEgg(){if(!eggDone&&score>=50){eggDone=true; if(window.SFegg) window.SFegg("shadows")}}

function loop(now){
  if(state!=="play") return;
  var dt=Math.min(.05,(now-last)/1000||0); last=now;
  if(!root.offsetParent||document.hidden){pause(); return}
  step(dt); frame(dt); raf=requestAnimationFrame(loop)}

/* экраны */
var PH=["He found you.","The flashlight went out.","They made it. This time.","The candles went out.","Someone will kill everyone soon."];
function screen(kind){
  ov.innerHTML=""; ov.hidden=false; var box=H("div","g-card");
  if(kind==="intro"){
    box.appendChild(H("h3","","Don't let them reach you"));
    box.appendChild(H("p","","Night, an empty school. Creatures are crawling toward Nadine."));
    var ul=H("ul",""); ["Shine the flashlight and tap the creatures: they'll burn.","If they reach Nadine, a candle goes out. There are only three.","Hellebore gives 5 points. Burn them in a row without missing, and your points multiply.","Catch the rare black hellebore: its flash burns everyone.","The big one needs to be set on fire three times."].forEach(function(s){ul.appendChild(H("li","",s))}); box.appendChild(ul);
    var b=H("button","g-btn","Start"); b.type="button"; b.onclick=start; box.appendChild(b)}
  else if(kind==="pause"){box.appendChild(H("h3","","Pause")); box.appendChild(H("p","","Score: "+score+(mult>1?" · streak ×"+mult:""))); var row=H("div","g-row"), b2=H("button","g-btn","Continue"), b4=H("button","g-btn g-ghost","Again"); b2.type=b4.type="button"; b2.onclick=resume; b4.onclick=start; row.appendChild(b2); row.appendChild(b4); box.appendChild(row)}
  else{
    box.appendChild(H("h3","",PH[Math.random()*PH.length|0]));
    box.appendChild(H("p","g-big","Score: "+score));
    var nb=score>best&&score>0; if(nb){best=score; try{localStorage.setItem(BK,String(best))}catch(e){}}
    box.appendChild(H("p","",nb?"New record!":"Best: "+best));
    var b3=H("button","g-btn","One more time"); b3.type="button"; b3.onclick=start; box.appendChild(b3); hudUp()}
  ov.appendChild(box); var f=box.querySelector("button"); if(f&&kind!=="intro") setTimeout(function(){try{f.focus({preventScroll:true})}catch(e){}},50)}
function start(){reset(); ov.hidden=true; hPause.hidden=false; fit(); state="play"; last=performance.now(); cancelAnimationFrame(raf); raf=requestAnimationFrame(loop)}
function fit(){var bar=document.querySelector(".epbar"), bh=bar&&getComputedStyle(bar).position==="sticky"?bar.offsetHeight:0, r=root.getBoundingClientRect(); if(r.top<bh+8||r.bottom>innerHeight) window.scrollTo({top:scrollY+r.top-bh-8,behavior:RM?"auto":"smooth"})}
function pause(){if(state!=="play") return; state="pause"; cancelAnimationFrame(raf); hPause.hidden=true; hudUp(); screen("pause")}
function resume(){ov.hidden=true; hPause.hidden=false; state="play"; last=performance.now(); raf=requestAnimationFrame(loop)}
function end(){state="over"; hPause.hidden=true; cancelAnimationFrame(raf); frame(0); setTimeout(function(){screen("over")},500)}

/* управление: мышь и палец */
function pt(e){var r=cv.getBoundingClientRect(); return {x:e.clientX-r.left,y:e.clientY-r.top}}
cv.addEventListener("pointermove",function(e){var p=pt(e); beam.tx=p.x; beam.ty=p.y});
cv.addEventListener("pointerdown",function(e){var p=pt(e); beam.tx=p.x; beam.ty=p.y; if(e.pointerType!=="mouse"){beam.x=p.x; beam.y=p.y}
  if(state!=="play") return;
  for(var i=0;i<flowers.length;i++){var f=flowers[i]; if(f.got) continue; var r=fR()*1.9;
    if(Math.hypot(p.x-f.x,p.y-f.y)<r){f.got=.001; if(f.sup){flashes=Math.min(2,flashes+1); texts.push({x:W/2,y:Hh*.22,txt:"FLASH READY",t:0,big:true,col:"255,214,120"})} else {score+=5*mult; texts.push({x:f.x,y:f.y-12,txt:"+"+5*mult,t:0,col:"200,160,255"})} hudUp(); checkEgg(); return}}
  if(!hitAt(p.x,p.y)) miss(p.x,p.y)});
document.addEventListener("visibilitychange",function(){if(document.hidden) pause()});
var rz; addEventListener("resize",function(){clearTimeout(rz); rz=setTimeout(size,150)});
/* вкладка стала видимой — подогнать размер */
function tabCls(){document.body.classList.toggle("tab-game",!document.getElementById("tab-game").hidden)}
new MutationObserver(function(){tabCls(); if(root.offsetParent) size(); else pause()}).observe(document.getElementById("tab-game"),{attributes:true,attributeFilter:["hidden"]});

tabCls(); size(); reset(); screen("intro");
})();
