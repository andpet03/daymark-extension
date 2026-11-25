export const DEFAULTS = {name:'',scene:'lake',photo:false,custom:'',dim:45,blur:0,rotate:false,minutes:25,domains:[],tasks:[],links:[],customScenes:[],breadcrumb:'',sounds:{brown:0,rain:0,ocean:0},stats:0};
export function domain(input) {
 let s=String(input).trim(); if(!s) throw Error('Enter a website address.');
 let u; try {u=new URL(s.includes('://')?s:'https://'+s);} catch {throw Error('Enter a valid website address.');}
 if(!['https:','http:'].includes(u.protocol)||u.username||u.password||u.port) throw Error('Use a regular http or https website without a port or login.');
 let h=u.hostname.toLowerCase().replace(/^www\./,'').replace(/\.$/,'');
 if(!h.includes('.')||h.length>253||!h.split('.').every(x=>/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(x))) throw Error('Enter a full domain, for example example.com.');
 return h;
}
export function matches(url,domains) {try {const u=new URL(url);return ['https:','http:'].includes(u.protocol)&&domains.some(d=>u.hostname===d||u.hostname.endsWith('.'+d));}catch{return false;}}
export function rules(domains){return domains.map((d,i)=>({id:i+1,priority:1,action:{type:'block'},condition:{requestDomains:[d],resourceTypes:['main_frame']}}));}
export function musicUrl(input){let u;try{u=new URL(input);}catch{throw Error('Paste a Spotify or Apple Music link.');}if(u.protocol!=='https:'||!['open.spotify.com','music.apple.com'].includes(u.hostname)||u.username||u.password||u.port)throw Error('Use an https link from open.spotify.com or music.apple.com.');return u.href;}
export function recommend(tasks,minutes,energy){return tasks.filter(t=>!t.done&&t.minutes<=minutes&&t.energy<=energy).sort((a,b)=>b.minutes-a.minutes)[0]||null;}
export function remaining(session,now=Date.now()){return session?Math.max(0,Math.ceil((session.end-now)/1000)):0;}
export function cleanSettings(raw){
 const s={...DEFAULTS}; if(!raw||typeof raw!=='object')throw Error('Invalid backup.');
 for(const k of ['name','breadcrumb'])if(typeof raw[k]==='string')s[k]=raw[k].slice(0,k==='name'?60:1000);
 s.scene=['lake','forest','coast'].includes(raw.scene)?raw.scene:'lake';s.photo=raw.photo===true;s.rotate=raw.rotate===true;
 s.custom=typeof raw.custom==='string'&&/^data:image\/(jpeg|png|webp);base64,[a-zA-Z0-9+/=]+$/.test(raw.custom)&&raw.custom.length<3000000?raw.custom:'';
 for(const [k,min,max] of [['dim',20,80],['blur',0,12],['minutes',1,180]])s[k]=Number.isFinite(raw[k])?Math.min(max,Math.max(min,raw[k])):DEFAULTS[k];
 s.domains=[...new Set((Array.isArray(raw.domains)?raw.domains:[]).slice(0,100).map(domain))];
 s.tasks=(Array.isArray(raw.tasks)?raw.tasks:[]).slice(0,200).map(t=>({id:typeof t.id==='string'?t.id.slice(0,100):crypto.randomUUID(),title:String(t.title||'').slice(0,200),step:String(t.step||'').slice(0,300),minutes:Math.min(180,Math.max(1,Number(t.minutes)||15)),energy:[1,2,3].includes(t.energy)?t.energy:2,done:t.done===true})).filter(t=>t.title);
 s.links=(Array.isArray(raw.links)?raw.links:[]).slice(0,20).map(l=>({name:String(l.name||'My playlist').slice(0,80),url:musicUrl(l.url)}));
 s.sounds=Object.fromEntries(['brown','rain','ocean'].map(k=>[k,Math.min(100,Math.max(0,Number(raw.sounds?.[k])||0))]));
 s.customScenes=(Array.isArray(raw.customScenes)?raw.customScenes:[]).slice(0,10).map(v=>({name:String(v.name||'My scene').slice(0,60),scene:['lake','forest','coast'].includes(v.scene)?v.scene:'lake',minutes:Number.isFinite(v.minutes)?Math.min(180,Math.max(1,v.minutes)):25,domains:[...new Set((Array.isArray(v.domains)?v.domains:[]).slice(0,100).map(domain))],sounds:Object.fromEntries(['brown','rain','ocean'].map(k=>[k,Math.min(100,Math.max(0,Number(v.sounds?.[k])||0))]))}));
 s.stats=Number.isFinite(raw.stats)?Math.max(0,Math.floor(raw.stats)):0;return s;
}
