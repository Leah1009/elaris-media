/*
  Shared Supabase bootstrap for the admin panel. Same publishable key
  pattern used on the public site (isa-home-investments/index.html) — safe
  to ship to the browser, it is not a secret. The real access boundary is
  Row Level Security: only the account below (info@isahomeus.com) can
  insert/update/delete rows in "media_assets" or objects in the
  "site-media" storage bucket. No service_role key is ever used here.
*/
const SUPABASE_URL = 'https://ggteqxyygsvtmahhsdzc.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_49gKIic8e9GERmDq3i2KAQ_qnIq_itG';
const ADMIN_EMAIL = 'info@isahomeus.com';

// Guarded the same way as the public site's Supabase init: if the CDN
// script above this one fails to load (ad blocker, network hiccup), we
// must not let that throw and blank the page — every caller below checks
// for a null supabaseClient instead.
let supabaseClient = null;
try{
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}catch(e){
  console.error('ADMIN SUPABASE INIT ERROR', e);
}

// Every /admin page (except /admin/login) calls this before rendering
// anything. No session, or a session for a different account, sends the
// visitor straight back to the login page.
async function requireAdminSession(){
  if(!supabaseClient){
    window.location.replace('/admin/login');
    return null;
  }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if(!session || !session.user || session.user.email !== ADMIN_EMAIL){
    window.location.replace('/admin/login');
    return null;
  }
  return session;
}
