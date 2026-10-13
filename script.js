const target = new Date("2026-10-31T00:00:00+05:30").getTime();
const ids = ["days","hours","minutes","seconds"];
function updateCountdown(){
  const diff = target - Date.now();
  if(diff <= 0){ document.querySelector(".count-note").textContent = "The special day is here — let the celebrations begin!"; ids.forEach(id=>document.getElementById(id).textContent="00"); return; }
  const values=[Math.floor(diff/86400000),Math.floor(diff%86400000/3600000),Math.floor(diff%3600000/60000),Math.floor(diff%60000/1000)];
  ids.forEach((id,i)=>document.getElementById(id).textContent=String(values[i]).padStart(2,"0"));
}
updateCountdown();setInterval(updateCountdown,1000);
const audio=document.getElementById("bgMusic"), toggle=document.getElementById("musicToggle"), label=document.getElementById("musicLabel");
audio.volume = 0;
let rampTimer = null;
function rampMusicUp(){
  if(rampTimer) clearInterval(rampTimer);
  const targetVolume = 1;
  const steps = 40;
  let step = 0;
  audio.volume = 0;
  rampTimer = setInterval(()=>{
    step++;
    audio.volume = Math.min(targetVolume, step / steps);
    if(step >= steps){clearInterval(rampTimer);rampTimer=null;}
  }, 100);
}
async function startMusicFromInteraction(){
  if(!audio.paused) return;
  try{
    await audio.play();
    toggle.classList.add("playing");
    label.textContent="Pause music";
    toggle.setAttribute("aria-label","Pause background music");
    rampMusicUp();
  }catch(e){
    label.textContent="Tap to play music";
  }
}
let musicInteractionStarted = false;
function firstInteractionStartsMusic(){
  if(musicInteractionStarted) return;
  musicInteractionStarted = true;
  startMusicFromInteraction();
  document.removeEventListener("pointerdown", firstInteractionStartsMusic);
  document.removeEventListener("keydown", firstInteractionStartsMusic);
  document.removeEventListener("touchstart", firstInteractionStartsMusic);
}
document.addEventListener("pointerdown", firstInteractionStartsMusic, {once:true, passive:true});
document.addEventListener("keydown", firstInteractionStartsMusic, {once:true});
document.addEventListener("touchstart", firstInteractionStartsMusic, {once:true, passive:true});
toggle.addEventListener("click",async()=>{
  if(audio.paused){
    await startMusicFromInteraction();
  }else{
    audio.pause();
    if(rampTimer){clearInterval(rampTimer);rampTimer=null;}
    toggle.classList.remove("playing");
    label.textContent="Play music";
    toggle.setAttribute("aria-label","Play background music");
  }
});
const lightbox=document.getElementById("lightbox"), lightboxImage=document.getElementById("lightboxImage");
document.querySelectorAll(".photo-card").forEach(card=>card.addEventListener("click",()=>{const img=card.querySelector("img");if(img&&img.getAttribute("src")&&img.complete&&img.naturalWidth>0){lightboxImage.src=img.src;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false")}}));
function closeLightbox(){lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true");lightboxImage.src=""}
document.getElementById("closeLightbox").addEventListener("click",closeLightbox);lightbox.addEventListener("click",e=>{if(e.target===lightbox)closeLightbox()});document.addEventListener("keydown",e=>{if(e.key==="Escape")closeLightbox()});
