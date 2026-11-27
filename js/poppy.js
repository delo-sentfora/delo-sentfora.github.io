/* Блог Поппи (@PoppyEm) и канал «Сплетни Сентфора». Открыт для всех с 06.11.2026.
   Лайки, комментарии и реакции — в Supabase (js/sb.js). */
(function(){
try{localStorage.removeItem("sentfor_poppytest")}catch(e){}

var IMG="img/poppy/";
/* кто комментирует: ник, аватарка */
var WHO={
 poppy:{n:"PoppyEm",a:IMG+"avatar3.webp",v:1},
 rudi:{n:"rudy.brooks",a:IMG+"ava_rudi.webp",e:"🐶🏀"},
 dex:{n:"dex_hawk",a:IMG+"ava_dex.webp"},
 nadin:{n:"nadineross",a:IMG+"ava_nadin.webp"},
 olivia:{n:"olivia",a:IMG+"ava_olivia.webp"},
 abigail:{n:"abigail.davis",a:IMG+"ava_abigail.webp"},
 darren:{n:"darren.bowie",a:IMG+"ava_darren.webp"},
 alice:{n:"alice.lee",a:IMG+"ava_alice.webp"},
 liam:{n:"liam",a:"img/liam.webp"}
};
/* ---------- сервер (Supabase через js/sb.js). Если ключей нет — всё работает локально ---------- */
var ON=!!(window.SB&&SB.on);
var live={counts:{},mine:{},coms:{},at:0,admin:false,me:null,ui:{}};
function errText(e){var m=(e&&e.message)||"";
  if(/slow_down/.test(m)) return "Не так быстро 🙂 Подожди 20 секунд";
  if(/daily_limit/.test(m)) return "На сегодня хватит комментариев 🙃";
  if(/bad_words/.test(m)) return "Поппи такое не пропустит 🙅‍♀️";
  if(/no_links/.test(m)) return "Ссылки в комментариях нельзя";
  if(/nick_reserved/.test(m)) return "Этот ник занят героями 😏";
  if(/nick_chars|nick_len/.test(m)) return "Ник: 2–20 символов, буквы, цифры, _ и точка";
  if(/duplicate|23505|profiles_nick_lower/.test(m)||(e&&e.code==="23505")) return "Такой ник уже занят";
  if(/row-level|42501|forbidden/.test(m)||(e&&e.code==="42501")) return "Сейчас ты не можешь комментировать";
  if(/captcha/i.test(m)) return "Не получилось проверить, что ты не бот 🤖 Обнови страницу и попробуй ещё раз";
  if(/anonymous/i.test(m)) return "Комментарии временно отключены";
  return "Не получилось. Проверь интернет и попробуй ещё раз";}
function loadLive(force){
  if(!ON) return Promise.resolve();
  if(!force&&Date.now()-live.at<30000) return Promise.resolve();
  var ids=vis().map(function(p){return p.id});
  return Promise.all([
    SB.likeCounts(ids).catch(function(){return []}),
    SB.myLikes(ids).catch(function(){return []}),
    SB.comments(ids).catch(function(){return null}),
    SB.user()?SB.profile().catch(function(){return null}):null,
    SB.user()?SB.isAdmin():false
  ]).then(function(r){
    live.counts={}; (r[0]||[]).forEach(function(x){live.counts[x.post_id]=x.n});
    live.mine={}; (r[1]||[]).forEach(function(x){live.mine[x.post_id]=1});
    if(r[2]){live.coms={}; r[2].forEach(function(c){(live.coms[c.post_id]=live.coms[c.post_id]||[]).push(c)})}
    live.me=r[3]; live.admin=!!r[4]; live.at=Date.now();
    Object.keys(live.ui).forEach(function(k){live.ui[k]()});
    paintAdmin();
  });
}
function ago(t){var s=(Date.now()-new Date(t).getTime())/1000;
  if(s<60) return "сейчас"; if(s<3600) return Math.floor(s/60)+" мин"; if(s<86400) return Math.floor(s/3600)+" ч"; if(s<604800) return Math.floor(s/86400)+" д"; return Math.floor(s/604800)+" нед"}
/* посты, новые сверху. ep — с какой серии виден пост. loc — геометка (id места на карте) */
var POSTS=[
 {id:"interview",ep:23,cf:1,img:["st_iv23"],vid:"st_iv23",ar:"4/3",d:"10 мин",likes:2214,t:"взяли интервью у звёзд Сентфора. я, конечно, лучшая 💅",by:["elisshhrc","https://t.me/elisshhrc"],
  c:[["darren","105 алмазов это вообще-то скидка"],["poppy","@darren.bowie для тебя может быть 💅"],["dex","кто разрешил это выкладывать"],["poppy","@dex_hawk ты сам сказал, что претензий нет 😏"],["alice","я правда могу уйти?"],["nadin","мой отпуск до января никто не отменял ☕"],["rudi","алгоритмы тиктока это не переживут 🐶"]]},
 {id:"memes",ep:4,cf:1,img:["mm01","mm02","mm03","mm04","mm05","mm06","mm07","mm08","mm09","mm10","mm11","mm12","mm13","mm14","mm15","mm16","mm17","mm18"],fit:{mm01:1,mm02:1,mm03:1,mm04:1,mm05:1,mm06:1,mm07:1,mm08:1,mm09:1,mm10:1,mm12:1,mm13:1,mm14:1,mm15:1,mm16:1,mm17:1,mm18:1},d:"1 мин",likes:734,t:"что было в Сентфоре, остаётся в Сентфоре\nно фотки видят только свои💅",
  c:[["rudi","почему почти на каждой фотке страдаю я 🐶"],["poppy","@rudy.brooks потому что у тебя это лучше всех получается 💅"],["dex","кто повесил объявление. у вас сутки"],["poppy","@dex_hawk запись уже закрыта, мест нет 💅"],["alice","партию я выиграла. ног до сих пор не чувствую ♟"],["poppy","@alice.lee я поддалась"],["nadin","Руди сам попросил полить. сказал, хочет подрасти 🌱"],["rudi","@nadineross я имел в виду в баскетболе!!"],["darren","я тут единственный нормальный. как обычно"],["alice","на 11 фотке я просто живу свою жизнь"],["nadin","Джимми всю обнову чувствовал себя примерно так"]]},
 {id:"tomorrow",ep:1,img:["tmr1","tmr2","tmr3","tmr4"],fit:{tmr2:1},d:"1 мин",likes:1968,t:"некоторым лучше не знать, что будет завтра 🕯",by:["psfnv","https://t.me/psfnv"],
  c:[["olivia","поппи, что ты знаешь?? говори 😭"],["poppy","@olivia завтра узнаешь. как и все 🕯"],["rudi","звучит как угроза. я на всякий случай завтра из дома не выхожу 🐶"],["poppy","@rudy.brooks выйдешь. все выйдут 💅"],["alice","шуба 10/10, но взгляд меня пугает 👀"],["abigail","ждём завтра всех!! 🖤"],["dex","опять загадками говоришь"],["poppy","@dex_hawk а ты опять всё читаешь. до завтра 💅"]]},
 {id:"shades",ep:1,img:["shades1","shades2","shades3"],d:"1 д",likes:2741,t:"я уже видела, чем всё закончится. просто пока молчу 🕶",
  c:[["olivia","ОЧКИ. где взяла?? 😭"],["poppy","@olivia секрет. у тебя всё равно не будет 💅"],["rudi","поппи, ты из нулевых сбежала? 🐶"],["poppy","@rudy.brooks нет, это нулевые сбежали ко мне 💅"],["alice","кадр прямо как из «Тела» 👀"],["abigail","этот цвет создан для тебя"],["dex","в помещении очки. понятно"]]},
 {id:"bride",ep:1,img:["bride1","bride2","bride3"],d:"4 ч",likes:3666,t:"Жених сбежал до свадьбы. Его проблемы 🥀🖤",
  c:[["abigail","невеста года 😍"],["rudi","я сначала испугался, потом узнал тебя и испугался ещё сильнее 🐶"],["poppy","@rudy.brooks это комплимент, я так и запишу 💅"],["alice","грим 10/10, кто делал?"],["poppy","@alice.lee сама. три часа и ни одной слезинки 🖤"],["olivia","я бы за такую невесту из могилы встала 😭"],["dex","я тебя за твой тг канал убью"],["poppy","@dex_hawk опоздал, милый. я уже мёртвая 🥀"]]},
 {id:"halloween",ep:1,cf:1,img:["hwp01","hwp02","hwp03","hwp04","hwp05","hwp06","hwp07","hwp08","hwp09","hwp10"],fit:{hwp03:1,hwp05:1,hwp06:1,hwp07:1,hwp09:1,hwp10:1},d:"2 ч",likes:1873,t:"Вечеринка прошла 🎃\nКостюмы - огонь, некоторые лица к концу вечера - тоже 📸\nА завтра я вам такие сплетни расскажу…",
  c:[["alice","кто разрешил снимать меня без предупреждения?"],["alice","а, это я снимала 📸"],["rudi","почему у джокера на фото лицо лучше, чем у меня в жизни 🐶"],["darren","болты на шее до сих пор не снимаются. помогите"],["dex","…"],["poppy","@dex_hawk череп тебе идёт. больше, чем обычное лицо 💅"],["abigail","мяу 🐱"],["olivia","а кто блондинка в розовом? она вообще из нашей школы?? 👀"],["poppy","@olivia понятия не имею. пришла, съела все капкейки и ушла 💅"]]},
 {id:"glow",ep:1,img:["glow1","glow2"],d:"5 мин",likes:2915,t:"красный или фиолетовый? выбирайте 💜❤️",by:["psfnv","https://t.me/psfnv"],
  c:[["nadin","фиолетовый, даже не думай"],["rudi","красный. и это не обсуждается 🐶"]]},
 {id:"velvet",ep:1,img:["velvet1","velvet2","velvet3"],d:"2 ч",likes:4102,t:"чёрный бархат - мой любимый цвет настроения 🖤",by:["psfnv","https://t.me/psfnv"],
  c:[["rudi","у кого-то сегодня свидание? 👀"],["poppy","@rudy.brooks у кого-то слишком много вопросов"]]},
 {id:"wet",ep:1,img:["wet1","wet2","wet3","wet4"],d:"1 д",likes:3480,t:"Дождь мне к лицу 💜",by:["rctaynik","https://t.me/rctaynik"],
  c:[["alice","кто снимал?? хочу так же"],["poppy","@alice.lee @rctaynik 💜"],["rudi","ты из бассейна или из фильма ужасов? 😳"]]},
 {id:"friends",ep:5,cf:1,img:["cf1","cf2","cf3","cf4","cf5","cf6","cf7","cf8"],fit:{cf3:1,cf5:1},d:"1 мин",likes:612,t:"Только для своих 💚 Если вы это видите - вы в списке",
  c:[["rudi","я буква ж и горжусь этим"],["dex","пздц, кто разрешил выкладывать тачку?"],["poppy","@dex_hawk я 😏"],["nadin","..."],["darren","боже..."],["alice","проверьте пульс у Даррена"]]},
 {id:"howard",ep:1,img:["howard1","howard2"],d:"5 мин",likes:4120,t:"А надо было открывать 🔥💅",
  c:[["rudi","скажи, что это фотошоп 😳"],["poppy","@rudy.brooks не знаю, может быть, а может быть и нет 😇"],["dex","…"]]},
 {id:"shutter",ep:1,img:["shutter"],d:"2 ч",likes:1268,t:"Без фото, пожалуйста 🖐",
  c:[["nadin","поздно, уже сфоткали 📸"],["poppy","@nadineross удали"],["rudi","это где вообще? 😳"]]},
 {id:"moto",ep:11,img:["moto","stairs1","stairs2"],fit:{stairs1:1,stairs2:1},d:"5 ч",likes:2477,t:"Всё самое лучшее на грани 🖤🏍",
  c:[["dex","неплохо"],["poppy","@dex_hawk знаю 😏"],["abigail","этот образ 🔥🔥"],["rudi","не упади там"],["poppy","@rudy.brooks я не падаю. я позирую"]]},
 {id:"butterfly",ep:1,img:["butterfly"],d:"1 д",likes:3105,t:"🦋",
  c:[["abigail","как ты это делаешь 😍"],["nadin","смело"],["poppy","@nadineross завидуй молча 💋"]]},
 {id:"rug",ep:1,img:["rug"],d:"2 д",likes:1987,t:"Задолбали все, я лежать",
  c:[["dex","уйди по-хорошему"],["poppy","@dex_hawk может быть 😏"],["olivia","это где? 👀"]]},
 {id:"river",ep:1,img:["river"],d:"3 д",likes:2215,loc:["garage","Гараж Декса"],t:"Ночные прогулки у реки 🌙",
  c:[["abigail","очки 😍 где взяла?"]]},
 {id:"bw",ep:1,img:["bw"],d:"4 д",likes:1532,t:"Не беспокоить 🖤",
  c:[["alice","а фотограф кто? 📸"],["poppy","@alice.lee секрет 🤫"],["olivia","богиня 😍"]]},
 {id:"bath",ep:1,img:["bath","bath2","bath3"],d:"6 д",likes:2634,t:"Лучшие разговоры - в туалете на вечеринке 💅",
  c:[["olivia","это было легендарно 😂"],["abigail","богиня 😍"]]},
 {id:"music",ep:1,img:["music"],d:"1 нед",likes:2108,loc:["cafe","Закусочная «Сентфор»"],song:["Doja Cat","Boss Bitch"],t:"Boss Bitch на повторе 👑",
  c:[["rudi","опять в закусочную без нас?"],["poppy","@rudy.brooks я берегу свою репутацию"],["abigail","куртка 🔥🔥🔥"]]}
];
/* актуальное: обложка, кадры */
var HL=[ /* порядок как в Инстаграме: куда добавили последним, тот первый */
 {id:"me",n:"Я",cover:"hl_me",ep:1,fr:[{img:"cams"},{vid:"poppy_hi",poster:"st_hi"},{img:"lips",txt:"новый оттенок 💋"},{img:"st_fur",txt:"снег пошёл ❄️"},{ep:1,vid:"st_pp1",poster:"st_pp1"},{ep:1,img:"st_sword"},{ep:1,vid:"st_pp2",poster:"st_pp2"},{ep:1,vid:"st_pp3",poster:"st_pp3"}]},
 {id:"life",n:"Life",cover:"hl_life2",ep:1,fr:[{img:"music",txt:"💅"},{img:"car_lips"},{img:"party"},{img:"film2",txt:"любимое 🍿"},{img:"film1",txt:"мне не страшно. совсем"},{img:"shopping",txt:"шопинг лечит всё 🛍"},{img:"fog"},{vid:"st_booth2",poster:"st_booth",cf:1}]},
 {id:"hw",n:"Halloween",cover:"hl_hw",ep:1,fr:[{img:"st_hw0",txt:"готовлю вам идеи грима на хэллоуин 🎃 скоро покажу"},{vid:"hw_spider",poster:"st_hw_spider",txt:"№1 паук - если хотите, чтобы на вас пялились весь вечер 🕷"},{vid:"hw_doll",poster:"st_hw_doll",txt:"№2 фарфоровая кукла - жутко и мило одновременно"},{vid:"hw_vamp",poster:"st_hw_vamp",txt:"№3 вампир - помада и капля крови. минимум усилий, максимум эффекта 🩸"},{vid:"hw_skull",poster:"st_hw_skull",txt:"№4 полчерепа - сложно только на вид, честно"},{img:"st_hw5",txt:"какой выбрала я - узнаете в понедельник 🤫"}]},
 {id:"school",n:"Школа",cover:"hl_school",ep:1,fr:[{img:"locker",txt:"доброе утро, школа 🙄"},{img:"doodles"},{img:"mouse",ep:11,txt:"серая мышка. я. серьёзно? 🙄"}]}
];
/* свежие сторис (кольцо вокруг аватарки) */
/* свежие сторис: at — когда выложена (время Варшавы). Через 24 часа после at сторис исчезает сама.
   Если at нет — сторис висит, пока её не уберут (так удобно до запуска блога). */
var NOW={id:"now",fr:[
  {ep:1,vid:"poppy_me",poster:"st_me",at:"2026-11-06T15:50"},
  {ep:1,img:"st_hw0",txt:"готовлю вам идеи грима на хэллоуин 🎃 скоро покажу",at:"2026-11-07T14:55"},
  {ep:1,vid:"hw_spider",poster:"st_hw_spider",txt:"№1 паук - если хотите, чтобы на вас пялились весь вечер 🕷",at:"2026-11-07T18:45"},
  {ep:1,vid:"hw_doll",poster:"st_hw_doll",txt:"№2 фарфоровая кукла - жутко и мило одновременно",at:"2026-11-07T18:45"},
  {ep:1,vid:"hw_vamp",poster:"st_hw_vamp",txt:"№3 вампир - помада и капля крови. минимум усилий, максимум эффекта 🩸",at:"2026-11-07T18:45"},
  {ep:1,vid:"hw_skull",poster:"st_hw_skull",txt:"№4 полчерепа - сложно только на вид, честно",at:"2026-11-07T18:45"},
  {ep:1,img:"st_hw5",txt:"какой выбрала я - узнаете в понедельник 🤫",at:"2026-11-07T18:45"},
  {ep:1,img:"st_board",txt:"собираю свою доску улик 🔍 а вы уже пробовали?",at:"2026-11-08T20:10"},
  {ep:1,img:"st_fur",txt:"снег пошёл ❄️",at:"2026-11-17T15:30"},
  {ep:1,vid:"st_booth2",poster:"st_booth",cf:1,at:"2026-11-17T15:31"},  /* cf — для близких друзей: зелёное кольцо и плашка */
  {ep:1,vid:"st_pet",poster:"st_pet",at:"2026-11-20T17:15"},
  {ep:1,vid:"st_pp1",poster:"st_pp1",at:"2026-11-27T15:08"},
  {ep:1,img:"st_sword",at:"2026-11-27T15:08"},
  {ep:1,vid:"st_pp2",poster:"st_pp2",at:"2026-11-27T15:08"},
  {ep:1,vid:"st_pp3",poster:"st_pp3",at:"2026-11-27T15:08"}
 ]};
/* test:1 — видно только в тестовом режиме (?test), пока Юля не одобрит. tf:1 — блок поднят наверх только ради теста: без теста он стоит вторым, как раньше */
if(!window.SFTEST){POSTS=POSTS.filter(function(p){return !p.test}); NOW.fr=NOW.fr.filter(function(f){return !f.test}); HL.forEach(function(h){h.fr=h.fr.filter(function(f){return !f.test})}); var tfh=HL.filter(function(h){return h.tf})[0]; if(tfh&&HL[0]===tfh){HL.splice(0,1); HL.splice(1,0,tfh)}}
function stAt(f){if(!f.at) return null; var t=Date.parse(f.at.length<=16?f.at+":00+01:00":f.at); return isNaN(t)?null:t}
function stAlive(f){var t=stAt(f); return t===null||(Date.now()>=t&&Date.now()-t<864e5)}
function stLabel(f){var t=stAt(f); if(t===null) return f.d||""; var m=Math.floor((Date.now()-t)/6e4); return m<1?"сейчас":m<60?m+" мин":Math.floor(m/60)+" ч"}

/* ---------- утилиты ---------- */
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function rd(){return (window.SF&&SF.read)||1}
function ls(k,v){try{if(v===undefined) return JSON.parse(localStorage.getItem(k)||"null"); localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,window.SFLANG==="en"?",":" ")}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function rich(s){return esc(s).replace(/@([A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*)/g,'<b class="pp-at">@$1</b>').replace(/\n/g,"<br>")}
function av(src,cls){var i=new Image(); i.src=src; i.alt=""; i.className=cls||"pp-av"; i.decoding="async"; return i}
var LK="sentfor_poppy_likes", MK="sentfor_poppy_me", CK="sentfor_poppy_com", SK="sentfor_poppy_seen2", FK="sentfor_poppy_follow";
var likes=ls(LK)||{}, me=ls(MK), mine=ls(CK)||{}, seen=ls(SK)||{}, follow=!!ls(FK);
function vis(){var r=rd(); return POSTS.filter(function(p){return p.ep<=r})}
var gridCat="all"; var CATS=[["all","Все"],["me","Я"],["news","Новости"],["gossip","Сплетни"]];
function catOf(p){return p.cat||"me"}
function cardHTML(p,mini){var c=p.card||{}, g=c.kind==="gossip";
  return '<div class="pp-card '+(g?"gossip":"news")+(mini?" mini":"")+'"><div class="pc-top"><span class="pc-badge">'+(g?"🤫 СПЛЕТНИ":"🚨 НОВОСТИ")+'</span>'+(mini?"":'<span class="pc-src">'+(g?"говорят, что…":"Сентфор · сейчас")+'</span>')+'</div><div class="pc-h">'+esc(c.h||"")+'</div>'+(mini?"":'<div class="pc-t">'+esc(c.t||"")+'</div><div class="pc-foot">@PoppyEm</div>')+'</div>'}
var ICON={
 back:'<svg viewBox="0 0 24 24"><path d="M15 4 7 12l8 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 heart:'<svg viewBox="0 0 24 24"><path d="M12 21.2C11.6 20.9 2.6 15 2.1 9.2 1.8 5.8 4.3 3.2 7.3 3.2c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3 0 5.5 2.6 5.2 6-.5 5.8-9.5 11.7-9.9 12z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
 heartF:'<svg viewBox="0 0 24 24"><path d="M12 21.2C11.6 20.9 2.6 15 2.1 9.2 1.8 5.8 4.3 3.2 7.3 3.2c2 0 3.6 1.1 4.7 2.8 1.1-1.7 2.7-2.8 4.7-2.8 3 0 5.5 2.6 5.2 6-.5 5.8-9.5 11.7-9.9 12z" fill="url(#pkH)" stroke="#d7c3f2" stroke-width=".35"/><path d="M5.2 6.2c1-1.3 2.9-1.6 4.1-.6" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8" stroke-linecap="round"/><path d="M4.2 10.6c2.2-1.6 4.4-.6 5.6 1.2 1.2 1.9 3.6 2.6 5.6 1.2" fill="none" stroke="url(#pkS)" stroke-width=".75" stroke-linecap="round"/><path d="M9.4 6.2c1.6.2 2.7 1.2 3.1 2.6M15.6 13c1.4-.4 2.6.1 3.4 1.1M6.6 14.4c.9-.9 2.1-1.1 3.2-.6" fill="none" stroke="url(#pkS)" stroke-width=".55" stroke-linecap="round"/><ellipse cx="18.6" cy="9.4" rx=".9" ry=".45" transform="rotate(-35 18.6 9.4)" fill="url(#pkS)"/><ellipse cx="6.2" cy="12.6" rx=".8" ry=".4" transform="rotate(30 6.2 12.6)" fill="url(#pkS)"/><ellipse cx="16.10" cy="5.92" rx="1.30" ry="1.92" transform="rotate(10 16.10 5.92)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="17.49" cy="7.36" rx="1.30" ry="1.92" transform="rotate(82 17.49 7.36)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="16.55" cy="9.13" rx="1.30" ry="1.92" transform="rotate(154 16.55 9.13)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="14.57" cy="8.78" rx="1.30" ry="1.92" transform="rotate(226 14.57 8.78)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="14.29" cy="6.80" rx="1.30" ry="1.92" transform="rotate(298 14.29 6.80)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><circle cx="15.80" cy="7.60" r="0.68" fill="#2b2140"/><circle cx="15.61" cy="7.41" r="0.25" fill="#8f8fb0" opacity=".8"/><ellipse cx="9.30" cy="13.80" rx="1.09" ry="1.61" transform="rotate(-12 9.30 13.80)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="10.84" cy="14.48" rx="1.09" ry="1.61" transform="rotate(60 10.84 14.48)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="10.66" cy="16.16" rx="1.09" ry="1.61" transform="rotate(132 10.66 16.16)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="9.02" cy="16.51" rx="1.09" ry="1.61" transform="rotate(204 9.02 16.51)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><ellipse cx="8.18" cy="15.05" rx="1.09" ry="1.61" transform="rotate(276 8.18 15.05)" fill="url(#pkF)" stroke="#c9c9d6" stroke-width=".18"/><circle cx="9.60" cy="15.20" r="0.57" fill="#2b2140"/><circle cx="9.44" cy="15.04" r="0.21" fill="#8f8fb0" opacity=".8"/></svg>',
 com:'<svg viewBox="0 0 24 24"><path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.4L3.5 20.5l1.6-4.5a8.4 8.4 0 1 1 15.4-4.4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
 send:'<svg viewBox="0 0 24 24"><path d="M21.5 3 10 14.5M21.5 3 15 21l-5-6.5L3 9.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
 save:'<svg viewBox="0 0 24 24"><path d="M6 3.5h12v17l-6-4.5-6 4.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
 grid:'<svg viewBox="0 0 24 24"><path d="M3.5 3.5h17v17h-17zM9.2 3.5v17M14.8 3.5v17M3.5 9.2h17M3.5 14.8h17" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
 multi:'<svg viewBox="0 0 24 24"><path d="M7 7V3.5h13.5V17H17M3.5 7H17v13.5H3.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
 pin:'<svg viewBox="0 0 24 24"><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="10" r="2.3" fill="currentColor"/></svg>',
 star:'<svg viewBox="0 0 24 24"><path d="m12 3.2 2.6 5.5 6 .8-4.4 4.2 1.1 5.9L12 16.8l-5.3 2.8 1.1-5.9-4.4-4.2 6-.8z" fill="currentColor"/></svg>',
 hell:'<svg class="hb" viewBox="0 0 24 24"><g class="hp" style="--i:0"><path d="M12 12C9.3 10 8.4 5.4 12 2.9 15.6 5.4 14.7 10 12 12Z" transform="rotate(0 12 12)" fill="url(#pkP)" stroke="#ead9ff" stroke-width=".35"/><path d="M12 11.2 12 5" transform="rotate(0 12 12)" stroke="#b58ad8" stroke-width=".25" opacity=".7"/></g><g class="hp" style="--i:1"><path d="M12 12C9.3 10 8.4 5.4 12 2.9 15.6 5.4 14.7 10 12 12Z" transform="rotate(72 12 12)" fill="url(#pkP)" stroke="#ead9ff" stroke-width=".35"/><path d="M12 11.2 12 5" transform="rotate(72 12 12)" stroke="#b58ad8" stroke-width=".25" opacity=".7"/></g><g class="hp" style="--i:2"><path d="M12 12C9.3 10 8.4 5.4 12 2.9 15.6 5.4 14.7 10 12 12Z" transform="rotate(144 12 12)" fill="url(#pkP)" stroke="#ead9ff" stroke-width=".35"/><path d="M12 11.2 12 5" transform="rotate(144 12 12)" stroke="#b58ad8" stroke-width=".25" opacity=".7"/></g><g class="hp" style="--i:3"><path d="M12 12C9.3 10 8.4 5.4 12 2.9 15.6 5.4 14.7 10 12 12Z" transform="rotate(216 12 12)" fill="url(#pkP)" stroke="#ead9ff" stroke-width=".35"/><path d="M12 11.2 12 5" transform="rotate(216 12 12)" stroke="#b58ad8" stroke-width=".25" opacity=".7"/></g><g class="hp" style="--i:4"><path d="M12 12C9.3 10 8.4 5.4 12 2.9 15.6 5.4 14.7 10 12 12Z" transform="rotate(288 12 12)" fill="url(#pkP)" stroke="#ead9ff" stroke-width=".35"/><path d="M12 11.2 12 5" transform="rotate(288 12 12)" stroke="#b58ad8" stroke-width=".25" opacity=".7"/></g><g class="hc"><line x1="12" y1="12" x2="14.51" y2="12.67" stroke="#d9e27a" stroke-width=".35"/><circle cx="14.51" cy="12.67" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="13.84" y2="13.84" stroke="#d9e27a" stroke-width=".35"/><circle cx="13.84" cy="13.84" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="12.67" y2="14.51" stroke="#d9e27a" stroke-width=".35"/><circle cx="12.67" cy="14.51" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="11.33" y2="14.51" stroke="#d9e27a" stroke-width=".35"/><circle cx="11.33" cy="14.51" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="10.16" y2="13.84" stroke="#d9e27a" stroke-width=".35"/><circle cx="10.16" cy="13.84" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="9.49" y2="12.67" stroke="#d9e27a" stroke-width=".35"/><circle cx="9.49" cy="12.67" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="9.49" y2="11.33" stroke="#d9e27a" stroke-width=".35"/><circle cx="9.49" cy="11.33" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="10.16" y2="10.16" stroke="#d9e27a" stroke-width=".35"/><circle cx="10.16" cy="10.16" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="11.33" y2="9.49" stroke="#d9e27a" stroke-width=".35"/><circle cx="11.33" cy="9.49" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="12.67" y2="9.49" stroke="#d9e27a" stroke-width=".35"/><circle cx="12.67" cy="9.49" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="13.84" y2="10.16" stroke="#d9e27a" stroke-width=".35"/><circle cx="13.84" cy="10.16" r=".42" fill="#f4e58c"/><line x1="12" y1="12" x2="14.51" y2="11.33" stroke="#d9e27a" stroke-width=".35"/><circle cx="14.51" cy="11.33" r=".42" fill="#f4e58c"/><circle cx="12" cy="12" r="1.5" fill="#a8c95a"/></g></svg>',
 link:'<svg viewBox="0 0 24 24"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3.2-3.2a4.5 4.5 0 0 0-6.4-6.4L11.6 6M14 10a4.5 4.5 0 0 0-6.4 0l-3.2 3.2a4.5 4.5 0 0 0 6.4 6.4l1.6-1.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 eye:'<svg viewBox="0 0 24 24"><path d="M1.8 12S5.6 5.5 12 5.5 22.2 12 22.2 12 18.4 18.5 12 18.5 1.8 12 1.8 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
 fwd:'<svg viewBox="0 0 24 24"><path d="M13.5 5v4.2C6.8 10 3.6 14.4 3 19.5c2.6-3.4 5.8-5 10.5-5v4.3L21 12z" fill="currentColor"/></svg>',
 ok:'<svg viewBox="0 0 24 24"><path d="m12 1.8 2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 20l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2z" fill="#a259ff"/><path d="m8.3 11.3 2.6 2.6 4.8-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
function toast(t){var x=H("div","pp-toast",t); root.appendChild(x); requestAnimationFrame(function(){x.classList.add("on")}); setTimeout(function(){x.classList.remove("on"); setTimeout(function(){x.remove()},300)},2200)}

/* ---------- каркас ---------- */
var root=H("div","pp"); root.insertAdjacentHTML('afterbegin','<svg class="pp-defs" width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden"><defs><radialGradient id="pkH" cx="38%" cy="30%" r="80%"><stop offset="0" stop-color="#b48ae6"/><stop offset=".45" stop-color="#6b36a8"/><stop offset="1" stop-color="#2a0f4a"/></radialGradient><linearGradient id="pkS" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".5" stop-color="#c9cbd8"/><stop offset="1" stop-color="#8d90a6"/></linearGradient><radialGradient id="pkP" cx="50%" cy="85%" r="90%"><stop offset="0" stop-color="#2a0c3f"/><stop offset=".55" stop-color="#5b2584"/><stop offset="1" stop-color="#9a6ac8"/></radialGradient><radialGradient id="pkF" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9dae6"/></radialGradient></defs></svg>'); root.hidden=true; root.setAttribute("role","dialog"); root.setAttribute("aria-modal","true"); root.setAttribute("aria-label","Блог Поппи");
var bar=H("div","pp-bar"), body=H("div","pp-body");
root.appendChild(bar); root.appendChild(body); document.body.appendChild(root);
var view="grid", feedAt=null, prevOv="";

var tgDirect=false; /* канал открыт сразу (вкладкой, уведомлением, ссылкой): «назад» закрывает, а не ведёт в профиль Поппи */
function open(){
  if(!root.hidden) return; prevOv=document.documentElement.style.overflow;
  document.documentElement.style.overflow="hidden"; document.body.classList.add("pp-open");
  root.hidden=false; view="grid"; render(); root.scrollTop=0; hideNote(); markKnown();
  try{history.pushState({pp:1},"")}catch(e){} setHash(view==="tg"?"gossip":"poppy");
}
function close(fromPop){
  if(root.hidden) return; tgDirect=false; closeStory(); if(sheet) sheet.close(true); root.hidden=true; setHash(""); document.body.classList.remove("pp-open"); document.documentElement.style.overflow=prevOv;
  if(!fromPop){try{if(history.state&&history.state.pp) history.back()}catch(e){}}
}
window.addEventListener("popstate",function(){if(sheet){sheet.close(); try{history.pushState({pp:1},"")}catch(e){} return} if(story){closeStory(); return} if(root.hidden){if(/^#(poppy|gossip|pp-|g-)/.test(location.hash)) setHash(""); return} if(!root.hidden){ if(view==="tg"&&tgDirect){close(true); return} if(view!=="grid"){view="grid"; render(); try{history.pushState({pp:1},"")}catch(e){} } else close(true)}});
document.addEventListener("keydown",function(e){if(e.key!=="Escape"||root.hidden||story) return; if(view==="tg"&&tgDirect){close(); return} if(view!=="grid"){view="grid"; render(); root.scrollTop=0} else close()});
window.SFpoppy=open;

var wantAdmin=false;
try{wantAdmin=localStorage.getItem("sentfor_adm2")==="1"}catch(e){}
/* скрытый вход: 5 быстрых нажатий на «PoppyEm», затем кодовое слово (в коде хранится только его отпечаток) */
var ADMH="27582a89945237777d2da22d35529a0e6c5cba3588f5d26732727f208e298031", admTaps=[];
function admOk(w){if(!w||!window.crypto||!crypto.subtle||!window.TextEncoder) return Promise.resolve(false);
  return crypto.subtle.digest("SHA-256",new TextEncoder().encode(w.trim().toLowerCase())).then(function(b){return [].map.call(new Uint8Array(b),function(x){return ("0"+x.toString(16)).slice(-2)}).join("")===ADMH},function(){return false})}
function admTap(){var t=Date.now(); admTaps=admTaps.filter(function(x){return t-x<2500}); admTaps.push(t);
  if(admTaps.length>=5){admTaps=[]; if(live.admin) return; if(wantAdmin){paintAdmin(); adminLogin(); return}
    var w=prompt("…"); admOk(w).then(function(ok){if(!ok) return; wantAdmin=true; try{localStorage.setItem("sentfor_adm2","1")}catch(e){} paintAdmin(); adminLogin()})}}
/* ---------- админ: колокольчик с новыми комментариями со всех постов ---------- */
var IBX="sentfor_admin_seen", inbox={list:[],at:0,timer:0};
function inboxNew(){var seenAt=ls(IBX)||""; return inbox.list.filter(function(c){return c.created_at>seenAt})}
function loadInbox(force){
  if(!ON||!live.admin) return;
  if(!force&&Date.now()-inbox.at<45000) return;
  inbox.at=Date.now();
  SB.recentComments(80).then(function(r){
    var meId=SB.user()&&SB.user().id;
    inbox.list=(r||[]).filter(function(c){return !c.as_who&&c.user_id!==meId&&!/^hw-/.test(c.post_id)});
    paintBell();
  }).catch(function(){});
}
function paintBell(){
  var b=bar.querySelector(".pp-bell"); if(!b) return;
  var n=inboxNew().length; b.querySelector("i").textContent=n>99?"99+":n||""; b.classList.toggle("has",n>0);
  b.setAttribute("aria-label",n?"Новых комментариев: "+n:"Комментарии");
}
function postTitle(id){var p=POSTS.filter(function(x){return x.id===id})[0]; return p?(p.t||"").replace(/\s+/g," ").slice(0,40):id}
function openInbox(){
  if(sheet) sheet.close(true);
  var seenAt=ls(IBX)||"";
  var bg=H("div","pp-csheet-bg"), sh=H("div","pp-csheet"), hd=H("div","pp-cs-h"), grip=H("div","pp-cs-grip");
  sh.setAttribute("role","dialog"); sh.setAttribute("aria-modal","true"); sh.setAttribute("aria-label","Новые комментарии");
  hd.appendChild(grip); hd.appendChild(H("b",null,"Комментарии читателей"));
  var x=H("button","pp-cs-x","✕"); x.type="button"; x.setAttribute("aria-label","Закрыть"); hd.appendChild(x);
  var sc=H("div","pp-cs-list");
  if(!inbox.list.length) sc.appendChild(H("p","pp-cempty","Пока тихо 🤫"));
  inbox.list.forEach(function(c){
    var row=H("button","pp-ibx"+(c.created_at>seenAt?" new":"")); row.type="button";
    var p=POSTS.filter(function(x){return x.id===c.post_id})[0], th=p&&p.img&&p.img[0]!=="card"?p.img[0]:null;
    row.innerHTML='<span class="pp-av pp-av-e">'+esc(c.ava||"🌸")+'</span><span class="pp-ibx-t"><b>'+esc(c.nick||"гость")+'</b> '+esc(c.body)+
      '<small>'+esc(ago(c.created_at))+' · '+esc(postTitle(c.post_id))+(c.reply_to?' · ответ':'')+'</small></span>'+(th?'<img src="'+IMG+th+'.webp" alt="">':'');
    row.onclick=function(){shut(true); goToComments(c.post_id)};
    sc.appendChild(row)});
  sh.appendChild(hd); sh.appendChild(sc); bg.appendChild(sh); root.appendChild(bg);
  requestAnimationFrame(function(){bg.classList.add("on")});
  if(inbox.list.length) ls(IBX,inbox.list[0].created_at); paintBell();
  function shut(instant){if(sheet!==me3) return; sheet=null; document.removeEventListener("keydown",key,true); if(instant){bg.remove(); return} bg.classList.remove("on"); setTimeout(function(){bg.remove()},250)}
  function key(e){if(e.key==="Escape"){e.stopImmediatePropagation(); shut()}}
  var me3={close:shut}; sheet=me3; document.addEventListener("keydown",key,true);
  x.onclick=function(){shut()}; bg.addEventListener("click",function(e){if(e.target===bg) shut()});
  var sy=0, dy=0; hd.addEventListener("touchstart",function(e){sy=e.touches[0].clientY; dy=0},{passive:true});
  hd.addEventListener("touchmove",function(e){dy=Math.max(0,e.touches[0].clientY-sy); sh.style.transform="translateY("+dy+"px)"},{passive:true});
  hd.addEventListener("touchend",function(){sh.style.transform=""; if(dy>80) shut()},{passive:true});
}
var comOpen={};
function goToComments(id){
  if(!vis().some(function(p){return p.id===id})){toast("Этот пост открывается на более поздней серии"); return}
  view="feed"; feedAt=id; render();
  setTimeout(function(){if(comOpen[id]) comOpen[id](false)},350);
}
setInterval(function(){if(!root.hidden&&ON&&live.admin) loadInbox()},60000);
function paintAdmin(){
  var b=bar.querySelector(".pp-adm"); if(b) b.remove();
  var bl=bar.querySelector(".pp-bell"); if(bl) bl.remove();
  if(!ON) return;
  if(live.admin){bl=H("button","pp-bell"); bl.type="button"; bl.innerHTML='🔔<i></i>'; bl.onclick=function(){loadInbox(true); openInbox()}; bar.insertBefore(bl,bar.lastChild); paintBell(); loadInbox()}
  if(live.admin){b=H("button","pp-adm","админ ✓"); b.type="button"; b.onclick=function(){if(confirm("Выйти из админки?")){SB.logout(); live.admin=false; live.at=0; render(); loadLive(true)}}; bar.insertBefore(b,bar.lastChild)}
  else if(wantAdmin){b=H("button","pp-adm","войти"); b.type="button"; b.onclick=adminLogin; bar.insertBefore(b,bar.lastChild)}
}
function adminLogin(){
  var ov=H("div","pp-sheet-bg"), sh=H("form","pp-sheet");
  sh.innerHTML='<b class="pp-sh-t">Вход для админа</b><p class="pp-sh-s">Почта и пароль из Supabase</p>';
  var em=H("input","pp-sh-in"); em.type="email"; em.placeholder="почта"; em.autocomplete="username"; em.required=true;
  var pw=H("input","pp-sh-in"); pw.type="password"; pw.placeholder="пароль"; pw.autocomplete="current-password"; pw.required=true; pw.style.marginTop="8px";
  var ok=H("button","pp-btn pri","Войти"); ok.type="submit"; var cn=H("button","pp-btn","Отмена"); cn.type="button";
  var bt=H("div","pp-btns"); bt.appendChild(cn); bt.appendChild(ok);
  sh.appendChild(em); sh.appendChild(pw); sh.appendChild(bt); ov.appendChild(sh); root.appendChild(ov);
  cn.onclick=function(){ov.remove()};
  sh.onsubmit=function(e){e.preventDefault(); ok.disabled=true;
    SB.login(em.value.trim(),pw.value).then(function(){return SB.isAdmin()}).then(function(a){
      ov.remove(); if(!a){toast("Это не админский аккаунт"); SB.logout(); return}
      toast("Привет, Поппи 😏"); live.at=0; render(); loadLive(true)})
    .catch(function(){toast("Неверная почта или пароль"); ok.disabled=false})};
}
function setHash(h){try{var u=location.pathname+location.search+(h?"#"+h:""); if(location.pathname+location.search+location.hash!==u) history.replaceState(history.state,"",u)}catch(e){}}
function render(){
  if(sheet) sheet.close(true);
  if(!root.hidden) setHash(view==="tg"?"gossip":view==="feed"&&feedAt?"pp-"+feedAt:"poppy");
  bar.innerHTML=""; body.innerHTML=""; root.classList.toggle("tgv",view==="tg");
  if(view==="tg"){tgRender(); return}
  var back=H("button","pp-ic pp-back"); back.type="button"; back.innerHTML=ICON.back; back.setAttribute("aria-label",view==="feed"?"Назад к профилю":"Вернуться к доске");
  back.onclick=function(){if(view==="feed"){view="grid"; render(); root.scrollTop=0} else close()};
  bar.appendChild(back);
  var tt=H("div","pp-bar-t"); tt.innerHTML=view==="feed"?'<small>PoppyEm</small><b>Публикации</b>':'<b>PoppyEm</b>'+ICON.ok;
  tt.addEventListener("click",admTap);
  bar.appendChild(tt);
  var ex=H("button","pp-exit","к доске ✕"); ex.type="button"; ex.onclick=function(){close()}; bar.appendChild(ex);
  if(view==="grid") profile(); else feed();
  paintAdmin();
}

/* ---------- профиль ---------- */
function profile(){
  var list=vis(), w=H("div","pp-prof");
  var top=H("div","pp-top");
  var hasSt=nowFrames().length>0;
  var ring=H("button","pp-ring"+(hasSt?"":" none")+(nowUnseen()?" new":"")+(nowFrames().some(function(f){return f.cf})?" cf":"")); ring.type="button"; ring.setAttribute("aria-label",hasSt?"Сторис Поппи":"Поппи");
  ring.appendChild(av(IMG+"avatar3.webp","pp-av big")); ring.onclick=function(){if(!nowFrames().length) return; ring.classList.add("load"); setTimeout(function(){ring.classList.remove("load"); openStory(NOW)},650)}; top.appendChild(ring);
  var st=H("div","pp-stats");
  [[list.length,"публикации"],[fmt(2846+(follow?1:0)),"подписчики"],[112,"подписки"]].forEach(function(s,k){var d=H("div"); d.innerHTML="<b>"+s[0]+"</b><span>"+s[1]+"</span>"; st.appendChild(d); if(!k) delTaps(d,list.length)});
  top.appendChild(st); w.appendChild(top);
  var bio=H("div","pp-bio");
  bio.innerHTML='<b>Поппи</b><span class="pp-cat">Блогер</span>Завидуйте молча 💋<br><button type="button" class="pp-loc pp-locbtn">📍 Сентфор</button><br>';
  bio.querySelector(".pp-locbtn").onclick=function(){geo("")};
  if(TG.length){var lnk=H("button","pp-link"); lnk.type="button"; lnk.innerHTML=ICON.link+"<span>t.me/sentfor_gossip</span>"; lnk.setAttribute("aria-label","Открыть канал «Сплетни Сентфора»"); lnk.onclick=function(){view="tg"; tgFocus=null; render()}; bio.appendChild(lnk)}
  w.appendChild(bio);
  var btns=H("div","pp-btns");
  var f=H("button","pp-btn"+(follow?"":" pri"),follow?"Вы подписаны":"Подписаться"); f.type="button";
  f.onclick=function(){follow=!follow; ls(FK,follow); if(follow) markKnown(); render(); toast(follow?"Поппи заметила 😏 Теперь ты узнаешь о её новых постах":"Вы отписались. Уведомлений больше не будет")};
  var m=H("button","pp-btn","Сообщение"); m.type="button"; m.onclick=function(){toast("Поппи не отвечает незнакомцам 💅")};
  btns.appendChild(f); btns.appendChild(m); w.appendChild(btns);
  var hl=H("div","pp-hl"), r=rd();
  HL.filter(function(h){return h.ep<=r&&hlFrames(h).length}).forEach(function(h){
    var b=H("button","pp-hl-i"); b.type="button";
    var c=H("span","pp-hl-c"); c.appendChild(av(IMG+h.cover+".webp","pp-hl-img")); b.appendChild(c); b.appendChild(H("span","pp-hl-n",h.n));
    b.onclick=function(){openStory(h)}; hl.appendChild(b)});
  w.appendChild(hl);
  var tabs=H("div","pp-tabs"), gt=H("span","pp-tab on"); gt.innerHTML=ICON.grid; gt.setAttribute("aria-label","Публикации"); tabs.appendChild(gt);
  w.appendChild(tabs);
  var g=H("div","pp-grid");
  list.forEach(function(p){
    var b=H("button","pp-cell"); b.type="button"; b.setAttribute("aria-label","Открыть пост: "+p.t);
    if(p.img[0]==="card") b.insertAdjacentHTML("beforeend",cardHTML(p,true)); else {var i=new Image(); i.loading="lazy"; i.src=IMG+p.img[0]+".webp"; i.alt="";  i.decoding="async"; b.appendChild(i)}
    if(p.vid){var vi=H("span","pp-multi pp-reel","▶"); b.appendChild(vi)} else if(p.img.length>1){var mi=H("span","pp-multi"); mi.innerHTML=ICON.multi; b.appendChild(mi)} if(p.cf){var cs=H("span","pp-cf-dot"); cs.innerHTML=ICON.star; cs.setAttribute("aria-label","Близкие друзья"); b.appendChild(cs)}
    b.onclick=function(){view="feed"; feedAt=p.id; render()};
    g.appendChild(b)});
  w.appendChild(g);
  if(!list.length) w.appendChild(H("p","pp-empty","Пока пусто. Поппи ещё думает, что выложить 💅"));
  w.appendChild(H("p","pp-note","Это фанатский блог персонажа. Фото сгенерированы, комментарии героев придуманы."));
  body.appendChild(w);
}

/* ---------- лента ---------- */
function feed(){
  var w=H("div","pp-feed"), target=null;
  vis().forEach(function(p){var el=post(p); w.appendChild(el); if(p.id===feedAt) target=el});
  body.appendChild(w);
  if(target) requestAnimationFrame(function(){root.scrollTop=target.offsetTop-bar.offsetHeight});
  loadLive();
}
function liked(id){return !!likes[id]}
/* видео в посте: играет само без звука, тап — звук с начала, ещё тап — снова без звука */
function postVideo(p){
  var v=H("video","pp-vid"); v.muted=true; v.loop=true; v.playsInline=true; v.setAttribute("playsinline",""); v.setAttribute("muted",""); v.preload="metadata"; v.poster=IMG+p.img[0]+".webp";
  [["mp4","video/mp4"],["webm","video/webm"]].forEach(function(x){var so=H("source"); so.src="video/"+p.vid+"."+x[0]+"?v=1"; so.type=x[1]; v.appendChild(so)});
  var w=H("div","pp-vid-w"), snd=H("span","pp-vid-snd"); function paint(){snd.textContent=v.muted?"🔇":"🔊"} v._paint=paint; paint();
  w.onclick=function(){if(v.muted){v.muted=false; try{v.currentTime=0}catch(e){}} else v.muted=true; var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){}); paint()};
  w.appendChild(v); w.appendChild(snd);
  if(tgIO) tgIO.observe(v); else v.autoplay=true;
  return w;
}
function post(p){
  var a=H("article","pp-post"); a.id="pp-"+p.id;
  var hd=H("header","pp-ph"); hd.appendChild(av(IMG+"avatar3.webp"));
  var nm=H("div","pp-ph-t"); nm.innerHTML='<b>PoppyEm '+ICON.ok+'</b>'; if(p.cf){var cf=H("span","pp-cf"); cf.innerHTML=ICON.star+"<span>Близкие друзья</span>"; nm.appendChild(cf)}
  if(p.loc){var lc=H("button","pp-geo"); lc.type="button"; lc.innerHTML=ICON.pin+"<span>"+esc(p.loc[1])+"</span>"; lc.onclick=function(){geo(p.loc[0])}; nm.appendChild(lc)}
  hd.appendChild(nm); a.appendChild(hd);
  /* фото: карусель */
  var media=H("div","pp-media"), track=H("div","pp-track"); if(p.ar) media.style.aspectRatio=p.ar;
  p.img.forEach(function(n,i){var s=H("div","pp-slide"+(p.fit&&p.fit[n]?" fit":""));
    if(n==="card"){s.innerHTML=cardHTML(p,false); track.appendChild(s); return}
    if(p.vid&&i===0){s.appendChild(postVideo(p)); track.appendChild(s); return}
    var im=new Image(); im.src=IMG+n+".webp"; im.alt=p.t; im.loading=i?"lazy":"eager"; im.decoding="async"; s.appendChild(im);
    if(i===0&&p.head) s.insertAdjacentHTML("beforeend",'<div class="pp-head '+(catOf(p)==="gossip"?"gossip":"news")+'"><b>'+(catOf(p)==="gossip"?"🤫 СПЛЕТНИ":"🚨 НОВОСТИ")+'</b><span>'+esc(p.head)+'</span></div>');
    track.appendChild(s)});
  media.appendChild(track);
  if(p.song){var sg=H("div","pp-song"); sg.innerHTML='<i class="pp-eq"><b></b><b></b><b></b></i>'+esc(p.song[0])+" · "+esc(p.song[1]); media.appendChild(sg)}
  var heart=H("div","pp-burst"); heart.innerHTML='<div class="pb-heart">'+ICON.heartF+'</div><div class="pb-fl">'+ICON.hell+'</div>'+[1,2,3,4].map(function(n){return '<div class="pb-mini m'+n+'">'+ICON.hell+'</div>'}).join(""); media.appendChild(heart);
  if(p.img.length>1){
    var cnt=H("span","pp-cnt","1/"+p.img.length); media.appendChild(cnt);
    var dots=H("div","pp-dots"); p.img.forEach(function(_,i){dots.appendChild(H("i",i?"":"on"))});
    track.addEventListener("scroll",function(){var i=Math.round(track.scrollLeft/track.clientWidth); cnt.textContent=(i+1)+"/"+p.img.length; [].forEach.call(dots.children,function(d,j){d.className=j===i?"on":""})},{passive:true});
    var pv=H("button","pp-nav l","‹"), nx=H("button","pp-nav r","›"); pv.type=nx.type="button"; pv.setAttribute("aria-label","Предыдущее фото"); nx.setAttribute("aria-label","Следующее фото");
    pv.onclick=function(){track.scrollBy({left:-track.clientWidth,behavior:"smooth"})}; nx.onclick=function(){track.scrollBy({left:track.clientWidth,behavior:"smooth"})};
    media.appendChild(pv); media.appendChild(nx);
  }
  /* двойное касание — лайк */
  var lastTap=0; media.addEventListener("click",function(e){if(e.target.closest(".pp-nav")) return; var t=Date.now(); if(t-lastTap<320){if(!isOn()) toggleLike(); heart.classList.remove("go"); void heart.offsetWidth; heart.classList.add("go")} lastTap=t});
  a.appendChild(media);
  if(p.img.length>1) a.appendChild(dots);
  /* действия */
  var act=H("div","pp-act");
  var lb=H("button","pp-ic pp-like"); lb.type="button";
  var cb=H("button","pp-ic"); cb.type="button"; cb.innerHTML=ICON.com; cb.setAttribute("aria-label","Комментировать");
  var sb=H("button","pp-ic"); sb.type="button"; sb.innerHTML=ICON.send; sb.setAttribute("aria-label","Поделиться");
  var sv=H("button","pp-ic pp-save"); sv.type="button"; sv.innerHTML=ICON.save; sv.setAttribute("aria-label","Сохранить");
  act.appendChild(lb); act.appendChild(cb); act.appendChild(sb); act.appendChild(sv); a.appendChild(act);
  var lk=H("div","pp-likes");
  function isOn(){return ON?!!live.mine[p.id]:liked(p.id)}
  function count(){return ON?p.likes+(live.counts[p.id]||0):p.likes+(liked(p.id)?1:0)}
  function paint(){var on=isOn(); lb.innerHTML=on?ICON.heartF:ICON.heart; lb.classList.toggle("on",on); lb.setAttribute("aria-label",on?"Убрать лайк":"Нравится"); lk.innerHTML="Нравится: <b>"+fmt(count())+"</b>"}
  function bump(){lb.classList.remove("pop"); void lb.offsetWidth; lb.classList.add("pop");
    if(isOn()){var fx=H("span","pp-like-fx"); fx.innerHTML=ICON.hell; lb.appendChild(fx); setTimeout(function(){fx.remove()},1300)}}
  function toggleLike(){
    if(!ON){if(likes[p.id]) delete likes[p.id]; else likes[p.id]=1; ls(LK,likes); paint(); bump(); return}
    var was=!!live.mine[p.id];
    if(was){delete live.mine[p.id]; live.counts[p.id]=Math.max(0,(live.counts[p.id]||1)-1)} else {live.mine[p.id]=1; live.counts[p.id]=(live.counts[p.id]||0)+1}
    paint(); bump();
    (was?SB.unlike(p.id):SB.like(p.id)).catch(function(e){
      if(was){live.mine[p.id]=1; live.counts[p.id]=(live.counts[p.id]||0)+1} else {delete live.mine[p.id]; live.counts[p.id]=Math.max(0,(live.counts[p.id]||1)-1)}
      paint(); toast(errText(e))});
  }
  lb.onclick=toggleLike; paint();
  sb.onclick=function(){var u=location.origin+location.pathname+"#pp-"+p.id; try{navigator.clipboard.writeText(u); toast("Ссылка скопирована")}catch(e){toast("Не получилось скопировать")}};
  sv.onclick=function(){sv.classList.toggle("on"); toast(sv.classList.contains("on")?"Сохранено":"Убрано из сохранённого")};
  a.appendChild(lk);
  var cap=H("p","pp-cap"); cap.innerHTML="<b>PoppyEm</b> "+rich(p.t); a.appendChild(cap);
  if(p.by){var by=document.createElement("a"); by.className="pp-by"; by.href=p.by[1]; by.target="_blank"; by.rel="noopener"; by.textContent=(p.vid?"🎬":"📸")+" made by @"+p.by[0]+" - спасибо 💜"; a.appendChild(by)}
  /* комментарии */
  var cl=H("div","pp-coms"), replyTo=null;
  function hero(who,txt){
    var row=H("div","pp-com"+(who==="poppy"?" own":"")), u=WHO[who];
    row.appendChild(av(u.a));
    var t=H("p"); t.innerHTML="<b>"+esc(u.n)+"</b>"+(u.v?ICON.ok:"")+(u.e?" "+u.e:"")+" "+rich(txt);
    row.appendChild(t); cl.appendChild(row)}
  function localLine(txt){
    var row=H("div","pp-com"); row.appendChild(H("span","pp-av pp-av-e",me.ava));
    var t=H("p"); t.innerHTML="<b>"+esc(me.nick)+"</b> "+rich(txt)+'<small>видно только тебе · тест</small>'; row.appendChild(t); cl.appendChild(row)}
  function liveLine(c,isReply){
    var u=c.as_who&&WHO[c.as_who], row=H("div","pp-com"+(c.as_who==="poppy"?" own":"")+(isReply?" reply":""));
    if(u) row.appendChild(av(u.a)); else row.appendChild(H("span","pp-av pp-av-e",c.ava||"🌸"));
    var name=u?u.n:(c.nick||"гость"), t=H("p");
    t.innerHTML="<b>"+esc(name)+"</b>"+(u&&u.v?ICON.ok:"")+(!u&&window.SFseer&&SFseer(c.nick)?'<span class="seer-badge s'+SFseer(c.nick)+'" title="Провидец Сентфора · '+SFseer(c.nick)+' место">'+["","🔮","🕯","🕵️"][SFseer(c.nick)]+'</span>':"")+" "+rich(c.body)+(c.hearted?'<span class="pp-hearted" title="Нравится Поппи">❤️ от Поппи</span>':"");
    var meta=H("small","pp-cmeta"); meta.appendChild(H("span","",ago(c.created_at)));
    var mine=SB.user()&&c.user_id===SB.user().id;
    function btn(lbl,fn,cls){var b=H("button","pp-cbtn"+(cls?" "+cls:""),lbl); b.type="button"; b.onclick=function(e){e.stopPropagation(); fn(b)}; meta.appendChild(b)}
    btn("Ответить",function(){replyTo=c.reply_to||c.id; inp.value="@"+name+" "; inp.focus(); go.disabled=false});
    if(mine||live.admin) btn("Удалить",function(){if(!confirmTap(row)) return; SB.delComment(c.id).then(function(){loadLive(true)}).catch(function(e){toast(errText(e))})},"warn");
    if(!mine&&!live.admin) btn("Пожаловаться",function(b){SB.report(c.id).then(function(){b.textContent="Отправлено"; b.disabled=true}).catch(function(e){toast(errText(e))})});
    if(live.admin){
      btn(c.hearted?"Убрать ❤️":"❤️",function(){SB.setComment(c.id,{hearted:!c.hearted}).then(function(){loadLive(true)}).catch(function(e){toast(errText(e))})});
      btn("Скрыть",function(){SB.setComment(c.id,{hidden:true}).then(function(){loadLive(true)}).catch(function(e){toast(errText(e))})},"warn");
      if(!c.as_who&&!mine) btn("Бан",function(){if(!confirmTap(row,"Забанить "+name+"? Все его комментарии скроются.")) return; SB.ban(c.user_id).then(function(){toast(name+" забанен"); loadLive(true)}).catch(function(e){toast(errText(e))})},"warn");
      if(c.reports) meta.appendChild(H("span","pp-rep","🚩 "+c.reports));

    }
    t.appendChild(meta); row.appendChild(t); cl.appendChild(row)}
  function renderComs(){
    cl.innerHTML="";
    var hs=p.c.filter(heroVis); hs.forEach(function(c){hero(c[0],c[1])});
    var n=hs.length;
    if(!ON){var lc=mine[p.id]||[]; lc.forEach(localLine); n+=lc.length; paintMore(n); return}
    var list=(live.coms[p.id]||[]).filter(function(c){return live.admin||c.ep<=rd()});
    var tops=list.filter(function(c){return !c.reply_to||!list.some(function(x){return x.id===c.reply_to})});
    tops.forEach(function(c){liveLine(c,false); list.filter(function(x){return x.reply_to===c.id}).forEach(function(x){liveLine(x,true)})});
    n+=list.length; paintMore(n);
    if(!cl.children.length) cl.appendChild(H("p","pp-cempty","Пока нет комментариев. Будь первым 💬"));
  }
  /* в ленте — только ссылка, сами комменты открываются панелью снизу, как в инсте */
  var more=H("button","pp-more"); more.type="button";
  function paintMore(n){more.textContent=n?(n===1?"Посмотреть 1 комментарий":"Посмотреть все комментарии ("+n+")"):"Добавить комментарий…"}
  more.onclick=function(){openComs(false)};
  var hold=H("div"); hold.hidden=true;
  function openComs(focus){
    if(sheet) sheet.close(true);
    var bg=H("div","pp-csheet-bg"), sh=H("div","pp-csheet"), hd=H("div","pp-cs-h"), grip=H("div","pp-cs-grip");
    sh.setAttribute("role","dialog"); sh.setAttribute("aria-modal","true"); sh.setAttribute("aria-label","Комментарии");
    hd.appendChild(grip); hd.appendChild(H("b",null,"Комментарии"));
    var x=H("button","pp-cs-x","✕"); x.type="button"; x.setAttribute("aria-label","Закрыть"); hd.appendChild(x);
    var sc=H("div","pp-cs-list"); sc.appendChild(cl);
    sh.appendChild(hd); sh.appendChild(sc); sh.appendChild(fm); bg.appendChild(sh); root.appendChild(bg);
    requestAnimationFrame(function(){bg.classList.add("on")});
    function shut(instant){
      if(sheet!==me2) return; sheet=null; document.removeEventListener("keydown",key,true);
      hold.appendChild(cl); hold.appendChild(fm);
      if(instant){bg.remove(); return}
      bg.classList.remove("on"); setTimeout(function(){bg.remove()},250)}
    function key(e){if(e.key==="Escape"){e.stopImmediatePropagation(); shut()}}
    var me2={close:shut}; sheet=me2;
    document.addEventListener("keydown",key,true);
    x.onclick=function(){shut()}; bg.addEventListener("click",function(e){if(e.target===bg) shut()});
    var sy=0, dy=0; hd.addEventListener("touchstart",function(e){sy=e.touches[0].clientY; dy=0},{passive:true});
    hd.addEventListener("touchmove",function(e){dy=Math.max(0,e.touches[0].clientY-sy); sh.style.transform="translateY("+dy+"px)"},{passive:true});
    hd.addEventListener("touchend",function(){sh.style.transform=""; if(dy>80) shut()},{passive:true});
    loadLive();
    if(focus) setTimeout(function(){inp.focus()},260);
  }
  live.ui[p.id]=function(){if(document.body.contains(a)){paint(); renderComs(); paintForm()} else delete live.ui[p.id]};
  a.appendChild(more);
  a.appendChild(H("div","pp-time",p.d+" назад"));
  a.appendChild(hold); hold.appendChild(cl);
  /* поле ввода */
  var fm=H("form","pp-form"), whoSel=null;
  var inp=H("input"); inp.type="text"; inp.maxLength=300; inp.placeholder="Добавьте комментарий…"; inp.setAttribute("aria-label","Комментарий");
  var go=H("button","pp-post-btn","Опубликовать"); go.type="submit"; go.disabled=true;
  inp.oninput=function(){go.disabled=!inp.value.trim(); if(!inp.value) replyTo=null};
  function paintForm(){
    if(ON&&live.admin&&!whoSel){whoSel=H("select","pp-who"); whoSel.setAttribute("aria-label","От чьего имени");
      Object.keys(WHO).forEach(function(k){var o=H("option","",WHO[k].n); o.value=k; whoSel.appendChild(o)}); fm.insertBefore(whoSel,inp)}
    if(whoSel&&!live.admin){whoSel.remove(); whoSel=null}
  }
  fm.appendChild(inp); fm.appendChild(go); paintForm();
  fm.onsubmit=function(e){e.preventDefault(); var v=inp.value.trim(); if(!v) return;
    if(!ON){var send=function(){(mine[p.id]=mine[p.id]||[]).push(v); ls(CK,mine); localLine(v); inp.value=""; go.disabled=true}; if(me) send(); else askNick(send); return}
    var post2=function(){
      go.disabled=true; inp.disabled=true;
      var body={post_id:p.id,body:v,ep:Math.max(1,Math.min(40,rd()))}; if(replyTo) body.reply_to=replyTo; if(live.admin&&whoSel) body.as_who=whoSel.value;
      SB.addComment(body).then(function(){inp.value=""; replyTo=null; return loadLive(true)})
        .catch(function(e){toast(errText(e))}).finally(function(){inp.disabled=false; go.disabled=!inp.value.trim()});
    };
    if(live.admin||live.me) post2(); else askNick(post2);
  };
  cb.onclick=function(){openComs(true)}; comOpen[p.id]=openComs;
  hold.appendChild(fm); renderComs();
  return a;
}
function dz(s){try{return decodeURIComponent(escape(atob(s.split("").reverse().join(""))))}catch(e){return s}}
var delN=0, delT=null, delBusy=false;
function delTaps(d,n){d.addEventListener("click",function(){if(delBusy) return; delN++; clearTimeout(delT); delT=setTimeout(function(){delN=0},1400); if(delN>=3){delN=0; delPost(d,n)}})}
function delPost(d,n){delBusy=true; var b=d.querySelector("b"); b.textContent=n+1; d.classList.add("pp-glitch");
  var g=root.querySelector(".pp-grid"), cell=H("button","pp-cell pp-ghost"); cell.type="button"; var ci=new Image(); ci.src=IMG+"p0x3.webp"; ci.onerror=function(){ci.onerror=null; ci.src="img/forest.webp"}; ci.alt=""; cell.appendChild(ci); if(g) g.insertBefore(cell,g.firstChild);
  setTimeout(function(){
    var o=H("div","pp-del"), card=H("div","pp-del-c"), hd=H("div","pp-del-h"); hd.appendChild(av(IMG+"avatar3.webp","pp-av")); hd.appendChild(H("b","","poppy.emerson")); hd.appendChild(H("span","","только что")); card.appendChild(hd);
    var ph=H("div","pp-del-ph"), im=new Image(); im.src=ci.src; im.alt=""; ph.appendChild(im); ph.appendChild(H("i","pp-del-fl")); card.appendChild(ph);
    card.appendChild(H("p","pp-del-t",dz("=wY0CGNsQLL0LGNtQDL07CtuQvY0yCNI+CtgR3Y0gAL07C9iRHL0gAL09CttQvL0+CNtQDStQ3L0"))); o.appendChild(card); root.appendChild(o);
    requestAnimationFrame(function(){o.classList.add("on")});
    setTimeout(function(){card.classList.add("gl")},2600);
    setTimeout(function(){card.innerHTML=""; card.classList.remove("gl"); card.classList.add("gone"); card.appendChild(H("b","","Публикация недоступна")); card.appendChild(H("span","","Возможно, её удалили или ограничили к ней доступ."))},3900);
    setTimeout(function(){o.classList.remove("on"); cell.remove(); b.textContent=n; d.classList.remove("pp-glitch")},6200);
    setTimeout(function(){o.remove(); delBusy=false; if(window.SFegg) SFegg("g19")},6700)},700)}
function confirmTap(row,msg){return window.confirm(msg||"Удалить комментарий?")}
function geo(id){
  if(window.SFmapAllowed&&SFmapAllowed()&&window.SFmapOpen){close(); setTimeout(function(){SFmapOpen(id)},60)}
  else toast("Карта откроется, когда дочитаешь до 19-й серии 🗺")
}

/* герой комментирует, только если уже появился в сюжете; ответ Поппи на скрытый коммент тоже прячем */
var WEP={olivia:3,alice:2,liam:2,abigail:6};
function heroVis(c){var r=rd(); if((WEP[c[0]]||1)>r) return false;
  var m=/^@(\S+)/.exec(c[1]); if(m){for(var k in WHO){if(WHO[k].n===m[1]&&(WEP[k]||1)>r) return false}} return true}

/* ---------- ник для комментариев (без регистрации) ---------- */
var AVS=["🌸","🦉","🐺","🏍","🍿","🎭","🖤","🍒","🔦","👻"];
function askNick(done){
  var ov=H("div","pp-sheet-bg"), sh=H("form","pp-sheet");
  sh.innerHTML='<b class="pp-sh-t">Как тебя подписать?</b><p class="pp-sh-s">Без регистрации: просто ник и аватарка. Мы храним только их — без почты и телефона.</p>';
  if(me&&me.nick) setTimeout(function(){inp.value=me.nick},0);
  var inp=H("input","pp-sh-in"); inp.type="text"; inp.maxLength=20; inp.placeholder="Ник, например sentfor_fan"; inp.required=true; inp.setAttribute("aria-label","Ник");
  var pick=AVS[0], row=H("div","pp-sh-av");
  AVS.forEach(function(a,i){var b=H("button",i?"":"on",a); b.type="button"; b.setAttribute("aria-label","Аватарка "+a); b.onclick=function(){pick=a; [].forEach.call(row.children,function(x){x.className=x===b?"on":""})}; row.appendChild(b)});
  var ok=H("button","pp-btn pri","Готово"); ok.type="submit";
  var cn=H("button","pp-btn","Отмена"); cn.type="button";
  var bt=H("div","pp-btns"); bt.appendChild(cn); bt.appendChild(ok);
  sh.appendChild(inp); sh.appendChild(row); sh.appendChild(bt); ov.appendChild(sh); root.appendChild(ov);
  setTimeout(function(){inp.focus()},50);
  function rm(){ov.remove()}
  cn.onclick=rm; ov.onclick=function(e){if(e.target===ov) rm()};
  sh.onsubmit=function(e){e.preventDefault(); var n=inp.value.trim().replace(/\s+/g,"_").replace(/[^\wа-яё.]/gi,""); if(!n){inp.focus(); return}
    if(!ON){me={nick:n,ava:pick}; ls(MK,me); rm(); done(); return}
    ok.disabled=true; ok.textContent="…";
    SB.saveProfile(n,pick).then(function(){live.me={nick:n,ava:pick}; me=live.me; ls(MK,me); rm(); done()})
      .catch(function(err){toast(errText(err)); ok.disabled=false; ok.textContent="Готово"; inp.focus()})};
}

/* ---------- сторис ---------- */
var story=null, stSound=true, ghostUntil=0, sheet=null;
/* iPhone после касания присылает ещё и «клик» в ту же точку: если сторис уже закрылись, он открыл бы пост под пальцем */
root.addEventListener("click",function(e){if(Date.now()<ghostUntil&&!(story&&story.ov.contains(e.target))){e.stopPropagation(); e.preventDefault()}},true);
function hlFrames(h){var r=rd(); return h.fr.filter(function(f){return !f.ep||f.ep<=r})}
function nowFrames(){var r=rd(); return NOW.fr.filter(function(f){return f.ep<=r&&stAlive(f)})}
function nowUnseen(){var k=seen.keys||[]; return nowFrames().some(function(f){return k.indexOf(skey(f))<0})}
function openStory(src){
  var fr=src===NOW?nowFrames():hlFrames(src); if(!fr.length) return;
  closeStory();
  var ov=H("div","pp-st"), frame=H("div","pp-st-f"), bars=H("div","pp-st-bars"), hd=H("div","pp-st-h"), stage=H("div","pp-st-stage");
  fr.forEach(function(){var b=H("i"); b.appendChild(H("b")); bars.appendChild(b)});
  hd.appendChild(av(IMG+"avatar3.webp")); var hn=H("span","pp-st-n"); hd.appendChild(hn);
  var x=H("button","pp-st-x","✕"); x.type="button"; x.setAttribute("aria-label","Закрыть"); hd.appendChild(x);
  frame.appendChild(stage); frame.appendChild(bars); frame.appendChild(hd); ov.appendChild(frame); root.appendChild(ov);
  var i=0, t0=0, el=0, dur=5000, raf=0, paused=false, ready=false, curV=null;
  story={ov:ov,stop:function(){cancelAnimationFrame(raf); if(curV){try{curV.pause()}catch(e){}}}};
  if(src===NOW){seen.keys=nowFrames().map(skey); ls(SK,seen)}
  function hop(d){if(src===NOW){if(d>0) closeStory(); return false}
    var list=HL.filter(function(h){return h.ep<=rd()&&hlFrames(h).length}), k=list.indexOf(src)+d;
    if(k>=0&&k<list.length){openStory(list[k]); ghostUntil=0; return true}
    if(d>0) closeStory(); return false}
  function fwd(){if(i<fr.length-1) show(i+1); else hop(1)}
  function bck(){if(i>0) show(i-1); else if(!hop(-1)) show(0)}
  function show(n){
    i=n; el=0; ready=false; dur=5000; if(curV){try{curV.pause()}catch(e){} curV=null} stage.innerHTML="";
    [].forEach.call(bars.children,function(b,j){b.firstChild.style.width=j<i?"100%":"0%"});
    var f=fr[i]; hn.innerHTML="<b>PoppyEm</b> <small>"+(src===NOW?stLabel(f):(f.d||src.n||""))+"</small>"+(f.cf?'<span class="pp-cf pp-st-cf">'+ICON.star+"<span>Близкие друзья</span></span>":"");
    if(f.img){
      var bg=new Image(); bg.className="pp-st-bg"; bg.src=IMG+f.img+".webp"; bg.alt=""; stage.appendChild(bg);
      var im=new Image(); im.className="pp-st-img"; im.src=IMG+f.img+".webp"; im.alt=""; stage.appendChild(im);
      var go=function(){ready=true; t0=performance.now()};
      if(im.complete&&im.naturalWidth) go(); else {im.onload=go; im.onerror=go}
      if(f.txt) stage.appendChild(H("div","pp-st-txt"+(f.song?" up":""),f.txt));
      if(f.song){var sg=H("div","pp-st-song"); sg.innerHTML='<span class="pp-st-cov">🎧</span><span><b>'+esc(f.song[1])+'</b><small>'+esc(f.song[0])+'</small></span><i class="pp-eq"><b></b><b></b><b></b></i>'; stage.appendChild(sg)}
    } else if(f.vid){
      var vd=document.createElement("video"); vd.className="pp-st-vid"; vd.playsInline=true; vd.setAttribute("playsinline",""); vd.preload="auto"; if(f.poster) vd.poster=IMG+f.poster+".webp";
      ["mp4","webm"].forEach(function(t){var so=document.createElement("source"); so.src="video/"+f.vid+"."+t+"?v=1"; so.type="video/"+t; vd.appendChild(so)});
      stage.appendChild(vd); curV=vd;
      var sb=H("button","pp-st-snd"); sb.type="button";
      function paintS(){sb.textContent=vd.muted?"🔇 включить звук":"🔊"}
      sb.onclick=function(e){e.stopPropagation(); vd.muted=!vd.muted; stSound=!vd.muted; paintS(); if(vd.paused&&!paused){var q=vd.play(); if(q&&q.catch) q.catch(function(){})}};
      stage.appendChild(sb);
      vd.muted=!stSound; paintS();
      vd.addEventListener("playing",function(){ready=true});
      vd.addEventListener("ended",function(){if(curV!==vd) return; fwd()});
      vd.addEventListener("error",function(){ready=true; t0=performance.now()},true);
      var pp=vd.play(); if(pp&&pp.catch) pp.catch(function(){vd.muted=true; paintS(); var q=vd.play(); if(q&&q.catch) q.catch(function(){ready=true; t0=performance.now()})});
      if(f.mid) vd.style.objectPosition="50% 50%";
      if(f.txt) stage.appendChild(H("div","pp-st-txt"+(f.mid?" low":""),f.txt));
      if(f.by){var by=document.createElement("a"); by.className="pp-st-by"; by.href=f.by[1]; by.target="_blank"; by.rel="noopener"; by.textContent="🎬 видео: @"+f.by[0]; by.onclick=function(e){e.stopPropagation()}; stage.appendChild(by)}
    } else if(f.tweet){
      var tw=H("div","pp-st-tw");
      tw.innerHTML='<div class="tw"><div class="tw-h"><img src="'+((window.SF&&SF.img)?SF.img("img/nadin.webp"):"img/nadin.webp")+'" alt=""><span><b>Nadine Ross</b><small>@nadineross</small></span></div><p>Что может быть хуже разбитого сердца? 💔</p></div>'+
        '<div class="tw rep"><div class="tw-h"><img src="'+IMG+'avatar.webp" alt=""><span><b>Poppy</b><small>@PoppyEm</small></span></div><p>Проснуться утром.</p></div><div class="pp-st-cap">ну а что 🤷‍♀️</div>';
      stage.appendChild(tw); ready=true; t0=performance.now();
    } else {
      stage.appendChild(H("div","pp-st-text",f.text)); ready=true; t0=performance.now();
    }
  }
  function tick(now){
    raf=requestAnimationFrame(tick);
    if(curV&&curV.duration&&!curV.error){
      if(paused){if(!curV.paused) curV.pause(); return}
      if(curV.paused&&!curV.ended&&ready){var q=curV.play(); if(q&&q.catch) q.catch(function(){})}
      bars.children[i].firstChild.style.width=(Math.min(1,curV.currentTime/curV.duration)*100)+"%"; return}
    if(!ready||paused){t0=now-el; return}
    el=now-t0; var k=Math.min(1,el/dur); bars.children[i].firstChild.style.width=(k*100)+"%";
    if(k>=1){ fwd() }
  }
  show(0); raf=requestAnimationFrame(tick);
  /* управление: тап слева/справа, удержание — пауза, свайп вниз — закрыть */
  var sx=0, sy=0, down=0, moved=false;
  frame.addEventListener("pointerdown",function(e){if(e.target.closest(".pp-st-x,.pp-st-snd,.pp-st-by")) return; sx=e.clientX; sy=e.clientY; down=Date.now(); moved=false; paused=true});
  frame.addEventListener("pointermove",function(e){if(!down) return; var dy=e.clientY-sy; if(dy>10){moved=true; frame.style.transform="translateY("+dy+"px)"; frame.style.opacity=String(Math.max(.4,1-dy/500))}});
  function up(e){if(!down) return; var dy=e.clientY-sy, held=Date.now()-down; down=0; paused=false; frame.style.transform=""; frame.style.opacity="";
    if(dy>90){closeStory(); return}
    if(moved||held>250) return;
    var r=frame.getBoundingClientRect(); if(e.clientX-r.left<r.width*.33) bck(); else fwd()}
  frame.addEventListener("pointerup",up); frame.addEventListener("pointercancel",function(){down=0; paused=false; frame.style.transform=""; frame.style.opacity=""});
  x.onclick=function(e){e.stopPropagation(); closeStory()};
  ov.addEventListener("click",function(e){if(e.target===ov) closeStory()});
  story.key=function(e){if(e.key==="Escape") closeStory(); else if(e.key==="ArrowRight") fwd(); else if(e.key==="ArrowLeft") bck()};
  document.addEventListener("keydown",story.key);
}
function closeStory(){if(!story) return; ghostUntil=Date.now()+600; story.stop(); document.removeEventListener("keydown",story.key); story.ov.remove(); story=null; if(!root.hidden&&view==="grid"){var r=root.querySelector(".pp-ring"); if(r) r.classList.toggle("new",!!nowUnseen())}}

/* ---------- канал «Сплетни Сентфора»: телеграм внутри блога. Посты — в js/gossip.js ---------- */
var TG=window.SF_GOSSIP||[], TGJ="sentfor_gossip_join", TGM="sentfor_gossip_mute", TGR="sentfor_gossip_r";
var tgJoin=!!ls(TGJ), tgMute=!!ls(TGM), tgMine=ls(TGR)||{}, tgLive={counts:{},mine:{},at:0}, tgUi={}, tgFocus=null;
var TGRE=["🔥","😱","🤫","💋"], TGSUBS=3412;
var MON=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
function hsh(s){var h=2166136261; for(var i=0;i<s.length;i++){h^=s.charCodeAt(i); h=Math.imul(h,16777619)} return h>>>0}
function plural(n,a,b,c){var d=n%10, t=n%100; return d===1&&t!==11?a:d>=2&&d<=4&&(t<10||t>=20)?b:c}
function tgVis(){var r=rd(); return TG.filter(function(p){return (p.ep||1)<=r})}
function tgRe(p){return p.re||TGRE}
function tgRid(p,k,vote){return "g."+p.id+"."+(vote?"v":"")+k}
function tgBase(p,k,vote){var h=hsh(p.id+(vote?"v":"r")+k); if(vote) return 12+h%240; if(p.re) return k===0?60+h%300:h%140; return k===0?40+h%380:(h%4===0?0:h%(k===3?240:160))}
function tgMy(p,vote){
  if(!ON){var v=tgMine[(vote?"v.":"")+p.id]; return v==null?-1:v}
  var n=vote?p.poll.length:tgRe(p).length; for(var k=0;k<n;k++) if(tgLive.mine[tgRid(p,k,vote)]) return k; return -1}
function tgCount(p,k,vote){return tgBase(p,k,vote)+(ON?(tgLive.counts[tgRid(p,k,vote)]||0):(tgMy(p,vote)===k?1:0))}
function tgViews(n){return n<1000?String(n):(n/1000).toFixed(1).replace(/\.0$/,"").replace(".",window.SFLANG==="en"?".":",")+"K"}
function tgFmt(s){return esc(s).replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/\|\|([^|]+)\|\|/g,'<span class="tg-sp" role="button" tabindex="0" aria-label="Спойлер, нажми чтобы открыть">$1</span>').replace(/\n/g,"<br>")}
function tgPlain(s){return s.replace(/\*\*|\|\|/g,"").split("\n")[0]}
function tgPaint(id){if(tgUi[id]) tgUi[id]()}
function tgLoad(force){
  if(!ON||!SB.likeCountsPre) return; if(!force&&Date.now()-tgLive.at<30000) return;
  Promise.all([SB.likeCountsPre("g.").catch(function(){return []}),SB.myLikesPre("g.").catch(function(){return []})]).then(function(r){
    tgLive.counts={}; (r[0]||[]).forEach(function(x){tgLive.counts[x.post_id]=x.n});
    tgLive.mine={}; (r[1]||[]).forEach(function(x){tgLive.mine[x.post_id]=1});
    tgLive.at=Date.now(); Object.keys(tgUi).forEach(tgPaint)})}
function tgPick(p,k,vote){
  var cur=tgMy(p,vote); if(vote&&cur>=0) return;
  var nxt=(!vote&&cur===k)?-1:k;
  if(!ON){var key=(vote?"v.":"")+p.id; if(nxt<0) delete tgMine[key]; else tgMine[key]=nxt; ls(TGR,tgMine); tgPaint(p.id); return}
  var oldId=cur>=0?tgRid(p,cur,vote):null, newId=nxt>=0?tgRid(p,nxt,vote):null;
  function ap(id,d){if(!id) return; if(d>0) tgLive.mine[id]=1; else delete tgLive.mine[id]; tgLive.counts[id]=Math.max(0,(tgLive.counts[id]||0)+d)}
  ap(oldId,-1); ap(newId,1); tgPaint(p.id);
  (oldId?SB.unlike(oldId):Promise.resolve()).then(function(){return newId?SB.like(newId):null})
    .catch(function(e){ap(newId,-1); ap(oldId,1); tgPaint(p.id); toast(errText(e))});
}
function tgShare(p){var u=location.origin+location.pathname+"#g-"+p.id;
  if(navigator.share){navigator.share({title:"Сплетни Сентфора",text:tgPlain(p.t||p.q||""),url:u}).catch(function(){}); return}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(u).then(function(){toast("Ссылка скопирована")},function(){toast(u)}); return}
  toast(u)}
function tgRender(){ if(tgJoin) tgMarkKnown();
  var back=H("button","pp-ic pp-back"); back.type="button"; back.innerHTML=ICON.back; back.setAttribute("aria-label","Назад к профилю Поппи");
  back.onclick=function(){tgDirect=false; view="grid"; render(); root.scrollTop=0}; bar.appendChild(back);
  var tt=H("div","tg-bar-t"), subs=H("small");
  function paintSubs(){var n=TGSUBS+(tgJoin?1:0); subs.textContent=fmt(n)+" "+plural(n,"подписчик","подписчика","подписчиков")}
  paintSubs(); tt.innerHTML='<img class="tg-ava" src="img/gossip/ava.webp" alt="" aria-hidden="true">'; var tn=H("div","tg-bar-n"); tn.appendChild(H("b",null,"Сплетни Сентфора")); tn.appendChild(subs); tt.appendChild(tn); bar.appendChild(tt);
  var ex=H("button","pp-exit","к доске ✕"); ex.type="button"; ex.onclick=function(){close()}; bar.appendChild(ex);

  var list=tgVis(), n=list.length; tgUi={};
  var pin=list.filter(function(p){return p.pin})[0];
  if(pin){var pb=H("button","tg-pin"); pb.type="button"; pb.innerHTML='<span class="tg-pin-l"></span><span class="tg-pin-t"><b>Закреплённое сообщение</b><span>'+esc(tgPlain(pin.t))+'</span></span>';
    pb.onclick=function(){tgGo(pin.id)}; body.appendChild(pb)}
  var w=H("div","tg"), fd=H("div","tg-feed");
  fd.addEventListener("click",function(e){var sp=e.target.closest(".tg-sp"); if(sp) sp.classList.add("open")});
  fd.addEventListener("keydown",function(e){var sp=e.target.closest&&e.target.closest(".tg-sp"); if(sp&&(e.key==="Enter"||e.key===" ")){e.preventDefault(); sp.classList.add("open")}});
  /* дата и время поста: at:"2026-10-15 11:42" (если нет — через час после предыдущего) */
  var now=new Date(), today=new Date(now.getFullYear(),now.getMonth(),now.getDate()), prev=null, lastDay=null;
  list.forEach(function(p){
    var m=p.at&&/^(\d{4})-(\d\d)-(\d\d)[ T](\d\d):(\d\d)/.exec(p.at);
    var dt=m?new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5]):new Date((prev||now).getTime()+3600000); prev=dt;
    var day=new Date(dt.getFullYear(),dt.getMonth(),dt.getDate()), dk=Math.round((today-day)/86400000);
    if(dk!==lastDay){lastDay=dk; fd.appendChild(H("div","tg-day",dk===0?"Сегодня":dk===1?"Вчера":dt.getDate()+" "+MON[dt.getMonth()]+(dt.getFullYear()!==now.getFullYear()?" "+dt.getFullYear():"")))}
    var hh=dt.getHours(), mm=dt.getMinutes();
    fd.appendChild(tgPost(p,(hh<10?"0":"")+hh+":"+(mm<10?"0":"")+mm,tgViews(700+hsh(p.id+"v")%1100+Math.max(0,dk)*45)));
  });
  if(!n) fd.appendChild(H("p","pp-empty","Тут пока тихо 🤫"));
  w.appendChild(fd);
  var ft=H("div","tg-foot"), fb=H("button","tg-fb"); fb.type="button";
  function paintFb(){fb.textContent=!tgJoin?"Подписаться":tgMute?"🔔 Включить звук":"🔕 Выключить звук"; fb.classList.toggle("join",!tgJoin)}
  fb.onclick=function(){if(!tgJoin){tgJoin=true; ls(TGJ,1); tgMarkKnown(); toast("Ты в канале 🤫 Теперь ты знаешь всё. Новые сплетни придут уведомлением")} else {tgMute=!tgMute; ls(TGM,tgMute); toast(tgMute?"Звук выключен":"Звук включён")} paintFb(); paintSubs()};
  paintFb(); ft.appendChild(fb); w.appendChild(ft); body.appendChild(w);
  var f=tgFocus; tgFocus=null;
  requestAnimationFrame(function(){if(f&&tgGo(f)) return; root.scrollTop=root.scrollHeight});
  tgLoad();
}
function tgGo(id){var el=document.getElementById("tg-"+id); if(!el) return false;
  var top=bar.offsetHeight+((root.querySelector(".tg-pin")||{}).offsetHeight||0)+12;
  root.scrollTop=Math.max(0,el.offsetTop-top); el.classList.remove("hl"); void el.offsetWidth; el.classList.add("hl"); return true}
/* видео как в телеге: само играет без звука, тап — со звуком с начала, ещё тап — снова без звука */
var tgIO=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target; if(e.isIntersecting){var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){})} else {v.pause(); if(!v.muted){v.muted=true; if(v._paint) v._paint()}}})},{threshold:0.6}):null;
function tgVideo(p){
  var w=H("div","tg-vid"), v=H("video"); v.muted=true; v.loop=true; v.playsInline=true; v.setAttribute("playsinline",""); v.setAttribute("muted",""); v.preload="metadata";
  if(p.poster) v.poster=(p.poster.indexOf("/")>-1?"img/":IMG)+p.poster+".webp";
  [["mp4","video/mp4"],["webm","video/webm"]].forEach(function(x){var so=H("source"); so.src="video/"+p.vid+"."+x[0]; so.type=x[1]; v.appendChild(so)});
  var snd=H("span","tg-snd"); function paint(){snd.textContent=v.muted?"🔇":"🔊"; w.setAttribute("aria-label",v.muted?"Включить звук":"Выключить звук")} v._paint=paint; paint();
  w.setAttribute("role","button"); w.tabIndex=0;
  function tap(){if(v.muted){v.muted=false; try{v.currentTime=0}catch(e){}} else v.muted=true; var pr=v.play(); if(pr&&pr.catch) pr.catch(function(){}); paint()}
  w.onclick=tap; w.onkeydown=function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault(); tap()}};
  w.appendChild(v); w.appendChild(snd);
  if(tgIO) tgIO.observe(v); else {v.autoplay=true}
  return w;
}
/* просмотр фото на весь экран: свайп / тап по краям — листать */
function tgLightbox(srcs,i){
  var ov=H("div","tg-lb"), img=new Image(), cnt=H("div","tg-lb-n"), x=H("button","tg-lb-x","✕"); x.type="button"; x.setAttribute("aria-label","Закрыть");
  ov.setAttribute("role","dialog"); ov.setAttribute("aria-modal","true"); img.alt="";
  function show(n){i=(n+srcs.length)%srcs.length; img.src=srcs[i]; cnt.textContent=srcs.length>1?(i+1)+" из "+srcs.length:""}
  function shut(){document.removeEventListener("keydown",key,true); ov.remove()}
  function key(e){if(e.key==="Escape"){e.stopImmediatePropagation(); shut()} else if(e.key==="ArrowRight"){show(i+1)} else if(e.key==="ArrowLeft"){show(i-1)}}
  ov.onclick=function(e){if(e.target===x){shut(); return} if(e.target!==img){shut(); return} if(srcs.length<2) return; var r=img.getBoundingClientRect(); show(e.clientX<r.left+r.width/3?i-1:i+1)};
  var sx=0,sy=0; ov.addEventListener("touchstart",function(e){sx=e.touches[0].clientX; sy=e.touches[0].clientY},{passive:true});
  ov.addEventListener("touchend",function(e){var dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy; if(Math.abs(dy)>90&&Math.abs(dy)>Math.abs(dx)){shut(); return} if(Math.abs(dx)>50&&srcs.length>1){show(dx<0?i+1:i-1)}},{passive:true});
  document.addEventListener("keydown",key,true);
  ov.appendChild(img); ov.appendChild(cnt); ov.appendChild(x); root.appendChild(ov); show(i);
}
function tgPost(p,time,views){
  var row=H("div","tg-row"); row.id="tg-"+p.id;
  var m=H("div","tg-msg"+(p.img||p.vid||p.pic||p.ph?" has-media":""));
  if(p.ph){var al=H("div","tg-alb n"+(p.ph.length>=7?"m":Math.min(p.ph.length,3))), srcs=p.ph.map(function(x){return "img/"+x+".webp"});
    srcs.forEach(function(u,i){var b=H("button","tg-ph"); b.type="button"; if(p.ar&&srcs.length===1) b.style.aspectRatio=p.ar; b.setAttribute("aria-label","Открыть фото "+(i+1)+" из "+srcs.length);
      var im=new Image(); im.loading="lazy"; im.src=u; im.alt="";  im.decoding="async"; b.appendChild(im); b.onclick=function(){tgLightbox(srcs,i)}; al.appendChild(b)});
    m.appendChild(al)}
  if(p.pic){var pi=new Image(); pi.loading="lazy"; pi.src="img/"+p.pic+".webp"; pi.alt="";  pi.decoding="async"; pi.className="tg-img wide"; m.appendChild(pi)}
  if(p.img){var im=new Image(); im.loading="lazy"; im.src=IMG+p.img+".webp"; im.alt="";  im.decoding="async"; im.className="tg-img"; m.appendChild(im)}
  if(p.vid) m.appendChild(tgVideo(p));
  if(p.t){var tx=H("div","tg-tx"); tx.innerHTML=tgFmt(p.t); m.appendChild(tx)}
  if(p.loc){var lb=H("button","tg-loc"); lb.type="button"; lb.innerHTML=ICON.pin+"<span>"+esc(p.loc[1])+" · на карте</span>"; lb.onclick=function(){geo(p.loc[0])}; m.appendChild(lb)}
  var pl=null; if(p.poll){pl=H("div","tg-poll"+(p.t?"":" solo")); m.appendChild(pl)}
  var re=H("div","tg-re"); m.appendChild(re);
  var mt=H("div","tg-meta"); mt.innerHTML=ICON.eye+"<span>"+views+"</span><span>"+time+"</span>"; m.appendChild(mt);
  row.appendChild(m);
  var sh=H("button","tg-share"); sh.type="button"; sh.innerHTML=ICON.fwd; sh.setAttribute("aria-label","Поделиться"); sh.onclick=function(){tgShare(p)}; row.appendChild(sh);
  function paintRe(){re.innerHTML=""; var my=tgMy(p,false);
    tgRe(p).forEach(function(e,k){var c=tgCount(p,k,false), b=H("button","tg-r"+(my===k?" on":"")); b.type="button";
      b.innerHTML='<i>'+e+'</i><span>'+(c?tgViews(c):"")+'</span>'; b.setAttribute("aria-label",e+" "+c+(my===k?", твоя реакция":""));
      b.onclick=function(){tgPick(p,k,false); if(tgMy(p,false)===k){var nb=re.children[k]; if(nb){nb.classList.add("pop")}}}; re.appendChild(b)})}
  function paintPoll(){if(!pl) return; pl.innerHTML=""; var my=tgMy(p,true), tot=0, cs=p.poll.map(function(o,k){var c=tgCount(p,k,true); tot+=c; return c});
    pl.appendChild(H("b","tg-pq",p.q||"")); pl.appendChild(H("small","tg-ps","Анонимный опрос"));
    p.poll.forEach(function(o,k){var pc=tot?Math.round(cs[k]*100/tot):0, b=H("button","tg-po"+(my>=0?" done":"")+(my===k?" on":"")); b.type="button";
      b.innerHTML=my>=0?'<span class="tg-pp">'+pc+'%</span><span class="tg-pt">'+esc(o)+'</span><span class="tg-ptr"><span class="tg-pb" style="width:'+Math.max(pc,2)+'%"></span></span>':'<span class="tg-pc"></span><span class="tg-pt">'+esc(o)+'</span>';
      if(my>=0) b.disabled=true; else b.onclick=function(){tgPick(p,k,true)}; pl.appendChild(b)});
    pl.appendChild(H("small","tg-pv",fmt(tot)+" "+plural(tot,"голос","голоса","голосов")))}
  tgUi[p.id]=function(){paintRe(); paintPoll()}; tgUi[p.id]();
  return row;
}

/* ---------- вкладка в ряду разделов ---------- */
var tabs=document.getElementById("tabs");
if(tabs){
  var tb=H("button","tab pp-tabbtn"); tb.type="button"; tb.setAttribute("data-tab","poppy"); tb.innerHTML='<span class="pp-dot"></span>Блог Поппи';
  tb.onclick=function(e){e.preventDefault(); open()};
  var gameTab=tabs.querySelector('[data-tab="game"]'); tabs.insertBefore(tb,gameTab||null); window._ppTab=tb;
  /* канал «Сплетни Сентфора» — отдельной вкладкой, а ссылка в профиле Поппи остаётся */
  if(TG.length){var gt=H("button","tab pp-tabbtn tg-tabbtn"); gt.type="button"; gt.setAttribute("data-tab","gossip"); gt.innerHTML='<span class="tg-dot"></span>Сплетни Сентфора';
    gt.onclick=function(e){e.preventDefault(); open(); tgDirect=true; view="tg"; tgFocus=null; render()};
    tabs.insertBefore(gt,gameTab||null); window._tgTab=gt}
}
/* прямая ссылка на пост: #pp-moto */
/* ---------- уведомления о новых постах и сторис (для подписчиков) ---------- */
var KK="sentfor_poppy_known", note=null, noteT=0;
function skey(f){return "s:"+(f.vid||f.img||(f.tweet?"tweet":"text"))}
function keysNow(){var out=[]; vis().forEach(function(p){out.push("p:"+p.id)}); nowFrames().forEach(function(f){out.push(skey(f))}); return out}
function newItems(){if(!follow) return []; var kn=ls(KK)||[]; return keysNow().filter(function(k){return kn.indexOf(k)<0})}
function markKnown(){ls(KK,keysNow()); updBadge()}
function badge(t,n){if(!t) return; t.classList.toggle("has-new",n>0); if(n>0) t.setAttribute("data-new",n>9?"9+":String(n)); else t.removeAttribute("data-new")}
function updBadge(){if(window._tgTab){badge(_ppTab,newItems().length); badge(_tgTab,tgNew().length)} else badge(window._ppTab,newItems().length+tgNew().length)}
function hideNote(){clearTimeout(noteT); if(note){var x=note; note=null; x.classList.remove("on"); setTimeout(function(){x.remove()},350)}}
function showNote(){
  var nw=newItems(); if(!nw.length||!root.hidden||note) return;
  var posts=nw.filter(function(k){return k.indexOf("p:")===0}), sts=nw.filter(function(k){return k.indexOf("s:")===0});
  var txt=posts.length&&sts.length?"новые публикации и истории":posts.length>1?"новых публикаций: "+posts.length:posts.length?"опубликовала новый пост":sts.length>1?"добавила истории":"добавила историю";
  var thumb=null; if(posts.length){var pp=vis().filter(function(p){return "p:"+p.id===posts[0]})[0]; if(pp&&pp.img[0]!=="card") thumb=IMG+pp.img[0]+".webp"}
  note=H("button","pp-note-push"); note.type="button"; note.setAttribute("aria-label","PoppyEm "+txt+". Открыть");
  note.innerHTML='<img class="pn-av" src="'+IMG+'avatar3.webp" alt=""><span class="pn-t"><b>PoppyEm</b> '+esc(txt)+'<small>Блог Поппи · сейчас</small></span>'+(thumb?'<img class="pn-th" src="'+thumb+'" alt="">':'')+'<span class="pn-x" aria-hidden="true">✕</span>';
  document.body.appendChild(note); requestAnimationFrame(function(){requestAnimationFrame(function(){if(note) note.classList.add("on")})});
  var go=posts.length?posts[0].slice(2):null, st=!posts.length&&sts.length;
  note.onclick=function(e){if(e.target.closest(".pn-x")){hideNote(); return} hideNote(); open(); if(go){view="feed"; feedAt=go; render()} else if(st) setTimeout(function(){openStory(NOW)},200)};
  var sy=0; note.addEventListener("touchstart",function(e){sy=e.touches[0].clientY},{passive:true});
  note.addEventListener("touchend",function(e){if(sy-e.changedTouches[0].clientY>30) hideNote()},{passive:true});
  noteT=setTimeout(hideNote,7000);
}

/* ---------- уведомления канала «Сплетни Сентфора» (если подписан и звук не выключен) ---------- */
var TK="sentfor_gossip_known";
function tgAt(p){var m=p.at&&/^(\d{4})-(\d\d)-(\d\d)[ T](\d\d):(\d\d)/.exec(p.at); return m?new Date(+m[1],+m[2]-1,+m[3],+m[4],+m[5]).getTime():0}
(function(){if(tgJoin&&!ls(TK)){var cut=Date.now()-5*86400000; ls(TK,TG.filter(function(p){return tgAt(p)<cut}).map(function(p){return p.id}))}})();
function tgNew(){if(!tgJoin) return []; var kn=ls(TK)||[]; return tgVis().filter(function(p){return kn.indexOf(p.id)<0})}
function tgMarkKnown(){var kn=ls(TK)||[]; tgVis().forEach(function(p){if(kn.indexOf(p.id)<0) kn.push(p.id)}); ls(TK,kn); updBadge()}
function tgPlain(t){return String(t||"").replace(/\*\*|\|\|/g,"").split("\n").filter(Boolean)[0]||""}
var tgNote=null;
function showTgNote(){
  var nw=tgNew(); if(!nw.length||tgMute||!root.hidden||tgNote) return;
  if(note){setTimeout(showTgNote,7600); return}
  var p=nw[nw.length-1], txt=nw.length>1?"Новых сплетен: "+nw.length+" · "+tgPlain(p.t||p.q):tgPlain(p.t||p.q);
  var th=p.ph&&p.ph[0]?"img/"+p.ph[0]+".webp":null;
  tgNote=H("button","pp-note-push tg-push"); tgNote.type="button"; tgNote.setAttribute("aria-label","Сплетни Сентфора: "+txt+". Открыть");
  tgNote.innerHTML='<img class="pn-av" src="img/gossip/ava.webp" alt=""><span class="pn-t"><b>Сплетни Сентфора</b> '+esc(txt)+'<small>Telegram · сейчас</small></span>'+(th?'<img class="pn-th" src="'+th+'" alt="">':'')+'<span class="pn-x" aria-hidden="true">✕</span>';
  document.body.appendChild(tgNote); var me=tgNote; requestAnimationFrame(function(){requestAnimationFrame(function(){me.classList.add("on")})});
  function hide(){if(tgNote!==me) return; tgNote=null; me.classList.remove("on"); setTimeout(function(){me.remove()},350)}
  var go=nw[0].id;
  me.onclick=function(e){if(e.target.closest(".pn-x")){hide(); return} hide(); open(); tgDirect=true; view="tg"; tgFocus=go; render()};
  var sy=0; me.addEventListener("touchstart",function(e){sy=e.touches[0].clientY},{passive:true});
  me.addEventListener("touchend",function(e){if(sy-e.changedTouches[0].clientY>30) hide()},{passive:true});
  setTimeout(hide,7000);
}
function checkNew(){updBadge(); setTimeout(showNote,2200); setTimeout(showTgNote,2600)}
var epn=document.getElementById("ep-name"); if(epn) new MutationObserver(function(){updBadge(); setTimeout(showNote,600); setTimeout(showTgNote,1000)}).observe(epn,{childList:true,characterData:true,subtree:true});
window.SFpoppyNew=function(){ls(KK,[]); checkNew()};
try{if(location.hash==="#poppy") setTimeout(open,300)}catch(e){}
try{var gm=/^#(?:g-(\w+)|gossip\b)/.exec(location.hash); if(gm&&TG.length) setTimeout(function(){open(); tgDirect=true; view="tg"; tgFocus=gm[1]||null; render()},300)}catch(e){}
try{var hm=/^#pp-(\w+)/.exec(location.hash); if(hm) setTimeout(function(){open(); var p=vis().filter(function(x){return x.id===hm[1]})[0]; if(p){view="feed"; feedAt=p.id; render()}},300)}catch(e){}
checkNew();
})();
