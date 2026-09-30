import {readFile, mkdir, writeFile, cp, rm} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
export const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function enabledSections(site){
 const value=site.sections??{};
 if(typeof value!=='object'||Array.isArray(value))throw Error('sections must be an object');
 for(const [key,enabled] of Object.entries(value))if(!['services','process','faq'].includes(key)||typeof enabled!=='boolean')throw Error('sections supports boolean services, process and faq only');
 return {services:true,process:true,faq:true,...value};
}
export function validateDetails(details={}){
 if(!details||typeof details!=='object'||Array.isArray(details))throw Error('businessDetails must be an object');
 for(const key of ['phone','address','directionsUrl'])if(details[key]!==undefined&&typeof details[key]!=='string')throw Error(`businessDetails.${key} must be text`);
 if(details.phone&&(!/^\+?[()0-9 .-]+$/.test(details.phone)||!/^\d{7,15}$/.test(details.phone.replace(/\D/g,''))))throw Error('Use a phone number with 7–15 digits and optional +, spaces, parentheses or hyphens');
 for(const key of ['hours','serviceAreas'])if(details[key]!==undefined&&(!Array.isArray(details[key])||details[key].some(x=>typeof x!=='string'||!x.trim())))throw Error(`businessDetails.${key} must be a list of nonempty text`);
 if(details.directionsUrl){const url=new URL(details.directionsUrl);if(url.protocol!=='https:'||url.username||url.password)throw Error('Use an HTTPS directions URL without credentials');}
}
export function renderDetails(details={}){
 const e=escapeHTML;const rows=[];
 if(details.phone)rows.push(`<dt>Phone</dt><dd><a href="tel:${e(details.phone.replace(/[^+0-9]/g,''))}">${e(details.phone)}</a></dd>`);
 for(const [key,label] of [['hours','Hours'],['serviceAreas','Service area']])if(details[key]?.length)rows.push(`<dt>${label}</dt><dd><ul>${details[key].map(x=>`<li>${e(x)}</li>`).join('')}</ul></dd>`);
 if(details.address)rows.push(`<dt>Address</dt><dd>${e(details.address)}</dd>`);
 if(details.directionsUrl)rows.push(`<dt>Directions</dt><dd><a href="${e(details.directionsUrl)}">Open directions</a></dd>`);
 return rows.length?`<dl class="business-details">${rows.join('')}</dl>`:'';
}
export function validateSite(s, production=false) {
  for (const key of ['name','tagline','location','headline','description','email']) if(typeof s[key]!=='string'||!s[key].trim()) throw Error(`Fill in ${key} in src/site.json`);
  if(!Array.isArray(s.services)||!s.services.length||s.services.some(x=>typeof x.name!=='string'||!x.name.trim()||typeof x.description!=='string')) throw Error('Add named services and descriptions');
  const sections=enabledSections(s);validateDetails(s.businessDetails);
  const copy=s.copy;
  const fields=['navServices','navProcess','navContact','cta','serviceCta','servicesEyebrow','servicesHeading','processEyebrow','processHeading','faqHeading','contactEyebrow','contactHeading'];
  const text=value=>typeof value==='string'&&Boolean(value.trim());
  for(const key of fields.filter(key=>!(key==='navServices'||key.startsWith('services')||key==='serviceCta')||sections.services).filter(key=>!(key==='navProcess'||key.startsWith('process'))||sections.process).filter(key=>!key.startsWith('faq')||sections.faq))if(!text(copy?.[key]))throw Error(`Fill in copy.${key} in src/site.json`);
  if(!Array.isArray(copy.heroSteps)||!copy.heroSteps.length||copy.heroSteps.some(x=>!text(x)))throw Error('Add copy.heroSteps as a list of text');
  for(const [key,fields] of [['processSteps',['title','description']],['faqs',['question','answer']]])if((key==='processSteps'?sections.process:sections.faq)&&(!Array.isArray(copy[key])||!copy[key].length||copy[key].some(x=>!x||fields.some(f=>!text(x[f])))))throw Error(`Add complete entries to copy.${key}`);
  if(!['demo','email','booking'].includes(s.contactMode)) throw Error('contactMode must be demo, email or booking');
  if(!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(s.email)) throw Error('Provide a valid email');
  if(s.contactMode==='booking') { const u=new URL(s.bookingUrl); if(u.protocol!=='https:'||u.username||u.password) throw Error('Use an HTTPS booking URL without credentials'); }
  if(production){
    if(s.example!==false||s.contactMode==='demo'||s.email.endsWith('@example.com')) throw Error('Replace example content and choose a real contact method before production');
    const u=new URL(s.siteUrl); if(u.protocol!=='https:'||u.hostname==='localhost'||u.hostname.endsWith('.example')||u.hostname==='example.com'||u.username||u.password||u.search||u.hash||u.pathname!=='/') throw Error('siteUrl must be your real HTTPS origin');
  }
}
export function renderSite(s, template, production=false){
 validateSite(s,production);
 const e=escapeHTML;
 const cta=(label,service='')=>s.contactMode==='demo'?`<button class="button" data-demo="${e(service)}">${e(label)}</button>`:`<a class="button" href="${e(s.contactMode==='email'?'mailto:'+s.email:s.bookingUrl)}">${e(label)}</a>`;
 const sections=enabledSections(s);
 let html=template.replace(/\{\{#(SERVICES|PROCESS|FAQ)\}\}([\s\S]*?)\{\{\/\1\}\}/g,(_,key,body)=>sections[key.toLowerCase()]?body:'');
 const replacements={BUSINESSDETAILS:renderDetails(s.businessDetails),NAME:e(s.name),TAGLINE:e(s.tagline),LOCATION:e(s.location),HEADLINE:e(s.headline),DESCRIPTION:e(s.description),CTA:cta(s.copy.cta),SERVICES:s.services.map((x,i)=>`<article><span class="number">0${i+1}</span><h3>${e(x.name)}</h3><p>${e(x.description)}</p>${cta(s.copy.serviceCta,x.name)}</article>`).join(''),OPTIONS:s.services.map(x=>`<option>${e(x.name)}</option>`).join(''),NOTICE:production?'':`<aside class="notice">${s.example?'Fictional example business':'Website preview'} · ${s.contactMode==='demo'?'Forms are demos; nothing is sent.':'Contact links open the configured destination.'} <a href="/start/">Build your own website</a></aside>`,METADATA:production?`<link rel="canonical" href="${e(s.siteUrl)}">`:'<meta name="robots" content="noindex,nofollow">'};
 for(const key of ['navServices','navProcess','navContact','servicesEyebrow','servicesHeading','processEyebrow','processHeading','faqHeading','contactEyebrow','contactHeading'])replacements[key.toUpperCase()]=e(s.copy[key]);
 replacements.HEROSTEPS=s.copy.heroSteps.map((text,i)=>`<span>${String(i+1).padStart(2,'0')} / ${e(text)}</span>`).join('');
 replacements.PROCESSSTEPS=(s.copy.processSteps??[]).map(x=>`<li><h3>${e(x.title)}</h3><p>${e(x.description)}</p></li>`).join('');
 replacements.FAQS=(s.copy.faqs??[]).map(x=>`<details><summary>${e(x.question)}</summary><p>${e(x.answer)}</p></details>`).join('');
 html=html.replace(/\{\{([A-Z]+)\}\}/g,(_,key)=>{if(!(key in replacements))throw Error('Unknown template token '+key);return replacements[key]});
 return html;
}
export async function build(production=false){
 const s=JSON.parse(await readFile(new URL('../src/site.json',import.meta.url),'utf8'));
 const template=await readFile(new URL('../src/index.html',import.meta.url),'utf8');
 const html=renderSite(s,template,production);
 await rm('dist',{recursive:true,force:true});await mkdir('dist');await cp('public','dist',{recursive:true});await writeFile('dist/index.html',html);await cp('src/client.js','dist/client.js');
 if(production)await rm('dist/start',{recursive:true,force:true});
 else{
  await mkdir('dist/start/guides',{recursive:true});
  for(const name of ['START-HERE.md','CLOUDFLARE-SETUP.md','LAUNCH-CHECKLIST.md'])await cp(name,`dist/start/guides/${name}`);
  for(const name of ['UI-UX-PROMPTS.md','GUIDED-LAUNCH.md'])await cp(`docs/${name}`,`dist/start/guides/${name}`);
 }
 await writeFile('dist/robots.txt' ,production?`User-agent: *\nAllow: /\nSitemap: ${s.siteUrl.replace(/\/$/,'')}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
 if(production)await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${escapeHTML(s.siteUrl)}</loc></url></urlset>`);
 console.log(`Built ${production?'production':'preview'} → dist/`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) await build(process.argv.includes('--production'));
