import test from 'node:test';
import assert from 'node:assert/strict';
import {createKit} from '../public/start/kit.mjs';
const facts={name:'Repair Company',location:'Example town',description:'Equipment repairs',services:'Repairs, consultation'};
test('questionnaire produces a personalized brief and actionable project prompt',()=>{
 const kit=createKit(facts);assert.match(kit.brief,/Repair Company/);assert.match(kit.brief,/Not supplied; keep production blocked/);assert.match(kit.prompt,/Do not publish/);assert.match(kit.prompt,/BUSINESS-BRIEF.md/);assert.match(kit.combined,/First Codex prompt/);
});
test('questionnaire validates required facts and live contact destinations',()=>{
 assert.throws(()=>createKit({...facts,name:''}));assert.throws(()=>createKit({...facts,contactMode:'email'}));assert.throws(()=>createKit({...facts,contactMode:'booking',bookingUrl:'javascript:alert(1)'}));assert.throws(()=>createKit({...facts,bookingUrl:'https://user:password@example.com'}));assert.throws(()=>createKit({...facts,domain:'https://example.com/path'}));assert.doesNotThrow(()=>createKit({...facts,contactMode:'booking',bookingUrl:'https://example.com/request'}));
});

test('questionnaire caps answers, identifies failing fields and accepts only public email syntax',()=>{
 for(const [field,value] of [['name','x'.repeat(101)],['services','hello\u0000world'],['email','bad email@host.test']]){
  assert.throws(()=>createKit({...facts,[field]:value}),error=>error.field===field);
 }
 assert.throws(()=>createKit({...facts,name:'   '}),error=>error.field==='name');
 assert.match(createKit(facts).combined,/First save the business brief/);
});
