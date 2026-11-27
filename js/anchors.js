/* Прямые ссылки на теории: /#t-chto-takoe-bashnya открывает вкладку «Теории» и нужную карточку */
(function(){
function go(){var h=location.hash.slice(1); if(!h||h.indexOf("t-")!==0) return;
  var a=document.getElementById(h); if(!a) return;
  var tb=document.querySelector('.tab[data-tab="theories"]'); if(tb) tb.click();
  a.classList.add("open"); var b=a.querySelector(".th-head"); if(b) b.setAttribute("aria-expanded","true");
  setTimeout(function(){var bar=document.querySelector(".epbar"); window.scrollTo({top:a.getBoundingClientRect().top+scrollY-(bar?bar.offsetHeight:0)-16})},120);}
window.addEventListener("hashchange",go); if(document.readyState==="complete") go(); else window.addEventListener("load",go);
})();
