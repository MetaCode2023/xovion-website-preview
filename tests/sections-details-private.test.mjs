import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {renderSite,validateSite} from '../scripts/build.mjs';
import {inspectFile} from '../scripts/check-private.mjs';
const sample=JSON.parse(await readFile(new URL('./fixtures/site.json',import.meta.url)));
const template=await readFile(new URL('../src/index.html',import.meta.url),'utf8');
test('every optional-section combination removes sections and related navigation',()=>{
 for(let bits=0;bits<8;bits++){
 const sections={services:Boolean(bits&1),process:Boolean(bits&2),faq:Boolean(bits&4)};const html=renderSite({...sample,sections},template);
 for(const key of ['services','process']){assert.equal(html.includes(`id="${key}"`),sections[key]);assert.equal(html.includes(`href="#${key}"`),sections[key]);}
 assert.equal(html.includes('class="faq"'),sections.faq);assert.ok(html.includes('id="contact"'));assert.ok(!html.includes('{{'));
 }
 assert.throws(()=>validateSite({...sample,sections:{faq:'false'}}));assert.throws(()=>validateSite({...sample,sections:{unknown:false}}));
});
test('disabled process and FAQ content can be omitted',()=>{
 const s=structuredClone(sample);s.sections={process:false,faq:false};delete s.copy.processSteps;delete s.copy.faqs;delete s.copy.processHeading;delete s.copy.faqHeading;
 assert.doesNotThrow(()=>renderSite(s,template));
});
test('business details are optional, escaped and use valid destinations',()=>{
 const html=renderSite({...sample,businessDetails:{phone:'+1 (605) 555-0123',hours:['Mon–Fri: 9–5'],serviceAreas:['Town & region'],address:'10 <Main> Street',directionsUrl:'https://maps.example.com/?q=Main&zoom=10'}},template);
 assert.match(html,/href="tel:\+16055550123"/);assert.match(html,/10 &lt;Main&gt; Street/);assert.match(html,/Town &amp; region/);assert.match(html,/q=Main&amp;zoom=10/);
 assert.ok(!renderSite(sample,template).includes('class="business-details"'));
 for(const details of [{phone:'call me'},{phone:'123'},{phone:'605+5550123'},{hours:'always'},{directionsUrl:'javascript:alert(1)'},{directionsUrl:'https://user:pass@example.com'}])assert.throws(()=>validateSite({...sample,businessDetails:details}));
});
test('private check detects credentials without returning their values',()=>{
 const token='ghp_'+'A'.repeat(36);const key=['-----BEGIN',' PRIVATE KEY-----'].join('');
 for(const content of [token,key,'api_key = "'+'x'.repeat(32)+'"']){const findings=inspectFile('src/config.js',content);assert.ok(findings.length);assert.ok(!JSON.stringify(findings).includes(content));}
 assert.ok(inspectFile('.env.production','PUBLIC=yes').length);assert.equal(inspectFile('.env.example','API_KEY=replace-me').length,0);assert.equal(inspectFile('BUSINESS-BRIEF.md','Business name: Local Shop').length,0);
});

test('private check reads staged content even when working content was cleaned',async()=>{
 const {mkdtemp,writeFile,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');const {checkPrivate}=await import('../scripts/check-private.mjs');const exec=promisify(execFile);
 const root=await mkdtemp(join(tmpdir(),'starter-index-'));
 try{await exec('git',['init','-q'],{cwd:root});await writeFile(join(root,'config.js'),'ghp_'+'A'.repeat(36));await exec('git',['add','config.js'],{cwd:root});await writeFile(join(root,'config.js'),'Safe working file');const result=await checkPrivate(root);assert.equal(result.mode,'Git index files');assert.ok(result.findings.some(x=>x.rule==='GitHub token'));}finally{await rm(root,{recursive:true,force:true});}
});
