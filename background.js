import {DEFAULTS,cleanSettings,rules,remaining,matches} from './core.js';
let chain=Promise.resolve();
function serial(fn){const p=chain.then(fn);chain=p.catch(()=>{});return p;}
const read=async()=>{const x=await chrome.storage.local.get(['settings','session']);return {settings:{...DEFAULTS,...x.settings},session:x.session||null};};
async function clearRules(){const old=await chrome.declarativeNetRequest.getSessionRules();await chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:old.map(r=>r.id)});}
async function stopAudio(){if(await chrome.offscreen.hasDocument())await chrome.runtime.sendMessage({target:'audio',type:'stop'});await chrome.storage.session.set({audio:false});}
async function finish(completed=false){await clearRules();await chrome.alarms.clear('focus-end');const {settings,session}=await read();if(completed&&session){settings.stats++;await chrome.storage.local.set({settings});}await chrome.storage.local.set({session:null});await stopAudio();await chrome.action.setBadgeText({text:''});}
async function reconcile(){const {session}=await read();if(!session){await clearRules();return;}if(!remaining(session)){await finish(true);return;}const old=await chrome.declarativeNetRequest.getSessionRules();await chrome.declarativeNetRequest.updateSessionRules({removeRuleIds:old.map(r=>r.id),addRules:rules(session.domains)});await chrome.alarms.create('focus-end',{when:session.end});await chrome.action.setBadgeText({text:'ON'});await chrome.action.setBadgeBackgroundColor({color:'#bf6d43'});}
async function handle(m){
 if(m.type==='get'){await reconcile();return {...await read(),audio:(await chrome.storage.session.get('audio')).audio===true};}
 if(m.type==='restore'){const {session}=await read();if(session&&remaining(session))throw Error('End the active session before restoring.');const settings=cleanSettings(m.settings);await stopAudio();await chrome.storage.local.set({settings});return {settings};}
 if(m.type==='patch'){const {settings}=await read();const next=cleanSettings({...settings,...m.patch});await chrome.storage.local.set({settings:next});return {settings:next};}
 if(m.type==='start'){
 const {settings,session}=await read();if(session&&remaining(session))throw Error('A session is already running.');
 const minutes=Number(m.minutes);if(!Number.isFinite(minutes)||minutes<1||minutes>180)throw Error('Choose 1–180 minutes.');
 const s={start:Date.now(),end:Date.now()+minutes*60000,domains:settings.domains,title:String(m.title||'A little room to focus').slice(0,200)};
 await chrome.storage.local.set({session:s});try{await reconcile();}catch(e){await finish();throw e;}
 if(await chrome.permissions.contains({permissions:['tabs']})){
 const tabs=await chrome.tabs.query({});for(const tab of tabs)if(matches(tab.url,s.domains))try{await chrome.tabs.update(tab.id,{url:chrome.runtime.getURL('blocked.html')});}catch{}
 }
 return {session:s};
 }
 if(m.type==='stop'){await finish(false);return {};}
 if(m.type==='audio'){
 if(!m.play){await stopAudio();return {};}
 if(!await chrome.offscreen.hasDocument())await chrome.offscreen.createDocument({url:'audio.html',reasons:['AUDIO_PLAYBACK'],justification:'Play the ambient sound mixer while the dashboard is closed.'});
 const {settings}=await read();const result=await chrome.runtime.sendMessage({target:'audio',type:'mix',sounds:settings.sounds});if(!result?.ok)throw Error(result?.error||'Audio could not start.');await chrome.storage.session.set({audio:true});return {};
 }
 throw Error('Unknown action.');
}
chrome.runtime.onMessage.addListener((m,sender,respond)=>{if(m.target!=='worker')return;if(sender.id!==chrome.runtime.id)return;serial(()=>handle(m)).then(x=>respond({ok:true,...x}),e=>respond({ok:false,error:e.message}));return true;});
chrome.alarms.onAlarm.addListener(a=>{if(a.name==='focus-end')serial(reconcile);});
chrome.runtime.onStartup.addListener(()=>serial(reconcile));chrome.runtime.onInstalled.addListener(()=>serial(reconcile));
chrome.action.onClicked.addListener(()=>chrome.tabs.create({url:chrome.runtime.getURL('index.html')}));
