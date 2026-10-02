import { createHash } from 'node:crypto';
const INBOX = 'info@nexusdrivers.com';
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const FIELDS = {
  driver_application: ['first_name','last_name','email','phone','state','zip','experience','position','job','trailer','sms_consent'],
  carrier_inquiry: ['company','contact_name','mc_number','dot_number','email','phone','drivers_needed','trailer','positions','notes'],
  call_request: ['company','dot_number','mc_number','fmcsa_location','fmcsa_power_units','fmcsa_status','fleet_size','pay_type','cpm_rate','gross_rate','trailers','escrow','truck_year','positions','drivers_needed','call_date','call_time','timezone','contact_name','phone','email','notes'],
};
const REQUIRED = {
  driver_application: ['first_name','last_name','email','phone','state','zip','experience','position'],
  carrier_inquiry: ['company','contact_name','dot_number','email','phone','drivers_needed','trailer'],
  call_request: ['company','dot_number','fleet_size','pay_type','trailers','escrow','truck_year','positions','drivers_needed','call_date','call_time','timezone','contact_name','phone','email'],
};
const json = (status, body) => Response.json(body, {status, headers:{'Cache-Control':'no-store'}});

export default {
 async fetch(request) {
  if(request.method!=='POST') return json(405,{error:'Method not allowed.'});
  const origin=request.headers.get('origin');
  const allowed=new Set(['https://nexusdrivers.com','https://www.nexusdrivers.com',new URL(request.url).origin]);
  if(origin && !allowed.has(origin)) return json(403,{error:'Request not allowed.'});
  if(!request.headers.get('content-type')?.includes('application/json')) return json(415,{error:'JSON required.'});
  let raw,d;
  try {raw=await request.text();if(raw.length>16000)return json(413,{error:'Request too large.'});d=JSON.parse(raw);}catch{return json(400,{error:'Invalid request.'});}
  if(!d || typeof d!=='object' || Array.isArray(d) || !Object.hasOwn(FIELDS,d.form)) return json(400,{error:'Invalid form.'});
  if(d.company_website) return json(400,{error:'Unable to submit this request.'});
  if(!/^[a-f0-9-]{36}$/i.test(d.submission_id||'')) return json(400,{error:'Please reload the page and try again.'});
  const values={};
  for(const key of FIELDS[d.form]) {
   const value=d[key]??'';
   if(typeof value!=='string' || value.length>(key==='notes'?3000:250) || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value))return json(400,{error:'Please check your form fields.'});
   values[key]=value.trim();
  }
  if(REQUIRED[d.form].some(k=>!values[k]) || !EMAIL.test(values.email) || /[\r\n]/.test(values.email) || values.phone.replace(/\D/g,'').length<10 || values.phone.replace(/\D/g,'').length>15) return json(400,{error:'Please enter valid contact details and complete all required fields.'});
  if(d.form==='driver_application' && (!/^\d{5}$/.test(values.zip)||!/^\w{2}$/.test(values.state)))return json(400,{error:'Please check your state and ZIP code.'});
  if(d.form==='driver_application')values.sms_consent=values.sms_consent==='yes'?'yes':'no';
  const key=process.env.RESEND_API_KEY;
  const from=process.env.RESEND_FROM_EMAIL || 'Nexus Driver Solutions <info@nexusdrivers.com>';
  if(!key)return json(503,{error:'Online submissions are temporarily unavailable. Please email info@nexusdrivers.com.'});
  if(d.form==='call_request' && !/^\d{4}-\d{2}-\d{2}$/.test(values.call_date))return json(400,{error:'Please pick a date for the call.'});
  const driver=d.form==='driver_application';
  const call=d.form==='call_request';
  const subject=driver?'New driver application — Nexus':call?`New call request: ${values.company} — ${values.call_date} ${values.call_time} ${values.timezone}`:'New carrier inquiry — Nexus';
  const details=Object.entries(values).map(([k,v])=>`${k.replaceAll('_',' ')}: ${v||'Not provided'}`).join('\n');
  const receipt=driver
   ? "Thank you for applying with Nexus Driver Solutions. We have received your application. Our recruiting team will review your information and contact you about the next steps. This confirms receipt of your application, not approval for a position."
   : call
   ? `Thank you for requesting a call with Nexus Driver Solutions. You asked for a call on ${values.call_date}, ${values.call_time} (${values.timezone}). We will confirm the time with you before the call. If something changes, reply to this email.`
   : "Thank you for contacting Nexus Driver Solutions. We have received your driver recruiting inquiry. Our team will review your hiring needs and get in touch about the next steps.";
  const batch=[
   {from,to:[INBOX],reply_to:values.email,subject,text:`${subject}\n\n${details}\n\nReference: ${d.submission_id}`},
   {from,to:[values.email],reply_to:INBOX,subject:driver?'We received your application | Nexus Driver Solutions':call?'We received your call request | Nexus Driver Solutions':'We received your inquiry | Nexus Driver Solutions',text:`Hello,\n\n${receipt}\n\nIf you need to update your information, reply to this email.\n\nNexus Driver Solutions\ninfo@nexusdrivers.com\nhttps://nexusdrivers.com\n\nReference: ${d.submission_id}`},
  ];
  // Identical payload + submission ID reuse the provider key after a network retry.
  const id=createHash('sha256').update(d.submission_id+JSON.stringify(batch)).digest('hex');
  try {
   const response=await fetch('https://api.resend.com/emails/batch',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`nexus-${id}`},body:JSON.stringify(batch),signal:AbortSignal.timeout(12000)});
   const result=await response.json();
   if(!response.ok || !Array.isArray(result.data) || result.data.length!==2 || result.data.some(x=>!x.id))return json(502,{error:'We could not confirm your submission. Please retry or email info@nexusdrivers.com.'});
   return json(200,{ok:true,message:driver?'Application received. A confirmation email is on its way. Our team will contact you about the next steps.':call?'Call request received. A confirmation email is on its way, and we will confirm the time with you.':'Inquiry received. A confirmation email is on its way. Our team will be in touch.'});
  } catch {return json(502,{error:'We could not confirm your submission. Please retry or email info@nexusdrivers.com.'});}
 }
};
