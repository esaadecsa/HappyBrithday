
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
const $=s=>document.querySelector(s);
const screens={intro:$("#intro"),letter:$("#letter"),wish:$("#wish"),gift:$("#gift"),nope:$("#nope"),candle:$("#candle"),final:$("#final")};
const music=$("#background-music");
$("#nameIntro").textContent=CONFIG.name;
$("#nameFinal").textContent=CONFIG.name;
let noTries=2, micStream=null, audioCtx=null, analyser=null, blowLoop=null;

function showScreen(name){
  Object.values(screens).forEach(x=>x.classList.remove("active"));
  screens[name].classList.add("active");
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
$("#openBtn").onclick=openLetter;
$("#nextBtn").onclick=goWish;
$("#giftBtn").onclick=goGift;
$("#closeBtn").onclick=()=>showScreen("intro");
$("#againBtn").onclick=()=>{document.body.classList.remove("celebrating");showScreen("intro");};
$("#musicBtn").onclick=()=>{if(music.paused){startMusic();$("#musicBtn").textContent="♫"}else{music.pause();$("#musicBtn").textContent="Ⅱ"}};

$("#giftObject").addEventListener("click",()=>{
  const b=$("#giftObject");
  b.animate([{transform:"scale(1)"},{transform:"scale(.9) rotate(-4deg)"},{transform:"scale(1.03) rotate(2deg)"},{transform:"scale(1)"}],{duration:550,easing:"cubic-bezier(.22,1,.36,1)"});
  $("#giftTitle").innerHTML="Nah... <em>ini buat kamu.</em>";
  $("#giftQuestion").innerHTML="Sekarang pilih dengan jujur.<br><strong>mau atau nggak?</strong>";
  $("#choiceHint").textContent="aku lihat pilihanmu 👀";
});
$("#yesBtn").onclick=goCandle;
$("#noBtn").onclick=()=>{
  noTries--;
  showScreen("nope");
  $("#noCount").textContent="kesempatan: "+Math.max(noTries,0);
  if(noTries===0){
    $("#nopeTitle").innerHTML="Masih <em>ga mau?</em>";
    $("#nopeText").innerHTML="Oke... aku kasih satu pilihan terakhir.<br>Tapi jangan nyesel ya 😛";
  }
};
$("#retryBtn").onclick=goGift;
$("#reallyNoBtn").onclick=()=>{
  $("#nopeTitle").innerHTML="Yakin banget? <em>😳</em>";
  $("#nopeText").innerHTML="Aku tunggu 2 detik...<br><strong>...</strong>";
  $("#reallyNoBtn").textContent="oke, aku berubah pikiran";
  $("#reallyNoBtn").onclick=goGift;
  setTimeout(()=>$("#reallyNoBtn").textContent="oke, aku berubah pikiran",700);
};

$("#tapFlameBtn").onclick=finishCelebration;
$("#flameTarget").onclick=finishCelebration;

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
