/* Shared image loading policy. Original external URLs remain unchanged. */
(function(){
"use strict";
const version="2.4.7";
const fileUrl=f=>/^https:\/\//i.test(f)?f:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(f)+"?width=1100";
function candidates(f){
 const first=fileUrl(f),out=[first];
 if(!/^https:\/\//i.test(f)){const p="https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(f);out.push(p);}
 else if(/^https:\/\/commons\.wikimedia\.org\/wiki\/Special:FilePath\//i.test(first)&&first.includes("?"))out.push(first.split("?")[0]);
 return [...new Set(out)];
}
function load(img,f,onLoad,onError,options={}){
 const urls=candidates(f);let index=0,attempt=0,stopped=false,timer,delay;
 const finish=(ok)=>{if(stopped)return;stopped=true;clearTimeout(timer);clearTimeout(delay);img.onload=null;img.onerror=null;const info={url:img.currentSrc||img.src,attempts:attempt,width:img.naturalWidth||0,height:img.naturalHeight||0};(ok?onLoad:onError)(info);};
 function next(){
  if(stopped)return;const url=urls[index];attempt++;img.referrerPolicy="no-referrer";img.decoding="async";
  let settled=false;
  const done=ok=>{if(settled||stopped)return;settled=true;clearTimeout(timer);img.onload=null;img.onerror=null;if(ok){finish(true);return;}if(index+1<urls.length){index++;delay=setTimeout(next,300);}else if(attempt<Math.max(2,urls.length)&&options.retry!==false){delay=setTimeout(next,900);}else{finish(false);}};
  if(attempt>1)img.removeAttribute("src");
  img.onload=()=>done(img.naturalWidth>0&&img.naturalHeight>0);img.onerror=()=>done(false);timer=setTimeout(()=>done(false),12000);
  img.src=url;
 }
 next();return ()=>{stopped=true;clearTimeout(timer);clearTimeout(delay);img.onload=null;img.onerror=null;};
}
function crop(img,rect){if(!rect||!img.naturalWidth)return img;const [x,y,w,h]=rect.map(Number);if(!(w>0&&h>0))return img;const wrap=document.createElement("span");wrap.className="audit-crop";wrap.style.aspectRatio=String(img.naturalWidth*w/(img.naturalHeight*h));img.style.width=100/w+"%";img.style.left=-100*x/w+"%";img.style.top=-100*y/h+"%";wrap.append(img);return wrap;}
function data(path){const u=new URL(path,document.baseURI);u.searchParams.set("v",version);return fetch(u,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("HTTP "+r.status+" "+path);return r.json();});}
window.BDMImages={version,fileUrl,candidates,load,crop,data};
})();