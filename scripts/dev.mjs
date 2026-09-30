import {spawn} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {build} from './build.mjs';

export async function sourceFingerprint(directories=['src','public']) {
 const entries=[];
 const walk=async dir=>{for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())await walk(path);else if(entry.isFile()&&!entry.name.includes('.setup-'))entries.push(path);}};
 for(const dir of directories)await walk(dir);
 const hash=createHash('sha256');
 for(const path of entries.sort()){hash.update(path);hash.update(await readFile(path));}
 return hash.digest('hex');
}
export function startWatch({fingerprint,rebuild,onError,interval=500,initialFingerprint}) {
 let stopped=false,previous=initialFingerprint, timer;
 const tick=async()=>{
  try{const next=await fingerprint();if(next!==previous){await rebuild();previous=next;}}catch(error){onError(error);}
  if(!stopped)timer=setTimeout(tick,interval);
 };
 // Serial polling handles atomic editor saves on Windows/macOS/Linux, with no overlapping builds.
 tick();return ()=>{stopped=true;clearTimeout(timer);};
}
export async function runDev(){
 const initialFingerprint=await sourceFingerprint();
 await build();
 const wrangler=fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js',import.meta.url));
 const child=spawn(process.execPath,[wrangler,'dev','--env','','--local','--ip','127.0.0.1','--live-reload','--var','LOCAL_DEV:true'],{stdio:'inherit'});
 let lastError='';
 const stopWatch=startWatch({initialFingerprint,fingerprint:sourceFingerprint,rebuild:async()=>{await build();lastError='';console.log('Updated preview.');},onError:error=>{if(error.message!==lastError){console.error(`Preview update failed: ${error.message}\nFix the source file to retry automatically.`);lastError=error.message;}}});
 const stop=()=>{stopWatch();child.kill('SIGTERM');};
 process.once('SIGINT',stop);process.once('SIGTERM',stop);
 child.on('error',error=>{stopWatch();console.error(error.message);process.exitCode=1;});
 child.on('exit',code=>{stopWatch();process.exitCode=code||0;});
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await runDev();
