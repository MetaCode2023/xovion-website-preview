import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {renderSite,validateSite} from '../scripts/build.mjs';
import {diagnose} from '../scripts/doctor.mjs';
import {makeSetup} from '../scripts/setup.mjs';
const sample=JSON.parse(await readFile(new URL('./fixtures/site.json',import.meta.url)));
const template=await readFile(new URL('../src/index.html',import.meta.url),'utf8');
test('all configurable homepage copy renders safely with no template tokens',()=>{
 const s=structuredClone(sample);
 for(const key of Object.keys(s.copy))if(typeof s.copy[key]==='string')s.copy[key]=`${key} <script>alert(1)</script>`;
 s.copy.heroSteps=['A & B'];s.copy.processSteps=[{title:'<Process>',description:'Details & scope'}];s.copy.faqs=[{question:'<Question>',answer:'Answer & more'}];
 const html=renderSite(s,template);assert.ok(!html.includes('{{'));assert.ok(!html.includes('<script>alert(1)</script>'));
 for(const key of Object.keys(s.copy))if(typeof s.copy[key]==='string')assert.ok(html.includes(`${key} &lt;script&gt;`),key);
 assert.match(html,/&lt;Process&gt;/);assert.match(html,/&lt;Question&gt;/);assert.match(html,/A &amp; B/);
});
test('incomplete section copy fails before build output is replaced',()=>{
 for(const copy of [{...sample.copy,cta:''},{...sample.copy,processSteps:[{title:'Step'}]},{...sample.copy,faqs:[null]},{...sample.copy,heroSteps:[]}])assert.throws(()=>validateSite({...sample,copy}));
});
test('setup starts new businesses with neutral copy but preserves edited copy',()=>{
 const answers={name:'Repair shop',location:'Town',headline:'Repairs',description:'We repair equipment',tagline:'Repairs',services:'Repairs',contactMode:'demo',email:'hello@example.com',bookingUrl:'',style:'Simple'};
 const fresh=makeSetup(sample,answers).config;assert.ok(!JSON.stringify(fresh.copy).includes('your space'));
 const customized={...sample,example:false,copy:{...sample.copy,cta:'Custom CTA'}};assert.equal(makeSetup(customized,answers).config.copy.cta,'Custom CTA');
});
test('doctor explains missing dependencies and runtime problems without modifying files',async()=>{
 const root=await mkdtemp(join(tmpdir(),'website-doctor-'));
 try{
 const pkg={name:'xovion-custom-website',scripts:{build:'node scripts/build.mjs'},devDependencies:{wrangler:'4.145.0'}};
 await writeFile(join(root,'package.json'),JSON.stringify(pkg));await writeFile(join(root,'package-lock.json'),JSON.stringify({packages:{'':{devDependencies:pkg.devDependencies}}}));
 await mkdir(join(root,'src'));await writeFile(join(root,'src/site.json'),JSON.stringify(sample));
 const before=await readFile(join(root,'src/site.json'),'utf8');
 const results=await diagnose({root,nodeVersion:'20.0.0',networkCheck:()=>{throw Error('unsupported');}});
 assert.ok(results.some(x=>x.name==='Node.js'&&x.status==='fail'));assert.ok(results.some(x=>x.name==='Wrangler installation'&&x.detail.includes('npm ci')));assert.ok(results.some(x=>x.name==='Production content'&&x.status==='warn'));assert.ok(results.some(x=>x.name==='Local preview environment'&&x.status==='fail'));assert.equal(await readFile(join(root,'src/site.json'),'utf8'),before);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('doctor handles the wrong folder with one actionable fix',async()=>{
 const root=await mkdtemp(join(tmpdir(),'website-empty-'));try{const results=await diagnose({root,nodeVersion:'22.0.0'});assert.ok(results.some(x=>x.name==='Project folder'&&x.status==='fail'));assert.equal(results.length,2);}finally{await rm(root,{recursive:true,force:true});}
});
