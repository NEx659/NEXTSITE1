/**
 * NEXTSITE AI - Supabase Cloud Database Client
 * Handles real-time cloud synchronization, data fetching, and status updates.
 */

const SUPABASE_URL = 'https://jklmttvwteuaixfcxhpd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4';

let supabaseClient = null;

// Initialize Supabase Client
function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('🚀 Supabase Client Initialized:', SUPABASE_URL);
      return supabaseClient;
    } catch (e) {
      console.error('❌ Supabase initialization failed:', e);
      return null;
    }
  } else {
    console.warn('⚠️ Supabase JS SDK not loaded yet.');
    return null;
  }
}

/**
 * Health check to verify connection with Supabase
 */
async function testSupabaseConnection() {
  const client = supabaseClient || initSupabase();
  if (!client) {
    return { success: false, message: 'Supabase SDK ไม่ได้ติดตั้ง' };
  }

  try {
    const { data, error } = await client.from('companies').select('id').limit(1);
    if (error) {
      return { success: false, error: error.message, code: error.code };
    }
    return { success: true, message: 'เชื่อมต่อ Supabase สำเร็จ 100%' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all companies for a specific province from Supabase
 */
async function getCloudCompanies(province = 'อุดรธานี') {
  const client = supabaseClient || initSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('companies')
      .select('*')
      .order('rank', { ascending: true });

    if (error) {
      console.warn('⚠️ Supabase Fetch Warning:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('❌ Supabase Fetch Exception:', err);
    return null;
  }
}

/**
 * Save / Update company tag (Focus / Non-Focus / New) to Supabase
 */
async function updateCloudCompanyTag(companyId, newTag) {
  const client = supabaseClient || initSupabase();
  if (!client) return false;

  try {
    const { data, error } = await client
      .from('companies')
      .update({ tag: newTag, updated_at: new Date().toISOString() })
      .eq('id', companyId);

    if (error) {
      console.error('❌ Update Tag Error in Supabase:', error.message);
      return false;
    }
    console.log(`☁️ Synced tag '${newTag}' for ${companyId} to Supabase`);
    return true;
  } catch (err) {
    console.error('❌ Update Tag Exception:', err);
    return false;
  }
}

/**
 * Sync / Seed all local company records into Supabase table
 */
async function syncAllLocalCompaniesToSupabase(companiesArray) {
  const client = supabaseClient || initSupabase();
  if (!client) {
    alert('⚠️ กำลังโหลด Supabase SDK กรุณาลองใหม่อีกครั้งใน 2 วินาที');
    return false;
  }

  let list = companiesArray;
  if (!list || !Array.isArray(list) || list.length === 0) {
    if (typeof window.allCompanies !== 'undefined' && Array.isArray(window.allCompanies) && window.allCompanies.length > 0) {
      list = window.allCompanies;
    } else if (typeof window.UDON_COMPANIES !== 'undefined' && Array.isArray(window.UDON_COMPANIES) && window.UDON_COMPANIES.length > 0) {
      list = window.UDON_COMPANIES;
    } else if (typeof window.MASTER_COMPANIES !== 'undefined' && Array.isArray(window.MASTER_COMPANIES) && window.MASTER_COMPANIES.length > 0) {
      list = window.MASTER_COMPANIES;
    }
  }

  if (!list || list.length === 0) {
    alert('⚠️ ไม่พบข้อมูลบริษัทในหน้านี้ กรุณารีเฟรชหน้าเว็บแล้วลองใหม่ครับ');
    return false;
  }

  const syncBtn = document.getElementById('btn-cloud-sync');
  const oldText = syncBtn ? syncBtn.innerHTML : '';
  if (syncBtn) {
    syncBtn.innerHTML = '<span>⏳ กำลังซิงค์ขึ้น Cloud...</span>';
    syncBtn.disabled = true;
  }

  const payload = list.map((c, idx) => ({
    id: c.id || `comp-${idx + 1}`,
    rank: c.rank || (idx + 1),
    name: c.name || '',
    english_name: c.englishName || '',
    district: c.district || '',
    province: c.province || 'อุดรธานี',
    scg_customer_id: c.scgCustomerId || c.scgCode || '',
    tag: c.tag || 'Focus',
    sales_2025: Number(c.sales2025) || 0,
    sales_2026: Number(c.sales2026) || 0,
    opportunity_score: Number(c.opportunityScore) || 0,
    revenue_potential: c.revenuePotential || '',
    ai_recommendation: c.aiRecommendation || '',
    facebook_url: c.facebookUrl || '',
    google_maps_url: c.googleMapsUrl || '',
    posts_count: c.postsCount || (c.facebookSignals ? c.facebookSignals.length : 0),
    coordinates: c.coordinates ? { lat: c.coordinates.lat, lng: c.coordinates.lng } : null
  }));

  try {
    const { data, error } = await client
      .from('companies')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('❌ Sync Upsert Error:', error);
      alert('❌ ซิงค์ไม่สำเร็จ: ' + error.message);
      if (syncBtn) {
        syncBtn.innerHTML = oldText;
        syncBtn.disabled = false;
      }
      return false;
    }

    console.log(`✅ ซิงค์ข้อมูลบริษัท ${payload.length} แห่งขึ้น Supabase สำเร็จ!`);
    alert(`🎉 ซิงค์ข้อมูลบริษัททั้งหมด ${payload.length} แห่งขึ้น Supabase เรียบร้อยแล้ว!\n\nกลับไปดูที่ Supabase ได้เลยครับ`);
    
    if (syncBtn) {
      syncBtn.innerHTML = '<span>✅ ซิงค์สำเร็จแล้ว</span>';
      setTimeout(() => {
        syncBtn.innerHTML = oldText;
        syncBtn.disabled = false;
      }, 3000);
    }
    return true;
  } catch (err) {
    console.error('❌ Sync Exception:', err);
    alert('❌ เกิดข้อผิดพลาดในการ Sync: ' + err.message);
    if (syncBtn) {
      syncBtn.innerHTML = oldText;
      syncBtn.disabled = false;
    }
    return false;
  }
}

// Auto init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initSupabase();
  }, 500);
});

if (typeof window !== 'undefined') {
  window.initSupabase = initSupabase;
  window.testSupabaseConnection = testSupabaseConnection;
  window.getCloudCompanies = getCloudCompanies;
  window.updateCloudCompanyTag = updateCloudCompanyTag;
  window.syncAllLocalCompaniesToSupabase = syncAllLocalCompaniesToSupabase;
}
