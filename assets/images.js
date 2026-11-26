/* Shared image loading policy. Original external URLs remain unchanged. */
(function(){
"use strict";
const version="2.8.0";
const fileUrl=f=>/^https:\/\//i.test(f)?f:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(f)+"?width=1100";
function candidates(f){
 const first=fileUrl(f),out=[first];
 if(!/^https:\/\//i.test(f)){const p="https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(f);out.push(p);}
 else if(/^https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\//i.test(first)&&first.includes("?"))out.push(first.split("?")[0]);
 return [...new Set(out)];
}
// Six concurrent downloads at most; background jobs leave two slots for the viewer.
const queue=[],activeByHost=new Map(),good=new Map();let active=0,paused=0;
function batchCancel(fn){paused++;try{fn();}finally{paused--;pump();}}
function schedule(url,priority,run){
 const host=new URL(url,document.baseURI).hostname;
 const job={host,priority,run,cancelled:false};queue.push(job);pump();
 return ()=>{job.cancelled=true;pump();};
}
function pump(){
 if(paused)return;
 for(let i=queue.length-1;i>=0;i--)if(queue[i].cancelled)queue.splice(i,1);
 queue.sort((a,b)=>b.priority-a.priority);
 while(active<6){
  const index=queue.findIndex(j=>(j.priority>=2||active<4)&&(activeByHost.get(j.host)||0)<(j.priority>=2?3:2));
  if(index<0)break;
  const j=queue.splice(index,1)[0];active++;activeByHost.set(j.host,(activeByHost.get(j.host)||0)+1);
  let released=false;const release=()=>{if(released)return;released=true;active--;activeByHost.set(j.host,Math.max(0,(activeByHost.get(j.host)||1)-1));pump();};
  try{j.run(release);}catch(e){release();console.error(e);}
 }
}
function invalidate(url){try{navigator.serviceWorker?.controller?.postMessage({type:"image-error",url});}catch{}}
function load(img,f,onLoad,onError,options={}){
 const raw=candidates(f),preferred=good.get(raw[0]);const urls=preferred?[preferred,...raw.filter(u=>u!==preferred)]:raw;let index=0,attempt=0,stopped=false,timer,delay,cancelJob,releaseJob;
 const finish=(ok)=>{if(stopped)return;stopped=true;clearTimeout(timer);clearTimeout(delay);img.onload=null;img.onerror=null;const info={url:img.currentSrc||img.src,attempts:attempt,width:img.naturalWidth||0,height:img.naturalHeight||0};(ok?onLoad:onError)(info);};
 function next(){
  if(stopped)return;const url=urls[index];cancelJob=schedule(url,options.priority??2,release=>{if(stopped){release();return;}releaseJob=release;attempt++;img.referrerPolicy="no-referrer";img.decoding="async";
  let settled=false;
  const done=ok=>{if(settled||stopped)return;settled=true;clearTimeout(timer);img.onload=null;img.onerror=null;release();releaseJob=null;if(ok){good.set(raw[0],url);finish(true);return;}good.delete(raw[0]);invalidate(url);if(index+1<urls.length){index++;delay=setTimeout(next,300);}else if(attempt<Math.max(2,urls.length)&&options.retry!==false){delay=setTimeout(next,900);}else{finish(false);}};
  if(attempt>1)img.removeAttribute("src");
  img.onload=()=>done(img.naturalWidth>0&&img.naturalHeight>0);img.onerror=()=>done(false);timer=setTimeout(()=>done(false),12000);
  img.src=url;
  });
 }
 next();return ()=>{stopped=true;clearTimeout(timer);clearTimeout(delay);img.onload=null;img.onerror=null;cancelJob?.();if(releaseJob){img.removeAttribute("src");releaseJob();releaseJob=null;}};

}
function crop(img,rect){if(!rect||!img.naturalWidth)return img;const [x,y,w,h]=rect.map(Number);if(!(w>0&&h>0))return img;const wrap=document.createElement("span");wrap.className="audit-crop";wrap.style.aspectRatio=String(img.naturalWidth*w/(img.naturalHeight*h));img.style.width=100/w+"%";img.style.left=-100*x/w+"%";img.style.top=-100*y/h+"%";wrap.append(img);return wrap;}
function data(path){const u=new URL(path,document.baseURI);u.searchParams.set("v",version);return fetch(u,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status+" "+path);return r.json();});}
// Warm up distinct images without retaining decoded bitmaps indefinitely.
const warming=new Set(),warmed=new Set();
function prefetch(f,priority=0){if(!f)return;const key=fileUrl(f);if(warming.has(key)||warmed.has(key)||good.has(key))return;warming.add(key);const img=new Image();load(img,f,()=>{warming.delete(key);warmed.add(key);if(warmed.size>160)warmed.delete(warmed.values().next().value);},()=>warming.delete(key),{priority,retry:false});}
window.BDMImages={version,fileUrl,candidates,load,crop,data,prefetch,batchCancel};
})();