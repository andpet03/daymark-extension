import test from 'node:test';import assert from 'node:assert/strict';
const state={local:{},session:{}},events={},alarms={},redirected=[];let ruleSet=[],hasAudio=false,failRules=false;
function storage(area){return {get:async(keys)=>Object.fromEntries(keys.map(k=>[k,state[area][k]])),set:async(v)=>Object.assign(state[area],structuredClone(v))};}
globalThis.chrome={storage:{local:storage('local'),session:storage('session')},declarativeNetRequest:{getSessionRules:async()=>ruleSet,updateSessionRules:async({removeRuleIds=[],addRules=[]})=>{if(failRules&&addRules.length){failRules=false;throw Error('rule failure');}ruleSet=ruleSet.filter(r=>!removeRuleIds.includes(r.id)).concat(addRules);}},alarms:{create:async(n,v)=>alarms[n]=v,clear:async(n)=>delete alarms[n],onAlarm:{addListener:f=>events.alarm=f}},offscreen:{hasDocument:async()=>hasAudio,createDocument:async()=>{hasAudio=true;}},runtime:{id:'test',getURL:p=>'chrome-extension://test/'+p,sendMessage:async()=>({ok:true}),onMessage:{addListener:f=>events.message=f},onStartup:{addListener:f=>events.startup=f},onInstalled:{addListener:f=>events.installed=f}},permissions:{contains:async()=>true},tabs:{query:async()=>[{id:1,url:'https://sub.example.com'},{id:2,url:'https://notexample.com'}],update:async(id,changes)=>redirected.push({id,...changes})},action:{setBadgeText:async()=>{},setBadgeBackgroundColor:async()=>{},onClicked:{addListener:()=>{}}}};
await import('../background.js');
const send=(type,extra={})=>new Promise(resolve=>events.message({target:'worker',type,...extra},{id:'test'},resolve));
test('worker lifecycle, recovery, expiry, cleanup and failure rollback',async()=>{
 assert.equal((await send('patch',{patch:{domains:['example.com']}})).ok,true);
 assert.equal((await send('start',{minutes:1,title:'Write'})).ok,true);assert.equal(ruleSet.length,1);assert.equal(redirected.length,1);assert.equal(redirected[0].id,1);assert.ok(alarms['focus-end']);
 assert.equal((await send('start',{minutes:5})).ok,false);
 // Simulate lost browser session rules. Persistent deadline restores them.
 ruleSet=[];await send('get');assert.equal(ruleSet.length,1);
 await send('patch',{patch:{domains:['other.test']}});assert.equal(ruleSet[0].condition.requestDomains[0],'example.com');
 await send('audio',{play:true});assert.equal(state.session.audio,true);
 await send('stop');assert.equal(ruleSet.length,0);assert.equal(state.local.session,null);assert.equal(state.session.audio,false);assert.equal(alarms['focus-end'],undefined);
 await send('start',{minutes:1});state.local.session.end=Date.now()-1;await send('get');assert.equal(ruleSet.length,0);assert.equal(state.local.settings.stats,1);await send('get');assert.equal(state.local.settings.stats,1);
 failRules=true;assert.equal((await send('start',{minutes:1})).ok,false);assert.equal(state.local.session,null);assert.equal(ruleSet.length,0);
 assert.equal((await send('start',{minutes:0})).ok,false);
});
