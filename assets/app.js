(function atlasApp(){
"use strict";
const $=id=>document.getElementById(id);
const base=new URL("./",document.baseURI);
const PAGE_SIZE=24,REGION_KEY="bdm-region";
const countryRegion=["América","Europa","Asia","África","Oceanía","Todos"];
function initialRegion(){try{const saved=localStorage.getItem(REGION_KEY);return countryRegion.includes(saved)?saved:"América";}catch{return "América";}}
const state={countries:[],notes:[],technical:{countries:{},notes:{},portraits:{}},country:null,note:null,side:"front",region:initialRegion(),limit:PAGE_SIZE,search:"",photoOnly:false,lang:localStorage.getItem("bdm-lang")==="en"?"en":"es",imageOk:false};
const copy={
es:{brandSubtitle:"UN ATLAS DE PAPEL",edition:"EDICIÓN 01 · 2026",eyebrow:"UNA AVENTURA ENTRE PAÍSES Y CULTURAS",headline:"El mundo tiene<br><em>mucho que contar.</em>",heroDesc:"Cada billete guarda una historia. Descubre lugares, personajes y animales increíbles a través del dinero de otros países.",exploreNow:"Empezar a explorar",surprise:"Sorpréndeme",countries:"PAÍSES",denominations:"DENOMINACIONES",regions:"REGIONES",heroBottom:"Destinos e infinitas historias.",scrollDiscover:"DESLIZA PARA EXPLORAR",chooseDestination:"ELIGE TU DESTINO",exploreTitle:"Un mundo por descubrir<span class='accent-period'>.</span>",exploreDesc:"Elige una bandera y comienza el viaje.",indexLabel:"ÍNDICE DE PAÍSES",photosOnly:"Solo con referencias fotográficas",noResults:"No encontramos ese destino",tryAnother:"Intenta buscar otro país o moneda.",reset:"Borrar filtros",didYouKnow:"¿SABÍAS QUE...?",discoveryTitle:"Un billete puede ser una obra de arte.",discoveryDesc:"Colores, animales, arquitectura e historia: cada país cuenta lo que lo hace único.",allCountries:"Todos los países",countryCollection:"COLECCIÓN POR PAÍS",front:"Anverso",back:"Reverso",zoom:"Ampliar",pendingPhoto:"Fotografía pendiente de verificación",selectDenom:"ELIGE UNA DENOMINACIÓN",banknotesCountry:"Los billetes del país<span class='accent-period'>.</span>",selectDenomDesc:"Selecciona un valor para ver el diseño de cada billete.",selectedBanknote:"BILLETE SELECCIONADO",aCuriosity:"UNA CURIOSIDAD",officialSource:"Consultar banco central",keepExploring:"SIGUE EXPLORANDO",otherDestination:"Descubre otro destino",footerMotto:"Hecho para mentes curiosas.",footEdition:"Un atlas educativo independiente",museumViewer:"VISOR DEL MUSEO",flipNote:"Voltear billete",imageVerified:"FOTOGRAFÍA CARGADA",imagePending:"FOTOGRAFÍA PENDIENTE",failedImage:"IMAGEN NO DISPONIBLE",illustrated:"CON REFERENCIA",photoAvailable:"Referencia fotográfica registrada",photoMissing:"Estamos verificando una fotografía actual",imageSource:"Fuente de imagen",verifiedBadge:"FOTOS",frontAlt:"Anverso",backAlt:"Reverso",resultUnit:"países",noteUnit:"billetes",all:"Todos",viewOfficialImages:"VER IMÁGENES EN BANXICO ↗",officialReference:"Referencia oficial disponible",storyHeading:"EL DETALLE DEL BILLETE",officialPhoto:"Ver billete en Banco de México",officialBank:"Ver billete en el banco central",viewOfficialBankImages:"VER IMÁGENES OFICIALES ↗"},
en:{brandSubtitle:"A PAPER ATLAS",edition:"EDITION 01 · 2026",eyebrow:"A JOURNEY ACROSS COUNTRIES AND CULTURES",headline:"The world has<br><em>so much to tell.</em>",heroDesc:"Every banknote tells a story. Explore incredible places, people and animals through the money of other countries.",exploreNow:"Start exploring",surprise:"Surprise me",countries:"COUNTRIES",denominations:"DENOMINATIONS",regions:"REGIONS",heroBottom:"Destinations and endless stories.",scrollDiscover:"SCROLL TO DISCOVER",chooseDestination:"PICK A DESTINATION",exploreTitle:"A world to discover<span class='accent-period'>.</span>",exploreDesc:"Choose a flag and start your journey.",indexLabel:"COUNTRY INDEX",photosOnly:"Only with photo references",noResults:"No destinations found",tryAnother:"Try another country or currency.",reset:"Clear filters",didYouKnow:"DID YOU KNOW?",discoveryTitle:"A banknote can be a work of art.",discoveryDesc:"Colors, animals, architecture and history: every country has a story.",allCountries:"All countries",countryCollection:"COUNTRY COLLECTION",front:"Front",back:"Back",zoom:"Zoom",pendingPhoto:"Photo awaiting verification",selectDenom:"CHOOSE A DENOMINATION",banknotesCountry:"The country's banknotes<span class='accent-period'>.</span>",selectDenomDesc:"Choose a value to see the design of each note.",selectedBanknote:"SELECTED BANKNOTE",aCuriosity:"FUN FACT",officialSource:"Visit central bank",keepExploring:"KEEP EXPLORING",otherDestination:"Discover another country",footerMotto:"Made for curious minds.",footEdition:"An independent educational atlas",museumViewer:"MUSEUM VIEWER",flipNote:"Flip banknote",imageVerified:"PHOTO LOADED",imagePending:"PHOTO PENDING",failedImage:"IMAGE NOT AVAILABLE",illustrated:"WITH REFERENCES",photoAvailable:"Photo reference recorded",photoMissing:"We are verifying a current image",imageSource:"Image source",verifiedBadge:"PHOTOS",frontAlt:"Front",backAlt:"Back",resultUnit:"countries",noteUnit:"notes",all:"All",viewOfficialImages:"SEE IMAGES AT BANXICO ↗",officialReference:"Official reference available",storyHeading:"THE STORY ON THIS NOTE",officialPhoto:"View at Banco de México",officialBank:"View at the central bank",viewOfficialBankImages:"VIEW OFFICIAL IMAGES ↗"}
};
const tr=k=>copy[state.lang][k]||k;
const name=c=>state.lang==="en"?c.nameEn:c.name;
const currency=c=>state.lang==="en"?c.currencyNameEn:c.currencyName;
const noteFor=(countryId,value)=>state.notes.find(n=>n.countryId===countryId&&Number(n.value)===Number(value));
const hasPictures=id=>state.notes.some(n=>n.countryId===id&&n.photos?.front&&n.photos?.back);
const {fileUrl,load:loadPhoto,data:loadCatalog,prefetch,batchCancel}=window.BDMImages;
const coverJobs=new Set();
function cancelCovers(){gridGeneration++;batchCancel(()=>{for(const cancel of coverJobs)cancel();coverJobs.clear();});}
function setRegion(region){if(!countryRegion.includes(region))return;state.region=region;state.limit=PAGE_SIZE;try{localStorage.setItem(REGION_KEY,region);}catch{}}
function resetLimit(){state.limit=PAGE_SIZE;}
const searching=()=>Boolean(state.search.trim());
const hasPair=n=>Boolean(n.photos?.front&&n.photos?.back);
const regionalLabel=()=>state.lang==="es"?"Moneda compartida":"Shared currency";
const variantLabel=(n)=>n?.sharedCurrency==="XOF"?(n.nationalCodeMatch?(state.lang==="es"?`Variante ${n.photoCountryCode} · código coincidente`:`Variant ${n.photoCountryCode} · matching code`):(state.lang==="es"?`Ejemplo regional (${n.photoCountryCode||"?"}) · variante ${n.expectedCountryCode} pendiente`:`Regional example (${n.photoCountryCode||"?"}) · variant ${n.expectedCountryCode} pending`)):n?.sharedCurrency==="XAF"?(state.lang==="es"?"Diseño regional BEAC":"BEAC regional design"):"";
let gridGeneration=0;
function warmCountry(c,n){if(!c)return;const rest=state.notes.filter(x=>x.countryId===c.id&&x.id!==n?.id);
 if(n?.photos)prefetch(n.photos[state.side==="front"?"back":"front"],1);
 for(const x of rest){prefetch(x.photos?.front,1);prefetch(x.photos?.back,1);}
}
let photoRequest=0,dialogRequest=0;
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
 const generation=gridGeneration;
 document.querySelectorAll(".country-card-thumb[data-photo-id]:not([data-cover-started])").forEach(host=>{
  host.dataset.coverStarted="true";host.dataset.coverState="loading";
  const featured=state.notes.find(x=>x.id===host.dataset.photoId);if(!featured)return;
  const notes=[featured,...state.notes.filter(n=>n.countryId===featured.countryId&&n.id!==featured.id&&n.photos?.front)];
  const options=notes.flatMap(n=>[{url:n.photos.front,crop:n.photos.crop?.front},...(n.photos.thumbnailAlternative?.url?[{url:n.photos.thumbnailAlternative.url,crop:null}]:[])]);
  const seen=new Set(),unique=options.filter(o=>o.url&&!seen.has(o.url)&&seen.add(o.url));
  const domain=o=>{try{return new URL(fileUrl(o.url)).hostname;}catch{return "";}};
  const hosts=new Set(),first=[],rest=[];for(const o of unique){const d=domain(o);if(hosts.has(d))rest.push(o);else{hosts.add(d);first.push(o);}}
  const alternatives=[...first,...rest];
  // Load covers only for rendered cards. Retain successful DOM nodes when appending.
  let i=0;
  function next(){
   if(generation!==gridGeneration||!host.isConnected)return;
   const o=alternatives[i++];
   if(!o){host.dataset.coverState="unavailable";return;}
   const img=new Image();img.alt="";
   let cancel;
   const clear=()=>coverJobs.delete(cancel);
   cancel=loadPhoto(img,o.url,()=>{clear();if(generation===gridGeneration&&host.isConnected){host.replaceChildren(o.crop?cropSheetPhoto(img,o.crop,"thumb"):img);host.dataset.coverState="ready";}},()=>{clear();next();},{retry:false,priority:0});
   coverJobs.add(cancel);
  }
  next();
 });
}
const pretty=(country,value)=>{const val=new Intl.NumberFormat(state.lang==="es"?"es-MX":"en-US").format(value);return country.symbol==="CHF"?`CHF ${val}`:country.symbol==="kr"?`${val} kr`:country.symbol==="DH"?`${val} DH`:["Kč","Ft","lei","ден","soʻm","KM"].includes(country.symbol)?`${val} ${country.symbol}`:["AED","SAR","QAR","RSD"].includes(country.symbol)?`${country.symbol} ${val}`:`${country.symbol}${val}`;};
const filterText=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase();
const regionEn={"Todos":"All","América":"Americas","Europa":"Europe","Asia":"Asia","Oceanía":"Oceania","África":"Africa"};
const listCountries=()=>state.countries.filter(c=>{
const query=filterText(state.search.trim());
if(!query&&state.region!=="Todos"&&state.region!==c.region)return false;
if(state.photoOnly&&!hasPictures(c.id))return false;
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
function applyRegion(region){state.search="";$("country-search").value="";setRegion(region);renderFilters();renderGrid();}
function renderMap(){
 const es=state.lang==="es",active=searching()?"Todos":state.region;
 $("world-map-heading").textContent=es?"EXPLORA EL MUNDO":"EXPLORE THE WORLD";
 $("world-map-hint").textContent=es?"Toca un continente para explorar sus billetes.":"Tap a continent to explore its banknotes.";
 $("world-map-selection").textContent=searching()?(es?"Búsqueda global":"Global search"):`${es?active:regionEn[active]} · ${state.countries.filter(c=>active==="Todos"||c.region===active).length} ${tr("resultUnit")}`;
 document.querySelectorAll("[data-map-region]").forEach(el=>{
  const r=el.dataset.mapRegion,selected=r===active;
  el.classList.toggle("is-active",selected);el.classList.toggle("is-all",active==="Todos");
  el.setAttribute("aria-pressed",String(selected));
  const label=es?r:regionEn[r];el.setAttribute("aria-label",label);el.querySelector("title").textContent=label;
 });
}
function renderFilters(){
const active=searching()?"Todos":state.region;
$("region-filters").innerHTML=countryRegion.map(region=>`<button type="button" class="filter-chip ${active===region?"active":""}" data-region="${region}" aria-pressed="${active===region}">${state.lang==="es"?region:regionEn[region]}</button>`).join("");
renderMap();
}
function renderGrid(append=false){
 const list=listCountries(),grid=$("country-grid"),visible=list.slice(0,state.limit);
 const shown=visible.length,more=list.length>shown,es=state.lang==="es";
 const label=searching()?(es?"Búsqueda global":"Global search"):(es?state.region:regionEn[state.region]);
 $("results-count").textContent=`${label} · ${shown===list.length?shown:shown+"/"+list.length} ${tr("resultUnit")}`;
 const start=append?grid.children.length:0;
 if(!append)cancelCovers();
 const markup=visible.slice(start).map(c=>{
  const photoCount=state.notes.filter(n=>n.countryId===c.id&&hasPair(n)&&(c.currency!=="XOF"||n.nationalCodeMatch)).length;
  const countLabel=c.currency==="XOF"?(state.lang==="es"?"Variantes con código coincidente":"Matching-code variants"):(state.lang==="es"?"Pares de imágenes de referencia":"Reference image pairs");
   const featured=state.notes.find(n=>n.id===c.previewNoteId&&n.countryId===c.id&&n.photos?.front)||state.notes.find(n=>n.countryId===c.id&&n.photos?.verified)||state.notes.find(n=>n.countryId===c.id&&hasPair(n));
  const preview=featured?`<span class="country-card-thumb" data-photo-id="${featured.id}" aria-hidden="true"></span>`:"";
  return `<button type="button" class="country-card ${featured?"has-image":""}" data-country="${c.id}" aria-label="${name(c)}" style="--country-accent:${c.color||"#7fb89b"}"><span class="country-card-top"><span class="country-card-flag">${c.flag}</span><span class="card-photo-badge ${featured?"":"no-photo"}" title="${countLabel}" aria-label="${countLabel}: ${photoCount}/${c.denominations.length}">${photoCount}/${c.denominations.length}</span><span class="country-card-arrow">↗</span></span>${preview}<span class="country-card-bottom"><span class="country-card-name">${name(c)}</span><span class="country-card-info">${c.currency}<span class="card-dot"></span>${c.denominations.length} ${tr("noteUnit")}</span>${c.sharedCurrency?`<span class="country-card-info">${regionalLabel()}${c.countryCode?` · ${c.countryCode}`:""}</span>`:""}</span></button>`;
 }).join("");
 if(append)grid.insertAdjacentHTML("beforeend",markup);else grid.innerHTML=markup;
 $("empty-state").hidden=list.length>0;
 const moreBox=$("country-more"),button=$("show-more"),count=$("country-more-count");
 moreBox.hidden=!more;
 count.textContent=es?`Mostrando ${shown} de ${list.length} países`:`Showing ${shown} of ${list.length} countries`;
 button.textContent=es?`Mostrar ${Math.min(PAGE_SIZE,list.length-shown)} más ↓`:`Show ${Math.min(PAGE_SIZE,list.length-shown)} more ↓`;
 enhanceCardPhotos();
}
function chooseCountry(id){
const country=state.countries.find(c=>c.id===id);
if(!country){location.hash="#/";return;}
cancelCovers();state.country=country;
const fromUrl=new URLSearchParams((location.hash.split("?")[1]||"")).get("value");
const notes=state.notes.filter(n=>n.countryId===id);
state.note=(fromUrl?notes.find(n=>n.value===Number(fromUrl)):null)||notes.find(n=>n.photos?.verified)||notes.find(hasPair)||notes[0];
state.side="front";state.imageOk=false;
$("home-view").hidden=true;$("country-view").hidden=false;
renderCountry();warmCountry(country,state.note);window.scrollTo({top:0,behavior:"auto"});
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
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function safeHref(v){try{const u=new URL(v);return u.protocol==="https:"||u.protocol==="http:"?escapeHtml(u.href):"#";}catch{return "#";}}
function portraitCard(c,n){
 const es=state.lang==="es",local=(a,b)=>es?a:b,entry=state.technical.portraits?.[n.id];
 const heading=local("Quién aparece en el billete","Who appears on the banknote");
 const source=entry?.source||n.officialPage||n.referencePage||c.officialSource;
 let body;
 if(entry?.kind==="named"){body=entry.people.map(p=>`<article class="portrait-person"><span class="portrait-side">${local(p.side==="back"?"REVERSO":"ANVERSO",p.side==="back"?"BACK":"FRONT")}</span><strong>${escapeHtml(p.name)}</strong><p>${escapeHtml(es?p.es:p.en)}</p></article>`).join("");}
 else if(entry){body=`<p class="portrait-motif">${escapeHtml(es?entry.es:entry.en)}</p>`;}
 else{body=`<p class="portrait-pending">${local("Identificación de los personajes o motivo principal pendiente de verificar para este diseño.","Identification of the people or main motif is pending verification for this design.")}</p>`;}
 return `<section class="portrait-profile" aria-labelledby="portrait-profile-title"><h4 id="portrait-profile-title">${heading}</h4>${body}<a class="technical-source" href="${safeHref(source)}" target="_blank" rel="noopener noreferrer">${local(entry?"Fuente del diseño":"Consultar fuente del diseño",entry?"Design source":"Consult design source")} ↗</a></section>`;
}
function technicalCard(c,n){
 const es=state.lang==="es",t=state.technical.countries[c.id]||{},nt=state.technical.notes[n.id]||{},values=[...new Set(c.denominations)].sort((a,b)=>a-b);
 const local=(a,b)=>es?a:b;const row=(k,v)=>v==null||v===""?"":`<div class="technical-field"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`;
 const pair=v=>Array.isArray(v)?v[es?0:1]:v;
 const countryRows=[row(local("Moneda","Currency"),`${currency(c)} · ${c.currency}`),row(local("Serie catalogada","Catalogued series"),es?c.series:c.seriesEn),row(local("Denominaciones catalogadas","Catalogued denominations"),values.length),row(local("Rango catalogado","Catalogued range"),values.length?`${pretty(c,values[0])} – ${pretty(c,values.at(-1))}`:null),row(local("Emisor","Issuer"),es?t.issuer:t.issuerEn),row(local("Materiales","Materials"),es?t.materials:t.materialsEn),row(local("Introducción de la serie","Series introduction"),t.intro)].join("");
 const countryFact=(es?t.fact:t.factEn)|| (es?c.funFact:c.funFactEn);
 $("currency-profile").innerHTML=`<div class="technical-heading"><span class="section-kicker">${local("ATLAS NUMISMÁTICO","NUMISMATIC ATLAS")}</span><h2 id="currency-profile-title">${local("Ficha de la moneda","Currency profile")}</h2></div><dl class="technical-grid">${countryRows}</dl><div class="currency-denoms">${values.map(v=>`<span>${escapeHtml(pretty(c,v))}</span>`).join("")}</div>${countryFact?`<div class="technical-curiosity"><span>✦</span><div><strong>${local("¿Sabías que…?","Did you know…?")}</strong><p>${escapeHtml(countryFact)}</p></div></div>`:""}<div class="technical-foot"><span>${local("Alcance: denominaciones de esta colección, no necesariamente todas las emisiones de curso legal.","Scope: denominations in this collection, not necessarily all legal-tender issues.")}</span><a href="${safeHref(t.source||c.officialSource)}" target="_blank" rel="noopener noreferrer">${local("Fuente del emisor","Issuer source")} ↗</a></div>`;
 const fmtDate=v=>{if(!v)return null;if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return v;return new Intl.DateTimeFormat(es?"es-MX":"en-US",{dateStyle:"medium",timeZone:"UTC"}).format(new Date(v+"T00:00:00Z"));};
 const noteRows=[row(local("Valor nominal","Face value"),pretty(c,n.value)),row(local("Serie","Series"),es?n.series:n.seriesEn),row(local("Material","Material"),pair(nt.material)),row(local("Medidas (largo × corto)","Dimensions (long × short)"),nt.dimensions?nt.dimensions.join(" × ")+" mm":null),row(local("Color predominante","Main colour"),pair(nt.color)),row(local("Introducción del diseño","Design introduction"),fmtDate(nt.firstIssued)),row(local("Fecha de emisión registrada","Recorded issue date"),!nt.firstIssued?fmtDate(n.issueDate):null),row(local("Orientación","Orientation"),nt.orientation?local(nt.orientation==="v"?"Vertical":"Horizontal",nt.orientation==="v"?"Vertical":"Horizontal"):null)].join("");
 const front=es?n.frontDescription:n.frontDescriptionEn,back=es?n.backDescription:n.backDescriptionEn;
 $("note-profile").innerHTML=`<h3 id="note-profile-title">${local("Ficha del billete","Banknote profile")}</h3><dl class="technical-grid note-technical-grid">${noteRows}</dl>${portraitCard(c,n)}${front||back?`<div class="technical-motifs">${front?`<div><strong>${local("Anverso","Front")}</strong><p>${escapeHtml(front)}</p></div>`:""}${back?`<div><strong>${local("Reverso","Back")}</strong><p>${escapeHtml(back)}</p></div>`:""}</div>`:""}${!Object.keys(nt).length?`<p class="technical-pending">${local("Datos técnicos adicionales pendientes de verificar.","Additional technical details await verification.")}</p>`:""}<a class="technical-source" href="${safeHref(nt.source||n.officialPage||c.officialSource)}" target="_blank" rel="noopener noreferrer">${local("Consultar fuente","View source")} ↗</a>`;
}
function renderCountry(){
const c=state.country,n=state.note;if(!c||!n)return;
technicalCard(c,n);
$("crumb-country").textContent=name(c);
$("detail-flag").textContent=c.flag;
$("detail-country").textContent=name(c);
$("detail-currency").textContent=`${currency(c)} · ${c.currency}${c.sharedCurrency?" · "+regionalLabel():""}${c.countryCode?" · "+c.countryCode:""}`;
$("detail-series").textContent=state.lang==="en"?c.seriesEn:c.series;
$("country-fact").textContent=state.lang==="en"?c.funFactEn:c.funFact;
$("official-source").href=n.officialPage||c.officialSource;$("official-source").querySelector("[data-i18n]").textContent=n.officialPage?tr(c.id==="mx"?"officialPhoto":"officialBank"):tr("officialSource");
$("note-count").textContent=`${String(c.denominations.indexOf(n.value)+1).padStart(2,"0")} / ${String(c.denominations.length).padStart(2,"0")}`;
$("selected-denomination").textContent=pretty(c,n.value);
$("selected-status").textContent=n.photos?tr("photoAvailable"):(n.officialPage?tr("officialReference"):tr("photoMissing"));
$("denom-buttons").innerHTML=c.denominations.map(value=>{const item=noteFor(c.id,value);return `<button type="button" data-denom="${value}" data-has-photo="${!!item?.photos&&(c.currency!=="XOF"||item.nationalCodeMatch)}" title="${variantLabel(item)}" aria-pressed="${value===n.value}" class="denom-button ${value===n.value?"active":""}">${pretty(c,value)}</button>`;}).join("");
renderPhoto();
}
function renderPhoto(){
const c=state.country,n=state.note;if(!c||!n)return;
const request=++photoRequest;
const has=Boolean(n.photos?.[state.side]);
$("selected-status").textContent=has?tr("photoAvailable"):(n.officialPage?tr("officialReference"):tr("photoMissing"));
const info=state.lang==="es"?(state.side==="front"?(n.frontDescription||n.fact):(n.backDescription||n.fact)):(state.side==="front"?(n.frontDescriptionEn||n.factEn):(n.backDescriptionEn||n.factEn));
$("note-story").hidden=!info||Boolean(state.lang==="es"?(n.frontDescription||n.backDescription):(n.frontDescriptionEn||n.backDescriptionEn));
$("note-story-label").textContent=tr("storyHeading")+(n.frontDescription?" · "+tr(state.side):"");
$("note-story-text").textContent=info||"";
document.querySelectorAll("[data-image-retry]").forEach(x=>x.remove());
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
$("image-source").innerHTML=has?`${tr("imageSource")}: <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${sourceLabel} ↗</a>${n.photos.license?" · "+n.photos.license:""}${variantLabel(n)?" · "+variantLabel(n):""}`:"";
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
loadPhoto(img,n.photos[expectedSide],()=>{if(request===photoRequest&&state.note?.id===expectedId&&state.side===expectedSide){const node=n.photos.crop?.[expectedSide]?cropSheetPhoto(img,n.photos.crop[expectedSide]):img;display.replaceChildren(node);state.imageOk=true;$("image-status-text").textContent=tr("imageVerified");$("selected-status").textContent=state.lang==="es"?"Imagen cargada en el visor":"Image loaded in viewer";$("zoom-button").disabled=false;}},()=>{if(request===photoRequest&&state.note?.id===expectedId&&state.side===expectedSide){display.replaceChildren();display.hidden=true;$("note-placeholder").hidden=false;$("image-status").classList.add("pending");$("image-status-text").textContent=tr("failedImage");$("selected-status").textContent=tr("failedImage");state.imageOk=false;const fallback=$("official-note-link");fallback.hidden=false;fallback.href=n.photoSources?.[expectedSide]||n.photos?.sourcePage||n.officialPage||c.officialSource||"#";fallback.textContent=state.lang==="es"?"VER IMAGEN EN LA FUENTE ↗":"VIEW IMAGE AT SOURCE ↗";const retry=document.createElement("button");retry.type="button";retry.className="official-preview-link";retry.style.cssText="display:block;margin:8px auto;background:transparent;color:inherit;border:0;cursor:pointer";retry.textContent=state.lang==="es"?"Reintentar imagen":"Retry image";retry.dataset.imageRetry="true";retry.onclick=renderPhoto;fallback.after(retry);}});
}
function selectDenom(value){if(!state.country)return;const n=noteFor(state.country.id,value);if(!n)return;state.note=n;state.side="front";renderCountry();warmCountry(state.country,n);}
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
 loadPhoto(img,n.photos[side],()=>{
  if(request!==dialogRequest||state.note?.id!==n.id||state.side!==side)return;
  stage.replaceChildren(n.photos.crop?.[side]?cropSheetPhoto(img,n.photos.crop[side],"modal"):img);
 },()=>{if(request===dialogRequest&&state.note?.id===n.id&&state.side===side)stage.textContent=state.lang==="es"?"La imagen no está disponible. Consulta la fuente.":"Image unavailable. Please check the source.";});
}
function zoom(){if(!state.note?.photos||!state.imageOk)return;showDialogImage();if(!$("image-dialog").open)$("image-dialog").showModal();}
function randomCountry(){const pool=state.countries;const pick=pool[Math.floor(Math.random()*pool.length)];if(pick)location.hash=`#/${pick.id}`;}
function bind(){
$("language-button").addEventListener("click",()=>{state.lang=state.lang==="es"?"en":"es";localStorage.setItem("bdm-lang",state.lang);translate();});
$("country-search").addEventListener("input",e=>{state.search=e.target.value;resetLimit();renderFilters();renderGrid();});
$("country-search").addEventListener("keydown",e=>{if(e.key==="Enter"){const list=listCountries();if(list.length===1)location.hash=`#/${list[0].id}`;}});
$("verified-only").addEventListener("change",e=>{state.photoOnly=e.target.checked;resetLimit();renderGrid();});
$("region-filters").addEventListener("click",e=>{const b=e.target.closest("[data-region]");if(!b)return;applyRegion(b.dataset.region);});
$("world-selector").addEventListener("click",e=>{const r=e.target.closest("[data-map-region]");if(r)applyRegion(r.dataset.mapRegion);});
$("world-selector").addEventListener("keydown",e=>{const r=e.target.closest("[data-map-region]");if(r&&(e.key==="Enter"||e.key===" ")){e.preventDefault();applyRegion(r.dataset.mapRegion);}});
$("show-more").addEventListener("click",()=>{const grid=$("country-grid"),previous=grid.children.length;state.limit+=PAGE_SIZE;renderGrid(true);if($("country-more").hidden&&grid.children[previous])grid.children[previous].focus({preventScroll:true});});
$("country-grid").addEventListener("click",e=>{const b=e.target.closest("[data-country]");if(b)location.hash=`#/${b.dataset.country}`;});

$("denom-buttons").addEventListener("click",e=>{const b=e.target.closest("[data-denom]");if(b)selectDenom(b.dataset.denom);});
$("front-button").addEventListener("click",()=>{if(state.side!=="front"){state.side="front";renderPhoto();}});
$("back-button").addEventListener("click",()=>{if(state.side!=="back"){state.side="back";renderPhoto();}});
$("zoom-button").addEventListener("click",zoom);
$("note-image").addEventListener("click",zoom);
$("dialog-close").addEventListener("click",()=>$("image-dialog").close());
$("dialog-flip").addEventListener("click",flip);
$("image-dialog").addEventListener("click",e=>{if(e.target===$("image-dialog"))$("image-dialog").close();});
for(const id of ["surprise-button","random-bottom","random-country","next-country"])$(id).addEventListener("click",randomCountry);
$("reset-search").addEventListener("click",()=>{setRegion("América");state.photoOnly=false;state.search="";$("verified-only").checked=false;$("country-search").value="";renderFilters();renderGrid();});
document.addEventListener("keydown",e=>{if(e.key==="/"&&!state.country&&document.activeElement?.tagName!=="INPUT"&&!e.ctrlKey&&!e.metaKey){e.preventDefault();$("country-search").focus();}if(e.key==="ArrowLeft"&&state.country&&!$("image-dialog").open){state.side="front";renderPhoto();}if(e.key==="ArrowRight"&&state.country&&!$("image-dialog").open){state.side="back";renderPhoto();}});
window.addEventListener("hashchange",route);
}
async function start(){
try{
[state.countries,state.notes,state.technical]=await Promise.all([loadCatalog("api/v1/countries.json"),loadCatalog("api/v1/banknotes.json"),loadCatalog("api/v1/technical.json").catch(()=>({countries:{},notes:{}}))]);
$("stat-countries").textContent=String(state.countries.length).padStart(2,"0");
$("stat-denoms").textContent=String(state.notes.length).padStart(3,"0");
$("stat-images").textContent=String(state.notes.filter(hasPair).length).padStart(2,"0");
for(const [target,id,value] of [["hero-note-img-one","jp",1000],["hero-note-img-two","us",100]]){
const n=noteFor(id,value);if(n?.photos){const im=new Image();loadPhoto(im,n.photos.front,()=>{$(target).style.backgroundImage=`url("${im.currentSrc||im.src}")`;},()=>{},{retry:false});}
}
bind();translate();if(location.hash.match(/^#\/[a-z]{2}/)||location.hash==="#explore")route();
if("serviceWorker" in navigator){navigator.serviceWorker.register("./sw.js").catch(e=>console.warn("Image cache unavailable",e));}
}catch(err){console.error("Billetes del Mundo:",err);$("country-grid").innerHTML='<p style="padding:30px;color:#d9f5a5">No pudimos cargar la colección. Verifica tu conexión y abre el sitio desde GitHub Pages.</p>';}
}
start();
})();
