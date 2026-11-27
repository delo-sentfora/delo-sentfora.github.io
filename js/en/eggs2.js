/* пасхалки серий 20–23: вспышка, ключ дедушки, пингвин Джимми (мультик и колокол — в extras.js и map.js) */
(function(){
function rd(){return (window.SF&&SF.read)||1}
function egg(k){if(window.SFegg) SFegg(k)}
function calm(){return window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches}

/* «ВСПЫШКА»: нажать на тварь в шапке вкладки «Тень» */
var fig=document.querySelector("#tab-shadow .sh-fig");
if(fig){
  fig.setAttribute("role","button"); fig.setAttribute("tabindex","0"); fig.removeAttribute("aria-hidden"); fig.setAttribute("aria-label","A creature in the dark");
  var busy=false;
  function flash(){if(busy||rd()<20) return; busy=true;
    var f=document.createElement("div"); f.className="sh-flash"+(calm()?" soft":""); document.body.appendChild(f);
    setTimeout(function(){fig.classList.add("sh-gone")},90);
    setTimeout(function(){f.remove()},900);
    setTimeout(function(){fig.classList.remove("sh-gone"); busy=false},3200);
    setTimeout(function(){egg("vspyshka")},1000)}
  fig.addEventListener("click",flash);
  fig.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault(); flash()}});
}

/* досье: ключ на кардигане дедушки и пингвин с пижамы Джимми */
var prev=window.SFdossierHook;
window.SFdossierHook=function(id,c){
  if(prev) try{prev(id,c)}catch(e){}
  var f=c.querySelector(".pm-pol"); if(!f) return;
  if(id==="grandpa"&&rd()>=23){
    var k=document.createElement("button"); k.type="button"; k.className="egg-key"; k.setAttribute("aria-label","A little key on the cardigan");
    k.onclick=function(e){e.stopPropagation(); k.classList.add("got"); egg("klyuch")};
    f.appendChild(k)}
  if(id==="brother"&&rd()>=20){
    var p=document.createElement("button"); p.type="button"; p.className="egg-peng"; p.setAttribute("aria-label","Penguin");
    p.innerHTML='<svg viewBox="0 0 26 32" aria-hidden="true"><ellipse cx="13" cy="18" rx="10" ry="12.5" fill="#22325e"/><path d="M4 14c-3 4-3 9 0 12 1-4 1.5-8 0-12z" fill="#7d96c9"/><path d="M22 14c3 4 3 9 0 12-1-4-1.5-8 0-12z" fill="#7d96c9"/><ellipse cx="13" cy="20" rx="7" ry="9.5" fill="#f4f1e8"/><ellipse cx="13" cy="10" rx="7.5" ry="6.5" fill="#f4f1e8"/><path d="M5.5 9.5C6 4.5 9 2 13 2s7 2.5 7.5 7.5c-2-2-4.5-3-7.5-3s-5.5 1-7.5 3z" fill="#22325e"/><circle cx="10.2" cy="9.6" r="1.5" fill="#111"/><circle cx="15.8" cy="9.6" r="1.5" fill="#111"/><circle cx="10.6" cy="9.1" r=".5" fill="#fff"/><circle cx="16.2" cy="9.1" r=".5" fill="#fff"/><path d="M11.2 12h3.6L13 14.4z" fill="#f2a024"/><path d="M8 30.5c1-1.6 2.6-2 4-1.3M18 30.5c-1-1.6-2.6-2-4-1.3" stroke="#f2a024" stroke-width="2.4" stroke-linecap="round" fill="none"/></svg>';
    p.onclick=function(e){e.stopPropagation(); p.classList.add("got"); egg("pingvin")};
    f.appendChild(p)}
};
/* «ГЛАЗА В ТЕМНОТЕ» (с.20): в «Необъяснимом» при выключенном свете задержи фонарик на ненастоящем Джимми
   (зажми его фото на 1–2 секунды или держи луч на нём) — фонарь замигает, вспышка, и у Джимми загорятся глаза. Идея читательницы. */
var fj=document.querySelector("#w-fakejimmy .pol img"), tz=document.getElementById("torch"), tv=tz&&tz.querySelector(".torch-veil");
if(fj&&tz&&window.SFTEST){
  var fig=fj.parentNode, fjg=document.createElement("img"); fjg.className="fj-glow"; fjg.src="img/fakejimmy20_glow.webp"; fjg.alt="Jimmy with glowing eyes"; fjg.setAttribute("aria-hidden","true"); fjg.loading="lazy";
  fj.parentNode.insertBefore(fjg,fj.nextSibling); fj.classList.add("fj-base");
  var busyF=false, holdT=0, beamT=0, swallow=false;
  function ok(){return rd()>=20&&!tz.classList.contains("lit")&&!busyF}
  function place(){fjg.style.left=fj.offsetLeft+"px"; fjg.style.top=fj.offsetTop+"px"; fjg.style.width=fj.offsetWidth+"px"; fjg.style.height=fj.offsetHeight+"px"}
  function flicker(on){if(!tv) return; tz.classList.toggle("fj-flick",on)}
  function reveal(){if(!ok()) return; busyF=true; flicker(false); place();
    var soft=calm()||(window.SFnoScare&&SFnoScare());
    var f=document.createElement("div"); f.className="sh-flash"+(soft?" soft":""); document.body.appendChild(f); setTimeout(function(){f.remove()},900);
    setTimeout(function(){fig.classList.add("fj-on")},soft?0:80);
    setTimeout(function(){egg("glaza")},900);
    setTimeout(function(){fig.classList.remove("fj-on"); busyF=false},5200)}
  /* зажать фото */
  fj.style.webkitTouchCallout="none";
  fig.addEventListener("pointerdown",function(e){if(!ok()) return; clearTimeout(holdT); flicker(true); holdT=setTimeout(function(){holdT=0; swallow=true; reveal()},1200)});
  ["pointerup","pointercancel","pointerleave"].forEach(function(ev){fig.addEventListener(ev,function(){if(holdT){clearTimeout(holdT); holdT=0; flicker(false)}})});
  fig.addEventListener("contextmenu",function(e){if(swallow||holdT) e.preventDefault()});
  document.addEventListener("click",function(e){if(swallow&&fig.closest(".item").contains(e.target)){e.preventDefault(); e.stopPropagation(); swallow=false}},true);
  /* или просто держать луч на нём (на телефоне луч стоит посередине экрана) */
  window.SFtorchHook=function(x,y,r,lit){
    var b=fj.getBoundingClientRect(); if(lit||!b.width||busyF){clearTimeout(beamT); beamT=0; flicker(false); return}
    var dx=Math.max(b.left+b.width*.1-x,0,x-b.right+b.width*.1), dy=Math.max(b.top+b.height*.1-y,0,y-b.top-b.height*.75), on=Math.sqrt(dx*dx+dy*dy)<r*.3; /* на телефоне луч по центру, а карточка в правой колонке — хватает, чтобы край луча лёг на фото */
    if(on&&!beamT&&ok()){flicker(true); beamT=setTimeout(function(){beamT=0; reveal()},1600)}
    if(!on&&beamT){clearTimeout(beamT); beamT=0; flicker(false)}
  };
}
})();
