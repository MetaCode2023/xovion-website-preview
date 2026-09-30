import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
async function fill(page){await page.locator('[name=name]').fill('Sample Workshop');await page.locator('[name=location]').fill('Example town');await page.locator('#business-form [name=description]').fill('We discuss repair requests.');await page.locator('[name=services]').fill('Repair consultation');}
test('onboarding generates downloadable kit without submitting business details',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 const writes=[];page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))writes.push(request.url());});
 await page.goto('/start/');await expect(page.locator('h1')).toBeVisible();await fill(page);await page.getByRole('button',{name:'Create my brief and prompt'}).click();expect(await page.locator('#kit-text').inputValue()).toContain('Sample Workshop');
 await page.getByRole('button',{name:'Copy everything'}).click();await expect(page.getByRole('status')).toContainText('Copied');expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('Sample Workshop');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download business brief',exact:true}).click();const file=await download;expect(file.suggestedFilename()).toBe('BUSINESS-BRIEF.md');expect(await readFile(await file.path(),'utf8')).toContain('Sample Workshop');
 const promptDownload=page.waitForEvent('download');await page.getByRole('button',{name:'Download Codex prompt',exact:true}).click();const promptFile=await promptDownload;expect(await readFile(await promptFile.path(),'utf8')).toContain('Do not publish');
 await page.locator('[name=name]').fill('Updated name');await expect(page.locator('#output')).toBeHidden();await page.getByRole('button',{name:'Clear answers'}).click();await expect(page.locator('[name=name]')).toHaveValue('');expect(writes).toEqual([]);
});
test('onboarding refuses unsafe contact links and fits narrow screens',async({page})=>{
 await page.goto('/start/');await fill(page);await page.locator('[name=contactMode]').selectOption('booking');await page.locator('[name=bookingUrl]').fill('http://example.com/request');await page.getByRole('button',{name:'Create my brief and prompt'}).click();await expect(page.getByRole('status')).toContainText('HTTPS');await expect(page.locator('#output')).toBeHidden();
 await page.setViewportSize({width:360,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 const guide=await page.request.get('/start/guides/GUIDED-LAUNCH.md');expect(guide.status()).toBe(200);expect(await guide.text()).toContain('Production launch prompt');
});
