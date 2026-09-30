import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {makeSetup,runSetup} from '../scripts/setup.mjs';
import {sourceFingerprint,startWatch} from '../scripts/dev.mjs';
import worker from '../src/worker.js';
const sample=JSON.parse(await readFile(new URL('./fixtures/site.json',import.meta.url)));
const answers={name:'Test Business',location:'Sioux Falls',tagline:'Careful work',headline:'Welcome',description:'Local services',services:'Cleaning, Maintenance',style:'Simple',contactMode:'demo',email:'hello@example.com',bookingUrl:''};
test('setup preserves known services and validates before save',()=>{
 const known=sample.services[0];const result=makeSetup(sample,{...answers,services:known.name+', New service'});
 assert.deepEqual(result.config.services[0],known);assert.equal(result.config.example,false);assert.match(result.brief,/Test Business/);
 assert.throws(()=>makeSetup(sample,{...answers,name:''}));assert.throws(()=>makeSetup(sample,{...answers,services:''}));assert.throws(()=>makeSetup(sample,{...answers,contactMode:'booking',bookingUrl:'http://example.com'}));
});
test('cancel changes nothing; saving retains backups of content and brief',async()=>{
 const root=await mkdtemp(join(tmpdir(),'website-setup-'));
 try{
 await mkdir(join(root,'src'));const original=JSON.stringify(sample);await writeFile(join(root,'src/site.json'),original);await writeFile(join(root,'BUSINESS-BRIEF.md'),'Existing owner notes');
 const responses=['Test Business','Sioux Falls','Careful work','Welcome','Local services','Cleaning, Maintenance','Simple','demo','hello@example.com'];
 let queue=[...responses,'no'];assert.equal(await runSetup(async()=>queue.shift(),root),false);assert.equal(await readFile(join(root,'src/site.json'),'utf8'),original);assert.deepEqual(await readdir(join(root,'src')),['site.json']);
 queue=[...responses,'yes'];assert.equal(await runSetup(async()=>queue.shift(),root),true);assert.equal(JSON.parse(await readFile(join(root,'src/site.json'))).name,'Test Business');
 const backup=(await readdir(root)).find(x=>x.startsWith('BUSINESS-BRIEF.md.setup-backup-'));assert.equal(await readFile(join(root,backup),'utf8'),'Existing owner notes');
 const sourceBackup=(await readdir(join(root,'src'))).find(x=>x.includes('.setup-backup-'));assert.equal(await readFile(join(root,'src',sourceBackup),'utf8'),original);
 }finally{await rm(root,{recursive:true,force:true});}
});
test('fingerprints detect new/deleted files but ignore setup backups',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'website-watch-'));try{
 await writeFile(join(dir,'a.css'),'a');const first=await sourceFingerprint([dir]);await writeFile(join(dir,'a.css.setup-backup-1'),'old');assert.equal(await sourceFingerprint([dir]),first);
 await writeFile(join(dir,'b.css'),'b');assert.notEqual(await sourceFingerprint([dir]),first);await rm(join(dir,'b.css'));assert.equal(await sourceFingerprint([dir]),first);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('watcher retries failed builds, serializes builds and skips unchanged content',async()=>{
 let content='one',active=0,maxActive=0,attempts=0,errors=0,completed;
 const done=new Promise(resolve=>{completed=resolve;});
 const stop=startWatch({interval:5,initialFingerprint:'zero',fingerprint:async()=>content,onError:()=>{errors++;},rebuild:async()=>{
 active++;maxActive=Math.max(maxActive,active);attempts++;await new Promise(r=>setTimeout(r,10));active--;
 if(attempts===1)throw Error('Invalid content');if(attempts===2)content='two';if(attempts===3)completed();
 }});
 try{await Promise.race([done,new Promise((_,reject)=>setTimeout(()=>reject(Error('Watcher timeout')),1000))]);await new Promise(r=>setTimeout(r,30));assert.equal(attempts,3);assert.equal(errors,1);assert.equal(maxActive,1);}finally{stop();}
});
test('live reload CSP applies only to loopback preview requests',async()=>{
 for(const [url,stage,enabled] of [['http://127.0.0.1/','preview',true],['https://example.com/','preview',false],['http://localhost/','production',false]]){
 const response=await worker.fetch(new Request(url),{LOCAL_DEV:'true',SITE_STAGE:stage,ASSETS:{fetch:async()=>new Response('ok')}});assert.equal(response.headers.get('Content-Security-Policy').includes("'unsafe-inline'"),enabled);
 }
});
