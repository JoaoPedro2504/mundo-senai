/* SPACE TRIALS 4.0: GALACTIC REBIRTH — self-contained WebGL game.
   Source project: SPACE_TRIALS_V3_FIX. No CDN or external assets required. */
'use strict';
const $ = id => document.getElementById(id);
const canvas = $('gameCanvas');
const gl = canvas.getContext('webgl', {alpha:true,antialias:true,powerPreference:'high-performance'});
const CONFIG = {SAVE_KEY:'space_trials_pro_save_v3',MAX_PHASES:20,VERSION:'V7.2 • COMBATE INTENSO'};
const screens = Object.fromEntries(['menu','hud','hangar','workshop','achievements','gameover','results'].map(s=>[s,$('screen-'+s)]));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), rand=(a,b)=>a+Math.random()*(b-a), distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const SHIPS_DATABASE=[
 {id:'valkyrie',name:'ALPHA VALKYRIE',desc:'Equilíbrio • pulso EMP',cost:0,speed:7,hpMult:1,dmgMult:1,color:'#00ebff',special:'EMP SHIELD'},
 {id:'phoenix',name:'PHOENIX PRIME',desc:'Dano incendiário • nova',cost:250,speed:7.3,hpMult:.9,dmgMult:1.3,color:'#ff9c35',special:'SOLAR NOVA'},
 {id:'aegis',name:'CYBER AEGIS',desc:'Blindagem • barreira',cost:600,speed:5.7,hpMult:1.65,dmgMult:.95,color:'#1dffaf',special:'PHOTON WALL'},
 {id:'phantom',name:'VOID PHANTOM',desc:'Agilidade • fantasma',cost:1200,speed:8.8,hpMult:.82,dmgMult:1.45,color:'#cf61ff',special:'SHADOW CLONE'},
 {id:'titan',name:'SOLARIS TITAN',desc:'Pesada • bombardeio',cost:2500,speed:5.1,hpMult:2.15,dmgMult:1.5,color:'#ff4c63',special:'MISSILE BARRAGE'},
 {id:'chrono',name:'OMNI CHRONO',desc:'Elite • distorção temporal',cost:5000,speed:7.5,hpMult:1.5,dmgMult:1.75,color:'#e0ecff',special:'TIME WARP BEAM'},
 {id:'seraph',name:'THUNDER SERAPH',desc:'Choque de plasma • corrente',cost:6500,speed:8.1,hpMult:1.0,dmgMult:1.75,color:'#8fc4ff',special:'THUNDER STORM'},
 {id:'reaper',name:'CRIMSON REAPER',desc:'Impacto crítico • explosão',cost:8000,speed:7.4,hpMult:1.05,dmgMult:1.9,color:'#ff547b',special:'CRIMSON BURST'},
 {id:'specter',name:'NEBULA SPECTER',desc:'Esquiva • distorção',cost:10500,speed:9.2,hpMult:.85,dmgMult:1.7,color:'#bd7dff',special:'VOID BLINK'},
 {id:'leviathan',name:'IRON LEVIATHAN',desc:'Armadura fortificada • defesa',cost:12000,speed:4.8,hpMult:2.5,dmgMult:1.5,color:'#ffd28d',special:'IRON WALL'},
 {id:'nova',name:'CELESTIAL NOVA',desc:'Energia concentrada • supernova',cost:14500,speed:8.1,hpMult:1.25,dmgMult:2.0,color:'#74fbea',special:'STARFALL'},
 {id:'eclipse',name:'ECLIPSE SOVEREIGN',desc:'Nave lendária • eclipse',cost:19000,speed:8.8,hpMult:1.8,dmgMult:2.25,color:'#f49dff',special:'ECLIPSE ANNIHILATION'}
];
const ENEMIES=[
 ['Drone Patrulha',22,2.2,0,'#ff536c'],['Interceptador',17,3.2,1,'#ffab53'],['Kamikaze',12,4.0,2,'#ff3e79'],
 ['Caça Imperial',27,2.5,3,'#ff6065'],['Atirador Plasma',28,1.6,4,'#ff7bea'],['Guardião Escudo',41,1.45,5,'#55afff'],
 ['Porta-mísseis',37,1.4,6,'#ffc260'],['Perseguidor',23,2.8,7,'#ed6aff'],['Esquadrão',20,2.8,8,'#ffba92'],
 ['Bombardeiro',44,1.5,9,'#ff874e'],['Torre Orbital',52,.95,10,'#ad8aff'],['Drone Reparador',16,2.0,11,'#46ffbb'],
 ['Espectro',20,3.1,12,'#c28dff'],['Caça Elite',57,2.8,13,'#ff4eab'],['War Machine',105,1.1,14,'#e7a344'],
 ['Enxame',12,3.5,15,'#ff62c6'],['Artilharia',50,1.4,16,'#87a7ff'],['Caça Elétrico',31,2.6,17,'#71eaff'],
 ['Predador Alien',40,2.45,18,'#5cffac'],['Sentinela Quântica',65,2,19,'#e676ff'],
 ['Drone Fantasma',26,3.8,20,'#a0d2ff'],['Caça Meteoro',35,2.4,21,'#ffa34b'],['Nave Invisível',32,2.8,22,'#b59bff'],['Minador Cósmico',45,1.9,23,'#ffcd6d'],
 ['Guardião Elétrico',58,1.7,24,'#6bdfff'],['Sentinela Imperial',72,1.8,25,'#ff6e94'],['Fragata Negra',86,1.2,26,'#cfb4ff'],['Vespa Alien',24,3.6,27,'#78f6ac'],
 ['Atirador Quântico',58,1.3,28,'#c792ff'],['Bombardeiro Ômega',96,1.1,29,'#ffaa56'],['Cruzador Solar',112,1.15,30,'#ffe5a0'],['Interceptor Vazio',46,3.1,31,'#f17ce9'],
 ['Drone Espiral',23,3.0,32,'#9dccff'],['Aranha Espacial',75,1.7,33,'#8dffdd'],['Nave Abissal',91,2.1,34,'#b467ff'],['Porta Enxame',125,1.25,35,'#cfa8ff'],
 ['Titã Estelar',140,.95,36,'#ffb679'],['Guardião Prismático',85,1.7,37,'#9afff3'],['Caça Rubro',52,3.7,38,'#ff557b'],['Arconte Ômega',170,.85,39,'#f9d38a']
];
const MINIBOSSES=['CÃO DE GUERRA','QUEBRA-ROCHAS','CAÇADOR DE NÉVOA','VIGIA ESCARLATE','TITÃ DE CERCO','FANTASMA ELÉTRICO','CARRASCO MECÂNICO','SERPENTE QUÂNTICA','SENHOR DE ESCUDOS','HIDRA ORBITAL','COLOSSO SOMBRIO','CAÇADOR XENO','ASSASSINO QUÂNTICO','SENTINELA CRISTAL','ARAUTO DO VAZIO'];
const BOSSES=['IRON SENTINEL','ASTEROID DEVOURER','KRAKEN CIBERNÉTICO','CRIMSON DESTROYER','WAR TITAN','IMPERIAL DREADNOUGHT','PHANTOM QUEEN','VOID SERPENT','NEBULA REAPER','MECHA COLOSSUS','OMEGA FORTRESS','CYBER EMPEROR','BIO LEVIATHAN','ALIEN MATRIARCH','ABYSSAL BEHEMOTH','SOLAR ANNIHILATOR','QUANTUM EXECUTIONER','CELESTIAL HARBINGER','GALACTIC GUARDIAN','GALACTIC OVERLORD'];
const SECTORS=[
 {name:'FRONTEIRA ESPACIAL',color:'#24afff',fog:'#03102b',event:'CINTURÃO DE ASTEROIDES'},
 {name:'ZONA DE GUERRA',color:'#ff6d42',fog:'#170a19',event:'FRAGMENTOS DE BATALHA'},
 {name:'NEBULOSA SOMBRIA',color:'#ba5eff',fog:'#18072e',event:'TEMPESTADE DE PLASMA'},
 {name:'IMPÉRIO MECÂNICO',color:'#ffb649',fog:'#161523',event:'DEFESAS ORBITAIS'},
 {name:'FRONTEIRA ALIENÍGENA',color:'#65ffb2',fog:'#051e20',event:'ESPOROS DO VAZIO'},
 {name:'NÚCLEO GALÁCTICO',color:'#ffd373',fog:'#20132e',event:'FLUXO QUÂNTICO'},
 {name:'BATALHA FINAL',color:'#ff345d',fog:'#28091a',event:'O FIM DO IMPÉRIO'}
];
const sectorFor=p=>p===20?6:p<=3?0:p<=6?1:p<=9?2:p<=12?3:p<=15?4:5;
const POWERUPS=[
 ['repair','REPARAR','#50ff9d'],['shield','ESCUDO','#35baff'],['triple','TIRO TRIPLO','#ffee55'],['rapid','CADÊNCIA','#ffb24b'],
 ['damage','PODER +','#fa6cff'],['missiles','MÍSSEIS','#ff6e5d'],['freeze','TEMPO LENTO','#92ffff'],['nova','SUPERNOVA','#ffde74'],
 ['magnet','ÍMÃ','#ffba9b'],['score','PONTOS 2X','#e8a7ff'],['quad','TIRO QUÁDRUPLO','#d9fe6d'],['invuln','INVULNERÁVEL','#fff'],
 ['drone','DRONE ALIADO','#68ffcf'],['electric','RAIO ELÉTRICO','#78adff'],['super','SUPERCARGA','#ff4bde']
];
const defaultSave={coins:0,maxPhase:1,selectedShip:'valkyrie',unlockedShips:['valkyrie'],upgrades:{dmg:1,spd:1,hp:1,mag:1},achievements:[],best:0,xp:0,level:1,completed:[],bossKills:0,totalKills:0,totalCoins:0,settings:{}};
let saveData; try { const old=JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY)||'null');saveData={...defaultSave,...old,upgrades:{...defaultSave.upgrades,...(old?.upgrades||{})}}; } catch {saveData=structuredClone(defaultSave);}
function persist(){try{localStorage.setItem(CONFIG.SAVE_KEY,JSON.stringify(saveData));}catch{}}
let waveNumber=0,spawnedTotal=0,peakEnemies=0,enemyFireClock=0,enemyShotsThisSecond=0,enemyShotWindow=0;let state='MENU',phase=1,score=0,currentCoins=0,killsCount=0,elapsed=0,waveClock=0,boss=null,miniBoss=null,player=null,entities=[],shots=[],items=[],particles=[],background=[],banner='',bannerTime=0,shake=0,selectedDifficulty='NORMAL',lastTime=0,screenWidth=0,screenHeight=0,missionBossSpawned=false,miniBossSpawned=false,phaseStartScore=0,phaseStartCoins=0,phaseKills=0,stageCompleted=0,stageTime=0,stageSurvival=0;
const WEAPONS=[{name:'LASER DUPLO',type:'laser',dmg:1,rate:1},{name:'CANHÃO DE PLASMA',type:'plasma',dmg:1.75,rate:.75},{name:'FEIXE QUÂNTICO',type:'beam',dmg:.8,rate:1.8},{name:'CANHÃO DE PARTÍCULAS',type:'particles',dmg:1.55,rate:1.1},{name:'RAJADA DE FÓTONS',type:'rapid',dmg:.7,rate:2.5},{name:'LASER PERFURANTE',type:'pierce',dmg:1.3,rate:.83},{name:'TORPEDO DE ÍONS',type:'ion',dmg:2.5,rate:.5},{name:'PULSO ESTELAR',type:'pulse',dmg:1.5,rate:.85}];
const STAGE_NAMES=['PORTÃO DA FRONTEIRA','NAVEGAÇÃO DE ASTEROIDES','TERROR CIBERNÉTICO','ECO DA BATALHA','CERCO ESCARLATE','CORREDOR DE DESTRUIÇÃO','ENTRADA NA NEBULOSA','TEMPESTADE VIOLETA','SEGREDOS DO VAZIO','FORJA DOS TITÃS','DEFESAS OMEGA','TRONO MECÂNICO','PLANETA VIVO','NINHO EXTRATERRESTRE','ABISMO ORGÂNICO','CORAÇÃO SOLAR','RUPTURA QUÂNTICA','ASCENSÃO CELESTIAL','ÚLTIMA SENTINELA','GALACTIC OVERLORD'];
const EXTRA_POWERUPS=[['piercing','PERFURAÇÃO','#9efbff'],['shock','PULSO ELETROMAGNÉTICO','#f0aeff'],['barrier','BARREIRA +','#72ddff'],['healall','RESTAURAÇÃO','#71ff95'],['overdrive','OVERDRIVE','#ffe17c'],['warp','DISTORÇÃO','#a9aaff'],['gold','SUCATA EXTRA','#ffcf67'],['charged','DISPARO POTENTE','#ffb3e8'],['healplus','REPARAÇÃO EXTRA','#65ffc5'],['crit','ATAQUE CRÍTICO','#ff6c7a'],['speedboost','IMPULSO','#9ad8ff'],['cluster','SALVA DE BOMBAS','#ffc17a'],['reload','ENERGIA ESPECIAL','#eebcff'],['mirror','ESPELHO DEFENSIVO','#b2ffff'],['bonus','BÔNUS DE PONTOS','#fff49a']];POWERUPS.push(...EXTRA_POWERUPS);
const keys={};addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.code==='Escape'&&state==='PLAYING')pauseGame();else if(e.code==='Escape'&&state==='PAUSED')pauseGame();if(e.code==='KeyQ'&&state==='PLAYING'){player.weapon=(player.weapon+1)%WEAPONS.length;banner=WEAPONS[player.weapon].name;bannerTime=1.4;}if(e.code==='KeyE'&&state==='PLAYING')launchSecondary();});addEventListener('keyup',e=>keys[e.code]=false);
let pointerDown=false,pointerX=0,pointerY=0;
canvas.addEventListener('pointerdown',e=>{pointerDown=true;pointerX=e.clientX;pointerY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(pointerDown){pointerX=e.clientX;pointerY=e.clientY;}});
canvas.addEventListener('pointerup',()=>pointerDown=false);canvas.addEventListener('pointercancel',()=>pointerDown=false);
let mobileFire=false;let mobileSpecial=false;let autoFire=false;

/* Geometric 3D renderer: per-face normals, directional lighting, perspective, emissive materials, depth test. */
const render={ready:false};
function hexRGB(c){let h=c.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');let n=parseInt(h,16);return [(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];}
function setupGL(){if(!gl)return;
const vs=`attribute vec3 position;attribute vec3 normal;
uniform vec3 offset,scale,rotation,tint;uniform float aspect,glow,material;
varying vec3 vShade,vLocal,vNormal;varying float vMat;
void main(){vec3 p=position*scale;vec3 n=normal;
float cx=cos(rotation.x),sx=sin(rotation.x),cy=cos(rotation.y),sy=sin(rotation.y),cz=cos(rotation.z),sz=sin(rotation.z);
p=vec3(p.x,p.y*cx-p.z*sx,p.y*sx+p.z*cx);p=vec3(p.x*cy+p.z*sy,p.y,-p.x*sy+p.z*cy);
p=vec3(p.x*cz-p.y*sz,p.x*sz+p.y*cz,p.z);
p+=offset;float depth=28.0-p.z;
gl_Position=vec4(p.x*3.0/(depth*aspect),p.y*3.0/depth,clamp(.4-p.z*.02,-.9,.9),1.0);
float light=clamp(dot(normalize(n),normalize(vec3(-.45,.8,1.0))),0.0,1.0);
float rim=pow(1.0-max(0.0,n.z),2.0);
float spec=pow(max(dot(normalize(n),normalize(vec3(.35,.56,1.))),0.),18.0)*.43;
vShade=tint*(.32+light*.75+glow*.38)+vec3(spec+rim*.09);
vLocal=position;vNormal=n;vMat=material;
}`;
const fs=`precision mediump float;varying vec3 vShade,vLocal,vNormal;varying float vMat;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){vec3 c=vShade;vec3 p=vLocal;
if(vMat>0.5&&vMat<1.5){float grain=noise(p*9.3)*.35+noise(p*27.0)*.15+noise(p*3.1)*.5;
float strata=sin(p.y*19.0+noise(p*8.0)*9.0)*.08;
float crater=0.0;for(int i=0;i<7;i++){float t=float(i);vec3 q=normalize(vec3(sin(t*7.13),cos(t*12.4),sin(t*3.72+1.0)));float d=length(normalize(p)-q);float r=.13+mod(t,3.0)*.05;crater+=.46*(1.0-smoothstep(r*.7,r,d));crater+=.16*(smoothstep(r*.55,r*.85,d)-smoothstep(r*.90,r*1.16,d));}
c*=clamp(.64+grain+strata-crater,.20,1.32);
}else if(vMat>1.5&&vMat<2.5){float plates=step(.93,fract(p.x*8.0+noise(p*4.0)*.2))+step(.95,fract(p.y*13.0));float grain=noise(p*34.0);float scratches=step(.945,noise(vec3(p.x*49.0,p.y*1.6,p.z*3.0)));float rivets=step(.96,noise(floor(p*vec3(14.0,14.0,10.0))));c*=.69+grain*.32-plates*.17-scratches*.12+rivets*.13;}
else if(vMat>2.5&&vMat<3.5){float clouds=noise(p*4.0)*.5+noise(p*12.0)*.3+noise(p*28.0)*.2;float bands=sin(p.y*13.0+noise(p*3.0)*4.0)*.13;c*=.52+clouds*.7+bands;}
gl_FragColor=vec4(c,1.0);}`;
function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(sh));return sh;}
try{let program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);render.program=program;render.aPos=gl.getAttribLocation(program,'position');render.aNorm=gl.getAttribLocation(program,'normal');for(let name of ['offset','scale','rotation','aspect','tint','glow','material'])render[name]=gl.getUniformLocation(program,name);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);render.ready=true;}catch(err){console.error(err);$('webgl-error').textContent='Não foi possível iniciar WebGL: '+err.message;$('webgl-error').hidden=false;}}
function buildMesh(faces){const arr=[];for(let poly of faces){for(let i=1;i+1<poly.length;i++){let a=poly[0],b=poly[i],c=poly[i+1];let ab=b.map((v,j)=>v-a[j]),ac=c.map((v,j)=>v-a[j]);let n=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]];let len=Math.hypot(...n)||1;n=n.map(v=>v/len);for(let v of [a,b,c])arr.push(...v,...n);}}const data=new Float32Array(arr);let b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);return {buffer:b,count:data.length/6};}
const M={};
function initMeshes(){if(!render.ready)return;const V=(x,y,z)=>[x,y,z];
M.box=buildMesh([[V(-1,-1,1),V(1,-1,1),V(1,1,1),V(-1,1,1)],[V(1,-1,-1),V(-1,-1,-1),V(-1,1,-1),V(1,1,-1)],[V(-1,-1,-1),V(-1,-1,1),V(-1,1,1),V(-1,1,-1)],[V(1,-1,1),V(1,-1,-1),V(1,1,-1),V(1,1,1)],[V(-1,1,1),V(1,1,1),V(1,1,-1),V(-1,1,-1)],[V(-1,-1,-1),V(1,-1,-1),V(1,-1,1),V(-1,-1,1)]]);
M.diamond=buildMesh([[V(0,1.8,0),V(-1,0,1),V(1,0,1)],[V(0,1.8,0),V(1,0,1),V(1,0,-1)],[V(0,1.8,0),V(1,0,-1),V(-1,0,-1)],[V(0,1.8,0),V(-1,0,-1),V(-1,0,1)],[V(0,-1.2,0),V(1,0,1),V(-1,0,1)],[V(0,-1.2,0),V(1,0,-1),V(1,0,1)],[V(0,-1.2,0),V(-1,0,-1),V(1,0,-1)],[V(0,-1.2,0),V(-1,0,1),V(-1,0,-1)]]);
M.wing=buildMesh([[V(0,.5,.12),V(2,-.8,.12),V(.5,-.5,.12)],[V(0,.5,-.12),V(.5,-.5,-.12),V(2,-.8,-.12)],[V(0,.5,.12),V(0,.5,-.12),V(2,-.8,-.12),V(2,-.8,.12)],[V(2,-.8,.12),V(2,-.8,-.12),V(.5,-.5,-.12),V(.5,-.5,.12)]]);
const cylinder=(sides=10,taper=1)=>{let faces=[];for(let i=0;i<sides;i++){let a=i*Math.PI*2/sides,b=(i+1)*Math.PI*2/sides;let p=V(Math.cos(a),-1,Math.sin(a)),q=V(Math.cos(b),-1,Math.sin(b)),r=V(Math.cos(b)*taper,1,Math.sin(b)*taper),t=V(Math.cos(a)*taper,1,Math.sin(a)*taper);faces.push([p,q,r,t]);faces.push([V(0,1,0),t,r]);faces.push([V(0,-1,0),q,p]);}return buildMesh(faces);};M.cyl=cylinder(12,1);M.spike=cylinder(8,0);const sphere=(lat=15,lon=26,rough=false)=>{let faces=[];function point(a,b){let x=Math.cos(a)*Math.cos(b),y=Math.sin(a),z=Math.cos(a)*Math.sin(b);let perturb=rough?(1+.11*Math.sin(7*x+13*y)*Math.sin(9*z+4*y)+.055*Math.cos(23*x-5*z)*Math.sin(21*y)):1;return V(x*perturb,y*perturb,z*perturb);}for(let i=0;i<lat;i++){let a=-Math.PI/2+i*Math.PI/lat,b=-Math.PI/2+(i+1)*Math.PI/lat;for(let j=0;j<lon;j++){let c=j*Math.PI*2/lon,d=(j+1)*Math.PI*2/lon;faces.push([point(a,c),point(b,c),point(b,d),point(a,d)]);}}return buildMesh(faces);};
M.rock=sphere(15,26,true);M.planet=sphere(24,40,false);M.dome=sphere(12,20,false);M.ring=cylinder(28,1.17);
}
function mesh(type,x,y,z,sx,sy,sz,color,glow=0,rx=0,ry=0,rz=0){if(!render.ready)return;const m=M[type]||M.box;gl.bindBuffer(gl.ARRAY_BUFFER,m.buffer);gl.vertexAttribPointer(render.aPos,3,gl.FLOAT,false,24,0);gl.enableVertexAttribArray(render.aPos);gl.vertexAttribPointer(render.aNorm,3,gl.FLOAT,false,24,12);gl.enableVertexAttribArray(render.aNorm);gl.uniform3f(render.offset,x,y,z);gl.uniform3f(render.scale,sx,sy,sz);gl.uniform3f(render.rotation,rx,ry,rz);gl.uniform1f(render.aspect,canvas.width/canvas.height);gl.uniform3fv(render.tint,hexRGB(color));gl.uniform1f(render.glow,glow);gl.uniform1f(render.material,type==='rock'?1:type==='planet'?3:glow>1.2?0:2);gl.drawArrays(gl.TRIANGLES,0,m.count);}
function shipModel(x,y,z,scale,color,style=0,roll=0,thrust=1){const s=scale;const pal=['#d5e9ff','#d4b4f7','#b5d3e7','#fbe1ba','#d6cdea','#fff7ee'];let armor=pal[style%6];mesh('diamond',x,y,z,.38*s,.61*s,.32*s,armor,.18,0,0,roll);mesh('diamond',x,y+.17*s,z+.2*s,.23*s,.53*s,.2*s,color,.7,0,0,roll);mesh('box',x,y-.18*s,z-.13*s,.47*s,.14*s,.3*s,'#29374c');for(let dir of [-1,1]){mesh('wing',x+dir*.23*s,y-.05*s,z-.04*s,dir*.48*s,.55*s,.3*s,style===3?'#5b4179':'#577590',.1,0,0,roll);mesh('box',x+dir*.64*s,y-.33*s,z+.12*s,.12*s,.3*s,.18*s,color,.5);mesh('cyl',x+dir*.46*s,y-.65*s,z-.12*s,.13*s,.23*s,.13*s,'#627890',.1);mesh('spike',x+dir*.46*s,y-(.94+.17*(.5+.5*Math.sin(elapsed*31+dir))*thrust)*s,z-.13*s,.105*s,.26*s,.105*s,style===1?'#ffb049':'#19dfff',1.5,Math.PI);}
mesh('diamond',x,y+.16*s,z+.37*s,.14*s,.29*s,.1*s,'#82e9ff',1.3);
if(style===2||style===4)for(let dir of [-1,1])mesh('box',x+dir*.76*s,y-.15*s,z+.03*s,.22*s,.45*s,.25*s,'#49556d');
if(style===5)mesh('cyl',x,y-.35*s,z-.33*s,.37*s,.1*s,.37*s,'#80f9ff',1.5);
// layered armor panels, intake vents, weapon barrels, cockpit canopy, articulated fins
mesh('dome',x,y+.26*s,z+.47*s,.15*s,.38*s,.14*s,'#103859',.55);
mesh('diamond',x,y+.46*s,z+.52*s,.085*s,.20*s,.065*s,'#7ef6ff',1.4);
for(let dir of [-1,1]){
mesh('box',x+dir*.20*s,y+.11*s,z+.38*s,.075*s,.31*s,.065*s,'#15273c');
mesh('box',x+dir*.60*s,y-.19*s,z+.30*s,.13*s,.07*s,.08*s,'#d2e5f5',.24);
mesh('box',x+dir*.74*s,y-.35*s,z+.37*s,.06*s,.32*s,.06*s,'#a3d0ea',.32);
mesh('cyl',x+dir*.30*s,y+.44*s,z+.12*s,.072*s,.32*s,.074*s,'#172e41');
mesh('spike',x+dir*.30*s,y+.79*s,z+.12*s,.075*s,.20*s,.075*s,color,.7);
mesh('wing',x+dir*.38*s,y-.41*s,z+.13*s,dir*.30*s,.22*s,.07*s,color,.45);
mesh('cyl',x+dir*.45*s,y-.70*s,z-.06*s,.08*s,.12*s,.08*s,'#f3bb6a',.8);
}
mesh('box',x,y-.48*s,z+.36*s,.20*s,.07*s,.06*s,color,.55);
// Twelve distinct ship configurations: wing geometry, engine pods, upper armor and dorsal modules.
const hull=style%12;
if(hull===1||hull===7){for(let d of [-1,1]){mesh('wing',x+d*.58*s,y-.18*s,z-.09*s,d*.62*s,.25*s,.11*s,'#a73e47',.3);mesh('spike',x+d*.9*s,y+.19*s,z+.08*s,.11*s,.36*s,.10*s,color,.42);}}
if(hull===2||hull===9){for(let d of [-1,1]){mesh('box',x+d*.76*s,y-.02*s,z-.14*s,.29*s,.47*s,.35*s,'#374959',.04);mesh('box',x+d*.78*s,y+.22*s,z+.24*s,.16*s,.12*s,.05*s,color,.6);}}
if(hull===3||hull===8){for(let d of [-1,1]){mesh('spike',x+d*.79*s,y-.16*s,z+.02*s,.19*s,.72*s,.10*s,'#42345e',.13,0,0,d*.15);mesh('diamond',x+d*.9*s,y-.46*s,z+.24*s,.12*s,.18*s,.11*s,color,.9);}}
if(hull===4||hull===10){mesh('cyl',x,y-.64*s,z-.16*s,.4*s,.13*s,.37*s,'#313c57');for(let d of [-1,1])mesh('spike',x+d*.9*s,y+.35*s,z-.05*s,.21*s,.49*s,.20*s,'#ad9e7b',.14);}
if(hull===5||hull===11){for(let d of [-1,1]){mesh('ring',x+d*.49*s,y-.59*s,z+.11*s,.19*s,.04*s,.19*s,color,.72,Math.PI/2);mesh('diamond',x+d*.88*s,y+.35*s,z+.12*s,.12*s,.27*s,.13*s,'#afc5e3',.4);}}
}
function enemyModel(e){const s=e.boss?2.9:e.mini?1.7:.68;const c=e.color;const kind=e.kind%6;const archetype=e.kind%10;if(e.obstacle){mesh('rock',e.x,e.y,e.z,.92*s,1.12*s,.86*s,'#787d8f',.03,e.age*.4,e.age*.25,e.age*.18);mesh('rock',e.x+.12*s,e.y+.06*s,e.z+.10*s,.56*s,.63*s,.48*s,'#9ea3b4',.02,-e.age*.33,e.age*.16,0);for(let d of [-1,1]){mesh('box',e.x+d*.48*s,e.y-.15*s,e.z+.18*s,.19*s,.46*s,.15*s,'#495264',.10);mesh('box',e.x+d*.22*s,e.y+.28*s,e.z+.34*s,.12*s,.10*s,.07*s,c,.72);}mesh('ring',e.x,e.y,e.z-.08*s,.76*s,.06*s,.68*s,'#3f4b61',.08,Math.PI/2,e.age*.2);mesh('dome',e.x,e.y+.16*s,e.z+.46*s,.15*s,.19*s,.09*s,'#d8e4f0',.36);return;}mesh('diamond',e.x,e.y,e.z,.43*s,.53*s,.34*s,c,.17,0,0,e.roll||0);if(kind===0||kind===3){for(let dir of [-1,1]){mesh('wing',e.x+dir*.22*s,e.y,e.z,dir*.48*s,.5*s,.23*s,'#52607e',.1,0,0,e.roll||0);mesh('cyl',e.x+dir*.48*s,e.y-.33*s,e.z+.08*s,.12*s,.18*s,.12*s,'#ff5a88',1.1);}}else if(kind===1||kind===4){for(let dir of [-1,1]){mesh('box',e.x+dir*.58*s,e.y-.05*s,e.z,.27*s,.37*s,.26*s,'#7b6686');mesh('spike',e.x+dir*.61*s,e.y+.3*s,e.z,.17*s,.31*s,.17*s,c,.5);}}else{mesh('cyl',e.x,e.y,e.z,.61*s,.13*s,.6*s,'#55617a');for(let k=0;k<5;k++){let a=k*Math.PI*2/5;mesh('spike',e.x+Math.cos(a)*.55*s,e.y+Math.sin(a)*.45*s,e.z,.15*s,.27*s,.15*s,c,.4,0,0,a-Math.PI/2);}}
mesh('diamond',e.x,e.y+.12*s,e.z+.36*s,.24*s,.2*s,.13*s,e.boss?'#fff0d9':'#f1d9ff',1);mesh('dome',e.x,e.y+.02*s,e.z+.28*s,.16*s,.12*s,.08*s,'#243149',.18);for(let r=0;r<(e.kind%4)+1;r++){let a=r*Math.PI*2/((e.kind%4)+1)+.25;mesh('box',e.x+Math.cos(a)*.38*s,e.y+Math.sin(a)*.30*s,e.z+.3*s,.07*s,.16*s,.09*s,e.kind%2?'#8195bb':'#30435e',.15,0,0,a);}for(let d of [-1,1]){mesh('box',e.x+d*.18*s,e.y-.18*s,e.z+.22*s,.05*s,.18*s,.06*s,'#d7e0ed',.24);mesh('box',e.x+d*.28*s,e.y+.10*s,e.z+.15*s,.04*s,.07*s,.05*s,c,.65);}
if(!e.boss){
if(archetype===0||archetype===5){for(let dir of [-1,1]){mesh('spike',e.x+dir*.55*s,e.y+.25*s,e.z+.18*s,.09*s,.28*s,.10*s,'#cee0fa',.4);mesh('box',e.x+dir*.48*s,e.y-.1*s,e.z+.32*s,.13*s,.08*s,.10*s,c,.8);}}
if(archetype===1||archetype===6){for(let i=0;i<4;i++){let a=i*Math.PI/2+e.age*.3;mesh('spike',e.x+Math.cos(a)*.56*s,e.y+Math.sin(a)*.55*s,e.z,.11*s,.28*s,.12*s,c,.55,0,0,a);}}
if(archetype===2||archetype===7){mesh('dome',e.x,e.y,e.z+.25*s,.42*s,.30*s,.26*s,'#202b4a');mesh('ring',e.x,e.y,e.z-.25*s,.64*s,.10*s,.6*s,c,.2,Math.PI/2);}
if(archetype===3||archetype===8){for(let d of [-1,1])mesh('wing',e.x+d*.62*s,e.y-.15*s,e.z+.2*s,d*.36*s,.43*s,.13*s,c,.30);}
if(archetype===4||archetype===9){mesh('box',e.x,e.y-.55*s,e.z+.25*s,.31*s,.10*s,.15*s,c,.9);for(let d of [-1,1])mesh('cyl',e.x+d*.32*s,e.y+.40*s,e.z+.2*s,.14*s,.31*s,.14*s,'#9aaec8',.24);}
}
if(e.boss){if(e.armorActive){mesh('ring',e.x,e.y,e.z+.42*s,1.38*s,.10*s,1.38*s,'#55dfff',.95,Math.PI/2,e.age*.3);mesh('ring',e.x,e.y,e.z+.15*s,1.65*s,.07*s,1.65*s,'#8b76ff',.7,Math.PI/2,-e.age*.5);}let variant=(phase-1)%10;let t=elapsed*2;for(let dir of [-1,1]){mesh('box',e.x+dir*1.1*s,e.y+.12*s,e.z-.05*s,.27*s,.38*s,.4*s,'#465978');mesh('cyl',e.x+dir*1.1*s,e.y-.42*s,e.z+.21*s,.23*s,.29*s,.23*s,c,1);mesh('spike',e.x+dir*1.15*s,e.y+.52*s+Math.sin(t)*.07*s,e.z,.24*s,.46*s,.24*s,c,.7);}mesh('cyl',e.x,e.y,e.z-.3*s,.71*s,.15*s,.7*s,'#364863');for(let i=0;i<3+variant%5;i++){let a=i*Math.PI*2/(3+variant%5)+t*.08;mesh(variant%2?'spike':'box',e.x+Math.cos(a)*1.45*s,e.y+Math.sin(a)*.75*s,e.z-.25*s,.14*s,.28*s,.21*s,variant%3===0?'#b9c7d9':c,.37,0,0,a);}let design=(phase-1)%5;if(design===0){for(let k=-2;k<=2;k++)mesh('spike',e.x+k*.35*s,e.y+.7*s,e.z,.15*s,(.4+Math.abs(k)*.12)*s,.17*s,c,.5);}if(design===1){for(let k=-1;k<=1;k++)mesh('box',e.x+k*.82*s,e.y-.9*s,e.z-.2*s,.40*s,.22*s,.30*s,'#7786ac',.12);}if(design===2){for(let k=0;k<6;k++){let a=k*Math.PI/3+t*.14;mesh('diamond',e.x+Math.cos(a)*1.12*s,e.y+Math.sin(a)*.75*s,e.z,.12*s,.27*s,.13*s,c,.8,0,0,a);}}if(design===3){for(let k=-1;k<=1;k++)mesh('cyl',e.x+k*.75*s,e.y+1.2*s,e.z,.24*s,.7*s,.26*s,c,.5);}if(design===4){for(let dir of [-1,1])mesh('wing',e.x+dir*.88*s,e.y-.3*s,e.z,dir*.48*s,.75*s,.45*s,'#8193ba',.6);}
// Each boss has a signature silhouette detail and independently animated weapon assemblies.
let sig=(phase-1)%10;
if(sig===0||sig===5){for(let d of [-1,1]){mesh('spike',e.x+d*2.2*s,e.y-.3*s,e.z-.13*s,.22*s,.94*s,.3*s,'#637b91',.25,0,0,d*.31);mesh('box',e.x+d*1.7*s,e.y+.38*s,e.z+.32*s,.21*s,.71*s,.13*s,c,1.0);}}
if(sig===1||sig===6){for(let a=0;a<8;a++){let angle=a*Math.PI/4+t*.11;mesh('rock',e.x+Math.cos(angle)*1.7*s,e.y+Math.sin(angle)*.85*s,e.z-.4*s,.18*s,.24*s,.16*s,'#63627f');}}
if(sig===2||sig===7){for(let d of [-1,1]){mesh('wing',e.x+d*1.4*s,e.y+.15*s,e.z-.2*s,d*.95*s,.83*s,.30*s,'#492a60',.28);mesh('spike',e.x+d*.78*s,e.y+.95*s,e.z+.4*s,.25*s,.61*s,.30*s,c,1.0);}}
if(sig===3||sig===8){for(let d of [-1,1]){mesh('cyl',e.x+d*1.95*s,e.y+.45*s,e.z+.23*s,.32*s,.85*s,.38*s,'#64748a',.19);mesh('ring',e.x+d*1.95*s,e.y+1.0*s,e.z+.26*s,.28*s,.10*s,.28*s,'#ffaf73',1);}}
if(sig===4||sig===9){mesh('planet',e.x,e.y+.3*s,e.z+.5*s,.46*s,.38*s,.42*s,'#375977',.1);for(let d of [-1,1])mesh('spike',e.x+d*1.54*s,e.y-.9*s,e.z-.1*s,.30*s,.75*s,.18*s,c,.68,0,0,Math.PI);}
}}
function resize(){let b=canvas.getBoundingClientRect(), d=Math.min(devicePixelRatio||1,1.8);canvas.width=Math.round(b.width*d);canvas.height=Math.round(b.height*d);screenWidth=b.width;screenHeight=b.height;if(gl)gl.viewport(0,0,canvas.width,canvas.height);}addEventListener('resize',resize);
function colorSet(){return SECTORS[sectorFor(phase)];}
function setStageBackdrop(){const n=String(phase).padStart(2,'0');canvas.style.backgroundImage=`linear-gradient(180deg,rgba(1,5,20,.15),rgba(1,4,13,.34)),url(assets/backgrounds/stage_${n}.jpg)`;canvas.style.backgroundSize='cover';canvas.style.backgroundPosition='center';}

function makeBackground(){background=Array.from({length:145},()=>({x:rand(-12,12),y:rand(-14,14),z:rand(-18,-5),speed:rand(.2,1.8),radius:rand(.013,.065),color:Math.random()<.16?'#7fdfff':Math.random()<.16?'#ffc8a0':'#bacbe4'}));}
function renderScene(){if(!render.ready)return;let sec=colorSet();let bg=hexRGB(sec.fog);gl.clearColor(bg[0],bg[1],bg[2],.05);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(render.program);let shift=shake>0?rand(-.1,.1):0;
for(let s of background){mesh('box',s.x,s.y,s.z,s.radius,s.radius,.015,s.color,.45);}
// sector environment: orbital bodies with terrain shaders, layered stations and wreckage
const sf=sectorFor(phase);
for(let k=0;k<9;k++){
const drift=.55+k*.095, y=((k*5.8-elapsed*drift)%38+38)%38-19;
const x=Math.sin(k*19.15+sf*3.4+phase*.39)*7.4;
const z=-6-(k%4)*2.3;
const size=.50+((k*7)%6)*.18;
const colors=sf===0?['#796e66','#b1a49a','#5c8794']:sf===1?['#a3664b','#7b666c','#4f6580']:sf===2?['#7764a1','#675e91','#3c6a95']:sf===4?['#507b73','#778a73','#556b8f']:['#706e83','#887a85','#4c617d'];
mesh('rock',x,y,z,size,size*.92,size*.88,colors[k%3],.04,elapsed*.13+k,elapsed*.12,k*1.8);
if(k%3===0){mesh('rock',x+size*.58,y+size*.23,z+.18,size*.19,size*.13,size*.12,'#342f3d',0,0,0,elapsed*.06);}
}
// distant textured planet, atmospheric moons and illuminated rings
let planetX=sf%2?-7.5:7.6;
mesh('planet',planetX,7.4,-19,4.5,4.5,4.5,['#496caa','#af624c','#78519d','#ad8955','#4d8e84','#c38c58','#a24460'][sf],.07,elapsed*.008,elapsed*.025);
mesh('ring',planetX,7.4,-19,5.5,.09,5.5,sec.color,.20,Math.PI*.47,0,.2);
mesh('planet',sf%2?6.4:-6.6,-5.3,-21,1.6,1.6,1.6,'#8699b5',.11,0,elapsed*.04);
if(sf===1||sf===3||sf===5){
for(let k=0;k<3;k++){let y=((k*11-elapsed*.72)%34+34)%34-17;let side=k%2?-6.6:6.6;
mesh('cyl',side,y,-7,.43,1.8,.43,'#3b526b',0,0,0,k*.5);
mesh('box',side,y,-6.5,.22,1.35,.20,'#7e92ae',.2);
for(let d of [-1,1]){mesh('wing',side+d*.25,y-.3,-6.5,d*.65,.75,.3,'#35435b');mesh('box',side+d*.85,y-.52,-6.2,.08,.12,.13,sec.color,.65);}
mesh('cyl',side,y+1,-6.3,.62,.11,.6,sec.color,.45,Math.PI/2);
}}
for(let p of particles){mesh('box',p.x,p.y,p.z,.045*p.life,.055*p.life,.04,p.color,.9);}
for(let it of items){const angle=elapsed*2.3;mesh('diamond',it.x,it.y,1.8,.27,.30,.17,it.color,1.4,0,0,angle);mesh('ring',it.x,it.y,1.75,.41,.05,.41,'#b2ddf0',.55,Math.PI/2,angle);let idx=POWERUPS.findIndex(p=>p[0]===it.type);if(idx%3===0)mesh('spike',it.x,it.y,2.10,.11,.20,.08,'#f4f7ff',1);else if(idx%3===1)mesh('box',it.x,it.y,2.08,.12,.12,.10,'#f4f7ff',1);else mesh('dome',it.x,it.y,2.08,.12,.12,.07,'#f4f7ff',1);}
for(let sh of shots){if(sh.type==='laser'){mesh('box',sh.x,sh.y,sh.z,.085,.44,.09,sh.color,2.3);mesh('spike',sh.x,sh.y-.23,sh.z-.09,.08,.32,.08,'#76c7f7',1.3,0,0,Math.PI);}else if(sh.type==='plasma'){mesh('dome',sh.x,sh.y,sh.z,.20,.31,.18,sh.color,2.3);mesh('spike',sh.x,sh.y-.37,sh.z-.12,.08,.27,.09,'#95b8ff',1.5,0,0,Math.PI);}else{mesh('spike',sh.x,sh.y,sh.z,.14,.29,.15,sh.color,1.8,0,0,sh.vy<0?0:Math.PI);}}
for(let e of entities){if(e.hp>0)enemyModel(e);}
if(player){if(!(player.invuln>0&&Math.floor(elapsed*11)%2)){shipModel(player.x+shift,player.y,2,1.12,player.ship.color,SHIPS_DATABASE.indexOf(player.ship),player.vx*.04);if(player.shield>0){mesh('cyl',player.x,player.y,1.75,.91,.09,.91,'#48ccff',.48,Math.PI/2);}}for(let d of player.drones){mesh('diamond',player.x+Math.cos(elapsed*2+d)*1.4,player.y+Math.sin(elapsed*2+d)*.65,2,.15,.2,.15,'#6effd9',1.2);}}
}
function audio(type){try{let A=audio.ctx||(audio.ctx=new (window.AudioContext||window.webkitAudioContext)());if(A.state==='suspended')A.resume();let o=A.createOscillator(),g=A.createGain(),t=A.currentTime;const val={fire:[680,.027,.07],hit:[130,.12,.12],boom:[75,.18,.32],pick:[800,.09,.13],special:[360,.14,.34],warning:[460,.08,.18]}[type]||[200,.05,.08];o.type=type==='fire'?'triangle':'sawtooth';o.frequency.setValueAtTime(val[0],t);o.frequency.exponentialRampToValueAtTime(Math.max(30,val[0]*.4),t+val[2]);g.gain.setValueAtTime(val[1]*volume,t);g.gain.exponentialRampToValueAtTime(.001,t+val[2]);o.connect(g).connect(A.destination);o.start(t);o.stop(t+val[2]);}catch{}}
let volume=.6;let music=null;let musicVolume=.32;let musicSector=-1;function syncMusic(){if(typeof Audio!=='function')return;let sec=sectorFor(phase);if(!music){music=new Audio();music.loop=true;music.preload='auto';}if(musicSector!==sec){musicSector=sec;music.src=`assets/audio/sector_${sec+1}.ogg`;}music.volume=musicVolume;music.play().catch(()=>{});}
function playerCreate(){let ship=SHIPS_DATABASE.find(v=>v.id===saveData.selectedShip)||SHIPS_DATABASE[0];let maxHp=Math.round((110+saveData.upgrades.hp*20)*ship.hpMult);return {x:0,y:-6,ship,vx:0,vy:0,hp:maxHp,maxHp,shield:0,invuln:1.1,energy:100,cool:0,crit:0,speedboost:0,mirror:0,special:0,weapon:0,rapid:0,damage:0,triple:0,quad:0,missiles:0,freeze:0,score:0,drone:0,electric:0,super:0,drones:[0,Math.PI]};}
function resetStage(newPhase=1){phase=newPhase;elapsed=0;waveClock=.36;waveNumber=0;spawnedTotal=0;peakEnemies=0;enemyFireClock=0;enemyShotsThisSecond=0;enemyShotWindow=0;entities=[];shots=[];items=[];particles=[];boss=null;miniBoss=null;missionBossSpawned=false;miniBossSpawned=false;phaseStartScore=score;phaseStartCoins=currentCoins;phaseKills=0;stageSurvival=0;player=playerCreate();banner=`FASE ${phase}: ${STAGE_NAMES[phase-1]}`;bannerTime=4;makeBackground();setStageBackdrop();hideBossHPBar();updateHUD();}
function startGame(){resetStage(phase);state='PLAYING';switchScreen('hud');syncMusic();}
function newRun(){score=0;currentCoins=0;killsCount=0;phase=clamp(saveData.maxPhase||1,1,20);startGame();}
function difficulty(){let v=selectedDifficulty==='HARD'?1.34:selectedDifficulty==='NIGHTMARE'?1.73:1;let ramp=Math.min(.36,elapsed/110);return {hp:v*(.86+(phase-1)*.083+ramp),speed:(1+(v-1)*.38)*(.80+phase*.018+ramp*.26),damage:(1+(v-1)*.66)*(.62+phase*.034+ramp*.30),rate:(selectedDifficulty==='NIGHTMARE'?1.50:selectedDifficulty==='HARD'?1.25:1)*(1+Math.min(.18,elapsed/230))};}
function enemySpawn(kind,mini=false,big=false){let def=ENEMIES[kind%ENEMIES.length],d=difficulty();let b=big?{x:0,y:11,z:.7,hp:Math.round((440+phase*68)*d.hp*(phase===20?1.25:1)),maxHp:0,speed:.7,color:phase===20?'#ff3464':colorSet().color,kind:phase%6,boss:true,mini:false,dir:1,timer:1.05,age:0,roll:0,minionClock:6.4,stage:1,patternIndex:0,shieldClock:0}:mini?{x:rand(-2.5,2.5),y:11,z:.9,hp:Math.round((95+phase*14)*d.hp),maxHp:0,speed:.8,color:'#ffbf72',kind:phase%6,boss:false,mini:true,dir:1,timer:1.5,age:0,roll:0}:{x:rand(-4.65,4.65),y:rand(7.65,8.45),z:.45,hp:Math.max(16,Math.round(def[1]*d.hp)),maxHp:0,speed:def[2]*d.speed,color:def[4],kind:def[3],boss:false,mini:false,dir:Math.random()>.5?1:-1,timer:rand(2.1,3.3),age:0,roll:0};b.maxHp=b.hp;entities.push(b);if(big){boss=b;showBossHPBar();banner=BOSSES[phase-1];bannerTime=3.6;audio('warning');}if(mini){miniBoss=b;banner='ALERTA • '+MINIBOSSES[((phase-4)%MINIBOSSES.length+MINIBOSSES.length)%MINIBOSSES.length];bannerTime=2;}}
// Wave director: retain a busy battlefield without saturating the dodge lanes.
// Early phases allow 5–8 simultaneous enemies. Later phases progressively grow.
function spawnWave(){
 if(missionBossSpawned||state!=='PLAYING')return;
 const live=entities.filter(e=>e.hp>0&&!e.boss&&!e.mini&&!e.obstacle).length;
 const timePressure=Math.min(2,Math.floor(elapsed/19));
 const cap=Math.min(18, (phase<=3?5+phase:7+Math.floor(phase*.45))+timePressure);
 const available=Math.max(0,cap-live);
 if(!available)return;
 const count=Math.min(available,phase<=2?2:phase<=5?3:phase<=12?4:5);
 const unlock=clamp(4+Math.floor(phase*1.55),4,ENEMIES.length);
 // Alternating left/right groups leave the centre or one flank open for evasion.
 const side=waveNumber%2===0?-1:1;
 const center=side*(1.9+rand(0,.5));
 for(let i=0;i<count;i++){
  let kind=Math.floor(rand(0,unlock));
  enemySpawn(kind);
  const e=entities[entities.length-1];
  e.x=clamp(center+(i-(count-1)/2)*1.05,-4.7,4.7);
  e.y=7.45+i*.46;
  // Stagger first shots: not every enemy fires as soon as it appears.
  e.timer=2.5+i*.4+rand(0,.8);
 }
 spawnedTotal+=count;waveNumber++;peakEnemies=Math.max(peakEnemies,live+count);
}
function shootPlayer(){if(!player)return;const p=player;let weapon=WEAPONS[p.weapon];let base=(9+saveData.upgrades.dmg*3)*p.ship.dmgMult*(p.damage>0?1.65:1)*(p.super>0?1.35:1)*(p.crit>0?1.55:1);
const add=(x,y,vx,vy,dmg,color,type='laser',pierce=0)=>shots.push({x,y,z:2,vx,vy,damage:dmg,owner:'player',color,life:3,type,pierce,hit:new Set()});
let offsets=p.quad>0?[-.44,-.15,.15,.44]:p.triple>0?[-.37,0,.37]:[-.19,.19];let color=p.super>0?'#ff71fb':p.ship.color;
if(p.weapon===0){for(let x of offsets)add(p.x+x,p.y+.85,x*.22,15,base,color);}
else if(p.weapon===1){add(p.x,p.y+1,0,11,base*1.75,'#ff91ec','plasma');}
else if(p.weapon===2){for(let x of [-.32,0,.32])add(p.x+x,p.y+.85,x*.55,19,base*.53,'#a4eaff','laser',1);}
else if(p.weapon===3){for(let x of [-.46,-.15,.15,.46])add(p.x+x,p.y+.8,x*1.1,13,base*.56,'#cfa3ff','plasma');}
else if(p.weapon===4){add(p.x,p.y+.95,rand(-.65,.65),18,base*.67,'#8affa1','laser');}
else if(p.weapon===5){add(p.x,p.y+.9,0,14,base*1.45,'#ffe7a1','laser',3);}
else if(p.weapon===6){add(p.x,p.y+.9,0,8,base*2.65,'#ffad65','missile');}
else{for(let a=-2;a<=2;a++)add(p.x,p.y+.9,a*1.5,13,base*.56,'#ffb7dc','plasma');}
if(p.drone>0){for(let x of [-1.05,1.05])add(p.x+x,p.y+.1,0,13,base*.4,'#77ffba');}
if(p.missiles>0&&Math.random()<.35)add(p.x,p.y+.7,0,11,base*1.75,'#ffc44e','missile');
audio('fire');}
function launchSecondary(){if(!player||player.energy<40)return;player.energy-=40;let targets=entities.filter(e=>e.hp>0).sort((a,b)=>distance(a,player)-distance(b,player)).slice(0,5);for(let e of targets){shots.push({x:player.x,y:player.y+.5,z:1.6,vx:0,vy:8,damage:48*player.ship.dmgMult,owner:'player',color:'#ffba58',life:4,type:'homing',target:e,pierce:0,hit:new Set()});}if(targets.length===0)player.energy+=40;else audio('special');}

// V7.4: alterações restritas aos chefes. As ondas normais mantêm o balanceamento V7.3.
function bossSummonMinions(e){
 if(!e||e.hp<=0||!player)return;
 const live=entities.filter(a=>a.hp>0&&!a.boss&&!a.mini&&!a.obstacle).length;
 const limit=e.stage===3?7:5;
 const amount=Math.min(limit-live,e.stage===3?3:2);
 if(amount<=0)return;
 const base=(phase*3+e.patternIndex*2)%ENEMIES.length;
 for(let i=0;i<amount;i++){
  enemySpawn((base+i*3)%ENEMIES.length);
  const m=entities[entities.length-1];
  m.x=clamp(e.x+(i-(amount-1)/2)*2.05,-4.6,4.6);
  m.y=7.4+i*.35;
  m.hp=Math.max(19,Math.round(m.hp*.85));m.maxHp=m.hp;
  m.timer=1.65+i*.5;
  m.bossMinion=true;
 }
 banner='CHEFE INVOCANDO REFORÇOS!';bannerTime=1.7;
}
function bossFire(e){
 const active=shots.filter(sh=>sh.owner==='enemy').length;
 const cap=Math.min(34,18+Math.floor(phase*.6));
 if(active>=cap)return;
 const room=Math.min(12,cap-active);
 let fired=0;
 const shot=(x,angle,mult=1,color='#ff529c')=>{
  if(fired>=room)return;
  const speed=(e.stage===3?4.9:4.25)*(selectedDifficulty==='NIGHTMARE'?1.15:1);
  shots.push({x,y:e.y-.75,z:1.25,vx:Math.sin(angle)*speed,vy:-Math.cos(angle)*speed,damage:(e.stage===3?9:7)*difficulty().damage*mult,owner:'enemy',color,life:6,type:'missile'});
  fired++;
 };
 const aim=clamp(Math.atan2(player.x-e.x,Math.max(1,e.y-player.y)),-.95,.95);
 const pattern=e.patternIndex++%5;
 if(pattern===0){ // leque com corredor entre projéteis
  const n=e.stage===1?3:e.stage===2?5:7;
  for(let i=0;i<n;i++)shot(e.x,(i-(n-1)/2)*.20);
 }else if(pattern===1){ // rajada precisa, com dispersão moderada
  for(let i=-1;i<=1;i++)shot(e.x,aim+i*.18,1.05,'#ffb45f');
 }else if(pattern===2){ // tiros vindos das torres laterais
  for(let side of [-1,1])for(let i=0;i<(e.stage===3?3:2);i++)shot(e.x+side*1.2,aim+side*(.1+i*.18),.9,'#b989ff');
 }else if(pattern===3){ // onda rotativa
  const n=e.stage===1?3:5;
  for(let i=0;i<n;i++)shot(e.x,Math.sin(e.age*1.8+i*.8)*.64,1,'#ff6f9a');
 }else{ // leque dirigido: mira no jogador sem cobrir toda a tela
  const n=e.stage===3?5:3;
  for(let i=0;i<n;i++)shot(e.x,aim+(i-(n-1)/2)*.19,1,'#ffd078');
 }
}
function bossUpdate(e,dt){
 const ratio=e.hp/e.maxHp;
 const nextStage=ratio<=.34?3:ratio<=.68?2:1;
 if(nextStage>e.stage){
  e.stage=nextStage;
  e.timer=.7;e.minionClock=Math.min(e.minionClock,2.2);
  banner=nextStage===3?'CHEFE EM FÚRIA!':'CHEFE: SEGUNDA ETAPA!';bannerTime=2.2;
  explode(e.x,e.y,e.color,18);
 }
 e.minionClock-=dt;
 if(e.minionClock<=0){bossSummonMinions(e);e.minionClock=e.stage===3?8.5:e.stage===2?10:12;}
 // Defesa intermitente: não é invencibilidade, apenas reduz o dano.
 e.shieldClock=(e.shieldClock+dt)%12;
 e.armorActive=e.stage>=2&&e.shieldClock<2.4;
}
function bulletEnemy(e,angle=0){let d=difficulty(),fast=e.boss?4.15:3.0;shots.push({x:e.x,y:e.y-.6,z:1,vx:Math.sin(angle)*fast,vy:-Math.cos(angle)*fast*d.speed,damage:(e.boss?11:6)*d.damage,owner:'enemy',color:e.boss?'#ff529c':'#ffad61',life:6,type:'missile'});}
function explode(x,y,c,count=14){audio('boom');for(let j=0;j<count;j++)particles.push({x,y,z:1,vx:rand(-2.8,2.8),vy:rand(-2.8,2.8),life:rand(.3,1),color:c});}
function defeatEnemy(e){if(e.hp<=-100000)return;e.hp=-100001;let isBoss=e.boss;explode(e.x,e.y,e.color,isBoss?55:e.mini?30:12);let gained=isBoss?4000:e.mini?700:100;score+=gained*(player.score>0?2:1);killsCount++;phaseKills++;saveData.totalKills=(saveData.totalKills||0)+1;player.energy=Math.min(100,player.energy+(isBoss?30:3));
if(isBoss){boss=null;hideBossHPBar();let reward=phase*35+60;currentCoins+=reward;saveData.coins+=reward;saveData.totalCoins+=reward;saveData.bossKills++;saveData.xp+=phase*55+120;saveData.level=1+Math.floor(Math.sqrt(saveData.xp/220));saveData.maxPhase=Math.max(saveData.maxPhase,Math.min(20,phase+1));if(!saveData.completed.includes(phase))saveData.completed.push(phase);saveData.best=Math.max(saveData.best,score);persist();stageCompleted=phase;stageTime=elapsed;state='RESULTS';$('result-title').textContent=phase===20?'GALÁXIA SALVA':'MISSÃO CONCLUÍDA';$('result-stage').textContent=`FASE ${phase} — ${STAGE_NAMES[phase-1]}`;$('result-score').textContent=(score-phaseStartScore).toLocaleString('pt-BR');$('result-kills').textContent=phaseKills;$('result-coins').textContent=(currentCoins-phaseStartCoins).toLocaleString('pt-BR');$('result-xp').textContent=phase*55+120;$('result-next').textContent=phase===20?'FINALIZAR CAMPANHA':'PRÓXIMA MISSÃO';switchScreen('results');return;}
else{if(Math.random()<.14||e.mini)items.push(makeItem(e.x,e.y));let coins=e.mini?18:5;currentCoins+=coins;saveData.coins+=coins;saveData.totalCoins+=coins;if(killsCount%8===0)persist();}}
function nextMission(){if(stageCompleted>=20){endGame(true);return;}phase=stageCompleted+1;startGame();}

function makeItem(x,y){let p=POWERUPS[Math.floor(Math.random()*POWERUPS.length)];return {x,y,z:1,type:p[0],name:p[1],color:p[2],life:9};}
function powerup(it){const p=player;switch(it.type){case'repair':p.hp=Math.min(p.maxHp,p.hp+55);break;case'healall':p.hp=p.maxHp;break;case'shield':p.shield=8;break;case'barrier':p.shield=17;break;case'triple':p.triple=18;break;case'quad':p.quad=14;break;case'rapid':p.rapid=18;break;case'damage':p.damage=19;break;case'missiles':p.missiles=18;break;case'freeze':case'warp':p.freeze=12;break;case'nova':case'shock':for(let e of [...entities]){e.hp-=110+phase*5;if(e.hp<=0)defeatEnemy(e);}shots=shots.filter(s=>s.owner==='player');break;case'magnet':for(let item of items)item.x+=(p.x-item.x)*.8;break;case'score':p.score=20;break;case'invuln':p.invuln=7;break;case'drone':p.drone=25;break;case'electric':p.electric=20;break;case'super':case'overdrive':p.super=20;p.rapid=20;break;case'piercing':p.weapon=5;break;case'charged':p.weapon=6;break;case'gold':saveData.coins+=80;currentCoins+=80;break;case'bonus':score+=1000*phase;break;case'healplus':p.hp=Math.min(p.maxHp,p.hp+90);break;case'crit':p.crit=18;break;case'speedboost':p.speedboost=18;break;case'cluster':p.energy=100;launchSecondary();break;case'reload':p.energy=100;p.special=0;break;case'mirror':p.mirror=14;break;}banner=it.name;bannerTime=1.2;audio('pick');}

function activateSpecial(){if(!player||player.special>0)return;player.special=player.ship.id==='chrono'?16:12;player.shield=player.ship.id==='aegis'?10:3;player.invuln=player.ship.id==='phantom'?5:2;let power=player.ship.id==='titan'?140:player.ship.id==='phoenix'?110:player.ship.id==='chrono'?115:65;for(let e of [...entities]){e.hp-=power*player.ship.dmgMult;if(e.hp<=0)defeatEnemy(e);}if(player.ship.id==='chrono')player.freeze=8;if(player.ship.id==='phoenix')player.super=10;if(player.ship.id==='phantom')player.rapid=9;if(player.ship.id==='seraph')player.electric=15;if(player.ship.id==='reaper')player.crit=15;if(player.ship.id==='specter'){player.invuln=6;player.speedboost=14;}if(player.ship.id==='leviathan'){player.shield=13;player.hp=Math.min(player.maxHp,player.hp+65);}if(player.ship.id==='nova'){player.super=18;player.rapid=12;}if(player.ship.id==='eclipse'){player.freeze=10;player.electric=12;player.super=13;}shots=shots.filter(x=>x.owner==='player');explode(player.x,player.y,player.ship.color,28);audio('special');}
function hurt(n){if(player.invuln>0||player.shield>0)return;if(player.mirror>0){player.energy=Math.min(100,player.energy+8);return;}player.hp-=n;player.invuln=1.5;shake=.22;audio('hit');explode(player.x,player.y,'#63eaff',10);if(player.hp<=0){player.hp=0;endGame(false);}}
function update(dt){dt=Math.min(dt,.045);if(state!=='PLAYING')return;elapsed+=dt;waveClock-=dt;enemyFireClock-=dt;enemyShotWindow+=dt;if(enemyShotWindow>=1){enemyShotWindow-=1;enemyShotsThisSecond=0;}shake=Math.max(0,shake-dt);bannerTime=Math.max(0,bannerTime-dt);
for(let s of background){s.y-=dt*(s.speed*2.5);if(s.y< -14){s.y=14;s.x=rand(-12,12);}}
let p=player,dx=0,dy=0;if(keys.KeyA||keys.ArrowLeft)dx--;if(keys.KeyD||keys.ArrowRight)dx++;if(keys.KeyW||keys.ArrowUp)dy++;if(keys.KeyS||keys.ArrowDown)dy--;let norm=Math.hypot(dx,dy)||1;dx/=norm;dy/=norm;
if(pointerDown){let b=canvas.getBoundingClientRect(),tx=(pointerX-b.left)/b.width*11-5.5,ty=(.5-(pointerY-b.top)/b.height)*19;dx=clamp((tx-p.x)*2,-1,1);dy=clamp((ty-p.y)*2,-1,1);}
p.vx=dx;p.vy=dy;p.x=clamp(p.x+dx*p.ship.speed*(p.speedboost>0?1.33:1)*dt,-5.1,5.1);p.y=clamp(p.y+dy*p.ship.speed*(p.speedboost>0?1.33:1)*dt,-8.1,6.6);
for(let v of ['invuln','shield','special','triple','quad','rapid','damage','missiles','freeze','score','drone','electric','super','crit','speedboost','mirror'])p[v]=Math.max(0,p[v]-dt);p.energy=Math.min(100,p.energy+dt*1.8);
p.cool-=dt;if((keys.Space||pointerDown||mobileFire)&&p.cool<=0){shootPlayer();p.cool=Math.max(.075,.28-(saveData.upgrades.spd*.010))/WEAPONS[p.weapon].rate*(p.rapid>0?.55:1);}
if(keys.ShiftLeft||keys.ShiftRight||mobileSpecial){activateSpecial();mobileSpecial=false;}
if(waveClock<=0&&!missionBossSpawned){spawnWave();const live=entities.filter(e=>e.hp>0&&!e.boss&&!e.mini).length;const cap=Math.min(18,(phase<=3?5+phase:7+Math.floor(phase*.45))+Math.min(2,Math.floor(elapsed/19)));waveClock=live>=cap?.85:Math.max(1.2,2.15-phase*.03-elapsed*.008);}
if(phase>=3&&elapsed>9&&elapsed<46&&Math.random()<dt*(phase>=13?.68:phase>=8?.44:.26)){let loc=rand(-4.8,4.8);entities.push({x:loc,y:11,z:.2,hp:Math.round(20*difficulty().hp),maxHp:Math.round(20*difficulty().hp),speed:2.8+phase*.04,color:colorSet().color,kind:10,boss:false,mini:false,dir:1,timer:99,age:0,roll:0,obstacle:true});}
// a mini-boss during the stage, boss after full mission preparation
if(elapsed>18&&phase>=3&&!miniBossSpawned&&!boss){enemySpawn((phase*3)%ENEMIES.length,true);miniBossSpawned=true;}
if(elapsed>42+Math.min(8,phase*.4)&&!missionBossSpawned){missionBossSpawned=true;entities=entities.filter(e=>e.mini);enemySpawn(phase%ENEMIES.length,false,true);}
for(let e of [...entities]){e.age+=dt;let s=e.speed*(p.freeze>0?.5:1);if(e.boss){e.y=Math.max(5.2,e.y-dt*s*2);e.x=Math.sin(elapsed*(e.stage===3?1.25:.8))*Math.min(3.2,1+phase*.08);bossUpdate(e,dt);}else{e.y-=s*dt;if([1,7,13,19].includes(e.kind))e.x+=Math.sin(e.age*3+e.kind)*dt*1.3;if([2,7,21,27,31,38].includes(e.kind))e.x+=(p.x-e.x)*dt*(e.kind===2?.32:.18);if([20,22,32,34].includes(e.kind))e.x+=Math.sin(e.age*(1.3+e.kind*.04)+e.kind)*dt*1.5;if(e.kind===35&&e.age>4&&Math.floor(e.age)%5===0&&Math.random()<dt*.8)enemySpawn(15);if(e.kind===11&&e.age%1<dt){for(let ally of entities){if(ally!==e&&Math.hypot(ally.x-e.x,ally.y-e.y)<3.2)ally.hp=Math.min(ally.maxHp,ally.hp+3);}}if(e.mini){e.y=Math.max(5.1,e.y);e.x=Math.sin(e.age)*3;}}
e.x=clamp(e.x,-5.2,5.2);e.timer-=dt;if(e.timer<=0&&e.y<8.7){e.timer=(e.boss?(e.stage===3?.86:e.stage===2?1.02:1.24):e.mini?1.6:rand(2.2,3.25))/difficulty().rate;if(e.boss){bossFire(e);}else if(e.kind!==11&&!e.obstacle){const activeShots=shots.reduce((n,b)=>n+(b.owner==='enemy'?1:0),0);const shotCap=Math.min(19,6+Math.floor(phase*.45)+Math.floor(elapsed/20));const shotsPerSecond=Math.min(13,4+Math.floor(phase*.30)+Math.floor(elapsed/17));if(enemyFireClock<=0&&activeShots<shotCap&&enemyShotsThisSecond<shotsPerSecond){let aim=Math.atan2(p.x-e.x,e.y-p.y)*.65;bulletEnemy(e,aim);enemyShotsThisSecond++;enemyFireClock=phase<=3?.32:Math.max(.12,.32-phase*.008);if([4,9,14,16,19,25,28,29,30,33,36,39].includes(e.kind)&&phase>=7&&activeShots<shotCap-2&&enemyShotsThisSecond<=shotsPerSecond-2){bulletEnemy(e,aim-.28);bulletEnemy(e,aim+.28);enemyShotsThisSecond+=2;}}}}if(e.y<-10&&!e.boss&&!e.mini){e.hp=0;}if(Math.hypot(e.x-p.x,e.y-p.y)<(e.boss?1.7:e.mini?1.2:.75))hurt(e.boss?17:12);}
entities=entities.filter(e=>e.hp>0);
for(let sh of [...shots]){if(sh.type==='homing'&&sh.target?.hp>0){let ax=sh.target.x-sh.x,ay=sh.target.y-sh.y,len=Math.hypot(ax,ay)||1;sh.vx=ax/len*9;sh.vy=ay/len*9;}sh.x+=sh.vx*dt;sh.y+=sh.vy*dt;sh.life-=dt;if(sh.owner==='player'){for(let e of [...entities]){if(e.hp<=0||sh.hit?.has(e))continue;if(Math.hypot(sh.x-e.x,sh.y-e.y)<(e.boss?1.75:e.mini?1.1:.65)){e.hp-=sh.damage*(e.boss&&e.armorActive?.55:1);sh.hit?.add(e);if(!(sh.pierce>0)){sh.life=0;}else sh.pierce--;for(let i=0;i<4;i++)particles.push({x:sh.x,y:sh.y,z:2,vx:rand(-2,2),vy:rand(-2,2),life:.4,color:sh.color});if(e.hp<=0)defeatEnemy(e);break;}}}else if(distance(sh,p)<.52){sh.life=0;hurt(sh.damage);}}
shots=shots.filter(sh=>sh.life>0&&Math.abs(sh.y)<14&&Math.abs(sh.x)<9).slice(-270);
for(let it of items){it.y-=dt*.9;it.life-=dt;if(Math.hypot(it.x-p.x,it.y-p.y)<(saveData.upgrades.mag*.18+.6)){it.life=0;powerup(it);}}items=items.filter(it=>it.life>0);
for(let pt of particles){pt.x+=pt.vx*dt;pt.y+=pt.vy*dt;pt.life-=dt;}particles=particles.filter(pt=>pt.life>0).slice(-230);
if(p.electric>0&&Math.random()<dt*3){let target=entities.find(e=>Math.hypot(e.x-p.x,e.y-p.y)<5);if(target){target.hp-=7;if(target.hp<=0)defeatEnemy(target);}}
updateHUD();if(boss)updateBossHPBar();}
function switchScreen(screen){for(let [name,el] of Object.entries(screens))el?.classList.toggle('active',name===screen);$('mobile-controls').hidden=screen!=='hud';$('stage-banner').hidden=screen!=='hud';}
function showBossHPBar(){$('boss-hp-container').classList.remove('hidden');$('boss-name').textContent=BOSSES[phase-1];}
function hideBossHPBar(){$('boss-hp-container').classList.add('hidden');}
function updateBossHPBar(){$('boss-bar-inner').style.width=boss?`${100*boss.hp/boss.maxHp}%`:'0%';$('boss-phase-text').textContent=boss?(boss.stage===3?'ETAPA 3/3 • FÚRIA':boss.stage===2?'ETAPA 2/3 • BLINDAGEM':'ETAPA 1/3 • COMBATE'):'ALERTA DE CHEFE!';}
function updateHUD(){if(!player)return;$('hud-phase').textContent=phase+'/20';if($('hud-enemies'))$('hud-enemies').textContent=entities.filter(e=>e.hp>0&&!e.boss&&!e.mini).length+' · ONDA '+waveNumber;$('hud-score').textContent=score.toLocaleString('pt-BR');$('hud-coins').textContent=saveData.coins;$('hud-special').textContent=player.special>0?Math.ceil(player.special)+'s':'PRONTO';$('hud-ship-name').textContent=player.ship.name;$('health-bar').style.width=100*player.hp/player.maxHp+'%';$('health-text').textContent=Math.ceil(player.hp)+' / '+player.maxHp;$('hud-weapon').textContent=WEAPONS[player.weapon].name+' · Q ALTERAR · E TORPEDOS';$('energy-bar').style.width=player.energy+'%';$('shield-indicator').textContent=player.shield>0?'ESCUDO '+Math.ceil(player.shield)+'s':player.invuln>0?'PROTEÇÃO '+Math.ceil(player.invuln)+'s':'';$('energy-text').textContent=Math.round(player.energy)+'%';$('hud-xp').textContent='NV. '+saveData.level;$('hud-timer').textContent=missionBossSpawned?'CHEFE':Math.max(0,Math.ceil(42+Math.min(8,phase*.4)-elapsed))+'s';$('stage-banner').textContent=banner;$('stage-banner').style.opacity=bannerTime>0?'1':'0';}
function endGame(win){if(music)music.pause();state='END';saveData.best=Math.max(saveData.best,score);persist();$('go-title').textContent=win?'GALÁXIA SALVA!':'NAVE DESTRUÍDA';$('go-phase').textContent=phase;$('go-kills').textContent=killsCount;$('go-coins').textContent=currentCoins;$('go-score').textContent=score;hideBossHPBar();switchScreen('gameover');}
function pauseGame(){if(state==='PLAYING'){state='PAUSED';if(music)music.pause();$('pause-overlay').hidden=false;}else if(state==='PAUSED'){state='PLAYING';syncMusic();$('pause-overlay').hidden=true;}}
function updateHangarUI(){let box=$('hangar-ships-container');$('hangar-coins').textContent=saveData.coins;box.innerHTML='';SHIPS_DATABASE.forEach(ship=>{let owned=saveData.unlockedShips.includes(ship.id);let b=document.createElement('div');b.className='ship-card'+(saveData.selectedShip===ship.id?' selected':'');b.innerHTML=`<img class="ship-preview" src="assets/ships/${{valkyrie:'vanguard',phoenix:'phoenix',aegis:'titan',phantom:'shadow',titan:'orion',chrono:'nemesis',seraph:'orion',reaper:'phoenix',specter:'shadow',leviathan:'titan',nova:'vanguard',eclipse:'nemesis'}[ship.id]}.svg" alt="Nave ${ship.name}"><h3>${ship.name}</h3><p>${ship.desc}</p><p>VELOCIDADE ${ship.speed} • CASCO x${ship.hpMult}</p><button class="cyber-btn sm">${!owned?'DESBLOQUEAR '+ship.cost:saveData.selectedShip===ship.id?'EQUIPADA':'EQUIPAR'}</button>`;b.querySelector('button').onclick=()=>{if(!owned){if(saveData.coins<ship.cost)return;saveData.coins-=ship.cost;saveData.unlockedShips.push(ship.id);}saveData.selectedShip=ship.id;persist();updateHangarUI();};box.appendChild(b);});}
function updateWorkshopUI(){if(!$('ws-coins'))return;$('ws-coins').textContent=saveData.coins;for(let type of ['dmg','spd','hp','mag']){let level=saveData.upgrades[type];$('lvl-'+type).textContent=level;$('cost-'+type).textContent=level>=10?'MAX':level*50;$('btn-up-'+type).disabled=level>=10;}}
function buyUpgrade(type){let lvl=saveData.upgrades[type],cost=lvl*50;if(lvl>=10||saveData.coins<cost)return;saveData.coins-=cost;saveData.upgrades[type]++;persist();updateWorkshopUI();audio('pick');}
function achUI(){let list=$('achievements-list');let data=[['PRIMEIROS PASSOS',killsCount>=1||saveData.maxPhase>1],['FRONTEIRA CONQUISTADA',saveData.maxPhase>=4],['GUERREIRO DE ELITE',saveData.maxPhase>=10],['ÚLTIMO SETOR',saveData.maxPhase>=20],['COLECIONADOR',saveData.unlockedShips.length>=3],['ARSENAL AVANÇADO',saveData.upgrades.dmg>=6],['LENDÁRIO',saveData.best>=100000]];list.innerHTML=data.map(([n,ok])=>`<div class="achievement-item">${ok?'🏆':'🔒'} ${n} <b>${ok?'CONCLUÍDA':'PENDENTE'}</b></div>`).join('');}
function refreshStageSelector(){const sl=$('stage-grid');sl.innerHTML='';for(let n=1;n<=20;n++){const b=document.createElement('button');b.className='cyber-btn sm';b.textContent=(saveData.completed?.includes(n)?'★ ':'')+String(n).padStart(2,'0');b.title=STAGE_NAMES[n-1];b.disabled=n>saveData.maxPhase;b.onclick=()=>{phase=n;score=0;currentCoins=0;killsCount=0;$('stage-selector').hidden=true;startGame();};sl.appendChild(b);}}
function initialize(){resize();setupGL();initMeshes();makeBackground();for(let [id,fn] of Object.entries({'btn-play':newRun,'btn-hangar':()=>{updateHangarUI();switchScreen('hangar');},'btn-workshop':()=>{updateWorkshopUI();switchScreen('workshop');},'btn-achievements':()=>{achUI();switchScreen('achievements');},'btn-hangar-back':()=>switchScreen('menu'),'btn-ws-back':()=>switchScreen('menu'),'btn-ach-back':()=>switchScreen('menu'),'btn-restart':()=>{score=0;currentCoins=0;killsCount=0;startGame();},'result-next':nextMission,'result-menu':()=>{if(music)music.pause();state='MENU';switchScreen('menu');},'btn-menu':()=>{if(music)music.pause();state='MENU';switchScreen('menu');},'btn-up-dmg':()=>buyUpgrade('dmg'),'btn-up-spd':()=>buyUpgrade('spd'),'btn-up-hp':()=>buyUpgrade('hp'),'btn-up-mag':()=>buyUpgrade('mag'),'btn-pause':pauseGame,'btn-resume':pauseGame,'btn-special-touch':()=>mobileSpecial=true,'btn-weapon-touch':()=>{if(player){player.weapon=(player.weapon+1)%WEAPONS.length;updateHUD();}},'btn-secondary-touch':launchSecondary,'btn-stage':()=>{refreshStageSelector();$('stage-selector').hidden=false;},'btn-stage-close':()=>{$('stage-selector').hidden=true;},'btn-settings':()=>{$('settings-overlay').hidden=false;},'btn-settings-close':()=>{$('settings-overlay').hidden=true;}})){let el=$(id);if(el)el.addEventListener('click',fn);}
$('btn-fire-touch').addEventListener('pointerdown',e=>{e.preventDefault();mobileFire=true;});$('btn-fire-touch').addEventListener('pointerleave',()=>mobileFire=false);$('btn-fire-touch').addEventListener('pointerup',()=>mobileFire=false);$('btn-fire-touch').addEventListener('pointercancel',()=>mobileFire=false);
$('setting-volume').addEventListener('input',e=>{volume=+e.target.value/100;});$('setting-music').addEventListener('input',e=>{musicVolume=+e.target.value/100;if(music)music.volume=musicVolume;saveData.settings={...saveData.settings,music:musicVolume};persist();});musicVolume=saveData.settings?.music??.32;$('setting-music').value=Math.round(musicVolume*100);
$('setting-difficulty').addEventListener('change',e=>{selectedDifficulty=e.target.value;saveData.settings={...saveData.settings,difficulty:selectedDifficulty};persist();});selectedDifficulty=saveData.settings?.difficulty||'NORMAL';$('setting-difficulty').value=selectedDifficulty;
refreshStageSelector();
if(!render.ready){$('webgl-error').hidden=false;}updateWorkshopUI();switchScreen('menu');requestAnimationFrame(loop);}
function loop(t){let dt=Math.min(.045,(t-lastTime)/1000||0);lastTime=t;if(state==='PLAYING')update(dt);else{elapsed+=dt*.12;for(let s of background){s.y-=dt*s.speed*.6;if(s.y<-14)s.y=14;}}renderScene();requestAnimationFrame(loop);}
initialize();
