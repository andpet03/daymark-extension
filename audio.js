let ctx,nodes=[],pulse;
function stop(){clearInterval(pulse);for(const n of nodes)try{n.stop?.();n.disconnect();}catch{}nodes=[];if(ctx){ctx.close();ctx=null;}}
async function play(sounds){stop();ctx=new AudioContext();await ctx.resume();if(ctx.state!=='running')throw Error('Your browser did not allow audio playback.');
 const master=ctx.createGain();master.gain.value=.22;master.connect(ctx.destination);nodes.push(master);
 for(const kind of ['brown','rain','ocean']){const volume=Math.max(0,Math.min(100,Number(sounds[kind])||0))/100;if(!volume)continue;
 const buffer=ctx.createBuffer(1,ctx.sampleRate*8,ctx.sampleRate),data=buffer.getChannelData(0);let last=0;
 for(let i=0;i<data.length;i++){const white=Math.random()*2-1;last=(last+.02*white)/1.02;data[i]=kind==='brown'?last*3.5:white;}
 const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;const filter=ctx.createBiquadFilter();filter.type=kind==='rain'?'highpass':'lowpass';filter.frequency.value=kind==='rain'?700:kind==='ocean'?650:350;const gain=ctx.createGain();gain.gain.value=volume;source.connect(filter);filter.connect(gain);gain.connect(master);source.start();nodes.push(source,filter,gain);
 if(kind==='ocean'){let t=0;pulse=setInterval(()=>{if(ctx){t+=.1;gain.gain.setTargetAtTime(volume*(.55+.4*Math.sin(t)),ctx.currentTime,.3);}},100);}
 }
}
chrome.runtime.onMessage.addListener((m,s,r)=>{if(m.target!=='audio')return;if(m.type==='stop'){stop();r({ok:true});}else if(m.type==='mix'){play(m.sounds).then(()=>r({ok:true}),e=>{stop();r({ok:false,error:e.message});});return true;}});
