import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSite,escapeHTML} from '../scripts/build.mjs';
import worker from '../src/worker.js';
import {readFile} from 'node:fs/promises';
const sample=JSON.parse(await readFile(new URL('./fixtures/site.json',import.meta.url)));
test('example runs locally but cannot accidentally launch as production',()=>{assert.doesNotThrow(()=>validateSite(sample));assert.throws(()=>validateSite(sample,true));});
test('production requires real HTTPS origin and working contact mode',()=>{const s={...sample,example:false,email:'owner@realbusiness.net',contactMode:'email',siteUrl:'https://realbusiness.net'};assert.doesNotThrow(()=>validateSite(s,true));assert.throws(()=>validateSite({...s,siteUrl:'http://localhost'},true));assert.throws(()=>validateSite({...s,contactMode:'booking',bookingUrl:'javascript:alert(1)'},true));});
test('business copy is escaped before HTML output',()=>{assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');});
test('starter cannot accept a real inquiry',async()=>{const r=await worker.fetch(new Request('https://example.com/api/quote',{method:'POST'}),{});assert.equal(r.status,405);});
test('missing API returns JSON 404; preview is noindex',async()=>{const api=await worker.fetch(new Request('https://example.com/api/x'),{});assert.equal(api.status,404);const r=await worker.fetch(new Request('https://example.com/'),{ASSETS:{fetch:async()=>new Response('ok')},SITE_STAGE:'preview'});assert.equal(r.headers.get('X-Robots-Tag'),'noindex, nofollow');assert.ok(r.headers.get('Content-Security-Policy').includes("form-action 'none'"));});

test('Worker preserves asset body, status and content type while adding headers',async()=>{
 for(const status of [200,404]){
 const html='<h1>Actual page</h1>';
 const response=await worker.fetch(new Request('https://example.com/'),{SITE_STAGE:'preview',ASSETS:{fetch:async()=>new Response(html,{status,headers:{'Content-Type':'text/html'}})}});
 assert.equal(response.status,status);assert.equal(await response.text(),html);assert.equal(response.headers.get('Content-Type'),'text/html');assert.equal(response.headers.get('X-Content-Type-Options'),'nosniff');
 }
});
