/**
 * NEXTSITE AI - Supabase Cloud Database & Authentication Client
 * Handles real-time cloud synchronization, user territory login, and status updates.
 */

const SUPABASE_URL = 'https://jklmttvwteuaixfcxhpd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4';

let supabaseClient = null;
let currentSalesUser = null; // { id, email, fullName, assignedProvince, role }

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

// ==========================================
// AUTHENTICATION & USER PROFILE MANAGEMENT
// ==========================================

/**
 * Login sales user with email and password
 */
async function loginSalesUser(email, password) {
  const client = supabaseClient || initSupabase();
  if (!client) throw new Error('ไม่พบระบบ Supabase Client');

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  if (error) {
    throw new Error(error.message);
  }

  // Load user profile
  await loadSalesUserProfile(data.user.id, data.user.email);
  return currentSalesUser;
}

/**
 * Logout sales user
 */
async function logoutSalesUser() {
  const client = supabaseClient || initSupabase();
  if (client) {
    await client.auth.signOut();
  }
  currentSalesUser = null;
  localStorage.removeItem('nextsite_cached_user');
  updateAuthHeaderUI();
  if (typeof applyFilters === 'function') {
    applyFilters();
  }
  if (typeof showStatusToast === 'function') {
    showStatusToast('ออกจากระบบเรียบร้อยแล้ว');
  }
  setTimeout(() => {
    openLoginModal();
  }, 400);
}

/**
 * Load user profile from public.user_profiles table
 */
async function loadSalesUserProfile(userId, userEmail) {
  const client = supabaseClient || initSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      currentSalesUser = {
        id: data.id,
        email: data.email || userEmail,
        fullName: data.full_name || 'เซลส์ SCG',
        assignedProvince: data.assigned_province || 'อุดรธานี',
        role: data.role || 'sales'
      };
    } else {
      // Default fallback if profile not inserted yet
      currentSalesUser = {
        id: userId,
        email: userEmail,
        fullName: userEmail.split('@')[0],
        assignedProvince: 'อุดรธานี',
        role: 'sales'
      };
    }

    localStorage.setItem('nextsite_cached_user', JSON.stringify(currentSalesUser));
    updateAuthHeaderUI();
    if (typeof applyFilters === 'function') {
      applyFilters();
    }
    return currentSalesUser;
  } catch (err) {
    console.error('❌ Error loading profile:', err);
    return null;
  }
}

/**
 * Check if current logged-in user can edit a company
 * Returns true if permitted, false if blocked by territory
 */
function canCurrentUserEditCompany(company) {
  if (!currentSalesUser) {
    return true; // If no user is logged in, allow for open demo, or return false to require login
  }

  if (currentSalesUser.role === 'manager' || currentSalesUser.assignedProvince === 'ALL') {
    return true; // Managers can edit all
  }

  const compProvince = (company.province || 'อุดรธานี').trim();
  const userProvince = (currentSalesUser.assignedProvince || 'อุดรธานี').trim();

  return compProvince.includes(userProvince) || userProvince.includes(compProvince);
}

/**
 * Update UI for Auth State in Header
 */
function updateAuthHeaderUI() {
  const container = document.getElementById('user-auth-section');
  if (!container) return;

  if (currentSalesUser) {
    container.innerHTML = `
      <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(30, 58, 138, 0.45); border: 1px solid rgba(96, 165, 250, 0.4); padding: 4px 10px; border-radius: 8px; backdrop-filter: blur(8px);">
        <div style="width: 24px; height: 24px; border-radius: 50%; background: #2563EB; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800;">
          👤
        </div>
        <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.15;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #FFFFFF;">${currentSalesUser.fullName}</span>
          <span style="font-size: 0.65rem; color: #93C5FD; font-weight: 700;">พื้นที่: ${currentSalesUser.assignedProvince}</span>
        </div>
        <button onclick="logoutSalesUser()" title="ออกจากระบบ" style="background: rgba(239, 68, 68, 0.2); color: #FCA5A5; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 5px; padding: 2px 6px; font-size: 0.65rem; font-weight: 700; cursor: pointer; margin-left: 4px; transition: all 0.15s ease;">
          ออก
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openLoginModal()" style="display: inline-flex; align-items: center; gap: 6px; background: rgba(255, 255, 255, 0.12); color: #FFFFFF; border: 1px solid rgba(255, 255, 255, 0.28); padding: 5px 12px; border-radius: 8px; font-size: 0.76rem; font-weight: 800; cursor: pointer; backdrop-filter: blur(8px); transition: all 0.15s ease;">
        <span>🔐 เข้าสู่ระบบเซลส์</span>
      </button>
    `;
  }
}

// Auto check existing session on load
async function checkCurrentSession() {
  const client = supabaseClient || initSupabase();
  if (!client) return;

  try {
    const { data: { session } } = await client.auth.getSession();
    if (session && session.user) {
      await loadSalesUserProfile(session.user.id, session.user.email);
    } else {
      // Check cache
      const cached = localStorage.getItem('nextsite_cached_user');
      if (cached) {
        try {
          currentSalesUser = JSON.parse(cached);
          updateAuthHeaderUI();
        } catch (e) {
          currentSalesUser = null;
        }
      } else {
        currentSalesUser = null;
      }
    }
  } catch (err) {
    console.warn('Session check warning:', err);
    currentSalesUser = null;
  }

  updateAuthHeaderUI();
}

// ==========================================
// DATA SYNC & CLOUD CRUD
// ==========================================

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
 * Automatically fetch the latest company tags from Supabase and apply to UI
 */
async function loadAndApplyCloudTags() {
  const client = supabaseClient || initSupabase();
  if (!client) return;

  try {
    const { data, error } = await client
      .from('companies')
      .select('id, tag');

    if (error) {
      console.warn('⚠️ Could not load cloud tags:', error.message);
      return;
    }

    if (data && data.length > 0) {
      const tagMap = (typeof loadCompanyTagsMap === 'function') ? loadCompanyTagsMap() : {};
      data.forEach(item => {
        if (item.id && item.tag) {
          tagMap[item.id] = item.tag;
        }
      });
      if (typeof saveCompanyTagsMap === 'function') {
        saveCompanyTagsMap(tagMap);
      }
      if (typeof applyFilters === 'function') {
        applyFilters();
      }
      if (typeof updateTagFilterCounts === 'function' && typeof window.allCompanies !== 'undefined') {
        updateTagFilterCounts(window.allCompanies);
      }
      console.log(`☁️ Synced ${data.length} tags from Supabase Cloud successfully!`);
    }
  } catch (err) {
    console.warn('⚠️ Supabase Tag Sync Exception:', err);
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
    sales_2026: Number(c.sales2026_0914 != null ? c.sales2026_0914 : (c.sales2026 || 0)),
    opportunity_score: Number(c.opportunityScore) || 0,
    revenue_potential: c.revenuePotential || '',
    ai_recommendation: c.aiRecommendation || '',
    facebook_url: c.facebookUrl || '',
    google_maps_url: c.googleMapsUrl || '',
    posts_count: c.postsCount || (c.facebookSignals ? c.facebookSignals.length : 0),
    coordinates: c.coordinates ? { lat: c.coordinates.lat, lng: c.coordinates.lng } : null
  }));

  try {
    let { data, error } = await client
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
    alert(`🎉 ซิงค์ข้อมูลบริษัททั้งหมด ${payload.length} แห่งขึ้น Supabase เรียบร้อยแล้ว!\n\nข้อมูลและ Tag บน Cloud อัปเดตตรงกัน 100%`);
    
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

/**
 * Fetch latest customer sales figures from Supabase Cloud
 */
async function fetchCloudCustomerSales() {
  const client = supabaseClient || initSupabase();
  if (!client) return null;

  try {
    let { data, error } = await client
      .from('companies')
      .select('id, name, scg_customer_id, sales_2025, sales_2026');

    if (error) {
      console.warn('⚠️ Supabase fetch sales error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('⚠️ Supabase fetch sales exception:', err);
    return null;
  }
}

/**
 * Update sales for a specific company in Supabase Cloud
 */
async function saveCompanySalesToCloud(companyIdOrCode, salesData) {
  const client = supabaseClient || initSupabase();
  if (!client) return false;

  try {
    const updatePayload = {
      updated_at: new Date().toISOString()
    };
    if (salesData.sales2025 != null) updatePayload.sales_2025 = Number(salesData.sales2025);
    if (salesData.sales2026_0914 != null || salesData.sales2026 != null) {
      updatePayload.sales_2026 = Number(salesData.sales2026_0914 != null ? salesData.sales2026_0914 : salesData.sales2026);
    }

    const { data, error } = await client
      .from('companies')
      .update(updatePayload)
      .or(`id.eq.${companyIdOrCode},scg_customer_id.eq.${companyIdOrCode}`);

    if (error) {
      console.error('❌ Cloud sales update error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('❌ Cloud sales update exception:', err);
    return false;
  }
}

/**
 * Save CRM Note & Follow-up log to Supabase Cloud
 */
async function saveCloudCrmLog(companyId, crmData) {
  const client = supabaseClient || initSupabase();
  if (!client) {
    console.warn('⚠️ Supabase client not initialized yet');
    return false;
  }

  try {
    const jsonStr = JSON.stringify({
      status: crmData.status || 'pending',
      note: crmData.note || '',
      nextDate: crmData.nextDate || '',
      salesRep: crmData.salesRep || (currentSalesUser ? currentSalesUser.fullName : 'ทีมขาย SCG'),
      products: crmData.products || [],
      updatedAt: crmData.updatedAt || new Date().toISOString()
    });

    const updatePayload = {
      crm_note: crmData.note || '',
      crm_status: crmData.status || 'pending',
      crm_sales_rep: crmData.salesRep || (currentSalesUser ? currentSalesUser.fullName : 'ทีมขาย SCG'),
      crm_next_date: crmData.nextDate || '',
      revenue_potential: jsonStr,
      updated_at: new Date().toISOString()
    };

    const { error } = await client
      .from('companies')
      .update(updatePayload)
      .eq('id', companyId);

    if (error) {
      console.error('❌ Supabase Cloud CRM Save error:', error.message);
      if (typeof showStatusToast === 'function') {
        showStatusToast('⚠️ บันทึก Cloud ไม่สำเร็จ: ' + error.message);
      }
      return false;
    }

    console.log(`☁️ Synced CRM log for ${companyId} to Supabase successfully:`, updatePayload);
    if (typeof showStatusToast === 'function') {
      showStatusToast('☁️ บันทึกโน้ตขึ้น Supabase Cloud สำเร็จเรียบร้อย!');
    }
    return true;
  } catch (err) {
    console.error('❌ Cloud CRM Save exception:', err);
    return false;
  }
}

/**
 * Load all CRM Notes from Supabase Cloud and sync into LocalStorage & UI
 */
async function loadAndApplyCloudCrmLogs() {
  const client = supabaseClient || initSupabase();
  if (!client) return;

  try {
    const { data, error } = await client
      .from('companies')
      .select('id, crm_note, crm_status, crm_sales_rep, crm_next_date, revenue_potential');

    if (error) {
      console.warn('⚠️ Could not load cloud CRM logs:', error.message);
      return;
    }

    if (data && data.length > 0) {
      let crmLogs = {};
      try {
        const raw = localStorage.getItem('nextsite_crm_followup_logs') || localStorage.getItem('nextsite_crm_logs_v1');
        if (raw) crmLogs = JSON.parse(raw);
      } catch (e) {}

      let updatedCount = 0;
      data.forEach(item => {
        if (item.id) {
          if (item.crm_note || item.crm_status) {
            crmLogs[item.id] = {
              note: item.crm_note || '',
              status: item.crm_status || 'pending',
              salesRep: item.crm_sales_rep || '',
              nextDate: item.crm_next_date || '',
              updatedAt: new Date().toISOString()
            };
            updatedCount++;
          } else if (item.revenue_potential && typeof item.revenue_potential === 'string' && item.revenue_potential.startsWith('{')) {
            try {
              crmLogs[item.id] = JSON.parse(item.revenue_potential);
              updatedCount++;
            } catch (e) {}
          }
        }
      });

      localStorage.setItem('nextsite_crm_followup_logs', JSON.stringify(crmLogs));
      localStorage.setItem('nextsite_crm_logs_v1', JSON.stringify(crmLogs));

      if (typeof renderTable === 'function') {
        renderTable();
      }
      console.log(`☁️ Synced ${updatedCount} CRM notes from Supabase Cloud successfully!`);
    }
  } catch (err) {
    console.warn('⚠️ Supabase CRM sync exception:', err);
  }
}

// Auto init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(async () => {
    initSupabase();
    await checkCurrentSession();
    await loadAndApplyCloudTags();
    await loadAndApplyCloudCrmLogs();
  }, 300);
});

// Modal UI Helpers
function openLoginModal() {
  const modal = document.getElementById('sales-login-modal');
  if (modal) {
    modal.style.display = 'flex';
    const errEl = document.getElementById('login-error-msg');
    if (errEl) errEl.style.display = 'none';
  }
}

function closeLoginModal() {
  const modal = document.getElementById('sales-login-modal');
  if (modal) modal.style.display = 'none';
}

function fillDemoUser(email, pass) {
  const elEmail = document.getElementById('login-email');
  const elPass = document.getElementById('login-password');
  if (elEmail) elEmail.value = email;
  if (elPass) elPass.value = pass;
}

async function handleSalesLoginForm(event) {
  if (event && event.preventDefault) event.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;
  const btnSubmit = document.getElementById('btn-login-submit');
  const errEl = document.getElementById('login-error-msg');

  if (errEl) errEl.style.display = 'none';
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'กำลังตรวจสอบ...';
  }

  try {
    const user = await loginSalesUser(email, pass);
    closeLoginModal();
    if (typeof showStatusToast === 'function') {
      showStatusToast(`ยินดีต้อนรับ ${user.fullName} (พื้นที่: ${user.assignedProvince})`);
    } else {
      alert(`ยินดีต้อนรับ ${user.fullName} (พื้นที่: ${user.assignedProvince})`);
    }
  } catch (err) {
    if (errEl) {
      errEl.textContent = '❌ เข้าสู่ระบบไม่สำเร็จ: ' + err.message;
      errEl.style.display = 'block';
    }
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'เข้าสู่ระบบ';
    }
  }
}

if (typeof window !== 'undefined') {
  window.initSupabase = initSupabase;
  window.testSupabaseConnection = testSupabaseConnection;
  window.getCloudCompanies = getCloudCompanies;
  window.updateCloudCompanyTag = updateCloudCompanyTag;
  window.syncAllLocalCompaniesToSupabase = syncAllLocalCompaniesToSupabase;
  window.loginSalesUser = loginSalesUser;
  window.logoutSalesUser = logoutSalesUser;
  window.canCurrentUserEditCompany = canCurrentUserEditCompany;
  window.updateAuthHeaderUI = updateAuthHeaderUI;
  window.openLoginModal = openLoginModal;
  window.closeLoginModal = closeLoginModal;
  window.fillDemoUser = fillDemoUser;
  window.handleSalesLoginForm = handleSalesLoginForm;
  window.saveCloudCrmLog = saveCloudCrmLog;
  window.loadAndApplyCloudCrmLogs = loadAndApplyCloudCrmLogs;
}
