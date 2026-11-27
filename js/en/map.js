/* Карта Сентфора. Открывается тем, кто дочитал до 19-й серии */
(function(){
try{localStorage.removeItem("sentfor_maptest")}catch(e){}

var NS="http://www.w3.org/2000/svg";
function S(t,a,p){var e=document.createElementNS(NS,t); for(var k in a) e.setAttribute(k,a[k]); if(p) p.appendChild(e); return e}
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function rd(){return (window.SF&&SF.read)||1}

/* места: x,y в пикселях картинки 1728×2474; ev: [серия, текст, картинка?] */
var P=[
 {id:"school",lab:"r",n:"School",pics:["school_out","school_hall","school_gym","school_office","school_chem"],wide:1,full:"Saintfour High",x:1065,y:1945,ev:[
  [1,"The lights go out. In the restroom Nadine sees a white-eyed shadow for the first time, and “he's back” is scratched into the tile.","shadow"],
  [3,"Miranda's death is announced in the gym. The Thing in the restroom: “I have twelve arms… Someone will kill everyone soon.”","creature"],
  [4,"At night Nadine wakes up in an empty school. By Miranda's locker a whisper: “Come…”, inside black hellebore, two with roots walk down the hallway.","whisper"],
  [4,"The tapes and the printout of the Tower disappear from the newsroom."],
  [5,"A bone that's far too big lies in the leaves by the school.","ev_bone"],
  [6,"On prank night the watchman comes out covered in blood.","storozh_blood"],
  [7,"The blood turned out to be fake. Howard comes to the school, and the principal fawns over him."],
  [9,"Howard comes into the newsroom, reads Nadine's board and advises her not to meddle."],
  [10,"The board in the newsroom has been erased."],
  [11,"Howard's guards check the students' bags."],
  [13,"In the locker room, “It's all your fault” in blood, shadow children chant a counting rhyme. Rotten hellebore in Miranda's bag.","kids13"],
  [19,"Parents' meeting: Howard says the Owls make a drug from hellebore."]]},
 {id:"martinez",n:"Miranda's house",pics:["miranda_house","miranda_living","miranda_room"],wide:1,full:"The Martinez house (Miranda's)",x:693,y:2152,ev:[
  [2,"A sweet acrid smell, Miranda's face changes, a silhouette behind the door glass. That same evening Miranda dies.","miranda_porch"],
  [3,"Questioning: Miranda was found in a tree by the house. At 18:06 she called her brother. In her room: a camera covered in moss and tapes.","cassette"],
  [4,"A matte gray car is parked by the house.","car"],
  [6,"The police saw Tom by the house when they were taking Miranda down from the tree."]]},
 {id:"rudi",lab:"b",n:"Rudy's house",pics:["rudi_living","rudi_room"],wide:1,x:893,y:1868,ev:[
  [1,"Rudy Brooks lives next door to Nadine, they've been friends since childhood."]]},
 {id:"nadin",lab:"tr",n:"Nadine's house",pics:["nadin_room","jimmy_room","nadin_kitchen","nadin_hall"],wide:1,x:951,y:1868,ev:[
  [4,"Dad looks at the photo of the Tower: you can't build something like that. A gray car stops by the house."],
  [9,"A tape on the windowsill: “Everything you need to know is here.”","tape9"],
  [10,"In a dream her mom grins by the stairs, and someone is already under the bed.","underbed"],
  [17,"Nadine sees herself dead, overgrown with hellebore, and screams by the garage, but no one hears her.","deadnadin17"],
  [18,"At night someone lies next to her in bed. In the morning there are hellebore flowers under the pillow.","double18"],
  [19,"Alice drives something off with the click of her camera. Jimmy looks out the window: “W-who is that?”"]]},
 {id:"police",lab:"t",n:"Police",pics:["police_office"],wide:1,full:"Police station",x:700,y:1880,ev:[
  [1,"The sheriff handles the missing Malcolm case and calls Dex in."],
  [10,"After Howard's interview the Owls are called in for questioning."],
  [11,"Howard brings Nadine here."]]},
 {id:"shop",lab:"r",n:"Thrift store",pics:["shop_in","shop_basement2"],wide:1,full:"Coleman's thrift store",x:1085,y:2037,ev:[
  [9,"Sarah wore almost everything here. In the basement the world turns upside down, black hair crawls out of the mirror.","mirror9"]]},
 {id:"junk",n:"Junkyard",x:1062,y:1360,pics:["junk_day","junk_night"],wide:1,ev:[
  [5,"A shadow behind a trailer and a sweet smell, Alice sees nothing. In Alice's photo the sheriff argues with Howard here.","junk_shadow"],
  [6,"Poppy and Olivia search the abandoned cars."],
  [7,"They find a pit."],
  [8,"Tom is in the pit. The field meter goes off the charts, bits of metal with red lights nearby. At the party the man in the suit shoots the guy in the beanie."],
  [10,"On Poppy's recording: a gunshot, people in suits burying a body."]]},
 {id:"howard",n:"Howard's house",pics:["howard_gate","howard_hall","howard_lib"],wide:1,x:1382,y:1418,ev:[
  [11,"At the gate, a woman smelling of mothballs. In the house: files on “objects” and junkyard photos. Howard catches Nadine.","junk_photo11"]]},
 {id:"lab",lab:"r",n:"Lab",pics:["lab_in"],wide:1,full:"Warlock lab",x:1200,y:228,old:1,ev:[
  [1,"The field anomaly has “gone beyond all limits”. Howard: “Let them out.” One of them sprouts flowers.","rooted_boy"]]},
 {id:"fence",n:"The way in",pics:["fence_forest"],wide:1,full:"The border and the hole in the fence",x:1206,y:1278,ev:[
  [1,"Miranda went to Old Saintfour with a guy from the Owls and saw something she can't describe."],
  [5,"Two guys went missing in Old Saintfour: “No one comes back from there in their right mind.”"],
  [8,"Dex knows a way into Old Saintfour."],
  [12,"Steve Bailey died on the fence spikes at the border. It was ruled an accident.","fence12"],
  [14,"The kids sneak into Old Saintfour. Darren measures the field, it “drifts”. Alice was here as a kid."],
  [17,"Howard orders the hole sealed."],
  [21,"The gap has been sealed."]],closed:21},
 {id:"tunnel",n:"Tunnel",pics:["fence_forest"],wide:1,full:"The border and the tunnel",x:910,y:1300,ev:[
  [21,"Dex knows a tunnel under the fence. The current hits every four seconds, so you crawl through on the count of “three.”"]]},
 {id:"forest",n:"Woods",pics:["forest"],wide:1,x:300,y:1500,ev:[
  [4,"This is where little Nadine and her grandpa first came across hellebore."],
  [6,"A deer that belongs in Old Saintfour comes into town. Hellebore nearby, Nadine burns her hand.","deer"],
  [9,"At night something like a gunshot was heard from the woods."],
  [16,"In 1986 a wooden statue of the Faun stands here.","statue16"],
  [17,"In the woods the man in the suit catches the kids: “I've got them.”"]]},
 {id:"tower",n:"The Tower",pics:["tower_fence",["tower_in",15]],wide:1,x:1000,y:200,old:1,ev:[
  [1,"One of those released makes it to the Tower and goes inside."],
  [3,"On the 2017 tape: the Tower and people with rifles.","tower_prologue"],
  [15,"Nadine follows the ringing bell: inside, a staircase into the sky and dozens of doors. One leads to 1986.","tower_inside"],
  [16,"Malcolm: “Let me out. I'm hungry.” Above the exit, a plaque with symbols.","plaque16"],
  [18,"Nadine is pulled toward the Tower “on autopilot” twice."],
  [19,"The symbols on the plaque are a date: September 23, 2023."],
  [22,"The plaque above the old door is blank; above another one, “23”. Two bodies lie in the hellebore thickets."]]},
 {id:"hospital",n:"Hospital",pics:["hosp_hall3","hosp_room3"],wide:1,full:"Abandoned hospital",x:808,y:984,old:1,ev:[
  [15,"Nadine came to here after the vision with Candy. Hellebore vines wrap around the Owl Chad.","candy15"]]},
 {id:"sara",n:"Sarah's house",pics:["sara_street","sara_room2"],wide:1,x:1057,y:1122,old:1,ev:[
  [14,"A face behind the curtain, a photo with a scratched-out face, a card for Sarah and a key with a rune.","curtain14"],
  [16,"In 1986 Sarah O'Neil lives here."]]},
 {id:"rink",n:"Roller rink",pics:["rink_in"],wide:1,x:804,y:1124,old:1,ev:[
  [14,"In a photo of the empty roller rink, hands and a skull appear.","rink14"]]},
 {id:"hill",hide:1,n:"Mrs. Hill's shop",x:0,y:0,old:1,ev:[
  [16,"1986: the same mirror Nadine broke in the thrift store. Mrs. Hill gives her a tape and a mint candy.","hill16"]]},
 {id:"library",lab:"b",n:"Library",pics:["library","darkroom",["archive",12]],wide:1,x:969,y:1975,ev:[
  [5,"The librarian remembers the “Shadows of Saintfour” book. In the darkroom at the library a shadow appears behind Miranda on the film."],
  [6,"In the darkroom, Miranda: “He's looking for you.”"],
  [12,"A child's whisper and a girl by the shelves. The whisper turned out to be Poppy's prank, but the girl didn't.","ghost12"],
  [12,"In the police archive at the library: a “Have you seen me?” flyer and a red-haired girl with a ball. The Steve Bailey and 1986 case files.","archive_girl12"],
  [13,"The archive has the 1986 cases: Candy came back from the swamp, Sam died in the woods, Bobby, Megan and Freddie went missing.","files13"]]},
 {id:"laundry",lab:"l",n:"Laundromat",pics:["laundry"],wide:1,full:"4Spins laundromat",x:608,y:1858,ev:[
  [5,"Dex works here."],
  [7,"Dex says Tom worked with him here and stopped showing up for work a week ago."]]},
 {id:"darren",n:"Darren's house",x:1572,y:1498,ev:[
  [18,"In his father's office Darren finds his mom's notes: she worked for Warlock and called the Tower the Obscura. There's also a tape from July 2017."]]},
 {id:"camp",n:"The old camp",pics:["camp","camp_hut"],wide:1,x:758,y:1376,ev:[
  [18,"Darren hides his mom's tape here."]]},
 {id:"garage",n:"Dex's garage",x:1460,y:2154,pics:["garage_in2","garage_out2"],wide:1,ev:[[1,"Dex's garage by the river. Inside: a motorcycle, a record player with records, a plaid couch and a table made from a cable spool."]]},
 {id:"cafe",lab:"t",n:"Diner",full:"Saintfour Diner",pics:["cafe"],wide:1,x:1181,y:1848,ev:[[1,"A diner on a quiet residential street."]]},
 {id:"oldstreet",n:"Street",full:"A street in Old Saintfour",pics:["old_street"],wide:1,x:932,y:1056,old:1,ev:[
  [16,"Nadine came to on the same street she walked in 1986, only now it's overgrown with hellebore."],
  [22,"Nadine and Jimmy come out on this street in the past, while Miranda is still alive. In an abandoned house the shadow nearly takes Jimmy."]]}
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
var tb=H("button","tab","Map"); tb.type="button"; tb.setAttribute("role","tab"); tb.setAttribute("data-tab","map"); tb.setAttribute("aria-controls","tab-map");
var gameTab=tabs.querySelector('[data-tab="game"]'); tabs.insertBefore(tb,gameTab||null);
var sec=H("section"); sec.id="tab-map"; sec.setAttribute("data-tab","map"); sec.hidden=true;
sec.innerHTML='<h2>Map of Saintfour</h2><p class="lead">Where everything happened. Tap a marker to open the place.</p>';
var wrap=H("div","smap-wrap"), scroll=H("div","smap-scroll"), board=H("div","smap-board");
var svg=new Image(); svg.className="smap-img"; svg.loading="lazy"; svg.src=(window.SFLANG==="en"?"img/map_sentfor1_en.webp":"img/map_sentfor1_en.webp"); svg.alt="Map of Saintfour"; svg.decoding="async"; svg.width=1400; svg.height=2004;
var pins=H("div","smap-pins"), card=H("div","smap-card"); card.hidden=true;
board.appendChild(svg); board.appendChild(pins); scroll.appendChild(board); wrap.appendChild(scroll); wrap.appendChild(card); sec.appendChild(wrap);
var legend=H("div","smap-legend"); legend.innerHTML='<span><i class="lg-pin"></i>place</span><span><i class="lg-pin old"></i>Old Saintfour</span><span><i class="lg-zone"></i>Dead Zone</span>'; sec.appendChild(legend);
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
var CAP={m7q2:dz("LG9tQ7L0AGNI1C9iR3L0AGdkRfY0gAL00CtjRHY0gIY04CdgR7L09CNuQDY0/CNIAGtvQ/L0gUY04CdgRDivQTL0g4L0CGdL+CtgRrJ0"),k4z9:dz("=sY07CtvQrL0IGNI1CdvQDL07C9vQDCvQ7L09CNtQ7L0gAL09CNI4CdvQDigRXL09CNIxIJiiDCsQbL0wCtgR3K0"),school_office:"The “Shadows of Saintfour” newsroom",school_gym:"Gym",school_hall:"Hallway",darkroom:"Darkroom",archive:"Police archive",
 howard_hall:"Lobby",howard_lib:"Library",miranda_living:"Living room",miranda_room:"Miranda's room",nadin_room:"Nadine's room",jimmy_room:"Jimmy's room",
 nadin_kitchen:"Kitchen",nadin_hall:"Second floor",shop_basement2:"Basement",camp_hut:"Counselors' cabin",tower_in:"Inside the Tower",hosp_hall3:"Hallway",hosp_room3:"Hospital room",rudi_living:"Living room",rudi_room:"Rudy's room",school_chem:"Chemistry lab",sara_room2:"Living room",police_office:"Sheriff's office"};
/* жуткие версии фото: [картинка, с какой серии] — проявляются при наведении (на телефоне по нажатию) */
var SCARY={nadin_hall:["x_nadin_hall",10],nadin_room:["x_nadin_room",10],darkroom:["x_darkroom",6],junk_day:["x_junk_day",5],junk_night:["x_junk_night",8],library:["x_library",12],shop_basement2:["x_shop_basement2",9],howard_gate:["x_howard_gate",11],sara_room2:["x_sara_room2",14],hosp_hall3:["x_hosp_hall3",15],hosp_room3:["x_hosp_room3",15],rink_in:["rink14",14],cafe:["x_cafe",6],school_office:["x_school_office",4],school_hall:["x_school_hall",4],miranda_house:["x_miranda_house",2]};

/* просмотр фото крупно: листание стрелками/свайпом, жуть — наведением или нажатием на фото */
var lb=H("div","smap-lb"); lb.hidden=true; lb.setAttribute("role","dialog"); lb.setAttribute("aria-modal","true");
lb.innerHTML='<button type="button" class="lb-x" aria-label="Close">×</button><button type="button" class="lb-a lb-prev" aria-label="Previous photo">‹</button><figure class="lb-fig"><div class="lb-ph"><img class="lb-im" alt=""><img class="lb-scr" alt=""></div><figcaption class="lb-cap"></figcaption><div class="lb-n"></div></figure><button type="button" class="lb-a lb-next" aria-label="Next photo">›</button>';
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
    b.style.left=(p.x/17.28)+"%"; b.style.top=(p.y/24.74)+"%"; b.setAttribute("aria-label",p.n+", events: "+evs.length);
    b.innerHTML='<i></i><span>'+p.n+'</span>'; b.onclick=function(e){e.stopPropagation(); openPlace(p)}; pins.appendChild(b)});
  if(openId){var p0=P.filter(function(p){return p.id===openId})[0]; if(p0&&p0.from<=R) fill(p0); else closeCard()}
}
function fill(p){
  var R=rd(), evs=p.ev.filter(function(e){return e[0]<=R}); card.innerHTML="";
  var x=H("button","smap-x","×"); x.type="button"; x.setAttribute("aria-label","Close"); x.onclick=closeCard; card.appendChild(x);
  card.appendChild(H("h3","",p.full||p.n)); if(p.old) card.appendChild(H("div","smap-tag","Old Saintfour · Dead Zone"));
  var pl=p.pics?p.pics.filter(function(q){return typeof q==="string"||q[1]<=R}).map(function(q){return typeof q==="string"?q:q[0]}):null;
  if(pl&&pl.length){var g=H("div","smap-pics"+(p.wide?" wide":"")+(pl.length===1?" one":"")); pl.forEach(function(n,i){var f=H("figure","pol smap-pol"), ph=H("div","smap-ph"), im=new Image(); im.loading="lazy"; im.src="img/"+n+".webp"; im.alt=CAP[n]||p.n;  ph.appendChild(im); f.appendChild(ph);
    var sc=SCARY[n]; if(sc&&sc[1]<=R){var im2=new Image(); im2.loading="lazy"; im2.src="img/"+sc[0]+".webp"; im2.alt=""; im2.className="smap-scr";  ph.appendChild(im2); f.classList.add("scary")}
    (function(k){f.addEventListener("click",function(e){e.stopPropagation(); openLB(pl,k,p)})})(i); f.tabIndex=0; f.setAttribute("role","button"); f.setAttribute("aria-label","Open photo full size");
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
var bell=H("button","smap-bell"); bell.type="button"; bell.setAttribute("aria-label","A little bell"); bell.style.left=(1000/17.28)+"%"; bell.style.top=(52/24.74)+"%";
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
