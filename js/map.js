/* Карта Сентфора. Открывается тем, кто дочитал до 19-й серии */
(function(){
try{localStorage.removeItem("sentfor_maptest")}catch(e){}

var NS="http://www.w3.org/2000/svg";
function S(t,a,p){var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e}
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function rd(){return (window.SF&&SF.read)||1}

/* места: x,y в пикселях картинки 1728×2474; ev: [серия, текст, картинка?] */
var P=[
 {id:"school",lab:"r",n:"Школа",pics:["school_out","school_hall","school_gym","school_office","school_chem"],wide:1,full:"Старшая школа",x:1065,y:1945,ev:[
  [1,"Гаснет свет. В туалете Надин впервые видит тень с белыми глазами, на плитке нацарапано «он вернулся».","shadow"],
  [3,"О смерти Миранды объявляют в спортзале. Нечто в туалете: «У меня двенадцать рук… Кто-то скоро всех убьёт».","creature"],
  [4,"Ночью Надин просыпается в пустой школе. У шкафчика Миранды шёпот «Идём…», внутри чёрный морозник, по коридору ходят двое с корнями.","whisper"],
  [4,"Из редакции пропадают кассеты и распечатка башни."],
  [5,"В листве у школы лежит слишком большая кость.","ev_bone"],
  [6,"В ночь розыгрышей сторож выходит весь в крови.","storozh_blood"],
  [7,"Кровь оказалась бутафорской. Говард приезжает в школу, директор перед ним лебезит."],
  [9,"Говард заходит в редакцию, читает доску Надин и советует не лезть."],
  [10,"Доска в редакции стёрта."],
  [11,"Охранники Говарда проверяют сумки учеников."],
  [13,"В раздевалке кровью «Это всё твоя вина», дети-тени считают считалку. В сумке Миранды гнилой морозник.","kids13"],
  [19,"Родительское собрание: Говард говорит, что Совы делают из морозника наркотик."]]},
 {id:"martinez",n:"Дом Миранды",pics:["miranda_house","miranda_living","miranda_room"],wide:1,full:"Дом Мартинесов (Миранды)",x:693,y:2152,ev:[
  [2,"Сладкий едкий запах, лицо Миранды меняется, за стеклом двери силуэт. В тот же вечер Миранда погибает.","miranda_porch"],
  [3,"Допрос: Миранду нашли на дереве у дома. В 18:06 она позвонила брату. В её комнате камера во мху и кассеты.","cassette"],
  [4,"У дома стоит матовая серая машина.","car"],
  [6,"Полиция видела у дома Тома, когда Миранду снимали с дерева."]]},
 {id:"rudi",lab:"b",n:"Дом Руди",pics:["rudi_living","rudi_room"],wide:1,x:893,y:1868,ev:[
  [1,"Руди Брукс живёт по соседству с Надин, они дружат с детства."]]},
 {id:"nadin",lab:"tr",n:"Дом Надин",pics:["nadin_room","jimmy_room","nadin_kitchen","nadin_hall"],wide:1,x:951,y:1868,ev:[
  [4,"Папа смотрит на фото башни: такую не построить. У дома тормозит серая машина."],
  [9,"На подоконнике кассета: «Здесь всё, о чём ты должна знать».","tape9"],
  [10,"Во сне мама скалится у лестницы, а под кроватью уже кто-то есть.","underbed"],
  [17,"Надин видит себя мёртвой, проросшей морозником, и кричит у гаража, но её никто не слышит.","deadnadin17"],
  [18,"Ночью в кровати рядом кто-то лежит. Утром под подушкой цветы морозника.","double18"],
  [19,"Элис отгоняет что-то щелчком камеры. Джимми смотрит в окно: «К-кто это?»"]]},
 {id:"police",lab:"t",n:"Полиция",pics:["police_office"],wide:1,full:"Полицейский участок",x:700,y:1880,ev:[
  [1,"Шериф ведёт дело о пропавшем Малкольме и вызывает Декса."],
  [10,"После интервью Говарда Сов вызывают на допрос."],
  [11,"Говард привозит сюда Надин."]]},
 {id:"shop",lab:"r",n:"Комиссионка",pics:["shop_in","shop_basement2"],wide:1,full:"Комиссионка Коулмана",x:1085,y:2037,ev:[
  [9,"Почти все вещи здесь носила Сара. В подвале мир переворачивается, из зеркала ползут чёрные волосы.","mirror9"]]},
 {id:"junk",n:"Свалка",x:1062,y:1360,pics:["junk_day","junk_night"],wide:1,ev:[
  [5,"Тень за трейлером и сладкий запах, Элис ничего не видит. На снимке Элис шериф спорит здесь с Говардом.","junk_shadow"],
  [6,"Поппи и Оливия обыскивают брошенные машины."],
  [7,"Находят яму."],
  [8,"В яме Том. Измеритель поля зашкаливает, рядом железки с красными огоньками. На вечеринке человек в костюме стреляет в парня в шапке."],
  [10,"На записи Поппи выстрел, люди в пиджаках закапывают тело."]]},
 {id:"howard",n:"Дом Говарда",pics:["howard_gate","howard_hall","howard_lib"],wide:1,x:1382,y:1418,ev:[
  [11,"У ворот женщина с запахом нафталина. В доме анкеты на «объекты» и снимки со свалки. Говард застаёт Надин.","junk_photo11"]]},
 {id:"lab",lab:"r",n:"Лаборатория",pics:["lab_in"],wide:1,full:"Лаборатория «Уорлока»",x:1200,y:228,old:1,ev:[
  [1,"Аномалия поля «вышла за все рамки». Говард: «Выпускайте их». Одного прорастает цветами.","rooted_boy"]]},
 {id:"fence",n:"Лаз",pics:["fence_forest"],wide:1,full:"Граница и лаз",x:1206,y:1278,ev:[
  [1,"Миранда ходила в Старый Сентфор с парнем из Сов и видела то, что не может описать."],
  [5,"В Старом Сентфоре пропали двое парней: «Оттуда в своём уме никто не возвращается»."],
  [8,"Декс знает лаз в Старый Сентфор."],
  [12,"Стив Бейли погиб на пиках забора на границе. Это списали на несчастный случай.","fence12"],
  [14,"Ребята пробираются в Старый Сентфор. Даррен меряет поле, оно «плавает». Элис бывала здесь в детстве."],
  [17,"Говард велит заделать лаз."],
  [21,"Лаз заделали."]],closed:21},
 {id:"tunnel",n:"Подкоп",pics:["fence_forest"],wide:1,full:"Граница и подкоп",x:910,y:1300,ev:[
  [21,"Декс знает подкоп под забором. Ток бьёт каждые четыре секунды, пролезать нужно на счёт «три»."]]},
 {id:"forest",n:"Лес",pics:["forest"],wide:1,x:300,y:1500,ev:[
  [4,"Здесь маленькая Надин с дедушкой впервые столкнулась с морозником."],
  [6,"Олень, которому место в Старом Сентфоре, выходит в город. Рядом морозник, Надин обжигает руку.","deer"],
  [9,"Ночью из леса слышали что-то похожее на выстрел."],
  [16,"В 1986-м здесь стоит деревянная статуя фавна.","statue16"],
  [17,"В лесу ребят ловит человек в костюме: «Они у меня»."]]},
 {id:"tower",n:"Башня",pics:["tower_fence",["tower_in",15]],wide:1,x:1000,y:200,old:1,ev:[
  [1,"Один из выпущенных добегает до башни и входит внутрь."],
  [3,"На кассете 2017 года башня и люди с автоматами.","tower_prologue"],
  [15,"Надин идёт на звон колокола: внутри лестница в небо и десятки дверей. Одна ведёт в 1986 год.","tower_inside"],
  [16,"Малкольм: «Выпусти. Я голоден». Над выходом табличка со знаками.","plaque16"],
  [18,"Надин дважды тянет к башне «на автомате»."],
  [19,"Знаки на табличке — дата 23 сентября 2023."],
  [22,"Над старой дверью табличка пустая, над другой «23». В зарослях морозника лежат два тела."]]},
 {id:"hospital",n:"Больница",pics:["hosp_hall3","hosp_room3"],wide:1,full:"Заброшенная больница",x:808,y:984,old:1,ev:[
  [15,"Надин очнулась здесь после видения с Кэнди. Лианы морозника оплетают Сову Чеда.","candy15"]]},
 {id:"sara",n:"Дом Сары",pics:["sara_street","sara_room2"],wide:1,x:1057,y:1122,old:1,ev:[
  [14,"Лицо за шторой, фото с исцарапанным лицом, открытка Саре и ключ с руной.","curtain14"],
  [16,"В 1986-м здесь живёт Сара О'Нил."]]},
 {id:"rink",n:"Роллердром",pics:["rink_in"],wide:1,x:804,y:1124,old:1,ev:[
  [14,"На снимке пустого роллердрома проявляются руки и череп.","rink14"]]},
 {id:"hill",hide:1,n:"Лавка миссис Хилл",x:0,y:0,old:1,ev:[
  [16,"1986: то же зеркало, что Надин разбила в комиссионке. Миссис Хилл отдаёт кассету и мятную конфету.","hill16"]]},
 {id:"library",lab:"b",n:"Библиотека",pics:["library","darkroom",["archive",12]],wide:1,x:969,y:1975,ev:[
  [5,"Библиотекарша вспоминает книгу «Тени Сентфора». В проявочной при библиотеке на плёнке за Мирандой проступает тень."],
  [6,"В проявочной Миранда: «Он тебя ищет»."],
  [12,"Детский шёпот и девочка у полок. Шёпот оказался розыгрышем Поппи, а девочка нет.","ghost12"],
  [12,"В полицейском архиве при библиотеке листовка «Вы меня видели?» и рыжая девочка с мячиком. Дела Стива Бейли и 1986 года.","archive_girl12"],
  [13,"В архиве дела 1986 года: Кэнди вернулась с болота, Сэм погиб в лесу, Бобби, Меган и Фредди пропали.","files13"]]},
 {id:"laundry",lab:"l",n:"Прачечная",pics:["laundry"],wide:1,full:"Прачечная 4Spins",x:608,y:1858,ev:[
  [5,"Здесь работает Декс."],
  [7,"Декс говорит, что Том работал с ним здесь и неделю назад перестал выходить на работу."]]},
 {id:"darren",n:"Дом Даррена",x:1572,y:1498,ev:[
  [18,"В кабинете отца Даррен находит записи мамы: она работала на «Уорлок» и звала башню Обскуром. Там же кассета от июля 2017."]]},
 {id:"camp",n:"Старый лагерь",pics:["camp","camp_hut"],wide:1,x:758,y:1376,ev:[
  [18,"Даррен прячет здесь мамину кассету."]]},
 {id:"garage",n:"Гараж Декса",x:1460,y:2154,pics:["garage_in2","garage_out2"],wide:1,ev:[[1,"Гараж Декса на берегу реки. Внутри мотоцикл, проигрыватель с пластинками, клетчатый диван и стол из кабельной катушки."]]},
 {id:"cafe",lab:"t",n:"Закусочная",full:"Закусочная «Сентфор»",pics:["cafe"],wide:1,x:1181,y:1848,ev:[[1,"Закусочная на тихой жилой улице."]]},
 {id:"oldstreet",n:"Улица",full:"Улица Старого Сентфора",pics:["old_street"],wide:1,x:932,y:1056,old:1,ev:[
  [16,"Надин очнулась на той же улице, по которой гуляла в 1986-м, только теперь она заросла морозником."],
  [22,"Надин с Джимми выходят на эту улицу в прошлом, когда Миранда ещё жива. В заброшенном доме тень почти забирает Джимми."]]}
];

function dz(s){try{return decodeURIComponent(escape(atob(s.split("").reverse().join(""))))}catch(e){return s}}
function eggGot(k){try{return !!(JSON.parse(localStorage.getItem("sentfor_eggs_v2")||"{}")||{})[k]}catch(e){return false}}
var GRAVE={id:"g20",n:"???",full:dz("4CdvQXL08CNuQDytQXL0xCNIwC9uQjL0zCtvQzJ0"),pics:["m7q2"],x:1640,y:1790,secret:1,ev:[[19,""]]};
P.push(GRAVE);
P=P.filter(function(p){return !p.hide});
P.forEach(function(p){p.from=Math.min.apply(null,p.ev.map(function(e){return e[0]}))});

/* вкладка и раздел */
var tabs=document.getElementById("tabs"), after=document.getElementById("tab-ts1");
if(!tabs||!after) return;
var tb=H("button","tab","Карта"); tb.type="button"; tb.setAttribute("role","tab"); tb.setAttribute("data-tab","map"); tb.setAttribute("aria-controls","tab-map");
var gameTab=tabs.querySelector('[data-tab="game"]'); tabs.insertBefore(tb,gameTab||null);
var sec=H("section"); sec.id="tab-map"; sec.setAttribute("data-tab","map"); sec.hidden=true;
sec.innerHTML='<h2>Карта Сентфора</h2><p class="lead">Где что случилось. Нажми на метку, чтобы открыть место.</p>';
var wrap=H("div","smap-wrap"), scroll=H("div","smap-scroll"), board=H("div","smap-board");
var svg=new Image(); svg.className="smap-img"; svg.loading="lazy"; svg.src=(window.SFLANG==="en"?"img/map_sentfor1_en.webp":"img/map_sentfor1.webp"); svg.alt="Карта Сентфора"; svg.decoding="async"; svg.width=1400; svg.height=2004;
var pins=H("div","smap-pins"), card=H("div","smap-card"); card.hidden=true;
board.appendChild(svg); board.appendChild(pins); scroll.appendChild(board); wrap.appendChild(scroll); wrap.appendChild(card); sec.appendChild(wrap);
var legend=H("div","smap-legend"); legend.innerHTML='<span><i class="lg-pin"></i>место</span><span><i class="lg-pin old"></i>Старый Сентфор</span><span><i class="lg-zone"></i>Мёртвая зона</span>'; sec.appendChild(legend);
after.parentNode.insertBefore(sec,after.nextSibling);

/* клик по вкладке: показываем свой раздел (общий переключатель вкладок про него не знает) */
var allTabs=[].slice.call(tabs.querySelectorAll(".tab"));
function showMap(){document.querySelectorAll("section[data-tab]").forEach(function(s){s.hidden=s!==sec}); allTabs=[].slice.call(tabs.querySelectorAll(".tab"));
  allTabs.forEach(function(b){var o=b===tb; b.setAttribute("aria-selected",String(o)); b.tabIndex=o?0:-1}); try{localStorage.setItem("sentfor_tab","map")}catch(e){} render(); centerScroll()}
tb.addEventListener("click",showMap);
allTabs.forEach(function(b){if(b!==tb) b.addEventListener("click",function(){sec.hidden=true; tb.setAttribute("aria-selected","false")})});
/* карта открыта только тем, кто дочитал до конца: иначе места выдают сюжет */
var MAP_FROM=19;
function mapAllowed(){return rd()>=MAP_FROM}
function updateTab(){var ok=mapAllowed(); tb.hidden=!ok; if(!ok&&!sec.hidden){closeCard(); var t=tabs.querySelector('.tab:not([data-tab="map"])'); if(t) t.click()}}
try{if(localStorage.getItem("sentfor_tab")==="map"&&mapAllowed()) setTimeout(showMap,0)}catch(e){}

/* сама карта — картинка */
var CAP={m7q2:dz("LG9tQ7L0AGNI1C9iR3L0AGdkRfY0gAL00CtjRHY0gIY04CdgR7L09CNuQDY0/CNIAGtvQ/L0gUY04CdgRDivQTL0g4L0CGdL+CtgRrJ0"),k4z9:dz("=sY07CtvQrL0IGNI1CdvQDL07C9vQDCvQ7L09CNtQ7L0gAL09CNI4CdvQDigRXL09CNIxIJiiDCsQbL0wCtgR3K0"),school_office:"Редакция газеты «Тени Сентфора»",school_gym:"Спортзал",school_hall:"Коридор",darkroom:"Проявочная",archive:"Полицейский архив",
 howard_hall:"Холл",howard_lib:"Библиотека",miranda_living:"Гостиная",miranda_room:"Комната Миранды",nadin_room:"Комната Надин",jimmy_room:"Комната Джимми",
 nadin_kitchen:"Кухня",nadin_hall:"Второй этаж",shop_basement2:"Подвал",camp_hut:"Вожатский домик",tower_in:"Внутри башни",hosp_hall3:"Коридор",hosp_room3:"Палата",rudi_living:"Гостиная",rudi_room:"Комната Руди",school_chem:"Кабинет химии",sara_room2:"Гостиная",police_office:"Кабинет шерифа"};
/* жуткие версии фото: [картинка, с какой серии] — проявляются при наведении (на телефоне по нажатию) */
var SCARY={nadin_hall:["x_nadin_hall",10],nadin_room:["x_nadin_room",10],darkroom:["x_darkroom",6],junk_day:["x_junk_day",5],junk_night:["x_junk_night",8],library:["x_library",12],shop_basement2:["x_shop_basement2",9],howard_gate:["x_howard_gate",11],sara_room2:["x_sara_room2",14],hosp_hall3:["x_hosp_hall3",15],hosp_room3:["x_hosp_room3",15],rink_in:["rink14",14],cafe:["x_cafe",6],school_office:["x_school_office",4],school_hall:["x_school_hall",4],miranda_house:["x_miranda_house",2]};

/* просмотр фото крупно: листание стрелками/свайпом, жуть — наведением или нажатием на фото */
var lb=H("div","smap-lb"); lb.hidden=true; lb.setAttribute("role","dialog"); lb.setAttribute("aria-modal","true");
lb.innerHTML='<button type="button" class="lb-x" aria-label="Закрыть">×</button><button type="button" class="lb-a lb-prev" aria-label="Предыдущее фото">‹</button><figure class="lb-fig"><div class="lb-ph"><img class="lb-im" alt=""><img class="lb-scr" alt=""></div><figcaption class="lb-cap"></figcaption><div class="lb-n"></div></figure><button type="button" class="lb-a lb-next" aria-label="Следующее фото">›</button>';
document.body.appendChild(lb);
var lbList=[], lbI=0, lbP=null, lbIm=lb.querySelector(".lb-im"), lbScr=lb.querySelector(".lb-scr"), lbCap=lb.querySelector(".lb-cap"), lbN=lb.querySelector(".lb-n"), lbPh=lb.querySelector(".lb-ph");
function lbShow(){var n=lbList[lbI], R=rd(), sc=SCARY[n]; lbIm.src="img/"+n+".webp"; lbIm.alt=CAP[n]||lbP.n; lbCap.textContent=CAP[n]||(lbP.full||lbP.n);
  lbPh.classList.add("nt"); lbPh.classList.remove("on"); void lbScr.offsetWidth; requestAnimationFrame(function(){requestAnimationFrame(function(){lbPh.classList.remove("nt")})}); if(sc&&sc[1]<=R){lbScr.src="img/"+sc[0]+".webp"; lbPh.classList.add("scary")} else {lbScr.removeAttribute("src"); lbPh.classList.remove("scary")}
  lbN.textContent=lbList.length>1?(lbI+1)+" / "+lbList.length:""; lb.classList.toggle("single",lbList.length<2)}
function openLB(list,i,p){lbList=list; lbI=i; lbP=p; lbShow(); lb.hidden=false; document.documentElement.classList.add("lb-open"); lb.querySelector(".lb-x").focus({preventScroll:true})}
function closeLB(){lbSecret=false; lbPh.classList.remove("lb-glitch"); lb.hidden=true; document.documentElement.classList.remove("lb-open")}
var lbSecret=false;
function lbGo(d){if(lbList.length<2) return;
  if(lbSecret){lbSecret=false; lbPh.classList.remove("lb-glitch"); lbI=d>0?0:lbList.length-1; lbShow(); return}
  if(d>0&&lbI===lbList.length-1&&lbP&&lbP.id==="school"){lbSecret=true; lbIm.src="img/k4z9.webp"; lbIm.alt=""; lbCap.textContent=CAP.k4z9; lbScr.removeAttribute("src"); lbPh.classList.remove("scary","on"); lbN.textContent="−1 / "+lbList.length;
    lbPh.classList.remove("lb-glitch"); void lbPh.offsetWidth; lbPh.classList.add("lb-glitch"); setTimeout(function(){if(window.SFegg) SFegg("g21")},1400); return}
  lbI=(lbI+d+lbList.length)%lbList.length; lbShow()}
lb.querySelector(".lb-x").onclick=closeLB; lb.querySelector(".lb-prev").onclick=function(e){e.stopPropagation(); lbGo(-1)}; lb.querySelector(".lb-next").onclick=function(e){e.stopPropagation(); lbGo(1)};
lb.addEventListener("click",function(e){if(e.target===lb) closeLB()});
lbPh.addEventListener("click",function(e){e.stopPropagation(); if(lbPh.classList.contains("scary")) lbPh.classList.toggle("on")});
var tx=null, ty=null; lb.addEventListener("touchstart",function(e){tx=e.touches[0].clientX; ty=e.touches[0].clientY},{passive:true});
lb.addEventListener("touchend",function(e){if(tx==null) return; var dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty; tx=null; if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){lbGo(dx<0?1:-1)} else if(dy>90&&Math.abs(dy)>Math.abs(dx)*1.5) closeLB()});
document.addEventListener("keydown",function(e){if(lb.hidden) return; if(e.key==="Escape"){e.stopPropagation(); closeLB()} else if(e.key==="ArrowRight") lbGo(1); else if(e.key==="ArrowLeft") lbGo(-1)},true);
/* метки */
var openId=null;
function render(){
  var R=rd(); pins.innerHTML="";
  P.forEach(function(p){if(p.from>R||(p.secret&&!eggGot(p.id))) return;
    var evs=p.ev.filter(function(e){return e[0]<=R}), hot=evs.some(function(e){return e[0]===R});
    var b=H("button","smap-pin"+(p.lab?" lab-"+p.lab:"")+(p.old?" old":"")+(p.closed&&R>=p.closed?" closed":"")+(openId===p.id?" sel":"")); b.type="button";
    b.style.left=(p.x/17.28)+"%"; b.style.top=(p.y/24.74)+"%"; b.setAttribute("aria-label",p.n+", событий: "+evs.length);
    b.innerHTML='<i></i><span>'+p.n+'</span>'; b.onclick=function(e){e.stopPropagation(); openPlace(p)}; pins.appendChild(b)});
  if(openId){var p0=P.filter(function(p){return p.id===openId})[0]; if(p0&&p0.from<=R) fill(p0); else closeCard()}
}
function fill(p){
  var R=rd(), evs=p.ev.filter(function(e){return e[0]<=R}); card.innerHTML="";
  var x=H("button","smap-x","×"); x.type="button"; x.setAttribute("aria-label","Закрыть"); x.onclick=closeCard; card.appendChild(x);
  card.appendChild(H("h3","",p.full||p.n)); if(p.old) card.appendChild(H("div","smap-tag","Старый Сентфор · Мёртвая зона"));
  var pl=p.pics?p.pics.filter(function(q){return typeof q==="string"||q[1]<=R}).map(function(q){return typeof q==="string"?q:q[0]}):null;
  if(pl&&pl.length){var g=H("div","smap-pics"+(p.wide?" wide":"")+(pl.length===1?" one":"")); pl.forEach(function(n,i){var f=H("figure","pol smap-pol"), ph=H("div","smap-ph"), im=new Image(); im.loading="lazy"; im.src="img/"+n+".webp"; im.alt=CAP[n]||p.n;  ph.appendChild(im); f.appendChild(ph);
    var sc=SCARY[n]; if(sc&&sc[1]<=R){var im2=new Image(); im2.loading="lazy"; im2.src="img/"+sc[0]+".webp"; im2.alt=""; im2.className="smap-scr";  ph.appendChild(im2); f.classList.add("scary")}
    (function(k){f.addEventListener("click",function(e){e.stopPropagation(); openLB(pl,k,p)})})(i); f.tabIndex=0; f.setAttribute("role","button"); f.setAttribute("aria-label","Открыть фото крупно");
    if(CAP[n]) f.appendChild(H("figcaption","",CAP[n])); g.appendChild(f)}); card.appendChild(g)}
  var pic=p.pics?null:evs.filter(function(e){return e[2]}).slice(-1)[0];
  if(pic){var f=H("figure","pol smap-pol"), im=new Image(); im.loading="lazy"; im.src="img/"+pic[2]+".webp"; im.alt=p.n;  f.appendChild(im); card.appendChild(f)}
  /* подписи событий убраны: только фото места */
  /* подписи событий убраны: только фото места */
}
function openPlace(p){openId=p.id; fill(p); var mob=innerWidth<=760; if(mob&&card.parentNode!==document.body) document.body.appendChild(card); else if(!mob&&card.parentNode!==wrap) wrap.appendChild(card); card.hidden=false; render(); card.scrollTop=0; if(!mob) requestAnimationFrame(function(){var t=card.getBoundingClientRect().top; if(t<170) scrollBy({top:t-176,behavior:"smooth"})})}
function closeCard(){openId=null; card.hidden=true; [].forEach.call(pins.children,function(b){b.classList.remove("sel")})}
board.addEventListener("click",closeCard); tb.addEventListener("click",function(){}); allTabs.forEach(function(b){if(b!==tb) b.addEventListener("click",closeCard)});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!card.hidden) closeCard()});
function centerScroll(){requestAnimationFrame(function(){scroll.scrollLeft=(scroll.scrollWidth-scroll.clientWidth)/2})}
var en=document.getElementById("ep-name"); if(en) new MutationObserver(function(){updateTab(); if(!sec.hidden) render()}).observe(en,{childList:true,characterData:true,subtree:true});
/* открыть место снаружи (геометки в блоге Поппи) */
window.SFmapOpen=function(id){if(!mapAllowed()) return false;
  if(!id){showMap(); setTimeout(function(){var r=sec.getBoundingClientRect(); scrollBy({top:r.top-120,behavior:"smooth"}); centerScroll()},80); return true}
  var p=P.filter(function(x){return x.id===id})[0]; if(!p) return false;
  showMap(); setTimeout(function(){openPlace(p); var r=sec.getBoundingClientRect(); scrollBy({top:r.top-120,behavior:"smooth"}); if(innerWidth>760){var pin=pins.querySelector(".sel"); if(pin) pin.scrollIntoView({block:"center",inline:"center",behavior:"smooth"})}},80); return true};

var candle=H("button","smap-candle"); candle.type="button";  candle.style.left=(GRAVE.x/17.28)+"%"; candle.style.top=(GRAVE.y/24.74)+"%"; candle.innerHTML="<i></i>"; pins.parentNode.appendChild(candle);
function candleUpd(){candle.hidden=eggGot("g20")||!mapAllowed()}
candle.onclick=function(e){e.stopPropagation(); if(candle.classList.contains("go")) return; candle.classList.add("go"); board.classList.add("smap-dark");
  setTimeout(function(){if(window.SFegg) SFegg("g20"); candleUpd(); render(); board.classList.remove("smap-dark"); var pin=[].filter.call(pins.children,function(b){return b.textContent==="???"})[0]; if(pin) pin.classList.add("smap-new")},1600);
  setTimeout(function(){openPlace(GRAVE)},2600)};
candleUpd(); if(en) new MutationObserver(candleUpd).observe(en,{childList:true,characterData:true,subtree:true});
/* «КОЛОКОЛ» (с.22): колокольчик у башни, три удара подряд */
var bell=H("button","smap-bell"); bell.type="button"; bell.setAttribute("aria-label","Колокольчик"); bell.style.left=(1000/17.28)+"%"; bell.style.top=(52/24.74)+"%";
bell.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a1.4 1.4 0 0 1 1.4 1.4v.5A6 6 0 0 1 18 10.8V15l2 2.4H4L6 15v-4.2a6 6 0 0 1 4.6-5.9v-.5A1.4 1.4 0 0 1 12 3z" fill="#e0b84f" stroke="#2a1a3a" stroke-width="1.4" stroke-linejoin="round"/><path d="M9 7.5c-1.3.8-2 2-2 3.6" stroke="#fff4c8" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="12" cy="19.8" r="2" fill="#e0b84f" stroke="#2a1a3a" stroke-width="1.2"/></svg>';
pins.parentNode.appendChild(bell);
function bellUpd(){bell.hidden=!mapAllowed()||rd()<22}
var hits=[], ringing=false;
function noScare(){return !!(window.SFnoScare&&SFnoScare())}
function dong(){try{var A=window.AudioContext||window.webkitAudioContext; if(!A) return; var c=new A(), t=c.currentTime, g=c.createGain(); g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.5,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+4.5); g.connect(c.destination);
  [[196,1],[392,.5],[541,.35],[1058,.18],[1470,.08]].forEach(function(p){var o=c.createOscillator(), og=c.createGain(); o.frequency.value=p[0]; og.gain.value=p[1]; o.connect(og); og.connect(g); o.start(t); o.stop(t+4.6)});
  setTimeout(function(){try{c.close()}catch(e){}},5000)}catch(e){}}
bell.onclick=function(e){e.stopPropagation(); if(ringing) return; var now=Date.now(); hits=hits.filter(function(x){return now-x<2500}); hits.push(now);
  bell.classList.remove("tap"); void bell.offsetWidth; bell.classList.add("tap");
  if(hits.length>=3){hits=[]; ringing=true; bell.classList.add("ring");
    if(!noScare()){dong(); document.body.classList.add("sh-quake"); setTimeout(function(){document.body.classList.remove("sh-quake")},900)}
    setTimeout(function(){bell.classList.remove("ring"); ringing=false; if(window.SFegg) SFegg("kolokol")},1400)}};
bellUpd(); if(en) new MutationObserver(bellUpd).observe(en,{childList:true,characterData:true,subtree:true});
window.SFmapAllowed=mapAllowed;
updateTab(); render();
})();
