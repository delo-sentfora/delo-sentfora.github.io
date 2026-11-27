/* Перенос прогресса на другое устройство (или из Safari в приложение на iPhone).
   Переносятся все ключи sentfor_* из localStorage: серия, внешность, пасхалки, доски, блог Поппи.
   Анонимный вход (лайки и комментарии) переезжает вместе с ними, а на старом устройстве человек становится новым гостем. */
(function(){
var P="sentfor_", MAX=2900000;
function el(t,c,h){var e=document.createElement(t); if(c) e.className=c; if(h!=null) e.textContent=h; return e}
function btn(c,h,fn){var b=el("button",c,h); b.type="button"; if(fn) b.onclick=fn; return b}
function keys(){var o=[]; try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i); if(k&&k.indexOf(P)===0) o.push(k)}}catch(e){} return o}
function snapshot(){
  var d={}, moved=false;
  keys().forEach(function(k){var v=null; try{v=localStorage.getItem(k)}catch(e){} if(v==null) return;
    if(k===P+"sb_session"){try{var s=JSON.parse(v); if(!(s&&s.user&&s.user.anon)) return}catch(e){return} moved=true}
    d[k]=v});
  return {d:d,moved:moved}}
function fmt(c){return c.slice(0,4)+"-"+c.slice(4)}
function norm(t){return String(t||"").toUpperCase().replace(/[^A-Z0-9]/g,"")}
function dlg(){var sh=el("div","inv-shade"), d=el("div","inv-dlg tr-dlg"); d.setAttribute("role","dialog"); d.setAttribute("aria-label","Перенос прогресса");
  function close(){sh.remove(); d.remove()} sh.onclick=close; d.appendChild(btn("inv-x","✕",close)); document.body.appendChild(sh); document.body.appendChild(d); return {d:d,close:close}}
function copy(t,b){function ok(){var o=b.textContent; b.textContent="Скопировано ✓"; setTimeout(function(){b.textContent=o},1500)}
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok,fb); else fb();
  function fb(){var ta=el("textarea"); ta.value=t; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy"); ok()}catch(e){} ta.remove()}}
var OFF="Сейчас перенос недоступен. Попробуй позже.", NET="Не получилось связаться с сервером. Проверь интернет и попробуй ещё раз.";

function open(tab){
  var w=dlg(), d=w.d; d.appendChild(el("h4","","Перенос прогресса"));
  var tabs=el("div","tr-tabs"), body=el("div","tr-body"); d.appendChild(tabs); d.appendChild(body);
  var bs=[["send","Отсюда"],["take","Сюда"]].map(function(t){var b=btn("chip-btn",t[1],function(){show(t[0])}); b.setAttribute("data-t",t[0]); tabs.appendChild(b); return b});
  function show(t){bs.forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-t")===t))}); body.innerHTML=""; (t==="send"?send:take)(body)}
  show(tab||"send");
  function send(b){
    b.appendChild(el("p","","Создай код здесь и введи его на другом устройстве или в приложении. Переедут серия, внешность героев, пасхалки, доски улик, блог Поппи и прогнозы."));
    var snap=snapshot();
    if(snap.moved) b.appendChild(el("p","inv-small","Твои лайки и комментарии тоже переедут. А на этом устройстве ты станешь новым гостем."));
    b.appendChild(el("p","inv-small","Код работает один раз и действует сутки."));
    var go=btn("inv-ok tr-go","Создать код",function(){
      if(!window.SB||!SB.on){alert(OFF); return}
      var data=snap.d; if(!Object.keys(data).length){alert("Здесь пока нечего переносить"); return}
      if(JSON.stringify(data).length>MAX){alert("Слишком много данных: убери пару своих скринов с доски улик и попробуй ещё раз."); return}
      go.disabled=true; go.textContent="Создаю…";
      SB.transferPut(data).then(function(code){
        if(typeof code!=="string") throw new Error("bad");
        if(snap.moved){try{SB.logout()}catch(e){}}
        b.innerHTML=""; b.appendChild(el("p","","Введи этот код на другом устройстве: «Перенести прогресс» → «Сюда»."));
        var cd=el("div","inv-code",fmt(code)); b.appendChild(cd);
        b.appendChild(btn("inv-b wide","Скопировать код",function(){copy(fmt(code),this)}));
        b.appendChild(el("p","inv-small","Код сработает один раз в течение суток."));
      }).catch(function(){go.disabled=false; go.textContent="Создать код"; alert(NET)})});
    b.appendChild(go)}
  function take(b){
    b.appendChild(el("p","","Введи код, который получил(а) на другом устройстве. Прогресс здесь заменится перенесённым."));
    var inp=el("input","tr-inp"); inp.placeholder="ABCD-EFGH"; inp.autocomplete="off"; inp.setAttribute("autocapitalize","characters"); inp.maxLength=12; b.appendChild(inp);
    var go=btn("inv-ok tr-go","Перенести",function(){
      var c=norm(inp.value); if(!/^[A-Z2-9]{8}$/.test(c)){alert("Код — это 8 букв и цифр, например ABCD-EFGH"); return}
      if(!window.SB||!SB.on){alert(OFF); return}
      go.disabled=true; go.textContent="Переношу…";
      SB.transferTake(c).then(function(data){
        if(!data||typeof data!=="object"){go.disabled=false; go.textContent="Перенести"; alert("Код не найден. Возможно, он уже использован или прошли сутки."); return}
        try{keys().forEach(function(k){localStorage.removeItem(k)});
          Object.keys(data).forEach(function(k){if(k.indexOf(P)===0&&typeof data[k]==="string") localStorage.setItem(k,data[k])})}
        catch(e){alert("Не получилось сохранить прогресс в этом браузере"); return}
        b.innerHTML=""; b.appendChild(el("p","","Готово! Прогресс перенесён ✨")); setTimeout(function(){location.href=location.pathname},900)
      }).catch(function(){go.disabled=false; go.textContent="Перенести"; alert(NET)})});
    inp.onkeydown=function(e){if(e.key==="Enter") go.click()};
    b.appendChild(go); setTimeout(function(){inp.focus()},50)}
}
window.SFtransfer=open;

/* кнопка в подвале сайта */
var ft=document.querySelector("footer");
if(ft){var row=el("div","tr-foot"); row.appendChild(btn("inv-b","📲 Перенести прогресс",function(){open("send")})); ft.parentNode.insertBefore(row,ft)}
/* на первом экране (выбор серии) — «у меня есть код»: удобно при первом запуске приложения на iPhone */
var st=document.getElementById("ep-step");
if(st){var a=btn("tr-gate","У меня уже есть прогресс — ввести код переноса",function(){open("take")}); st.appendChild(a)}
})();
