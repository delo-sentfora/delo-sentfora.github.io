/* «Доска улик» открыта для всех; старая тестовая метка больше не нужна */
try{localStorage.removeItem("sentfor_boardtest")}catch(e){}
(function(){
var EPS={1:"The End of Light",2:"Alarming Symptoms",3:"The Loss",4:"A Lead",5:"A Living Glitch",6:"The Warning",7:"The Sanctuary",8:"The Dead Guest",9:"Through the Looking Glass",10:"The Point of No Return",11:"Breaking and Entering",12:"Familiar Names",13:"Getting Ready",14:"The foray",15:"Old Addresses",16:"A Guest from the Future",17:"The Voices in My Head",18:"Shadow",19:"Not Alone"};
window.EPS_=EPS;
var EPA={1:"A poisonous flower has infested Old Saintfour. A high school journalist from New Saintfour ventures into the restricted zone to uncover what has been hiding in the shadows.",2:"The evil within the school walls.",3:"Even those who are gone forever leave their mark.",4:"When the clues turn into traps.",5:"Junkyards hold many secrets hidden from view.",6:"What the dead know.",7:"A deadly end to a teenage prank.",8:"The party goes wrong.",9:"Old things hold old nightmares.",10:"With every new loss, fear fades too.",11:"What lurks in the house behind the high fence?",12:"Getting in was easy, but will they let you out?",13:"Mysteries from the past prove the investigation was launched for good reason.",14:"Welcome to the old town. Keep your eyes open.",15:"Hell behind every door.",16:"Where it all began...",17:"A long, long night.",18:"You can't run away from yourself… but is that really you?",19:""};
/* Хронология. ep — серия, в которой мы об этом узнаём; o — место в настоящем порядке событий;
   when/txt — версии по сериям [[с какой серии, текст]], показывается последняя доступная */
var TL=[
 {ep:3,o:10,hot:1,img:"img/tower.webp",alt:"The Tower on the 2017 tape",when:[[3,"September 2017"]],txt:[[3,"C.M.B. films a huge tower and people with rifles, a woman is heard screaming. The camera is left lying in the woods."]]},
 {ep:2,o:20,when:[[2,"The day before"]],txt:[[2,"Miranda goes to Old Saintfour with some guy, calls it a “date” and acts suspiciously."],[3,"Miranda goes to Old Saintfour with some guy, calls it a “date” and acts suspiciously. It looks like she brought the camera from there."]]},
 {ep:1,o:25,hot:1,img:"img/tower_prologue.webp",alt:"The Tower in the Dead Zone",when:[[1,"Prologue"]],txt:[[1,"A lab by the Dead Zone. A scientist: “The magnetic field anomaly has gone beyond all visible limits.” Howard: “Let them out.” One person sprouts flowers, another makes it to the Tower. “He did it. He got in!”"]]},
 {ep:1,o:30,hot:1,when:[[1,"At school"]],txt:[[1,"The lights go out at school. Nadine coaxes a crying Miranda out of the stall: “The generator kicked in. Come out.”"]],egg:"vernulsya"},
 {ep:3,o:40,img:"img/miranda.webp",alt:"Miranda in her last video",when:[[3,"Night"]],txt:[[3,"Her last video: her mouth won't open, she sways “like a pendulum” and whispers “Hel-l… Hel-lp…”. A dark spot behind her."]]},
 {ep:2,o:50,img:"img/miranda_door.webp",alt:"Miranda peeking out the door",when:[[2,"The day she died"]],txt:[[2,"Nadine drops by Miranda's. An acrid sweet smell from inside the house, Miranda won't let her wait for her mom."]]},
 {ep:3,o:60,hot:1,when:[[3,"18:06"]],txt:[[3,"Miranda calls her brother Ethan and hangs up right away. She never answers again."]]},
 {ep:3,o:70,hot:1,when:[[3,"18:00 – 19:30"]],txt:[[3,"The death, according to the sheriff. Miranda is found in a tree by her house. Her mom didn't notice her in the dark and rain."]]},
 {ep:3,o:80,img:"img/creature.webp",alt:"The creature in the restroom",when:[[3,"The next day"]],txt:[[3,"An announcement in the gym. A creature in the restroom: “Someone will kill everyone soon.” Questioning at the Martinez house, Nadine finds the tapes and the camera."]]},
 {ep:4,o:90,img:"img/car.webp",alt:"The matte gray car",when:[[4,"The same day"]],txt:[[4,"The 2017 recording gets erased, but Nadine manages to take a photo of the Tower. There's a matte gray car by the Martinez house, and Nadine photographs it too."]]},
 {ep:4,o:100,hot:1,img:"img/unknown.webp",alt:"A photo from the Unknown",when:[[4,"Evening, 7:25"]],txt:[[4,"Nadine wakes up in a dark school. A bear whispers “I love you”, a photo from the Unknown: “He found you.” Black hellebore in the locker, two with roots, the watchman."]]},
 {ep:4,o:110,img:"img/father.webp",fam:"father",alt:"Nadine's father",when:[[4,"Evening, at home"]],txt:[[4,"Purple flowers can be seen at the foot of the Tower. Her architect dad: “We don't have anything like that. No builder in their right mind would put up something like this.”"]]},
 {ep:4,o:120,hot:1,when:[[4,"Next"]],txt:[[4,"The Miranda tapes and the printout of the Tower disappeared from the newsroom. The gray car stops by Nadine's house, the driver watches her window."]]},
 {ep:5,o:130,hot:1,img:"img/oldtown.webp",alt:"Old Saintfour",when:[[5,"The foray"]],txt:[[5,"Nadine, Darren, Dex, Poppy, Alice and Rudy go into Old Saintfour wearing masks. “If they linger, they'll stay there forever.” A voice calls “Don't go”, Nadine turns around and gets burned. Then a chase by some car."]]},
 {ep:5,o:140,when:[[5,"A week later"]],txt:[[5,"By the school, students talk about two guys who went missing in Old Saintfour. “No one comes back from there in their right mind.” They say Miranda had been there too."]]},
 {ep:5,o:150,hot:1,img:"img/miranda_shadow.webp",alt:"Miranda and the shadow in the photo",when:[[5,"Darkroom"]],txt:[[5,"Two shots develop on Alice's film: the sheriff arguing with the head of Warlock by the junkyard, and a shadow standing behind Miranda on her last day at school, reaching for her."]]},
 {ep:5,o:160,img:"img/librarian.webp",alt:"The librarian",when:[[5,"Library"]],txt:[[5,"Darren explains the shadow in the photo with ultraviolet light. The librarian remembers the “Shadows of Saintfour” book Nadine read as a child. Nadine remembers the plot differently but doesn't argue."]]}
];
/* тексты пасхалок закодированы, чтобы их не нашли поиском по коду */
function Z(s){try{return decodeURIComponent(escape(atob(s.split("").reverse().join(""))))}catch(e){return s}}
var EGGS={
 vernulsya:{ep:1,text:Z("rNWYiBycnUGa"),title:Z("dCo4LNUQCByUnUEScCo4"),msg:Z("/s2YhJGIzdybodFIuwGbhR3cgUGa0Byb0BCd4VmbgUGbpRHIlhGdg8GdulGIkVGajRXYyN2U"),hint:Z("=c3bkFGaTBSZoRHIvRHI0hXZuBCZlh2Y0FmcjNHIzlGIn5WaoRXZt92U")},
 h0259:{ep:1,text:Z(""),title:Z("=kTN6IDM"),msg:Z("==gLyVmdvNGI5JXZ2VGIu9GIzlGIl1Wa0BCdhhGVg4SO1ojMwASesR3YhhXZgQXYgUmclhGIlJ3J19WW"),hint:Z("=UWbpRHIsFWajVGczBSZu9GI0FGIlJXZoBSZt92Q")},
 clock:{ep:1,text:Z(""),title:Z("=ADM6MDM"),msg:Z("=4SehdXeuFGI5UjOyADIzlXY3xWYgM3J0lGIlJXZoBCd1JEIuQmbvNWZzBSYgI3bmBibvBCZlZ3btBSZtlGV"),hint:Z("=s2Yvx2YgQWZwB3b0NHIlhGdgkncyVHS")},
 sidphone:{ep:1,text:Z(""),title:Z("MFkTHl0Ug8kT"),msg:Z("uYDM6gTMgkHb0NWY4VGI0FGIwVHI05WZ3BSnAKOVJBCROV1TGBSScCo4gQ3cvBHIyVGSg4CZuVGIlhGdg8GdgUmbvhGcgM3J5Vmbkl3UgQWYlJHI19WW"),hint:Z("k5WZgUGa0Byb0BSZu9GawBycnU2csVGIl52bl12bzBCZhVmU")},
 call1806:{ep:3,text:Z(""),title:Z("=YDM6gTM"),msg:Z("==gLyVGa09mciBiclhGIkVGbsF2YgUGazBSZ0Vnbp1GIlhGdgkHb0NWY4VGI0FEIuEGZuFmcp1EIt9mcmBCbsF2YgQWZzNXatBSQ"),hint:Z("==AbsF2YgQ3chxGIlhGdgY2bgUGd15WatBSZoRHI0FGIlJXZoByav9GT")},
 warlock:{ep:1,text:Z("yVmclNmcvNHI9Ayaj9GbyF2d"),title:Z("SVkUFNkUPNFI9AySD9ETSF0V"),msg:Z("/U2YuVGZpNmbp92Qg4ycuFWZtBSZtFmbgM3Ju9Wa0FmcvBncvNGIlhGdgQXYodHIzdCdhhGV"),hint:Z("l1WYuBSZu9GIm9GIu9Wa0FGbz5WYyRHIlhGV")},
 bear:{ep:4,text:Z(""),title:Z("SFURCBySOlEU"),msg:Z("ucmbphGdl12bzBSehNHIvRHIn5Wa5JHdgwGbpR3cgM3J0lGI0VnYgwCZhVGZgkHbyFWZuBycpBSbzlmbhh2Yl1GIlhGVg4iclt2YvxGIlhGdgknYgsmchRGIlhGdg4WagQmb19mR"),hint:Z("=smchRGIlhGdg4WagcmbpRWaoBycpBSZu9WZt92U")},
 unk:{ep:4,text:Z(""),title:Z("==ARFJVRWlETFREIU9kT"),msg:Z("uQWZyFWZwBXYzlGZgQXYoNGIlhGdgQmbBBiLodWdvJHa0BCdvdGIyVmdl5GIud3butmbVBSZoRHIvRHI5xGclJHIlhGV"),hint:Z("==wZulGd4VGdgM3Jvh2dgUmbvBSZoRHIyV2dz5WQ")},
 song:{ep:1,text:Z(""),title:Z("==wSDFETCByROlESUllUFZVR"),msg:Z("==gLn52bzBSeyFGZuV2ZlxGI0FGaUBiLy9Gb5FGVgU2ap1EIuQXYlZGIvRXdsBFIltWas5WV"),hint:Z("uF2ZlJGIsxWYgQXagUmclh2dg8WakFmcgUGa0BSZuVHV"),link:"https://youtu.be/mWKDZRJWdF4?t=50"},
 mirror:{ep:4,text:Z(""),title:Z("SV0SD9ETgUESUBiTJBiUPJlUJ1EIFhEV"),msg:Z("==gLy9mcylWbgM3JhRmbhJXaNBibpByZulGZuFGdzBycpBSZu9WZt92U"),hint:Z("=I3byJXatBycnEGZuFmcp1EIvRnbpByav9GT")},
 crash:{ep:5,text:Z(""),title:Z("O9USUNURG5US"),msg:Z("uM3ZuVHbgIXdvlHIulGI5RWYlJHbhBycpBSZy9mYlxGblhGIlhGVg4CZl52bzl2bwBCdzVnagM3J0lGIsIXdvZGdulWYTBCZs9EIulGIylWYgY2bgkHduVGbwBycnUmclhGV"),hint:Z("=IXdvZGdulWYTBCZs9EIm9GIylWYgUGa0BSZoRXYlJnQ")},
 field:{ep:8,text:Z(""),title:Z("=MFVSFESDBSRIRFIGZ0T"),msg:Z("==gL5JmchVmbgMXagcmbphGdl12bzBybTBiLlZXYydGIzdSbvRFI0FGIltWasBCdzVnS"),hint:Z("iFGbgM3YpNXeoBHIlhGdg02byZGIlNWa2VGZgUGa0BibvBibyVHV")},
 rune:{ep:14,text:Z(""),title:Z("==QROVlU"),msg:Z("=4ydv5GIy9mZgYKgizWa2VGImZ2bgMHZyF2dgUmb1JHIlhGV"),hint:Z("ulWYoNWeltGIlhGdgg2Y19GV")},
 door86:{ep:15,text:Z(""),title:Z("==gN4kTM"),msg:Z("=4iN4kTMgwic19mZ05WahNFIvRHIl12bjxWZXBiLkVmblB3bgI3bvRGIlhGV"),hint:Z("==gcld3bUBSZoRHIulGIzJ3bvRGIlhGdgY2bgUmbvBiblB3T")},
 coin:{ep:8,text:Z(""),title:Z("=MFTJFEVgI1TgMFRBVES"),msg:Z("uQWZkl2YlRGIzlGIlRXYGBiLsxWZmBCZuFGIwVHI3VGbmBibp92YgMnbvdWYyREIrNWYsJEIlhGV"),hint:Z("/MHbpFGdgI3bgMHZhVGS")},
 frost:{ep:5,text:Z(""),title:Z("==QRS9kQFxETFhEIFhEVgg0QV9EVgQ1JO9ER"),msg:Z("=4ibhdWZiBycu9WazlmdgUGa0BCZuFGIsg2Z19mblBychdHIoNWdvRHIl52T"),hint:Z("lRWazBSZoRHIvRHImZ2bgcmbpd3bydGIyV2dvxmZgUGa0ByajlGU")},
 g20:{ep:19,text:Z(""),title:Z("=UUTB5EIP5EIIRVSXBSRWFkUHBSQ"),msg:Z("=8TZyVGa0ByclN3byByajFGbiBycn5WayJGIvh2Vg4SZy9mZlJGIlJXZoRHI0dibzF2dgQXYoRHIwFWbgUGa0BibvBCZlJXYlBHchBSZjFGbwBSQ"),hint:Z("==wPt9Ga3BicvZEIuMHZv92dgUGa0BibpByZulmbyVnYgMXagUGbk5WYjBSQ")},
 g21:{ep:19,text:Z(""),title:Z("==QMSio4gI1TPxkR"),msg:Z("uwGbhdHI5JXZ2VGIu9GI5UjOyADIk5WQg4ibhxGcgknbhBibvBCdn42cpBCdhhGdgQnbl1WZzFmYgEGIzdSZyVGa0BCbv9GajNHIlhGdgIXZk5WV"),hint:Z("==wcuFGbwBSZoRHIu9GI0dibzlGI0FGa0Bicv9GbmBSYgMXYoBCbv9GajNHIlhGV")},
 g19:{ep:1,text:Z(""),title:Z("EVEVFxUREBCVT9EU"),msg:Z("==gL0lGI3F2cgU3b5BCd1JEIuQ3cvBHIlhGdgUGdlxWZkByb0BCZldWYuFWbgkHcw9GU"),hint:Z("=M3dvh2cgUGazBibhhGdgUmcv1GIkVGdz9GcgkHcw9GU")},
 g18:{ep:2,text:Z(""),title:Z("=g0QV1EIP9EVgc1TOtEIV9UW"),msg:Z("=4yajFmc0BCdodWayBSZoRHIu9GIlJ3J19WegU2apxGIzt2bvxEIu42bpRXYnlGdzVmdulGIyV3b5BCZlNWa09mbgMXYoBydvRWYoNFIlhGV"),hint:Z("l52bnBSekFWZyxWYgM3Jvh2dgUmbvVWbvNHIzVGZ1x2YulGIlx2Yyl2YgUGa0BiZpBSesxWYpNWZwNXRg4CZlN3bsNmb1BCdmVGbgIXZ0RXZiBSZyFGIzdmbpJHdzBSZt92U")},
 shadows:{ep:1,text:Z(""),title:Z("==AVJBSRLFUTgQ1JORUSEBSWFhEV"),msg:Z("uc3buBicvZGImCo4kVGdhVmc0VmcgUmdhhGIzVmc1RXYlJ3YgUGaUBiL5F2dsxWYoBSZoRHIulGIzRnbp9GcgATN"),hint:Z("yV2Zu9GbgUGb0RXasBSYgkXY3xGbhhGIlhGdg4WagQXdvBCZs9GS")}};
var NEP=19, DONE=19; /* DONE = до какой серии на доске уже есть улики */
var TAG={f:"confirmed",s:"suspicion",q:"question",v:"his version",h:"vision"};
var P=[
{id:"nadin",n:"Nadine Ross",fem:1,img:"img/nadin.webp",role:"School journalist",ep:1,rel:["miranda","rudi","father","grandpa"],f:[
 [1,"A white-eyed shadow in the restroom stall.","h","","w-shadow"],
 [2,"Miranda's face changes in the doorway, someone's silhouette behind the door glass.","h","","w-door"],
 [3,"“The Thing” in the restroom (Courage path): “I have twelve arms… Someone will kill everyone soon.”","h","","w-creature"],
 [3,"“The Thing” in the restroom (Caution path): “You and me. Me and you… We'll grow into one skin.”","h","","w-creature2"],
 [4,"The school at night: a whisper “Come…” by the locker, two with roots.","h","","w-voice"],
 [4,"Sure all the visions come from black hellebore.","v"],
 [4,"She'd run into hellebore before as a kid, in the woods with her grandpa.","f"],
 [5,"A white-eyed shadow at the junkyard.","h","","w-junk"],
 [6,"Miranda in the darkroom: “He's looking for you.”","h","","w-miranda6"],
 [7,"An invisible noose around her neck. “Together now… into the ground.”","h"],
 [8,"At the pit she realizes: Tom was already lying there when she saw the shadow at the junkyard.","v"],
 [8,"Suspects she's being poisoned: hellebore couldn't have gotten into Miranda's locked locker on its own.","s"],
 [8,"For the first time she asks herself why she's the one seeing the visions.","q"],
 [9,"In the thrift store basement the world turned upside down, Alice and Poppy stand with their backs to her, and black hair crawls out of the mirror. It smells of strawberries, like Miranda.","h","","w-mirror"],
 [10,"Mom grinning by the stairs, a creature under the bed.","h","","w-mom"],
 [11,"At Howard's gate a woman repeats the words from her dream exactly, and through the junkyard photo — a creature tearing someone's face off.","h","","w-woman"],
 [12,"She's seventeen.","f"],
 [12,"In the library a ghost girl sits by the shelves, in the archive a girl stands in the aisle. Alice doesn't see her.","h","","w-ghost"],
 [13,"Hellebore shows up both then and now. Could it be the weapon?","v"],
 [13,"In the locker room: “It's all your fault” written in blood, white-eyed shadow children and a shadow with Poppy's voice. The real Poppy didn't see anything.","h","","w-guilt"],
 [13,"Takes part in the foray into Old Saintfour.","f"],
 [14,"In an abandoned house she sees someone's face behind a curtain.","h","","w-curtain"],
 [15,"She touched the flower and passed out. She woke up in a hospital where a girl with a doll in a wheelchair whispered: “They say you're crazy… Just like me.”","h","","w-candy"],
 [15,"She's been afraid of hellebore since childhood, but in her dreams she wandered Old Saintfour. Now she followed the ringing bell to the Tower, went through one of the doors and ended up in Saintfour in 1986.","f"],
 [15,"Even before the Tower she thinks: “Will you open the right door?” Inside she picks a door without thinking, like in the dark of her own home.","f"],
 [16,"The woman at the gate lured her into an alley and tried to push her into a manhole of boiling water. Mrs. Hill saved her.","f"],
 [16,"She followed the ringing bell to the Tower again. Inside, a translucent Malcolm begged to be let out.","f","","w-malcolm"],
 [16,"She came to on the same street she walked in 1986, only now overgrown with hellebore. The kids found her. Warlock people surrounded them all.","f"],
 [17,"Something dark behind her pushes her to take her own life. Then she sees herself dead, overgrown with hellebore. Nobody heard her scream by the garage.","h","","w-whisper"],
 [18,"After the Tower a whole chunk fell out of her memory and is coming back slowly. She remembered she came out of the Tower together with Malcolm. Then she never saw him again. He acted strangely, as if he were pretending.","f"],
 [18,"Twice she walked “on autopilot”: something pulled her toward the Tower.","f"],
 [18,"At night someone lies next to her in bed, looking like Poppy, or like Nadine herself. In the morning there are hellebore flowers under the pillow.","h","","w-double"],
 [18,"At 42 Caution: pulsing veins creep over the walls of her room, and a yellow-eyed creature sits on the hallway ceiling.","h","","w-veins"],
 [18,"Connects the flowers under her pillow to the hellebore in Miranda's locker and bag. Thinks the shadow in the corner of her room was also on Miranda's last tape.","v"],
 [19,"She knew the symbols on the plaque since childhood: the key was in her childhood book “Shadows of Saintfour”.","f"],
 [19,"Thinks the woman at the gate is also a time traveler, only one who has lost her mind for good. She's afraid of becoming like her.","s"],
 [19,"If the dates above the Tower doors don't appear on their own, was someone there before her?","q"]]},
{id:"miranda",n:"Miranda Martinez",img:[[1,"img/miranda_p.webp"],[2,"img/miranda_e2.webp"],[7,"img/miranda_e7.webp"]],role:"Nadine's friend, makes the newspaper with her",stamp:["dead","dead"],se:2,ep:1,rel:["nadin","boy","martinez","ethan",["sheriff",3]],f:[
 [1,"Shortly before the events she went to Old Saintfour with a guy from the Owls.","f"],
 [1,"After the foray she's sure someone is following her.","f"],
 [1,"Saw other people in the zone and something she can't describe.","f"],
 [2,"Died that same evening.","f"],
 [3,"Died between 18:00 and 19:30. Found in a tree near her house.","f"],
 [3,"At 18:06 she called her brother and hung up right away. Did she want to call for help or say goodbye?","q"],
 [3,"Her last video: she can't open her mouth, tries to say something and asks for help. “No one will hear and no one will come.” When you rewind, there's something dark and thick behind her.","f"]]},
{id:"boy",n:[[1,"The Owl guy"],[6,"Tom"],[7,"Thomas Knightley"]],img:[[1,""],[7,"img/tom.webp"],[8,"img/tom_dead.webp"]],role:"Took Miranda to Old Saintfour",stamp:["q","who?"],su:7,stamp2:[3,"threat","suspicion",8],dead:8,ep:1,rel:["miranda"],f:[
 [1,"An Owl. Took Miranda to Old Saintfour.","f"],
 [1,"Doesn't go to the school, but showed up near it.","f"],
 [1,"Who was he waiting for by the school?","q"],
 [3,"Nadine thinks he might be involved in Miranda's death or know something.","s"],
 [6,"His name is Tom. Older than Miranda. She didn't tell her mom he was an Owl.","f"],
 [6,"The police saw him by Miranda's house when they were taking her down from the tree. Then he disappeared.","f"],
 [6,"Why did he come back to her house?","q"],
 [7,"Worked at the 4Spins laundromat with Dex. A week ago he stopped showing up for work.","f"],
 [8,"After Miranda's death he didn't go near the zone. He was nervous and said he was being followed.","f"],
 [8,"Found dead in a shallow pit at the junkyard. A hole in his temple.","f"],
 [9,"Died about a week ago.","f"]]},
{id:"sheriff",n:"Sheriff Wilson",img:"img/sheriff.webp",role:"Saintfour Police",stamp:["q","suspect"],se:5,ep:1,rel:["malcolm","dex","howard","martinez","miranda"],f:[
 [1,"Handles the Malcolm Brown disappearance case.","f"],
 [1,"Called Dex in to the station. Why?","q"],
 [3,"Handles the Miranda death case. Didn't find a note.","f"],
 [3,"Leans toward the bullying version. Relies on the video Poppy posted.","v"],
 [3,"Doesn't want to hear about Old Saintfour. Why?","q"],
 [5,"In Alice's photo he's arguing with Nathaniel Howard by the junkyard.","f"],
 [17,"Came to Old Saintfour with Warlock people and chased the kids.","f"],
 [17,"Nadine is sure: the sheriff and Howard are in it together.","s"]]},
{id:"malcolm",n:"Malcolm Brown",img:[[1,""],[16,"img/malcolm16.webp"]],role:"Missing, probably an Owl",stamp:["dead","missing"],su:16,stamp2:[16,"threat","locked in the Tower"],ep:1,rel:[],f:[
 [1,"Missing. The sheriff is handling the case.","f"],
 [7,"His social media page is private. His profile picture: black hair and a leather jacket.","f"],
 [8,"Went missing in Old Saintfour together with Lewis Holt (you only learn the name with high Image).","f"],
 [16,"Locked in the Tower. Lunged at Nadine.","f","","w-malcolm"],
 [16,"In the prologue it's the dark-haired one who runs into the Tower. After that the screaming in the Tower doesn't stop.","f"],
 [18,"According to Nadine: it seems they came out of the Tower together, and then he vanished. He acted strangely, as if he were pretending.","f"]]},
{id:"howard",n:"Nathaniel Howard",img:"img/howard.webp",role:"Head of the Warlock Corporation",egg:[1,"warlock"],stamp:["threat","lies"],stamp2:[10,"threat","suspicion"],ep:1,rel:["sidney",["sheriff",5],"bowie"],f:[
 [1,"Son of Warlock's founder, runs the corporation.","f"],
 [1,"The corporation owns Old Saintfour. Entry is forbidden.","f"],
 [1,"He lies about the missing: publicly denies anyone died in the zone, but sends people there himself.","s"],
 [1,"Destroying the flower isn't his only goal. What are the others?","q"],
 [1,"In an interview he wanted to talk about Warlock's achievements in medicine. He called the flower “a more resilient and dangerous species”. According to him, the bodies in the zone are only animals.","v"],
 [5,"In Alice's photo he's arguing with Sheriff Wilson by the junkyard.","f"],
 [7,"Came to the school. The principal fawns over him.","f"],
 [9,"Took over Warlock very young, when the previous head fell ill. He hides his age.","f"],
 [9,"Moved to Saintfour after his father, long after the epidemic began. His date of birth isn't online.","f"],
 [9,"Came to the newsroom and read Nadine's board. Politely made it clear she should stay out of it.","s"],
 [9,"According to him, the Owls are to blame for the disappearances.","v"],
 [9,"He's lying: it was the man in the suit who took the “object” in the woods, clearly not an Owl.","s"],
 [10,"Nadine's board in the newsroom was erased. Nadine is sure it was him: “He's robbed me for the second time.”","s"],
 [11,"Gave the school his own security guards “to fight crime”. They come to classes and check bags.","f"],
 [11,"Keeps files on the “objects” and photos from the junkyard at home. He caught Nadine looking at them, took the photos and drove her to the police.","f"],
 [17,"Called everything the kids saw a mass psychosis from hellebore. He didn't press charges against them and ordered the hole in the fence sealed.","f"],
 [18,"Nadine and Darren think he keeps the field unstable so the Tower opens when he needs it to.","s"],
 [19,"At the parents' meeting he announced: the Owls collect hellebore and make a drug from it that causes hallucinations. The police have supposedly already picked up poisoned students. He linked it to the '80s, when a hellebore drug was also made and many young people died: “History is repeating itself.” And so everything the kids saw was written off as drugs.","v"]]},
{id:"sidney",n:"Sydney Whitley",img:"img/sidney.webp",role:"Journalist, Nadine's idol",ep:1,rel:["howard"],
 tg:{url:"https://t.me/sydneywhitley",intro:"In March, Sydney ran an investigation into the old town on her channel. The posts got stranger and stranger, and then she disappeared.", },
 f:[
 [1,"Raised the issue of the missing Owls publicly.","f"]]},
{id:"liam",n:"Liam",img:"img/liam.webp",role:"Basketball team · #7",ep:2,rel:["rudi","ted"],f:[
 [2,"Plays basketball with Rudy.","f"]]},
{id:"ted",n:"Ted",img:"img/ted.webp",role:"Basketball team · #12",ep:2,rel:["rudi","liam"],f:[
 [2,"Plays basketball with Rudy.","f"]]},
{id:"dex",n:"Dex Hawk",img:"img/dex.webp",role:[[1,"Classmate"],[5,"Connected to the Owls"],[7,"An Owl"]],ep:1,rel:["sheriff","rudi",["darren",5],["poppy",10]],f:[
 [1,"Nadine suspects the sheriff called him in over the Malcolm Brown case.","s"],
 [1,"What does he have to do with the missing guy?","q",7],
 [5,"Works at the 4Spins laundromat.","f"],
 [7,"An Owl.","f"],
 [7,"Worked with Tom. Says they barely talked.","v"],
 [8,"Knows a way into Old Saintfour.","f"],
 [10,"After Howard's interview he was called in for questioning with the other Owls over the Thomas Knightley case.","f"],
 [13,"Takes part in the foray into Old Saintfour.","f"],
 [17,"Gave the sheriff the names of the Owls from the hospital: Chad Moran and Harry Diaz.","f"],
 [19,"The Owls don't trust each other anymore and have split into groups. Those two from the hospital seem to have talked.","f"]]},
{id:"rudi",n:"Rudy Brooks",img:"img/rudi.webp",role:"Nadine's childhood friend",ep:1,rel:["nadin","dex",["liam",2],["ted",2]],f:[
 [1,"Captain of the school basketball team.","f"],
 [13,"Takes part in the foray into Old Saintfour.","f"],
 [15,"Nadine never used to faint. Did it happen often? “When I was little… once.”","f"]]},
{id:"poppy",n:"Poppy Emerson",fem:1,img:"img/poppy.webp",role:"Classmate, blogger",ep:1,rel:[["nadin",5]],f:[
 [1,"Runs a nationwide beauty blog and a gossip blog about the whole town.","f"],
 [2,"Posted a video of Miranda looking scared.","f"],
 [6,"Secretly searches abandoned cars at the junkyard. She found something and wants to sell it.","s",10],
 [7,"Doesn't like the principal.","f"],
 [10,"Right after Miranda's death she put dashcams in the junkyard cars. On the recording: a gunshot and people in suits burying a body. She thinks it's the corporation. She buried the video in the woods and keeps a copy on her phone.","f"],
 [10,"Sure that it wasn't the Owls who killed Tom.","v"],
 [11,"Lives with her mom, has her father's last name.","f"],
 [12,"She and Alice share a secret. If Poppy breaks her promise, Alice can break hers.","f"],
 [13,"Takes part in the foray into Old Saintfour.","f"],
 [18,"She has a knife scar on her back, the nerves there are damaged. As a child her drunk father stabbed her.","f"],
 [19,"The principal dated her mom and dumped her. She says he runs errands for Howard.","f"],
 [19,"Out of boredom she draws spirals that look like the symbols on the plaque.","f"]]},
{id:"darren",n:"Darren Bowie",img:"img/darren.webp",role:"Classmate",ep:1,rel:[["dex",5]],f:[
 [1,"Not involved in anything so far.","f",7],
 [5,"Explains the shadow in the photo with the magnetic field and ultraviolet light.","f"],
 [7,"Looking for an Owl to take him to Old Saintfour.","f"],
 [7,"Shows Dex (an Owl) some photo. What's in it?","q",18],
 [7,"Goes everywhere with his personal driver Theodore and hides even small things from him.","f"],
 [7,"His mom was a scientist.","f"],
 [13,"Makes plant extracts in the lab, knows a lot about hellebore.","f"],
 [13,"According to him, the meter at Tom's grave is a simple one and could have picked up interference from the junk.","v"],
 [13,"Warlock's business is classified. His father keeps him away from it and doesn't know everything himself.","f"],
 [13,"Takes part in the foray into Old Saintfour.","f"],
 [14,"Took a field meter to Old Saintfour: he's checking why the power keeps going out there. Thinks the field here is unstable, it “drifts”.","f"],
 [15,"Before the epidemic hellebore wasn't this toxic, and then it “went feral as if on command”. Nobody knows why.","f"],
 [15,"When Nadine hears the bell, his field meter beeps like crazy.","f"],
 [18,"His father lied to him that his mom studied small natural anomalies. In his father's office Darren found the truth and her notes, and among them a tape from July 2017. He hid it in the old camp. His mom's pictures of Old Saintfour are why he went to Dex.","f"],
 [18,"Thinks the fence around Old Saintfour doesn't contain the anomaly, and the Tower transforms time. In his version, Nadine didn't travel to the past but “slipped off the line”: “To you it looks like traveling to the past, but really you just entered a different point of the same structure.”","v"],
 [18,"The cables and poles around the Tower are coils that change and measure the field. That's why his meter beeps. Conclusion: the corporation has been studying the Tower for a long time.","v"],
 [18,"In his theory, the town's power goes out because of the labs: the grid can't handle their load.","v"],
 [19,"Thinks his father knows something about the foray: he asks strange questions.","s"]]},
{id:"ethan",n:"Ethan Martinez",img:"",role:"Miranda's brother",stamp:["q","hasn't appeared"],ep:3,rel:["miranda","martinez"],f:[
 [3,"Older brother, lives and works in another town. After graduation Miranda planned to move in with him.","f"],
 [3,"Why did she call him minutes before she died and hang up?","q"]]},
{id:"bowie",n:"Mr. Bowie",img:"img/bowie.webp",role:"Darren's father",ep:3,rel:["howard"],f:[
 [3,"Handles cybersecurity for big corporations, Warlock included.","f"]]},
{id:"olivia",n:"Olivia",img:"img/olivia.webp",role:"Classmate",ep:3,rel:["miranda"],f:[
 [6,"Knows Poppy's secret. Keeps watch while Poppy digs through the cars.","f"]]},
{id:"alice",n:"Alice Lee",img:"img/alice.webp",role:"Photographer",ep:2,rel:[["librarian",5],["miranda",5],["sheriff",5]],f:[
 [2,"Captures people's emotions on film.","f"],
 [12,"As a kid she had an imaginary friend. She heard the child's whisper in the library together with Nadine.","f"],
 [12,"She and Poppy share a secret. If Poppy breaks her promise, Alice can break hers.","f"],
 [13,"Takes part in the foray into Old Saintfour.","f"],
 [14,"Went to Old Saintfour as a kid.","f"],
 [19,"The click of her film camera drove off the silhouette outside the window.","f","","w-jimmy"],
 [19,"Saw a symbol like the ones on the plaque in a computer game.","f"]]},
{id:"librarian",n:"The librarian",img:"img/librarian.webp",role:"Alice's grandma",ep:5,rel:["alice","nadin"],f:[
 [5,"Gave little Nadine the “Shadows of Saintfour” book that survived the fire.","f"],
 [13,"Lived through Saintfour in the '80s. Alice: people got so used to the local weirdness they don't notice it anymore.","f"]]},
{id:"father",n:[[2,"Nadine's dad"],[11,"Larry Ross"]],img:"img/father.webp",role:[[2,"Architect"],[9,"(Larry Ross) · architect"],[11,"Nadine's dad · architect"]],ep:2,rel:["nadin","grandpa"],f:[
 [4,"Thinks a tower like that is impossible to build.","f"]]},
{id:"brother",n:"Jimmy Ross",img:"",role:"Nadine's brother",ep:2,rel:["nadin"],f:[
 [10,"Hid Nadine's evidence in his stash: the photo with Miranda, the tape with the initials and the old camera.","f"],
 [11,"Nadine told him about everything that's going on.","f"]]},
{id:"mother",n:[[4,"Nadine's mom"],[11,"Amelia Ross"]],img:"",role:"Nadine's mom",ep:4,rel:["nadin","father"],f:[
 [4,"Constant migraines."]]},
{id:"grandpa",n:"Grandpa",img:"",role:"Nadine's grandpa",stamp:["q","hasn't appeared"],ep:4,rel:["nadin","father"],f:[
 [4,"Was with Nadine in the woods when she first came across black hellebore."]]},
{id:"martinez",n:"Mrs. Martinez",img:[[2,"img/martinez.webp"],[3,"img/martinez_e3.webp"]],role:"Miranda's mom, a literature teacher",ep:2,rel:["miranda","ethan","sheriff"],f:[
 [3,"Doesn't believe it was suicide: Miranda called her brother, and you don't do that if you've already made up your mind.","f"],
 [6,"Won't let her daughter be buried without an independent examination.","f"],
 [9,"She suspected Tom, but by then he was already dead.","f"]]},
{id:"watchman",n:"The watchman",img:[[4,"img/storozh.webp"],[6,"img/storozh_blood.webp"],[7,"img/storozh.webp"]],role:"School watchman",stamp2:[6,"threat","dangerous",7],ep:4,rel:["nadin"],f:[
 [6,"On prank night he came out to the students covered in blood: “Kids, I found you.”","s",7],
 [7,"It was his prank: fake blood, a plastic knife.","f"]]},
{id:"director",n:"The principal",img:"img/director.webp",role:"School principal",ep:3,rel:["poppy","howard"],f:[
 [7,"Sucks up to Howard.","f"],
 [7,"Poppy doesn't like him.","f"],
 [10,"Nadine asked him to fix the broken lock in the newsroom.","f"],
 [19,"Dated Poppy's mom and dumped her. Poppy: he runs errands for Howard.","f"]]},
{id:"abigail",n:"Abigail Davis",img:"img/abigail.webp",role:"Poppy's friend",ep:6,rel:["poppy","rudi"],f:[
 [6,"Has a crush on Rudy.","f"]]},
{id:"coulman",n:"Ethan Coleman",img:"img/coulman.webp",role:"Thrift store clerk",ep:9,rel:["father","librarian"],f:[
 [9,"He used to live in Old Saintfour and worked at the museum, which also got overgrown with hellebore. After the epidemic he lost his job.","f"],
 [9,"Knows Nadine's dad: he built him a new house.","f"]]},
{id:"howardgirl",n:"The girl in Howard's house",fem:1,img:"img/howard_girl11b.webp",role:"Who is she?",stamp:["q","who?"],ep:11,rel:["howard"],f:[
 [11,"Nadine sees her in Howard's house.","f"]]},
{id:"stevegirl",n:"Steve's sister",fem:1,img:"img/stevegirl18.webp",role:"Steve Bailey's sister",ep:18,rel:["suitman"],f:[
 [18,"She confirmed: Steve didn't die in Old Saintfour but on the border between Old and New.","f"],
 [18,"Two men in suits intimidated her: a Warlock man and a bald guy. She's kept quiet ever since.","f"],
 [18,"Thinks Howard is behind everything and is afraid of wiretaps.","v"]]},
{id:"brooks",n:"Mr. Brooks",img:"img/brooks.webp",role:"Rudy's dad · psychiatrist",ep:10,rel:["rudi","father"],f:[
 [10,"The Brooks and Ross families are friends.","f"]]},
{id:"owlman",n:[[8,"The Owl from the junkyard"],[15,"Chad"],[17,"Chad Moran"]],img:[[8,"img/owl_man.webp"],[15,"img/owl_man15.webp"]],role:"An Owl, the oldest",dead:15,ep:8,rel:["boy","malcolm"],f:[
 [8,"Told them about Tom and Malcolm.","f"],
 [10,"After Howard's interview he was called in for questioning with the other Owls over the Thomas Knightley case.","f"],
 [15,"At the hospital hellebore vines wrapped around him and flowers came out of his mouth. One of his own, the Owl with the machete, cut his head off.","f"]]},
{id:"owlmachete",n:[[15,"The Owl with the machete"],[17,"Harry Diaz"]],img:"img/owl_machete.webp",role:"An Owl, nervous, lisps, twitches his shoulder",ep:15,rel:["owlman"],f:[
 [15,"Cut off Chad's head.","f"]]},
{id:"woman",past:16,n:"The woman at the gate",fem:1,img:"img/woman16.webp",role:"Smells of mothballs",ep:16,rel:["nadin"],f:[
 [11,"At Howard's gate she repeated words from Nadine's dream. Poppy didn't see her.","h","","w-woman"],
 [16,"In 1986 she tried to push Nadine into a manhole full of boiling water. “He told me.”","f"],
 [16,"Mrs. Hill: she's been wandering the streets for years, the locals stopped listening.","f"],
 [19,"Darren thinks she might be a time traveler.","v"]]},
{id:"mrshill",past:16,n:"Mrs. Hill",img:"img/hill16.webp",role:"Shop owner · 1986",ep:16,rel:["nadin","sarah"],f:[
 [16,"Runs a shop with old things. It has the same mirror Nadine broke in the thrift store in the future.","f"]]},
{id:"sarah",past:16,n:"Sarah O'Neil",fem:1,img:"img/sara16.webp",role:"Saintfour, 1986",ep:16,rel:["mrshill"],f:[
 [16,"Nadine's age, only from 1986. She lives in the very house Nadine found abandoned on the foray.","f"]]},
{id:"skater86",past:16,n:"The guy with the skateboard",img:"img/skater86.webp",role:"Saintfour, 1986",ep:16,rel:["nadin"],f:[
]},
{id:"forestguy",n:"The guy in the beanie",img:[[2,"img/skater.webp"],[8,"img/forest_guy.webp"]],role:"A student at the same school, skater",stamp:["threat","wounded"],stamp2:[9,"dead","missing"],se:8,ep:2,rel:[],f:[
 [2,"Goes to the same school, skateboards.","f"],
 [8,"Was at the party by the junkyard.","f"],
 [8,"Sees “him” in every shadow. Hallucinations, like from hellebore?","q"],
 [8,"The man in the suit shot him in the leg and called him an “object”.","f"],
 [9,"Never came home, the police are looking for him. On TV: that night something like a gunshot was heard from the woods.","f"]]},
{id:"suitman",n:[[8,"The man in the suit"],[18,"A Warlock man"]],img:"img/suit_man.webp",role:"Armed",stamp:["threat","fired a gun"],ep:8,rel:[],f:[
 [8,"Shot a guy in the woods and reported over the radio: “We have the object.” The order in reply: “Ensure a return to the starting point. Observation is over.”","f"],
 [8,"Like in the prologue: people are let into the zone and watched?","q"],
 [17,"Caught the kids in the woods after the foray into Old Saintfour: “I've got them.”","f"],
 [18,"Together with a bald partner, he scared Steve's sister into keeping quiet.","f"]]},
{id:"missing",n:"The two missing guys",img:[[5,""],[16,"img/missing16.webp"]],qm:16,role:"Went missing in Old Saintfour",stamp:["dead","missing"],ep:5,rel:["malcolm"],f:[
 [5,"They went to Old Saintfour and never came back. They'd been warned.","f"],
 [8,"Malcolm Brown and Lewis Holt? (names only with high Image)","q",16],
 [8,"An Owl says Lewis was odd and cowardly, scared of everything.","f"],
 [16,"One is definitely Malcolm Brown: Nadine recognized him in the Tower. The second, the red-haired guy from the prologue, is most likely Lewis Holt.","f"]]},
{id:"smb",n:[[3,"C.M.B."],[18,"Charlotte Maria Bowie"]],img:"",role:[[3,"Author of the 2017 tape"],[18,"Darren's mom · Warlock scientist"]],stamp:["q","who?"],su:18,stamp2:[18,"dead","died"],ep:3,rel:["howard",["darren",18]],f:[
 [3,"The initials on the 2017 tape. It shows the Tower and people with rifles.","f"],
 [3,"Who is this?","q",18],
 [18,"Darren's mom, a Warlock scientist. She was tasked with stabilizing the magnetic field anomaly, and then ordered to do the opposite: push the field to its limit to reach the object.","f"],
 [18,"She filmed the zone from behind the fence and called the Tower the Obscura. After being removed from the project she died of an aneurysm right at work.","f"],
 [18,"She was supposed to hand her notes over to the corporation, but didn't.","f"]]}
];
/* обязательный порядок в «Людях»; остальные идут следом в своём порядке */
var ORDER=["nadin","miranda","dex","rudi","poppy","darren","alice","howard","sheriff"];
/* семья Надин стоит вместе, на месте того, кто из неё появился первым */
var FAMILY=["father","mother","brother","grandpa"];
(function(){var pos={}, by={}; P.forEach(function(p,i){pos[p.id]=i; by[p.id]=p});
  function key(p){var i=ORDER.indexOf(p.id); if(i>=0) return i; var f=FAMILY.indexOf(p.id);
    if(f>=0){var first=Math.min.apply(null,FAMILY.filter(function(id){return by[id]}).map(function(id){return 100+by[id].ep*100+pos[id]})); return first+f*.01}
    return 100+p.ep*100+pos[p.id]}
  P.sort(function(a,b){return key(a)-key(b)})})();
var BY={}; P.forEach(function(p){BY[p.id]=p});
var KEY="sentfor_read", read=5, chosen=false;
var LOOKS={nadin:{name:"Nadine",def:"ea",opts:[{k:"ea",label:"East Asian",img:"img/nadin_ea.webp"},{k:"eu",label:"White",img:"img/nadin_eu.webp"},{k:"af",label:"Black",img:"img/nadin_af.webp"},{k:"la",label:"Latina",img:"img/nadin_la.webp"}]},dex:{name:"Dex",def:"2",opts:[{k:"1",label:"Slicked-back hair",img:"img/dex_1.webp"},{k:"2",label:"Messy bangs",img:"img/dex_2.webp"}]}};
var LKEY="sentfor_looks", looks={}, lookChosen=false;
try{var lv=JSON.parse(localStorage.getItem(LKEY)||"null"); if(lv&&typeof lv==="object"){looks=lv; lookChosen=true}}catch(e){}
var HAIR=[{k:"blond",label:"Blonde"},{k:"red",label:"Red"},{k:"black",label:"Black"},{k:"brown",label:"Light brown"}];
var HAIRDEF={ea:"black",eu:"blond",af:"brown",la:"black"};
/* портреты Надин по сочетанию внешность_волосы; чего нет, берётся базовый портрет внешности */
var NADIN_IMG={}; ["ea","eu","af","la"].forEach(function(e){HAIR.forEach(function(h){NADIN_IMG[e+"_"+h.k]="img/nadin_"+e+"_"+h.k+".webp"})});
/* семья Надин по внешности; чего нет, показываем пустой полароид */
var FAM={father:{ea:"img/father_ea.webp",la:"img/father_la.webp",eu:"img/father_eu.webp",af:"img/father_af.webp"},brother:{ea:"img/brother_ea.webp",eu:"img/brother_eu.webp",la:"img/brother_la.webp",af:"img/brother_af.webp"},mother:{ea:"img/mother_ea.webp",eu:"img/mother_eu.webp",la:"img/mother_la.webp",af:"img/mother_af.webp"}};
function eth(){return looks.nadin||LOOKS.nadin.def}
function hair(){return looks.nadinHair||HAIRDEF[eth()]}
function lookImg(id){var L=LOOKS[id]; if(!L) return null; var k=looks[id]||L.def; if(id==="nadin"&&NADIN_IMG[k+"_"+hair()]) return NADIN_IMG[k+"_"+hair()]; var o=L.opts.filter(function(x){return x.k===k})[0]||L.opts[0]; return o.img}
function imgOf(p){if(FAM[p.id]) return FAM[p.id][eth()]||""; return lookImg(p.id)||rv(p.img)}
var IMGMAP={"img/dex.webp":"dex","img/nadin.webp":"nadin"};
try{var v=parseInt(localStorage.getItem(KEY),10); if(v>=1&&v<=NEP){read=v;chosen=true}}catch(e){}
function el(t,c,h){var e=document.createElement(t); if(c) e.className=c; if(h!=null) e.textContent=h; return e}
function lockLabel(ep){return "spoiler · episode "+ep}
window.SF={get read(){return read}, eps:EPS, lock:lockLabel, img:function(src){return IMGMAP[src]?lookImg(IMGMAP[src]):src}, people:function(){return P}, person:function(id){modal(id)}, eggTotal:function(){return Object.keys(EGGS).length}};

/* episode bar */
function bar(){
  var box=document.getElementById("ep-btns"); box.innerHTML="";
  for(var i=1;i<=NEP;i++){(function(i){var b=el("button","ep-btn",String(i)); b.type="button"; var t=i<=read?"Episode "+i+": "+EPS[i]:"Episode "+i; b.title=t; b.setAttribute("aria-pressed",String(i===read)); b.setAttribute("aria-label",t); b.onclick=function(){setRead(i)}; box.appendChild(b)})(i)}
  document.getElementById("ep-name").textContent="“"+EPS[read]+"”";
  var nt=document.getElementById("ep-note"); if(nt){nt.hidden=read<=DONE; nt.textContent="clues from episode "+(DONE+1)+" on are still being added"}
  var cur=box.children[read-1]; if(cur&&box.scrollWidth>box.clientWidth) box.scrollLeft=cur.offsetLeft-box.clientWidth/2+cur.offsetWidth/2;
}
function setRead(n){read=n; chosen=true; try{localStorage.setItem(KEY,String(n))}catch(e){} apply(); var g=document.getElementById("ep-gate"); if(!g) return; if(!lookChosen){showLooks()} else g.hidden=true}
function showLooks(){
  var g=document.getElementById("ep-gate"); document.getElementById("ep-step").hidden=true; document.getElementById("look-step").hidden=false; g.hidden=false;
  var box=document.getElementById("look-groups"); box.innerHTML="";
  Object.keys(LOOKS).forEach(function(id){var L=LOOKS[id]; var grp=el("div","look-g"); grp.appendChild(el("h3","",L.name)); var row=el("div","look-row");
    L.opts.forEach(function(o){var b=el("button","look-opt"); b.type="button"; b.setAttribute("aria-pressed",String((looks[id]||L.def)===o.k)); var im=el("img"); im.src=(id==="nadin"&&NADIN_IMG[o.k+"_"+hair()])||o.img; im.alt=L.name+": "+o.label; b.appendChild(im); b.appendChild(el("span","",o.label)); b.onclick=function(){looks[id]=o.k; showLooks()}; row.appendChild(b)});
    grp.appendChild(row);
    if(id==="nadin"){grp.appendChild(el("h4","look-sub","Hair color")); var hr=el("div","chips"); HAIR.forEach(function(h){var b=el("button","chip-btn",h.label); b.type="button"; b.setAttribute("aria-pressed",String(hair()===h.k)); b.onclick=function(){looks.nadinHair=h.k; showLooks()}; hr.appendChild(b)}); grp.appendChild(hr)}
    box.appendChild(grp)});
  document.getElementById("look-done").focus({preventScroll:true});
}
document.getElementById("look-done").onclick=function(){Object.keys(LOOKS).forEach(function(id){if(!looks[id]) looks[id]=LOOKS[id].def}); if(!looks.nadinHair) looks.nadinHair=hair(); lookChosen=true; try{localStorage.setItem(LKEY,JSON.stringify(looks))}catch(e){} document.getElementById("ep-gate").hidden=true; document.getElementById("ep-step").hidden=false; document.getElementById("look-step").hidden=true; apply()};
document.getElementById("look-open").onclick=showLooks;
function famImgs(){document.querySelectorAll("img[data-fam]").forEach(function(i){var src=(FAM[i.getAttribute("data-fam")]||{})[eth()]; if(src){i.src=src; i.hidden=false} else i.hidden=true})}
var TLKEY="sentfor_tl", tlMode="ep", EGKEY="sentfor_eggs_v2", eggs={};
try{tlMode=localStorage.getItem(TLKEY)||"ep"}catch(e){}
try{eggs=JSON.parse(localStorage.getItem(EGKEY)||"{}")||{}}catch(e){eggs={}}
function rv(x){return Array.isArray(x)?ver(x):x}
function ver(a){var r=a[0][1]; a.forEach(function(v){if(v[0]<=read) r=v[1]}); return r}
function timeline(){
  var box=document.getElementById("tl"); if(!box) return; box.innerHTML="";
  var mb=document.getElementById("tl-mode"); mb.innerHTML="";
  [["ep","By episode"],["real","How it really happened"]].forEach(function(m){var b=el("button","chip-btn",m[1]); b.type="button"; b.setAttribute("aria-pressed",String(tlMode===m[0])); b.onclick=function(){tlMode=m[0]; try{localStorage.setItem(TLKEY,tlMode)}catch(e){} timeline(); famImgs()}; mb.appendChild(b)});
  document.getElementById("tl-note").textContent=tlMode==="ep"?"The way Nadine found everything out, episode by episode.":"The same events, but in the order they actually happened.";
  var vis=TL.filter(function(e){return e.ep<=read});
  var real=vis.slice().sort(function(a,b){return a.o-b.o});
  var list=tlMode==="ep"?vis.slice().sort(function(a,b){return a.ep-b.ep||a.o-b.o}):real;
  var lastEp=0;
  list.forEach(function(e){
    if(tlMode==="ep"&&e.ep!==lastEp){lastEp=e.ep; var c=el("div","ep-card"); c.appendChild(el("span","num","Episode "+e.ep)); c.appendChild(el("h3","",EPS[e.ep])); if(EPA[e.ep]) c.appendChild(el("p","",EPA[e.ep])); box.appendChild(c)}
    var a=el("article","ev"+(e.hot?" hot":"")); if(tlMode==="real") a.appendChild(el("span","n",String(real.indexOf(e)+1).padStart(2,"0"))); a.appendChild(el("span","when",ver(e.when)));
    if(e.img){var im=el("img"); im.loading="lazy"; im.src=e.img; im.alt=e.alt||"";  if(e.fam) im.setAttribute("data-fam",e.fam); a.appendChild(im)}
    a.appendChild(el("p","",ver(e.txt)));
    if(e.egg){var g=EGGS[e.egg], b=el("button","egg"+(eggs[e.egg]?" found":""),g.text); b.type="button"; b.setAttribute("aria-label","Something is scratched on the wall"); b.onclick=function(){findEgg(e.egg)}; a.appendChild(b)}
    box.appendChild(a)});
  if(read<NEP){var n=el("div","ep-card next"); n.appendChild(el("span","num","Episode "+(read+1)+" and beyond")); n.appendChild(el("h3","","Not read yet")); n.appendChild(el("p","","Events will show up here once you pick an episode at the top.")); box.appendChild(n)}
}
document.querySelectorAll("button.egg[data-egg]").forEach(function(b){b.onclick=function(){findEgg(b.getAttribute("data-egg"))}});
function eggsUI(){
  document.querySelectorAll("button.egg[data-egg]").forEach(function(b){b.classList.toggle("found",!!eggs[b.getAttribute("data-egg")])});
  var av=eggAvail(), tot=av.length, got=av.filter(function(k){return eggs[k]}).length;
  var m=document.getElementById("egg-meter"); if(m){m.querySelector("b").textContent=got+" / "+tot; var dots=m.querySelector(".em-dots"); dots.innerHTML=""; av.filter(function(k){return eggs[k]}).concat(av.filter(function(k){return !eggs[k]})).forEach(function(k){var d=el("i",eggs[k]?"on":""); dots.appendChild(d)}); m.setAttribute("aria-label","Easter eggs: found "+got+" of "+tot)}
  var lst=document.getElementById("egg-list"); if(lst){lst.innerHTML=""; av.forEach(function(k){var g=EGGS[k], li=el("li",eggs[k]?"got":""); li.appendChild(el("b","",eggs[k]?g.title:"???")); li.appendChild(el("span","",eggs[k]?g.msg:g.hint)); if(eggs[k]&&g.link){var a=el("a","egg-link","▶ Listen"); a.href=g.link; a.target="_blank"; a.rel="noopener"; li.appendChild(a)} lst.appendChild(li)});
    var more=Object.keys(EGGS).filter(function(k){return (EGGS[k].ep||1)>read}).length; var mm=document.getElementById("egg-more"); if(mm){mm.hidden=more<=0; mm.textContent="\${"+more+" more will unlock in the next episodes."}}
  var rs=document.getElementById("egg-reset"); if(rs){rs.hidden=!Object.keys(eggs).length; rs.classList.remove("sure"); rs.textContent="Reset finds"}
  var c=document.getElementById("egg-count"); if(c) c.innerHTML="Easter eggs found: <b>"+got+"</b> of "+tot;
  document.querySelectorAll("[data-egg-card]").forEach(function(d){d.classList.toggle("found",!!eggs[d.getAttribute("data-egg-card")])});
}
(function(){var rs=document.getElementById("egg-reset"); if(!rs) return;
  rs.addEventListener("click",function(e){e.stopPropagation(); if(!rs.classList.contains("sure")){rs.classList.add("sure"); rs.textContent="Sure? Tap again"; return}
    eggs={}; try{localStorage.removeItem(EGKEY); localStorage.removeItem("sentfor_unk")}catch(x){} eggsUI()})})();
function eggAvail(){return Object.keys(EGGS).filter(function(k){return (EGGS[k].ep||1)<=read&&(!EGGS[k].until||read<EGGS[k].until)})}
function findEgg(k){
  if(!EGGS[k]) return;
  if(document.querySelector(".toast")){setTimeout(function(){findEgg(k)},1500); return}
  var first=!eggs[k]; eggs[k]=1; try{localStorage.setItem(EGKEY,JSON.stringify(eggs))}catch(e){}
  eggsUI();
  var av=eggAvail(), got=av.filter(function(x){return eggs[x]}).length;
  var t=el("div","toast"); t.setAttribute("role","status"); t.appendChild(el("b","",first?"Easter egg unlocked!":EGGS[k].title));
  if(first) t.appendChild(el("span","toast-egg",EGGS[k].title));
  t.appendChild(document.createTextNode(EGGS[k].msg)); t.appendChild(el("span","toast-cnt","Easter eggs found: "+got+" of "+av.length));
  document.body.appendChild(t); setTimeout(function(){t.remove()},first?5200:4200);
  var m=document.getElementById("egg-meter"); if(first&&m){m.classList.remove("ping"); void m.offsetWidth; m.classList.add("ping")}
}

function versions(){
  var thS=document.getElementById("tab-theories"); if(thS) thS.classList.toggle("th-locked",read<19);
  document.querySelectorAll("[data-from],[data-until]").forEach(function(e){var f=e.getAttribute("data-from"), u=e.getAttribute("data-until"); e.classList.toggle("off",(f!==null&&+f>read)||(u!==null&&+u<=read))});
  document.querySelectorAll("[data-solved]").forEach(function(e){var m=+e.getAttribute("data-solved"), ok=m<=read; e.classList.toggle("solved",ok); var t=e.querySelector(".solved-tag"); if(ok&&!t){t=el("span","solved-tag","solved · ep."+m); e.insertBefore(t,e.firstChild)} else if(!ok&&t) t.remove()});
}
function apply(){ timeline(); eggsUI(); famImgs(); var ln=document.getElementById("lb-nadin"), ld=document.getElementById("lb-dex"); if(ln) ln.src=lookImg("nadin"); if(ld) ld.src=lookImg("dex");
  bar();
  document.querySelectorAll("[data-ep]").forEach(function(e){var ep=+e.getAttribute("data-ep"); var l=ep>read; e.classList.toggle("locked",l); if(l) e.setAttribute("data-lock",lockLabel(ep)); else e.removeAttribute("data-lock"); e.setAttribute("aria-hidden",l?"true":"false")});
  versions(); people(); if(window.SFvibe) window.SFvibe(); if(window.SFmx) window.SFmx(); if(window.SFtapeMarks) window.SFtapeMarks(); if(window.SFcork) window.SFcork(); if(openId) modal(openId);
}

/* people grid */
function people(){
  var g0=document.getElementById("people"), gp=document.getElementById("people-past"), pw=document.getElementById("past-wrap"); g0.innerHTML=""; if(gp) gp.innerHTML="";
  var anyPast=false;
  P.forEach(function(p,i){
    var isPast=p.past&&read>=p.past; var g=(isPast&&gp)?gp:g0; if(p.past&&p.ep>read&&p.ep>=p.past) return; if(isPast) anyPast=true;
    var locked=p.ep>read;
    var b=el("button","person"+(locked?" plocked":"")); b.type="button"; b.setAttribute("data-id",p.id);
    var fig=el("figure","pol");
    if(imgOf(p)&&!locked){var im=el("img"); im.loading="lazy"; im.src=imgOf(p); im.alt=rv(p.n);  fig.appendChild(im)} else {var bl=(!locked&&FAM[p.id])?el("div","blank fam",""):el("div","blank",locked?"✕":"?"); bl.setAttribute("aria-hidden","true"); fig.appendChild(bl)}
    if(p.dead&&!locked&&read>=p.dead){fig.appendChild(el("span","stamp dead","dead"))} else if(p.stamp&&!locked&&(p.se||p.ep)<=read&&!(p.su&&read>=p.su)){fig.appendChild(el("span","stamp "+p.stamp[0],p.stamp[1]))}
    if(p.stamp2&&!locked&&p.stamp2[0]<=read&&!(p.stamp2[3]&&read>=p.stamp2[3])){fig.appendChild(el("span","stamp s2 "+p.stamp2[1],p.stamp2[2]))}
    if(p.qm&&!locked&&read>=p.qm) fig.appendChild(el("span","qmark","?"));
    fig.appendChild(el("figcaption","",locked?"???":rv(p.n)));
    b.appendChild(fig);
    var known=p.f.filter(function(x){return x[0]<=read}).length;
    b.appendChild(el("span","pmeta",locked?("appears in episode "+p.ep):(rv(p.role)+" · facts: "+known+(known<p.f.length?" + spoilers":""))));
    if(locked){b.disabled=true; b.setAttribute("aria-label","Hidden until episode "+p.ep)} else b.onclick=function(){modal(p.id)};
    g.appendChild(b);
  });
  if(pw) pw.hidden=!anyPast;
  var ph=document.getElementById("present-h"); if(ph) ph.hidden=!anyPast;
}

/* modal */
var openId=null, lastFocus=null, revealed={};
function modal(id){
  var p=BY[id]; if(!p) return; openId=id;
  var m=document.getElementById("pmodal"), c=document.getElementById("pm-body");
  if(m.hidden) lastFocus=document.activeElement;
  c.innerHTML="";
  var top=el("div","pm-top");
  var fig=el("figure","pol pm-pol"); if(imgOf(p)){var im=el("img"); im.src=imgOf(p); im.alt=rv(p.n); fig.appendChild(im); if(p.qm&&read>=p.qm){var qq=el("span","qmark","?"); qq.style.fontSize="70px"; fig.appendChild(qq)}} else {var bl=FAM[p.id]?el("div","blank fam",""):el("div","blank","?"); fig.appendChild(bl)}
  if(p.dead&&read>=p.dead) fig.appendChild(el("span","stamp dead","dead")); else if(p.stamp&&(p.se||p.ep)<=read&&!(p.su&&read>=p.su)) fig.appendChild(el("span","stamp "+p.stamp[0],p.stamp[1]));
  if(p.stamp2&&p.stamp2[0]<=read&&!(p.stamp2[3]&&read>=p.stamp2[3])) fig.appendChild(el("span","stamp s2 "+p.stamp2[1],p.stamp2[2]));
  top.appendChild(fig);
  var hd=el("div","pm-hd"); var h=el("h3","pm-name",rv(p.n)); h.id="pm-title"; hd.appendChild(h); hd.appendChild(el("p","pm-role",rv(p.role))); hd.appendChild(el("p","pm-first","First seen: episode "+p.ep+" “"+EPS[p.ep]+"”"));
  top.appendChild(hd); c.appendChild(top);
  var list=el("ol","pm-facts");
  p.f.forEach(function(x,k){
    if(x[3]&&read>=x[3]) return;
    var li=el("li","pm-fact"+(x[2]?" k-"+x[2]:"")); var key=id+":"+k; var lk=x[0]>read&&!revealed[key];
    var hdr=el("span","pm-ep","Ep."+x[0]); if(x[2]&&TAG[x[2]]){hdr.appendChild(el("span","pm-tag t-"+x[2],(x[2]==="v"&&p.fem)?"her version":TAG[x[2]]))} li.appendChild(hdr);
    var t=el("span","pm-text",x[1]); li.appendChild(t);
    if(x[4]&&!lk){var jl=el("a","jump pm-jump","Unexplained →"); jl.href="#"+x[4]; jl.setAttribute("data-jump",x[4]); li.appendChild(jl)}
    if(lk){li.classList.add("flocked"); var r=el("button","pm-reveal","Spoiler from episode "+x[0]+". Show"); r.type="button"; r.onclick=function(){revealed[key]=true; li.classList.remove("flocked"); r.remove();
      if(x[4]){var jl2=el("a","jump pm-jump","Unexplained →"); jl2.href="#"+x[4]; jl2.setAttribute("data-jump",x[4]); li.appendChild(jl2)}
      li.tabIndex=-1; try{li.focus({preventScroll:true})}catch(e){}}; li.appendChild(r)}
    list.appendChild(li);
  });
  if(p.f.length){c.appendChild(el("h4","pm-sub","What we know, episode by episode")); c.appendChild(list);}
  if(p.tg){var tg=el("div","pm-tg"); tg.appendChild(el("h4","pm-sub","Her Telegram channel")); tg.appendChild(el("p","pm-tg-intro",p.tg.intro));
    var pb=el("button","pm-phone-btn"); pb.type="button"; pb.innerHTML='<span class="ic">📱</span><span><b>Sydney\'s phone</b><i>17 posts · March 7–20</i></span>'; pb.onclick=function(){if(window.SFphone) window.SFphone()}; tg.appendChild(pb);
    var a=el("a","pm-tg-link","Open the real channel →"); a.href=p.tg.url; a.target="_blank"; a.rel="noopener"; tg.appendChild(a); c.appendChild(tg)}
  if(p.egg&&p.egg[0]<=read&&EGGS[p.egg[1]]){var eg=el("button","egg pm-egg",EGGS[p.egg[1]].text); eg.type="button"; eg.setAttribute("aria-label","Something is written on the edge of the file"); eg.onclick=function(){findEgg(p.egg[1])}; c.appendChild(eg)}
  var rel=p.rel.map(function(r){var id2=Array.isArray(r)?r[0]:r, e2=Array.isArray(r)?r[1]:0, o=BY[id2]; return o&&o.ep<=read&&e2<=read?o:null}).filter(Boolean);
  if(false&&rel.length){c.appendChild(el("h4","pm-sub","Connected to")); var rb=el("div","pm-rel"); rel.forEach(function(r){var b=el("button","chip-btn",rv(r.n)); b.type="button"; b.onclick=function(){modal(r.id)}; rb.appendChild(b)}); c.appendChild(rb)}
  if(window.SFdossierHook) try{SFdossierHook(id,c)}catch(e){}
  m.hidden=false; document.body.classList.add("noscroll");
  document.getElementById("pm-close").focus();
}
window.SFclose=function(){if(openId) close()};
function close(){var m=document.getElementById("pmodal"); m.hidden=true; openId=null; document.body.classList.remove("noscroll"); if(lastFocus&&lastFocus.focus) lastFocus.focus()}
document.getElementById("pm-close").onclick=close;
document.getElementById("pmodal").addEventListener("click",function(e){if(e.target.id==="pmodal") close()});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&openId) close()});

/* first visit gate */
var gate=document.getElementById("ep-gate");
if(!chosen){
  var gb=document.getElementById("gate-btns");
  for(var i=1;i<=NEP;i++){(function(i){var b=el("button","gate-btn",""); b.type="button"; b.setAttribute("aria-label","Episode "+i); b.appendChild(el("b","",String(i))); var t=el("span","",EPS[i]); t.setAttribute("aria-hidden","true"); b.appendChild(t); b.onclick=function(){setRead(i)}; gb.appendChild(b)})(i)}
  gate.hidden=false;
}

/* tabs */
(function(){var TK="sentfor_tab", cur="people"; try{cur=localStorage.getItem(TK)||"people"}catch(e){}
  var btns=[].slice.call(document.querySelectorAll(".tab")), secs=[].slice.call(document.querySelectorAll("section[data-tab]"));
  var keep=null; if(!secs.some(function(x){return x.getAttribute("data-tab")===cur})){keep=cur; cur="people"} /* вкладку карты создаёт map.js позже — запомненную не затираем */
  function show(k,scroll){cur=k; try{if(keep&&!scroll){} else localStorage.setItem(TK,k); keep=null}catch(e){} document.body.classList.toggle("tab-ts1",k==="ts1");
    secs.forEach(function(x){x.hidden=x.getAttribute("data-tab")!==k});
    btns.forEach(function(b){var on=b.getAttribute("data-tab")===k; b.setAttribute("aria-selected",String(on)); b.tabIndex=on?0:-1; if(on&&b.scrollIntoView) b.parentNode.scrollLeft=b.offsetLeft-b.parentNode.clientWidth/2+b.offsetWidth/2});
    if(k==="threads"&&window.SFcork) setTimeout(window.SFcork,0);
    if(scroll){var bar=document.querySelector(".epbar"), sec=document.getElementById("tab-"+k); var vis=bar.offsetHeight-(parseFloat(bar.style.getPropertyValue("--epc"))||0); /* на телефоне видна только строка вкладок */ var top=sec.getBoundingClientRect().top+scrollY-vis-16; if(scrollY>top) window.scrollTo({top:top})}}
  btns.forEach(function(b,i){b.onclick=function(){show(b.getAttribute("data-tab"),true)}; b.onkeydown=function(e){var d=e.key==="ArrowRight"?1:e.key==="ArrowLeft"?-1:0; if(d){var n=btns[(i+d+btns.length)%btns.length]; n.focus(); n.click()}}});
  show(cur,false); var t0=document.getElementById("tab0"); if(t0) t0.remove();
})();

/* для доски следователя (js/inv.js): герои, открытые до выбранной серии */
window.SFinvPeople=function(){
  function nm(v){if(!Array.isArray(v)) return v; var o=v[0][1]; v.forEach(function(x){if(x[0]<=read) o=x[1]}); return o}
  return P.filter(function(p){return p.ep<=read}).map(function(p){return {ref:"p:"+p.id,src:imgOf(p)||"",label:nm(p.n),ep:p.ep}})};
window.SFdossier=function(id){if(BY[id]) modal(id)};
window.SFapply=apply; window.SFegg=findEgg;
apply();
})();
