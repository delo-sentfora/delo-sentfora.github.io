/* Переключатель RU / EN и мягкая подсказка, если язык браузера не совпадает с языком страницы */
(function(){
var EN=window.SFLANG==="en", K="sentfor_lang";
function get(){try{return localStorage.getItem(K)}catch(e){return null}}
function set(v){try{localStorage.setItem(K,v)}catch(e){}}
var btn=document.querySelector(".lang-btn"); if(btn) btn.addEventListener("click",function(){set(EN?"ru":"en")});
if(get()) return;
var langs=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||""]).map(function(l){return String(l).toLowerCase()});
var ruish=langs.some(function(l){return /^(ru|uk|be|kk)\b/.test(l)});
if(EN===!ruish) return; /* язык браузера и так совпадает */
var t=document.createElement("div"); t.className="lang-hint"; t.setAttribute("role","status");
var txt=EN?"Есть русская версия сайта":"This site is also in English", go=EN?"Читать по-русски":"Read in English";
t.innerHTML='<span></span><a></a><button type="button" aria-label="×">×</button>';
t.querySelector("span").textContent=txt; var a=t.querySelector("a"); a.textContent=go; a.href=EN?"./":"en"; a.hreflang=EN?"ru":"en";
a.onclick=function(){set(EN?"ru":"en")};
t.querySelector("button").onclick=function(){set(EN?"en":"ru"); t.remove()};
setTimeout(function(){document.body.appendChild(t)},1200);
})();
