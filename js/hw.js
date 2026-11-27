/* Закрытый аккаунт Говарда (спрятан: 5 нажатий на фото в его досье). Без одобрения видно только шапку профиля.
   Заявки одобряет админ. Посты лежат в отдельном файле, путь к нему выдаёт Supabase только одобренным (см. supabase/howard.sql). */
(function(){
var ICON={"back": "<svg viewBox=\"0 0 24 24\"><path d=\"M15 4 7 12l8 8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "heart": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 21.2C11.6 20.9 2.6 15 2.1 9.2 1.8 5.8 4.3 3.2 7.3 3.2c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3 0 5.5 2.6 5.2 6-.5 5.8-9.5 11.7-9.9 12z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linejoin=\"round\"/></svg>", "heartF": "<svg viewBox=\"0 0 24 24\"><path d=\"M12 21.2C11.6 20.9 2.6 15 2.1 9.2 1.8 5.8 4.3 3.2 7.3 3.2c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3 0 5.5 2.6 5.2 6-.5 5.8-9.5 11.7-9.9 12z\" fill=\"url(#pkH)\" stroke=\"#d7c3f2\" stroke-width=\".35\"/><path d=\"M5.2 6.2c1-1.3 2.9-1.6 4.1-.6\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".55\" stroke-width=\".8\" stroke-linecap=\"round\"/><path d=\"M4.2 10.6c2.2-1.6 4.4-.6 5.6 1.2 1.2 1.9 3.6 2.6 5.6 1.2\" fill=\"none\" stroke=\"url(#pkS)\" stroke-width=\".75\" stroke-linecap=\"round\"/><path d=\"M9.4 6.2c1.6.2 2.7 1.2 3.1 2.6M15.6 13c1.4-.4 2.6.1 3.4 1.1M6.6 14.4c.9-.9 2.1-1.1 3.2-.6\" fill=\"none\" stroke=\"url(#pkS)\" stroke-width=\".55\" stroke-linecap=\"round\"/><ellipse cx=\"18.6\" cy=\"9.4\" rx=\".9\" ry=\".45\" transform=\"rotate(-35 18.6 9.4)\" fill=\"url(#pkS)\"/><ellipse cx=\"6.2\" cy=\"12.6\" rx=\".8\" ry=\".4\" transform=\"rotate(30 6.2 12.6)\" fill=\"url(#pkS)\"/><ellipse cx=\"16.10\" cy=\"5.92\" rx=\"1.30\" ry=\"1.92\" transform=\"rotate(10 16.10 5.92)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"17.49\" cy=\"7.36\" rx=\"1.30\" ry=\"1.92\" transform=\"rotate(82 17.49 7.36)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"16.55\" cy=\"9.13\" rx=\"1.30\" ry=\"1.92\" transform=\"rotate(154 16.55 9.13)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"14.57\" cy=\"8.78\" rx=\"1.30\" ry=\"1.92\" transform=\"rotate(226 14.57 8.78)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"14.29\" cy=\"6.80\" rx=\"1.30\" ry=\"1.92\" transform=\"rotate(298 14.29 6.80)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><circle cx=\"15.80\" cy=\"7.60\" r=\"0.68\" fill=\"#2b2140\"/><circle cx=\"15.61\" cy=\"7.41\" r=\"0.25\" fill=\"#8f8fb0\" opacity=\".8\"/><ellipse cx=\"9.30\" cy=\"13.80\" rx=\"1.09\" ry=\"1.61\" transform=\"rotate(-12 9.30 13.80)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"10.84\" cy=\"14.48\" rx=\"1.09\" ry=\"1.61\" transform=\"rotate(60 10.84 14.48)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"10.66\" cy=\"16.16\" rx=\"1.09\" ry=\"1.61\" transform=\"rotate(132 10.66 16.16)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"9.02\" cy=\"16.51\" rx=\"1.09\" ry=\"1.61\" transform=\"rotate(204 9.02 16.51)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><ellipse cx=\"8.18\" cy=\"15.05\" rx=\"1.09\" ry=\"1.61\" transform=\"rotate(276 8.18 15.05)\" fill=\"url(#pkF)\" stroke=\"#c9c9d6\" stroke-width=\".18\"/><circle cx=\"9.60\" cy=\"15.20\" r=\"0.57\" fill=\"#2b2140\"/><circle cx=\"9.44\" cy=\"15.04\" r=\"0.21\" fill=\"#8f8fb0\" opacity=\".8\"/></svg>", "grid": "<svg viewBox=\"0 0 24 24\"><path d=\"M3.5 3.5h17v17h-17zM9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\"/></svg>", "multi": "<svg viewBox=\"0 0 24 24\"><path d=\"M7 7V3.5h13.5V17H17M3.5 7H17v13.5H3.5z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"/></svg>", "com": "<svg viewBox=\"0 0 24 24\"><path d=\"M20.5 11.6a8.4 8.4 0 0 1-12.3 7.4L3.5 20.5l1.6-4.5a8.4 8.4 0 1 1 15.4-4.4z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></svg>", "send": "<svg viewBox=\"0 0 24 24\"><path d=\"M21.5 3 10 14.5M21.5 3 15 21l-5-6.5L3 9.5z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></svg>", "save": "<svg viewBox=\"0 0 24 24\"><path d=\"M6 3.5h12v17l-6-4.5-6 4.5z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/></svg>", "lock": "<svg viewBox=\"0 0 24 24\"><rect x=\"5\" y=\"10.5\" width=\"14\" height=\"10\" rx=\"2\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/><path d=\"M8 10.5V8a4 4 0 0 1 8 0v2.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"/></svg>"};
var HEARTF='<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>';
var NICK="n.howard", AVA="img/x/ea420fba7bd526f5.webp", POSTS_N=10; /* сколько постов видно в закрытом профиле — обновлять вместе с x/….js */
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var root=null, bar, body, view="grid", feedAt=null, st={status:null,admin:false,data:null,loading:false,reqs:[]}, prevOv="";

/* вход спрятан: 5 быстрых нажатий на фото в досье Говарда */
window.SFdossierHook=function(id,c){if(id!=="howard") return; var f=c.querySelector(".pm-pol"); if(!f) return; var taps=[];
  f.addEventListener("click",function(){var t=Date.now(); taps=taps.filter(function(x){return t-x<2500}); taps.push(t);
    if(taps.length>=5){taps=[]; var x=document.getElementById("pm-close"); if(x) x.click(); setTimeout(open,120)}})};

function open(){
  if(!root){root=H("div","pp hwg"); root.hidden=true; root.setAttribute("role","dialog"); root.setAttribute("aria-modal","true"); root.setAttribute("aria-label","Инстаграм Говарда");
    bar=H("div","pp-bar"); body=H("div","pp-body"); root.appendChild(bar); root.appendChild(body); document.body.appendChild(root);
    document.addEventListener("keydown",function(e){if(e.key==="Escape"&&root&&!root.hidden){if(view==="feed"){view="grid"; render()} else close()}})}
  if(!root.hidden) return; prevOv=document.documentElement.style.overflow; document.documentElement.style.overflow="hidden";
  root.hidden=false; view="grid"; warm(); render(); root.scrollTop=0; check(); setHash(true);
}
function close(){if(!root||root.hidden) return; stClose(); root.hidden=true; document.documentElement.style.overflow=prevOv; setHash(false)}
/* чтобы при обновлении страницы остаться в инстаграме Говарда, а не выпасть на доску */
function setHash(on){try{var h=on?"#howard":"", u=location.pathname+location.search+h; if(location.hash!==h) history.replaceState(history.state,"",u)}catch(e){}}
window.SFhowardGram=open;
function note(txt,thumb,go){
  if(root&&!root.hidden) return;
  if(document.querySelector(".pp-note-push")){setTimeout(function(){note(txt,thumb,go)},2500); return}
  var n=H("button","pp-note-push hw-push"); n.type="button"; n.setAttribute("aria-label","n.howard: "+txt+". Открыть");
  n.innerHTML='<img class="pn-av" src="'+AVA+'" alt=""><span class="pn-t"><b>'+NICK+'</b> '+esc(txt)+'<small>Инстаграм · сейчас</small></span>'+(thumb?'<img class="pn-th" src="img/x/'+thumb+'.webp" alt="">':'')+'<span class="pn-x" aria-hidden="true">✕</span>';
  document.body.appendChild(n); requestAnimationFrame(function(){requestAnimationFrame(function(){n.classList.add("on")})});
  var done=false; function hide(){if(done) return; done=true; n.classList.remove("on"); setTimeout(function(){n.remove()},400)}
  n.onclick=function(e){hide(); if(e.target.closest(".pn-x")) return; open(); if(go){view="feed"; feedAt=go; render()}};
  var sy=0; n.addEventListener("touchstart",function(e){sy=e.touches[0].clientY},{passive:true});
  n.addEventListener("touchend",function(e){if(sy-e.changedTouches[0].clientY>30) hide()},{passive:true});
  setTimeout(hide,7000);
}
function bg(){
  var u=me(), c=cacheGet(); if(!u||c.u!==u.id||c.a) return;
  if(c.s==="new"){ /* ждём одобрения: вдруг уже приняли */
    fetchJ("hw_follow?select=status&user_id=eq."+u.id).then(function(r){var s2=r&&r[0]?r[0].status:null;
      if(s2==="ok") return fetchJ("hw_secret?select=path").then(function(x){var p=x&&x[0]&&x[0].path; cacheSet({u:u.id,a:false,s:"ok",p:p}); st.status="ok";
        return loadScript(p).then(function(){markKnown(); note("принял ваш запрос на подписку",null,null)})});
      if(s2!==c.s) cacheSet({u:u.id,a:false,s:s2});
    }).catch(function(){});
    return}
  if(c.s==="ok"&&c.p) loadScript(c.p).then(function(){
    var k=known(); if(!k){markKnown(); return}
    var nw=posts().filter(function(p){return k.indexOf(p.id)<0}); if(!nw.length) return;
    note(nw.length>1?"опубликовал новые посты: "+nw.length:"опубликовал новый пост",nw[0].img[0][0],nw[0].id);
  });
}
addEventListener("load",function(){setTimeout(function(){try{if(location.hash!=="#howard") bg()}catch(e){}},3500)});
try{if(location.hash==="#howard") setTimeout(open,400)}catch(e){}

/* статус: админ / одобрен / заявка / ничего.
   Последний известный статус и путь к постам запоминаем в браузере: при обновлении страницы
   одобренный сразу видит ленту, а проверка идёт тихо в фоне. */
var CK="sentfor_hw";
function cacheGet(){try{return JSON.parse(localStorage.getItem(CK)||"null")||{}}catch(e){return {}}}
function cacheSet(o){try{localStorage.setItem(CK,JSON.stringify(o))}catch(e){}}
function me(){return window.SB&&SB.on&&SB.user&&SB.user()}
function warm(){
  var u=me(), c=cacheGet();
  if(!u){st.status=null; st.admin=false; st.loading=false; return}
  if(c.u===u.id){st.admin=!!c.a; st.status=c.s||null; st.loading=false;
    if((st.admin||st.status==="ok")&&c.p) loadScript(c.p).then(function(){render(); return loadLive()}).then(render)}
  else st.loading=true;
}
function check(){ loadFol();
  var u=me(); if(!u){st.loading=false; render(); return}
  SB.isAdmin().then(function(adm){st.admin=adm; return fetchJ("hw_follow?select=status&user_id=eq."+u.id)}).then(function(r){
    st.status=r&&r[0]?r[0].status:null;
    if(st.admin||st.status==="ok") return fetchJ("hw_secret?select=path").then(function(x){var p=x&&x[0]&&x[0].path;
      cacheSet({u:u.id,a:st.admin,s:st.status,p:p}); return loadScript(p)}).then(loadLive);
    cacheSet({u:u.id,a:false,s:st.status}); st.data=null;
  }).catch(function(){}).then(function(){st.loading=false; if(st.admin) loadReqs(); render()});
}
function fetchJ(path,opt){return SB.raw(path,opt)}
var scr=null;
function loadScript(p){
  if(st.data) return Promise.resolve(); if(!p||!/^[a-f0-9]{16,40}$/.test(p)) return Promise.resolve();
  if(scr) return scr;
  return scr=new Promise(function(res){var s=document.createElement("script"); s.src=(window.SFLANG==="en"?"x/en/":"x/")+p+".js"; s.onload=function(){st.data=window.HWG_DATA||null; res()}; s.onerror=function(){scr=null; res()}; document.head.appendChild(s)});
}
/* лайки и комментарии — те же таблицы, что у Поппи, id постов с приставкой hw- (читать и писать могут только одобренные, см. howard.sql) */
var live={counts:{},mine:{},coms:{},me:null,nick:null};
function pid(p){return "hw-"+p.id}
function loadLive(){var ids=posts().map(pid); if(!ids.length||!window.SB||!SB.on) return Promise.resolve();
  return Promise.all([SB.likeCounts(ids).catch(function(){return []}),SB.myLikes(ids).catch(function(){return []}),SB.comments(ids).catch(function(){return []}),SB.profile().catch(function(){return null})]).then(function(r){
    live.counts={}; (r[0]||[]).forEach(function(x){live.counts[x.post_id]=x.n});
    live.mine={}; (r[1]||[]).forEach(function(x){live.mine[x.post_id]=1});
    live.coms={}; (r[2]||[]).forEach(function(c){(live.coms[c.post_id]=live.coms[c.post_id]||[]).push(c)});
    live.nick=r[3]&&r[3].nick||null; live.me=SB.user()&&SB.user().id})}
/* подписчики: 20 «своих» + сколько людей ты одобрила (число берётся из Supabase, видят все) */
var FK="sentfor_hw_fol", fol=0; try{fol=+localStorage.getItem(FK)||0}catch(e){}
function setFol(n){n=+n||0; if(n===fol) return; fol=n; try{localStorage.setItem(FK,String(n))}catch(e){} render()}
function loadFol(){if(window.SB&&SB.on&&SB.hwFollowers) SB.hwFollowers().then(setFol).catch(function(){})}
function loadReqs(){fetchJ("hw_follow?select=user_id,nick,status,created_at&order=created_at.desc").then(function(r){st.reqs=r||[]; fol=-1; setFol(st.reqs.filter(function(x){return x.status==="ok"}).length)}).catch(function(){})}
function setReq(uid,status){var q=status?fetchJ("hw_follow?user_id=eq."+uid,{method:"PATCH",body:{status:status}}):fetchJ("hw_follow?user_id=eq."+uid,{method:"DELETE"});
  q.then(loadReqs).catch(function(e){toast("Не получилось: "+(e.message||e))})}

function err(e){var m=String(e&&e.message||e||""); return /slow_down/.test(m)?"Не так быстро, подожди пару секунд":/daily_limit/.test(m)?"На сегодня хватит комментариев":/bad_words/.test(m)?"Без мата, пожалуйста":/no_links/.test(m)?"Ссылки нельзя":/captcha/.test(m)?"Не прошла проверка, попробуй ещё раз":"Не получилось, проверь интернет"}
function ago(t){var m=Math.floor((Date.now()-Date.parse(t))/6e4); return m<1?"сейчас":m<60?m+" мин":m<1440?Math.floor(m/60)+" ч":Math.floor(m/1440)+" д"}
function askNick(done){
  var sh=H("div","hw-ask"), d=H("form","hw-ask-d"); d.innerHTML='<b>Как тебя подписать?</b><p>Ник увидят в комментариях. 2–20 знаков: буквы, цифры, точка, подчёркивание.</p><input maxlength="20" required placeholder="Ник" aria-label="Ник"><div class="hw-ask-b"><button type="button" class="pp-btn">Отмена</button><button class="pp-btn pri">Готово</button></div>';
  sh.appendChild(d); root.appendChild(sh); var inp=d.querySelector("input"); setTimeout(function(){inp.focus()},50);
  d.querySelector('button[type="button"]').onclick=function(){sh.remove()};
  d.onsubmit=function(e){e.preventDefault(); var n=inp.value.trim(); if(!/^[A-Za-zА-Яа-яЁё0-9_.]{2,20}$/.test(n)){toast("Только буквы, цифры, точка и _ (2–20)"); return}
    SB.saveProfile(n,"🖤").then(function(){live.nick=n; sh.remove(); done()}).catch(function(e){toast(e&&e.code==="23505"?"Такой ник уже занят":err(e))})};
}
function toast(t){var x=H("div","pp-toast",t); root.appendChild(x); requestAnimationFrame(function(){x.classList.add("on")}); setTimeout(function(){x.classList.remove("on"); setTimeout(function(){x.remove()},300)},2400)}

function render(){
  if(!root||root.hidden) return;
  bar.innerHTML=""; body.innerHTML="";
  var back=H("button","pp-ic pp-back"); back.type="button"; back.innerHTML=ICON.back; back.setAttribute("aria-label",view==="feed"?"Назад к профилю":"Закрыть");
  back.onclick=function(){if(view==="feed"){view="grid"; render(); root.scrollTop=0} else close()}; bar.appendChild(back);
  var tt=H("div","pp-bar-t"); tt.innerHTML=view==="feed"?'<small>'+NICK+'</small><b>Публикации</b>':'<b>'+NICK+'</b> '+(open_()?"":ICON.lock); bar.appendChild(tt);
  var ex=H("button","pp-exit","к доске ✕"); ex.type="button"; ex.setAttribute("aria-label","Закрыть"); ex.onclick=close; bar.appendChild(ex);
  if(view==="feed"&&st.data) feed(); else profile();
  if(st.data) markKnown();
}
function open_(){return !!st.data}
/* уведомления подписчикам: какие посты человек уже видел */
var KK="sentfor_hw_known";
function known(){try{return JSON.parse(localStorage.getItem(KK)||"null")}catch(e){return null}}
function markKnown(){if(!st.data) return; try{localStorage.setItem(KK,JSON.stringify(posts().map(function(p){return p.id})))}catch(e){}}
function posts(){return st.data&&st.data.posts||[]}

function profile(){
  var w=H("div","pp-prof"), top=H("div","pp-top"), ring=H("div","pp-ring hw-ring"); var a=new Image(); a.src=AVA; a.alt=""; a.className="pp-av big"; ring.appendChild(a); top.appendChild(ring);
  var sts=H("div","pp-stats"); [[open_()?posts().length:POSTS_N,"публикации"],[20+fol,"подписчики"],[0,"подписки"]].forEach(function(s){var d=H("div"); d.innerHTML="<b>"+s[0]+"</b><span>"+s[1]+"</span>"; sts.appendChild(d)}); top.appendChild(sts); w.appendChild(top);
  var bio=H("div","pp-bio"); bio.innerHTML='<b>Натаниэль Говард</b><span class="pp-cat">Генеральный директор</span><button type="button" class="pp-loc pp-locbtn hw-corp">🏢 Корпорация «Уорлок»</button><br>Время работает на меня ⌛';
  bio.querySelector(".hw-corp").onclick=function(){if(window.SFmapAllowed&&SFmapAllowed()&&window.SFmapOpen){close(); setTimeout(function(){SFmapOpen("lab")},60)} else toast("Карта откроется, когда дочитаешь до 19-й серии 🗺")};
  w.appendChild(bio);
  if(st.admin) w.appendChild(adminBox());
  if(open_()){
    var btns=H("div","pp-btns"), f=H("button","pp-btn",st.admin?"Ваш аккаунт 🤫":"Вы подписаны"), m=H("button","pp-btn","Сообщение"); f.type=m.type="button";
    m.onclick=function(){toast("Говард не читает сообщения. Вообще.")}; btns.appendChild(f); btns.appendChild(m); w.appendChild(btns);
    var hls=st.data.hl||[]; if(hls.length){var hl=H("div","pp-hl");
      hls.forEach(function(h){var b=H("button","pp-hl-i"); b.type="button"; var c=H("span","pp-hl-c"), im=new Image(); im.src="img/x/"+h.cover+".webp"; im.alt=""; im.className="pp-av pp-hl-img"; c.appendChild(im); b.appendChild(c); b.appendChild(H("span","pp-hl-n",h.n)); b.onclick=function(){story(h)}; hl.appendChild(b)});
      w.appendChild(hl)}
    var tabs=H("div","pp-tabs"), gt=H("span","pp-tab on"); gt.innerHTML=ICON.grid; tabs.appendChild(gt); w.appendChild(tabs);
    var g=H("div","pp-grid"); posts().forEach(function(p){var b=H("button","pp-cell"); b.type="button"; b.setAttribute("aria-label","Открыть пост");
      var i=new Image(); i.loading="lazy"; i.src="img/x/"+p.img[0][0]+".webp"; i.alt=""; i.style.objectPosition=(p.img[0][2]||50)+"% "+(p.img[0][1]||30)+"%"; b.appendChild(i);
      if(p.img.length>1){var mi=H("span","pp-multi"); mi.innerHTML=ICON.multi; b.appendChild(mi)}
      b.onclick=function(){view="feed"; feedAt=p.id; render()}; g.appendChild(b)}); w.appendChild(g);
  } else if(st.loading||((st.admin||st.status==="ok")&&!st.data)){var ld=H("div","hw-load"); ld.innerHTML="<i></i><i></i><i></i>"; w.appendChild(ld)}
  else w.appendChild(lockBox());
  body.appendChild(w);
}
function lockBox(){
  var box=H("div","hw-lock");
  box.innerHTML='<div class="hw-lock-ic">'+ICON.lock+'</div><b>Это закрытый аккаунт</b><span>Подпишитесь, чтобы видеть фото и видео.</span>';
  if(st.loading){box.appendChild(H("p","hw-lock-n","Проверяю…")); return box}
  if(!window.SB||!SB.on){box.appendChild(H("p","hw-lock-n","Сейчас заявки не принимаются.")); return box}
  if(st.status==="new"||st.status==="no"){
    var w=H("button","pp-btn hw-req wait","Запрос отправлен"); w.type="button"; w.onclick=function(){toast("Ждём, пока владелец аккаунта одобрит 🕰")}; box.appendChild(w);
    var c=H("button","hw-cancel","Отменить запрос"); c.type="button"; c.onclick=cancelReq; box.appendChild(c);
    return box;
  }
  var b=H("button","pp-btn pri hw-req","Запросить доступ"); b.type="button"; b.onclick=ask; box.appendChild(b);
  return box;
}
function cancelReq(){
  if(!confirm("Отменить запрос? Можно будет отправить заново.")) return;
  var u=window.SB&&SB.user&&SB.user(); if(!u){st.status=null; render(); return}
  fetchJ("hw_follow?user_id=eq."+u.id,{method:"DELETE"}).then(function(){st.status=null; render(); toast("Запрос отменён")})
    .catch(function(e){toast("Не получилось: "+(e.message||"ошибка сети"))});
}
function ask(){
  var sh=H("div","hw-ask"), d=H("form","hw-ask-d"); d.innerHTML='<b>Запрос на подписку</b><p>Как тебя зовут? Это имя увидит владелец аккаунта, чтобы понять, кто ты.</p><input maxlength="40" required placeholder="Имя или ник" aria-label="Имя или ник"><div class="hw-ask-b"><button type="button" class="pp-btn">Отмена</button><button class="pp-btn pri">Отправить</button></div>';
  sh.appendChild(d); root.appendChild(sh); var inp=d.querySelector("input"); setTimeout(function(){inp.focus()},50);
  d.querySelector('button[type="button"]').onclick=function(){sh.remove()};
  d.onsubmit=function(e){e.preventDefault(); var n=inp.value.trim().slice(0,40); if(!n) return; var go=d.querySelector(".pri"); go.disabled=true; go.textContent="Отправляю…";
    SB.ensure().then(function(){return fetchJ("hw_follow",{method:"POST",prefer:"resolution=ignore-duplicates,return=minimal",body:{nick:n}})}).then(function(){st.status="new"; sh.remove(); render(); toast("Запрос отправлен")})
      .catch(function(e){go.disabled=false; go.textContent="Отправить"; toast("Не получилось: "+(e.message||"ошибка сети"))})};
}
function adminBox(){
  var w=H("div","hw-adm"), nw=st.reqs.filter(function(r){return r.status==="new"}), ok=st.reqs.filter(function(r){return r.status==="ok"});
  w.appendChild(H("b","hw-adm-h","Заявки"+(nw.length?" · "+nw.length:"")));
  if(!nw.length) w.appendChild(H("p","hw-adm-e","Новых заявок нет"));
  nw.forEach(function(r){var row=H("div","hw-adm-r"); row.appendChild(H("span","hw-adm-n",r.nick)); row.appendChild(H("small",null,new Date(r.created_at).toLocaleString("ru-RU",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})));
    var y=H("button","pp-btn pri","Одобрить"), n=H("button","pp-btn","Отклонить"); y.type=n.type="button"; y.onclick=function(){setReq(r.user_id,"ok")}; n.onclick=function(){setReq(r.user_id,"no")};
    row.appendChild(y); row.appendChild(n); w.appendChild(row)});
  /* одобренные — всегда на виду; отклонённые — свёрнуты, их можно одобрить или удалить */
  var no=st.reqs.filter(function(r){return r.status==="no"});
  function when(r){return new Date(r.created_at).toLocaleString("ru-RU",{day:"numeric",month:"short"})}
  w.appendChild(H("b","hw-adm-h hw-adm-h2","Одобрены · "+ok.length));
  if(!ok.length) w.appendChild(H("p","hw-adm-e","Пока никого"));
  ok.forEach(function(r){var row=H("div","hw-adm-r"); row.appendChild(H("span","hw-adm-n","✓ "+r.nick)); row.appendChild(H("small",null,"заявка от "+when(r)));
    var x=H("button","pp-btn","Убрать"); x.type="button"; x.onclick=function(){if(confirm("Убрать доступ у «"+r.nick+"»?")) setReq(r.user_id,null)}; row.appendChild(x); w.appendChild(row)});
  if(no.length){var dt=H("details","hw-adm-ok"); dt.appendChild(H("summary",null,"Отклонены · "+no.length));
    no.forEach(function(r){var row=H("div","hw-adm-r"); row.appendChild(H("span","hw-adm-n",r.nick)); row.appendChild(H("small",null,"заявка от "+when(r)));
      var y=H("button","pp-btn pri","Одобрить"), x=H("button","pp-btn","Удалить"); y.type=x.type="button"; y.onclick=function(){setReq(r.user_id,"ok")}; x.onclick=function(){if(confirm("Удалить заявку «"+r.nick+"»? Человек сможет отправить новую.")) setReq(r.user_id,null)};
      row.appendChild(y); row.appendChild(x); dt.appendChild(row)}); w.appendChild(dt)}
  return w;
}
/* актуальное: просмотр как у Поппи (стили общие) */
var st0=null, snd=true;
function stClose(){if(!st0) return; st0.stop(); document.removeEventListener("keydown",st0.key,true); st0.ov.remove(); st0=null}
function story(h){
  var fr=h.fr||[]; if(!fr.length) return; stClose();
  var ov=H("div","pp-st"), frame=H("div","pp-st-f"), bars=H("div","pp-st-bars"), hd=H("div","pp-st-h"), stage=H("div","pp-st-stage");
  fr.forEach(function(){var b=H("i"); b.appendChild(H("b")); bars.appendChild(b)});
  var av=new Image(); av.src=AVA; av.alt=""; av.className="pp-av"; hd.appendChild(av); var hn=H("span","pp-st-n"); hn.innerHTML="<b>"+NICK+"</b> <small>"+esc(h.n)+"</small>"; hd.appendChild(hn);
  var x=H("button","pp-st-x","✕"); x.type="button"; x.setAttribute("aria-label","Закрыть историю"); hd.appendChild(x);
  frame.appendChild(stage); frame.appendChild(bars); frame.appendChild(hd); ov.appendChild(frame); root.appendChild(ov);
  var i=0, t0=0, el=0, dur=5000, raf=0, paused=false, ready=false, curV=null;
  st0={ov:ov,stop:function(){cancelAnimationFrame(raf); if(curV){try{curV.pause()}catch(e){}}}};
  function fwd(){if(i<fr.length-1) show(i+1); else stClose()}
  function bck(){show(Math.max(0,i-1))}
  function show(n){
    i=n; el=0; ready=false; if(curV){try{curV.pause()}catch(e){} curV=null} stage.innerHTML="";
    [].forEach.call(bars.children,function(b,j){b.firstChild.style.width=j<i?"100%":"0%"});
    var f=fr[i];
    if(f.img){
      var bg=new Image(); bg.className="pp-st-bg"; bg.src="img/x/"+f.img+".webp"; bg.alt=""; stage.appendChild(bg);
      var im=new Image(); im.className="pp-st-img"; im.src="img/x/"+f.img+".webp"; im.alt=""; stage.appendChild(im);
      var go=function(){ready=true; t0=performance.now()}; if(im.complete&&im.naturalWidth) go(); else {im.onload=go; im.onerror=go}
    } else if(f.vid){
      var vd=document.createElement("video"); vd.className="pp-st-vid"; vd.playsInline=true; vd.setAttribute("playsinline",""); vd.preload="auto"; vd.poster="img/x/"+f.vid+".webp"; ["mp4","webm"].forEach(function(t){var so=document.createElement("source"); so.src="video/x/"+f.vid+"."+t; so.type="video/"+t; vd.appendChild(so)});
      stage.appendChild(vd); curV=vd;
      var sb=H("button","pp-st-snd"); sb.type="button"; function paintS(){sb.textContent=vd.muted?"🔇 включить звук":"🔊"}
      sb.onclick=function(e){e.stopPropagation(); vd.muted=!vd.muted; snd=!vd.muted; paintS(); if(vd.paused&&!paused){var q=vd.play(); if(q&&q.catch) q.catch(function(){})}};
      stage.appendChild(sb); vd.muted=!snd; paintS();
      vd.addEventListener("playing",function(){ready=true});
      vd.addEventListener("ended",function(){if(curV===vd) fwd()});
      vd.addEventListener("error",function(){ready=true; t0=performance.now()},true);
      var pp=vd.play(); if(pp&&pp.catch) pp.catch(function(){vd.muted=true; paintS(); var q=vd.play(); if(q&&q.catch) q.catch(function(){ready=true; t0=performance.now()})});
    }
    if(f.txt) stage.appendChild(H("div","pp-st-txt",f.txt));
  }
  function tick(now){
    raf=requestAnimationFrame(tick);
    if(curV&&curV.duration&&!curV.error){
      if(paused){if(!curV.paused) curV.pause(); return}
      if(curV.paused&&!curV.ended&&ready){var q=curV.play(); if(q&&q.catch) q.catch(function(){})}
      bars.children[i].firstChild.style.width=(Math.min(1,curV.currentTime/curV.duration)*100)+"%"; return}
    if(!ready||paused){t0=now-el; return}
    el=now-t0; var k=Math.min(1,el/dur); bars.children[i].firstChild.style.width=(k*100)+"%"; if(k>=1) fwd();
  }
  show(0); raf=requestAnimationFrame(tick);
  var sx=0, sy=0, down=0, moved=false;
  frame.addEventListener("pointerdown",function(e){if(e.target.closest(".pp-st-x,.pp-st-snd")) return; sx=e.clientX; sy=e.clientY; down=Date.now(); moved=false; paused=true});
  frame.addEventListener("pointermove",function(e){if(!down) return; var dy=e.clientY-sy; if(dy>10){moved=true; frame.style.transform="translateY("+dy+"px)"; frame.style.opacity=String(Math.max(.4,1-dy/500))}});
  frame.addEventListener("pointerup",function(e){if(!down) return; var dy=e.clientY-sy, held=Date.now()-down; down=0; paused=false; frame.style.transform=""; frame.style.opacity="";
    if(dy>90){stClose(); return} if(moved||held>250) return;
    var r=frame.getBoundingClientRect(); if(e.clientX-r.left<r.width*.33) bck(); else fwd()});
  frame.addEventListener("pointercancel",function(){down=0; paused=false; frame.style.transform=""; frame.style.opacity=""});
  x.onclick=function(e){e.stopPropagation(); stClose()};
  st0.key=function(e){if(e.key==="Escape"){e.stopPropagation(); e.preventDefault(); stClose()} else if(e.key==="ArrowRight") fwd(); else if(e.key==="ArrowLeft") bck()};
  document.addEventListener("keydown",st0.key,true);
}
function feed(){
  var w=H("div","pp-feed"), target=null;
  posts().forEach(function(p){var a=post(p); w.appendChild(a); if(p.id===feedAt) target=a});
  body.appendChild(w); if(target) requestAnimationFrame(function(){root.scrollTop=target.offsetTop-bar.offsetHeight});
}
function post(p){
  var a=H("article","pp-post"), hd=H("header","pp-ph"), av=new Image(); av.src=AVA; av.alt=""; av.className="pp-av"; hd.appendChild(av);
  var nm=H("div","pp-ph-t"); nm.innerHTML="<b>"+NICK+"</b>"; hd.appendChild(nm); a.appendChild(hd);
  var media=H("div","pp-media"), track=H("div","pp-track"), dots=null;
  p.img.forEach(function(x,i){var s=H("div","pp-slide"), im=new Image(); im.src="img/x/"+x[0]+".webp"; im.alt=""; im.loading=i?"lazy":"eager"; im.style.objectPosition=(x[2]||50)+"% "+(x[1]||30)+"%"; s.appendChild(im); track.appendChild(s)});
  var burst=H("div","hw-burst"); burst.innerHTML=HEARTF; media.appendChild(burst);
  if(p.img.length>1){
    var cnt=H("span","pp-cnt","1/"+p.img.length); media.appendChild(cnt);
    dots=H("div","pp-dots"); p.img.forEach(function(_,i){dots.appendChild(H("i",i?"":"on"))});
    track.addEventListener("scroll",function(){var i=Math.round(track.scrollLeft/track.clientWidth); cnt.textContent=(i+1)+"/"+p.img.length; [].forEach.call(dots.children,function(d,j){d.className=j===i?"on":""})},{passive:true});
    var pv=H("button","pp-nav l","‹"), nx=H("button","pp-nav r","›"); pv.type=nx.type="button"; pv.setAttribute("aria-label","Предыдущее фото"); nx.setAttribute("aria-label","Следующее фото");
    pv.onclick=function(){track.scrollBy({left:-track.clientWidth,behavior:"smooth"})}; nx.onclick=function(){track.scrollBy({left:track.clientWidth,behavior:"smooth"})};
    media.appendChild(pv); media.appendChild(nx);
  }
  media.appendChild(track); a.appendChild(media); if(dots) a.appendChild(dots);
  var act=H("div","pp-act"), lb=H("button","pp-ic pp-like"); lb.type="button";
  var cb=H("button","pp-ic"); cb.type="button"; cb.innerHTML=ICON.com; cb.setAttribute("aria-label","Комментировать");
  var lk=H("div","pp-likes"), id=pid(p);
  function paint(){var on=!!live.mine[id], n=(p.likes||0)+(live.counts[id]||0); lb.innerHTML=on?HEARTF:ICON.heart; lb.classList.toggle("on",on); lb.setAttribute("aria-label",on?"Убрать лайк":"Нравится"); lk.innerHTML=n?"Нравится: <b>"+n.toLocaleString("ru-RU")+"</b>":"Будьте первым, кому это понравится"}
  function setLike(v){var was=!!live.mine[id]; if(was===v) return; if(v){live.mine[id]=1; live.counts[id]=(live.counts[id]||0)+1} else {delete live.mine[id]; live.counts[id]=Math.max(0,(live.counts[id]||1)-1)} paint();
    (v?SB.like(id):SB.unlike(id)).catch(function(e){if(was){live.mine[id]=1; live.counts[id]=(live.counts[id]||0)+1} else {delete live.mine[id]; live.counts[id]=Math.max(0,(live.counts[id]||1)-1)} paint(); toast(err(e))})}
  lb.onclick=function(){setLike(!live.mine[id])};
  var lastTap=0; media.addEventListener("click",function(e){if(e.target.closest(".pp-nav")) return; var t=Date.now(); if(t-lastTap<320){setLike(true); burst.classList.remove("go"); void burst.offsetWidth; burst.classList.add("go")} lastTap=t});
  paint(); act.appendChild(lb); act.appendChild(cb); a.appendChild(act); a.appendChild(lk);
  var cap=H("p","pp-cap"); cap.innerHTML="<b>"+NICK+"</b> "+esc(p.t); a.appendChild(cap);
  if(p.by){var by=document.createElement("a"); by.className="pp-by"; by.href=p.by[1]||"#"; by.target="_blank"; by.rel="noopener"; by.textContent="📸 made by @"+p.by[0]; if(!p.by[1]) by.removeAttribute("href"); a.appendChild(by)}
  var cl=H("div","pp-coms"), replyTo=null; a.appendChild(cl);
  var f=H("form","hw-cf"), inp=H("input"); inp.maxLength=300; inp.setAttribute("aria-label","Комментарий");
  var go=H("button",null,"Опубликовать"); f.appendChild(inp); f.appendChild(go);
  function ph(){inp.placeholder=st.admin?"Ответить как "+NICK+"…":"Добавьте комментарий…"} ph();
  function upd(c,patch){SB.setComment(c.id,patch).then(function(){for(var k in patch) c[k]=patch[k]; paintC()}).catch(function(e){toast(err(e))})}
  /* одна строка комментария: ответить всем; админу — ❤️ от Говарда; удалить своё (админ — любое) */
  function line(c,isReply){
    var me=c.as_who==="howard", row=H("div","pp-com"+(isReply?" reply":""));
    if(me){var im=new Image(); im.src=AVA; im.alt=""; im.className="pp-av"; row.appendChild(im)} else row.appendChild(H("span","hw-ava",c.ava||"🖤"));
    var name=me?NICK:(c.nick||"гость"), t=H("span");
    t.innerHTML="<b>"+esc(name)+"</b> "+esc(c.body)+(c.hearted?'<span class="hw-hearted">🖤 от Говарда</span>':"");
    var meta=H("small","hw-cmeta"); meta.appendChild(H("span",null,ago(c.created_at)));
    function btn(lbl,fn,cls){var b=H("button","hw-cbtn"+(cls?" "+cls:""),lbl); b.type="button"; b.onclick=function(e){e.stopPropagation(); fn()}; meta.appendChild(b)}
    btn("Ответить",function(){replyTo=c.reply_to||c.id; inp.value="@"+name+" "; inp.focus()});
    if(st.admin&&!me) btn(c.hearted?"Убрать 🖤":"🖤",function(){upd(c,{hearted:!c.hearted})});
    if(st.admin||c.user_id===live.me) btn("Удалить",function(){if(!confirm("Удалить комментарий?")) return; SB.delComment(c.id).then(function(){live.coms[id]=(live.coms[id]||[]).filter(function(y){return y.id!==c.id&&y.reply_to!==c.id}); paintC()}).catch(function(e){toast(err(e))})},"warn");
    t.appendChild(meta); row.appendChild(t); cl.appendChild(row)}
  function paintC(){cl.innerHTML=""; var list=live.coms[id]||[];
    list.filter(function(c){return !c.reply_to||!list.some(function(x){return x.id===c.reply_to})}).forEach(function(c){
      line(c,false); list.filter(function(x){return x.reply_to===c.id}).forEach(function(x){line(x,true)})})}
  paintC(); a.appendChild(f);
  cb.onclick=function(){inp.focus()};
  inp.oninput=function(){if(!inp.value) replyTo=null};
  f.onsubmit=function(e){e.preventDefault(); var v=inp.value.trim(); if(!v) return;
    var send=function(){go.disabled=true; var c={post_id:id,body:v,ep:(window.SF&&SF.read)||1}; if(replyTo) c.reply_to=replyTo; if(st.admin) c.as_who="howard";
      SB.addComment(c).then(function(r){go.disabled=false; inp.value=""; replyTo=null; if(r){r.nick=live.nick; r.ava=r.ava||"🖤"; (live.coms[id]=live.coms[id]||[]).push(r)} paintC()}).catch(function(e){go.disabled=false; toast(err(e))})};
    if(st.admin||live.nick) send(); else askNick(send)};
  if(p.d) a.appendChild(H("p","pp-time",p.d));
  return a;
}
})();
