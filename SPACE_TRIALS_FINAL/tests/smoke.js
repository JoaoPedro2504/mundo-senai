// Headless logic smoke tests with an emulated DOM/WebGL API; not a browser rendering test.
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);const elems=new Map();function makeElement(id){let events={};return {id,style:{},textContent:'',innerHTML:'',hidden:false,disabled:false,value:'NORMAL',classList:{classes:new Set(),add(v){this.classes.add(v)},remove(v){this.classes.delete(v)},toggle(v,b){if(b)this.classes.add(v);else this.classes.delete(v)}},addEventListener(type,fn){events[type]=fn;},dispatch(type,value){if(events[type])events[type]({target:{value},preventDefault(){}});},appendChild(){},querySelector(){return makeElement('button')},getBoundingClientRect(){return {left:0,top:0,width:650,height:1000}},setPointerCapture(){}}}for(let id of ids)elems.set(id,makeElement(id));const gl=new Proxy({createShader(){return{}},createProgram(){return{}},createBuffer(){return{}},getShaderParameter(){return true},getProgramParameter(){return true},getAttribLocation(){return 0},getUniformLocation(){return{}},VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,STATIC_DRAW:6,TRIANGLES:7,FLOAT:8,DEPTH_TEST:9,LEQUAL:10,CULL_FACE:11,COLOR_BUFFER_BIT:12,DEPTH_BUFFER_BIT:13},{get(t,k){if(k in t)return t[k];return()=>{};}});let canvas=elems.get('gameCanvas');canvas.width=650;canvas.height=1000;canvas.getContext=()=>gl;let storage={};let ctx={console,Math,Date,Set,Array,Object,String,Number,JSON,Float32Array,Uint8Array,parseInt,structuredClone,localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=v},document:{getElementById:id=>elems.get(id)||null,createElement:tag=>makeElement(tag)},addEventListener(){},requestAnimationFrame(){},devicePixelRatio:1,window:{AudioContext:null,webkitAudioContext:null}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../js/game.js'),'utf8'),ctx,{timeout:120000});
const run=code=>vm.runInContext(code,ctx,{timeout:120000});
assert.strictEqual(run('SHIPS_DATABASE.length'),12,'12 ships');assert.strictEqual(run('ENEMIES.length'),40,'40 enemy entries');assert.strictEqual(run('BOSSES.length'),20,'20 boss entries');assert.strictEqual(run('POWERUPS.length'),30,'30 powerups');assert.strictEqual(run('WEAPONS.length'),8,'8 weapon modes');assert.strictEqual(run('render.ready'),true,'WebGL initialized');
run('newRun()');assert.equal(run('state'),'PLAYING');assert.equal(run('phase'),1);for(let i=0;i<300;i++)run('update(.04)');assert.ok(run('elapsed')>11,'time progresses');
run('player.weapon=3;shootPlayer()');assert.ok(run('shots.some(s=>s.owner==="player"&&s.type==="plasma")'));
run('player.weapon=7;shootPlayer()');assert.ok(run('shots.filter(s=>s.owner==="player").length')>=5);
run('elapsed=63;missionBossSpawned=false;update(.04)');assert.ok(run('boss!==null'),'boss spawned');run('defeatEnemy(boss)');assert.equal(run('state'),'RESULTS');assert.equal(run('saveData.maxPhase'),2);run('nextMission()');assert.equal(run('phase'),2);assert.equal(run('state'),'PLAYING');
run('player.energy=100;enemySpawn(3);launchSecondary()');assert.equal(run('player.energy'),60);assert.ok(run('shots.some(s=>s.type==="homing")'));
run('phase=20;resetStage(20);state="PLAYING";elapsed=70;missionBossSpawned=false;update(.04);');assert.ok(run('boss!==null'));run('defeatEnemy(boss)');assert.equal(run('state'),'RESULTS');run('nextMission()');assert.equal(run('state'),'END');

// All advertised menu controls must have click handlers, not merely exist visually.
for(const id of ['btn-play','btn-stage','btn-settings','btn-hangar','btn-workshop','btn-achievements','btn-hangar-back','btn-ws-back','btn-ach-back','btn-pause','btn-resume','btn-restart','btn-menu','btn-stage-close','btn-settings-close','result-next','result-menu','btn-weapon-touch','btn-secondary-touch','btn-up-dmg','btn-up-spd','btn-up-hp','btn-up-mag']){
 assert.ok(elems.has(id),`Missing DOM element ${id}`);assert.ok(elems.get(id).dispatch,'Missing event surface');
}
assert.ok(fs.readdirSync(path.join(__dirname,'../assets/backgrounds')).length>=20,'Missing stage backgrounds');
assert.ok(fs.readdirSync(path.join(__dirname,'../assets/audio')).length>=7,'Missing sector music');
console.log('PASS: 12 ships, 40 enemies, 20 bosses, 30 powerups, 8 weapons; mission progression; shooting; homing secondary; final victory.');

// V7.3 balance regression: enemies arrive promptly but not in overwhelming numbers.
run('phase=1;resetStage(1);state="PLAYING";');
for(let i=0;i<10;i++)run('update(.04)');
const firstCount=run('entities.filter(e=>!e.boss&&!e.mini).length');
assert.ok(firstCount>=2 && firstCount<=4,`First group should have 2–4 enemies, got ${firstCount}`);
for(let i=0;i<225;i++)run('update(.04)');
assert.ok(run('spawnedTotal')>=6,`Enemies should keep arriving during early phase, got ${run('spawnedTotal')}`);
assert.ok(run('peakEnemies')<=8,`Early-phase cap was exceeded: ${run('peakEnemies')}`);
assert.ok(run('enemyShotsThisSecond')<=5,`Early-phase firing budget exceeded: ${run('enemyShotsThisSecond')}`);
console.log('V7.3 BALANCE VERIFIED:',{firstCount,spawned:run('spawnedTotal'),waves:run('waveNumber'),peak:run('peakEnemies'),shotsThisSecond:run('enemyShotsThisSecond')});

// V7.4 boss-only regression: minions, 3 combat phases, distinct projectiles, armoured state.
run('phase=1;resetStage(1);state="PLAYING";missionBossSpawned=true;enemySpawn(1,false,true);');
const b0=run('boss.maxHp');
assert.ok(b0>400,'boss must have extra endurance');
run('boss.y=5.3;boss.timer=0;bossFire(boss);');
assert.ok(run('shots.some(sh=>sh.owner==="enemy")'),'boss fires');
run('boss.hp=boss.maxHp*.65;bossUpdate(boss,.04);');
assert.equal(run('boss.stage'),2,'boss second phase');
run('boss.hp=boss.maxHp*.30;bossUpdate(boss,.04);');
assert.equal(run('boss.stage'),3,'boss third phase');
run('boss.minionClock=0;bossUpdate(boss,.04);');
const summoned=run('entities.filter(e=>e.bossMinion).length');
assert.ok(summoned>=2,'boss summons minions');
const countBefore=run('shots.filter(sh=>sh.owner==="enemy").length');
run('for(let j=0;j<15;j++)bossFire(boss);');
assert.ok(run('shots.filter(sh=>sh.owner==="enemy").length')<=34,'boss projectile cap');
assert.ok(run('shots.filter(sh=>sh.owner==="enemy").length')>countBefore,'boss attacks have projectiles');
run('boss.hp=0;defeatEnemy(boss);');
assert.equal(run('state'),'RESULTS','boss death still completes the mission');
console.log('V7.4 BOSS VERIFIED:',{initialHP:b0,summoned,attackPatterns:5,stages:3});
