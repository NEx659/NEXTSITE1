/**
 * NEXTSITE AI - Supabase Cloud Database & Authentication Client
 * Handles real-time cloud synchronization, user territory login, and status updates.
 */

const SUPABASE_URL = 'https://jklmttvwteuaixfcxhpd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_liiIUZc31VQik5axueUVAg_GrH1-Sr4';

let supabaseClient = null;
let currentSalesUser = null; // { id, email, fullName, assignedProvince, role }

// Immediate synchronous restoration of cached user session
try {
  const cachedUserStr = localStorage.getItem('nextsite_cached_user');
  if (cachedUserStr) {
    currentSalesUser = JSON.parse(cachedUserStr);
    window.currentSalesUser = currentSalesUser;
  }
} catch (e) {}

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
// ==========================================
// SCG VERIFIED SYSTEM USERS REGISTRY
// ==========================================
const SCG_SYSTEM_USERS = [
  {
    email: 'somchai@scg.com',
    password: 'scg1234',
    fullName: 'คุณสมชาย',
    title: 'Sales exclusive Udon',
    role: 'sales',
    assignedProvince: 'อุดรธานี',
    avatar: '👤'
  },
  {
    email: 'keetavas@scg.com',
    password: 'scg12345',
    fullName: 'คุณคีตวรรษ',
    title: 'Sales supervisor Udon',
    role: 'manager',
    assignedProvince: 'อุดรธานี',
    avatar: '👔'
  },
  {
    email: 'pannipan@scg.com',
    password: 'scg123456',
    fullName: 'คุณพรรณิภา',
    title: 'หัวหน้าฝ่ายขาย / Supervisor',
    role: 'manager',
    assignedProvince: 'ALL',
    avatar: '👑'
  }
];

/**
 * Login sales user with email and password
 */
async function loginSalesUser(email, password) {
  const normEmail = (email || '').trim().toLowerCase();
  const inputPass = (password || '').trim();

  // 1. Check matching SCG System Users
  const sysUser = SCG_SYSTEM_USERS.find(u => u.email.toLowerCase() === normEmail);
  if (sysUser) {
    if (sysUser.password === inputPass) {
      currentSalesUser = {
        id: 'usr_' + normEmail.replace(/[@.]/g, '_'),
        email: sysUser.email,
        fullName: sysUser.fullName,
        title: sysUser.title,
        role: sysUser.role,
        assignedProvince: sysUser.assignedProvince,
        avatar: sysUser.avatar
      };
      localStorage.setItem('nextsite_cached_user', JSON.stringify(currentSalesUser));
      updateAuthHeaderUI();
      if (typeof syncUserTagsToCompanies === 'function') {
        syncUserTagsToCompanies(sysUser.email);
      }
      if (typeof applyFilters === 'function') applyFilters();
      if (typeof updateTagFilterCounts === 'function' && typeof window.allCompanies !== 'undefined') {
        updateTagFilterCounts(window.allCompanies);
      }
      if (typeof loadAndApplyCloudTags === 'function') {
        loadAndApplyCloudTags();
      }
      return currentSalesUser;
    } else {
      throw new Error('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านอีกครั้ง');
    }
  }

  // 2. Try Supabase Auth
  const client = supabaseClient || initSupabase();
  if (client && client.auth) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: normEmail,
        password: inputPass
      });
      if (data && data.user) {
        await loadSalesUserProfile(data.user.id, data.user.email);
        if (typeof syncUserTagsToCompanies === 'function') {
          syncUserTagsToCompanies(data.user.email);
        }
        if (typeof applyFilters === 'function') applyFilters();
        if (typeof updateTagFilterCounts === 'function' && typeof window.allCompanies !== 'undefined') {
          updateTagFilterCounts(window.allCompanies);
        }
        return currentSalesUser;
      }
    } catch(e) {}
  }

  throw new Error('ไม่พบอีเมลผู้ใช้นี้ในระบบ SCG Sales Intelligence');
}

/**
 * Logout sales user
 */
async function logoutSalesUser() {
  const client = supabaseClient || initSupabase();
  if (client && client.auth) {
    try {
      await client.auth.signOut();
    } catch(e) {}
  }
  currentSalesUser = null;
  localStorage.removeItem('nextsite_cached_user');
  document.body.classList.add('auth-locked');
  updateAuthHeaderUI();
  if (typeof syncUserTagsToCompanies === 'function') {
    syncUserTagsToCompanies('guest');
  }
  if (typeof applyFilters === 'function') {
    applyFilters();
  }
  if (typeof updateTagFilterCounts === 'function' && typeof window.allCompanies !== 'undefined') {
    updateTagFilterCounts(window.allCompanies);
  }
  if (typeof showStatusToast === 'function') {
    showStatusToast('ออกจากระบบเรียบร้อยแล้ว');
  }
  setTimeout(() => {
    openLoginModal(true);
  }, 100);
}

/**
 * Check if current user is permitted to delete or edit a specific item/photo
 * - Supervisor/Manager (คุณพรรณิภา, คุณคีตวรรษ) -> Can edit/delete anything
 * - Sales Author -> Can delete/edit their own items (matched by email or full name)
 * - Other Sales Reps -> Cannot delete/edit items created by teammates
 */
function canCurrentUserDeleteOrEditItem(ownerIdentifier) {
  if (!currentSalesUser) {
    return false;
  }
  
  // 1. Master Supervisor / Manager Permissions
  if (
    currentSalesUser.role === 'manager' || 
    currentSalesUser.role === 'supervisor' ||
    currentSalesUser.email.toLowerCase() === 'pannipan@scg.com' ||
    currentSalesUser.email.toLowerCase() === 'keetavas@scg.com' ||
    (currentSalesUser.fullName && (currentSalesUser.fullName.includes('พรรณิภา') || currentSalesUser.fullName.includes('คีตวรรษ')))
  ) {
    return true;
  }

  // If no owner recorded yet (empty note / unassigned), anyone can edit/create
  if (!ownerIdentifier || String(ownerIdentifier).trim() === '') {
    return true;
  }

  const normOwner = String(ownerIdentifier).trim().toLowerCase();
  const userEmail = (currentSalesUser.email || '').trim().toLowerCase();
  const userName = (currentSalesUser.fullName || '').trim().toLowerCase();

  // 2. Author match (by email or full name)
  return (
    normOwner === userEmail ||
    normOwner === userName ||
    (userName && normOwner.includes(userName)) ||
    (normOwner && userName.includes(normOwner))
  );
}

/**
 * Load user profile from public.user_profiles table
 */
async function loadSalesUserProfile(userId, userEmail) {
  const normEmail = (userEmail || '').toLowerCase();
  const sysUser = SCG_SYSTEM_USERS.find(u => u.email.toLowerCase() === normEmail);
  if (sysUser) {
    currentSalesUser = {
      id: userId || ('usr_' + normEmail.replace(/[@.]/g, '_')),
      email: sysUser.email,
      fullName: sysUser.fullName,
      title: sysUser.title,
      role: sysUser.role,
      assignedProvince: sysUser.assignedProvince,
      avatar: sysUser.avatar
    };
    localStorage.setItem('nextsite_cached_user', JSON.stringify(currentSalesUser));
    updateAuthHeaderUI();
    return currentSalesUser;
  }

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
        title: data.title || 'ทีมขายประจำพื้นที่',
        assignedProvince: data.assigned_province || 'อุดรธานี',
        role: data.role || 'sales',
        avatar: data.role === 'manager' ? '👑' : '👤'
      };
    } else {
      currentSalesUser = {
        id: userId,
        email: userEmail,
        fullName: userEmail.split('@')[0],
        title: 'ทีมขายประจำพื้นที่',
        assignedProvince: 'อุดรธานี',
        role: 'sales',
        avatar: '👤'
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
    return true; // Allow interaction or open login prompt
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
  window.currentSalesUser = currentSalesUser;
  const container = document.getElementById('user-auth-section');
  if (!container) return;

  if (currentSalesUser) {
    const isManager = currentSalesUser.role === 'manager';
    container.innerHTML = `
      <div style="display: inline-flex; align-items: center; gap: 8px; background: ${isManager ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.45) 0%, rgba(79, 70, 229, 0.45) 100%)' : 'rgba(30, 58, 138, 0.45)'}; border: 1.5px solid ${isManager ? '#C084FC' : 'rgba(96, 165, 250, 0.5)'}; padding: 4px 12px; border-radius: 9px; backdrop-filter: blur(8px); box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        <div style="width: 26px; height: 26px; border-radius: 50%; background: ${isManager ? '#9333EA' : '#2563EB'}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 0.82rem; font-weight: 900; box-shadow: 0 1px 4px rgba(0,0,0,0.3);">
          ${currentSalesUser.avatar || '👤'}
        </div>
        <div style="display: flex; flex-direction: column; text-align: left; line-height: 1.15;">
          <span style="font-size: 0.78rem; font-weight: 800; color: #FFFFFF;">${currentSalesUser.fullName}</span>
          <span style="font-size: 0.65rem; color: ${isManager ? '#E9D5FF' : '#93C5FD'}; font-weight: 700;">${currentSalesUser.title || currentSalesUser.role}</span>
        </div>
        <button onclick="logoutSalesUser()" title="ออกจากระบบ / สลับบัญชี" style="background: rgba(239, 68, 68, 0.25); color: #FCA5A5; border: 1px solid rgba(239, 68, 68, 0.5); border-radius: 6px; padding: 3px 8px; font-size: 0.68rem; font-weight: 800; cursor: pointer; margin-left: 4px; transition: all 0.15s ease;" onmouseover="this.style.background='rgba(239,68,68,0.45)'" onmouseout="this.style.background='rgba(239,68,68,0.25)'">
          สลับผู้ใช้
        </button>
      </div>
    `;
  } else {
    container.innerHTML = `
      <button onclick="openLoginModal()" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #1E40AF 0%, #2563EB 100%); color: #FFFFFF; border: 1px solid rgba(147, 197, 253, 0.5); padding: 6px 14px; border-radius: 8px; font-size: 0.78rem; font-weight: 800; cursor: pointer; backdrop-filter: blur(8px); box-shadow: 0 2px 8px rgba(37,99,235,0.3); transition: all 0.15s ease;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='none'">
        <span>🔐 เข้าสู่ระบบ (เซลส์ / หัวหน้า)</span>
      </button>
    `;
  }

  if (typeof updateUserCrmStatusSummary === 'function') {
    updateUserCrmStatusSummary();
  }
}

// Auto check existing session on load
async function checkCurrentSession() {
  const client = supabaseClient || initSupabase();
  let foundUser = null;

  try {
    if (client && client.auth) {
      const { data: { session } } = await client.auth.getSession();
      if (session && session.user) {
        foundUser = await loadSalesUserProfile(session.user.id, session.user.email);
      }
    }
    
    if (!foundUser) {
      const cached = localStorage.getItem('nextsite_cached_user');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.email) {
            currentSalesUser = parsed;
            foundUser = parsed;
          }
        } catch (e) {
          currentSalesUser = null;
        }
      }
    }
  } catch (err) {
    console.warn('Session check warning:', err);
    currentSalesUser = null;
  }

  if (currentSalesUser) {
    document.body.classList.remove('auth-locked');
    updateAuthHeaderUI();
    closeLoginModal(true);
  } else {
    document.body.classList.add('auth-locked');
    updateAuthHeaderUI();
    openLoginModal(true);
  }
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
    const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
    const userEmail = activeUser ? activeUser.email : null;
    if (!userEmail) return;

    const { data, error } = await client
      .from('companies')
      .select('id, tag');

    if (error) {
      console.warn('⚠️ Could not load cloud tags:', error.message);
      return;
    }

    if (data && data.length > 0) {
      const tagMap = (typeof loadCompanyTagsMap === 'function') ? loadCompanyTagsMap(userEmail) : {};
      
      let changed = false;
      data.forEach(item => {
        if (item.id && item.tag) {
          const norm = String(item.tag).trim().toLowerCase();
          // Only populate if not yet defined in local user storage
          if (typeof tagMap[item.id] === 'undefined') {
            tagMap[item.id] = norm;
            changed = true;
          }
        }
      });

      if (changed && typeof saveCompanyTagsMap === 'function') {
        saveCompanyTagsMap(tagMap, userEmail);
      }
      if (typeof syncUserTagsToCompanies === 'function') {
        syncUserTagsToCompanies(userEmail);
      }
      if (typeof applyFilters === 'function') {
        applyFilters();
      }
      if (typeof updateTagFilterCounts === 'function' && typeof window.allCompanies !== 'undefined') {
        updateTagFilterCounts(window.allCompanies);
      }
      console.log(`☁️ Synced tags from Supabase Cloud successfully for ${userEmail}!`);
    }
  } catch (err) {
    console.warn('⚠️ Supabase Tag Sync Exception:', err);
  }
}

async function updateCloudCompanyTag(companyId, newTag, userEmail = null) {
  const client = supabaseClient || initSupabase();
  if (!client) return false;

  const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
  const email = userEmail || (activeUser ? activeUser.email : null);
  const normalizedTag = String(newTag || 'new').trim().toLowerCase();

  try {
    let { data, error } = await client
      .from('companies')
      .update({ 
        tag: normalizedTag, 
        crm_sales_rep: activeUser ? (activeUser.fullName || activeUser.email) : undefined,
        updated_at: new Date().toISOString() 
      })
      .eq('id', companyId)
      .select('id');

    if (!error && (!data || data.length === 0)) {
      const payload = {
        id: companyId,
        tag: normalizedTag,
        crm_sales_rep: activeUser ? (activeUser.fullName || activeUser.email) : undefined,
        province: 'อุดรธานี'
      };
      if (typeof allCompanies !== 'undefined' && Array.isArray(allCompanies)) {
        const comp = allCompanies.find(c => c.id === companyId);
        if (comp) {
          if (comp.name) payload.name = comp.name;
          if (comp.province) payload.province = comp.province;
        }
      }
      const upsertRes = await client.from('companies').upsert(payload, { onConflict: 'id' });
      error = upsertRes.error;
    }

    if (error) {
      console.warn('⚠️ Update Tag in Supabase:', error.message);
      return false;
    }
    console.log(`☁️ Synced tag '${normalizedTag}' for ${companyId} (${email}) to Supabase`);
    return true;
  } catch (err) {
    console.warn('❌ Update Tag Exception:', err);
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
      wantFollowup: !!crmData.wantFollowup,
      salesOpportunityLevel: crmData.salesOpportunityLevel || null,
      photos: Array.isArray(crmData.photos) ? crmData.photos : [],
      updatedAt: crmData.updatedAt || crmData.lastUpdated || new Date().toISOString()
    });

    const updatePayload = {
      crm_note: crmData.note || '',
      crm_status: crmData.status || 'pending',
      crm_sales_rep: crmData.salesRep || (currentSalesUser ? currentSalesUser.fullName : 'ทีมขาย SCG'),
      crm_next_date: crmData.nextDate || '',
      revenue_potential: jsonStr
    };

    let { data, error } = await client
      .from('companies')
      .update(updatePayload)
      .eq('id', companyId)
      .select('id');

    // If row did not exist yet, upsert with basic metadata
    if (!error && (!data || data.length === 0)) {
      const upsertPayload = {
        id: companyId,
        ...updatePayload,
        province: 'อุดรธานี'
      };
      if (typeof allCompanies !== 'undefined' && Array.isArray(allCompanies)) {
        const comp = allCompanies.find(c => c.id === companyId);
        if (comp) {
          if (comp.name) upsertPayload.name = comp.name;
          if (comp.province) upsertPayload.province = comp.province;
          if (comp.tag) upsertPayload.tag = comp.tag;
        }
      }
      const upsertRes = await client.from('companies').upsert(upsertPayload, { onConflict: 'id' });
      error = upsertRes.error;
    }

    if (error) {
      console.error('❌ Supabase Cloud CRM Save error:', error.message);
      return false;
    }

    console.log(`☁️ Synced CRM log for ${companyId} to Supabase successfully:`, updatePayload);
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
        const raw = localStorage.getItem('nextsite_crm_followup_logs') || localStorage.getItem('nextsite_crm_logs_v1') || localStorage.getItem('nextsite_crm_logs_v2');
        if (raw) crmLogs = JSON.parse(raw);
      } catch (e) {}

      let updatedCount = 0;
      data.forEach(item => {
        if (item.id) {
          let cloudLog = null;
          if (item.revenue_potential && typeof item.revenue_potential === 'string' && item.revenue_potential.startsWith('{')) {
            try {
              cloudLog = JSON.parse(item.revenue_potential);
            } catch (e) {}
          }

          const existingLocal = crmLogs[item.id] || {};
          crmLogs[item.id] = {
            ...existingLocal,
            ...(cloudLog || {}),
            note: item.crm_note || (cloudLog && cloudLog.note) || existingLocal.note || '',
            status: item.crm_status || (cloudLog && cloudLog.status) || existingLocal.status || 'pending',
            salesRep: item.crm_sales_rep || (cloudLog && cloudLog.salesRep) || existingLocal.salesRep || '',
            nextDate: item.crm_next_date || (cloudLog && cloudLog.nextDate) || existingLocal.nextDate || '',
            wantFollowup: (cloudLog && typeof cloudLog.wantFollowup !== 'undefined') ? cloudLog.wantFollowup : (typeof existingLocal.wantFollowup !== 'undefined' ? existingLocal.wantFollowup : false),
            salesOpportunityLevel: (cloudLog && cloudLog.salesOpportunityLevel) ? cloudLog.salesOpportunityLevel : (existingLocal.salesOpportunityLevel || null),
            photos: (cloudLog && Array.isArray(cloudLog.photos) && cloudLog.photos.length > 0) ? cloudLog.photos : (Array.isArray(existingLocal.photos) ? existingLocal.photos : []),
            updatedAt: (cloudLog && cloudLog.updatedAt) || new Date().toISOString()
          };
          updatedCount++;
        }
      });

      localStorage.setItem('nextsite_crm_followup_logs', JSON.stringify(crmLogs));
      localStorage.setItem('nextsite_crm_logs_v1', JSON.stringify(crmLogs));
      localStorage.setItem('nextsite_crm_logs_v2', JSON.stringify(crmLogs));

      if (typeof renderTable === 'function') {
        renderTable();
      }
      if (typeof updateHeaderCrmStats === 'function') {
        updateHeaderCrmStats();
      }
      if (typeof updateUserCrmStatusSummary === 'function') {
        updateUserCrmStatusSummary();
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
function openLoginModal(enforce = false) {
  const modal = document.getElementById('sales-login-modal');
  if (modal) {
    modal.style.display = 'flex';
    const errEl = document.getElementById('login-error-msg');
    if (errEl) errEl.style.display = 'none';

    const btnCancel = document.getElementById('btn-login-cancel');
    const btnCloseX = document.getElementById('btn-login-close-x');
    
    if (!currentSalesUser || enforce) {
      document.body.classList.add('auth-locked');
      if (btnCancel) btnCancel.style.display = 'none';
      if (btnCloseX) btnCloseX.style.display = 'none';
    } else {
      if (btnCancel) btnCancel.style.display = 'block';
      if (btnCloseX) btnCloseX.style.display = 'block';
    }
  }
}

function closeLoginModal(force = false) {
  if (!currentSalesUser && !force) {
    const errEl = document.getElementById('login-error-msg');
    if (errEl) {
      errEl.textContent = '🔒 กรุณาเข้าสู่ระบบก่อนเข้าใช้งานระบบ SCG Sales Intelligence';
      errEl.style.display = 'block';
    }
    return;
  }
  const modal = document.getElementById('sales-login-modal');
  if (modal) modal.style.display = 'none';
  if (currentSalesUser) {
    document.body.classList.remove('auth-locked');
  }
}

function fillDemoUser(email, pass) {
  const elEmail = document.getElementById('login-email');
  const elPass = document.getElementById('login-password');
  if (elEmail) elEmail.value = email;
  if (elPass) elPass.value = pass;
}

async function handleSalesLoginForm(event) {
  if (event && event.preventDefault) event.preventDefault();
  const email = (document.getElementById('login-email').value || '').trim();
  const pass = (document.getElementById('login-password').value || '').trim();
  const btnSubmit = document.getElementById('btn-login-submit');
  const errEl = document.getElementById('login-error-msg');

  if (errEl) errEl.style.display = 'none';
  if (!email || !pass) {
    if (errEl) {
      errEl.textContent = '⚠️ กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน';
      errEl.style.display = 'block';
    }
    return;
  }

  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'กำลังตรวจสอบ...';
  }

  try {
    const user = await loginSalesUser(email, pass);
    document.body.classList.remove('auth-locked');
    closeLoginModal(true);
    if (typeof showStatusToast === 'function') {
      showStatusToast(`🎉 ยินดีต้อนรับ ${user.fullName} (${user.title || user.assignedProvince})`);
    } else {
      alert(`🎉 ยินดีต้อนรับ ${user.fullName} (${user.title || user.assignedProvince})`);
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
  window.canCurrentUserDeleteOrEditItem = canCurrentUserDeleteOrEditItem;
  window.SCG_SYSTEM_USERS = SCG_SYSTEM_USERS;
  window.updateAuthHeaderUI = updateAuthHeaderUI;
  window.openLoginModal = openLoginModal;
  window.closeLoginModal = closeLoginModal;
  window.fillDemoUser = fillDemoUser;
  window.handleSalesLoginForm = handleSalesLoginForm;
  window.saveCloudCrmLog = saveCloudCrmLog;
  window.loadAndApplyCloudCrmLogs = loadAndApplyCloudCrmLogs;
}
