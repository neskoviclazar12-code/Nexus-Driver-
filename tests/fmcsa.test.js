import test from 'node:test';
import assert from 'node:assert/strict';
import fmcsa from '../api/fmcsa.js';
import contact from '../api/contact.js';
const get=q=>fmcsa.fetch(new Request('https://nexusdrivers.com/api/fmcsa?q='+encodeURIComponent(q)));
test('fmcsa lookup: no key, DOT, MC, name, upstream failure',async()=>{
 const original=globalThis.fetch;const old=process.env.FMCSA_WEBKEY;const urls=[];
 try{
  delete process.env.FMCSA_WEBKEY;
  globalThis.fetch=async(url)=>{urls.push(String(url));return Response.json([{dot_number:'1234567',legal_name:'CENSUS FLEET',phy_state:'IL',power_units:'14',status_code:'A'}]);};
  let r=await get('1234567');let c=await r.json();assert.equal(r.status,200);assert.equal(c.results[0].legalName,'CENSUS FLEET');assert.equal(c.results[0].powerUnits,14);assert.ok(urls.at(-1).includes('data.transportation.gov')&&urls.at(-1).includes('dot_number=1234567'));
  await get('acme trucking');assert.ok(urls.at(-1).includes('%24q=acme+trucking'));
  c=await (await get('MC 123456')).json();assert.equal(c.results.length,0);assert.match(c.note,/MC search/);
  process.env.FMCSA_WEBKEY='test-key';
  assert.equal((await get('a')).status,400);
  globalThis.fetch=async(url)=>{urls.push(String(url));
   if(String(url).includes('/docket-number/'))return Response.json({content:[{carrier:{legalName:'MC FLEET LLC',dotNumber:222,phyCity:'CHICAGO',phyState:'IL',totalPowerUnits:12,allowedToOperate:'Y'}}]});
   if(String(url).includes('/name/'))return Response.json({content:[{carrier:{legalName:'ACME TRUCKING',dotNumber:333,phyState:'TX',totalPowerUnits:250,allowedToOperate:'N'}}]});
   return Response.json({content:{carrier:{legalName:'DOT FLEET INC',dotNumber:1234567,phyState:'IN',totalPowerUnits:'40',allowedToOperate:'Y'}}});};
  let d=await (await get('1234567')).json();assert.equal(d.results.length,2);assert.equal(d.results[0].powerUnits,40);assert.equal(d.results[0].allowedToOperate,true);
  d=await (await get('MC 123456')).json();assert.equal(d.results[0].legalName,'MC FLEET LLC');assert.ok(urls.at(-1).includes('docket-number/123456'));
  d=await (await get('acme trucking')).json();assert.equal(d.results[0].dotNumber,'333');assert.ok(urls.at(-1).includes('/name/acme%20trucking'));
  globalThis.fetch=async()=>new Response('err',{status:500});r=await get('acme');assert.equal(r.status,502);
 }finally{globalThis.fetch=original;if(old===undefined)delete process.env.FMCSA_WEBKEY;else process.env.FMCSA_WEBKEY=old;}
});
test('call_request is validated and emailed',async()=>{
 const original=globalThis.fetch;const old=process.env.RESEND_API_KEY;const calls=[];
 process.env.RESEND_API_KEY='test';globalThis.fetch=async(u,o)=>{calls.push(JSON.parse(o.body));return Response.json({data:[{id:'a'},{id:'b'}]});};
 const base={form:'call_request',submission_id:'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',company:'DOT FLEET INC',dot_number:'1234567',fleet_size:'20–50 trucks',pay_type:'Cents per mile',cpm_rate:'72–75¢',trailers:'Dry van, Reefer',escrow:'No',truck_year:'2023–2025',positions:'Team drivers',drivers_needed:'3–5',call_date:'2026-10-05',call_time:'10 AM–12 PM',timezone:'Central',contact_name:'Pat',phone:'3125550100',email:'pat@example.com'};
 const req=d=>new Request('https://nexusdrivers.com/api/contact',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://nexusdrivers.com'},body:JSON.stringify(d)});
 try{
  assert.equal((await contact.fetch(req({...base,call_date:'soon'}))).status,400);
  assert.equal((await contact.fetch(req({...base,trailers:''}))).status,400);
  const r=await contact.fetch(req(base));assert.equal(r.status,200);
  assert.match(calls[0][0].subject,/call request: DOT FLEET INC — 2026-10-05 10 AM–12 PM Central/);
  assert.match(calls[0][0].text,/cpm rate: 72–75¢/);assert.match(calls[0][1].subject,/call request/);
 }finally{globalThis.fetch=original;if(old===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=old;}
});
