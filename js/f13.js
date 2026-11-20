(function () {
function Z(s) { try {
return decodeURIComponent(escape(atob(s.split("").reverse().join(""))));
}
catch (e) {
return s;
} }
function H(t, c, x) { var e = document.createElement(t); if (c)
e.className = c; if (x != null)
e.textContent = x; return e; }
function ls(k, v) { try {
if (v === undefined)
return localStorage.getItem(k);
if (v === null)
localStorage.removeItem(k);
else
localStorage.setItem(k, v);
}
catch (e) {
return null;
} }
var RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
var LIVE = true, now = new Date(), TODAY = LIVE && now >= new Date(2026, 10, 13, 0, 0, 0) && now < new Date(2026, 10, 14, 13, 0, 0);
if (/[?&]f13=off\b/.test(location.search))
ls("sentfor_f13_test", null);
else if (/[?&]f13\b/.test(location.search))
ls("sentfor_f13_test", "1");
var TEST = ls("sentfor_f13_test") === "1";
if (now >= new Date(2026, 10, 14, 13, 0, 0)) {
if (TEST && !/[?&]f13\b/.test(location.search)) {
ls("sentfor_f13_test", null);
TEST = false;
}
}
var GOT = "sentfor_f13", DONE = "sentfor_f13_done", CUR = "sentfor_f13_theme", NOP = "sentfor_f13_n";
if (/[?&]f13=reset/.test(location.search)) {
ls(GOT, null);
ls(DONE, null);
ls(CUR, null);
ls(NOP, null);
}
var done = ls(DONE) === "1";
var ACTIVE = TODAY || TEST;
if (!ACTIVE && !(done && (LIVE || TEST)))
return;
var row = document.querySelector("header .hdr-row");
function theme(on) { document.body.classList.toggle("f13-cursed", on); ls(CUR, on ? "1" : "0"); var b = document.querySelector(".f13-badge"); if (b)
b.setAttribute("aria-pressed", String(on)); }
function badge() {
if (!row || document.querySelector(".f13-badge"))
return;
var b = H("button", "f13-badge");
b.type = "button";
b.innerHTML = catSvg() + "<span>" + Z("==QtQ3yMxACLDGthRjL09CtgR/Y0/CNIpAL0osL04CttQXL0AGdtQ/J0") + "</span>";
b.title = Z("=wY0CGNuQfY0OG9uQrL0LGtsQDCuQvL04CNIMGtgRjL0HGtjRvL06CtsQDiOwCNvQXL0CGNIPGNsQLY0PG9uQrL0+CNgR/J0");
b.onclick = function () { theme(!document.body.classList.contains("f13-cursed")); };
row.appendChild(b);
b.setAttribute("aria-pressed", String(document.body.classList.contains("f13-cursed")));
}
var AT = "sentfor_f13_at";
function pad2(x) { return ("0" + x).slice(-2); }
function atText() { var t = Date.parse(ls(AT) || ""); if (isNaN(t))
return Z("xEjLzEDIsAL0GGNuQ3L0CG9jR/L0"); var d = new Date(t); return pad2(d.getDate()) + "." + pad2(d.getMonth() + 1) + Z("==AIyCNI") + pad2(d.getHours()) + ":" + pad2(d.getMinutes()); }
function perks() { if (perks.on)
return; perks.on = true; pet(); trophy(); tapes(); }
function pAc() { try {
if (!pAc.a)
pAc.a = new (window.AudioContext || window.webkitAudioContext)();
if (pAc.a.state === "suspended")
pAc.a.resume();
}
catch (e) {
pAc.a = null;
} return pAc.a; }
function pHiss() {
var a = pAc();
if (!a)
return;
try {
var len = Math.floor(a.sampleRate * .9), b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0);
for (var i = 0; i < len; i++)
d[i] = Math.random() * 2 - 1;
var s = a.createBufferSource();
s.buffer = b;
var f = a.createBiquadFilter();
f.type = "bandpass";
f.frequency.value = 3400;
f.Q.value = .8;
var g = a.createGain(), t = a.currentTime;
g.gain.setValueAtTime(0, t);
g.gain.linearRampToValueAtTime(.25, t + .06);
g.gain.exponentialRampToValueAtTime(.001, t + .85);
s.connect(f);
f.connect(g);
g.connect(a.destination);
s.start(t);
s.stop(t + .9);
}
catch (e) { }
}
function pet() {
var c = H("button", "f13-pet");
c.type = "button";
c.setAttribute("aria-label", Z("==ggR7L06CNI5C9iR3L0AGdkRfK0"));
c.innerHTML = '<svg viewBox="0 0 60 64" aria-hidden="true"><path class="tl" d="M40 58q16 2 15-12q-.6-7-6-8"/><path class="bd" d="M14 3l5 11q6-2.5 12 0L36 3l2 15q2 6-2 10q8 6 7 22q-.4 8-8 8H17q-8 0-8-8q-1-16 7-22q-4-4-2-10z"/>' +
'<g class="ey"><ellipse cx="19" cy="20" rx="3.6" ry="3.2"/><ellipse cx="31" cy="20" rx="3.6" ry="3.2"/></g><g class="pu"><rect x="18.2" y="17.4" width="1.6" height="5.2" rx=".8"/><rect x="30.2" y="17.4" width="1.6" height="5.2" rx=".8"/></g><path class="mo" d="M22 27q3 2.5 6 0"/></svg>';
document.body.appendChild(c);
var pu = c.querySelector(".pu");
function look(x, y) { var r = c.getBoundingClientRect(), dx = x - (r.left + r.width / 2), dy = y - (r.top + r.height * .3), m = Math.max(1, Math.hypot(dx, dy)); pu.setAttribute("transform", "translate(" + (dx / m * 1.6).toFixed(2) + " " + (dy / m * 1.2).toFixed(2) + ")"); }
addEventListener("pointermove", function (e) { look(e.clientX, e.clientY); }, { passive: true });
addEventListener("pointerdown", function (e) { look(e.clientX, e.clientY); }, { passive: true });
(function idle() { setTimeout(function () { var k = ["blink", "blink", "lick", "yawn"][Math.floor(Math.random() * 4)]; c.classList.add(k); setTimeout(function () { c.classList.remove(k); }, k === "blink" ? 260 : 1600); idle(); }, 6000 + Math.random() * 9000); })();
c.onclick = function () { if (c.classList.contains("hiss"))
return; c.classList.add("hiss"); pHiss(); try {
navigator.vibrate && navigator.vibrate(60);
}
catch (e) { } setTimeout(function () { c.classList.remove("hiss"); }, 1100); };
var w = document.getElementById("tab-weird");
if (w)
w.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".item") && Math.random() < .35)
setTimeout(function () { c.click(); }, 400); });
}
function trophy() {
var g = document.getElementById("people");
if (!g)
return;
function put() {
if (g.querySelector(".f13-person"))
return;
var b = H("button", "person f13-person f13-done");
b.type = "button";
var fig = H("figure", "pol");
var im = new Image();
im.src = Z("==AciV2duEjb1I3Ln1Wa");
im.alt = "";
im.loading = "lazy";
fig.appendChild(im);
fig.appendChild(H("span", "stamp dead", Z("=4L0CG9iRDY06CNsQfL0")));
fig.appendChild(H("figcaption", "", Z("zEDIWSo4g4L07CdtQTJ0")));
b.appendChild(fig);
b.appendChild(H("span", "pmeta", Z("g4L0CG9iRDY06CNsQfL0") + atText()));
b.onclick = closedFile;
g.appendChild(b);
}
put();
new MutationObserver(put).observe(g, { childList: true });
}
function closedFile() {
var o = H("div", "f13-desk on");
o.setAttribute("role", "dialog");
o.setAttribute("aria-modal", "true");
o.setAttribute("aria-label", Z("zEDIWSo4g4L07CdtQTJ0"));
o.innerHTML = '<div class="f13-file"><button type="button" class="f13-x" aria-label="Закрыть">✕</button>' +
'<div class="ff-head"><span class="ff-sec">' + Z("==gvQ3L0CGdtQDY06CdtQHY0g4L09CdvQXL0IGNgRXL0yCtvQHY0") + '</span><span class="ff-no">' + Z("zEDIWSo4g4L07CdtQTJ0") + '</span></div>' +
'<div class="ff-top"><dl class="ff-dl"><dt>' + Z("PGNvQjJ0") + '</dt><dd><i class="ff-red">████████</i></dd><dt>' + Z("1CNtQPJ0") + '</dt><dd>' + Z("wCdvQDL0AGtuQ3Y0gMY0") + '</dd>' +
'<dt>' + Z("=4L0CG9iRDY06CNsQfJ0") + '</dt><dd>' + atText() + '</dd><dt>' + Z("BG9gRLY0wCtgRHK0") + '</dt><dd class="ff-st">' + Z("=kCsQjyuQjL02C9iRLL0") + '</dd></dl>' +
'<figure class="ff-photo show"><span class="ff-clip"></span><div class="ff-img" style="background-image:url(\'' + Z("==AciV2duEjb1I3Ln1Wa") + '\')"></div><figcaption>' + Z("==wgRbY04CdvQLY0PG9vQDisQDivQLY0PGdvQHY0") + '</figcaption></figure></div>' +
'<div class="ff-text"><p>' + Z("==gLOGNuQDY01CdgRDijRPY0CGNsQbY00CNsQ3L04CNgRLY0gkCsQjyuQjL00C9gRHL03CNsQDK0") + '</p><p>' + Z("uYY04C9uQDCuQTL01CNgRHY0g4L0zCdtQDSKwC9uQjyuQHZ0IGNsQ3J0") + '</p><p>' + Z("=4SKMGdgRDL0o8Y0BG9uQPY09CNgRXL0xCtvQDStQ3J0") + '</p><p>' + Z("==gLwCthR3L0+CtuQDivQTL0gwY0BGNuQ/L0wC9tQDSKwCNK7CdtQDY0CGtvQzL0BGtvQTJ0") + '</p></div>' +
'<p class="ff-last">' + Z("u4L0CG9iRDY06CNsQfL0g4L07CdtQTJ0") + '</p><p class="ff-note">' + Z("uAL0GGNuQ3L0CG9jR/L0gIY04C9vQPY0CGdgRDL09CNI1CdvQDCsQLL0+CdvQHY0gAL06CtvQ/L0mCo4") + '</p></div>';
document.body.appendChild(o);
document.body.classList.add("noscroll");
function close() { o.remove(); document.body.classList.remove("noscroll"); document.removeEventListener("keydown", k); }
function k(e) { if (e.key === "Escape")
close(); }
o.querySelector(".f13-x").onclick = close;
o.addEventListener("click", function (e) { if (e.target === o)
close(); });
document.addEventListener("keydown", k);
}
function tapes() {
if (!row || document.querySelector(".f13-tape"))
return;
var b = H("button", "f13-tape");
b.type = "button";
b.setAttribute("aria-label", Z("=MTMgAL0CGdtQHY0BGNsQrJ0"));
b.innerHTML = '<svg viewBox="0 0 40 26" aria-hidden="true"><rect x="1" y="1" width="38" height="24" rx="3"/><rect class="lb" x="6" y="4" width="28" height="9" rx="1"/><circle cx="13" cy="18" r="3.4"/><circle cx="27" cy="18" r="3.4"/><text x="20" y="11" text-anchor="middle">13</text></svg>';
b.onclick = archive;
var bd = row.querySelector(".f13-badge");
if (bd && bd.nextSibling)
row.insertBefore(b, bd.nextSibling);
else
row.appendChild(b);
}
function archive() {
var o = H("div", "f13-arch");
o.setAttribute("role", "dialog");
o.setAttribute("aria-modal", "true");
o.setAttribute("aria-label", Z("=IY01CdgRHY0wCtuQDisQjL0FGNgRDJ0"));
var L = [[Z("==wMxAyjRjL0AGdtQHK0"), Z("==AsQDY0+C9tQjL0yCdtQvL01CtgRDytQjL0gAL0CGdtQHY0BGNsQrL0"), Z("=QDct5iMrdjdv8WZklmd"), Z("tJWZ35iMrdjdv8WZklmd")], [Z("zEDIWSo4g4L07CdtQTJ0"), Z("==wjRHY0CGdtQbL0wCtuQDStQ3L0gUL0xCdtQLY0"), null], [Z("MGdgRjL0/CNsQfJ0"), Z("=AL0CGNsQ3L08CtvQrL0gcrwgIDI8CNsQrL0"), Z("=QDct5CNxlzYv8WZklmd"), Z("tJWZ35CNxlzYv8WZklmd")]];
o.innerHTML = '<div class="fa-box"><button type="button" class="f13-x" aria-label="Закрыть">✕</button><h4>' + Z("=UL0tMTMgwCsQbY04CdvQLY0PG9vQDytCDisQjL0FGNgRDJ0") + '</h4><div class="fa-list"></div><div class="fa-scr"></div></div>';
var list = o.querySelector(".fa-list"), scr = o.querySelector(".fa-scr");
L.forEach(function (t) {
var x = H("button", "fa-item");
x.type = "button";
x.innerHTML = '<b></b><span></span>';
x.querySelector("b").textContent = t[0];
x.querySelector("span").textContent = t[1];
x.onclick = function () {
scr.innerHTML = "";
[].forEach.call(list.children, function (y) { y.classList.toggle("on", y === x); });
if (window.SFnoScare && SFnoScare()) {
scr.appendChild(H("p", "fa-off", Z("=4yuC7L07CdtQTL0gEZ0+CNnQvqwgIL0g4L09CttQ7L08CNIMGtgRjL0HGtjRvL06CtkQDiLLGdvQXL0HGtjRvL06C9iRLL0ggL06C9uQDL0zC9gR/J0")));
}
else if (t[2]) {
var v = document.createElement("video");
v.playsInline = true;
v.setAttribute("playsinline", "");
v.controls = true;
v.innerHTML = '<source src="' + t[2] + '" type="video/mp4"><source src="' + t[3] + '" type="video/webm">';
scr.appendChild(v);
try {
var p = v.play();
if (p && p.catch)
p.catch(function () { });
}
catch (e) { }
}
else {
var f = H("div", "fa-face");
f.style.backgroundImage = 'url("' + Z("==AciV2dugDezE3Ln1Wa") + '")';
scr.appendChild(f);
try {
scream();
}
catch (e) { }
setTimeout(function () { f.style.backgroundImage = 'url("' + Z("==AciV2dukDezE3Ln1Wa") + '")'; }, 220);
setTimeout(function () { f.classList.add("off"); }, 700);
}
};
list.appendChild(x);
});
document.body.appendChild(o);
document.body.classList.add("noscroll");
function close() { var v = scr.querySelector("video"); if (v)
try {
v.pause();
}
catch (e) { } o.remove(); document.body.classList.remove("noscroll"); document.removeEventListener("keydown", k); }
function k(e) { if (e.key === "Escape")
close(); }
o.querySelector(".f13-x").onclick = close;
o.addEventListener("click", function (e) { if (e.target === o)
close(); });
document.addEventListener("keydown", k);
}
if (done && (LIVE || TEST)) {
if (ls(CUR) !== "0")
document.body.classList.add("f13-cursed");
badge();
perks();
}
if (!ACTIVE)
return;
var got = {};
try {
got = JSON.parse(ls(GOT) || "{}") || {};
}
catch (e) { }
var KEYS = ["ep13", "d13", "cam"];
var HINT = { ep13: Z("==gLRGdtQDCuQTL0DGdsQfL0wCNoQDiLCGNuQ/L0BGNI1CdvQDyjR3L00CtvQPL01CdgRDyjRjL0AGdtQHY0gAL09CNtQ7J0"), d13: Z("=4ivQPL0+CNtQbL0wCtuQDCsQ3L0ggL0AGtgR7L08CdgR7L0fCNIuYY04C9uQDShRjL02C9gRfY0ggL00CdtQDY0BGNIPGdgRLY01C9hR/Y0AG9vQDSvQ7J0"), cam: Z("=8jgRPY0IGNuQ/L0ggL09CtvQDivQLY0nCNIugL07CNiR7L0/CNIsgL07C9jR7L0CGdgRDCsQTL0zCdtQHY0yCNI1C9iRDY0+CtgR7L06CNIssY0BGNsQfK0") };
var NAME = { ep13: Z("==wMxAyjRjL0AGdtQHK0"), d13: Z("zEDIWSo4g4L07CdtQTJ0"), cam: Z("MGdgRjL0/CNsQfJ0") };
function n() { return KEYS.filter(function (k) { return got[k]; }).length; }
var AC = null;
function ac() { try {
if (!AC)
AC = new (window.AudioContext || window.webkitAudioContext)();
if (AC.state === "suspended")
AC.resume();
}
catch (e) {
AC = null;
} return AC; }
document.addEventListener("pointerdown", function () { ac(); }, { once: true, capture: true });
function vib(p) { try {
if (navigator.vibrate)
navigator.vibrate(p);
}
catch (e) { } }
function noiseBuf(a, sec, fn) { var len = Math.max(1, Math.floor(a.sampleRate * sec)), b = a.createBuffer(1, len, a.sampleRate), d = b.getChannelData(0); for (var i = 0; i < len; i++)
d[i] = fn ? fn(i, len) : (Math.random() * 2 - 1); return b; }
function play(buf, t, gain, type, freq, q) {
var a = AC;
var s = a.createBufferSource();
s.buffer = buf;
var g = a.createGain();
g.gain.value = gain;
var last = g;
if (type) {
var f = a.createBiquadFilter();
f.type = type;
f.frequency.value = freq;
if (q)
f.Q.value = q;
s.connect(f);
f.connect(g);
}
else
s.connect(g);
g.connect(a.destination);
s.start(t);
return { s: s, g: g };
}
var KEYB = null;
function key() { var a = ac(); if (!a)
return; try {
if (!KEYB)
KEYB = noiseBuf(a, .03, function (i, l) { return (Math.random() * 2 - 1) * Math.pow(1 - i / l, 6); });
play(KEYB, a.currentTime, .5 + Math.random() * .3, "bandpass", 1800 + Math.random() * 900, 1.2);
}
catch (e) { } }
function ding() { var a = ac(); if (!a)
return; try {
var t = a.currentTime, o = a.createOscillator(), g = a.createGain();
o.frequency.value = 2093;
o.type = "sine";
g.gain.setValueAtTime(.12, t);
g.gain.exponentialRampToValueAtTime(.001, t + 1.2);
o.connect(g);
g.connect(a.destination);
o.start(t);
o.stop(t + 1.3);
}
catch (e) { } }
function breath(times) {
var a = ac();
if (!a)
return;
try {
var t = a.currentTime + .1;
for (var k = 0; k < times; k++) {
[[0, 1.1, .5], [1.4, 1.6, .35]].forEach(function (p) {
var s = a.createBufferSource();
s.buffer = noiseBuf(a, p[1]);
var f = a.createBiquadFilter();
f.type = "bandpass";
f.frequency.setValueAtTime(p[2] > .4 ? 700 : 500, t + p[0]);
f.frequency.linearRampToValueAtTime(p[2] > .4 ? 1100 : 380, t + p[0] + p[1]);
f.Q.value = 1.4;
var g = a.createGain();
g.gain.setValueAtTime(0, t + p[0]);
g.gain.linearRampToValueAtTime(p[2], t + p[0] + p[1] * .4);
g.gain.linearRampToValueAtTime(0, t + p[0] + p[1]);
var pan = a.createStereoPanner ? a.createStereoPanner() : null;
s.connect(f);
f.connect(g);
if (pan) {
pan.pan.value = -.6;
g.connect(pan);
pan.connect(a.destination);
}
else
g.connect(a.destination);
s.start(t + p[0]);
s.stop(t + p[0] + p[1]);
});
t += 3.4;
}
}
catch (e) { }
}
function drone(sec) {
var a = ac();
if (!a)
return;
try {
var t = a.currentTime;
[55, 58.3, 82.4].forEach(function (f) {
var os = a.createOscillator(), g = a.createGain();
os.type = "sawtooth";
os.frequency.value = f;
var lp = a.createBiquadFilter();
lp.type = "lowpass";
lp.frequency.value = 320;
g.gain.setValueAtTime(0, t);
g.gain.linearRampToValueAtTime(.07, t + 1.5);
g.gain.linearRampToValueAtTime(0, t + sec);
os.connect(lp);
lp.connect(g);
g.connect(a.destination);
os.start(t);
os.stop(t + sec + .1);
});
}
catch (e) { }
}
function boom() {
var a = ac();
if (!a)
return;
try {
var t = a.currentTime, o = a.createOscillator(), g = a.createGain();
o.frequency.setValueAtTime(90, t);
o.frequency.exponentialRampToValueAtTime(28, t + 1.4);
g.gain.setValueAtTime(.9, t);
g.gain.exponentialRampToValueAtTime(.001, t + 1.6);
o.connect(g);
g.connect(a.destination);
o.start(t);
o.stop(t + 1.7);
play(noiseBuf(a, .6, function (i, l) { return (Math.random() * 2 - 1) * Math.pow(1 - i / l, 3); }), t, .6, "lowpass", 900);
[311, 329.6, 466].forEach(function (f) { var s = a.createOscillator(), sg = a.createGain(); s.type = "sawtooth"; s.frequency.value = f; sg.gain.setValueAtTime(.05, t); sg.gain.exponentialRampToValueAtTime(.001, t + 2.4); s.connect(sg); sg.connect(a.destination); s.start(t); s.stop(t + 2.5); });
}
catch (e) { }
}
function staticNoise(sec, vol) {
var a = ac();
if (!a)
return null;
try {
var t = a.currentTime, v = vol || .32;
var p = play(noiseBuf(a, sec, function () { return (Math.random() * 2 - 1) * (Math.random() < .97 ? .35 : 1); }), t, .0001, "highpass", 900);
p.g.gain.setValueAtTime(.0001, t);
p.g.gain.exponentialRampToValueAtTime(v, t + .05);
p.g.gain.setValueAtTime(v, t + sec - .4);
p.g.gain.exponentialRampToValueAtTime(.0001, t + sec);
return p;
}
catch (e) {
return null;
}
}
function catSvg() { return '<svg viewBox="0 0 64 40" aria-hidden="true"><path fill="currentColor" d="M8 30c-4 0-7-2-8-5 3 2 6 2 8 1 1-6 6-11 14-12l14-1c3 0 5-2 6-4l2-5 2 4 3-4 1 6c3 2 4 5 3 8-1 2-4 3-7 3l-3 9h-3l1-8c-3 2-7 3-11 3l-3 6h-3l1-6c-3 0-5-1-7-2l-4 7H11l3-7z"/><circle cx="51" cy="13" r="1.3" fill="#ffd23a"/></svg>'; }
var HEAD = '<svg viewBox="0 0 28 32" aria-hidden="true"><path class="t" d="M20 29.5q6.5 .5 6-5.5q-.3-3-2.6-3.6"/><path class="h" d="M6 1.5l2.4 5.3q3.6-1.4 7.2 0L18 1.5l1.2 7.6q1 3.2-1.1 5.4q4.2 3.6 3.6 11.5q-.2 4-4.2 4H7.5q-4 0-4.2-4Q2.7 18.1 6.9 14.5Q4.8 12.3 5.8 9.1z"/><g class="e"><ellipse cx="9.6" cy="10.4" rx="1.9" ry="1.6"/><ellipse cx="14.4" cy="10.4" rx="1.9" ry="1.6"/></g><g class="p"><rect x="9.15" y="9" width=".9" height="2.8" rx=".45"/><rect x="13.95" y="9" width=".9" height="2.8" rx=".45"/></g><path class="c" d="M8 10.6q1.6 .9 3.2 0M12.8 10.6q1.6 .9 3.2 0"/></svg>';
function hm() { var d = new Date(); return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
var mt = null, panel = null;
function meter() {
if (!row)
return;
mt = H("button", "f13-meter");
mt.type = "button";
mt.setAttribute("aria-expanded", "false");
mt.innerHTML = '<span class="fm-cal"><i>' + Z("==ggR/L0") + '</i><b>13</b></span><span class="fm-lbl">' + Z("=AL0GGNuQ3L0CG9jR/J0") + '<small>' + Z("==AMwozMxACLxCdgRDivQTL0") + '</small></span><span class="fm-eyes"></span><b class="fm-n"></b>';
var w = H("div", "f13-wrap");
w.appendChild(mt);
panel = H("div", "f13-panel");
panel.hidden = true;
w.appendChild(panel);
row.appendChild(w);
mt.onclick = function () { panel.hidden = !panel.hidden; mt.setAttribute("aria-expanded", String(!panel.hidden)); paint(); };
document.addEventListener("click", function (e) { if (!panel.hidden && !w.contains(e.target)) {
panel.hidden = true;
mt.setAttribute("aria-expanded", "false");
} });
paint();
}
function paint() {
if (!mt)
return;
var k = n();
mt.querySelector(".fm-n").textContent = k + "/" + KEYS.length;
var ey = mt.querySelector(".fm-eyes");
ey.innerHTML = "";
KEYS.forEach(function (x, i) { var c = H("i", got[x] ? "on" : ""); c.innerHTML = HEAD; ey.appendChild(c); });
mt.classList.toggle("done", k === KEYS.length);
panel.innerHTML = "";
panel.appendChild(H("p", "fp-top", Z("wAjOzEDIssY0CGtvQHL0xC9gRHY0g4L00CNI3KMI1CdLzEDIsAL0GGNuQ3L0CG9jR/J0")));
var ol = H("ol", "");
KEYS.forEach(function (x, i) {
var open = i === 0 || got[KEYS[i - 1]], li = H("li", got[x] ? "got" : open ? "" : "shut");
li.appendChild(H("b", "", got[x] ? NAME[x] : "№ " + (i + 1)));
li.appendChild(H("span", "", open ? HINT[x] : Z("==gLOG9gRnY0DGNtQvY00CdtQDY0/CNIMGNiRHZ00CduQDL09CNIwCNtQPL0+CtuQDCLPGdgRLY01CtvQDY06CtgR7J0")));
ol.appendChild(li);
});
panel.appendChild(ol);
panel.appendChild(H("p", "fp-bot", k === KEYS.length ? Z("ukL0+CdsQ7L0CGNIBGNIPGdgRLY0RGNsQLY0BGtvQDiuQ7L0HGNsQ3L0XCNIuEZ0BGtsQDSKwCNK7CdkRjY0wCdvQDyiRLK0") : Z("uIY01CdvQfL01C9hRHY04CNIRGdgRLL0gADM6MTMgIL0gMY0CGtvQHL0xC9gRHY0gIJ0")));
}
meter();
function toast(title, msg) { var t = H("div", "toast f13-toast"); t.setAttribute("role", "status"); t.appendChild(H("b", "", title)); t.appendChild(document.createTextNode(msg)); t.appendChild(H("span", "toast-cnt", n() + " / " + KEYS.length)); document.body.appendChild(t); setTimeout(function () { t.remove(); }, 5200); }
var NEXT = { ep13: Z("ukL01CNtQ7Y07CNI4CNtQXL0AGdgRDCjRHY0+C9uQDL0CG9jRDY0/CdgRDCuQDCsQDY0+C9tQjL0yCdtQvL01CtgRDytQjL0g4L07C9tQXL07C9iRLL0g4L0CGdL+CtgRfK0"), d13: Z("=4igR/Y0+CtgRHY0gUL09CNI1CNiRzY07CtvQHL0gUY0wCtuQbL0+C9uQHL0+CNIwCdvQDyiRHY0wC9hRDCkQDiLPGdsQXL0CGNIwCdvQDivQvL01CNtQDivQvL01CtsQDL03CNI+CdvQ7J0") };
function find(k) {
if (got[k])
return;
got[k] = 1;
ls(GOT, JSON.stringify(got));
paint();
if (k === "d13")
recOn();
if (mt) {
mt.classList.remove("ping");
void mt.offsetWidth;
mt.classList.add("ping");
}
if (n() === KEYS.length)
finale();
else
toast(NAME[k], NEXT[k] || "");
}
var busy = false;
function veil(cls) { var o = H("div", "f13-veil " + (cls || "")); o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); document.body.appendChild(o); document.body.classList.add("noscroll"); requestAnimationFrame(function () { requestAnimationFrame(function () { o.classList.add("on"); }); }); return o; }
function unveil(o, cb) { o.classList.remove("on"); document.body.classList.remove("noscroll"); setTimeout(function () { o.remove(); busy = false; if (cb)
cb(); }, 600); }
var epb = document.getElementById("ep-btns"), taps = 0, lastTap = 0, prevRead = 0;
if (epb)
epb.addEventListener("click", function (e) {
var b = e.target.closest && e.target.closest(".ep-btn");
if (!b || busy || got.ep13)
return;
var t = Date.now();
if (b.textContent.trim() !== "13") {
taps = 0;
return;
}
if (t - lastTap > 1600) {
taps = 0;
prevRead = (window.SF && SF.read) || 0;
}
lastTap = t;
taps++;
if (taps >= 13) {
taps = 0;
setTimeout(episode13, 80);
}
}, true);
function hum(sec) { var a = ac(); if (!a)
return; try {
var t = a.currentTime, o = a.createOscillator(), g = a.createGain(), lp = a.createBiquadFilter();
o.type = "sawtooth";
o.frequency.value = 59;
lp.type = "lowpass";
lp.frequency.value = 180;
g.gain.setValueAtTime(0, t);
g.gain.linearRampToValueAtTime(.06, t + .3);
g.gain.setValueAtTime(.06, t + sec - .3);
g.gain.linearRampToValueAtTime(0, t + sec);
o.connect(lp);
lp.connect(g);
g.connect(a.destination);
o.start(t);
o.stop(t + sec);
}
catch (e) { } }
function vcrDate() { var d = new Date(), p = function (x) { return ("0" + x).slice(-2); }; return Z("=AioQ/J0") + p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + String(d.getFullYear()).slice(-2) + "  " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()); }
function episode13() {
if (busy)
return;
busy = true;
var o = H("div", "f13-vhs");
o.setAttribute("aria-hidden", "true");
o.innerHTML = '<video playsinline muted preload="auto"><source src="' + Z("=QDct5iMrdjdv8WZklmd") + '" type="video/mp4"><source src="' + Z("tJWZ35iMrdjdv8WZklmd") + '" type="video/webm"></video>' +
'<div class="vh-blue"></div><div class="vh-scan"></div><div class="vh-trk"></div>' +
'<div class="vh-osd vh-tl">▶ PLAY</div><div class="vh-osd vh-tr">SP</div>' +
'<div class="vh-osd vh-bl">' + Z("==wMxAyrQjJ0gCdlQHK0") + '<br>«' + Z("=AJ0mCNmQ3J0iC9rQ/J0") + '»</div><div class="vh-osd vh-br"></div><div class="vh-osd vh-msg"></div>';
document.body.appendChild(o);
document.body.classList.add("noscroll");
var v = o.querySelector("video"), br = o.querySelector(".vh-br"), tl = o.querySelector(".vh-tl"), msg = o.querySelector(".vh-msg");
v.muted = true;
v.playsInline = true;
try {
v.load();
}
catch (e) { }
br.textContent = vcrDate();
var tick = setInterval(function () { br.textContent = vcrDate(); }, 1000);
key();
hum(6.2);
vib([40]);
setTimeout(function () { o.classList.add("trk"); staticNoise(.45, .25); try {
var p = v.play();
if (p && p.catch)
p.catch(function () { });
}
catch (e) { } }, 900);
setTimeout(function () { o.classList.remove("trk"); o.classList.add("play"); }, 1300);
setTimeout(function () { msg.textContent = Z("==gpQjJ0bCNIYCNlQXJ0gCdoQDinQ3J0eCNIu4J0bCNqQvK0SCNIeCdnQ7J0"); o.classList.add("msg"); vib([60, 40, 60]); }, 3600);
setTimeout(function () { o.classList.add("rew"); tl.textContent = "◀◀"; staticNoise(.5, .3); }, 5000);
setTimeout(function () { o.classList.remove("play", "rew", "msg"); o.classList.add("stop"); tl.textContent = "■ STOP"; key(); try {
v.pause();
}
catch (e) { } }, 5500);
setTimeout(function () { o.classList.add("out"); }, 6200);
setTimeout(function () {
clearInterval(tick);
o.remove();
document.body.classList.remove("noscroll");
var pb = prevRead && prevRead !== 13 && epb ? [].filter.call(epb.querySelectorAll(".ep-btn"), function (x) { return x.textContent.trim() === String(prevRead); })[0] : null;
if (pb)
pb.click();
else if (window.SFapply)
SFapply();
busy = false;
find("ep13");
}, 6700);
}
function scream() {
var a = ac();
if (!a)
return;
try {
var t = a.currentTime, out = a.createGain();
out.gain.setValueAtTime(1, t);
out.gain.setValueAtTime(1, t + .6);
out.gain.exponentialRampToValueAtTime(.001, t + 1.3);
out.connect(a.destination);
var n = a.createBufferSource();
n.buffer = noiseBuf(a, 1.5);
var bp = a.createBiquadFilter();
bp.type = "bandpass";
bp.Q.value = 2.5;
bp.frequency.setValueAtTime(900, t);
bp.frequency.exponentialRampToValueAtTime(3600, t + .25);
bp.frequency.exponentialRampToValueAtTime(1800, t + 1.4);
var ng = a.createGain();
ng.gain.value = .9;
n.connect(bp);
bp.connect(ng);
ng.connect(out);
n.start(t);
n.stop(t + 1.5);
[520, 553, 741, 1047].forEach(function (f, k) {
var o = a.createOscillator(), g = a.createGain(), v = a.createOscillator(), vg = a.createGain();
o.type = k % 2 ? "sawtooth" : "square";
o.frequency.setValueAtTime(f * .7, t);
o.frequency.exponentialRampToValueAtTime(f, t + .12);
o.frequency.exponentialRampToValueAtTime(f * .85, t + 1.4);
v.frequency.value = 11 + k * 3;
vg.gain.value = f * .04;
v.connect(vg);
vg.connect(o.frequency);
g.gain.value = .07;
o.connect(g);
g.connect(out);
o.start(t);
v.start(t);
o.stop(t + 1.5);
v.stop(t + 1.5);
});
boom();
}
catch (e) { }
}
var FACES = [Z("==AciV2dugDezE3Ln1Wa"), Z("==AciV2dukDezE3Ln1Wa")];
function preFaces() { FACES.forEach(function (u) { var i = new Image(); i.src = u; }); }
function scare(done) {
var d = H("div", "f13-scare");
d.setAttribute("aria-hidden", "true");
d.innerHTML = '<div class="sc-img"></div>';
document.body.appendChild(d);
var im = d.firstChild;
im.style.backgroundImage = 'url("' + FACES[0] + '")';
scream();
vib([600, 40, 300]);
d.classList.add("on");
setTimeout(function () { im.style.backgroundImage = 'url("' + FACES[1] + '")'; d.classList.add("two"); }, RM ? 300 : 210);
setTimeout(function () { d.classList.add("off"); }, RM ? 600 : 470);
setTimeout(function () { d.remove(); done(); }, RM ? 700 : 560);
}
var pm = document.getElementById("pmodal"), seenP = {}, opens = 0, open13 = ls(NOP) === "13";
if (pm)
new MutationObserver(function () { if (!pm.hidden && got.ep13) {
var t = document.getElementById("pm-title"), nm = t && t.textContent;
if (nm && !seenP[nm]) {
seenP[nm] = 1;
opens++;
if (opens === 12 && !open13) {
open13 = true;
ls(NOP, "13");
setTimeout(function () { card(true); }, 400);
}
}
} }).observe(pm, { attributes: true, attributeFilter: ["hidden"] });
var grid = document.getElementById("people");
function card(fresh) {
if (!grid || !open13 || grid.querySelector(".f13-person"))
return;
var b = H("button", "person f13-person" + (fresh ? " fresh" : "") + (got.d13 ? " seen" : ""));
b.type = "button";
var fig = H("figure", "pol f13-cardpol");
var bl = H("div", "blank f13-static", "");
bl.setAttribute("aria-hidden", "true");
fig.appendChild(bl);
fig.appendChild(H("span", "stamp dead", Z("zEDIWSo4g4L07CdtQTL0")));
fig.appendChild(H("figcaption", "", got.d13 ? Z("==wiRLK0") : "???"));
b.appendChild(fig);
b.appendChild(H("span", "pmeta", Z("==gvQLY0HGNI+CtuQzY07CtvQLY0g4L0CG9iRDY06CtgR7L0")));
b.onclick = dossier;
grid.appendChild(b);
}
if (grid)
new MutationObserver(function () { card(false); }).observe(grid, { childList: true });
card(false);
function dossier() {
if (busy)
return;
busy = true;
preFaces();
var o = H("div", "f13-desk");
o.setAttribute("role", "dialog");
o.setAttribute("aria-modal", "true");
o.setAttribute("aria-label", NAME.d13);
var hh = hm();
o.innerHTML = '<div class="f13-file"><button type="button" class="f13-x" aria-label="Закрыть">✕</button>' +
'<div class="ff-head"><span class="ff-sec">' + Z("==gvQ3L0CGdtQDY06CdtQHY0g4L09CdvQXL0IGNgRXL0yCtvQHY0") + '</span><span class="ff-no">' + Z("zEDIWSo4g4L07CdtQTJ0") + '</span></div>' +
'<div class="ff-top"><dl class="ff-dl">' +
'<dt>' + Z("PGNvQjJ0") + '</dt><dd><i class="ff-red">████████</i></dd>' +
'<dt>' + Z("1CNtQPJ0") + '</dt><dd>' + Z("wCdvQDL0AGtuQ3Y0gMY0") + '</dd>' +
'<dt>' + Z("==AsQTL0zCtvQrJ0") + '</dt><dd>' + Z("==AIsAL0GGNuQ3L0CG9jR/L0") + hh + '</dd>' +
'<dt>' + Z("BG9gRLY0wCtgRHK0") + '</dt><dd class="ff-st">' + Z("CGdtQDL0CGNuQfY0") + '</dd></dl>' +
'<figure class="ff-photo"><span class="ff-clip"></span><div class="ff-img"></div><figcaption>' + Z("==wjR3L00CtvQPL01CdgRDivQLY0PGdvQHY0") + '</figcaption></figure></div>' +
'<div class="ff-text"></div><p class="ff-last"></p><p class="ff-note"></p></div>';
document.body.appendChild(o);
document.body.classList.add("noscroll");
requestAnimationFrame(function () { o.classList.add("on"); });
var box = o.querySelector(".ff-text"), last = o.querySelector(".ff-last"), photo = o.querySelector(".ff-photo"), note = o.querySelector(".ff-note"), st = o.querySelector(".ff-st");
var im = new Image();
im.onload = function () { o.querySelector(".ff-img").style.backgroundImage = 'url("' + im.src + '")'; };
im.onerror = function () { o.querySelector(".ff-img").style.backgroundImage = 'url("img/shadow.webp")'; };
im.src = Z("==AciV2duEjb1I3Ln1Wa");
var F = [Z("=ACLwCthRjL09CtgR/Y0fCNIuAL0AGtvQTY0CGdvQXL0hCNI+C9uQXL00CNICGdtQDL0CGNuQfK0") + hh + ".", Z("=4SKwCNK7CNsQrL0BGNuQDivQLY0t4L0zCtvQrJ0g4CtQ/Y0AGNtQ7L0/CNI1CNjRHY0+CNtQDCjRLY0wCthRTL0wCdvQXL0yCNtQDSKwCNK7C9iRDY06CtgR7J0"), Z("u0L0wCNgRrL0NGNIyCNICGNuQDY0CGtvQzL0BGNIBGNsQfY05CdtQHK0"), Z("u4L0FGNuQLY0gUL0CGNsQ3L08CtvQrL0gIJ0"), Z("==wPMGtgRHY01CNI+CtgR3ivQLY06CNI5CtvQ3L04C9vQHY0gAL03CNI+CtgRfY0gwyjRHY0CGdtQbL0wCtuQDStQ3L0gUL0xCdtQLK0")];
var shut = false, tt = 0, i = 0, j = 0, p = null, fin = false;
function close() { if (shut)
return; shut = true; clearTimeout(tt); o.remove(); document.body.classList.remove("noscroll"); busy = false; if (fin) {
find("d13");
var c = grid && grid.querySelector(".f13-person");
if (c) {
c.remove();
card(false);
}
} }
o.querySelector(".f13-x").onclick = close;
document.addEventListener("keydown", function k(e) { if (shut) {
document.removeEventListener("keydown", k);
return;
} if (e.key === "Escape")
close(); });
function step() {
if (shut)
return;
if (i >= F.length) {
tt = setTimeout(function () { if (shut)
return; o.classList.add("dim"); }, 1400);
setTimeout(function () { if (shut)
return; o.classList.add("dark"); }, 4800);
setTimeout(function () { if (shut)
return; o.classList.remove("dim", "dark"); scare(function () { if (shut)
return; o.classList.add("hit"); last.textContent = Z("==gLPGdgRnL0wCtsQjL0HGNsQDY0+CdsQ7L0gUL09CNI+CtuQzY07CtvQLK0"); photo.classList.add("show"); st.textContent = Z("5CNuQnY0OG9gRTL01C9uQHY0"); }); }, 7600);
setTimeout(function () { if (shut)
return; note.textContent = Z("==gLCG9gRjY04C9vQDCuQ3L0eCNIuIY0PGtvQLY0BGNI1CdvQDStQjY0MG9uQ7L0xCNIFGNsQrL02CtvQvL0xCtvQDCsQ3L0gsY0BGNsQfK0"); fin = true; drone(5); }, 9600);
return;
}
if (!p) {
p = H("p", "", "");
box.appendChild(p);
j = 0;
}
j = RM ? F[i].length : j + 1;
p.textContent = F[i].slice(0, j);
if (!RM && F[i].charAt(j - 1) !== " ")
key();
if (j >= F[i].length) {
i++;
p = null;
ding();
tt = setTimeout(step, i === F.length ? 900 : 700);
}
else
tt = setTimeout(step, 32 + Math.random() * 38);
}
tt = setTimeout(step, 900);
}
var vcr = document.querySelector(".vcr"), rec = null;
function recOn() {
if (!vcr || rec || !got.d13 || got.cam)
return;
var lb = vcr.querySelector(".vcr-lbl"), vt = vcr.querySelector(".vcr-time");
rec = { lbl: lb ? lb.innerHTML : "" };
vcr.classList.add("f13-live");
if (lb)
lb.innerHTML = '<b class="f13-rec">● REC</b> · ' + Z("MGdgRjL0/CNsQfL0gIY0RGNtQjL0gcrwgIDI8CNsQrL0");
var upd = function () { if (!rec || !vt)
return; var d = new Date(), t = ("0" + d.getHours()).slice(-2) + "<i>:</i>" + ("0" + d.getMinutes()).slice(-2); if (vt.innerHTML !== t) {
vt.innerHTML = t;
vt.classList.remove("slip");
} };
upd();
rec.t = setInterval(upd, 500);
}
function recOff() { if (!rec)
return; clearInterval(rec.t); var lb = vcr.querySelector(".vcr-lbl"); if (lb)
lb.innerHTML = rec.lbl; rec = null; vcr.classList.remove("f13-live"); var vt = vcr.querySelector(".vcr-time"); if (vt)
vt.innerHTML = "02<i>:</i>59"; }
recOn();
if (vcr)
vcr.addEventListener("click", function (e) { if (!rec || busy)
return; e.stopImmediatePropagation(); e.preventDefault(); cam(); }, true);
function cam() {
busy = true;
var o = H("div", "f13-cam");
o.setAttribute("role", "dialog");
o.setAttribute("aria-modal", "true");
o.setAttribute("aria-label", NAME.cam);
o.innerHTML = '<div class="fc-mon"><video playsinline preload="auto"><source src="' + Z("=QDct5CNxlzYv8WZklmd") + '" type="video/mp4"><source src="' + Z("tJWZ35CNxlzYv8WZklmd") + '" type="video/webm"></video>' +
'<div class="fc-scan"></div><div class="fc-osd fc-tl">' + Z("=AJ0iCNkQ3J0cCtnQrJ0gcrwgIDIcCNkQrJ0") + '</div><div class="fc-osd fc-tr"><b>●</b> REC</div><div class="fc-osd fc-br"></div><div class="fc-lost">' + Z("dC9rQDK0VCtoQ7J0fCNIbCNkQ3J0TCNmQHK0") + '</div></div>';
document.body.appendChild(o);
document.body.classList.add("noscroll");
requestAnimationFrame(function () { o.classList.add("on"); });
var v = o.querySelector("video"), br = o.querySelector(".fc-br"), fin = false;
br.textContent = vcrDate();
var tick = setInterval(function () { br.textContent = vcrDate(); }, 1000);
v.muted = false;
try {
var p = v.play();
if (p && p.catch)
p.catch(function () { v.muted = true; v.play().catch(function () { }); });
}
catch (e) { }
hum(10.5);
vib([30]);
var lunge = false;
v.addEventListener("timeupdate", function () { if (lunge || v.currentTime < 6.4)
return; lunge = true; o.classList.add("big"); vib([600, 40, 400]); if (v.muted)
scream(); });
function end() {
if (fin)
return;
fin = true;
o.classList.add("lost");
staticNoise(1.2, .3);
boom();
setTimeout(function () { clearInterval(tick); recOff(); busy = false; find("cam"); setTimeout(function () { o.remove(); }, 700); }, 1000);
}
v.addEventListener("ended", end);
setTimeout(end, 15000);
}
function finale() {
if (busy) {
setTimeout(finale, 800);
return;
}
busy = true;
var o = veil("f13-fin");
o.setAttribute("aria-label", Z("1CdLzEDIsAL0GGNuQ3L0CG9jR/J0"));
o.innerHTML = '<div class="ff-bg"></div><div class="f13-fin-t"><b>' + Z("1CdLzEDIsMY0GGNuQ3L0CG9jR/L0gkCsQjyuQjL02CdtQDY01C9vQDyiRLK0") + '</b>' +
'<p>' + Z("uAL09CtvQDY0+CtgRHY0g8Y0wCtgR/Y07CtuQ7L0AG9vQDCjRLY0BGdtQDCjRDY01C9vQXL0CGNIwCtgRnL0wCdgRDygRDivQ3J0g4CsQrL0+C9nQDiLAGtvQfL04CtsQXL07CdtQLY0gIL0gwY0BGtvQvL0DGdvQDY01CtsQDivQ3L0eCNIuAL0GGdvQ7L06CNI+CNtQDijRjL0AGdtQHY0g4Y0DGtgRDL0GGNtQDL09CNuQDY0CGNIpAL0osL01CNgRLY0+CNvQHY0+C9vQDyiRLK0") + '</p>' +
'<button type="button" class="f13-go">' + Z("DGdvQ7L0AGtvQLY0BGNIOG9gRLY0PG9uQrL0+CNgR/L0gwY0CG9iRDY06CtgR7J0") + '</button><p class="f13-s">' + Z("=UL06C9vQDL0IGNIyCNI5CtvQrL0IGtvQrL0gwY0CGNuQfY0OG9uQrL0LGtsQDivQ3L02CtvQzL0gMY08CdtQLK0g4CMwozMxAyiRLY0+CdsQHL0DGdgRDivQTJ0") + '</p></div>';
drone(7);
setTimeout(function () { o.classList.add("say"); }, 900);
o.querySelector(".f13-go").onclick = function () { ls(DONE, "1"); if (!ls(AT))
ls(AT, new Date().toISOString()); theme(true); badge(); var oc = document.querySelector(".f13-person:not(.f13-done)"); if (oc)
oc.remove(); perks(); unveil(o); window.scrollTo({ top: 0, behavior: RM ? "auto" : "smooth" }); };
}
})();