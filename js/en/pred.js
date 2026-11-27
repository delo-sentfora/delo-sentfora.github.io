/* Прогнозы к обновлению (серии 20–23): ставки на сюжет, проценты других читателей, карточка для сторис.
   Ответы — в localStorage sentfor_pred и в Supabase (таблица preds, supabase/pred.sql).
   После выхода серий заполнить RES: {id вопроса: [ключи верных вариантов]} — появится «угадано N из M». */
(function(){
var CLOSE=Date.UTC(2026,10,21,12,0,0);            /* сб 21 ноября 15:00 по Москве */
var SRC='<a href="https://t.me/ShadowsSaintfour" target="_blank" rel="noopener">“Black Hellebore”</a>';
/* итоги серий 20–23 (решение автора сайта). HALF — засчитано наполовину. Видны только тем, кто дочитал до 23 серии */
var RES0={split:["pairs"],e1:["see","rest"],e2:[],e3:["forest","tower"],e4:[],tol:["past"],die:["no"],back86:["other"],tv:[],ghost:["no"],ts1:["none"],hall:["no"],reveal:["no"]};
var HALF0={e4:["side"],die:["edge"],tv:["death"]};
var RES={}, HALF={};
function upd(){var ok=!!(window.SF&&SF.read>=23); RES=ok?RES0:{}; HALF=ok?HALF0:{}}
upd();
var Q=[
  {id:"split",s:"How to read",em:"🧩",q:"How to read the 8 emojis?",o:[["pairs","One pair per episode: 📸😮‍💨 | 🔥😰 | 🔦📺 | ☠️🪦"],["acts","3 + 3 + 2: 📸😮‍💨🔥 | 😰🔦📺 | ☠️🪦"],["row","In a row, one story for all 4 episodes"],["cross","Crosswise: 📸↔📺, 🔥↔🔦, and ☠️🪦 is the finale"]]},
  {id:"e1",s:"The shot",em:"📸😮‍💨",q:"What's the shot and what does 😮‍💨 mean?",src:"We think 😮‍💨 is a sigh of relief, and the “Black Hellebore” channel thinks Nadine will regain her strength. You decide",o:[["see","Nadine will capture proof and exhale: finally they'll believe her"],["shadow","A sigh of relief, but there'll be someone extra in the photo"],["back","A new photo from behind from the Unknown"],["rest","An almost normal day with friends and photos, and then something goes wrong"],["tired","Nadine is exhausted, barely holding on, and the camera catches her visions"]]},
  {id:"e2",s:"Burns",em:"🔥😰",q:"What will burn?",src:"Both the “Black Hellebore” channel and we bet on the library: the archive and evidence are there. But the fire might also reach what Nadine photographed",o:[["lib","The library with the archive"],["photos","The photos and evidence Nadine just got (the 📸 → 🔥 link)"],["red","The newsroom and the investigation board"],["old","Something in Old Saintfour"],["vis","The fire will only be in a vision"]]},
  {id:"e3",s:"Where to",em:"🔦📺",q:"Where will they go with the flashlight?",src:"Both the “Black Hellebore” channel and we think it's Sarah's cabin from SOS1: that's where the very TV stands, from the corner SOS2 opens with",o:[["sara","To Sarah's cabin in Old Saintfour, to that very TV"],["tower","To the Tower"],["forest","Into the woods, the Dead Zone"],["dump","To the junkyard where Tom was buried"]]},
  {id:"e4",s:"The grave",em:"☠️🪦",q:"Whose grave is it?",src:"The “Black Hellebore” channel thinks it's the grave of Nadine or a character important to the plot. We think Nadine will see her own death, and someone from the side characters will die, maybe Abigail",o:[["nadin","Nadine"],["abi","Abigail's"],["side","Some other side character's"],["vis","Nobody's, it's a vision"]]},
  {id:"tol",s:"Truth",em:"🎲",q:"“Truth or Lie” from Romance Club: which of these is true?",src:"From Romance Club's official channel: only one statement is true",take:[["past","The most obvious one, and that's exactly why it might be a trap. Romance Club likes to hide the truth among logical options, but it fits well with 🔦📺 and Sarah's cabin from SOS1."],["stop","The most fantastical one. Looks like bait for those who believe in time theories."],["push","Very plausible (the cold, the visions), Nadine is hiding more and more, and it also fits ☠️🪦: before disaster the heroine is often left alone. Second place."],["curfew","Sounds boring, but I'm betting on it. People are disappearing in town, there's Warlock security at the school, and Howard already said in earlier episodes that history is repeating itself. A curfew, if you ask me, is the logical next step. And the “strange taste of freedom” from the episode 20 description is about the same thing: freedom will be given and immediately taken away. My bet."]],o:[["past","MC will travel back in time again"],["stop","Time will stop all over the world for MC and her friends"],["push","MC will push her loved ones away"],["curfew","Students will only be allowed to leave their homes to attend classes"]]},
  {id:"die",s:"Will Nadine die?",em:"🥶",q:"Will Nadine die?",ev:["“The cold rushed up her shoulder and flooded her chest. She couldn't breathe.”","“And she was cold… very, very cold, as if she had fallen through the ice.”"],o:[["yes","Yes, for real"],["see","She'll see her own death, like Sarah in SOS1"],["edge","She'll be on the edge, but survive"],["vanish","She'll disappear, like Malcolm"],["time","She'll get stuck in another time"],["no","No, the cold means something else"]]},
  {id:"back86",s:"To the past?",em:"⏳",q:"Will Nadine travel to the past again?",o:[["y86","Yes, to 1986 again"],["other","Yes, but to a different year"],["future","The other way, into the future"],["no","No, not in this update"]]},
  {id:"tv",s:"The TV",em:"📺",q:"What will that TV show?",o:[["sara","Sarah and her friends"],["self","Nadine herself"],["death","Nadine's death"],["msg","A message from the future"]]},
  {id:"ghost",s:"Miranda's ghost",em:"👻",q:"Will Miranda's ghost appear?",o:[["talk","Yes, and she'll say something to Nadine"],["show","Yes, but silent"],["photo","Only in a photo or a recording"],["no","No"]]},
  {id:"ts1",s:"From SOS1",em:"✨",q:"Who from SOS1 will appear in episodes 20–23?",o:[["sara","Sarah"],["friends","One of Sarah's friends"],["mask","The Masked Man"],["none","No one, too early"]]},
  {id:"hall",s:"Halloween",em:"🎃",q:"Will there be Halloween?",o:[["party","Yes"],["mention","Just mentioned"],["no","No"]]},
  {id:"reveal",s:"Will we learn the Unknown?",em:"❓",q:"Will we find out who the Unknown is?",o:[["full","Yes, completely"],["hint","There'll be a strong hint"],["face","They'll show them but not say who"],["no","No, too early"]]},
  {id:"unk",s:"The Unknown",long:1,em:"📷",q:"Who is the Unknown from the photo from behind?",o:[["future","Future Nadine"],["line","Nadine from another timeline"],["mir","Miranda"],["shadow","Shadow"]]},
  {id:"tape",s:"Tape",long:1,em:"📼",q:"Who left the tape?",o:[["future","Future Nadine"],["mir","Miranda herself"],["knew","Someone who knew Miranda when she was alive"]]}
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
    .catch(function(err){if(err&&(err.code==="23505"||err.status===409)){me=null; try{localStorage.removeItem(MK)}catch(_){} nickPaint(); nm.textContent="This nickname is already taken by someone else. Pick another one and your prediction will be sent"}})}
function stats(){if(!window.SB) return; SB.predStats().then(function(r){ST={}; (r||[]).forEach(function(x){(ST[x.q]=ST[x.q]||{})[x.o]=x.n}); paint()}).catch(function(){})}

/* ---------- отсчёт ---------- */
function left(){var s=Math.max(0,Math.floor((CLOSE-Date.now())/1000)), d=Math.floor(s/86400), h=Math.floor(s%86400/3600), m=Math.floor(s%3600/60), x=s%60;
  return (d?d+" d ":"")+String(h).padStart(2,"0")+":"+String(m).padStart(2,"0")+":"+String(x).padStart(2,"0")}

/* ---------- разметка ---------- */
var head=H("div","pr-head"), clock=H("div","pr-clock"), prog=H("div","pr-prog");
head.appendChild(clock); head.appendChild(prog);
var list=H("div","pr-list"), foot=H("div","pr-foot");
var cardBtn=H("button","pr-card-btn","My card for stories"); cardBtn.type="button"; cardBtn.onclick=makeCard;
var mineBox=H("div","pr-q pr-mine"); mineBox.innerHTML='<div class="pr-qt"><span class="pr-em">✍️</span><b>Your main prediction</b></div>';
var ta=H("textarea","pr-ta"); ta.maxLength=140; ta.rows=2; ta.placeholder="For example: Nadine burns in the library, but her future self saves her"; ta.value=A._mine||"";
ta.oninput=function(){if(!open()||locked()){ta.value=A._mine||""; return} if(!nickOk()){ta.value=""; needNick(null); return} A._mine=ta.value.trim().slice(0,140); if(!A._mine) delete A._mine; save(); paint()};
mineBox.appendChild(ta); mineBox.appendChild(H("small","pr-hint","It goes on the card. Only you can see it"));
list.appendChild(mineBox);
var okBox=H("div","pr-confirm"), okBtn=H("button","pr-ok-btn","Confirm prediction"), okMsg=H("p","pr-ok-msg"); okBtn.type="button";
okBox.appendChild(okBtn); okBox.appendChild(okMsg); foot.appendChild(okBox);
var sure=false;
okBtn.onclick=function(){if(!open()||locked()) return;
  if(!nickOk()){needNick(null); return}
  var miss=Q.filter(function(q){return !A[q.id]});
  if(miss.length){sure=false; okMsg.textContent="Left to answer: "+miss.length; var c=cards[miss[0].id]; c.scrollIntoView({behavior:"smooth",block:"center"}); c.classList.remove("pr-need"); void c.offsetWidth; c.classList.add("pr-need"); return}
  if(!sure){sure=true; okBtn.textContent="Yes, I confirm"; okMsg.textContent="After you confirm, you won't be able to change your answers. Tap again to confirm"; return}
  A._done=Date.now(); save(); push(); paint(); stats();
  okMsg.textContent=""; root.querySelector(".pr-head").scrollIntoView({behavior:"smooth",block:"start"})};
foot.appendChild(cardBtn); var srcP=H("p","pr-src"); srcP.innerHTML="Emoji spoiler from the writer, Anna — source: Telegram channel "+SRC; foot.appendChild(srcP);
/* таблица провидцев (итоги 20–23) */
var TOP=[[1,6.5,["PyatkaGovarda","make_a_wish"]],[2,6,["Stephanie","Nadi_Dy","Pottoya","el_nessa"]],[3,5.5,["OldScool","aIkzlv","just_me3","DSex","Luthor_13","viicing","Miyoka"]]];
var TT=[[6.5,"🔮","Saintfour Seer"],[6,"🕯","Sees through the fog"],[5.5,"🕵️","Detective’s instinct"],[4,"🌫","Has intuition"],[0,"🥀","The shadow mixed up the cards"]];
function title(s){for(var i=0;i<TT.length;i++) if(s>=TT[i][0]) return TT[i]; return TT[TT.length-1]}
var podium=H("div","pr-top"); podium.hidden=true;
podium.appendChild(H("h3","pr-top-h","Seers’ leaderboard"));
podium.appendChild(H("p","pr-top-sub","This update was unpredictable. Here are those who saw furthest"));
var MED=["","🥇","🥈","🥉"];
TOP.forEach(function(r){var row=H("div","pr-top-row pr-top-"+r[0]); row.appendChild(H("span","pr-top-m",MED[r[0]]));
  var b=H("div","pr-top-b"); b.appendChild(H("b","",r[0]+" place"));
  var nk=H("div","pr-top-n"); r[2].forEach(function(n){nk.appendChild(H("span","",n))}); b.appendChild(nk); row.appendChild(b); podium.appendChild(row)});
var myt=H("div","pr-title"); myt.hidden=true;
/* звание и место — для «Моего дела» и значков у ников в комментариях */
window.SFseer=function(nick){upd(); if(!Object.keys(RES).length||!nick) return 0; var pl=0; TOP.forEach(function(r){if(r[2].indexOf(nick)>=0) pl=r[0]}); return pl};
window.SFpredAward=function(){upd(); if(!Object.keys(RES).length||!(locked()||SEER)) return null; var t=title(myScore()); return {em:t[1],t:t[2],place:myPlace(),med:MED[myPlace()]||""}};
/* ?test&seer — посмотреть, как всё выглядит у победителя (только в тестовом режиме, ничего не сохраняет) */
var SEER=!!window.SFTEST&&/[?&]seer\b/.test(location.search);
function myNick(){return SEER?TOP[0][2][0]:(me&&me.nick)}
function myScore(){return SEER?TOP[0][1]:score()}
function myPlace(){var mn=myNick(), pl=0; TOP.forEach(function(r){if(mn&&r[2].indexOf(mn)>=0) pl=r[0]}); return pl}
var LEAF='<svg class="pr-leaf" viewBox="0 0 60 60" aria-hidden="true"><g fill="none" stroke="#e7c56a" stroke-width="1.6" stroke-linecap="round"><path d="M4 56C14 40 24 30 40 22"/><path d="M14 44c-6-1-9-5-9-10 5 0 9 3 9 10z" fill="rgba(231,197,106,.25)"/><path d="M26 33c-2-6 0-11 5-13 2 5 0 10-5 13z" fill="rgba(231,197,106,.25)"/></g><g transform="translate(44 16)"><circle r="3.2" fill="#f6dc8e"/><g fill="#e7c56a"><ellipse cx="0" cy="-8" rx="4.2" ry="6"/><ellipse cx="0" cy="-8" rx="4.2" ry="6" transform="rotate(72)"/><ellipse cx="0" cy="-8" rx="4.2" ry="6" transform="rotate(144)"/><ellipse cx="0" cy="-8" rx="4.2" ry="6" transform="rotate(216)"/><ellipse cx="0" cy="-8" rx="4.2" ry="6" transform="rotate(288)"/></g><circle r="2.4" fill="#a8781e"/></g></svg>';
root.appendChild(head); root.appendChild(myt); root.appendChild(podium); root.appendChild(list); root.appendChild(foot);

var spoilerHead=H("div","pr-sec"); spoilerHead.innerHTML='<b>Solve Anna\'s spoiler</b><span class="pr-emoji">📸😮‍💨🔥😰🔦📺☠️🪦</span><small>8 emojis for 4 episodes. How to split them is a puzzle too. The spoiler was first published by the Telegram channel '+SRC+'</small>';
var takes=H("details","pr-takes"); takes.innerHTML='<summary>How to read the spoiler: breakdowns</summary>'+
  '<div class="pr-take"><b>Breakdown by the Telegram channel '+SRC+'</b>'+
  '<p>The channel splits the emojis into one pair per episode and relies on the description of episode 20: “The victim got a taste of freedom. But freedom tastes strange.”</p>'+
  '<div class="pr-ep"><i>20</i><span class="pr-epem">📸😮‍💨</span><p>A breather episode: Nadine will regain her strength and live an almost normal teenage day. But the Shadow won\'t go anywhere. The camera means new photos with the love interests or a shot that shows what the others can\'t see.</p></div>'+
  '<div class="pr-ep"><i>21</i><span class="pr-epem">🔥😰</span><p>A fire. The channel\'s first thought is the library: that\'s where the archive is, where the kids already found information. Burning it is the fastest way to destroy evidence without a trace.</p></div>'+
  '<div class="pr-ep"><i>22</i><span class="pr-epem">🔦📺</span><p>The kids will go to Old Saintfour again and find the cabin where Sarah and her friends used to gather. That\'s where the very TV stands that we see at the start of every episode of the first season.</p></div>'+
  '<div class="pr-ep"><i>23</i><span class="pr-epem">☠️🪦</span><p>Nadine will die. She\'s getting colder and colder, her condition is changing fast, she sees her own corpse and realistic hallucinations, and she\'s more and more like Malcolm. Sarah, in the last episode of SOS1 season 1, also saw the place of her death in a dream. Backup option: not a love interest but a character important to the plot will die.</p></div>'+
  '</div>'+
  '<div class="pr-take"><b>The site author\'s breakdown</b>'+
  '<p class="pr-sub">If it\'s one pair per episode</p>'+'<div class="pr-split"><span>📸😮‍💨</span><span>🔥😰</span><span>🔦📺</span><span>☠️🪦</span></div>'+
  '<div class="pr-ep"><i>20</i><span class="pr-epem">📸😮‍💨</span><p>For me 😮‍💨 is a sigh of relief, exactly like “a taste of freedom”. But “freedom tastes strange”: the breather will have a catch, and the catch is probably in the camera. As we\'ve all figured out, the camera in this story sees more than eyes do: in episode 4 Nadine gets a photo of herself from behind, and in episode 5 the film remembered the shadow behind Miranda that nobody saw. Most likely there\'ll be someone extra in the new photo too…</p></div>'+
  '<div class="pr-ep"><i>21</i><span class="pr-epem">🔥😰</span><p>Fire has already destroyed knowledge in Saintfour: the “Shadows of Saintfour” book from episode 5 survived a fire with some pages missing, and in episode 19 it\'s exactly where the key to the Tower symbols turned up. Someone might finish burning what survived back then. Candidates: the library or the archive. And there\'s a contrast here: Nadine has been freezing all season, and now there\'s fire.</p></div>'+
  '<div class="pr-ep"><i>22</i><span class="pr-epem">🔦📺</span><p>Here I completely agree with the channel. In SOS1 there\'s an old TV on a shelf with a candle in the corner of the cabin (if you forgot, check the “Links to SOS1” tab), and it\'s the same corner SOS2 opens with. The flashlight means night and darkness, most likely Old Saintfour. This will be the main bridge to SOS1 in the update.</p></div>'+
  '<div class="pr-ep"><i>23</i><span class="pr-epem">☠️🪦</span><p>There are a lot of alarming signs. In episode 17 Nadine sees herself dead, overgrown with hellebore. In episode 16 Malcolm\'s voice screams in the Tower: “Let me out”, “I\'m hungry”. But the main heroine is unlikely to be killed mid-season. Most likely Nadine will see her own death, like Sarah in SOS1, or find her own grave in another timeline. If someone really dies, it\'ll be a side character, and I\'m not the only one who feels it could be Abigail.</p></div>'+
  '<p class="pr-sub">If you read it as one story</p>'+'<div class="pr-split"><span>📸 😮‍💨 🔥 😰 🔦 📺 ☠️ 🪦</span></div>'+
  '<p>Photo → relief → fire → fear → darkness → screen → death → grave. Nadine will capture something important and exhale: finally there\'s proof. But someone will try to burn the evidence, maybe along with the place it was kept. In a panic the kids will head into the dark with a flashlight (for example, into Old Saintfour), find that very TV, and it will show a death. And at the end a grave will appear, and this one will be real — whose, is the big question.</p>'+
  '<p class="pr-sub">If 3 + 3 + 2</p>'+'<div class="pr-split"><span>📸😮‍💨🔥</span><span>😰🔦📺</span><span>☠️🪦</span></div>'+
  '<p><b>Act one:</b> a photo and a breather, cut short by fire. <b>Act two:</b> fear and searching in the dark, which ends at the screen. <b>Act three:</b> death and a grave. The TV stands right before ☠️🪦, so Nadine will probably first see the death on screen: as a recording or as the shots the episodes open with.</p>'+
  '</div>'+
  '<div class="pr-take"><b>More ways</b>'+
  '<div class="pr-split"><span>📸↔📺</span><span>🔥↔🔦</span><span>☠️🪦</span></div>'+'<p>Crosswise: the photo and the screen are the same thing, fire and the flashlight are two light sources in the dark, and death is at the end.</p>'+
  '<div class="pr-split"><span>😮‍💨 → 😰</span></div>'+'<p>Emotions separate from objects: the first half of the update is relief, the second is fear.</p>'+
  '</div>';
var restHead=H("div","pr-sec"); restHead.innerHTML='<b>What else will happen</b><small>All of this will be decided in episodes 20–23</small>';
var longHead=H("div","pr-sec pr-long"); longHead.innerHTML='<b>Long bets</b><small>The biggest mysteries of the season. They probably won\'t be solved in one update, so we\'ll count them whenever the answer appears, even several updates later. Whoever guesses early gets a rare title</small>';

/* ---------- ник: обязателен, чтобы попасть в таблицу провидцев ---------- */
var MK="sentfor_poppy_me", me=null; try{me=JSON.parse(localStorage.getItem(MK)||"null")}catch(e){}
var nb=H("form","pr-nick"), ni=H("input","pr-ni"), ns=H("button","pr-ns","Save"), nm=H("p","pr-nm");
nb.innerHTML='<label for="pr-ni"><b>Your nickname for the seers\' leaderboard</b><small>After the update we\'ll show the top of those who guessed the most</small></label>';
ni.id="pr-ni"; ni.type="text"; ni.maxLength=20; ni.placeholder="for example, sentfor_fan"; ni.autocomplete="off"; ns.type="submit";
var nrow=H("div","pr-nrow"); nrow.appendChild(ni); nrow.appendChild(ns); nb.appendChild(nrow); var nsm=H("small","pr-nsm"); nb.appendChild(nsm); nb.appendChild(nm);
function nickOk(){return !!(me&&me.nick)}
/* ник выбирают один раз: тот же, что в комментариях, поменять нельзя */
function nickPaint(){var k=nickOk(); nb.classList.toggle("set",k); ni.readOnly=k; ns.hidden=k; if(k) ni.value=me.nick;
  nsm.textContent=k?"This is your nickname in the comments too. It can't be changed":"You choose it once. The same nickname will be used in the comments"}
ni.oninput=function(){nm.textContent=""};
nb.onsubmit=function(e){e.preventDefault(); if(!open()||nickOk()) return;
  var n=ni.value.trim().replace(/\s+/g,"_").replace(/[^\wа-яё.]/gi,""); ni.value=n;
  if(n.length<2){nm.textContent="At least 2 letters or digits"; ni.focus(); return}
  if(nickOk()&&n===me.nick){nickPaint(); return}
  if(!window.SB){me={nick:n,ava:(me&&me.ava)||"🔮"}; try{localStorage.setItem(MK,JSON.stringify(me))}catch(_){} nickPaint(); if(pend){var f0=pend; pend=null; f0()} return}
  ns.disabled=true; ns.textContent="…";
  SB.saveProfile(n,(me&&me.ava)||"🔮").then(function(){profOk=true; me={nick:n,ava:(me&&me.ava)||"🔮"}; try{localStorage.setItem(MK,JSON.stringify(me))}catch(_){} nm.textContent=""; sent=""; push(); if(pend){var f=pend; pend=null; f()}})
    .catch(function(err){var m=err&&err.message||"";
      if(err&&(err.code==="23505"||err.status===409)){nm.textContent="This nickname is taken, try another one"; return}
      if(/nick_reserved/.test(m)){nm.textContent="This nickname belongs to a character 🙂"; return}
      if(/nick_chars|nick_len/.test(m)){nm.textContent="Only letters, digits, _ and dots, 2 to 20 characters"; return}
      /* нет связи с базой (блокировка, капча): ник и ответы сохраняем у человека, отправим, когда связь появится */
      me={nick:n,ava:(me&&me.ava)||"🔮"}; try{localStorage.setItem(MK,JSON.stringify(me))}catch(_){} profOk=false;
      nm.textContent="Saved on your device. We'll send it to the shared table once you're back online"; if(pend){var f=pend; pend=null; f()}})
    .then(function(){ns.disabled=false; nickPaint()})};
var pend=null;
function needNick(f){if(nickOk()) return false; pend=f; nm.textContent="Nickname first, so your prediction counts"; nb.classList.remove("shake"); void nb.offsetWidth; nb.classList.add("shake");
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
  if(q.take){var tk=H("details","pr-qtake"); tk.appendChild(H("summary","","The site author's take"));
    q.take.forEach(function(t){var o=q.o.filter(function(x){return x[0]===t[0]})[0]; var r=H("div","pr-qt-row"); r.appendChild(H("b","",o?o[1]:"")); r.appendChild(H("p","",t[1])); tk.appendChild(r)});
    c._tk=tk}
  if(q.ev){var ev=H("div","pr-ev"); q.ev.forEach(function(s){ev.appendChild(H("p","",s))});  c.appendChild(ev)}
  var os=H("div","pr-os");
  q.o.forEach(function(o){var b=H("button","pr-o"); b.type="button"; b.setAttribute("data-o",o[0]);
    b.innerHTML='<i class="pr-bar"></i><span class="pr-ot"></span><span class="pr-pc"></span>'; b.querySelector(".pr-ot").textContent=o[1];
    b.onclick=function(){if(!open()||locked()) return; var go=function(){A[q.id]=o[0]; save(); paint(); bump(c); if(sure){sure=false; okBtn.textContent="Confirm prediction"; okMsg.textContent=""}}; if(needNick(go)) return; go()}; os.appendChild(b)});
  c.appendChild(os); if(c._tk) c.appendChild(c._tk); list.appendChild(c); cards[q.id]=c});
list.appendChild(mineBox); /* свой прогноз — в конце списка */
window.SFpredRefresh=stats;
function bump(c){c.classList.remove("pr-ok"); void c.offsetWidth; c.classList.add("pr-ok")}

function paint(){
  upd(); var op=open(), done=nDone(), res=Object.keys(RES).length, lk=locked();
  var tb=document.querySelector('.tab[data-tab="pred"]'); if(tb) tb.classList.toggle("tab-pred",op&&!lk); /* точка «есть что сделать», пока прогноз не подтверждён */
  root.classList.toggle("closed",!op); root.classList.toggle("pr-done",lk);
  prog.textContent=res?(lk?"Guessed "+String(score()).replace(".",",")+" of "+Q.filter(function(q){return has(q.id)}).length:"The prediction wasn't confirmed"):lk?"✓ Prediction filed":!op?"Prediction not confirmed":(done+" of "+Q.length+" · answer everything and confirm");
  Q.forEach(function(q){var c=cards[q.id], mine=A[q.id], st=ST&&ST[q.id], tot=0;
    if(st) Object.keys(st).forEach(function(k){tot+=st[k]});
    var show=(lk||!op)&&tot>0;
    c.classList.toggle("answered",!!mine);
    c.querySelectorAll(".pr-o").forEach(function(b){var k=b.getAttribute("data-o"), p=show?Math.round((st[k]||0)*100/tot):0;
      b.classList.toggle("mine",k===mine); b.disabled=!op||lk;
      b.querySelector(".pr-bar").style.width=show?p+"%":"0";
      b.querySelector(".pr-pc").textContent=show?p+"%":"";
      var ok=has(q.id)&&RES[q.id].indexOf(k)>=0, hf=has(q.id)&&!!HALF[q.id]&&HALF[q.id].indexOf(k)>=0; b.classList.toggle("right",ok); b.classList.toggle("half",hf); b.classList.toggle("wrong",has(q.id)&&lk&&k===mine&&!ok&&!hf)})});
  podium.hidden=!res; myt.hidden=!(res&&(lk||SEER));
  if(res&&(lk||SEER)){var t=title(myScore()), pl=myPlace(); myt.classList.toggle("gold",pl===1);
    myt.innerHTML=""; myt.appendChild(H("span","pr-title-e",t[1])); var tb=H("div"); tb.appendChild(H("small","","Your title")); tb.appendChild(H("b","",t[2])); if(pl) tb.appendChild(H("i","",MED[pl]+" "+pl+" place on the seers’ leaderboard")); myt.appendChild(tb);
    if(pl===1){["tl","tr","bl","br"].forEach(function(c){var s=H("span","pr-corner "+c); s.innerHTML=LEAF; myt.appendChild(s)}); var g=H("small","pr-gold-note","A golden hellebore frame. Only you have it"); tb.appendChild(g)}}
  okBox.hidden=lk||!op; cardBtn.hidden=!lk; ta.disabled=lk||!op;
  if(!op&&!lk&&done) okMsg.textContent="";}
function score(){if(!locked()) return 0; var s=0; Q.forEach(function(q){var a=A[q.id]; if(!has(q.id)||!a) return; if(RES[q.id].indexOf(a)>=0) s+=1; else if(HALF[q.id]&&HALF[q.id].indexOf(a)>=0) s+=.5}); return s}
function tick(){upd(); clock.innerHTML=open()?'<small>Predictions close in</small><b>'+left()+'</b><small>Sat, Nov 21, 3 PM Moscow time (12:00 UTC) · episodes 20–23 come out on the 22nd</small>':(Object.keys(RES).length?'<small>Episodes 20–23 are out</small><b>What came true?</b><small>Correct answers are highlighted in green, half-credit ones in yellow</small>':'<small>Predictions are closed</small><b>Waiting for episodes 20–23</b><small>As soon as they\'re out, we\'ll mark what came true</small>');
  if(!open()&&root.classList.contains("closed")===false) paint()}
tick(); paint(); setInterval(tick,1000);
/* если в прошлый раз не отправилось (не было связи) — пробуем снова */
setTimeout(push,2500);

/* итоги прогнозов: один раз показываем «Новое звание», когда открылись результаты 20–23 */
var NK="sentfor_pred_award";
function award(){upd(); if(!Object.keys(RES).length||!(locked()||SEER)) return; var t=title(myScore()), key="23:"+t[2]; try{if(!SEER&&localStorage.getItem(NK)===key) return}catch(e){return}
  var pl=myPlace();
  if(document.querySelector(".toast")){setTimeout(award,2000); return}
  if(!SEER) try{localStorage.setItem(NK,key)}catch(e){}
  var x=H("div","toast pr-award"); x.setAttribute("role","status"); x.appendChild(H("b","",pl?"You’re on the seers’ leaderboard!":"New title!"));
  x.appendChild(H("span","toast-egg",t[1]+" "+t[2])); x.appendChild(document.createTextNode(pl?MED[pl]+" "+pl+" place in the predictions for episodes 20–23.":"Prediction results for episodes 20–23 are in the Predictions tab."));
  x.style.cursor="pointer"; x.onclick=function(){x.remove(); var tb=document.querySelector('button[data-tab="pred"]'); if(tb) tb.click(); setTimeout(function(){myt.scrollIntoView({block:"center",behavior:"smooth"})},150)};
  document.body.appendChild(x); setTimeout(function(){x.remove()},8000)}
/* прогноз сделан на другом устройстве — подтягиваем подтверждённый из базы */
function pull(){if(locked()||!window.SB||!SB.predMine) return Promise.resolve(); return SB.predMine().then(function(r){if(r&&r.locked&&r.a){A=r.a; A._done=1; A._sent=1; save(); paint()}}).catch(function(){})}
setTimeout(function(){pull().then(function(){setTimeout(award,1200)})},1500);
var epn=document.getElementById("ep-name"); if(epn) new MutationObserver(function(){setTimeout(award,600)}).observe(epn,{childList:true,characterData:true,subtree:true});

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
  cx.fillStyle="#2a2420"; cx.font="400 28px 'PT Mono'"; cx.textAlign="left"; cx.fillText("CASE No."+caseNo(),px+320,py+30);
  if(me&&me.nick){var nf=40; cx.font="700 40px Caveat"; while(nf>26&&cx.measureText("investigator: "+me.nick).width>pw-460){nf-=2; cx.font="700 "+nf+"px Caveat"} cx.fillStyle="#3a2f27"; cx.textAlign="right"; cx.fillText("investigator: "+me.nick,px+pw-40,py+140); cx.textAlign="left"}
  cx.fillStyle="#7a1f1f"; cx.font="700 30px 'PT Mono'"; cx.textAlign="right"; cx.fillText("CLASSIFIED",px+pw-40,py+90);
  cx.textAlign="left"; cx.fillStyle="#1d1915"; cx.font="700 84px 'Fira Sans Extra Condensed'"; cx.fillText("PREDICTION",px+50,py+170);
  cx.font="400 34px 'PT Sans'"; cx.fillStyle="#4a4037"; cx.fillText("“Shadows of Saintfour 2” · episodes 20–23",px+50,py+220);
  cx.strokeStyle="rgba(40,30,20,.35)"; cx.lineWidth=2; cx.beginPath(); cx.moveTo(px+50,py+250); cx.lineTo(px+pw-50,py+250); cx.stroke();
  /* ответы: если мало — вопрос + ответ, если много — компактно: эмодзи + ответ в одну строку */
  var top=py+285, bottom=py+ph-150, picked=Q.filter(function(q){return A[q.id]&&q.o.some(function(x){return x[0]===A[q.id]})});
  var mineH=0, mineLines=[];
  if(A._mine){cx.font="700 44px Caveat"; mineLines=lines(cx,"“"+A._mine+"”",pw-100,3); mineH=40+mineLines.length*46+16}
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
  if(A._mine){y+=10; cx.font="400 25px 'PT Sans'"; cx.fillStyle="#6a5d50"; cx.fillText("My main prediction",px+50,y+24);
    cx.font="700 44px Caveat"; cx.fillStyle="#7a1f1f"; mineLines.forEach(function(l,k){cx.fillText(l,px+50,y+72+k*46)})}
  /* низ папки: «Проверим» слева, печать справа */
  cx.strokeStyle="rgba(40,30,20,.3)"; cx.lineWidth=2; cx.beginPath(); cx.moveTo(px+50,py+ph-140); cx.lineTo(px+pw-50,py+ph-140); cx.stroke();
  cx.textAlign="left"; cx.font="700 52px Caveat"; cx.fillStyle="#3a2f27"; cx.fillText("We'll check on Nov 22",px+50,py+ph-58);
  cx.save(); cx.translate(px+pw-200,py+ph-72); cx.rotate(-.12); cx.strokeStyle="rgba(150,30,30,.85)"; cx.lineWidth=6;
  cx.strokeRect(-165,-46,330,92); cx.lineWidth=2.5; cx.strokeRect(-155,-36,310,72);
  cx.fillStyle="rgba(150,30,30,.88)"; cx.font="700 40px 'Fira Sans Extra Condensed'"; cx.textAlign="center"; cx.fillText("PREDICTION FILED",0,14); cx.restore();
  /* низ */
  cx.textAlign="center"; cx.fillStyle="#cfc6b6"; cx.font="700 44px 'Fira Sans Extra Condensed'"; cx.fillText("THE SAINTFOUR CASE",W/2,Hh-110);
  cx.font="400 30px 'PT Sans'"; cx.fillStyle="#8d8578"; cx.fillText("Make your own prediction: delo-sentfora.vercel.app/en",W/2,Hh-62);
  show(cv)}
function show(cv){
  var ov=H("div","pr-ov"), box=H("div","pr-box"), img=H("img"); img.alt="Prediction card"; img.src=cv.toDataURL("image/png");
  var row=H("div","pr-row"), dl=H("a","pr-dl","Download"); dl.href=img.src; dl.download="prognoz-sentfor.png";
  var sh=H("button","pr-sh","Share"), cl=H("button","pr-cl","Close"); sh.type=cl.type="button";
  cv.toBlob(function(bl){var f=bl&&window.File?new File([bl],"prognoz-sentfor.png",{type:"image/png"}):null;
    if(!(f&&navigator.canShare&&navigator.canShare({files:[f]}))){sh.remove(); return}
    sh.onclick=function(){navigator.share({files:[f],text:"My prediction for “Shadows of Saintfour 2” 🔮 delo-sentfora.vercel.app/en"}).catch(function(){})}});
  function close(){ov.remove(); document.removeEventListener("keydown",esc)} function esc(e){if(e.key==="Escape") close()}
  cl.onclick=close; ov.onclick=function(e){if(e.target===ov) close()}; document.addEventListener("keydown",esc);
  row.appendChild(dl); row.appendChild(sh); row.appendChild(cl); box.appendChild(img); box.appendChild(H("p","","On your phone: press and hold the image to save it if the button doesn't work")); box.appendChild(row); ov.appendChild(box); document.body.appendChild(ov)}
})();
