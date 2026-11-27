/* Скример: один раз за всё время, когда найдены все пасхалки. Кто уже видел финал (раньше, при 17), второй раз его не получит. Отключается: localStorage sentfor_noscare=1 */
(function(){
var DONE="sentfor_scare_done", OFF="sentfor_noscare";
function ls(k,v){try{if(v===undefined) return localStorage.getItem(k); if(v===null) localStorage.removeItem(k); else localStorage.setItem(k,v)}catch(e){return null}}
var css=document.createElement("style");
css.textContent=".scare{position:fixed;inset:0;width:100vw;height:100vh;height:100dvh;z-index:9999;background:#000;display:flex;align-items:center;justify-content:center}"+
".scare video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}"+".scare video[hidden]{display:none}"+"@media(orientation:landscape){.scare video{object-fit:contain}}"+".scare-intro{position:relative;z-index:2;text-align:center;padding:24px;max-width:520px;animation:si 1.4s ease}"+"@keyframes si{from{opacity:0}to{opacity:1}}"+".si-num{font:13px/1 var(--mono,monospace);letter-spacing:.3em;color:#8b1e22;margin-bottom:16px}"+".si-t{font:700 34px/1.15 var(--hand,cursive);color:#e8d9b0;margin-bottom:14px}"+".si-s{font:15px/1.5 var(--body,serif);color:rgba(232,217,176,.75);margin-bottom:26px}"+".si-go{font:700 14px/1 var(--mono,monospace);letter-spacing:.14em;text-transform:uppercase;color:#0b0b0d;background:#e8d9b0;border:0;border-radius:4px;padding:15px 26px;cursor:pointer}"+".si-go:hover{background:#fff}"+".scare-x.dim{opacity:.35}"+
".scare-x{position:absolute;z-index:3;top:calc(14px + env(safe-area-inset-top));right:16px;font:13px/1 var(--mono,monospace);letter-spacing:.1em;color:rgba(255,255,255,.35);background:none;border:0;cursor:pointer;padding:8px}"+
".scare-tap{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font:16px/1.4 var(--mono,monospace);letter-spacing:.12em;color:rgba(255,255,255,.7);text-align:center;padding:20px}"+
".scare-end{position:absolute;z-index:2;left:0;right:0;bottom:12%;text-align:center;font:700 28px/1.2 var(--hand,cursive);color:#e8d9b0;opacity:0;transition:opacity 1.2s;padding:0 20px}"+
".scare-end.on{opacity:1}"+
".scare-load{position:absolute;z-index:2;left:0;right:0;bottom:18%;text-align:center;font:13px/1 var(--mono,monospace);letter-spacing:.3em;color:rgba(232,217,176,.6);animation:sl 1.2s ease-in-out infinite alternate}"+"@keyframes sl{from{opacity:.25}to{opacity:1}}"+
".scare-fail{position:relative;z-index:2;text-align:center;padding:24px;max-width:460px;font:15px/1.5 var(--body,serif);color:rgba(232,217,176,.8)}"+".scare-fail b{display:block;font:700 26px/1.2 var(--hand,cursive);color:#e8d9b0;margin-bottom:10px}"+".scare-fail .si-go{margin-top:20px}"+
".noscare{display:inline-block;margin-top:10px;font:11px/1.3 var(--mono,monospace);color:var(--muted,#999);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline dotted}";
document.head.appendChild(css);

function play(){
  if(document.querySelector(".scare")) return;
  var box=document.createElement("div"); box.className="scare"; box.setAttribute("role","dialog"); box.setAttribute("aria-label","Финал пасхалок");
  var v=primed||mk(); primed=null; v.muted=false; v.currentTime=0; v.hidden=true;
  var x=document.createElement("button"); x.type="button"; x.className="scare-x"; x.textContent="закрыть ✕";
  var end=document.createElement("div"); end.className="scare-end"; end.textContent="Ты нашёл все пасхалки… Она тоже нашла тебя.";
  var intro=document.createElement("div"); intro.className="scare-intro";
  intro.innerHTML='<div class="si-num">17 / 17</div><div class="si-t">Ты нашёл все пасхалки</div><div class="si-s">🔊 Включи звук и сделай погромче.<br>Мы приготовили тебе кое-что напоследок.</div><button type="button" class="si-go">Я готов(а)</button>';
  box.appendChild(v); box.appendChild(end); box.appendChild(intro); box.appendChild(x); document.body.appendChild(box);
  var load=null, fail=null, timer=null, started=false;
  var prevOv=document.documentElement.style.overflow; document.documentElement.style.overflow="hidden";
  function close(){clearTimeout(timer); v.pause(); box.remove(); document.documentElement.style.overflow=prevOv; try{if(document.fullscreenElement) document.exitFullscreen()}catch(e){}}
  x.onclick=function(e){e.stopPropagation(); close()};
  document.addEventListener("keydown",function k(e){if(e.key==="Escape"){close(); document.removeEventListener("keydown",k)}});
  v.addEventListener("ended",function(){end.classList.add("on"); setTimeout(close,3500)});
  function hideLoad(){if(load){load.remove(); load=null}}
  function showLoad(){if(!load&&!fail){load=document.createElement("div"); load.className="scare-load"; load.textContent="загрузка"; box.appendChild(load)}}
  function showFail(){
    if(started||fail) return; clearTimeout(timer); hideLoad(); try{v.pause()}catch(e){} v.hidden=true; x.classList.remove("dim");
    fail=document.createElement("div"); fail.className="scare-fail";
    fail.innerHTML='<b>Видео не загрузилось</b>Похоже, слабый интернет. Попробуй ещё раз или открой сайт в обычном браузере (Chrome или Safari), а не внутри Telegram.<br><button type="button" class="si-go">Ещё раз</button>';
    box.appendChild(fail);
    fail.querySelector(".si-go").onclick=function(e){e.stopPropagation(); fail.remove(); fail=null; try{v.load()}catch(er){} go()};
  }
  v.addEventListener("playing",function(){started=true; clearTimeout(timer); hideLoad(); ls(DONE,"1")});
  v.addEventListener("waiting",function(){if(started) showLoad()});
  v.addEventListener("error",showFail);
  var srcs=v.querySelectorAll("source"); if(srcs.length) srcs[srcs.length-1].addEventListener("error",showFail);
  function go(){
    x.classList.add("dim"); v.hidden=false; v.muted=false; showLoad();
    try{v.currentTime=0}catch(er){}
    clearTimeout(timer); timer=setTimeout(showFail,15000);
    var p=v.play(); if(p&&p.catch) p.catch(function(err){ if(err&&err.name==="NotAllowedError"){v.muted=true; var q=v.play(); if(q&&q.catch) q.catch(showFail)} else if(err&&err.name!=="AbortError") showFail() });
  }
  intro.querySelector(".si-go").onclick=function(e){
    e.stopPropagation();
    /* полный экран только на компьютере: во встроенных браузерах (Telegram, Instagram) и на телефонах он даёт чёрный экран */
    if(canFS()){try{var rf=box.requestFullscreen||box.webkitRequestFullscreen; if(rf){var r=rf.call(box); if(r&&r.catch) r.catch(function(){})}}catch(er){}}
    intro.remove(); go();
  };
}
function canFS(){
  var ua=navigator.userAgent||"";
  if(/; wv\)|Telegram|Instagram|FBAN|FBAV|Line\/|VK|OKApp/i.test(ua)) return false;
  try{return window.matchMedia("(pointer:fine)").matches}catch(e){return false}
}
window.SFscreamer=play; window.SFnoScare=function(){return ls(OFF)==="1"}; window.SFscare={off:function(){return ls(OFF)==="1"},set:function(v){ls(OFF,v?null:"1"); var b=document.getElementById("noscare"); if(b) b.textContent=v?"Без пугалок":"Пугалки выключены · включить"},seen:function(){return ls(DONE)==="1"||allFound()>=tot()},play:function(){play()}};

/* видео заранее «разблокируем» по первому касанию, чтобы потом оно запустилось со звуком без лишнего нажатия (нужно для iPhone) */
var primed=null;
function mk(){var v=document.createElement("video"); ["mp4","webm"].forEach(function(t){var so=document.createElement("source"); so.src="video/screamer."+t+"?v=2"; so.type="video/"+t; v.appendChild(so)}); v.playsInline=true; v.setAttribute("playsinline",""); v.preload="auto"; return v}
function prime(){
  if(primed||ls(OFF)==="1"||ls(DONE)==="1"||allFound()<TOTAL-2) return;
  var v=mk(); v.muted=true; var p=v.play();
  if(p&&p.then) p.then(function(){v.pause(); v.currentTime=0; primed=v}).catch(function(){}); else {v.pause(); primed=v}
}
document.addEventListener("pointerdown",prime,true); document.addEventListener("keydown",prime,true);

/* найдены все 17 пасхалок → скример (один раз) */
function allFound(){
  var e={}; try{e=JSON.parse(localStorage.getItem("sentfor_eggs_v2")||"{}")||{}}catch(x){}
  return Object.keys(e).filter(function(k){return e[k]}).length;
}
function tot(){return (window.SF&&SF.eggTotal&&SF.eggTotal())||21}
var TOTAL=tot(), before=allFound();
function seen(){return ls(DONE)==="1"}
function check(){
  var n=allFound(); TOTAL=tot();
  if(n>=TOTAL&&before<TOTAL&&ls(OFF)!=="1"&&!seen()) setTimeout(play,900);
  var rb=document.getElementById("rescare"); if(rb) rb.hidden=!(seen()||n>=TOTAL);
  if(n===0) ls(DONE,null); /* сбросили все находки — финал можно получить заново */
  before=n;
}
setInterval(check,700);

/* тихий переключатель в панели пасхалок */
function addToggle(){
  var panel=document.getElementById("egg-panel"); if(!panel||document.getElementById("noscare")) return;
  var b=document.createElement("button"); b.type="button"; b.id="noscare"; b.className="noscare";
  function lbl(){b.textContent=ls(OFF)==="1"?"Пугалки выключены · включить":"Без пугалок"}
  lbl(); b.onclick=function(e){e.stopPropagation(); ls(OFF,ls(OFF)==="1"?null:"1"); lbl()};
  panel.appendChild(b);
  var r=document.createElement("button"); r.type="button"; r.id="rescare"; r.className="noscare"; r.style.marginLeft="14px"; r.textContent="▶ Пересмотреть финал"; r.hidden=!(seen()||allFound()>=TOTAL);
  r.onclick=function(e){e.stopPropagation(); play()}; panel.appendChild(r);
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",addToggle); else addToggle();
/* проверка: ссылка с ?scare сразу показывает скример */
try{if(/[?&]scare\b/.test(location.search)) setTimeout(play,600)}catch(e){}
})();
