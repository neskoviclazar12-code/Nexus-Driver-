import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/contact.js';
const driver={form:'driver_application',submission_id:'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',first_name:'Test',last_name:'Driver',email:'driver@example.com',phone:'2025550100',state:'IL',zip:'60601',experience:'3+ years',position:'Company Driver',sms_consent:'no'};
const req=d=>new Request('https://nexusdrivers.com/api/contact',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://nexusdrivers.com'},body:JSON.stringify(d)});
test('validation, routing, confirmation, retry and failure without sending real mail',async()=>{
 const original=globalThis.fetch;const old=process.env.RESEND_API_KEY;let calls=[];
 globalThis.fetch=async(url,options)=>{calls.push({url,options,body:JSON.parse(options.body)});return Response.json({data:[{id:'admin-id'},{id:'receipt-id'}]});};
 try{
 delete process.env.RESEND_API_KEY;assert.equal((await handler.fetch(req(driver))).status,503);assert.equal(calls.length,0);
 process.env.RESEND_API_KEY='test-placeholder';
 assert.equal((await handler.fetch(req({...driver,email:'invalid'}))).status,400);
 assert.equal((await handler.fetch(req({...driver,company_website:'spam'}))).status,400);assert.equal(calls.length,0);
 let response=await handler.fetch(req(driver));assert.equal(response.status,200);assert.equal((await response.json()).ok,true);
 assert.deepEqual(calls[0].body[0].to,['info@nexusdrivers.com']);assert.deepEqual(calls[0].body[1].to,['driver@example.com']);assert.equal(calls[0].body[0].reply_to,'driver@example.com');assert.equal(calls[0].body[1].reply_to,'info@nexusdrivers.com');assert.match(calls[0].body[0].text,/sms consent: no/);
 await handler.fetch(req(driver));assert.equal(calls[0].options.headers['Idempotency-Key'],calls[1].options.headers['Idempotency-Key']);
 const carrier={form:'carrier_inquiry',submission_id:driver.submission_id,company:'Test Fleet',contact_name:'Test Contact',dot_number:'123456',email:'fleet@example.com',phone:'2025550101',drivers_needed:'1–5',trailer:'Dry Van'};
 assert.equal((await handler.fetch(req(carrier))).status,200);assert.match(calls[2].body[1].subject,/inquiry/);
 globalThis.fetch=async()=>Response.json({message:'failure'},{status:422});assert.equal((await handler.fetch(req(driver))).status,502);
 globalThis.fetch=async()=>Response.json({data:[{id:'only-one'}]});assert.equal((await handler.fetch(req(driver))).status,502);
 globalThis.fetch=async()=>{throw new Error('timeout')};assert.equal((await handler.fetch(req(driver))).status,502);
 }finally{globalThis.fetch=original;if(old===undefined)delete process.env.RESEND_API_KEY;else process.env.RESEND_API_KEY=old;}
});
