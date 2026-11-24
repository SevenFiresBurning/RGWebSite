'use strict';
const {CONFIG,createState,action,step}=UTLogic,canvas=document.querySelector('canvas'),ctx=canvas.getContext('2d');let s=createState(),w=400,h=600,last=0,endingTime=0,audio=null,muted=true,quipTime=0,foot=0,selectedCharacter="wally";const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let sceneReady=false;
function updateStartReadiness(){const b=$('choose-start')||$('start');if(b&&s.mode==='ready'){b.disabled=!sceneReady;b.textContent=sceneReady?'START':'Loading artwork…';}}
const ARRIVAL_TIMING={approach:1.6,relief:2.2};
const $=id=>document.getElementById(id);function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);}addEventListener('resize',resize);resize();
function tone(freq,duration=.12,type='sine',volume=.06,slide=0){if(muted||!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.linearRampToValueAtTime(Math.max(30,freq+slide),audio.currentTime+duration);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);}
let bellVoices=[];
function stopSchoolBell(){const voices=bellVoices;bellVoices=[];for(const v of voices){v.osc.onended=null;try{v.gain.gain.cancelScheduledValues(audio.currentTime);v.gain.gain.setValueAtTime(0,audio.currentTime);v.osc.stop(audio.currentTime);}catch{}try{v.osc.disconnect();v.gain.disconnect();}catch{}}}
function playSchoolBell(){if(s.mode!=='playing'||muted||!audio||audio.state==='suspended'||audio.state==='closed')return;stopSchoolBell();const now=audio.currentTime;for(const strike of [0,.14,.28])for(const [frequency,volume]of [[980,.035],[1477,.014],[2461,.006]]){const osc=audio.createOscillator(),gain=audio.createGain(),v={osc,gain};osc.type='sine';osc.frequency.setValueAtTime(frequency,now+strike);osc.frequency.linearRampToValueAtTime(frequency*.993,now+strike+.18);gain.gain.setValueAtTime(.0001,now+strike);gain.gain.linearRampToValueAtTime(volume,now+strike+.003);gain.gain.exponentialRampToValueAtTime(.0001,now+strike+.18);osc.connect(gain);gain.connect(audio.destination);bellVoices.push(v);osc.onended=()=>{const i=bellVoices.indexOf(v);if(i>=0)bellVoices.splice(i,1);osc.disconnect();gain.disconnect();};osc.start(now+strike);osc.stop(now+strike+.2);}}
const CHARACTER_CAPTIONS={
 wally:{
  start:['Just a casual stroll. Nothing to see here.','Hoodie on. Dignity pending.','I should have gone before the bell.','The toilet is my next class.'],
  impact:['Oof. My dignity!','That had right of way, apparently.','My hoodie survived. My pride didn’t.','A minor scheduling setback.'],
  held:['Caught by the hoodie! Break away!','Hey! That hoodie is attached to me!','Hall pass? This is a bathroom emergency!'],
  release:['Hoodie recovered. Keep moving!','My escape was almost graceful.','No time to straighten the hoodie!'],
  slip:['I ordered a bathroom, not a water park!','My shoes have resigned.','That was a skid. Definitely intentional.','Whoa—floor ice! Water. Definitely water.'],
  mop:['Mop bucket: 1. Dignity: 0.','Cleaning up my act was not the plan.','Custodial ambush!'],
  turn:['Correct corridor. Questionable speed.','Hair first. Rest of me, follow!','Another corner. Still no toilet.'],
  corner:['Oof. Clipped the inside corner.','The wall and I had a disagreement.','My elbow found the shortcut.'],
  arrival:['Phew. Nearly there.','Please let this be the right door.','The finest door in this school.'],
  relief:['Aaaah. Finally.','That was uncomfortably close.','Dignity: mostly recovered.'],
  defeat:['Nobody saw that. Right?','I blame the timetable.','Can we transfer schools now?'],
  urgency0:['Still acting casual.','A very normal walk to a very important room.','I have plenty of time. Probably.'],
  urgency1:['Could this hallway be any longer?','Less strolling. More toilet.','Why did I finish that drink?'],
  urgency2:['My bladder has filed a complaint.','Hoodie strings are not emergency brakes.','Toilet. Toilet. Toilet.'],
  urgency3:['My entire body votes BATHROOM!','This is the least punk thing ever.','Please be the last hallway.'],
  round:['Crisis averted. My timetable disagrees.','One minute of peace was apparently too much.','Lunch was a tactical error.','Gym class counts that as cardio, right?','Final bell? Why am I still here?','My hoodie needs a hall pass.','I’m learning every tile in this school.','My bladder has declared a schoolwide emergency.','Who keeps adding more hallway?','Ten bathrooms. My finest, weirdest achievement.']
 },
 maryann:{
  start:['Small steps. Very big emergency.','Backpack ready. Bathroom, here I come!','I should have skipped that last sip.','My next stop had better have a toilet.'],
  impact:['Excuse me! Bathroom emergency!','My backpack did not sign up for this.','That was extremely inconvenient.','I meant to dodge that.'],
  held:['Caught by the backpack strap! Break away!','Hands off my backpack! I’m in a hurry!','This is NOT a good time for a hall pass!'],
  release:['Backpack free. Bathroom next!','Too quick for you! Hopefully quick enough.','Please let that be the last interruption.'],
  slip:['My shoes are doing their own thing!','This floor needs a warning AND a towel.','I am too busy for ice skating!','Okay. Tiny skid. Keep going!'],
  mop:['That bucket has terrible timing.','My backpack is not a mop!','Excuse me, cleaning emergency. Bigger emergency!'],
  turn:['Another turn. I’m still going!','Please be the hallway with the bathroom.','Backpack, keep up!'],
  corner:['Oof. The corner got me.','I was aiming for the hallway!','That shortcut was mostly wall.'],
  arrival:['Yes! That’s the door!','Finally! Finally!','Please hurry, feet.'],
  relief:['YES! Made it!','Best bathroom break ever.','Backpack down. Crisis over.'],
  defeat:['Seriously?!','That was deeply unfair.','I need a very large sweater.'],
  urgency0:['A quick bathroom trip. Easy.','I know where I’m going. Mostly.','My backpack and I have a plan.'],
  urgency1:['Okay, now I’m actually in a hurry.','Why are there so many classrooms?','That last sip was a mistake.'],
  urgency2:['Bathroom first. Everything else later!','My feet need to hurry up!','I am running out of polite thoughts.'],
  urgency3:['TOILET. NOW. PLEASE.','I can’t do another hallway!','This is a very serious tiny emergency!'],
  round:['Made it! I would like a quieter next minute.','Another passing period? I just passed everything!','Lunch needs better timing.','That definitely counts as gym class.','Final bell! So why are we still running?','Hands off the backpack. Bathroom business!','This corridor is getting ridiculous.','Everybody move. Tiny emergency coming through!','I’m starting to think this hallway is infinite.','Ten rounds! My backpack deserves a medal.']
 }
};
const captionState=new WeakMap();
function characterCaption(kind,stable=false){
 const pools=CHARACTER_CAPTIONS[s.character==='maryann'?'maryann':'wally'],pool=pools[kind]||pools.impact;
 if(kind==='round')return pool[s.levelIndex]||UTLogic.ROUND_SETTINGS.quips[s.levelIndex];
 if(stable)return pool[s.levelIndex%pool.length];
 let state=captionState.get(s);
 if(!state){state={counts:{},nextAt:s.time+12};captionState.set(s,state);}
 const index=state.counts[kind]??s.levelIndex;
 state.counts[kind]=index+1;
 return pool[index%pool.length];
}
function ambientCaption(){
 if(s.mode!=='playing'||s.stumble>0||s.monitorSlow>0)return;
 let state=captionState.get(s);
 if(!state){state={counts:{},nextAt:s.time+12};captionState.set(s,state);}
 if(s.time<state.nextAt||quipTime>0)return;
 const stage=s.pressure<30?0:s.pressure<60?1:s.pressure<85?2:3;
 quip(characterCaption('urgency'+stage));state.nextAt=s.time+12;
}
function soundInit(){if(!audio)audio=new(window.AudioContext||window.webkitAudioContext)();audio.resume();}function quip(t){$('quip').textContent=t;quipTime=2.7;}
function start(){if(s.mode!=='ready'||!sceneReady)return;stopSchoolBell();soundInit();s=createState();s.character=selectedCharacter;s.mode='playing';endingTime=0;foot=0;gesture=null;last=performance.now();$('overlay').hidden=true;$('pause').textContent='Pause';updateBladderHud();updateLevelHud();quip(characterCaption('start'));}function pause(){stopSchoolBell();if(s.mode==='playing'||s.mode==='catching'||s.mode==='ending'||s.mode==='relief'||s.mode==='roundTransition'){s.pausedFrom=s.mode;s.mode='paused';showCard('Hallway timeout','Take a breath. The bladder is on pause.','Resume',()=>{s.mode=s.pausedFrom||'playing';$('overlay').hidden=true;last=performance.now();$('pause').textContent='Pause';if(s.mode==='roundTransition')showRoundTransition();});$('pause').textContent='Resume';}else if(s.mode==='paused'){$('overlay').hidden=true;s.mode=s.pausedFrom||'playing';last=performance.now();$('pause').textContent='Pause';if(s.mode==='roundTransition')showRoundTransition();}}
function resumeRoundUi(){stopSchoolBell();if(audio?.state==='suspended')audio.resume();$('overlay').hidden=true;$('playAgain').hidden=true;$('pause').textContent='Pause';endingTime=0;foot=0;gesture=null;last=performance.now();updateBladderHud();updateLevelHud();}
let menuGeneration=0,menuActivatedAt=-Infinity;
function bindMenuAction(id,callback){
 const button=$(id),state=s,mode=s.mode,generation=menuGeneration;
 let used=false;
 button.disabled=false;
 button.onclick=event=>{
  const now=performance.now();
  if(used||generation!==menuGeneration||s!==state||s.mode!==mode||(event?.detail||0)>1||now-menuActivatedAt<300)return;
  used=true;menuActivatedAt=now;button.disabled=true;
  callback();
 };
 if(id==='again'&&mode==='completed')$('playAgain').onclick=button.onclick;
}
function showRoundTransition(){
 const current=UTLogic.levelStatus(s),next=UTLogic.LEVELS[s.levelIndex+1];
 showCard('Round '+current.number+' complete!',characterCaption('round',true)+'<br><b>Next: '+next.name+'</b><br>Ready when you are.','NEXT ROUND',()=>{
  if(UTLogic.beginNextRound(s))resumeRoundUi();
 });
}
const rgReportedRuns=new WeakSet();
function reportArcadeScore(){if(!['finished','completed'].includes(s.mode)||rgReportedRuns.has(s))return;rgReportedRuns.add(s);document.dispatchEvent(new CustomEvent('rg:game-ended',{detail:{score:Math.floor(s.score)}}));}
function showCard(title,body,label,fn){reportArcadeScore();
 stopSchoolBell();gesture=null;menuGeneration++;
 $('overlay').hidden=false;
 $('overlay').innerHTML='<div class="card" id="cardDialog" role="dialog" aria-labelledby="cardTitle" tabindex="-1"><span class="eyebrow">UR IN TROUBLE • HALLWAY 01</span><h1 id="cardTitle" style="font-size:42px;letter-spacing:-2px">'+title+'</h1><p>'+body+'</p><button type="button" class="primary" id="again">'+label+'</button></div>';
 bindMenuAction('again',fn);
 // Focus the card, allowing an intentional Tab to reach its action button.
 $('cardDialog').focus?.();
}
bindMenuAction('start',start);$('restart').onclick=chooseCharacter;$('pause').onclick=pause;$('sound').onclick=()=>{soundInit();muted=!muted;if(muted)stopSchoolBell();$('sound').textContent='Sound: '+(muted?'off':'on');if(!muted)tone(480);};const phoneControls=matchMedia('(pointer: coarse)').matches||innerWidth<600;$('touchToggle').checked=!phoneControls;$('touch').hidden=phoneControls;$('touchToggle').onchange=e=>$('touch').hidden=!e.target.checked;document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();action(s,b.dataset.action);}));
addEventListener('keydown',e=>{
 const keys={ArrowLeft:'left',a:'left',ArrowRight:'right',d:'right',ArrowUp:'jump',w:'jump',' ':'jump'};
 const waiting=['ready','roundTransition','finished','completed','paused'].includes(s.mode);
 if(waiting){
  const button=e.target?.tagName==='BUTTON';
  if((keys[e.key]&&!(e.key===' '&&button))||((e.key===' '||e.key==='Enter')&&e.repeat))e.preventDefault();
  if((e.key==='Escape'||e.key==='p')&&['paused','roundTransition'].includes(s.mode))pause();
  return;
 }
 if(keys[e.key]){e.preventDefault();if(!e.repeat)action(s,keys[e.key]);}
 if(e.key==='Escape'||e.key==='p')pause();
});let gesture=null;canvas.addEventListener('pointerdown',e=>{e.preventDefault();if(s.mode!=='playing')return;gesture={x:e.clientX,y:e.clientY,id:e.pointerId,used:false};canvas.setPointerCapture(e.pointerId);});
function swipeMove(e){if(!gesture||gesture.id!==e.pointerId||gesture.used)return;e.preventDefault();const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(Math.max(Math.abs(dx),Math.abs(dy))<Math.max(23,w*.065))return;gesture.used=true;if(Math.abs(dx)>Math.abs(dy))action(s,dx>0?'right':'left');else if(dy<0)action(s,'jump');}
canvas.addEventListener('pointermove',swipeMove);canvas.addEventListener('pointerup',e=>{swipeMove(e);gesture=null;});canvas.addEventListener('pointercancel',()=>gesture=null);document.addEventListener('visibilitychange',()=>{if(document.hidden&&(s.mode==='playing'||s.mode==='catching'||s.mode==='ending'||s.mode==='relief'))pause();});
function rect(x,y,ww,hh,color,r=0){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,ww,hh,r);ctx.fill();}function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}function line(x,y,xx,yy,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();}function text(t,x,y,size,color='#24464a'){ctx.fillStyle=color;ctx.font=`900 ${size}px system-ui`;ctx.textAlign='center';ctx.fillText(t,x,y);}function poly(points,color){ctx.fillStyle=color;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();}
function projection(d,lane){return worldPoint(lane-1,0,s.distance+d);}
function proceduralHallway(){rect(0,0,w,h,'#e8d9b4');const vy=h*.29;poly([[0,0],[w*.39,vy],[w*.39,h*.42],[0,h]],'#d6c5a1');poly([[w,0],[w*.61,vy],[w*.61,h*.42],[w,h]],'#c8b68e');poly([[0,h],[w*.39,vy],[w*.61,vy],[w,h]],'#f2ddaa');poly([[0,0],[w,0],[w*.61,vy],[w*.39,vy]],'#f9edd5');checkerFloor(vy);for(const x of [-1/3,1/3])line(w/2+x*w*.1,vy,w/2+x*w,h,'#d6c08b',2);// Classroom bays approach the player in world space, back to front.
for(let i=6;i>=0;i--){const d=i*22+22-s.distance%22;if(d>120)continue;for(const side of [-1,1])classroom(d,side,i);}
for(let i=0;i<3;i++){const p=(i+1)/4;rect(w/2-24*p,h*.03+h*.19*p,48*p,9*p,'#fffdf0',3);}rect(w*.37,h*.21,w*.26,h*.13,'#385d60',4);rect(w*.385,h*.22,w*.23,h*.035,'#f8d966',2);text('RESTROOM',w/2,h*.246,w*.021);text('→',w/2,h*.306,w*.05,'#fff4cb');ctx.save();ctx.translate(w*.12,h*.27);ctx.rotate(-.08);rect(-w*.105,-18,w*.21,42,'#fff4d5',3);text(s.pressure>48?'NO RUNNING':'WALK, PLEASE!',0,0,w*.023);text('YES, EVEN YOU.',0,14,w*.014);ctx.restore();}
function boyBase(x,y,scale,monitor=false,slump=false){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);const t=s.time*(3+s.speed*.6),swing=reduced?0:Math.sin(t),jump=s.jump?Math.sin((1-s.jump/CONFIG.jumpDuration)*Math.PI)*55:0,duck=s.duck>0;ctx.translate(0,-jump);ellipse(0,3,30,7,'#163b4435');if(duck)ctx.scale(1,.65);const tense=s.pressure>60,leg=slump?0:swing*(tense?7:12);line(-11,-38,-13+leg,-8,'#b88155',13);line(11,-38,13-leg,-8,'#b88155',13);rect(-22+leg,-20,15,17,'#f2dcc0',3);rect(7-leg,-20,15,17,'#f2dcc0',3);for(let stripe=0;stripe<3;stripe++){rect(-22+leg,-19+stripe*5,15,2,'#b9483b');rect(7-leg,-19+stripe*5,15,2,'#3b7591');}ellipse(-16+leg,-4,15,9,'#94473d');ellipse(16-leg,-4,15,9,'#36657b');ellipse(-24+leg,-3,7,5,'#e7dcc4');ellipse(24-leg,-3,7,5,'#e7dcc4');line(-28+leg,0,-5+leg,0,'#fcf1d2',3);line(4-leg,0,29-leg,0,'#fcf1d2',3);for(let i=0;i<2;i++){line(-12+leg,-6,-25+leg-i*5,-12+swing*3,'#fff2d5',1.4);line(13-leg,-6,27-leg+i*4,-10-swing*3,'#fff2d5',1.4);}rect(-24,-57,48,28,monitor?'#425b6b':'#42443c',6);line(0,-50,0,-30,'#63583e',2);line(-27,-82,-32-swing*6,-46,'#bb885e',12);line(27,-82,32+swing*6,-46,'#bb885e',12);poly([[-29,-92],[27,-92],[31,-48+swing*2],[2,-43],[-30,-49]],monitor?'#ece5c7':'#579e99');if(monitor){poly([[-27,-89],[-17,-95],[29,-55],[22,-46]],'#e7bd48');ctx.save();ctx.translate(0,-70);ctx.rotate(.6);text('HALL MONITOR',0,0,7);ctx.restore();rect(29,-65,20,29,'#8e6e41',2);rect(31,-62,16,23,'#fff0cd',1);}ellipse(0,-108+(slump?8:0),22,24,'#c99565');ellipse(-23,-107,5,8,'#bb885e');ellipse(23,-107,5,8,'#bb885e');if(monitor){rect(-24,-136,48,19,'#5b4433',7);line(-24,-123,24,-123,'#3d3229',4);}else{const bob=reduced?0:swing*2;poly([[-24,-107],[-28,-125],[-17,-121],[-21,-138],[-7,-131],[0,-143],[7,-132],[21,-138],[18,-125],[29,-125],[23,-104],[12,-117],[-5,-118]],'#493b2c');line(-21,-130,-29,-135+bob,'#493b2c',4);line(17,-130,28,-139-bob,'#493b2c',4);}if(slump){line(-26,-76,-38,-51,'#bb885e',10);line(26,-76,39,-51,'#bb885e',10);}ctx.restore();}
function proceduralObstacle(o){const d=o.z-s.distance;if(d< -12||d>115)return;const p=projection(d,o.lane);ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.scale,p.scale);if(o.type==='bag'){ellipse(0,0,27,7,'#163b4435');rect(-22,-46,44,46,'#ce7250',9);rect(-15,-27,30,20,'#efae69',5);ctx.strokeStyle='#773b31';ctx.lineWidth=5;ctx.strokeRect(-8,-53,16,10);text('LUNCH',0,-12,7);}if(o.type==='gym'){ellipse(0,0,34,8,'#163b4435');rect(-35,-35,70,22,'#577bab',5);rect(-30,-13,9,15,'#78513a');rect(21,-13,9,15,'#78513a');}if(o.type==='banner'){line(-47,-116,-47,0,'#977f54',4);line(47,-116,47,0,'#977f54',4);rect(-49,-113,98,46,'#e6b450',4);for(let i=0;i<5;i++)poly([[-45+i*20,-67],[-35+i*20,-51],[-25+i*20,-67]],'#cf694c');}if(o.type==='monitor'){boy(0,0,1,true);}ctx.restore();}
function proceduralPortrait(){ctx.save();ctx.translate(w-36,h-48);ellipse(0,0,25,26,'#fff0cc');ellipse(0,0,18,20,'#cd996c');poly([[-18,-5],[-20,-21],[-8,-18],[0,-27],[8,-18],[21,-20],[18,-4],[9,-13],[-9,-13]],'#493b2c');ellipse(-7,-2,2,3,'#253f43');ellipse(7,-2,2,3,'#253f43');if(s.pressure>60){line(-11,-9,-3,-6,'#493b2c',2);line(3,-6,11,-9,'#493b2c',2);ellipse(0,10,5,7,'#683c30');}else{ctx.strokeStyle='#683c30';ctx.beginPath();ctx.arc(0,5,7,0,Math.PI);ctx.stroke();}ctx.restore();}
function proceduralEnding(){if(s.result==='success'){rect(0,0,w,h,'#bed2c9');rect(w*.2,h*.12,w*.6,h*.8,'#20474c',10);rect(w*.23,h*.16,w*.54,h*.73,'#5d9790',5);rect(w*.27,h*.2,w*.46,h*.085,'#fff0bd',5);text('RESTROOM',w/2,h*.256,w*.045);ellipse(w*.69,h*.63,6,6,'#f2cf6d');if(endingTime<.8)boy(w/2,h*.86-endingTime*h*.2,CONFIG.playerScale*(1-endingTime*.5));if(endingTime>1&&endingTime<2.8)text('“Emergency averted.”',w/2,h*.96,w*.023);}else{drawArrivalRestPose({x:w/2,y:h*.86,depth:1},true);for(let side of [-1,1]){boy(w/2+side*w*.32,h*.7,.65,true);text('heh!',w/2+side*w*.32,h*.51,14);}if(endingTime>1){if(reduced){rect(0,0,w,h,`rgba(52,126,144,${Math.min(1,(endingTime-1)/1.2)})`);}else{ctx.save();ctx.translate(w/2,h/2);ctx.rotate((endingTime-1)*5);for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ctx.fillStyle=i%2?'#70b5bb':'#276f84';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,Math.max(w,h)*(endingTime-1),0,.45);ctx.fill();}ctx.restore();}}}}
function draw(){ctx.clearRect(0,0,w,h);hallway();if(s.mode==='ending'||s.mode==='finished'||s.mode==='relief'||s.mode==='completed'||s.mode==='roundTransition'||(s.mode==='paused'&&['ending','relief','roundTransition'].includes(s.pausedFrom)))ending();else{drawPuddles();if(s.chase)drawPursuer();drawHallPopulation();drawWayfinding();drawHallHazards();const player=worldPoint(s.visualLane-1,0,s.distance+CONFIG.collisionDepth);boy(player.x,player.y,playerRenderScale(player));portrait();}if(s.stumble)rect(0,0,w,h,'#ff684519');}
function frame(now){const modeBeforeFrame=s.mode;const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;if(s.mode==='ready'){requestAnimationFrame(frame);return;}if(s.mode==='playing'||s.mode==='catching'){const events=step(s,dt);for(const e of events){if(e==='school-bell')playSchoolBell();if(e==='hit'){tone(130,.18,'triangle',.12,-70);quip(characterCaption(events.includes('slip')?'slip':events.includes('corner-hit')?'corner':events.includes('janitor-hit')?'mop':'impact'));}if(e==='monitor-contact'){tone(180,.22,'triangle',.10,-50);quip(characterCaption('held'));}if(e==='breakaway'){quip(characterCaption('release'));}if(e==='chase'){tone(1400,.4,'sine',.08,300);$('quip').textContent='';quipTime=0;}if(e==='turned'){tone(540,.1,'sine',.05);if(!events.includes('corner-hit'))quip(characterCaption('turn'));}if(e==='catch'){tone(210,.18,'triangle',.07,-80);$('quip').textContent='';quipTime=0;}if(e==='success'){endingTime=0;s.restroomPhase='approach';gesture=null;tone(150,.15,'triangle',.12,-80);}if(e==='failure'){endingTime=0;tone(170,.4,'triangle',.08,-100);}}foot+=dt;if(foot>UTLogic.strideAt(s)/Math.max(1,s.speed)/2){foot=0;tone(80,.045,'triangle',.025);}if(quipTime>0){quipTime-=dt;if(quipTime<=0)$('quip').textContent='';}}else if(s.mode==='ending'){endingTime+=dt;if(s.result==='success'){s.jump=Math.max(0,s.jump-dt);s.jumpGrace=0;s.restroomPhase=endingTime<ARRIVAL_TIMING.approach?'approach':'relief';}$('quip').textContent='';const comedyCue=s.result==='success'?ARRIVAL_TIMING.relief:1;if(endingTime-dt<comedyCue&&endingTime>=comedyCue){if(s.result==='success')tone(380,.65,'sine',.05,-240);else tone(600,1.2,'sawtooth',.025,-560);}if(s.result==='success'&&endingTime>=ARRIVAL_TIMING.relief){endingTime=ARRIVAL_TIMING.relief;UTLogic.resolveBathroomArrival(s);}if(s.result!=='success'&&endingTime>3){s.mode='finished';showCard(s.result==='success'?'Level complete!':'Ur in trouble.',s.result==='success'?`Emergency averted.<br>Score: <b>${s.score}</b><br>Hall monitor: emotionally inconvenienced.`:`An unfortunate turn of events.<br>${s.result==='wall'?'Missed the turn. Follow the arrow and press or swipe before the window closes.':s.result==='caught'?'The hall monitor caught up.':'The bladder reached maximum urgency.'}<br>Score: ${s.score}`,'TRY AGAIN',chooseCharacter);}}advanceRestroomFlow(dt,modeBeforeFrame);$('playAgain').hidden=!['completed'].includes(s.mode);updateBladderHud();updateLevelHud();const paceTier=s.time<CONFIG.walkEnd?0:s.time<CONFIG.jogStart?1:s.time<CONFIG.runStart?2:s.time<CONFIG.sprintStart?3:4;$('pace').textContent=['WALK • keep it casual','BRISK WALK • probably fine','JOG • definitely fine','RUN • less fine','SPRINT • deeply unfine'][paceTier];$('chase').hidden=!s.chase||s.mode==='finished'||s.result==='success';updateChaseIndicator();ambientCaption();if(s.mode!=='playing')stopSchoolBell();draw();requestAnimationFrame(frame);}requestAnimationFrame(frame);
// Local read-only inspection hook for verification and future Arcade embedding.
window["Ur inTrouble"]={waterSettings:UTLogic.WATER_SETTINGS,waterRounds:UTLogic.WATER_ROUNDS,getState:()=>JSON.parse(JSON.stringify(s)),config:CONFIG,bellRounds:UTLogic.BELL_ROUNDS,bellSettings:UTLogic.BELL_SETTINGS,getBellStatus:()=>s.bellEvent?JSON.parse(JSON.stringify(s.bellEvent)):null,getBellAudioState:()=>({voices:bellVoices.length,muted}),classroomGeometry:UTLogic.CLASSROOM_GEOMETRY,classroomRounds:UTLogic.CLASSROOM_ROUNDS,classroomSettings:UTLogic.CLASSROOM_SETTINGS,getClassroomDoors:()=>UTLogic.activeClassroomDoors(s),janitorSettings:UTLogic.JANITOR_SETTINGS,janitorRounds:UTLogic.JANITOR_ROUNDS,reliefSettings:UTLogic.RELIEF_SETTINGS,levelConfig:UTLogic.LEVELS,levelSettings:UTLogic.LEVEL_SETTINGS,getLevelStatus:()=>UTLogic.levelStatus(s),build:"startup-performance",studentMovement:UTLogic.STUDENT_MOVEMENT,studentRounds:UTLogic.STUDENT_ROUNDS,evaluateRoute:()=>UTLogic.evaluateAvoidance(s),difficultyConfig:UTLogic.ROUND_DIFFICULTY,difficultyLimits:UTLogic.DIFFICULTY_LIMITS,getDifficulty:()=>UTLogic.roundDifficulty(s),roundSettings:UTLogic.ROUND_SETTINGS,getRoundStatus:()=>UTLogic.levelStatus(s),getDestinations:()=>({first:UTLogic.firstBathroomDistance(s),locked:s.destinationLocked}),getChaseLayout:()=>chaseLayout(w,h,s,reduced),getCamera:()=>navigationCamera(),getBathroomEntry:()=>bathroomEntryPose(),projectWorld:(x,height,z)=>worldPoint(x,height,z),getWorldSpriteHeight:(kind,z)=>worldSpriteHeight(kind,worldPoint(0,0,z))};

function classroom(d,side,index){
 const depth=(1-d/135)**2,p=projection(d,1),sc=.12+depth*.92;
 const x=w/2+side*(w*.12+w*.35*depth),y=p.y;
 ctx.save();ctx.translate(x,y);ctx.scale(side*sc,sc);
 // Framed timber doors and glazed classroom windows on each wall.
 poly([[0,-159],[52,-174],[52,-9],[0,0]],'#35595a');
 poly([[5,-153],[46,-165],[46,-14],[5,-6]],index%2?'#b98354':'#be9264');
 poly([[10,-145],[40,-153],[40,-87],[10,-80]],'#36525a');
 poly([[13,-141],[37,-147],[37,-91],[13,-85]],'#afcfca');
 poly([[13,-141],[26,-144],[13,-111]],'#e6f0d9');
 line(25,-144,25,-88,'#6c8c88',2);line(13,-114,37,-120,'#6c8c88',2);
 poly([[10,-67],[40,-74],[40,-25],[10,-18]],'#a26c46');
 line(13,-62,37,-68,'#d1a479',2);ellipse(38,-79,3,4,'#f6d27a');
 // Room plaque, window sill, desks and chalkboard visible through glass.
 ctx.save();ctx.translate(26,-187);ctx.scale(side,1);rect(-25,-10,50,20,'#fff0c6',3);text('ROOM '+(101+index+(side===1?7:0)),0,3,8);ctx.restore();
 poly([[60,-167],[118,-183],[118,-76],[60,-61]],'#42656a');
 poly([[65,-160],[113,-173],[113,-82],[65,-70]],'#bad8cf');
 poly([[69,-146],[108,-157],[108,-120],[69,-110]],'#466e60');
 line(74,-138,99,-145,'#e7edd4',2);line(75,-128,92,-133,'#e7edd4',1);
 for(let desk=0;desk<2;desk++){const xx=73+desk*21;poly([[xx,-92],[xx+14,-96],[xx+14,-89],[xx,-85]],'#cfaa6d');line(xx+3,-85,xx+3,-76,'#596b65',2);}
 line(89,-166,89,-76,'#53777a',4);line(62,-111,116,-125,'#53777a',3);
 poly([[57,-62],[121,-78],[121,-69],[57,-53]],'#e8dcc0');
 // Little student artwork beneath the window.
 for(let a=0;a<3;a++){const xx=65+a*17;rect(xx,-44-a*4,13,19,'#fff1d5',1);ellipse(xx+6,-37-a*4,3,3,['#d87558','#d1ac4d','#689d91'][a]);line(xx+6,-34-a*4,xx+6,-28-a*4,'#687d7a',1);}
 ctx.restore();
}
function proceduralBoy(x,y,scale,monitor=false,slump=false){
 boyBase(x,y,scale,monitor,slump);ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 const swing=reduced?0:Math.sin(s.time*(3+s.speed*.6));const hop=s.jump?Math.sin((1-s.jump/CONFIG.jumpDuration)*Math.PI)*55:0;
 ctx.translate(0,-hop);if(s.duck>0)ctx.scale(1,.65);
 const leg=slump?0:swing*(s.pressure>60?7:12);
 // Cloth folds, stitched pockets, faded patches, sock stripes and chunky heel panels.
 line(-20,-79,-16,-58,'#3c7f7b',2);line(19,-75,23,-54,'#3c7f7b',2);
 line(-10,-51,3,-48+swing*2,'#a2c6b3',2);line(8,-88,20,-83,'#9cbeb1',2);
 if(!monitor){
 // Ragged denim vest with brass stitching and a hand-painted lightning patch.
 poly([[-21,-94],[-12,-98],[12,-98],[22,-92],[21,-57],[5,-51],[-21,-56]],'#303735');
 poly([[-18,-92],[-10,-95],[11,-95],[18,-89],[17,-60],[-17,-60]],'#3c413a');
 for(let i=0;i<6;i++){line(-18+i*6,-89,-15+i*6,-89,'#ba9660',1);line(-18+i*6,-59,-15+i*6,-59,'#ba9660',1);}
 line(-18,-88,-18,-62,'#ba9660',1);line(18,-87,18,-62,'#ba9660',1);
 poly([[2,-87],[13,-87],[4,-76],[11,-76],[-7,-61],[-2,-74],[-10,-74]],'#e7b455');
 ellipse(-13,-79,3,3,'#d5d0b1');ellipse(-14,-80,1,1,'#303735');ellipse(-12,-80,1,1,'#303735');line(-15,-76,-11,-76,'#303735',1);
 poly([[12,-67],[14,-63],[18,-63],[15,-60],[16,-56],[12,-59],[8,-56],[9,-60],[6,-63],[10,-63]],'#d89f4c');
 line(-28,-87,-23,-89,'#bbcab4',2);line(24,-87,29,-84,'#bbcab4',2);
 }

 line(-17,-42,-8,-40,'#c5ad82',2);line(8,-40,18,-43,'#c5ad82',2);line(-21,-55,-19,-46,'#6e6550',1);rect(-23,-46,14,11,'#373c35',2);rect(10,-46,14,11,'#373c35',2);line(-21,-44,-11,-44,'#b4a181',1);line(12,-44,22,-44,'#b4a181',1);ellipse(-13,-43,1,1,'#d3b170');ellipse(20,-43,1,1,'#d3b170');
 line(-21+leg,-13,-9+leg,-13,'#d19060',2);line(9-leg,-12,21-leg,-12,'#f4c587',2);
 rect(-25+leg,-6,8,5,'#5f7c7e',2);rect(18-leg,-6,8,5,'#5f7c7e',2);
 line(-17,-111,-12,-113,'#a87552',1.5);line(13,-111,18,-109,'#a87552',1.5);
 if(!monitor){for(let i=0;i<11;i++){const angle=i*.49;const xx=Math.cos(angle)*22,yy=-123+Math.sin(angle)*10;line(xx,yy,xx+Math.cos(angle)*9,yy-4+swing*1.5,'#352b23',3);line(xx,yy,xx+Math.cos(angle)*5,yy-4,'#876445',1);}line(-10,-136,-6,-128,'#8b6a43',2);}
 else{line(15,-96,20,-76,'#68746e',1);ellipse(21,-74,3,4,'#b8c7c4');for(let i=0;i<3;i++)line(33,-58+i*5,43,-58+i*5,'#afbead',1);}
 ctx.restore();
}

function checkerFloor(vy){
 const offset=(s.distance%16)/16;
 for(let row=0;row<13;row++){
  const near=(row+offset)/12,far=(row-1+offset)/12;
  if(near<=0)continue;const a=Math.min(1.15,near)**2,b=Math.max(0,far)**2;
  const yn=vy+(h-vy)*a,yf=vy+(h-vy)*b;
  for(let col=0;col<8;col++){
   const left=(col/8-.5),right=((col+1)/8-.5);
   const light=(row+col+Math.floor(s.distance/16))%2===0;
   poly([[w/2+left*w*b,yf],[w/2+right*w*b,yf],[w/2+right*w*a,yn],[w/2+left*w*a,yn]],light?'#e5cf9c':'#8f9d8c');
   line(w/2+left*w*b,yf,w/2+right*w*b,yf,'#f5e3bb55',.6);
  }
 }
 // Subtle fluorescent reflections along the central polished tiles.
 for(let i=0;i<4;i++){const p=(i+1)/5,depth=p*p;rect(w/2-13*depth,vy+(h-vy)*depth,26*depth,5+10*depth,'#fff5d22b',2);}
}

// Painted reference-quality assets; procedural collision geometry is unchanged.
const paintings={};let artReady=0;
const artworkLoads=Object.entries(window.UT_ART||{}).map(([key,src])=>new Promise((resolve,reject)=>{const im=new Image();paintings[key]=im;im.onload=()=>{Promise.resolve(im.decode?im.decode():undefined).then(()=>{artReady++;resolve();},reject);};im.onerror=()=>reject(new Error('Artwork unavailable: '+key));im.src=src;}));
Promise.all(artworkLoads).then(()=>{initWorldDecor();for(let i=0;i<12;i++)maryannSprite(i,-1000,-1000,160);for(let i=0;i<RESTORED_META.restoredActions.boxes.length;i++)restoredFrame('restoredActions',i);const source=gaitSource(false);wallyHairFringe(source.c,source.b);sceneReady=true;drawCharacterThumbs();draw();last=performance.now();updateStartReadiness();}).catch(()=>{const b=$('choose-start')||$('start');if(b){b.disabled=false;b.textContent='Retry loading artwork';b.onclick=()=>location.reload();}});
function available(key){const im=paintings[key];return im&&im.complete&&im.naturalWidth>0;}
function sheet(key,cell,count,x,y,width,height){const im=paintings[key];if(!available(key))return;const bounds={"boy":[[54,13,374,711],[594,17,387,694],[1074,12,550,712],[1658,65,495,643]],"props":[[0,15,509,663],[512,49,568,675],[1080,49,585,651],[1665,14,479,681]],"faces":[[27,0,667,710],[751,0,640,710],[1475,0,647,710]]};const b=key==='population'?[[21, 0, 518, 711], [610, 11, 472, 699], [1086, 1, 494, 710], [1580, 55, 578, 654]][cell]:bounds[key][cell];const fit=Math.min(width/b[2],height/b[3]),dw=b[2]*fit,dh=b[3]*fit;ctx.drawImage(im,b[0],b[1],b[2],b[3],x-dw/2,y-dh,dw,dh);}
function hallway(){drawWorldHallway();}
function boy(x,y,scale,monitor=false,slump=false){if(monitor){sheet('props',3,4,x,y+7*scale,92*scale,162*scale);return;}if(s.character==='maryann'){drawMaryann(x,y,scale,slump);return;}if(!available('wallyCycle')||!available('wallyActions'))return;
 const jump=s.jump>0;const hop=jump?Math.sin((1-s.jump/CONFIG.jumpDuration)*Math.PI)*Math.min(h*.23,125*Math.min(w/360,h/540)):0;
 // Shadow remains at floor coordinates even during jumping.
 ellipse(x,y+3,28*scale,6*scale,'#2c352e40');
 withCharacterPose(x,y-hop,()=>{if(slump||jump)restoredSprite('restoredActions',slump?5:3,0,0,160*scale);else drawRestoredGait(0,0,160*scale);});drawUrgencyAccent(x,y-hop,160*scale);
}
let janitorBodyArt=null;
function janitorBody(){if(janitorBodyArt)return janitorBodyArt;const c=document.createElement('canvas');c.width=112;c.height=194;const a=c.getContext('2d');a.translate(56,190);a.lineJoin='round';a.lineCap='round';
 const shape=(points,fill)=>{a.beginPath();points.forEach(([x,y],i)=>i?a.lineTo(x,y):a.moveTo(x,y));a.closePath();a.fillStyle=fill;a.fill();a.strokeStyle='#493d32';a.lineWidth=1.7;a.stroke();},oval=(x,y,rx,ry,fill)=>{a.beginPath();a.ellipse(x,y,rx,ry,0,0,Math.PI*2);a.fillStyle=fill;a.fill();a.strokeStyle='#493d32';a.lineWidth=1.2;a.stroke();},stroke=(points,color,width)=>{a.beginPath();points.forEach(([x,y],i)=>i?a.lineTo(x,y):a.moveTo(x,y));a.strokeStyle=color;a.lineWidth=width;a.stroke();};
 // Warm skin, blue work shirt and worn sage overalls echo the hallway's ink-and-paper palette.
 shape([[-8,-140],[8,-141],[10,-122],[-8,-120]],'#c58d60');
 shape([[-21,-122],[-9,-128],[10,-127],[22,-117],[20,-92],[-17,-91]],'#cdb998');
 shape([[-14,-124],[-6,-125],[-5,-110],[11,-109],[13,-124],[19,-120],[23,-77],[12,-68],[-20,-72],[-22,-100]],'#577c7a');
 shape([[-6,-109],[12,-109],[13,-91],[-6,-92]],'#75928a');stroke([[-18,-91],[18,-88]],'#334e50',2.5);stroke([[-15,-80],[17,-78]],'#d2c2a1',1);
 shape([[-2,-106],[7,-106],[7,-100],[-2,-100]],'#e6d8b5');a.fillStyle='#675944';a.fillRect(0,-104,5,1);a.fillRect(0,-102,3,1);
 stroke([[13,-118],[18,-105],[14,-96]],'#493d32',13);stroke([[13,-118],[18,-105],[14,-96]],'#c9ae87',9);stroke([[14,-119],[20,-113]],'#e5d6b4',10);oval(15,-95,5,4,'#cb966d');
 stroke([[-20,-116],[-20,-99],[12,-94]],'#493d32',12);stroke([[-20,-116],[-20,-99],[12,-94]],'#bca781',8);stroke([[-20,-116],[-22,-109]],'#e5d6b4',9);oval(13,-94,5,3.6,'#d39c70');
 oval(4,-151,17,23,'#ca956e');shape([[14,-157],[24,-152],[17,-148]],'#d4a27b');oval(-10,-151,5,7,'#b6805a');
 shape([[-11,-143],[-5,-136],[3,-136],[11,-142],[15,-138],[10,-126],[-1,-126],[-10,-133]],'#ccc9b7');stroke([[7,-143],[17,-142]],'#807a69',4);stroke([[9,-136],[14,-136]],'#695b4a',1.2);
 stroke([[8,-156],[14,-156]],'#4b3c30',1.8);oval(13,-152,1.3,1.7,'#302e29');stroke([[-10,-162],[-13,-151]],'#dad1b9',3);
 shape([[-16,-161],[-15,-175],[-6,-181],[10,-178],[19,-166],[31,-162],[25,-158],[3,-160]],'#52767a');stroke([[-13,-171],[13,-168]],'#86a19a',2);stroke([[5,-162],[26,-161]],'#d9c8a4',1);shape([[-5,-174],[4,-174],[4,-169],[-5,-169]],'#d8cba7');
 stroke([[-17,-99],[-12,-103]],'#3e6061',1);stroke([[17,-86],[12,-81]],'#3e6061',1);a.globalAlpha=.25;for(let i=0;i<26;i++){a.fillStyle=i%2?'#d7c4a0':'#263f43';a.fillRect(-16+(i*13%32),-88-(i*11%28),1,1);}a.globalAlpha=1;
 // Keys on a work belt, deliberately tiny decoration rather than a warning prompt.
 stroke([[-17,-86],[-23,-80]],'#a98d55',1.8);oval(-23,-78,3,3,'#c8b07a');stroke([[-23,-75],[-23,-67],[-20,-67]],'#d0b877',2);
 janitorBodyArt=c;return c;}
function drawHallHazards(){
 const actors=s.obstacles.slice();
 for(const splash of s.splashes||[]){
  const t=Math.max(0,Math.min(1,(s.time-splash.startedAt)/UTLogic.WATER_SETTINGS.splashSeconds));
  actors.push({z:splash.fromZ+(splash.toZ-splash.fromZ)*t,splash});
 }
 actors.sort((a,b)=>b.z-a.z);
 for(const actor of actors){if(actor.splash)drawWaterSplashes([actor.splash]);else obstacle(actor);}
}
function drawPuddles(){
 const cfg=UTLogic.WATER_SETTINGS;
 for(const puddle of (s.puddles||[]).slice().sort((a,b)=>b.z-a.z)){
  const status=UTLogic.puddleStatus(puddle,s.time);
  if(status.opacity<=0||puddle.z<s.distance-14)continue;
  const growth=Math.min(1,Math.max(0,status.age/cfg.formationSeconds)),points=[];
  const radii=[.92,1,.87,.98,.91,1,.86,.95,.9,1.02,.9,.96];
  for(let i=0;i<radii.length;i++){
   const angle=i*Math.PI*2/radii.length;
   const p=worldPoint(puddle.lane-1+Math.cos(angle)*cfg.halfLane*radii[i]*growth,0,puddle.z+Math.sin(angle)*cfg.halfDepth*radii[i]*growth);
   points.push([p.x,p.y]);
  }
  ctx.save();ctx.globalAlpha=.82*status.opacity;
  poly(points,'#669cae');ctx.strokeStyle='#3d788e';ctx.lineWidth=1.1;ctx.stroke();
  const a=worldPoint(puddle.lane-1-cfg.halfLane*.48*growth,0,puddle.z-cfg.halfDepth*.25*growth),b=worldPoint(puddle.lane-1+cfg.halfLane*.24*growth,0,puddle.z-cfg.halfDepth*.32*growth);
  line(a.x,a.y,b.x,b.y,'#d4f2f3',Math.max(1,a.scale*1.7));
  const glint=worldPoint(puddle.lane-1+cfg.halfLane*.48*growth,0,puddle.z+cfg.halfDepth*.2*growth);
  ellipse(glint.x,glint.y,Math.max(.6,glint.scale*1.5),Math.max(.5,glint.scale*.7),'#c3e7ed');
  ctx.restore();
 }
}
function drawWaterSplashes(splashes=s.splashes||[]){
 for(const splash of splashes){
  const t=Math.max(0,Math.min(1,(s.time-splash.startedAt)/UTLogic.WATER_SETTINGS.splashSeconds));
  const lane=splash.fromLane+(splash.toLane-splash.fromLane)*t,z=splash.fromZ+(splash.toZ-splash.fromZ)*t;
  const height=UTLogic.JANITOR_SETTINGS.worldHeight*44/180*(1-t)+(reduced?.10:.32)*Math.sin(Math.PI*t);
  for(let i=0;i<3;i++){
   const p=worldPoint(lane-1+(i-1)*.025*Math.sin(Math.PI*t),Math.max(0,height-i*.018),z+i*.25);
   ellipse(p.x,p.y,Math.max(.6,p.scale*(2.1-i*.35)),Math.max(.8,p.scale*(3-i*.4)),'#a4dfe8');
  }
 }
}
function drawJanitor(o){const d=o.z-s.distance;if(d< -12||d>s.normalSpeed*(UTLogic.JANITOR_SETTINGS.leadSeconds+.5))return;const p=projection(d,o.visualLane),height=worldSpriteHeight('janitor',p),unit=height/180,dir=o.direction;
 const laneWidth=Math.abs(projection(d,o.visualLane+1).x-p.x),bucketHalf=UTLogic.JANITOR_SETTINGS.bucketHalfLanes*laneWidth/unit,bodyX=-180*UTLogic.JANITOR_SETTINGS.bodyOffsetRatio,phase=o.walkPhase||0,motion=reduced||o.crossElapsed<=o.waitSeconds||o.crossComplete?0:1;
 // Clip only beyond actual side walls; entering/exiting the edge never paints through architecture.
 const left=projection(d,-.85),right=projection(d,2.85);ctx.save();ctx.beginPath();ctx.rect(Math.min(left.x,right.x),p.y-height-15,Math.abs(right.x-left.x),height+25);ctx.clip();ctx.translate(p.x,p.y);ctx.scale(dir*unit,unit);ctx.lineJoin='round';ctx.lineCap='round';
 ellipse(bodyX,2,18,4,'#29352d25');ellipse(0,2,bucketHalf+3,4,'#29352d30');
 // Alternating articulated legs; the torso stays steady and the shadows remain on the floor.
 for(const side of [-1,1]){const t=phase+(side===1?Math.PI:0),step=Math.sin(t)*9*motion,lift=Math.max(0,Math.cos(t))*7*motion,hip=bodyX+(side===1?5:-7),foot=bodyX+step+(side===1?3:-3),knee=(hip+foot)/2+3;
 line(hip,-75,knee,-37-lift*.2,'#3f4036',16);line(knee,-37-lift*.2,foot,-7-lift,'#3f4036',14);line(hip,-75,knee,-37-lift*.2,side===1?'#617a70':'#465f5b',12);line(knee,-37-lift*.2,foot,-7-lift,side===1?'#617a70':'#465f5b',10);line(knee-3,-32-lift*.2,knee+4,-30-lift*.2,'#86958a',1);rect(foot-7,-9-lift,20,8,'#453e32',3);line(foot-6,-1-lift,12+foot,-1-lift,'#b9a887',2);}
 ctx.drawImage(janitorBody(),bodyX-56,-190);
 // Stable push handle, shallow water, wringer, mop and casters move as one unit with the bucket center.
 line(-bucketHalf*.8,-18,-bucketHalf*.9,-94,'#443d31',4);line(-bucketHalf*.9,-94,-32,-94,'#443d31',4);line(-bucketHalf*.8,-18,-bucketHalf*.9,-94,'#a3aaa0',2);line(-bucketHalf*.9,-94,-32,-94,'#b6b9ac',2);
 line(8,-36,20,-150,'#6d523a',4);line(8,-36,20,-150,'#cba66a',2);for(let i=0;i<7;i++)line(6+i*1.4,-45,2+i*2.1,-28+(i%2)*4,'#d7d1b7',2);
 const spilling=o.lastSpillAt!==undefined&&s.time-o.lastSpillAt<UTLogic.WATER_SETTINGS.splashSeconds;
 ctx.save();ctx.translate(0,-4);ctx.rotate(spilling?(reduced?.02:.065)*Math.sin(Math.PI*(s.time-o.lastSpillAt)/UTLogic.WATER_SETTINGS.splashSeconds):0);ctx.translate(0,4);
 poly([[-bucketHalf,-44],[bucketHalf,-44],[bucketHalf*.82,-8],[-bucketHalf*.82,-8]],'#e2b44d');ctx.strokeStyle='#57452f';ctx.lineWidth=1.8;ctx.stroke();poly([[bucketHalf*.35,-43],[bucketHalf,-43],[bucketHalf*.82,-9],[bucketHalf*.25,-9]],'#bd8e35');ellipse(0,-44,bucketHalf,4.8,'#f3d080');ellipse(-2,-44,bucketHalf*.72,2.7,'#739a96');line(-bucketHalf*.8,-39,-bucketHalf*.6,-14,'#f5da8d',2);
 rect(bucketHalf*.18,-61,bucketHalf*.9,14,'#efc565',2);ctx.strokeStyle='#6c542f';ctx.lineWidth=1.2;ctx.stroke();for(let i=0;i<4;i++)line(bucketHalf*.3+i*3,-59,bucketHalf*.3+i*3,-49,'#aa7b31',1);line(bucketHalf*.6,-61,bucketHalf*.9+7,-73,'#6b6754',3);
 rect(-7,-32,13,16,'#f5e6b9',2);poly([[-1,-30],[-5,-24],[-4,-20],[0,-18],[4,-21],[3,-25]],'#5b8f9b');
 for(const x of [-bucketHalf*.65,bucketHalf*.65]){line(x,-10,x,-5,'#514f40',3);ellipse(x,-3,4.6,4.6,'#44473f');ellipse(x,-3,2.6,2.6,'#999b86');const spin=phase*3*motion;line(x-Math.cos(spin)*2.5,-3-Math.sin(spin)*2.5,x+Math.cos(spin)*2.5,-3+Math.sin(spin)*2.5,'#d4c7a8',.8);}
 ctx.restore();ctx.restore();}

function obstacle(o){if(o.popup){const p=projection(o.z-s.distance,o.visualLane??o.lane);if(!o.popupWarning)return;if(!o.popupActive){ellipse(p.x,p.y,10*p.scale,4*p.scale,'#e7ae43');return;}const height=worldSpriteHeight(o.type,p),rise=reduced?1:(o.popupProgress||0);ctx.save();ctx.beginPath();ctx.rect(0,p.y-height*rise,w,height*rise+2);ctx.clip();ctx.translate(0,height*(1-rise));obstacleBody(o);ctx.restore();return;}obstacleBody(o);}
function obstacleBody(o){if(o.type==='janitor'){drawJanitor(o);return;}if(!available('props'))return proceduralObstacle(o);const d=o.z-s.distance;if(d< -12||d>Math.max(180,(s.normalSpeed??s.speed)*4.5))return;if(o.type==='student'||o.type==='cart'){drawSchoolActivity(o);return;}const p=projection(d,o.visualLane??o.lane),cell={bag:0,gym:1,banner:2,monitor:3}[o.type];
 const spriteHeight=worldSpriteHeight(o.type,p),dims={bag:[78,103],gym:[100,63],banner:[125,146],monitor:[84,150]}[o.type];
 ellipse(p.x,p.y,28*p.scale,6*p.scale,'#29352d30');sheet('props',cell,4,p.x,p.y,Infinity,spriteHeight);if(o.type==='monitor')drawLaneCue(o,p);
}
function portrait(){if(s.character==='maryann'){if(s.pressure>=85&&available('maryannPanic')){const im=paintings.maryannPanic,k=82/im.naturalHeight;ctx.drawImage(im,w-43-im.naturalWidth*k/2,h-90,im.naturalWidth*k,82);}else maryannSprite(s.pressure<60?10:11,w-43,h-8,82,true);return;}if(!available('wallyActions'))return;restoredSprite('restoredActions',s.pressure<45?0:s.pressure<76?1:2,w-43,h-8,92,true);}
function ending(){
 if(s.result!=='success'){boy(w/2,h*.86,playerRenderScale({depth:1}),false,true);for(const side of [-1,1]){boy(w/2+side*w*.32,h*.7,.65,true);text('heh!',w/2+side*w*.32,h*.51,14);}if(endingTime>1){const progress=Math.min(1,(endingTime-1)/1.2);if(reduced)rect(0,0,w,h,'rgba(52,126,144,'+progress+')');else{ctx.save();ctx.translate(w/2,h/2);ctx.rotate((endingTime-1)*5);for(let i=0;i<8;i++){ctx.rotate(Math.PI/4);ctx.fillStyle=i%2?'#70b5bb':'#276f84';ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,Math.max(w,h)*progress,0,.45);ctx.fill();}ctx.restore();}}return;}
 const pose=bathroomEntryPose(),p=worldPoint(pose.lane,0,pose.z),phase=s.playerPhase,gait=s.playerGait,stumble=s.stumble,visualLane=s.visualLane;
   s.playerPhase=(phase+pose.travel/12)%1;s.playerGait='walk';s.stumble=0;s.visualLane=s.lane;if(endingTime>=ARRIVAL_TIMING.approach)drawArrivalRestPose(p);else boy(p.x,p.y,playerRenderScale(p));s.playerPhase=phase;s.playerGait=gait;s.stumble=stumble;s.visualLane=visualLane;
   if(endingTime<ARRIVAL_TIMING.approach)text('RESTROOM REACHED!',w/2,h*.15,Math.min(16,w*.04),'#24464a');
   else if(endingTime<ARRIVAL_TIMING.relief)text('Phew. Made it.',w/2,h*.15,Math.min(16,w*.04),'#24464a');
   else{rect(w*.10,h*.12,w*.80,40,'#fff0cbee',6);text('Emergency averted.',w/2,h*.12+26,Math.min(16,w*.04),'#35463d');}
  }
  function floorPoint(z,column){const depth=4/(Math.max(0,z)+4);return {x:w/2+column*w/8*depth,y:h*.29+h*.71*depth};}

function movingPaintedFloor(im){
 // Two continuous perspective passes use ONLY the original painted hallway.
 // Each pass resets while fully transparent: no tile jumps or replacement palette.
 const travel=s.distance/24,phase=travel-Math.floor(travel);
 const layers=[phase,(phase+.5)%1];
 for(let yy=Math.floor(h*.326);yy<h;yy+=3){
  const band=Math.min(3,h-yy),wall=Math.max(0,1-(yy/h-.326)/.214),left=w*.4*wall,right=w-left;
  const fade=Math.min(1,Math.max(0,(yy/h-.326)/.06));
  // Feather edges into the painted wall-floor junction instead of cutting a new polygon.
  for(const p of layers){const zoom=1+p*.55,weight=Math.sin(Math.PI*p)**2;
   const sourceY=(h*.29+(yy-h*.29)/zoom)/h*im.naturalHeight;
   const sourceBand=band/h*im.naturalHeight/zoom;
   const strips=5,edge=Math.min(24,(right-left)*.14);
   for(let strip=0;strip<strips;strip++){
    const a=strip===0?left:strip===1?left+edge*.33:strip===2?left+edge:strip===3?right-edge:right-edge*.33;
    const b=strip===0?left+edge*.33:strip===1?left+edge:strip===2?right-edge:strip===3?right-edge*.33:right;
    if(b<=a)continue;const edgeAlpha=strip===0||strip===4?.22:strip===1||strip===3?.65:1;
    ctx.globalAlpha=weight*fade*edgeAlpha;
    const sourceX=(w/2+(a-w/2)/zoom)/w*im.naturalWidth;
    ctx.drawImage(im,sourceX,sourceY,(b-a)/w*im.naturalWidth/zoom,sourceBand,a,yy,b-a,band+.5);
   }
  }
 }
 ctx.globalAlpha=1;
}

function movingCorridor(im){
 // One opaque, continuous camera push. No alternating layers, resets or opacity pulses.
 const zoom=Math.exp(Math.min(1,s.distance/UTLogic.targetDistance(s))*.7);
 ctx.globalAlpha=1;ctx.drawImage(im,w/2-w*zoom/2,h*.29-h*.29*zoom,w*zoom,h*zoom);
}

let floorSurface=null,floorMask=null,floorW=0,floorH=0;
function runningFloor(im){
 if(!floorSurface||floorW!==Math.ceil(w)||floorH!==Math.ceil(h)){
  floorW=Math.ceil(w);floorH=Math.ceil(h);floorSurface=document.createElement('canvas');floorMask=document.createElement('canvas');
  for(const c of [floorSurface,floorMask]){c.width=floorW;c.height=floorH;}
  const mask=floorMask.getContext('2d');
  for(let y=Math.floor(h*.33);y<h;y+=4){const wall=Math.max(0,1-(y/h-.33)/.21),left=w*.40*wall,right=w-left;
   const fade=Math.min(1,(y/h-.33)/.075),edge=Math.min(32,(right-left)*.15),g=mask.createLinearGradient(left,0,right,0);
   g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(edge/(right-left),'rgba(255,255,255,'+fade+')');g.addColorStop(1-edge/(right-left),'rgba(255,255,255,'+fade+')');g.addColorStop(1,'rgba(255,255,255,0)');mask.fillStyle=g;mask.fillRect(left,y,right-left,4);
  }
 }
 const f=floorSurface.getContext('2d');f.clearRect(0,0,floorW,floorH);
 const travel=s.distance*.55,size=4,phase=travel%size,origin=Math.floor(travel/size);
 function point(z,c){const k=5/(Math.max(0,z)+5);return {x:w/2+c*w/6*k,y:h*.29+h*.71*k};}
 for(let row=24;row>=0;row--){const near=Math.max(0,row*size-phase),far=(row+1)*size-phase;if(far<=0)continue;
  for(let col=-14;col<14;col++){const a=point(far,col),b=point(far,col+1),c=point(near,col+1),d=point(near,col);if(c.x<0||d.x>w)continue;
   // Real cream/sage tile swatches sampled from this exact painted hallway: no tint layer.
   const light=((row+origin+col)%2+2)%2===0,sx=light?318:668,sy=1318;
   f.save();f.beginPath();f.moveTo(a.x,a.y);f.lineTo(b.x,b.y);f.lineTo(c.x,c.y);f.lineTo(d.x,d.y);f.closePath();f.clip();
   // Scanline warp follows each tile's trapezoid, keeping painted grain attached to it.
   const tall=Math.max(1,d.y-a.y);
   for(let y=a.y;y<d.y;y+=4){const t=(y-a.y)/tall,left=a.x+(d.x-a.x)*t,right=b.x+(c.x-b.x)*t;
    f.drawImage(im,sx,sy+t*60,64,Math.max(.2,Math.min(4,d.y-y)/tall*60),left-.5,y,right-left+1,Math.min(4,d.y-y)+.5);
   }
   f.restore();
  }
 }
 f.globalCompositeOperation='destination-in';f.drawImage(floorMask,0,0);f.globalCompositeOperation='source-over';ctx.drawImage(floorSurface,0,0,w,h);
}

function chaseLayout(width,height,state,noMotion=false){
 const close=1-Math.max(0,Math.min(1,state.chaseVisualGap/CONFIG.chaseMaxGap));
 const playerX=width/2+(state.visualLane-1)*width*.27;
 const gapDepth=depthScale(CONFIG.collisionDepth+(state.monitorSlow>0?0:Math.max(0,state.chaseVisualGap))*.7);const followed=width/2+(state.monitorLane-1)*width*.27*gapDepth;
 // Offset toward the roomier side. Clamp away from the portrait in the right corner.
 const side=-1;
 let x=followed+side*width*.24;
 const pursuitDepth=gapDepth;const spriteHeight=Math.min(WORLD_HEIGHTS.monitor*cameraUnits(width,height),height*.18,width*.28)*pursuitDepth;
 const spriteWidth=spriteHeight*479/681;
 x=Math.max(spriteWidth/2+8,Math.min(width-spriteWidth/2-8,x));
 const intro=1-Math.max(0,Math.min(1,state.chaseIntro/CONFIG.chaseIntroDuration));
 const entrance=noMotion?1:intro*intro*(3-2*intro);
 const bob=noMotion||state.mode==='catching'?0:Math.sin(state.chaseClock*8)*1.4;
 const y=height*.90+height*.51*(1-pursuitDepth)*.25+(1-entrance)*spriteHeight+bob;
 return {x,y,width:spriteWidth,height:spriteHeight,close,playerX,intro};
}
function monitorBubble(message,p){const bw=Math.min(126,w*.38),bx=Math.max(8,Math.min(w-bw-8,p.x-bw/2)),by=Math.max(30,p.y-p.height-34);
 rect(bx,by,bw,27,'#fff0cc',7);poly([[p.x-5,by+27],[p.x+5,by+27],[p.x,by+34]],'#fff0cc');text(message,bx+bw/2,by+18,Math.min(12,w*.035),'#8b3b2a');}
function drawPursuer(){const p=chaseLayout(w,h,s,reduced);ctx.save();ctx.translate(p.x,p.y);if(!reduced&&s.mode!=='catching')ctx.rotate(Math.sin(s.chaseClock*4)*.012);ellipse(0,0,p.width*.4,4,'#203c3c40');sheet('props',3,4,0,0,p.width,p.height);ctx.restore();
 if(s.monitorSlow>0)monitorBubble('WALK, PLEASE!',p);else if(s.mode==='catching')monitorBubble('CITATION: SPEEDY.',p);else if(s.chaseClock<2.5)monitorBubble('NO RUNNING!',p);else if(s.chaseWarning>0)monitorBubble('On your heels!',p);
}
function updateChaseIndicator(){const el=$('chase');if(!s.chase)return;const p=UTLogic.pursuitStatus(s),label=p.held?'HELD BACK':s.mode==='catching'?'CAUGHT':p.danger?'ON YOUR HEELS':p.gap>=12?'MAKING SPACE':'IN PURSUIT';
 el.innerHTML='<span aria-hidden="true">♟</span> '+label+' · '+p.gap.toFixed(1)+' m <span class="proximity"><i style="width:'+Math.round(p.close*100)+'%"></i></span>';el.style.background=p.danger?'#a7442df2':'#203e43eb';el.setAttribute('aria-label','Hall monitor '+label.toLowerCase()+', '+p.gap.toFixed(1)+' meters behind. Zero means the monitor grabs your '+(s.character==='maryann'?'backpack strap':'hoodie')+' and slows you.');
}


function populationSprite(cell,x,y,width,height){if(!available('population'))return;sheet('population',cell,4,x,y,width,height);}
function drawLaneCue(o,p){if(!(o.moveCue>0)||o.moveTarget==null)return;const direction=Math.sign(o.moveTarget-(o.visualLane??o.lane)),k=p.scale,x=p.x+direction*18*k,y=p.y-3*k;line(p.x,y,x,y,'#d49b38',2*k);poly([[x,y],[x-direction*6*k,y-4*k],[x-direction*6*k,y+4*k]],'#d49b38');}
function drawClassroomStudent(o,p,height){if(o.classroomComplete)return;const left=projection(o.z-s.distance,1-UTLogic.CLASSROOM_GEOMETRY.wallLaneHalf),right=projection(o.z-s.distance,1+UTLogic.CLASSROOM_GEOMETRY.wallLaneHalf);ctx.save();ctx.beginPath();ctx.rect(Math.min(left.x,right.x),p.y-height-6,Math.abs(right.x-left.x),height+12);ctx.clip();ctx.translate(p.x,p.y);const entering=o.classroomState==='enteringClassroom',exiting=o.classroomState==='exitingClassroom';if(entering||exiting){const orientation=Math.min(1,Math.abs(o.lateralMotion||0)/.8);ctx.transform(1-orientation*.16,0,-o.door.side*orientation*.05,1,0,0);}drawWalker({...o,velocity:o.classroomKind==='enter'?CONFIG.studentSpeed:-CONFIG.studentSpeed},{...p,x:0,y:0},height);ctx.restore();}
function drawSchoolActivity(o){const p=projection(o.z-s.distance,o.visualLane??o.lane);if(o.type==='cart'){populationSprite(3,p.x,p.y,Infinity,worldSpriteHeight('cart',p));return;}if(o.classroomEvent){drawClassroomStudent(o,p,worldSpriteHeight('student',p));return;}drawWalker(o,p,worldSpriteHeight('student',p));drawLaneCue(o,p);}
function drawWalker(actor,p,height){
 if(!available('walkers'))return;
 ellipse(p.x,p.y,13*p.scale,3*p.scale,'#29352d25');
 const frame=(actor.studentPlan?.startVelocity??actor.velocity)>0?8:0;
 const phase=(actor.walkPhase||0)*Math.PI/4,run=actor.gaitBlend||0;
 const swing=Math.sin(phase),armVariation=actor.armSwing||1;
 const lean=Math.max(-.035,Math.min(.035,(actor.lateralMotion||0)*.006));
 const drawRegion=(x,y,width,regionHeight,pose=frame)=>{
  ctx.beginPath();ctx.rect(x*height,y*height,width*height,regionHeight*height);ctx.clip();
  alignedSprite('walkers',pose,0,0,height);
 };
 ctx.save();ctx.translate(p.x,p.y);
 // Draw the receding leg first, then the leading leg. Both use the same
 // planted source limb so a baked-in bent pose cannot favor either side.
 const legs=[-1,1].map(side=>({side,depth:swing*side})).sort((a,b)=>a.depth-b.depth);
 for(const {side,depth} of legs){
  const hip=side*height*.075,sourceHip=-height*.075;
  const shortening=1-Math.max(0,-depth)*(.16+run*.08);
  const angle=depth*(.055+run*.045);
  const floorCorrection=height*.405*(1-Math.cos(angle));
  ctx.save();ctx.translate(0,floorCorrection);
  ctx.translate(hip,-height*.405);
  ctx.rotate(angle);
  ctx.scale(side<0?1:-1,shortening);
  ctx.translate(-sourceHip,height*.405);
  drawRegion(-.4,-.445,.4,.46,frame);
  ctx.restore();
 }
 ctx.save();ctx.transform(1,0,lean,1,0,0);
 // Foreshorten the upper body around the hips to show forward pitch in this head-on view.
 ctx.translate(0,-height*.405);ctx.scale(1+run*.025,1-run*.16);ctx.translate(0,height*.405);
 for(const side of [-1,1]){
  ctx.save();const shoulder=side*height*.115;
  ctx.translate(shoulder,-height*.68);ctx.rotate(-side*swing*(.06+run*.15)*armVariation);
  ctx.translate(-shoulder,height*.68);
  drawRegion(side<0?-.4:.105,-.73,.295,.35);ctx.restore();
 }
 // The head and core stay steady while the shoulders and hips counter-rotate.
 ctx.save();drawRegion(-.5,-1.03,1,.355);ctx.restore();
 ctx.save();ctx.rotate(-swing*(.006+run*.008));
 ctx.beginPath();ctx.moveTo(-height*.105,-height*.72);ctx.lineTo(height*.105,-height*.72);
 ctx.lineTo(height*.13,-height*.39);ctx.lineTo(-height*.13,-height*.39);ctx.closePath();ctx.clip();
 alignedSprite('walkers',frame,0,0,height);ctx.restore();
 ctx.restore();ctx.restore();
}
function drawHallPopulation(){for(const p of s.pedestrians){if(p.z-s.distance>150)continue;const screen=worldPoint(p.x,0,p.z);drawWalker(p,screen,worldSpriteHeight('student',screen));if(s.stumble&&p.z-s.distance<55)text('Whoa!',screen.x,screen.y-worldSpriteHeight('student',screen)-8*screen.scale,Math.max(7,9*screen.scale),'#fff1ce');}}
function drawWayfinding(){}
  const WALLY_META={"wallyCycle": {"boxes": [[127, 7, 147, 249, 127, 7], [488, 7, 147, 249, 104, 7], [881, 7, 145, 249, 113, 7], [1258, 7, 152, 249, 106, 7], [125, 256, 147, 256, 125, 0], [491, 256, 144, 256, 107, 0], [883, 256, 152, 256, 115, 0], [1264, 256, 147, 256, 112, 0], [114, 512, 166, 256, 114, 0], [483, 512, 173, 256, 99, 0], [864, 512, 178, 256, 96, 0], [1255, 512, 166, 256, 103, 0], [115, 768, 166, 244, 115, 0], [486, 768, 169, 243, 102, 0], [873, 768, 175, 244, 105, 0], [1262, 768, 172, 241, 110, 0]], "cellWidth": 384.0, "cellHeight": 256.0, "height": 256, "baseline": 256}, "wallyActions": {"boxes": [[98, 15, 397, 497, 98, 15], [562, 14, 399, 393, 50, 14], [1039, 17, 398, 495, 15, 17], [36, 512, 476, 470, 36, 0], [512, 550, 471, 441, 0, 38], [1131, 512, 251, 489, 107, 0]], "cellWidth": 512.0, "cellHeight": 512.0, "height": 497, "baseline": 512}};
function wallySprite(key,frame,x,y,height,individual){const im=paintings[key],meta=key==='wallyActions'?CLEAN_META.wallyActions:WALLY_META[key],b=meta.boxes[frame];const factor=height/(individual?b[3]:meta.height);
 const dx=individual?-b[2]*factor/2:(b[4]-meta.cellWidth/2)*factor;const dy=individual?-height:(b[5]-meta.baseline)*factor;
 ctx.drawImage(im,b[0],b[1],b[2],b[3],x+dx,y+dy,b[2]*factor,b[3]*factor);}

// One world coordinate system: x = lanes, y = height, z = forward metres.
// World heights and sprite heights share the camera's vertical focal scale.
  const WORLD_HEIGHTS={janitor:UTLogic.JANITOR_SETTINGS.worldHeight,wally:1.12,maryann:.9184,student:1.12,monitor:1.30,bag:.48,gym:.46,cart:.72,banner:1.25,door:2.85};
  function cameraUnits(width=w,height=h){return Math.min(height*.22,width*.33);}
  function depthScale(distance){return CONFIG.perspectiveDepth/Math.max(1,distance-CONFIG.collisionDepth+CONFIG.perspectiveDepth);}
  function playerRenderScale(p){return worldSpriteHeight('wally',p)/160;}
  function worldSpriteHeight(kind,p){return WORLD_HEIGHTS[kind]*cameraUnits()*p.depth;}
  function bathroomEntryPose(){const startLane=s.visualLane-1,startZ=s.distance+CONFIG.collisionDepth,t=Math.max(0,Math.min(1,endingTime/ARRIVAL_TIMING.approach)),ease=t*t*(3-2*t),entry=Math.max(0,Math.min(1,(endingTime-ARRIVAL_TIMING.approach)/(ARRIVAL_TIMING.relief-ARRIVAL_TIMING.approach))),lane=startLane+(1.30-startLane)*ease+.65*entry*entry*(3-2*entry),z=startZ+(UTLogic.targetDistance(s)+CONFIG.collisionDepth-startZ)*ease;return {lane,z,yawEase:ease,travel:Math.hypot((lane-startLane)*UTLogic.LANE_METRES,z-startZ),opacity:1};}
 // A distance-driven rounded path keeps runner and camera together through each junction.
function routePoint(distance,lane=0){return UTLogic.routePoint(distance,lane,s);}
function visualRoutePoint(distance,lane=0){const radius=reduced?80:60;for(let i=0;i<UTLogic.routeTurns(s).length;i++){const at=UTLogic.routeTurns(s)[i];if(distance<at-radius||distance>at+radius)continue;const a=routePoint(at-radius),b=routePoint(at+radius),corner=routePoint(at),p=(distance-at+radius)/(2*radius),q=1-p,x=q*q*a.x+2*q*p*corner.x+p*p*b.x,z=q*q*a.z+2*q*p*corner.z+p*p*b.z,dx=2*q*(corner.x-a.x)+2*p*(b.x-corner.x),dz=2*q*(corner.z-a.z)+2*p*(b.z-corner.z),heading=Math.atan2(dx,dz);return {x:x+Math.cos(heading)*lane*UTLogic.LANE_METRES,z:z-Math.sin(heading)*lane*UTLogic.LANE_METRES,heading};}return routePoint(distance,lane);}
// Runner/camera follow the existing route curve only after intentional input.
function runnerRoutePoint(distance,lane=0){return visualRoutePoint(distance,lane);}
function navigationCamera(){if(s.result==='success'&&(s.mode==='ending'||s.mode==='finished'||s.mode==='relief'||s.mode==='completed'||s.mode==='roundTransition'||(s.mode==='paused'&&['ending','relief','roundTransition'].includes(s.pausedFrom)))){const entry=bathroomEntryPose(),target=routePoint(entry.z,Math.min(1.30,entry.lane)*entry.yawEase),yaw=s.heading+Math.PI/2*entry.yawEase;return {x:target.x-Math.sin(yaw)*CONFIG.perspectiveDepth,z:target.z-Math.cos(yaw)*CONFIG.perspectiveDepth,yaw};}const target=runnerRoutePoint(s.distance+CONFIG.collisionDepth),yaw=target.heading;return {x:target.x-Math.sin(yaw)*CONFIG.perspectiveDepth,z:target.z-Math.cos(yaw)*CONFIG.perspectiveDepth,yaw};}
 function projectCamera(cx,cz,height){const depth=CONFIG.perspectiveDepth/Math.max(2,cz);return {x:w/2+cx/UTLogic.LANE_METRES*w*.27*depth,y:h*.36+h*.51*depth-height*cameraUnits()*depth,scale:depth*cameraUnits()/118.8,depth,cx,cz,height};}
 function projectPhysical(x,height,z){const cam=navigationCamera(),dx=x-cam.x,dz=z-cam.z;return projectCamera(dx*Math.cos(cam.yaw)-dz*Math.sin(cam.yaw),dx*Math.sin(cam.yaw)+dz*Math.cos(cam.yaw),height);}
 function worldPoint(x,height,z){const p=Math.abs(z-(s.distance+CONFIG.collisionDepth))<1e-7?runnerRoutePoint(z,x):visualRoutePoint(z,x);return projectPhysical(p.x,height,p.z);}
 let worldDecor=null;
function initWorldDecor(){if(worldDecor||!available('hall'))return;worldDecor={};const im=paintings.hall;
for(const [key,b] of Object.entries({door:[0,30,105,735],window:[915,55,109,575],art:[112,160,218,288],cream:[318,1318,64,64],sage:[668,1318,64,64]})){const c=document.createElement('canvas');c.width=b[2];c.height=b[3];c.getContext('2d').drawImage(im,...b,0,0,c.width,c.height);worldDecor[key]=c;}}
function worldQuad(points,color,asset){
 // Clip polygons in camera space before projection, so yaw cannot explode near-plane vertices.
 let clipped=[];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],insideA=a.cz>=2,insideB=b.cz>=2;if(insideA)clipped.push(a);if(insideA!==insideB){const t=(2-a.cz)/(b.cz-a.cz);clipped.push(projectCamera(a.cx+(b.cx-a.cx)*t,2,a.height+(b.height-a.height)*t));}}
 if(clipped.length<3)return;ctx.save();ctx.beginPath();clipped.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=color;ctx.fill();if(asset){ctx.clip();const xs=clipped.map(p=>p.x),ys=clipped.map(p=>p.y),x=Math.min(...xs),y=Math.min(...ys);ctx.drawImage(asset,x,y,Math.max(1,Math.max(...xs)-x),Math.max(1,Math.max(...ys)-y));}ctx.restore();}
 function drawWorldHallway(){initWorldDecor();rect(0,0,w,h,'#d7ccb2');rect(0,h*.36,w,h*.64,'#e0c99d');const faces=[],labels=[],half=UTLogic.CLASSROOM_GEOMETRY.wallLaneHalf*UTLogic.LANE_METRES,roomDoors=UTLogic.activeClassroomDoors(s);
 const face=(points,color,asset)=>faces.push({points,color,asset,depth:points.reduce((v,p)=>v+p.cz,0)/points.length});
 for(const seg of UTLogic.routeFor(s)){if(seg.end<s.distance-80||seg.start>s.distance+Math.max(320,(s.normalSpeed??s.speed)*4.5))continue;const length=seg.end-seg.start;
  const point=(x,y,z)=>projectPhysical(seg.x+Math.sin(seg.heading)*z+Math.cos(seg.heading)*x,y,seg.z+Math.cos(seg.heading)*z-Math.sin(seg.heading)*x);
  const next=UTLogic.ROUTE_DIRECTIONS[seg.index],side=next==='left'?-1:1,nearTurn=!!next;
  const bathroomDistance=seg.index===3?UTLogic.firstBathroomDistance(s):null,bathroom=bathroomDistance!==null,doorZ=bathroomDistance+CONFIG.collisionDepth-seg.start,isTarget=bathroom&&bathroomDistance===UTLogic.targetDistance(s);
  const wall=(x,z0,z1,bottom,top,color,asset)=>{if(z1<=z0)return;const panel=(a,b,lo,hi)=>{if(b>a&&hi>lo)face([point(x,hi,a),point(x,hi,b),point(x,lo,b),point(x,lo,a)],color,asset);};
   if(bathroom&&Math.abs(x-half)<.001&&bottom<2.85&&z1>doorZ-6&&z0<doorZ+6){panel(z0,Math.min(z1,doorZ-6),bottom,top);panel(Math.max(z0,doorZ+6),z1,bottom,top);panel(Math.max(z0,doorZ-6),Math.min(z1,doorZ+6),Math.max(bottom,2.85),top);}else{const room=roomDoors.find(d=>d.segmentIndex===seg.index&&d.side===Math.sign(x)&&bottom<UTLogic.CLASSROOM_GEOMETRY.top&&z1>d.localZ-UTLogic.CLASSROOM_GEOMETRY.width/2&&z0<d.localZ+UTLogic.CLASSROOM_GEOMETRY.width/2);if(room){panel(z0,Math.min(z1,room.localZ-UTLogic.CLASSROOM_GEOMETRY.width/2),bottom,top);panel(Math.max(z0,room.localZ+UTLogic.CLASSROOM_GEOMETRY.width/2),z1,bottom,top);panel(Math.max(z0,room.localZ-UTLogic.CLASSROOM_GEOMETRY.width/2),Math.min(z1,room.localZ+UTLogic.CLASSROOM_GEOMETRY.width/2),Math.max(bottom,UTLogic.CLASSROOM_GEOMETRY.top),top);}else panel(z0,z1,bottom,top);}};
  const low=Math.max(0,s.distance-seg.start-70),high=Math.min(nearTurn?length+half:length,s.distance-seg.start+Math.max(300,(s.normalSpeed??s.speed)*4.5));
  for(let r=Math.floor(low/CONFIG.tileLength);r<=Math.ceil(high/CONFIG.tileLength);r++){const z0=Math.max(seg.index?half:0,r*CONFIG.tileLength),z1=Math.min(nearTurn?length+half:length,(r+1)*CONFIG.tileLength);if(z1<=z0)continue;for(let x=-2;x<2;x++){const a=Math.max(-half,x*UTLogic.LANE_METRES),b=Math.min(half,(x+1)*UTLogic.LANE_METRES),light=(r+x+seg.index)%2===0;face([point(a,0,z0),point(b,0,z0),point(b,0,z1),point(a,0,z1)],light?'#edce99':'#879487',worldDecor&&worldDecor[light?'cream':'sage']);}
   // Ceiling panels share floor boundaries and corridor width, including the junction.
   face([point(-half,3.7,z0),point(half,3.7,z0),point(half,3.7,z1),point(-half,3.7,z1)],'#e7dfcc');
   if(r%3===0){const z=(z0+z1)/2;face([point(-5,3.68,z-2),point(5,3.68,z-2),point(5,3.68,z+2),point(-5,3.68,z+2)],'#fff5cf');}
  }
  for(const wallSide of [-1,1]){const x=wallSide*half,begin=seg.index?half:0,end=nearTurn?length+(wallSide===side?-half:half):length;
   for(let n=Math.floor(low/CONFIG.sectionLength);n<=Math.ceil(high/CONFIG.sectionLength);n++){const a=Math.max(begin,n*CONFIG.sectionLength),b=Math.min(end,(n+1)*CONFIG.sectionLength);if(b<=a)continue;
    wall(x,a,b,0,3.7,'#d9caae');wall(x,a,b,0,1.25,'#9dac99');wall(x,a,b,.12,.20,'#596963');wall(x,a,b,1.20,1.27,'#efe1bb');
    const decorate=(offset,size,bottom,top,color,asset)=>{const z0=n*CONFIG.sectionLength+offset,z1=z0+size;if(z0>=a&&z1<=b&&!(bathroom&&x>0&&z1>doorZ-8&&z0<doorZ+8))wall(x,z0,z1,bottom,top,color,asset);};
    if(!roomDoors.some(d=>d.segmentIndex===seg.index&&d.side===wallSide&&d.section===n)){const cg=UTLogic.CLASSROOM_GEOMETRY;decorate(cg.offset,cg.width,cg.bottom,cg.top,'#b98753',worldDecor&&worldDecor.door);}decorate(26,15,1.3,3.15,'#66888a',worldDecor&&worldDecor.window);
    if(n%3===1){decorate(43,5,1.4,2.6,'#bb9d68',worldDecor&&worldDecor.art);decorate(8,14,3.08,3.28,'#e7d5af');}if(n%2===0)decorate(42,8,1.65,2.95,'#d1b678',worldDecor&&worldDecor.art);
   }
  }
  
  for(const room of roomDoors.filter(d=>d.segmentIndex===seg.index)){const cg=UTLogic.CLASSROOM_GEOMETRY,x=room.side*half,z=room.localZ,lo=z-cg.width/2,hi=z+cg.width/2;if(z<low-20||z>high+20)continue;
   face([point(x+room.side*.8,cg.top,lo),point(x+room.side*.8,cg.top,hi),point(x+room.side*.8,0,hi),point(x+room.side*.8,0,lo)],'#344d49');face([point(x,0,lo),point(x+room.side*2.4,0,lo),point(x+room.side*2.4,0,hi),point(x,0,hi)],'#879487');
   const theta=room.open*Math.PI*.46,edgeX=x+room.side*cg.width*Math.sin(theta),edgeZ=lo+cg.width*Math.cos(theta);face([point(x,cg.top,lo),point(edgeX,cg.top,edgeZ),point(edgeX,0,edgeZ),point(x,0,lo)],'#b98753',worldDecor&&worldDecor.door);
   wall(x-room.side*.03,lo-.6,lo,0,cg.top+.1,'#946c46');wall(x-room.side*.03,hi,hi+.6,0,cg.top+.1,'#946c46');wall(x-room.side*.03,lo,hi,cg.top,cg.top+.1,'#946c46');
  }
  if(bathroom&&doorZ>=low-20&&doorZ<=high){const x=half-.08;
   wall(x,doorZ-7,doorZ-6,0,3.02,'#946c46');wall(x,doorZ+6,doorZ+7,0,3.02,'#946c46');wall(x,doorZ-7,doorZ+7,2.85,3.02,'#946c46');
   face([point(half+.8,2.85,doorZ-6),point(half+.8,2.85,doorZ+6),point(half+.8,0,doorZ+6),point(half+.8,0,doorZ-6)],'#203c40');
   face([point(half,0,doorZ-6),point(half+6,0,doorZ-6),point(half+6,0,doorZ+6),point(half,0,doorZ+6)],'#73877c');
   const open=isTarget&&s.result==='success'&&endingTime>=ARRIVAL_TIMING.approach;
   if(!open){wall(half-.15,doorZ-6,doorZ+6,0,2.85,'#557f79');wall(half-.18,doorZ-5,doorZ+5,1.55,2.35,'#a5c0bd');}
   else wall(half-.18,doorZ-6,doorZ-4.8,0,2.85,'#557f79');
   wall(half-.25,doorZ-8,doorZ+8,3.10,3.5,'#264e67');
   labels.push({p:point(half-.3,3.26,doorZ),bathroom:true,arrow:''});

  }
  if(nearTurn&&length>=low&&length<=high+half){
   // Painted floor arrow and existing wall sign make the input direction environmental.
   const arrowZ=length-42;face([[-8,-3],[1,-3],[1,-7],[9,0],[1,7],[1,3],[-8,3]].map(([x,z])=>point(side*x,.025,arrowZ+z)),'#f4c55b');
   // A square junction joins the incoming floor to the perpendicular outgoing floor.
   
   face([point(-half,3.7,length+half),point(half,3.7,length+half),point(half,0,length+half),point(-half,0,length+half)],'#d9caae');
   face([point(-half,1.25,length+half),point(half,1.25,length+half),point(half,0,length+half),point(-half,0,length+half)],'#9dac99');
   for(const [bottom,top,color] of [[.12,.20,'#596963'],[1.20,1.27,'#efe1bb']])face([point(-half,top,length+half-.02),point(half,top,length+half-.02),point(half,bottom,length+half-.02),point(-half,bottom,length+half-.02)],color);
   for(const postSide of [-1,1]){const postZ=length+(postSide===side?-half:half),x=postSide*half;face([point(x-.35,3.7,postZ),point(x+.35,3.7,postZ),point(x+.35,0,postZ),point(x-.35,0,postZ)],'#b7ac91');}
   // Framed restroom direction panel is attached to the end wall, rather than floating ahead.
   const centre=-side*half*.35;face([point(centre-7,2.7,length+half-.12),point(centre+7,2.7,length+half-.12),point(centre+7,2.15,length+half-.12),point(centre-7,2.15,length+half-.12)],'#264e67');
   labels.push({p:point(-side*half*.35,2.4,length+half-.2),arrow:side>0?'→':'←'});
  }
 }
 faces.sort((a,b)=>b.depth-a.depth);for(const f of faces)worldQuad(f.points,f.color,f.asset);
 for(const sign of labels){const p=sign.p;if(p.cz<3||p.x< -100||p.x>w+100)continue;const sw=95*p.scale;text(sign.bathroom?'RESTROOM':('RESTROOMS '+sign.arrow),p.x,p.y+4*p.scale,Math.max(8,11*p.scale),'#fff0ce');}
 }
 const CLEAN_META={"slim":{"boxes":[[122,11,117,323,122,11],[487,11,114,322,125,11],[845,11,112,322,121,11],[1205,11,119,322,119,11],[125,363,110,300,125,1],[491,363,114,300,129,1],[846,363,114,302,122,1],[1214,363,115,300,128,1],[86,725,140,304,86,1],[439,725,144,304,77,1],[869,725,139,304,145,1],[1222,725,143,304,136,1]],"cellWidth":362,"cellHeight":362,"height":323,"baseline":334},"walkers":{"boxes":[[98,8,112,285,98,8],[427,7,122,286,99,7],[760,6,116,287,104,6],[1087,7,122,286,103,7],[95,307,113,285,95,7],[426,305,118,287,98,5],[753,305,122,286,97,5],[1090,305,123,287,106,5],[95,601,123,288,95,1],[426,601,127,288,98,1],[753,601,125,288,97,1],[1088,601,123,288,104,1],[94,900,124,290,94,1],[423,900,126,291,95,1],[759,900,125,290,103,1],[1094,900,122,290,110,1]],"cellWidth":328,"cellHeight":299.75,"height":291,"baseline":293},"wallyActions":{"boxes":[[97,14,399,393,97,14],[561,13,401,395,49,13],[1038,16,400,389,14,16],[35,513,476,470,35,1],[571,549,413,443,59,37],[1130,513,253,489,106,1]],"cellWidth":512,"cellHeight":512,"height":489,"baseline":490}};const isolatedFrames={};
function alignedSprite(key,frame,x,y,height){const im=paintings[key],m=CLEAN_META[key],b=m.boxes[frame];if(!im||!im.complete)return;const cacheKey=key+':'+frame;let c=isolatedFrames[cacheKey];if(!c){c=document.createElement('canvas');c.width=b[2]+4;c.height=b[3]+4;c.getContext('2d').drawImage(im,b[0],b[1],b[2],b[3],2,2,b[2],b[3]);isolatedFrames[cacheKey]=c;}
// Shared uniform scale and fixed foot anchor. Transparent padding prevents atlas sampling bleed.
const factor=height/m.height;ctx.drawImage(c,x-(b[2]/2+2)*factor,y-(b[3]+2)*factor,c.width*factor,c.height*factor);}

const RESTORED_META={"restored":{"boxes":[[127,7,147,277],[488,6,147,276],[881,7,145,274],[1258,7,152,275],[125,286,147,276],[490,286,145,276],[883,286,152,276],[1264,286,147,275],[114,562,166,226],[483,564,173,224],[864,564,178,224],[1255,564,166,224],[115,788,166,224],[486,788,169,223],[873,788,175,224],[1261,788,173,222]],"height":277},"restoredActions":{"boxes":[[96,13,401,395],[560,13,403,396],[1037,15,402,391],[34,423,515,561],[570,548,415,444],[1129,416,255,587]],"height":587}};const restoredFrames={};
function restoredFrame(key,index){const im=paintings[key==='restored'?'wallyCycle':'wallyActions'],m=RESTORED_META[key],b=m.boxes[index],cache=key+index;if(restoredFrames[cache])return restoredFrames[cache];const c=document.createElement('canvas');c.width=b[2]+32;c.height=b[3]+32;c.getContext('2d').drawImage(im,...b,16,16,b[2],b[3]);return restoredFrames[cache]=c;}
function restoredSprite(key,index,x,y,height,portrait=false){const m=RESTORED_META[key],b=m.boxes[index],c=restoredFrame(key,index),ref=portrait?b[3]:key==='restoredActions'?Math.max(...m.boxes.slice(3).map(v=>v[3])):m.height,k=height/ref;ctx.drawImage(c,x-(b[2]/2+16)*k,y-(b[3]+16)*k,c.width*k,c.height*k);}
// Presentation only: pose is derived from existing simulation state, including paused state.
const characterPoseCache=new WeakMap();
function characterMotionPose(){let cache=characterPoseCache.get(s);if(!cache||s.time<cache.time){cache={time:s.time,phase:s.playerPhase,maryPhase:s.playerPhase,lean:0,forward:0};characterPoseCache.set(s,cache);}const dt=Math.max(0,Math.min(.1,s.time-cache.time));let advance=s.playerPhase-cache.phase;if(advance<-.5)advance+=1;if(advance>.5)advance-=1;cache.maryPhase+=advance*.8;cache.phase=s.playerPhase;cache.time=s.time;const mary=s.character==='maryann',lateral=Math.max(-1,Math.min(1,(s.lane-s.visualLane)*5.5)),targetLean=lateral*(reduced?.06:.175);cache.lean+=(targetLean-cache.lean)*(1-Math.exp(-dt*16));const targetForward=Math.max(0,Math.min(1,(s.normalSpeed/UTLogic.roundDifficulty(s).speed-65)/65));cache.forward+=(targetForward-cache.forward)*(1-Math.exp(-dt*5));const laneLean=cache.lean;let turn=0;const radius=reduced?80:60;for(let i=0;i<UTLogic.routeTurns(s).length;i++){const t=(s.distance+CONFIG.collisionDepth-UTLogic.routeTurns(s)[i]+radius)/(2*radius);if(t>0&&t<1){turn=Math.sin(Math.PI*t)*(UTLogic.ROUTE_DIRECTIONS[i]==='right'?1:-1);break;}}
 const elapsed=s.stumble>0?(s.stumbleDuration??CONFIG.stumbleDuration)-s.stumble:Infinity,duration=mary?.75:1,weight=elapsed<duration?(1-elapsed/duration)**2:0,jolt=weight>0?weight*Math.sin(elapsed*(mary?22:17)):0,lean=Math.max(-.22,Math.min(.22,laneLean+turn*(reduced?.035:.07)+jolt*(mary?.055:.10)));const slipProgress=1-(s.slipTime||0)/UTLogic.WATER_SETTINGS.slipSeconds,slip=(s.slipTime||0)>0?Math.sin(Math.PI*slipProgress):0;
 return {lean,forward:cache.forward,slip,turn,stumble:weight,flail:jolt+slip*Math.sin(slipProgress*14)*.7,phase:(mary?cache.maryPhase:s.playerPhase)*Math.PI*2};}
function withCharacterPose(x,y,fn){const p=characterMotionPose(),u=characterUrgencyPose(),busy=s.jump>0||s.stumble>0||s.monitorSlow>0||Math.abs(s.lane-s.visualLane)>.08||Math.abs(p.turn)>.1,gesture=busy?0:u.gesture;p.lean+=gesture*(s.character==='maryann'?.035:.065)+(p.slip||0)*Math.sin(s.time*12)*(reduced?.01:.045);ctx.save();ctx.translate(x,y);ctx.transform(1-Math.abs(p.turn)*.06,0,-Math.tan(p.lean),1,0,0);fn(p);ctx.restore();}
const gaitFrames={};
function gaitSource(mary){if(!mary){const b=RESTORED_META.restored.boxes[0];return {c:restoredFrame('restored',0),b,reference:277};}const b=MARYANN_BOXES[0];if(!gaitFrames.maryann){const c=document.createElement('canvas');c.width=b[2]+32;c.height=b[3]+32;c.getContext('2d').drawImage(paintings.maryann,...b,16,16,b[2],b[3]);gaitFrames.maryann=c;}return {c:gaitFrames.maryann,b,reference:342};}
function wallyHairFringe(source,box){
 if(gaitFrames.wallyFringe)return gaitFrames.wallyFringe;
 const fringe=document.createElement('canvas');fringe.width=source.width;fringe.height=source.height;
 const image=source.getContext('2d').getImageData(0,0,source.width,source.height),pixels=image.data;
 const centerX=16+box[2]/2,centerY=16+box[3]*.155;
 for(let y=0;y<source.height;y++)for(let x=0;x<source.width;x++){
  const i=(y*source.width+x)*4;
  const radius=Math.hypot((x-centerX)/(box[2]*.43),(y-centerY)/(box[3]*.145));
  const edge=Math.max(0,Math.min(1,(radius-.86)/.2));
  const root=Math.max(0,Math.min(1,(box[3]*.285+16-y)/12));
  const hair=pixels[i]<135&&pixels[i+1]<105&&pixels[i+2]<100;
  pixels[i+3]=hair?pixels[i+3]*edge*root:0;
 }
 fringe.getContext('2d').putImageData(image,0,0);
 gaitFrames.wallyFringe=fringe;
 return fringe;
}
function drawIllustratedGait(x,y,height,mary=false){const {c,b,reference}=gaitSource(mary),k=height/reference,p=characterMotionPose(),phase=p.phase,wave=Math.sin(phase),running=s.playerGait==='run',cut=16+Math.floor(b[3]*.66),bottom=16+b[3],mid=16+b[2]/2,left=x-b[2]*k/2,top=y-b[3]*k;
 // Slip skids pivot at the hips, preserving the existing limb joins.
 ctx.save();ctx.translate(x,top+(cut-16)*k);ctx.transform(1,0,(s.slipDirection||1)*p.slip*.10,1+p.slip*.035,0,0);ctx.translate(-x,-top-(cut-16)*k);
 // The support foot stays on the floor for half a cycle. The other foot advances and lifts.
 for(const side of [-1,1]){if(mary){const swing=wave*side,air=Math.max(0,swing),sx=side<0?16:mid,sw=b[2]/2+1,pivotX=x+side*b[2]*k*.25,pivotY=top+(cut-16)*k;ctx.save();ctx.translate(pivotX,pivotY);ctx.rotate(air*side*(running?.075:.035));ctx.drawImage(c,sx,cut-16,sw,bottom-cut+16,(side<0?-b[2]*.25:-b[2]*.25)*k,-16*k,sw*k,(bottom-cut+16)*k);ctx.restore();continue;}const swing=wave*side,air=Math.max(0,swing),lift=air*(running?(mary?6:9):3)*k,depth=air*Math.cos(phase)*(mary?3:5)*k,sx=side<0?16:mid,sw=b[2]/2+1;ctx.save();ctx.translate(x+side*b[2]*k*.22,top+(cut-16)*k);ctx.rotate(swing*(running?(mary?.035:.06):.02));ctx.drawImage(c,sx,cut-2,sw,bottom-cut+2,(side<0?-b[2]*.28:-b[2]*.22)*k,-2*k-lift+depth,sw*k,(bottom-cut+2)*k);ctx.restore();}
 ctx.restore();
 const hipY=top+(cut-16)*k,forward=p.forward*(s.jump>0?.35:1)*(1-p.slip)-p.slip*.22;
 ctx.save();ctx.translate(x,hipY);ctx.scale(1+forward*.025,1-forward*.16);ctx.translate(-x,-hipY);
 const armTop=16+Math.floor(b[3]*.41),armBottom=cut+5,armWidth=b[2]*.23;
 for(const side of [-1,1]){const sx=side<0?16:16+b[2]-armWidth,armSwing=-wave*side*(running?(mary?.075:.14):.04)*(1+characterUrgencyPose().intensity*.5)+p.flail*(mary?.08:.18)-side*p.slip*(mary?.32:.4);ctx.save();ctx.translate(x+side*b[2]*k*.34,top+(armTop-16)*k);ctx.rotate(armSwing);ctx.drawImage(c,sx,armTop,armWidth,armBottom-armTop,-armWidth*k/2,0,armWidth*k,(armBottom-armTop)*k);ctx.restore();}
 // The complete head stays in its original pose. Only the isolated fringe moves.
 ctx.save();
 ctx.beginPath();ctx.moveTo(left-16*k,top-16*k);ctx.lineTo(left+(b[2]+16)*k,top-16*k);ctx.lineTo(left+(b[2]+16)*k,top+(armTop-16)*k);ctx.lineTo(left+b[2]*.79*k,top+(armTop-16)*k);ctx.lineTo(left+b[2]*.79*k,top+(cut-14)*k);ctx.lineTo(left+b[2]*.21*k,top+(cut-14)*k);ctx.lineTo(left+b[2]*.21*k,top+(armTop-16)*k);ctx.lineTo(left-16*k,top+(armTop-16)*k);ctx.closePath();ctx.clip();ctx.drawImage(c,0,0,c.width,cut+2,left-16*k,top-16*k,c.width*k,(cut+2)*k);ctx.restore();
 if(!mary){
  const fringe=wallyHairFringe(c,b);
  const strength=p.forward*(reduced?.2:1)*(s.jump>0?.4:1);
  const drift=Math.sin(phase*.5-.65)*2.8*strength*k;
  const sideDrift=Math.sin(phase*.5-1.4)*.7*strength*k;
  ctx.drawImage(fringe,left-16*k+sideDrift,top-16*k+drift,fringe.width*k,fringe.height*k);
 }
 // Maryann's full-width hip bridge overlaps both fixed thigh pivots; no floating leg translations.
 if(mary){const bridgeTop=cut-24,bridgeHeight=38;ctx.drawImage(c,16,bridgeTop,b[2],bridgeHeight,left,top+(bridgeTop-16)*k,b[2]*k,bridgeHeight*k);}
 ctx.restore();
}
function drawRestoredGait(x,y,height){drawIllustratedGait(x,y,height,false);}

const MARYANN_BOXES=[[117,5,191,336],[484,5,206,336],[841,6,208,335],[1216,7,215,334],[101,352,236,330],[466,353,242,330],[834,355,250,327],[1210,353,247,330],[65,690,311,284],[489,699,195,315],[776,690,314,321],[1164,691,344,319]];
// Cache intact frames in transparent gutters so interpolation never samples the atlas neighbor.
const maryannFrames={};
function maryannSprite(frame,x,y,height,portrait=false){if(!available('maryann'))return;const b=MARYANN_BOXES[frame],k=height/(portrait?b[3]:342);let c=maryannFrames[frame];if(!c){c=document.createElement('canvas');c.width=b[2]+8;c.height=b[3]+8;c.getContext('2d').drawImage(paintings.maryann,...b,4,4,b[2],b[3]);maryannFrames[frame]=c;}ctx.drawImage(c,x-(b[2]/2+4)*k,y-(b[3]+4)*k,c.width*k,c.height*k);}
function drawMaryann(x,y,scale,slump){const height=160*scale*.82,hop=s.jump?Math.sin((1-s.jump/CONFIG.jumpDuration)*Math.PI)*Math.min(h*.23,125*Math.min(w/360,h/540)):0;ellipse(x,y+3,23*scale,5*scale,'#2c352e40');withCharacterPose(x,y-hop,()=>{if(slump||s.jump)maryannSprite(slump?9:8,0,0,height);else{const pose=characterMotionPose(),phase=((pose.phase/(Math.PI*2))%1+1)%1,order=s.playerGait==='run'?[4,5,6,7]:[0,1,2,3];maryannSprite(order[Math.floor(phase*4)%4],0,0,height);}});drawUrgencyAccent(x,y-hop,height);}
function characterChoices(){return '<fieldset class="character-choice"><legend>Choose your runner</legend><button type="button" id="choose-wally" aria-pressed="'+(selectedCharacter==='wally')+'"><canvas id="thumb-wally" width="112" height="100"></canvas><b>Wally</b></button><button type="button" id="choose-maryann" aria-pressed="'+(selectedCharacter==='maryann')+'"><canvas id="thumb-maryann" width="112" height="100"></canvas><b>Maryann</b></button></fieldset>';}
function bindCharacterChoices(){for(const key of ['wally','maryann']){$('choose-'+key).onclick=()=>{selectedCharacter=key;for(const other of ['wally','maryann'])$('choose-'+other).setAttribute('aria-pressed',String(other===key));};}drawCharacterThumbs();}
function drawCharacterThumbs(){if(!available('maryann')||!available('wallyActions')){setTimeout(drawCharacterThumbs,100);return;}for(const key of ['wally','maryann']){const c=$('thumb-'+key);if(!c||!c.getContext)continue;const ct=c.getContext('2d');ct.clearRect(0,0,112,100);const b=key==='maryann'?MARYANN_BOXES[10]:RESTORED_META.restoredActions.boxes[0],im=paintings[key==='maryann'?'maryann':'wallyActions'],k=92/b[3];ct.drawImage(im,...b,56-b[2]*k/2,100-b[3]*k,b[2]*k,b[3]*k);}}
function chooseCharacter(){menuGeneration++;stopSchoolBell();UTLogic.clearBellEvent(s);UTLogic.clearWater(s);$('playAgain').hidden=true;s.mode='ready';gesture=null;$('pause').textContent='Pause';$('chase').hidden=true;$('overlay').hidden=false;$('overlay').innerHTML='<div class="card chooser-card" id="cardDialog" role="dialog" aria-labelledby="characterTitle" tabindex="-1"><span class="eyebrow">THE BATHROOM EMERGENCY!</span><h1 id="characterTitle">Ur in<br><em>Trouble.</em></h1>'+characterChoices()+'<p class="character-note"><b>Get to the toilet before you have an accident!</b><br>'+UTLogic.LEVELS.length+' '+UTLogic.LEVELS[0].duration+'-second rounds. Dodge obstacles; turns are automatic.</p><button type="button" class="primary" id="choose-start">START</button><p class="help">← → / A D: dodge · ↑ / Space: jump<br>Phone: swipe left/right or up.</p></div>';bindMenuAction('choose-start',start);bindCharacterChoices();updateStartReadiness();$('cardDialog').focus?.();}
chooseCharacter();


function urgencyStage(pressure){return pressure<30?0:pressure<60?1:pressure<85?2:3;}
function characterUrgencyPose(){const smooth=(lo,hi)=>{const t=Math.max(0,Math.min(1,(s.pressure-lo)/(hi-lo)));return t*t*(3-2*t);},uncomfortable=smooth(30,38),desperate=smooth(60,68),panic=smooth(85,92),intensity=uncomfortable*.25+desperate*.35+panic*.4,clock=s.time,window=(period)=>{const t=(clock%period)/period;return t<.28?Math.sin(Math.PI*t/.28)**2:0;},envelope=uncomfortable*(1-desperate)*window(5.2)+desperate*(1-panic)*window(2.9)+panic*window(1.8),mary=s.character==='maryann',motion=reduced?.3:1,gesture=envelope*intensity*(mary?Math.sin(clock*12):Math.sin(clock*7))*motion;return {stage:urgencyStage(s.pressure),intensity,gesture};}
function updateLevelHud(){const level=UTLogic.levelStatus(s),notice=s.mode==='playing'&&s.levelAnnouncement>0,seconds=Math.ceil(level.remaining-1e-8);$('levelNumber').textContent='ROUND '+level.number+' / '+level.count;$('levelName').textContent=level.name;$('levelTime').textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');$('levelHud').setAttribute('data-announcing',String(notice));$('levelNotice').hidden=true;$('levelName').hidden=false;$('levelNumber').hidden=false;$('levelAnnouncement').hidden=!notice;$('levelAnnouncementNumber').textContent='ROUND '+level.number;$('levelAnnouncementName').textContent=level.name.toUpperCase();$('distance').textContent=Math.ceil(Math.max(0,UTLogic.targetDistance(s)-s.distance))+' m';$('score').textContent=Math.floor(s.score);}

function updateBladderHud(){const p=Math.max(0,Math.min(100,s.pressure)),stage=urgencyStage(p),labels=['Comfortable','Need a bathroom','Desperate!','PANIC — nearly full!'];$('fill').style.width=p+'%';$('fill').style.background=['#f3d044','#efbc39','#ee8a38','#df593c'][stage];$('bladderPercent').textContent=Math.round(p)+'%';$('urgency').textContent=labels[stage];$('bladderHud').setAttribute('data-urgency',String(stage));$('bladderHud').setAttribute('data-active',String(s.mode==='playing'));$('bladderMeter').setAttribute('aria-valuenow',String(Math.round(p)));$('bladderMeter').setAttribute('aria-valuetext',Math.round(p)+' percent full — '+labels[stage]);}

function drawUrgencyAccent(x,y,height){if(s.mode!=='playing'||s.jump||s.stumble||s.monitorSlow)return;const u=characterUrgencyPose();if(u.stage<2||Math.abs(u.gesture)<.13)return;const mary=s.character==='maryann';text(mary?'!!':'!',x+(mary?-.25:.28)*height,y-height-6,Math.max(9,Math.min(14,height*.1)),u.stage===3?'#b94e2d':'#b28126');}

// Reuse the existing expression portraits; no sprite reconstruction or new artwork.
function drawBathroomExpression(r){const x=w-43,y=h-64,size=Math.min(68,w*.19);if(r.mary){if(r.defeat&&available('maryannPanic')){const im=paintings.maryannPanic,k=size/im.naturalHeight;ctx.drawImage(im,x-im.naturalWidth*k/2,y-size,im.naturalWidth*k,size);}else maryannSprite(r.defeat?11:10,x,y,size,true);}else restoredSprite('restoredActions',r.relief?0:r.defeat?2:1,x,y,size,true);}
// Bathroom reactions use existing state clocks; shadows and feet remain floor-anchored.
function bathroomReaction(defeat=false){
 const mary=s.character==='maryann',relief=['relief','completed','roundTransition'].includes(s.mode)||(s.mode==='paused'&&['relief','roundTransition'].includes(s.pausedFrom)),t=defeat?endingTime:relief?(s.reliefElapsed||0):Math.max(0,endingTime-ARRIVAL_TIMING.approach);
 const lean=defeat?(mary?-.07:.13):relief?(mary?-.045:.055)*Math.exp(-t*2):.025,label=characterCaption(defeat?'defeat':relief?'relief':'arrival',true);return {mary,t,lean,label,defeat,relief};
}
function drawArrivalRestPose(p,defeat=false){
 const scale=playerRenderScale(p),r=bathroomReaction(defeat),height=160*scale*(r.mary?.82:1);
 ellipse(p.x,p.y+3,(r.mary?23:28)*scale,(r.mary?5:6)*scale,'#2c352e40');
 ctx.save();ctx.translate(p.x,p.y);ctx.transform(1,0,-r.lean,1,0,0);
 if(r.mary)maryannSprite(defeat?9:3,0,0,height);else restoredSprite(defeat?'restoredActions':'restored',defeat?5:0,0,0,height);
 ctx.restore();
 drawBathroomExpression(r);
 if(r.label){const width=Math.min(w-24,Math.max(128,r.label.length*5.8)),x=Math.max(12,Math.min(w-width-12,p.x-width/2)),y=Math.max(h*.24,p.y-height-35);rect(x,y,width,26,'#fff5dfef',7);text(r.label,x+width/2,y+17,Math.min(12,w*.033),'#35463d');}
}

function advanceRestroomFlow(dt,previousMode){if(previousMode!==s.mode)return;if(s.mode==='relief'){s.reliefElapsed+=dt;if(s.reliefElapsed>=UTLogic.RELIEF_SETTINGS.seconds&&UTLogic.completeRound(s)){if(s.mode==='roundTransition')showRoundTransition();else showCard('All '+UTLogic.LEVELS.length+' rounds complete!',characterCaption('round',true)+'<br>Score: <b>'+Math.floor(s.score)+'</b>','PLAY AGAIN',chooseCharacter);}}}









