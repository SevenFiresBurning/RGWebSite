(function(root) {
  'use strict';
  const lifetime = 14*86400000;
  function hash(value) {let result=2166136261; for(const ch of value) {result^=ch.charCodeAt(0);result=Math.imul(result,16777619);} return result>>>0;}
  function presentation(note,count,now,expanded=false) {
    const seed=hash(note.id), age=Math.max(0,Math.min(1,(now-note.createdAt)/lifetime));
    return {age,expired:now-note.createdAt>=lifetime,rotation:(seed%901)/100-4.5,x:((seed>>>8)%1000)/1000,width:.82+((seed>>>16)%150)/1000,gap:10+((seed>>>4)%15),font:Math.max(expanded?18:14,(expanded?24:22)-Math.log2(Math.max(1,count))*1.5)};
  }
  root.RGWallLayout={lifetime,presentation};
})(typeof window==='undefined'?globalThis:window);
