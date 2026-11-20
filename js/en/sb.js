/* Мини-клиент Supabase без библиотек. Запросы идут через сам сайт (/sb → Supabase, см. vercel.json),
   чтобы работало везде, где открывается delo-sentfora.vercel.app.
   Пока KEY пустой — бэкенда нет, блог работает в режиме «только в этом браузере». */
(function(){
var KEY="sb_publishable_HnI0Ed6xBN-9mObrBGfg6A_w0TJEFWX";                       /* anon / publishable key из Supabase → Project Settings → API */
var DIRECT="https://redroeevhlgkidfwaeqk.supabase.co";                    /* https://xxxx.supabase.co — для локальной проверки без Vercel */
var BASE=(location.hostname.indexOf("vercel.app")>-1||!DIRECT)?location.origin+"/sb":DIRECT;
var SK="sentfor_sb_session";
/* Cloudflare Turnstile: защита от ботов при анонимном входе и входе админа.
   Публичный ключ (site key) из Cloudflare → Turnstile. Пока пусто — капча выключена.
   ВАЖНО: в Supabase включать капчу только после того, как сайт с ключом уже выложен. */
var TS_KEY="0x4AAAAAAF2abdxsD_wH-S_s";
var tsLoad=null;
function loadTS(){
  if(window.turnstile) return Promise.resolve();
  if(tsLoad) return tsLoad;
  tsLoad=new Promise(function(res,rej){var sc=document.createElement("script"); sc.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; sc.async=true;
    sc.onload=function(){res()}; sc.onerror=function(){tsLoad=null; rej(new Error("captcha_load"))}; document.head.appendChild(sc)});
  return tsLoad;
}
/* получить одноразовый токен; окошко показывается, только если Cloudflare засомневался */
function captcha(){
  if(!TS_KEY) return Promise.resolve(null);
  return loadTS().then(function(){return new Promise(function(res,rej){
    var box=document.createElement("div"); box.className="sb-ts";
    box.style.cssText="position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:99999";
    document.body.appendChild(box);
    var id=null, done=false;
    function end(){try{if(id!==null) turnstile.remove(id)}catch(e){} box.remove()}
    var to=setTimeout(function(){if(done) return; done=true; end(); rej(new Error("captcha_timeout"))},25000);
    try{
      id=turnstile.render(box,{sitekey:TS_KEY,appearance:"interaction-only",execution:"render",language:"en",
        callback:function(t){if(done) return; done=true; clearTimeout(to); end(); res(t)},
        "error-callback":function(){if(done) return; done=true; clearTimeout(to); end(); rej(new Error("captcha_failed"))}});
    }catch(e){done=true; clearTimeout(to); end(); rej(new Error("captcha_failed"))}
  })});
}
function sec(tok){return tok?{captcha_token:tok}:undefined}
function lsg(){try{return JSON.parse(localStorage.getItem(SK)||"null")}catch(e){return null}}
function lss(v){try{if(v) localStorage.setItem(SK,JSON.stringify(v)); else localStorage.removeItem(SK)}catch(e){}}
var sess=lsg(), refreshing=null;

function hdr(auth){var h={"apikey":KEY,"Content-Type":"application/json"}; if(auth&&sess) h.Authorization="Bearer "+sess.access_token; else if(/^eyJ/.test(KEY)) h.Authorization="Bearer "+KEY; return h}
function save(d){sess={access_token:d.access_token,refresh_token:d.refresh_token,expires_at:Math.floor(Date.now()/1000)+(d.expires_in||3600)-60,user:d.user&&{id:d.user.id,email:d.user.email||null,anon:!!d.user.is_anonymous}}; lss(sess); return sess}
function err(r){return r.json().catch(function(){return {}}).then(function(j){var m=j.message||j.msg||j.error_description||j.error||("HTTP "+r.status); var e=new Error(m); e.status=r.status; e.code=j.code; throw e})}
function J(r){if(!r.ok) return err(r); return r.status===204?null:r.text().then(function(t){return t?JSON.parse(t):null})}

function refresh(){
  if(!sess) return Promise.resolve(null);
  if(refreshing) return refreshing;
  refreshing=fetch(BASE+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:hdr(false),body:JSON.stringify({refresh_token:sess.refresh_token})})
    .then(J).then(save).catch(function(e){if(e.status&&e.status<500){sess=null; lss(null)} throw e}).finally(function(){refreshing=null});
  return refreshing;
}
function fresh(){return sess&&sess.expires_at>Date.now()/1000?Promise.resolve(sess):refresh()}
/* анонимный вход: создаётся, только когда человек впервые лайкает или комментирует */
function ensure(){
  if(sess) return fresh().then(function(s){return s||ensure()});
  return captcha().then(function(tok){
    return fetch(BASE+"/auth/v1/signup",{method:"POST",headers:hdr(false),body:JSON.stringify({data:{},gotrue_meta_security:sec(tok)})}).then(J).then(save)});
}
function login(email,pass){
  return captcha().then(function(tok){
    return fetch(BASE+"/auth/v1/token?grant_type=password",{method:"POST",headers:hdr(false),body:JSON.stringify({email:email,password:pass,gotrue_meta_security:sec(tok)})}).then(J).then(save)});
}
function logout(){sess=null; lss(null)}

function rest(path,opt){
  opt=opt||{}; var auth=!!opt.auth;
  var go=function(){var h=hdr(auth&&!!sess); if(opt.prefer) h.Prefer=opt.prefer;
    return fetch(BASE+"/rest/v1/"+path,{method:opt.method||"GET",headers:h,cache:opt.method?"default":"no-store",body:opt.body?JSON.stringify(opt.body):undefined}).then(J)};
  return (auth?(opt.need?ensure():(sess?fresh():Promise.resolve(null))):Promise.resolve(null)).then(go);
}
function rpc(fn,args){return ensure().then(function(){return fetch(BASE+"/rest/v1/rpc/"+fn,{method:"POST",headers:hdr(true),body:JSON.stringify(args||{})}).then(J)})}
function inList(a){return "in.("+a.map(function(x){return '"'+String(x).replace(/"/g,"")+'"'}).join(",")+")"}

window.SB={
  on:!!KEY,
  user:function(){return sess&&sess.user},
  login:login, logout:logout, ensure:ensure,
  hwFollowers:function(){return fetch(BASE+"/rest/v1/rpc/hw_followers",{method:"POST",headers:hdr(false),body:"{}"}).then(J)},
  raw:function(path,opt){opt=opt||{}; opt.auth=true; if(opt.method) opt.need=true; return rest(path,opt)},
  isAdmin:function(){if(!sess) return Promise.resolve(false); return rest("admins?select=user_id&user_id=eq."+sess.user.id,{auth:true}).then(function(r){return !!(r&&r.length)}).catch(function(){return false})},
  profile:function(){if(!sess) return Promise.resolve(null); return rest("profiles?select=nick,ava,banned&id=eq."+sess.user.id,{auth:true}).then(function(r){return r&&r[0]||null})},
  saveProfile:function(nick,ava){return ensure().then(function(s){
    return rest("profiles?select=id&id=eq."+s.user.id,{auth:true}).then(function(r){
      return r&&r.length
        ? rest("profiles?id=eq."+s.user.id,{method:"PATCH",auth:true,need:true,body:{nick:nick,ava:ava}})
        : rest("profiles",{method:"POST",auth:true,need:true,prefer:"return=minimal",body:{id:s.user.id,nick:nick,ava:ava}});
    })})},
  likeCounts:function(ids){return rest("like_counts?select=post_id,n&post_id="+inList(ids))},
  likeCountsPre:function(pre){return rest("like_counts?select=post_id,n&post_id=like."+encodeURIComponent(pre)+"*")},
  myLikesPre:function(pre){if(!sess) return Promise.resolve([]); return rest("likes?select=post_id&user_id=eq."+sess.user.id+"&post_id=like."+encodeURIComponent(pre)+"*",{auth:true})},
  myLikes:function(ids){if(!sess) return Promise.resolve([]); return rest("likes?select=post_id&user_id=eq."+sess.user.id+"&post_id="+inList(ids),{auth:true})},
  like:function(id){return rest("likes",{method:"POST",auth:true,need:true,prefer:"resolution=ignore-duplicates,return=minimal",body:{post_id:id}})},
  unlike:function(id){return rest("likes?post_id=eq."+encodeURIComponent(id)+"&user_id=eq."+sess.user.id,{method:"DELETE",auth:true,need:true})},
  recentComments:function(n){return rest("comments_public?select=*&order=created_at.desc&limit="+(n||60),{auth:true})},
  comments:function(ids){return rest("comments_public?select=*&order=created_at.asc&post_id="+inList(ids),{auth:true})},
  addComment:function(c){return rest("comments",{method:"POST",auth:true,need:true,prefer:"return=representation",body:c}).then(function(r){return r&&r[0]})},
  delComment:function(id){return rest("comments?id=eq."+id,{method:"DELETE",auth:true,need:true})},
  setComment:function(id,patch){return rest("comments?id=eq."+id,{method:"PATCH",auth:true,need:true,body:patch})},
  report:function(id){return rest("reports",{method:"POST",auth:true,need:true,prefer:"resolution=ignore-duplicates,return=minimal",body:{comment_id:id}})},
  ban:function(uid){return rpc("admin_ban",{target:uid,on_off:true})},
  /* перенос прогресса: одноразовый код на сутки, вход не нужен */
  transferPut:function(d){return fetch(BASE+"/rest/v1/rpc/put_transfer",{method:"POST",headers:hdr(false),body:JSON.stringify({d:d})}).then(J)},
  transferTake:function(c){return fetch(BASE+"/rest/v1/rpc/take_transfer",{method:"POST",headers:hdr(false),body:JSON.stringify({c:c})}).then(J)},
  /* доска следователя: открыть по коду может любой, без входа */
  boardGet:function(code){return fetch(BASE+"/rest/v1/rpc/get_board",{method:"POST",headers:hdr(false),body:JSON.stringify({c:code})}).then(J).then(function(r){return r&&r[0]||null})},
  boardNew:function(code,title,data){return rest("boards",{method:"POST",auth:true,need:true,prefer:"return=minimal",body:{code:code,title:title,data:data}})},
  boardSet:function(code,title,data){return rest("boards?code=eq."+encodeURIComponent(code),{method:"PATCH",auth:true,need:true,prefer:"return=representation",body:{title:title,data:data}}).then(function(r){return !!(r&&r.length)})},
  boardDel:function(code){return rest("boards?code=eq."+encodeURIComponent(code),{method:"DELETE",auth:true,need:true})},
  /* общая доска (меняет только админ) и присланные доски на модерации */
  comThumb:function(){return rest("community?select=thumb:data->>thumb&id=eq.1").then(function(r){return r&&r[0]&&r[0].thumb||null})},
  comGet:function(){return rest("community?select=data,ver,updated_at&id=eq.1").then(function(r){return r&&r[0]||null})},
  comSet:function(data,ver){return rest("community?id=eq.1&ver=eq."+(+ver),{method:"PATCH",auth:true,need:true,prefer:"return=representation",body:{data:data}}).then(function(r){return r&&r[0]||null})},
  subAdd:function(o){return rest("board_subs",{method:"POST",auth:true,need:true,prefer:"return=minimal",body:o})},
  subGet:function(id){return rest("board_subs?select=id,owner,kind,title,nick,data,status,base,n,max_ep,created_at&id=eq."+(+id),{auth:true}).then(function(r){return r&&r[0]||null})},
  subDel:function(id){return rest("board_subs?select=id&id=eq."+(+id),{method:"DELETE",auth:true,need:true,prefer:"return=representation"}).then(function(r){if(!r||!r.length) throw new Error("no permission")})},
  subStatus:function(ids,st){return rpc("admin_sub_status",{ids:ids,st:st})},
  reportSub:function(id){return rpc("report_board_sub",{sid:+id})},
  comSubs:function(){return rest("board_subs?select=id,nick,title,data,base,n,created_at&kind=eq.community&status=eq.ok&order=id.asc")},
  gallery:function(off,lim){return rest("board_subs?select=id,title,nick,n,max_ep,thumb,created_at&kind=eq.gallery&status=eq.ok&order=created_at.desc&offset="+(+off)+"&limit="+(+lim))},
  /* прогнозы к обнове (supabase/pred.sql): свой ответ — upsert, общие проценты — без входа */
  predSave:function(a,nick){return ensure().then(function(se){return rest("preds?on_conflict=user_id",{method:"POST",auth:true,need:true,prefer:"resolution=merge-duplicates,return=minimal",body:{user_id:se.user.id,a:a,nick:nick||null,locked:true,updated_at:new Date().toISOString()}})})},
  predMine:function(){if(!sess) return Promise.resolve(null); return rest("preds?select=a,nick,locked&user_id=eq."+sess.user.id,{auth:true}).then(function(r){return r&&r[0]||null})},
  predStats:function(){return fetch(BASE+"/rest/v1/rpc/pred_stats",{method:"POST",headers:hdr(false),body:"{}"}).then(J)},
  hiddenSubs:function(){return rest("board_subs?select=id,kind,title,nick,n,thumb,created_at&status=eq.hidden&order=created_at.desc",{auth:true})}
};
})();
