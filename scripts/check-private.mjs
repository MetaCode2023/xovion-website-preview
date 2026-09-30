import {readFile,readdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const exec=promisify(execFile);
const excluded=new Set(['node_modules','dist','.git','.wrangler','test-results','playwright-report']);

export function inspectFile(path,content){
 const findings=[];
 const example=/\.(env|dev\.vars)\.example$/.test(path);
 if(!example&&/(^|\/)(\.env(?:\..*)?|\.dev\.vars(?:\..*)?|id_rsa|id_ed25519|credentials\.json|service[-_]account[^/]*\.json)$|\.(p12|pfx)$/i.test(path))findings.push({path,line:0,rule:'Credential file must not be published'});
 const patterns=[
  ['Private key',/-----BEGIN (?:RSA |EC |OPENSSH |ENCRYPTED )?PRIVATE KEY-----/],
  ['GitHub token',/\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['AWS access key',/\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['Likely assigned credential',/\b(?:api[_-]?key|api[_-]?token|access[_-]?token|client[_-]?secret|password)\s*["']?\s*[:=]\s*["']?[A-Za-z0-9_+\/=-]{24,}/i]
 ];
 content.split('\n').forEach((text,i)=>{for(const [rule,pattern] of patterns)if(pattern.test(text))findings.push({path,line:i+1,rule});});
 return findings;
}
export async function checkPrivate(root=process.cwd()){
 let paths,mode,index=false;
 try{const result=await exec('git',['ls-files','--cached','-z'],{cwd:root,maxBuffer:4*1024*1024});paths=result.stdout.split('\0').filter(Boolean);mode='Git index files';index=true;}
 catch{
  paths=[];mode='project files (ZIP copy; no Git index)';
  const walk=async dir=>{for(const entry of await readdir(resolve(root,dir),{withFileTypes:true})){if(excluded.has(entry.name)||entry.name.includes('.setup-'))continue;const path=dir?`${dir}/${entry.name}`:entry.name;if(entry.isDirectory())await walk(path);else if(entry.isFile())paths.push(path);}};await walk('');
 }
 const findings=[];
 for(const path of paths){const bytes=index?(await exec('git',['show',`:${path}`],{cwd:root,encoding:'buffer',maxBuffer:32*1024*1024})).stdout:await readFile(resolve(root,path));if(bytes.includes(0))continue;findings.push(...inspectFile(path,bytes.toString('utf8')));}
 return {findings,mode,count:paths.length};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{const result=await checkPrivate();for(const finding of result.findings)console.error(`${finding.path}:${finding.line} — ${finding.rule}`);console.log(`Private-information check: ${result.findings.length?'FAIL':'PASS'} (${result.count} ${result.mode}). Values are never printed.`);process.exitCode=result.findings.length?1:0;}
 catch{console.error('Private-information check could not read project files. Check file access and rerun.');process.exitCode=1;}
}
