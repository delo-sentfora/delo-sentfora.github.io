/* Телефон Сидни: её Телеграм-канал, который постепенно «портится» */
(function(){
var URL0="https://t.me/sidneyWwW";
/* ссылка на пост: на английской версии — английский канал (там своя нумерация) */
function TG(ru,en){return window.SFLANG==="en"?"https://t.me/sydneywhitley"+(en?"/"+en:""):URL0+(ru?"/"+ru:"")}
/* st: 0 обычный, 1 тревога, 2 сбой, 3 не она */
var POSTS=[
 {d:"7 марта",t:"02:10",st:0,txt:"Мне снова звонили из Insight. Хотят, чтобы я снялась в их документалке о деле сенатора и его «прачечных» для грязных денег. Смешно. Они хотят похоронить эту историю в красивом монтаже, будто это финал моей карьеры.\n\nЯ журналист, а не телезвезда. Моё место в пыльных архивах, а не под софитами. Я не собираюсь почивать на лаврах. Прямо сейчас просматриваю отчёты по застройке северного сектора города. Там что-то не сходится... Чувствую, запах гари будет посильнее, чем в прошлый раз.",r:[["✍","1.1K"],["❤","469"],["👨‍💻","213"],["🤔","111"]],v:"32.7K"},
 {t:"10:25",st:0,txt:"Странно 🤔 Пыталась найти информацию об исследованиях старого города, но все муниципальные архивы заблокированы «по техническим причинам».\nЗаехала туда лично. Охрана выставила меня через пять минут, хотя у меня было разрешение. Пока шла к машине, поймала себя на мысли, что воздух имеет какой-то... сладкий привкус. И тишина стоит. В этом лесу даже птицы не поют. Возможно, просто паранойя после бессонной ночи 😴",r:[["✍","906"],["🤔","347"],["❤","280"],["👨‍💻","116"]],v:"33.3K"},
 {d:"8 марта",t:"14:14",st:0,txt:"Окей, это уже не технический сбой. Мой информатор из мэрии перестал выходить на связь, а сегодня утром я обнаружила, что замок в мою квартиру пытались вскрыть.\n\nОни думают, что напугали меня 😡 Ошибка. Они меня раззадорили. Собрала сумку, диктофон, запасные аккумы и фотоаппарат. Выдвигаюсь в сторону старого коллектора. Если корпорация так усердно что-то прячет, значит, я обязана это найти.\nНа связь выйду завтра.\n\nНе скучайте ❤️",r:[["✍","962"],["❤","355"],["🤔","277"],["👨‍💻","117"]],v:"34.1K"},
 {d:"9 марта",t:"11:03",st:0,img:["img/sid_road.webp"],txt:"Отъехала подальше от центра. Знаете, а здесь красиво. Тишина такая, что уши закладывает. Только почему-то кажется, что из-за этих деревьев за тобой наблюдает сразу тысяча глаз 👀",r:[["✍","991"],["❤","532"],["👨‍💻","215"],["🤔","90"]],v:"36.2K"},
 {d:"11 марта",t:"00:48",st:1,img:["img/sid_files.webp"],txt:"Нашла подсобку в заброшенном здании. Весь пол завален личными делами. Это не документы, а школьные анкеты.\nПосмотрите на эти даты. Десятки подростков. Официально они числятся «переселенцами» или «пропавшими без вести». Но почему их фотографии здесь, в архивах корпорации, с пометками «непригоден», переехал и «**2»?\n\nМои руки трясутся, пока я это пишу.",r:[["✍","999"],["🤔","391"],["❤","322"],["👨‍💻","102"]],v:"40K",th:[["e-forms",11,"Анкеты «объектов» у Говарда"]]},
 {t:"04:54",st:1,img:["img/sid_drawing.webp"],txt:"Нашла папку с рисунками детей. Они не рисуют солнце и маму. Они рисуют ЕГО. Оно везде. На каждой странице. Странное нечто…",r:[["✍","1.08K"],["🤔","386"],["❤","316"],["👨‍💻","119"]],v:"42.5K",th:[["w-junk",5,"Существо на свалке, 1.05"]]},
 {t:"05:31",st:1,img:["img/sid_note1.webp","img/sid_note2.webp","img/sid_woman.webp"],txt:"Спускаюсь глубже. Нашла чей-то тайник в стене.\nРазбитые часы (стрелки замерли на <b>18:06</b>).\nОдинокий кед, испачканный чем-то чёрным и липким.\nБлокнот. С рисунками! 😨\n\n#ужасы",r:[["🤔","1.15K"],["❤","574"],["✍","248"],["👨‍💻","63"]],v:"42.4K",th:[["t-18-06-i-02-59-dve-minuty-sentfora",19,"Теория «18:06 и 02:59»"]]},
 {t:"18:29",st:1,media:"video",src:"video/sid-mirror.mp4",poster:"img/sid_p13.webp",txt:"Вчера мне показалось, что в отражении витрины за моей спиной стоял человек без лица. Когда я обернулась, не было никого. Кажется, я схожу с ума.",r:[["❤","1.63K"],["🤔","532"],["✍","295"],["👨‍💻","80"]],v:"53.4K",link:TG(13,14)},
 {d:"12 марта",t:"03:36",st:1,media:"voice",src:"audio/sid-voice.mp3",txt:"Пыталась заговорить с местными на заправке. Но хуже всего — я начала слышать гул. Низкий частотный шум, который идёт будто из-под земли. Или из моей головы?..",r:[["🤔","1.72K"],["❤","665"],["👨‍💻","274"],["✍","132"]],v:"52.6K",link:TG(14,15)},
 {t:"18:06",st:2,txt:"Я НАШЛА ЭТО.\nБоже, если я выберусь и опубликую всё… Это будет самая большая сенсация в истории журналистики. Весь город — это не город, это...\n\nЯ не могу здесь писать детали. Скажу только одно: всё, что нам рассказывали о прогрессе, — ложь, прикрывающая настоящий ад. Это будет мой триумф.",r:[["❤","2.06K"],["🤔","668"],["👨‍💻","341"],["✍","159"]],v:"46.4K",hot:1},
 {t:"23:06",st:2,img:["img/sid_p16.webp"],txt:"Меня привлекло сообщение от жителя данной территории.\n\nТерритория смерти — самая верная трактовка этой аббревиатуры. Тут всё пропитано смертью. Кругом кости, оставленные вещи…\n\nКажется, что это место медленно поглощает всё живое. Даже тишина здесь какая-то неправильная... тяжёлая, давящая... понимаете?",r:[["❤","1.72K"],["🤔","643"],["✍","339"],["👨‍💻","100"]],v:"70.9K",link:TG(16,18)},
 {d:"13 марта",t:"19:06",st:3,img:["img/sid_p17.webp"],txt:"Гул прекратился. Теперь я понимаю. Чёрная тень — это не враг.\n\nЯ тоже рисую теперь. Так гораздо понятнее, чем слова. Слова не правдивы. Глаза... повсюду должны быть глаза, чтобы видеть, как они приходят. 👁️ Спите спокойно, горожане. За вами уже присмотрели 🌺",r:[["❤","2.21K"],["🤔","799"],["👨‍💻","382"],["✍","173"]],v:"44.2K",link:TG(17,19)},
 {d:"14 марта",t:"16:57",st:3,img:["img/sid_p19.webp"],txt:"Я всё ещё в сознании, но этот запах и тот город… меня тянет туда постоянно...",r:[["❤","1.82K"],["🤔","572"],["👨‍💻","295"],["✍","146"]],v:"39.5K",link:TG(19,21)},
 {t:"18:35",st:3,hand:1,img:["img/sid_p20.webp"],txt:"Раз, два, три, четыре, пять\nЯ иду тебя искать.\nПо кусочкам, по следам,\nПо кровавым уголками.\nГде ты прячешься — ответь…\nЕсли есть чем прохрипеть.",r:[["❤","2.19K"],["🤔","637"],["✍","348"],["👨‍💻","87"]],v:"42.1K",link:TG(20,22),th:[["w-guilt",13,"Дети-тени со считалкой, 1.13"]]},
 {t:"19:08",st:3,big:1,txt:"Скоро увидимся 😈",r:[["❤","2.36K"],["🤔","549"],["👨‍💻","352"],["✍","157"]],v:"42.8K"},
 {d:"18 марта",t:"19:06",st:3,img:["img/sid_p22.webp"],txt:"Здесь так спокойно и безопасно. У меня есть всё, что нужно: удобная кровать, любимая камера и окно с прекрасным видом. Я могу уйти в любой момент, если захочу. Но пока... пока мне здесь слишком хорошо ❤️",r:[["❤","1.97K"],["🤔","1.02K"],["👨‍💻","366"],["✍","186"]],v:"38.8K",link:TG(22,24)},
 {d:"20 марта",t:"18:00",st:3,img:["img/sid_p24.webp"],dec:window.SFLANG==="en"?["Расшифровать цифры на столе",["19","01","09","14","20","06","14","20","17"],"SAINTFOUR","номер буквы в алфавите"]:["Расшифровать цифры на столе",["19","06","15","20","22","16","18"],"СЕНТФОР","номер буквы в алфавите"],txt:"Всё смешалось... Дни, ночи, запах… Не уверена, что помню, где я. Это комната в доме? Или всё это время я была в лесу?\nМысли... они не мои. Слишком громкие. Другие. Слишком много «других» голосов.\nВ голове цифры. Я не понимаю, что они значат. Как они могут помочь?\n\nЧувствую, что-то грядёт. Нечто очень... ужасное. Я... я не могу больше сидеть здесь и ждать. Больше не могу.",r:[["❤","1.7K"],["🤔","643"],["👨‍💻","284"],["✍","144"]],v:"77.1K",link:TG(24,26)},
 {d:"19 ноября",t:"19:30",st:3,morse:window.SFLANG==="en"?"HELP! THERE'S NO WAY OUT.":"ПОМОГИТЕ. ВЫХОДА НЕТ.",img:["img/sid_p25.webp"],txt:window.SFLANG==="en"?".... . .-.. .--. -.-.--\n- .... . .-. . .----. ...\n-. --- / .-- .- -.--\n--- ..- - .-.-.-":".--. --- -- --- --. .. - . ......\n.-- -.-- .... --- -.. .-\n-. . - ......",r:[["😱","1.2K"],["🤔","640"],["❤","410"],["✍","120"]],v:"31.4K",link:TG(0,27)},
 {d:"20 ноября",t:"17:19",st:2,last:1,img:["img/sid_p26.webp"],txt:"Простите за вчерашнее.\nНаверное, переутомилась, вот и мерещится всякое.\nЯ в порядке, правда. Просто… не высыпаюсь.",r:[["🤔","412"],["❤","180"],["🙏","96"]],v:"6.8K",link:TG(0,28)}
];
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&lt;(\/?)b&gt;/g,"<$1b>")}
function rd(){return (window.SF&&SF.read)||1}
var finT=0; function fin(){if(!box||box.hidden||endShown) return; endShown=true; finale()}
var box=null, feed=null, lastF=null, glT=0, endShown=false, io=null;
function build(){
  box=H("div","sphone"); box.hidden=true; box.setAttribute("role","dialog"); box.setAttribute("aria-modal","true"); box.setAttribute("aria-label","Телефон Сидни Уитли");
  var ph=H("div","sp-phone"), bar=H("div","sp-status"); bar.innerHTML='<span class="sp-clock">18:06</span><span class="sp-ic" aria-hidden="true"><svg class="sp-net" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect class="off" x="10" y="3" width="3" height="9" rx=".8"/><rect class="off" x="15" y="0" width="3" height="12" rx=".8"/></svg><svg class="sp-bat" viewBox="0 0 27 13"><rect x=".6" y=".6" width="22.8" height="11.8" rx="3.4" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2"/><rect x="24.6" y="4.2" width="1.8" height="4.6" rx=".9" fill="currentColor" fill-opacity=".45"/><rect class="lvl" x="2.4" y="2.4" width="3.6" height="8.2" rx="1.6"/></svg></span>'; ph.appendChild(bar);
  var hd=H("div","sp-head"), back=H("button","sp-back","‹"); back.type="button"; back.setAttribute("aria-label","Закрыть телефон"); back.onclick=close; hd.appendChild(back);
  var av=H("img","sp-av"); av.src="img/sidney.webp"; av.alt=""; hd.appendChild(av);
  var nm=H("div","sp-name"); nm.appendChild(H("b","","Сидни Уитли ✍🏽")); nm.appendChild(H("span","","8 986 подписчиков")); hd.appendChild(nm); ph.appendChild(hd);
  feed=H("div","sp-feed"); feed.appendChild(H("div","sp-sys","Канал создан · 16 февраля"));
  POSTS.forEach(function(p,i){
    if(p.d) feed.appendChild(H("div","sp-date",p.d));
    var m=H("div","sp-msg st"+p.st+(p.hand?" hand":"")+(p.big?" big":"")+(p.last?" last":"")); m.dataset.i=i;
    if(p.img){var g=H("div","sp-imgs n"+p.img.length); p.img.forEach(function(s){var im=H("img"); im.loading="lazy"; im.src=s; im.alt="";  g.appendChild(im)}); m.appendChild(g)}
    if(p.media==="video"){var vd=H("video","sp-video"); vd.src=p.src; vd.poster=p.poster; vd.controls=true; vd.preload="none"; vd.playsInline=true; vd.setAttribute("playsinline",""); vd.setAttribute("webkit-playsinline",""); m.appendChild(vd)}
    if(p.media==="voice") m.appendChild(voice(p.src));
    var tx=H("div","sp-txt"+(p.morse?" morse":"")); tx.innerHTML=esc(p.txt).replace(/\n/g,"<br>"); m.appendChild(tx);
    if(p.dec){var db=H("button","sp-morse",p.dec[0]); db.type="button"; db.onclick=function(){var r=H("div","sp-morse-r dec"); var g=H("div","sp-dec"); p.dec[1].forEach(function(n,k){var c=H("span"); c.appendChild(H("i","",n)); c.appendChild(H("b","",p.dec[2][k])); g.appendChild(c)}); r.appendChild(g); r.appendChild(H("small","",p.dec[3])); db.replaceWith(r)}; m.appendChild(db)}
    if(p.morse){var mb=H("button","sp-morse","Расшифровать"); mb.type="button"; mb.onclick=function(){var r=H("div","sp-morse-r",p.morse); mb.replaceWith(r); if(!feed.querySelector(".sp-morse")&&feed.querySelector(".sp-msg.last.seen")){clearTimeout(finT); finT=setTimeout(fin,3500)}}; m.appendChild(mb)}
    if(p.th){p.th.forEach(function(t){if(rd()<t[1]) return; var a=H("a","jump sp-thread","↳ "+t[2]); a.href="#"+t[0]; a.setAttribute("data-jump",t[0]); m.appendChild(a)})}
    var ft=H("div","sp-foot"), rs=H("div","sp-reacts"); p.r.forEach(function(r){rs.appendChild(H("span","",r[0]+" "+r[1]))}); ft.appendChild(rs);
    ft.appendChild(H("span","sp-meta","👁 "+p.v+" · "+p.t)); m.appendChild(ft);
    if(p.link){var l=H("a","sp-orig","пост в канале ↗"); l.href=p.link; l.target="_blank"; l.rel="noopener"; m.appendChild(l)}
    feed.appendChild(m)});
  ph.appendChild(feed);
  var end=H("div","sp-end"); end.appendChild(H("b","","18:06")); end.appendChild(H("span","","нет сети")); ph.appendChild(end);
  box.appendChild(ph); document.body.appendChild(box);
  box.addEventListener("click",function(e){if(e.target===box) close(); if(e.target.closest&&e.target.closest("a.jump")) close()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&box&&!box.hidden) close()});
  /* чем ниже, тем сильнее помехи */
  feed.addEventListener("scroll",function(){var k=feed.scrollTop/Math.max(1,feed.scrollHeight-feed.clientHeight); box.style.setProperty("--rot",k.toFixed(3)); box.classList.toggle("sick",k>.62)},{passive:true});
  if("IntersectionObserver" in window){
    io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("seen"); if(e.target.classList.contains("last")&&!endShown){var mo=feed.querySelector(".sp-morse"); clearTimeout(finT); finT=setTimeout(fin,mo?12000:1800)}}})},{root:feed,threshold:.6});
    feed.querySelectorAll(".sp-msg").forEach(function(m){io.observe(m)})}
}
/* буквы в «сломанных» постах на миг подменяются */
var GL="▓░▒█▄▀#%&@¿¡ʘ◉";
function glitchTick(){
  if(!box||box.hidden||RM) return;
  var cand=[].slice.call(feed.querySelectorAll(".sp-msg.st2.seen .sp-txt,.sp-msg.st3.seen .sp-txt")); if(!cand.length) return;
  var el=cand[Math.random()*cand.length|0], orig=el.innerHTML, nodes=[], w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false), n;
  while((n=w.nextNode())) if(n.nodeValue.trim().length>3) nodes.push(n);
  if(!nodes.length) return; var nd=nodes[Math.random()*nodes.length|0], s=nd.nodeValue, out="";
  for(var i=0;i<s.length;i++) out+=(s[i]!==" "&&Math.random()<.18)?GL[Math.random()*GL.length|0]:s[i];
  nd.nodeValue=out; el.classList.add("jit"); setTimeout(function(){el.innerHTML=orig; el.classList.remove("jit")},140+Math.random()*120)}
function stopMedia(){if(box) box.querySelectorAll("video,audio").forEach(function(x){try{x.pause()}catch(e){}})}
function finale(){
  stopMedia(); box.classList.add("dead");
  setTimeout(function(){close(); box.classList.remove("dead"); if(window.SFegg) setTimeout(function(){window.SFegg("sidphone")},250)},RM?900:2600)}
/* голосовое: своя кнопка и полоска, как в Телеграме */
function voice(src){
  var w=H("div","sp-media voice"), b=H("button","pl","▶"), wv=H("span","wave"), tm=H("span","tm","0:11"), a=new Audio(); a.preload="none"; a.src=src;
  "123566679777977776777666776667565755454433".split("").forEach(function(h){var i=H("i"); i.style.height=(18+h*9)+"%"; wv.appendChild(i)});
  b.type="button"; b.setAttribute("aria-label","Слушать голосовое");
  function fmt(x){x=Math.max(0,Math.round(x)); return Math.floor(x/60)+":"+("0"+x%60).slice(-2)}
  b.onclick=function(){if(a.paused){stopMedia(); a.play()} else a.pause()};
  a.onplay=function(){b.textContent="❚❚"; w.classList.add("on")}; a.onpause=function(){b.textContent="▶"; w.classList.remove("on")};
  a.ontimeupdate=function(){var d=a.duration||11; var k=Math.round(a.currentTime/d*42); [].forEach.call(wv.children,function(x,j){x.classList.toggle("p",j<k)}); tm.textContent=fmt(d-a.currentTime)};
  a.onended=function(){[].forEach.call(wv.children,function(x){x.classList.remove("p")}); tm.textContent="0:11"};
  w.appendChild(b); w.appendChild(wv); w.appendChild(tm); w.appendChild(a); return w}
function open(){
  if(window.SFclose) window.SFclose(); if(!box) build(); lastF=document.activeElement;
  box.hidden=false; document.body.classList.add("noscroll"); feed.scrollTop=0; box.style.setProperty("--rot",0); box.classList.remove("sick","dead"); endShown=false;
  clearInterval(glT); glT=setInterval(glitchTick,650); box.querySelector(".sp-back").focus()}
function close(){if(!box||box.hidden) return; clearTimeout(finT); stopMedia(); box.hidden=true; clearInterval(glT); document.body.classList.remove("noscroll"); if(lastF&&lastF.focus) lastF.focus()}
window.SFphone=open;
})();
