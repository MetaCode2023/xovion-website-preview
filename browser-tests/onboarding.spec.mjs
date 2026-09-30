import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
async function fill(page){await page.locator('[name=name]').fill('Sample Workshop');await page.locator('[name=location]').fill('Example town');await page.locator('#business-form [name=description]').fill('We discuss repair requests.');await page.locator('[name=services]').fill('Repair consultation');}
test('onboarding generates downloadable kit without submitting business details',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 const writes=[];page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))writes.push(request.url());});
 await page.goto('/start/');await expect(page.locator('h1')).toBeVisible();await fill(page);await page.getByRole('button',{name:'Create my brief and prompt'}).click();expect(await page.locator('#kit-text').inputValue()).toContain('Sample Workshop');
 await page.getByRole('button',{name:'Copy everything'}).click();await expect(page.getByRole('status')).toContainText('Copied');expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('Sample Workshop');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Download complete kit',exact:true}).click();const file=await download;expect(file.suggestedFilename()).toBe('WEBSITE-KIT.md');const contents=await readFile(await file.path(),'utf8');expect(contents).toContain('Sample Workshop');expect(contents).toContain('Do not publish');expect(contents).toContain('First save the business brief');
 await page.locator('[name=name]').fill('Updated name');await expect(page.locator('#output')).toBeHidden();await page.getByRole('button',{name:'Clear answers'}).click();await expect(page.locator('[name=name]')).toHaveValue('');expect(writes).toEqual([]);
});
test('onboarding refuses unsafe contact links and fits narrow screens',async({page})=>{
 await page.goto('/start/');await fill(page);await page.locator('#optional-details summary').click();await page.locator('[name=contactMode]').selectOption('booking');await page.locator('[name=bookingUrl]').fill('http://example.com/request');await page.getByRole('button',{name:'Create my brief and prompt'}).click();await expect(page.getByRole('alert')).toContainText('HTTPS');await expect(page.locator('#output')).toBeHidden();
 await page.setViewportSize({width:360,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 const guide=await page.request.get('/start/guides/GUIDED-LAUNCH.md');expect(guide.status()).toBe(200);expect(await guide.text()).toContain('Production launch prompt');
});

test('onboarding focuses the field to fix, offers manual copying and clears stale errors',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(Error('Unavailable'))},configurable:true});});
 await page.goto('/start/');await page.getByRole('button',{name:'Create my brief and prompt'}).click();await expect(page.locator('[name=name]')).toBeFocused();await expect(page.locator('[name=name]')).toHaveAttribute('aria-invalid','true');
 await fill(page);await expect(page.locator('#progress')).toContainText('4 of 4');await page.getByRole('button',{name:'Create my brief and prompt'}).click();await expect(page.locator('#output-heading')).toBeFocused();
 await page.getByRole('button',{name:'Copy everything',exact:true}).click();await expect(page.getByRole('status')).toContainText('Text selected');expect(await page.locator('#kit-text').evaluate(el=>el.selectionEnd-el.selectionStart)).toBeGreaterThan(100);
 await page.locator('[name=name]').fill('Changed');await expect(page.locator('#output')).toBeHidden();await expect(page.getByRole('status')).toContainText('Create your kit again');
 await page.locator('#optional-details summary').click();await page.locator('[name=contactMode]').selectOption('email');await page.getByRole('button',{name:'Create my brief and prompt'}).click();await expect(page.locator('[name=email]')).toBeFocused();await expect(page.locator('[name=email]')).toHaveAttribute('aria-invalid','true');
 await page.getByRole('button',{name:'Clear answers'}).click();await expect(page.locator('#error-summary')).toBeHidden();await expect(page.locator('[name=name]')).toBeFocused();
});
