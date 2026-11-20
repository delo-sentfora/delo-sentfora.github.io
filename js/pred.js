/* Прогнозы к обновлению (серии 20–23): ставки на сюжет, проценты других читателей, карточка для сторис.
   Ответы — в localStorage sentfor_pred и в Supabase (таблица preds, supabase/pred.sql).
   После выхода серий заполнить RES: {id вопроса: [ключи верных вариантов]} — появится «угадано N из M». */
(function(){
var CLOSE=Date.UTC(2026,10,21,12,0,0);            /* сб 21 ноября 15:00 по Москве */
var SRC='<a href="https://t.me/ShadowsSaintfour" target="_blank" rel="noopener">«Чёрный морозник»</a>';
var RES={};                                        /* ← заполнить после обновы */
var Q=[
  {id:"split",s:"Как читать",em:"🧩",q:"Как читать 8 эмодзи?",o:[["pairs","По паре на серию: 📸😮‍💨 | 🔥😰 | 🔦📺 | ☠️🪦"],["acts","3 + 3 + 2: 📸😮‍💨🔥 | 😰🔦📺 | ☠️🪦"],["row","Подряд, одной историей на все 4 серии"],["cross","Крест-накрест: 📸↔📺, 🔥↔🔦, а ☠️🪦 — финал"]]},
  {id:"e1",s:"Кадр",em:"📸😮‍💨",q:"Что за кадр и что значит 😮‍💨?",src:"Мы думаем, что 😮‍💨 — выдох облегчения, а канал «Чёрный морозник» считает, что Надин наберётся сил. Решайте сами",o:[["see","Надин снимет доказательство и выдохнет: наконец ей поверят"],["shadow","Выдох облегчения, но на снимке окажется кто-то лишний"],["back","Новое фото со спины от Неизвестного"],["rest","Почти обычный день с друзьями и снимками, а потом что-то пойдёт не так"],["tired","Надин вымотана, еле держится, а камера ловит её видения"]]},
  {id:"e2",s:"Сгорит",em:"🔥😰",q:"Что сгорит?",src:"И канал «Чёрный морозник», и мы ставим на библиотеку: там архив и улики. Но огонь может добраться и до того, что Надин сняла",o:[["lib","Библиотека с архивом"],["photos","Снимки и улики Надин, которые она только что добыла (связь 📸 → 🔥)"],["red","Редакция и доска расследования"],["old","Что-то в Старом Сентфоре"],["vis","Огонь будет только в видении"]]},
  {id:"e3",s:"Пойдут",em:"🔦📺",q:"Куда пойдут с фонариком?",src:"И канал «Чёрный морозник», и мы думаем, что в хижину Сары из ТС1: там стоит тот самый телевизор из угла, с которого начинается ТС2",o:[["sara","В хижину Сары в Старом Сентфоре, к тому самому телевизору"],["tower","В башню"],["forest","В лес, в мёртвую зону"],["dump","На свалку, где закопали Тома"]]},
  {id:"e4",s:"Могила",em:"☠️🪦",q:"Чья это могила?",src:"Канал «Чёрный морозник» думает, что это могила Надин или важного для сюжета героя. Мы — что Надин увидит свою смерть, а погибнет кто-то из второстепенных, возможно Эбигейл",o:[["nadin","Надин"],["abi","Эбигейл"],["side","Кого-то другого из второстепенных"],["vis","Ничья, это видение"]]},
  {id:"tol",s:"Правда",em:"🎲",q:"«Правда или ложь» от Клуба Романтики: что из этого правда?",src:"Из официального канала Клуба Романтики: правда только одно утверждение",take:[["past","Самое очевидное, и как раз поэтому может быть ловушкой. КР любит прятать правду среди логичных вариантов, но с 🔦📺 и хижиной Сары из ТС1 сходится хорошо."],["stop","Самое фантастическое. Похоже на приманку для тех, кто верит в теории про время."],["push","Очень правдоподобно (холод, видения), Надин всё больше скрывает, а ещё сходится с ☠️🪦: перед бедой героиня часто остаётся одна. Второе место."],["curfew","Звучит скучно, но ставлю на него. В городе пропадают люди, у школы охрана «Уорлока», Говард уже говорил в предыдущих сериях, что ситуация повторяется. Комендантский час, как по мне, — логичный следующий шаг. И «странный вкус свободы» из описания 20-й серии про то же: свободу дадут и тут же отберут. Моя ставка."]],o:[["past","Надин снова попадёт в прошлое"],["stop","Время во всём мире для Надин и компании остановится"],["push","Надин оттолкнёт от себя близких"],["curfew","Школьникам разрешат выходить из дома только на занятия"]]},
  {id:"die",s:"Надин умрёт?",em:"🥶",q:"Надин умрёт?",ev:["«Холод рванул вверх по плечу и затопил грудную клетку. Стало нечем дышать.»","«А ещё ей было холодно… очень-очень холодно, будто провалилась под лёд.»"],o:[["yes","Да, по-настоящему"],["see","Увидит свою смерть, как Сара в ТС1"],["edge","Будет на грани, но выживет"],["vanish","Пропадёт, как Малкольм"],["time","Застрянет в другом времени"],["no","Нет, холод значит другое"]]},
  {id:"back86",s:"В прошлое?",em:"⏳",q:"Надин снова попадёт в прошлое?",o:[["y86","Да, опять в 1986-й"],["other","Да, но в другой год"],["future","Наоборот, в будущее"],["no","Нет, не в этой обнове"]]},
  {id:"tv",s:"Телевизор",em:"📺",q:"Что покажет тот самый телевизор?",o:[["sara","Сару и её друзей"],["self","Саму Надин"],["death","Смерть Надин"],["msg","Послание из будущего"]]},
  {id:"ghost",s:"Призрак Миранды",em:"👻",q:"Появится ли призрак Миранды?",o:[["talk","Да, и что-то скажет Надин"],["show","Да, но молча"],["photo","Только на снимке или записи"],["no","Нет"]]},
  {id:"ts1",s:"Из ТС1",em:"✨",q:"Кто из ТС1 появится в сериях 20–23?",o:[["sara","Сара"],["friends","Кто-то из друзей Сары"],["mask","Человек в маске"],["none","Никто, рано"]]},
  {id:"hall",s:"Хэллоуин",em:"🎃",q:"Будет ли Хэллоуин?",o:[["party","Да"],["mention","Только упомянут"],["no","Нет"]]},
  {id:"reveal",s:"Узнаем Неизвестного?",em:"❓",q:"Узнаем, кто Неизвестный?",o:[["full","Да, полностью"],["hint","Будет сильный намёк"],["face","Покажут, но не скажут кто"],["no","Нет, ещё рано"]]},
  {id:"unk",s:"Неизвестный",long:1,em:"📷",q:"Кто Неизвестный с фото со спины?",o:[["future","Надин из будущего"],["line","Надин из другой линии времени"],["mir","Миранда"],["shadow","Тень"]]},
  {id:"tape",s:"Кассета",long:1,em:"📼",q:"Кто подкинул кассету?",o:[["future","Надин из будущего"],["mir","Сама Миранда"],["knew","Тот, кто знал Миранду при жизни"]]}
];
/* раньше было тестом по ?pred; теперь открыто для всех */
var TK="sentfor_predtest"; try{if(/[?&]pred=0\b/.test(location.search)) localStorage.removeItem(TK); else if(/[?&]pred\b/.test(location.search)) localStorage.setItem(TK,"1")}catch(e){}
var ON=true; /* открыто для всех 19.11.2026 */
if(!ON){var tb=document.querySelector('.tab[data-tab="pred"]'), sc=document.getElementById("tab-pred"); if(tb) tb.remove(); if(sc) sc.remove(); return}
var root=document.getElementById("pred"); if(!root) return;
/* ?predreset — стереть свой прогноз в этом браузере (для тестов) */
try{if(/[?&]predreset\b/.test(location.search)) localStorage.removeItem("sentfor_pred")}catch(e){}
var K="sentfor_pred", A={}; try{A=JSON.parse(localStorage.getItem(K)||"{}")||{}}catch(e){}
var ST=null, sendT=0, sent="";
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function open(){return Date.now()<CLOSE}
function has(o){return Object.prototype.hasOwnProperty.call(RES,o)}
function nDone(){return Q.filter(function(q){return A[q.id]}).length}
function save(){try{localStorage.setItem(K,JSON.stringify(A))}catch(e){}}
function locked(){return !!A._done}
function pub(){var o={}; Q.forEach(function(q){if(A[q.id]) o[q.id]=A[q.id]}); return o}
var profOk=false;
/* в базу уходит только подтверждённый прогноз, один раз */
function push(){var s=JSON.stringify(pub()); if(!locked()||A._sent||s==="{}"||!window.SB||!open()||!nickOk()) return;
  (profOk?Promise.resolve():SB.saveProfile(me.nick,me.ava||"🔮").then(function(){profOk=true}))
    .then(function(){return SB.predSave(pub(),me.nick)}).then(function(){A._sent=1; save(); stats()})
    .catch(function(err){if(err&&(err.code==="23505"||err.status===409)){me=null; try{localStorage.removeItem(MK)}catch(_){} nickPaint(); nm.textContent="Этот ник уже занят другим человеком. Выбери другой, и прогноз отправится"}})}
function stats(){if(!window.SB) return; SB.predStats().then(function(r){ST={}; (r||[]).forEach(function(x){(ST[x.q]=ST[x.q]||{})[x.o]=x.n}); paint()}).catch(function(){})}

/* ---------- отсчёт ---------- */
function left(){var s=Math.max(0,Math.floor((CLOSE-Date.now())/1000)), d=Math.floor(s/86400), h=Math.floor(s%86400/3600), m=Math.floor(s%3600/60), x=s%60;
  return (d?d+" д ":"")+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0")}

/* ---------- разметка ---------- */
var head=H("div","pr-head"), clock=H("div","pr-clock"), prog=H("div","pr-prog");
head.appendChild(clock); head.appendChild(prog);
var list=H("div","pr-list"), foot=H("div","pr-foot");
var cardBtn=H("button","pr-card-btn","Моя карточка для сторис"); cardBtn.type="button"; cardBtn.onclick=makeCard;
var mineBox=H("div","pr-q pr-mine"); mineBox.innerHTML='<div class="pr-qt"><span class="pr-em">✍️</span><b>Твой главный прогноз</b></div>';
var ta=H("textarea","pr-ta"); ta.maxLength=140; ta.rows=2; ta.placeholder="Например: Надин сгорит в библиотеке, но её спасёт она же из будущего"; ta.value=A._mine||"";
ta.oninput=function(){if(!open()||locked()){ta.value=A._mine||""; return} if(!nickOk()){ta.value=""; needNick(null); return} A._mine=ta.value.trim().slice(0,140); if(!A._mine) delete A._mine; save(); paint()};
mineBox.appendChild(ta); mineBox.appendChild(H("small","pr-hint","Попадёт на карточку. Его видишь только ты"));
list.appendChild(mineBox);
var okBox=H("div","pr-confirm"), okBtn=H("button","pr-ok-btn","Подтвердить прогноз"), okMsg=H("p","pr-ok-msg"); okBtn.type="button";
okBox.appendChild(okBtn); okBox.appendChild(okMsg); foot.appendChild(okBox);
var sure=false;
okBtn.onclick=function(){if(!open()||locked()) return;
  if(!nickOk()){needNick(null); return}
  var miss=Q.filter(function(q){return !A[q.id]});
  if(miss.length){sure=false; okMsg.textContent="Осталось ответить: "+miss.length; var c=cards[miss[0].id]; c.scrollIntoView({behavior:"smooth",block:"center"}); c.classList.remove("pr-need"); void c.offsetWidth; c.classList.add("pr-need"); return}
  if(!sure){sure=true; okBtn.textContent="Да, подтверждаю"; okMsg.textContent="После подтверждения ответы поменять будет нельзя. Нажми ещё раз, чтобы подтвердить"; return}
  A._done=Date.now(); save(); push(); paint(); stats();
  okMsg.textContent=""; root.querySelector(".pr-head").scrollIntoView({behavior:"smooth",block:"start"})};
foot.appendChild(cardBtn); var srcP=H("p","pr-src"); srcP.innerHTML="Эмодзи-спойлер от сценаристки Анны — источник: тг-канал "+SRC; foot.appendChild(srcP);
root.appendChild(head); root.appendChild(list); root.appendChild(foot);

var spoilerHead=H("div","pr-sec"); spoilerHead.innerHTML='<b>Разгадай спойлер Анны</b><span class="pr-emoji">📸😮‍💨🔥😰🔦📺☠️🪦</span><small>8 эмодзи на 4 серии. Как их делить — тоже загадка. Спойлер впервые опубликовал тг-канал '+SRC+'</small>';
var takes=H("details","pr-takes"); takes.innerHTML='<summary>Как читать спойлер: разборы</summary>'+
  '<div class="pr-take"><b>Разбор тг-канала '+SRC+'</b>'+
  '<p>Канал делит эмодзи по паре на каждую серию и опирается на описание 20-й серии: «Жертва глотнула свободы. Но у свободы странный вкус».</p>'+
  '<div class="pr-ep"><i>20</i><span class="pr-epem">📸😮‍💨</span><p>Серия-передышка: Надин наберётся сил и проживёт почти обычный подростковый день. Но Тень никуда не денется. Фотоаппарат значит новые снимки с фаворитами или кадр, на котором окажется то, чего не видят остальные.</p></div>'+
  '<div class="pr-ep"><i>21</i><span class="pr-epem">🔥😰</span><p>Пожар. Первая мысль канала — библиотека: там архив, где ребята уже находили сведения. Сжечь — самый быстрый способ уничтожить улики без следа.</p></div>'+
  '<div class="pr-ep"><i>22</i><span class="pr-epem">🔦📺</span><p>Ребята снова пойдут в Старый Сентфор и найдут домик, где собиралась Сара с друзьями. Там стоит тот самый телевизор, который мы видим в начале каждой серии первого сезона.</p></div>'+
  '<div class="pr-ep"><i>23</i><span class="pr-epem">☠️🪦</span><p>Надин умрёт. Ей всё холоднее, её состояние резко меняется, она видит собственный труп и реалистичные галлюцинации и всё больше похожа на Малкольма. Сара в последней серии первого сезона ТС1 тоже увидела во сне место своей смерти. Запасной вариант: погибнет не фаворит, но важный для сюжета герой.</p></div>'+
  '</div>'+
  '<div class="pr-take"><b>Разбор автора сайта</b>'+
  '<p class="pr-sub">Если по паре на серию</p>'+'<div class="pr-split"><span>📸😮‍💨</span><span>🔥😰</span><span>🔦📺</span><span>☠️🪦</span></div>'+
  '<div class="pr-ep"><i>20</i><span class="pr-epem">📸😮‍💨</span><p>Для меня 😮‍💨 — это выдох облегчения, ровно как «глотнула свободы». Но «у свободы странный вкус»: передышка будет с подвохом, и подвох, скорее всего, в камере. Как мы уже все поняли, камера в этой истории видит больше глаз: в 4-й серии Надин приходит её же фото со спины, а в 5-й плёнка запомнила тень за Мирандой, которую никто не видел. Скорее всего, на новом снимке снова будет кто-то лишний…</p></div>'+
  '<div class="pr-ep"><i>21</i><span class="pr-epem">🔥😰</span><p>Огонь в Сентфоре уже уничтожал знания: книга «Тени Сентфора» из 5-й серии пережила пожар без части страниц, а в 19-й именно в ней нашлась расшифровка знаков из башни. Кто-то может дожечь то, что уцелело тогда. Кандидаты: библиотека или архив. И тут чувствуется контраст: весь сезон Надин мёрзнет, а тут огонь.</p></div>'+
  '<div class="pr-ep"><i>22</i><span class="pr-epem">🔦📺</span><p>Здесь полностью согласна с каналом. В ТС1 в углу хижины стоит старый телевизор на полке со свечой (если забыли, загляните во вкладку «Связь с ТС1»), и это тот же угол, с которого начинается ТС2. Фонарик значит ночь и темноту, скорее всего Старый Сентфор. Это будет главный мост с ТС1 в обнове.</p></div>'+
  '<div class="pr-ep"><i>23</i><span class="pr-epem">☠️🪦</span><p>Тревожных знаков много. В 17-й серии Надин видит себя мёртвой, проросшей морозником. В 16-й в башне кричит голос Малкольма: «Выпусти», «Я голоден». Но главную героиню посреди сезона вряд ли убьют. Скорее всего, Надин увидит свою смерть, как Сара в ТС1, или найдёт свою могилу в другой линии времени. Если кто-то погибнет по-настоящему, то из второстепенных, и не только у меня ощущение, что это может быть Эбигейл.</p></div>'+
  '<p class="pr-sub">Если читать одной историей</p>'+'<div class="pr-split"><span>📸 😮‍💨 🔥 😰 🔦 📺 ☠️ 🪦</span></div>'+
  '<p>Снимок → облегчение → огонь → страх → темнота → экран → смерть → могила. Надин снимет что-то важное и выдохнет: наконец есть доказательство. Но улику попытаются сжечь, и, возможно, вместе с местом, где её хранили. В панике ребята с фонариком пойдут в темноту (например, в Старый Сентфор), найдут тот самый телевизор, и он покажет смерть. А в конце появится могила, и вот она уже настоящая, только чья — главный вопрос.</p>'+
  '<p class="pr-sub">Если 3 + 3 + 2</p>'+'<div class="pr-split"><span>📸😮‍💨🔥</span><span>😰🔦📺</span><span>☠️🪦</span></div>'+
  '<p><b>Первый акт:</b> снимок и передышка, которую обрывает огонь. <b>Второй:</b> страх и поиски в темноте, которые заканчиваются у экрана. <b>Третий:</b> смерть и могила. Телевизор стоит прямо перед ☠️🪦, поэтому смерть Надин, скорее всего, сначала увидит на экране: как запись или как кадры, с которых начинаются серии.</p>'+
  '</div>'+
  '<div class="pr-take"><b>Ещё способы</b>'+
  '<div class="pr-split"><span>📸↔📺</span><span>🔥↔🔦</span><span>☠️🪦</span></div>'+'<p>Крест-накрест: на фото и на экране одно и то же, огонь и фонарик — два источника света в темноте, а смерть в конце.</p>'+
  '<div class="pr-split"><span>😮‍💨 → 😰</span></div>'+'<p>Эмоции отдельно от предметов: первая половина обновы — облегчение, вторая — страх.</p>'+
  '</div>';
var restHead=H("div","pr-sec"); restHead.innerHTML='<b>Что ещё случится</b><small>Всё это решится в сериях 20–23</small>';
var longHead=H("div","pr-sec pr-long"); longHead.innerHTML='<b>Долгие ставки</b><small>Главные загадки сезона. Их, скорее всего, не раскроют за одну обнову, поэтому засчитаем, когда ответ появится, даже если через несколько обнов. Кто угадает заранее, получит редкое звание</small>';

/* ---------- ник: обязателен, чтобы попасть в таблицу провидцев ---------- */
var MK="sentfor_poppy_me", me=null; try{me=JSON.parse(localStorage.getItem(MK)||"null")}catch(e){}
var nb=H("form","pr-nick"), ni=H("input","pr-ni"), ns=H("button","pr-ns","Сохранить"), nm=H("p","pr-nm");
nb.innerHTML='<label for="pr-ni"><b>Твой ник для таблицы провидцев</b><small>После обновы покажем топ тех, кто угадал больше всех</small></label>';
ni.id="pr-ni"; ni.type="text"; ni.maxLength=20; ni.placeholder="например, sentfor_fan"; ni.autocomplete="off"; ns.type="submit";
var nrow=H("div","pr-nrow"); nrow.appendChild(ni); nrow.appendChild(ns); nb.appendChild(nrow); var nsm=H("small","pr-nsm"); nb.appendChild(nsm); nb.appendChild(nm);
function nickOk(){return !!(me&&me.nick)}
/* ник выбирают один раз: тот же, что в комментариях, поменять нельзя */
function nickPaint(){var k=nickOk(); nb.classList.toggle("set",k); ni.readOnly=k; ns.hidden=k; if(k) ni.value=me.nick;
  nsm.textContent=k?"Это твой ник и в комментариях. Поменять его нельзя":"Выбирают один раз. Тот же ник будет в комментариях"}
ni.oninput=function(){nm.textContent=""};
nb.onsubmit=function(e){e.preventDefault(); if(!open()||nickOk()) return;
  var n=ni.value.trim().replace(/\s+/g,"_").replace(/[^\wа-яё.]/gi,""); ni.value=n;
  if(n.length<2){nm.textContent="Минимум 2 буквы или цифры"; ni.focus(); return}
  if(nickOk()&&n===me.nick){nickPaint(); return}
  if(!window.SB){me={nick:n,ava:(me&&me.ava)||"🔮"}; try{localStorage.setItem(MK,JSON.stringify(me))}catch(_){} nickPaint(); if(pend){var f0=pend; pend=null; f0()} return}
  ns.disabled=true; ns.textContent="…";
  SB.saveProfile(n,(me&&me.ava)||"🔮").then(function(){profOk=true; me={nick:n,ava:(me&&me.ava)||"🔮"}; try{localStorage.setItem(MK,JSON.stringify(me))}catch(_){} nm.textContent=""; sent=""; push(); if(pend){var f=pend; pend=null; f()}})
    .catch(function(err){var m=err&&err.message||"";
      if(err&&(err.code==="23505"||err.status===409)){nm.textContent="Этот ник уже занят, попробуй другой"; return}
      if(/nick_reserved/.test(m)){nm.textContent="Этот ник занят персонажем 🙂"; return}
      if(/nick_chars|nick_len/.test(m)){nm.textContent="Только буквы, цифры, _ и точка, от 2 до 20 символов"; return}
      /* нет связи с базой (блокировка, капча): ник и ответы сохраняем у человека, отправим, когда связь появится */
      me={nick:n,ava:(me&&me.ava)||"🔮"}; try{localStorage.setItem(MK,JSON.stringify(me))}catch(_){} profOk=false;
      nm.textContent="Сохранили у тебя. В общую таблицу отправим, когда появится связь"; if(pend){var f=pend; pend=null; f()}})
    .then(function(){ns.disabled=false; nickPaint()})};
var pend=null;
function needNick(f){if(nickOk()) return false; pend=f; nm.textContent="Сначала ник, чтобы прогноз засчитался"; nb.classList.remove("shake"); void nb.offsetWidth; nb.classList.add("shake");
  nb.scrollIntoView({behavior:"smooth",block:"center"}); setTimeout(function(){ni.focus({preventScroll:true})},400); return true}
list.appendChild(nb);
/* ник из профиля, если человек уже комментировал на другом устройстве этого браузера */
if(window.SB&&SB.user&&SB.user()){
  SB.profile().then(function(p){if(p&&p.nick&&(!me||me.nick!==p.nick)){me={nick:p.nick,ava:p.ava}; try{localStorage.setItem(MK,JSON.stringify(me))}catch(_){} } if(p&&p.nick) profOk=true; nickPaint()}).catch(function(){});
  /* прогноз уже подтверждён с этого аккаунта на другом устройстве — подтягиваем его */
  SB.predMine().then(function(r){if(!r||!r.locked||!r.a) return; var m=A._mine; A={}; for(var k in r.a) A[k]=r.a[k]; if(m) A._mine=m; A._done=A._done||Date.now(); A._sent=1; save(); paint(); stats()}).catch(function(){});
}
nickPaint();
var cards={};
Q.forEach(function(q,i){
  if(i===0){list.appendChild(spoilerHead); list.appendChild(takes)} if(q.id==="tol") list.appendChild(restHead); if(q.long&&!longHead.parentNode) list.appendChild(longHead);
  var c=H("div","pr-q"); c.id="pr-"+q.id;
  var t=H("div","pr-qt"); t.appendChild(H("span","pr-em",q.em)); t.appendChild(H("b","",q.q)); c.appendChild(t);
  if(q.src) c.appendChild(H("p","pr-qsrc",q.src));
  if(q.take){var tk=H("details","pr-qtake"); tk.appendChild(H("summary","","Мнение автора сайта"));
    q.take.forEach(function(t){var o=q.o.filter(function(x){return x[0]===t[0]})[0]; var r=H("div","pr-qt-row"); r.appendChild(H("b","",o?o[1]:"")); r.appendChild(H("p","",t[1])); tk.appendChild(r)});
    c._tk=tk}
  if(q.ev){var ev=H("div","pr-ev"); q.ev.forEach(function(s){ev.appendChild(H("p","",s))});  c.appendChild(ev)}
  var os=H("div","pr-os");
  q.o.forEach(function(o){var b=H("button","pr-o"); b.type="button"; b.setAttribute("data-o",o[0]);
    b.innerHTML='<i class="pr-bar"></i><span class="pr-ot"></span><span class="pr-pc"></span>'; b.querySelector(".pr-ot").textContent=o[1];
    b.onclick=function(){if(!open()||locked()) return; var go=function(){A[q.id]=o[0]; save(); paint(); bump(c); if(sure){sure=false; okBtn.textContent="Подтвердить прогноз"; okMsg.textContent=""}}; if(needNick(go)) return; go()}; os.appendChild(b)});
  c.appendChild(os); if(c._tk) c.appendChild(c._tk); list.appendChild(c); cards[q.id]=c});
list.appendChild(mineBox); /* свой прогноз — в конце списка */
window.SFpredRefresh=stats;
function bump(c){c.classList.remove("pr-ok"); void c.offsetWidth; c.classList.add("pr-ok")}

function paint(){
  var op=open(), done=nDone(), res=Object.keys(RES).length, lk=locked();
  var tb=document.querySelector('.tab[data-tab="pred"]'); if(tb) tb.classList.toggle("tab-pred",op&&!lk); /* точка «есть что сделать», пока прогноз не подтверждён */
  root.classList.toggle("closed",!op); root.classList.toggle("pr-done",lk);
  prog.textContent=res?(lk?"Угадано "+score()+" из "+Q.filter(function(q){return has(q.id)}).length:"Прогноз не был подтверждён"):lk?"✓ Прогноз принят":!op?"Прогноз не подтверждён":(done+" из "+Q.length+" · ответь на всё и подтверди");
  Q.forEach(function(q){var c=cards[q.id], mine=A[q.id], st=ST&&ST[q.id], tot=0;
    if(st) Object.keys(st).forEach(function(k){tot+=st[k]});
    var show=(lk||!op)&&tot>0;
    c.classList.toggle("answered",!!mine);
    c.querySelectorAll(".pr-o").forEach(function(b){var k=b.getAttribute("data-o"), p=show?Math.round((st[k]||0)*100/tot):0;
      b.classList.toggle("mine",k===mine); b.disabled=!op||lk;
      b.querySelector(".pr-bar").style.width=show?p+"%":"0";
      b.querySelector(".pr-pc").textContent=show?p+"%":"";
      if(has(q.id)){var ok=RES[q.id].indexOf(k)>=0; b.classList.toggle("right",ok); b.classList.toggle("wrong",lk&&k===mine&&!ok)}})});
  okBox.hidden=lk||!op; cardBtn.hidden=!lk; ta.disabled=lk||!op;
  if(!op&&!lk&&done) okMsg.textContent="";}
function score(){if(!locked()) return 0; return Q.filter(function(q){return has(q.id)&&A[q.id]&&RES[q.id].indexOf(A[q.id])>=0}).length}
function tick(){clock.innerHTML=open()?'<small>Прогнозы закроются через</small><b>'+left()+'</b><small>сб 21 ноября, 15:00 по Москве · серии 20–23 выйдут 22-го</small>':(Object.keys(RES).length?'<small>Серии 20–23 вышли</small><b>Что сбылось?</b><small>Верные ответы подсвечены зелёным</small>':'<small>Прогнозы закрыты</small><b>Ждём серии 20–23</b><small>Как только выйдут, отметим, что сбылось</small>');
  if(!open()&&root.classList.contains("closed")===false) paint()}
tick(); paint(); setInterval(tick,1000);
/* если в прошлый раз не отправилось (не было связи) — пробуем снова */
setTimeout(push,2500);

/* проценты грузим, когда вкладку открыли */
(function(){var s=document.getElementById("tab-pred"); function go(){if(!ST&&(locked()||!open())) stats()}
  if(s&&!s.hidden) setTimeout(go,300); else if(s) new MutationObserver(function(_,ob){if(!s.hidden){go(); ob.disconnect()}}).observe(s,{attributes:true,attributeFilter:["hidden"]})})();

/* ---------- карточка для сторис 1080×1920 ---------- */
function caseNo(){var n; try{n=localStorage.getItem("sentfor_caseno"); if(!n){n=String(1000+Math.floor(Math.random()*9000)); localStorage.setItem("sentfor_caseno",n)}}catch(e){n="0000"} return n}
function wrap(cx,s,x,y,w,lh,max){var ws=s.split(" "), line="", n=0;
  for(var i=0;i<ws.length;i++){var t=line?line+" "+ws[i]:ws[i]; if(cx.measureText(t).width>w&&line){cx.fillText(line,x,y); y+=lh; n++; line=ws[i]; if(max&&n>=max-1){line=ws.slice(i).join(" "); while(cx.measureText(line+"…").width>w&&line.length) line=line.slice(0,-1); line+="…"; break}} else line=t}
  cx.fillText(line,x,y); return y+lh}
function clip(cx,t,w){if(cx.measureText(t).width<=w) return t; while(t.length&&cx.measureText(t+"…").width>w) t=t.slice(0,-1); return t.replace(/[\s,.:;—-]+$/,"")+"…"}
function lines(cx,t,w,max){var ws=t.split(" "), out=[], line=""; ws.forEach(function(x){var tt=line?line+" "+x:x; if(cx.measureText(tt).width>w&&line){out.push(line); line=x} else line=tt}); if(line) out.push(line);
  if(out.length>max){out=out.slice(0,max); out[max-1]=clip(cx,out[max-1]+" …",w)} return out}
function makeCard(){
  var fonts=["700 80px 'Fira Sans Extra Condensed'","400 34px 'PT Sans'","700 34px 'PT Sans'","700 60px Caveat","400 28px 'PT Mono'"];
  Promise.all(fonts.map(function(f){return document.fonts?document.fonts.load(f).catch(function(){}):null})).then(draw)}
function draw(){
  var W=1080, Hh=1920, cv=document.createElement("canvas"); cv.width=W; cv.height=Hh; var cx=cv.getContext("2d");
  var g=cx.createLinearGradient(0,0,0,Hh); g.addColorStop(0,"#17161a"); g.addColorStop(1,"#0c0b0e"); cx.fillStyle=g; cx.fillRect(0,0,W,Hh);
  for(var i=0;i<2600;i++){cx.fillStyle="rgba(255,255,255,"+(Math.random()*.035).toFixed(3)+")"; cx.fillRect(Math.random()*W,Math.random()*Hh,2,2)}
  /* папка */
  var px=70, py=150, pw=W-140, ph=Hh-330;
  cx.fillStyle="#d9ccb1"; cx.beginPath(); cx.moveTo(px,py+40); cx.lineTo(px+260,py+40); cx.lineTo(px+300,py); cx.lineTo(px+560,py); cx.lineTo(px+600,py+40); cx.lineTo(px+pw,py+40); cx.lineTo(px+pw,py+ph); cx.lineTo(px,py+ph); cx.closePath(); cx.fill();
  var pg=cx.createLinearGradient(0,py,0,py+ph); pg.addColorStop(0,"rgba(255,250,235,.25)"); pg.addColorStop(1,"rgba(80,60,30,.18)"); cx.fillStyle=pg; cx.fill();
  cx.fillStyle="#2a2420"; cx.font="400 28px 'PT Mono'"; cx.textAlign="left"; cx.fillText("ДЕЛО №"+caseNo(),px+320,py+30);
  if(me&&me.nick){var nf=40; cx.font="700 40px Caveat"; while(nf>26&&cx.measureText("следователь: "+me.nick).width>pw-460){nf-=2; cx.font="700 "+nf+"px Caveat"} cx.fillStyle="#3a2f27"; cx.textAlign="right"; cx.fillText("следователь: "+me.nick,px+pw-40,py+140); cx.textAlign="left"}
  cx.fillStyle="#7a1f1f"; cx.font="700 30px 'PT Mono'"; cx.textAlign="right"; cx.fillText("СЕКРЕТНО",px+pw-40,py+90);
  cx.textAlign="left"; cx.fillStyle="#1d1915"; cx.font="700 84px 'Fira Sans Extra Condensed'"; cx.fillText("ПРОГНОЗ",px+50,py+170);
  cx.font="400 34px 'PT Sans'"; cx.fillStyle="#4a4037"; cx.fillText("«Тени Сентфора 2» · серии 20–23",px+50,py+220);
  cx.strokeStyle="rgba(40,30,20,.35)"; cx.lineWidth=2; cx.beginPath(); cx.moveTo(px+50,py+250); cx.lineTo(px+pw-50,py+250); cx.stroke();
  /* ответы: если мало — вопрос + ответ, если много — компактно: эмодзи + ответ в одну строку */
  var top=py+285, bottom=py+ph-150, picked=Q.filter(function(q){return A[q.id]&&q.o.some(function(x){return x[0]===A[q.id]})});
  var mineH=0, mineLines=[];
  if(A._mine){cx.font="700 44px Caveat"; mineLines=lines(cx,"«"+A._mine+"»",pw-100,3); mineH=40+mineLines.length*46+16}
  /* раскладка: подбираем самый крупный шрифт, при котором все ответы влезают целиком (длинные — в 2–3 строки) */
  var avail=bottom-top-mineH, EF="'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif", right=px+pw-40, L=null;
  function plan(fs){var es=Math.round(fs*.78), lf=Math.round(fs*.58), lh=Math.round(fs*1.02), gap=Math.round(fs*.42), emW=0, rows=[], tot=0;
    cx.font=es+"px "+EF; picked.forEach(function(q){emW=Math.max(emW,cx.measureText(q.em).width)});
    var ax0=px+50+emW+16;
    picked.forEach(function(q){var o=q.o.filter(function(x){return x[0]===A[q.id]})[0], lab=(q.s||"").replace(/\?$/,"")+": ";
      cx.font="400 "+lf+"px 'PT Sans'"; var lw=cx.measureText(lab).width;
      cx.font="700 "+fs+"px Caveat"; var ls=lines(cx,o[1],right-ax0-lw,3);
      rows.push({q:q,lab:lab,lw:lw,ls:ls}); tot+=ls.length*lh+gap});
    return {fs:fs,es:es,lf:lf,lh:lh,gap:gap,ax0:ax0,rows:rows,tot:tot}}
  for(var f=46;f>=24;f-=2){L=plan(f); if(L.tot<=avail) break}
  var y=top+Math.max(0,(avail-L.tot)/4);
  L.rows.forEach(function(r){var by=y+L.lh*.78;
    cx.textAlign="left"; cx.textBaseline="alphabetic";
    cx.font=L.es+"px "+EF; cx.fillStyle="#000"; cx.fillText(r.q.em,px+50,by);
    cx.font="400 "+L.lf+"px 'PT Sans'"; cx.fillStyle="#7a6d60"; cx.fillText(r.lab,L.ax0,by);
    cx.font="700 "+L.fs+"px Caveat"; cx.fillStyle="#1f2a5a";
    r.ls.forEach(function(t,k){cx.fillText(t,L.ax0+r.lw,by+k*L.lh)});
    y+=r.ls.length*L.lh+L.gap});
  if(A._mine){y+=10; cx.font="400 25px 'PT Sans'"; cx.fillStyle="#6a5d50"; cx.fillText("Мой главный прогноз",px+50,y+24);
    cx.font="700 44px Caveat"; cx.fillStyle="#7a1f1f"; mineLines.forEach(function(l,k){cx.fillText(l,px+50,y+72+k*46)})}
  /* низ папки: «Проверим» слева, печать справа */
  cx.strokeStyle="rgba(40,30,20,.3)"; cx.lineWidth=2; cx.beginPath(); cx.moveTo(px+50,py+ph-140); cx.lineTo(px+pw-50,py+ph-140); cx.stroke();
  cx.textAlign="left"; cx.font="700 52px Caveat"; cx.fillStyle="#3a2f27"; cx.fillText("Проверим 22 ноября",px+50,py+ph-58);
  cx.save(); cx.translate(px+pw-200,py+ph-72); cx.rotate(-.12); cx.strokeStyle="rgba(150,30,30,.85)"; cx.lineWidth=6;
  cx.strokeRect(-165,-46,330,92); cx.lineWidth=2.5; cx.strokeRect(-155,-36,310,72);
  cx.fillStyle="rgba(150,30,30,.88)"; cx.font="700 40px 'Fira Sans Extra Condensed'"; cx.textAlign="center"; cx.fillText("ПРОГНОЗ ПРИНЯТ",0,14); cx.restore();
  /* низ */
  cx.textAlign="center"; cx.fillStyle="#cfc6b6"; cx.font="700 44px 'Fira Sans Extra Condensed'"; cx.fillText("ДЕЛО СЕНТФОРА",W/2,Hh-110);
  cx.font="400 30px 'PT Sans'"; cx.fillStyle="#8d8578"; cx.fillText("Сделай свой прогноз: delo-sentfora.vercel.app",W/2,Hh-62);
  show(cv)}
function show(cv){
  var ov=H("div","pr-ov"), box=H("div","pr-box"), img=H("img"); img.alt="Карточка с прогнозом"; img.src=cv.toDataURL("image/png");
  var row=H("div","pr-row"), dl=H("a","pr-dl","Скачать"); dl.href=img.src; dl.download="prognoz-sentfor.png";
  var sh=H("button","pr-sh","Поделиться"), cl=H("button","pr-cl","Закрыть"); sh.type=cl.type="button";
  cv.toBlob(function(bl){var f=bl&&window.File?new File([bl],"prognoz-sentfor.png",{type:"image/png"}):null;
    if(!(f&&navigator.canShare&&navigator.canShare({files:[f]}))){sh.remove(); return}
    sh.onclick=function(){navigator.share({files:[f],text:"Мой прогноз к «Теням Сентфора 2» 🔮 delo-sentfora.vercel.app"}).catch(function(){})}});
  function close(){ov.remove(); document.removeEventListener("keydown",esc)} function esc(e){if(e.key==="Escape") close()}
  cl.onclick=close; ov.onclick=function(e){if(e.target===ov) close()}; document.addEventListener("keydown",esc);
  row.appendChild(dl); row.appendChild(sh); row.appendChild(cl); box.appendChild(img); box.appendChild(H("p","","На телефоне: зажми картинку и сохрани, если кнопка не сработает")); box.appendChild(row); ov.appendChild(box); document.body.appendChild(ov)}
})();
