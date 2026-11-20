/* Мини-игра «Броски с Руди»: кольцо впереди, мяч тянешь вниз как рогатку, точки показывают полёт, отпускаешь — бросок. 30 секунд.
   Пока тестовая: видна только после ?ball (выключить: ?ball=0). */
(function(){
var TK="sentfor_balltest";
try{if(/[?&]ball=0\b/.test(location.search)) localStorage.removeItem(TK); else if(/[?&]ball\b/.test(location.search)) localStorage.setItem(TK,"1")}catch(e){}
var on=false; try{on=localStorage.getItem(TK)==="1"}catch(e){}
var wrap=document.getElementById("ball-wrap"), root=document.getElementById("ball");
if(!wrap||!root) return;
if(!on){wrap.remove(); return}
wrap.hidden=false;

var BK="sentfor_ball_best", best=0; try{best=+localStorage.getItem(BK)||0}catch(e){}
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function pick(a){return a[Math.floor(Math.random()*a.length)]}

/* ---------- реплики Руди ---------- */
var SAY={
  start:["Ну давай, Росс, покажи класс","Я капитан, а не тренер. Но так и быть","Тридцать секунд. Не подведи"],
  hit:["Неплохо для журналистки","Записывай в свою газету","Ты точно не тренировалась тайком?","Есть!","Вот это бросок"],
  swish:["Даже сетка не шелохнулась","Чисто! Лиам так не умеет","Вот это я понимаю"],
  rim:["Ух, почти","Кольцо сегодня вредное","Чуть-чуть не хватило"],
  short:["Ты забываешь про ноги: они толкают, а руки направляют","Сильнее! Мяч не кусается","Это был бросок или пас?","Кольцо выше, Надин"],
  long:["Ты забываешь про ноги: они толкают, а руки направляют","Полегче, это не волейбол","Ты в кольцо или в табло целишься?","Тед, лови! Ой, не Тед"],
  side:["Левее… то есть правее","Кольцо вон там, если что","Целься в кольцо, а не в трибуны"],
  move:["А теперь посложнее","Держи темп, кольцо поехало","Ладно, усложним"],
  streak:["Три подряд! Ты в ударе","Серия! Я начинаю волноваться за своё место"],
  first:["А что-то не меняется, да?"],
  hopeless:["Ты безнадёжна"],
  tip:["Смотри, даже сейчас держишь неправильно, кисть зажимаешь. Пальцы должны быть вот так…","Согни колени и стопы поставь параллельно","Вначале выпрямляешь ноги, толкаешь тело вверх, потом бросаешь"],
  end:[[0,"Ладно, на скамейку запасных"],[6,"Для первого раза нормально"],[16,"Может, в команду пойдёшь?"],[30,"Лиам, у нас новый капитан"]]
};

/* ---------- разметка ---------- */
var stage=H("div","bl-stage"), cv=H("canvas"), cx=cv.getContext("2d");
cv.setAttribute("aria-label","Задний двор: потяни мяч вниз и отпусти, чтобы бросить в кольцо");
var hud=H("div","bl-hud"), hScore=H("span","bl-score"), hTime=H("span","bl-time"), hBest=H("span","bl-best");
hud.appendChild(hScore); hud.appendChild(hTime); hud.appendChild(hBest);
/* Руди — как в новелле: портрет и плашка с репликой */
var rudi=H("div","bl-rudi"), ava=H("img"), box=H("div","bl-box"), bub=H("div","bl-bub");
ava.src="img/rudi_yard.webp"; ava.alt="Руди"; ava.loading="lazy"; box.appendChild(H("b","bl-name","Руди")); box.appendChild(bub); rudi.appendChild(ava); rudi.appendChild(box);
var pop=H("div","bl-pop"), ov=H("div","bl-ov");
stage.appendChild(cv); stage.appendChild(hud); stage.appendChild(rudi); stage.appendChild(pop); stage.appendChild(ov);
root.appendChild(stage);

var BGSRC="img/game_yard.webp";
var bg=new Image(), bgOk=false; bg.onload=function(){bgOk=true; if(state!=="play") draw()};
(function(){var s=document.getElementById("tab-game"); function go(){if(!bg.src) bg.src=BGSRC}
  if(!s||!s.hidden) go(); else new MutationObserver(function(_,ob){if(!s.hidden){go(); ob.disconnect()}}).observe(s,{attributes:true,attributeFilter:["hidden"]})})();

/* ---------- мир: метры; камера смотрит вдоль z ---------- */
var G=9.8, ZH=4.0, YH=3.05, RR=0.23, BR=0.12, Y0=1.2, Z0=0.3, T=1.05, K=0.38, CAMY=1.6, CAMZ=-1.7, BOARDZ=ZH+RR+0.16;
var VYS=(YH-Y0+0.5*G*T*T)/T;
var W=0,Hh=0,DPR=1,F=1,HOR=0;
function size(){
  var w=Math.min(560,root.clientWidth||360), h=Math.round(Math.min(Math.max(420,w*1.25),Math.max(420,innerHeight-140)));
  W=w; Hh=h; DPR=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.round(w*DPR); cv.height=Math.round(h*DPR); cv.style.width=w+"px"; cv.style.height=h+"px"; stage.style.height=h+"px";
  F=Math.min(w*1.25,h*.95); HOR=h*.64; draw()}
function P(x,y,z){var d=z-CAMZ; return {x:W/2+x*F/d, y:HOR-(y-CAMY)*F/d, s:F/d}}

/* ---------- состояние ---------- */
var miss3=0, missed=false, state="idle", score=0, left=30, streak=0, made=0, hoopX=0, hoopT=0, moving=0, ball=null, last=0, raf=0, sayT=0, net=0;
function resetBall(){ball={x:0,y:Y0,z:Z0,vx:0,vy:0,vz:0,fly:false,rim:false,board:false,done:false,res:"",spin:0,top:Y0,cz:null,cx:0}}
resetBall();

var SMILE={start:1,hit:1,swish:1,streak:1,hopeless:1,spot:1}; (new Image()).src="img/rudi_yard_smile.webp";
function face(sm){var f="img/rudi_yard"+(sm?"_smile":"")+".webp"; if(ava.getAttribute("src")!==f) ava.src=f}
function say(k,force){var a=SAY[k]; if(!a) return; if(!force&&performance.now()-sayT<1400) return; sayT=performance.now(); face(SMILE[k]);
  bub.textContent=pick(a); rudi.classList.remove("on"); void rudi.offsetWidth; rudi.classList.add("on"); clearTimeout(hideT); if(state==="play") hideT=setTimeout(function(){rudi.classList.remove("on")},2600)}
var hideT=0;
function showPop(t,good){pop.textContent=t; pop.className="bl-pop "+(good?"good":"bad"); void pop.offsetWidth; pop.classList.add("go")}
function hudUp(){hScore.textContent=score+" очк."; hTime.textContent="0:"+String(Math.max(0,Math.ceil(left))).padStart(2,"0"); hBest.textContent="рекорд "+best}

/* ---------- бросок ---------- */
function vel(p,ratio){
  p=Math.max(.55,Math.min(1.6,p)); var vy=VYS*(1+(p-1)*.5), disc=vy*vy-2*G*(YH-Y0), td=disc>0?(vy+Math.sqrt(disc))/G:T*.9;
  return {vy:vy, vz:(ZH-Z0)/td*(1+(p-1)*K), vx:ratio*1.6, td:td}}
function launch(p,ratio){p*=1+(Math.random()-.5)*.05; ratio+=(Math.random()-.5)*.07; var v=vel(p,ratio); ball.vy=v.vy; ball.vz=v.vz; ball.vx=v.vx; ball.fly=true; ball.spin=(Math.random()-.5)*8}

function judge(){ // мяч пересёк высоту кольца сверху вниз
  var dx=ball.x-hoopX, dz=ball.z-ZH, d=Math.hypot(dx,dz);
  if(d<RR-BR*.5){ball.done=true; var pts=(ball.rim?2:3); score+=pts; made++; streak++; miss3=0; net=1;
    showPop("+"+pts,true); if(streak===3||streak===7) say("streak",true); else say(ball.rim?"hit":"swish");
    if(made===4&&!moving){moving=1; setTimeout(function(){say("move",true)},900)} if(made===10) moving=2; hudUp(); return}
  if(d<RR+BR&&!ball.rim){ // удар о дужку: отскок
    ball.rim=true; var nx=dx/(d||1), nz=dz/(d||1), out=d>RR?1:-1;
    ball.vy=1.4+Math.random()*1.2; ball.vx=nx*out*(.6+Math.random()*.8)+(Math.random()-.5)*.4; ball.vz=nz*out*(.6+Math.random()*.8); ball.y=YH+.02; return}
}
/* мяч снова в руках: иногда Руди даёт совет, пока целишься */
var shots=0; function ready(){shots++; if(state!=="play") return; if(shots===2||(shots>3&&Math.random()<.25)) setTimeout(function(){if(!drag&&!ball.fly&&state==="play") say("tip",true)},1500)}
function miss(){
  miss3++;
  if(!missed){missed=true; streak=0; say("first",true); return}
  if(miss3===3){streak=0; say("hopeless",true); return}
  streak=0; var cz=ball.cz==null?ball.z:ball.cz, cxx=ball.cz==null?ball.x:ball.cx;
  var why=ball.rim?"rim":ball.board?"long":(ball.top<YH||cz<ZH-RR?"short":(Math.abs(cxx-hoopX)>RR*1.4?"side":"long")); say(why);
}

function step(dt){
  if(state==="play"){left-=dt; if(left<=0){left=0; end()}}
  hoopT+=dt; var tx=moving?Math.sin(hoopT*(moving===2?1.7:1.1))*(moving===2?.7:.5):0; hoopX+= (tx-hoopX)*Math.min(1,dt*4);
  net=Math.max(0,net-dt*2.2);
  if(!ball.fly) return;
  var py=ball.y, pz=ball.z;
  ball.vy-=G*dt; ball.x+=ball.vx*dt; ball.y+=ball.vy*dt; ball.z+=ball.vz*dt; ball.roll=(ball.roll||0)-dt*(7+Math.abs(ball.spin||0)); if(ball.y>ball.top) ball.top=ball.y;
  // щит
  if(pz<BOARDZ-BR&&ball.z>=BOARDZ-BR&&ball.y>2.85&&ball.y<4.0&&Math.abs(ball.x-hoopX)<.95){ball.z=BOARDZ-BR; ball.vz=-Math.abs(ball.vz)*.45; ball.vx*=.7; ball.board=true}
  if(!ball.done&&py>=YH&&ball.y<YH&&ball.vy<0){if(ball.cz==null){ball.cz=ball.z; ball.cx=ball.x} judge()}
  if(ball.y<BR){ // пол
    ball.y=BR; if(ball.vy<-2){ball.vy=-ball.vy*.45; ball.vz*=.6; ball.vx*=.6} else {ball.vy=0}
    if(!ball.res){ball.res=ball.done?"in":"miss"; if(!ball.done) miss(); setTimeout(function(){if(state!=="over"){resetBall(); ready()}},450)}}
  if(ball.z>BOARDZ+1||ball.z<CAMZ+.4||Math.abs(ball.x)>5){if(!ball.res){ball.res="miss"; miss()} resetBall(); ready()}
}

/* ---------- рисование ---------- */
function rr(x,y,w,h,r){cx.beginPath(); cx.moveTo(x+r,y); cx.arcTo(x+w,y,x+w,y+h,r); cx.arcTo(x+w,y+h,x,y+h,r); cx.arcTo(x,y+h,x,y,r); cx.arcTo(x,y,x+w,y,r); cx.closePath()}
function drawBg(){
  if(bgOk){var iw=bg.naturalWidth, ih=bg.naturalHeight, sc=Math.max(W/iw,Hh/ih), w=iw*sc, h=ih*sc;
    cx.save(); cx.filter="blur(.6px) brightness(.8)"; cx.drawImage(bg,(W-w)/2,(Hh-h)*.5,w,h); cx.restore()}
  else {cx.fillStyle="#1b1712"; cx.fillRect(0,0,W,Hh)}
  var g=cx.createLinearGradient(0,0,0,Hh); g.addColorStop(0,"rgba(10,10,16,.35)"); g.addColorStop(.55,"rgba(10,10,16,0)"); g.addColorStop(1,"rgba(10,8,6,.55)");
  cx.fillStyle=g; cx.fillRect(0,0,W,Hh)}
function drawBoard(){
  var p0=P(hoopX,2.85,BOARDZ+.35), p1={y:Math.min(P(hoopX,0,BOARDZ+.35).y,Hh*.6)}, pw=Math.max(3,p0.s*.08), pg=cx.createLinearGradient(0,p0.y,0,p1.y); pg.addColorStop(0,"rgba(30,32,38,.95)"); pg.addColorStop(.7,"rgba(30,32,38,.5)"); pg.addColorStop(1,"rgba(30,32,38,0)"); cx.fillStyle=pg; cx.fillRect(p0.x-pw/2,p0.y,pw,p1.y-p0.y);
  var a=P(hoopX-.9,3.95,BOARDZ), b=P(hoopX+.9,2.85,BOARDZ);
  cx.fillStyle="rgba(235,240,245,.16)"; cx.strokeStyle="rgba(255,255,255,.85)"; cx.lineWidth=Math.max(2,a.s*.03);
  rr(a.x,a.y,b.x-a.x,b.y-a.y,3); cx.fill(); cx.stroke();
  var c=P(hoopX-.3,3.45,BOARDZ), d=P(hoopX+.3,3.05,BOARDZ); cx.strokeStyle="rgba(255,90,70,.9)"; cx.strokeRect(c.x,c.y,d.x-c.x,d.y-c.y);
  var m=P(hoopX,3.06,BOARDZ), r0=P(hoopX,3.06,ZH+RR); cx.strokeStyle="#c94a2a"; cx.lineWidth=Math.max(2,m.s*.04); cx.beginPath(); cx.moveTo(m.x,m.y); cx.lineTo(r0.x,r0.y); cx.stroke()}
function drawRim(back){var pts=[]; for(var i=0;i<=24;i++){var t=Math.PI*i/24; var z=back?ZH+Math.sin(t)*RR:ZH-Math.sin(t)*RR; pts.push(P(hoopX+Math.cos(t)*RR,YH,z))}
  cx.strokeStyle=back?"#a8391f":"#e2542c"; cx.lineWidth=Math.max(2.5,pts[12].s*.035); cx.beginPath(); pts.forEach(function(p,i){i?cx.lineTo(p.x,p.y):cx.moveTo(p.x,p.y)}); cx.stroke()}
function drawNet(){
  var n=10, sw=net*Math.sin(performance.now()/40)*.03; cx.strokeStyle="rgba(255,255,255,.75)"; cx.lineWidth=1.2;
  for(var i=0;i<n;i++){var t=Math.PI*2*i/n, x1=hoopX+Math.cos(t)*RR, z1=ZH+Math.sin(t)*RR, x2=hoopX+Math.cos(t)*RR*.55+sw, z2=ZH+Math.sin(t)*RR*.55, yb=YH-.42-net*.08;
    var a=P(x1,YH,z1), b=P(x2,yb,z2); cx.beginPath(); cx.moveTo(a.x,a.y); cx.lineTo(b.x,b.y); cx.stroke();
    var t2=Math.PI*2*(i+1)/n, c=P(hoopX+Math.cos(t2)*RR*.55+sw,yb,ZH+Math.sin(t2)*RR*.55), m1=P(hoopX+Math.cos(t)*RR*.8,YH-.2,ZH+Math.sin(t)*RR*.8), m2=P(hoopX+Math.cos(t2)*RR*.8,YH-.2,ZH+Math.sin(t2)*RR*.8);
    cx.beginPath(); cx.moveTo(m1.x,m1.y); cx.lineTo(m2.x,m2.y); cx.moveTo(b.x,b.y); cx.lineTo(c.x,c.y); cx.stroke()}}
/* мяч: зернистая кожа, швы — настоящие кривые на шаре (крутятся в 3D), свет от фонарей и луны */
var SEAMS=(function(){var L=[], n=72, i, t;
  function ring(f){var a=[]; for(i=0;i<=n;i++){t=Math.PI*2*i/n; a.push(f(t))} L.push(a)}
  ring(function(t){return [Math.cos(t),Math.sin(t),0]});            // экватор
  ring(function(t){return [0,Math.cos(t),Math.sin(t)]});            // меридиан
  [-1,1].forEach(function(sg){ring(function(t){var c=.6, r=Math.sqrt(1-c*c); return [sg*c,r*Math.cos(t),r*Math.sin(t)]})}); // боковые
  return L})();
var GRAIN=null;
function grain(){if(GRAIN) return GRAIN; var c=document.createElement("canvas"), n=128; c.width=c.height=n; var g=c.getContext("2d"), d=g.createImageData(n,n);
  for(var k=0;k<d.data.length;k+=4){var v=Math.random(); var dot=v>.55?18:v<.12?-22:0; d.data[k]=d.data[k+1]=d.data[k+2]=dot>0?255:0; d.data[k+3]=Math.abs(dot)}
  g.putImageData(d,0,0); GRAIN=c; return c}
function rot(v,a,b){var x=v[0], y=v[1]*Math.cos(a)-v[2]*Math.sin(a), z=v[1]*Math.sin(a)+v[2]*Math.cos(a);
  var x2=x*Math.cos(b)+z*Math.sin(b), z2=-x*Math.sin(b)+z*Math.cos(b); return [x2,y,z2]}
function drawBall(){
  var p=P(ball.x,ball.y,ball.z), r=BR*p.s, sh=P(ball.x,0,ball.z);
  if(aim&&!ball.fly){p={x:p.x+aim.ox,y:p.y+aim.oy,s:p.s}; sh={x:sh.x+aim.ox,y:sh.y+aim.oy*.3}}
  cx.fillStyle="rgba(0,0,0,"+Math.max(.08,.38-ball.y*.07).toFixed(2)+")"; cx.beginPath(); cx.ellipse(sh.x,sh.y,r*1.1,r*.32,0,0,7); cx.fill();
  cx.save(); cx.beginPath(); cx.arc(p.x,p.y,r,0,7); cx.clip();
  // кожа
  var g=cx.createRadialGradient(p.x-r*.3,p.y-r*.45,r*.05,p.x,p.y,r*1.05); g.addColorStop(0,"#e9894a"); g.addColorStop(.45,"#c8601f"); g.addColorStop(.85,"#7e3510"); g.addColorStop(1,"#4a1f08");
  cx.fillStyle=g; cx.fillRect(p.x-r,p.y-r,2*r,2*r);
  cx.globalAlpha=.9; cx.drawImage(grain(),p.x-r,p.y-r,2*r,2*r); cx.globalAlpha=1;
  // швы: вращение мяча в полёте (обратная подкрутка) + небольшой наклон
  var a=ball.roll||0, b=.5+(ball.spin||0)*.05; cx.strokeStyle="rgba(28,12,4,.92)"; cx.lineWidth=Math.max(1,r*.065); cx.lineCap="round";
  SEAMS.forEach(function(line){var on=false; cx.beginPath();
    for(var i=0;i<line.length;i++){var q=rot(rot(line[i],.35,b),a,0); if(q[2]<-.05){on=false; continue}
      var X=p.x+q[0]*r, Y=p.y+q[1]*r; if(!on){cx.moveTo(X,Y); on=true} else cx.lineTo(X,Y)} cx.stroke()});
  // объём: тень снизу-справа, контровой свет фонарей снизу, блик луны сверху
  var sd=cx.createRadialGradient(p.x-r*.35,p.y-r*.4,r*.2,p.x,p.y,r*1.02); sd.addColorStop(0,"rgba(0,0,0,0)"); sd.addColorStop(.7,"rgba(0,0,0,.18)"); sd.addColorStop(1,"rgba(0,0,0,.6)");
  cx.fillStyle=sd; cx.fillRect(p.x-r,p.y-r,2*r,2*r);
  var rim=cx.createLinearGradient(0,p.y+r*.4,0,p.y+r); rim.addColorStop(0,"rgba(255,170,90,0)"); rim.addColorStop(1,"rgba(255,170,90,.28)"); cx.fillStyle=rim; cx.fillRect(p.x-r,p.y,2*r,r);
  var hl=cx.createRadialGradient(p.x-r*.38,p.y-r*.48,0,p.x-r*.38,p.y-r*.48,r*.42); hl.addColorStop(0,"rgba(220,230,255,.35)"); hl.addColorStop(1,"rgba(220,230,255,0)");
  cx.fillStyle=hl; cx.fillRect(p.x-r,p.y-r,2*r,2*r);
  cx.restore()}
/* прицел: вся дуга до высоты кольца, кружок там, где мяч опустится, и шкала силы у мяча */
var PMIN=.55, PMAX=1.6, OK0=.9, OK1=1.12;
function drawAim(){if(!aim) return; var v=vel(aim.p,aim.r), b=P(0,Y0,Z0), pts=[], hit=null, t=0, dt=.02, y, z, x;
  for(;t<3;t+=dt){x=v.vx*t; y=Y0+v.vy*t-.5*G*t*t; z=Z0+v.vz*t;
    if(z>=BOARDZ-BR&&y>2.85&&y<4){pts.push(P(x,y,BOARDZ-BR)); break}
    if(t>.1&&v.vy-G*t<0&&y<=YH){hit={x:x,z:z}; break}
    if(y<0) break; pts.push(P(x,y,z))}
  for(var i=0;i<pts.length;i+=2){var q=pts[i], k=.35+.6*(1-i/pts.length);
    cx.fillStyle="rgba(255,240,210,"+k.toFixed(2)+")"; cx.beginPath(); cx.arc(q.x,q.y,Math.max(1.5,q.s*.016),0,7); cx.fill()}
  if(hit){var c=P(hit.x,YH,hit.z), rx=BR*c.s*1.15, ry=rx*.3; cx.strokeStyle="rgba(255,245,220,.95)"; cx.lineWidth=2; cx.setLineDash([3,3]);
    cx.beginPath(); cx.ellipse(c.x,c.y,rx,ry,0,0,7); cx.stroke(); cx.setLineDash([])}
  // шкала силы справа от мяча
  var r=BR*b.s, bx=b.x+aim.ox+r+16, h=Math.min(120,Hh*.24), by=b.y+aim.oy+r, w=9;
  function Yp(p){return by-h*(p-PMIN)/(PMAX-PMIN)}
  cx.fillStyle="rgba(10,10,12,.55)"; rr(bx-2,by-h-2,w+4,h+4,5); cx.fill();
  cx.fillStyle="rgba(110,210,140,.35)"; cx.fillRect(bx,Yp(OK1),w,Yp(OK0)-Yp(OK1));
  var pp=Math.max(PMIN,Math.min(PMAX,aim.p)), col=pp<OK0?"#f0c44c":pp>OK1?"#e5533d":"#6fd88f";
  cx.fillStyle=col; cx.fillRect(bx,Yp(pp),w,by-Yp(pp));
  cx.strokeStyle="rgba(255,255,255,.8)"; cx.lineWidth=1; cx.strokeRect(bx+.5,Yp(OK1)+.5,w-1,Yp(OK0)-Yp(OK1)-1);
  cx.fillStyle="rgba(243,234,217,.85)"; cx.font="600 10px "+getComputedStyle(document.body).getPropertyValue("--mono"); cx.textAlign="center"; cx.fillText("сила",bx+w/2,by-h-8)}
function draw(){
  if(!W) return; cx.setTransform(DPR,0,0,DPR,0,0); cx.clearRect(0,0,W,Hh);
  drawBg(); drawBoard(); drawRim(true);
  var inside=ball.z>ZH-RR-BR&&ball.y<YH+.05&&Math.abs(ball.x-hoopX)<RR+BR;
  if(inside){drawBall(); drawNet(); drawRim(false)} else {drawNet(); drawRim(false); drawBall()}
  drawAim()}

function loop(t){raf=0; var dt=Math.min(.033,(t-(last||t))/1000); last=t; step(dt); draw(); hudUp();
  if(state==="play"||ball.fly||drag) raf=requestAnimationFrame(loop)}
function kick(){if(!raf){last=0; raf=requestAnimationFrame(loop)}}

/* ---------- рогатка: тянешь мяч вниз (и вбок — прицел), отпускаешь ---------- */
var drag=null, aim=null;
function aimAt(e){var r=cv.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top, dx=x-drag.x, dy=y-drag.y;
  var L=Hh*.26, len=Math.hypot(dx,dy), k=len>L*1.5?L*1.5/len:1; dx*=k; dy*=k;
  if(dy<8){aim=null; return}
  aim={p:.2+dy/L*.8, r:-dx/dy*.9, ox:dx*.3, oy:dy*.25}}
cv.addEventListener("pointerdown",function(e){if(state!=="play"||ball.fly) return; var r=cv.getBoundingClientRect(); drag={x:e.clientX-r.left,y:e.clientY-r.top}; aim=null;
  try{cv.setPointerCapture(e.pointerId)}catch(_){} cv.classList.add("aiming"); rudi.classList.remove("on"); e.preventDefault(); kick()});
cv.addEventListener("pointermove",function(e){if(!drag) return; aimAt(e); e.preventDefault()});
function up(e){if(!drag) return; aimAt(e); drag=null; cv.classList.remove("aiming"); var a=aim; aim=null; if(!a||a.oy<4) return; launch(a.p,a.r); kick()}
cv.addEventListener("pointerup",up); cv.addEventListener("pointercancel",function(){drag=null; aim=null; cv.classList.remove("aiming")});
cv.style.touchAction="none";

/* ---------- старт / конец ---------- */
function overlay(title,text,btn){ov.innerHTML=""; ov.classList.remove("bl-intro"); ov.appendChild(H("h3","",title)); if(text) ov.appendChild(H("p","",text)); var b=H("button","bl-go",btn); b.type="button"; b.onclick=start; ov.appendChild(b); ov.hidden=false}
function start(){miss3=0; missed=false; shots=0; score=0; left=30; streak=0; made=0; moving=0; hoopX=0; resetBall(); ov.hidden=true; state="play"; say("start",true); hudUp(); kick()}
function end(){state="over"; ball.fly=false;
  var fin=SAY.end.filter(function(x){return score>=x[0]}).pop()[1], rec=score>best;
  if(rec){best=score; try{localStorage.setItem(BK,String(best))}catch(e){}}
  bub.textContent=fin; face(score>=6); rudi.classList.add("on");
  overlay(score+" очк.",(rec&&score?"Новый рекорд! ":"")+"Попаданий: "+made,"Ещё раз")}
document.addEventListener("visibilitychange",function(){if(document.hidden&&state==="play"){state="pause"; overlay("Пауза","","Заново")}});

/* вступление, как в игре: Руди в окне напротив показывает листок */
function intro(){ov.innerHTML=""; ov.classList.add("bl-intro"); stage.classList.add("intro");
  ov.appendChild(H("p","bl-cap","Вечер. В окне напротив стоит Руди."));
  /* кадр 640×800, листок — перспективой по углам бумаги на фото; потом камера наезжает на листок */
  var win=H("div","bl-win2"), zoom=H("div","bl-zoom"), inner=H("div","bl-in"), im=H("img"); im.src="img/rudi_window.webp"; im.alt="Руди в окне держит листок";
  var note=H("div","bl-paper"); note.appendChild(H("span","","Увидимся?")); note.appendChild(H("span","","Жду на")); note.appendChild(H("span","","заднем дворе"));
  inner.appendChild(im); inner.appendChild(note); zoom.appendChild(inner); win.appendChild(zoom); ov.appendChild(win);
  function fit(){inner.style.setProperty("--k",(win.clientWidth/640).toFixed(4))} requestAnimationFrame(fit); setTimeout(fit,60);
  ov.appendChild(H("p","bl-how","Потяни мяч вниз и отпусти, как рогатку. Сильнее тянешь — дальше летит, вбок — прицел. 30 секунд."));
  var b=H("button","bl-go","Выйти во двор"); b.type="button"; b.onclick=function(){ov.classList.remove("bl-intro"); stage.classList.remove("intro"); start()}; ov.appendChild(b); ov.hidden=false}
intro();
bub.textContent="Сыграем, Росс?";
size(); hudUp();
root._dbg=function(){return {Hh:Hh,score:score,ball:ball,hoopX:hoopX}};
var rt; addEventListener("resize",function(){clearTimeout(rt); rt=setTimeout(size,150)});
(function(){var s=document.getElementById("tab-game"); if(s) new MutationObserver(function(){if(!s.hidden) size()}).observe(s,{attributes:true,attributeFilter:["hidden"]})})();
})();
