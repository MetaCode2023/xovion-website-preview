import {createKit} from './kit.mjs';
const form=document.querySelector('#business-form');
const output=document.querySelector('#output');
const text=document.querySelector('#kit-text');
const status=document.querySelector('#status');
const errors=document.querySelector('#error-summary');
const optional=document.querySelector('#optional-details');
const essential=['name','location','description','services'];
let kit;
for(const control of form.querySelectorAll('input,textarea,select')){
 control.id='field-'+control.name;
 const error=document.createElement('span');error.id=control.id+'-error';error.className='field-error';error.hidden=true;
 control.after(error);control.setAttribute('aria-describedby',error.id);
}
function clearErrors(){errors.hidden=true;errors.textContent='';for(const control of form.querySelectorAll('[aria-invalid]'))control.removeAttribute('aria-invalid');for(const error of form.querySelectorAll('.field-error')){error.hidden=true;error.textContent='';}}
function progress(){const count=essential.filter(name=>form.elements.namedItem(name).value.trim()).length;document.querySelector('#progress').textContent=`${count} of 4 essentials completed`;}
function invalidate(){kit=undefined;output.hidden=true;text.value='';}
form.addEventListener('submit',event=>{
 event.preventDefault();clearErrors();invalidate();
 try{kit=createKit(Object.fromEntries(new FormData(form)));text.value=kit.combined;output.hidden=false;status.textContent='Your brief and prompt are ready. Review them, then download or copy.';document.querySelector('#output-heading').focus();}
 catch(error){status.textContent='';errors.textContent=error.message;errors.hidden=false;const control=form.elements.namedItem(error.field);if(control){if(optional.contains(control))optional.open=true;control.setAttribute('aria-invalid','true');const note=document.getElementById(control.id+'-error');note.textContent=error.message;note.hidden=false;control.focus();}else errors.focus();}
});
form.addEventListener('input',()=>{const hadKit=Boolean(kit);invalidate();clearErrors();progress();status.textContent=hadKit?'Answers changed. Create your kit again to include the update.':'';});
function selectText(){text.focus();text.select();text.setSelectionRange(0,text.value.length);status.textContent='Text selected. Use your device’s Copy action; it includes the brief and prompt.';}
document.querySelector('#select-kit').addEventListener('click',()=>{if(kit)selectText();});
document.querySelector('#download-kit').addEventListener('click',()=>{
 if(!kit)return;
 const url=URL.createObjectURL(new Blob([kit.combined],{type:'text/markdown;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='WEBSITE-KIT.md';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
 status.textContent='Download requested: WEBSITE-KIT.md. Check your downloads. If it did not save, use Copy everything or Select text to copy.';
});
document.querySelector('#copy-kit').addEventListener('click',async()=>{
 if(!kit)return;const selectedKit=kit;
 try{await navigator.clipboard.writeText(selectedKit.combined);if(kit===selectedKit)status.textContent='Copied. Paste the brief and prompt into your Codex project.';}
 catch{if(kit===selectedKit)selectText();}
});
document.querySelector('#clear').addEventListener('click',()=>{form.reset();invalidate();clearErrors();progress();status.textContent='Cleared. Your details were not stored.';form.elements.namedItem('name').focus();});
progress();
