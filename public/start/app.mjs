import {createKit} from './kit.mjs';
const form=document.querySelector('#business-form');
const output=document.querySelector('#output');
const text=document.querySelector('#kit-text');
const status=document.querySelector('#status');
let kit;
form.addEventListener('submit',event=>{
 event.preventDefault();
 try{kit=createKit(Object.fromEntries(new FormData(form)));text.value=kit.combined;output.hidden=false;status.textContent='Your brief and prompt are ready. Review them, then download or copy.';text.focus();}
 catch(error){status.textContent=error.message;status.focus();}
});
form.addEventListener('input',()=>{kit=undefined;output.hidden=true;status.textContent='';text.value='';});
function download(content,name){const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
document.querySelector('#download-brief').addEventListener('click',()=>{if(kit)download(kit.brief,'BUSINESS-BRIEF.md');});
document.querySelector('#download-prompt').addEventListener('click',()=>{if(kit)download(kit.prompt,'FIRST-CODEX-PROMPT.md');});
document.querySelector('#copy-kit').addEventListener('click',async()=>{
 if(!kit)return;
 try{await navigator.clipboard.writeText(kit.combined);status.textContent='Copied. Paste the brief and prompt into your Codex project.';}
 catch{text.focus();text.select();status.textContent='Copy is unavailable here. The text is selected; use your device’s Copy action.';}
});
document.querySelector('#clear').addEventListener('click',()=>{form.reset();kit=undefined;text.value='';output.hidden=true;status.textContent='Cleared. Your details were not stored.';});
