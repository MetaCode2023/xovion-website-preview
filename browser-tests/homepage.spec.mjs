import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {renderSite} from '../scripts/build.mjs';
const template=await readFile(new URL('../src/index.html',import.meta.url),'utf8');
const site=JSON.parse(await readFile(new URL('../src/site.json',import.meta.url),'utf8'));

test('homepage navigation and FAQs work without browser errors',async({page})=>{
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');await expect(page.locator('h1')).toBeVisible();
 for(const target of ['services','process','contact'].filter(x=>x==='contact'||site.sections?.[x]!==false)){
  await page.locator(`nav a[href="#${target}"]`).click();await expect(page).toHaveURL(new RegExp(`#${target}$`));await expect(page.locator(`#${target}`)).toBeInViewport();
 }
 if(site.sections?.faq!==false){const faq=page.locator('details').first();await faq.locator('summary').click();await expect(faq).toHaveAttribute('open','');await expect(faq.locator('p')).toBeVisible();await faq.locator('summary').click();await expect(faq).not.toHaveAttribute('open','');}
 expect(errors).toEqual([]);
});

test('service dialog validates, sends nothing and resets after closing',async({page})=>{
 test.skip(site.contactMode!=='demo','Live contact mode uses the destination-link check.');
 const submissions=[];page.on('request',request=>{if(!['GET','HEAD'].includes(request.method()))submissions.push(request.url());});
 await page.goto('/');const opener=page.locator(site.sections?.services===false?'.hero [data-demo]':'.cards [data-demo]').first();const service=await opener.getAttribute('data-demo');await opener.click();
 const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();if(service)await expect(dialog.locator('select')).toHaveValue(service);
 await dialog.getByRole('button',{name:'Preview next step'}).click();await expect(dialog.locator('form')).toBeVisible();
 expect(await dialog.locator('input').evaluate(x=>x.validity.valueMissing)).toBe(true);
 await dialog.locator('input').fill('Sample');await dialog.getByRole('button',{name:'Preview next step'}).click();await expect(page.getByRole('status')).toContainText('Nothing was sent or saved');await expect(page.getByRole('status')).toBeFocused();await expect(dialog.locator('form')).toBeHidden();
 await page.getByRole('button',{name:'Close',exact:true}).click();await expect(dialog).not.toBeVisible();await opener.click();await expect(dialog.locator('input')).toHaveValue('');await expect(dialog.locator('form')).toBeVisible();await expect(page.getByRole('status')).toBeEmpty();
 expect(submissions).toEqual([]);
});

test('keyboard users can skip navigation and close the dialog with Escape',async({page})=>{
 await page.goto('/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#main$/);
 if(site.contactMode!=='demo')return;
 const opener=page.locator('.hero [data-demo]');await opener.focus();await page.keyboard.press('Enter');await expect(page.getByRole('dialog')).toBeVisible();
 await page.keyboard.press('Tab');expect(await page.evaluate(()=>Boolean(document.activeElement.closest('dialog')))).toBe(true);
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await expect(opener).toBeFocused();
});

test('mobile, tablet and desktop layouts have no horizontal page overflow',async({page})=>{
 await page.goto('/');for(const width of [360,390,768,1280]){
  await page.setViewportSize({width,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),`Overflow at ${width}px`).toBe(true);
 }
});

test('preview Worker protects missing routes and rejects real submissions',async({request})=>{
 const response=await request.get('/');expect(response.headers()['x-robots-tag']).toContain('noindex');expect(response.headers()['content-security-policy']).not.toContain('unsafe-inline');
 const missing=await request.get('/missing-page');expect(missing.status()).toBe(404);
 const submit=await request.post('/api/quote',{data:{name:'Sample'}});expect(submit.status()).toBe(405);
});

// Check the configured destination without contacting an external vendor.
test('live contact actions point to the configured destination',async({page})=>{
 test.skip(site.contactMode==='demo','Demo mode is covered by the dialog check.');
 await page.goto('/');const href=site.contactMode==='email'?'mailto:'+site.email:site.bookingUrl;
 const links=page.locator('.hero a.button, .cards a.button, #contact a.button');
 expect(await links.count()).toBe((site.sections?.services===false?0:site.services.length)+2);
 for(const link of await links.all())await expect(link).toHaveAttribute('href',href);
});

test('hidden sections and public details work in the rendered browser page',async({page})=>{
 const html=renderSite({...site,sections:{services:false,process:false,faq:false},businessDetails:{phone:'+1 (605) 555-0123',hours:['Example hours'],serviceAreas:['Example town'],directionsUrl:'https://maps.example.com/directions'}},template);
 await page.route('http://127.0.0.1:8791/',route=>route.fulfill({status:200,contentType:'text/html',body:html}));
 await page.goto('/');await expect(page.locator('h1')).toBeVisible();await expect(page.locator('nav a')).toHaveCount(1);await expect(page.locator('#services, #process, .faq')).toHaveCount(0);
 await expect(page.locator('a[href="tel:+16055550123"]')).toHaveText('+1 (605) 555-0123');await expect(page.getByRole('link',{name:'Open directions'})).toHaveAttribute('href','https://maps.example.com/directions');
 await page.setViewportSize({width:360,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
});
