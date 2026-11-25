/* Bounded image cache for Billetes del Mundo. Only image requests from this app. */
const CACHE="bdm-image-cache-v1",MAX=48;
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(self.clients.claim()));
async function put(cache,request,response){
 try{await cache.put(request,response);const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-MAX)))await cache.delete(key);}catch(e){/* Storage can be unavailable or evicted on iOS. */}
}
self.addEventListener("fetch",event=>{
 const req=event.request;
 if(req.method!=="GET"||req.destination!=="image"||!req.url.startsWith("https://"))return;
 event.respondWith((async()=>{
  let cache;try{cache=await caches.open(CACHE);const hit=await cache.match(req);if(hit)return hit;}catch{}
  const response=await fetch(req);
  // Opaque responses cannot be inspected here; the page evicts them on image errors.
  if(cache&&(response.ok||response.type==="opaque"))event.waitUntil(put(cache,req,response.clone()));
  return response;
 })());
});
self.addEventListener("message",event=>{
 if(event.data?.type!=="image-error"||typeof event.data.url!=="string"||!event.data.url.startsWith("https://"))return;
 event.waitUntil(caches.open(CACHE).then(c=>c.delete(event.data.url)).catch(()=>{}));
});
