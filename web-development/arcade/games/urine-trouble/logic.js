(function(root){'use strict';
const CONFIG={distance:2892,targetRunSeconds:120,playerScale:.48,pressureStart:8,pressureRate:2.65,minSpeed:48,maxSpeed:140,walkEnd:1,jogStart:2.5,runStart:5,sprintStart:20,paceKnots:[[0,48],[1,48],[5,85],[12,115],[20,140]],collisionPressure:2,stumbleDuration:2.8,collisionSpeedFactor:.35,collisionImmunity:.3,cornerSlowDuration:.9,cornerSlowFactor:.70,monitorHitDuration:1,monitorHitFactor:.65,strideMin:18,strideMax:40,simulationStep:.025,jumpDuration:1.35,jumpSpeedPenalty:.08,jumpLandingRecovery:.55,duckDuration:1.55,actionBuffer:2.2,actionGrace:.22,laneDuration:.18,chasePressure:58,chaseStartGap:10,chaseMaxGap:16,chaseRecovery:.38,chasePenalty:4.8,chaseStumbleGain:1.5,chaseIntroDuration:1.1,chaseFollowDelay:.12,chaseFollowRate:7,chaseVisualRate:5,chaseCloseGap:6,chaseCatchDuration:.7,monitorSlowDuration:.8,monitorSlowFactor:.70,monitorReleaseGap:8,monitorContactCooldown:5,spawnAhead:100,collisionDepth:4,perspectiveDepth:36,turnLeadSeconds:5.5,turnClearSeconds:2.5,turnInputSeconds:3.125,turnBufferSeconds:.8125,turnEarlySeconds:.25,turnLateSeconds:1,turnExitDistance:140,studentSpeed:4,monitorSpeed:12,monitorSwerveLead:2.3,monitorCueDuration:.35,monitorLaneDuration:.65,oncomingSwerveLead:1.8,oncomingCueDuration:.3,oncomingLaneDuration:.55,hazardSpacingEarly:1.25,hazardSpacingMid:.95,hazardSpacingLate:.75,popupWarningSeconds:2.2,popupRevealSeconds:1.65,popupRiseDuration:.22,studentCueDuration:.65,studentLaneDuration:1.1,studentReactionSeconds:1.25,playableMin:-.5,playableMax:2.5,turnPositions:[620,1370,2110],turnDirections:["right","left","right"],turnDuration:1.2,sectionLength:52,tileLength:12};
const DIFFICULTY_LIMITS=Object.freeze({minimumRowSeconds:.45,minimumEdgeSeconds:1.65,minimumEdgeSpawnSeconds:1.7,minimumStudentMoveSeconds:.32,studentRetrySeconds:.25,repeatSwervePauseSeconds:.5,routeReactionSeconds:.24,contactWindowSeconds:.10});
const FINAL_BELL_DIFFICULTY=[1.40,2.40,2.80,[3,15,10,5.8],[4,10,7,true,1.18],[[15,33],4,1.6,1]];
// Overall encounter pressure; preserve speed, penalties and safe-route validation.
const OVERALL_HAZARD_MULTIPLIER=1.5;
const ROUND_PROFILES=[
 // Speed, density, swerves; janitor cap/first/interval/crossing; classroom cap/first/interval/exits/pace; bell times/students/pace/stagger.
 [1,1,1,[0,18,60,6.4],[0,30,60,false,1],[[],0,1,1.3]],
 [1.10,1.30,1.40,[1,18,60,6.4],[1,30,60,false,1],[[22],2,1.2,1.3]],
 [1.20,1.65,1.85,[2,17,14,6.2],[2,13,15,true,1.06],[[18],3,1.35,1.15]],
 [1.30,2.00,2.30,[2,16,13,6.0],[3,12,10,true,1.12],[[18],4,1.5,1.1]],
 FINAL_BELL_DIFFICULTY,
 [1.45,2.80,3.10,[3,14,10,5.6],[5,11,6.5,true,1.25],[[14,34],5,1.70,.92]],
 [1.50,3.20,3.40,[3,13,10,5.4],[6,10,5.8,true,1.32],[[14,33],5,1.78,.88]],
 [1.55,3.60,3.70,[4,12,9,5.2],[7,10,5.1,true,1.40],[[14,28,42],4,1.84,.84]],
 [1.60,4.00,4.00,[4,12,8.6,5.0],[8,9.5,4.6,true,1.48],[[13,27,41],5,1.90,.80]],
 [1.65,4.50,4.30,[5,11,8,4.8],[9,9,4.1,true,1.56],[[13,27,41],6,1.96,.76]],
];
const ROUND_NAMES_AND_QUIPS=[
 ['late-for-class','Late for Class','Crisis averted. Your timetable has other ideas.'],
 ['passing-period','Passing Period','One minute of peace? Apparently too much to ask.'],
 ['lunch-rush','Lunch Rush','Lunch was a tactical error.'],
 ['gym-class','Gym Class','Hydration: excellent. Timing: terrible.'],
 ['final-bell','Final Bell','Final bell. Finally, a relieved ending.'],
 ['hall-monitor-madness','Hall Monitor Madness','Can I get a hall pass for the next emergency?'],
 ['corridor-chaos','Corridor Chaos','My bladder would like a less eventful route.'],
 ['schoolwide-panic','Schoolwide Panic','Next time, I’m bringing a map of the toilets.'],
 ['the-longest-hallway','The Longest Hallway','I could swear that hallway got longer.'],
 ['last-chance','Last Chance','Ten bathroom breaks. Please don’t make it eleven.'],
];
const WATER_PROFILES=Object.freeze([
 {chance:0,max:0},{chance:0,max:0},{chance:.25,max:1},{chance:.4,max:1},{chance:.55,max:1},
 {chance:.78,max:2,secondChance:.15,spillInterval:1,spillReach:.32},{chance:.85,max:2,secondChance:.35,spillInterval:.95,spillReach:.34},{chance:.92,max:2,secondChance:.55,spillInterval:.9,spillReach:.36},{chance:.97,max:2,secondChance:.75,spillInterval:.85,spillReach:.38,minLeadSeconds:1.8},{chance:1,max:2,secondChance:.9,spillInterval:.8,spillReach:.42,minLeadSeconds:1.6}
].map(Object.freeze));
const STUDENT_PROFILES=Object.freeze([
 // Multi-step chance, third-step chance, reversal chance, crossing seconds, pause, run speed, plan variants.
 [.08,0,0,1.10,.48,5.8,1],
 [.15,0,0,1.08,.46,5.9,1],
 [.32,0,.05,1.04,.44,6.0,2],
 [.45,.05,.08,1.00,.42,6.2,2],
 [.55,.10,.10,.97,.40,6.4,3],
 [.72,.18,.18,.94,.38,6.8,3],
 [.80,.28,.22,.90,.36,7.0,3],
 [.88,.45,.26,.86,.34,7.2,3],
 [.95,.65,.30,.82,.32,7.4,3],
 [1,.80,.34,.78,.30,7.6,3]
].map(([multiChance,thirdChance,reversalChance,laneSeconds,pauseSeconds,runSpeed,variants])=>Object.freeze({multiChance,thirdChance,reversalChance,laneSeconds,pauseSeconds,runSpeed,variants})));
const COORDINATION_PROFILES=Object.freeze(Array.from({length:10},(_,index)=>Object.freeze({
 advanced:index>=5,
 minimumRowSeconds:index<5?.45:[.44,.42,.40,.38,.36][index-5],
 edgeSeconds:index<5?1.7:[1.60,1.50,1.40,1.30,1.20][index-5],
 reactionSeconds:index<5?.24:[.18,.17,.16,.15,.14][index-5],
 classroomConcurrent:index<5?1:index<8?2:3,
 janitorClearSeconds:index<5?1.8:[.9,.85,.8,.75,.7][index-5],
 bellClearSeconds:index<5?.75:[.55,.5,.45,.4,.35][index-5]
})));
const LEVELS=Object.freeze(ROUND_NAMES_AND_QUIPS.map(([id,name,quip],index)=>{
 const [speed,density,swerve,[janitors,janitorFirst,janitorInterval,crossSeconds],[classrooms,classroomFirst,classroomInterval,exits,classroomPace],[times,students,bellPace,stagger]]=ROUND_PROFILES[index];
 const difficulty=Object.freeze({speed,density:density*OVERALL_HAZARD_MULTIPLIER,swerve,water:WATER_PROFILES[index],student:STUDENT_PROFILES[index],coordination:COORDINATION_PROFILES[index],
  janitor:Object.freeze({max:janitors,first:janitorFirst,interval:janitorInterval,crossSeconds}),
  classroom:Object.freeze({max:classrooms,first:classroomFirst,interval:classroomInterval,exits,pace:classroomPace}),
  bell:Object.freeze({times:Object.freeze(times),students,pace:bellPace,stagger})
 });
 return Object.freeze({id,name,quip,duration:60,difficulty,future:Object.freeze({obstacleDensity:null,studentSwerves:null,speed:null,environmentTheme:null})});
}));
const ROUND_DIFFICULTY=Object.freeze(LEVELS.map(level=>level.difficulty));
const JANITOR_ROUNDS=Object.freeze(ROUND_DIFFICULTY.map(d=>d.janitor));
const CLASSROOM_ROUNDS=Object.freeze(ROUND_DIFFICULTY.map(d=>d.classroom));
const BELL_ROUNDS=Object.freeze(ROUND_DIFFICULTY.map(d=>d.bell));
const WATER_ROUNDS=Object.freeze(ROUND_DIFFICULTY.map(d=>d.water));
const WATER_SETTINGS=Object.freeze({splashSeconds:.4,formationSeconds:.4,activeSeconds:5,fadeSeconds:.75,maxPuddles:4,maxSplashes:4,halfLane:.32,halfDepth:7.5,playerHalfLane:.12,playerHalfDepth:2.5,minLeadSeconds:2.2,maxLeadSeconds:4.8,minSpillInterval:1.15,jumpClearance:.24,slipSeconds:.95});
function puddleStatus(p,time){
 const age=time-p.bornAt,cfg=WATER_SETTINGS;
 return {age,active:age>=cfg.formationSeconds&&age<cfg.formationSeconds+cfg.activeSeconds,
  opacity:age<0?0:age<cfg.formationSeconds?age/cfg.formationSeconds:Math.max(0,Math.min(1,1-(age-cfg.formationSeconds-cfg.activeSeconds)/cfg.fadeSeconds)),
  expired:age>=cfg.formationSeconds+cfg.activeSeconds+cfg.fadeSeconds};
}
function clearWater(s){s.puddles=[];s.splashes=[];s.slipTime=0;}
function spillRoll(s,o){
 // Separate deterministic stream preserves the existing obstacle RNG sequence.
 let n=((o.waterSeed||0)^Math.round(o.spawnTime*1000)^Math.imul((s.levelIndex+1)*31+(s.janitorCount||0),2654435761)^(o.direction>0?92821:68917)^Math.imul(Math.round(o.waitSeconds*1000),3266489917))>>>0;
 n=Math.imul(n^(n>>>16),2246822507)>>>0;return (n^(n>>>13))>>>0;
}
function tryJanitorSpill(s,o,events){
 const cfg=roundDifficulty(s).water,w=WATER_SETTINGS;
 if(!cfg.max||o.crossComplete||o.crossElapsed<=o.waitSeconds+.25||(o.spillCount||0)>=cfg.max)return false;
 if(o.waterEligible===undefined){const roll=spillRoll(s,o);o.waterEligible=roll/4294967296<cfg.chance;o.waterAllowance=cfg.max>1&&((Math.imul(roll^0x9e3779b9,1597334677)>>>0)/4294967296)<cfg.secondChance?2:1;}
 if(!o.waterEligible||(o.spillCount||0)>=(o.waterAllowance||cfg.max)||s.time<(o.nextSpillAt||0))return false;
 const lane=o.visualLane+o.direction*(cfg.spillReach??.28),z=o.z-3,eta=(z-s.distance-CONFIG.collisionDepth)/Math.max(1,s.normalSpeed);
 if(lane<0||lane>2||eta<(cfg.minLeadSeconds??w.minLeadSeconds)||eta>w.maxLeadSeconds)return false;
 if(s.puddles.length>=w.maxPuddles||s.splashes.length>=w.maxSplashes||s.stumble>0||s.monitorSlow>0)return false;
 if(turnPositions(s).some(t=>z>t-turnClearBefore(t,s)-w.halfDepth&&z<t+turnClearAfter(s)+w.halfDepth)||z>targetDistance(s)-120)return false;
 if(!roundDifficulty(s).coordination.advanced&&(bellReservation(s,z,w.halfDepth)||classroomReservation(s,z,w.halfDepth)))return false;
 const puddle={type:'puddle',id:'water-'+(s.waterSerial||0),z,lane,visualLane:lane,bornAt:s.time+w.splashSeconds,collidable:true,hit:false};
 if(s.puddles.some(p=>!puddleStatus(p,s.time).expired&&Math.abs(p.z-z)<w.halfDepth*2&&Math.abs(p.lane-lane)<w.halfLane*2))return false;
 if(!hasAvoidancePath(s,[puddle])){
  const wet=[...s.puddles,puddle].filter(p=>p.z>s.distance).sort((a,b)=>a.z-b.z);
  for(let i=1;i<wet.length;i++){
   const separation=wet[i].z-wet[i-1].z;
   if(separation>w.halfDepth*2&&separation/Math.max(1,s.normalSpeed)<CONFIG.jumpDuration+CONFIG.jumpLandingRecovery+.3)return false;
  }
  if(!hasAvoidancePath(s,[puddle],null,true))return false;
 }
 s.waterSerial=(s.waterSerial||0)+1;s.puddles.push(puddle);
 s.splashes.push({puddleId:puddle.id,startedAt:s.time,fromLane:o.visualLane,fromZ:o.z,toLane:lane,toZ:z,direction:o.direction});
 o.lastSpillAt=s.time;o.nextSpillAt=s.time+(cfg.spillInterval??w.minSpillInterval);o.spillCount=(o.spillCount||0)+1;
 s.waterSpills=(s.waterSpills||0)+1;events.push('water-spill');return true;
}
function puddleJumpHeight(previousJump,currentJump,dt,fraction){
 const remaining=previousJump>0?Math.max(0,previousJump-dt*fraction):currentJump>0?Math.max(0,CONFIG.jumpDuration-dt*fraction):0;
 return remaining>0?Math.sin(Math.PI*(1-remaining/CONFIG.jumpDuration)):0;
}
function updateWater(s,dt,previousDistance,previousLane,previousJump,events){
 const w=WATER_SETTINGS;
 s.splashes=s.splashes.filter(p=>s.time-p.startedAt<w.splashSeconds);
 s.puddles=s.puddles.filter(p=>!puddleStatus(p,s.time).expired&&p.z>s.distance-CONFIG.collisionDepth-w.halfDepth-w.playerHalfDepth);
 const startZ=previousDistance+CONFIG.collisionDepth,endZ=s.distance+CONFIG.collisionDepth,travel=endZ-startZ;
 for(const p of s.puddles){
  if(p.hit)continue;
  const radiusZ=w.halfDepth+w.playerHalfDepth,radiusLane=w.halfLane+w.playerHalfLane;
  const enter=travel>0?Math.max(0,(p.z-radiusZ-startZ)/travel):0,exit=travel>0?Math.min(1,(p.z+radiusZ-startZ)/travel):1;
  if(enter>exit||Math.abs(p.z-startZ)>radiusZ&&Math.abs(p.z-endZ)>radiusZ&&(p.z<startZ||p.z>endZ))continue;
  for(const fraction of [enter,(enter+exit)/2,exit]){
   const time=s.time-dt+dt*fraction;if(!puddleStatus(p,time).active)continue;
   const lane=previousLane+(s.visualLane-previousLane)*fraction,z=startZ+travel*fraction;
   if(((lane-p.lane)/radiusLane)**2+((z-p.z)/radiusZ)**2>=1)continue;
   if(puddleJumpHeight(previousJump,s.jump,dt,fraction)>=w.jumpClearance)continue;
   if(impact(s,'obstacle')){
    p.hit=true;s.slipTime=w.slipSeconds;s.slipDirection=p.lane>s.visualLane?-1:1;s.waterSlips=(s.waterSlips||0)+1;
    events.push('hit','slip');
   }
   break;
  }
 }
}
const JANITOR_SETTINGS=Object.freeze({leadSeconds:7.5,clearSeconds:1.8,retrySeconds:.5,startLane:-.65,endLane:3.2,bodyOffsetRatio:.17,bucketHalfLanes:.18,collisionHalfLanes:.34,worldHeight:1.42});
function janitorReservation(s,z){return s.obstacles.some(o=>o.type==='janitor'&&Math.abs(z-o.z)<o.clearRadius);}
function trySpawnJanitor(s,random){const cfg=roundDifficulty(s).janitor;if(!cfg.max||(s.janitorCount||0)>=cfg.max||s.time<(s.nextJanitorAt??cfg.first))return false;
 const lead=JANITOR_SETTINGS.leadSeconds;if(s.levelTime+lead>=roundDuration(s)-LEVEL_SETTINGS.finalApproachSeconds)return false;
 s.nextJanitorAt=s.time+JANITOR_SETTINGS.retrySeconds;
 // Plan ahead of the normal spawn horizon. Existing actors must remain outside the reserved longitudinal gap, even after drift.
 const z=s.distance+paceDistance(s.time+lead,s)-paceDistance(s.time,s),maxSpeed=speedAt(s.time+lead,s),life=lead+cfg.crossSeconds,clearRadius=maxSpeed*roundDifficulty(s).coordination.janitorClearSeconds+CONFIG.monitorSpeed*(roundDifficulty(s).coordination.advanced?cfg.crossSeconds+2:life);
 if((!roundDifficulty(s).coordination.advanced&&(bellReservation(s,z,clearRadius)||classroomReservation(s,z,clearRadius)||s.obstacles.some(o=>!o.passed&&Math.abs(o.z-z)<clearRadius+Math.abs(o.velocity||0)*life)))||turnPositions(s).some(t=>z>t-turnClearBefore(t,s)-clearRadius&&z<t+turnClearAfter(s)+clearRadius)||z+clearRadius>targetDistance(s)-120)return false;
 const directionRoll=random(),targetRoll=random(),direction=directionRoll<.5?1:-1,target=direction>0?(targetRoll<.5?1:2):(targetRoll<.5?1:0),from=direction>0?JANITOR_SETTINGS.startLane:2-JANITOR_SETTINGS.startLane,to=direction>0?JANITOR_SETTINGS.endLane:2-JANITOR_SETTINGS.endLane,laneSpeed=Math.abs(to-from)/cfg.crossSeconds,waitSeconds=lead-Math.abs(target-from)/laneSpeed;
 const o={type:'janitor',waterSeed:((directionRoll*4294967296)^(targetRoll*4294967296))>>>0,z,lane:from,visualLane:from,direction,from,to,laneSpeed,waitSeconds,crossSeconds:cfg.crossSeconds,spawnTime:s.time,crossElapsed:0,walkPhase:0,clearRadius,collidable:true,passed:false,hit:false};if(!hasAvoidancePath(s,[o]))return false;s.obstacles.push(o);s.janitorCount=(s.janitorCount||0)+1;s.nextJanitorAt=s.time+cfg.interval;return true;
}
function updateJanitor(s,o){o.crossElapsed=Math.max(0,s.time-o.spawnTime);const walking=Math.max(0,Math.min(o.crossSeconds,o.crossElapsed-o.waitSeconds)),travel=walking*o.laneSpeed;o.visualLane=o.from+o.direction*travel;o.lane=o.visualLane;o.walkPhase=travel/.45*Math.PI*2;o.crossComplete=walking>=o.crossSeconds-1e-8;}
const CLASSROOM_GEOMETRY=Object.freeze({offset:9,width:12,bottom:.2,top:3.05,wallLaneHalf:1.85,insidePadding:.45,stagingOffset:1.45});
const CLASSROOM_SETTINGS=Object.freeze({leadSeconds:7.8,clearSeconds:1,retrySeconds:.5,lateralLanesPerSecond:.7,thresholdSeconds:1.25,doorOpenSeconds:.4,exitHoldSeconds:.45,exitDelaySeconds:3.2,finishLeadSeconds:.55,doorHoldSeconds:.6,maxActive:1});
function classroomDoor(s,segmentIndex,section,side){const seg=routeFor(s)[segmentIndex];if(!seg||section<0||![-1,1].includes(side))return null;const g=CLASSROOM_GEOMETRY,start=section*CONFIG.sectionLength+g.offset,end=start+g.width,length=seg.end-seg.start,next=ROUTE_DIRECTIONS[seg.index],inner=next==='left'?-1:1,wallEnd=next?length+(side===inner?-1:1)*g.wallLaneHalf*LANE_METRES:length;
 if(start<(seg.index?g.wallLaneHalf*LANE_METRES:0)||end>wallEnd)return null;const z=seg.start+(start+end)/2;if(seg.index===3&&side>0&&Math.abs(z-(targetDistance(s)+CONFIG.collisionDepth))<g.width/2+8)return null;return {id:segmentIndex+':'+section+':'+side,segmentIndex,section,side,z,localZ:(start+end)/2,wallLane:1+side*g.wallLaneHalf,insideLane:1+side*(g.wallLaneHalf+g.insidePadding),stagingLane:1+side*g.stagingOffset};}
function classroomReservation(s,z,padding=0){return s.obstacles.some(o=>o.classroomEvent&&Math.abs(z-o.door.z)<o.clearRadius+padding);}
function trySpawnClassroomStudent(s,random){const cfg=roundDifficulty(s).classroom,settings=CLASSROOM_SETTINGS;if(!cfg.max||(s.classroomCount||0)>=cfg.max||s.time<(s.nextClassroomAt??cfg.first))return false;if(s.levelTime+settings.leadSeconds>=roundDuration(s)-LEVEL_SETTINGS.finalApproachSeconds)return false;s.nextClassroomAt=s.time+settings.retrySeconds;if(s.obstacles.filter(o=>o.classroomEvent&&!o.bellId&&!o.passed&&!o.classroomComplete).length>=roundDifficulty(s).coordination.classroomConcurrent)return false;
 const lead=settings.leadSeconds,wanted=s.distance+paceDistance(s.time+lead,s)-paceDistance(s.time,s),seg=routeFor(s).find(seg=>wanted>=seg.start&&wanted<seg.end);if(!seg)return false;const section=Math.round((wanted-seg.start-CLASSROOM_GEOMETRY.offset-CLASSROOM_GEOMETRY.width/2)/CONFIG.sectionLength),speed=speedAt(s.time+lead,s),life=lead+4,clearRadius=speed*(roundDifficulty(s).coordination.advanced?.55:settings.clearSeconds)+CONFIG.monitorSpeed*(roundDifficulty(s).coordination.advanced?life*.5:life);
 const candidates=[];for(const side of [-1,1])for(const n of [section,section-1,section+1]){const door=classroomDoor(s,seg.index,n,side);if(!door||(!roundDifficulty(s).coordination.advanced&&bellReservation(s,door.z,clearRadius))||door.z+clearRadius>targetDistance(s)-120||turnPositions(s).some(t=>door.z>t-turnClearBefore(t,s)-clearRadius&&door.z<t+turnClearAfter(s)+clearRadius)||(!roundDifficulty(s).coordination.advanced&&s.obstacles.some(o=>o.type==='janitor'?Math.abs(o.z-door.z)<o.clearRadius+clearRadius:!o.passed&&Math.abs(o.z-door.z)<clearRadius+Math.abs(o.velocity||0)*life)))continue;candidates.push(door);break;}if(!candidates.length)return false;
 const door=candidates[Math.floor(random()*candidates.length)],kind=cfg.exits&&(s.classroomCount||0)%2===1?'exit':'enter',hallLane=random()<.5?1:door.side<0?2:0,approachSeconds=Math.max(2,Math.abs(hallLane-door.stagingLane)/settings.lateralLanesPerSecond)/cfg.pace,hallSeconds=Math.max(1,lead-approachSeconds-settings.thresholdSeconds-settings.finishLeadSeconds),spawnZ=kind==='enter'?door.z-8-CONFIG.studentSpeed*cfg.pace*hallSeconds:door.z;
 const o={type:'student',classroomEvent:true,classroomKind:kind,classroomState:kind==='enter'?'hallway':'exitingClassroom',door,spawnTime:s.time,hallLane,hallSeconds,approachSeconds,spawnZ,z:spawnZ,lane:kind==='enter'?hallLane:door.insideLane,visualLane:kind==='enter'?hallLane:door.insideLane,velocity:(kind==='enter'?1:-1)*CONFIG.studentSpeed*cfg.pace,classroomPace:cfg.pace,walkPhase:0,clearRadius,moveEligible:false,moveTarget:null,collidable:kind==='enter',passed:false,hit:false};if(!hasAvoidancePath(s,[o]))return false;s.obstacles.push(o);s.classroomCount=(s.classroomCount||0)+1;s.nextClassroomAt=s.time+cfg.interval;return true;
}
function updateClassroomStudent(s,o,dt){const a=Math.max(0,s.time-o.spawnTime),cfg=CLASSROOM_SETTINGS,threshold=o.classroomThresholdSeconds??cfg.thresholdSeconds,exitDelay=o.classroomExitDelaySeconds??cfg.exitDelaySeconds,walkSpeed=CONFIG.studentSpeed*(o.classroomPace||1),d=o.door,oldZ=o.z,oldLane=o.visualLane,smooth=p=>{p=Math.max(0,Math.min(1,p));return p*p*(3-2*p);};
 if(o.classroomKind==='enter'){if(a<o.hallSeconds){o.classroomState='hallway';o.visualLane=o.hallLane;o.z=o.spawnZ+walkSpeed*a;}else if(a<o.hallSeconds+o.approachSeconds){o.classroomState='approachingClassroom';const p=smooth((a-o.hallSeconds)/o.approachSeconds);o.visualLane=o.hallLane+(d.stagingLane-o.hallLane)*p;o.z=d.z-8+8*p;}else{o.classroomState='enteringClassroom';const p=smooth((a-o.hallSeconds-o.approachSeconds)/threshold);o.visualLane=d.stagingLane+(d.insideLane-d.stagingLane)*p;o.z=d.z;if(p>=1){o.classroomComplete=true;o.removeAt=o.spawnTime+o.hallSeconds+o.approachSeconds+threshold+cfg.doorHoldSeconds;}}}
 else{const t=a-exitDelay-cfg.exitHoldSeconds;if(t<threshold){o.classroomState='exitingClassroom';const p=smooth(t/threshold);o.visualLane=d.insideLane+(d.stagingLane-d.insideLane)*p;o.z=d.z;}else if(t<threshold+o.approachSeconds){o.classroomState='exitingClassroom';const p=smooth((t-threshold)/o.approachSeconds);o.visualLane=d.stagingLane+(o.hallLane-d.stagingLane)*p;o.z=d.z-8*p;}else{o.classroomState='hallway';o.visualLane=o.hallLane;o.z=d.z-8-walkSpeed*(t-threshold-o.approachSeconds);}}
 o.lane=o.visualLane;o.velocity=dt>0?(o.z-oldZ)/dt:0;advanceStudentAnimation(o,dt,oldZ,oldLane);o.collidable=!o.classroomComplete&&o.visualLane>=CONFIG.playableMin&&o.visualLane<=CONFIG.playableMax;
}
function activeClassroomDoors(s){const doors=bellDoorPoses(s);for(const o of s.obstacles){if((o.bellId&&s.bellEvent&&o.bellId===s.bellEvent.id)||!o.classroomEvent||(o.classroomKind==='exit'&&o.classroomState==='hallway'))continue;const age=s.time-o.spawnTime,start=o.classroomKind==='enter'?o.hallSeconds-.35:CLASSROOM_SETTINGS.exitDelaySeconds,p=Math.max(0,Math.min(1,(age-start)/CLASSROOM_SETTINGS.doorOpenSeconds));if(p>0)doors.push({...o.door,open:p*p*(3-2*p)});}return doors;}
const BELL_SETTINGS=Object.freeze({ringSeconds:.6,openSeconds:.8,closeSeconds:.45,leadSeconds:4.1,clearSeconds:.75,retrySeconds:.25,recoveryGraceSeconds:.35,minSpawnLeadSeconds:2.6,cornerLeadSeconds:5.5,exitDelaySeconds:1.25,lifeSeconds:12});
function bellDue(s){const cfg=roundDifficulty(s).bell;return cfg.times[s.bellScheduleIndex||0]!==undefined&&s.levelTime>=cfg.times[s.bellScheduleIndex||0];}
function bellReservation(s,z,padding=0){const e=s.bellEvent;return !!e&&z>e.reserveStart-padding&&z<e.reserveEnd+padding;}
function planBell(s,cfg){const first=BELL_SETTINGS.ringSeconds+BELL_SETTINGS.openSeconds,plans=[];for(const side of [-1,1]){const waves=[];for(let i=0;i<cfg.students;i++){const birth=first+i*cfg.stagger,offset=birth+BELL_SETTINGS.leadSeconds,wanted=s.distance+paceDistance(s.time+offset,s)-paceDistance(s.time,s),seg=routeFor(s).find(seg=>wanted>=seg.start&&wanted<seg.end);if(!seg)break;const n=Math.round((wanted-seg.start-CLASSROOM_GEOMETRY.offset-CLASSROOM_GEOMETRY.width/2)/CONFIG.sectionLength),radius=speedAt(s.time+offset,s)*roundDifficulty(s).coordination.bellClearSeconds,door=[n,n+1,n-1].map(section=>classroomDoor(s,seg.index,section,side)).find(d=>d&&!waves.some(w=>w.door.id===d.id)&&d.z+radius+CONFIG.monitorSpeed*BELL_SETTINGS.lifeSeconds<targetDistance(s)-120&&!turnPositions(s).some(t=>d.z>t-turnClearBefore(t,s)-radius-32&&d.z<t+turnClearAfter(s)+radius+32)&&(roundDifficulty(s).coordination.advanced||(!classroomReservation(s,d.z,radius+32)&&!s.obstacles.some(o=>o.type==='janitor'?Math.abs(o.z-d.z)<o.clearRadius+radius+32:!o.passed&&Math.abs(o.z-d.z)<radius+32+Math.max(0,Math.sign(d.z-o.z)*(o.velocity||0))*BELL_SETTINGS.lifeSeconds))));if(!door)break;waves.push({door,birth,openAt:birth-BELL_SETTINGS.openSeconds,radius,kind:i%2===0?'exit':'enter',hallLane:i===0?(side<0?0:2):1});}
 if(waves.length===cfg.students){const radius=Math.max(...waves.map(w=>w.radius));plans.push({waves,safeLane:side<0?2:0,reserveStart:Math.min(...waves.map(w=>w.door.z))-radius-32-CONFIG.studentSpeed*BELL_SETTINGS.lifeSeconds,reserveEnd:Math.max(...waves.map(w=>w.door.z))+radius+32+CONFIG.monitorSpeed*BELL_SETTINGS.lifeSeconds});}}return roundDifficulty(s).coordination.advanced?plans.filter(plan=>{const event={...plan,id:'planning',pace:cfg.pace};return hasAvoidancePath(s,plan.waves.map(w=>makeBellStudent(event,w,s.time+w.birth)));}):plans;}
function clearBellEvent(s,completed=false){const e=s.bellEvent;if(!e){delete s.nextBellAttempt;return;}if(completed){s.bellCompleted=(s.bellCompleted||0)+1;s.lastBell={id:e.id,startedAt:e.startedAt,endedAt:s.time,spawned:e.spawned,skipped:e.skipped,safeLane:e.safeLane};}else s.obstacles=s.obstacles.filter(o=>!o.bellId);delete s.bellEvent;delete s.nextBellAttempt;}
function makeBellStudent(e,w,spawnTime){
 const cfg=CLASSROOM_SETTINGS,pace=e.pace,threshold=cfg.thresholdSeconds/pace,approach=Math.max(2,Math.abs(w.hallLane-w.door.stagingLane)/cfg.lateralLanesPerSecond)/pace,hall=Math.max(.8,BELL_SETTINGS.leadSeconds-approach-threshold-cfg.finishLeadSeconds),velocity=CONFIG.studentSpeed*pace,z=w.kind==='enter'?w.door.z-8-velocity*hall:w.door.z;
 return {type:'student',classroomEvent:true,bellId:e.id,bellKey:e.id+'@'+w.door.id,classroomKind:w.kind,classroomState:w.kind==='enter'?'hallway':'exitingClassroom',door:w.door,spawnTime,hallLane:w.hallLane,hallSeconds:hall,approachSeconds:approach,spawnZ:z,z,lane:w.kind==='enter'?w.hallLane:w.door.insideLane,visualLane:w.kind==='enter'?w.hallLane:w.door.insideLane,velocity:w.kind==='enter'?velocity:-velocity,walkPhase:0,clearRadius:w.radius+32,moveEligible:false,moveTarget:null,collidable:w.kind==='enter',passed:false,hit:false,classroomPace:pace,classroomThresholdSeconds:threshold,classroomExitDelaySeconds:BELL_SETTINGS.exitDelaySeconds};
}
function spawnBellStudent(s,e,w){
 const student=makeBellStudent(e,w,s.time);
 if(student.z-s.distance<s.normalSpeed*BELL_SETTINGS.minSpawnLeadSeconds||!hasAvoidancePath(s,[student]))return false;
 s.obstacles.push(student);return true;
}
function updateBellEvent(s,dt,random,events){if(s.mode!=='playing')return;const cfg=roundDifficulty(s).bell;if(!cfg.times.length)return;if(!s.bellEvent&&bellDue(s)){const index=s.bellScheduleIndex||0,latest=roundDuration(s)-LEVEL_SETTINGS.finalApproachSeconds-BELL_SETTINGS.leadSeconds-BELL_SETTINGS.ringSeconds-BELL_SETTINGS.openSeconds-(cfg.students-1)*cfg.stagger-1;if(s.levelTime>latest){s.bellScheduleIndex=index+1;s.bellSkipped=(s.bellSkipped||0)+1;return;}if(s.time<(s.nextBellAttempt||0))return;s.nextBellAttempt=s.time+BELL_SETTINGS.retrySeconds;const upcoming=turnPositions(s)[s.turnIndex];if(upcoming!==undefined&&upcoming-s.distance<s.normalSpeed*BELL_SETTINGS.cornerLeadSeconds)return;if(s.stumble>0||s.monitorSlow>0||s.collisionCooldown>0||s.turnFlash>0)return;const plans=planBell(s,cfg);if(!plans.length)return;const plan=plans[Math.floor(random()*plans.length)];s.bellScheduleIndex=index+1;s.bellEvent={...plan,id:'bell-'+s.levelIndex+'-'+index,phase:'ringing',startedAt:s.time,pace:cfg.pace,nextWave:0,nextSpawnAt:s.time+BELL_SETTINGS.ringSeconds+BELL_SETTINGS.openSeconds,spawned:0,skipped:0};events.push('school-bell');}
 const e=s.bellEvent;if(!e)return;const age=s.time-e.startedAt;if(age<BELL_SETTINGS.ringSeconds){e.phase='ringing';return;}if(age<BELL_SETTINGS.ringSeconds+BELL_SETTINGS.openSeconds){e.phase='opening';return;}if(e.nextWave<e.waves.length){e.phase='rush';const w=e.waves[e.nextWave];if(s.stumble>0||s.monitorSlow>0||s.collisionCooldown>0){e.releaseAfter=s.time+BELL_SETTINGS.recoveryGraceSeconds;return;}if(s.time>=e.nextSpawnAt&&s.time>=(e.releaseAfter||0)&&age>=w.birth){if(spawnBellStudent(s,e,w)){e.spawned++;events.push('bell-student');}else e.skipped++;e.nextWave++;e.nextSpawnAt=s.time+cfg.stagger;}return;}
 const needsDoor=s.obstacles.some(o=>o.bellId===e.id&&(o.classroomKind==='enter'?(!o.classroomComplete||s.time<o.removeAt):o.classroomState!=='hallway'));if(needsDoor){e.phase='draining';return;}if(e.closingAt===undefined)e.closingAt=s.time;e.phase='closing';if(s.time-e.closingAt>=BELL_SETTINGS.closeSeconds){clearBellEvent(s,true);events.push('bell-ended');}}
function bellDoorPoses(s){const e=s.bellEvent;if(!e)return [];const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);},close=e.closingAt===undefined?1:1-smooth((s.time-e.closingAt)/BELL_SETTINGS.closeSeconds);return e.waves.map(w=>({...w.door,open:smooth((s.time-e.startedAt-w.openAt)/BELL_SETTINGS.openSeconds)*close})).filter(d=>d.open>0);}
const LEVEL_SETTINGS=Object.freeze({announcementSeconds:3.2,finalApproachSeconds:5,cleanRunReserveSeconds:15});
function roundDifficulty(s){return LEVELS[s?.levelIndex||0].difficulty;}
function strideAt(s){return CONFIG.strideMin+(CONFIG.strideMax-CONFIG.strideMin)*((s.normalSpeed/roundDifficulty(s).speed)-CONFIG.minSpeed)/(CONFIG.maxSpeed-CONFIG.minSpeed);}
function encounterSeconds(s,base,edge=false){const cfg=roundDifficulty(s),d=cfg.density;return d===1?base:Math.max(edge?cfg.coordination.edgeSeconds:cfg.coordination.minimumRowSeconds,base/d);}
function totalLevelDuration(){return LEVELS.reduce((sum,level)=>sum+level.duration,0);}
// Exact integral of the existing smoothstep pace profile, preserving its speed tuning.
function paceDistance(time,state){const multiplier=state?roundDifficulty(state).speed:1;let total=0,previous=0;const end=Math.max(0,time),knots=CONFIG.paceKnots;for(let i=1;i<knots.length;i++){const a=knots[i-1],b=knots[i],duration=b[0]-a[0],used=Math.max(0,Math.min(duration,end-a[0])),p=used/duration;total+=a[1]*used+(b[1]-a[1])*duration*(p*p*p-.5*p*p*p*p);previous=b[0];if(end<=b[0])return total*multiplier;}return (total+Math.max(0,end-previous)*CONFIG.maxSpeed)*multiplier;}
CONFIG.targetRunSeconds=LEVELS[0].duration;CONFIG.distance=paceDistance(CONFIG.targetRunSeconds);CONFIG.pressureRate=(100-CONFIG.pressureStart)/(CONFIG.targetRunSeconds+LEVEL_SETTINGS.cleanRunReserveSeconds);
function firstBathroomDistance(state){return Number.isFinite(state?.firstBathroomDistance)?state.firstBathroomDistance:CONFIG.distance;}
function targetDistance(state){return firstBathroomDistance(state);}
function routeTurns(){return ROUTE_TURNS;}
// Rebase only unseen future architecture, then lock before its render horizon.
function updateBathroomPlan(s){if(s.destinationLocked)return;const remaining=Math.max(0,roundDuration(s)-s.levelTime),future=Math.max(0,paceDistance(s.time+remaining,s)-paceDistance(s.time,s));s.firstBathroomDistance=Math.round((s.distance+future)*1e6)/1e6;if(remaining<=LEVEL_SETTINGS.finalApproachSeconds+1e-8)s.destinationLocked=true;}
function turnPositions(){return CONFIG.turnPositions;}
function turnDirections(){return CONFIG.turnDirections;}
function createState(){return {mode:'ready',puddles:[],splashes:[],slipTime:0,roundsCompleted:0,campaignActiveTime:0,roundScoreBase:0,firstBathroomDistance:CONFIG.distance,destinationLocked:false,levelTime:0,levelIndex:0,levelTransitions:0,levelAnnouncement:LEVEL_SETTINGS.announcementSeconds,levelsComplete:false,character:'wally',distance:0,pressure:CONFIG.pressureStart,speed:CONFIG.minSpeed,normalSpeed:CONFIG.minSpeed,score:0,lane:1,visualLane:1,jump:0,jumpRest:0,duck:0,jumpGrace:0,duckGrace:0,queued:null,stumble:0,stumbleKind:null,stumbleDuration:CONFIG.stumbleDuration,stumbleFactor:CONFIG.collisionSpeedFactor,collisionCooldown:0,time:0,chase:false,gap:CONFIG.chaseStartGap,chaseVisualGap:CONFIG.chaseStartGap,monitorLane:1,chaseLaneTarget:1,chaseLaneDelay:0,chaseIntro:0,chaseClock:0,chaseWarning:0,chaseWarnArmed:true,catchTimer:0,monitorSlow:0,monitorCooldown:0,monitorContacts:0,lastMonitorContact:null,obstacles:[],nextSpawn:8,rows:0,lastHazardLane:-1,lastSafeLane:-1,rowsSinceCenter:0,centerHazards:0,playerPhase:0,playerGait:'walk',heading:0,cameraFromHeading:0,turnBuffer:null,turnWait:0,turnEntry:null,turnIndex:0,turnChoice:null,turnFeedback:null,turnFeedbackTime:0,pedestrians:[],nextPedestrian:0,turnFlash:0,turnResult:null,result:null};}
function jumpTargetInLane(s,o){
 if(o.type!=='janitor')return o.lane===s.lane;
 const eta=Math.max(0,(o.z-s.distance-CONFIG.collisionDepth)/Math.max(1,s.speed));
 const pose={...o};
 updateJanitor({time:s.time+eta},pose);
 return Math.abs(pose.visualLane-s.lane)<JANITOR_SETTINGS.collisionHalfLanes;
}
function action(s,a){if(s.mode!=='playing')return;
 if(a==='left'||a==='right'){s.lane=Math.max(0,Math.min(2,s.lane+(a==='right'?1:-1)));return;}
 if(a!=='jump'||s.jumpRest>0)return;
 const wetTargets=(s.puddles||[]).filter(p=>!p.hit&&Math.abs(p.lane-s.visualLane)<WATER_SETTINGS.halfLane+WATER_SETTINGS.playerHalfLane&&puddleStatus(p,s.time+Math.max(0,(p.z-s.distance)/Math.max(1,s.speed))).active).map(p=>({...p,lane:s.lane,z:p.z-WATER_SETTINGS.halfDepth-WATER_SETTINGS.playerHalfDepth}));
 const target=[...s.obstacles,...wetTargets].filter(o=>!o.passed&&o.type!=='student'&&o.type!=='monitor'&&jumpTargetInLane(s,o)&&o.z-s.distance>CONFIG.collisionDepth).sort((x,y)=>x.z-y.z)[0];
 const eta=target?(target.z-s.distance-CONFIG.collisionDepth)/s.speed:Infinity;
 if(eta<=CONFIG.actionBuffer&&eta>(a==='jump'?.8:1)){s.queued={action:a,z:target.z,lane:s.lane};return;}
 if(a==='jump'&&!s.jump){s.duck=0;s.jump=CONFIG.jumpDuration;s.jumpGrace=CONFIG.actionGrace;s.queued=null;}
 if(a==='duck'&&!s.duck){s.jump=0;s.duck=CONFIG.duckDuration;s.duckGrace=CONFIG.actionGrace;s.queued=null;}
}
// Predict contact along the same forward pace and moving footprints used by collision detection.
function collisionHalfLanes(o){
 return o.type==='puddle'?WATER_SETTINGS.halfLane+WATER_SETTINGS.playerHalfLane:o.type==='janitor'?JANITOR_SETTINGS.collisionHalfLanes:o.type==='student'?.40:.48;
}
function hazardAt(s,o,after){
 const time=s.time+after;
 if(o.bellKey&&time<o.spawnTime)return {...o,collidable:false};
 if(o.type==='puddle')return {...o,collidable:puddleStatus(o,time).active};
 if(o.type==='janitor'||o.classroomEvent){
  const pose={...o};
  if(o.type==='janitor')updateJanitor({time},pose);
  else updateClassroomStudent({time},pose,after||CONFIG.simulationStep);
  return pose;
 }
 if(o.studentPlan)return {...studentPlanPose(o,time),collidable:o.collidable};
 let lane=o.visualLane??o.lane;
 if(o.moveTarget!=null){
  const p=Math.min(1,(o.moveProgress||0)+Math.max(0,after-(o.moveCue||0))/(o.swerveDuration||CONFIG.monitorLaneDuration));
  lane=o.moveFrom+(o.moveTarget-o.moveFrom)*p*p*(3-2*p);
 }
 let z=o.z+(o.velocity||0)*after;
 if(o.velocity)for(const turn of turnPositions(s)){
  const near=turn-turnClearBefore(turn,s),far=turn+turnClearAfter(s);
  if(o.z<=near&&z>near)z=near;
  if(o.z>=far&&z<far)z=far;
 }
 return {z,visualLane:lane,collidable:o.collidable};
}
function futureBellStudents(s,added=[]){
 const e=s.bellEvent;
 if(!e||!roundDifficulty(s).coordination.advanced)return [];
 const keys=new Set([...s.obstacles,...added].map(o=>o.bellKey));
 return e.waves.slice(e.nextWave).map((w,index)=>makeBellStudent(e,w,Math.max(e.startedAt+w.birth,e.nextSpawnAt+index*roundDifficulty(s).bell.stagger))).filter(o=>!keys.has(o.bellKey));
}
function forecastProgress(s,time,jumps){
 let distance=paceDistance(s.time+time,s)-paceDistance(s.time,s);
 const duration=CONFIG.jumpDuration,primitive=t=>t/2-duration*Math.sin(2*Math.PI*t/duration)/(4*Math.PI);
 for(const jump of jumps){
  const from=Math.max(0,jump),to=Math.min(time,jump+duration);
  if(to>from)distance-=speedAt(s.time+(from+to)/2,s)*CONFIG.jumpSpeedPenalty*(primitive(to-jump)-primitive(from-jump));
 }
 return s.distance+distance;
}
function routeContact(s,event,jumps,horizon=12){
 const isCorner=event.corner!==undefined,o=event.object;
 const gap=time=>(isCorner?event.corner:hazardAt(s,o,time).z)-forecastProgress(s,time,jumps)-CONFIG.collisionDepth;
 if(gap(horizon)>0||gap(0)<-12)return null;
 let low=0,high=horizon;
 for(let i=0;i<11;i++){const middle=(low+high)/2;if(gap(middle)>0)low=middle;else high=middle;}
 const water=o?.type==='puddle',window=water?(WATER_SETTINGS.halfDepth+WATER_SETTINGS.playerHalfDepth)/Math.max(1,speedAt(s.time+high,s))+.035:.055;
 const start=Math.max(0,high-window),end=high+window;
 let mask=0;
 if(isCorner)mask=event.direction==='left'?1:4;
 else for(const t of [start,high,end]){
  const pose=hazardAt(s,o,t),width=collisionHalfLanes(o);
  if(pose.collidable===false||pose.visualLane<CONFIG.playableMin||pose.visualLane>CONFIG.playableMax)continue;
  for(let lane=0;lane<3;lane++)if(Math.abs(lane-pose.visualLane)<width+.025)mask|=1<<lane;
 }
 return {start,end,at:high,mask,jumpable:!isCorner&&o.type!=='student'&&o.type!=='monitor'};
}
function evaluateAvoidance(s,added=[],replaced=null){
 const objects=[...s.obstacles,...(s.puddles||[]),...added,...futureBellStudents(s,added)];
 const events=[];
 for(const object of objects){
  if(object===replaced||object.passed||object.z<s.distance-14)continue;
  const event={object},contact=routeContact(s,event,[]);
  if(contact)events.push({...event,nominal:contact.at});
 }
 for(let i=s.turnIndex;i<turnPositions(s).length;i++){
  const event={corner:turnPositions(s)[i],direction:turnDirections(s)[i]},contact=routeContact(s,event,[]);
  if(contact)events.push({...event,nominal:contact.at});
 }
 events.sort((a,b)=>a.nominal-b.nominal);
 const currentJump=s.jump>0?s.jump-CONFIG.jumpDuration:null;
 let paths=[{lane:s.lane,last:0,jumps:currentJump===null?[]:[currentJump],ready:s.jump>0?s.jump+CONFIG.jumpLandingRecovery:s.jumpRest||0,cost:0,route:[]}];
 for(const event of events){
  const next=new Map(),contactCache=new Map();
  const contactFor=jumps=>{const key=jumps.join(',');if(!contactCache.has(key))contactCache.set(key,routeContact(s,event,jumps));return contactCache.get(key);};
  const keep=path=>{
   const loss=s.distance+paceDistance(s.time+12,s)-paceDistance(s.time,s)-forecastProgress(s,12,path.jumps);
   const key=[path.lane,Math.round(path.ready*6),Math.round(loss/6)].join('/');
   if(!next.has(key)||next.get(key).cost>path.cost)next.set(key,path);
  };
  for(const path of paths){
   const contact=contactFor(path.jumps);if(!contact){keep(path);continue;}
   for(let lane=0;lane<3;lane++){
    const movement=Math.abs(lane-path.lane)*CONFIG.laneDuration;
    if(movement>0&&movement+roundDifficulty(s).coordination.reactionSeconds>contact.start-path.last)continue;
    const base={...path,lane,last:Math.max(path.last,contact.end),cost:path.cost+Math.abs(lane-path.lane),route:[...path.route,{time:contact.at,lane}]};
    const blocked=(contact.mask&(1<<lane))!==0;
    const airborne=path.jumps.some(start=>start+.14<=contact.start&&start+CONFIG.jumpDuration-.14>=contact.end);
    if(!blocked||(contact.jumpable&&airborne))keep(base);
    if(!contact.jumpable||airborne)continue;
    const earliest=contact.end-CONFIG.jumpDuration+.16,latest=contact.start-.16;
    for(const start of [latest,(earliest+latest)/2,earliest]){
     if(start<Math.max(path.ready,path.last+.035,roundDifficulty(s).coordination.reactionSeconds)||start>latest)continue;
     const jumps=[...path.jumps,start],shifted=contactFor(jumps);
     if(!shifted||start+.14>shifted.start||start+CONFIG.jumpDuration-.14<shifted.end)continue;
     if(!shifted.jumpable&&(shifted.mask&(1<<lane)))continue;
     keep({...base,last:Math.max(path.last,shifted.end),jumps,ready:start+CONFIG.jumpDuration+CONFIG.jumpLandingRecovery,cost:base.cost+1,route:[...path.route,{time:shifted.at,lane,jumpAt:start}]});
    }
   }
  }
  paths=[...next.values()].sort((a,b)=>a.cost-b.cost).slice(0,36);
  if(!paths.length)return {reachable:false,contacts:events.length,route:[],jumps:0};
 }
 const best=paths.sort((a,b)=>a.cost-b.cost)[0];
 return {reachable:true,contacts:events.length,route:best.route,jumps:best.jumps.filter(t=>t>=0).length};
}
function hasAvoidancePath(s,added=[],replaced=null,waterJump=false){
 if(roundDifficulty(s).coordination.advanced)return evaluateAvoidance(s,added,replaced).reachable;
 const lanes=[0,1,2],contacts=[],start=paceDistance(s.time,s),horizon=12;
 const distanceAt=t=>s.distance+paceDistance(s.time+t,s)-start;
 const badLane=(pose,lane,width)=>pose.collidable!==false&&pose.visualLane>=CONFIG.playableMin&&pose.visualLane<=CONFIG.playableMax&&Math.abs(lane-pose.visualLane)<width;
 for(const o of [...s.obstacles,...(s.puddles||[]),...added]){
  if(o===replaced||o.passed||o.z<s.distance-CONFIG.collisionDepth||(waterJump&&o.type==='puddle'))continue;
  const gap=t=>hazardAt(s,o,t).z-distanceAt(t)-CONFIG.collisionDepth;
  if(gap(horizon)>0)continue;
  let low=0,high=horizon;
  for(let i=0;i<11;i++){const mid=(low+high)/2;if(gap(mid)>0)low=mid;else high=mid;}
  const window=DIFFICULTY_LIMITS.contactWindowSeconds;
  const poses=[Math.max(0,high-window),high,high+window].map(t=>hazardAt(s,o,t));
  const width=collisionHalfLanes(o);
  const mask=lanes.reduce((m,l)=>poses.some(p=>badLane(p,l,width))?m|(1<<l):m,0);
  if(mask)contacts.push({at:high,mask});
 }
 const turns=turnPositions(s);
 for(let i=s.turnIndex;i<turns.length;i++){
  const d=turns[i]-s.distance;
  if(d<=0||d>paceDistance(s.time+horizon,s)-start)continue;
  let lo=0,hi=horizon;
  for(let n=0;n<11;n++){const mid=(lo+hi)/2;if(paceDistance(s.time+mid,s)-start<d)lo=mid;else hi=mid;}
  contacts.push({at:hi,mask:turnDirections(s)[i]==='left'?1:4});
 }
 contacts.sort((a,b)=>a.at-b.at);
 // Encounters are proposed ahead of the player. Start from any legal lane so a
 // prior player mistake does not cancel a later, independently avoidable wave.
 let reachable=7,last=0;
 for(const {at,mask} of contacts){
  const movement=Math.max(0,Math.floor((at-last-DIFFICULTY_LIMITS.routeReactionSeconds)/CONFIG.laneDuration+1e-8));
  let next=0;
  for(const lane of lanes)if(lanes.some(from=>(reachable&(1<<from))&&Math.abs(from-lane)<=movement))next|=1<<lane;
  reachable=next&~mask;
  if(!reachable)return false;
  last=at;
 }
 return true;
}
function spawn(s,random){
 const lookAhead=Math.max(CONFIG.spawnAhead,s.normalSpeed*4.2);let z=s.distance+lookAhead;
 if((!roundDifficulty(s).coordination.advanced&&bellReservation(s,z))||turnPositions(s).some(t=>z>t-turnClearBefore(t,s)&&z<t+turnClearAfter(s))||z>targetDistance(s)-120){s.nextSpawn=s.distance+20;return;}
 const counters={rows:s.rows,rowsSinceCenter:s.rowsSinceCenter,lastHazardLane:s.lastHazardLane,centerHazards:s.centerHazards,lastSafeLane:s.lastSafeLane};
 const row=s.rows++,pool=row<4?['bag','gym','cart']:row<8?['bag','gym','cart','student']:['bag','gym','student','cart','student'];
 let lane=row===0||s.rowsSinceCenter>=2?1:Math.floor(random()*3);
 if(lane===s.lastHazardLane&&lane!==1)lane=(lane+1+Math.floor(random()*2))%3;
 s.rowsSinceCenter=lane===1?0:s.rowsSinceCenter+1;s.lastHazardLane=lane;
 let type=row===0?'bag':row===1?'gym':row===2?'cart':s.chase&&row%5===0?'monitor':pool[Math.floor(random()*pool.length)];
 if(lane===1){if(row>2)type=['bag','gym','cart'][s.centerHazards%3];s.centerHazards++;}if(row>3&&row%3===2){type='student';lane=row%2?0:2;}if(row>3&&row%6===0){type='monitor';lane=1;}const velocity=type==='student'?(row%2?CONFIG.studentSpeed:-CONFIG.studentSpeed):type==='monitor'?-CONFIG.monitorSpeed:0;
 const edgeEntry=type==='student'||type==='monitor';if(edgeEntry){const prior=s.obstacles.filter(o=>!o.passed&&!o.classroomEvent&&o.type!=='janitor').reduce((v,o)=>Math.max(v,o.z),-Infinity);z=Math.max(z,prior+(s.normalSpeed+CONFIG.studentSpeed)*Math.max(roundDifficulty(s).coordination.advanced?roundDifficulty(s).coordination.edgeSeconds:DIFFICULTY_LIMITS.minimumEdgeSeconds,2.9/roundDifficulty(s).density));if((!roundDifficulty(s).coordination.advanced&&bellReservation(s,z))||turnPositions(s).some(t=>z>t-turnClearBefore(t,s)&&z<t+turnClearAfter(s))||z>targetDistance(s)-120){s.nextSpawn=s.distance+20;return;}}
 const visualLane=type==='monitor'?(Math.floor(row/6)%2?-.65:2.65):edgeEntry?(lane===0?-.65:2.65):lane;const popup=!edgeEntry&&row>3&&row%3===0;
 const candidates=[];
 candidates.push({group:row,lane,type,z,hit:false,passed:false,variant:row%3,velocity,walkPhase:0,visualLane,edgeEntry,popup,popupProgress:0,popupWarning:false,popupActive:false,collidable:true,moveEligible:edgeEntry,moveConsidered:false,moveCue:0,moveProgress:0,moveTarget:null});
 if(edgeEntry&&type!=='monitor')candidates.push({group:row,lane:1,type:'bag',z,hit:false,passed:false,collidable:true});
 if(row>0&&!edgeEntry){let choices=[0,1,2].filter(v=>v!==lane&&v!==s.lastSafeLane);if(roundDifficulty(s).density>1&&s.lastSafeLane>=0){const adjacent=choices.filter(v=>Math.abs(v-s.lastSafeLane)<=1);if(adjacent.length)choices=adjacent;}const safe=choices[Math.floor(random()*choices.length)],second=[0,1,2].find(v=>v!==lane&&v!==safe);s.lastSafeLane=safe;candidates.push({lane:second,type:row>2?'student':row%2?'bag':'gym',velocity:row>2?-CONFIG.studentSpeed:0,visualLane:second,moveEligible:row>2,walkPhase:0,z,hit:false,passed:false,popup:popup&&!(row>2),popupProgress:0,popupWarning:false,popupActive:false});}
 if(s.levelIndex>0&&!hasAvoidancePath(s,candidates)){
  Object.assign(s,counters);
  s.nextSpawn=s.distance+Math.max(20,s.normalSpeed*.18);
  return;
 }
 s.obstacles.push(...candidates);
 // Reserve time for the slowest moving student, not merely the current runner speed.
 s.nextSpawn=z-lookAhead+Math.max(48,(s.normalSpeed+CONFIG.studentSpeed)*encounterSeconds(s,edgeEntry?3.0:row<3?CONFIG.hazardSpacingEarly:row<7?CONFIG.hazardSpacingMid:CONFIG.hazardSpacingLate,edgeEntry));

}
function step(s,delta,random=Math.random){let remaining=Math.max(0,Number.isFinite(delta)?delta:0),events=[];while(remaining>1e-9){if(s.mode!=='playing'&&s.mode!=='catching')break;const dt=Math.min(remaining,CONFIG.simulationStep);events.push(...integrateStep(s,dt,random));remaining-=dt;}return events;}
function recoveryFactor(remaining,duration=CONFIG.stumbleDuration,factor=CONFIG.collisionSpeedFactor){const p=Math.max(0,Math.min(1,1-remaining/duration)),ease=p*p*(3-2*p);return factor+(1-factor)*ease;}
function impact(s,kind='obstacle'){if(s.collisionCooldown>0)return false;const duration=kind==='corner'?CONFIG.cornerSlowDuration:kind==='monitor'?CONFIG.monitorHitDuration:CONFIG.stumbleDuration,factor=kind==='corner'?CONFIG.cornerSlowFactor:kind==='monitor'?CONFIG.monitorHitFactor:CONFIG.collisionSpeedFactor;s.collisionCooldown=CONFIG.collisionImmunity;if(kind==='obstacle'||kind==='monitor')s.pressure=Math.min(100,s.pressure+CONFIG.collisionPressure);
// A lighter contact must never lengthen or intensify an existing stronger slowdown.
if(kind==='obstacle'||!s.stumble||factor<(s.stumbleFactor??CONFIG.collisionSpeedFactor)){s.stumble=duration;s.stumbleKind=kind;s.stumbleDuration=duration;s.stumbleFactor=factor;}s.speed=(s.normalSpeed??speedAt(s.time,s))*recoveryFactor(s.stumble,s.stumbleDuration,s.stumbleFactor);if(s.chase&&kind!=='corner')s.gap=Math.max(0,s.gap-(kind==='monitor'?2:CONFIG.chasePenalty));return true;}
const TURN_PACES=CONFIG.turnPositions.map(target=>{let time=0,distance=0;while(distance<target){time+=.05;distance+=speedAt(time)*.05;}return speedAt(time);});
function turnReferenceSpeed(state){return Math.max(TURN_PACES[state.turnIndex]||CONFIG.minSpeed,state.normalSpeed||state.speed||CONFIG.minSpeed);}
function turnInputDistance(state){return turnPositions(state)[state.turnIndex]===undefined?0:turnReferenceSpeed(state)*(CONFIG.turnInputSeconds+CONFIG.turnBufferSeconds);}
// Cover both existing camera curves: 60 path units normally, 80 with reduced motion.
function turnLateDistance(state){return turnPositions(state)[state.turnIndex]===undefined?0:Math.max(CONFIG.turnExitDistance,turnReferenceSpeed(state)*CONFIG.turnLateSeconds);}
function turnClearBefore(turn,state){return Math.max(150,Math.max(TURN_PACES[routeTurns(state).indexOf(turn)]||CONFIG.maxSpeed,state.normalSpeed)*CONFIG.turnClearSeconds+30);}
function turnClearAfter(state){return Math.max(80,CONFIG.maxSpeed*(state?roundDifficulty(state).speed:1)*CONFIG.turnDuration+CONFIG.collisionDepth+20);}
// Separation follows scalar route progress, never camera displacement or heading.
// Corner recovery remains a movement penalty, but is not obstacle contact.
function advancePursuitGap(s,dt,pathAdvance){const collisionRecovery=s.stumble>0&&s.stumbleKind!=='corner';const delta=collisionRecovery?dt*(CONFIG.chaseRecovery-(CONFIG.chaseRecovery+CONFIG.chaseStumbleGain)*(1-recoveryFactor(s.stumble,s.stumbleDuration,s.stumbleFactor))/(1-CONFIG.collisionSpeedFactor)):CONFIG.chaseRecovery*Math.max(0,pathAdvance)/Math.max(1,s.normalSpeed);s.gap=Math.max(0,Math.min(CONFIG.chaseMaxGap,s.gap+delta));}
// One authoritative pursuit-contact gate. Rendering and lane actors never initiate capture.
function beginMonitorContact(s,events){if(s.mode!=='playing'||!s.chase||s.gap>0||!Number.isFinite(s.gap)||s.monitorSlow>0||s.monitorCooldown>0)return false;s.gap=0;s.chaseVisualGap=0;s.lastMonitorContact={source:'pursuer',gap:0,distance:s.distance,time:s.time};s.monitorSlow=CONFIG.monitorSlowDuration;s.monitorContacts++;s.speed=s.normalSpeed*CONFIG.monitorSlowFactor;s.chaseWarning=CONFIG.monitorSlowDuration;events.push('monitor-contact');return true;}
function pursuitStatus(s){const held=s.monitorSlow>0,gap=held?0:Math.max(0,s.gap);return {gap,held,close:1-Math.min(1,gap/CONFIG.chaseMaxGap),danger:gap<=CONFIG.chaseCloseGap};}
const ROUND_SETTINGS=Object.freeze({quips:Object.freeze(LEVELS.map(level=>level.quip))});
function roundDuration(s){return LEVELS[s.levelIndex].duration;}
function levelStatus(s){const level=LEVELS[s.levelIndex],elapsed=Math.max(0,Math.min(level.duration,s.levelTime));return {index:s.levelIndex,number:s.levelIndex+1,count:LEVELS.length,id:level.id,name:level.name,duration:level.duration,elapsed,remaining:Math.max(0,level.duration-elapsed),complete:s.levelsComplete};}
function advanceLevels(s,dt,events){s.campaignActiveTime+=dt;s.levelAnnouncement=Math.max(0,s.levelAnnouncement-dt);const wasComplete=s.levelsComplete;s.levelTime=Math.min(roundDuration(s),s.levelTime+dt);if(s.levelTime>=roundDuration(s)-1e-8){s.levelTime=roundDuration(s);s.levelsComplete=true;if(!wasComplete)events.push('round-time-complete');}}
function completeRound(s){if(s.mode!=='relief'||s.result!=='success')return false;s.roundsCompleted=s.levelIndex+1;s.mode=s.roundsCompleted<LEVELS.length?'roundTransition':'completed';return true;}
function beginNextRound(s){if(s.mode!=='roundTransition'||s.levelIndex>=LEVELS.length-1)return false;const carry={character:s.character,score:s.score,roundScoreBase:s.score,campaignActiveTime:s.campaignActiveTime,roundsCompleted:s.roundsCompleted,levelIndex:s.levelIndex+1,levelTransitions:s.levelTransitions+1};const fresh=createState();for(const key of Object.keys(s))delete s[key];Object.assign(s,fresh,carry,{mode:'playing'});s.normalSpeed=s.speed=speedAt(0,s);s.firstBathroomDistance=paceDistance(roundDuration(s),s);return true;}
function integrateStep(s,dt,random){const events=[];if(s.mode==='catching'){clearWater(s);s.catchTimer=Math.max(0,s.catchTimer-dt);s.chaseClock+=dt;s.chaseVisualGap+=(0-s.chaseVisualGap)*(1-Math.exp(-dt*10));if(s.catchTimer<=0){s.mode='ending';events.push('failure');}return events;}if(s.mode!=='playing')return [];const previousWaterLane=s.visualLane,previousWaterJump=s.jump;s.slipTime=Math.max(0,(s.slipTime||0)-dt);s.turnFeedbackTime=Math.max(0,s.turnFeedbackTime-dt);s.turnFlash=Math.max(0,s.turnFlash-dt);s.time+=dt;advanceLevels(s,dt,events);s.pressure=Math.min(100,s.pressure+CONFIG.pressureRate*dt);s.normalSpeed=speedAt(s.time,s);const wasMonitorSlow=s.monitorSlow>0;s.monitorSlow=Math.max(0,s.monitorSlow-dt);s.monitorCooldown=Math.max(0,s.monitorCooldown-dt);if(wasMonitorSlow&&!s.monitorSlow){s.gap=CONFIG.monitorReleaseGap;s.monitorCooldown=CONFIG.monitorContactCooldown;events.push('breakaway');}s.collisionCooldown=Math.max(0,s.collisionCooldown-dt);s.stumble=Math.max(0,s.stumble-dt);const monitorProgress=1-s.monitorSlow/CONFIG.monitorSlowDuration,monitorEase=monitorProgress*monitorProgress*(3-2*monitorProgress),monitorFactor=s.monitorSlow>0?CONFIG.monitorSlowFactor+(1-CONFIG.monitorSlowFactor)*monitorEase:1;s.speed=s.normalSpeed*Math.min(recoveryFactor(s.stumble,s.stumbleDuration,s.stumbleFactor),monitorFactor);s.jumpGrace=s.jump>0?CONFIG.actionGrace:Math.max(0,s.jumpGrace-dt);s.duckGrace=s.duck>0?CONFIG.actionGrace:Math.max(0,s.duckGrace-dt);s.jumpRest=Math.max(0,s.jumpRest-dt);const wasJumping=s.jump>0;s.jump=Math.max(0,s.jump-dt);if(wasJumping&&!s.jump)s.jumpRest=CONFIG.jumpLandingRecovery;s.duck=Math.max(0,s.duck-dt);
if(s.queued){const q=s.queued;if(q.lane!==s.lane||q.z<s.distance){s.queued=null;}else if(!s.jumpRest&&(q.z-s.distance-CONFIG.collisionDepth)/s.speed<=(q.action==='jump'?.8:1)){s.jump=q.action==='jump'?CONFIG.jumpDuration:0;s.duck=q.action==='duck'?CONFIG.duckDuration:0;s.queued=null;}}
// Airborne drag eases in and out; stronger penalties take precedence without stacking.
const jumpPhase=s.jump>0?1-s.jump/CONFIG.jumpDuration:0,jumpFactor=1-CONFIG.jumpSpeedPenalty*Math.sin(Math.PI*jumpPhase)**2;s.speed=s.normalSpeed*Math.min(recoveryFactor(s.stumble,s.stumbleDuration,s.stumbleFactor),monitorFactor,jumpFactor);
s.visualLane+=(s.lane-s.visualLane)*(1-Math.exp(-dt*3/CONFIG.laneDuration));const previousDistance=s.distance,travel=Math.min((paceDistance(s.time,s)-paceDistance(s.time-dt,s))*(s.speed/Math.max(1,s.normalSpeed)),s.destinationLocked?Math.max(0,targetDistance(s)-s.distance):Infinity);s.distance+=travel;updateBathroomPlan(s);const oldPhase=s.playerPhase;const stride=strideAt(s);s.playerPhase=(s.playerPhase+travel/stride)%1;if(s.playerPhase<oldPhase)s.playerGait=s.time>=CONFIG.runStart?'run':'walk';const turnAt=turnPositions(s)[s.turnIndex];
 // Route geometry determines automatic navigation; committed lane only decides inside-corner contact.
 if(turnAt!==undefined&&s.distance>=turnAt){const direction=turnDirections(s)[s.turnIndex],insideLane=direction==='left'?0:2;/* Commit once at the route junction; camera yaw and interpolated visualLane never decide contact. */if(s.lane===insideLane&&impact(s,'obstacle'))events.push('hit','corner-hit');s.turnResult='turned';s.cameraFromHeading=s.heading;s.heading+=(direction==='right'?1:-1)*Math.PI/2;s.turnIndex++;s.turnChoice=null;s.turnBuffer=null;s.turnWait=0;s.turnEntry=null;s.turnFlash=CONFIG.turnDuration;s.turnFeedback='AUTO TURN '+direction.toUpperCase();s.turnFeedbackTime=1;events.push('turned');}

 
if(!s.chase&&s.time>=CONFIG.runStart){s.chase=true;s.gap=CONFIG.chaseStartGap;s.chaseVisualGap=s.gap;s.monitorLane=s.visualLane;s.chaseLaneTarget=s.lane;s.chaseIntro=CONFIG.chaseIntroDuration;events.push('chase');}if(s.chase){if(!s.monitorSlow)advancePursuitGap(s,dt,travel);s.chaseClock+=dt;s.chaseIntro=Math.max(0,s.chaseIntro-dt);s.chaseWarning=Math.max(0,s.chaseWarning-dt);
if(s.chaseLaneTarget!==s.lane){s.chaseLaneTarget=s.lane;s.chaseLaneDelay=CONFIG.chaseFollowDelay;}s.chaseLaneDelay=Math.max(0,s.chaseLaneDelay-dt);if(!s.chaseLaneDelay)s.monitorLane+=(s.chaseLaneTarget-s.monitorLane)*(1-Math.exp(-dt*CONFIG.chaseFollowRate));}
updateBellEvent(s,dt,random,events);
trySpawnJanitor(s,random);
if(roundDifficulty(s).coordination.advanced||!bellDue(s))trySpawnClassroomStudent(s,random);
if(s.distance>=s.nextSpawn&&s.distance<targetDistance(s)-115)spawn(s,random);
// Edge students now belong to the hazard stream and swerve into playable lanes.
s.pedestrians=[];
for(const o of s.obstacles){const oldStudentLane=o.visualLane??o.lane;const previousZ=o.z;let physicalZ=o.z;if(o.type==='janitor'){updateJanitor(s,o);tryJanitorSpill(s,o,events);}if(o.classroomEvent){updateClassroomStudent(s,o,dt);physicalZ=o.z;}else if(o.type==='student'||o.type==='monitor'){o.z+=(o.velocity||0)*dt;physicalZ=o.z;if(o.type==='monitor')o.walkPhase=((o.walkPhase||0)+Math.abs(o.velocity||0)*dt/4.8*8)%8;updateStudent(s,o,dt);physicalZ=o.z;for(const t of turnPositions(s)){const before=turnClearBefore(t,s);if(o.z>t-before&&o.z<t+turnClearAfter(s))o.z=o.z<t?t-before:t+turnClearAfter(s);}}if(o.type==='student'&&!o.classroomEvent)advanceStudentAnimation(o,dt,previousZ,oldStudentLane);const d=o.z-s.distance;if(o.popup){const eta=(d-CONFIG.collisionDepth)/Math.max(1,s.normalSpeed,s.speed);if(eta<=CONFIG.popupWarningSeconds)o.popupWarning=true;if(eta<=CONFIG.popupRevealSeconds)o.popupActive=true;if(o.popupActive)o.popupProgress=Math.min(1,(o.popupProgress||0)+dt/CONFIG.popupRiseDuration);}if(!o.passed&&d<CONFIG.collisionDepth){o.passed=true;/* Only physical forward contact counts. Stale actors behind us and corner relocation jumps cannot hit. */const physicalContact=previousZ-previousDistance>=0&&physicalZ-s.distance<CONFIG.collisionDepth&&Math.abs(o.z-physicalZ)<=Math.abs((o.velocity||0)*dt)+1e-7;if(!physicalContact)continue;const bucketInCorridor=o.type!=='janitor'||(o.visualLane>=CONFIG.playableMin&&o.visualLane<=CONFIG.playableMax),same=o.collidable!==false&&bucketInCorridor&&Math.abs(s.visualLane-(o.visualLane??o.lane))<collisionHalfLanes(o);const safe=o.type!=='student'&&o.type!=='monitor'&&(s.jump>0||s.jumpGrace>0);if(same&&!safe&&!s.collisionCooldown){o.hit=true;if(impact(s,o.type==='monitor'?'monitor':'obstacle')){events.push('hit');if(o.type==='janitor')events.push('janitor-hit');if(o.type==='monitor')events.push('monitor-obstacle-hit');}}else{s.score+=100;events.push('pass');}}}updateWater(s,dt,previousDistance,previousWaterLane,previousWaterJump,events);if(s.chase){s.chaseVisualGap+=(s.gap-s.chaseVisualGap)*(1-Math.exp(-dt*CONFIG.chaseVisualRate));if(s.gap<=CONFIG.chaseCloseGap&&s.chaseWarnArmed){s.chaseWarning=2;s.chaseWarnArmed=false;events.push('close');}if(s.gap>CONFIG.chaseCloseGap+2)s.chaseWarnArmed=true;}
s.obstacles=s.obstacles.filter(o=>o.classroomEvent?(o.classroomKind==='enter'?(!o.classroomComplete||s.time<o.removeAt):(o.classroomState!=='hallway'||o.z>s.distance-12)):o.type==='janitor'?!(o.crossComplete&&o.z<=s.distance-12):o.z>s.distance-12);s.score=Math.max(s.score,s.roundScoreBase+Math.floor(s.distance)*2);if(s.pressure>=100){s.mode='ending';s.result='bladder';events.push('failure');}else if(s.levelsComplete){s.mode='ending';s.result='success';events.push('success');}else if(s.chase&&s.gap<=0&&!s.monitorSlow&&!s.monitorCooldown){beginMonitorContact(s,events);}else if(s.pressure>=100){s.mode='ending';s.result='bladder';events.push('failure');}if(s.mode!=='playing'){clearBellEvent(s);clearWater(s);}return events;}

const STUDENT_ROUNDS=Object.freeze(ROUND_DIFFICULTY.map(d=>d.student));
function studentTraits(o){
 if(o.studentTraits)return o.studentTraits;
 const identity=[o.group??o.door?.id??Math.round(o.z/CONFIG.sectionLength),o.variant??0,o.hallLane??o.lane,Math.sign(o.velocity||-1)].join('/');
 let hash=2166136261;
 for(let i=0;i<identity.length;i++)hash=Math.imul(hash^identity.charCodeAt(i),16777619)>>>0;
 const next=()=>{hash=(Math.imul(hash,1664525)+1013904223)>>>0;return hash/4294967296;};
 return o.studentTraits={speed:.94+next()*.12,stride:.96+next()*.08,arms:.90+next()*.20,crossing:.95+next()*.10,hesitation:.9+next()*.2,planRoll:next(),lengthRoll:next(),reversalRoll:next(),variant:next()};
}
const STUDENT_MOVEMENT=Object.freeze({reactionSeconds:1.25,walkSpeed:4,planningSeconds:6.5,minimumLeadSeconds:3.5});
function studentPlanPose(o,time){
 const plan=o.studentPlan;
 let elapsed=Math.max(0,time-plan.startedAt),lane=plan.startLane,z=plan.startZ,velocity=plan.startVelocity,index=0;
 for(const part of plan.parts){
  const used=Math.min(elapsed,part.seconds),p=used/part.seconds,ease=p*p*(3-2*p);
  z+=velocity*used+(part.velocity-velocity)*part.seconds*(p*p*p-.5*p*p*p*p);
  lane+=(part.lane-lane)*ease;
  if(elapsed<=part.seconds)return {z,visualLane:lane,velocity:velocity+(part.velocity-velocity)*ease,planPhase:part.phase,planIndex:index,planComplete:false};
  elapsed-=part.seconds;velocity=part.velocity;index++;
 }
 return {z:z+velocity*elapsed,visualLane:lane,velocity,planPhase:'complete',planIndex:index,planComplete:true};
}
function tryStudentPlan(s,o){
 if(o.studentPlan||o.planConsidered||!o.moveEligible||o.classroomEvent)return;
 const relative=Math.max(1,s.normalSpeed-(o.velocity||0)),eta=(o.z-s.distance-CONFIG.collisionDepth)/relative;
 if(eta>STUDENT_MOVEMENT.planningSeconds)return;
 o.planConsidered=true;
 if(eta<STUDENT_MOVEMENT.minimumLeadSeconds)return;
 const cfg=STUDENT_ROUNDS[s.levelIndex],traits=studentTraits(o),variant=Math.floor(traits.variant*cfg.variants);
 const movements=traits.planRoll<cfg.multiChance?(traits.lengthRoll<cfg.thirdChance?3:2):1;
 const direction=Math.sign(o.velocity||-1),walk=direction*STUDENT_MOVEMENT.walkSpeed*traits.speed,run=direction*cfg.runSpeed*traits.speed;
 const start=o.visualLane??o.lane,entry=Math.max(0,Math.min(2,Math.round(o.lane)));
 const first=start<0?0:start>2?2:entry===1?(variant%2?0:2):1;
 const reverse=movements===2&&traits.reversalRoll<cfg.reversalChance;
 const second=reverse&&entry!==first?entry:first===1?(entry===0?2:0):1;
 const duration=cfg.laneSeconds*traits.crossing,pause=cfg.pauseSeconds*traits.hesitation;
 const running=variant===1&&s.levelIndex>=2;
 const parts=[
  {phase:variant===2?'hesitate':'forward',seconds:.25*traits.hesitation,velocity:variant===2?walk*.55:walk,lane:start},
  {phase:'cross',seconds:duration,velocity:running?run:walk,lane:first}
 ];
 let finalLane=first,finalSpeed=running?run:walk;
 if(movements>1){
  finalLane=second;finalSpeed=variant===2||s.levelIndex>=4?run:walk;
  parts.push({phase:'continue',seconds:pause,velocity:running?run:walk,lane:first},{phase:'cross',seconds:duration,velocity:finalSpeed,lane:second});
 }
 if(movements===3){
  const third=second===1?(first===0?2:0):1;
  finalLane=third;finalSpeed=run;
  parts.push({phase:'continue',seconds:pause,velocity:run,lane:second},{phase:'cross',seconds:duration,velocity:run,lane:third});
 }
 parts.push({phase:'depart',seconds:.3,velocity:finalSpeed,lane:finalLane});
 const plan={objective:['cross-hallway','change-direction','hesitant-crossing'][variant],startedAt:s.time,startLane:start,startZ:o.z,startVelocity:o.velocity||walk,parts};
 if(turnPositions(s).some(t=>Math.abs(o.z-t)<turnClearBefore(t,s)+relative*5))return;
 if(hasAvoidancePath(s,[{...o,studentPlan:plan}],o)){o.studentPlan=plan;o.moveTarget=null;o.moveCue=0;}
}
function advanceStudentAnimation(o,dt,oldZ,oldLane){
 const traits=studentTraits(o);
 const distance=Math.hypot(o.z-oldZ,((o.visualLane??o.lane)-oldLane)*LANE_METRES),speed=distance/Math.max(.001,dt);
 const run=Math.max(0,Math.min(1,(speed-4.8)/3));
 o.gaitBlend=(o.gaitBlend||0)+(run-(o.gaitBlend||0))*(1-Math.exp(-dt*7));
 o.motionSpeed=speed;o.armSwing=traits.arms;o.lateralMotion=((o.visualLane??o.lane)-oldLane)/Math.max(.001,dt);
 o.walkPhase=((o.walkPhase||0)+distance/((4.4+2*o.gaitBlend)*traits.stride)*8)%8;
}
function updateStudent(s,o,dt){
 if(o.type==='student'){tryStudentPlan(s,o);if(o.studentPlan){Object.assign(o,studentPlanPose(o,s.time));o.lane=o.visualLane;}return;}

 o.visualLane??=o.lane;o.moveProgress??=0;o.moveCue??=0;const intensity=o.type==='student'?roundDifficulty(s).swerve:1,monitor=o.type==='monitor',oncoming=o.type==='student'&&o.velocity<0,late=monitor||oncoming,lead=monitor?CONFIG.monitorSwerveLead:oncoming?CONFIG.oncomingSwerveLead+(intensity-1)*3:4.2,cue=monitor?CONFIG.monitorCueDuration:oncoming?CONFIG.oncomingCueDuration:CONFIG.studentCueDuration,duration=monitor?CONFIG.monitorLaneDuration:Math.max(DIFFICULTY_LIMITS.minimumStudentMoveSeconds,(oncoming?CONFIG.oncomingLaneDuration:CONFIG.studentLaneDuration)/Math.sqrt(intensity)),relative=Math.max(1,Math.max(s.speed,s.normalSpeed)-(o.velocity||0)),eta=(o.z-s.distance-CONFIG.collisionDepth)/relative;
 if(intensity>1){o.swerveRetry=Math.max(0,(o.swerveRetry||0)-dt);const maximum=2;if(o.moveEligible&&o.moveTarget==null&&!(o.moveCue>0)&&(o.swerveCount||0)<maximum&&!o.swerveRetry&&eta>=cue+duration+(late?.65:CONFIG.studentReactionSeconds))o.moveConsidered=false;}
 if(o.moveEligible&&!o.moveConsidered&&eta<=lead){o.moveConsidered=true;if(intensity>1)o.swerveRetry=DIFFICULTY_LIMITS.studentRetrySeconds;
  const companions=s.obstacles.filter(other=>other!==o&&!other.passed&&Math.abs(other.z-o.z)<relative*.45),blocked=lane=>companions.some(other=>{const position=other.moveTarget??other.visualLane??other.lane;return intensity>1?position>=Math.min(o.visualLane,lane)-.55&&position<=Math.max(o.visualLane,lane)+.55:Math.abs(lane-position)<.6;}),desired=late?s.lane:o.edgeEntry?o.lane:o.lane===0?1:o.lane===2?1:(o.variant%2?0:2),choices=[desired,0,1,2],target=choices.find(lane=>!blocked(lane)&&Math.abs(lane-o.visualLane)>.25),isolated=late?!s.obstacles.some(other=>other!==o&&!other.passed&&Math.abs(other.z-o.z)>relative*.45&&Math.abs(other.z-o.z)<relative*.65/intensity):!s.obstacles.some(other=>other!==o&&!(o.edgeEntry&&other.type==='bag'&&other.lane===1&&o.group!==undefined&&other.group===o.group)&&!other.passed&&other.collidable!==false&&Math.abs(other.z-o.z)<relative*2.1/intensity);
  if(target!==undefined&&eta>=cue+duration+(late?.65:CONFIG.studentReactionSeconds)&&isolated&&turnPositions(s).every(t=>o.z<=t-turnClearBefore(t,s)||o.z>=t+turnClearAfter(s))){const move={moveTarget:target,moveFrom:o.visualLane,moveCue:cue,moveProgress:0,swerveDuration:duration};if(s.levelIndex===0||hasAvoidancePath(s,[{...o,...move}],o))Object.assign(o,move);}
 }
 if(o.moveTarget!==null&&o.moveTarget!==undefined){if(o.moveCue>0)o.moveCue=Math.max(0,o.moveCue-dt);else{o.moveProgress=Math.min(1,o.moveProgress+dt/(o.swerveDuration||duration));const p=o.moveProgress,ease=p*p*(3-2*p);o.visualLane=o.moveFrom+(o.moveTarget-o.moveFrom)*ease;if(p>=1){o.lane=o.moveTarget;o.moveTarget=null;if(intensity>1){o.swerveCount=(o.swerveCount||0)+1;o.swerveRetry=DIFFICULTY_LIMITS.repeatSwervePauseSeconds;}}}}
}
function speedAt(time,state){const multiplier=state?roundDifficulty(state).speed:1,knots=CONFIG.paceKnots;for(let i=1;i<knots.length;i++){if(time<=knots[i][0]){const a=knots[i-1],b=knots[i],p=Math.max(0,Math.min(1,(time-a[0])/(b[0]-a[0]))),ease=p*p*(3-2*p);return (a[1]+(b[1]-a[1])*ease)*multiplier;}}return CONFIG.maxSpeed*multiplier;}
// Route coordinates are real connected perpendicular corridor segments.
const LANE_METRES=12;
const ROUTE_TURNS=[...CONFIG.turnPositions],ROUTE_DIRECTIONS=[...CONFIG.turnDirections];
function routeSegments(turns=ROUTE_TURNS,destination=CONFIG.distance){let x=0,z=0,heading=0,start=0;const segments=[];for(let i=0;i<=turns.length;i++){const end=turns[i]??destination+240;segments.push({index:i,start,end,x,z,heading});const length=end-start;x+=Math.sin(heading)*length;z+=Math.cos(heading)*length;if(i<ROUTE_DIRECTIONS.length)heading+=(ROUTE_DIRECTIONS[i]==='right'?1:-1)*Math.PI/2;start=end;}return segments;}
const ROUTE=routeSegments(),routeCache=new WeakMap();
function routeFor(state){if(!state)return ROUTE;const destination=firstBathroomDistance(state),cached=routeCache.get(state);if(cached&&cached.destination===destination)return cached.route;const route=routeSegments(routeTurns(state),destination);routeCache.set(state,{destination,route});return route;}
function routePoint(distance,lane=0,state){const route=routeFor(state),segment=route.find(seg=>distance<seg.end)||route.at(-1),along=distance-segment.start;return {x:segment.x+Math.sin(segment.heading)*along+Math.cos(segment.heading)*lane*LANE_METRES,z:segment.z+Math.cos(segment.heading)*along-Math.sin(segment.heading)*lane*LANE_METRES,heading:segment.heading};}
const RELIEF_SETTINGS=Object.freeze({seconds:1.6});
// A successful arrival has one deterministic outcome, with no active-play progression.
function resolveBathroomArrival(s){if(s.mode!=='ending'||s.result!=='success')return false;clearWater(s);s.distance=targetDistance(s);s.mode='relief';s.restroomPhase='available';s.reliefElapsed=0;return true;}
const api={evaluateAvoidance,futureBellStudents,forecastProgress,routeContact,WATER_ROUNDS,WATER_SETTINGS,puddleStatus,clearWater,tryJanitorSpill,puddleJumpHeight,updateWater,studentTraits,STUDENT_ROUNDS,STUDENT_MOVEMENT,studentPlanPose,tryStudentPlan,advanceStudentAnimation,hasAvoidancePath,BELL_ROUNDS,BELL_SETTINGS,bellDue,bellReservation,planBell,updateBellEvent,clearBellEvent,bellDoorPoses,CLASSROOM_GEOMETRY,CLASSROOM_ROUNDS,CLASSROOM_SETTINGS,classroomDoor,classroomReservation,trySpawnClassroomStudent,updateClassroomStudent,activeClassroomDoors,JANITOR_ROUNDS,JANITOR_SETTINGS,trySpawnJanitor,updateJanitor,janitorReservation,RELIEF_SETTINGS,ROUND_DIFFICULTY,DIFFICULTY_LIMITS,roundDifficulty,strideAt,encounterSeconds,ROUND_SETTINGS,roundDuration,completeRound,beginNextRound,firstBathroomDistance,routeTurns,routeFor,LEVELS,LEVEL_SETTINGS,levelStatus,totalLevelDuration,paceDistance,turnLateDistance,beginMonitorContact,pursuitStatus,advancePursuitGap,resolveBathroomArrival,ROUTE_TURNS,ROUTE_DIRECTIONS,targetDistance,turnPositions,turnDirections,CONFIG,createState,action,step,speedAt,impact,recoveryFactor,turnInputDistance,turnClearAfter,updateStudent,routePoint,ROUTE,LANE_METRES};root.UTLogic=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);













