
const CONFIG={
  name:"kamu",
  birthday:"2026-10-22T00:00:00+07:00",
  letter:[
    "Hari ini, aku langitkan semua doa baik untuk kamu.",
    "Semoga hal-hal yang membuatmu lelah perlahan berubah menjadi alasan untuk tersenyum.",
    "Semoga langkahmu dimudahkan, rezekimu dilapangkan, dan orang-orang baik selalu menemukan jalan menuju hidupmu.",
    "Dan semoga kamu selalu punya alasan untuk bangga pada dirimu sendiri."
  ]
};
// Optional personalization via URL, e.g. ?to=Nadia&date=2026-10-22 — makes the same
// page reusable for anyone without touching the code.
(function applyUrlParams(){
  const p=new URLSearchParams(location.search);
  const to=p.get("to");const date=p.get("date");
  if(to)CONFIG.name=to;
  if(date && /^\d{4}-\d{2}-\d{2}$/.test(date))CONFIG.birthday=date+"T00:00:00+07:00";
})();
const $=s=>document.querySelector(s);
const screens={intro:$("#intro"),letter:$("#letter"),wish:$("#wish"),gift:$("#gift"),nope:$("#nope"),candle:$("#candle"),final:$("#final")};
const SCREEN_ORDER=["intro","letter","wish","gift","candle","final"];
const music=$("#background-music");
$("#nameIntro").textContent=CONFIG.name;
$("#nameFinal").textContent=CONFIG.name;
document.title=`For ${CONFIG.name} ♡`;
let noTries=2, micStream=null, audioCtx=null, analyser=null, blowLoop=null;
let sfxOn=true, currentScreen="intro";

function updateProgress(name){
  const idx=SCREEN_ORDER.indexOf(name);
  document.querySelectorAll("#progress i").forEach((dot,i)=>{
    dot.classList.toggle("on", SCREEN_ORDER[idx]===dot.dataset.step);
    dot.classList.toggle("done", idx>-1 && SCREEN_ORDER.indexOf(dot.dataset.step)<idx && SCREEN_ORDER.indexOf(dot.dataset.step)>-1);
  });
}
function showScreen(name){
  Object.values(screens).forEach(x=>x.classList.remove("active"));
  screens[name].classList.add("active");
  currentScreen=name;
  updateProgress(name==="nope"?"gift":name);
}
function typeWriter(lines,speed=25){
  const el=$("#typeText"); el.textContent="";
  let li=0,ci=0;
  const tick=()=>{
    if(li>=lines.length)return;
    const line=lines[li];
    if(ci<line.length){el.textContent+=line[ci++];setTimeout(tick,speed)}
    else{el.textContent+="\n\n";li++;ci=0;setTimeout(tick,380)}
  };tick();
}
function startMusic(){music.play().catch(()=>{});}

/* ---------- tiny synthesized sound effects (no audio files needed) ---------- */
let sfxCtx=null;
function getSfxCtx(){
  if(!sfxCtx)sfxCtx=new (window.AudioContext||window.webkitAudioContext)();
  return sfxCtx;
}
function playSfx(type){
  if(!sfxOn)return;
  try{
    const ctx=getSfxCtx();
    const now=ctx.currentTime;
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.connect(g);g.connect(ctx.destination);
    const presets={
      tap:{f:520,to:640,dur:.09,type:"sine",vol:.05},
      pop:{f:300,to:900,dur:.22,type:"triangle",vol:.06},
      whoosh:{f:180,to:60,dur:.35,type:"sawtooth",vol:.035},
      chime:{f:660,to:990,dur:.5,type:"sine",vol:.055}
    };
    const p=presets[type]||presets.tap;
    o.type=p.type;
    o.frequency.setValueAtTime(p.f,now);
    o.frequency.exponentialRampToValueAtTime(Math.max(p.to,1),now+p.dur);
    g.gain.setValueAtTime(p.vol,now);
    g.gain.exponentialRampToValueAtTime(.0001,now+p.dur);
    o.start(now);o.stop(now+p.dur+.02);
  }catch(e){/* audio unavailable, fail silently */}
}
$("#sfxBtn").onclick=()=>{
  sfxOn=!sfxOn;
  $("#sfxBtn").textContent=sfxOn?"🔔":"🔕";
  $("#sfxBtn").style.opacity=sfxOn?"1":".5";
  if(sfxOn)playSfx("tap");
};

/* ---------- ambient floating hearts ---------- */
function spawnHeart(){
  const layer=$("#hearts");
  if(!layer)return;
  const e=document.createElement("span");
  e.className="floating-heart";
  e.textContent=Math.random()>.5?"♡":"♥";
  const size=12+Math.random()*20;
  e.style.left=Math.random()*100+"vw";
  e.style.fontSize=size+"px";
  e.style.setProperty("--drift",(Math.random()*140-70)+"px");
  e.style.setProperty("--spin",(Math.random()*40-20)+"deg");
  const dur=9+Math.random()*8;
  e.style.animationDuration=dur+"s";
  layer.appendChild(e);
  setTimeout(()=>e.remove(),dur*1000+200);
}
setInterval(spawnHeart, 1400);
for(let i=0;i<5;i++)setTimeout(spawnHeart,i*350);

/* ---------- occasional shooting star ---------- */
function spawnShootingStar(){
  const layer=$("#stars");
  if(!layer)return;
  const e=document.createElement("span");
  e.className="shooting-star";
  e.style.left=(20+Math.random()*55)+"vw";
  e.style.top=(5+Math.random()*30)+"vh";
  layer.appendChild(e);
  setTimeout(()=>e.remove(),1600);
}
setInterval(()=>{ if(Math.random()<.55) spawnShootingStar(); }, 4200);

/* ---------- cursor glow (desktop) ---------- */
if(window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches){
  const glow=$("#cursorGlow");
  window.addEventListener("pointermove",e=>{
    glow.style.transform=`translate(${e.clientX-130}px, ${e.clientY-130}px)`;
    glow.classList.add("visible");
  });
  window.addEventListener("pointerleave",()=>glow.classList.remove("visible"));
}

/* ---------- 3D tilt on photo + gift box ---------- */
document.querySelectorAll(".tilt-el").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`perspective(700px) rotateY(${px*14}deg) rotateX(${-py*14}deg)`;
  });
  el.addEventListener("pointerleave",()=>{ el.style.transform=""; });
});

/* ---------- birthday countdown on intro ---------- */
function updateCountdown(){
  const el=$("#countdown");
  if(!el)return;
  const now=new Date();
  let target=new Date(CONFIG.birthday);
  // roll forward to the next occurrence of that month/day
  target.setFullYear(now.getFullYear());
  if(target<now){ target.setFullYear(now.getFullYear()+1); }
  const diffMs=target-now;
  const days=Math.ceil(diffMs/86400000);
  if(days<=0 || (target.getMonth()===now.getMonth() && target.getDate()===now.getDate())){
    el.innerHTML="✦ hari ini hari spesialnya ✦";
    el.classList.add("today");
  }else{
    el.innerHTML=`<b>${days}</b> hari lagi menuju hari spesialnya`;
    el.classList.remove("today");
  }
}
updateCountdown();
setInterval(updateCountdown, 3600000);

/* ---------- share ---------- */
$("#shareBtn").onclick=async()=>{
  const url=location.href;
  const hint=$("#shareHint");
  try{
    if(navigator.share){
      await navigator.share({title:document.title,text:`Ada surat kecil untuk ${CONFIG.name} ♡`,url});
      hint.textContent="terkirim ✦";
    }else{
      await navigator.clipboard.writeText(url);
      hint.textContent="link disalin ke clipboard ✦";
    }
    playSfx("chime");
  }catch(e){
    hint.textContent="";
  }
  setTimeout(()=>{hint.textContent="";},3000);
};

/* ---------- keyboard + swipe navigation ---------- */
function primaryAction(){
  const map={intro:openLetter,letter:goWish,wish:goGift,candle:null,final:null};
  if(currentScreen==="letter")return goWish();
  if(currentScreen==="intro")return openLetter();
  if(currentScreen==="wish")return goGift();
}
document.addEventListener("keydown",e=>{
  if(["ArrowRight","Enter"," "].includes(e.key)){
    if(["intro","letter","wish"].includes(currentScreen)){e.preventDefault();primaryAction();}
  }
  if(e.key==="Escape" && currentScreen==="letter"){showScreen("intro");}
});
let touchStartX=0, touchStartY=0;
document.addEventListener("touchstart",e=>{
  touchStartX=e.changedTouches[0].clientX;
  touchStartY=e.changedTouches[0].clientY;
},{passive:true});
document.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-touchStartX;
  const dy=e.changedTouches[0].clientY-touchStartY;
  if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)*1.5 && dx<0){
    if(["intro","letter","wish"].includes(currentScreen)) primaryAction();
  }
},{passive:true});

function confetti(){
  const layer=$("#confetti");
  const colors=["#ff8db6","#ffb8d1","#a28cff","#fff","#ffd166"];
  for(let i=0;i<150;i++){
    const e=document.createElement("i");e.className="confetti";
    e.style.left=Math.random()*100+"vw";
    e.style.setProperty("--x",(Math.random()*320-160)+"px");
    e.style.animationDelay=(Math.random()*.7)+"s";
    e.style.animationDuration=(2.3+Math.random()*2)+"s";
    e.style.background=colors[Math.floor(Math.random()*colors.length)];
    e.style.transform=`rotate(${Math.random()*360}deg)`;
    layer.appendChild(e);setTimeout(()=>e.remove(),5200);
  }
}
function openLetter(){startMusic();showScreen("letter");typeWriter(CONFIG.letter);}
function goWish(){showScreen("wish");}
function goGift(){
  showScreen("gift");
  $("#giftTitle").innerHTML="Ada <em>hadiah</em> buat kamu.";
  $("#giftQuestion").innerHTML="Tapi sebelum itu...<br><strong>kamu mau?</strong>";
  $("#choiceHint").textContent="sentuh hadiahnya dulu ✦";
}
function goCandle(){
  showScreen("candle");
  $("#cakeScene").classList.remove("blown");
  $("#micStatus").textContent="izin mikrofon opsional · tap api selalu bisa";
}
function finishCelebration(){
  stopMic();
  $("#cakeScene").classList.add("blown");
  $("#micStatus").textContent="wish made ✦";
  setTimeout(()=>{showScreen("final");document.body.classList.add("celebrating");confetti();},850);
}
$("#openBtn").onclick=()=>{playSfx("pop");openLetter();};
$("#nextBtn").onclick=()=>{playSfx("tap");goWish();};
$("#giftBtn").onclick=()=>{playSfx("tap");goGift();};
$("#closeBtn").onclick=()=>showScreen("intro");
$("#againBtn").onclick=()=>{document.body.classList.remove("celebrating");showScreen("intro");};
$("#musicBtn").onclick=()=>{if(music.paused){startMusic();$("#musicBtn").textContent="♫"}else{music.pause();$("#musicBtn").textContent="Ⅱ"}};

let giftOpened=false;
$("#giftObject").addEventListener("click",()=>{
  const b=$("#giftObject");
  if(!giftOpened){
    giftOpened=true;
    playSfx("whoosh");
    b.classList.add("shaking");
    setTimeout(()=>{
      b.classList.remove("shaking");
      b.animate([{transform:"scale(1)"},{transform:"scale(.9) rotate(-4deg)"},{transform:"scale(1.06) rotate(3deg)"},{transform:"scale(1)"}],{duration:550,easing:"cubic-bezier(.22,1,.36,1)"});
      playSfx("pop");
      burstMiniConfetti(b);
      $("#giftTitle").innerHTML="Nah... <em>ini buat kamu.</em>";
      $("#giftQuestion").innerHTML="Sekarang pilih dengan jujur.<br><strong>mau atau nggak?</strong>";
      $("#choiceHint").textContent="aku lihat pilihanmu 👀";
    },430);
  }else{
    b.animate([{transform:"scale(1)"},{transform:"scale(.95)"},{transform:"scale(1)"}],{duration:250});
  }
});
function burstMiniConfetti(anchor){
  const r=anchor.getBoundingClientRect();
  const layer=$("#confetti");
  const colors=["#ff8db6","#ffb8d1","#a28cff","#fff","#ffd166"];
  for(let i=0;i<26;i++){
    const e=document.createElement("i");e.className="confetti";
    e.style.left=(r.left+r.width/2)+"px";
    e.style.top=r.top+"px";
    e.style.setProperty("--x",(Math.random()*220-110)+"px");
    e.style.animationDuration=(1.4+Math.random()*1.2)+"s";
    e.style.background=colors[Math.floor(Math.random()*colors.length)];
    layer.appendChild(e);setTimeout(()=>e.remove(),2800);
  }
}
$("#yesBtn").onclick=()=>{playSfx("chime");goCandle();};
$("#noBtn").onclick=()=>{
  playSfx("tap");
  noTries--;
  showScreen("nope");
  $("#noCount").textContent="kesempatan: "+Math.max(noTries,0);
  if(noTries===0){
    $("#nopeTitle").innerHTML="Masih <em>ga mau?</em>";
    $("#nopeText").innerHTML="Oke... aku kasih satu pilihan terakhir.<br>Tapi jangan nyesel ya 😛";
  }
};
$("#retryBtn").onclick=()=>{giftOpened=false;goGift();};
$("#reallyNoBtn").onclick=()=>{
  $("#nopeTitle").innerHTML="Yakin banget? <em>😳</em>";
  $("#nopeText").innerHTML="Aku tunggu 2 detik...<br><strong>...</strong>";
  $("#reallyNoBtn").textContent="oke, aku berubah pikiran";
  $("#reallyNoBtn").onclick=()=>{giftOpened=false;goGift();};
  setTimeout(()=>$("#reallyNoBtn").textContent="oke, aku berubah pikiran",700);
};

$("#tapFlameBtn").onclick=()=>{playSfx("whoosh");finishCelebration();};
$("#flameTarget").onclick=()=>{playSfx("whoosh");finishCelebration();};

async function startMic(){
  if(!navigator.mediaDevices?.getUserMedia){
    $("#micStatus").textContent="mikrofon tidak tersedia · tap api saja ✦";return;
  }
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:true});
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    analyser=audioCtx.createAnalyser();analyser.fftSize=512;
    const source=audioCtx.createMediaStreamSource(micStream);source.connect(analyser);
    const data=new Uint8Array(analyser.fftSize);
    let strong=0;
    $("#micStatus").textContent="tiup ke mikrofon... 🎙️";
    blowLoop=setInterval(()=>{
      analyser.getByteTimeDomainData(data);
      let sum=0;for(const v of data){const n=(v-128)/128;sum+=n*n}
      const rms=Math.sqrt(sum/data.length);
      if(rms>.075)strong++;else strong=Math.max(0,strong-1);
      if(strong>4)finishCelebration();
    },50);
  }catch(e){
    $("#micStatus").textContent="mikrofon dilewati · tap api saja ✦";
  }
}
function stopMic(){
  if(blowLoop){clearInterval(blowLoop);blowLoop=null}
  if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null}
  if(audioCtx){audioCtx.close().catch(()=>{});audioCtx=null}
}
$("#blowBtn").onclick=startMic;

document.addEventListener("pointerdown",()=>startMusic(),{once:true});

const stars=$("#stars");
for(let i=0;i<42;i++){
  const s=document.createElement("span");
  s.style.position="absolute";s.style.left=Math.random()*100+"%";s.style.top=Math.random()*100+"%";
  const size=1+Math.random()*2;s.style.width=s.style.height=size+"px";s.style.borderRadius="50%";
  s.style.background="rgba(255,255,255,.8)";s.style.opacity=(.12+Math.random()*.55).toFixed(2);
  s.style.animation=`twinkle ${2+Math.random()*4}s ease-in-out ${Math.random()*3}s infinite`;
  stars.appendChild(s);
}
const st=document.createElement("style");st.textContent="@keyframes twinkle{50%{opacity:.08;transform:scale(.5)}}";document.head.appendChild(st);

updateProgress("intro");
