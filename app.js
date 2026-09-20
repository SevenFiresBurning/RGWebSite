const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('nav').classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu?.setAttribute('aria-expanded','false');document.querySelector('nav')?.classList.remove('open');}});
const inquiryType=document.querySelector('#type');
const requestedType=new URLSearchParams(location.search).get('type');
if(inquiryType&&requestedType){const option=[...inquiryType.options].find(o=>o.value.toLowerCase()===requestedType.toLowerCase()||o.textContent.toLowerCase()===requestedType.toLowerCase());if(option) inquiryType.value=option.value;}
document.querySelector('#inquiry-form')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const subject=f.get('type')+' — '+f.get('name');const body='Name: '+f.get('name')+'\n\n'+f.get('message');location.href='mailto:resistanceandground@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);document.querySelector('#form-status').textContent='Your email app should open with a prepared draft.';});

const reel=document.querySelector('#production-video');
const reelAudio=document.querySelector('.reel-audio');
if(reel&&reelAudio){
 const updateAudio=()=>{const enabled=!reel.muted;reelAudio.textContent=enabled?'Sound off':'Sound on';reelAudio.setAttribute('aria-pressed',String(enabled));};
 reelAudio.addEventListener('click',()=>{reel.muted=!reel.muted;if(reel.paused)reel.play().catch(()=>{});updateAudio();});
 reel.addEventListener('volumechange',updateAudio);
 updateAudio();
}
