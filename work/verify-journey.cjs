const {chromium}=require('C:/Users/Vishnu saran/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const p=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await p.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
 await p.locator('.hero-kenko [data-renderer="webgl"]').waitFor({timeout:30000});
 await p.screenshot({path:'screenshots/journey-hero-desktop.png'});
 const colors=[];
 for(let i=0;i<5;i++){
  await p.locator('#chapter-'+i).evaluate(el=>window.scrollTo({top:el.getBoundingClientRect().top+scrollY,behavior:'instant'}));
  await p.waitForTimeout(1000);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.locator('.story-visual [data-renderer="webgl"]').waitFor({timeout:30000});
  colors.push(await p.locator('.journey-canvas').evaluate(e=>getComputedStyle(e).backgroundColor));
  assert.equal(await p.locator('.scroll-story').evaluate(e=>getComputedStyle(e).backgroundColor),'rgba(0, 0, 0, 0)');
  await p.screenshot({path:'screenshots/journey-chapter-'+i+'.png'});
 }
 assert.equal(await p.locator('.footnote').count(),0);
 await p.locator('#chapter-1').scrollIntoViewIfNeeded();
 await p.locator('#chapter-1').getByRole('slider',{name:/Energy/}).fill('1');
 await p.locator('#chapter-3').getByRole('heading',{name:'15-minute mobility',exact:true}).waitFor();
 const order=await p.evaluate(()=>['.feature-sections','.experience','.trust'].map(s=>document.querySelector(s).getBoundingClientRect().top+scrollY));
 assert.ok(order[0]<order[1]&&order[1]<order[2]);
 await p.locator('.experience').evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await p.waitForTimeout(700);
 await p.screenshot({path:'screenshots/journey-demo-desktop.png'});
 await p.getByRole('tab',{name:'Recipes',exact:true}).click();await p.getByRole('button',{name:/Protein dosa bowl/}).waitFor();
 await p.getByRole('tab',{name:'Today',exact:true}).click();await p.getByRole('button',{name:'Complete check-in',exact:true}).waitFor();
 await p.getByRole('button',{name:'Complete check-in',exact:true}).click();await p.getByRole('dialog').waitFor();await p.getByLabel('Close dialog').click();
 await p.setViewportSize({width:390,height:844});
 for(let i=0;i<5;i++){
  await p.locator('#chapter-'+i).evaluate(el=>el.scrollIntoView({block:'start',behavior:'instant'}));await p.waitForTimeout(700);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  if(i===1||i===2)await p.screenshot({path:'screenshots/journey-mobile-'+i+'.png'});
 }
 await p.screenshot({path:'screenshots/journey-mobile-full.png',fullPage:true});
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await reduced.locator('#chapter-2').scrollIntoViewIfNeeded();
 assert.equal(await reduced.locator('canvas').count(),0);
 assert.equal(await reduced.locator('.story-kicker h2 span').isVisible(),true);
 const fallback=await browser.newPage();await fallback.goto('http://127.0.0.1:5173/?fallback=1',{waitUntil:'networkidle'});await fallback.locator('#chapter-2').scrollIntoViewIfNeeded();assert.equal(await fallback.locator('canvas').count(),0);
 assert.deepEqual(errors,[]);
 fs.writeFileSync('screenshots/journey-verification.json',JSON.stringify({colors,errors,desktop:'1440x900',mobile:'390x844',checks:['continuous transparent section surfaces','live persistent story GLB','five chapters','shared check-in updates','portal tabs/dialog','portal follows feature story','no overflow','reduced motion','image fallback']},null,2));
 await browser.close();console.log('Journey browser checks passed',colors);
})().catch(e=>{console.error(e);process.exit(1)});
