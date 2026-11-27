/* Башня 2023 — «Ночь в башне», 3D от первого лица (тест). Запускается из js/fx.js: import("tower/tower.js").then(m=>m.start({...}))
   Лестница бесконечная: выше определённой высоты игрок незаметно переносится на виток ниже, а всё вокруг повторяется с тем же шагом.
   Двери с табличками: запертые, комнаты, двери-порталы и засекреченные пасхалки (SOS Миранды, очередь проклятий, подкоп). */
const V = n => new URL("../vendor/" + n, import.meta.url).href;
const T = await import(V("three.module.min.js"));
const { GLTFLoader } = await import(V("GLTFLoader.js"));
const { MeshoptDecoder } = await import(V("meshopt_decoder.module.js"));
const { mergeGeometries } = await import(V("BufferGeometryUtils.js"));
const { EffectComposer } = await import(V("EffectComposer.js"));
const { RenderPass } = await import(V("RenderPass.js"));
const { UnrealBloomPass } = await import(V("UnrealBloomPass.js"));
const { ShaderPass } = await import(V("ShaderPass.js"));
const { OutputPass } = await import(V("OutputPass.js"));
const M = n => new URL("m/" + n, import.meta.url).href;
const IMG = n => new URL("../img/" + n, import.meta.url).href;

const EN = document.documentElement.lang === "en";
const L = EN ? {
  title: "Tower", look: "swipe to look around", walk: "hold ▲ to walk", fw: "Forward", bw: "Back", act: { open: "Open", knock: "Knock", enter: "Go in", read: "Read", take: "Pick up", hatch: "Open the hatch", press: "Press", plaque: "Plaque", out: "Go back", listen: "Listen", down: "Go down", ring: "Ring the bell", clock: "Clock", hide: "Hide", lid: "Push the lid", look: "Look" }, in: "You’re inside the Tower. Somewhere above, someone is walking", sec: "secrets",
  clock: "A door with a plaque above it. Go closer", tapc: "Press “Plaque” below", far: "Too far. Come closer",
  dial: "A plaque with signs above the way out. What date is carved on it?", turn: "Write", ph: "dd.mm",
  wrong: "The door won’t budge", ok: "Day equals night. The door opens",
  next: "The stairs lead up. Nobody knows how many steps there are", exit: "Close", light: "Flashlight", load: "The door opens…", night: "A Night in the Tower", caseN: "The Saintfour Case",
  lock: ["Locked", "Cold air seeps from under the door", "The handle is icy. And a little wet", "Someone on the other side held their breath", "Someone knocked back from inside", "The keyhole is overgrown with hellebore", "The door won’t give"],
  dawnGo: "It’s getting light outside. Walk to the door", plaqueCold: "The signs on the plaque are cold. While time stands still, the exit stays shut", plaqueBell: "The clock is running, but the plaque is silent. Something has to sound at the top", bellDown: "Something clicked far below, by the exit. The plaque is waiting for a date", exitEarly: "Dawn is out there, but you can’t step through. The Tower isn’t letting you go yet",
  endStamp: "Case closed", endText: "You left the Tower at dawn on September 23. Just like Nadine.", endAll: "And you know all four of its secrets.", endStay: "Stay in the Tower", endOut: "Leave", endStats: (m, f, s, a, n) => "Time: " + m + " min · Falls: " + f + "\nSecrets: " + s + "/4 · Achievements: " + a + "/" + n,
  secStamp: "classified", secGo: "Go on", secTag: n => "Secret found · " + n + " of 4", secAll: "All four of the Tower’s secrets. To see what they mean, open “My case” on the site",
  lockAgain: "You’ve already knocked on this door", hum: "Someone is singing. Far below", humEnd: "The song broke off. Right behind you", handle: "Someone is trying the handle. From the other side",
  loop: ["The steps look exactly the same", "You’ve been here before", "No one above. No one below. Only steps", "How long have you been climbing?", "The Tower doesn’t want you to reach the top", "Maybe it’s time to go back down?"],
  sosTap: "Quiet knocking behind the door. Three short, three long, three short", sosHow: "Knock back: tap “Knock” for short, hold it for long", sosWrong: "The knocking stopped. Try again", sosOk: "You heard her. So it worked", sosIn: "Her room. A bed, tapes and SOS in chalk on the wall", tape1: "Miranda’s player. Play is stuck", tape2: "Only hiss. And the light keeps blinking the same thing",
  curseTap: "Four portraits above the door. The door won’t open", curseWrong: "The portraits went dark. The order matters", curseOk: "The door opens. The queue of curses has moved", curseIn: "Four candles. Three of them have gone out",
  portal: "This wasn’t the door you meant to open", portalOut: "You came out somewhere else entirely", loopDoor: "The same door. The same steps. You’ve been here before",
  roomExit: "Walk back to the door to leave", hatchExit: "Walk back to the hatch to go down", dark: "The darkroom. Only what you’ve already found has developed", clockR: "The clock has stopped. The calendar is open on one date",
  note: "A note", scrap: "A scrap of a note is saved in “My case”", door: "Door",
  stairs: "The stairs run along the wall. Hold ▲ to walk up", doors: "There are signs carved on the plaques. Come up to a door",
  loopAll: "The signs on the plaque have lined up. The door leads up", top: "The top of the Tower. No one here. Only the sky, the bell and hellebore", topEnd: "You found all four secrets. The Tower has let you go",
  notes: ["Don’t count the steps. I did. Every time there’s one more.", "She never managed to open her mouth. Try for her", "Four curses. The order matters", "Someone sleeps under the stone. Look in on them", "The door in the Tower will open when day equals night", "Only what you’ve already found will develop. The rest is still in the dark.", "The doors here don’t lead where they face. Read the plaques."]
} : {
  title: "Башня", look: "веди пальцем — смотреть", walk: "держи ▲ — идти", fw: "Вперёд", bw: "Назад", act: { open: "Открыть", knock: "Постучать", enter: "Войти", read: "Прочитать", take: "Подобрать", hatch: "Открыть люк", press: "Нажать", plaque: "Табличка", out: "Выйти", listen: "Послушать", down: "Спуститься", ring: "Ударить в колокол", clock: "Часы", hide: "Спрятаться", lid: "Сдвинуть крышку", look: "Посмотреть" }, in: "Ты внутри башни. Где-то наверху кто-то ходит", sec: "тайны",
  clock: "Над дверью табличка. Подойди ближе", tapc: "Нажми «Табличка» внизу", far: "Слишком далеко. Подойди ближе",
  dial: "Табличка со знаками над выходом. Какая дата на ней вырезана?", turn: "Написать", ph: "дд.мм",
  wrong: "Дверь не поддаётся", ok: "День равен ночи. Дверь открылась",
  next: "Лестница ведёт наверх. Сколько там ступеней, не знает никто", exit: "Закрыть", light: "Фонарик", load: "Дверь открывается…", night: "Ночь в башне", caseN: "Дело Сентфора",
  lock: ["Заперто", "Из-под двери тянет холодом", "Ручка ледяная. И чуть влажная", "По ту сторону кто-то задержал дыхание", "Изнутри постучали в ответ", "Замочная скважина заросла морозником", "Дверь не поддаётся"],
  dawnGo: "Снаружи светает. Иди к двери", plaqueCold: "Знаки на табличке холодные. Пока время стоит, выход не откроется", plaqueBell: "Часы идут, но табличка молчит. Наверху должно что-то прозвучать", bellDown: "Далеко внизу, у выхода, что-то щёлкнуло. Табличка ждёт дату", exitEarly: "Снаружи светает, но шагнуть не получается. Башня тебя ещё не отпускает",
  endStamp: "Дело закрыто", endText: "Ты вышла из башни на рассвете 23 сентября. Как Надин.", endAll: "И знаешь все четыре её тайны.", endStay: "Остаться в башне", endOut: "Выйти", endStats: (m, f, s, a, n) => "Время: " + m + " мин · Падений: " + f + "\nТайн: " + s + "/4 · Ачивок: " + a + "/" + n,
  secStamp: "секретно", secGo: "Дальше", secTag: n => "Тайна найдена · " + n + " из 4", secAll: "Все четыре тайны башни. Что они значат, загляни в «Моё дело» на сайте",
  lockAgain: "Ты уже стучала в эту дверь", hum: "Кто-то поёт. Далеко внизу", humEnd: "Песня оборвалась. Прямо за спиной", handle: "Кто-то дёргает ручку. С той стороны",
  loop: ["Ступени как будто те же самые", "Ты здесь уже была", "Сверху никого. Снизу никого. Только ступени", "Сколько ты уже поднимаешься?", "Башня не хочет, чтобы ты дошла до верха", "Может, лучше спуститься?"],
  sosTap: "Из-за двери тихо стучат. Три коротких, три длинных, три коротких", sosHow: "Ответь: коротко нажми «Постучать» — короткий, зажми — длинный", sosWrong: "Стук стих. Попробуй ещё раз", sosOk: "Ты услышала. Значит, получилось", sosIn: "Её комната. Кровать, кассеты и SOS мелом на стене", tape1: "Плеер Миранды. Кнопка Play залипла", tape2: "Только шипение. А лампочка мигает одно и то же",
  curseTap: "Над дверью четыре портрета. Дверь не поддаётся", curseWrong: "Портреты погасли. Порядок важен", curseOk: "Дверь открылась. Очередь проклятий сдвинулась", curseIn: "Четыре свечи. Три уже погасли",
  portal: "Это была не та дверь", portalOut: "Ты вышла совсем не там, где вошла", loopDoor: "Та же дверь. Те же ступени. Ты уже была здесь",
  roomExit: "Чтобы вернуться, подойди к двери", hatchExit: "Чтобы спуститься, подойди к люку", dark: "Проявочная. Проявилось только то, что ты уже нашла", clockR: "Часы встали. Календарь открыт на одной дате",
  note: "Записка", scrap: "Обрывок записки сохранён в «Моём деле»", door: "Дверь",
  stairs: "Вдоль стены идёт лестница. Держи ▲, чтобы подниматься", doors: "На табличках вырезаны знаки. Подойди к двери",
  loopAll: "Знаки на табличке сложились. Дверь ведёт наверх", top: "Верх башни. Тут никого. Только небо, колокол и морозник", topEnd: "Ты нашла все четыре тайны. Башня тебя отпустила",
  notes: ["Не считай ступени. Я считала. Каждый раз их на одну больше.", "Она так и не смогла открыть рот. Попробуй за неё", "Четыре проклятия. Порядок важен", "Кто-то спит под камнем. Загляни к нему", "Дверь в башне откроется, когда день равен ночи", "Проявится только то, что ты уже нашла. Остальное пока в темноте.", "Двери здесь ведут не туда, куда смотрят. Читай таблички."]
};

// мини-игра: падение, задания, ачивки, шестерёнки для часов
Object.assign(L, EN ? {
  dead: "You died", deadSub: ["The Tower doesn’t like haste", "It was darker below than it looked", "The eyes above saw you fall", "The steps were under your feet. Were"], retry: "Go back", again: "Start from the bottom", livesOut: "The Tower took you", livesOutSub: "No lives left. You’re back at the bottom of the stairs", edge: "The edge. Darkness below",
  ach: "Achievement", jr: "Journal", tTasks: "Tasks", tAch: "Achievements", secretD: "A classified secret", stats: (a, b) => "Turns climbed: " + a + " · Falls: " + b,
  gear: "A gear. Looks like it’s from a clock", gearAll: "All the gears are found. Now to the clock", clockNeed: "The clock has stopped. Gears are missing inside", clockGo: "The gears clicked into place. The clock is running", clockAsk: "Take the gears out? The clock will stop and the stairs will be endless again", clockOut: "Take out", clockKeep: "Leave them", clockStop: "The clock has stopped. Somewhere above, the hatch slammed shut", clockOn: "The clock is running", drawer: "A drawer slid out at the bottom of the clock", stare: "They blinked first",
  note7: "When you’ve found all four secrets, take the door that brings you back. It will lead up.",
  mirrorLock: "Locked. The keyhole is shaped like an eye", mirrorOpen: "The key fits", keyEarly: "The key goes in but won’t turn. Not yet",
  steps: "Footsteps above. Someone is climbing ahead of you", shadowGone: "No one. Only something glinting on the step", woSee: "Someone is standing higher up the stairs", wo: ["One.", "Two.", "Three."], woStare: "Don’t look away", woGone: "She’s gone. For now", crypt: "A crypt. The moon shines straight onto the coffin", cryptCrack: "The lid cracked. From the inside", cryptAgain: "The crack is still there. And it’s wider", lidOpen: "No body. Only a mask", maskTap: "The mask is still warm. As if someone took it off just now", lidAgain: "The coffin is open. The mask is still there", woCaught: "Too late", woCaughtSub: "You shouldn’t have looked away", key: "A key. Warm, as if someone was just holding it",
  chase: "The eyes are coming down. Hide behind any door", chaseRun: "Faster", hid: "You pressed yourself to the door. The footsteps went past", hidHatch: "You slammed the hatch. The eyes stayed below", caught: "They found you", caughtSub: "You should have hidden",
  clockUp: "Something clicked far above. The steps no longer repeat", hatch: "A hatch. Sky shows through the cracks", bell: "The bell. The same one that called Nadine to the Tower", bell2: "The sound goes down, into the forest", hatchShut: "A hatch. It won’t give while time stands still", topEnd2: "Time started again, and the Tower let you go",
  tasks: { climb: "Climb the stairs", notes: "Read every note", knock: "Knock on every locked door", gears: "Find all the gears", clock: "Start the clock", shadow: "Catch up with whoever is climbing above", rooms: "Visit every room", secrets: "Find four secrets", top: "Get to the top of the Tower", bell: "Ring the bell", exit: "Leave the Tower" },
  A: { loop3: ["You’ve Been Here Before", "Climb three turns"], fall: ["Don’t Look Down", "Fall off the stairs"], knock: ["Knock Knock", "Knock on every locked door"], notes: ["Chronicler", "Read every note"], portal: ["Wrong Door", "Come out somewhere other than where you went in"], shadow: ["Who’s There?", "Catch up with whoever is climbing above"], rooms: ["Guest", "Visit every room"], clock: ["Clockmaker", "Start the clock"], top: ["Let Go", "Get to the top of the Tower"], bell: ["Bell Ringer", "Ring the bell at the top of the Tower"], exit: ["Dawn", "Leave the Tower at dawn"], careful: ["Caution", "Climb from the floor to the hatch without falling once"], loop10: ["Infinity", "Climb twelve turns in one go"], dark: ["No Light", "Climb three turns with the flashlight off"], fall5: ["Gravity", "Fall five times"], last: ["Hanging by a Thread", "Reach the top with one life left"], taken: ["The Tower Took You", "Lose all three lives"], equinox: ["Equinox", "Open the door with the plaque"], sos: ["Morse Code", "Answer Miranda"], curse: ["Queue of Curses", "Put the curses in order"], mask: ["Who Lies in the Coffin", "Touch the mask in the coffin"], stare: ["Staring Contest", "Hold the gaze from the darkness above"], peek: ["No Peeking", "Shine a light on whoever is watching through the door"], woman: ["Don’t Look Away", "Hold her gaze to the end"], hide: ["Hush", "Hide from the eyes"], crypt: ["The Crack", "See the coffin crack"], lid: ["Under the Lid", "Look inside the coffin"] }
} : {
  dead: "Ты погибла", deadSub: ["Башня не любит спешки", "Внизу было темнее, чем казалось", "Глаза наверху видели, как ты упала", "Ступени были под ногами. Были"], retry: "Вернуться", again: "Начать снизу", livesOut: "Башня забрала тебя", livesOutSub: "Жизней не осталось. Ты снова внизу у лестницы", edge: "Край. Внизу темнота",
  ach: "Достижение", jr: "Дневник", tTasks: "Задания", tAch: "Ачивки", secretD: "Засекреченная тайна", stats: (a, b) => "Витков пройдено: " + a + " · Падений: " + b,
  gear: "Шестерёнка. Похоже, от часов", gearAll: "Все шестерёнки найдены. Теперь к часам", clockNeed: "Часы стоят. Внутри не хватает шестерёнок", clockGo: "Шестерёнки встали на место. Часы пошли", clockAsk: "Вынуть шестерёнки? Часы остановятся, и лестница снова станет бесконечной", clockOut: "Вынуть", clockKeep: "Оставить", clockStop: "Часы остановились. Где-то наверху захлопнулся люк", clockOn: "Часы идут", drawer: "Внизу часов выдвинулся ящик", stare: "Они моргнули первыми",
  note7: "Когда найдёшь все четыре тайны, иди в дверь, которая возвращает. Она поведёт наверх.",
  mirrorLock: "Заперто. Замочная скважина в форме глаза", mirrorOpen: "Ключ подошёл", keyEarly: "Ключ входит, но не поворачивается. Ещё рано",
  steps: "Сверху шаги. Кто-то поднимается впереди тебя", shadowGone: "Никого. Только на ступеньке что-то блестит", woSee: "Выше на лестнице кто-то стоит", wo: ["Раз.", "Два.", "Три."], woStare: "Не отводи взгляд", woGone: "Она ушла. Пока", crypt: "Склеп. Луна светит прямо на гроб", cryptCrack: "Крышка треснула. Изнутри", cryptAgain: "Трещина никуда не делась. И стала шире", lidOpen: "Тела нет. Только маска", maskTap: "Маска ещё тёплая. Будто её сняли только что", lidAgain: "Гроб открыт. Маска на месте", woCaught: "Опоздала", woCaughtSub: "Не надо было отводить взгляд", key: "Ключ. Тёплый, как будто его только что держали в руке",
  chase: "Глаза спускаются. Спрячься за любую дверь", chaseRun: "Быстрее", hid: "Ты прижалась к двери. Шаги прошли мимо", hidHatch: "Ты захлопнула люк. Глаза остались внизу", caught: "Тебя нашли", caughtSub: "Надо было прятаться",
  clockUp: "Где-то наверху щёлкнуло. Ступени больше не повторяются", hatch: "Люк. Сквозь щели видно небо", bell: "Колокол. Тот самый, что звал Надин в башню", bell2: "Звук уходит вниз, в лес", hatchShut: "Люк. Не поддаётся, пока время стоит", topEnd2: "Время пошло, и башня тебя отпустила",
  tasks: { climb: "Подняться по лестнице", notes: "Прочитать все записки", knock: "Постучать во все запертые двери", gears: "Найти все шестерёнки", clock: "Запустить часы", shadow: "Догнать того, кто идёт выше", rooms: "Побывать во всех комнатах", secrets: "Найти четыре тайны", top: "Выбраться на верх башни", bell: "Ударить в колокол", exit: "Выйти из башни" },
  A: { loop3: ["Ты здесь уже была", "Подняться на три витка"], fall: ["Не смотри вниз", "Сорваться с лестницы"], knock: ["Тук-тук", "Постучать во все запертые двери"], notes: ["Летописец", "Прочитать все записки"], portal: ["Не та дверь", "Выйти не там, где вошла"], shadow: ["Кто там?", "Догнать того, кто идёт выше"], rooms: ["Гостья", "Побывать во всех комнатах"], clock: ["Часовщик", "Запустить часы"], top: ["Башня отпустила", "Выбраться на верх башни"], bell: ["Звонарь", "Ударить в колокол на верху башни"], exit: ["Рассвет", "Выйти из башни на рассвете"], careful: ["Осторожность", "Подняться с пола до люка, ни разу не сорвавшись"], loop10: ["Бесконечность", "Подняться на двенадцать витков за один заход"], dark: ["Без света", "Подняться на три витка с выключенным фонариком"], fall5: ["Притяжение", "Сорваться пять раз"], last: ["На волоске", "Подняться наверх, когда осталась одна жизнь"], taken: ["Башня забрала тебя", "Потерять все три жизни"], equinox: ["Равноденствие", "Открыть дверь с табличкой"], sos: ["Азбука Морзе", "Ответить Миранде"], curse: ["Очередь проклятий", "Расставить проклятия по порядку"], mask: ["Кто лежит в гробу", "Дотронуться до маски в гробу"], stare: ["Гляделки", "Выдержать взгляд из темноты наверху"], peek: ["Не подглядывай", "Посветить на того, кто смотрит из-за двери"], woman: ["Не отводи взгляд", "Выдержать её взгляд до конца"], hide: ["Тише", "Спрятаться от глаз"], crypt: ["Трещина", "Увидеть, как трескается гроб"], lid: ["Под крышкой", "Заглянуть в гроб"] }
});
L.notes[7] = L.note7;

// если башня не смогла запуститься (например, телефон не дал WebGL), убираем всё за собой, чтобы сайт не завис под невидимым слоем
export function start(o) { try { return start0(o) } catch (e) { document.querySelectorAll("body > .tw").forEach(x => x.remove()); document.body.classList.remove("noscroll"); if (o && o.onExit) o.onExit(true); throw e } }
function start0(o) {
  o = o || {};
  const noScare = !!o.noScare;
  const got = Object.assign({}, o.got || {}); if (o.solved) got.equinox = 1;
  /* ---------- DOM ---------- */
  const root = document.createElement("div"); root.className = "tw";
  root.innerHTML = '<canvas class="tw-c"></canvas><div class="tw-hud"><b>' + L.title + ' · <i>2023</i><small class="tw-n"></small></b><span class="tw-hr"><button type="button" class="tw-jb" aria-label="' + L.jr + '">📓</button><button type="button" class="tw-x" aria-label="' + L.exit + '">✕</button></span></div>' +
    '<div class="tw-gp"></div><div class="tw-lv"></div><p class="tw-say"></p><div class="tw-ctl"><button type="button" class="tw-fl on" aria-label="' + L.light + '">🔦</button><button type="button" class="tw-act" hidden></button><span class="tw-mv"><button type="button" class="tw-up" aria-label="' + L.fw + '">▲</button><button type="button" class="tw-dn" aria-label="' + L.bw + '">▼</button></span></div><p class="tw-tip">' + L.look + '</p>' +
    '<div class="tw-red"></div><div class="tw-dead"><b>' + L.dead + '</b><span></span><em class="tw-lvd"></em><button type="button">' + L.retry + '</button></div><div class="tw-fade"></div><div class="tw-cover"><small>' + L.caseN + '</small><b>' + L.night + '</b><i>2023</i><span>' + L.load + '</span></div>';
  document.body.appendChild(root); document.body.classList.add("noscroll");
  const cvs = root.querySelector("canvas"), say = root.querySelector(".tw-say"), cover = root.querySelector(".tw-cover"), fade = root.querySelector(".tw-fade"), cntEl = root.querySelector(".tw-n");
  let sayT = 0, deadNow = () => false;
  function line(s, ms) { if (deadNow()) return; say.textContent = s; say.classList.add("in"); clearTimeout(sayT); sayT = setTimeout(() => say.classList.remove("in"), ms || 3200) }
  const SECRETS = ["equinox", "sos", "curse", "mask"];
  // панель найденных шестерёнок под заголовком
  const GEAR_SVG = '<svg viewBox="-12 -12 24 24"><path d="M-1.6-11h3.2l.6 3a8 8 0 0 1 2.2 1.3l2.9-1 1.6 2.8-2.3 2a8 8 0 0 1 0 2.6l2.3 2-1.6 2.8-2.9-1a8 8 0 0 1-2.2 1.3l-.6 3h-3.2l-.6-3a8 8 0 0 1-2.2-1.3l-2.9 1-1.6-2.8 2.3-2a8 8 0 0 1 0-2.6l-2.3-2 1.6-2.8 2.9 1a8 8 0 0 1 2.2-1.3z"/><circle r="3"/></svg>';
  function gearHud(fresh) { const el = root.querySelector(".tw-gp"); if (!el) return; el.innerHTML = ""; for (let k = 0; k < GN; k++) { const i = document.createElement("i"); i.innerHTML = GEAR_SVG; if (k < GS.gears.length) i.className = "on"; if (fresh != null && k === GS.gears.length - 1) i.classList.add("new"); el.appendChild(i) } el.classList.toggle("done", !!GS.clock) }
  function count() { cntEl.textContent = " · " + L.sec + " " + SECRETS.filter(k => got[k]).length + "/4" } count();
  function solve(k) { ach(k); if (got[k]) return; got[k] = 1; count(); checkAch(); setTimeout(() => { if (!alive) return; if (o.onSolve) o.onSolve(k); secretCard(k) }, 1600) }
  // карточка тайны в стиле игры: фото, название, текст; на сайте она тихо попадает в «Моё дело»
  function secretCard(k) { const S2 = o.sec && o.sec[k]; if (!S2 || uiOpen) return; uiOpen = true; sfx("paper", .7); const n = SECRETS.filter(q => got[q]).length, box = document.createElement("div"); box.className = "tw-dial tw-sec";
    box.innerHTML = '<p class="tw-stag"></p><figure><img alt=""><span class="tw-stamp2">' + L.secStamp + '</span></figure><h3></h3><div class="tw-stx"></div>' + (n >= 4 ? '<p class="tw-sall"></p>' : '') + '<button type="button" class="tw-go">' + L.secGo + '</button><button type="button" class="tw-dx" aria-label="' + L.exit + '">✕</button>';
    box.querySelector(".tw-stag").textContent = L.secTag(n); box.querySelector("img").src = S2.img; box.querySelector("h3").textContent = S2.t; S2.txt.forEach(t2 => { const pp = document.createElement("p"); pp.textContent = t2; box.querySelector(".tw-stx").appendChild(pp) }); if (n >= 4) box.querySelector(".tw-sall").textContent = L.secAll;
    root.appendChild(box); requestAnimationFrame(() => box.classList.add("on")); box.addEventListener("pointerdown", e => e.stopPropagation());
    const close = () => { click(); box.classList.remove("on"); setTimeout(() => box.remove(), 300); uiOpen = false }; box.querySelector(".tw-dx").onclick = close; box.querySelector(".tw-go").onclick = close }

  /* ---------- задания и ачивки (хранятся в браузере читателя) ---------- */
  const SK = "sentfor_tower"; let GS = {}; try { GS = JSON.parse(localStorage.getItem(SK) || "{}") || {} } catch (e) { GS = {} }
  GS.a = GS.a || {}; ["notes", "rooms", "locks", "gears"].forEach(k => { if (!Array.isArray(GS[k])) GS[k] = [] }); GS.deaths = GS.deaths || 0; GS.turns = GS.turns || 0;
  function save() { try { GS.aI = { n: AK().length, t: AK().filter(k => GS.a[k]).map(k => L.A[k][0]) } } catch (e) {} try { localStorage.setItem(SK, JSON.stringify(GS)) } catch (e) { } }
  const ROOMS5 = ["dark", "clock", "sos", "curse"].concat((o.rd || 1) >= 23 ? ["crypt"] : []), LOCKS3 = 3, NOTES_N = 8;
  function addTo(k, v) { if (GS[k].indexOf(v) >= 0) return false; GS[k].push(v); save(); checkAch(); return true }
  const SECRET_A = { taken: 1, sos: 1, curse: 1, mask: 1, shadow: 1, peek: 1, woman: 1, crypt: 1, hide: 1, lid: 1 };
  // чего этому читателю не достать: без пугалок нет женщины, глаз за дверью и погони, склеп — только с 23 серии
  const NO_A = k => (noScare && (k === "woman" || k === "peek" || k === "hide")) || ((k === "crypt" || k === "lid" || k === "mask") && (o.rd || 1) < 23); const AK = () => Object.keys(L.A).filter(k => !NO_A(k) || GS.a[k]);
  const jb = root.querySelector(".tw-jb"), achQ = []; let achBusy = false;
  // морозник: пять лепестков, жёлто-зелёная серединка — значок ачивки; полый — пока не получена
  const HEL = (on) => '<svg class="tw-hel' + (on ? ' on' : '') + '" viewBox="-12 -12 24 24">' + [0, 72, 144, 216, 288].map(a => '<ellipse rx="4.6" ry="6.4" cy="-5.2" transform="rotate(' + a + ')"/>').join("") + '<circle class="c" r="2.6"/>' + (on ? [20, 60, 100, 140, 180, 220, 260, 300, 340].map(a => '<circle class="s" r=".7" cy="-3.6" transform="rotate(' + a + ')"/>').join("") : "") + '</svg>';
  function ach(id, quiet) { if (GS.a[id]) return; GS.a[id] = Date.now(); save(); if (quiet) return; achQ.push(id); jb.classList.add("new"); if (!achBusy) achNext() }
  function achNext() { const id = achQ.shift(); if (!id || !alive) { achBusy = false; return } achBusy = true; const el = document.createElement("div"); el.className = "tw-ach"; el.innerHTML = '<i>' + HEL(1) + '</i><span><small>' + L.ach + '</small><b></b></span>'; el.querySelector("b").textContent = L.A[id][0]; root.appendChild(el);
    chime(); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("on"))); setTimeout(() => { el.classList.remove("on"); setTimeout(() => { el.remove(); achNext() }, 450) }, 3200) }
  function checkAch() { if (GS.notes.length >= NOTES_N) ach("notes"); if (GS.locks.length >= LOCKS3) ach("knock"); if (ROOMS5.every(k => GS.rooms.indexOf(k) >= 0)) ach("rooms") }
  SECRETS.forEach(k => { if (got[k]) ach(k, true) });
  function journal(tab) { if (uiOpen) return; uiOpen = true; click(); sfx("paper", .6); jb.classList.remove("new"); const box = document.createElement("div"); box.className = "tw-dial tw-jr";
    box.innerHTML = '<div class="tw-tabs"><button type="button" data-t="t">' + L.tTasks + '</button><button type="button" data-t="a">' + L.tAch + ' <span></span></button></div><ul class="tw-ls"></ul><p class="tw-st"></p><button type="button" class="tw-dx" aria-label="' + L.exit + '">✕</button>';
    const ul = box.querySelector(".tw-ls"), nA = AK().length, gotA = AK().filter(k => GS.a[k]).length; box.querySelector("[data-t=a] span").textContent = gotA + "/" + nA; box.querySelector(".tw-st").textContent = L.stats(GS.turns, GS.deaths);
    const row = (ok, icon, name, sub, prog) => { const li = document.createElement("li"); if (ok) li.className = "ok"; li.innerHTML = '<i>' + icon + '</i><span><b></b>' + (sub ? '<small></small>' : '') + '</span>' + (prog ? '<em>' + prog + '</em>' : ''); li.querySelector("b").textContent = name; if (sub) li.querySelector("small").textContent = sub; ul.appendChild(li) };
    function show(t) { ul.innerHTML = ""; box.querySelectorAll(".tw-tabs button").forEach(b => b.classList.toggle("on", b.dataset.t === t)); ul.scrollTop = 0;
      if (t === "t") { const nS = SECRETS.filter(k => got[k]).length, TK = L.tasks;
        [["climb", !!GS.climb], ["gears", GS.gears.length >= GN, GS.gears.length + "/" + GN], ["clock", !!(GS.clock || GS.a.clock)], ["top", !!GS.a.top], ["bell", !!GS.a.bell], ["exit", !!GS.a.exit], ["shadow", !!GS.key], ["notes", GS.notes.length >= NOTES_N, GS.notes.length + "/" + NOTES_N], ["knock", GS.locks.length >= LOCKS3, GS.locks.length + "/" + LOCKS3], ["rooms", ROOMS5.every(k => GS.rooms.indexOf(k) >= 0), ROOMS5.filter(k => GS.rooms.indexOf(k) >= 0).length + "/" + ROOMS5.length], ["secrets", nS >= 4, nS + "/4"]]
          .forEach(([k, ok, p]) => row(ok, ok ? "✓" : "○", TK[k], "", ok ? "" : p)) }
      else AK().forEach(k => { const ok = !!GS.a[k], hid = SECRET_A[k] && !ok; row(ok, HEL(ok), hid ? "???" : L.A[k][0], hid ? L.secretD : L.A[k][1]) }) }
    box.querySelectorAll(".tw-tabs button").forEach(b => b.onclick = () => { click(); show(b.dataset.t) }); show(tab || "t");
    root.appendChild(box); requestAnimationFrame(() => box.classList.add("on")); box.addEventListener("pointerdown", e => e.stopPropagation());
    box.querySelector(".tw-dx").onclick = () => { box.classList.remove("on"); setTimeout(() => box.remove(), 300); uiOpen = false } }
  jb.onclick = () => { audio(); journal() };

  /* ---------- renderer ---------- */
  // сглаживание канвы не нужно: кадр рисуется в буфер композитора, MSAA включаем там
  const r = new T.WebGLRenderer({ canvas: cvs, antialias: false, powerPreference: "high-performance" }); r.toneMapping = T.ACESFilmicToneMapping; r.toneMappingExposure = 1.35; r.outputColorSpace = T.SRGBColorSpace;
  r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
  const sc = new T.Scene(); sc.background = new T.Color(0x030306); sc.fog = new T.FogExp2(0x09080f, 0.034);
  const cam = new T.PerspectiveCamera(72, 1, 0.05, 200); sc.add(cam);
  const comp = new EffectComposer(r, new T.WebGLRenderTarget(2, 2, { type: T.HalfFloatType, samples: 2 })), rp = new RenderPass(sc, cam); comp.addPass(rp);
  const bloom = new UnrealBloomPass(new T.Vector2(256, 256), .42, .55, .9); comp.addPass(bloom);
  const grade = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uT: { value: 0 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float uT; varying vec2 vUv; void main(){ vec4 c=texture2D(tDiffuse,vUv); vec2 d=vUv-.5;" +
      // пересветы мягко гасим до тонмаппинга, чтобы цветы под фонариком и красная лампа не горели белым
      " float l=dot(c.rgb,vec3(.2126,.7152,.0722)); c.rgb*=1./(1.+max(l-1.4,0.)*.35);" +
      // раздельное тонирование: тени холодные сине-зелёные, света тёплые
      " float k=smoothstep(.02,.6,l); c.rgb*=mix(vec3(.9,.98,1.1),vec3(1.06,1.,.9),k);" +
      " float v=smoothstep(.9,.22,length(d*vec2(1.0,1.2))); c.rgb*=mix(.45,1.0,v); gl_FragColor=c; }" });
  // плёнка поверх готового кадра: зерно и лёгкое расслоение цвета по краям
  const film = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uT: { value: 0 }, uG: { value: .045 } },
    vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
    fragmentShader: "uniform sampler2D tDiffuse; uniform float uT,uG; varying vec2 vUv; float h(vec2 p){ p=fract(p*vec2(443.897,441.423)); p+=dot(p,p.yx+19.19); return fract((p.x+p.y)*p.x); }" +
      " void main(){ vec2 d=vUv-.5; float e=dot(d,d); vec2 o=d*e*.012; vec3 c=vec3(texture2D(tDiffuse,vUv+o).r, texture2D(tDiffuse,vUv).g, texture2D(tDiffuse,vUv-o).b);" +
      " float l=dot(c,vec3(.299,.587,.114)); float n=h(vUv*vec2(1013.,997.)+fract(uT*7.13))-.5; c+=n*uG*(.35+1.4*l*(1.-l)); gl_FragColor=vec4(c,1.); }" });
  comp.addPass(grade); comp.addPass(new OutputPass()); comp.addPass(film);
  let lowQ = false, dustM = null, moteM = null, flPY = 0, flPP = 0, flLX = 0, flLY = 0, flW = 0;
  // drs — динамическое разрешение: тормозит → кадр чуть меньше, отпустило → обратно
  let PRC = 1.25, drs = 1, drsOn = true, ftA = 1 / 60, ftT = 0;
  function msaa(n) { [comp.renderTarget1, comp.renderTarget2].forEach(x => { x.samples = n; x.dispose() }); size(); return n }
  function size() { const w = innerWidth, h = innerHeight, pr = Math.min(devicePixelRatio || 1, lowQ ? 1 : PRC) * drs; r.setPixelRatio(pr); r.setSize(w, h, false); comp.setPixelRatio(pr); comp.setSize(w, h); bloom.resolution.set(w / 2, h / 2); cam.aspect = w / h; cam.fov = w < h ? 74 : 62; cam.updateProjectionMatrix(); if (dustM) dustM.uniforms.uS.value = h * pr / 2; if (moteM) moteM.uniforms.uS.value = h * pr / 2 }
  size(); addEventListener("resize", size);

  /* ---------- helpers ---------- */
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  function cv(w, h, f) { const c = document.createElement("canvas"); c.width = w; c.height = h; f(c.getContext("2d"), w, h); const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t }
  const dotT = cv(32, 32, g => { const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, "#fff"); gr.addColorStop(1, "#0000"); g.fillStyle = gr; g.fillRect(0, 0, 32, 32) });
  const TAU = Math.PI * 2, angD = (a, b) => Math.abs(((a - b) % TAU + TAU * 1.5) % TAU - Math.PI);
  const V3 = (x, y, z) => new T.Vector3(x, y, z), rv = k => V3(rnd() - .5, rnd() - .5, rnd() - .5).multiplyScalar(k * 2);
  const TLs = new T.TextureLoader(), stx = (n, srgb, rx, ry) => { const t = TLs.load(n.indexOf("/") < 0 ? M(n) : n); if (srgb) t.colorSpace = T.SRGBColorSpace; t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; return t };

  /* ---------- геометрия башни и бесконечность ---------- */
  const R = 8, HT = 52, FLOOR = -0.5, EH = 1.65;
  const STEPS = 176, stepAt = i => { const a = i * 0.19 + 1.2; return { a, y: i * 0.27, x: Math.cos(a) * (R - 1.5), z: Math.sin(a) * (R - 1.5) } };
  // виток: 33 ступени (почти полный круг). Всё выше U повторяется с этим шагом, поэтому перенос на виток ниже незаметен
  const PER = 33, TURN = PER * .19, P = PER * .27, LP = 3, I0 = 45, Y0 = I0 * .27, U = Y0 - P, KS = [-1, 0, 1, 2, 3];
  const Tk = k => new T.Matrix4().makeTranslation(0, k * P, 0).multiply(new T.Matrix4().makeRotationY(-k * TURN));
  const inBand = i => i >= I0 && i < I0 + PER;
  const CA = Math.PI * 1.5, cx = Math.cos(CA) * (R - .3), cz = Math.sin(CA) * (R - .3), DW = 2.2, DH = 3.2, HW = DW / 2;
  // двери на лестнице (номер ступени внутри витка) и на полу (угол)
  const DS = [ // k: вид двери, g: знаки на табличке
    { i: 48, k: "sos", g: ["mouth", "morse"] }, { i: 53, k: "dark", g: ["sunx", "eye", "t4"] }, { i: 56, k: "mirror", g: ["eye", "eq", "eye"] },
    { i: 59, k: "curse", g: ["cross", "t1", "t2", "t3", "t4"] }, { i: 64, k: "portal", g: ["moon", "arch", "sun"], to: 8 }, { i: 67, k: "lock", g: ["wave", "cross"] },
    { i: 70, k: "lock", g: ["wave", "moon"] }, { i: 75, k: "loop", g: ["spiral", "arch", "spiral"] },
    { a: 5.15, k: "portal", g: ["sun", "arch", "moon"], to: 4 }, { a: 6.05, k: "clock", g: ["sun", "eq", "spiral"] }, { a: 3.42, k: "lock", g: ["flower", "cross", "moon"] }];
  const DWs = 1.3, DHs = 1.94;
  DS.forEach((d, n) => { d.n = n; if (d.i != null) { const s = stepAt(d.i); d.a = s.a; d.y = s.y + .13 } else d.y = FLOOR });
  const doorWall = [];  // зоны стены, занятые дверями: [a, y0, y1]
  DS.forEach(d => KS.forEach(k => { if (d.i == null && k) return; const a = d.a + (d.i != null ? k * TURN : 0), y = d.y + (d.i != null ? k * P : 0); if (y < STEPS * .27 - .8) doorWall.push([a, y - .35, y + DHs + 1.5]) }));
  const nearDoors = (a, y) => doorWall.some(([da, y0, y1]) => y > y0 && y < y1 && angD(a, da) < .15);

  // камень стен и пола «сфотографирован» с модели Hyper3D (цвет + рельеф)
  const wallT = stx("wall_c.jpg", 1, 1, 1), wallN = stx("wall_n.jpg", 0, 1, 1);
  // карта зарослей: где зелень, где проступает камень. Над U она повторяется витками
  const MW = 256, MH = 512, MK = document.createElement("canvas"); MK.width = MW; MK.height = MH; { const g = MK.getContext("2d"); g.fillStyle = "rgb(165,165,165)"; g.fillRect(0, 0, MW, MH);
    const cy = y => (1 - (y - FLOOR) / HT) * MH, du = -TURN / TAU * MW;
    const blob = (x, y, rr, c) => { for (const ox of [-MW, 0, MW]) { const gr = g.createRadialGradient(x + ox, y, 0, x + ox, y, rr); gr.addColorStop(0, c); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x + ox - rr, y - rr, 2 * rr, 2 * rr) } };
    const B = []; for (let i = 0; i < 60; i++) B.push([rnd() * MW, Y0 + rnd() * P, 6 + rnd() * 18, "rgba(0,0,0,.9)"]); for (let i = 0; i < 50; i++) B.push([rnd() * MW, Y0 + rnd() * P, 8 + rnd() * 26, "rgba(255,255,255,.55)"]);
    for (let i = 0; i < 10; i++) blob(rnd() * MW, cy(FLOOR + rnd() * (U - FLOOR)), 6 + rnd() * 14, "rgba(0,0,0,.9)");
    KS.forEach(k => B.forEach(([x, y, rr, c]) => { const yy = y + k * P; if (yy < HT + 4 && yy > U - 4) blob(((x - k * du) % MW + MW) % MW, cy(yy), rr, c) })) }
  const MKd = MK.getContext("2d").getImageData(0, 0, MW, MH).data;
  const maskAt = (a, y) => { const u = (((Math.PI / 2 - a) / TAU) % 1 + 1) % 1, v = 1 - (y - FLOOR) / HT; return MKd[((Math.max(0, Math.min(MH - 1, v * MH | 0))) * MW + Math.min(MW - 1, u * MW | 0)) * 4] / 255 };
  const maskT = new T.CanvasTexture(MK); maskT.wrapS = T.RepeatWrapping;
  const folT = cv(512, 512, (g) => { const at = (x, y, f) => { for (const ox of [-512, 0, 512]) for (const oy of [-512, 0, 512]) { if (x + ox < -60 || x + ox > 572 || y + oy < -60 || y + oy > 572) continue; g.save(); g.translate(x + ox, y + oy); f(); g.restore() } };
    const leaf = () => { const x = rnd() * 512, y = rnd() * 512, sz = 14 + rnd() * 26, ro = rnd() * TAU, v = .55 + rnd() * .55; at(x, y, () => { g.rotate(ro); const Lf = () => { g.beginPath(); g.moveTo(0, -sz); g.quadraticCurveTo(sz * .55, -sz * .15, 0, sz * .65); g.quadraticCurveTo(-sz * .55, -sz * .15, 0, -sz) };
      g.save(); g.translate(2, 3); Lf(); g.fillStyle = "rgba(0,0,0,.35)"; g.fill(); g.restore(); Lf(); g.fillStyle = `rgb(${22 * v | 0},${44 * v | 0},${28 * v | 0})`; g.fill(); g.strokeStyle = "rgba(130,170,110,.25)"; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -sz * .85); g.lineTo(0, sz * .5); g.stroke() }) };
    const bl = () => { const x = rnd() * 512, y = rnd() * 512, sz = 8 + rnd() * 8, q = rnd(), col = q < .5 ? [92, 54, 186] : q < .8 ? [130, 62, 196] : [64, 38, 140]; at(x, y, () => { g.fillStyle = "rgba(0,0,0,.3)"; g.beginPath(); g.arc(1.5, 2.5, sz * 1.25, 0, TAU); g.fill();
      for (let k = 0; k < 5; k++) { const an = k / 5 * TAU + x; g.fillStyle = `rgb(${col[0] + rnd() * 30 | 0},${col[1]},${col[2] + rnd() * 25 | 0})`; g.beginPath(); g.arc(Math.cos(an) * sz * .55, Math.sin(an) * sz * .55, sz * .6, 0, TAU); g.fill() } g.fillStyle = "#e8dcf0"; g.beginPath(); g.arc(0, 0, sz * .25, 0, TAU); g.fill() }) };
    for (let i = 0; i < 760; i++) leaf(); for (let i = 0; i < 40; i++) bl(); for (let i = 0; i < 360; i++) leaf(); for (let i = 0; i < 18; i++) bl() });
  const overgrow = (sh, mk) => { sh.uniforms.uMask = { value: maskT }; sh.uniforms.uFol = { value: folT }; sh.uniforms.uGlow = { value: 0 };
    sh.vertexShader = "varying vec2 vU0;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vU0=uv;");
    sh.fragmentShader = "uniform sampler2D uMask,uFol; uniform float uGlow; varying vec2 vU0; float gMk; vec4 gFo; vec2 gUvS;\n" + sh.fragmentShader
      .replace("#include <map_fragment>", "#include <map_fragment>\n " + mk + " diffuseColor.rgb=mix(diffuseColor.rgb,gFo.rgb*1.15,gMk);")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n totalEmissiveRadiance+=gFo.rgb*vec3(.6,.4,1.)*step(gFo.g*1.4,gFo.b)*gMk*uGlow;");
    return sh };
  const f4 = x => x.toFixed(5);
  const wallM = new T.MeshStandardMaterial({ map: wallT, normalMap: wallN, normalScale: new T.Vector2(1.3, 1.3), color: 0xc8c2d6, side: T.BackSide, roughness: .92 });
  // узор камня и листвы подобран так, что виток ниже выглядит точь-в-точь как этот (сдвиг 28 плиток по кругу, 7 рядов по высоте)
  wallM.onBeforeCompile = sh => {
    overgrow(sh, "gFo=texture2D(uFol,vec2(vU0.x*56.-.01324*vWP.y, vWP.y*10./" + f4(P) + ")); gMk=smoothstep(.42,.6,texture2D(uMask,vU0).r+(gFo.a-.5)*.25)*gFo.a;"); wallM.userData.sh = sh;
    sh.vertexShader = "varying vec3 vWP;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\n vWP=(modelMatrix*vec4(transformed,1.0)).xyz;");
    sh.fragmentShader = "varying vec3 vWP;\nfloat gWet=0.;\n" + sh.fragmentShader
      .replace("#include <map_fragment>", "diffuseColor *= texture2D( map, gUvS ); { float an=atan(vWP.x,vWP.z)-" + f4(TAU * .00662 / 28) + "*vWP.y, yy=vWP.y*" + f4(TAU / P) + ";" +
        " float n1=sin(an*3.+yy)*.5+sin(an*7.-yy*2.+1.3)*.3+sin(an*13.+yy*3.+2.1)*.2; float damp=smoothstep(.15,.75,n1);" +
        " float stk=pow(abs(sin(an*41.+sin(an*6.)*1.5)),40.)*smoothstep(-.2,.7,sin(yy*2.+an*5.));" +
        " diffuseColor.rgb*=mix(1.,.7,damp*.8)*(1.-stk*.4); diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.8,.97,.72),damp*.5); gWet=max(damp*.8,stk); }")
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\n roughnessFactor=mix(roughnessFactor,.36,gWet*.75);")
      .replace("#include <normal_fragment_maps>", "vec3 mapN = texture2D( normalMap, gUvS ).xyz * 2.0 - 1.0; mapN.xy *= normalScale; normal = normalize( tbn * mapN );")
      .replace("void main() {", "void main() { gUvS=vec2(vU0.x*28.-.00662*vWP.y, vWP.y*7./" + f4(P) + "); { vec2 q=vWP.xz; float lat=dot(q,vec2(" + f4(-Math.sin(CA)) + "," + f4(Math.cos(CA)) + ")), yy=vWP.y-(" + f4(FLOOR) + "), rr=" + f4(HW + .02) + "; if(dot(q,vec2(" + f4(Math.cos(CA)) + "," + f4(Math.sin(CA)) + "))>6.0 && abs(lat)<rr && yy<" + f4(DH) + " && (yy<" + f4(DH - HW) + " || length(vec2(lat,yy-(" + f4(DH - HW) + ")))<rr)) discard; }");
  };
  const wall = new T.Mesh(new T.CylinderGeometry(R, R, HT, 64, 1, true), wallM);
  wall.position.y = HT / 2 + FLOOR; wall.receiveShadow = true; sc.add(wall);
  const COL = []; // препятствия на полу: {x, z, r}
  const floorT = stx("floor_c.jpg", 1, 9, 9), floorN = stx("floor_n.jpg", 0, 9, 9);
  const floor = new T.Mesh(new T.CircleGeometry(R, 64), new T.MeshStandardMaterial({ map: floorT, normalMap: floorN, normalScale: new T.Vector2(1.2, 1.2), color: 0xbcb8c8, roughness: .8, metalness: .05 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR; floor.receiveShadow = true; sc.add(floor);
  floor.material.onBeforeCompile = sh => { floor.material.userData.sh = overgrow(sh, "gFo=texture2D(uFol,vU0*12.); float fr=length(vU0-.5)*" + (2 * R).toFixed(1) + "; gMk=smoothstep(4.7,6.3,fr+(texture2D(uMask,vU0*2.).r-.6)*2.5+(gFo.a-.5)*.6)*gFo.a*smoothstep(2.4,3.8,length((vU0-vec2(.5,.98))*16.));") };
  const stepM = new T.MeshStandardMaterial({ map: stx("wall_c.jpg", 1, 1, 1), normalMap: stx("wall_n.jpg", 0, 1, 1), color: 0xb0acbc, roughness: .9 });
  const stepBox = new T.InstancedMesh(new T.BoxGeometry(2.6, .22, 1.1), stepM, STEPS + 1); { const o3 = new T.Object3D(); for (let i = -1; i < STEPS; i++) { const p = stepAt(i); o3.position.set(p.x, p.y, p.z); o3.rotation.set(0, -p.a, 0); o3.updateMatrix(); stepBox.setMatrixAt(i + 1, o3.matrix);
    const q = ((i % PER) + PER) % PER, h1 = Math.sin(q * 12.9898) * 43758.5453, v = h1 - Math.floor(h1), h2 = Math.sin(q * 78.233) * 12345.678, g2 = h2 - Math.floor(h2);
    stepBox.setColorAt(i + 1, new T.Color(.84 + v * .26, .84 + v * .26 + g2 * .05, .84 + v * .24 - g2 * .04)) } sc.add(stepBox) }
  const inStep = (a, y, pad) => { const i0 = Math.round(y / .27); for (let i = i0 - 1; i <= i0 + 1; i++) { if (i < -1 || i >= STEPS) continue; const p = stepAt(i); if (Math.abs(y - p.y) < .22 + (pad || 0) && angD(a, p.a) < .1 + (pad || 0) * .1) return true } return false };
  function arch(w, h) { const s = new T.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0); return s }
  const ARCH = []; // заложенные арки внизу убраны
  const nearArch = (a, y) => ARCH.some(([aa, yy]) => angD(a, aa) < .16 && y > yy + FLOOR - .1 && y < yy + FLOOR + 3.1);
  const nearDoorWall = (a, y) => angD(a, CA) < .36 && y < DH + 1.5 + FLOOR;
  const nearDoorFloor = (a, rr) => angD(a, CA) < .6 && rr > R - 3.4;
  const busyWall = (a, y) => nearDoorWall(a, y) || nearArch(a, y) || nearDoors(a, y);

  /* ---------- выход: дверь с табличкой, за ней коридор и рассвет ---------- */
  const TH = Math.atan2(-cx, -cz);
  const frame = new T.Group(); frame.position.set(cx, FLOOR, cz); frame.rotation.y = TH; sc.add(frame);
  frame.add(new T.Mesh(new T.TorusGeometry(HW + .1, .16, 8, 32, Math.PI), stepM).translateY(DH - HW));
  [-1, 1].forEach(sg => frame.add(new T.Mesh(new T.BoxGeometry(.32, DH - HW, .36), stepM).translateX(sg * (HW + .1)).translateY((DH - HW) / 2)));
  const tunM = new T.MeshStandardMaterial({ map: stx("wall_c.jpg", 1, .45, .45), normalMap: stx("wall_n.jpg", 0, .45, .45), color: 0xb8aa9c, roughness: .9, side: T.BackSide });
  const tun = new T.Mesh(new T.ExtrudeGeometry(arch(DW, DH), { depth: 4.2, bevelEnabled: false }), [new T.MeshBasicMaterial({ visible: false }), tunM]); tun.position.z = -4.2; frame.add(tun);
  const dawnM = new T.MeshBasicMaterial({ color: new T.Color(1.3, 1.0, .68), fog: false });
  const dawn = new T.Mesh(new T.ShapeGeometry(arch(DW, DH)), dawnM); dawn.position.z = -4.1; frame.add(dawn);
  const tunL = new T.PointLight(0xffc98a, 0, 7, 1.4); tunL.position.set(0, 1.8, -3.3); frame.add(tunL);
  const doorS = new T.SpotLight(0xffc580, 0, 18, .5, .9, 1.3); doorS.position.set(0, 2.5, -2.8); doorS.target.position.set(0, 0, 4.2); frame.add(doorS, doorS.target);
  const shaftG = new T.BoxGeometry(1, 1, 1, 2, 2, 6); { const pa = shaftG.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i) + .5, t = pa.getZ(i) + .5; pa.setXYZ(i, x * 2 * (HW - .08 + .55 * t), (1 - t) * (.02 + y * (DH - .3)) + t * (-1.9 + y * 3.7), .1 + t * 6.5) } shaftG.computeVertexNormals() }
  const shaftM = new T.ShaderMaterial({ uniforms: { uI: { value: 0 }, uT: { value: 0 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    vertexShader: "varying vec3 vN,vV,vL; void main(){ vL=position; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }",
    fragmentShader: "uniform float uI,uT; varying vec3 vN,vV,vL; void main(){ float f=pow(abs(dot(normalize(vN),normalize(vV))),2.2); float a=clamp((vL.z-.1)/6.5,0.,1.); float fade=(1.-a)*(1.-a)*(1.-a)*smoothstep(0.,.2,a); float n=.72+.28*sin(vL.x*2.7+uT*.35)*sin(vL.y*1.9-uT*.25+vL.z); gl_FragColor=vec4(vec3(1.,.78,.5)*uI*f*fade*n,1.); }" });
  const shaft = new T.Mesh(shaftG, shaftM); shaft.visible = false; frame.add(shaft);
  const hinge = new T.Group(); hinge.position.set(cx - Math.cos(TH) * HW, FLOOR, cz + Math.sin(TH) * HW); hinge.rotation.y = TH; sc.add(hinge);
  const woodT = cv(256, 512, (g, w, h) => { for (let x = 0; x < w; x += 64) { const v = 46 + rnd() * 18; g.fillStyle = `rgb(${v + 14},${v},${v - 10})`; g.fillRect(x, 0, 62, h); for (let i = 0; i < 90; i++) { g.strokeStyle = `rgba(20,10,5,${.15 + rnd() * .25})`; g.beginPath(); const yy = rnd() * h; g.moveTo(x + 2, yy); g.bezierCurveTo(x + 20, yy + 6, x + 40, yy - 6, x + 60, yy + rnd() * 8); g.stroke() } g.fillStyle = "rgba(0,0,0,.6)"; g.fillRect(x + 62, 0, 2, h) } });
  // свеча: оплывший воск с потёками и лужицей, фитиль, живое пламя (два слоя + синее основание + ореол), мерцает
  const tFlames = [], glF = new T.Vector3(), glP = new T.Vector3(); let glT = 0;
  function mkCandle(h, r, lit) { const g = new T.Group(), wm = new T.MeshStandardMaterial({ color: 0xa89c88, roughness: .62, emissive: 0xff8a3a, emissiveIntensity: lit ? .025 : 0 });
    const pts = [V3(0, 0, 0), V3(r * 1.04, 0, 0), V3(r * 1.02, h * .3, 0), V3(r, h * .85, 0), V3(r * .97, h, 0), V3(r * .78, h - .006, 0), V3(r * .35, h - .011, 0), V3(.001, h - .009, 0)].map(v => new T.Vector2(v.x, v.y));
    const body = new T.Mesh(new T.LatheGeometry(pts, 16), wm); body.scale.set(.96 + Math.random() * .08, 1, .96 + Math.random() * .08); body.castShadow = true; g.add(body);
    for (let k = 0; k < 3 + (Math.random() * 3 | 0); k++) { const a = Math.random() * TAU, len = h * (.15 + Math.random() * .45), d = new T.Mesh(new T.CapsuleGeometry(r * (.1 + Math.random() * .08), len, 3, 6), wm); d.position.set(Math.cos(a) * r * .98, h - len / 2 - .004, Math.sin(a) * r * .98); d.scale.set(1, 1, .6); d.rotation.y = -a; g.add(d) }
    const pool = new T.Mesh(new T.CylinderGeometry(r * 1.9, r * 2.1, .004, 14), wm); pool.scale.set(1 + Math.random() * .3, 1, .8 + Math.random() * .3); pool.position.y = .002; g.add(pool);
    const wick = new T.Mesh(new T.CylinderGeometry(.0015, .0018, .016, 4), new T.MeshBasicMaterial({ color: 0x120c08 })); wick.position.y = h - .002; wick.rotation.z = .25; g.add(wick);
    if (lit) { const fg = new T.Group(); fg.position.y = h + .004; g.add(fg); const fp = [[0, 0], [.009, .006], [.011, .016], [.008, .03], [.003, .048], [0, .058]].map(([x, y]) => new T.Vector2(x, y));
      const outer = new T.Mesh(new T.LatheGeometry(fp, 12), new T.MeshBasicMaterial({ color: new T.Color(1.3, .62, .2), transparent: true, opacity: .8, blending: T.AdditiveBlending, depthWrite: false })); fg.add(outer);
      const inner = new T.Mesh(new T.LatheGeometry(fp, 12), new T.MeshBasicMaterial({ color: new T.Color(1.9, 1.5, .9), transparent: true, opacity: .9, blending: T.AdditiveBlending, depthWrite: false })); inner.scale.set(.5, .62, .5); inner.position.y = .004; fg.add(inner);
      const blue = new T.Mesh(new T.SphereGeometry(.006, 8, 6), new T.MeshBasicMaterial({ color: new T.Color(.25, .4, 1.4), transparent: true, opacity: .45, blending: T.AdditiveBlending, depthWrite: false })); blue.scale.set(1, .6, 1); blue.position.y = .003; fg.add(blue);
      const halo = new T.Sprite(new T.SpriteMaterial({ map: dotT, color: 0xffb060, transparent: true, opacity: .35, blending: T.AdditiveBlending, depthWrite: false })); halo.scale.setScalar(.16); halo.position.y = h + .03; g.add(halo);
      tFlames.push({ fg, halo, ph: Math.random() * 9 }) } else { wick.material = new T.MeshBasicMaterial({ color: 0x050403 }); wick.scale.y = .7 }
    return g }
  // мебель: настоящее дерево — волокна с изгибами, сучки, потёртости и грязь; одна карта на цвет и рельеф (Math.random, чтобы не сдвинуть посев цветов)
  const woodR = cv(512, 1024, (g, w, h) => { g.fillStyle = "#6c5a4c"; g.fillRect(0, 0, w, h);
    for (let k = 0; k < 7; k++) { g.fillStyle = `rgba(${Math.random() < .5 ? "40,24,14" : "190,150,110"},${Math.random() * .12})`; g.fillRect(Math.random() * w, 0, 30 + Math.random() * 120, h) }
    const knots = []; for (let k = 0; k < 4; k++) knots.push([Math.random() * w, Math.random() * h, 8 + Math.random() * 16]);
    for (let k = 0; k < 420; k++) { const x = Math.random() * w, ph = Math.random() * 6.3, f = .004 + Math.random() * .01, am = 2 + Math.random() * 7, dk = Math.random() < .7;
      g.strokeStyle = dk ? `rgba(46,26,14,${.08 + Math.random() * .22})` : `rgba(210,170,130,${.05 + Math.random() * .12})`; g.lineWidth = .6 + Math.random() * 2.2; g.beginPath();
      for (let y = -10; y <= h + 10; y += 8) { let xx = x + Math.sin(y * f + ph) * am; knots.forEach(([kx, ky, kr]) => { const dy = y - ky, dx = xx - kx, d2 = Math.hypot(dx, dy * .45); if (d2 < kr * 4) xx += Math.sign(dx || 1) * (kr * 4 - d2) * .5 }); y < 0 ? g.moveTo(xx, y) : g.lineTo(xx, y) } g.stroke() }
    knots.forEach(([kx, ky, kr]) => { for (let r2 = kr; r2 > 1; r2 -= 2.2) { g.strokeStyle = `rgba(40,20,10,${.25 + (1 - r2 / kr) * .4})`; g.lineWidth = 1.4; g.beginPath(); g.ellipse(kx, ky, r2, r2 * 2.2, 0, 0, 6.3); g.stroke() } g.fillStyle = "rgba(30,15,8,.75)"; g.beginPath(); g.ellipse(kx, ky, kr * .3, kr * .7, 0, 0, 6.3); g.fill() });
    for (let k = 0; k < 90; k++) { g.strokeStyle = `rgba(225,195,160,${.08 + Math.random() * .18})`; g.lineWidth = .5 + Math.random(); g.beginPath(); const x = Math.random() * w, y = Math.random() * h, a = Math.random() * 6.3, l = 8 + Math.random() * 50; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke() }
    for (let k = 0; k < 40; k++) { const x = Math.random() * w, y = Math.random() * h, r2 = 15 + Math.random() * 60, q = g.createRadialGradient(x, y, 0, x, y, r2); q.addColorStop(0, "rgba(20,14,10,.42)"); q.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = q; g.fillRect(x - r2, y - r2, 2 * r2, 2 * r2) }
    g.fillStyle = "rgba(70,72,74,.12)"; g.fillRect(0, 0, w, h) });
  const woodMat = (c) => new T.MeshStandardMaterial({ map: woodR, bumpMap: woodR, bumpScale: 1.1, color: new T.Color(c).multiplyScalar(.78), roughness: .9 });
  // коробка с UV в метрах: волокна идут вдоль длинной стороны, у каждой доски свой кусок текстуры
  function woodBox(w, h, d) { const g = new T.BoxGeometry(w, h, d), p2 = g.attributes.position, n2 = g.attributes.normal, uv = g.attributes.uv, L3 = [w, h, d], lng = L3.indexOf(Math.max(w, h, d)), ou = Math.random() * 3, ov = Math.random() * 3;
    for (let i = 0; i < p2.count; i++) { const P3 = [p2.getX(i), p2.getY(i), p2.getZ(i)], N3 = [Math.abs(n2.getX(i)), Math.abs(n2.getY(i)), Math.abs(n2.getZ(i))], fa = N3.indexOf(Math.max(...N3)), ax = [0, 1, 2].filter(a => a !== fa), va = ax.indexOf(lng) >= 0 ? lng : ax[0], ua = ax.find(a => a !== va);
      uv.setXY(i, P3[ua] * .9 + ou, P3[va] * .45 + ov) } return g }
  const wPart = (grp, mat, w, h, d, x, y, z, rx, ry, rz) => { const m = new T.Mesh(woodBox(w, h, d), mat); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0); m.castShadow = true; m.receiveShadow = true; grp.add(m); return m };
  const wLeg = (grp, mat, x, z, h, t0, t1) => { const m = new T.Mesh(new T.CylinderGeometry(t1 || .022, t0 || .03, h, 4).rotateY(Math.PI / 4), mat); m.position.set(x, h / 2, z); m.castShadow = true; grp.add(m); return m };
  // стол: столешница из досок с зазорами, царга, сужающиеся ножки, перекладины
  function mkTable(mat, w, d, h) { const g = new T.Group(), n = Math.max(2, Math.round(d / .18)), bw = d / n;
    for (let k = 0; k < n; k++) wPart(g, mat, w, .045, bw - .004, 0, h - .022, -d / 2 + bw * (k + .5), 0, 0, (Math.random() - .5) * .006); wPart(g, mat, w - .02, .012, d - .02, 0, h - .051, 0);
    const ix = w / 2 - .09, iz = d / 2 - .09; wPart(g, mat, w - .16, .09, .025, 0, h - .1, iz); wPart(g, mat, w - .16, .09, .025, 0, h - .1, -iz); wPart(g, mat, .025, .09, d - .16, ix, h - .1, 0); wPart(g, mat, .025, .09, d - .16, -ix, h - .1, 0);
    [[ix, iz], [ix, -iz], [-ix, iz], [-ix, -iz]].forEach(([x, z]) => wLeg(g, mat, x, z, h - .045, .034, .024));
    wPart(g, mat, w - .2, .03, .02, 0, .16, iz); wPart(g, mat, w - .2, .03, .02, 0, .16, -iz); return g }
  // стул: сиденье, ножки, спинка из реек, перекладины
  function mkChair(mat) { const g = new T.Group(); wPart(g, mat, .44, .035, .42, 0, .45, 0);
    [[-.19, .18], [.19, .18]].forEach(([x, z]) => wLeg(g, mat, x, z, .44, .026, .02)); [[-.19, -.18], [.19, -.18]].forEach(([x, z]) => wLeg(g, mat, x, z, .98, .026, .018));
    [.6, .74, .88].forEach(y => wPart(g, mat, .36, y > .8 ? .07 : .04, .02, 0, y, -.18)); [.18, -.18].forEach(z => wPart(g, mat, .36, .022, .018, 0, .18, z)); [-.19, .19].forEach(x => wPart(g, mat, .018, .022, .34, x, .24, 0)); return g }
  // ящик из досок с щелями и угловыми брусками
  function mkCrate(mat, w, h, d) { const g = new T.Group(), n = 3, bh = h / n;
    for (let k = 0; k < n; k++) { const y = bh * (k + .5); wPart(g, mat, w, bh - .012, .018, 0, y, d / 2 - .009); wPart(g, mat, w, bh - .012, .018, 0, y, -d / 2 + .009); wPart(g, mat, .018, bh - .012, d - .036, w / 2 - .009, y, 0); wPart(g, mat, .018, bh - .012, d - .036, -w / 2 + .009, y, 0) }
    [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz]) => wPart(g, mat, .04, h, .04, sx * (w / 2 - .03), h / 2, sz * (d / 2 - .03)));
    for (let k = 0; k < 4; k++) wPart(g, mat, w, .018, d / 4 - .008, 0, h - .009, -d / 2 + d / 8 + k * d / 4); return g }
  // дверь «сфотографирована» с модели Hyper3D: цвет + рельеф на плоскости — выглядит как модель, а весит как картинка
  const dC = TLs.load(M("door_c.webp")); dC.colorSpace = T.SRGBColorSpace; dC.anisotropy = 8; const dN = TLs.load(M("door_n.jpg"));
  const bDoorM = new T.MeshStandardMaterial({ map: dC, normalMap: dN, alphaTest: .5, side: T.DoubleSide, roughness: .82, color: 0xd8d0dc });
  const doorM = new T.MeshStandardMaterial({ map: woodT, color: 0x3a2a20, roughness: .9 });
  const door = new T.Group(); hinge.add(door);
  { const fp = new T.Mesh(new T.PlaneGeometry(DW, DH).translate(HW, DH / 2, .17), bDoorM), bp = new T.Mesh(new T.PlaneGeometry(DW, DH).translate(HW, DH / 2, .05), bDoorM), core = new T.Mesh(new T.BoxGeometry(DW - .5, DH - .9, .11).translate(HW, (DH - .9) / 2 + .05, .11), doorM); [fp, bp, core].forEach(m => { m.castShadow = true; door.add(m) }) }
  const plaqueT = TLs.load(M("plaque.jpg")); plaqueT.colorSpace = T.SRGBColorSpace;
  const plaqueM = new T.MeshStandardMaterial({ map: plaqueT, roughness: .8, emissive: 0x000000, emissiveMap: plaqueT }), sideM = new T.MeshStandardMaterial({ color: 0x3a2618, roughness: .9 });
  const plaque = new T.Mesh(new T.BoxGeometry(1.6, 1.0, .08), [sideM, sideM, sideM, sideM, plaqueM, sideM]); plaque.position.set(0, DH + .75, .2); frame.add(plaque);
  const keyL = new T.PointLight(0xffc870, 1.6, 5, 2); keyL.position.set(0, DH + .4, 1.1); frame.add(keyL);
  const pick = new T.Mesh(new T.BoxGeometry(2.6, DH + 1.6, .6), new T.MeshBasicMaterial({ visible: false })); pick.position.set(0, (DH + 1.6) / 2, .3); frame.add(pick);
  const STACKS = [[.35, 1], [2.9, .8], [3.95, 1.2]]; STACKS.forEach(([a, k]) => COL.push({ x: Math.cos(a) * (R - 1.4), z: Math.sin(a) * (R - 1.4), r: .85 * k }));

  /* ---------- свет ---------- */
  const moon = new T.DirectionalLight(0x9aa4d4, .9); moon.position.set(0, 10, 3); sc.add(moon, moon.target); // ровный, одинаковый на любой высоте
  sc.add(new T.AmbientLight(0x3c3a52, 2.3)); sc.add(new T.HemisphereLight(0x64628a, 0x100e16, 1.3));
  const mistT = cv(256, 256, (g, w, h) => { for (let i = 0; i < 26; i++) { const x = rnd() * w, y = h * .3 + rnd() * h * .4, rr = 30 + rnd() * 70, gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, "rgba(200,196,225,.16)"); gr.addColorStop(1, "rgba(200,196,225,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h) } });
  const mists = []; for (let i = 0; i < 9; i++) { const m = new T.Mesh(new T.PlaneGeometry(9, 4), new T.MeshBasicMaterial({ map: mistT, transparent: true, opacity: .03, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide }));
    m.rotation.x = -Math.PI / 2 + (rnd() - .5) * .2; m.position.set((rnd() - .5) * 8, FLOOR + .15 + rnd() * .5, (rnd() - .5) * 8); m.rotation.z = rnd() * 6.28; m.userData.s = (rnd() - .5) * .05; sc.add(m); mists.push(m) }
  // фонарик: рисунок луча и редкие перебои
  // пятно фонарика считаем по пикселям сами: Safari на iPhone подмешивает к градиентам canvas цветной шум, и он светился точками на полу
  const flMap = (() => { const w = 256, c = w / 2, ST = [[0, 0xfffaf2], [.1, 0xfff4e0], [.2, 0xd8ccb4], [.27, 0xefe2c8], [.33, 0xb4a892], [.5, 0x8a8070], [.7, 0x55504a], [.86, 0x1e1c1a], [1, 0]].map(([q, h]) => [q, h >> 16 & 255, h >> 8 & 255, h & 255]);
    const rings = [], blots = []; for (let i = 0; i < 7; i++) { const al = .035 + rnd() * .03, lw = 2 + rnd() * 3, x = c + (rnd() - .5) * 4, y = c + (rnd() - .5) * 4; rings.push([x, y, c * (.36 + i * .07), lw, al]) }
    for (let i = 0; i < 40; i++) { const x = c + (rnd() - .5) * c * 1.2, y = c + (rnd() - .5) * c * 1.2, rr = 6 + rnd() * 18, al = .05 + rnd() * .07; blots.push([x, y, rr, al]) }
    const d = new Uint8Array(w * w * 4);
    for (let y = 0; y < w; y++) for (let x = 0; x < w; x++) { const px0 = x + .5, py0 = y + .5, t = Math.min(1, Math.hypot(px0 - c, py0 - c) / c); let k = 1; while (k < ST.length - 1 && ST[k][0] < t) k++; const A = ST[k - 1], B = ST[k], f = (t - A[0]) / (B[0] - A[0] || 1);
      let r = A[1] + (B[1] - A[1]) * f, g = A[2] + (B[2] - A[2]) * f, b = A[3] + (B[3] - A[3]) * f;
      rings.forEach(([rx, ry, rad, lw, al]) => { const dd = Math.abs(Math.hypot(px0 - rx, py0 - ry) - rad), a = al * Math.max(0, 1 - dd / (lw / 2 + .5)); r += (255 - r) * a; g += (236 - g) * a; b += (200 - b) * a });
      blots.forEach(([bx, by, rr, al]) => { const dd = Math.hypot(px0 - bx, py0 - by); if (dd < rr) { const a = al * (1 - dd / rr); r *= 1 - a; g *= 1 - a; b *= 1 - a } });
      const o = (y * w + x) * 4; d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255 }
    const tx = new T.DataTexture(d, w, w); tx.colorSpace = T.SRGBColorSpace; tx.magFilter = T.LinearFilter; tx.minFilter = T.LinearMipmapLinearFilter; tx.generateMipmaps = true; tx.needsUpdate = true; return tx })();
  flMap.wrapS = flMap.wrapT = T.ClampToEdgeWrapping;
  const FLI = 125, flRay = new T.Raycaster(), flD = new T.Vector3(); let flT = 0, flNear = 1, flNearS = 1;
  const fl = new T.SpotLight(0xfff0dc, FLI, 26, .5, .25, 1.3); fl.map = flMap; fl.castShadow = true; fl.shadow.mapSize.set(1024, 1024); fl.shadow.bias = -.0012; fl.shadow.normalBias = .06; fl.shadow.camera.near = .2; fl.shadow.camera.far = 20; fl.position.set(.22, -.2, .1); cam.add(fl); fl.target.position.set(0, -.15, -5); cam.add(fl.target);
  const ND = 1600, pg = new T.BufferGeometry(), PD = new Float32Array(ND * 3);
  for (let i = 0; i < ND; i++) { const a = rnd() * TAU, rr = Math.sqrt(rnd()) * R * .95; PD[i * 3] = Math.cos(a) * rr; PD[i * 3 + 1] = FLOOR + rnd() * 30; PD[i * 3 + 2] = Math.sin(a) * rr }
  pg.setAttribute("position", new T.BufferAttribute(PD, 3));
  dustM = new T.ShaderMaterial({ uniforms: { uMap: { value: dotT }, uCam: { value: new T.Vector3() }, uDir: { value: new T.Vector3() }, uOn: { value: 1 }, uDoor: { value: 0 }, uDI: { value: new T.Matrix4() }, uT: { value: 0 }, uS: { value: 400 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: "uniform vec3 uCam,uDir; uniform float uOn,uDoor,uT,uS; uniform mat4 uDI; varying float vA; void main(){ vec3 p=position; p.x+=sin(uT*.13+position.y*1.7)*.25; p.z+=cos(uT*.11+position.x*1.3)*.25; p.y+=sin(uT*.07+position.z)*.3;" +
      " vec3 dv=p-uCam; float dl=length(dv); float c=dot(dv/dl,uDir); float beam=uOn*smoothstep(.87,.97,c)*smoothstep(13.,1.5,dl);" +
      " vec3 lp=(uDI*vec4(p,1.)).xyz; float door=uDoor*smoothstep(0.,.6,lp.z)*smoothstep(6.5,1.,lp.z)*smoothstep(1.2+.55*lp.z/6.5,.8,abs(lp.x))*smoothstep(-2.,.2,lp.y+.3*lp.z)*smoothstep(3.5,2.6,lp.y+.3*lp.z);" +
      " vA=.04+beam*.7+door*1.2; vec4 mv=modelViewMatrix*vec4(p,1.); gl_PointSize=clamp(.009*uS/-mv.z,1.,6.); gl_Position=projectionMatrix*mv; }",
    fragmentShader: "uniform sampler2D uMap; varying float vA; void main(){ float a=texture2D(uMap,gl_PointCoord).a; gl_FragColor=vec4(vec3(1.,.93,.82)*a*vA,1.); }" });
  const dust = new T.Points(pg, dustM); dust.frustumCulled = false; sc.add(dust); size();

  /* ---------- лунный свет сверху: тонкие лучи из щелей в потолке через весь колодец ---------- */
  // лучи строго вертикальные и одинаковые по высоте, поэтому повтор лестницы их не выдаёт
  const BEAMS = [[.7, -1.1, .42], [-1.6, .6, .28], [2.1, 1.9, .5], [-.6, 2.8, .22], [1.5, -3.0, .34]];
  const CEIL = STEPS * .27 + 2.0, BH = CEIL - FLOOR, beamM = new T.ShaderMaterial({ uniforms: { uT: { value: 0 }, uI: { value: .032 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
    vertexShader: "varying float vWY,vD; varying vec3 vN,vV; void main(){ vec4 wp=modelMatrix*vec4(position,1.); vWY=wp.y; vN=normalize(mat3(modelMatrix)*normal); vV=cameraPosition-wp.xyz; vD=length(vV); gl_Position=projectionMatrix*viewMatrix*wp; }",
    fragmentShader: "uniform float uT,uI; varying float vWY,vD; varying vec3 vN,vV; void main(){ float f=abs(dot(normalize(vN),normalize(vV))); float yy=vWY*" + f4(TAU / P) + "; float n=.7+.18*sin(yy*3.+uT*.25)+.12*sin(yy*7.-uT*.4);" +
      " float a=uI*pow(f,3.)*n*exp(-vD*.045)*smoothstep(" + f4(FLOOR) + "," + f4(FLOOR + 1.5) + ",vWY); gl_FragColor=vec4(vec3(.58,.7,1.)*a,1.); }" });
  const motePos = [], moteB = []; BEAMS.forEach(([x, z, w]) => { for (let i = 0; i < 70; i++) { const an = Math.random() * TAU, rr = Math.sqrt(Math.random()) * (w + .06); motePos.push(x + Math.cos(an) * rr, Math.random() * 14, z + Math.sin(an) * rr) } });
  const moteG = new T.BufferGeometry(); moteG.setAttribute("position", new T.Float32BufferAttribute(motePos, 3));
  moteM = new T.ShaderMaterial({ uniforms: { uT: { value: 0 }, uMap: { value: dotT }, uS: { value: 400 }, uCY: { value: 0 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
    vertexShader: "uniform float uT,uS,uCY; varying float vA; void main(){ vec3 p=position; p.y=uCY-7.+mod(position.y-uCY-uT*.05,14.); p.x+=sin(uT*.21+position.y*2.1)*.04; p.z+=cos(uT*.17+position.y*1.7)*.04; vec4 mv=modelViewMatrix*vec4(p,1.); vA=exp(-length(mv.xyz)*.08)*smoothstep(7.,4.,abs(p.y-uCY)); gl_PointSize=clamp(.008*uS/-mv.z,1.,4.); gl_Position=projectionMatrix*mv; }",
    fragmentShader: "uniform sampler2D uMap; varying float vA; void main(){ float a=texture2D(uMap,gl_PointCoord).a; gl_FragColor=vec4(vec3(.78,.85,1.)*a*vA*.7,1.); }" });
  { const mt = new T.Points(moteG, moteM); mt.frustumCulled = false; sc.add(mt) }
  const crackM = new T.MeshBasicMaterial({ color: new T.Color(.5, .6, .95), fog: false }), spotT = cv(128, 128, (g) => { const q = g.createRadialGradient(64, 64, 0, 64, 64, 64); q.addColorStop(0, "rgba(255,255,255,.9)"); q.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = q; g.fillRect(0, 0, 128, 128) });
  const spotM = new T.MeshBasicMaterial({ map: spotT, color: new T.Color(.16, .2, .32), transparent: true, depthWrite: false, blending: T.AdditiveBlending });
  BEAMS.forEach(([x, z, w]) => { const bm = new T.Mesh(new T.CylinderGeometry(w * .55, w * 1.6, BH, 16, 1, true), beamM); bm.position.set(x, FLOOR + BH / 2, z); bm.frustumCulled = false; sc.add(bm);
    const ck = new T.Mesh(new T.PlaneGeometry(w * 1.1, w * .22), crackM); ck.rotation.set(Math.PI / 2, 0, Math.random() * 3); ck.position.set(x, CEIL - .03, z); sc.add(ck);
    const sp = new T.Mesh(new T.PlaneGeometry(w * 5, w * 5), spotM); sp.rotation.x = -Math.PI / 2; sp.position.set(x, FLOOR + .02, z); sc.add(sp) });
  size();

  /* ---------- морозник, листья, плющ, корни — настоящая 3D-геометрия ---------- */
  const petalT = cv(512, 256, (g) => {
    let gr = g.createLinearGradient(0, 256, 0, 0); [[0, "#34167e"], [.25, "#5a30cc"], [.6, "#9444e2"], [1, "#da6ae6"]].forEach(([s, c]) => gr.addColorStop(s, c)); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, "rgba(228,96,226,.42)"); gr.addColorStop(.3, "rgba(228,96,226,0)"); gr.addColorStop(.7, "rgba(228,96,226,0)"); gr.addColorStop(1, "rgba(228,96,226,.42)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, "rgba(34,6,70,.75)"); gr.addColorStop(.05, "rgba(34,6,70,0)"); gr.addColorStop(.95, "rgba(34,6,70,0)"); gr.addColorStop(1, "rgba(34,6,70,.75)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    gr = g.createLinearGradient(0, 0, 0, 40); gr.addColorStop(0, "rgba(60,10,90,.6)"); gr.addColorStop(1, "rgba(60,10,90,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 40);
    for (let i = 0; i < 15; i++) { const xe = 8 + i / 14 * 240 + (rnd() - .5) * 8; g.strokeStyle = `rgba(36,10,92,${.18 + rnd() * .14})`; g.lineWidth = 1 + rnd(); g.beginPath(); g.moveTo(128, 256); g.quadraticCurveTo(128 + (xe - 128) * .35, 150, xe, 4 + Math.abs(xe - 128) * .4); g.stroke() }
    for (let i = 0; i < 10; i++) { const xe = 20 + rnd() * 216; g.strokeStyle = "rgba(236,214,255,.07)"; g.lineWidth = 2; g.beginPath(); g.moveTo(128, 250); g.quadraticCurveTo(128 + (xe - 128) * .4, 140, xe, 20); g.stroke() }
    for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(30,4,60,${.25 + rnd() * .3})`; g.beginPath(); g.arc(98 + rnd() * 60, 200 + rnd() * 54, .8 + rnd() * 1.8, 0, TAU); g.fill() }
    g.clearRect(256, 0, 64, 256); g.fillStyle = "#f6effc"; g.fillRect(276, 40, 24, 216); g.fillStyle = "#ffd4f0"; g.beginPath(); g.ellipse(288, 30, 22, 28, 0, 0, TAU); g.fill(); g.fillStyle = "#f2a8de"; g.beginPath(); g.ellipse(288, 22, 14, 14, 0, 0, TAU); g.fill();
    gr = g.createRadialGradient(384, 64, 0, 384, 64, 64); gr.addColorStop(0, "#6a2a8c"); gr.addColorStop(.45, "#8a4aa8"); gr.addColorStop(.7, "#b0c070"); gr.addColorStop(1, "#5a2a90"); g.fillStyle = gr; g.fillRect(320, 0, 128, 128);
  });
  petalT.wrapS = petalT.wrapT = T.ClampToEdgeWrapping;
  const leafT = cv(512, 256, (g) => {
    g.clearRect(0, 0, 512, 256);
    g.save(); g.beginPath(); g.moveTo(128, 246); g.quadraticCurveTo(60, 250, 30, 200); g.quadraticCurveTo(6, 170, 22, 140); g.quadraticCurveTo(50, 120, 62, 100); g.quadraticCurveTo(70, 40, 128, 8); g.quadraticCurveTo(186, 40, 194, 100); g.quadraticCurveTo(206, 120, 234, 140); g.quadraticCurveTo(250, 170, 226, 200); g.quadraticCurveTo(196, 250, 128, 246); g.closePath(); g.clip();
    let gr = g.createLinearGradient(0, 256, 60, 0); gr.addColorStop(0, "#1a321c"); gr.addColorStop(1, "#365e32"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = "rgba(140,190,110,.55)"; g.lineWidth = 3; [[128, 12], [28, 150], [228, 150], [52, 205], [204, 205]].forEach(([x, y]) => { g.beginPath(); g.moveTo(128, 236); g.quadraticCurveTo((128 + x) / 2, (236 + y) / 2 + 12, x, y); g.stroke() });
    g.strokeStyle = "rgba(10,20,8,.6)"; g.lineWidth = 6; g.stroke(); g.restore();
    const lw = (y) => { const t = (252 - y) / 246; return 82 * Math.pow(Math.sin(Math.PI * Math.pow(t, .75)), .9) + 2 }, tooth = (y) => { const t = (252 - y) / 246; return t > .5 ? ((y / 6) % 2 ? 3 : -1) : 0 };
    const outline = () => { g.beginPath(); g.moveTo(384, 252); for (let y = 246; y >= 8; y -= 6) g.lineTo(384 + lw(y) + tooth(y), y); g.lineTo(384, 5); for (let y = 8; y <= 246; y += 6) g.lineTo(384 - lw(y) - tooth(y), y); g.closePath() };
    g.save(); outline(); g.clip();
    gr = g.createLinearGradient(300, 0, 468, 0); gr.addColorStop(0, "#16301a"); gr.addColorStop(.5, "#2e5a30"); gr.addColorStop(1, "#16301a"); g.fillStyle = gr; g.fillRect(256, 0, 256, 256);
    gr = g.createLinearGradient(0, 256, 0, 0); gr.addColorStop(0, "rgba(0,0,0,.3)"); gr.addColorStop(.5, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(120,160,90,.15)"); g.fillStyle = gr; g.fillRect(256, 0, 256, 256);
    g.strokeStyle = "rgba(140,180,110,.6)"; g.lineWidth = 2.5; g.beginPath(); g.moveTo(384, 252); g.lineTo(384, 8); g.stroke();
    g.strokeStyle = "rgba(110,150,90,.28)"; g.lineWidth = 1.4; for (let y = 226; y > 30; y -= 14) { [-1, 1].forEach(s => { g.beginPath(); g.moveTo(384, y); g.quadraticCurveTo(384 + s * 30, y - 12, 384 + s * lw(y - 30) * .9, y - 36); g.stroke() }) }
    g.strokeStyle = "rgba(8,20,8,.7)"; g.lineWidth = 3; outline(); g.stroke(); g.restore();
  });
  leafT.wrapS = leafT.wrapT = T.ClampToEdgeWrapping;
  function geo(pos, uv, idx) { const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); g.setAttribute("uv", new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g }
  function petalInto(pos, uv, idx, th, lift, L0, W0, US, NS) {
    US = US || [0, .28, .55, .76, .9, 1]; NS = NS || 3; const cU = .62, base = pos.length / 3, rc = Math.cos(th), rs = Math.sin(th);
    const hw = u => u > cU ? W0 * Math.sqrt(Math.max(0, 1 - ((u - cU) / (1 - cU)) ** 2)) : W0 * (.2 + .8 * Math.pow(Math.sin(u / cU * Math.PI / 2), .7));
    US.forEach(u => { for (let j = 0; j <= NS; j++) { const s = j / NS * 2 - 1, x = s * hw(u), rr = .02 + u * L0, y = .22 * Math.pow(u, 1.5) + .08 * s * s * u + lift - .03 * Math.max(0, u - .8) * 5;
      pos.push(rc * rr - rs * x, y, rs * rr + rc * x); uv.push((s * .5 + .5) * .5, u) } });
    for (let i = 0; i < US.length - 1; i++) for (let j = 0; j < NS; j++) { const a = base + i * (NS + 1) + j; idx.push(a, a + 1, a + NS + 2, a, a + NS + 2, a + NS + 1) }
  }
  const mkBloom = (lo) => { const pos = [], uv = [], idx = [];
    for (let k = 0; k < 5; k++) petalInto(pos, uv, idx, k / 5 * TAU + (k % 2) * .06, k * .007, .5, .3, lo ? [0, .45, .8, 1] : 0, lo ? 2 : 0);
    for (let m = 0; m < (lo ? 0 : 22); m++) { const ph = m / 22 * TAU + rnd() * .2, el = .45 + rnd() * .6, ln = .12 + rnd() * .09, d = [Math.cos(ph) * Math.cos(el), Math.sin(el), Math.sin(ph) * Math.cos(el)], sd = [-Math.sin(ph) * .02, 0, Math.cos(ph) * .02], s0 = [d[0] * .025, .04 + d[1] * .025, d[2] * .025], b = pos.length / 3;
      [[-1, 0], [1, 0], [1, 1], [-1, 1]].forEach(([q, t]) => { pos.push(s0[0] + d[0] * ln * t + sd[0] * q, s0[1] + d[1] * ln * t, s0[2] + d[2] * ln * t + sd[2] * q); uv.push(.5 + (q * .5 + .5) * .125, t) }); idx.push(b, b + 1, b + 2, b, b + 2, b + 3) }
    const c0 = pos.length / 3; pos.push(0, .075, 0); uv.push(.75, .75); for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; pos.push(Math.cos(a) * .06, .035, Math.sin(a) * .06); uv.push(.75 + Math.cos(a) * .11, .75 + Math.sin(a) * .22) } for (let i = 0; i < 10; i++) idx.push(c0, c0 + 1 + (i + 1) % 10, c0 + 1 + i);
    return geo(pos, uv, idx) }, bloomG = mkBloom(0), bloomLoG = mkBloom(1);
  const petalG = (() => { const pos = [], uv = [], idx = []; petalInto(pos, uv, idx, 0, 0, 1, .55); return geo(pos, uv, idx) })();
  const ivyG = (() => { const pos = [], uv = [], idx = []; for (let i = 0; i <= 2; i++) for (let j = 0; j <= 2; j++) { const x = j / 2 - .5, z = i / 2; pos.push(x, .14 * Math.abs(x) * 2 - .1 * z * z, z); uv.push((x + .5) * .5, z) } for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const a = i * 3 + j; idx.push(a, a + 1, a + 4, a, a + 4, a + 3) } return geo(pos, uv, idx) })();
  const helG = (() => { const pos = [], uv = [], idx = []; for (let k = 0; k < 5; k++) { const fa = (k / 4 - .5) * 2.1, ln = 1 - Math.abs(k - 2) * .12, ca = Math.cos(fa), sa = Math.sin(fa), b = pos.length / 3;
      for (let i = 0; i <= 4; i++) for (let j = 0; j <= 2; j++) { const z = i / 4, x = (j / 2 - .5) * .62, y = .1 * Math.abs(x) * 2 + .45 * z - .62 * z * z; const zz = z * ln, xx = x * ln; pos.push(xx * ca + zz * sa, y * ln + k * .002, -xx * sa + zz * ca); uv.push(.5 + (j / 2) * .5, z) }
      for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const a = b + i * 3 + j; idx.push(a, a + 1, a + 4, a, a + 4, a + 3) } } return geo(pos, uv, idx) })();
  const stemG = new T.CylinderGeometry(1, 1, 1, 5, 1, true).translate(0, .5, 0);
  const flowerMats = [];
  const bloomM = new T.MeshStandardMaterial({ map: petalT, alphaTest: .5, side: T.DoubleSide, roughness: .5, emissive: new T.Color(.55, .38, 1), emissiveMap: petalT, emissiveIntensity: .05 }); flowerMats.push(bloomM);
  const leafM = new T.MeshStandardMaterial({ map: leafT, alphaTest: .5, side: T.DoubleSide, roughness: .5 });
  const stemM = new T.MeshStandardMaterial({ color: 0x2c281c, roughness: .9 });
  // всё растительное собирается по секторам (по кругу и по высоте): невидимые секторы не рисуются, а близкие цветы — подробнее
  const flora = [], lods = [], SECT = 12, BAND = 7;
  function batch(g, mat, opt) { opt = opt || {}; const B = new Map();
    return { add(m, c) { const e = m.elements; if (e[13] > HT + FLOOR - .3) return; const a = (Math.atan2(e[14], e[12]) + TAU * 2) % TAU, key = ((a / TAU * SECT) | 0) + SECT * Math.max(0, Math.min(12, ((e[13] - FLOOR) / BAND) | 0)); let b = B.get(key); if (!b) B.set(key, b = { m: [], c: [] }); for (let k = 0; k < 16; k++) b.m.push(e[k]); b.c.push(c ? c.r : 1, c ? c.g : 1, c ? c.b : 1) },
      build() { B.forEach(b => { const n = b.m.length / 16, ord = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0, t = ord[i]; ord[i] = ord[j]; ord[j] = t }
        const im = new T.InstancedMesh(g, mat, n), A = im.instanceMatrix.array, C = new Float32Array(n * 3); ord.forEach((s, i) => { for (let k = 0; k < 16; k++) A[i * 16 + k] = b.m[s * 16 + k]; C[i * 3] = b.c[s * 3]; C[i * 3 + 1] = b.c[s * 3 + 1]; C[i * 3 + 2] = b.c[s * 3 + 2] });
        im.instanceColor = new T.InstancedBufferAttribute(C, 3); im.computeBoundingSphere(); im.castShadow = !!opt.cast; im.userData.n = n; sc.add(im); flora.push(im);
        if (opt.lo) { const lo = new T.InstancedMesh(opt.lo, mat, n); lo.instanceMatrix = im.instanceMatrix; lo.instanceColor = im.instanceColor; lo.boundingSphere = im.boundingSphere.clone(); lo.userData.n = n; sc.add(lo); flora.push(lo); lods.push([im, lo]) } }) } } }
  const BL = batch(bloomG, bloomM, { lo: bloomLoG }), PE = batch(petalG, bloomM), LF = batch(helG, leafM), IV = batch(ivyG, leafM), ST = batch(stemG, stemM);
  const _m = new T.Matrix4(), _x = new T.Vector3(), _y = new T.Vector3(), _z = new T.Vector3(), _c = new T.Color(), _mk = new T.Matrix4();
  function place(p, yDir, zHint, sx, sy, sz) { _y.copy(yDir).normalize(); _x.crossVectors(_y, zHint); if (_x.lengthSq() < 1e-6) _x.set(1, 0, 0).cross(_y); _x.normalize(); _z.crossVectors(_x, _y).normalize(); _m.makeBasis(_x.multiplyScalar(sx), _y.multiplyScalar(sy), _z.multiplyScalar(sz)); _m.setPosition(p); return _m }
  // «повторять витками»: то, что создано в исходном витке, ставится во все витки
  let REP = false; const TKs = KS.map(k => [k, Tk(k)]);
  function put(b, m, c) { if (!REP) return b.add(m, c); const cc = c ? c.clone() : null, mm = m.clone(); TKs.forEach(([k, t]) => b.add(_mk.multiplyMatrices(t, mm), cc)) }
  const inward = a => V3(-Math.cos(a), 0, -Math.sin(a));
  const onWall = (a, y, d) => V3(Math.cos(a) * (R - d), y, Math.sin(a) * (R - d));
  const bloomCol = () => { const q = rnd(); return q < .5 ? _c.setRGB(1, 1, 1) : q < .7 ? _c.setRGB(1.06, .88, 1.08) : q < .85 ? _c.setRGB(.82, .84, 1.08) : _c.setRGB(.62, .52, .72) };
  const leafCol = () => { const v = .65 + rnd() * .4; return _c.setRGB(v * (.9 + rnd() * .25), v, v * (.85 + rnd() * .2)) };
  function bloomAt(p, face, k) { put(BL, place(p, face, rv(1), k, k, k), bloomCol()) }
  const sm = (e0, e1, x) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t) };
  const wallOk = (a, y) => !busyWall(a, y) && !inStep(a, y, .05);
  // 1) ковры на стенах: внизу свои, выше — один виток, повторённый
  function carpet(N, y0, y1, pb) { for (let i = 0; i < N; i++) { const a = rnd() * TAU, y = y0 + rnd() * (y1 - y0); if (rnd() > sm(.4, .62, maskAt(a, y)) || !wallOk(a, y)) continue;
      if (rnd() < pb) bloomAt(onWall(a, y, .1 + rnd() * .16), inward(a).add(rv(.45)).add(V3(0, -.12, 0)), .17 + rnd() * .12);
      else { const k = .4 + rnd() * .28; put(LF, place(onWall(a, y, .05 + rnd() * .05), inward(a).add(rv(.35)), V3(0, -1, 0).add(rv(.9)), k, k * (1 + rnd()), k), leafCol()) } } }
  carpet(2300, FLOOR + .25, U, .5); REP = true; carpet(3300, Y0, Y0 + P, .58); REP = false;
  // 2) на ступенях у стены — кустики, лепестки
  const stepSrc = i => i < I0 - PER || inBand(i);
  function stepFlora(i) { const p = stepAt(i);
    if (i % 2) { const n = 1 + (rnd() * 2 | 0); for (let j = 0; j < n; j++) { const a = p.a + (rnd() - .5) * .08, rr = R - .45 - rnd() * .5, y = p.y + .12, b = V3(Math.cos(a) * rr, y, Math.sin(a) * rr), k = .3 + rnd() * .15;
      for (let q = 0; q < 2; q++) put(LF, place(b, V3(0, 1, 0).add(rv(.25)), rv(1), k, k * 1.6, k), leafCol());
      for (let q = 0; q < 2 + (rnd() * 3 | 0); q++) { const h = .08 + rnd() * .18, bp = b.clone().add(V3((rnd() - .5) * .25, h, (rnd() - .5) * .25)); put(ST, place(b, bp.clone().sub(b), V3(1, 0, 0), .006, bp.distanceTo(b), .006)); bloomAt(bp, inward(a).multiplyScalar(.6).add(V3(0, .5, 0)).add(rv(.4)), .14 + rnd() * .08) } } }
    for (let q = 0; q < 3; q++) { const a = p.a + (rnd() - .5) * .1, rr = R - 1.5 + (rnd() - .5) * 2.2, k = .07 + rnd() * .04; put(PE, place(V3(Math.cos(a) * rr, p.y + .125, Math.sin(a) * rr), V3(0, 1, 0), V3(Math.cos(rnd() * TAU), 0, Math.sin(rnd() * TAU)), k, k, k), bloomCol()) } }
  for (let i = -1; i < STEPS; i++) if (stepSrc(i)) { REP = inBand(i); stepFlora(i) } REP = false;
  // 3) кусты на полу вдоль стен
  for (let i = 0; i < 190; i++) { const a = rnd() * TAU, rr = R - .4 - Math.pow(rnd(), 1.3) * 2.6; if (nearDoorFloor(a, rr) || DS.some(d => d.i == null && angD(a, d.a) < .2 && rr > R - 2.2)) continue; const x = Math.cos(a) * rr, z = Math.sin(a) * rr; if (COL.some(c => Math.hypot(x - c.x, z - c.z) < c.r + .25)) continue;
    if ((Math.atan2(z, x) + TAU) % TAU > .9 && (Math.atan2(z, x) + TAU) % TAU < 3.4 && rr > R - 2.9) continue; // под нижними ступенями
    // у записки на полу кусты стояли плотным кольцом, и в нём можно было застрять: отодвигаем их от записки, а у стены и рядом с запиской кусты без столкновений
    let bx = x, bz = z; const NX = Math.cos(5.55) * (R - 1.7), NZ = Math.sin(5.55) * (R - 1.7), dn = Math.hypot(x - NX, z - NZ); if (dn < 1.1) { const k2 = 1.1 / Math.max(dn, .05); bx = NX + (x - NX) * k2; bz = NZ + (z - NZ) * k2; const r2 = Math.hypot(bx, bz); if (r2 > R - .4) { bx *= (R - .4) / r2; bz *= (R - .4) / r2 } }
    const b = V3(bx, FLOOR, bz), K = .7 + rnd() * .6; if (K > 1 && !(Math.hypot(bx, bz) > R - 2.2 || Math.hypot(bx - NX, bz - NZ) < 1.8)) COL.push({ x: bx, z: bz, r: .26 * K });
    for (let q = 0; q < 3; q++) { const k = (.42 + rnd() * .2) * K; LF.add(place(b, V3(0, 1, 0).add(rv(.3)), V3(Math.cos(q * 2.1 + rnd()), 0, Math.sin(q * 2.1 + rnd())), k, k * (2 + rnd()), k), leafCol()) }
    for (let q = 0; q < 3 + (rnd() * 5 | 0); q++) { const h = (.22 + rnd() * .3) * K, bp = b.clone().add(V3((rnd() - .5) * .45 * K, h, (rnd() - .5) * .45 * K)); ST.add(place(b, bp.clone().sub(b), V3(1, 0, 0), .007, bp.distanceTo(b), .007));
      const out = V3(bp.x - b.x, 0, bp.z - b.z).normalize().multiplyScalar(.7).add(inward(a).multiplyScalar(.5)).add(V3(0, .1 - rnd() * .5, 0)).add(rv(.25)); bloomAt(bp, out, .17 + rnd() * .1) } }
  for (let i = 0; i < 700; i++) { const a = rnd() * TAU, rr = R - .3 - Math.pow(rnd(), 1.5) * 4.5; if (nearDoorFloor(a, rr) && rnd() < .7) continue; const k = .07 + rnd() * .05;
    PE.add(place(V3(Math.cos(a) * rr, FLOOR + .006 + rnd() * .006, Math.sin(a) * rr), V3(0, 1, 0).add(rv(.15)), V3(Math.cos(rnd() * TAU), 0, Math.sin(rnd() * TAU)), k, k, k), bloomCol()) }
  // 4) плющ: свисает со ступеней, ползёт по стене от ступеней вниз, взбирается от пола
  const tubes = [];
  function tubeOut(g) { if (!REP) return tubes.push(g); TKs.forEach(([k, t]) => { const c = g.clone().applyMatrix4(t), bb = c.boundingBox || (c.computeBoundingBox(), c.boundingBox); if (bb.min.y < HT + FLOOR) tubes.push(c) }); g.dispose() }
  function vine(pts, rad, leafK, dens, wallA) {
    const cur = new T.CatmullRomCurve3(pts), Lc = cur.getLength(); if (Lc < .2) return;
    tubeOut(new T.TubeGeometry(cur, Math.max(3, Lc / .14 | 0), rad, 3, false));
    const n = Lc / dens | 0;
    for (let i = 0; i < n; i++) { const t = Math.min(1, (i + rnd() * .6) / n), p = cur.getPointAt(t), tg = cur.getTangentAt(t), k = leafK * (.6 + rnd() * .6) * (1 - .45 * t);
      let face, ext;
      if (wallA != null) { const a = Math.atan2(p.z, p.x); if (busyWall(a, p.y)) continue; face = inward(a).add(rv(.5)); ext = new T.Vector3().crossVectors(face, tg).multiplyScalar(i % 2 ? 1 : -1).add(V3(0, -.3, 0)).add(rv(.7)); p.addScaledVector(inward(a), .01 + rnd() * .03) }
      else { const h = V3(rnd() - .5, 0, rnd() - .5).normalize(); ext = h.clone().add(V3(0, -.25 + rnd() * .3, 0)); face = V3(0, 1, 0).add(rv(.5)) }
      put(IV, place(p, face, ext, k, k, k), leafCol()) } }
  function crawl(a, y, len, ps, depth, upw) { const pts = []; let aa = a, yy = y;
    for (let s = 0; s * .12 < len; s++) { pts.push(onWall(aa, yy, .03)); ps += (rnd() - .5) * .45; ps = Math.max(-1.2, Math.min(1.2, ps)); yy += (upw ? 1 : -1) * Math.cos(ps) * .12; aa += Math.sin(ps) * .12 / R;
      if (yy < FLOOR + .2 || yy > HT + FLOOR) break; if (busyWall(aa, yy) || (s > 4 && inStep(aa, yy))) break;
      if (depth < 2 && rnd() < .03) crawl(aa, yy, len * .5, ps + (rnd() < .5 ? .8 : -.8), depth + 1, upw) }
    if (pts.length > 2) vine(pts, .007, .15, .05, 1) }
  for (let i = 3; i < STEPS - 2; i++) { if (!stepSrc(i)) continue; REP = inBand(i); if (rnd() < .12) continue; const p = stepAt(i), ns = 2 + (rnd() * 3 | 0);
    for (let s = 0; s < ns; s++) { const a = p.a + (rnd() - .5) * .12, rr = R - 2.75 + rnd() * 1.6, top = p.y - .1, len = Math.min(.8 + Math.pow(rnd(), 1.4) * 7.5, top - FLOOR - .35); if (len < .5) continue;
      const A = V3(Math.cos(a) * rr, top, Math.sin(a) * rr), hd = V3(rnd() - .5, 0, rnd() - .5).normalize(), amp = .04 + rnd() * .15, ph = rnd() * 6, pts = [];
      for (let k = 0, n = Math.ceil(len / .3); k <= n; k++) { const t = k / n; pts.push(A.clone().add(V3(hd.x * Math.sin(t * 5 + ph) * amp * t, -t * len, hd.z * Math.sin(t * 5 + ph) * amp * t))) }
      vine(pts, .005 + rnd() * .004, .11, .06) }
    const a0 = p.a, rr0 = R - 2.7 + rnd() * .5; for (let q = 0; q < 7; q++) { const k = .08 + rnd() * .06; put(IV, place(V3(Math.cos(a0 + (rnd() - .5) * .14) * (rr0 + rnd() * .6), p.y + .06 + rnd() * .1, Math.sin(a0 + (rnd() - .5) * .14) * (rr0 + rnd() * .6)), V3(0, 1, 0).add(rv(.6)), rv(1), k, k, k), leafCol()) }
    if (i % 2 === 0) crawl(p.a + (rnd() - .5) * .06, p.y - .12, 2 + rnd() * 6, (rnd() - .5) * .6, 0, 0) }
  REP = false;
  for (let i = 0; i < 30; i++) { const a = rnd() * TAU; if (nearDoorWall(a, 0) || DS.some(d => d.i == null && angD(a, d.a) < .2)) continue; crawl(a, FLOOR + .2, 1.5 + rnd() * 2.2, (rnd() - .5) * .5, 1, 1) }
  // стебли тонкие: тень от них не видна, а куски по высоте отсекаются, когда не в кадре
  if (tubes.length) { const bk = {}; tubes.forEach(g => { if (!g.boundingBox) g.computeBoundingBox(); const k = Math.floor((g.boundingBox.min.y + g.boundingBox.max.y) / 2 / 5); (bk[k] = bk[k] || []).push(g) }); Object.values(bk).forEach(gs => { const vm = new T.Mesh(mergeGeometries(gs), stemM); vm.geometry.computeBoundingSphere(); sc.add(vm) }); tubes.forEach(g => g.dispose()) }
  // 5) толстые корни: сверху по стенам сквозь лестницу (форма повторяется витками), петлями между витками и по полу
  const barkT = cv(128, 256, (g, w, h) => { g.fillStyle = "#2e2620"; g.fillRect(0, 0, w, h); for (let i = 0; i < 46; i++) { const x = rnd() * w, v = rnd(); g.strokeStyle = v < .5 ? `rgba(10,6,4,${.4 + rnd() * .4})` : `rgba(120,104,88,${.12 + rnd() * .15})`; g.lineWidth = 1 + rnd() * 3; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 16) g.lineTo(x + Math.sin(y * .05 + i) * 4, y); g.stroke() } for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(${rnd() < .3 ? "60,80,40" : "0,0,0"},${.1 + rnd() * .2})`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 8, 2 + rnd() * 5) } });
  const rootM = new T.MeshStandardMaterial({ map: barkT, color: 0xa09088, roughness: .95 }), roots = [];
  function rootTube(pts, rad, rep) { const cur = new T.CatmullRomCurve3(pts), Lc = cur.getLength(), g = new T.TubeGeometry(cur, Math.max(4, Lc / .25 | 0), rad, 6, false), uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, uv.getX(i) * Lc / .7);
    if (rep) { TKs.forEach(([k, t]) => roots.push(g.clone().applyMatrix4(t))); g.dispose() } else roots.push(g);
    REP = !!rep; for (let i = 0, n = Lc / .35 | 0; i < n; i++) { const p = cur.getPointAt(rnd()), k = .1 + rnd() * .07; put(IV, place(p.add(rv(rad)), V3(0, 1, 0).add(rv(.8)), rv(1), k, k, k), leafCol()) } REP = false }
  const DRIFT = (TURN - TAU) / P; // чтобы корень совпал сам с собой через виток
  const doorAngles = DS.map(d => d.a);
  for (let i = 0; i < 14; i++) { let a0 = i / 14 * TAU + rnd() * .2; if (doorAngles.some(da => angD(a0, da) < .28) || angD(a0, CA) < .5) continue;
    const amp = .05 + rnd() * .08, ph = rnd() * 6, m1 = 1 + (rnd() * 2 | 0), rad = .06 + rnd() * .06, wl = y => Math.sin((y - Y0) / P * TAU * m1 + ph), A = y => a0 + DRIFT * (y - Y0) + amp * wl(y), D = y => .15 + .07 * Math.sin((y - Y0) / P * TAU * 2 + ph);
    const pts = []; for (let y = HT + FLOOR + 1; y > FLOOR + .25; y -= .45) pts.push(onWall(A(y), y, D(y)));
    const last = pts[pts.length - 1], aL = A(FLOOR + .3), d = inward(aL), sd = V3(-d.z, 0, d.x), L2 = 1 + rnd() * 2.4; for (let s = .3; s <= L2; s += .3) pts.push(V3(last.x + d.x * s + sd.x * Math.sin(s * 1.7 + ph) * .3, FLOOR + .03, last.z + d.z * s + sd.z * Math.sin(s * 1.7 + ph) * .3));
    rootTube(pts, rad, false) }
  for (let i = 0; i < 6; i++) { const i0 = I0 + (rnd() * (PER - 6) | 0), i1 = i0 + 4 + (rnd() * 5 | 0), p0 = stepAt(i0), p1 = stepAt(i1), r0 = R - 2.6, sag = 1 + rnd() * 1.6, A = V3(Math.cos(p0.a) * r0, p0.y - .1, Math.sin(p0.a) * r0), B = V3(Math.cos(p1.a) * r0, p1.y - .1, Math.sin(p1.a) * r0), pts = [];
    for (let k = 0; k <= 10; k++) { const t = k / 10, q = A.clone().lerp(B, t); q.y -= Math.sin(t * Math.PI) * sag; pts.push(q) } rootTube(pts, .035 + rnd() * .04, true) }
  for (let i = 0; i < 10; i++) { const a = rnd() * TAU; if (angD(a, CA) < .7 || DS.some(d => d.i == null && angD(a, d.a) < .3)) continue; const d = inward(a), sd = V3(-d.z, 0, d.x), L2 = 1.5 + rnd() * 2.5, ph = rnd() * 6, pts = [onWall(a, FLOOR + .5, .1)];
    for (let s = .25; s <= L2; s += .3) pts.push(V3(Math.cos(a) * (R - .15) + d.x * s + sd.x * Math.sin(s * 1.4 + ph) * .4, FLOOR + .02, Math.sin(a) * (R - .15) + d.z * s + sd.z * Math.sin(s * 1.4 + ph) * .4)); rootTube(pts, .04 + rnd() * .05, false) }
  { const rm = new T.Mesh(mergeGeometries(roots), rootM); rm.castShadow = rm.receiveShadow = true; sc.add(rm); roots.forEach(g => g.dispose()) }
  [BL, PE, LF, IV, ST].forEach(b => b.build());

  /* ---------- таблички со знаками (как на табличке над выходом в игре: солнце, «горка», спирали, зарубки) ---------- */
  const GL = {
    sun: (g, s) => { g.beginPath(); g.arc(0, 0, s * .42, 0, TAU); g.stroke(); g.beginPath(); g.arc(0, 0, s * .05, 0, TAU); g.stroke() },
    sunx: (g, s) => { GL.sun(g, s); g.beginPath(); g.moveTo(-s * .5, s * .5); g.lineTo(s * .5, -s * .5); g.stroke() },
    spiral: (g, s) => { g.beginPath(); for (let t = 0; t < 15; t += .2) { const rr = s * .03 * t; g.lineTo(Math.cos(t) * rr, Math.sin(t) * rr) } g.stroke() },
    arch: (g, s) => { g.beginPath(); g.moveTo(-s * .55, s * .25); g.lineTo(0, -s * .3); g.lineTo(s * .55, s * .25); g.stroke() },
    under: (g, s) => { g.beginPath(); g.moveTo(-s * .5, -s * .1); g.lineTo(s * .5, -s * .1); g.stroke(); g.beginPath(); g.arc(0, s * .05, s * .3, 0, Math.PI); g.stroke() },
    moon: (g, s) => { g.beginPath(); g.arc(0, 0, s * .42, Math.PI * .35, Math.PI * 1.65); g.quadraticCurveTo(-s * .05, 0, Math.cos(Math.PI * .35) * s * .42, Math.sin(Math.PI * .35) * s * .42); g.stroke() },
    eye: (g, s) => { g.beginPath(); g.moveTo(-s * .5, 0); g.quadraticCurveTo(0, -s * .45, s * .5, 0); g.quadraticCurveTo(0, s * .45, -s * .5, 0); g.stroke(); g.beginPath(); g.arc(0, 0, s * .12, 0, TAU); g.stroke() },
    mouth: (g, s) => { g.beginPath(); g.moveTo(-s * .5, 0); g.quadraticCurveTo(0, s * .2, s * .5, 0); g.stroke(); for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * s * .18, -s * .12); g.lineTo(i * s * .18, s * .2); g.stroke() } },
    morse: (g, s) => { let x = -s * 1.6; "...---...".split("").forEach(c => { g.beginPath(); if (c === ".") { g.arc(x + s * .06, 0, s * .05, 0, TAU); x += s * .3 } else { g.moveTo(x, 0); g.lineTo(x + s * .3, 0); x += s * .45 } g.stroke() }) },
    cross: (g, s) => { g.beginPath(); g.arc(0, 0, s * .4, 0, TAU); g.stroke(); g.beginPath(); g.moveTo(-s * .28, -s * .28); g.lineTo(s * .28, s * .28); g.moveTo(s * .28, -s * .28); g.lineTo(-s * .28, s * .28); g.stroke() },
    wave: (g, s) => { for (const dy of [-.15, .15]) { g.beginPath(); for (let x = -.5; x <= .5; x += .05) g.lineTo(x * s, dy * s + Math.sin(x * 12) * s * .07); g.stroke() } },
    fence: (g, s) => { g.beginPath(); for (let i = -2; i <= 2; i++) { g.moveTo(i * s * .2, -s * .4); g.lineTo(i * s * .2, s * .4) } g.moveTo(-s * .5, -s * .2); g.lineTo(s * .5, -s * .2); g.stroke() },
    flower: (g, s) => { for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; g.beginPath(); g.arc(Math.cos(a) * s * .22, Math.sin(a) * s * .22, s * .14, 0, TAU); g.stroke() } },
    eq: (g, s) => { g.beginPath(); g.moveTo(-s * .3, -s * .1); g.lineTo(s * .3, -s * .1); g.moveTo(-s * .3, s * .1); g.lineTo(s * .3, s * .1); g.stroke() },
    t1: (g, s) => tally(g, s, 1), t2: (g, s) => tally(g, s, 2), t3: (g, s) => tally(g, s, 3), t4: (g, s) => tally(g, s, 4)
  };
  function tally(g, s, n) { g.beginPath(); for (let i = 0; i < n; i++) { const x = (i - (n - 1) / 2) * s * .13; g.moveTo(x, -s * .25); g.lineTo(x + s * .03, s * .25) } g.stroke() }
  const PLW = 256, PLH = 154, plT = cv(1024, 1024, (g) => { DS.forEach((d, n) => { const x0 = (n % 4) * PLW, y0 = (n / 4 | 0) * PLH;
      g.save(); g.translate(x0, y0); let gr = g.createLinearGradient(0, 0, PLW, PLH); gr.addColorStop(0, "#7e5a38"); gr.addColorStop(1, "#5a3c22"); g.fillStyle = gr; g.fillRect(0, 0, PLW, PLH);
      for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(30,15,5,${.1 + rnd() * .2})`; g.lineWidth = 1; g.beginPath(); const yy = rnd() * PLH; g.moveTo(0, yy); g.bezierCurveTo(80, yy + 5, 160, yy - 5, PLW, yy + rnd() * 6); g.stroke() }
      g.strokeStyle = "rgba(25,12,4,.8)"; g.lineWidth = 9; g.strokeRect(5, 5, PLW - 10, PLH - 10); g.strokeStyle = "rgba(255,220,170,.12)"; g.lineWidth = 2; g.strokeRect(11, 11, PLW - 22, PLH - 22);
      const items = d.g, n2 = items.length, s = n2 > 3 ? 46 : 60, wide = items.indexOf("morse") >= 0;
      items.forEach((k, j) => { const cxp = wide ? (j === 0 ? PLW / 2 : PLW / 2) : PLW / 2 + (j - (n2 - 1) / 2) * (s * 1.25), cyp = wide ? (j === 0 ? 56 : 108) : PLH / 2;
        g.save(); g.translate(cxp + 1.5, cyp + 2); g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "rgba(255,230,190,.35)"; g.lineWidth = 7; GL[k](g, s); g.restore();
        g.save(); g.translate(cxp, cyp); g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "rgba(26,12,4,.95)"; g.lineWidth = 7; GL[k](g, s); g.restore() });
      g.restore() }) });
  plT.wrapS = plT.wrapT = T.ClampToEdgeWrapping;

  /* ---------- двери: одна модель на всех, по копии в каждом витке ---------- */
  const DOORS = []; // экземпляры: {d, k, base(Matrix4), pos(Vector3)}
  DS.forEach(d => KS.forEach(k => { if (d.i == null && k) return; const y = d.y + (d.i != null ? k * P : 0), a = d.a + (d.i != null ? k * TURN : 0); if (y > STEPS * .27 - .8) return;
    const o3 = new T.Object3D(); o3.position.set(Math.cos(a) * (R - .22), y, Math.sin(a) * (R - .22)); o3.rotation.y = Math.atan2(-o3.position.x, -o3.position.z); o3.updateMatrix();
    DOORS.push({ d, k, base: o3.matrix.clone(), pos: o3.position.clone(), a, y }) }));
  const openA = DS.map(() => 0), openT = DS.map(() => 0);
  const frameG = (() => { const parts = [new T.TorusGeometry(DWs / 2 + .07, .09, 6, 18, Math.PI).translate(0, DHs - DWs / 2, .02)];
    [-1, 1].forEach(sg => parts.push(new T.BoxGeometry(.16, DHs - DWs / 2 + .45, .22).translate(sg * (DWs / 2 + .07), (DHs - DWs / 2 - .45) / 2, .02)));
    parts.push(new T.BoxGeometry(DWs + .5, .12, .3).translate(0, -.02, .06)); return mergeGeometries(parts.map(p => p.toNonIndexed())) })();
  const nicheG = new T.ShapeGeometry(arch(DWs, DHs));
  { const fr = [], ni = [], pl = []; DOORS.forEach(D => { fr.push(frameG.clone().applyMatrix4(D.base));
      const nc = nicheG.clone().applyMatrix4(new T.Matrix4().makeTranslation(0, 0, -.03)).applyMatrix4(D.base); const col = [0, 0, 0]; const cc = []; for (let i = 0; i < nc.attributes.position.count; i++) { const yy = (nicheG.attributes.position.getY(i)) / DHs; cc.push(col[0] * (1 - yy * .6), col[1] * (1 - yy * .6), col[2] * (1 - yy * .6)) } nc.setAttribute("color", new T.Float32BufferAttribute(cc, 3)); nc.deleteAttribute("uv"); nc.deleteAttribute("normal"); ni.push(nc);
      const pg2 = new T.PlaneGeometry(.66, .4), n = D.d.n, u0 = (n % 4) * PLW / 1024, v1 = 1 - (n / 4 | 0) * PLH / 1024, uvA = pg2.attributes.uv; for (let i = 0; i < uvA.count; i++) uvA.setXY(i, u0 + uvA.getX(i) * PLW / 1024, v1 - (1 - uvA.getY(i)) * PLH / 1024); pg2.translate(0, DHs + .34, .1); pl.push(pg2.applyMatrix4(D.base)) });
    const frm = new T.Mesh(mergeGeometries(fr), stepM); frm.castShadow = true; frm.receiveShadow = true; sc.add(frm);
    sc.add(new T.Mesh(mergeGeometries(ni), new T.MeshBasicMaterial({ vertexColors: true, fog: true })));
    const plM = new T.MeshStandardMaterial({ map: plT, roughness: .8, emissive: 0xffd9a0, emissiveMap: plT, emissiveIntensity: .035 }); sc.add(new T.Mesh(mergeGeometries(pl), plM)) }
  let doorInst = null;
  // меловой крест на двери комнаты, где уже была
  const chalkT = cv(128, 128, (g) => { g.lineCap = "round"; [[22, 26, 104, 100], [100, 22, 30, 106]].forEach(([x0, y0, x1, y1]) => { for (let k = 0; k < 7; k++) { g.strokeStyle = `rgba(235,232,222,${.25 + Math.random() * .4})`; g.lineWidth = 3 + Math.random() * 5; g.beginPath(); g.moveTo(x0 + (Math.random() - .5) * 6, y0 + (Math.random() - .5) * 6); g.lineTo((x0 + x1) / 2 + (Math.random() - .5) * 5, (y0 + y1) / 2 + (Math.random() - .5) * 5); g.lineTo(x1 + (Math.random() - .5) * 6, y1 + (Math.random() - .5) * 6); g.stroke() } });
    g.globalCompositeOperation = "destination-out"; for (let k = 0; k < 260; k++) { g.fillStyle = `rgba(0,0,0,${.3 + Math.random() * .6})`; g.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 3, 1 + Math.random() * 2) } });
  const chalkM = new T.MeshStandardMaterial({ map: chalkT, transparent: true, depthWrite: false, roughness: 1, polygonOffset: true, polygonOffsetFactor: -2 }), chalkG = new T.PlaneGeometry(.34, .34), marks = [];
  const ROOM_OF = { dark: "dark", clock: "clock", sos: "sos", curse: "curse", mirror: "crypt" };
  function markDoors() { DOORS.forEach(D => { const nm = ROOM_OF[D.d.k]; if (!nm || GS.rooms.indexOf(nm) < 0 || D.mark) return; const m = new T.Mesh(chalkG, chalkM); m.matrixAutoUpdate = false; m.matrix.copy(D.base).multiply(new T.Matrix4().makeTranslation(.12, 1.2, .075)).multiply(new T.Matrix4().makeRotationZ(Math.random() * .3 - .15)); m.userData.n = D.d.n; sc.add(m); marks.push(m); D.mark = m }) }
  const DOORG = new T.PlaneGeometry(DWs, DHs).translate(0, DHs / 2, 0);
  function doorMatrix(D, out) { const th = openA[D.d.n] * 1.45; out.copy(D.base).multiply(_mk.makeTranslation(-DWs / 2, 0, .06)).multiply(new T.Matrix4().makeRotationY(th)).multiply(new T.Matrix4().makeTranslation(DWs / 2, 0, 0)); if (D.d.k === "pod") out.multiply(new T.Matrix4().makeScale(1e-4, 1e-4, 1e-4)); return out }
  function buildDoors(geom, mat) { if (doorInst) sc.remove(doorInst); doorInst = new T.InstancedMesh(geom, mat, DOORS.length); doorInst.castShadow = true; const m4 = new T.Matrix4(); DOORS.forEach((D, i) => doorInst.setMatrixAt(i, doorMatrix(D, m4))); doorInst.computeBoundingSphere(); sc.add(doorInst) }
  buildDoors(DOORG, bDoorM);
  function refreshDoor(n) { if (!doorInst) return; const m4 = new T.Matrix4(); DOORS.forEach((D, i) => { if (D.d.n === n) doorInst.setMatrixAt(i, doorMatrix(D, m4)) }); doorInst.instanceMatrix.needsUpdate = true }
  // особые двери: решётка подкопа с искрами и землёй, портреты над дверью проклятий
  const special = [];
  const ironM = new T.MeshStandardMaterial({ color: 0x3a3a44, metalness: .85, roughness: .45 });
  /* ---------- тёплый свет: кованые бра со свечами, огарки на ступенях, кольца в стене, паутина у дверей ---------- */
  // всё повторяется каждый виток (по номеру ступени по модулю PER), как двери, поэтому повтор лестницы незаметен
  const doorRes = DS.filter(d => d.i != null).map(d => ((d.i % PER) + PER) % PER), farDoor = (q, m) => doorRes.every(r => Math.min(Math.abs(q - r), PER - Math.abs(q - r)) >= m);
  const SC_RES = [12, 28, 6, 18, 29, 7].filter(q => farDoor(q, 2)).slice(0, 3);
  const warmT = cv(128, 128, (g) => { const q = g.createRadialGradient(64, 64, 0, 64, 64, 64); q.addColorStop(0, "rgba(255,185,110,.85)"); q.addColorStop(.2, "rgba(255,150,70,.42)"); q.addColorStop(.5, "rgba(255,125,50,.12)"); q.addColorStop(1, "rgba(255,110,40,0)"); g.fillStyle = q; g.fillRect(0, 0, 128, 128) });
  const flameT = cv(64, 128, (g) => { const q = g.createRadialGradient(32, 88, 2, 32, 76, 40); q.addColorStop(0, "rgba(255,250,220,1)"); q.addColorStop(.35, "rgba(255,190,90,.9)"); q.addColorStop(1, "rgba(255,120,30,0)"); g.fillStyle = q; g.beginPath(); g.ellipse(32, 74, 16, 46, 0, 0, Math.PI * 2); g.fill() });
  const glowM = new T.MeshBasicMaterial({ map: warmT, color: new T.Color(.55, .36, .2), transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.BackSide });
  const SC = [], flames = [], waxM = new T.MeshStandardMaterial({ color: 0xd9cdb4, roughness: .7 }), brM = new T.MeshStandardMaterial({ color: 0x1e1c20, metalness: .8, roughness: .5 });
  const brG = mergeGeometries([new T.BoxGeometry(.05, .05, .32).translate(0, 0, .16), new T.CylinderGeometry(.07, .05, .04, 10).translate(0, .02, .3), new T.BoxGeometry(.14, .2, .03).translate(0, -.04, 0)]), candG = new T.CylinderGeometry(.03, .034, .16, 10).translate(0, .12, .3);
  const scList = []; for (let i = -1; i < STEPS; i++) if (SC_RES.indexOf(((i % PER) + PER) % PER) >= 0) scList.push(i);
  const brI = new T.InstancedMesh(brG, brM, scList.length), cdI = new T.InstancedMesh(candG, waxM, scList.length);
  scList.forEach((i, j) => { const st = stepAt(i), y = st.y + 1.95, x = Math.cos(st.a) * (R - .04), z = Math.sin(st.a) * (R - .04), o3 = new T.Object3D(); o3.position.set(x, y, z); o3.lookAt(0, y, 0); o3.updateMatrix(); brI.setMatrixAt(j, o3.matrix); cdI.setMatrixAt(j, o3.matrix);
    const fp = new T.Vector3(0, .26, .3).applyMatrix4(o3.matrix), fs = new T.Sprite(new T.SpriteMaterial({ map: flameT, color: 0xffffff, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); fs.scale.set(.07, .14, 1); fs.position.copy(fp); sc.add(fs);
    const hw2 = 1.1 / R, gw = new T.Mesh(new T.CylinderGeometry(R - .03, R - .03, 2.2, 10, 1, true, Math.PI / 2 - st.a - hw2, hw2 * 2), glowM); gw.position.y = y + .2; sc.add(gw); // по изгибу стены, иначе край уходит в стену и свет обрезается квадратом
    SC.push({ p: fp, f: fs, ph: j * 1.7 }) });
  sc.add(brI, cdI);
  // два настоящих тёплых света переезжают к ближайшим свечам: красиво, а цена не растёт от числа свечей
  const warmL = [0, 1].map(() => { const l = new T.PointLight(0xff9a4a, 0, 6.5, 1.7); sc.add(l); return l });
  function warmTick(t) { const cp = cam.position; const near = SC.map(o => [o, o.p.distanceToSquared(cp)]).sort((a, b) => a[1] - b[1]).slice(0, 2);
    SC.forEach(o => { const fl2 = .85 + .1 * Math.sin(t * 13 + o.ph) + .06 * Math.sin(t * 29 + o.ph * 3); o.f.scale.set(.07 * fl2, .14 * fl2, 1); o.k = fl2 });
    warmL.forEach((l, j) => { const o = near[j] && near[j][0]; if (!o) { l.intensity = 0; return } l.position.set(o.p.x * .96, o.p.y + .05, o.p.z * .96); l.intensity = 3.2 * o.k * Math.min(1, 36 / Math.max(1, near[j][1])) }) }
  // огарки прямо на ступенях у стены
  const stubList = []; for (let i = 0; i < STEPS; i++) { const q = ((i % PER) + PER) % PER; if ((q === 17 || q === 29 || q === 8) && farDoor(q, 1)) stubList.push(i) }
  const stubI = new T.InstancedMesh(new T.CylinderGeometry(.028, .035, 1, 8).translate(0, .5, 0), waxM, stubList.length * 2);
  stubList.forEach((i, j) => { const st = stepAt(i); [[.0, .09, .6], [.13, .05, .45]].forEach(([dx, hh, rr], k2) => { const o3 = new T.Object3D(), a2 = st.a + dx * .1; o3.position.set(Math.cos(a2) * (R - rr), st.y + .11, Math.sin(a2) * (R - rr)); o3.scale.set(1, hh, 1); o3.updateMatrix(); stubI.setMatrixAt(j * 2 + k2, o3.matrix);
    if (!k2) { const fs = new T.Sprite(new T.SpriteMaterial({ map: flameT, blending: T.AdditiveBlending, depthWrite: false, transparent: true })); fs.scale.set(.05, .1, 1); fs.position.set(o3.position.x, st.y + .11 + hh + .05, o3.position.z); sc.add(fs); SC.push({ p: fs.position, f: fs, ph: i * .9, small: 1 }) } }) });
  sc.add(stubI);
  // кованые кольца в стене
  const ringList = []; for (let i = 0; i < STEPS; i++) { const q = ((i % PER) + PER) % PER; if ((q === 18 || q === 2) && farDoor(q, 1)) ringList.push(i) }
  const ringI = new T.InstancedMesh(new T.TorusGeometry(.09, .014, 6, 16), brM, ringList.length);
  ringList.forEach((i, j) => { const st = stepAt(i), y = st.y + 1.1, o3 = new T.Object3D(); o3.position.set(Math.cos(st.a) * (R - .05), y, Math.sin(st.a) * (R - .05)); o3.lookAt(0, y, 0); o3.rotateX(Math.PI / 2 - .3); o3.updateMatrix(); ringI.setMatrixAt(j, o3.matrix) });
  sc.add(ringI);
  // паутина в верхних углах дверей
  const webT = cv(256, 256, (g) => { g.strokeStyle = "rgba(220,220,235,.55)"; g.lineWidth = 1.2; const n = 9; for (let k = 0; k < n; k++) { const an = k / (n - 1) * Math.PI / 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * 250, Math.sin(an) * 250); g.stroke() }
    for (let r2 = 30; r2 < 240; r2 += 26 + Math.random() * 10) { g.beginPath(); for (let k = 0; k < n; k++) { const an = k / (n - 1) * Math.PI / 2, rr = r2 * (.92 + Math.random() * .1); const X = Math.cos(an) * rr, Y = Math.sin(an) * rr; if (!k) g.moveTo(X, Y); else g.quadraticCurveTo(Math.cos(an - .09) * rr * .9, Math.sin(an - .09) * rr * .9, X, Y) } g.stroke() } });
  const webM = new T.MeshStandardMaterial({ map: webT, transparent: true, depthWrite: false, side: T.DoubleSide, roughness: 1, color: 0x9a98a8 });
  DOORS.forEach(D => { if (D.d.i == null) return; [-1, 1].forEach(sd => { const w = new T.Mesh(new T.PlaneGeometry(.55, .55), webM); w.position.set(-sd * (HW + .02), DH - .25, -.24); w.rotation.set(0, 0, sd < 0 ? Math.PI : -Math.PI / 2); w.position.applyMatrix4(D.base); w.quaternion.setFromRotationMatrix(D.base); w.rotateZ(sd < 0 ? -Math.PI / 2 : Math.PI); sc.add(w) }) });
  const portraitT = ["bobby", "sara", "derek", "candy"].map(n => { const t = TLs.load(IMG("ts1_" + n + ".webp")); t.colorSpace = T.SRGBColorSpace; return t });
  const PORDER = ["sara", "candy", "bobby", "derek"], PNAMES = ["bobby", "sara", "derek", "candy"];
  const portraits = [];
  DOORS.forEach(D => {
    if (D.d.k === "curse") PNAMES.forEach((nm, j) => { const fr = new T.Mesh(new T.BoxGeometry(.3, .38, .03), sideM); const pm = new T.Mesh(new T.PlaneGeometry(.25, .32), new T.MeshStandardMaterial({ map: portraitT[j], roughness: .8, emissive: 0xffc890, emissiveIntensity: 0, emissiveMap: portraitT[j] })); pm.position.z = .02; fr.add(pm);
      fr.matrixAutoUpdate = false; fr.matrix.copy(D.base).multiply(new T.Matrix4().makeTranslation((j - 1.5) * .36, DHs + .88, .06)); sc.add(fr); fr.userData.por = { nm, D, pm }; special.push(fr); portraits.push(fr) });
  });
  // записки
  const noteT = cv(256, 192, (g, w, h) => { g.fillStyle = "#e9dfc6"; g.fillRect(0, 0, w, h); g.fillStyle = "rgba(120,90,50,.15)"; for (let i = 0; i < 30; i++) g.fillRect(rnd() * w, rnd() * h, rnd() * 30, 2); g.strokeStyle = "rgba(40,30,60,.75)"; g.lineWidth = 2; for (let y = 34; y < h - 20; y += 22) { g.beginPath(); g.moveTo(20, y); for (let x = 20; x < w - 20 - rnd() * 60; x += 6) g.lineTo(x, y + Math.sin(x * .3) * 2 + (rnd() - .5) * 2); g.stroke() } });
  const noteM = new T.MeshStandardMaterial({ map: noteT, roughness: .95, color: 0x9a9284, emissive: 0xfff0d0, emissiveIntensity: .07, emissiveMap: noteT, side: T.DoubleSide });
  const NOTES = [{ i: 4, n: 0 }, { i: 46, n: 1, s: "sos" }, { i: 57, n: 2, s: "curse" }, { i: 72, n: 3, s: "mask" }, { a: 5.55, n: 6 }];
  NOTES.forEach(N => { const ks = N.i != null && inBand(N.i) ? KS : [0]; ks.forEach(k => { let p, a; if (N.i != null) { const s = stepAt(N.i); a = s.a + k * TURN; p = V3(Math.cos(a) * (R - 1.7), s.y + .132 + k * P, Math.sin(a) * (R - 1.7)) } else { a = N.a; p = V3(Math.cos(a) * (R - 1.7), FLOOR + .01, Math.sin(a) * (R - 1.7)) } if (p.y > HT + FLOOR - 1) return;
    const m = new T.Mesh(new T.PlaneGeometry(.3, .22), noteM); m.position.copy(p); m.rotation.set(-Math.PI / 2, 0, a + 1.2); m.userData.note = N; sc.add(m); special.push(m) }) });
  // шестерёнки от часов: две на ступенях, третья в проявочной
  const gearG = (() => { const parts = [new T.CylinderGeometry(.1, .1, .022, 24), new T.CylinderGeometry(.035, .035, .03, 12)]; for (let j = 0; j < 12; j++) parts.push(new T.BoxGeometry(.03, .022, .045).translate(0, 0, .115).rotateY(j / 12 * TAU)); for (let j = 0; j < 4; j++) parts.push(new T.BoxGeometry(.016, .026, .13).translate(0, 0, .06).rotateY(j / 4 * TAU + .4)); return mergeGeometries(parts.map(g => g.toNonIndexed())) })();
  const gearM = new T.MeshStandardMaterial({ color: 0xc09048, metalness: .85, roughness: .32, emissive: 0x6a4410, emissiveIntensity: .1 });
  const glintM = new T.SpriteMaterial({ map: dotT, color: 0xffd08a, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: .6, fog: false });
  // пять шестерёнок: две на лестнице, по одной в проявочной, у Миранды и в комнате проклятий; без фонарика почти не видны
  const GN = (o.rd || 1) >= 23 ? 6 : 5, GEARS = [{ id: 0, i: 27 }, { id: 1, i: 66 }, { id: 2, room: "dark" }, { id: 3, room: "sos" }, { id: 4, room: "curse" }, { id: 5, room: "crypt" }], gearMeshes = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] }, glints = []; // шестая — в гробу с маской, только с 23 серии
  function gearMesh(id) { const g = new T.Group(), m = new T.Mesh(gearG, gearM); m.castShadow = true; m.userData.gear = id; g.add(m); const sp = new T.Sprite(glintM.clone()); sp.scale.setScalar(.32); sp.position.y = .05; g.add(sp); glints.push(sp); gearMeshes[id].push(g); return { g, m } }
  GEARS.forEach(G => { if (G.room) return; (inBand(G.i) ? KS : [0]).forEach(k => { const s = stepAt(G.i), a = s.a + k * TURN, y = s.y + .145 + k * P; if (y > HT + FLOOR - 1) return; const { g, m } = gearMesh(G.id); g.position.set(Math.cos(a) * (R - 2.25), y, Math.sin(a) * (R - 2.25)); g.rotation.set(.05, a, .08); sc.add(g); special.push(m) }) });
  function hideGear(id, rm) { gearMeshes[id].forEach(g => { g.visible = false; const m = g.children[0], j = special.indexOf(m); if (j >= 0) special.splice(j, 1); if (rm) { const q = rm.pick.indexOf(m); if (q >= 0) rm.pick.splice(q, 1) } }) }
  GS.gears.forEach(id => hideGear(id)); gearHud();
  // верх: потолок и люк над последними ступенями (дойти можно, только когда часы пошли)
  const TOPY = STEPS * .27 + 2.0, HS = stepAt(STEPS - 3);
  const ceil = new T.Mesh(new T.CircleGeometry(R, 48), new T.MeshStandardMaterial({ map: stx("floor_c.jpg", 1, 5, 5), normalMap: stx("floor_n.jpg", 0, 5, 5), color: 0x6a6878, roughness: .95 })); ceil.rotation.x = Math.PI / 2; ceil.position.y = TOPY; sc.add(ceil);
  const hatchT = cv(256, 256, (g, w, h) => { g.fillStyle = "#1a120c"; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 52) { g.fillStyle = `rgb(${70 + rnd() * 20 | 0},${48 + rnd() * 14 | 0},${32 + rnd() * 10 | 0})`; g.fillRect(x + 3, 4, 46, h - 8); for (let k = 0; k < 40; k++) { g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(x + 3 + rnd() * 46, 4 + rnd() * (h - 8), 1, 10 + rnd() * 30) } }
    g.fillStyle = "#3a3a44"; [40, h - 52].forEach(y => g.fillRect(0, y, w, 12)) });
  const crackT = cv(256, 256, (g, w, h) => { g.fillStyle = "#000"; g.fillRect(0, 0, w, h); g.fillStyle = "#cfd8ff"; for (let x = 0; x <= w; x += 52) g.fillRect(x - 2, 0, 3, h); g.fillRect(0, 0, w, 3); g.fillRect(0, h - 3, w, 3) });
  const hatchM = new T.MeshStandardMaterial({ map: hatchT, emissiveMap: crackT, emissive: 0x9aa8ff, emissiveIntensity: .25, roughness: .9 });
  // люк: доски в железных полосах, заклёпки, круглая накладка со знаком часов, кольцо; сквозь щели падает лунный свет
  const hIron = new T.MeshStandardMaterial({ color: 0x232127, metalness: .8, roughness: .45 }), hSide = new T.MeshStandardMaterial({ color: 0x24180f, roughness: .9 });
  const sealT = cv(128, 128, (g) => { g.fillStyle = "#2a282e"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "rgba(150,150,170,.55)"; g.lineWidth = 3; g.beginPath(); g.arc(64, 64, 52, 0, TAU); g.stroke(); for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.beginPath(); g.moveTo(64 + Math.cos(a) * 44, 64 + Math.sin(a) * 44); g.lineTo(64 + Math.cos(a) * 50, 64 + Math.sin(a) * 50); g.stroke() }
    g.beginPath(); for (let k = 0; k < 120; k++) { const a = k / 120 * TAU * 2.6, r2 = 4 + k * .3; k ? g.lineTo(64 + Math.cos(a) * r2, 64 + Math.sin(a) * r2) : g.moveTo(64, 64) } g.stroke(); g.lineWidth = 4; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 26); g.moveTo(64, 64); g.lineTo(88, 72); g.stroke() });
  const sealM = new T.MeshStandardMaterial({ map: sealT, metalness: .7, roughness: .5 });
  function makeHatchLid() { const g = new T.Group(), S2 = 1.4;
    g.add(new T.Mesh(new T.BoxGeometry(S2, .09, S2), [hSide, hSide, hatchM, hatchM, hSide, hSide]));
    [-1, 1].forEach(fy2 => { [-.42, .42].forEach(z => { const b = new T.Mesh(new T.BoxGeometry(S2 + .06, .025, .13), hIron); b.position.set(0, fy2 * .057, z); g.add(b); for (let k = 0; k < 6; k++) { const st2 = new T.Mesh(new T.SphereGeometry(.018, 6, 4), hIron); st2.position.set(-.6 + k * .24, fy2 * .072, z); g.add(st2) } });
      const pl = new T.Mesh(new T.CylinderGeometry(.24, .24, .02, 28), [hIron, sealM, sealM]); pl.position.y = fy2 * .055; g.add(pl);
      const stp = new T.Mesh(new T.TorusGeometry(.05, .014, 6, 10, Math.PI), hIron); stp.position.set(0, fy2 * .066, .3); stp.rotation.x = fy2 > 0 ? 0 : Math.PI; g.add(stp);
      const ring = new T.Mesh(new T.TorusGeometry(.12, .018, 8, 20), hIron); ring.position.set(0, fy2 * .07, .3 + .1); ring.rotation.x = Math.PI / 2 + fy2 * .25; g.add(ring) });
    [-.5, .5].forEach(x => { const h2 = new T.Mesh(new T.BoxGeometry(.12, .03, .5), hIron); h2.position.set(x, -.06, -.5); g.add(h2) });
    return g }
  const HP = V3(Math.cos(HS.a) * (R - 1.6), TOPY, Math.sin(HS.a) * (R - 1.6)), hatchG = new T.Group(); hatchG.position.copy(HP); hatchG.rotation.y = -HS.a; sc.add(hatchG);
  [[0, .78, 1.72, .16], [0, -.78, 1.72, .16], [.78, 0, .16, 1.4], [-.78, 0, .16, 1.4]].forEach(([x, z, w2, d2]) => { const b = new T.Mesh(new T.BoxGeometry(w2, .22, d2), stepM); b.position.set(x, -.11, z); hatchG.add(b) });
  const hSky = new T.Mesh(new T.PlaneGeometry(1.5, 1.5), new T.MeshBasicMaterial({ map: cv(64, 64, g => { const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, "#0b1430"); gr.addColorStop(1, "#1c2c5c"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); g.fillStyle = "#dfe6ff"; for (let k = 0; k < 14; k++) g.fillRect(Math.random() * 64, Math.random() * 64, 1, 1) }), fog: false })); hSky.rotation.x = Math.PI / 2; hSky.position.y = .5; hatchG.add(hSky);
  const lidPiv = new T.Group(); lidPiv.position.set(0, -.05, -.7); hatchG.add(lidPiv); const lidH = makeHatchLid(); lidH.position.z = .7; lidPiv.add(lidH);
  const gapT = cv(16, 128, g => { const gr = g.createLinearGradient(0, 0, 0, 128); gr.addColorStop(0, "rgba(190,205,255,.8)"); gr.addColorStop(.25, "rgba(150,170,255,.25)"); gr.addColorStop(1, "rgba(120,140,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 16, 128) });
  const gapM = new T.MeshBasicMaterial({ map: gapT, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false, opacity: .16 });
  [-.43, .15].forEach(x => [0, Math.PI / 2].forEach(ry => { const m = new T.Mesh(new T.PlaneGeometry(.3, 4.2, 1, 1).translate(0, -2.1, 0), gapM); m.position.set(x, -.1, (x * 7 % .4) - .2); m.rotation.set((x > 0 ? .12 : -.08), ry, 0); hatchG.add(m) }));
  let lidOpen = 0, lidT = 0;
  const hatch = new T.Mesh(new T.BoxGeometry(1.5, .3, 1.5), new T.MeshBasicMaterial({ visible: false })); hatch.position.y = -.12; hatch.userData.hatch = 1; hatchG.add(hatch); special.push(hatch);
  // пока часы стоят, потолка нет: башня уходит вверх в светлую дымку, откуда и падают лучи. Часы пошли — дымка рассеивается, появляется потолок с люком
  const upWall = new T.Mesh(new T.CylinderGeometry(R, R, 44, 64, 1, true), wallM); upWall.position.y = HT + FLOOR + 22; sc.add(upWall);
  const hazeT = cv(256, 256, (g) => { const q = g.createRadialGradient(128, 128, 0, 128, 128, 128); q.addColorStop(0, "rgba(200,215,255,1)"); q.addColorStop(.3, "rgba(140,155,200,.45)"); q.addColorStop(.75, "rgba(60,70,110,.12)"); q.addColorStop(1, "rgba(40,50,90,0)"); g.fillStyle = q; g.fillRect(0, 0, 256, 256) });
  const haze = new T.Mesh(new T.CircleGeometry(R * 1.6, 48), new T.MeshBasicMaterial({ map: hazeT, color: new T.Color(.42, .46, .58), transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending }));
  haze.rotation.x = Math.PI / 2; haze.position.y = HT + FLOOR + 40; sc.add(haze);
  const hazeG = []; for (let k = 0; k < 4; k++) { const m = new T.Mesh(new T.CircleGeometry(R * .98, 48), new T.MeshBasicMaterial({ map: hazeT, color: new T.Color(.12, .15, .24), transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending })); m.rotation.x = Math.PI / 2; m.position.y = TOPY + 5 + k * 8; sc.add(m); hazeG.push(m) }
  const upSt = new T.InstancedMesh(stepBox.geometry, stepM, 80); { const o3 = new T.Object3D(); for (let k = 0; k < 80; k++) { const p = stepAt(STEPS + k); o3.position.set(p.x, p.y, p.z); o3.rotation.set(0, -p.a, 0); o3.updateMatrix(); upSt.setMatrixAt(k, o3.matrix) } } sc.add(upSt);
  function topState() { const open = !!GS.clock; ceil.visible = hatch.visible = hatchG.visible = open; upWall.visible = haze.visible = upSt.visible = !open; hazeG.forEach(m => m.visible = !open); if (open) { const ix = special.indexOf(hatch); if (ix < 0) special.push(hatch) } else { const ix = special.indexOf(hatch); if (ix >= 0) special.splice(ix, 1) } }
  topState();
  const hatchD = { d: { n: -1 }, pos: V3(Math.cos(HS.a) * (R - .22), HS.y + .13, Math.sin(HS.a) * (R - .22)), a: HS.a, y: HS.y + .13 };
  // тот, кто идёт выше: тёмный силуэт со свечой
  const figT = cv(128, 256, (g, w, h) => { g.save(); g.shadowColor = "rgba(150,140,200,.55)"; g.shadowBlur = 10; g.fillStyle = "#050408"; g.beginPath();
    g.ellipse(64, 34, 17, 21, 0, 0, TAU); g.fill(); g.beginPath(); g.moveTo(40, 58); g.quadraticCurveTo(64, 48, 88, 58); g.lineTo(98, 120); g.lineTo(106, 246); g.lineTo(22, 246); g.lineTo(30, 120); g.closePath(); g.fill(); g.restore() });
  const figM = new T.SpriteMaterial({ map: figT, transparent: true, opacity: 0, depthWrite: false });
  const fig = new T.Sprite(figM); fig.center.set(.5, 0); fig.scale.set(.85, 1.7, 1); fig.visible = false; sc.add(fig);
  const candle = new T.Sprite(new T.SpriteMaterial({ map: dotT, color: 0xffb860, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, fog: false })); candle.scale.setScalar(.7); candle.visible = false; sc.add(candle);
  const keyG = (() => { const parts = [new T.TorusGeometry(.04, .011, 6, 16).rotateX(Math.PI / 2).translate(-.09, 0, 0), new T.BoxGeometry(.14, .014, .016).translate(.02, 0, 0), new T.BoxGeometry(.016, .014, .04).translate(.07, 0, .02), new T.BoxGeometry(.016, .014, .03).translate(.045, 0, .015)]; return mergeGeometries(parts.map(g => g.toNonIndexed())) })();
  const keyM = new T.Mesh(keyG, gearM); keyM.userData.key = 1; keyM.visible = false; const keyGl = new T.Sprite(glintM); keyGl.scale.setScalar(.3); keyM.add(keyGl); sc.add(keyM);
  let shS = -1, shVis = 0, shGone = 0, keyS = -1, stepT = 0, shNext = 35;
  // сама Тень — модель Hyper3D: плащ с пустым капюшоном и фонарём; пока не загрузилась, вместо неё силуэт
  let wr = null, wrMats = [], wrYaw = 0; const LANT = V3(-.385, .59, .245), lampP = new T.Vector3();
  const lamp = new T.PointLight(0xffa24a, 0, 7, 1.6); sc.add(lamp);
  const mistG = new T.Group(); mistG.visible = false; sc.add(mistG); const mist = [];
  for (let i = 0; i < 8; i++) { const m = new T.Sprite(new T.SpriteMaterial({ map: dotT, color: 0x000000, transparent: true, opacity: 0, depthWrite: false })); m.userData.ph = i / 8; mistG.add(m); mist.push(m) }
  // она на лестнице: двигается, только пока на неё не смотришь
  let woM = null, woMats = [], wo = null, woNext = 75 + Math.random() * 45; const WOG = [13, 8.5, 5, 2.6], woP = new T.Vector3(), woQ = new T.Vector3();
  function woPos(si) { const st = stepAt(si); return woP.set(Math.cos(st.a) * (R - 1.75), st.y + .13, Math.sin(st.a) * (R - 1.75)) }
  function woSeen(p) { woQ.set(p.x, p.y + 1.4, p.z); if (woQ.distanceTo(cam.position) > 15) return false; woQ.project(cam); return woQ.z < 1 && Math.abs(woQ.x) < .92 && Math.abs(woQ.y) < .95 }
  function woShow(v) { if (!woM) return; woM.visible = v; woGl.forEach(g2 => g2.visible = v) }
  function woEnd() { wo = null; woShow(false); const nw = (performance.now() - t0) / 1000; woNext = nw + 150 + Math.random() * 80; shNext = Math.max(shNext, nw + 30); chaseNext = Math.max(chaseNext, nw + 45) }
  function showSh(v) { if (wr) { wr.visible = v; fig.visible = false } else fig.visible = v; candle.visible = v; mistG.visible = v; if (!v) { lamp.intensity = 0; stepsOn(false) } }
  function placeKey(si) { keyS = si; const st = stepAt(Math.round(si)); keyM.position.set(Math.cos(st.a) * (R - 2.0), st.y + .142, Math.sin(st.a) * (R - 2.0)); keyM.rotation.y = -st.a + .5; keyM.visible = true; if (special.indexOf(keyM) < 0) special.push(keyM) }

  /* ---------- глаза наверху: появляются, смотрят, моргают и пропадают ---------- */
  // глаза: объёмные яблоки с узким зрачком и веками + отблеск, как у зверя ночью (вспыхивает, когда на них попадает фонарик)
  for (let i = 0; i < 880; i++) rnd(); // старые нарисованные глаза брали 880 чисел — оставляем, чтобы цветы не сдвинулись
  const ER = .045, ESEP = .08, IRX = 256, IRY = 256, IRR = 74;
  const eyeT = cv(1024, 512, (g, w, h) => { g.fillStyle = "#1c120b"; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { g.strokeStyle = `rgba(${120 + Math.random() * 60 | 0},20,10,${.25 + Math.random() * .3})`; g.lineWidth = 1 + Math.random() * 1.5; g.beginPath(); let x = IRX + (Math.random() - .5) * 600, y = IRY + (Math.random() - .5) * 300; g.moveTo(x, y); for (let j = 0; j < 6; j++) { x += (IRX - x) * .18 + (Math.random() - .5) * 30; y += (IRY - y) * .18 + (Math.random() - .5) * 30; g.lineTo(x, y) } g.stroke() }
    let gr = g.createRadialGradient(IRX, IRY, IRR * .7, IRX, IRY, IRR * 2.2); gr.addColorStop(0, "rgba(0,0,0,0)"); gr.addColorStop(1, "rgba(0,0,0,.6)"); g.fillStyle = gr; g.fillRect(0, 0, w, h) });
  const irisDraw = (g) => { let sd = 7; const rq = () => (sd = (sd * 16807) % 2147483647) / 2147483647; const gr = g.createRadialGradient(IRX, IRY, 0, IRX, IRY, IRR); [[0, "#fff2a0"], [.3, "#ffc02a"], [.7, "#d65a0c"], [.92, "#5a1400"], [1, "#1a0500"]].forEach(([s, c]) => gr.addColorStop(s, c)); g.fillStyle = gr; g.beginPath(); g.arc(IRX, IRY, IRR, 0, TAU); g.fill();
    for (let i = 0; i < 160; i++) { const an = rq() * TAU, r0 = IRR * (.18 + rq() * .2), r1 = IRR * (.6 + rq() * .35); g.strokeStyle = rq() < .5 ? "rgba(255,236,160,.28)" : "rgba(70,10,0,.35)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(IRX + Math.cos(an) * r0, IRY + Math.sin(an) * r0); g.lineTo(IRX + Math.cos(an) * r1, IRY + Math.sin(an) * r1); g.stroke() }
    g.fillStyle = "#000"; g.beginPath(); g.ellipse(IRX, IRY, 9, IRR * .82, 0, 0, TAU); g.fill() };
  { const c = eyeT.image.getContext("2d"); irisDraw(c); eyeT.needsUpdate = true }
  const irisT = cv(1024, 512, (g, w, h) => { g.fillStyle = "#000"; g.fillRect(0, 0, w, h); irisDraw(g) });
  const shineT = cv(128, 128, (g) => { let gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,250,215,1)"); gr.addColorStop(.12, "rgba(255,210,110,.9)"); gr.addColorStop(.35, "rgba(230,140,40,.25)"); gr.addColorStop(1, "rgba(200,90,20,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    gr = g.createLinearGradient(0, 0, 128, 0); gr.addColorStop(0, "rgba(255,200,120,0)"); gr.addColorStop(.5, "rgba(255,220,160,.5)"); gr.addColorStop(1, "rgba(255,200,120,0)"); g.fillStyle = gr; g.fillRect(0, 62, 128, 4) });
  const lidM = new T.MeshBasicMaterial({ color: 0x000000, transparent: true });
  const lidUG = new T.SphereGeometry(ER * 1.06, 24, 10, 0, TAU, 0, 1.08), lidLG = new T.SphereGeometry(ER * 1.06, 24, 8, 0, TAU, 0, .95).rotateX(Math.PI), ballG = new T.SphereGeometry(ER, 32, 20), shG = new T.PlaneGeometry(ER * 3.4, ER * 3.4);
  function eyePair() { const g = new T.Group(), m = new T.MeshStandardMaterial({ map: eyeT, emissiveMap: irisT, emissive: 0xffb040, emissiveIntensity: .5, roughness: .1, transparent: true }), sm = new T.MeshBasicMaterial({ map: shineT, transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending }), lm = lidM.clone(), up = [];
    [-1, 1].forEach(sx => { const e = new T.Group(); e.position.x = sx * ESEP; e.rotation.z = sx * .12; g.add(e); e.add(new T.Mesh(ballG, m)); const u = new T.Mesh(lidUG, lm); e.add(u, new T.Mesh(lidLG, lm)); up.push(u); const s = new T.Mesh(shG, sm); s.position.z = ER * 1.3; e.add(s) });
    return { g, m, sm, lm, up } }
  const _ew = new T.Vector3(); function eyeSet(E, vis, glow, open) { const d = E.g.getWorldPosition(_ew).distanceTo(cam.position), far = Math.min(1, Math.max(0, (d - 1.5) / 4)); E.m.opacity = E.lm.opacity = vis; E.m.emissiveIntensity = .35 + 2.2 * glow; E.sm.opacity = vis * (.12 + 1.1 * glow) * open * (.15 + .85 * far); E.up.forEach(u => u.rotation.x = (1 - open) * 1.12) }
  const EP = eyePair(), eyes = EP.g; sc.add(eyes); const PKE = eyePair(); PKE.g.visible = false; PKE.g.scale.setScalar(1.1); sc.add(PKE.g); let pk = null, pkNext = 50 + Math.random() * 40, hdNext = 80 + Math.random() * 60;
  let eyeVis = 0, eyeWant = 0, eyeAway = 0, eyeLit = 0, blinkAt = 3, blinkT = -1, eyeNext = 4 + Math.random() * 4; eyes.position.set(1.5, HT + FLOOR - 6, -4); eyes.scale.setScalar(4); const EYE0 = eyes.position.clone();

  /* ---------- комнаты за дверями (отдельные маленькие сцены) ---------- */
  const rooms = {};
  function shell(w, d, h, opt) { const s = new T.Scene(); s.background = new T.Color(0x020203); s.fog = new T.FogExp2(0x050408, .05);
    const wm = new T.MeshStandardMaterial({ map: stx("wall_c.jpg", 1, w / 1.6, h / 1.6), normalMap: stx("wall_n.jpg", 0, w / 1.6, h / 1.6), color: opt.wall || 0xa8a0b0, roughness: .92, side: T.BackSide });
    const box = new T.Mesh(new T.BoxGeometry(w, h, d), wm); box.position.y = h / 2; box.receiveShadow = true; s.add(box);
    const fm = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshStandardMaterial({ map: stx("floor_c.jpg", 1, w / 2.5, d / 2.5), normalMap: stx("floor_n.jpg", 0, w / 2.5, d / 2.5), color: opt.floor || 0xa09aa8, roughness: .85 })); fm.rotation.x = -Math.PI / 2; fm.position.y = .002; fm.receiveShadow = true; s.add(fm);
    s.add(new T.AmbientLight(0x3c3a52, 1.2));
    // дверь обратно — за спиной
    const dg = new T.Group(); dg.position.set(0, 0, d / 2 - .03); dg.rotation.y = Math.PI; s.add(dg);
    const fr = new T.Mesh(frameG, stepM); dg.add(fr);
    const dd = new T.Mesh(DOORG, bDoorM); dd.position.z = .06; dg.add(dd);
    const hit = new T.Mesh(new T.BoxGeometry(DWs + .3, DHs + .2, .4), new T.MeshBasicMaterial({ visible: false })); hit.position.set(0, DHs / 2, .1); dg.add(hit);
    return { s, w, d, h, exit: hit, spawn: V3(0, 0, d / 2 - 1.1), yaw: 0, pick: [hit], tick: null } }
  function makeRoom(name) {
    if (rooms[name]) return rooms[name];
    let RM;
    if (name === "dark") { RM = shell(4.2, 5, 3, { wall: 0x8a6a6a });
      // фонарь проявочной: красный, но не выжигает потолок
      const red = new T.PointLight(0xff2a10, 4.2, 9, 1.5); red.position.set(0, 2.35, -1.05); RM.s.add(red);
      const fill = new T.PointLight(0x5a1008, 1.2, 7, 1.6); fill.position.set(0, 1.2, .6); RM.s.add(fill);
      const lampBox = new T.Mesh(new T.BoxGeometry(.32, .2, .14), new T.MeshStandardMaterial({ color: 0x141012, roughness: .5, metalness: .4 })); lampBox.position.set(0, 2.5, -1.12); RM.s.add(lampBox);
      const lamp = new T.Mesh(new T.PlaneGeometry(.26, .14), new T.MeshBasicMaterial({ color: new T.Color(1.15, .06, .03) })); lamp.position.set(0, 2.5, -1.045); RM.s.add(lamp);
      const cord = new T.Mesh(new T.CylinderGeometry(.006, .006, .4, 4), stemM); cord.position.set(0, 2.8, -1.12); RM.s.add(cord);
      const wood = woodMat(0x8a6650);
      const tb = mkTable(wood, 2.6, .9, .94); tb.position.set(0, 0, -2.0); RM.s.add(tb);
      const liq = new T.MeshStandardMaterial({ color: 0x1c0d08, roughness: .04, metalness: .2 });
      [-.8, 0, .8].forEach(x => { const tr = new T.Mesh(new T.BoxGeometry(.6, .06, .45), new T.MeshStandardMaterial({ color: 0x15151a, metalness: .3, roughness: .1 })); tr.position.set(x, .97, -2.0); RM.s.add(tr);
        const lq = new T.Mesh(new T.PlaneGeometry(.54, .39), liq); lq.rotation.x = -Math.PI / 2; lq.position.set(x, 1.001, -2.0); RM.s.add(lq) });
      // увеличитель на тумбе справа
      const dark2 = new T.MeshStandardMaterial({ color: 0x1a1718, roughness: .45, metalness: .5 }), cab = new T.Mesh(woodBox(.62, .9, .6), wood); cab.position.set(1.72, .45, -2.0); RM.s.add(cab); [.2, .52].forEach(y => { const dr = new T.Mesh(woodBox(.56, .26, .02), wood); dr.position.set(1.72, y, -1.69); RM.s.add(dr); const kb = new T.Mesh(new T.SphereGeometry(.016, 8, 6), dark2); kb.position.set(1.72, y, -1.67); RM.s.add(kb) });
      const base = new T.Mesh(new T.BoxGeometry(.5, .04, .44), new T.MeshStandardMaterial({ color: 0x8c857c, roughness: .8 })); base.position.set(1.72, .92, -1.98); RM.s.add(base);
      const col2 = new T.Mesh(new T.CylinderGeometry(.025, .025, .95, 10), dark2); col2.position.set(1.72, 1.38, -2.2); RM.s.add(col2);
      const head = new T.Mesh(new T.BoxGeometry(.24, .2, .26), dark2); head.position.set(1.72, 1.42, -2.02); RM.s.add(head);
      const lens = new T.Mesh(new T.CylinderGeometry(.045, .05, .1, 14), dark2); lens.position.set(1.72, 1.27, -2.0); RM.s.add(lens);
      // полка с бутылками реактивов слева
      const shelf = new T.Mesh(woodBox(.24, .04, 1.4), wood); shelf.position.set(-1.98, 1.55, -1.5); RM.s.add(shelf);
      const glass = new T.MeshStandardMaterial({ color: 0x3a1a08, roughness: .12, metalness: .1, transparent: true, opacity: .85 }), capM = new T.MeshStandardMaterial({ color: 0x0c0c0c, roughness: .6 });
      [-2.0, -1.78, -1.55, -1.3, -1.05].forEach((z, j) => { const hh = .2 + (j % 3) * .05, bt = new T.Mesh(new T.CylinderGeometry(.045, .05, hh, 12), glass); bt.position.set(-1.98, 1.57 + hh / 2, z); RM.s.add(bt);
        const cp = new T.Mesh(new T.CylinderGeometry(.025, .025, .04, 10), capM); cp.position.set(-1.98, 1.59 + hh, z); RM.s.add(cp) });
      // фотографии на верёвках: проявлены только найденные тайны
      const ph = [["equinox", "tower_inside.webp"], ["sos", "miranda_p.webp"], ["mask", "sx_mask.webp"], ["curse", "t1_four_kids.webp"]];
      const rope = new T.Mesh(new T.CylinderGeometry(.006, .006, 3.8, 4), stemM); rope.rotation.z = Math.PI / 2; rope.position.set(0, 2.2, -1.2); RM.s.add(rope);
      ph.forEach(([k, img], j) => { const t = TLs.load(IMG(img)); t.colorSpace = T.SRGBColorSpace; const dev = !!got[k];
        const m = new T.Mesh(new T.PlaneGeometry(.55, .55), new T.MeshStandardMaterial({ map: t, color: dev ? 0xffffff : 0x2a1a14, roughness: .6, side: T.DoubleSide })); m.position.set(-1.35 + j * .9, 1.88, -1.2); m.rotation.y = (rnd() - .5) * .3; m.rotation.z = (rnd() - .5) * .1; RM.s.add(m);
        const clip = new T.Mesh(new T.BoxGeometry(.03, .09, .025), wood); clip.position.set(m.position.x, 2.17, -1.2); RM.s.add(clip) });
      addNote(RM, 5, V3(.9, .953, -1.8));
      if (GS.gears.indexOf(2) < 0) { const { g, m } = gearMesh(2); g.position.set(-1.98, 1.583, -1.67); g.rotation.set(0, .7, .06); g.scale.setScalar(.8); RM.s.add(g); RM.pick.push(m) }
      RM.say = L.dark }
    else if (name === "clock") { // часовой механизм башни: изнутри циферблат светится луной, перед ним шестерни, маятник и гири; верстак часовщика у стены
      RM = shell(5, 5, 4.8, { wall: 0x8a8090 }); const S = RM.s; S.fog = new T.FogExp2(0x07060c, .045);
      const wood = woodMat(0x7a5a46);
      // старый металл: пятна грязи и ржавчины, царапины, раковины — цвет, шероховатость и рельеф из одной процедурной карты
      const grime = (rust) => { const c = document.createElement("canvas"); c.width = c.height = 512; const g = c.getContext("2d"); g.fillStyle = "#b8b8b8"; g.fillRect(0, 0, 512, 512);
        const blot = (n, r0, r1, col) => { for (let k = 0; k < n; k++) { const x = Math.random() * 512, y = Math.random() * 512, r2 = r0 + Math.random() * (r1 - r0), q = g.createRadialGradient(x, y, 0, x, y, r2); q.addColorStop(0, col); q.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = q; g.fillRect(x - r2, y - r2, 2 * r2, 2 * r2) } };
        blot(60, 20, 90, "rgba(40,36,34,.45)"); blot(120, 4, 22, "rgba(20,18,16,.5)"); if (rust) blot(rust, 8, 46, "rgba(120,58,22,.55)");
        for (let k = 0; k < 900; k++) { const v = Math.random() < .5 ? 0 : 255; g.fillStyle = `rgba(${v},${v},${v},${Math.random() * .25})`; const r2 = .5 + Math.random() * 2.2; g.beginPath(); g.arc(Math.random() * 512, Math.random() * 512, r2, 0, 6.3); g.fill() }
        for (let k = 0; k < 140; k++) { g.strokeStyle = `rgba(235,235,230,${.08 + Math.random() * .2})`; g.lineWidth = .6 + Math.random(); g.beginPath(); const x = Math.random() * 512, y = Math.random() * 512, a = Math.random() * 6.3, l = 10 + Math.random() * 60; g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke() }
        const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; return t };
      const gIron = grime(40), gBrass = grime(14), gSteel = grime(6), rep = (t, k) => { t.repeat.set(k, k); return t };
      const iron = new T.MeshStandardMaterial({ color: 0x3a3532, map: rep(gIron, 2), roughnessMap: gIron, bumpMap: gIron, bumpScale: .9, metalness: .6, roughness: .85 }),
        brassC = new T.MeshStandardMaterial({ color: 0x9a7438, map: rep(gBrass, 2), roughnessMap: gBrass, bumpMap: gBrass, bumpScale: .7, metalness: .7, roughness: .75, emissive: 0x2a1a06, emissiveIntensity: .2 }),
        steel = new T.MeshStandardMaterial({ color: 0x74747c, map: rep(gSteel, 2), roughnessMap: gSteel, bumpMap: gSteel, bumpScale: .5, metalness: .8, roughness: .6 });
      // циферблат изнутри: матовое стекло, цифры наоборот, чугунные спицы; за ним ночь и луна
      const DZ = -2.47, DY = 2.75, DR = 1.38;
      const dialT = cv(1024, 1024, (g, w, h) => { const c = w / 2; const q = g.createRadialGradient(c * 1.15, c * .8, 20, c, c, c); q.addColorStop(0, "#c9d6f0"); q.addColorStop(.55, "#7d8db3"); q.addColorStop(1, "#38415e"); g.fillStyle = q; g.beginPath(); g.arc(c, c, c - 4, 0, TAU); g.fill();
        for (let k = 0; k < 2600; k++) { g.fillStyle = `rgba(255,255,255,${Math.random() * .05})`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2) }
        g.strokeStyle = "#0c0b10"; g.lineWidth = 34; g.beginPath(); g.arc(c, c, c - 20, 0, TAU); g.stroke(); g.lineWidth = 14; g.beginPath(); g.arc(c, c, c * .62, 0, TAU); g.stroke(); g.beginPath(); g.arc(c, c, 46, 0, TAU); g.fillStyle = "#0c0b10"; g.fill();
        for (let k = 0; k < 12; k++) { const a = k / 12 * TAU; g.lineWidth = 10; g.beginPath(); g.moveTo(c + Math.cos(a) * 46, c + Math.sin(a) * 46); g.lineTo(c + Math.cos(a) * (c - 20), c + Math.sin(a) * (c - 20)); g.stroke() }
        g.save(); g.translate(w, 0); g.scale(-1, 1); g.fillStyle = "#0c0b10"; g.font = "bold 92px serif"; g.textAlign = "center"; g.textBaseline = "middle";
        ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"].forEach((t2, k) => { const a = k / 12 * TAU - Math.PI / 2; g.save(); g.translate(c + Math.cos(a) * c * .8, c + Math.sin(a) * c * .8); g.rotate(a + Math.PI / 2); g.fillText(t2, 0, 0); g.restore() }); g.restore();
        g.strokeStyle = "rgba(10,9,14,.55)"; g.lineWidth = 3; g.beginPath(); let x = c * 1.3, y = c * .3; g.moveTo(x, y); for (let k = 0; k < 9; k++) { x += (Math.random() - .5) * 90; y += 40 + Math.random() * 30; g.lineTo(x, y) } g.stroke() });
      const dial = new T.Mesh(new T.CircleGeometry(DR, 64), new T.MeshStandardMaterial({ map: dialT, emissive: 0xffffff, emissiveMap: dialT, emissiveIntensity: .55, roughness: .4 })); dial.position.set(0, DY, DZ); S.add(dial);
      const rim = new T.Mesh(new T.TorusGeometry(DR + .04, .07, 10, 64), iron); rim.position.set(0, DY, DZ + .02); S.add(rim);
      // стрелки — чёрные силуэты на стекле
      const handM = new T.MeshBasicMaterial({ color: 0x060508 });
      const mkHand = (len, w2, z) => { const g2 = new T.Group(); g2.position.set(0, DY, z); const sh = new T.Shape(); sh.moveTo(-w2, -.12); sh.lineTo(w2, -.12); sh.lineTo(w2 * .6, len * .8); sh.lineTo(0, len); sh.lineTo(-w2 * .6, len * .8); sh.closePath(); g2.add(new T.Mesh(new T.ShapeGeometry(sh), handM)); S.add(g2); return g2 };
      const hH = mkHand(.72, .05, DZ + .04), hM = mkHand(1.08, .035, DZ + .05);
      // лунный свет сквозь стекло: тени шестерён ложатся на пол
      const moonL = new T.SpotLight(0x9fb4ff, 22, 10, .62, .7, 1.2); moonL.position.set(0, DY, DZ - .3); moonL.target.position.set(0, 0, 1.4); moonL.castShadow = true; moonL.shadow.mapSize.set(512, 512); moonL.shadow.bias = -.002; S.add(moonL, moonL.target);
      const beam = new T.Mesh(new T.CylinderGeometry(DR * .9, 2.2, 4.2, 24, 1, true).translate(0, -2.1, 0), new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
        vertexShader: "varying float vY; varying vec3 vN,vV; void main(){ vY=-position.y/4.2; vec4 wp=modelMatrix*vec4(position,1.); vN=normalize(mat3(modelMatrix)*normal); vV=cameraPosition-wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }",
        fragmentShader: "varying float vY; varying vec3 vN,vV; void main(){ float f=abs(dot(normalize(vN),normalize(vV))); float a=.05*pow(f,2.)*(1.-vY); gl_FragColor=vec4(vec3(.6,.7,1.)*a,1.); }" }));
      beam.position.set(0, DY, DZ + .05); beam.quaternion.setFromUnitVectors(V3(0, -1, 0), V3(0, -.55, 1).normalize()); S.add(beam);
      // шестерни: зубчатые колёса с вырезами, на осях в чугунной раме
      const gearGeo = (r, n, th) => { const sh = new T.Shape(), tH = r * .12, k2 = n * 4; for (let k = 0; k <= k2; k++) { const a = k / k2 * TAU, ph = k % 4, rr2 = ph === 1 || ph === 2 ? r + tH : r; const x = Math.cos(a) * rr2, y = Math.sin(a) * rr2; k ? sh.lineTo(x, y) : sh.moveTo(x, y) }
        const hole = new T.Path(); hole.absarc(0, 0, r * .12, 0, TAU, true); sh.holes.push(hole);
        if (r > .2) for (let k = 0; k < 5; k++) { const a0 = k / 5 * TAU + .25, a1 = a0 + TAU / 5 - .5, h2 = new T.Path(); h2.absarc(0, 0, r * .78, a0, a1, false); h2.absarc(0, 0, r * .3, a1, a0, true); h2.closePath(); sh.holes.push(h2) }
        return new T.ExtrudeGeometry(sh, { depth: th, bevelEnabled: true, bevelThickness: .006, bevelSize: .006, bevelSegments: 1, curveSegments: 6 }).translate(0, 0, -th / 2) };
      const GZ = -1.5, mech = new T.Group(); S.add(mech); const gears = [];
      const addGear = (x, y, z, r, n, mat, dir, found) => { const m = new T.Mesh(gearGeo(r, n, r > .3 ? .06 : .045), mat); m.position.set(x, y, z + (Math.random() - .5) * .02); m.rotation.set((Math.random() - .5) * .04, (Math.random() - .5) * .04, Math.random() * 6.3); m.castShadow = true; m.userData.w = dir / r; m.userData.found = found; mech.add(m); gears.push(m);
        const ax = new T.Mesh(new T.CylinderGeometry(.025, .025, .5, 8), steel); ax.rotation.x = Math.PI / 2; ax.position.set(x, y, z - .1); mech.add(ax); return m };
      // главное колесо и передача к стрелкам; три места (found) пустые, пока не принесёшь шестерёнки
      addGear(-.35, 2.05, GZ, .55, 36, brassC, 1); addGear(.45, 2.36, GZ + .07, .28, 18, iron, -1); addGear(.38, 1.42, GZ + .07, .4, 26, brassC, -1);
      addGear(-1.05, 1.78, GZ + .07, .18, 12, iron, -1); addGear(.02, .86, GZ, .32, 20, iron, 1); addGear(-.9, 2.7, GZ + .14, .24, 16, brassC, 1);
      const slots = [[.86, 2.0, GZ + .14, .16, 12, -1], [-.62, 1.15, GZ + .14, .16, 12, 1], [.95, 2.72, GZ, .16, 12, 1], [-1.3, 2.3, GZ + .14, .14, 10, -1], [.66, .78, GZ + .14, .15, 11, 1], [1.22, 1.45, GZ + .14, .15, 11, -1]].slice(0, GN).map(([x, y, z, r, n, d]) => { const m = addGear(x, y, z, r, n, brassC, d, 1); m.visible = !!GS.clock; return m });
      const slotGl = slots.map(m => { const sp = new T.Sprite(new T.SpriteMaterial({ map: dotT, color: 0xffc070, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: .35, fog: false })); sp.scale.setScalar(.3); sp.position.copy(m.position).add(V3(0, 0, .08)); sp.visible = !GS.clock; S.add(sp); return sp });
      // вал от механизма к циферблату
      const shaft = new T.Mesh(new T.CylinderGeometry(.04, .04, Math.abs(DZ - GZ), 10), steel); shaft.rotation.x = Math.PI / 2; shaft.position.set(0, DY, (DZ + GZ) / 2); S.add(shaft);
      // чугунная рама
      [[-1.45, 0], [1.45, 0]].forEach(([x]) => { const p2 = new T.Mesh(new T.BoxGeometry(.12, 3.3, .12), iron); p2.position.set(x, 1.65, GZ - .2); p2.castShadow = true; S.add(p2) });
      [.25, 3.2].forEach(y => { const b2 = new T.Mesh(new T.BoxGeometry(3.0, .1, .12), iron); b2.position.set(0, y, GZ - .2); S.add(b2) });
      // маятник и гири на цепях
      const pend = new T.Group(); pend.position.set(0, 3.05, GZ + .3); S.add(pend);
      const rod = new T.Mesh(new T.CylinderGeometry(.012, .012, 2.3, 6).translate(0, -1.15, 0), brassC); pend.add(rod); const bob = new T.Mesh(new T.CylinderGeometry(.22, .22, .05, 32), brassC); bob.rotation.x = Math.PI / 2; bob.position.y = -2.3; bob.castShadow = true; pend.add(bob);
      const wts = [-1.1, 1.1].map((x, k) => { const g2 = new T.Group(); g2.position.set(x, 0, GZ + .25); S.add(g2); const ch = new T.Mesh(new T.CylinderGeometry(.008, .008, 1, 4).translate(0, .5, 0), steel); g2.add(ch); const wt = new T.Mesh(new T.CylinderGeometry(.09, .09, .42, 14), iron); wt.position.y = 0; wt.castShadow = true; g2.add(wt); g2.userData.ch = ch; g2.userData.wt = wt; g2.userData.y = k ? 1.1 : 1.7; return g2 });
      const setW = () => wts.forEach(g2 => { const y = g2.userData.y; g2.userData.wt.position.y = y; g2.userData.ch.position.y = y + .21; g2.userData.ch.scale.y = 3.05 - y - .21 }); setW();
      const mechHit = new T.Mesh(new T.BoxGeometry(2.8, 3, .8), new T.MeshBasicMaterial({ visible: false })); mechHit.position.set(0, 1.6, GZ + .1); mechHit.userData.clock = 1; S.add(mechHit); RM.pick.push(mechHit);
      RM.cols = [{ x: -.6, z: GZ + .2, r: .95 }, { x: .6, z: GZ + .2, r: .95 }];
      // верстак часовщика у левой стены: свеча, разобранные часы, ящик
      const c1 = new T.PointLight(0xffa850, 3.6, 6, 1.6); c1.position.set(-2.0, 1.4, .45); S.add(c1);
      const tb = mkTable(wood, .75, 1.6, .94); tb.position.set(-2.05, 0, .2); S.add(tb);
      const cand = mkCandle(.17, .028, true); cand.position.set(-2.15, .946, .55); S.add(cand); const cand2 = mkCandle(.07, .03, false); cand2.position.set(-2.22, .946, .42); S.add(cand2);
      const pocket = new T.Mesh(new T.CylinderGeometry(.09, .09, .03, 24), brassC); pocket.position.set(-2.0, .962, -.1); S.add(pocket);
      [[-1.95, .3, .06], [-2.2, .1, .045], [-1.9, .05, .035], [-2.1, -.35, .05]].forEach(([x, z, r]) => { const m = new T.Mesh(gearGeo(r, 10, .012), Math.random() < .5 ? brassC : steel); m.rotation.x = -Math.PI / 2; m.position.set(x, .958, z); S.add(m) });
      const drawer = new T.Mesh(woodBox(.6, .1, .5), wood); drawer.position.set(-2.05, .744, -.3); S.add(drawer); const knob = new T.Mesh(new T.SphereGeometry(.018, 8, 6), brassC); knob.position.set(.31, 0, 0); drawer.add(knob);
      RM.cols.push({ x: -2.05, z: -.2, r: .55 }, { x: -2.05, z: .6, r: .55 });
      // календарь на правой стене: отрывной, с гравюрой башни; сентябрь 2023, 23-е обведено от руки и подписано ☉ = ☾
      const calT = cv(512, 768, (g, w, h) => { g.fillStyle = "#e6dcc4"; g.fillRect(0, 0, w, h);
        for (let k = 0; k < 30; k++) { const x = Math.random() * w, y = Math.random() * h, r2 = 20 + Math.random() * 90, q = g.createRadialGradient(x, y, 0, x, y, r2); q.addColorStop(0, "rgba(150,110,60,.16)"); q.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = q; g.fillRect(x - r2, y - r2, 2 * r2, 2 * r2) }
        const e = g.createRadialGradient(w / 2, h / 2, h * .3, w / 2, h / 2, h * .75); e.addColorStop(0, "rgba(0,0,0,0)"); e.addColorStop(1, "rgba(90,60,30,.35)"); g.fillStyle = e; g.fillRect(0, 0, w, h);
        g.fillStyle = "#3a2a20"; g.fillRect(0, 0, w, 26); for (let x = 30; x < w; x += 38) { g.fillStyle = "#e6dcc4"; g.beginPath(); g.arc(x, 13, 5, 0, TAU); g.fill() }
        // гравюра: башня на холме, луна, лес
        g.save(); g.translate(0, 40); g.strokeStyle = "#3b2c22"; g.fillStyle = "#3b2c22"; g.lineWidth = 2; g.strokeRect(36, 10, w - 72, 250);
        g.beginPath(); g.arc(380, 80, 30, 0, TAU); g.stroke(); for (let k = 0; k < 40; k++) { const a = Math.random() * TAU, rr = 34 + Math.random() * 10; g.fillRect(380 + Math.cos(a) * rr, 80 + Math.sin(a) * rr, 1.5, 1.5) }
        for (let y = 30; y < 250; y += 5) { g.globalAlpha = .18; g.beginPath(); g.moveTo(40, y); g.lineTo(w - 40, y); g.stroke() } g.globalAlpha = 1;
        g.beginPath(); g.moveTo(40, 240); for (let x = 40; x <= w - 40; x += 8) g.lineTo(x, 225 - Math.sin(x / 70) * 14 - (x > 180 && x < 330 ? 22 : 0) + Math.random() * 4); g.lineTo(w - 40, 258); g.lineTo(40, 258); g.fill();
        g.fillRect(232, 70, 46, 160); g.beginPath(); g.moveTo(226, 72); g.lineTo(255, 28); g.lineTo(284, 72); g.fill(); g.fillStyle = "#e6dcc4"; g.beginPath(); g.arc(255, 100, 10, 0, TAU); g.fill(); g.fillRect(250, 140, 10, 18);
        g.fillStyle = "#3b2c22"; for (let x = 44; x < w - 44; x += 14) { if (x > 200 && x < 310) continue; const th = 26 + Math.random() * 30; g.beginPath(); g.moveTo(x, 238); g.lineTo(x + 7, 238 - th); g.lineTo(x + 14, 238); g.fill() } g.restore();
        g.fillStyle = "#6e1a18"; g.font = "bold 46px serif"; g.textAlign = "center"; g.fillText(EN ? "SEPTEMBER" : "СЕНТЯБРЬ", w / 2, 350); g.fillStyle = "#3b2c22"; g.font = "22px serif"; g.fillText("2023", w / 2, 380);
        const dn = EN ? ["M", "T", "W", "T", "F", "S", "S"] : ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"], X0 = 52, CW = (w - 104) / 7; g.font = "bold 18px serif"; dn.forEach((d2, k) => { g.fillStyle = k > 4 ? "#6e1a18" : "#3b2c22"; g.fillText(d2, X0 + CW * (k + .5), 420) });
        g.font = "26px serif"; for (let dd = 1; dd <= 30; dd++) { const idx = dd + 3, col = idx % 7, row = Math.floor(idx / 7), x = X0 + CW * (col + .5), y = 462 + row * 52; g.fillStyle = col > 4 ? "#6e1a18" : "#3b2c22"; g.fillText(dd, x, y);
          if (dd < 23) { g.strokeStyle = "rgba(40,30,30,.55)"; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 14, y - 14); g.lineTo(x + 14, y + 4); g.stroke() }
          if (dd === 23) { g.strokeStyle = "rgba(150,20,20,.85)"; g.lineWidth = 3; g.beginPath(); for (let a = 0; a < 7.2; a += .2) { const rr = 24 + Math.sin(a * 3) * 2; g.lineTo(x + Math.cos(a) * rr * 1.25, y - 8 + Math.sin(a) * rr) } g.stroke(); g.fillStyle = "rgba(60,50,60,.75)"; g.font = "italic 20px serif"; g.fillText("☉ = ☾", x + 4, y + 36); g.font = "26px serif" } }
        g.strokeStyle = "rgba(120,90,60,.5)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, 30); for (let x = 0; x < w; x += 12) g.lineTo(x, 30 + Math.random() * 5); g.stroke() });
      const calG = new T.Group(); calG.position.set(2.47, 1.72, .3); calG.rotation.y = -Math.PI / 2; S.add(calG);
      const cal = new T.Mesh(new T.PlaneGeometry(.44, .66, 1, 6), new T.MeshStandardMaterial({ map: calT, roughness: 1, color: 0x868072 })); { const pa = cal.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const y = pa.getY(i); pa.setZ(i, Math.max(0, -y - .15) * .12) } cal.geometry.computeVertexNormals() } cal.rotation.z = .03; calG.add(cal);
      const nail = new T.Mesh(new T.CylinderGeometry(.006, .006, .03, 6), steel); nail.rotation.x = Math.PI / 2; nail.position.set(0, .36, .01); calG.add(nail);
      // пылинки в лунном луче
      const dust = []; for (let k = 0; k < 40; k++) { const sp = new T.Sprite(new T.SpriteMaterial({ map: dotT, color: 0xbfcfff, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: .25 + Math.random() * .3 })); sp.scale.setScalar(.02 + Math.random() * .025); sp.position.set((Math.random() - .5) * 2.4, .3 + Math.random() * 2.6, -1.9 + Math.random() * 3.2); sp.userData.v = Math.random(); S.add(sp); dust.push(sp) }
      let mins = 11 * 60 + 9, lastS = -1; const setHands = () => { hM.rotation.z = (mins % 60) / 60 * TAU; hH.rotation.z = (mins / 60 % 12) / 12 * TAU }; setHands();
      RM.clockOpen = () => { RM.dOpen = RM.dOpen >= 1 ? 1 : 0; RM.run = 1; slots.forEach(m => m.visible = true); slotGl.forEach(sp => sp.visible = false) };
      RM.clockStop = () => { RM.run = 0; slots.forEach(m => m.visible = false); slotGl.forEach(sp => sp.visible = true) };
      if (GS.clock) { RM.run = 1; RM.dOpen = 1; drawer.position.x = -1.75; addNote(RM, 7, V3(-1.75, .8, -.3)) }
      addNote(RM, 4, V3(-1.95, .953, .75)); RM.say = GS.clock ? L.clockOn : L.clockR; RM.spawn = V3(.6, 0, 1.6); RM.yaw = .15;
      RM.tick = (t) => { c1.intensity = 4.2 + Math.sin(t * 13) * .4 + Math.sin(t * 7.1) * .35; const dt2 = Math.min(.05, t - (RM.tl || t)); RM.tl = t;
        dust.forEach(sp => { sp.position.y += Math.sin(t * .3 + sp.userData.v * 9) * .0008; sp.position.x += Math.cos(t * .2 + sp.userData.v * 7) * .0006 });
        slotGl.forEach((sp, k) => sp.material.opacity = .2 + .15 * Math.sin(t * 2 + k));
        if (RM.run) { mins += dt2; setHands(); pend.rotation.z = Math.sin(t * Math.PI * .5) * .2; const sN = Math.floor(t); const tk = sN !== lastS; if (tk) { lastS = sN; tick2(sN % 2) }
          gears.forEach(m => { m.rotation.z += m.userData.w * .12 * dt2 }); wts.forEach((g2, k) => { g2.userData.y = Math.max(.35, g2.userData.y - dt2 * .004 * (k + 1)) }); setW();
          if (RM.dOpen >= 0 && RM.dOpen < 1) { RM.dOpen = Math.min(1, RM.dOpen + dt2 / 1.2); drawer.position.x = -2.05 + .3 * RM.dOpen; if (RM.dOpen >= 1) { addNote(RM, 7, V3(-1.75, .8, -.3)); line(L.drawer, 3000) } } } } }
    else if (name === "sos") { // комната Миранды: железная кровать, ящик с плеером и кассетами, SOS мелом, фото и нитки на стене, размотанная плёнка
      RM = shell(3.2, 3.6, 2.8, { wall: 0x8e8a9e }); const S = RM.s;
      const c1 = new T.PointLight(0xffa458, 3.2, 5, 1.6); c1.position.set(.25, .75, -1.35); S.add(c1);
      const led = new T.PointLight(0xff2a1a, 0, 1.4, 2); S.add(led);
      const wood = woodMat(0x6e5444);
      load("bed.glb").then(g => { if (!g || room !== RM && rooms.sos !== RM) return; g.traverse(o3 => { if (o3.isMesh) { const m = o3.material; m.envMapIntensity = .2; if (m.map) m.map.anisotropy = 4 } }); g.scale.setScalar(1.85); g.rotation.y = Math.PI / 2; g.position.set(-.98, 0, -.78); S.add(g) });
      RM.cols = [{ x: -.98, z: -1.2, r: .62 }, { x: -.98, z: -.35, r: .62 }];
      // ящик у изголовья: плеер, свеча, кассеты
      const crate = mkCrate(wood, .46, .42, .42); crate.position.set(.2, 0, -1.5); crate.rotation.y = .12; S.add(crate); RM.cols.push({ x: .2, z: -1.5, r: .4 });
      const cand = mkCandle(.07, .026, true); cand.position.set(.34, .42, -1.42); S.add(cand); c1.position.set(.34, .62, -1.42);
      const wm = new T.Group(); wm.position.set(.1, .425, -1.5); wm.rotation.set(-Math.PI / 2, 0, .5); S.add(wm);
      load("walkman.glb").then(g => { if (!g) return; g.traverse(o3 => { if (o3.isMesh) o3.material.envMapIntensity = .4 }); g.scale.setScalar(1.6); wm.add(g) });
      const ledM = new T.Mesh(new T.SphereGeometry(.006, 6, 4), new T.MeshBasicMaterial({ color: 0x220303 })); ledM.position.set(-.05, .17, .03); wm.add(ledM);
      const wmHit = new T.Mesh(new T.BoxGeometry(.3, .3, .2), new T.MeshBasicMaterial({ visible: false })); wmHit.position.set(.1, .5, -1.5); wmHit.userData.tape = 1; S.add(wmHit); RM.pick.push(wmHit);
      const labT = cv(128, 80, g => { g.fillStyle = "#151318"; g.fillRect(0, 0, 128, 80); g.fillStyle = "#e6dcc2"; g.fillRect(8, 8, 112, 30); g.fillStyle = "#2a2240"; g.font = "italic 17px serif"; g.fillText("S O S", 34, 29); g.fillStyle = "#3a3640"; g.fillRect(30, 46, 68, 22); g.fillStyle = "#0d0c10"; [46, 82].forEach(x => { g.beginPath(); g.arc(x, 57, 8, 0, TAU); g.fill() }) });
      const casM = [new T.MeshStandardMaterial({ color: 0x151318, roughness: .4 }), new T.MeshStandardMaterial({ map: labT, roughness: .5 })], casG = new T.BoxGeometry(.1, .012, .064);
      const cas = (x, y, z, ry, rx) => { const m = new T.Mesh(casG, [casM[0], casM[0], casM[1], casM[0], casM[0], casM[0]]); m.position.set(x, y, z); m.rotation.set(rx || 0, ry, 0); S.add(m) };
      cas(.26, .427, -1.62, .9); cas(.25, .439, -1.61, 1.3); cas(-.5, .006, -.1, 2.2); cas(.6, .006, .3, -.4); cas(-.3, .006, .5, 1.1);
      for (let k = 0; k < 7; k++) cas(1.42, .006 + k * .0125, -1.58, .05 * (Math.random() - .5)); for (let k = 0; k < 4; k++) cas(1.3, .006 + k * .0125, -1.4, .6 + .08 * (Math.random() - .5));
      if (GS.gears.indexOf(3) < 0) { const { g, m } = gearMesh(3); g.position.set(-.47, .014, -.08); g.rotation.set(.04, 1.1, -.05); RM.s.add(g); RM.pick.push(m) }
      // размотанная плёнка от кассеты на полу
      { const pts = []; let x = -.5, z = -.1; for (let k = 0; k < 40; k++) { pts.push(V3(x, .004 + Math.random() * .01, z)); x += .05 + Math.sin(k * .7) * .05; z += Math.cos(k * .9) * .07 + .015 } const tp = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 160, .0025, 3), new T.MeshStandardMaterial({ color: 0x3a2214, roughness: .25, metalness: .3 })); S.add(tp) }
      // мелом: SOS и счёт дней
      const chalk = cv(512, 256, g => { g.lineCap = "round"; const st2 = (x0, y0, x1, y1, w2) => { for (let k = 0; k < 4; k++) { g.strokeStyle = `rgba(232,228,218,${.22 + Math.random() * .3})`; g.lineWidth = w2 * (.6 + Math.random() * .6); g.beginPath(); g.moveTo(x0 + (Math.random() - .5) * 3, y0 + (Math.random() - .5) * 3); g.lineTo(x1 + (Math.random() - .5) * 3, y1 + (Math.random() - .5) * 3); g.stroke() } };
        let x = 30; [0, 0, 0, 1, 1, 1, 0, 0, 0].forEach((d, k) => { if (k === 3 || k === 6) x += 26; if (d) { st2(x, 80, x + 46, 78, 9); x += 64 } else { st2(x, 78, x + 6, 82, 11); x += 26 } });
        for (let k = 0; k < 23; k++) { const gx = 40 + (k / 5 | 0) * 44, gy = 160; if (k % 5 === 4) st2(gx - 4, gy + 40, gx + 34, gy, 5); else st2(gx + (k % 5) * 8, gy, gx + (k % 5) * 8 + 2, gy + 42, 5) } });
      const ch = new T.Mesh(new T.PlaneGeometry(1.9, .95), new T.MeshStandardMaterial({ map: chalk, color: 0xa8a49c, transparent: true, depthWrite: false, roughness: 1 })); ch.position.set(-.75, 1.62, -1.785); S.add(ch);
      // фото Миранды и записки на стене, красные нитки между кнопками
      const t = TLs.load(IMG("miranda_p.webp")); t.colorSpace = T.SRGBColorSpace;
      const wallX = 1.585, onW = (z, y) => V3(wallX, y, z); const pins = [], noteW = new T.MeshStandardMaterial({ map: noteT, roughness: .95, color: 0x857d6c });
      const pp = new T.Mesh(new T.PlaneGeometry(.42, .55), new T.MeshStandardMaterial({ map: t, roughness: .7 })); pp.position.copy(onW(-.45, 1.65)); pp.rotation.y = -Math.PI / 2; S.add(pp); pins.push(onW(-.45, 1.9));
      [[.25, 1.95, .2], [.35, 1.35, -.15], [-1.15, 1.95, .1], [-1.05, 1.3, -.2], [.05, 1.0, .25]].forEach(([z, y, r]) => { const m = new T.Mesh(new T.PlaneGeometry(.22, .16), noteW); m.position.copy(onW(z, y)); m.position.x -= .005; m.rotation.set(0, -Math.PI / 2, r); S.add(m); pins.push(onW(z, y + .05)) });
      const pinM = new T.MeshStandardMaterial({ color: 0xb01818, roughness: .4 }); pins.forEach(p => { const m = new T.Mesh(new T.SphereGeometry(.012, 8, 6), pinM); m.position.copy(p); m.position.x -= .015; S.add(m) });
      const thr = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [3, 5], [2, 4]], tg = [];
      thr.forEach(([a, b]) => { const A2 = pins[a].clone(), B2 = pins[b].clone(); A2.x -= .02; B2.x -= .02; const M2 = A2.clone().lerp(B2, .5); M2.y -= .04; tg.push(new T.TubeGeometry(new T.QuadraticBezierCurve3(A2, M2, B2), 16, .0022, 3)) });
      S.add(new T.Mesh(mergeGeometries(tg), new T.MeshStandardMaterial({ color: 0x8a0f12, roughness: .6 })));
      // стул опрокинут
      const chair = mkChair(wood);
      chair.rotation.set(0, .7, Math.PI / 2); chair.position.set(1.05, .225, .55); S.add(chair); RM.cols.push({ x: 1.0, z: .6, r: .45 });
      // SOS лампочкой плеера: три коротких, три длинных, три коротких
      const SOS = [1, 1, 1, 3, 3, 3, 1, 1, 1]; let sosT = -1, tapN = 0;
      RM.tape = () => { line(tapN++ % 2 ? L.tape2 : L.tape1, 3400); sosT = 0; tapePlay(SOS, .22) };
      RM.yaw = .4; RM.say = L.sosIn; RM.tick = (tt) => { c1.intensity = 3.2 + Math.sin(tt * 11) * .4 + Math.sin(tt * 3.1) * .2; const d4 = Math.min(.05, tt - (RM.lt || tt)); RM.lt = tt;
        let on = 0; if (sosT >= 0) { sosT += d4; let acc = 0, u = .22; for (let k = 0; k < SOS.length; k++) { const len = SOS[k] * u; if (sosT >= acc && sosT < acc + len) { on = 1; break } acc += len + u; if (k === 2 || k === 5) acc += u * 2 } if (sosT > acc + 1.2) sosT = -1 }
        ledM.material.color.setRGB(on ? 3 : .14, on ? .4 : .02, on ? .3 : .02); ledM.getWorldPosition(led.position); led.intensity = on ? .9 : 0 } }
    else if (name === "curse") { RM = shell(3.6, 4, 3, { wall: 0x8a8090 });
      const wood = woodMat(0x7a5846); const tb = mkTable(wood, 1.6, .7, .94); tb.position.set(0, 0, -1.4); RM.s.add(tb);
      const c1 = new T.PointLight(0xffa850, 3.2, 6, 1.6); c1.position.set(-.55, 1.42, -1.25); RM.s.add(c1);
      [-.55, -.18, .18, .55].forEach((x, j) => { const cand = mkCandle(.2 - j * .035, .03, !j); cand.position.set(x, .946, -1.4); RM.s.add(cand) });
      if (GS.gears.indexOf(4) < 0) { const { g, m } = gearMesh(4); g.position.set(.4, .958, -1.62); g.rotation.set(0, 2.2, .03); g.scale.setScalar(.85); RM.s.add(g); RM.pick.push(m) }
      portraitT.forEach((pt, j) => { const pm = new T.Mesh(new T.PlaneGeometry(.36, .46), new T.MeshStandardMaterial({ map: pt, roughness: .8, color: j === 1 ? 0x555555 : 0xffffff })); pm.position.set(-1.05 + j * .7, 1.9, -1.98); RM.s.add(pm) });
      RM.say = L.curseIn; RM.tick = (tt) => { c1.intensity = 4 + Math.sin(tt * 12) * .5 } }
    else if (name === "top") { // верх башни: колокол под аркой, зубцы, внизу лес и огни Сентфора; пришла через люк — через него и обратно
      const s = new T.Scene(); s.background = new T.Color(0x070b1c); s.fog = new T.FogExp2(0x0c1228, .012); RM = { s, w: 16, d: 16, spawn: V3(0, 0, 4.4), yaw: 0, pick: [], cols: [], maxR: R - .5 };
      const stoneM = new T.MeshStandardMaterial({ map: stx("wall_c.jpg", 1, 1, 1), normalMap: stx("wall_n.jpg", 0, 1, 1), color: 0x9a96ac, roughness: .92 });
      const plat = new T.Mesh(new T.CircleGeometry(R, 64), new T.MeshStandardMaterial({ map: stx("floor_c.jpg", 1, 6, 6), normalMap: stx("floor_n.jpg", 0, 6, 6), color: 0x9a98b0, roughness: .85 })); plat.rotation.x = -Math.PI / 2; s.add(plat);
      const par = new T.Mesh(new T.CylinderGeometry(R, R, .8, 64, 1, true), new T.MeshStandardMaterial({ map: stx("wall_c.jpg", 1, 28, .8), normalMap: stx("wall_n.jpg", 0, 28, .8), color: 0xb8b4c8, roughness: .9, side: T.DoubleSide })); par.position.y = .4; s.add(par);
      const outW = new T.Mesh(new T.CylinderGeometry(R + .35, R + .35, 60, 64, 1, true), new T.MeshStandardMaterial({ map: stx("wall_c.jpg", 1, 30, 36), normalMap: stx("wall_n.jpg", 0, 30, 36), color: 0x7a7890, roughness: .95 })); outW.position.y = -29.2; s.add(outW);
      const cap = new T.Mesh(new T.RingGeometry(R - .02, R + .35, 64), stepM); cap.rotation.x = -Math.PI / 2; cap.position.y = .8; s.add(cap);
      // зубцы по краю
      const NM = 30, mer = new T.InstancedMesh(new T.BoxGeometry(.9, .62, .42), stoneM, NM); { const o3 = new T.Object3D(); for (let i = 0; i < NM; i++) { const a = i / NM * TAU; o3.position.set(Math.cos(a) * (R + .16), 1.1, Math.sin(a) * (R + .16)); o3.rotation.set(0, -a + Math.PI / 2, (Math.random() - .5) * .03); o3.scale.set(1, .85 + Math.random() * .3, 1); o3.updateMatrix(); mer.setMatrixAt(i, o3.matrix) } } s.add(mer);
      s.add(new T.AmbientLight(0x4a5070, 1.4)); s.add(new T.HemisphereLight(0x8090d0, 0x1a1420, 1.1)); const mn = new T.DirectionalLight(0xc0ccff, 2.2); mn.position.set(-20, 30, -40); s.add(mn);
      const sg = new T.BufferGeometry(), SP = new Float32Array(2200 * 3); for (let i = 0; i < 2200; i++) { const u = Math.random() * TAU, v = Math.acos(Math.random() * .92), rr = 120; SP[i * 3] = Math.cos(u) * Math.sin(v) * rr; SP[i * 3 + 1] = Math.cos(v) * rr; SP[i * 3 + 2] = Math.sin(u) * Math.sin(v) * rr } sg.setAttribute("position", new T.BufferAttribute(SP, 3));
      s.add(new T.Points(sg, new T.PointsMaterial({ map: dotT, color: 0xdde4ff, size: .8, transparent: true, depthWrite: false, fog: false })));
      const moonT = cv(256, 256, g => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, "rgba(255,250,235,1)"); gr.addColorStop(.28, "rgba(240,240,255,1)"); gr.addColorStop(.32, "rgba(180,190,255,.35)"); gr.addColorStop(1, "rgba(120,130,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256) });
      const mo = new T.Sprite(new T.SpriteMaterial({ map: moonT, fog: false, depthWrite: false })); mo.position.set(-25, 32, -55); mo.scale.set(16, 16, 1); s.add(mo);
      // облака, которые медленно идут ниже уровня башни, и пара — мимо луны
      const cloudT = cv(256, 256, g => { for (let k = 0; k < 40; k++) { const x = 40 + Math.random() * 176, y = 70 + Math.random() * 116, r2 = 20 + Math.random() * 46, gr = g.createRadialGradient(x, y, 0, x, y, r2); gr.addColorStop(0, "rgba(255,255,255,.22)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256) } });
      const clouds = []; for (let k = 0; k < 9; k++) { const lowC = k < 6, m = new T.Mesh(new T.PlaneGeometry(lowC ? 70 : 40, lowC ? 70 : 18), new T.MeshBasicMaterial({ map: cloudT, color: lowC ? 0x6a7498 : 0x9aa6d0, transparent: true, depthWrite: false, fog: false, opacity: lowC ? .55 : .5 }));
        if (lowC) { m.rotation.x = -Math.PI / 2; m.position.set((Math.random() - .5) * 120, -9 - k * 3, (Math.random() - .5) * 120) } else { m.position.set(-25 + (k - 7) * 22, 30 + Math.random() * 6, -60); } m.userData.v = (lowC ? .5 : .35) * (.6 + Math.random() * .8); s.add(m); clouds.push(m) }
      // внизу лес вокруг башни, забор с катушками и красными огнями, вдали огни Сентфора
      const GY = -52, tr = new T.InstancedMesh(new T.ConeGeometry(1, 1, 7).translate(0, .5, 0), new T.MeshStandardMaterial({ color: 0x1c2a26, roughness: 1 }), 900); { const o3 = new T.Object3D(); let n = 0; for (let i = 0; i < 900; i++) { const a = Math.random() * TAU, rr = 14 + Math.pow(Math.random(), .7) * 110; o3.position.set(Math.cos(a) * rr, GY, Math.sin(a) * rr); const h = 9 + Math.random() * 9; o3.scale.set(h * .28, h, h * .28); o3.updateMatrix(); tr.setMatrixAt(n++, o3.matrix) } } s.add(tr);
      const gnd = new T.Mesh(new T.CircleGeometry(220, 48), new T.MeshStandardMaterial({ color: 0x111720, roughness: 1 })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = GY; s.add(gnd);
      const redT = cv(64, 64, g => { const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,90,70,1)"); gr.addColorStop(.25, "rgba(255,40,30,.5)"); gr.addColorStop(1, "rgba(255,0,0,0)"); g.fillStyle = gr; g.fillRect(0, 0, 64, 64) });
      const reds = []; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + .2, sp2 = new T.Sprite(new T.SpriteMaterial({ map: redT, transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending })); sp2.position.set(Math.cos(a) * 24, GY + 7, Math.sin(a) * 24); sp2.scale.setScalar(1.6); sp2.userData.ph = Math.random() * 6; s.add(sp2); reds.push(sp2) }
      const town = new T.BufferGeometry(), TP = []; for (let i = 0; i < 260; i++) { const a = 2.1 + (Math.random() - .5) * .7, rr = 150 + Math.random() * 50; TP.push(Math.cos(a) * rr, GY + 1 + Math.random() * 3, Math.sin(a) * rr) } town.setAttribute("position", new T.Float32BufferAttribute(TP, 3));
      s.add(new T.Points(town, new T.PointsMaterial({ map: dotT, color: 0xffc27a, size: 1.4, transparent: true, depthWrite: false, fog: false, opacity: .8 })));
      // морозник у парапета и в трещинах
      { const bl = new T.InstancedMesh(bloomG, bloomM, 700), lf = new T.InstancedMesh(helG, leafM, 420); let nb = 0, nl = 0;
        for (let i = 0; i < 150; i++) { const a = Math.random() * TAU, rr = R - .4 - Math.random() * 1.4, b = V3(Math.cos(a) * rr, 0, Math.sin(a) * rr); if (b.z > 3.4 && Math.abs(b.x + .7) < 2.2) continue;
          for (let q = 0; q < 3 && nl < 420; q++) { const k = .45 + Math.random() * .25; lf.setMatrixAt(nl++, place(b, V3(0, 1, 0).add(V3(Math.random() - .5, 0, Math.random() - .5).multiplyScalar(.6)), V3(Math.cos(Math.random() * 6), 0, Math.sin(Math.random() * 6)), k, k * 2.2, k)) }
          for (let q = 0; q < 5 && nb < 700; q++) { const bp = b.clone().add(V3((Math.random() - .5) * .5, .2 + Math.random() * .45, (Math.random() - .5) * .5)); bl.setMatrixAt(nb++, place(bp, V3(0, .6, 0).add(inward(a).multiplyScalar(.6)).add(V3(Math.random() - .5, Math.random() - .5, Math.random() - .5)), V3(Math.random() - .5, Math.random() - .5, Math.random() - .5), .2, .2, .2)) } }
        bl.count = nb; lf.count = nl; s.add(bl, lf) }
      // колокол под каменной аркой
      const bronze = new T.MeshStandardMaterial({ color: 0x6a5638, metalness: .45, roughness: .55, emissive: 0x16201a, emissiveIntensity: 1 });
      [-1.15, 1.15].forEach(x => { const pl = new T.Mesh(new T.BoxGeometry(.5, 3.4, .5), stoneM); pl.position.set(x, 1.7, 0); s.add(pl); RM.cols.push({ x, z: 0, r: .55 }) });
      const beam = new T.Mesh(new T.BoxGeometry(2.9, .32, .5), new T.MeshStandardMaterial({ map: woodT, color: 0x4a3a30, roughness: .9 })); beam.position.set(0, 3.38, 0); s.add(beam);
      const archB = new T.Mesh(new T.TorusGeometry(1.15, .16, 8, 24, Math.PI), stoneM); archB.position.set(0, 3.55, 0); s.add(archB);
      const bellG = new T.Group(); bellG.position.set(0, 3.2, 0); s.add(bellG);
      const prof = [[0, 0], [.12, 0], [.18, -.06], [.24, -.25], [.3, -.55], [.4, -.82], [.55, -1.0], [.6, -1.06], [.58, -1.1], [.48, -1.05]].map(([x, y]) => new T.Vector2(x, y));
      const bellM = new T.Mesh(new T.LatheGeometry(prof, 40), bronze); bellM.material.side = T.DoubleSide; bellG.add(bellM);
      const crown = new T.Mesh(new T.TorusGeometry(.09, .03, 8, 16), bronze); crown.position.y = .05; bellG.add(crown);
      const clap = new T.Group(); bellG.add(clap); const rod = new T.Mesh(new T.CylinderGeometry(.018, .018, .8, 6).translate(0, -.4, 0), bronze); const ball = new T.Mesh(new T.SphereGeometry(.09, 12, 10), bronze); ball.position.y = -.85; clap.add(rod, ball);
      const bhit = new T.Mesh(new T.BoxGeometry(1.3, 1.4, 1.3), new T.MeshBasicMaterial({ visible: false })); bhit.position.y = -.55; bhit.userData.bell = 1; bellG.add(bhit); RM.pick.push(bhit); RM.cols.push({ x: 0, z: 0, r: .8 });
      let sw = 0, swV = 0, rung = 0;
      RM.ring = () => { swV += .9; sfx("bell", .9); ach("bell"); const first = !GS.bell; if (first) { GS.bell = 1; save() } if (!rung) { rung = 1; line(L.bell, 3200); setTimeout(() => room === RM && line(L.bell2, 2600), 3600); if (first) setTimeout(() => room === RM && line(L.bellDown, 3600), 6800) } };
      // люк в полу: крышка откинута, внизу темнота и тёплый свет свечей с лестницы
      const HZ = 4.8, HX = -1.6, hg = new T.Group(); hg.position.set(HX, 0, HZ); s.add(hg);
      const hole = new T.Mesh(new T.PlaneGeometry(1.2, 1.2), new T.MeshBasicMaterial({ color: 0x000000 })); hole.rotation.x = -Math.PI / 2; hole.position.y = .01; hg.add(hole);
      const glowH = new T.Mesh(new T.PlaneGeometry(1.1, 1.1), new T.MeshBasicMaterial({ map: warmT, color: new T.Color(.5, .3, .15), transparent: true, depthWrite: false, blending: T.AdditiveBlending })); glowH.rotation.x = -Math.PI / 2; glowH.position.y = .015; hg.add(glowH);
      [[0, .65, 1.5, .14], [0, -.65, 1.5, .14], [.65, 0, .14, 1.16], [-.65, 0, .14, 1.16]].forEach(([x, z, w2, d2]) => { const b = new T.Mesh(new T.BoxGeometry(w2, .1, d2), stoneM); b.position.set(x, .05, z); hg.add(b) });
      [-.32, .32].forEach(x => { const r2 = new T.Mesh(new T.CylinderGeometry(.03, .03, .9, 6), new T.MeshStandardMaterial({ map: woodT, color: 0x5a4636 })); r2.position.set(x, .15, -.2); r2.rotation.x = .35; hg.add(r2) });
      const lidG = new T.Group(); lidG.position.set(0, .1, -.6); lidG.rotation.x = -1.95; hg.add(lidG); const lid = makeHatchLid(); lid.position.set(0, 0, .6); lidG.add(lid);
      const hh = new T.Mesh(new T.BoxGeometry(1.4, .6, 1.4), new T.MeshBasicMaterial({ visible: false })); hh.position.y = .3; hh.userData.down = 1; hg.add(hh); RM.exit = hh; RM.pick.push(hh); RM.cols.push({ x: HX, z: HZ, r: .75 });
      RM.say = L.top; RM.exitHint = L.hatchExit; RM.tick = (t, dt2) => { if (!RM.ended && t - (RM.t0 || (RM.t0 = t)) > 6) { RM.ended = 1; line(SECRETS.every(k => got[k]) ? L.topEnd : L.topEnd2, 5000) }
        const d3 = Math.min(.05, t - (RM.lt || t)); RM.lt = t; swV += (-sw * 9 - swV * .6) * d3; sw += swV * d3; bellG.rotation.x = sw * .35; clap.rotation.x = -sw * .2 + Math.sin(t * 1.3) * .01;
        clouds.forEach(m => { m.position.x += m.userData.v * d3; if (m.position.x > 80) m.position.x = -80 });
        reds.forEach(r2 => { r2.material.opacity = (Math.sin(t * 2.2 + r2.userData.ph) > .6) ? 1 : .08 }) } }
    else if (name === "crypt") { // склеп из 23 серии: готическое окно с луной, луч на каменный гроб, трещина
      RM = shell(4.8, 6.4, 4.6, { wall: 0x6f7396, floor: 0x77789a }); const S = RM.s; S.fog = new T.FogExp2(0x0a0d22, .06); S.background = new T.Color(0x05060f);
      S.add(new T.HemisphereLight(0x4a5aa8, 0x0a0814, .6));
      const WZ = -3.17, WY = 1.35, WW = 1.25, WH = 2.75;
      const pointed = (w, h) => { const r = w * .8, th = Math.acos((w / 2 - r) / r), y0 = h - r * Math.sin(th), sh = new T.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(-w / 2, y0); sh.absarc(-w / 2 + r, y0, r, Math.PI, th, true); sh.absarc(w / 2 - r, y0, r, Math.PI - th, 0, true); sh.lineTo(w / 2, 0); sh.lineTo(-w / 2, 0); return sh };
      const skyT = cv(256, 512, (g, w, h) => { const q = g.createLinearGradient(0, 0, 0, h); q.addColorStop(0, "#04060f"); q.addColorStop(.5, "#0c1534"); q.addColorStop(1, "#18264f"); g.fillStyle = q; g.fillRect(0, 0, w, h);
        for (let k = 0; k < 40; k++) { g.fillStyle = `rgba(220,230,255,${.3 + Math.random() * .5})`; g.fillRect(Math.random() * w, Math.random() * h * .6, 1.5, 1.5) }
        const m = g.createRadialGradient(170, 120, 0, 170, 120, 90); m.addColorStop(0, "rgba(255,255,255,1)"); m.addColorStop(.22, "rgba(235,245,255,1)"); m.addColorStop(.3, "rgba(170,200,255,.55)"); m.addColorStop(1, "rgba(120,160,255,0)"); g.fillStyle = m; g.fillRect(0, 0, w, h) });
      const win = new T.Mesh(new T.ShapeGeometry(pointed(WW, WH), 24), new T.MeshBasicMaterial({ map: skyT, fog: false, color: new T.Color(.95, 1, 1.1) }));
      { const uv = win.geometry.attributes.uv, pa = win.geometry.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, pa.getX(i) / WW + .5, pa.getY(i) / WH) }
      win.position.set(0, WY, WZ + .02); S.add(win);
      const stone = new T.MeshStandardMaterial({ map: stx("wall_c.jpg", 1, 1, 1), normalMap: stx("wall_n.jpg", 0, 1, 1), color: 0x8a8ead, roughness: .9 });
      const frame = new T.Mesh(new T.ExtrudeGeometry((() => { const o2 = pointed(WW + .36, WH + .26); o2.holes.push(pointed(WW, WH)); return o2 })(), { depth: .22, bevelEnabled: false, curveSegments: 24 }), stone); frame.position.set(0, WY - .13, WZ - .05); S.add(frame);
      const bar = new T.Mesh(new T.BoxGeometry(.06, WH - .3, .08), stone); bar.position.set(0, WY + (WH - .3) / 2, WZ + .05); S.add(bar);
      const sill = new T.Mesh(new T.BoxGeometry(WW + .6, .14, .5), stone); sill.position.set(0, WY - .07, WZ + .12); S.add(sill);
      // цветы и листья как на стенах башни (те же модели и материалы), лианы свисают с потолка и обвивают окно
      { const rr = k => V3(Math.random() - .5, Math.random() - .5, Math.random() - .5).multiplyScalar(k * 2), cB = new T.Color(), BLm = [], BLc = [], LFm = [], LFc = [], IVm = [], IVc = [], vines = [];
        const bl = (p, face, k) => { BLm.push(place(p, face, rr(1), k, k, k).clone()); const q = Math.random(); BLc.push(q < .5 ? [1, 1, 1] : q < .75 ? [1.06, .88, 1.08] : [.82, .84, 1.08]) };
        const lc = () => { const v = .55 + Math.random() * .4; return [v * (.9 + Math.random() * .2), v, v * .9] };
        const lf = (p, face, k) => { LFm.push(place(p, face, V3(0, -1, 0).add(rr(.9)), k, k * (1 + Math.random()), k).clone()); LFc.push(lc()) };
        const iv = (p, face, ext, k) => { IVm.push(place(p, face, ext, k, k, k).clone()); IVc.push(lc()) };
        const BZ = -3.2 + .06, wallF = () => V3(0, -.1, 1).add(rr(.4));
        // гуще всего по бокам окна и над аркой, реже по стене до пола
        for (let n = 0; n < 260; n++) { const sd = n % 2 ? 1 : -1, top = Math.random() < .25, x = top ? (Math.random() - .5) * (WW + 1.2) : sd * (WW / 2 + .22 + Math.pow(Math.random(), 1.6) * .9), y = top ? WY + WH + Math.random() * .7 : .2 + Math.pow(Math.random(), .7) * (WY + WH);
          const p = V3(x, y, BZ + Math.random() * .1); if (Math.random() < .45) bl(p, wallF(), .14 + Math.random() * .1); else lf(p, wallF(), .26 + Math.random() * .18) }
        // по углам у пола и на боковых стенах
        [[-2.4, 1], [2.4, -1]].forEach(([wx, sgn]) => { for (let n = 0; n < 70; n++) { const z = -3.1 + Math.pow(Math.random(), 1.5) * 4.5, y = Math.pow(Math.random(), 2.2) * 2.4, p = V3(wx + sgn * (.06 + Math.random() * .08), y, z), f = V3(sgn, -.1, 0).add(rr(.4)); if (Math.random() < .4) bl(p, f, .13 + Math.random() * .09); else lf(p, f, .24 + Math.random() * .16) } });
        // лианы: от потолка вниз с провисом, несколько ползут по стене вокруг окна
        const vine = (pts, rad) => { const cur = new T.CatmullRomCurve3(pts), Lc = cur.getLength(); vines.push(new T.TubeGeometry(cur, Math.max(6, Lc / .1 | 0), rad, 4, false));
          for (let n = 0, m = Lc / .07 | 0; n < m; n++) { const t = (n + Math.random() * .6) / m, q = cur.getPointAt(Math.min(1, t)), tg = cur.getTangentAt(Math.min(1, t)), k = (.09 + Math.random() * .07) * (1 - .35 * t), h = V3(Math.random() - .5, 0, Math.random() - .5).normalize();
            iv(q, V3(0, 1, 0).add(rr(.6)), h.add(tg.clone().multiplyScalar(.5)).add(V3(0, -.3, 0)), k) } };
        for (let n = 0; n < 9; n++) { const a = V3((Math.random() - .5) * 4.4, 4.58, -3.1 + Math.random() * 1.6), b = V3(a.x + (Math.random() - .5) * 1.4, 4.58, a.z + Math.random() * 1.5), sag = 1.2 + Math.random() * 1.8, pts = [];
          for (let k = 0; k <= 12; k++) { const t = k / 12, q = a.clone().lerp(b, t); q.y -= Math.sin(t * Math.PI) * sag; pts.push(q) } vine(pts, .008 + Math.random() * .008) }
        for (let n = 0; n < 7; n++) { const x0 = (Math.random() - .5) * 4, len = 1.5 + Math.random() * 2.8, pts = []; for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push(V3(x0 + Math.sin(t * 4 + n) * .12 * t, 4.58 - t * len, -3.12 + Math.random() * .03 + (Math.abs(x0) < WW / 2 + .2 ? .25 * t : 0))) } vine(pts, .007 + Math.random() * .006) }
        [-1, 1].forEach(sd => { const pts = []; for (let k = 0; k <= 16; k++) { const t = k / 16, an = t * Math.PI * .5, xs = WW / 2 + .26; pts.push(V3(sd * (t < .5 ? Math.sin(an * 2) * xs : xs + Math.sin(t * 11) * .04), t < .5 ? WY + WH + .15 - (1 - Math.cos(an * 2)) * WH * .35 : WY + WH * .65 - (t - .5) * 2 * (WY + WH * .65 - .5), BZ + .04)) } vine(pts, .013) });
        // гроб изнутри доверху в морознике (дно на .55, гроб в z = -1.25); над маской цветов нет, она лежит сверху
        for (let n = 0; n < 340; n++) { const x = (Math.random() - .5) * 1.8, z = -1.25 + (Math.random() - .5) * .56, y = .56 + Math.random() * .1; if (((x + .2) / .2) ** 2 + ((z + 1.25) / .15) ** 2 < 1) continue;
          const p = V3(x, y, z), up = V3(0, 1, 0).add(rr(.45)); if (Math.random() < .55) bl(p, up, .1 + Math.random() * .07); else lf(p, V3(0, 1, 0).add(rr(.2)), .13 + Math.random() * .08) }
        const inst = (g, m, M2, C) => { if (!M2.length) return; const im = new T.InstancedMesh(g, m, M2.length), ca = new Float32Array(M2.length * 3); M2.forEach((x, n) => { im.setMatrixAt(n, x); ca.set(C[n], n * 3) }); im.instanceColor = new T.InstancedBufferAttribute(ca, 3); im.computeBoundingSphere(); S.add(im) };
        inst(bloomG, bloomM, BLm, BLc); inst(helG, leafM, LFm, LFc); inst(ivyG, leafM, IVm, IVc);
        const vm = new T.Mesh(mergeGeometries(vines), stemM); S.add(vm); vines.forEach(g => g.dispose()) }
      // каменный гроб с резьбой на боку
      const carveT = cv(512, 128, (g, w, h) => { g.fillStyle = "#7c8098"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(28,30,48,.7)"; g.lineWidth = 5; g.strokeRect(10, 10, w - 20, h - 20);
        for (let x = 40; x < w - 20; x += 72) { g.beginPath(); g.arc(x, h / 2, 22, Math.PI * .2, Math.PI * 1.8); g.stroke(); g.beginPath(); g.arc(x + 36, h / 2, 14, Math.PI * 1.2, Math.PI * 2.8); g.stroke(); g.beginPath(); g.moveTo(x - 22, h / 2); g.bezierCurveTo(x, h / 2 + 30, x + 30, h / 2 - 30, x + 50, h / 2); g.stroke() }
        g.strokeStyle = "rgba(200,205,230,.35)"; g.lineWidth = 2; g.strokeRect(13, 13, w - 26, h - 26) });
      const monoT = cv(256, 256, (g, w, h) => { g.fillStyle = "#7c8098"; g.fillRect(0, 0, w, h); for (let k = 0; k < 900; k++) { const v = 90 + Math.random() * 70 | 0; g.fillStyle = `rgba(${v},${v + 3},${v + 18},.18)`; const r2 = 1 + Math.random() * 9; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, r2, 0, 6.3); g.fill() } });
      monoT.wrapS = monoT.wrapT = T.RepeatWrapping; const mono = new T.MeshStandardMaterial({ map: monoT, color: 0x5c5f78, roughness: .92 });
      const sideM = new T.MeshStandardMaterial({ map: carveT, color: 0x80849e, roughness: .9 });
      // гроб полый: стенки и дно, внутри темно; крышка — группа, её можно сдвинуть
      const CZ = -1.25, inM = new T.MeshStandardMaterial({ map: monoT, color: 0x2a2b36, roughness: 1 });
      [[0, .41, .45, 2.2, .82, .1, [sideM, sideM, mono, mono, sideM, inM]], [0, .41, -.45, 2.2, .82, .1, [sideM, sideM, mono, mono, inM, sideM]], [1.05, .41, 0, .1, .82, .8, [sideM, inM, mono, mono, sideM, sideM]], [-1.05, .41, 0, .1, .82, .8, [inM, sideM, mono, mono, sideM, sideM]], [0, .5, 0, 2.0, .1, .8, inM]].forEach(([x, y, z, w, h, d, m]) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, CZ + z); S.add(b) });
      const plinth = new T.Mesh(new T.BoxGeometry(2.4, .1, 1.2), mono); plinth.position.set(0, .05, CZ); S.add(plinth);
      const lidG = new T.Group(); lidG.position.set(0, .9, CZ); S.add(lidG);
      const lid = new T.Mesh(new T.BoxGeometry(2.36, .16, 1.14), mono); lidG.add(lid);
      const lid2 = new T.Mesh(new T.BoxGeometry(2.1, .08, .9), mono); lid2.position.set(0, .12, 0); lidG.add(lid2);
      // трещина: проявляется по мере того, как растёт (канал R — порядок появления)
      const crT = cv(512, 256, (g, w, h) => { g.lineCap = "round"; let x = w * .62, y = 0; const pts = [[x, y]]; while (y < h) { x += (Math.random() - .5) * 60; y += 14 + Math.random() * 16; pts.push([x, Math.min(h, y)]) }
        pts.forEach((p, k) => { if (!k) return; const a = pts[k - 1], v = Math.round(k / pts.length * 255); g.strokeStyle = `rgb(${v},0,0)`; g.lineWidth = 7 - k / pts.length * 3; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(p[0], p[1]); g.stroke();
          if (k % 3 === 0) { g.lineWidth = 2; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + (Math.random() - .5) * 70, p[1] + Math.random() * 30); g.stroke() } }) });
      crT.colorSpace = T.NoColorSpace;
      const crM = new T.ShaderMaterial({ uniforms: { uMap: { value: crT }, uP: { value: 0 } }, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2,
        vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
        fragmentShader: "uniform sampler2D uMap; uniform float uP; varying vec2 vUv; void main(){ vec4 c=texture2D(uMap,vUv); float on=step(.001,c.r+c.a*.0)*step(c.r,uP)*c.a; if(on<.5) discard; gl_FragColor=vec4(.01,.008,.02,.95); }" });
      const crTop = new T.Mesh(new T.PlaneGeometry(1.1, .9), crM); crTop.rotation.x = -Math.PI / 2; crTop.position.set(.35, .161, 0); lidG.add(crTop);
      const crFront = new T.Mesh(new T.PlaneGeometry(.7, .82), crM); crFront.position.set(.42, .45, CZ + .502); S.add(crFront);
      // лунный луч из окна на крышку и холодный свет
      const mb = new T.Mesh(new T.CylinderGeometry(.5, 1.1, 3.6, 18, 1, true).translate(0, -1.8, 0), new T.ShaderMaterial({ uniforms: {}, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
        vertexShader: "varying float vY; varying vec3 vN,vV; void main(){ vY=-position.y/3.6; vec4 wp=modelMatrix*vec4(position,1.); vN=normalize(mat3(modelMatrix)*normal); vV=cameraPosition-wp.xyz; gl_Position=projectionMatrix*viewMatrix*wp; }",
        fragmentShader: "varying float vY; varying vec3 vN,vV; void main(){ float f=abs(dot(normalize(vN),normalize(vV))); float a=.09*pow(f,2.5)*(1.-vY*.6); gl_FragColor=vec4(vec3(.55,.68,1.)*a,1.); }" }));
      mb.position.set(.15, WY + WH * .55, WZ + .3); mb.quaternion.setFromUnitVectors(V3(0, -1, 0), V3(-.05, -.62, .78).normalize()); S.add(mb);
      const moon = new T.SpotLight(0x8fa8ff, 10, 9, .5, .6, 1.4); moon.position.set(.2, WY + WH * .6, WZ + .1); moon.target.position.set(0, .9, CZ); S.add(moon, moon.target);
      // трещины в полу
      const fcT = cv(256, 256, (g) => { g.strokeStyle = "rgba(0,0,0,.8)"; g.lineWidth = 2.5; for (let k = 0; k < 5; k++) { let x = 128, y = 128; g.beginPath(); g.moveTo(x, y); const an = Math.random() * 6.28; for (let j = 0; j < 9; j++) { x += Math.cos(an + (Math.random() - .5)) * 16; y += Math.sin(an + (Math.random() - .5)) * 16; g.lineTo(x, y) } g.stroke() } });
      [[-1.4, -.3], [1.5, .6], [.4, .9]].forEach(([x, z]) => { const m = new T.Mesh(new T.PlaneGeometry(1.4, 1.4), new T.MeshBasicMaterial({ map: fcT, transparent: true, depthWrite: false, opacity: .8 })); m.rotation.set(-Math.PI / 2, 0, Math.random() * 6); m.position.set(x, .006, z); S.add(m) });
      RM.crack = { m: crM, t: 0, done: !!GS.crypt, look: 0 }; if (GS.crypt) crM.uniforms.uP.value = 1.01;
      // внутри — только маска (передняя часть, с прорезями для глаз; изнанка тёмная): лежит макушкой к изголовью и чуть повёрнута лицом к тебе
      const maskM = [], maskG = new T.Group(); maskG.matrixAutoUpdate = false; maskG.matrix.makeBasis(V3(0, .57, -.82), V3(-1, 0, 0), V3(0, .82, .57)).setPosition(-.2, .6, CZ); S.add(maskG);
      load("mask.glb").then(g => { if (!g || !alive) return; g.scale.setScalar(.17); g.position.set(0, -.95 * .17, 0); g.traverse(o3 => { if (o3.isMesh) { const m = o3.material; m.color.setRGB(.62, .6, .64); m.envMapIntensity = .15; m.metalness = 0; m.metalnessMap = null; m.side = T.DoubleSide; m.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace("#include <dithering_fragment>", "#include <dithering_fragment>\n if (!gl_FrontFacing) gl_FragColor.rgb *= .2;") }; o3.userData.mask = 1; maskM.push(o3); if (GS.lid) RM.pick.push(o3) } }); maskG.add(g) });
      let cg = null; if (GS.gears.indexOf(5) < 0) { cg = gearMesh(5); cg.g.position.set(.3, .755, CZ + .12); cg.g.rotation.set(.42, .9, -.12); cg.g.scale.setScalar(1.2); cg.m.material = gearM.clone(); cg.m.material.emissiveIntensity = .16; cg.g.children[1].userData.min = .2; cg.g.children[1].scale.setScalar(.22); S.add(cg.g); if (GS.lid) RM.pick.push(cg.m) }
      const lidHit = new T.Mesh(new T.BoxGeometry(2.4, .5, 1.2), new T.MeshBasicMaterial({ visible: false })); lidHit.position.set(0, .95, CZ); lidHit.userData.lid = 1; S.add(lidHit);
      let lidK = GS.lid ? 1 : 0, lidT0 = 0; const lidPose = k => { const a = Math.min(1, k / .6), e1 = a * a * (3 - 2 * a), b = Math.max(0, (k - .6) / .4), e2 = b * b; // сначала съезжает назад, потом опрокидывается за гроб и ложится на край
        lidG.position.set(0, .9 - .43 * e2, CZ - .7 * e1 - .19 * e2); lidG.rotation.set(-.75 * e2, 0, 0) }; lidPose(lidK);
      const lidReady = () => { if (RM.crack.done && !GS.lid && RM.pick.indexOf(lidHit) < 0) RM.pick.push(lidHit) }; lidReady();
      RM.lid = () => { if (GS.lid || lidT0) return; lidT0 = performance.now(); const i = RM.pick.indexOf(lidHit); if (i >= 0) RM.pick.splice(i, 1); sfx("lid", 1); setTimeout(() => { if (room !== RM) return; GS.lid = 1; save(); maskM.forEach(m => RM.pick.push(m)); if (cg && GS.gears.indexOf(5) < 0) RM.pick.push(cg.m); line(L.lidOpen, 3400); ach("lid") }, 3600) };
      RM.mask = () => { line(L.maskTap, 3200); solve("mask") };
      RM.cz = CZ; RM.say = GS.lid ? L.lidAgain : GS.crypt ? L.cryptAgain : L.crypt;
      const cDir = new T.Vector3();
      RM.tick = (t) => { if (lidT0 && lidK < 1) { lidK = Math.min(1, (performance.now() - lidT0) / 3500); lidPose(lidK) } const c = RM.crack; if (c.done) return; cam.getWorldDirection(cDir); const dx = 0 - px, dz = CZ - pz, dl = Math.hypot(dx, dz), facing = (cDir.x * dx + cDir.z * dz) / Math.max(dl, .01);
        const d2 = Math.min(.1, t - (c.lt || t)); c.lt = t; if (!c.t) { if (dl < 3.4 && facing > .8 && !busy) c.look += d2; else c.look = Math.max(0, c.look - d2 / 2); if (c.look > 1.6) { c.t = t; sfx("stone", .95) } }
        else { const k = Math.min(1, (t - c.t) / 3.2); c.m.uniforms.uP.value = k * 1.01; moon.intensity = 10 * (.75 + .25 * Math.sin(t * 40) * (1 - k)); eyeY += Math.sin(t * 70) * .004 * (1 - k);
          if (k >= 1) { c.done = true; moon.intensity = 10; GS.crypt = 1; save(); line(L.cryptCrack, 3200); ach("crypt"); lidReady() } } } }
    rooms[name] = RM; return RM }
  function addNote(RM, n, p) { const m = new T.Mesh(new T.PlaneGeometry(.26, .19), noteM); m.position.copy(p); m.rotation.set(-Math.PI / 2, 0, .4); m.userData.note = { n, s: n === 4 ? "equinox" : null }; RM.s.add(m); RM.pick.push(m) }

  /* ---------- модели (Hyper3D) ---------- */
  const gl = new GLTFLoader(); gl.setMeshoptDecoder(MeshoptDecoder);
  const load = n => new Promise(res => gl.load(M(n), g => res(g.scene), undefined, () => res(null)));
  function firstMesh(g) { let m = null; g.updateMatrixWorld(true); g.traverse(o3 => { if (!m && o3.isMesh) m = o3 }); return m }
  function tint(mat, r2, g2, b) { mat.color.setRGB(r2, g2, b); mat.envMapIntensity = .3; if (mat.map) mat.map.anisotropy = 4; return mat }
  // она — объёмная модель (Hyper3D), матовая; в темноте видны только светящиеся глаза
  const woEye = [V3(-.031, 1.747, .123), V3(.042, 1.732, .106)];
  const woGl = woEye.map(() => { const g2 = new T.Sprite(new T.SpriteMaterial({ map: dotT, color: 0xdfe8ff, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0, fog: false })); g2.scale.setScalar(.06); g2.visible = false; sc.add(g2); return g2 });
  setTimeout(() => alive && !noScare && load("woman3d.glb").then(g => { if (!g || !alive) return; g.traverse(o3 => { if (o3.isMesh) { const m = o3.material; m.color.setRGB(.36, .35, .38); m.metalnessMap = null; m.roughnessMap = null; m.metalness = 0; m.roughness = 1; m.envMapIntensity = .1; m.transparent = true; m.opacity = 0; m.needsUpdate = true; woMats.push(m) } }); const gg = new T.Group(); gg.add(g); gg.visible = false; sc.add(gg); woM = gg }), 15000);
  load("shadow.glb").then(g => { if (!g || !alive) return; g.traverse(o3 => { if (o3.isMesh) { const m = o3.material; m.color.setRGB(.3, .29, .34); m.envMapIntensity = .1; m.roughness = 1; m.transparent = true; m.opacity = 0; wrMats.push(m) } });
    g.scale.setScalar(1.05); g.visible = shS >= 0; if (shS >= 0) fig.visible = false; sc.add(g); wr = g });
  const ready = Promise.all([load("step.glb"), load("stack.glb"), load("step_lo.glb")]).then(([st, stk, stl]) => {
    if (!alive) return;
    // ступени: подробная модель вблизи, упрощённая вдали; кусками по 8, чтобы невидимые не рисовались
    const smh = st && firstMesh(st), sml = stl && firstMesh(stl);
    if (smh) { const fitOf = mm => { const box = new T.Box3().setFromBufferAttribute(mm.geometry.attributes.position).applyMatrix4(mm.matrixWorld), sz = box.getSize(V3()), c = box.getCenter(V3()); return new T.Matrix4().makeScale(2.6 / sz.x, .26 / sz.y, 1.15 / sz.z).multiply(new T.Matrix4().makeTranslation(-c.x, -c.y, -c.z)).multiply(mm.matrixWorld) };
      const fitH = fitOf(smh), fitL = sml ? fitOf(sml) : null, matH = tint(smh.material, .32, .31, .38), matL = sml ? tint(sml.material, .32, .31, .38) : null, q = new T.Quaternion(), e = new T.Euler(), m4 = new T.Matrix4();
      for (let c0 = -1; c0 < STEPS; c0 += 8) { const n = Math.min(8, STEPS - c0), hi = new T.InstancedMesh(smh.geometry, matH, n), lo = sml ? new T.InstancedMesh(sml.geometry, matL, n) : null;
        for (let j = 0; j < n; j++) { const i = c0 + j, p = stepAt(i); e.set(0, -p.a + (((i % 2) + 2) % 2 ? Math.PI : 0), 0); q.setFromEuler(e); const base = new T.Matrix4().compose(V3(p.x, p.y, p.z), q, V3(1, 1, 1)); hi.setMatrixAt(j, m4.copy(base).multiply(fitH)); if (lo) lo.setMatrixAt(j, m4.copy(base).multiply(fitL)) }
        [hi, lo].forEach(m => { if (!m) return; m.castShadow = true; m.receiveShadow = true; m.computeBoundingSphere(); sc.add(m) }); if (lo) lods.push([hi, lo]) }
      sc.remove(stepBox) }
    const km = stk && firstMesh(stk);
    if (km) { const box = new T.Box3().setFromBufferAttribute(km.geometry.attributes.position).applyMatrix4(km.matrixWorld), sz = box.getSize(V3()), c = box.getCenter(V3());
      const base = new T.Matrix4().makeScale(1.6 / sz.x, 1.6 / sz.x, 1.6 / sz.x).multiply(new T.Matrix4().makeTranslation(-c.x, -box.min.y, -c.z)).multiply(km.matrixWorld);
      const mat = tint(km.material, .5, .48, .56);
      STACKS.forEach(([a, k]) => { const m = new T.Mesh(km.geometry, mat); m.castShadow = m.receiveShadow = true; m.matrixAutoUpdate = false; m.matrix.compose(V3(Math.cos(a) * (R - 1.4), FLOOR, Math.sin(a) * (R - 1.4)), new T.Quaternion().setFromEuler(new T.Euler(0, -a + Math.PI / 2, 0)), V3(k, k, k)).multiply(base); sc.add(m) }) }
  });

  /* ---------- звук ---------- */
  // пока звуки только записанные (шаги); синтезированные выключены, пока не найдём настоящие
  const SYN = false;
  let ac = null, master = null, bus = null, revG = [], revRoom = -1, noiseB = null, stepsB = null, stepsSrc = null, stepsG = null;
  const SFX = { steps: "tower_steps.mp3", open: "tower_door_open.mp3", close: "tower_door_close.mp3", slow: "tower_door_slow.mp3", lock: "tower_door_lock.mp3", paper: "tower_paper.mp3", clock: "tower_clock.mp3", wind: "tower_wind.mp3", lid: "tower_lid.mp3", heart: "tower_heart.mp3", breath: "tower_breath.mp3", creak: "tower_creak.mp3", handle: "tower_handle.mp3", step: "tower_step.mp3", fall: "tower_fall.mp3", ring: "tower_ring.mp3", bell: "tower_bell.mp3", hiss: "tower_hiss.mp3", tclick: "tower_tapeclick.mp3", stone: "tower_stone.mp3", knock: "tower_knock.mp3", hum: "tower_hum.mp3" }, sfxB = {};
  function sfx(k, vol, delay) { const b = sfxB[k]; if (!ac || !b) return; const t1 = ac.currentTime + (delay || 0), s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = b; g1.gain.value = vol == null ? .8 : vol; s1.connect(g1); g1.connect(bus); s1.start(t1) }
  function audio() {
    if (ac) return; try {
      const A = window.AudioContext || window.webkitAudioContext; ac = new A(); master = ac.createGain(); master.gain.value = noScare ? .45 : .8; master.connect(ac.destination);
      // эхо: всё звучит через шину, от неё сухой сигнал и два ревербератора — каменный колодец и маленькая комната
      bus = ac.createGain(); bus.connect(master);
      const ir = (sec, damp) => { const sr = ac.sampleRate, len = Math.floor(sr * sec), bf = ac.createBuffer(2, len, sr);
        for (let ch = 0; ch < 2; ch++) { const d = bf.getChannelData(ch); let lp = 0; for (let i = 0; i < len; i++) { const tt = i / sr, k = Math.min(.96, damp + tt * .25); lp = lp * k + (Math.random() * 2 - 1) * (1 - k); d[i] = lp * Math.exp(-6.9 * tt / sec) * (tt < .012 ? tt / .012 : 1) * 3 } } return bf };
      [[3.4, .35, .38], [.9, .2, 0]].forEach(([sec, damp, wet], j) => { const cv2 = ac.createConvolver(); cv2.buffer = ir(sec, damp); const wg = ac.createGain(); wg.gain.value = wet; bus.connect(cv2); cv2.connect(wg); wg.connect(master); revG[j] = wg });
      const n = ac.sampleRate * 4, b = ac.createBuffer(1, n, ac.sampleRate), dd = b.getChannelData(0); let last = 0;
      for (let i = 0; i < n; i++) { last = (last + .02 * (Math.random() * 2 - 1)) / 1.02; dd[i] = last * 3.5 }
      Object.keys(SFX).forEach(k => fetch(new URL("../audio/" + SFX[k], import.meta.url)).then(r => r.arrayBuffer()).then(ab => ac.decodeAudioData(ab)).then(bf => { sfxB[k] = bf; if (k === "steps") stepsB = bf; if (k === "wind") ambOn(bf) }).catch(() => { }));
      const src = ac.createBufferSource(); src.buffer = b; src.loop = true; const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 380; const g = ac.createGain(); g.gain.value = SYN ? .35 : 0; src.connect(lp); lp.connect(g); g.connect(bus); src.start();
      noiseB = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const nd = noiseB.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
      (function drip() { if (!alive || !SYN) return; setTimeout(() => { if (!ac || !alive) return; const t = ac.currentTime, os = ac.createOscillator(), og = ac.createGain(); os.frequency.setValueAtTime(1300 + Math.random() * 600, t); os.frequency.exponentialRampToValueAtTime(400, t + .12); og.gain.setValueAtTime(.09, t); og.gain.exponentialRampToValueAtTime(.0001, t + .2); os.connect(og); og.connect(bus); os.start(t); os.stop(t + .22); drip() }, 1800 + Math.random() * 4000) })();
    } catch (e) { }
  }
  function tone(f, type, v, dur, f2) { if (!ac || !SYN) return; const t = ac.currentTime, os = ac.createOscillator(), og = ac.createGain(); os.type = type; os.frequency.setValueAtTime(f, t); if (f2) os.frequency.exponentialRampToValueAtTime(f2, t + dur); og.gain.setValueAtTime(v, t); og.gain.exponentialRampToValueAtTime(.0001, t + dur); os.connect(og); og.connect(bus); os.start(t); os.stop(t + dur + .02) }
  function noise(freq, type, v, dur, delay) { if (!ac || !noiseB || !SYN) return; const t = ac.currentTime + (delay || 0), s = ac.createBufferSource(); s.buffer = noiseB; const f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; const g = ac.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur); s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + dur + .02) }
  function clunk(ok) { if (!ac) return; [[ok ? 220 : 90, .5], [ok ? 330 : 70, .3], [ok ? 660 : 0, .2]].forEach(([f, v]) => { if (f) tone(f, ok ? "triangle" : "sawtooth", v * .5, ok ? 2.4 : .35) }) }
  // стук костяшками: три записанных удара по 0,55 с в файле; hv — тяжелее и ниже (длинный в SOS), muf — глухо, из-за двери
  let knLast = -1;
  function knock(delay, hv, muf) { const b = sfxB.knock; if (!ac || !b) return; let k = Math.random() * 3 | 0; if (k === knLast) k = (k + 1) % 3; knLast = k; const t1 = ac.currentTime + (delay || 0), s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = b; s1.playbackRate.value = (hv ? .8 : .95) + Math.random() * .1; g1.gain.value = (hv ? 1 : .8) * (muf ? 1.2 : 1);
    if (muf) { const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1300; s1.connect(f); f.connect(g1) } else s1.connect(g1); g1.connect(bus); s1.start(t1, k * .55, k === 2 ? .53 : .23) }
  function creak() { if (!ac) return; sfx("open", .7); tone(140, "sawtooth", .05, .7, 70); noise(900, "bandpass", .12, .5) }
  function click() { tone(1800, "square", .05, .03) }
  function chime() { [[880, 0], [1318, .12], [1760, .24]].forEach(([f, d]) => setTimeout(() => tone(f, "sine", .09, 1.2), d * 1000)) }
  function bell() { sfx("bell", room ? .35 : .5) }
  function tick2(odd) { tone(odd ? 2400 : 1900, "square", .012, .025) }
  function pebbles() { sfxPart("stone", .3, 1.4 + Math.random() * .8, .9) }
  function wind() { if (!ac || !noiseB || !SYN) return; const t = ac.currentTime, s = ac.createBufferSource(); s.buffer = noiseB; s.loop = true; const f = ac.createBiquadFilter(); f.type = "bandpass"; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(1400, t + 1.6); const g = ac.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(noScare ? .12 : .35, t + 1.2); g.gain.exponentialRampToValueAtTime(.0001, t + 2.4); s.connect(f); f.connect(g); g.connect(bus); s.start(t); s.stop(t + 2.5) }
  // шаги (запись): петля для того, кто идёт выше, и проход мимо, когда прячешься
  function stepsOn(v, vol) { if (!ac || !stepsB) return; const tn = ac.currentTime;
    if (v && !stepsSrc) { stepsSrc = ac.createBufferSource(); stepsSrc.buffer = stepsB; stepsSrc.loop = true; stepsG = ac.createGain(); stepsG.gain.value = 0; stepsSrc.connect(stepsG); stepsG.connect(bus); stepsSrc.start(tn, Math.random() * 4) }
    if (stepsG) stepsG.gain.setTargetAtTime(v ? vol : 0, tn, v ? .25 : .4);
    if (!v && stepsSrc) { const s0 = stepsSrc; stepsSrc = null; stepsG = null; setTimeout(() => { try { s0.stop() } catch (e) { } }, 2000) } }
  // ветер в башне (запись, петля 78 с с запасом по краям): громче наверху, глухо за стенами в комнатах, медленные порывы
  let ambG = null, ambF = null, ambK = -1, ambT = 0;
  function ambOn(bf) { if (!ac || ambG) return; const s1 = ac.createBufferSource(); s1.buffer = bf; s1.loop = true; s1.loopStart = .25; s1.loopEnd = Math.min(bf.duration, 78.25);
    ambF = ac.createBiquadFilter(); ambF.type = "lowpass"; ambF.frequency.value = 4000; ambG = ac.createGain(); ambG.gain.value = 0; s1.connect(ambF); ambF.connect(ambG); ambG.connect(bus); s1.start(ac.currentTime, .25 + Math.random() * 60) }
  function ambTick(t) { if (!ambG || t - ambT < .2) return; ambT = t; const top = room && room.nm === "top", gust = .82 + .18 * Math.sin(t * .23) * Math.sin(t * .071 + 1.3);
    const v = (room ? (top ? .8 : .13) : .5) * gust * (hb ? .45 : 1) * (hum ? .6 : 1) * (dead ? .2 : fallTop != null && fallTop - fy > 1.6 ? 1.9 : 1), f = room && !top ? 420 : 4000, tn = ac.currentTime;
    ambG.gain.setTargetAtTime(v, tn, .6); if (f !== ambK) { ambK = f; ambF.frequency.setTargetAtTime(f, tn, .4) } }
  // сердце в погоне: удары по одному (без ускорения записи, чтобы не пищало), чем ближе глаза — тем чаще и громче; ветер притихает
  let hbB = null, hb = null, hbT = 0;
  function heartTick(t, k) { if (!ac || !sfxB.heart || t - hbT < .1) return; hbT = t; const tn = ac.currentTime;
    if (k < 0) { hb = null; return }
    if (!hbB) { const src = sfxB.heart, n = Math.floor(1.2 * src.sampleRate); hbB = ac.createBuffer(1, n, src.sampleRate); const d = hbB.getChannelData(0), s0 = src.getChannelData(0), fo = Math.floor(.08 * src.sampleRate); for (let i = 0; i < n; i++) d[i] = s0[i] * (i > n - fo ? (n - i) / fo : 1) }
    if (!hb) hb = { next: tn + .05 };
    while (hb.next < tn + .35) { const s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = hbB; s1.playbackRate.value = 1 + .08 * k; g1.gain.value = .55 + .6 * k; s1.connect(g1); g1.connect(master); s1.start(hb.next); hb.next += 60 / (97 + 63 * k) } }
  // кусок записи с затуханием (скрип приоткрытой двери) и дёрганье ручки: несколько рывков, каждый чуть другой
  function sfxPart(k, vol, off, dur, delay) { const b = sfxB[k]; if (!ac || !b) return; const t1 = ac.currentTime + (delay || 0), s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = b; g1.gain.setValueAtTime(vol, t1); g1.gain.setValueAtTime(vol, t1 + dur - .5); g1.gain.linearRampToValueAtTime(0, t1 + dur); s1.connect(g1); g1.connect(bus); s1.start(t1, off); s1.stop(t1 + dur + .05) }
  function rattle(n, vol, delay) { const b = sfxB.handle; if (!ac || !b) return; let d = delay || 0; for (let i = 0; i < n; i++) { const s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = b; s1.playbackRate.value = .9 + Math.random() * .2; g1.gain.value = vol * (.7 + .3 * Math.random()); s1.connect(g1); g1.connect(bus); s1.start(ac.currentTime + d); d += .15 + Math.random() * .22 } }
  // свои шаги: 10 разных шагов по камню в одном файле, каждый в своей ячейке по 0,6 с
  let stLx = null, stLz = 0, stLy = 0, stD = 0, stLast = -1, stLastK = -1, stRun = 0, stMv = 0, echoNext = 60 + Math.random() * 40;
  function stepOne(vol, delay) { const b = sfxB.step; if (!ac || !b) return; let k = Math.random() * 10 | 0; if (k === stLastK) k = (k + 3) % 10; stLastK = k; const t1 = ac.currentTime + (delay || 0), s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = b; s1.playbackRate.value = .94 + Math.random() * .12; g1.gain.value = vol * (.8 + .2 * Math.random()); s1.connect(g1); g1.connect(bus); s1.start(t1, k * .6, .55) }
  function stepTick(t) { if (stLx == null || dead || fallTop != null) { stLx = px; stLz = pz; stLy = fy; stD = 0; return }
    const d = Math.hypot(px - stLx, pz - stLz, (fy - stLy) * 1.5); stLx = px; stLz = pz; stLy = fy; if (d > .5) return; stD += d; if (d > .002) stMv = t;
    if (stD > 1.05) { stD = 0; stepOne(room ? .28 : .34); stLast = t; stRun++ }
    // ты остановилась, а за спиной — ещё один шаг
    if (stRun > 0 && t - stMv > .3) { if (stRun >= 5 && !room && !noScare && !chase && !wo && !pk && t > echoNext && Math.random() < .3) { stepOne(.27, .15); echoNext = t + 50 + Math.random() * 60 } stRun = 0 } }
  // плеер Миранды: щелчок Play, шипение плёнки, в шипении — тот же SOS, что мигает лампочка, потом щелчок Stop
  let tpS = null;
  function tapePlay(pat, u) { if (!ac || !sfxB.hiss) return; const tn = ac.currentTime; if (tpS) { try { tpS.s.stop(tn + .05); tpS.g.gain.setTargetAtTime(0, tn, .02) } catch (e) { } tpS = null }
    sfxPart("tclick", .8, 0, .55); const s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = sfxB.hiss; s1.loop = true; s1.loopStart = .25; s1.loopEnd = Math.min(sfxB.hiss.duration, 19.25); g1.gain.value = 0; s1.connect(g1); g1.connect(bus); s1.start(tn + .08, .25 + Math.random() * 15);
    const lo = .1, hi = .42; g1.gain.setTargetAtTime(lo, tn + .08, .03); let acc = 0;
    for (let k = 0; k < pat.length; k++) { const len = pat[k] * u; g1.gain.setTargetAtTime(hi, tn + acc, .015); g1.gain.setTargetAtTime(lo, tn + acc + len, .02); acc += len + u; if (k === 2 || k === 5) acc += u * 2 }
    const end = tn + acc + 1.2; g1.gain.setTargetAtTime(0, end, .015); s1.stop(end + .3); sfxPart("tclick", .8, .6, .75, end - tn - .05); const me = tpS = { s: s1, g: g1 }; setTimeout(() => { if (tpS === me) tpS = null }, (end - tn + .5) * 1000) }
  // кто-то поёт внизу: сначала еле слышно и глухо, будто с самого дна, потом всё ближе и чище — и обрывается
  let hum = null, humNext = 140 + Math.random() * 80;
  function humTick(t) { if (!ac || !sfxB.hum) return; const stop = room || dead || chase || wo || fy < FLOOR + .5;
    if (!hum) { if (!stop && !pk && !noScare && !busy && !uiOpen && fy > 6 && fallTop == null && t > humNext) { const tn = ac.currentTime, s1 = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain(); s1.buffer = sfxB.hum; f.type = "lowpass"; f.frequency.value = 350; g.gain.value = 0; s1.connect(f); f.connect(g); g.connect(bus); s1.start(tn); hum = { s: s1, f, g, t0: t, end: 30 + Math.random() * 8, lt: 0 }; setTimeout(() => hum && line(L.hum, 3000), 5000) } return }
    const ht = t - hum.t0, tn = ac.currentTime;
    if (stop || ht > hum.end) { const h = hum; hum = null; humNext = t + 200 + Math.random() * 120; h.g.gain.setTargetAtTime(0, tn, stop ? .4 : .008); try { h.s.stop(tn + 2) } catch (e) { } if (!stop) setTimeout(() => alive && !room && line(L.humEnd, 3200), 700); return }
    if (t - hum.lt < .2) return; hum.lt = t; const k = Math.min(1, ht / 28); hum.g.gain.setTargetAtTime(.06 + .55 * k * k, tn, .5); hum.f.frequency.setTargetAtTime(350 + 4500 * k * k, tn, .5) }
  // её дыхание: с той стороны, где она стоит; пока смотришь на неё — затаилась, отвернёшься — дышит громче и чаще, с каждым шагом ближе
  let bthG = null, bthP = null, bthNext = 0, bthT = 0; const bthV = new T.Vector3();
  function breathTick(t, w) { if (!ac || !sfxB.breath || t - bthT < .1) return; bthT = t; const tn = ac.currentTime;
    if (!w) { if (bthG) { const g0 = bthG; g0.gain.setTargetAtTime(0, tn, .3); bthG = null; bthP = null; setTimeout(() => { try { g0.disconnect() } catch (e) { } }, 1500) } return }
    if (!bthG) { bthG = ac.createGain(); bthG.gain.value = 0; bthP = ac.createStereoPanner ? ac.createStereoPanner() : null; if (bthP) { bthG.connect(bthP); bthP.connect(bus) } else bthG.connect(bus); bthNext = tn + .3 }
    if (tn > bthNext) { const s1 = ac.createBufferSource(); s1.buffer = sfxB.breath; s1.playbackRate.value = .94 + .04 * w.k + Math.random() * .05; s1.connect(bthG); s1.start(tn); bthNext = tn + sfxB.breath.duration / s1.playbackRate.value - .4 - .25 * w.k + Math.random() * (w.k < 2 ? 1.6 : .3) }
    const p = woM.position; cam.getWorldDirection(bthV); const dx = p.x - cam.position.x, dz = p.z - cam.position.z, dl = Math.hypot(dx, dz) || 1, dist = Math.hypot(dx, dz, p.y + 1.6 - cam.position.y);
    if (bthP) bthP.pan.setTargetAtTime(Math.max(-.85, Math.min(.85, (dx * -bthV.z + dz * bthV.x) / dl)), tn, .1);
    const v = w.out ? 0 : w.caught ? 1.1 : Math.min(1, Math.sqrt(3 / Math.max(1, dist))) * (.5 + .17 * w.k) * (w.look > .4 ? .12 : 1) * Math.max(0, w.vis);
    bthG.gain.setTargetAtTime(v, tn, w.look > .4 ? .5 : .25) }
  // часы: громко в комнате с часами, когда они идут; еле слышно по всей башне после запуска
  let clkSrc = null, clkG = null, clkV = -1, clkD = null;
  function clockVol(v) { if (v === clkV || !ac || !sfxB.clock) return; clkV = v; const tn = ac.currentTime;
    if (v > 0 && !clkSrc) { clkSrc = ac.createBufferSource(); clkSrc.buffer = sfxB.clock; clkSrc.loop = true; clkG = ac.createGain(); clkG.gain.value = 0; clkSrc.connect(clkG); clkG.connect(bus); clkSrc.start(tn) }
    if (clkG) clkG.gain.setTargetAtTime(v, tn, .5) }
  function stepsPass(delay) { if (!ac || !stepsB) return; const t1 = ac.currentTime + (delay || 0), s1 = ac.createBufferSource(), g1 = ac.createGain(); s1.buffer = stepsB; g1.gain.setValueAtTime(0, t1); g1.gain.linearRampToValueAtTime(.9, t1 + 1.3); g1.gain.linearRampToValueAtTime(.9, t1 + 2.2); g1.gain.linearRampToValueAtTime(0, t1 + 3.8); s1.connect(g1); g1.connect(bus); s1.start(t1, 1); s1.stop(t1 + 4) }
  // удар о камень; громкий — один раз (если уже ударило только что, второй не нужен), с пугалками выключенными тише
  let thudAt = -9;
  function thud(big) { if (!ac) return; if (big) { if (ac.currentTime - thudAt < .8) return; thudAt = ac.currentTime; sfx("fall", noScare ? .4 : 1) } else sfx("fall", .3) }

  /* ---------- управление и ходьба по лестнице ---------- */
  let yaw = 0, pitch = .08, px = 0, pz = 5.2, fy = FLOOR, vy = 0, eyeY = FLOOR + EH, walking = false, down = null, moved = 0, keys = {}, alive = true, uiOpen = false, room = null, busy = false, loopN = 0;
  cam.position.set(px, eyeY, pz);
  // падение и красный экран
  deadNow = () => dead; let fallTop = null, windOn = 0, edgeT = 0, edgeSaid = 0, dead = false, safeT = 0, climbN = 0, climbSafe = 0, runClean = false, flUsed = true, stareT = 0, darkH = 0, darkY = null, upH = 0; const safeBuf = [];
  const redEl = root.querySelector(".tw-red"), deadEl = root.querySelector(".tw-dead");
  // жизни: три на заход; кончились, и башня возвращает вниз, к началу лестницы
  const LIVES = 3; let lives = LIVES;
  function livesHud(el, lost) { el = el || root.querySelector(".tw-lv"); if (!el) return; el.innerHTML = ""; for (let k = 0; k < LIVES; k++) { const w = document.createElement("i"); w.innerHTML = HEL(k < lives); if (k >= lives) w.className = "lost"; if (lost && k === lives) w.classList.add("new"); el.appendChild(w) } }
  livesHud();
  function land(drop) { if (drop > 2.4) die(); else if (drop > 1.1) { thud(false); eyeY -= Math.min(.35, drop * .12) } }
  function die(title, sub) { if (dead) return; dead = true; const fall = !title; lives = Math.max(0, lives - 1); livesHud(null, true); livesHud(deadEl.querySelector(".tw-lvd"), true); if (!lives) { title = L.livesOut; sub = L.livesOutSub; setTimeout(() => ach("taken"), 1400) } deadEl.querySelector("b").textContent = title || L.dead; busy = true; hold = null; walking = false; down = null; thud(true); sfx("ring", noScare ? .1 : .26, .2); if (fall) GS.deaths++; save(); climbSafe = 0; runClean = false;
    deadEl.querySelector("span").textContent = sub || L.deadSub[(GS.deaths - 1) % L.deadSub.length]; deadEl.querySelector("button").textContent = lives ? L.retry : L.again; deadEl.classList.add("on"); redEl.style.opacity = 0;
    if (fall) setTimeout(() => { ach("fall"); if (GS.deaths >= 5) ach("fall5") }, 1400) }
  deadEl.querySelector("button").onclick = () => { if (!dead) return; click(); const now = performance.now() / 1000 - t0 / 1000; let p = null; for (let i = safeBuf.length - 1; i >= 0; i--) if (now - safeBuf[i].t > 1.2) { p = safeBuf[i]; break } p = p || safeBuf[0] || { px: 0, pz: 5.2, fy: FLOOR, yaw: 0 }; if (!lives) { p = { px: 0, pz: 5.2, fy: FLOOR, yaw: 0 }; lives = LIVES }
    fade.classList.add("on"); setTimeout(() => { deadEl.classList.remove("on"); px = p.px; pz = p.pz; fy = p.fy; eyeY = fy + EH; yaw = p.yaw; pitch = .05; vy = 0; fallTop = null; edgeT = 0; safeBuf.length = 0; dead = false; livesHud(); setTimeout(() => { fade.classList.remove("on"); busy = false }, 200) }, 500) };
  deadEl.addEventListener("pointerdown", e => e.stopPropagation());
  const ray = new T.Raycaster(), ndc = new T.Vector2();
  function rayAt(x, y) { ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam); }
  let hold = null; // особое удержание: стук в дверь Миранды или подкоп
  cvs.addEventListener("pointerdown", e => { audio(); down = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, m: e.pointerType === "mouse" }; moved = 0; try { cvs.setPointerCapture(e.pointerId) } catch (er) { }
    hold = null; if (uiOpen || busy || room) return; rayAt(e.clientX, e.clientY);
    const hd = doorInst && ray.intersectObject(doorInst, false)[0]; if (hd && hd.distance < 3.2) { const D = DOORS[hd.instanceId]; if (D.d.k === "sos" && !got.sos && sosHeard) { hold = { kind: "knock", D, t: performance.now() }; return } }
  });
  cvs.addEventListener("pointermove", e => { if (!down || e.pointerId !== down.id) return; const dx = e.clientX - down.x, dy = e.clientY - down.y; moved += Math.abs(dx) + Math.abs(dy); down.x = e.clientX; down.y = e.clientY; if (moved > 14 && hold && hold.kind === "dig") hold = null; yaw -= dx * .0055; pitch = Math.max(-1.1, Math.min(1.2, pitch - dy * .0045)) });
  function up(e) { if (!down) return; const dur = performance.now() - down.t, short = dur < 260 && moved < 12; walking = false;
    if (hold && hold.kind === "knock" && moved < 20) { sosKnock(dur < 320 ? "." : "-"); hold = null; down = null; return }
    hold = null; if (short) tap(e.clientX, e.clientY); down = null }
  cvs.addEventListener("pointerup", up); cvs.addEventListener("pointercancel", () => { down = null; walking = false; hold = null });
  addEventListener("keydown", kd); addEventListener("keyup", ku);
  function kd(e) { if (e.target && e.target.tagName === "INPUT") return; if (!e.repeat && (e.key === "e" || e.key === "E" || e.key === "у" || e.key === "У" || e.key === "Enter") && typeof doAct === "function") { if (actSOS()) { actDown = performance.now(); return } doAct() } keys[e.key.toLowerCase()] = 1; if (e.key === "Escape") { if (noteBox) closeNote(); else leave() } } function ku(e) { keys[e.key.toLowerCase()] = 0; if (actDown && /^[eEуУ]$|^Enter$/.test(e.key) && actSOS()) { const dur = performance.now() - actDown; actDown = 0; sosKnock(dur < 320 ? "." : "-") } }
  root.querySelector(".tw-x").onclick = leave;
  let flOn = true; const flb = root.querySelector(".tw-fl"); flb.onclick = () => { audio(); click(); flOn = !flOn; flb.classList.toggle("on", flOn) };
  // кнопки ▲ ▼: держишь — идёшь; кнопка действия внизу: то, что рядом и перед глазами
  let mvB = 0; [[".tw-up", 1], [".tw-dn", -1]].forEach(([q, v]) => { const b = root.querySelector(q); const off = () => { if (mvB === v) mvB = 0; b.classList.remove("on") };
    b.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); audio(); mvB = v; b.classList.add("on"); try { b.setPointerCapture(e.pointerId) } catch (er) { } });
    b.addEventListener("pointerup", off); b.addEventListener("pointercancel", off); b.addEventListener("lostpointercapture", off); b.addEventListener("contextmenu", e => e.preventDefault()) });
  const actB = root.querySelector(".tw-act"), tipEl = root.querySelector(".tw-tip"); let actC = null, actK = "", actDown = 0;
  const aF = new T.Vector3(), aP = new T.Vector3(), aD = new T.Vector3();
  function actLabel(c) { const A = L.act, o = c.o, u = o.userData || {};
    if (c.room) return u.note ? A.read : u.gear != null ? A.take : u.clock ? A.clock : u.bell ? A.ring : u.down ? A.down : u.tape ? A.listen : u.lid ? A.lid : u.mask ? A.look : A.out;
    if (o === pick) return A.plaque; if (u.note) return A.read; if (u.gear != null || u.key) return A.take; if (u.hatch) return A.hatch; if (u.por) return A.press;
    const d = c.D.d; if (chase || (wo && wo.k >= 1)) return A.hide;
    if (d.k === "mirror") return GS.key ? A.open : A.knock; if (d.k === "lock") return A.knock; if (d.k === "sos") return got.sos ? A.enter : A.knock; if (d.k === "curse") return got.curse ? A.enter : A.knock;
    if (d.k === "loop") return A.open; return A.enter }
  function findAct() { if (uiOpen || busy || dead) return null; cam.getWorldDirection(aF); let best = null, bs = 1e9;
    const consider = (o, p, reach, extra) => { aD.copy(p).sub(cam.position); const dist = aD.length(); if (dist > reach || dist < 1e-3) return; const dot = aF.dot(aD.divideScalar(dist)); if (dot < .5) return; const sc2 = (1 - dot) * 4 + dist * .25; if (sc2 < bs) { bs = sc2; best = Object.assign({ o, dist }, extra) } };
    if (room) { room.pick.forEach(o => { if (!o.parent) return; o.getWorldPosition(aP); consider(o, aP, o === room.exit ? 3.3 : 2.6, { room: 1 }) }); return best }
    DOORS.forEach((D, n) => { aP.copy(D.pos); aP.y += 1; consider(doorInst, aP, 3.4, { inst: n, D }) });
    special.forEach(o => { if (!o.visible || !o.parent) return; o.getWorldPosition(aP); consider(o, aP, o.userData.hatch ? 3.4 : 2.7, {}) });
    if (!(got.equinox && openK > .5)) { pick.getWorldPosition(aP); consider(pick, aP, 4.8, {}) }
    return best }
  function actTick(t) { const c = findAct(); const k = c ? (c.room ? "r" : "m") + (c.inst != null ? "d" + c.inst : c.o.uuid) + actLabel(c) : "";
    actC = c; if (k !== actK) { actK = k; if (c) { actB.textContent = actLabel(c); actB.hidden = false } else actB.hidden = true }
    tipEl.classList.toggle("in", !c && t < 14 && !room) }
  function actSOS() { return actC && !actC.room && actC.D && actC.D.d.k === "sos" && !got.sos && sosHeard && !chase }
  actB.addEventListener("pointerdown", e => { e.preventDefault(); e.stopPropagation(); audio(); actDown = performance.now(); actB.classList.add("on") });
  actB.addEventListener("pointerup", e => { e.preventDefault(); e.stopPropagation(); actB.classList.remove("on"); if (!actDown || !actC || uiOpen || busy) return; const dur = performance.now() - actDown; actDown = 0;
    if (actSOS()) return sosKnock(dur < 320 ? "." : "-"); doAct() });
  function doAct() { const c = actC; if (!c || uiOpen || busy) return; if (c.room) return roomAct(c.o, c.dist); act(c.o, c.inst, c.dist) }
  actB.addEventListener("pointercancel", () => { actDown = 0; actB.classList.remove("on") }); actB.addEventListener("contextmenu", e => e.preventDefault());

  // опора под ногами: пол или верх ступени (подняться можно на 0.42 м)
  const SR0 = R - 2.82, SR1 = R - .16;
  function support(x, z, f) { let best = Math.hypot(x, z) < R ? FLOOR : -1e9; const i0 = Math.max(-1, Math.floor((f - .6) / .27) - 1), i1 = Math.min(STEPS - 1, Math.floor((f + .6) / .27) + 2);
    for (let i = i0; i <= i1; i++) { const s = stepAt(i), c = Math.cos(s.a), sn = Math.sin(s.a), u = x * c + z * sn, v = -x * sn + z * c; if (u > SR0 && u < SR1 && Math.abs(v) < .6) { const top = s.y + .13; if (top <= f + .42 && top > best) best = top } } return best }
  function pushSteps() { const i0 = Math.max(-1, Math.floor((fy - 2) / .27)), i1 = Math.min(STEPS - 1, Math.floor((fy + 2) / .27));
    for (let i = i0; i <= i1; i++) { const s = stepAt(i), top = s.y + .13, bot = s.y - .13; if (!(top > fy + .42 && bot < fy + 1.75)) continue; const c = Math.cos(s.a), sn = Math.sin(s.a), u = px * c + pz * sn, v = -px * sn + pz * c;
      const cu = Math.max(SR0, Math.min(SR1, u)), cvv = Math.max(-.575, Math.min(.575, v)), du = u - cu, dv = v - cvv, d = Math.hypot(du, dv), rr = .3;
      if (d < rr) { let nu = u, nv = v; if (d > 1e-4) { nu = cu + du / d * rr; nv = cvv + dv / d * rr } else { const opts = [[SR0 - rr, v, u - SR0], [SR1 + rr, v, SR1 - u], [u, -.575 - rr, v + .575], [u, .575 + rr, .575 - v]]; opts.sort((p, q) => p[2] - q[2]); nu = opts[0][0]; nv = opts[0][1] } px = nu * c - nv * sn; pz = nu * sn + nv * c } } }

  /* ---------- двери: что происходит при нажатии ---------- */
  const lockN = {};
  function tap(x, y) {
    if (uiOpen || busy) return; rayAt(x, y);
    if (room) { const h = ray.intersectObjects(room.pick, false)[0]; if (!h) return; return roomAct(h.object, h.distance) }
    const cands = []; if (doorInst) { const hd = ray.intersectObject(doorInst, false)[0]; if (hd) cands.push(hd) } const hs = ray.intersectObjects(special, false)[0]; if (hs) cands.push(hs); const hp = ray.intersectObject(pick, false)[0]; if (hp) cands.push(hp);
    cands.sort((a, b) => a.distance - b.distance); const h = cands[0]; if (!h) return; act(h.object, h.instanceId, h.distance) }
  function roomAct(o, dist) { if (o.userData.note) return showNote(o.userData.note); if (o.userData.gear != null) return pickGear(o.userData.gear); if (o.userData.clock) return clockTap(); if (o.userData.bell) return room.ring && room.ring(); if (o.userData.tape) return room.tape && room.tape(); if (o.userData.lid) return room.lid && room.lid(); if (o.userData.mask) return room.mask && room.mask(); if (o === room.exit && dist < 3.5) exitRoom() }
  function act(o, inst, dist) { const h = { object: o, instanceId: inst, distance: dist };
    if (h.object === pick) { if (got.equinox && openK > .5) return; if (h.distance > 5) line(L.far, 2200); else if (!GS.bell) { knock(); line(GS.clock ? L.plaqueBell : L.plaqueCold, 3600) } else dial(); return }
    if (h.distance > 3.4) { line(L.far, 2000); return }
    if (h.object.userData.note) return showNote(h.object.userData.note);
    if (h.object.userData.gear != null) return pickGear(h.object.userData.gear);
    if (h.object.userData.key) return pickKey();
    if (h.object.userData.hatch) { if (!GS.clock) { line(L.hatchShut, 2600); knock(); sfx("lock", .6); return } if (runClean) ach("careful"); const hid = !!(chase || (wo && wo.k >= 1)); if (hid) { if (wo) woEnd(); endChase(); setTimeout(() => { line(L.hidHatch, 3400); ach("hide") }, 4200) } lidT = 1; sfx("slow", .8); return setTimeout(() => { enter(hatchD, "top"); setTimeout(() => { lidT = 0; lidOpen = 0 }, 1800) }, 750) }
    if (h.object.userData.por) return portraitTap(h.object.userData.por);
    if (h.object === doorInst) doorTap(DOORS[h.instanceId]) }
  function doorTap(D) { const d = D.d; if (chase || (wo && wo.k >= 1)) { if (wo) woEnd(); return hideIn(D) }
    if (d.k === "mirror") { if (!GS.key) { knock(); rattle(2, .5); sfx("lock", .7); line(L.mirrorLock, 2600); return } if ((o.rd || 1) < 23) { sfx("lock", .7); line(L.keyEarly, 2800); return } if (!GS.crypt) line(L.mirrorOpen, 1400); sfx("creak", .9); return setTimeout(() => enter(D, "crypt"), 900) }
    if (d.k === "lock") { addTo("locks", d.n); const n = (lockN[d.n] = (lockN[d.n] || 0) + 1); knock(); knock(.18); rattle(2, .5); sfx("lock", .7); const pool = L.lock; line(n > 2 && loopN > 0 && n % 3 === 0 ? L.lockAgain : pool[(d.n * 3 + n) % pool.length], 2600); if (!noScare && n % 4 === 2) setTimeout(() => { knock(0, 0, 1); knock(.2, 0, 1); knock(.4, 0, 1); rattle(4, .9, .9) }, 900); return }
    if (d.k === "sos") { if (got.sos) return enter(D, "sos"); sosHeard = true; line(L.sosTap, 4200); setTimeout(() => line(L.sosHow, 3800), 4400); playSOS(); return }
    if (d.k === "curse") { if (got.curse) return enter(D, "curse"); line(L.curseTap, 3000); knock(); rattle(2, .5); sfx("lock", .7); return }
    if (d.k === "dark") return enter(D, "dark");
    if (d.k === "clock") return enter(D, "clock");
    if (d.k === "portal") return portal(D);
    if (d.k === "loop") return loopDoor(D) }
  function playSOS() { if (!ac) return; let t = .2; "...---...".split("").forEach((c, i) => { knock(t, c === "-", 1); t += (c === "." ? .3 : .7) + (i === 2 || i === 5 ? .35 : 0) }) }
  let sosSeq = "", sosT = 0, sosHeard = false;
  function sosKnock(c) { knock(0, c === "-"); if (performance.now() - sosT > 2600) sosSeq = ""; sosT = performance.now(); sosSeq += c; line(sosSeq.split("").map(x => x === "." ? "•" : "—").join(" "), 2400);
    if ("...---...".indexOf(sosSeq) !== 0) { setTimeout(() => line(L.sosWrong, 2400), 500); sosSeq = ""; return }
    if (sosSeq === "...---...") { sosSeq = ""; const D = DOORS.find(x => x.d.k === "sos"); setTimeout(() => { playSOS(); openDoor(D.d.n, .35); line(L.sosOk, 3600); solve("sos") }, 700) } }
  let porSeq = [];
  function portraitTap(P) { click(); P.pm.material.emissiveIntensity = .5; porSeq.push(P.nm);
    if (PORDER.slice(0, porSeq.length).join() !== porSeq.join()) { porSeq = []; setTimeout(() => { portraits.forEach(p => p.userData.por.pm.material.emissiveIntensity = 0); clunk(false); line(L.curseWrong, 2600) }, 350); return }
    if (porSeq.length === 4) { porSeq = []; clunk(true); const D = P.D; openDoor(D.d.n, .35); line(L.curseOk, 3200); solve("curse") } }
  function openDoor(n, to, q) { openT[n] = to; if (!q) creak() }
  // заход в комнату / портал / петля
  function fadeTo(fn, ms) { busy = true; fade.classList.add("on"); noise(500, "lowpass", .3, .7); setTimeout(() => { fn(); setTimeout(() => { fade.classList.remove("on"); setTimeout(() => busy = false, 450) }, 120) }, ms || 480) }
  let back = null;
  function enter(D, name) { if (chase) endChase(); if (wo) woEnd(); redEl.style.opacity = 0; fallTop = null; vy = 0; if (ROOMS5.indexOf(name) >= 0 || name === "crypt") addTo("rooms", name); setTimeout(markDoors, 2500); if (name === "top") setTimeout(() => { ach("top"); if (lives === 1) ach("last") }, 3000); openDoor(D.d.n, 1, name === "crypt"); setTimeout(() => fadeTo(() => { const RM = makeRoom(name); RM.nm = name; back = { D, px, pz, fy, yaw }; room = RM; RM.s.add(cam); rp.scene = RM.s; px = RM.spawn.x; pz = RM.spawn.z; fy = 0; eyeY = EH; yaw = RM.yaw; pitch = .05; openT[D.d.n] = 0; openA[D.d.n] = 0; refreshDoor(D.d.n); line(RM.say || "", 4200); sfx("close", .45, .35); setTimeout(() => room === RM && line(RM.exitHint || L.roomExit, 2600), 4600) }), 380) }
  function exitRoom() { const RM = room; fadeTo(() => { room = null; sc.add(cam); rp.scene = sc; const b = back; if (RM.exitSay) line(RM.exitSay, 2400); placeAt(b.D, true) }) }
  function placeAt(D, opened) { const out = inward(D.a); px = D.pos.x + out.x * 1.25; pz = D.pos.z + out.z * 1.25; fy = support(px, pz, D.y + .2); if (fy < -1e8) fy = D.y; vy = 0; fallTop = null; safeBuf.length = 0; eyeY = fy + EH;
    yaw = Math.atan2(-out.x, -out.z); pitch = .02; if (opened) { openA[D.d.n] = .9; openT[D.d.n] = 0; refreshDoor(D.d.n); creak(); sfx("close", .45, 1.4) } }
  function portal(D) { openDoor(D.d.n, 1); setTimeout(() => fadeTo(() => { openT[D.d.n] = 0; openA[D.d.n] = 0; refreshDoor(D.d.n); const tgt = DS[D.d.to], k = tgt.i != null ? (D.d.i == null ? 0 : D.k) : 0; const TD = DOORS.find(x => x.d === tgt && x.k === k) || DOORS.find(x => x.d === tgt); placeAt(TD, true); line(L.portalOut, 3000); setTimeout(() => ach("portal"), 1200) }), 380) }
  function loopDoor(D) { if (SECRETS.every(k => got[k])) { line(L.loopAll, 2400); return setTimeout(() => enter(D, "top"), 900) } openDoor(D.d.n, 1); setTimeout(() => fadeTo(() => { openT[D.d.n] = 0; openA[D.d.n] = 0; refreshDoor(D.d.n); loopN++; placeAt(D, true); line(L.loopDoor, 3400) }), 380) }
  // записки
  let noteBox = null;
  function showNote(N) { uiOpen = true; click(); sfx("paper", .8); addTo("notes", N.n); const box = document.createElement("div"); box.className = "tw-dial tw-note"; box.innerHTML = '<p class="tw-nt">' + L.note + '</p><p class="tw-np"></p>' + (N.s ? '<p class="tw-ns">' + L.scrap + '</p>' : '') + '<button type="button" class="tw-dx" aria-label="' + L.exit + '">✕</button>';
    box.querySelector(".tw-np").textContent = L.notes[N.n]; root.appendChild(box); requestAnimationFrame(() => box.classList.add("on")); noteBox = box;
    box.querySelector(".tw-dx").onclick = closeNote; box.addEventListener("pointerdown", e => e.stopPropagation()); if (N.s && o.onScrap) try { o.onScrap(N.s) } catch (e) { } }
  function pickGear(id) { if (GS.gears.indexOf(id) >= 0) return; hideGear(id, room); addTo("gears", id); click(); tone(1320, "triangle", .12, .5); tone(1980, "sine", .06, .7);
    const n = GS.gears.length; gearHud(id); line(n >= GN ? L.gearAll : L.gear + " · " + n + "/" + GN, 3000) }
  function pickKey() { if (GS.key) return; GS.key = 1; save(); keyM.visible = false; const j = special.indexOf(keyM); if (j >= 0) special.splice(j, 1); click(); tone(1100, "triangle", .1, .6); line(L.key, 3400) }
  // погоня: спрятаться можно за любой дверью
  let chase = null, chaseNext = 110 + Math.random() * 60, drone = null;
  function droneOn(on) { if (!ac || !SYN) return; if (on && !drone) { const t = ac.currentTime, os = ac.createOscillator(), os2 = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain(); os.type = "sawtooth"; os.frequency.value = 41; os2.type = "sawtooth"; os2.frequency.value = 41.7; f.type = "lowpass"; f.frequency.value = 160; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + 3); os.connect(f); os2.connect(f); f.connect(g); g.connect(bus); os.start(); os2.start(); drone = { os, os2, g } }
    if (!on && drone) { const d = drone, t = ac.currentTime; drone = null; d.g.gain.cancelScheduledValues(t); d.g.gain.setValueAtTime(Math.max(.0001, d.g.gain.value), t); d.g.gain.exponentialRampToValueAtTime(.0001, t + .8); setTimeout(() => { try { d.os.stop(); d.os2.stop() } catch (e) { } }, 900) } }
  function endChase() { chase = null; droneOn(false); redEl.style.opacity = 0; eyes.position.copy(EYE0); eyes.scale.setScalar(4); eyeWant = 0; eyeVis = 0; eyeLit = 0; eyes.visible = false; eyeNext = performance.now() / 1000 - t0 / 1000 + 25; chaseNext = eyeNext + 150 + Math.random() * 120 }
  function hideIn(D) { endChase(); openDoor(D.d.n, .5); busy = true; fade.classList.add("on"); stepsOn(false); stepsPass(.5); [0, .6, 1.2, 1.8, 2.4].forEach((d, i) => setTimeout(() => noise(160, "lowpass", .5 - i * .08, .14), 600 + d * 1000));
    setTimeout(() => { openT[D.d.n] = 0; placeAt(D, false); fade.classList.remove("on"); setTimeout(() => busy = false, 450); line(L.hid, 3400); ach("hide") }, 4200) }
  function clockTap() { const RM = room; if (!RM) return; if (GS.clock) { clockAsk(RM); return }
    if (GS.gears.length < GN) { knock(); line(L.clockNeed + " · " + GS.gears.length + "/" + GN, 2800); return }
    GS.clock = 1; save(); gearHud(); topState(); RM.clockOpen(); clunk(true); line(L.clockGo, 3200); [0, .9, 1.8].forEach(d => setTimeout(() => bell(), d * 1000)); setTimeout(() => ach("clock"), 2400); setTimeout(() => room && line(L.clockUp, 3600), 4200) }
  // шестерёнки можно вынуть: часы встают, люк закрывается, лестница снова бесконечная (шестерёнки и ачивки остаются)
  function clockAsk(RM) { if (uiOpen) return; uiOpen = true; click(); const box = document.createElement("div"); box.className = "tw-dial tw-ask";
    box.innerHTML = '<p></p><button type="button" class="tw-go tw-out"></button><button type="button" class="tw-go tw-keep"></button>';
    box.querySelector("p").textContent = L.clockAsk; box.querySelector(".tw-out").textContent = L.clockOut; box.querySelector(".tw-keep").textContent = L.clockKeep;
    root.appendChild(box); requestAnimationFrame(() => box.classList.add("on")); box.addEventListener("pointerdown", e => e.stopPropagation());
    const close = () => { box.classList.remove("on"); setTimeout(() => box.remove(), 300); uiOpen = false };
    box.querySelector(".tw-keep").onclick = () => { click(); close() };
    box.querySelector(".tw-out").onclick = () => { close(); if (room !== RM || !GS.clock) return; GS.clock = 0; save(); gearHud(); topState(); RM.clockStop(); clunk(false); sfx("lock", .7); line(L.clockStop, 3400) } }
  function closeNote() { if (!noteBox) return; const b = noteBox; noteBox = null; b.classList.remove("on"); setTimeout(() => b.remove(), 300); uiOpen = false }

  /* ---------- замок выхода: дата на табличке ---------- */
  function dial() {
    uiOpen = true; const box = document.createElement("div"); box.className = "tw-dial";
    box.innerHTML = '<img class="tw-pl" src="' + M("plaque.jpg") + '" alt=""><p>' + L.dial + '</p><input class="tw-in" inputmode="decimal" maxlength="10" autocomplete="off" placeholder="' + L.ph + '"><button type="button" class="tw-go">' + L.turn + '</button><button type="button" class="tw-dx" aria-label="' + L.exit + '">✕</button>';
    root.appendChild(box); requestAnimationFrame(() => box.classList.add("on"));
    const inp = box.querySelector(".tw-in"); setTimeout(() => { try { inp.focus() } catch (e) { } }, 350);
    function close() { box.classList.remove("on"); setTimeout(() => box.remove(), 300); uiOpen = false; try { inp.blur() } catch (e) { } }
    box.querySelector(".tw-dx").onclick = close;
    function go() { const d = (inp.value || "").split("").filter(c => c >= "0" && c <= "9").join("");
      if (d === "2309" || d === "230923" || d === "23092023") { close(); openExit() }
      else { clunk(false); box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); line(L.wrong, 2200) } }
    box.querySelector(".tw-go").onclick = go; inp.addEventListener("keydown", e => { e.stopPropagation(); if (e.key === "Enter") go() });
  }
  let exitT = -1, openK = 0, endOn = false, exitSaid = -99;
  // финал: «Дело закрыто» — время, падения, тайны, ачивки; можно остаться в башне
  function finale() { endOn = true; ach("exit"); save(); if (o.onWin) o.onWin(); busy = true; walking = false; down = null; fade.style.background = "#fff3dc"; fade.classList.add("on"); sfx("bell", .5);
    setTimeout(() => { uiOpen = true; const nS = SECRETS.filter(k => got[k]).length, mm = Math.round((GS.pt || 0) / 60), box = document.createElement("div"); box.className = "tw-dial tw-end";
      box.innerHTML = '<p class="tw-stamp">' + L.endStamp + '</p><p class="tw-endt"></p><p class="tw-ends"></p><button type="button" class="tw-go tw-stay">' + L.endStay + '</button><button type="button" class="tw-go tw-out">' + L.endOut + '</button>';
      box.querySelector(".tw-endt").textContent = L.endText + (nS >= 4 ? " " + L.endAll : "");
      box.querySelector(".tw-ends").textContent = L.endStats(mm, GS.deaths, nS, AK().filter(k => GS.a[k]).length, AK().length);
      root.appendChild(box); requestAnimationFrame(() => box.classList.add("on"));
      box.querySelector(".tw-stay").onclick = () => { click(); box.classList.remove("on"); setTimeout(() => box.remove(), 300); uiOpen = false; busy = false; fade.classList.remove("on"); setTimeout(() => fade.style.background = "", 500); const a = Math.atan2(cz, cx); px = Math.cos(a) * (R - 3.2); pz = Math.sin(a) * (R - 3.2); setTimeout(() => endOn = false, 4000) };
      box.querySelector(".tw-out").onclick = () => { click(); leave() } }, 1400) }

  function openExit() { exitT = 0; clunk(true); sfx("slow", .9); line(L.ok, 3000); setTimeout(() => ach("equinox"), 1500); if (!got.equinox) { got.equinox = 1; count(); setTimeout(() => { if (alive && o.onSolve) o.onSolve("equinox") }, 2600) } setTimeout(() => alive && line(GS.bell ? L.dawnGo : L.next), 6500) }
  function doorCol() { hinge.updateMatrixWorld(true); [.35, .95, 1.55, 2.1].forEach(x => { const p = hinge.localToWorld(V3(x, 0, .15)); COL.push({ x: p.x, z: p.z, r: .22 }) }) }
  function setOpen(k) { openK = k; hinge.rotation.y = TH - 1.75 * k; dawnM.color.setRGB(1.3, 1.0, .68).multiplyScalar(.04 + .96 * k); tunL.intensity = 14 * k; doorS.intensity = 38 * k; shaft.visible = k > .01; shaftM.uniforms.uI.value = .035 * k; dustM.uniforms.uDoor.value = k; keyL.intensity = 1.6 + k * 1.5 }
  setOpen(0); if (o.solved) { setOpen(1); doorCol() }
  // открытые раньше двери с тайнами стоят приоткрытыми
  DS.forEach(d => refreshDoor(d.n)); markDoors();

  /* ---------- цикл ---------- */
  let hintS = 0, hintD = 0, last = performance.now(), t0 = last, hinted = 0, frames = 0, ftime = 0, flk = { next: 7 + Math.random() * 8, seq: null, s: 0 };
  const fwd = new T.Vector3(), dI = new T.Matrix4(), tmp = new T.Vector3(), m4t = new T.Matrix4();
  function tick(now) {
    if (!alive) return; const dt = Math.min(.05, (now - last) / 1000); last = now; const t = (now - t0) / 1000;
    if (down && down.m && !walking && !hold && performance.now() - down.t > 260 && moved < 30) walking = true;
    actTick(t); let mv = 0; if (walking) mv = 1; if (mvB) mv = mvB; if (keys.w || keys.arrowup) mv = 1; if (keys.s || keys.arrowdown) mv = -1;
    if (keys.a || keys.arrowleft) yaw += dt * 1.8; if (keys.d || keys.arrowright) yaw -= dt * 1.8;
    if (busy) mv = 0;
    if (room) { // в комнате: просто ходим внутри
      if (mv && !uiOpen) { px -= Math.sin(yaw) * mv * dt * 1.6; pz -= Math.cos(yaw) * mv * dt * 1.6; const hw = (room.w || 4) / 2 - .4, hd = (room.d || 4) / 2 - .4; px = Math.max(-hw, Math.min(hw, px)); pz = Math.max(room.zMin != null ? room.zMin : -hd, Math.min(room.zMax != null ? room.zMax : hd, pz));
        if (room.cz != null && Math.abs(px) < 1.55 && Math.abs(pz - room.cz) < .95) { if (pz > room.cz) pz = room.cz + .95; else pz = room.cz - .95 }
        if (room.maxR) { const rr = Math.hypot(px, pz); if (rr > room.maxR) { px *= room.maxR / rr; pz *= room.maxR / rr } }
        if (room.cols) room.cols.forEach(c => { const dx = px - c.x, dz = pz - c.z, dd = Math.hypot(dx, dz); if (dd < c.r) { px = c.x + dx / (dd || 1) * c.r; pz = c.z + dz / (dd || 1) * c.r } }) }
      eyeY += (EH - eyeY) * Math.min(1, dt * 10); if (room.tick) room.tick(t) }
    else {
      const onStairs = fy > FLOOR + .2, inAir = fallTop != null && fallTop - fy > .5; let toEdge = false;
      if (mv && !uiOpen && !inAir && !dead) { let mx = -Math.sin(yaw) * mv, mz = -Math.cos(yaw) * mv, sp = 1.9;
        if (onStairs) { const a = Math.atan2(pz, px), tx = -Math.sin(a), tz = Math.cos(a), rx = Math.cos(a), rz = Math.sin(a), mt = mx * tx + mz * tz, mr = mx * rx + mz * rz; toEdge = mr < -.55; const kr = toEdge ? 1 : .4; mx = tx * mt + rx * mr * kr; mz = tz * mt + rz * mr * kr; sp = 2.5 }
        const a0 = Math.atan2(pz, px); px += mx * dt * sp; pz += mz * dt * sp;
        // на лестнице взгляд сам поворачивает вместе с витком, а шаги мягко держат середину ступеней
        if (onStairs) { let da = Math.atan2(pz, px) - a0; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU; yaw -= da;
          if (!toEdge) { const r0 = Math.hypot(px, pz), mid = R - 1.75, r1 = r0 + (mid - r0) * Math.min(1, dt * 1.6); px *= r1 / r0; pz *= r1 / r0 } } }
      // стена, край лестницы (к пролёту можно шагнуть, если очень хочется), препятствия на полу
      const rr = Math.hypot(px, pz);
      if (fy > FLOOR + .2) { const lo = R - 2.72, hi = R - .9;
        if (toEdge && rr <= lo + .03 && fallTop == null) { if (edgeT === 0) { pebbles(); if (!edgeSaid) { edgeSaid = 1; line(L.edge, 2400) } } edgeT += dt } else if (!toEdge) edgeT = 0;
        if (rr < lo && rr > SR0 - .1 && fallTop == null && edgeT < .8) { px *= lo / rr; pz *= lo / rr } else if (rr > hi) { px *= hi / rr; pz *= hi / rr } }
      else { const lim = R - 1.4; if (rr > lim) { px *= lim / rr; pz *= lim / rr } for (let k = 0; k < 2; k++) COL.forEach(c => { const dx = px - c.x, dz = pz - c.z, d = Math.hypot(dx, dz), mn = c.r + .32; if (d < mn && d > 1e-4) { px = c.x + dx / d * mn; pz = c.z + dz / d * mn } }) }
      pushSteps();
      const sup = support(px, pz, fy);
      if (sup >= fy - .02) { if (fallTop != null) land(fallTop - sup); fallTop = null; fy = sup; vy = 0 }
      else { if (fallTop == null) { fallTop = fy; windOn = 0 } vy = Math.max(-28, vy - 9.8 * dt); const nf = fy + vy * dt; if (nf <= sup) { land(fallTop - sup); fallTop = null; fy = sup; vy = 0 } else fy = nf }
      const drop = fallTop != null ? fallTop - fy : 0; if (drop > 1.6 && !windOn) { windOn = 1; wind() } redEl.style.opacity = dead ? 0 : Math.min(.85, Math.max(0, (drop - 1.8) / 5)).toFixed(3);
      // где стояла недавно — туда вернёт «Вернуться»
      if (fallTop == null && !dead && t - safeT > .4 && (fy < FLOOR + .2 || rr >= R - 2.7)) { safeT = t; safeBuf.push({ px, pz, fy, yaw, t }); if (safeBuf.length > 12) safeBuf.shift() }
      if (fy > 6 && !GS.climb) { GS.climb = 1; save() }
      // бесконечность: поднялась на виток выше исходного — незаметно переносим на виток ниже
      if (loopOn && !GS.clock && fy > Y0 + LP * P + .02 && pitch > -.45 && pitch < .4 && !uiOpen && (eyeVis < .02 || fwd.dot(tmp.copy(eyes.position).sub(cam.position).normalize()) < .6)) { eyeVis = 0; eyeWant = 0; eyes.visible = false; eyeNext = t + 6; const a = Math.atan2(pz, px) - LP * TURN, r0 = Math.hypot(px, pz); px = Math.cos(a) * r0; pz = Math.sin(a) * r0; fy -= LP * P; eyeY -= LP * P; yaw += LP * TURN; loopN++; climbN++; climbSafe++; GS.turns += LP; save(); safeBuf.length = 0; if (fallTop != null) fallTop -= LP * P; if (shS >= 0) shS -= LP * PER; if (wo) wo.s -= LP * PER; if (keyS - LP * PER >= 0 && keyM.visible) placeKey(keyS - LP * PER);
        if (climbN >= 1) ach("loop3"); if (climbN >= 4) ach("loop10"); if (!flUsed) ach("dark"); flUsed = flOn;
        if (climbN <= L.loop.length) setTimeout(() => alive && !room && line(L.loop[climbN - 1], 3200), 1500) }
      eyeY += (fy + EH - eyeY) * Math.min(1, dt * 12) }
    const bob = mv ? Math.sin(t * 9) * .035 : 0;
    // фонарик в руке: чуть отстаёт, когда поворачиваешься, и покачивается на ходу
    { let dyw = yaw - flPY; dyw = Math.atan2(Math.sin(dyw), Math.cos(dyw)); const dpt = pitch - flPP; flPY = yaw; flPP = pitch; const kk = Math.min(1, dt * 7), id = 1 / Math.max(dt, .008);
      flLX += (Math.max(-.6, Math.min(.6, dyw * id * .16)) - flLX) * kk; flLY += (Math.max(-.4, Math.min(.4, -dpt * id * .12)) - flLY) * kk; flW += ((mv ? 1 : 0) - flW) * Math.min(1, dt * 4);
      fl.target.position.set(flLX + Math.sin(t * 4.5) * .14 * flW, -.15 + flLY + (Math.abs(Math.sin(t * 9)) - .5) * .1 * flW, -5) }
    cam.position.set(px, eyeY + bob, pz); cam.rotation.set(0, 0, 0); cam.rotateY(yaw); cam.rotateX(pitch); cam.updateMatrixWorld();
    cam.getWorldDirection(fwd);
    // подсказки у выхода
    const dc = Math.hypot(px - cx, pz - cz);
    if (!room && !got.equinox) { if (hinted === 0 && t > 5) { hinted = 1; line(L.clock, 4000) } if (hinted === 1 && dc < 4.8 && fy < FLOOR + .3) { hinted = 2; line(L.tapc, 3500) } }
    if (!room && !hintS && t > 18 && fy < FLOOR + .2 && !say.classList.contains("in")) { hintS = 1; line(L.stairs, 4000) }
    if (!room && !hintD && fy > FLOOR + 1 && DOORS.some(D => D.pos.distanceTo(cam.position) < 3.2)) { hintD = 1; line(L.doors, 3600) }
    plaqueM.emissive.setRGB(1, .85, .6).multiplyScalar(!got.equinox || openK < .5 ? (!GS.bell ? .03 : dc < 4.8 ? .22 + .12 * Math.sin(t * 2.4) : .08) : 0);
    // выход: открытая дверь ведёт на рассвет, но шагнуть можно, только когда прозвонил колокол
    if (!room && !dead && openK > .9 && fy < FLOOR + .3 && Math.hypot(px - cx, pz - cz) < 1.5) { if (GS.bell) { if (!endOn) finale() } else if (t - exitSaid > 8) { exitSaid = t; line(L.exitEarly, 3600) } }
    GS.pt = (GS.pt || 0) + dt;
    if (exitT >= 0 && exitT < 3) { exitT += dt; const k = Math.min(1, exitT / 2.6); setOpen(k * k * (3 - 2 * k)); if (exitT >= 3) doorCol() }
    if (openK > 0) { const fk = 1 + .04 * Math.sin(t * 1.3) + .02 * Math.sin(t * 3.7); tunL.intensity = 14 * openK * fk; doorS.intensity = 38 * openK * fk }
    // двери плавно открываются/закрываются
    for (let n = 0; n < DS.length; n++) if (Math.abs(openA[n] - openT[n]) > .002) { openA[n] += (openT[n] - openA[n]) * Math.min(1, dt * 5); refreshDoor(n) }
    // фонарик: лёгкое дрожание и редкие перебои
    let lv = 1; if (flOn) { if (!flk.seq && t > flk.next) { const q = []; const n = 2 + (Math.random() * 4 | 0); for (let i = 0; i < n; i++) q.push([.03 + Math.random() * .07, Math.random() < .35 ? 0 : .15 + Math.random() * .5], [.03 + Math.random() * .1, 1]); if (Math.random() < .2) q.splice(1, 0, [.25 + Math.random() * .3, 0]); flk.seq = q; flk.s = 0; flk.next = t + 9 + Math.random() * 20 }
      if (flk.seq) { flk.s += dt; let acc = 0, hit = null; for (const st of flk.seq) { acc += st[0]; if (flk.s < acc) { hit = st; break } } if (hit) lv = hit[1]; else flk.seq = null } }
    if (chase && Math.random() < .06 + .22 * Math.min(1, (t - chase.t0) / 15)) lv = Math.random() * .25;
    // «Без света»: считаем подъём с момента, как выключила фонарик (перенос вниз и возврат после падения не считаются), работает и после часов
    { const d = darkY != null ? fy - darkY : 0, up = d > 0 && d < 1; if (up) { upH += d; if (upH >= LP * P) ach("loop3") } if (flOn) darkH = 0; else if (up) { darkH += d; if (darkH >= LP * P) ach("dark") } } darkY = fy;
    if (flOn) flUsed = true; glintM.opacity = .35 + .3 * Math.sin(t * 2.2);
    // фонарик не выжигает то, что прямо перед носом: в комнатах меряем расстояние лучом, на лестнице — по наклону взгляда вниз
    if (t - flT > .15) { flT = t; let want = 1; if (room) { cam.getWorldDirection(flD); flRay.set(cam.position, flD); flRay.camera = cam; flRay.far = 4; const hit = flRay.intersectObjects(room.s.children, true).find(h => h.object.isMesh && h.object.visible && !(h.object.material && (h.object.material.blending === T.AdditiveBlending || h.object.material.visible === false))); if (hit) want = Math.min(1, Math.max(.28, (hit.distance - .25) / 2.3)) } else if (pitch < -.35) want = Math.max(.5, 1 + (pitch + .35) * 1.1); flNear = want }
    flNearS += (flNear - flNearS) * Math.min(1, dt * 6);
    const lit = flOn ? lv : 0; fl.intensity = FLI * lit * flNearS * (1 + .012 * Math.sin(t * 41) + .008 * Math.sin(t * 7.3));
    // погоня: глаза спускаются к тебе
    if (!room && !chase && !wo && !hum && !noScare && !dead && !busy && !uiOpen && t > chaseNext && fy > FLOOR + 4 && fallTop == null && shS < 0) { chase = { t0: t, said: 0 }; droneOn(true); line(L.chase, 4200) }
    if (chase && !room) { const ct = t - chase.t0, k = Math.min(1, ct / 15); eyes.visible = true; eyes.lookAt(cam.position);
      if (ct < 15) { eyes.position.set(0, fy + 7 - 4.5 * k, 0); eyes.scale.setScalar(3 + 2 * k) } else { eyes.position.lerp(tmp.copy(cam.position).addScaledVector(fwd, .9), Math.min(1, dt * 6)); eyes.scale.setScalar(Math.max(1.2, eyes.scale.x * (1 - dt * 2))) }
      eyeVis = Math.min(1, ct * .8); eyeSet(EP, eyeVis, .5 + .5 * k, 1);
      redEl.style.opacity = Math.min(.7, .12 + .3 * k + .08 * Math.sin(t * 7)).toFixed(3);
      if (ct > 7 && !chase.said) { chase.said = 1; line(L.chaseRun, 2000) }
      if (ct > 15.8) { die(L.caught, L.caughtSub); endChase() } }
    if ((room || dead) && stepsSrc) stepsOn(false);
    if (lidOpen !== lidT) { lidOpen += (lidT - lidOpen) * Math.min(1, dt * 4); if (Math.abs(lidT - lidOpen) < .002) lidOpen = lidT; lidPiv.rotation.x = -lidOpen * 1.9 }
    if (!room && GS.clock && fy < FLOOR + .3) runClean = true;
    if (!room) { warmTick(t); for (let j = 0; j < marks.length; j++) marks[j].visible = openA[marks[j].userData.n] < .02 }
    if (ac && revG.length && revRoom !== (room ? 1 : 0)) { revRoom = room ? 1 : 0; const tn = ac.currentTime; revG[0].gain.setTargetAtTime(room ? 0 : .38, tn, .3); revG[1].gain.setTargetAtTime(room ? .22 : 0, tn, .3) }
    if (t - glT > .1) { glT = t; cam.getWorldDirection(glF); for (let k = 0; k < glints.length; k++) { const sp = glints[k]; if (!sp.parent || !sp.parent.visible) continue; sp.getWorldPosition(glP); const d = glP.distanceTo(cam.position); glP.sub(cam.position).divideScalar(d || 1); sp.material.opacity = flOn && d < 6 && glF.dot(glP) > .94 ? .75 : (sp.userData.min ? sp.userData.min * (.6 + .4 * Math.sin(t * 2.2)) : .04) } }
    for (let k = 0; k < tFlames.length; k++) { const F = tFlames[k], q = 1 + .12 * Math.sin(t * 17 + F.ph) + .07 * Math.sin(t * 31 + F.ph * 2) + .04 * Math.sin(t * 53 + F.ph); F.fg.scale.set(1 - (q - 1) * .4, q, 1 - (q - 1) * .4); F.fg.rotation.z = .07 * Math.sin(t * 4.3 + F.ph) * Math.sin(t * 1.7); F.halo.material.opacity = .26 + .1 * q }
    if (ac) { stepTick(t); ambTick(t); heartTick(t, chase && !room && !dead ? Math.min(1, (t - chase.t0) / 15) : -1); breathTick(t, !room && woM && wo ? wo : null); humTick(t) }
    // тиканье слышно от двери часовой комнаты: чем дальше (и выше по лестнице), тем тише, метров через 18 уже совсем не слышно
    if (!clkD) clkD = DOORS.find(D => D.d.k === "clock");
    clockVol(room ? (room.clockOpen && GS.clock ? .9 : 0) : (GS.clock && clkD ? Math.round(.45 * Math.pow(Math.max(0, 1 - Math.max(0, clkD.pos.distanceTo(cam.position) - 2) / 16), 2) * 100) / 100 : 0));
    // она на лестнице
    if (!room && !dead && woM) { const ps = (fy - .13) / .27;
      if (!wo && !hum && !noScare && !chase && shS < 0 && !busy && !uiOpen && t > woNext && fy > 6 && fallTop == null && ps < STEPS - 30 && !woSeen(woPos(ps + WOG[0]))) { wo = { s: ps + WOG[0], k: 0, away: 0, look: 0, vis: 0, said: 0, out: 0, mv: 1 }; woShow(true) }
      if (wo) { const p = woPos(wo.s), seen = !busy && woSeen(p), dist = Math.hypot(p.x - px, p.z - pz, p.y + 1.6 - eyeY);
        if (wo.out) { wo.vis -= dt * .8; if (wo.vis <= 0) woEnd() }
        else if (fy < FLOOR + .5 || dead) woEnd();
        else { wo.vis = Math.min(1, wo.vis + dt * .8);
          if (seen) { wo.look += dt; wo.away = 0; wo.mv = 0; if (wo.k === 3) wo.s3 = 1; if (!wo.said && wo.vis > .5) { wo.said = 1; line(L.woSee, 2800) } } else { wo.away += dt; wo.look = 0 }
          if (!seen && (wo.s - ps > 22 || wo.s - ps < 1)) wo.s = ps + WOG[wo.k]; // убежала — она всё равно впереди
          if (!seen && wo.away > 1.1 && (!wo.mv || wo.away > 7) && wo.k < 3) { wo.k++; wo.away = 0; wo.mv = 1; wo.s = ps + WOG[wo.k]; noise(1700, "bandpass", .1, .55); line(L.wo[wo.k - 1], 1700); if (wo.k === 3) setTimeout(() => wo && !wo.out && line(L.woStare, 2600), 1800) }
          if (wo && wo.k === 3 && seen && wo.look > 4) { wo.out = 1; line(L.woGone, 3000); ach("woman") }
          else if (wo && ((wo.k === 3 && !seen && wo.away > (wo.s3 ? 1.1 : 6)) || dist < 1.2)) { // не успела
            cam.getWorldDirection(woQ); woQ.y = 0; woQ.normalize(); wo.s = -1; woM.position.set(px + woQ.x * .75, fy, pz + woQ.z * .75); woM.rotation.set(0, Math.atan2(px - woM.position.x, pz - woM.position.z), 0); wo.vis = 1; wo.caught = 1;
            thud(true); setTimeout(() => { die(L.woCaught, L.woCaughtSub); woEnd() }, 450) } }
        if (wo && !wo.caught) { woM.position.copy(p); woM.rotation.set(0, Math.atan2(px - p.x, pz - p.z), 0) }
        if (wo) { const v = Math.max(0, wo.vis); woMats.forEach(m => { m.opacity = v; m.transparent = v < .99 }); woM.updateMatrixWorld(true); woGl.forEach((g2, i) => { g2.position.copy(woEye[i]).applyMatrix4(woM.matrixWorld); g2.material.opacity = v * (.55 + .15 * Math.sin(t * 2.3 + i)) }) } } }
    // тот, кто идёт выше
    if (!room && !dead) { const ps = (fy - .13) / .27;
      if (!GS.key && shS < 0 && keyS < 0 && !chase && !wo && !hum && t > shNext && fy > 4 && fallTop == null) { shS = Math.min(STEPS - 8, ps + 15); shVis = 0; shGone = 0; wrYaw = stepAt(shS).a; showSh(true); line(L.steps, 3600) }
      if (shS >= 0) { const gap = shS - ps, st = stepAt(shS), fx = Math.cos(st.a) * (R - 1.6), fz = Math.sin(st.a) * (R - 1.6), dd = Math.hypot(fx - px, st.y + 1 - eyeY, fz - pz);
        if (!shGone) { if (gap > 28 || gap < -3 || fy < FLOOR + .5 || chase) { shVis -= dt; if (shVis <= 0) { shS = -1; showSh(false); shNext = t + 40 } }
          else { shVis = Math.min(1, shVis + dt * .5); if (gap < 22 && shS < STEPS - 6) shS += dt * 1.25; stepsOn(true, Math.min(.85, 2.4 / Math.max(1, dd)) * Math.max(0, shVis));
            if (gap < 4.5 && dd < 3.4) { shGone = 1; noise(2600, "bandpass", .18, .7); stepsOn(false) } } }
        else { shGone += dt; if (shGone > 1.9) shVis -= dt * 1.2; if (shVis <= 0) { showSh(false); placeKey(shS); shS = -1; line(L.shadowGone, 3200); ach("shadow") } }
        if (shS >= 0) { const vis = Math.max(0, shVis), fl = .78 + .1 * Math.sin(t * 17) + .08 * Math.sin(t * 6.1) + .05 * Math.sin(t * 31);
          if (wr) { // парит над ступенями, спиной к тебе; когда догнала — оборачивается
            const want = shGone ? Math.atan2(px - fx, pz - fz) : Math.atan2(-Math.sin(st.a), Math.cos(st.a)); let dy2 = want - wrYaw; dy2 = Math.atan2(Math.sin(dy2), Math.cos(dy2)); wrYaw += dy2 * Math.min(1, dt * (shGone ? 2.6 : 3));
            wr.position.set(fx, st.y + .13 + .2 + Math.sin(t * 1.4) * .05, fz); wr.rotation.set(0, wrYaw, Math.sin(t * .9) * .025); wrMats.forEach(m => { m.opacity = vis; m.transparent = vis < .99 });
            wr.updateMatrixWorld(true); lampP.copy(LANT).applyMatrix4(wr.matrixWorld); candle.scale.setScalar(.42) }
          else { fig.position.set(fx, st.y + .13 + Math.abs(Math.sin(t * 4.6)) * .025, fz); figM.opacity = vis * .95; const iw = inward(st.a); lampP.set(fx + iw.x * .25, st.y + 1.12, fz + iw.z * .25) }
          const out2 = shGone > 1.6 ? Math.max(0, 1 - (shGone - 1.6) * 2.5) : 1; // фонарь гаснет первым
          candle.position.copy(lampP); candle.material.opacity = vis * fl * out2 * .8; lamp.position.copy(lampP); lamp.intensity = vis * out2 * fl * 9;
          mistG.position.set(fx, st.y + .13, fz); mist.forEach((m, i) => { const k = (t * .12 + m.userData.ph) % 1, an = i * 2.4 + t * .2; m.position.set(Math.cos(an) * .28, .05 + k * .9, Math.sin(an) * .28); m.scale.setScalar(.7 + k * .6); m.material.opacity = vis * .42 * Math.sin(k * Math.PI) }) } } }
    // глаза
    if (!room && !chase) { eyes.lookAt(cam.position); eyes.getWorldPosition(tmp); const de = tmp.distanceTo(cam.position), toE = tmp.sub(cam.position).normalize(), aim = fwd.dot(toE);
      if (!eyeWant && eyeVis < .02 && t > eyeNext && de > 9) { eyeWant = 1; eyeLit = 0; eyeNext = t + (noScare ? 4 : 5) + Math.random() * 5 } else if (eyeWant && (t > eyeNext || (de < 8 && !window.__twEyeHold))) { eyeWant = 0; eyeNext = t + (noScare ? 14 : 7) + Math.random() * 10 }
      const flare = noScare ? 0 : lit * T.MathUtils.smoothstep(aim, .93, .985);
      if (eyeWant) { eyeLit += (flare - eyeLit) * Math.min(1, dt * 6); if (eyeLit > .6) { eyeAway += dt; if (eyeAway > .8) { eyeWant = 0; eyeAway = 0; eyeNext = t + 8 + Math.random() * 10 } } }
      if (eyeVis > .6 && aim > .965 && lit < .02) { stareT += dt; if (stareT > 3 && !GS.a.stare) { line(L.stare, 2600); ach("stare"); eyeWant = 0; eyeNext = t + 10 } } else stareT = Math.max(0, stareT - dt * .5);
      eyeVis += ((eyeWant ? 1 : 0) - eyeVis) * Math.min(1, dt * (eyeWant ? .7 : 3));
      if (t > blinkAt && blinkT < 0) { blinkT = 0; blinkAt = t + 2 + Math.random() * 5 } let bl = 1; if (blinkT >= 0) { blinkT += dt; bl = Math.abs(1 - blinkT / .09); if (blinkT > .18) { blinkT = -1; bl = 1 } }
      eyeSet(EP, eyeVis, eyeLit, Math.max(.04, bl * (eyeAway > 0 ? 1 - eyeAway : 1))); eyes.visible = eyeVis > .01 }
    // глаза в щели приоткрытой двери напротив: посветишь — дверь захлопнется
    // кто-то дёргает ручку запертой двери, мимо которой проходишь
    if (!room && !chase && !wo && !pk && !hum && !noScare && !busy && !uiOpen && !dead && t > hdNext && fallTop == null) { const c = DOORS.filter(D => D.d.k === "lock" && Math.abs(D.y - fy) < 2.5 && D.pos.distanceTo(cam.position) < 5 && D.pos.distanceTo(cam.position) > 1.5);
      if (c.length) { rattle(5 + (Math.random() * 3 | 0), .85); setTimeout(() => alive && !room && line(L.handle, 2800), 1300); hdNext = t + 110 + Math.random() * 90 } else hdNext = t + 4 }
    if (!pk && !room && !chase && !wo && !hum && !noScare && !busy && !uiOpen && !dead && shS < 0 && eyeVis < .02 && t > pkNext) { const c = DOORS.filter(D => { const n = D.d.n, d = D.pos.distanceTo(cam.position); return d > 4.5 && d < 9.5 && D.d.k !== "pod" && openA[n] < .01 && !openT[n] && Math.abs(D.y - fy) < 4 });
      if (c.length) { const D = c[Math.random() * c.length | 0]; pk = { D, t0: t, vis: 0, out: 0, lt: 0 }; openT[D.d.n] = .09; sfxPart("creak", .5, .3, 2.6); PKE.g.position.set(DWs / 2 - .2, 1.45, -.01).applyMatrix4(D.base); PKE.g.visible = true } else pkNext = t + 6 }
    if (pk) { const n = pk.D.d.n; PKE.g.lookAt(cam.position); const dd = PKE.g.position.distanceTo(cam.position), aim = fwd.dot(tmp.copy(PKE.g.position).sub(cam.position).normalize()), hit = lit * T.MathUtils.smoothstep(aim, .95, .99);
      if (!pk.out) { pk.vis = Math.min(1, pk.vis + dt * .7); if (hit > .3) pk.lt += dt; if (pk.lt > .25) { pk.out = 2; pk.vis = 0; openT[n] = 0; sfx("close", .9); ach("peek") } else if (t - pk.t0 > 14 || dd < 3.2 || chase || room) { pk.out = 1; openT[n] = 0 } }
      else pk.vis = Math.max(0, pk.vis - dt * 1.5);
      const bt = (t - pk.t0) % 4.3, bl2 = bt > 4.1 ? Math.abs(1 - (bt - 4.1) / .1) : 1; eyeSet(PKE, pk.vis, pk.out ? 0 : .45 + .55 * hit, Math.max(.05, bl2));
      if (pk.out && pk.vis <= 0 && openA[n] < .01) { PKE.g.visible = false; pk = null; pkNext = t + 70 + Math.random() * 60 } }
    const gT = lit > .02 ? .05 : 1.0; flowerMats.forEach(m => { m.emissiveIntensity += (gT - m.emissiveIntensity) * Math.min(1, dt * 3) });
    if (wallM.userData.sh) wallM.userData.sh.uniforms.uGlow.value = bloomM.emissiveIntensity * .35; if (floor.material.userData.sh) floor.material.userData.sh.uniforms.uGlow.value = bloomM.emissiveIntensity * .35;
    // близкие цветы — подробная модель, дальние — упрощённая
    if (!room) for (const [hi, lo] of lods) { const s = hi.boundingSphere, d = cam.position.distanceTo(s.center) - s.radius; const nearF = d < 3; hi.visible = nearF; lo.visible = !nearF }
    mists.forEach(m => { m.rotation.z += m.userData.s * dt; m.position.x += Math.sin(t * .1 + m.rotation.z) * dt * .05 });
    const du = dustM.uniforms; du.uT.value = t; du.uCam.value.copy(cam.position); du.uDir.value.copy(fwd); du.uOn.value = lit; dI.copy(frame.matrixWorld).invert(); du.uDI.value.copy(dI);
    shaftM.uniforms.uT.value = t; beamM.uniforms.uT.value = t; moteM.uniforms.uT.value = t; moteM.uniforms.uCY.value = cam.position.y; grade.uniforms.uT.value = t % 10; film.uniforms.uT.value = t % 10;
    bloom.strength = lit > .02 ? .35 : .7;
    if (!lowQ && t > 3 && t < 9) { frames++; ftime += dt; if (frames > 90 && ftime / frames > .045) { lowQ = true; bloom.enabled = false; fl.castShadow = false; r.shadowMap.enabled = false; flora.forEach(m => m.count = Math.ceil(m.userData.n * .45)); msaa(0) } }
    if (drsOn && t > 3 && dt < .1) { ftA += (dt - ftA) * .05; ftT += dt; if (ftT > 1.5 && ftA > .024) { ftT = 0; if (comp.renderTarget1.samples) msaa(0); else if (drs > .6) { drs = Math.max(.6, drs - .1); size() } } else if (ftT > 5 && ftA < .0175 && drs < 1) { drs = Math.min(1, drs + .1); ftT = 0; size() } }
    if (direct) r.render(room ? room.s : sc, cam); else comp.render(dt); raf = requestAnimationFrame(tick);
  }
  let raf = requestAnimationFrame(tick), loopOn = true; window.__twLoop = v => { loopOn = v };
  let direct = false; window.__twFx = (b, g, m, dr) => { bloom.enabled = b; grade.enabled = g; mists.forEach(x => x.visible = m); direct = !!dr };
  window.__tw = (x, z, yw, pt, f) => { if (yw != null) { yaw = yw; pitch = pt || 0 } if (x != null) { px = x; pz = z; fy = f != null ? f : support(px, pz, 60); if (fy < -1e8) fy = FLOOR; eyeY = fy + EH; cam.position.set(px, eyeY, pz); cam.updateMatrixWorld() } const v = new T.Vector3(); plaque.getWorldPosition(v); const d = v.distanceTo(cam.position); v.project(cam); return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight, d, px, pz, fy, loopN, room: !!room } };
  window.__twOpen = k => setOpen(k); window.__twSolve = k => solve(k); window.__twPlaque = () => act(pick, undefined, 3); window.__twAch = k => ach(k); window.__twExitPos = () => { const a = Math.atan2(cz, cx); __tw(Math.cos(a) * (R - 1.45), Math.sin(a) * (R - 1.45), -a + Math.PI / 2, 0) }; window.__twFl = on => { flOn = on }; window.__twEye = () => { eyeWant = 1; eyeVis = 1; eyeNext = 1e9 };
  window.__twDoor = (kind, k) => { const D = DOORS.find(x => x.d.k === kind && (k == null || x.k === k)); placeAt(D, false); return { px, pz, fy, yaw } };
  window.__twRoom = nm => enter(hatchD, nm); window.__twRing = () => room && room.ring && room.ring(); window.__twTape = () => room && room.tape && room.tape(); window.__twCrypt = () => { const D = DOORS.find(x => x.d.k === 'mirror'); enter(D, 'crypt') }; window.__twLid = () => room && room.lid && room.lid(); window.__twTap = (kind, k) => { const D = DOORS.find(x => x.d.k === kind && (k == null || x.k === k)); doorTap(D) };
  window.__twRoom = (name) => { const D = DOORS.find(x => x.d.k === "dark"); enter(D, name) };
  window.__twProj = (what) => { const out = []; const pr = v => { const q = v.clone().project(cam); return { x: (q.x + 1) / 2 * innerWidth, y: (1 - q.y) / 2 * innerHeight, z: q.z } }; if (what === 'por') portraits.forEach(p2 => { p2.updateMatrixWorld(); const v = V3().setFromMatrixPosition(p2.matrixWorld); out.push(Object.assign({ nm: p2.userData.por.nm }, pr(v))) }); else { const D = DOORS.filter(x => x.d.k === what).sort((a2, b2) => a2.pos.distanceTo(cam.position) - b2.pos.distanceTo(cam.position))[0]; out.push(pr(D.pos.clone().add(V3(0, .9, 0)))) } return out }; window.__twExitRoom = () => exitRoom(); window.__twKnock = s => s.split("").forEach(c => sosKnock(c)); window.__twPor = arr => arr.forEach(nm => portraitTap(portraits.find(p => p.userData.por.nm === nm).userData.por));
  window.__twSC = () => ({ res: SC_RES, n: SC.length, first: SC.slice(0, 3).map(o => [o.p.x, o.p.y, o.p.z].map(v => +v.toFixed(2))), doorRes }); window.__twAu = () => ({ ac: !!ac, clk: clkV, sfx: Object.keys(sfxB), b: !!stepsB, src: !!stepsSrc, vol: stepsG ? +stepsG.gain.value.toFixed(2) : null }); window.__twWoAim = () => { if (!wo) return 0; const p = woPos(wo.s); yaw = Math.atan2(-(p.x - px), -(p.z - pz)); pitch = Math.atan2(p.y + 1.4 - eyeY, Math.hypot(p.x - px, p.z - pz)); return 1 }; window.__twEyeAt = (d, sc2) => { window.__twEyeHold = 1; eyeWant = 1; eyeVis = 1; eyeNext = 1e9; cam.getWorldDirection(fwd); eyes.position.copy(cam.position).addScaledVector(fwd, d); eyes.scale.setScalar(sc2 || 1.2); return 1 }; window.__twAim = w => { const o = w === 'pk' ? (pk && PKE.g) : eyes; if (!o) return 0; const p = o.getWorldPosition(new T.Vector3()); yaw = Math.atan2(-(p.x - px), -(p.z - pz)); pitch = Math.atan2(p.y - eyeY, Math.hypot(p.x - px, p.z - pz)); return +p.distanceTo(cam.position).toFixed(1) }; window.__twEv = k => { if (k === 'peek') pkNext = 0; if (k === 'eyes') eyeNext = 0; if (k === 'shadow') shNext = 0; if (k === 'chase') chaseNext = 0; if (k === 'woman') woNext = 0; if (k === 'handle') hdNext = 0; if (k === 'echo') echoNext = 0; if (k === 'hum') humNext = 0; return { shS, keyS, chase: !!chase, wo: wo ? { s: +wo.s.toFixed(1), k: wo.k, vis: +wo.vis.toFixed(2) } : null, pk: pk ? { d: pk.D.d.k, vis: +pk.vis.toFixed(2), out: pk.out } : null, pkNext: +pkNext.toFixed(1), chaseNext: +chaseNext.toFixed(1), near: DOORS.map(D => [D.d.k, +D.pos.distanceTo(cam.position).toFixed(1), +(D.y - fy).toFixed(1)]).filter(x => x[1] < 14) } }; window.__twSet = o5 => { Object.assign(GS, o5); topState(); markDoors() };
  window.__twAct = () => { const c = findAct(); cam.getWorldDirection(aF); return c ? { l: actLabel(c), d: c.dist } : { uiOpen, busy, dead, nd: Math.min(...DOORS.map(D => D.pos.distanceTo(cam.position))), cp: cam.position.toArray().map(v => +v.toFixed(2)), f: aF.toArray().map(v => +v.toFixed(2)), pp: pick.getWorldPosition(new T.Vector3()).toArray().map(v => +v.toFixed(2)) } }; window.__twGS = () => ({ gs: GS, dead, fallTop, fy, px, pz, yaw, room: !!room, act: actC ? actB.textContent : "" }); window.__twPick = id => pickGear(id); window.__twClock = () => clockTap(); window.__twCOL = () => COL; window.__twJ = t => journal(t); window.__twFin = () => finale(); window.__twWoM = () => !!woM; window.__twShP = () => { if (shS < 0) return null; const st = stepAt(shS); return [Math.cos(st.a) * (R - 1.6), st.y + 1, Math.sin(st.a) * (R - 1.6), +shVis.toFixed(2), +shGone.toFixed(2), +(shS - (fy - .13) / .27).toFixed(1)] }; window.__twAimAt = (x, y, z) => { yaw = Math.atan2(-(x - px), -(z - pz)); pitch = Math.atan2(y - eyeY, Math.hypot(x - px, z - pz)) }; window.__twWoInfo = () => wo && { s: wo.s, k: wo.k, vis: +wo.vis.toFixed(2), m: !!woM }; window.__twWoK = k => { if (!wo) return 0; wo.k = k; wo.s = (fy - .13) / .27 + WOG[k]; return 1 }; window.__twNote = n => showNote(n); window.__twDie = () => die(); window.__twTris = () => { const out = []; (room ? room.s : sc).traverseVisible(o3 => { if (!o3.isMesh && !o3.isPoints) return; const g = o3.geometry, n = (g.index ? g.index.count : g.attributes.position.count) / 3 * (o3.isInstancedMesh ? o3.count : 1); g.computeBoundingBox(); const sz = g.boundingBox.getSize(new T.Vector3()); out.push([o3.name || (o3.parent && o3.parent.name) || o3.type, Math.round(n), o3.isInstancedMesh ? o3.count : 1, g.attributes.position.count, sz.toArray().map(v => +v.toFixed(2)).join("x"), o3.material.type, o3.castShadow ? "cs" : ""]) }); return out.sort((a, b) => b[1] - a[1]).slice(0, 14) }; window.__twInfo = () => { r.info.autoReset = false; r.info.reset(); comp.render(); const o = { calls: r.info.render.calls, tris: r.info.render.triangles, geo: r.info.memory.geometries, tex: r.info.memory.textures }; r.info.autoReset = true; return o };
  // проверка артефактов на телефоне: ?test&twfx=f (без зерна), g (без цветокора), b (без свечения), m (без сглаживания), s (без теней)
  { const QF = new URLSearchParams(location.search).get("twfx") || ""; if (QF) { if (QF.includes("f")) film.enabled = false; if (QF.includes("g")) grade.enabled = false; if (QF.includes("b")) bloom.enabled = false; if (QF.includes("m")) msaa(0); if (QF.includes("s")) { r.shadowMap.enabled = false; fl.castShadow = false } if (QF.includes("l")) fl.map = null; if (QF.includes("n")) { floor.material.normalMap = null; floor.material.needsUpdate = true } if (QF.includes("o")) { floor.material.onBeforeCompile = () => { }; floor.material.needsUpdate = true } if (QF.includes("h")) { PRC = 3; drsOn = false; size() } } } window.__twChase = () => { chaseNext = 0 }; window.__twHatch = () => act(hatch, undefined, 1); window.__twSt = () => ({ chase: !!chase, lives, room: room && room.nm, red: redEl.style.opacity, dead, drone: !!drone, hb: !!hb });
  window.__twMs = msaa; window.__twAmb = () => ({ st: ac && ac.state, hum: hum && [+hum.g.gain.value.toFixed(2), Math.round(hum.f.frequency.value)], tp: tpS && +tpS.g.gain.value.toFixed(2), stp: +stLast.toFixed(1), run: stRun, echo: +echoNext.toFixed(0), br: bthG && +bthG.gain.value.toFixed(2), pan: bthP && +bthP.pan.value.toFixed(2), hb: hb && +(hb.next - ac.currentTime).toFixed(2), g: ambG && +ambG.gain.value.toFixed(3), f: ambF && Math.round(ambF.frequency.value) }); window.__twDrs = v => { if (v == null) return drs; if (v === "auto") { drsOn = true; return drs } drs = v; drsOn = false; size(); return drs }; window.__twN = () => { const o2 = {}; let tris = 0, dc2 = 0; sc.traverse(x => { if (x.isMesh && x.visible && x.geometry.index) { tris += x.geometry.index.count / 3 * (x.isInstancedMesh ? x.count : 1); dc2++ } }); o2.tris = tris; o2.meshes = dc2; return o2 };
  // отладочные ручки нужны только в тестовом режиме и на страницах _dev
  if (!window.SFTEST && !/\/_dev/.test(location.pathname)) Object.keys(window).forEach(k => { if (k.indexOf("__tw") === 0) delete window[k] });
  Promise.race([ready, new Promise(res => setTimeout(res, 7000))]).then(() => { cover.classList.add("ready"); setTimeout(() => { cover.classList.add("off"); line(got.equinox ? L.next : L.in, 5000); setTimeout(() => cover.remove(), 1900) }, 1500) });

  function leave() {
    alive = false; cancelAnimationFrame(raf); removeEventListener("resize", size); removeEventListener("keydown", kd); removeEventListener("keyup", ku);
    try { ac && ac.close() } catch (e) { } root.classList.add("out");
    setTimeout(() => { try { r.dispose(); r.forceContextLoss() } catch (e) { } root.remove(); document.body.classList.remove("noscroll"); if (o.onExit) o.onExit() }, 450);
  }
  return { leave };
}
