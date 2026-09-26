const destination=document.querySelector('#legacy-destination');
if(destination){const url=new URL(destination.href);url.search=location.search;url.hash=location.hash;location.replace(url.href);}
