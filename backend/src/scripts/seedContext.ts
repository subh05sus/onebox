import { storeContext, initRAG } from '../services/ragService';

(async () => {
  console.log('🌱 Seeding RAG context...');
  
  await initRAG();
  
  // Store product and outreach context
  await storeContext('product-info', 'ReachInbox is an AI-powered outreach automation tool that helps businesses find, enrich, and engage high-intent leads through multi-channel outreach on Twitter, LinkedIn, email, and phone.');
  
  await storeContext('interview-reply', 'If a lead is interested, send https://cal.com/example');
  
  await storeContext('job-application-context', 'I am applying for a job position. If the lead is interested, share the meeting booking link: https://cal.com/example');
  
  await storeContext('product-demo-context', 'For product demos, schedule a call at https://cal.com/demo');
  
  await storeContext('partnership-context', 'For partnership discussions, schedule a call at https://cal.com/partnership');
  
  console.log('✅ Context seeded successfully');
})(); 