import {readFile,access} from 'node:fs/promises';
import {resolve} from 'node:path';
import {networkInterfaces} from 'node:os';
import {pathToFileURL} from 'node:url';
import {validateSite} from './build.mjs';

// Read-only diagnostics. Never reads credentials, logs account details or changes files.
export async function diagnose({root=process.cwd(),nodeVersion=process.versions.node,networkCheck=networkInterfaces}={}){
 const results=[];
 const add=(status,name,detail)=>results.push({status,name,detail});
 const json=async path=>JSON.parse(await readFile(resolve(root,path),'utf8'));
 const major=Number(nodeVersion.split('.')[0]);
 add(major>=22?'pass':'fail','Node.js',major>=22?`Version ${nodeVersion}`:'Install Node.js 22 or newer, reopen your terminal, then run npm ci.');
 let pkg;
 try{pkg=await json('package.json');if(!pkg.scripts?.build||!pkg.devDependencies?.wrangler)throw Error();add('pass','Project folder','Starter package found.');}
 catch{add('fail','Project folder','Open a terminal in the extracted starter folder containing package.json.');return results;}
 try{const lock=await json('package-lock.json');if(lock.packages?.['']?.devDependencies?.wrangler!==pkg.devDependencies.wrangler)throw Error();add('pass','Dependency lockfile','Wrangler version matches package.json.');}
 catch{add('fail','Dependency lockfile','Restore package-lock.json from your repo, or ask Codex to reconcile it with package.json.');}
 try{const installed=await json('node_modules/wrangler/package.json');await access(resolve(root,'node_modules/wrangler/bin/wrangler.js'));if(installed.version!==pkg.devDependencies.wrangler)throw Error();add('pass','Wrangler installation','Pinned local CLI is installed.');}
 catch{add('fail','Wrangler installation','Run npm ci in this folder, then npm run doctor again.');}
 for(const path of ['src/index.html','src/client.js','src/worker.js','public/style.css','wrangler.jsonc']){
 try{await access(resolve(root,path));}catch{add('fail','Missing project file',`Restore ${path} from your repository.`);}
 }
 let site;
 try{site=await json('src/site.json');validateSite(site);add('pass','Preview content','Content configuration is valid.');}
 catch(error){add('fail','Preview content',`Fix src/site.json: ${error.message}. Use npm run setup for business details.`);}
 if(site){try{validateSite(site,true);add('pass','Production content','Build gates pass; real contact delivery still needs testing.');}catch{add('warn','Production content','Preview can work before launch. Replace example copy, choose a live contact method and set your real HTTPS siteUrl.');}}
 try{networkCheck();add('pass','Local network interfaces','Interface lookup is available; this does not verify server startup.');}
 catch{add('fail','Local preview environment','Network-interface lookup failed. Run the project on a normal local computer or a development environment that supports Wrangler.');}
 add('info','Next checks','Run npm run verify, then npm run dev. Restart dev after changing build scripts or Wrangler configuration.');
 add('info','Cloudflare access','Account access was not checked. Before deployment run npx wrangler login, then npx wrangler whoami privately and confirm your account.');
 return results;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const results=await diagnose();for(const item of results)console.log(`[${item.status.toUpperCase()}] ${item.name}: ${item.detail}`);
 process.exitCode=results.some(x=>x.status==='fail')?1:0;
}
