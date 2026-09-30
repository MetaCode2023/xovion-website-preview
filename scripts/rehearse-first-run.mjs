import {mkdtemp,cp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,relative,resolve} from 'node:path';
import {spawn} from 'node:child_process';
import {pathToFileURL} from 'node:url';
const root=process.cwd();
const scratch=await mkdtemp(join(tmpdir(),'xovion-first-run-'));
const excluded=new Set(['node_modules','dist','.git','.wrangler','test-results','playwright-report']);
const run=(args)=>new Promise((resolveRun,reject)=>{
 const child=spawn(process.platform==='win32'?'npm.cmd':'npm',args,{cwd:scratch,stdio:'inherit',shell:process.platform==='win32'});
 child.once('error',reject);child.once('exit',code=>code===0?resolveRun():reject(Error(`npm ${args.join(' ')} failed (${code})`)));
});
try{
 await cp(root,scratch,{recursive:true,filter:path=>!relative(root,path).split(/[\\/]/).some(part=>excluded.has(part)||part.includes('.setup-')||part.startsWith('.env')||part.startsWith('.dev.vars'))});
 console.log('Rehearsing in a temporary clean copy; the original project is unchanged.');
 await run(['ci']);
 const {runSetup}=await import(pathToFileURL(resolve(scratch,'scripts/setup.mjs')).href);
 const answers=['Sample Repair Co.','Example town','Repair support','Repair enquiries made clear.','We discuss equipment repair needs.','Repairs, Consultation','Clear and practical','demo','hello@example.com','yes'];
 if(!await runSetup(async()=>answers.shift(),scratch))throw Error('Setup did not save');
 const path=join(scratch,'src/site.json');const site=JSON.parse(await readFile(path,'utf8'));site.sections={services:false,process:false,faq:false};site.businessDetails={phone:'+1 (605) 555-0123',hours:['Example hours: Mon–Fri 9–5'],serviceAreas:['Example town']};
 await writeFile(path,JSON.stringify(site,null,2)+'\n');await run(['run','verify']);
 const html=await readFile(join(scratch,'dist/index.html'),'utf8');
 if(!html.includes('Sample Repair Co.')||html.includes('href="#services"')||!html.includes('tel:+16055550123'))throw Error('Customized output did not match setup');
 await run(['exec','--','wrangler','deploy','--dry-run','--env','']);
 site.example=false;site.contactMode='email';site.email='owner@sample-repair.test';site.siteUrl='https://sample-repair.test';await writeFile(path,JSON.stringify(site,null,2)+'\n');
 const build=spawn(process.execPath,['scripts/build.mjs','--production'],{cwd:scratch,stdio:'inherit'});await new Promise((resolveBuild,reject)=>{build.once('error',reject);build.once('exit',code=>code===0?resolveBuild():reject(Error('Production rehearsal failed')));});
 if(!(await readFile(join(scratch,'dist/sitemap.xml'),'utf8')).includes('<loc>https://sample-repair.test</loc>'))throw Error('Production sitemap has the wrong origin');
 if((await readFile(join(scratch,'dist/index.html'),'utf8')).includes('href="/start/"'))throw Error('Onboarding link leaked into production homepage');
 const {access}=await import('node:fs/promises');let onboardingPresent=true;try{await access(join(scratch,'dist/start'));}catch{onboardingPresent=false;}if(onboardingPresent)throw Error('Onboarding leaked into production output');
 console.log('PASS: clean install, setup, optional sections, contact details, verification Cloudflare dry run and production onboarding exclusion. No deployment occurred. Browser/account/human usability checks are separate.');
}finally{await rm(scratch,{recursive:true,force:true});}
