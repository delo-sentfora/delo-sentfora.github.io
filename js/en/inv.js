/* Доска следователя: пустая пробковая доска, читатель сам собирает свою версию.
   Карточки (герои, улики, необъяснимое), стикеры, штампы, нитки с подписями.
   Всё хранится в localStorage этого браузера. */
(function(){
/* ?doska=КОД — открыть чужую доску только для просмотра */
/* ?galereya=ID — доска из галереи читателей; ?obshaya — общая доска (&predlozhenie=ID — предложение к ней, для модерации) */
/* английская версия: подписи карточек и штампы переводим по словарю сайта, свои заметки читателей — переводчиком браузера, если он есть (Chrome) */
var EN=window.SFLANG==="en", CYRX=/[А-Яа-яЁё]/, TRC={}, trQ=[], trBusy=false, dictSt=0;
try{TRC=JSON.parse(localStorage.getItem("sentfor_trc")||"{}")||{}}catch(e){}
function TL(s){if(!EN||!s||!CYRX.test(s)) return s; var d=window.SF_I18N;
  if(!d){if(!dictSt){dictSt=1; var sc=document.createElement("script"); sc.src="js/en/dict.js?v="+(window.SF_DICT_V||""); sc.onload=function(){dictSt=2; if(typeof render==="function") try{render()}catch(e){}}; document.head.appendChild(sc)} return s}
  var k=String(s).trim(); if(d[k]) return d[k];
  var m=/^ТС([12]),\s*(.+)$/.exec(k); if(m) return "SOS"+m[1]+", "+m[2];
  if(TRC[k]) return TRC[k]; if(trQ.indexOf(k)<0) trQ.push(k); setTimeout(trRun,0); return s}
function trRun(){if(trBusy||!trQ.length||!("Translator" in self)) return; trBusy=true;
  Translator.availability({sourceLanguage:"ru",targetLanguage:"en"}).then(function(a){if(a==="unavailable") throw 0; return Translator.create({sourceLanguage:"ru",targetLanguage:"en"})})
  .then(function(t){var list=trQ.splice(0,40); return list.reduce(function(pr,k){return pr.then(function(){return t.translate(k).then(function(r){if(r) TRC[k]=r})})},Promise.resolve())})
  .then(function(){try{var ks=Object.keys(TRC); if(ks.length>600) ks.slice(0,ks.length-600).forEach(function(k){delete TRC[k]}); localStorage.setItem("sentfor_trc",JSON.stringify(TRC))}catch(e){} trBusy=false; try{render()}catch(e){} if(trQ.length) setTimeout(trRun,50)})
  .catch(function(){trQ.length=0; trBusy=false})}
var LQ=location.search+location.hash;
var VIEW=(function(){var m=/[?&#]doska=([A-Za-z2-9]{7})\b/.exec(LQ); if(m) return {k:"code",v:m[1].toUpperCase()};
  m=/[?&#]galereya=(\d+)/.exec(LQ); if(m) return {k:"gal",v:+m[1]};
  if(/[?&#]obshaya\b/.test(LQ)){m=/[?&#]predlozhenie=(\d+)/.exec(LQ); return {k:"com",v:m?+m[1]:0}}
  return null})();
/* общая доска и галерея выпущены 11.11.2026 */
var DK=true;
var root=document.getElementById("inv");
if(VIEW){root=document.createElement("div"); root.className="inv-viewer"; document.body.appendChild(root)} else if(!root) return;
var RO=!!VIEW, showAll=false;
var SK="sentfor_inv", W=3600, H=2400, W0=3600, H0=2400, CW=150, NW=170, SW=210;
var COLORS=["y","p","b","g"], STAMPS=["Suspect","Lying","Alibi","Witness","Dead?","Missing","Secret","Connected?","Clue","False lead","???"];
var LC={r:["#c81e2b","Red"],b:["#2f7fd6","Blue"],g:["#2f9e57","Green"],k:["#1b1c22","Black"],w:["#f2eee5","White"]}, LCK=["r","b","g","k","w"];
var STICK=[["y","Yellow"],["p","Pink"],["b","Light blue"],["g","Green"]];

/* ---------- данные ---------- */
function newBoard(n){return {n:n,items:[],links:[],nid:1,v:null}}
function loadS(){var x=null; try{x=JSON.parse(localStorage.getItem(SK)||"null")}catch(e){} if(!x||!x.boards||!x.boards.length) x={cur:0,boards:[newBoard("My version")]}; return x}
var S=RO?{cur:0,boards:[newBoard("")]}:loadS();
if(!S.boards[S.cur]) S.cur=0;
/* все доски 3600×2400 (раньше были 2400×1600 — старые карточки остаются на местах) */
function dims(b){return b&&b.big?[3600,2400]:[W0,H0]}
S.boards.forEach(function(b){var d=dims(b); (b.items||[]).forEach(function(o){o.x=Math.max(0,Math.min(d[0]-170,o.x)); o.y=Math.max(0,Math.min(d[1]-120,o.y))})});
function B(){return S.boards[S.cur]}
var saveT, warned=false;
function store(){if(RO) return; try{localStorage.setItem(SK,JSON.stringify(S))}catch(e){if(!warned){warned=true; alert("The browser ran out of space for the board. Remove a few of your own screenshots, or your latest changes won't be saved.")}}}
function save(){if(RO) return; clearTimeout(saveT); saveT=setTimeout(store,150); syncSoon()}

/* ---------- ссылка на доску и код переноса (Supabase, таблица boards) ---------- */
var ALPH="ABCDEFGHJKMNPQRSTUVWXYZ23456789", MAXB=2400000, lastSync={}, syncT=null;
function mkCode(){var a=new Uint32Array(7), c=""; (window.crypto||window.msCrypto).getRandomValues(a); for(var i=0;i<7;i++) c+=ALPH[a[i]%ALPH.length]; return c}
function payload(b){var p={n:b.n,items:b.items,links:b.links,nid:b.nid}; if(b.big) p.big=1; return p}
function linkOf(c){return location.origin+"/?doska="+c}
function publish(b){
  if(!window.SB||!SB.on) return Promise.reject(new Error("off"));
  var body=payload(b), js=JSON.stringify(body); if(js.length>MAXB) return Promise.reject(new Error("big"));
  if(b.pub){var code=b.pub; if(lastSync[code]===js) return Promise.resolve(code);
    return SB.boardSet(code,b.n||"",body).then(function(ok){if(ok){lastSync[code]=js; return code} b.pub=null; store(); return publish(b)})}
  var tries=0;
  function go(){var c=mkCode(); return SB.boardNew(c,b.n||"",body).then(function(){b.pub=c; lastSync[c]=js; store(); return c},function(e){if(e&&e.status===409&&tries++<4) return go(); throw e})}
  return go()}
/* опубликованные доски обновляются по ссылке сами, через пару секунд после изменений */
function syncSoon(){if(RO) return; clearTimeout(syncT); syncT=setTimeout(syncAll,3000)}
function syncAll(){S.boards.forEach(function(b){if(b.pub) publish(b).catch(function(){})})}
document.addEventListener("visibilitychange",function(){if(document.visibilityState==="hidden"&&syncT){clearTimeout(syncT); syncT=null; syncAll()}});
var NEWI={}, roEmpty="";
var hist=[], fut=[]; function snap(){hist.push(JSON.stringify(B())); if(hist.length>40) hist.shift(); fut=[]; hbtn()}
function hbtn(){undoBtn.disabled=!hist.length; redoBtn.disabled=!fut.length}
function redo(){if(!fut.length) return; var v=B().v; hist.push(JSON.stringify(B())); S.boards[S.cur]=JSON.parse(fut.pop()); B().v=v; sel=null; linking=null; save(); render(); hbtn()}
function undo(){if(!hist.length) return; var v=B().v; fut.push(JSON.stringify(B())); S.boards[S.cur]=JSON.parse(hist.pop()); B().v=v; sel=null; linking=null; save(); render(); hbtn()}
function R(){return window.SF?SF.read:19}
function find(i){var a=B().items; for(var k=0;k<a.length;k++) if(a[k].i===i) return a[k]; return null}
function seen(it){return showAll||!it.ep||it.ep<=R()}

/* библиотека: герои из досье, улики и необъяснимое из вкладок сайта */
function people(){return window.SFinvPeople?SFinvPeople():[]}
function fromTab(id){
  var r=R(), out=[], had={};
  [].slice.call(document.querySelectorAll("#"+id+" .item[data-ep]")).forEach(function(it){
    var ep=+it.getAttribute("data-ep"); if(!(ep<=r)) return;
    var im=it.querySelector("figure img"); if(!im) return; var src=im.getAttribute("src"); if(!src||had[src]) return; had[src]=1;
    var fc=it.querySelector("figcaption"), lab="";
    if(fc){var c=fc.cloneNode(true); [].slice.call(c.querySelectorAll("[data-from],[data-until]")).forEach(function(x){var f=+x.getAttribute("data-from")||0, u=+x.getAttribute("data-until")||0; if((f&&f>r)||(u&&u<=r)) x.remove()}); lab=c.textContent.replace(/\s+/g," ").trim()}
    out.push({ref:"e:"+src,src:window.SF&&SF.img?SF.img(src):src,label:lab||im.alt||"",ep:ep})});
  return out}
/* скрины-доказательства из теорий: подпись «ТС2, 1.16» */
function shots(){
  var r=R(), out=[], had={};
  [].slice.call(document.querySelectorAll("#tab-theories .tproof figure")).forEach(function(f){
    var host=f.closest("[data-ep]"), ep=host?+host.getAttribute("data-ep"):1; var own=f.closest("[data-from]"); if(own) ep=Math.max(ep,+own.getAttribute("data-from")||0);
    if(!(ep<=r)) return; var im=f.querySelector("img"); if(!im) return; var src=im.getAttribute("src"); if(!src||had[src]) return; had[src]=1;
    var fc=f.querySelector("figcaption"); out.push({ref:"s:"+src,src:src,label:fc?fc.textContent.trim():"",ep:ep,shot:1})});
  return out}
/* свой скрин: уменьшаем и храним прямо в доске */
var fileIn=document.createElement("input"); fileIn.type="file"; fileIn.accept="image/*"; fileIn.hidden=true; document.body.appendChild(fileIn);
fileIn.onchange=function(){var f=fileIn.files&&fileIn.files[0]; fileIn.value=""; if(!f) return;
  var rd=new FileReader(); rd.onload=function(){var im=new Image(); im.onload=function(){
    var k=Math.min(1,640/Math.max(im.width,im.height)), cv=document.createElement("canvas"); cv.width=Math.round(im.width*k); cv.height=Math.round(im.height*k);
    cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height); var url=cv.toDataURL("image/jpeg",.72);
    addCard({ref:"u:"+Date.now(),src:url,label:"",shot:1,ar:Math.min(340/(SW-12),cv.height/cv.width)}); setTimeout(function(){edit("i",sel&&sel.i)},80)};
    im.onerror=function(){alert("Couldn't open the image")}; im.src=rd.result}; rd.readAsDataURL(f)};
/* у героев картинка зависит от выбранной внешности — берём свежую */
/* EN: подпись карточки героя/улики/скрина берём из английской страницы по ref — на чужих досках она сохранена по-русски */
var REFL=null, REFR=-1;
function CL(o){var l=o.label; if(!EN||!l||!CYRX.test(l)) return l; if(o.ref&&!/^u:/.test(o.ref)){if(!REFL||REFR!==R()){REFL={}; REFR=R(); people().concat(fromTab("tab-evidence"),fromTab("tab-weird"),shots()).forEach(function(x){if(x.label) REFL[x.ref]=x.label})} if(REFL[o.ref]) return REFL[o.ref]} return TL(l)}
function freshSrc(it){if(it.ref&&it.ref.indexOf("p:")===0){var p=people().filter(function(x){return x.ref===it.ref})[0]; if(p) return p.src} return it.src}

/* ---------- разметка ---------- */
function el(t,c,h){var e=document.createElement(t); if(c) e.className=c; if(h!=null) e.textContent=h; return e}
function btn(c,h,title,fn){var b=el("button",c,h); b.type="button"; if(title){b.title=title; b.setAttribute("aria-label",title)} if(fn) b.onclick=fn; return b}
var wrap=el("div","inv-wrap"), bar=el("div","inv-bar"), view=el("div","inv-view"), world=el("div","inv-world");
var svgNS="http://www.w3.org/2000/svg", svg=document.createElementNS(svgNS,"svg"); svg.setAttribute("class","inv-svg"); svg.setAttribute("width",W); svg.setAttribute("height",H); svg.setAttribute("viewBox","0 0 "+W+" "+H);
world.style.width=W+"px"; world.style.height=H+"px"; world.appendChild(svg); view.appendChild(world);
var boardsSel=el("select","inv-sel"); boardsSel.setAttribute("aria-label","Board");
boardsSel.onchange=function(){S.cur=+boardsSel.value; hist=[]; fut=[]; hbtn(); sel=null; linking=null; save(); render(true)};
var undoBtn=btn("inv-b","↶","Undo",undo), redoBtn=btn("inv-b","↷","Restore",redo); undoBtn.disabled=redoBtn.disabled=true;
var menuBtn=btn("inv-b","⋯","More",function(){menu.hidden=!menu.hidden; if(DK){mCom.hidden=!B().base; mPush.hidden=!B().com; mGal.hidden=!!B().com}});
function isFull(){return wrap.classList.contains("full")}
var fullBtn=btn("inv-b inv-close","✕","Close the board",function(){setFull(false)});
var pngBtn=btn("inv-b inv-png","Save as image","Save the board as an image",exportPng);
var roTitle=el("b","inv-rotitle",""), roTake=btn("inv-b","Take it","Copy the board to mine",function(){takeBoard()}), roAll=btn("inv-b","Show all","Show cards from all episodes (spoilers)",function(){showAll=true; render(true)});
var roClose=btn("inv-b","✕","Close",function(){location.href=location.pathname});
if(RO){bar.appendChild(roTitle); bar.appendChild(pngBtn); bar.appendChild(roTake); bar.appendChild(roClose); roTake.hidden=true; roAll.hidden=true}
else{bar.appendChild(boardsSel); bar.appendChild(undoBtn); bar.appendChild(redoBtn); bar.appendChild(pngBtn); bar.appendChild(menuBtn); bar.appendChild(fullBtn)}
var menu=el("div","inv-menu"); menu.hidden=true;
menu.appendChild(btn("","🔗 Link and transfer code","",function(){menu.hidden=true; shareDlg()}));
menu.appendChild(btn("","Open board by code","",function(){menu.hidden=true; openByCode()}));
menu.appendChild(btn("","⧉ Merge with another board","",function(){menu.hidden=true; mergeDlg()}));
var mGal=btn("","📨 Send to gallery","",function(){menu.hidden=true; galDlg()}), mCom=btn("","📨 Suggest for the shared board","",function(){menu.hidden=true; comDlg()}), mPush=btn("","⬆ Update the shared board","",function(){menu.hidden=true; comPush()});
if(DK){menu.appendChild(mGal); menu.appendChild(mCom); menu.appendChild(mPush)}
menu.appendChild(btn("","+ New board","",function(){var n=prompt("What should the board be called?","Board "+(S.boards.length+1)); if(n===null) return; S.boards.push(newBoard(n.trim()||("Board "+(S.boards.length+1)))); S.cur=S.boards.length-1; hist=[]; fut=[]; hbtn(); menu.hidden=true; save(); render(true)}));
menu.appendChild(btn("","Rename","",function(){var n=prompt("New name",B().n); if(n===null) return; B().n=n.trim()||B().n; menu.hidden=true; save(); render()}));
menu.appendChild(btn("","▦ Arrange in a grid","",function(){menu.hidden=true; arrange()}));
menu.appendChild(btn("","Clear board","",function(){if(!B().items.length) return; if(!confirm("Remove everything from the board?")) return; snap(); B().items=[]; B().links=[]; sel=null; menu.hidden=true; save(); render()}));
menu.appendChild(btn("del","Delete board","",function(){if(!confirm("Delete board “"+B().n+"”?")) return; S.boards.splice(S.cur,1); if(!S.boards.length) S.boards.push(newBoard("My version")); S.cur=0; hist=[]; fut=[]; hbtn(); menu.hidden=true; save(); render(true)}));

var addBtn=btn("inv-add","+ Add","Add to the board",function(){openSheet()});
var zoom=el("div","inv-zoom"); zoom.appendChild(btn("inv-b","+","Zoom in",function(){zoomBy(1.25)})); zoom.appendChild(btn("inv-b","−","Zoom out",function(){zoomBy(1/1.25)})); zoom.appendChild(btn("inv-b","◎","Show all",function(){fit(); applyV(); save()}));
var tools=el("div","inv-tools"); tools.hidden=true;
var hint=el("div","inv-hint"); hint.hidden=true;
var empty=el("div","inv-empty"); empty.innerHTML="<b>The board is empty for now</b>Tap “+ Add” and pin a character, a clue, a sticker or a stamp. Cards move with your finger, so does the board; pinch with two fingers to zoom.";
var openBtn=btn("inv-open","🔍 Open the board","Open the board full screen",function(e){e.stopPropagation(); setFull(true)});
view.appendChild(openBtn); view.appendChild(addBtn); view.appendChild(zoom); view.appendChild(tools); view.appendChild(hint); view.appendChild(empty);
/* меню вне панели: у панели прокрутка, она обрезала меню */
wrap.appendChild(bar); wrap.appendChild(menu); wrap.appendChild(view); root.appendChild(wrap);
document.addEventListener("click",function(e){if(!menu.hidden&&!menu.contains(e.target)&&e.target!==menuBtn) menu.hidden=true});

/* лист «Добавить» */
var sheet=el("div","inv-sheet"); sheet.hidden=true; sheet.setAttribute("role","dialog"); sheet.setAttribute("aria-label","Add to the board");
var shHead=el("div","inv-sh-head"), shTabs=el("div","inv-sh-tabs"), shBody=el("div","inv-sh-body"), tab="people";
shHead.appendChild(el("b","","What to pin?")); shHead.appendChild(btn("inv-x","✕","Close",closeSheet));
[["people","Characters"],["ev","Clues"],["weird","Unexplained"],["shot","Screenshots"],["note","Stickers"],["stamp","Stamps"]].forEach(function(t){var b=btn("chip-btn",t[1],"",function(){tab=t[0]; fillSheet()}); b.setAttribute("data-t",t[0]); shTabs.appendChild(b)});
sheet.appendChild(shHead); sheet.appendChild(shTabs); sheet.appendChild(shBody); document.body.appendChild(sheet);
var shade=el("div","inv-shade"); shade.hidden=true; shade.onclick=closeSheet; document.body.appendChild(shade);
function openSheet(){fillSheet(); sheet.hidden=false; shade.hidden=false}
function closeSheet(){sheet.hidden=true; shade.hidden=true}
function onBoard(ref){return B().items.some(function(x){return x.ref===ref})}
function fillSheet(){
  [].slice.call(shTabs.children).forEach(function(b){b.setAttribute("aria-pressed",String(b.getAttribute("data-t")===tab))});
  shBody.innerHTML=""; shBody.className="inv-sh-body t-"+tab;
  if(tab==="note"){STICK.forEach(function(c){var b=btn("inv-lib-note c-"+c[0],"",c[1]+" sticker",function(){addNote(c[0])}); b.appendChild(el("span","","Write down a thought")); shBody.appendChild(b)}); return}
  if(tab==="stamp"){STAMPS.forEach(function(t){shBody.appendChild(btn("inv-lib-stamp",t,"Stamp “"+t+"”",function(){addStamp(t)}))}); return}
  if(tab==="shot"){var up=btn("inv-up","📷 Upload your own screenshot","Upload your own screenshot",function(){fileIn.click()}); shBody.appendChild(up)}
  var list=tab==="people"?people():tab==="shot"?shots():fromTab(tab==="ev"?"tab-evidence":"tab-weird");
  if(!list.length){shBody.appendChild(el("p","inv-none","Nothing yet: pick a later episode.")); return}
  list.forEach(function(o){var b=btn("inv-lib-card"+(onBoard(o.ref)?" on":""),"",o.label,function(){addCard(o)});
    if(o.src){var im=el("img"); im.loading="lazy"; im.src=o.src; im.alt="";  b.appendChild(im)} else b.appendChild(el("div","ph","?"));
    b.appendChild(el("span","",o.label)); shBody.appendChild(b)});
}

/* ---------- вид: сдвиг и масштаб ---------- */
var V={s:1,tx:0,ty:0};
function vw(){return view.clientWidth||360} function vh(){return view.clientHeight||480}
function applyV(){world.style.transform="translate("+V.tx+"px,"+V.ty+"px) scale("+V.s+")"; B().v={s:V.s,tx:V.tx,ty:V.ty}; place()}
function clampS(s){return Math.max(.12,Math.min(2.5,s))}
function zoomAt(f,cx,cy){var s=clampS(V.s*f), wx=(cx-V.tx)/V.s, wy=(cy-V.ty)/V.s; V.s=s; V.tx=cx-wx*s; V.ty=cy-wy*s; applyV(); save()}
function zoomBy(f){zoomAt(f,vw()/2,vh()/2)}
function fit(){
  var it=B().items.filter(seen), w=vw(), h=vh();
  var full=isFull()||RO;
  if(!it.length){V.s=full?1:Math.min(.8,w/700); V.tx=w/2-W/2*V.s; V.ty=h/2-H/2*V.s; return}
  var x0=1e9,y0=1e9,x1=-1e9,y1=-1e9; it.forEach(function(o){var e=world.querySelector('[data-i="'+o.i+'"]'), ww=e?e.offsetWidth:CW, hh=e?e.offsetHeight:CW*1.4; x0=Math.min(x0,o.x); y0=Math.min(y0,o.y); x1=Math.max(x1,o.x+ww); y1=Math.max(y1,o.y+hh)});
  var pad=40, s=clampS(Math.min(w/(x1-x0+pad*2),h/(y1-y0+pad*2),full?1.1:.9)); if(full) s=Math.max(s,Math.min(.7,w/700)); V.s=s; V.tx=w/2-(x0+x1)/2*s; V.ty=h/2-(y0+y1)/2*s}
function center(){return {x:(vw()/2-V.tx)/V.s,y:(vh()/2-V.ty)/V.s}}

/* ---------- добавление ---------- */
/* новое кладём рядом с центром экрана, в свободное место, чтобы не закрывать уже прикреплённое */
function spot(w,h){
  var c=center(), rs=B().items.filter(seen).map(function(o){var e=world.querySelector('[data-i="'+o.i+'"]'); return {x:o.x,y:o.y,w:e?e.offsetWidth:CW,h:e?e.offsetHeight:CW*1.4}});
  function free(x,y){return x>=10&&y>=10&&x+w<=W-10&&y+h<=H-10&&!rs.some(function(r){return x<r.x+r.w+16&&x+w+16>r.x&&y<r.y+r.h+16&&y+h+16>r.y})}
  for(var ring=0;ring<14;ring++){var steps=Math.max(1,ring*8);
    for(var k=0;k<steps;k++){var a=k/steps*Math.PI*2, x=c.x-w/2+Math.cos(a)*ring*70, y=c.y-h/2+Math.sin(a)*ring*55; if(free(x,y)) return {x:x,y:y}}}
  return {x:c.x-w/2+(Math.random()*80-40),y:c.y-h/2+(Math.random()*60-30)}}
function put(o,w,h){var p=spot(w,h); o.i=B().nid++; o.x=Math.round(Math.max(10,Math.min(W-w-10,p.x))); o.y=Math.round(Math.max(10,Math.min(H-h-10,p.y))); o.r=Math.round((Math.random()*8-4)*10)/10; snap(); B().items.push(o); sel={t:"i",i:o.i}; closeSheet();
  var sx=o.x*V.s+V.tx, sy=o.y*V.s+V.ty; if(sx<0||sy<50||sx+w*V.s>vw()||sy+h*V.s>vh()-70){V.tx=vw()/2-(o.x+w/2)*V.s; V.ty=vh()/2-(o.y+h/2)*V.s}
  save(); render()}
function addCard(o){var c={t:"card",ref:o.ref,src:o.src,label:o.label,ep:o.ep}; if(o.shot) c.shot=1; put(c,o.shot?SW:CW,o.shot?(SW-12)*(o.ar||1.25)+34:CW*1.45)}
function addNote(c){put({t:"note",c:c,txt:""},NW,NW,1); setTimeout(function(){edit("i",sel&&sel.i)},60)}
function addStamp(t){put({t:"stamp",txt:t,c:"r"},150,40)}

/* ---------- отрисовка ---------- */
var sel=null, linking=null, first=true;
/* двигаем через transform: в Safari и на iPad left/top внутри масштабированной доски оставляют «следы» */
function pos(d,o,lift){d.style.transform=(lift?"translate3d("+o.x+"px,"+o.y+"px,0)":"translate("+o.x+"px,"+o.y+"px)")+" rotate("+(lift?0:(o.r||0))+"deg)"+(lift?" scale(1.07)":"")}
function itemEl(o){
  var d=el("div","inv-it inv-"+o.t+(o.c?" c-"+o.c:"")+(o.x2?" x":"")+(o.shot?" shot":"")); d.setAttribute("data-i",o.i);
  if(o.t==="card"){var src=freshSrc(o); if(src){var im=el("img"); im.decoding="async"; im.src=src; im.alt=""; im.draggable=false; d.appendChild(im)} else d.appendChild(el("div","ph","?")); if(o.label||!o.shot) d.appendChild(el("span","",CL(o)));
    if(o.x2){var x=document.createElementNS(svgNS,"svg"); x.setAttribute("class","inv-cross"); x.setAttribute("viewBox","0 0 100 100"); x.setAttribute("preserveAspectRatio","none"); x.innerHTML='<path d="M8 10 L92 88 M90 12 L10 90"/>'; d.appendChild(x)}}
  else if(o.t==="note"){d.appendChild(el("p","",TL(o.txt)||"…"))}
  else d.textContent=TL(o.txt);
  if(o.t!=="stamp") d.appendChild(el("i","pin"));
  pos(d,o);
  if(sel&&sel.t==="i"&&sel.i===o.i) d.classList.add("sel"); if(linking===o.i) d.classList.add("from");
  return d}
function pinOf(o){var e=world.querySelector('[data-i="'+o.i+'"]'); var w=e?e.offsetWidth:CW, h=e?e.offsetHeight:40; return o.t==="stamp"?{x:o.x+w/2,y:o.y+h/2}:{x:o.x+w/2,y:o.y+6}}
// подпись можно двигать вдоль нитки: l.lt — где она на нитке (0…1)
function lt(l){return l.lt!=null?l.lt:.5}
function bzAt(A,mx,my,Z,t){var u=1-t; return {x:u*u*A.x+2*u*t*mx+t*t*Z.x,y:u*u*A.y+2*u*t*my+t*t*Z.y}}
function bzNear(A,mx,my,Z,x,y){var bt=.5,bd=1e18,i,t,q,d; for(i=0;i<=48;i++){t=i/48; q=bzAt(A,mx,my,Z,t); d=(q.x-x)*(q.x-x)+(q.y-y)*(q.y-y); if(d<bd){bd=d; bt=t}}
  for(var st=1/96;st>1e-4;st/=2){[bt-st,bt+st].forEach(function(t2){if(t2<0||t2>1) return; var q2=bzAt(A,mx,my,Z,t2), d2=(q2.x-x)*(q2.x-x)+(q2.y-y)*(q2.y-y); if(d2<bd){bd=d2; bt=t2}})} return Math.max(.08,Math.min(.92,bt))}
function linkGeo(l){var items={}; B().items.forEach(function(o){if(seen(o)) items[o.i]=o}); var a=items[l.a], b=items[l.b]; if(!a||!b) return null; var A=pinOf(a), Z=pinOf(b), d=Math.hypot(Z.x-A.x,Z.y-A.y), sag=Math.min(60,d*.12+8); return {A:A,Z:Z,mx:(A.x+Z.x)/2,my:Math.max(A.y,Z.y)+sag}}
function strings(){
  var h="", items={}; B().items.forEach(function(o){if(seen(o)) items[o.i]=o});
  [].slice.call(world.querySelectorAll(".inv-tag")).forEach(function(x){x.remove()});
  B().links.forEach(function(l,k){var a=items[l.a], b=items[l.b]; if(!a||!b) return; var A=pinOf(a), Z=pinOf(b);
    var d=Math.hypot(Z.x-A.x,Z.y-A.y), sag=Math.min(60,d*.12+8), mx=(A.x+Z.x)/2, my=Math.max(A.y,Z.y)+sag;
    var p="M"+A.x+" "+A.y+" Q"+mx+" "+my+" "+Z.x+" "+Z.y, on=sel&&sel.t==="l"&&sel.i===k;
    h+='<path class="s c-'+(l.c||"r")+(l.d?" dash":"")+(on?" on":"")+'" d="'+p+'"/><path class="hit" data-l="'+k+'" d="'+p+'"/>';
    if(l.txt){var t=el("div","inv-tag"+(on?" on":""),TL(l.txt)), q=bzAt(A,mx,my,Z,lt(l)); t.setAttribute("data-l",k); t.style.left=q.x+"px"; t.style.top=q.y+"px"; world.appendChild(t)}});
  svg.innerHTML=h}
/* доски приходят и от других людей (общая доска, галерея, код): чистим всё, что попадает в разметку */
function sane(b){if(!b) return; var C=/^[a-z0-9]{1,10}$/;
  (b.items||[]).forEach(function(o){o.i=+o.i||0; o.x=+o.x||0; o.y=+o.y||0; if(o.c!=null&&!C.test(o.c)) o.c="y"; if(o.t!=="card"&&o.t!=="note"&&o.t!=="stamp") o.t="note";
    if(o.src!=null&&!/^(data:image\/(png|jpe?g|webp|gif);base64,|[a-z0-9_\-\/.]+$)/i.test(o.src)) delete o.src;
    ["txt","label","ref"].forEach(function(k){if(o[k]!=null&&typeof o[k]!=="string") o[k]=String(o[k])})});
  b.links=(b.links||[]).filter(function(l){return l&&typeof l==="object"}); b.links.forEach(function(l){l.a=+l.a||0; l.b=+l.b||0; if(l.c!=null&&!C.test(l.c)) l.c="r"; l.d=!!l.d; if(l.txt!=null) l.txt=String(l.txt)})}
function render(refit){ sane(B());
  var dm=dims(B()); if(dm[0]!==W){W=dm[0]; H=dm[1]; world.style.width=W+"px"; world.style.height=H+"px"; svg.setAttribute("width",W); svg.setAttribute("height",H); svg.setAttribute("viewBox","0 0 "+W+" "+H)}
  boardsSel.innerHTML=""; S.boards.forEach(function(b,k){var o=el("option","",TL(b.n)); o.value=k; boardsSel.appendChild(o)}); boardsSel.value=S.cur;
  [].slice.call(world.querySelectorAll(".inv-it")).forEach(function(x){x.remove()});
  var vis=B().items.filter(seen); vis.forEach(function(o){var e=itemEl(o); if(NEWI[o.i]) e.classList.add("inv-new"); world.appendChild(e)});
  strings();
  empty.hidden=vis.length>0||RO; if(RO&&roEmpty&&!B().items.length){empty.innerHTML=roEmpty; empty.hidden=false}
  if(RO){roTitle.textContent=B().n||"Evidence board"; roAll.hidden=!(B().items.length-vis.length)}
  var hid=B().items.length-vis.length; hint.hidden=!linking&&!hid;
  hint.textContent=linking?"Pick what to connect the string to":hid?"\${"+hid+" — from episodes after the one you picked, they're hidden":"";
  if(RO&&hid) hint.appendChild(roAll);
  hint.classList.toggle("act",!!linking);
  if(refit||first||(!RO&&!isFull())){fit(); first=false}
  openBtn.hidden=RO||isFull(); addBtn.hidden=RO;
  applyV(); fillTools();
}

/* ---------- панель у выбранного ---------- */
function fillTools(){
  tools.innerHTML=""; if(RO||!sel||linking){tools.hidden=true; return}
  if(sel.t==="i"){var o=find(sel.i); if(!o||!seen(o)){sel=null; tools.hidden=true; return}
    tools.appendChild(btn("","🧵 String","Pull a string",function(){linking=o.i; render()}));
    if(o.t==="card"){tools.appendChild(btn("",o.x2?"Restore":"✖ Cross out","",function(){snap(); o.x2=!o.x2; save(); render()}));
      if(o.shot) tools.appendChild(btn("","✎ Caption","Caption the screenshot",function(){edit("i",o.i)}));
      if(o.ref&&o.ref.indexOf("p:")===0&&window.SFdossier) tools.appendChild(btn("","File","Open file",function(){document.body.classList.add("pm-top"); SFdossier(o.ref.slice(2))}))}
    if(o.t==="note"){tools.appendChild(btn("","✎ Text","",function(){edit("i",o.i)})); tools.appendChild(btn("","🎨","Another color",function(){snap(); o.c=COLORS[(COLORS.indexOf(o.c)+1)%COLORS.length]; save(); render()}))}
    if(o.t==="stamp") tools.appendChild(btn("","🎨","Another color",function(){snap(); o.c=o.c==="r"?"k":"r"; save(); render()}));
    tools.appendChild(btn("","↻","Rotate",function(){snap(); o.r=((o.r||0)+8+180)%360-180; if(Math.abs(o.r)>20) o.r=-12; save(); render()}));
    tools.appendChild(btn("del","Remove","Remove from board",function(){snap(); B().items=B().items.filter(function(x){return x!==o}); B().links=B().links.filter(function(l){return l.a!==o.i&&l.b!==o.i}); sel=null; save(); render()}))}
  else{var l=B().links[sel.i]; if(!l){sel=null; tools.hidden=true; return}
    tools.appendChild(btn("","✎ Caption","",function(){edit("l",sel.i)}));
    var cb=btn("inv-dot","","String color: "+LC[l.c||"r"][1],function(){snap(); l.c=LCK[(LCK.indexOf(l.c||"r")+1)%LCK.length]; save(); render()}); cb.style.background=LC[l.c||"r"][0]; tools.appendChild(cb);
    tools.appendChild(btn("",l.d?"━ Solid":"┄ Dashed",l.d?"Make it solid":"Make it dashed (a guess)",function(){snap(); l.d=!l.d; save(); render()}));
    tools.appendChild(btn("del","Remove string","",function(){snap(); B().links.splice(sel.i,1); sel=null; save(); render()}))}
  tools.appendChild(btn("inv-done","✓","Done",function(){sel=null; render()}));
  tools.hidden=false}
function place(){}

/* редактор текста стикера и подписи нитки */
var ed=el("div","inv-edit"); ed.hidden=true; var edTa=el("textarea"); edTa.maxLength=160; var edOk=btn("inv-ok","Done","",closeEdit); ed.appendChild(edTa); ed.appendChild(edOk); document.body.appendChild(ed);
var edCur=null;
function edit(t,i){var o=t==="i"?find(i):B().links[i]; if(!o) return; snap(); var key=o.t==="card"?"label":"txt"; edCur={o:o,k:key}; edTa.value=o[key]||""; edTa.placeholder=o.t==="card"?"What's in the screenshot? For example: “SOS2, 1.16”":t==="i"?"Write down a thought…":"What connects them? For example: “seen together”"; ed.hidden=false; setTimeout(function(){edTa.focus()},30)}
edTa.oninput=function(){if(!edCur) return; edCur.o[edCur.k]=edTa.value; save(); render()};
edTa.onkeydown=function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(); closeEdit()} if(e.key==="Escape") closeEdit()};
function closeEdit(){ed.hidden=true; edCur=null; edTa.blur()}

/* ---------- жесты ---------- */
var PT={}, G=null, lastTap=0, lastXY=[0,0];
function n(){return Object.keys(PT).length}
function two(){var a=Object.keys(PT).map(function(k){return PT[k]}); return {d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),x:(a[0].x+a[1].x)/2,y:(a[0].y+a[1].y)/2}}
view.addEventListener("click",function(e){if(!RO&&!isFull()) setFull(true)});
view.addEventListener("pointerdown",function(e){
  if(!RO&&!isFull()) return;
  if(e.target.closest(".inv-tools,.inv-add,.inv-zoom,.inv-hint,.inv-open,.inv-sp-acts")) return;
  if(e.pointerType==="mouse"&&e.button>0) return;
  try{view.setPointerCapture(e.pointerId)}catch(x){}
  PT[e.pointerId]={x:e.clientX,y:e.clientY};
  if(n()===1){var it=RO?null:e.target.closest(".inv-it"), lk=RO?null:e.target.closest("[data-l]");
    G={k:it?"i":lk?"l":"pan",id:it?+it.getAttribute("data-i"):lk?+lk.getAttribute("data-l"):null,sx:e.clientX,sy:e.clientY,tx:V.tx,ty:V.ty,moved:false,el:it,tag:!!(lk&&lk.classList.contains("inv-tag"))};
    if(G.k==="i"){var o=find(G.id); G.ox=o.x; G.oy=o.y; pos(it,o,1)}
    if(G.k==="pan"){var now=Date.now(); G.dbl=now-lastTap<320&&Math.hypot(e.clientX-lastXY[0],e.clientY-lastXY[1])<30; lastTap=now; lastXY=[e.clientX,e.clientY]}}
  else if(n()===2){var r=view.getBoundingClientRect(), t=two(); if(G&&G.k==="i"&&G.moved) save(); G={k:"pinch",d0:t.d,s0:V.s,wx:(t.x-r.left-V.tx)/V.s,wy:(t.y-r.top-V.ty)/V.s}}
});
view.addEventListener("pointermove",function(e){
  if(!PT[e.pointerId]) return; PT[e.pointerId]={x:e.clientX,y:e.clientY}; if(!G) return;
  if(G.k==="pinch"){if(n()<2) return; var r=view.getBoundingClientRect(), t=two(); V.s=clampS(G.s0*t.d/G.d0); V.tx=t.x-r.left-G.wx*V.s; V.ty=t.y-r.top-G.wy*V.s; applyV(); return}
  var dx=e.clientX-G.sx, dy=e.clientY-G.sy; if(!G.moved&&Math.hypot(dx,dy)<6) return;
  if(!G.moved){G.moved=true; if(G.tag&&G.k==="l") snap(); if(G.k==="i"){snap(); var o=find(G.id), a=B().items; a.splice(a.indexOf(o),1); a.push(o); world.appendChild(G.el); G.el.classList.add("drag"); tools.hidden=true}}
  if(G.k==="i"){var o2=find(G.id); o2.x=Math.round(Math.max(0,Math.min(W-40,G.ox+dx/V.s))); o2.y=Math.round(Math.max(0,Math.min(H-40,G.oy+dy/V.s))); pos(G.el,o2,1); strings()}
  else if(G.k==="l"&&G.tag){var lk2=B().links[G.id], gg=lk2&&linkGeo(lk2); if(!gg) return; var r2=view.getBoundingClientRect(); lk2.lt=Math.round(bzNear(gg.A,gg.mx,gg.my,gg.Z,(e.clientX-r2.left-V.tx)/V.s,(e.clientY-r2.top-V.ty)/V.s)*1000)/1000; strings(); var tg=world.querySelector('.inv-tag[data-l="'+G.id+'"]'); if(tg) tg.classList.add("drag")}
  else if(G.k==="pan"||G.k==="l"){G.k="pan"; V.tx=G.tx+dx; V.ty=G.ty+dy; applyV()}
});
function up(e){
  if(!PT[e.pointerId]) return; delete PT[e.pointerId];
  if(!G) return; if(G.k==="pinch"){if(n()===0){G=null; save()} else G=null; return}
  var g=G; G=null;
  if(g.moved){if(g.k==="i"){var o=find(g.id); g.el.classList.remove("drag"); if(o) pos(g.el,o); save(); sel={t:"i",i:g.id}; [].slice.call(world.querySelectorAll(".inv-it.sel")).forEach(function(x){x.classList.remove("sel")}); g.el.classList.add("sel"); fillTools()} else save(); return}
  if(e.type==="pointercancel") return;
  tap(g)}
view.addEventListener("pointerup",up); view.addEventListener("pointercancel",up);
function tap(g){
  if(RO) return;
  if(g.k==="i"){
    if(linking!==null&&linking!==g.id){var a=linking, b=g.id, ex=B().links.filter(function(l){return (l.a===a&&l.b===b)||(l.a===b&&l.b===a)})[0]; linking=null;
      if(!ex){snap(); B().links.push({a:a,b:b,txt:""}); save(); sel={t:"l",i:B().links.length-1}; render(); if(R()>=2&&triangle()){seenEgg(); return} edit("l",sel.i); return}
      sel={t:"l",i:B().links.indexOf(ex)}; render(); return}
    linking=null; sel={t:"i",i:g.id}; render(); return}
  if(g.k==="l"){linking=null; sel={t:"l",i:g.id}; render(); return}
  if(g.dbl){var r=view.getBoundingClientRect(); zoomAt(V.s<1.4?1.7:1/1.7,g.sx-r.left,g.sy-r.top); lastTap=0; return}
  linking=null; sel=null; render()}
view.addEventListener("wheel",function(e){if(!RO&&!isFull()) return; e.preventDefault(); var r=view.getBoundingClientRect();
  var mouse=e.deltaMode===1||(Math.abs(e.deltaY)>=50&&e.deltaX===0&&Number.isInteger(e.deltaY));
  if(e.ctrlKey||mouse){var d=e.deltaMode===1?e.deltaY*33:e.deltaY; zoomAt(Math.exp(-d*(e.ctrlKey?.01:.0018)),e.clientX-r.left,e.clientY-r.top)}
  else{V.tx-=e.deltaX; V.ty-=e.deltaY; applyV(); save()}},{passive:false});
document.addEventListener("keydown",function(e){
  if(!isFull()) return; if(/^(INPUT|TEXTAREA|SELECT)$/.test((e.target||{}).tagName||"")) return;
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="z"){e.preventDefault(); if(e.shiftKey) redo(); else undo(); return}
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="y"){e.preventDefault(); redo(); return}
  if(e.key==="Escape"){if(!sheet.hidden){closeSheet(); return} if(linking!==null||sel){linking=null; sel=null; render(); return} if(isFull()) setFull(false)}
  if((e.key==="Delete"||e.key==="Backspace")&&sel){var b=tools.querySelector(".del"); if(b) b.click()}
});
/* доска открывается отдельным экраном; кнопка «назад» на телефоне её закрывает */
function setFull(on,fromPop){if(RO&&!on){location.href=location.pathname; return}
  if(on===isFull()) return;
  if(!on&&!fromPop&&history.state&&history.state.inv){history.back(); return}
  /* переносим в body, чтобы доска была поверх всего сайта (у секций свои слои) */
  if(on) document.body.appendChild(wrap); else root.appendChild(wrap);
  wrap.classList.toggle("full",on); document.documentElement.classList.toggle("inv-lock",on);
  if(on){try{history.pushState({inv:1},"")}catch(e){}} else {sel=null; linking=null; closeSheet()}
  setTimeout(function(){render(true)},30)}
window.addEventListener("popstate",function(){if(isFull()&&!RO) setFull(false,true)});

/* «Разложить»: аккуратная сетка из всего, что на доске */
function arrange(ns){
  var vis=B().items.filter(seen); if(!vis.length) return; if(!ns) snap();
  var order={card:0,note:1,stamp:2}; vis.sort(function(a,b){return (order[a.t]-order[b.t])||(a.i-b.i)});
  var cols=Math.max(2,Math.min(6,Math.ceil(Math.sqrt(vis.length*1.6*Math.max(.55,vw()/vh()))))), cw=SW+40, x0=Math.max(30,(W-cols*cw)/2), y=50, rowH=0, k=0;
  vis.forEach(function(o){var e=world.querySelector('[data-i="'+o.i+'"]'), w=e?e.offsetWidth:CW, h=e?e.offsetHeight:CW*1.4;
    if(k===cols){k=0; y+=rowH+50; rowH=0}
    o.x=Math.round(x0+k*cw+(cw-w)/2); o.y=Math.round(Math.min(H-h-10,y)); o.r=Math.round((Math.random()*4-2)*10)/10; rowH=Math.max(rowH,h); k++});
  sel=null; save(); render(true)}

/* ---------- картинка ---------- */
function loadImg(src){return new Promise(function(res){var i=new Image(); i.onload=function(){res(i)}; i.onerror=function(){res(null)}; i.src=src})}
function wrapText(c,t,maxW){var words=String(t).split(/\s+/), lines=[], cur=""; words.forEach(function(w){var s=cur?cur+" "+w:w; if(c.measureText(s).width>maxW&&cur){lines.push(cur); cur=w} else cur=s}); if(cur) lines.push(cur); return lines}
function exportPng(T){if(T&&!T.cb) T=null;
  var vis=B().items.filter(seen); if(!vis.length){if(T) return T.cb(null); alert("Pin something to the board first"); return}
  if(!T){pngBtn.disabled=true; pngBtn.textContent="Preparing…"}
  var css=getComputedStyle(document.documentElement), HAND=(css.getPropertyValue("--hand")||"cursive").trim(), DISP=(css.getPropertyValue("--display")||"sans-serif").trim();
  var box={x0:1e9,y0:1e9,x1:-1e9,y1:-1e9}, dims={};
  vis.forEach(function(o){var e=world.querySelector('[data-i="'+o.i+'"]'); var w=e?e.offsetWidth:CW, h=e?e.offsetHeight:CW*1.4; dims[o.i]={w:w,h:h}; box.x0=Math.min(box.x0,o.x); box.y0=Math.min(box.y0,o.y); box.x1=Math.max(box.x1,o.x+w); box.y1=Math.max(box.y1,o.y+h)});
  var pad=60; box.x0-=pad; box.y0-=pad; box.x1+=pad; box.y1+=pad+30;
  var bw=box.x1-box.x0, bh=box.y1-box.y0;
  /* как можно крупнее, но в пределах того, что выдержит браузер (iPhone/Safari — около 16 Мп) */
  var saf=/iP(hone|ad|od)/.test(navigator.userAgent)||/^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
  var K=T?Math.min(1,T.max/Math.max(bw,bh)):Math.min(3,Math.sqrt((saf?15.5e6:32e6)/(bw*bh)),(saf?4096*2:16000)/Math.max(bw,bh));
  Promise.all([document.fonts?document.fonts.ready:null,loadImg("img/cork.webp")].concat(vis.map(function(o){return o.t==="card"&&freshSrc(o)?loadImg(freshSrc(o)):null}))).then(function(imgs){
    imgs.shift(); var cork=imgs.shift(); var IM={}; vis.forEach(function(o,j){IM[o.i]=imgs[j]});
    paint(K,cork,IM)});
  function paint(k,cork,IM){
    var cv=document.createElement("canvas"); cv.width=Math.round(bw*k); cv.height=Math.round(bh*k); var c=cv.getContext("2d");
    if(!c){return k>1.1?paint(k*.7,cork,IM):done(null)}
    c.scale(k,k); c.translate(-box.x0,-box.y0);
    /* пробка */
    c.fillStyle="#8a6038"; c.fillRect(box.x0,box.y0,bw,bh); if(cork){c.save(); c.translate(box.x0,box.y0); c.fillStyle=c.createPattern(cork,"repeat"); c.fillRect(0,0,bw,bh); c.restore()}
    var rnd=1; function rr(){rnd=(rnd*9301+49297)%233280; return rnd/233280}
    if(!cork) for(var q=0;q<bw*bh/90;q++){c.fillStyle=rr()<.5?"rgba(0,0,0,.13)":"rgba(255,255,255,.08)"; c.fillRect(box.x0+rr()*bw,box.y0+rr()*bh,1.6,1.6)}
    var gr=c.createRadialGradient(box.x0+bw/2,box.y0+bh/2,Math.min(bw,bh)*.3,box.x0+bw/2,box.y0+bh/2,Math.max(bw,bh)*.75); gr.addColorStop(0,"rgba(0,0,0,0)"); gr.addColorStop(1,"rgba(0,0,0,.45)"); c.fillStyle=gr; c.fillRect(box.x0,box.y0,bw,bh);
    c.lineWidth=18; c.strokeStyle="#e8ad6c"; c.strokeRect(box.x0+9,box.y0+9,bw-18,bh-18); c.lineWidth=2; c.strokeStyle="#b9783f"; c.strokeRect(box.x0+18,box.y0+18,bw-36,bh-36);
    function pin(x,y){var g=c.createRadialGradient(x-2,y-2,1,x,y,7); g.addColorStop(0,"#ff7a7a"); g.addColorStop(1,"#b3121e"); c.fillStyle=g; c.beginPath(); c.arc(x,y,6,0,7); c.fill()}
    var items={}; vis.forEach(function(o){items[o.i]=o});
    function P(o){var d=dims[o.i]; return o.t==="stamp"?{x:o.x+d.w/2,y:o.y+d.h/2}:{x:o.x+d.w/2,y:o.y+6}}
    /* карточки */
    vis.forEach(function(o){var d=dims[o.i]; c.save(); c.translate(o.x+d.w/2,o.y+d.h/2); c.rotate((o.r||0)*Math.PI/180); c.translate(-d.w/2,-d.h/2);
      c.shadowColor="rgba(0,0,0,.45)"; c.shadowBlur=14; c.shadowOffsetY=6;
      if(o.t==="card"){c.fillStyle="#f2eee5"; c.fillRect(0,0,d.w,d.h); c.shadowColor="transparent";
        var iw=d.w-12, im=IM[o.i], ih=o.shot&&im?iw*im.height/im.width:iw*1.25; c.fillStyle="#2a2e36"; c.fillRect(6,6,iw,ih);
        if(im){var sr=im.width/im.height, dr=iw/ih, sx=0, sy=0, sw=im.width, sh=im.height; if(sr>dr){sw=im.height*dr; sx=(im.width-sw)/2} else {sh=im.width/dr; sy=(im.height-sh)/2} c.drawImage(im,sx,sy,sw,sh,6,6,iw,ih)}
        c.fillStyle="#24252c"; c.font="700 17px "+HAND; c.textAlign="center"; c.textBaseline="top"; wrapText(c,CL(o),d.w-10).slice(0,3).forEach(function(l,j){c.fillText(l,d.w/2,ih+10+j*17)});
        if(o.x2){c.strokeStyle="rgba(200,20,30,.9)"; c.lineWidth=6; c.lineCap="round"; c.beginPath(); c.moveTo(10,12); c.lineTo(d.w-10,ih); c.moveTo(d.w-12,14); c.lineTo(12,ih-2); c.stroke()}}
      else if(o.t==="note"){c.fillStyle={y:"#f7e27a",p:"#f6b3c9",b:"#a9d6f2",g:"#b8e3a4"}[o.c]||"#f7e27a"; c.fillRect(0,0,d.w,d.h); c.shadowColor="transparent";
        c.fillStyle="#24252c"; c.font="700 20px "+HAND; c.textAlign="left"; c.textBaseline="top"; wrapText(c,TL(o.txt)||"…",d.w-24).slice(0,7).forEach(function(l,j){c.fillText(l,12,16+j*20)})}
      else{c.shadowColor="transparent"; var col=o.c==="k"?"#1b1c22":"#c81e2b"; c.strokeStyle=col; c.fillStyle=col; c.lineWidth=3; c.strokeRect(2,2,d.w-4,d.h-4); c.font="700 20px "+DISP; c.textAlign="center"; c.textBaseline="middle"; c.fillText(String(TL(o.txt)).toUpperCase(),d.w/2,d.h/2+1)}
      c.restore()});
    /* нитки поверх, чтобы было видно */
    B().links.forEach(function(l){var a=items[l.a], b=items[l.b]; if(!a||!b) return; var A=P(a), Z=P(b), d=Math.hypot(Z.x-A.x,Z.y-A.y), sag=Math.min(60,d*.12+8), mx=(A.x+Z.x)/2, my=Math.max(A.y,Z.y)+sag;
      c.save(); c.strokeStyle=LC[l.c||"r"][0]; c.setLineDash(l.d?[9,7]:[]); c.lineWidth=2.6; c.shadowColor="rgba(0,0,0,.5)"; c.shadowBlur=3; c.shadowOffsetY=2; c.beginPath(); c.moveTo(A.x,A.y); c.quadraticCurveTo(mx,my,Z.x,Z.y); c.stroke(); c.restore();
      if(l.txt){var lt=TL(l.txt); c.font="700 16px "+HAND; var tw=Math.min(180,c.measureText(lt).width)+14, q=bzAt(A,mx,my,Z,l.lt!=null?l.lt:.5), tx=q.x, ty=q.y; c.fillStyle="#f2eee5"; c.fillRect(tx-tw/2,ty-12,tw,24); c.fillStyle="#8c1620"; c.textAlign="center"; c.textBaseline="middle"; c.fillText(lt,tx,ty+1,tw-10)}});
    vis.forEach(function(o){if(o.t!=="stamp"){var p=P(o); pin(p.x,p.y)}});
    c.fillStyle="rgba(255,255,255,.75)"; c.font="600 16px "+DISP; c.textAlign="right"; c.textBaseline="bottom"; c.fillText("delo-sentfora.vercel.app",box.x1-20,box.y1-16);
    /* jpeg: в высоком разрешении png весит десятки мегабайт */
    try{cv.toBlob(function(blob){if(!blob&&k>1.1){cv.width=cv.height=1; return paint(k*.7,cork,IM)} cv.width=cv.height=1; done(blob)},"image/jpeg",T?.7:.92)}catch(x){if(k>1.1) paint(k*.7,cork,IM); else done(null)}
  }
  function done(blob){if(T) return T.cb(blob);
      pngBtn.disabled=false; pngBtn.textContent="Save as image"; if(!blob){alert("Couldn't save the image. Try again."); return}
      var name="doska-ulik.jpg", f=null; try{f=new File([blob],name,{type:"image/jpeg"})}catch(x){}
      if(f&&navigator.canShare&&navigator.canShare({files:[f]})&&matchMedia("(pointer:coarse)").matches){navigator.share({files:[f],title:"My evidence board"}).catch(function(){}); return}
      var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(a.href); a.remove()},1500)}
}

/* перерисовка при смене серии, внешности и показе вкладки */
var rt, lw=innerWidth; window.addEventListener("resize",function(){if(innerWidth===lw) return; lw=innerWidth; clearTimeout(rt); rt=setTimeout(function(){render()},150)});
window.SFcork=function(){if(!RO&&!root.offsetParent&&!wrap.classList.contains("full")) return; render(first); hubBuild(); galSpoil()};

/* ---------- окна: ссылка, код ---------- */
function dlg(){var sh=el("div","inv-shade"), d=el("div","inv-dlg"); d.setAttribute("role","dialog"); function close(){sh.remove(); d.remove()} sh.onclick=close; document.body.appendChild(sh); document.body.appendChild(d); return {d:d,close:close}}
function copy(t,b){function ok(){var o=b.textContent; b.textContent="Copied ✓"; setTimeout(function(){b.textContent=o},1500)}
  if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok,function(){fallback()}); else fallback();
  function fallback(){var ta=el("textarea"); ta.value=t; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy"); ok()}catch(e){} ta.remove()}}
function errMsg(e){var m=e&&e.message||""; if(m==="big") return "The board is too big for a link: remove a couple of your own screenshots and try again."; if(m==="off") return "The link isn't available right now. Try again later."; if(/captcha/.test(m)) return "Couldn't check that you're not a bot 🤖 Refresh the page and try again."; return "Couldn't save the board to the server. Check your internet and try again."}
function shareDlg(){
  var b=B(); if(!b.items.length){alert("Pin something to the board first"); return}
  var w=dlg(), d=w.d; d.appendChild(el("h4","","Link to the board")); var st=el("p","inv-dlg-st","Saving the board…"); d.appendChild(st);
  var x=btn("inv-x","✕","Close",w.close); d.appendChild(x);
  publish(b).then(function(code){
    st.remove(); var url=linkOf(code);
    d.appendChild(el("p","","Anyone who opens the link will see your board. Only you can change it, and all changes will show up at the link automatically."));
    var row=el("div","inv-dlg-row"), inp=el("input"); inp.readOnly=true; inp.value=url; inp.onclick=function(){inp.select()}; row.appendChild(inp);
    var cb=btn("inv-b","Copy","",function(){copy(url,cb)}); row.appendChild(cb); d.appendChild(row);
    if(navigator.share) d.appendChild(btn("inv-b wide","Share…","",function(){navigator.share({title:"My evidence board",url:url}).catch(function(){})}));
    d.appendChild(el("h5","","Transfer code"));
    var cd=el("div","inv-code",code.slice(0,3)+"-"+code.slice(3)); d.appendChild(cd);
    d.appendChild(el("p","inv-small","On another device, open “Evidence board” → ⋯ → “Open board by code” and enter the code. A copy of the board will appear there."));
    d.appendChild(btn("inv-b del","Turn off link access","",function(){if(!confirm("The link and code will stop working. Turn off access?")) return; SB.boardDel(code).then(function(){b.pub=null; delete lastSync[code]; store(); w.close()},function(e){alert(errMsg(e))})}));
  },function(e){st.textContent=errMsg(e)})}
function normCode(t){return String(t||"").toUpperCase().replace(/[^A-Z0-9]/g,"")}
function openByCode(){
  var t=prompt("Enter the board code, like K7Q-2MX"); if(t===null) return;
  var m=/doska=([A-Za-z2-9]{7})/.exec(t), c=m?m[1].toUpperCase():normCode(t);
  if(!/^[A-Z2-9]{7}$/.test(c)){alert("The code is 7 letters and digits, like K7Q-2MXA"); return}
  if(!window.SB||!SB.on){alert(errMsg({message:"off"})); return}
  SB.boardGet(c).then(function(r){if(!r){alert("No board with this code. The author may have turned off access."); return}
    var nb=newBoard((r.title||"Board")+" (copy)"), dt=r.data||{}; nb.items=dt.items||[]; nb.links=dt.links||[]; nb.nid=dt.nid||(nb.items.length+1);
    S.boards.push(nb); S.cur=S.boards.length-1; hist=[]; fut=[]; hbtn(); sel=null; linking=null; store(); render(true)},function(){alert("Couldn't open the board. Check your internet and try again.")})}
/* ---------- объединение досок ---------- */
function szGuess(o){return o.t==="note"?{w:NW,h:NW}:o.t==="stamp"?{w:SW,h:64}:{w:CW,h:CW*1.45}}
function szDom(o){var e=world.querySelector('[data-i="'+o.i+'"]'); return e&&e.offsetWidth?{w:e.offsetWidth,h:e.offsetHeight}:szGuess(o)}
function bbox(list,sz){var b={x0:1e9,y0:1e9,x1:-1e9,y1:-1e9}; list.forEach(function(o){var d=sz(o); b.x0=Math.min(b.x0,o.x); b.y0=Math.min(b.y0,o.y); b.x1=Math.max(b.x1,o.x+d.w); b.y1=Math.max(b.y1,o.y+d.h)}); return b}
function keyOf(o){return o.t==="card"?"c:"+(o.ref||o.src||("#"+o.i)):o.t+":"+(o.c||"")+":"+String(o.txt||"").trim().toLowerCase()}
function mergeData(dt){
  var b=B(), its=JSON.parse(JSON.stringify(dt.items||[])), lks=dt.links||[]; if(!its.length) return {n:0,l:0};
  var have={}; b.items.forEach(function(o){have[keyOf(o)]=o.i});
  var map={}, add=[]; its.forEach(function(o){var k=keyOf(o); if(have[k]!=null) map[o.i]=have[k]; else add.push(o)});
  var pairs={}; b.links.forEach(function(l){pairs[Math.min(l.a,l.b)+"-"+Math.max(l.a,l.b)]=1});
  if(!add.length&&!lks.some(function(l){var a=map[l.a], z=map[l.b]; return a!=null&&z!=null&&a!==z&&!pairs[Math.min(a,z)+"-"+Math.max(a,z)]})) return {n:0,l:0};
  snap(); var ok=true;
  if(add.length){var g=bbox(add,szGuess), gw=g.x1-g.x0, gh=g.y1-g.y0, dx=0, dy=0;
    if(b.items.length){var cb=bbox(b.items,szDom);
      if(cb.x1+60+gw<=W-10){dx=cb.x1+60-g.x0; dy=Math.max(10,Math.min(H-10-gh,cb.y0))-g.y0}
      else if(cb.y1+60+gh<=H-10){dy=cb.y1+60-g.y0; dx=Math.max(10,Math.min(W-10-gw,cb.x0))-g.x0}
      else ok=false}
    add.forEach(function(o){var old=o.i; o.i=b.nid++; map[old]=o.i; o.x=Math.round(Math.max(0,Math.min(W-170,o.x+dx))); o.y=Math.round(Math.max(0,Math.min(H-120,o.y+dy))); b.items.push(o)})}
  var nl=0; lks.forEach(function(l){var a=map[l.a], z=map[l.b]; if(a==null||z==null||a===z) return; var k=Math.min(a,z)+"-"+Math.max(a,z); if(pairs[k]) return; pairs[k]=1; var c=JSON.parse(JSON.stringify(l)); c.a=a; c.b=z; b.links.push(c); nl++});
  sel=null; linking=null; save(); render(true); if(!ok) arrange(1);
  return {n:add.length,l:nl}}
function mergeDone(r){var w=dlg(), d=w.d; d.appendChild(btn("inv-x","✕","Close",w.close));
  if(!r.n&&!r.l){d.appendChild(el("h4","","Nothing new")); d.appendChild(el("p","","All of this is already on your board."))}
  else{d.appendChild(el("h4","","Done")); d.appendChild(el("p","","Added: "+r.n+" "+plural(r.n,"clue","clues","clues")+(r.l?" and "+r.l+" "+plural(r.l,"string","strings","strings"):"")+". What was already on the board wasn't duplicated. If something's wrong, the “back” arrow will undo it all."))}
  d.appendChild(btn("inv-b wide","OK","",w.close))}
function plural(n,a,b,c){var m=n%10, h=n%100; return m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c}
function mergeDlg(){
  var w=dlg(), d=w.d; d.appendChild(el("h4","","Merge boards")); d.appendChild(btn("inv-x","✕","Close",w.close));
  d.appendChild(el("p","","Everything from the other board will be added to “"+B().n+"”. Identical cards won't be duplicated, strings will be kept."));
  var others=[]; S.boards.forEach(function(x,j){if(j!==S.cur&&x.items.length) others.push(j)});
  if(others.length){d.appendChild(el("h5","","My boards"));
    others.forEach(function(j){var x=S.boards[j]; d.appendChild(btn("inv-b wide",x.n+" ("+x.items.length+")","",function(){w.close(); var r=mergeData(x);
      if(confirm("Board “"+x.n+"” isn't needed anymore? Everything from it is already here.\n\nOK — delete it, Cancel — keep it")){var cur=B(); S.boards.splice(j,1); S.cur=S.boards.indexOf(cur); hist=[]; fut=[]; hbtn(); save(); render()}
      mergeDone(r)}))})}
  d.appendChild(el("h5","","Someone else's board — code or link"));
  var row=el("div","inv-dlg-row"), inp=el("input"); inp.placeholder="K7Q-2MX"; inp.setAttribute("autocapitalize","characters"); inp.setAttribute("autocomplete","off"); row.appendChild(inp);
  var st=el("p","inv-small inv-dlg-st","");
  var go=btn("inv-b","Add","",function(){var t=inp.value, m=/doska=([A-Za-z2-9]{7})/.exec(t), c=m?m[1].toUpperCase():normCode(t);
    if(!/^[A-Z2-9]{7}$/.test(c)){st.textContent="The code is 7 letters and digits, like K7Q-2MX"; return}
    if(!window.SB||!SB.on){st.textContent=errMsg({message:"off"}); return}
    go.disabled=true; st.textContent="Loading…";
    SB.boardGet(c).then(function(r){go.disabled=false; if(!r){st.textContent="No board with this code. The author may have turned off access."; return} w.close(); mergeDone(mergeData(r.data||{}))},
      function(){go.disabled=false; st.textContent="Couldn't load. Check your internet and try again."})});
  inp.onkeydown=function(e){if(e.key==="Enter") go.click()};
  row.appendChild(go); d.appendChild(row); d.appendChild(st)}
function dz(s){try{return decodeURIComponent(escape(atob(s.split("").reverse().join(""))))}catch(e){return s}}
function hh(t){var h=5381; for(var i=0;i<t.length;i++) h=((h<<5)+h+t.charCodeAt(i))|0; return h}
function triangle(){var b=B(), ids={n:[],m:[],s:[]}, pr={};
  b.items.forEach(function(o){var h=hh(o.ref||""); if(h===1082316249) ids.n.push(o.i); else if(h===859290027) ids.m.push(o.i); else if(h===-1120690990) ids.s.push(o.i)});
  b.links.forEach(function(l){pr[pairKey(l.a,l.b)]=1});
  return ids.n.some(function(x){return ids.m.some(function(y){return pr[pairKey(x,y)]&&ids.s.some(function(z){return pr[pairKey(y,z)]&&pr[pairKey(x,z)]})})})}
var seenBusy=false;
function seenSound(){var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return; try{var c=new AC(), t=c.currentTime+.05, out=c.createGain(); out.gain.value=.5; out.connect(c.destination);
  var o=c.createOscillator(), g=c.createGain(); o.type="sawtooth"; o.frequency.setValueAtTime(55,t); o.frequency.linearRampToValueAtTime(38,t+5); var lp=c.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=180;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(.5,t+1.2); g.gain.setValueAtTime(.5,t+4.2); g.gain.linearRampToValueAtTime(0,t+5.6); o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t+5.8);
  [1.6,1.9,3.4,3.7].forEach(function(d){var k=c.createOscillator(), kg=c.createGain(); k.frequency.setValueAtTime(70,t+d); k.frequency.exponentialRampToValueAtTime(35,t+d+.18); kg.gain.setValueAtTime(.9,t+d); kg.gain.exponentialRampToValueAtTime(.001,t+d+.25); k.connect(kg); kg.connect(out); k.start(t+d); k.stop(t+d+.3)});
  setTimeout(function(){c.close&&c.close()},6500)}catch(e){}}
function seenEgg(){if(seenBusy) return; seenBusy=true; sel=null; linking=null; render();
  var d=el("div","inv-seen"), ey=el("div","inv-eyes"); ey.appendChild(el("i")); ey.appendChild(el("i")); d.appendChild(ey);
  var tx=el("div","inv-seen-t"), msg=dz("==ArQjK0VCNkQ3J0XCNIeC9kQ7J0dCNnQDCnQ7J0aCNqQjJ0bCdoQDyqQLK0"); d.appendChild(tx); wrap.appendChild(d);
  wrap.classList.add("inv-flick"); seenSound(); try{navigator.vibrate&&navigator.vibrate([40,90,40,600,40,90,40])}catch(e){}
  setTimeout(function(){wrap.classList.remove("inv-flick"); d.classList.add("on")},700);
  setTimeout(function(){ey.classList.add("open")},1600);
  setTimeout(function(){var ws=msg.split(" "), wi=0, li=0, wd=null, iv=setInterval(function(){
    if(!wd){if(wi) tx.appendChild(document.createTextNode(" ")); wd=el("b","inv-seen-w"); tx.appendChild(wd)}
    wd.appendChild(el("span","",ws[wi][li++])); if(li>=ws[wi].length){wi++; li=0; wd=null; if(wi>=ws.length) clearInterval(iv)}},75)},2500);
  setTimeout(function(){ey.classList.add("blink")},3400);
  setTimeout(function(){ey.classList.remove("open"); d.classList.add("off"); wrap.classList.add("inv-flick")},6600);
  setTimeout(function(){d.remove(); wrap.classList.remove("inv-flick"); seenBusy=false; if(window.SFegg) SFegg("g18")},7600)}

/* ---------- общая доска и галерея: публикуются сразу, после жалоб скрываются ---------- */
function pairKey(a,b){return Math.min(a,b)+"-"+Math.max(a,b)}
function maxEp(items){return items.reduce(function(m,o){return Math.max(m,+o.ep||0)},0)}
/* что человек добавил к своей копии общей доски: всё новее её последнего номера и новые нитки */
function comDelta(b){var nid=b.base.nid, had={}; (b.base.pairs||[]).forEach(function(p){had[p]=1});
  return {items:b.items.filter(function(o){return o.i>=nid}),links:b.links.filter(function(l){return l.a>=nid||l.b>=nid||!had[pairKey(l.a,l.b)]})}}
/* наложить добавку на доску: без дублей, нитки к старым карточкам сохраняются.
   У добавки sid номера постоянные (1000000 + sid*1000 + k), чтобы скрытие одной добавки не сдвигало другие */
function applyDelta(cd,dl,baseNid,sid){
  var out=JSON.parse(JSON.stringify({items:cd.items||[],links:cd.links||[],nid:cd.nid||1})), ids={}, have={}, map={}, fresh=[], lk=[], pairs={}, nl=0;
  out.items.forEach(function(o){ids[o.i]=1; have[keyOf(o)]=o.i; if(o.i>=out.nid) out.nid=o.i+1});
  out.links.forEach(function(l){pairs[pairKey(l.a,l.b)]=1});
  (dl.items||[]).forEach(function(o,k){var key=keyOf(o); if(have[key]!=null){map[o.i]=have[key]; return}
    var c=JSON.parse(JSON.stringify(o)); c.i=sid!=null?1e6+sid*1000+k:out.nid; if(c.i>=out.nid) out.nid=c.i+1; map[o.i]=c.i; have[key]=c.i; ids[c.i]=1; out.items.push(c); fresh.push(c.i)});
  function m(i){return i>=baseNid?(map[i]!=null?map[i]:null):(ids[i]?i:null)}
  (dl.links||[]).forEach(function(l){var a=m(l.a), z=m(l.b); if(a==null||z==null||a===z) return; var k=pairKey(a,z); if(pairs[k]) return; pairs[k]=1; var c=JSON.parse(JSON.stringify(l)); c.a=a; c.b=z; out.links.push(c); nl++;
    [a,z].forEach(function(i){if(fresh.indexOf(i)<0&&lk.indexOf(i)<0) lk.push(i)})});
  out.big=1; return {data:out,fresh:fresh,lk:lk,nl:nl}}
/* общая доска = основа (правит админ) + все нескрытые добавки читателей по порядку */
function compose(cd,subs,skip){var d={items:cd.items||[],links:cd.links||[],nid:cd.nid||1}, own={};
  subs.forEach(function(s){if(s.id===skip) return; var r=applyDelta(d,s.data||{},s.base||0,s.id); d=r.data; r.fresh.forEach(function(i){own[i]=s.id})});
  d.big=1; return {data:d,own:own}}
function comPush(){var b=B(); if(!b.com) return;
  if(!b.items.length&&!confirm("This board is empty. Are you sure you want to make the shared board empty?")) return;
  if(b.items.length&&!confirm("Replace the shared board with this version ("+b.items.length+" "+plural(b.items.length,"clue","clues","clues")+")? Everyone will see it right away.")) return;
  thumb(900).then(function(th){var p=payload(b); if(th) p.thumb=th; return SB.comSet(p,b.com.ver)}).then(function(row){if(!row){alert("Someone changed the shared board in the meantime. Open it again, tap “Edit” and redo your changes."); return}
    var done=function(){b.com.ver=row.ver; b.com.subs=[]; store(); var n=(row.data&&row.data.items||[]).length; alert("Done, the shared board is updated: "+n+" "+plural(n,"clue","clues","clues")+". Opening it now."); location.href=location.pathname+"?obshaya"};
    if(b.com.subs&&b.com.subs.length) SB.subStatus(b.com.subs,"in").then(done,function(){alert("The board was updated, but readers' additions may have been duplicated. Open the shared board and check.")}); else done()},
    function(e){alert("That didn't work: "+(e&&e.message||"error")+". Check that you're logged in as admin.")})}
function nickVal(){try{return localStorage.getItem("sentfor_nick")||""}catch(e){return ""}}
function subErr(e){var m=e&&e.message||""; if(/too_many/.test(m)) return "You can add no more than 40 clues at a time."; if(e&&(e.status===403||e.code==="42501")) return "Too many submissions today. Try tomorrow."; return errMsg(e)}
function thumb(mx){return new Promise(function(res){exportPng({max:mx||640,cb:function(bl){if(!bl) return res(null); var rd=new FileReader(); rd.onload=function(){res(rd.result.length<380000?rd.result:null)}; rd.onerror=function(){res(null)}; rd.readAsDataURL(bl)}})})}
function subForm(d,o){
  var t=el("input","txt"); t.maxLength=80; t.value=o.title||""; t.placeholder=o.ph||"";
  var nk=el("input","txt"); nk.maxLength=40; nk.value=nickVal(); nk.placeholder="can be left empty";
  [[o.tl,t],["Signature (nickname)",nk]].forEach(function(x){d.appendChild(el("h5","",x[0])); var r=el("div","inv-dlg-row"); r.appendChild(x[1]); d.appendChild(r)});
  var st=el("p","inv-small inv-dlg-st",""), go=btn("inv-b wide",o.btn,"",function(){
    if(!window.SB||!SB.on){st.textContent=errMsg({message:"off"}); return}
    try{localStorage.setItem("sentfor_nick",nk.value.trim())}catch(e){}
    go.disabled=true; st.textContent="Sending…";
    o.send(t.value.trim(),nk.value.trim()).then(function(){d.innerHTML=""; d.appendChild(el("h4","","Done")); d.appendChild(el("p","",o.okTxt)); d.appendChild(btn("inv-b wide","OK","",o.close)); if(o.after) o.after()},
      function(e){go.disabled=false; st.textContent=subErr(e)})});
  d.appendChild(go); d.appendChild(st)}
function galDlg(){var b=B(); if(!b.items.length){alert("Pin something to the board first"); return}
  var js=JSON.stringify(payload(b)); if(js.length>MAXB){alert(errMsg({message:"big"})); return}
  var w=dlg(), d=w.d; d.appendChild(el("h4","","To the gallery")); d.appendChild(btn("inv-x","✕","Close",w.close));
  d.appendChild(el("p","","The board will appear in the gallery right away: everyone will be able to open it and take a copy. It's a copy: further edits on your board won't go there."));
  subForm(d,{close:w.close,tl:"Title",title:b.n,btn:"Post",okTxt:"The board is already in the gallery. You can remove it by opening it in the gallery.",after:galReset,send:function(t,nk){
    return thumb().then(function(th){return SB.subAdd({kind:"gallery",title:t||b.n||"Board",nick:nk,data:payload(b),thumb:th,n:b.items.length,max_ep:maxEp(b.items)})})}})}
function comDlg(){var b=B(); if(!b.base) return; var dl=comDelta(b);
  var w=dlg(), d=w.d; d.appendChild(el("h4","","To the shared board")); d.appendChild(btn("inv-x","✕","Close",w.close));
  if(!dl.items.length&&!dl.links.length){d.appendChild(el("p","","Nothing new yet: add your own clues, notes or strings to this board, then send it.")); d.appendChild(btn("inv-b wide","OK","",w.close)); return}
  if(dl.items.length>40){d.appendChild(el("p","","You can add no more than 40 clues at a time, and you have "+dl.items.length+". Remove the extras and try again.")); d.appendChild(btn("inv-b wide","OK","",w.close)); return}
  d.appendChild(el("p","","New on your board: "+dl.items.length+" "+plural(dl.items.length,"clue","clues","clues")+" and "+dl.links.length+" "+plural(dl.links.length,"string","strings","strings")+". It will show up on the shared board for everyone right away."));
  subForm(d,{close:w.close,tl:"What was added (optional)",ph:"for example, the link between Howard and Poppy",btn:"Add to the shared board",okTxt:"Your clues are already on the shared board.",send:function(t,nk){
    return SB.subAdd({kind:"community",title:t,nick:nk,data:dl,base:b.base.nid,n:dl.items.length,max_ep:maxEp(dl.items)}).then(function(){
      b.base.nid=b.nid; b.base.pairs=b.links.map(function(l){return pairKey(l.a,l.b)}); store()})}})}
/* жалобы */
function reported(id,set){var k="sentfor_reported", a=[]; try{a=JSON.parse(localStorage.getItem(k)||"[]")}catch(e){} if(!set) return a.indexOf(id)>=0; a.push(id); try{localStorage.setItem(k,JSON.stringify(a.slice(-200)))}catch(e){}}
function report(id,b,cb){if(reported(id)){b.textContent="Report sent"; b.disabled=true; return}
  if(!confirm("Report it? If several people report it, it will disappear from the site.")) return; b.disabled=true;
  SB.reportSub(id).then(function(r){reported(id,1); b.textContent="Report sent"; if(cb) cb(r)},function(){b.disabled=false; alert("Couldn't send the report. Try again.")})}
function comWho(subs,own){var w=dlg(), d=w.d; d.appendChild(el("h4","","Who added what")); d.appendChild(btn("inv-x","✕","Close",w.close));
  d.appendChild(el("p","inv-small","Tap “Show” to highlight other people's clues on the board. If there's something inappropriate, report it."));
  subs.slice().reverse().forEach(function(s){var r=el("div","inv-mod-it"), t=el("div"); t.appendChild(el("b","",(s.nick||"Unsigned")+(s.title?" · "+s.title:""))); t.appendChild(el("span","",s.n+" "+plural(s.n,"clue","clues","clues")+" · "+new Date(s.created_at).toLocaleDateString("en-US"))); r.appendChild(t);
    var acts=el("div","inv-mod-acts");
    acts.appendChild(btn("inv-b","Show","",function(){NEWI={}; for(var i in own) if(own[i]===s.id) NEWI[i]=1; w.close(); render()}));
    var rb=btn("inv-b inv-flag","⚑","Report",function(){report(s.id,rb)}); if(reported(s.id)){rb.disabled=true; rb.textContent="✓"} acts.appendChild(rb); r.appendChild(acts); d.appendChild(r)});
  var bs=el("div","inv-mod-it"), bt=el("div"); bt.appendChild(el("b","",COMBASE)); bt.appendChild(el("span","","board base")); bs.appendChild(bt); d.appendChild(bs)}
var COMBASE="@mewwews";

/* блок под доской: общая доска, галерея, жалобы для админа */
var hub=null, galOff=0, galBusy=false;
function hubBuild(){if(hub||RO||!DK) return; hub=el("div","inv-hub");
  hub.appendChild(el("h3","","Readers' boards"));
  hub.appendChild(el("p","inv-hub-warn","⚠️ There may be spoilers for any episode here: readers' notes and screenshots aren't hidden by episode."));
  var com=el("a","inv-hub-com"); com.href="?obshaya"; com.appendChild(el("b","","🌍 Shared board")); com.appendChild(el("span","","All readers build it together. It's based on the board by "+COMBASE+". Open it, add to it on your board and post your clues — they'll show up for everyone right away.")); com.appendChild(el("i","","⚠️ Spoilers for all released episodes"));
  var cim=el("div","inv-hub-com-im"); cim.hidden=true; com.insertBefore(cim,com.firstChild);
  hub.appendChild(com);
  hub.appendChild(el("h4","","Gallery"));
  var g=el("div","inv-gal"); hub.appendChild(g);
  var more=btn("inv-b inv-gal-more","Show more","",galLoad); more.hidden=true; hub.appendChild(more);
  hub.appendChild(el("p","inv-hub-note","You can post your own board to the gallery: on the board, tap ⋯ → “Send to gallery”."));
  var mod=btn("inv-b inv-hub-mod","","",modList); mod.hidden=true; hub.appendChild(mod);
  root.parentNode.insertBefore(hub,root.nextSibling);
  function data(){galLoad();
    if(window.SB&&SB.on) SB.comThumb().then(function(t){if(!t) return; var im=el("img"); im.src=t; im.alt=""; cim.appendChild(im); cim.appendChild(el("span","inv-gal-sp","Spoilers for all episodes")); cim.hidden=false; cim.classList.toggle("sp",false)},function(){});
    if(window.SB&&SB.on&&SB.user()) SB.isAdmin().then(function(a){if(!a) return; SB.hiddenSubs().then(function(r){mod.hidden=false; mod.textContent="🛡 Hidden after reports: "+(r||[]).length})})}
  if(window.SB) data(); else window.addEventListener("load",data)}
function galCard(r){var a=el("a","inv-gal-it"); a.href="?galereya="+r.id; a.setAttribute("data-max",r.max_ep||0);
  var f=el("div","inv-gal-im"); if(r.thumb){var im=el("img"); im.loading="lazy"; im.src=r.thumb; im.alt="";  f.appendChild(im)} f.appendChild(el("span","inv-gal-sp","Spoilers up to episode "+(r.max_ep||0)+"\${")); a.appendChild(f);
  a.appendChild(el("b","",TL(r.title)||"Board")); a.appendChild(el("span","",(r.nick?r.nick+" · ":"")+r.n+" "+plural(r.n,"clue","clues","clues"))); return a}
function galSpoil(){} /* спойлеры больше не размываем: одна плашка над галереей */
function galReset(){if(!hub) return; galOff=0; hub.querySelector(".inv-gal").innerHTML=""; galLoad()}
function galLoad(){if(!hub||galBusy||!window.SB||!SB.on) return; galBusy=true; var g=hub.querySelector(".inv-gal"), more=hub.querySelector(".inv-gal-more"), L=12;
  SB.gallery(galOff,L).then(function(rs){galBusy=false; rs=rs||[]; galOff+=rs.length; rs.forEach(function(r){g.appendChild(galCard(r))}); more.hidden=rs.length<L;
    if(!galOff&&!g.firstChild) g.appendChild(el("p","inv-hub-note","Nothing here yet. Post your board first!")); galSpoil()},function(){galBusy=false})}
function modList(){var w=dlg(), d=w.d; d.appendChild(el("h4","","Hidden after reports")); d.appendChild(btn("inv-x","✕","Close",w.close)); var st=el("p","inv-dlg-st","Loading…"); d.appendChild(st);
  SB.hiddenSubs().then(function(rs){st.remove(); if(!rs||!rs.length){d.appendChild(el("p","","No reports ✓")); return}
    d.appendChild(el("p","inv-small","Open it, take a look and decide: restore or delete."));
    rs.forEach(function(r){var a=el("a","inv-mod-it"); a.href=r.kind==="gallery"?"?galereya="+r.id:"?obshaya&predlozhenie="+r.id;
      if(r.thumb){var im=el("img"); im.src=r.thumb; im.alt=""; a.appendChild(im)}
      var t=el("div"); t.appendChild(el("b","",(r.kind==="gallery"?"Gallery: ":"Shared board: ")+(r.title||"untitled"))); t.appendChild(el("span","",(r.nick?r.nick+" · ":"")+r.n+" "+plural(r.n,"clue","clues","clues")+" · "+new Date(r.created_at).toLocaleDateString("en-US"))); a.appendChild(t); d.appendChild(a)})},
    function(e){st.textContent="Couldn't load: "+(e&&e.message||"")})}
function takeBoard(ex){var x=loadS(), b=B(), nb=newBoard(ex&&ex.n||((b.n||"Board")+" (copy)")); nb.items=JSON.parse(JSON.stringify(b.items)); nb.links=JSON.parse(JSON.stringify(b.links)); nb.nid=b.nid; if(b.big) nb.big=1;
  if(ex&&ex.base) nb.base=ex.base; if(ex&&ex.com) nb.com=ex.com;
  x.boards.push(nb); x.cur=x.boards.length-1; try{localStorage.setItem(SK,JSON.stringify(x)); localStorage.setItem("sentfor_tab","threads")}catch(e){alert("Couldn't save the board in this browser"); return} location.href=location.pathname}

/* общая доска: заметки и скрины читателей не прячутся по сериям — сначала предупреждаем */
function spOk(){return true}
function spAsk(next){empty.innerHTML=""; empty.appendChild(el("b","","⚠️ Spoiler warning"));
  empty.appendChild(el("span","","Character and clue cards hide by episode, but readers' notes and screenshots don't. The shared board may have spoilers for all released episodes."));
  var r=el("div","inv-sp-acts"); r.appendChild(btn("inv-b","Back","",function(){location.href=location.pathname}));
  r.appendChild(btn("inv-b ok","Open","",function(){try{localStorage.setItem("sentfor_comsp","1")}catch(e){} empty.innerHTML="<b>Opening the board…</b>"; next()}));
  empty.appendChild(r); empty.hidden=false}
/* режим просмотра: грузим доску по коду, из галереи или общую */
function roFail(t,m){empty.innerHTML=""; empty.appendChild(el("b","",t)); empty.appendChild(document.createTextNode(m)); empty.hidden=false}
function roShow(n,dt){var b=S.boards[0]; dt=dt||{}; b.big=dt.big?1:0; b.n=n||dt.n||"Evidence board"; b.items=dt.items||[]; b.links=dt.links||[]; b.nid=dt.nid||1; first=true; render(true)}
var hasTab=function(){return !!document.querySelector('.tab[data-tab="threads"]')};
function barBtn(t,title,fn,c){var e=btn("inv-b "+(c||""),t,title,fn); bar.insertBefore(e,roClose); return e}
/* полоска для админа внизу экрана */
function modBar(txt,acts){var m=el("div","inv-mod"); m.appendChild(el("span","",txt)); acts.forEach(function(a){m.appendChild(btn("inv-b "+(a[2]||""),a[0],"",function(){a[1](m)}))}); wrap.appendChild(m); return m}
function modDo(m,p,ok){[].forEach.call(m.querySelectorAll("button"),function(x){x.disabled=true}); p.then(function(){m.innerHTML=""; m.appendChild(el("span","",ok)); setTimeout(function(){location.reload()},1000)},function(e){[].forEach.call(m.querySelectorAll("button"),function(x){x.disabled=false}); alert("That didn't work: "+(e&&e.message||"error")+". Check that you're logged in as admin.")})}
function modSub(r,what){var st=function(s,t){return function(m){modDo(m,SB.subStatus([r.id],s),t)}};
  if(r.status==="hidden") modBar(what+" hidden after reports",[["Restore",st("ok","Restored"),"ok"],["Delete",st("no","Deleted"),"del"]]);
  else if(r.status==="ok") modBar(what+" visible to everyone",[["Remove",function(m){if(confirm("Remove from the site?")) st("no","Removed")(m)},"del"]]);
  else if(r.status==="no") modBar(what+" removed",[["Restore",st("ok","Restored"),"ok"]]);
  else modBar(what+" is already built into the shared board",[])}
if(RO){wrap.classList.add("full","view"); document.documentElement.classList.add("inv-lock"); addBtn.hidden=true; openBtn.hidden=true;
  empty.innerHTML="<b>Opening the board…</b>"; empty.hidden=false; roTitle.textContent="Evidence board";
  var go=function(){if(!window.SB||!SB.on){roFail("Couldn't open it","Try refreshing the page."); return}
    var net=function(){roFail("Couldn't open it","Check your internet and refresh the page.")};
    if(VIEW.k==="code") SB.boardGet(VIEW.v).then(function(r){
      if(!r){roFail("Board not found","The author may have turned off link access."); return}
      roShow(TL(r.title),r.data); roTake.hidden=!hasTab()},net);
    else if(VIEW.k==="gal") Promise.all([SB.subGet(VIEW.v),SB.isAdmin()]).then(function(rs){var r=rs[0], adm=rs[1], me=SB.user();
      if(!r||r.kind!=="gallery"){roFail("Board not found","It may have been removed from the gallery."); return}
      roShow((TL(r.title)||"Board")+(r.nick?" · "+r.nick:""),r.data); roTake.hidden=!hasTab()||r.status!=="ok";
      if(adm) return modSub(r,"Board");
      if(me&&me.id===r.owner){barBtn("Remove","Remove my board from the gallery",function(){if(!confirm("Remove your board from the gallery?")) return; SB.subDel(r.id).then(function(){location.href=location.pathname},function(){alert("That didn't work. Try again.")})},"del"); return}
      if(r.status==="ok"){var rb=barBtn("⚑","Report",function(){report(r.id,rb,function(x){if(x==="hidden"){alert("Board hidden. Thank you!"); location.href=location.pathname}})}); if(reported(r.id)){rb.disabled=true}}},net);
    else if(!VIEW.v&&!spOk()) spAsk(go);
    else if(!VIEW.v) Promise.all([SB.comGet(),SB.comSubs(),SB.isAdmin()]).then(function(rs){var r=rs[0], subs=rs[1]||[], adm=rs[2];
      if(!r){net(); return} roEmpty="<b>The shared board is empty for now</b>The first clues will show up here soon.";
      var C=compose(r.data||{},subs); roShow("Shared board",C.data); roTake.textContent="Add to it on my board"; roTake.hidden=!hasTab();
      var pairs=C.data.links.map(function(l){return pairKey(l.a,l.b)});
      roTake.onclick=function(){takeBoard({n:"Shared board — my version",base:{nid:C.data.nid,pairs:pairs}})};
      barBtn("Who added","Who added what",function(){comWho(subs,C.own)});
      if(adm) barBtn("Edit","Edit the shared board",function(){takeBoard({n:"★ Shared board (edit)",com:{ver:r.ver,subs:subs.map(function(s){return s.id})}})})},net);
    else Promise.all([SB.comGet(),SB.comSubs(),SB.subGet(VIEW.v),SB.isAdmin()]).then(function(rs){var c=rs[0], sb=rs[2];
      if(!sb||sb.kind!=="community"){roFail("Addition not found","It may have been deleted."); return}
      var base=compose(c&&c.data||{},rs[1]||[],sb.id).data, res=applyDelta(base,sb.data||{},sb.base||0,sb.id); NEWI={}; res.fresh.forEach(function(i){NEWI[i]=1}); res.lk.forEach(function(i){NEWI[i]=1});
      roShow("Addition"+(sb.nick?" · "+sb.nick:""),res.data);
      if(rs[3]) modSub(sb,"Highlighted: "+res.fresh.length+" "+plural(res.fresh.length,"clue","clues","clues")+(sb.title?" “"+sb.title+"”":"")+" —")},net)};
  if(window.SB) go(); else window.addEventListener("load",go)}
/* если вкладка доски уже открыта при загрузке страницы */
if(!RO&&root.offsetParent) window.SFcork();
})();
