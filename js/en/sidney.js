/* Телефон Сидни: её Телеграм-канал, который постепенно «портится» */
(function(){
var URL0="https://t.me/sidneyWwW";
/* ссылка на пост: на английской версии — английский канал (там своя нумерация) */
function TG(ru,en){return window.SFLANG==="en"?"https://t.me/sydneywhitley"+(en?"/"+en:""):URL0+(ru?"/"+ru:"")}
/* st: 0 обычный, 1 тревога, 2 сбой, 3 не она */
var POSTS=[
 {d:"March 7",t:"02:10",st:0,txt:"Insight called me again. They want me in their documentary about the senator's case and his “laundromats” for dirty money. Funny. They want to bury this story in a pretty edit, as if it were the end of my career.\n\nI'm a journalist, not a TV star. My place is in dusty archives, not under the spotlights. I'm not going to rest on my laurels. Right now I'm going through development reports for the town's northern sector. Something doesn't add up there... I have a feeling the smell of smoke will be stronger than last time.",r:[["✍","1.1K"],["❤","469"],["👨‍💻","213"],["🤔","111"]],v:"32.7K"},
 {t:"10:25",st:0,txt:"Weird 🤔 I tried to find information about research on the old town, but all the municipal archives are blocked “for technical reasons”.\nI went there in person. Security kicked me out after five minutes, even though I had a permit. While walking to my car, I caught myself thinking the air had a kind of... sweet taste. And it's so quiet. Not even the birds sing in this forest. Maybe it's just paranoia after a sleepless night 😴",r:[["✍","906"],["🤔","347"],["❤","280"],["👨‍💻","116"]],v:"33.3K"},
 {d:"March 8",t:"14:14",st:0,txt:"Okay, this isn't a technical glitch anymore. My source at city hall stopped answering, and this morning I found that someone had tried to break the lock on my apartment.\n\nThey think they scared me 😡 Wrong. They fired me up. Packed a bag, a voice recorder, spare batteries and a camera. Heading toward the old sewer. If the corporation is hiding something this hard, I have to find it.\nI'll check in tomorrow.\n\nDon't miss me ❤️",r:[["✍","962"],["❤","355"],["🤔","277"],["👨‍💻","117"]],v:"34.1K"},
 {d:"March 9",t:"11:03",st:0,img:["img/sid_road.webp"],txt:"Drove a bit farther from the center. You know, it's beautiful here. So quiet your ears ring. Only for some reason it feels like a thousand eyes are watching you from behind these trees 👀",r:[["✍","991"],["❤","532"],["👨‍💻","215"],["🤔","90"]],v:"36.2K"},
 {d:"March 11",t:"00:48",st:1,img:["img/sid_files_en.webp"],txt:"Found a storeroom in an abandoned building. The whole floor is covered in personal files. These aren't documents, they're school questionnaires.\nLook at these dates. Dozens of teenagers. Officially they're listed as “resettled” or “missing”. But why are their photos here, in the corporation's archives, marked “unfit”, moved and “**2”?\n\nMy hands are shaking as I write this.",r:[["✍","999"],["🤔","391"],["❤","322"],["👨‍💻","102"]],v:"40K",th:[["e-forms",11,"Howard's “object” files"]]},
 {t:"04:54",st:1,img:["img/sid_drawing.webp"],txt:"Found a folder of children's drawings. They don't draw the sun and mom. They draw HIM. It's everywhere. On every page. A strange thing…",r:[["✍","1.08K"],["🤔","386"],["❤","316"],["👨‍💻","119"]],v:"42.5K",th:[["w-junk",5,"The creature at the junkyard, 1.05"]]},
 {t:"05:31",st:1,img:["img/sid_note1.webp","img/sid_note2.webp","img/sid_woman.webp"],txt:"Going deeper. Found someone's stash in the wall.\nA broken clock (the hands frozen at <b>18:06</b>).\nA single sneaker stained with something black and sticky.\nA notebook. With drawings! 😨\n\n#horror",r:[["🤔","1.15K"],["❤","574"],["✍","248"],["👨‍💻","63"]],v:"42.4K",th:[["t-18-06-i-02-59-dve-minuty-sentfora",19,"The “18:06 and 02:59” theory"]]},
 {t:"18:29",st:1,media:"video",src:"video/sid-mirror.mp4",poster:"img/sid_p13.webp",txt:"Yesterday I thought I saw a faceless man standing behind me in the reflection of a shop window. When I turned around, there was no one. I think I'm losing my mind.",r:[["❤","1.63K"],["🤔","532"],["✍","295"],["👨‍💻","80"]],v:"53.4K",link:TG(13,14)},
 {d:"March 12",t:"03:36",st:1,media:"voice",src:"audio/sid-voice.mp3",txt:"I tried to talk to the locals at the gas station. But the worst part — I started hearing a hum. A low-frequency noise that seems to come from underground. Or from my head?..",r:[["🤔","1.72K"],["❤","665"],["👨‍💻","274"],["✍","132"]],v:"52.6K",link:TG(14,15)},
 {t:"18:06",st:2,txt:"I FOUND IT.\nGod, if I get out and publish everything… It'll be the biggest scoop in the history of journalism. The whole town isn't a town, it's...\n\nI can't write the details here. I'll only say one thing: everything they told us about progress is a lie covering up a real hell. This will be my triumph.",r:[["❤","2.06K"],["🤔","668"],["👨‍💻","341"],["✍","159"]],v:"46.4K",hot:1},
 {t:"23:06",st:2,img:["img/sid_p16.webp"],txt:"I was drawn here by a message from a resident of this territory.\n\nTerritory of death is the truest reading of this abbreviation. Everything here is soaked in death. Bones all around, abandoned things…\n\nIt feels like this place is slowly swallowing everything alive. Even the silence here is somehow wrong... heavy, crushing... you know?",r:[["❤","1.72K"],["🤔","643"],["✍","339"],["👨‍💻","100"]],v:"70.9K",link:TG(16,18)},
 {d:"March 13",t:"19:06",st:3,img:["img/sid_p17.webp"],txt:"The hum stopped. Now I understand. The black shadow is not the enemy.\n\nI draw now too. It's much clearer than words. Words are not true. Eyes... there have to be eyes everywhere to see how they come. 👁️ Sleep tight, townsfolk. Someone's already keeping an eye on you 🌺",r:[["❤","2.21K"],["🤔","799"],["👨‍💻","382"],["✍","173"]],v:"44.2K",link:TG(17,19)},
 {d:"March 14",t:"16:57",st:3,img:["img/sid_p19.webp"],txt:"I'm still conscious, but that smell and that town… they keep pulling me back...",r:[["❤","1.82K"],["🤔","572"],["👨‍💻","295"],["✍","146"]],v:"39.5K",link:TG(19,21)},
 {t:"18:35",st:3,hand:1,img:["img/sid_p20_en.webp"],txt:"One, two, three, four, five,\nI'm coming for you, dead or alive.\nPiece by piece, along the trail,\nThrough the bloody corners, pale.\nWhere are you hiding — answer me…\nIf you've still got a throat to wheeze.",r:[["❤","2.19K"],["🤔","637"],["✍","348"],["👨‍💻","87"]],v:"42.1K",link:TG(20,22),th:[["w-guilt",13,"Shadow children with a counting rhyme, 1.13"]]},
 {t:"19:08",st:3,big:1,txt:"See you soon 😈",r:[["❤","2.36K"],["🤔","549"],["👨‍💻","352"],["✍","157"]],v:"42.8K"},
 {d:"March 18",t:"19:06",st:3,img:["img/sid_p22.webp"],txt:"It's so calm and safe here. I have everything I need: a comfy bed, my favorite camera and a window with a beautiful view. I can leave anytime I want. But for now... for now I like it here too much ❤️",r:[["❤","1.97K"],["🤔","1.02K"],["👨‍💻","366"],["✍","186"]],v:"38.8K",link:TG(22,24)},
 {d:"March 20",t:"18:00",st:3,img:["img/sid_p24_en.webp"],dec:window.SFLANG==="en"?["Decode the numbers on the desk",["19","01","09","14","20","06","14","20","17"],"SAINTFOUR","letter number in the alphabet (the last three are one short)"]:["Decode the numbers on the desk",["19","06","15","20","22","16","18"],"СЕНТФОР","letter number in the alphabet (the last three are one short)"],txt:"Everything’s blurring together… Days, nights, the smell… I’m not even sure I remember where I am. Is this a room in a house? Or have I been in the woods this whole time?\nThese thoughts… they aren’t mine. Too loud. Too different. Too many \"other\" voices.\nThere are numbers in my head but I don’t understand what they mean. How are they supposed to help?\n\nSomething is coming; I can feel it. Something… terrible. I… I can’t just sit here and wait anymore. I can’t.",r:[["❤","1.7K"],["🤔","643"],["👨‍💻","284"],["✍","144"]],v:"77.1K",link:TG(24,26)},
 {d:"November 19",t:"19:30",st:3,morse:window.SFLANG==="en"?"HELP! THERE'S NO WAY OUT.":"ПОМОГИТЕ. ВЫХОДА НЕТ. — “Help. There's no way out.” (Russian Morse code)",img:["img/sid_p25.webp"],txt:window.SFLANG==="en"?".... . .-.. .--. -.-.--\n- .... . .-. . .----. ...\n-. --- / .-- .- -.--\n--- ..- - .-.-.-":".--. --- -- --- --. .. - . ......\n.-- -.-- .... --- -.. .-\n-. . - ......",r:[["😱","1.2K"],["🤔","640"],["❤","410"],["✍","120"]],v:"31.4K",link:TG(0,27)},
 {d:"November 20",t:"17:19",st:2,last:1,img:["img/sid_p26_en.webp"],txt:"Sorry about yesterday. I must have overworked myself, so I started seeing things.\nI’m fine, really. I’m just… not getting enough sleep.",r:[["🤔","412"],["❤","180"],["🙏","96"]],v:"6.8K",link:TG(0,28)}
];
var RM=matchMedia("(prefers-reduced-motion:reduce)").matches;
function H(t,c,x){var e=document.createElement(t); if(c) e.className=c; if(x!=null) e.textContent=x; return e}
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/&lt;(\/?)b&gt;/g,"<$1b>")}
function rd(){return (window.SF&&SF.read)||1}
var finT=0; function fin(){if(!box||box.hidden||endShown) return; endShown=true; finale()}
var box=null, feed=null, lastF=null, glT=0, endShown=false, io=null;
function build(){
  box=H("div","sphone"); box.hidden=true; box.setAttribute("role","dialog"); box.setAttribute("aria-modal","true"); box.setAttribute("aria-label","Sydney Whitley's phone");
  var ph=H("div","sp-phone"), bar=H("div","sp-status"); bar.innerHTML='<span class="sp-clock">18:06</span><span class="sp-ic" aria-hidden="true"><svg class="sp-net" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5.5" width="3" height="6.5" rx=".8"/><rect class="off" x="10" y="3" width="3" height="9" rx=".8"/><rect class="off" x="15" y="0" width="3" height="12" rx=".8"/></svg><svg class="sp-bat" viewBox="0 0 27 13"><rect x=".6" y=".6" width="22.8" height="11.8" rx="3.4" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.2"/><rect x="24.6" y="4.2" width="1.8" height="4.6" rx=".9" fill="currentColor" fill-opacity=".45"/><rect class="lvl" x="2.4" y="2.4" width="3.6" height="8.2" rx="1.6"/></svg></span>'; ph.appendChild(bar);
  var hd=H("div","sp-head"), back=H("button","sp-back","‹"); back.type="button"; back.setAttribute("aria-label","Close the phone"); back.onclick=close; hd.appendChild(back);
  var av=H("img","sp-av"); av.src="img/sidney.webp"; av.alt=""; hd.appendChild(av);
  var nm=H("div","sp-name"); nm.appendChild(H("b","","Sydney Whitley ✍🏽")); nm.appendChild(H("span","","8,986 subscribers")); hd.appendChild(nm); ph.appendChild(hd);
  feed=H("div","sp-feed"); feed.appendChild(H("div","sp-sys","Channel created · February 16"));
  POSTS.forEach(function(p,i){
    if(p.d) feed.appendChild(H("div","sp-date",p.d));
    var m=H("div","sp-msg st"+p.st+(p.hand?" hand":"")+(p.big?" big":"")+(p.last?" last":"")); m.dataset.i=i;
    if(p.img){var g=H("div","sp-imgs n"+p.img.length); p.img.forEach(function(s){var im=H("img"); im.loading="lazy"; im.src=s; im.alt="";  g.appendChild(im)}); m.appendChild(g)}
    if(p.media==="video"){var vd=H("video","sp-video"); vd.src=p.src; vd.poster=p.poster; vd.controls=true; vd.preload="none"; vd.playsInline=true; vd.setAttribute("playsinline",""); vd.setAttribute("webkit-playsinline",""); m.appendChild(vd)}
    if(p.media==="voice") m.appendChild(voice(p.src));
    var tx=H("div","sp-txt"+(p.morse?" morse":"")); tx.innerHTML=esc(p.txt).replace(/\n/g,"<br>"); m.appendChild(tx);
    if(p.dec){var db=H("button","sp-morse",p.dec[0]); db.type="button"; db.onclick=function(){var r=H("div","sp-morse-r dec"); var g=H("div","sp-dec"); p.dec[1].forEach(function(n,k){var c=H("span"); c.appendChild(H("i","",n)); c.appendChild(H("b","",p.dec[2][k])); g.appendChild(c)}); r.appendChild(g); r.appendChild(H("small","",p.dec[3])); db.replaceWith(r)}; m.appendChild(db)}
    if(p.morse){var mb=H("button","sp-morse","Decode"); mb.type="button"; mb.onclick=function(){var r=H("div","sp-morse-r",p.morse); mb.replaceWith(r); if(!feed.querySelector(".sp-morse")&&feed.querySelector(".sp-msg.last.seen")){clearTimeout(finT); finT=setTimeout(fin,3500)}}; m.appendChild(mb)}
    if(p.th){p.th.forEach(function(t){if(rd()<t[1]) return; var a=H("a","jump sp-thread","↳ "+t[2]); a.href="#"+t[0]; a.setAttribute("data-jump",t[0]); m.appendChild(a)})}
    var ft=H("div","sp-foot"), rs=H("div","sp-reacts"); p.r.forEach(function(r){rs.appendChild(H("span","",r[0]+" "+r[1]))}); ft.appendChild(rs);
    ft.appendChild(H("span","sp-meta","👁 "+p.v+" · "+p.t)); m.appendChild(ft);
    if(p.link){var l=H("a","sp-orig","post in the channel ↗"); l.href=p.link; l.target="_blank"; l.rel="noopener"; m.appendChild(l)}
    feed.appendChild(m)});
  ph.appendChild(feed);
  var end=H("div","sp-end"); end.appendChild(H("b","","18:06")); end.appendChild(H("span","","no signal")); ph.appendChild(end);
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
  b.type="button"; b.setAttribute("aria-label","Listen to voice message");
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
