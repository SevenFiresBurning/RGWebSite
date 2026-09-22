const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const mobileNav = matchMedia('(max-width: 650px)');
const dropdowns = [...document.querySelectorAll('.nav-dropdown')];
function setSubmenu(dropdown, open) {
  dropdown.querySelector('.nav-submenu-toggle').setAttribute('aria-expanded', String(open));
  dropdown.querySelector('.nav-submenu').hidden = !open;
  if (mobileNav.matches) dropdown.querySelector('.nav-overview').setAttribute('aria-expanded', String(open));
}
function closeSubmenus() { dropdowns.forEach(d => setSubmenu(d, false)); }
function openSubmenu(dropdown) {
  dropdowns.forEach(d => setSubmenu(d, d === dropdown));
}
function closeNavigation() {
  closeSubmenus();
  menu?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('open');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  closeSubmenus();
  menu.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
});
dropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('.nav-submenu-toggle');
  const overview = dropdown.querySelector('.nav-overview');
  const toggleSubmenu = () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    if (open) openSubmenu(dropdown); else setSubmenu(dropdown, false);
  };
  toggle.addEventListener('click', toggleSubmenu);
  overview.addEventListener('click', event => {
    if (mobileNav.matches) { event.preventDefault(); toggleSubmenu(); }
  });
  dropdown.addEventListener('pointerenter', event => {
    if (!mobileNav.matches && event.pointerType !== 'touch') openSubmenu(dropdown);
  });
  dropdown.addEventListener('pointerleave', () => {
    if (!mobileNav.matches && !dropdown.contains(document.activeElement)) setSubmenu(dropdown, false);
  });
  overview.addEventListener('focus', () => { if (!mobileNav.matches) openSubmenu(dropdown); });
  dropdown.addEventListener('focusout', event => {
    if (!mobileNav.matches && !dropdown.contains(event.relatedTarget)) setSubmenu(dropdown, false);
  });
  dropdown.addEventListener('keydown', event => {
    if (mobileNav.matches && event.target === overview && event.key === ' ') {
      event.preventDefault(); toggleSubmenu();
    }
    if (event.key === 'ArrowDown' && event.target.closest('.nav-topline')) {
      event.preventDefault(); openSubmenu(dropdown); dropdown.querySelector('.nav-submenu a').focus();
    }
  });
});
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const focusedDropdown = document.activeElement?.closest('.nav-dropdown');
  if (mobileNav.matches && nav?.classList.contains('open')) menu?.focus();
  else if (focusedDropdown) focusedDropdown.querySelector('.nav-overview').focus();
  closeNavigation();
});
document.addEventListener('click', event => {
  if (!nav?.contains(event.target) && !menu?.contains(event.target)) closeNavigation();
});
nav?.addEventListener('click', event => {
  if (event.target.closest('.nav-submenu a')) closeNavigation();
});
function syncNavigationMode() {
  closeNavigation();
  dropdowns.forEach(dropdown => {
    const overview = dropdown.querySelector('.nav-overview');
    if (mobileNav.matches) {
      overview.setAttribute('role', 'button');
      overview.setAttribute('aria-expanded', 'false');
      overview.setAttribute('aria-controls', dropdown.querySelector('.nav-submenu').id);
    } else {
      overview.removeAttribute('role');
      overview.removeAttribute('aria-expanded');
      overview.removeAttribute('aria-controls');
    }
  });
}
syncNavigationMode();
mobileNav.addEventListener('change', syncNavigationMode);

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
