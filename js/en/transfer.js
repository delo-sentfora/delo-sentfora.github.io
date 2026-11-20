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
function dlg(){var sh=el("div","inv-shade"), d=el("div","inv-dlg tr-dlg"); d.setAttribute("role","dialog"); d.setAttribute("aria-label","Transfer progress");
  function close(){sh.remove(); d.remove()} sh.onclick=close; d.appendChild(btn("inv-x","✕",close)); document.body.appendChild(sh); document.body.appendChild(d); return {d:d,close:close}}
function copy(t,b){function ok(){var o=b.textContent; b.textContent="Copied ✓"; setTimeout(function(){b.textContent=o},1500)}
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok,fb); else fb();
  function fb(){var ta=el("textarea"); ta.value=t; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy"); ok()}catch(e){} ta.remove()}}
var OFF="Transfer isn't available right now. Try again later.", NET="Couldn't reach the server. Check your internet and try again.";

function open(tab){
  var w=dlg(), d=w.d; d.appendChild(el("h4","","Transfer progress"));
  var tabs=el("div","tr-tabs"), body=el("div","tr-body"); d.appendChild(tabs); d.appendChild(body);
  var bs=[["send","From here"],["take","To here"]].map(function(t){var b=btn("chip-btn",t[1],function(){show(t[0])}); b.setAttribute("data-t",t[0]); tabs.appendChild(b); return b});
  function show(t){bs.forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-t")===t))}); body.innerHTML=""; (t==="send"?send:take)(body)}
  show(tab||"send");
  function send(b){
    b.appendChild(el("p","","Create a code here and enter it on another device or in the app. Your episode, characters' looks, easter eggs, evidence boards, Poppy's blog and predictions will move over."));
    var snap=snapshot();
    if(snap.moved) b.appendChild(el("p","inv-small","Your likes and comments will move too. And on this device you'll become a new guest."));
    b.appendChild(el("p","inv-small","The code works once and is valid for 24 hours."));
    var go=btn("inv-ok tr-go","Create code",function(){
      if(!window.SB||!SB.on){alert(OFF); return}
      var data=snap.d; if(!Object.keys(data).length){alert("Nothing to transfer here yet"); return}
      if(JSON.stringify(data).length>MAX){alert("Too much data: remove a couple of your own screenshots from the evidence board and try again."); return}
      go.disabled=true; go.textContent="Creating…";
      SB.transferPut(data).then(function(code){
        if(typeof code!=="string") throw new Error("bad");
        if(snap.moved){try{SB.logout()}catch(e){}}
        b.innerHTML=""; b.appendChild(el("p","","Enter this code on another device: “Transfer progress” → “To here”."));
        var cd=el("div","inv-code",fmt(code)); b.appendChild(cd);
        b.appendChild(btn("inv-b wide","Copy code",function(){copy(fmt(code),this)}));
        b.appendChild(el("p","inv-small","The code works once within 24 hours."));
      }).catch(function(){go.disabled=false; go.textContent="Create code"; alert(NET)})});
    b.appendChild(go)}
  function take(b){
    b.appendChild(el("p","","Enter the code you got on another device. Your progress here will be replaced with the transferred one."));
    var inp=el("input","tr-inp"); inp.placeholder="ABCD-EFGH"; inp.autocomplete="off"; inp.setAttribute("autocapitalize","characters"); inp.maxLength=12; b.appendChild(inp);
    var go=btn("inv-ok tr-go","Transfer",function(){
      var c=norm(inp.value); if(!/^[A-Z2-9]{8}$/.test(c)){alert("The code is 8 letters and digits, like ABCD-EFGH"); return}
      if(!window.SB||!SB.on){alert(OFF); return}
      go.disabled=true; go.textContent="Transferring…";
      SB.transferTake(c).then(function(data){
        if(!data||typeof data!=="object"){go.disabled=false; go.textContent="Transfer"; alert("Code not found. Maybe it's already been used or a day has passed."); return}
        try{keys().forEach(function(k){localStorage.removeItem(k)});
          Object.keys(data).forEach(function(k){if(k.indexOf(P)===0&&typeof data[k]==="string") localStorage.setItem(k,data[k])})}
        catch(e){alert("Couldn't save progress in this browser"); return}
        b.innerHTML=""; b.appendChild(el("p","","Done! Progress transferred ✨")); setTimeout(function(){location.href=location.pathname},900)
      }).catch(function(){go.disabled=false; go.textContent="Transfer"; alert(NET)})});
    inp.onkeydown=function(e){if(e.key==="Enter") go.click()};
    b.appendChild(go); setTimeout(function(){inp.focus()},50)}
}
window.SFtransfer=open;

/* кнопка в подвале сайта */
var ft=document.querySelector("footer");
if(ft){var row=el("div","tr-foot"); row.appendChild(btn("inv-b","📲 Transfer progress",function(){open("send")})); ft.parentNode.insertBefore(row,ft)}
/* на первом экране (выбор серии) — «у меня есть код»: удобно при первом запуске приложения на iPhone */
var st=document.getElementById("ep-step");
if(st){var a=btn("tr-gate","I already have progress — enter a transfer code",function(){open("take")}); st.appendChild(a)}
})();
