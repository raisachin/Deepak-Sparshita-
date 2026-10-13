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
const gate = document.getElementById("invitationGate");
document.body.classList.add("invitation-locked");

let invitationOpened = false;
async function openInvitation(){
  if(invitationOpened) return;
  invitationOpened = true;
  gate.classList.add("opening");
  gate.setAttribute("aria-label","Opening the engagement invitation");
  // Calling play directly from this tap/click gives mobile browsers the best chance
  // of allowing the soundtrack to start as part of the user's gesture.
  try{
    audio.volume = 0;
    await audio.play();
    toggle.classList.add("playing");
    label.textContent="Pause music";
    toggle.setAttribute("aria-label","Pause background music");
    rampMusicUp();
  }catch(e){
    label.textContent="Tap to play music";
  }
  window.setTimeout(()=>{
    gate.classList.add("dismissed");
    document.body.classList.remove("invitation-locked");
    document.body.classList.add("invitation-open");
    window.setTimeout(()=>gate.remove(),850);
  },720);
}
gate.addEventListener("click",openInvitation);
gate.addEventListener("keydown",e=>{
  if(e.key==="Enter" || e.key===" "){
    e.preventDefault();
    openInvitation();
  }
});
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

// Reveal sections gently as guests scroll.
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add("is-visible"));
}
