const { createClient } = require('@supabase/supabase-js');

let supabaseAdmin = null;
let supabaseAuth = null;

function getAdminClient() {
  if (supabaseAdmin) return supabaseAdmin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || url.includes('your-project') || key.includes('your-service')) {
    return null;
  }
  supabaseAdmin = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return supabaseAdmin;
}

function getAuthClient() {
  if (supabaseAuth) return supabaseAuth;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey || url.includes('your-project') || anonKey.includes('your-service')) {
    return null;
  }
  supabaseAuth = createClient(url, anonKey);
  return supabaseAuth;
}

module.exports = { getAdminClient, getAuthClient };
