const { createClient } = require('@supabase/supabase-js');

let supabaseAdmin = null;

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

module.exports = { getAdminClient };
