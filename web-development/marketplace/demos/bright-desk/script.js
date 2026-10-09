const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav-links');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});}

const cards=[...document.querySelectorAll('[data-resource]')];
const search=document.querySelector('#resource-search');
const filterIds=['grade-filter','subject-filter','type-filter','price-filter'];
function filterResources(){
  if(!cards.length)return;
  const q=(search?.value||'').trim().toLowerCase();
  const vals=Object.fromEntries(filterIds.map(id=>[id,document.querySelector('#'+id)?.value||'']));
  let shown=0;
  cards.forEach(card=>{
    const hay=(card.dataset.title+' '+card.dataset.subject+' '+card.dataset.grade+' '+card.dataset.type).toLowerCase();
    const okQ=!q||hay.includes(q);
    const okGrade=!vals['grade-filter']||card.dataset.grade.includes(vals['grade-filter']);
    const okSubject=!vals['subject-filter']||card.dataset.subject===vals['subject-filter'];
    const okType=!vals['type-filter']||card.dataset.type===vals['type-filter'];
    const okPrice=!vals['price-filter']||card.dataset.price===vals['price-filter'];
    const show=okQ&&okGrade&&okSubject&&okType&&okPrice;
    card.hidden=!show;if(show)shown++;
  });
  const empty=document.querySelector('.empty'); if(empty) empty.style.display=shown?'none':'block';
}
search?.addEventListener('input',filterResources);filterIds.forEach(id=>document.querySelector('#'+id)?.addEventListener('change',filterResources));

for(const form of document.querySelectorAll('form[data-demo-form]')){
  form.addEventListener('submit',e=>{e.preventDefault();const msg=form.querySelector('[data-form-message]');if(msg){msg.textContent='Demo form submitted. Connect your email or form provider here.';msg.hidden=false;}form.reset();});
}
