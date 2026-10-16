(() => {
  'use strict';
  const ns='http://www.w3.org/2000/svg';
  document.querySelectorAll('.patch-panel').forEach(panel => {
    const svg=panel.querySelector('.patch-current'),links=[...panel.querySelectorAll('.patch-port')];
    const timers=new WeakMap();
    function select(link,index) {
      const branch=svg.querySelector(`[data-port="${index}"]`);
      branch?.classList.toggle('is-selected',link.matches(':hover,:focus-visible')||link.classList.contains('is-contact'));
    }
    function draw() {
      const box=panel.getBoundingClientRect(); if(!box.width) return;
      const points=links.map(link=>{const socket=link.querySelector('.patch-socket').getBoundingClientRect();return {x:socket.left-box.left+socket.width/2,y:socket.top-box.top,bus:socket.top-box.top-8};});
      let d=`M4 ${points[0].bus} H10 l3 -3 3 6 3 -6 3 6 3 -3 H${points[0].x}`;
      const groups=[...panel.querySelectorAll('.patch-group')];
      for(let i=1;i<points.length;i++) {
        const previous=points[i-1],point=points[i];
        if(Math.abs(point.bus-previous.bus)>8) {
          const returnY=groups[0].getBoundingClientRect().bottom-box.top+8;
          d+=` H${box.width-8} V${returnY} H8 V${point.bus}`;
        }
        d+=` H${point.x}`;
      }
      const ground=panel.querySelector('.patch-ground').getBoundingClientRect();
      d+=` H${box.width-8} V${ground.top-box.top-6} H${ground.left-box.left+ground.width/2} V${ground.top-box.top+3}`;
      svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
      svg.querySelector('.patch-conductor').setAttribute('d',d);
      svg.querySelector('.patch-signal').setAttribute('d',d);
      const branches=svg.querySelector('.patch-branches');branches.replaceChildren();
      points.forEach((point,index)=>{
        const group=document.createElementNS(ns,'g');group.classList.add('patch-branch');group.dataset.port=index;
        const lead=document.createElementNS(ns,'path');lead.setAttribute('d',`M${point.x} ${point.bus} V${point.y}`);
        const dot=document.createElementNS(ns,'circle');dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.bus);dot.setAttribute('r','1.2');
        group.append(lead,dot);branches.append(group);select(links[index],index);
      });
      panel.classList.add('is-wired');
    }
    links.forEach((link,index)=>{
      function contact(){clearTimeout(timers.get(link));link.classList.add('is-contact');select(link,index);timers.set(link,setTimeout(()=>{link.classList.remove('is-contact');select(link,index);},650));}
      link.addEventListener('pointerdown',event=>{if(event.button===0)contact();});
      link.addEventListener('click',contact);
      link.addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.repeat)contact();});
      link.addEventListener('pointercancel',()=>{clearTimeout(timers.get(link));link.classList.remove('is-contact');select(link,index);});
      for(const event of ['pointerenter','pointerleave','focus','blur'])link.addEventListener(event,()=>select(link,index));
    });
    new ResizeObserver(draw).observe(panel);
    document.fonts?.ready.then(draw);
    draw();
  });
})();
