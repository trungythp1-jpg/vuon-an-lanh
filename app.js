const panel=document.getElementById("wishPanel");
const explorer=document.getElementById("gardenExplorer");
const community=document.getElementById("communityPanel");
const toast=document.getElementById("toast");
const showToast=message=>{toast.textContent=message;toast.classList.add("show");window.setTimeout(()=>toast.classList.remove("show"),2600);};
const openPanel=()=>{closeExplorer();closeCommunity();panel.classList.add("open");panel.setAttribute("aria-hidden","false");window.setTimeout(()=>document.getElementById("wishText").focus(),450);};
const closePanel=()=>{panel.classList.remove("open");panel.setAttribute("aria-hidden","true");};
const openExplorer=()=>{closePanel();closeCommunity();explorer.classList.add("open");explorer.setAttribute("aria-hidden","false");};
const closeExplorer=()=>{explorer.classList.remove("open");explorer.setAttribute("aria-hidden","true");};
const openCommunity=()=>{closePanel();closeExplorer();renderWishes();community.classList.add("open");community.setAttribute("aria-hidden","false");};
const closeCommunity=()=>{community.classList.remove("open");community.setAttribute("aria-hidden","true");};
document.getElementById("wishButton").addEventListener("click",openPanel);
document.getElementById("closePanel").addEventListener("click",closePanel);
document.getElementById("enterButton").addEventListener("click",openExplorer);
document.getElementById("closeExplorer").addEventListener("click",closeExplorer);
document.getElementById("closeCommunity").addEventListener("click",closeCommunity);
document.getElementById("explorerWish").addEventListener("click",openPanel);
document.getElementById("communityWish").addEventListener("click",openPanel);
document.querySelectorAll('.desktop-nav a').forEach(link=>link.addEventListener("click",event=>{event.preventDefault();if(link.textContent.trim()==="Lời chúc")openCommunity();else openExplorer();}));
document.querySelector(".scroll-hint").addEventListener("click",event=>{event.preventDefault();openCommunity();});
document.querySelectorAll(".garden-place").forEach(button=>button.addEventListener("click",()=>{
 document.querySelectorAll(".garden-place").forEach(item=>item.classList.remove("selected"));
 button.classList.add("selected");
 const detail=document.getElementById("placeDetail");
 const details={pond:"Hồ Sen Bình Yên — Hít một hơi thật sâu, thả xuống mặt hồ những lo âu đang mang theo.",tree:"Cây Điều Lành — Chọn một việc tử tế nhỏ bạn có thể làm hôm nay, rồi để nó lớn lên từng ngày.",river:"Dòng Sông Đèn Lồng — Gửi một lời nguyện lành đến người bạn thương và để ánh đèn mang theo hy vọng."};
 detail.textContent=details[button.dataset.place];
}));
function readWishes(){try{return JSON.parse(localStorage.getItem("vuon-an-lanh-wishes")||"[]");}catch{return[];}}
function renderWishes(){
 const list=document.getElementById("wishList");
 const empty=document.getElementById("emptyWishes");
 const wishes=readWishes().slice().reverse();
 list.replaceChildren();
 wishes.forEach(wish=>{
  const card=document.createElement("article");card.className="wish-card";
  const message=document.createElement("p");message.textContent=wish.message;
  const meta=document.createElement("small");meta.textContent=wish.to?"GỬI ĐẾN "+wish.to.toLocaleUpperCase():"MỘT LỜI CHÚC ẨN DANH";
  card.append(message,meta);list.append(card);
 });
 empty.style.display=wishes.length?"none":"block";
}
function animateWish(message){
 const card=document.createElement("div");card.className="floating-wish";card.textContent=message;
 document.querySelector(".experience").append(card);
 window.setTimeout(()=>card.remove(),3900);
}
document.getElementById("wishForm").addEventListener("submit",event=>{
 event.preventDefault();
 const message=document.getElementById("wishText").value.trim();
 const to=document.getElementById("wishTo").value.trim();
 if(!message)return;
 const wishes=readWishes();
 wishes.push({message,to,createdAt:new Date().toISOString()});
 try{localStorage.setItem("vuon-an-lanh-wishes",JSON.stringify(wishes.slice(-60)));}catch{}
 document.getElementById("formSuccess").classList.add("show");
 document.getElementById("wishText").value="";
 document.getElementById("wishTo").value="";
 animateWish(message);
 showToast("Lời chúc đã được gieo vào khu vườn.");
 window.setTimeout(()=>{closePanel();document.getElementById("formSuccess").classList.remove("show");},1500);
});
document.getElementById("soundButton").addEventListener("click",toggleSound);
let audioContext=null,ambientSource=null,ambientGain=null,soundOn=false;
function toggleSound(){
 const button=document.getElementById("soundButton");
 if(soundOn){if(ambientGain)ambientGain.gain.setTargetAtTime(0,audioContext.currentTime,.4);if(ambientSource)ambientSource.stop(audioContext.currentTime+1);ambientSource=null;soundOn=false;button.classList.remove("is-playing");showToast("Đã tắt âm thanh khu vườn.");return;}
 try{
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  if(!AudioCtx){showToast("Thiết bị chưa hỗ trợ âm thanh nền.");return;}
  audioContext=audioContext||new AudioCtx();
  audioContext.resume();
  const buffer=audioContext.createBuffer(1,audioContext.sampleRate*3,audioContext.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*.22;
  ambientSource=audioContext.createBufferSource();ambientSource.buffer=buffer;ambientSource.loop=true;
  const filter=audioContext.createBiquadFilter();filter.type="lowpass";filter.frequency.value=520;filter.Q.value=.45;
  ambientGain=audioContext.createGain();ambientGain.gain.value=.0001;
  ambientSource.connect(filter);filter.connect(ambientGain);ambientGain.connect(audioContext.destination);
  ambientSource.start();ambientGain.gain.setTargetAtTime(.12,audioContext.currentTime,2);
  soundOn=true;button.classList.add("is-playing");showToast("Âm thanh nền dịu nhẹ đang phát.");
 }catch{showToast("Không thể phát âm thanh trên thiết bị này.");}
}
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closePanel();closeExplorer();closeCommunity();}});
const canvas=document.getElementById("ambientParticles");
const ctx=canvas.getContext("2d");
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let width=0,height=0,particles=[];
function resizeParticles(){
 const dpr=Math.min(window.devicePixelRatio||1,1.5);
 width=canvas.clientWidth;height=canvas.clientHeight;
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
 const count=Math.min(42,Math.round(width*height/26000));
 particles=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,r:.7+Math.random()*1.8,a:.16+Math.random()*.42,s:.12+Math.random()*.28,p:Math.random()*6.28}));
}
function drawParticles(){
 ctx.clearRect(0,0,width,height);
 particles.forEach(p=>{
  const shimmer=.55+.45*Math.sin(Date.now()*.0007+p.p);
  ctx.beginPath();ctx.fillStyle="rgba(255,221,157,"+(p.a*shimmer)+")";ctx.shadowBlur=9;ctx.shadowColor="rgba(255,205,120,.45)";
  ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
  if(!reducedMotion){p.y-=p.s*.18;p.x+=Math.sin(Date.now()*.00025+p.p)*.08;if(p.y< -8){p.y=height+8;p.x=Math.random()*width;}}
 });
 if(!reducedMotion)requestAnimationFrame(drawParticles);
}
window.addEventListener("resize",resizeParticles,{passive:true});
resizeParticles();drawParticles();
