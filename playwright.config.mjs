import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./browser-tests',
 fullyParallel:true,
 forbidOnly:Boolean(process.env.CI),
 retries:0,
 workers:process.env.CI?2:undefined,
 reporter:'list',
 use:{baseURL:'http://127.0.0.1:8791',trace:'retain-on-failure',screenshot:'only-on-failure'},
 projects:[
  {name:'desktop-chromium',use:{browserName:'chromium',viewport:{width:1280,height:800}}},
  {name:'mobile-chromium',use:{browserName:'chromium',viewport:{width:390,height:844},isMobile:true,hasTouch:true}}
 ],
 webServer:{
  command:'npm run build && wrangler dev --env "" --local --ip 127.0.0.1 --port 8791',
  url:'http://127.0.0.1:8791',reuseExistingServer:false,timeout:60000,
  env:{WRANGLER_SEND_METRICS:'false'},stdout:'ignore',stderr:'pipe'
 }
});
