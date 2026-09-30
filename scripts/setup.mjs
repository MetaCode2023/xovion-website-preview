import {createInterface} from 'node:readline/promises';
import {stdin,stdout} from 'node:process';
import {readFile,writeFile,rename,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {validateSite} from './build.mjs';

export function makeSetup(current, answers) {
 const config={...current,name:answers.name.trim(),location:answers.location.trim(),headline:answers.headline.trim(),description:answers.description.trim(),tagline:answers.tagline.trim(),contactMode:answers.contactMode,email:answers.email.trim(),bookingUrl:answers.bookingUrl.trim(),example:false};
 const services=answers.services.split(',').map(x=>x.trim()).filter(Boolean);
 if(!services.length)throw Error('Enter at least one service.');
 config.services=services.map(name=>current.services.find(x=>x.name===name)||{name,description:'Ask us about the scope and availability for this service.'});
 if(current.example)config.copy={...current.copy,cta:'Get in touch',serviceCta:'Ask about this service',heroSteps:['Share your needs','Discuss the details','Choose your next step'],servicesEyebrow:'What we offer',servicesHeading:'Explore our services.',processHeading:'Start with a conversation.',processSteps:[{title:'Tell us what you need.',description:'Share your priorities and questions.'},{title:'Discuss the details.',description:'Confirm scope, pricing and availability with the business.'},{title:'Agree on the next step.',description:'A request does not confirm a booking or purchase.'}],contactHeading:'How can we help?'};
 validateSite(config);
 const brief=`# My business brief\n\nBusiness name: ${config.name}\nLocation/service area: ${config.location}\nHeadline: ${config.headline}\nWhat we do: ${config.description}\nServices: ${services.join(', ')}\nContact method: ${config.contactMode}\nDesign direction: ${answers.style.trim()||'Use the starter as a starting point.'}\n\nFacts to confirm: service inclusions/exclusions, approved images, pricing, reviews and domain. Do not invent missing claims. New service descriptions are neutral starting points to review with the owner. Demo mode sends and saves nothing.\n`;
 return {config,brief};
}
export async function runSetup(ask, root=process.cwd()) {
 const file=path=>resolve(root,path);
 const current=JSON.parse(await readFile(file('src/site.json'),'utf8'));
 const text=async(label,value='')=>(await ask(`${label}${value?` [${value}]`:''}: `)).trim()||value;
 const answers={};
 answers.name=await text('Business name',current.example?'':current.name);
 answers.location=await text('Location or service area',current.example?'':current.location);
 answers.tagline=await text('Short tagline',current.example?'Service built around your needs.':current.tagline);
 answers.headline=await text('Homepage headline',current.example?'Let’s find the right solution.':current.headline);
 answers.description=await text('What does your business do?',current.example?'':current.description);
 answers.services=await text('Service names, separated by commas',current.example?'':current.services.map(x=>x.name).join(', '));
 answers.style=await text('How should the website feel?','Warm, clear and welcoming');
 answers.contactMode=await text('Contact method: demo, email or booking',current.contactMode);
 answers.email=await text('Public business email (demo can keep the example)',current.email);
 answers.bookingUrl=answers.contactMode==='booking'?await text('Existing HTTPS booking/request URL',current.bookingUrl):current.bookingUrl;
 const result=makeSetup(current,answers);
 console.log(`\nReady to update ${result.config.name}: ${result.config.services.length} services, ${result.config.contactMode} contact mode.\nThis changes src/site.json and BUSINESS-BRIEF.md only. Existing versions are backed up locally.\n`);
 if((await ask('Save these changes? Type yes: ')).trim().toLowerCase()!=='yes'){console.log('Cancelled; no files changed.');return false;}
 // Preserve both previous versions before any replacement. Backup names are never committed.
 const stamp=Date.now();
 await copyFile(file('src/site.json'),file(`src/site.json.setup-backup-${stamp}`));
 await copyFile(file('BUSINESS-BRIEF.md'),file(`BUSINESS-BRIEF.md.setup-backup-${stamp}`));
 await writeFile(file('src/site.json.setup-tmp'),JSON.stringify(result.config,null,2)+'\n');
 await writeFile(file('BUSINESS-BRIEF.md.setup-tmp'),result.brief);
 await rename(file('src/site.json.setup-tmp'),file('src/site.json'));
 await rename(file('BUSINESS-BRIEF.md.setup-tmp'),file('BUSINESS-BRIEF.md'));
 console.log('Saved. Run npm run dev, then ask Codex to customize your design using BUSINESS-BRIEF.md.');return true;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const rl=createInterface({input:stdin,output:stdout});
 try{await runSetup(q=>rl.question(q));}catch(error){console.error(`Setup stopped: ${error.message}`);process.exitCode=1;}finally{rl.close();}
}
