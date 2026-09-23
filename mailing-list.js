document.querySelectorAll('.mailing-signup form').forEach(form=>{
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const status=form.querySelector('[role=status]');
  const button=form.querySelector('button[type="submit"]');
  if(form.name==='mike-wilson-mailing-list'&&!form.querySelector('input[type=checkbox]:checked')){
   status.textContent='Please choose at least one updates list.';
   return;
  }
  if(button.disabled) return;
  button.disabled=true;
  status.textContent='Submitting…';
  try{
   const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
   if(!response.ok) throw new Error('Submission failed');
   form.reset();
   status.textContent='Thank you! Your mailing-list request has been received.';
  }catch{
   status.textContent='We could not save your signup. Please try again later or contact us.';
  }finally{
   button.disabled=false;
  }
 });
});
