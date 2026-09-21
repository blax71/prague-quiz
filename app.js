const stops = [
  {title:'St. Nicholas Church', address:'Malostranské nám., Malá Strana', lat:50.0879606, lon:14.402785,
   q:'St. Nicholas Church på Malá Strana är framför allt känt som ett exempel på vilken arkitekturstil?',
   a:['Gotik','Högbarock','Art nouveau'], correct:1,
   fact:'Kyrkan räknas som ett av Prags mest värdefulla högbarockverk.'},
  {title:'Astronomiska uret', address:'Staroměstské nám. 1, Old Town', lat:50.0870215, lon:14.4207065,
   q:'Vad händer traditionellt varje hel timme vid det astronomiska uret?',
   a:['12 apostlar visar sig','En trumpetare spelar från tornet','Bron över Vltava stängs'], correct:0,
   fact:'Mellan 08:00 och 23:00 visas de tolv apostlarna varje timme.'},
  {title:'Czech Beer Museum', address:'Husova 21, Staré Město', lat:50.086001, lon:14.4179723,
   q:'Hur många våningar med interaktiv ölutställning uppger museet att besöket omfattar?',
   a:['1','3','5'], correct:1,
   fact:'Museet beskriver upplevelsen som tre våningar i 1200-talskällare.'},
  {title:'Franz Kafka – Rotating Head', address:'Charvátova / Quadrio', lat:50.0816752, lon:14.4208307,
   q:'Vad består den roterande Kafka-skulpturen främst av?',
   a:['42 rörliga lager','12 stora kugghjul','24 bronsskivor'], correct:0,
   fact:'David Černýs verk från 2014 har 42 rörliga nivåer som formar Kafkas ansikte.'},
  {title:'Café Louvre', address:'Národní 22, Nové Město', lat:50.0820693, lon:14.4186192,
   q:'Vilket år öppnade Café Louvre?',
   a:['1888','1902','1935'], correct:1,
   fact:'Café Louvre öppnade 1902 och har bland annat förknippats med Franz Kafka och Albert Einstein.'},
  {title:'Lennon Wall', address:'Velkopřevorské náměstí, Malá Strana', lat:50.0862506, lon:14.4067918,
   q:'Vad blev Lennonmuren en symbol för under kommunisttiden?',
   a:['Fred, frihet och motstånd','Fotbollskultur','Prags jazzscen'], correct:0,
   fact:'Muren blev efter John Lennons död ett symboliskt uttryck för fred, frihet och kritik mot regimen.'},
  {title:'St. Nicholas Church – bonus', address:'Tillbaka till Malostranské nám.', lat:50.0879606, lon:14.402785,
   q:'Ungefär hur hög är interiören upp till lanterninen i St. Nicholas Church?',
   a:['27 meter','57 meter','87 meter'], correct:1,
   fact:'Prague City Tourism anger att interiören är nästan 57 meter hög till toppen av lanterninen.'},
  {title:'Karlsbron', address:'Karlův most, Praha 1', lat:50.0864771, lon:14.4114366,
   q:'Vilket år började bygget av den bro som senare blev Karlsbron?',
   a:['1212','1357','1492'], correct:1,
   fact:'Bygget började 1357 under Karl IV och bron stod klar 1402.'},
  {title:'Prague Jewish Quarter', address:'U Staré školy, Josefov', lat:50.0905184, lon:14.4203456,
   q:'Vad heter Prags gamla judiska stadsdel?',
   a:['Josefov','Vyšehrad','Žižkov'], correct:0,
   fact:'Josefov är namnet på den historiska judiska stadsdelen i Prags gamla stad.'}
];

const wholeRoute = 'https://www.google.com/maps/dir/Hotel+Essence,+Senov%C3%A1%C5%BEn%C3%A9+n%C3%A1m.+870%2F27,+110+00+Nov%C3%A9+M%C4%9Bsto,+Tjeckien/St.+Nicholas+Church+(Mal%C3%A1+Strana),+Malostransk%C3%A9+n%C3%A1m.,+118+00+Mal%C3%A1+Strana,+Tjeckien/Astronomiska+uret+i+Prag,+Starom%C4%9Bstsk%C3%A9+n%C3%A1m.+1,+110+00+Josefov,+Tjeckien/Beer+Museum,+Husova+21,+110+00+Star%C3%A9+M%C4%9Bsto,+Tjeckien/Franz+Kafka+-+Rotating+Head+by+David+Cerny,+Charv%C3%A1tova,+110+00+Nov%C3%A9+M%C4%9Bsto,+Tjeckien/Caf%C3%A9+Louvre,+N%C3%A1rodn%C3%AD+22,+110+00+Nov%C3%A9+M%C4%9Bsto,+Tjeckien/Lennon+Wall,+Velkop%C5%99evorsk%C3%A9+n%C3%A1m.,+118+00+Mal%C3%A1+Strana,+Tjeckien/St.+Nicholas+Church+(Mal%C3%A1+Strana),+Malostransk%C3%A9+n%C3%A1m.,+118+00+Mal%C3%A1+Strana,+Tjeckien/Karlsbron,+Karl%C5%AFv+most,+110+00+Praha+1,+Tjeckien/Prague+Jewish+Quarter,+U+Star%C3%A9+%C5%A1koly,+110+00+Star%C3%A9+M%C4%9Bsto,+Tjeckien';

const state = { index:Number(localStorage.getItem('pragueIndex')||0), completed:JSON.parse(localStorage.getItem('pragueCompleted')||'[]'), photos:{} };
const $ = id => document.getElementById(id);

let db;
const dbReady = new Promise(resolve => {
  if (!('indexedDB' in window)) return resolve(null);
  const req=indexedDB.open('pragueQuizDB',1);
  req.onupgradeneeded=()=>req.result.createObjectStore('photos');
  req.onsuccess=()=>{db=req.result;resolve(db)};
  req.onerror=()=>resolve(null);
});
async function savePhoto(key,blob){const d=await dbReady;if(!d)return;return new Promise(r=>{const tx=d.transaction('photos','readwrite');tx.objectStore('photos').put(blob,key);tx.oncomplete=()=>r()})}
async function getPhoto(key){const d=await dbReady;if(!d)return null;return new Promise(r=>{const req=d.transaction('photos','readonly').objectStore('photos').get(key);req.onsuccess=()=>r(req.result||null);req.onerror=()=>r(null)})}
async function deletePhoto(key){const d=await dbReady;if(!d)return;return new Promise(r=>{const tx=d.transaction('photos','readwrite');tx.objectStore('photos').delete(key);tx.oncomplete=()=>r()})}

function persist(){localStorage.setItem('pragueIndex',String(state.index));localStorage.setItem('pragueCompleted',JSON.stringify(state.completed));}
function googleUrl(s){return `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lon}&travelmode=walking`}
function appleUrl(s){return `https://maps.apple.com/?daddr=${s.lat},${s.lon}&dirflg=w`}
function updateStart(){const n=state.completed.length; $('startProgress').textContent=`${n} / 9`; $('startProgressBar').style.width=`${(n/9)*100}%`;}
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.add('hidden'));$(id).classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'});}

async function renderStop(){
  const s=stops[state.index];
  $('screenTitle').textContent=`Stopp ${state.index+1} av 9`;
  $('stopNumber').textContent=`STOPP ${state.index+1} AV 9`;
  $('stopDone').textContent=`${state.completed.length} klara`;
  $('progressBar').style.width=`${(state.completed.length/9)*100}%`;
  $('stopBadge').textContent=state.index+1;
  $('stopTitle').textContent=s.title;
  $('stopAddress').textContent=s.address;
  $('mapsBtn').href=googleUrl(s);
  $('appleMapsBtn').href=appleUrl(s);
  $('question').textContent=s.q;
  $('quizFeedback').className='feedback hidden'; $('quizFeedback').textContent='';
  const answers=$('answers');answers.innerHTML='';
  s.a.forEach((txt,i)=>{const b=document.createElement('button');b.className='answerBtn';b.textContent=txt;b.onclick=()=>answer(i,b);answers.appendChild(b)});
  $('photoCard').classList.add('hidden');$('nextBtn').classList.add('hidden');$('homeBtn').classList.add('hidden');$('quizCard').classList.remove('hidden');
  const blob=await getPhoto(`stop-${state.index}`); if(blob) showPhoto(blob); else {$('photoPreviewWrap').classList.add('hidden');$('photoPreview').src='';}
}

function answer(i,btn){
  const s=stops[state.index];document.querySelectorAll('.answerBtn').forEach(b=>b.disabled=true);
  if(i===s.correct){
    btn.classList.add('correct'); if(!state.completed.includes(state.index))state.completed.push(state.index); state.completed.sort((a,b)=>a-b);persist();updateStart();
    $('quizFeedback').className='feedback ok';$('quizFeedback').textContent=`✅ Rätt! ${s.fact}`;
    $('photoCard').classList.remove('hidden'); $('nextBtn').classList.remove('hidden');
    $('nextBtn').textContent=state.index===8?'Se resultat →':'Nästa stopp →'; $('homeBtn').classList.remove('hidden'); $('progressBar').style.width=`${(state.completed.length/9)*100}%`;
  }else{
    btn.classList.add('wrong');$('quizFeedback').className='feedback bad';$('quizFeedback').textContent='❌ Inte riktigt. Försök igen!';
    document.querySelectorAll('.answerBtn').forEach(b=>b.disabled=false);btn.disabled=true;
  }
}

function showPhoto(blob){$('photoPreview').src=URL.createObjectURL(blob);$('photoPreviewWrap').classList.remove('hidden');$('photoCard').classList.remove('hidden');}
$('photoInput').addEventListener('change',async e=>{const f=e.target.files?.[0];if(!f)return;await savePhoto(`stop-${state.index}`,f);showPhoto(f);e.target.value=''});
$('removePhotoBtn').onclick=async()=>{await deletePhoto(`stop-${state.index}`);$('photoPreview').src='';$('photoPreviewWrap').classList.add('hidden')};
$('startBtn').onclick=()=>{state.index=0;persist();show('stopScreen');renderStop()};
$('nextBtn').onclick=()=>{if(state.index<8){state.index++;persist();renderStop()}else{showFinish()}};
$('homeBtn').onclick=()=>{updateStart();show('startScreen')};
$('restartBtn').onclick=()=>{state.index=0;state.completed=[];persist();updateStart();show('stopScreen');renderStop()};
$('resetBtn').onclick=async()=>{if(!confirm('Nollställa hela rundan och alla lokalt sparade bilder?'))return;for(let i=0;i<9;i++)await deletePhoto(`stop-${i}`);state.index=0;state.completed=[];persist();updateStart();show('startScreen')};
function showFinish(){const photos=9; $('finishScore').textContent=`${state.completed.length} / 9`; $('finishPhotos').textContent='0 / 9'; getAllPhotoCount().then(n=>{ $('finishPhotos').textContent=`${n} / 9`});show('finishScreen')}
async function getAllPhotoCount(){let n=0;for(let i=0;i<9;i++)if(await getPhoto(`stop-${i}`))n++;return n}

$('startProgressBar').style.width=`${(state.completed.length/9)*100}%`;updateStart();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
