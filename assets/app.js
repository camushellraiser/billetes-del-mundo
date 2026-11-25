(function atlasApp(){
"use strict";
const $=id=>document.getElementById(id);
const base=new URL("./",document.baseURI);
const state={countries:[],notes:[],country:null,note:null,side:"front",region:"Todos",search:"",photoOnly:false,lang:localStorage.getItem("bdm-lang")==="en"?"en":"es",imageOk:false};
const copy={
es:{brandSubtitle:"UN ATLAS DE PAPEL",edition:"EDICIÓN 01 · 2026",eyebrow:"UNA AVENTURA ENTRE PAÍSES Y CULTURAS",headline:"El mundo tiene<br><em>mucho que contar.</em>",heroDesc:"Cada billete guarda una historia. Descubre lugares, personajes y animales increíbles a través del dinero de otros países.",exploreNow:"Empezar a explorar",surprise:"Sorpréndeme",countries:"PAÍSES",denominations:"DENOMINACIONES",regions:"REGIONES",heroBottom:"Destinos e infinitas historias.",chooseDestination:"ELIGE TU DESTINO",exploreTitle:"Un mundo por descubrir<span class='accent-period'>.</span>",exploreDesc:"Elige una bandera y comienza el viaje.",indexLabel:"ÍNDICE DE PAÍSES",photosOnly:"Solo con referencias fotográficas",noResults:"No encontramos ese destino",tryAnother:"Intenta buscar otro país o moneda.",reset:"Borrar filtros",didYouKnow:"¿SABÍAS QUE...?",discoveryTitle:"Un billete puede ser una obra de arte.",discoveryDesc:"Colores, animales, arquitectura e historia: cada país cuenta lo que lo hace único.",allCountries:"Todos los países",countryCollection:"COLECCIÓN POR PAÍS",front:"Anverso",back:"Reverso",zoom:"Ampliar",pendingPhoto:"Fotografía pendiente de verificación",selectDenom:"ELIGE UNA DENOMINACIÓN",banknotesCountry:"Los billetes del país<span class='accent-period'>.</span>",selectDenomDesc:"Selecciona un valor para ver el diseño de cada billete.",selectedBanknote:"BILLETE SELECCIONADO",aCuriosity:"UNA CURIOSIDAD",officialSource:"Consultar banco central",keepExploring:"SIGUE EXPLORANDO",otherDestination:"Descubre otro destino",footerMotto:"Hecho para mentes curiosas.",footEdition:"Un atlas educativo independiente",museumViewer:"VISOR DEL MUSEO",flipNote:"Voltear billete",imageVerified:"FOTOGRAFÍA CARGADA",imagePending:"FOTOGRAFÍA PENDIENTE",failedImage:"IMAGEN NO DISPONIBLE",illustrated:"CON REFERENCIA",photoAvailable:"Referencia fotográfica registrada",photoMissing:"Estamos verificando una fotografía actual",imageSource:"Fuente de imagen",verifiedBadge:"FOTOS",frontAlt:"Anverso",backAlt:"Reverso",resultUnit:"países",noteUnit:"billetes",all:"Todos",viewOfficialImages:"VER IMÁGENES EN BANXICO ↗",officialReference:"Referencia oficial disponible",storyHeading:"EL DETALLE DEL BILLETE",officialPhoto:"Ver billete en Banco de México",officialBank:"Ver billete en el banco central",viewOfficialBankImages:"VER IMÁGENES OFICIALES ↗"},
en:{brandSubtitle:"A PAPER ATLAS",edition:"EDITION 01 · 2026",eyebrow:"A JOURNEY ACROSS COUNTRIES AND CULTURES",headline:"The world has<br><em>so much to tell.</em>",heroDesc:"Every banknote tells a story. Explore incredible places, people and animals through the money of other countries.",exploreNow:"Start exploring",surprise:"Surprise me",countries:"COUNTRIES",denominations:"DENOMINATIONS",regions:"REGIONS",heroBottom:"Destinations and endless stories.",chooseDestination:"PICK A DESTINATION",exploreTitle:"A world to discover<span class='accent-period'>.</span>",exploreDesc:"Choose a flag and start your journey.",indexLabel:"COUNTRY INDEX",photosOnly:"Only with photo references",noResults:"No destinations found",tryAnother:"Try another country or currency.",reset:"Clear filters",didYouKnow:"DID YOU KNOW?",discoveryTitle:"A banknote can be a work of art.",discoveryDesc:"Colors, animals, architecture and history: every country has a story.",allCountries:"All countries",countryCollection:"COUNTRY COLLECTION",front:"Front",back:"Back",zoom:"Zoom",pendingPhoto:"Photo awaiting verification",selectDenom:"CHOOSE A DENOMINATION",banknotesCountry:"The country's banknotes<span class='accent-period'>.</span>",selectDenomDesc:"Choose a value to see the design of each note.",selectedBanknote:"SELECTED BANKNOTE",aCuriosity:"FUN FACT",officialSource:"Visit central bank",keepExploring:"KEEP EXPLORING",otherDestination:"Discover another country",footerMotto:"Made for curious minds.",footEdition:"An independent educational atlas",museumViewer:"MUSEUM VIEWER",flipNote:"Flip banknote",imageVerified:"PHOTO LOADED",imagePending:"PHOTO PENDING",failedImage:"IMAGE NOT AVAILABLE",illustrated:"WITH REFERENCES",photoAvailable:"Photo reference recorded",photoMissing:"We are verifying a current image",imageSource:"Image source",verifiedBadge:"PHOTOS",frontAlt:"Front",backAlt:"Back",resultUnit:"countries",noteUnit:"notes",all:"All",viewOfficialImages:"SEE IMAGES AT BANXICO ↗",officialReference:"Official reference available",storyHeading:"THE STORY ON THIS NOTE",officialPhoto:"View at Banco de México",officialBank:"View at the central bank",viewOfficialBankImages:"VIEW OFFICIAL IMAGES ↗"}
};
const tr=k=>copy[state.lang][k]||k;
const name=c=>state.lang==="en"?c.nameEn:c.name;
const currency=c=>state.lang==="en"?c.currencyNameEn:c.currencyName;
const noteFor=(countryId,value)=>state.notes.find(n=>n.countryId===countryId&&Number(n.value)===Number(value));
const hasPictures=id=>state.notes.some(n=>n.countryId===id&&n.photos?.verified);
const fileUrl=f=>/^https:\/\//i.test(f)?f:"https://commons.wikimedia.org/wiki/Special:FilePath/"+encodeURIComponent(f)+"?width=1100";
let photoRequest=0,dialogRequest=0;
function loadPhoto(img,url,onLoad,onError){
 let settled=false;const finish=ok=>{if(settled)return;settled=true;clearTimeout(timer);img.onload=null;img.onerror=null;ok?onLoad():onError();};
 const timer=setTimeout(()=>finish(false),15000);img.onload=()=>finish(img.naturalWidth>0&&img.naturalHeight>0);img.onerror=()=>finish(false);img.src=url;
}
const commonsPage=f=>/^https:\/\//i.test(f)?f:"https://commons.wikimedia.org/wiki/File:"+encodeURIComponent(f).replace(/%20/g,"_");
function cropSheetPhoto(img,rect,kind="detail"){
 const [x,y,w,h]=rect.map(Number);
 if(!img.naturalWidth||!img.naturalHeight||w<=0||h<=0)return img;
 const wrap=document.createElement("span");
 if(kind==="modal")wrap.style.setProperty("--crop-ratio",String((img.naturalWidth*w)/(img.naturalHeight*h)));
 wrap.className="banknote-crop banknote-crop-"+kind;
 wrap.style.aspectRatio=String((img.naturalWidth*w)/(img.naturalHeight*h));
 img.style.width=(100/w)+"%";
 img.style.left=(-100*x/w)+"%";
 img.style.top=(-100*y/h)+"%";
 img.style.height="auto";
 img.decoding="async";
 wrap.append(img);
 return wrap;
}
function enhanceCardPhotos(){
 document.querySelectorAll(".country-card-thumb[data-photo-id]").forEach(host=>{
  const n=state.notes.find(x=>x.id===host.dataset.photoId);
  if(!n?.photos?.crop)return;
  const img=host.querySelector("img");
  if(!img)return;
  const loaded=()=>{if(host.isConnected&&!host.querySelector(".banknote-crop"))host.replaceChildren(cropSheetPhoto(img,n.photos.crop.front,"thumb"));};
  img.addEventListener("load",loaded,{once:true});
  img.addEventListener("error",()=>host.remove(),{once:true});
  if(img.complete&&img.naturalWidth)loaded();
 });
}
const pretty=(country,value)=>{const val=new Intl.NumberFormat(state.lang==="es"?"es-MX":"en-US").format(value);return country.symbol==="CHF"?`CHF ${val}`:country.symbol==="kr"?`${val} kr`:country.symbol==="DH"?`${val} DH`:["Kč","Ft","lei"].includes(country.symbol)?`${val} ${country.symbol}`:["AED","SAR","QAR"].includes(country.symbol)?`${country.symbol} ${val}`:`${country.symbol}${val}`;};
const filterText=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase();
const countryRegion=["Todos","América","Europa","Asia","Oceanía","África"];
const regionEn={"Todos":"All","América":"Americas","Europa":"Europe","Asia":"Asia","Oceanía":"Oceania","África":"Africa"};
const listCountries=()=>state.countries.filter(c=>{
if(state.region!=="Todos"&&state.region!==c.region)return false;
if(state.photoOnly&&!hasPictures(c.id))return false;
const query=filterText(state.search.trim());
if(!query)return true;
return filterText([c.name,c.nameEn,c.currency,c.currencyName,c.currencyNameEn,c.region].join(" ")).includes(query);
});
function translate(){
document.documentElement.lang=state.lang;
for(const e of document.querySelectorAll("[data-i18n]")){const v=copy[state.lang][e.dataset.i18n];if(v!==undefined)e.textContent=v;}
for(const e of document.querySelectorAll("[data-i18n-html]")){const v=copy[state.lang][e.dataset.i18nHtml];if(v!==undefined)e.innerHTML=v;}
const search=$("country-search");search.placeholder=search.dataset["placeholder"+(state.lang==="es"?"Es":"En")]||"";
$("language-button").querySelector(".language-dot").textContent=state.lang.toUpperCase();
renderFilters();
if(state.country)renderCountry();else renderGrid();
}
function renderFilters(){
$("region-filters").innerHTML=countryRegion.map(region=>`<button type="button" class="filter-chip ${state.region===region?"active":""}" data-region="${region}" aria-pressed="${state.region===region}">${state.lang==="es"?region:regionEn[region]}</button>`).join("");
}
function renderGrid(){
 const list=listCountries();
 $("results-count").textContent=`${list.length} ${tr("resultUnit")}`;
 $("country-grid").innerHTML=list.map(c=>{
  const photoCount=state.notes.filter(n=>n.countryId===c.id&&n.photos?.verified).length;
   const featured=state.notes.find(n=>n.countryId===c.id&&n.photos?.verified);
  const preview=featured?`<span class="country-card-thumb" data-photo-id="${featured.id}" aria-hidden="true"><img loading="lazy" decoding="async" src="${fileUrl(featured.photos.front)}" alt=""></span>`:"";
  return `<button type="button" class="country-card ${featured?"has-image":""}" data-country="${c.id}" aria-label="${name(c)}" style="--country-accent:${c.color||"#7fb89b"}"><span class="country-card-top"><span class="country-card-flag">${c.flag}</span><span class="card-photo-badge ${featured?"":"no-photo"}" aria-label="${photoCount} de ${c.denominations.length}">${photoCount}/${c.denominations.length}</span><span class="country-card-arrow">↗</span></span>${preview}<span class="country-card-bottom"><span class="country-card-name">${name(c)}</span><span class="country-card-info">${c.currency}<span class="card-dot"></span>${c.denominations.length} ${tr("noteUnit")}</span></span></button>`;
 }).join("");
 $("empty-state").hidden=list.length>0;
 enhanceCardPhotos();
}
function chooseCountry(id){
const country=state.countries.find(c=>c.id===id);
if(!country){location.hash="#/";return;}
state.country=country;
const fromUrl=new URLSearchParams((location.hash.split("?")[1]||"")).get("value");
const notes=state.notes.filter(n=>n.countryId===id);
state.note=(fromUrl?notes.find(n=>n.value===Number(fromUrl)):null)||notes.find(n=>n.photos?.verified)||notes[0];
state.side="front";state.imageOk=false;
$("home-view").hidden=true;$("country-view").hidden=false;
renderCountry();window.scrollTo({top:0,behavior:"auto"});
}
function route(){
const id=(location.hash.match(/^#\/([a-z]{2})/)||[])[1];
if(id){chooseCountry(id);return;}
state.country=null;state.note=null;
$("home-view").hidden=false;$("country-view").hidden=true;
renderGrid();
if(location.hash==="#explore")setTimeout(()=>$("explore").scrollIntoView({behavior:"smooth",block:"start"}),50);
else if(location.hash==="#/"||location.hash===""||location.hash==="#")window.scrollTo({top:0,behavior:"auto"});
}
function renderCountry(){
const c=state.country,n=state.note;if(!c||!n)return;
$("crumb-country").textContent=name(c);
$("detail-flag").textContent=c.flag;
$("detail-country").textContent=name(c);
$("detail-currency").textContent=`${currency(c)} · ${c.currency}`;
$("detail-series").textContent=state.lang==="en"?c.seriesEn:c.series;
$("country-fact").textContent=state.lang==="en"?c.funFactEn:c.funFact;
$("official-source").href=n.officialPage||c.officialSource;$("official-source").querySelector("[data-i18n]").textContent=n.officialPage?tr(c.id==="mx"?"officialPhoto":"officialBank"):tr("officialSource");
$("note-count").textContent=`${String(c.denominations.indexOf(n.value)+1).padStart(2,"0")} / ${String(c.denominations.length).padStart(2,"0")}`;
$("selected-denomination").textContent=pretty(c,n.value);
$("selected-status").textContent=n.photos?tr("photoAvailable"):(n.officialPage?tr("officialReference"):tr("photoMissing"));
$("denom-buttons").innerHTML=c.denominations.map(value=>{const item=noteFor(c.id,value);return `<button type="button" data-denom="${value}" data-has-photo="${!!item?.photos}" aria-pressed="${value===n.value}" class="denom-button ${value===n.value?"active":""}">${pretty(c,value)}</button>`;}).join("");
renderPhoto();
}
function renderPhoto(){
const c=state.country,n=state.note;if(!c||!n)return;
const request=++photoRequest;
const has=Boolean(n.photos?.[state.side]);
$("selected-status").textContent=has?tr("photoAvailable"):(n.officialPage?tr("officialReference"):tr("photoMissing"));
const info=state.lang==="es"?(state.side==="front"?(n.frontDescription||n.fact):(n.backDescription||n.fact)):(state.side==="front"?(n.frontDescriptionEn||n.factEn):(n.backDescriptionEn||n.factEn));
$("note-story").hidden=!info;
$("note-story-label").textContent=tr("storyHeading")+(n.frontDescription?" · "+tr(state.side):"");
$("note-story-text").textContent=info||"";
const ref=$("official-note-link");
ref.hidden=has||!(n.officialPage||c.officialSource);
ref.href=n.officialPage||c.officialSource||"#";
ref.textContent=n.officialPage?tr(c.id==="mx"?"viewOfficialImages":"viewOfficialBankImages"):tr("viewOfficialBankImages");
state.imageOk=false;
$("front-button").classList.toggle("selected",state.side==="front");
$("back-button").classList.toggle("selected",state.side==="back");
$("zoom-button").disabled=true;
$("image-status").classList.toggle("pending",!has);
$("image-status-text").textContent=has?(state.lang==="es"?"CARGANDO FOTOGRAFÍA":"LOADING PHOTO"):tr("imagePending");
$("note-image").hidden=!has;
$("note-placeholder").hidden=has;
$("placeholder-value").textContent=pretty(c,n.value);
$("image-source").hidden=!has;
const sourceUrl=has?(n.photoSources?.[state.side]||n.photos.sourcePage||commonsPage(n.photos[state.side])):"";
const sourceLabel=has?(n.photos.provider||"Wikimedia Commons"):"";
$("image-source").innerHTML=has?`${tr("imageSource")}: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceLabel} ↗</a>${n.photos.license?" · "+n.photos.license:""}`:"";
const display=$("note-image");
display.classList.toggle("specimen-required",Boolean(n.photos?.requiresSpecimen));
display.replaceChildren();
if(!has)return;
display.innerHTML='<span class="image-loading">✳ &nbsp; '+(state.lang==='es'?'CARGANDO IMAGEN':'LOADING IMAGE')+'</span>';
const expectedId=n.id,expectedSide=state.side;
const img=new Image();
img.referrerPolicy="no-referrer";
img.decoding="async";
img.alt=`${state.side==="front"?tr("frontAlt"):tr("backAlt")} · ${pretty(c,n.value)} · ${name(c)}`;
loadPhoto(img,fileUrl(n.photos[expectedSide]),()=>{if(request===photoRequest&&state.note?.id===expectedId&&state.side===expectedSide){const node=n.photos.crop?.[expectedSide]?cropSheetPhoto(img,n.photos.crop[expectedSide]):img;display.replaceChildren(node);state.imageOk=true;$("image-status-text").textContent=tr("imageVerified");$("selected-status").textContent=state.lang==="es"?"Imagen cargada en el visor":"Image loaded in viewer";$("zoom-button").disabled=false;}},()=>{if(request===photoRequest&&state.note?.id===expectedId&&state.side===expectedSide){display.replaceChildren();display.hidden=true;$("note-placeholder").hidden=false;$("image-status").classList.add("pending");$("image-status-text").textContent=tr("failedImage");$("selected-status").textContent=tr("failedImage");state.imageOk=false;const fallback=$("official-note-link");fallback.hidden=false;fallback.href=n.photoSources?.[expectedSide]||n.photos?.sourcePage||n.officialPage||c.officialSource||"#";fallback.textContent=state.lang==="es"?"VER IMAGEN EN LA FUENTE ↗":"VIEW IMAGE AT SOURCE ↗";}});
}
function selectDenom(value){if(!state.country)return;const n=noteFor(state.country.id,value);if(!n)return;state.note=n;state.side="front";renderCountry();}
function flip(){state.side=state.side==="front"?"back":"front";renderPhoto();if($("image-dialog").open)showDialogImage();}
function showDialogImage(){
 if(!state.country||!state.note?.photos)return;
 const n=state.note,side=state.side,stage=$("dialog-image"),request=++dialogRequest;
 $("dialog-image-frame").classList.toggle("specimen-required",Boolean(n.photos.requiresSpecimen));
 $("dialog-title").textContent=`${name(state.country)} · ${pretty(state.country,n.value)}`;
 $("dialog-subtitle").textContent=side==="front"?tr("front"):tr("back");
 stage.replaceChildren();
 const img=new Image();
 img.alt=`${side==="front"?tr("frontAlt"):tr("backAlt")} · ${pretty(state.country,n.value)}`;
 img.decoding="async";img.referrerPolicy="no-referrer";
 loadPhoto(img,fileUrl(n.photos[side]),()=>{
  if(request!==dialogRequest||state.note?.id!==n.id||state.side!==side)return;
  stage.replaceChildren(n.photos.crop?.[side]?cropSheetPhoto(img,n.photos.crop[side],"modal"):img);
 },()=>{if(request===dialogRequest&&state.note?.id===n.id&&state.side===side)stage.textContent=state.lang==="es"?"La imagen no está disponible. Consulta la fuente.":"Image unavailable. Please check the source.";});
}
function zoom(){if(!state.note?.photos||!state.imageOk)return;showDialogImage();if(!$("image-dialog").open)$("image-dialog").showModal();}
function randomCountry(){const pool=state.countries;const pick=pool[Math.floor(Math.random()*pool.length)];if(pick)location.hash=`#/${pick.id}`;}
function bind(){
$("language-button").addEventListener("click",()=>{state.lang=state.lang==="es"?"en":"es";localStorage.setItem("bdm-lang",state.lang);translate();});
$("country-search").addEventListener("input",e=>{state.search=e.target.value;renderGrid();});
$("country-search").addEventListener("keydown",e=>{if(e.key==="Enter"){const list=listCountries();if(list.length===1)location.hash=`#/${list[0].id}`;}});
$("verified-only").addEventListener("change",e=>{state.photoOnly=e.target.checked;renderGrid();});
$("region-filters").addEventListener("click",e=>{const b=e.target.closest("[data-region]");if(!b)return;state.region=b.dataset.region;renderFilters();renderGrid();});
$("country-grid").addEventListener("click",e=>{const b=e.target.closest("[data-country]");if(b)location.hash=`#/${b.dataset.country}`;});
$("country-grid").addEventListener("error",e=>{if(e.target.matches(".country-card-thumb img"))e.target.closest(".country-card-thumb")?.remove();},true);
$("denom-buttons").addEventListener("click",e=>{const b=e.target.closest("[data-denom]");if(b)selectDenom(b.dataset.denom);});
$("front-button").addEventListener("click",()=>{if(state.side!=="front"){state.side="front";renderPhoto();}});
$("back-button").addEventListener("click",()=>{if(state.side!=="back"){state.side="back";renderPhoto();}});
$("zoom-button").addEventListener("click",zoom);
$("note-image").addEventListener("click",zoom);
$("dialog-close").addEventListener("click",()=>$("image-dialog").close());
$("dialog-flip").addEventListener("click",flip);
$("image-dialog").addEventListener("click",e=>{if(e.target===$("image-dialog"))$("image-dialog").close();});
for(const id of ["surprise-button","random-bottom","random-country","next-country"])$(id).addEventListener("click",randomCountry);
$("reset-search").addEventListener("click",()=>{state.region="Todos";state.photoOnly=false;state.search="";$("verified-only").checked=false;$("country-search").value="";renderFilters();renderGrid();});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!state.country&&document.activeElement?.tagName!=="INPUT"&&!e.ctrlKey&&!e.metaKey){e.preventDefault();$("country-search").focus();}if(e.key==="ArrowLeft"&&state.country&&!$("image-dialog").open){state.side="front";renderPhoto();}if(e.key==="ArrowRight"&&state.country&&!$("image-dialog").open){state.side="back";renderPhoto();}});
window.addEventListener("hashchange",route);
}
async function start(){
try{
const [a,b]=await Promise.all([fetch(new URL("api/v1/countries.json",base)),fetch(new URL("api/v1/banknotes.json",base))]);
if(!a.ok||!b.ok)throw new Error("Catalog could not load");
state.countries=await a.json();state.notes=await b.json();
$("stat-countries").textContent=String(state.countries.length).padStart(2,"0");
$("stat-denoms").textContent=String(state.notes.length).padStart(3,"0");
$("stat-images").textContent=String(state.notes.filter(n=>n.photos?.verified).length).padStart(2,"0");
for(const [target,id,value] of [["hero-note-img-one","jp",1000],["hero-note-img-two","us",100]]){
const n=noteFor(id,value);if(n?.photos){const im=new Image();im.onload=()=>$(target).style.backgroundImage=`url("${fileUrl(n.photos.front)}")`;im.src=fileUrl(n.photos.front);}
}
bind();translate();route();
}catch(err){console.error("Billetes del Mundo:",err);$("country-grid").innerHTML='<p style="padding:30px;color:#d9f5a5">No pudimos cargar la colección. Verifica tu conexión y abre el sitio desde GitHub Pages.</p>';}
}
start();
})();
