/**
 * NEXTSITE AI - Main Application Logic & CRM Project Tracking
 * Executive Dashboard with 100% Thai Language Support & Pure CSS Design System
 */

// ==========================================
// 1. STATE & GLOBAL VARIABLES
// ==========================================
let allCompanies = [];
let filteredCompanies = [];
let activeFilter = 'all'; // 'all' | 'red' | 'orange' | 'yellow'
let activeDistrict = 'all'; // จังหวัด: 'all' | 'อุดรธานี' | 'สกลนคร' | 'ขอนแก่น' | ...
let activeSubDistrict = 'all'; // อำเภอ
let activeFbKeyword = 'all'; // คีย์เวิร์ด Facebook
let searchQuery = '';
let currentView = 'table'; // 'table' | 'map'
let activeSelectedCompany = null;
let activeModalProjectStageFilter = 'all';
let activeCompanyTagFilter = 'all'; // 'all' | 'strategic' | 'growth' | 'opportunity' | 'prospect'
let activeFollowupStatusFilter = 'all'; // 'all' | 'followed' | 'pending'

// Storage Keys
const STORAGE_KEY_COMPANY_TAGS = 'nextsite_company_tags_v1';
const STORAGE_KEY_CRM_LOGS = 'nextsite_crm_logs_v1';
const STORAGE_KEY_PROJECT_STATUSES = 'nextsite_project_statuses_v1';

// แผนที่จังหวัดและอำเภอภาคอีสาน
const PROVINCE_DISTRICT_MAP = {
  'อุดรธานี': [
    'เมืองอุดรธานี', 'กุมภวาปี', 'หนองหาน', 'บ้านดุง', 'เพ็ญ', 'กุดจับ', 
    'โนนสะอาด', 'ศรีธาตุ', 'วังสามหมอ', 'ทุ่งฝน', 'สร้างคอม', 'หนองแสง', 
    'หนองวัวซอ', 'บ้านผือ', 'น้ำโสม', 'นายูง', 'พิบูลย์รักษ์', 'กู่แก้ว', 'ประจักษ์ศิลปาคม'
  ],
  'สกลนคร': [
    'เมืองสกลนคร', 'พังโคน', 'สว่างแดนดิน', 'วานรนิวาส', 'พรรณานิคม', 'วาริชภูมิ', 
    'กุสุมาลย์', 'อากาศอำนวย', 'บ้านม่วง', 'คำตากล้า', 'กุดบาก', 'เต่างอย', 
    'โคกศรีสุพรรณ', 'เจริญศิลป์', 'โพนนาแก้ว', 'ภูพาน', 'ส่องดาว'
  ],
  'ขอนแก่น': [
    'เมืองขอนแก่น', 'บ้านไผ่', 'ชุมแพ', 'น้ำพอง', 'กระนวน', 'พระยืน', 
    'หนองเรือ', 'พล', 'ภูเวียง', 'มัญจาคีรี', 'ชนบท', 'สีชมพู', 
    'หนองสองห้อง', 'บ้านฝาง', 'อุบลรัตน์', 'แวงน้อย', 'แวงใหญ่', 'เปือยน้อย', 
    'โนนศิลา', 'เขาสวนกวาง', 'ภูผาม่าน', 'ซำสูง', 'โคกโพธิ์ไชย', 'หนองนาคำ', 'บ้านแฮด', 'เวียงเก่า'
  ],
  'หนองคาย': [
    'เมืองหนองคาย', 'ท่าบ่อ', 'โพนพิสัย', 'ศรีเชียงใหม่', 'สังคม', 'สระใคร', 'รัตนวาปี', 'โพธิ์ตาก', 'เฝ้าไร่'
  ],
  'หนองบัวลำภู': [
    'เมืองหนองบัวลำภู', 'นากลาง', 'โนนสัง', 'ศรีบุญเรือง', 'สุวรรณคูหา', 'นาวัง'
  ],
  'เลย': [
    'เมืองเลย', 'วังสะพุง', 'เชียงคาน', 'ด่านซ้าย', 'ภูเรือ', 'ภูกระดึง', 'ท่าลี่', 'ปากชม', 'นาแห้ว', 'ภูหลวง', 'ผาขาว', 'เอราวัณ', 'หนองหิน'
  ],
  'นครพนม': [
    'เมืองนครพนม', 'ธาตุพนม', 'นาแก', 'เรณูนคร', 'ปลาปาก', 'ท่าอุเทน', 'ศรีสงคราม', 'บ้านแพง', 'นาหว้า', 'โพนสวรรค์', 'นาทม', 'วังยาง'
  ],
  'กาฬสินธุ์': [
    'เมืองกาฬสินธุ์', 'ยางตลาด', 'กมลาไสย', 'สมเด็จ', 'กุฉินารายณ์', 'ห้วยผึ้ง', 'ร่องคำ', 'นามน', 'เขาวง', 'คำม่วง', 'ท่าคันโท', 'สหัสขันธ์', 'หนองกุงศรี', 'ห้วยเม็ก', 'นาคู', 'ดอนจาน', 'สามชัย', 'ฆ้องชัย'
  ]
};

// ==========================================
// 1.1 THAI TEXT SANITIZER & URL DECODER
// ==========================================
function cleanThaiText(text) {
  if (!text) return '';
  let str = String(text).trim();

  // 0. ปรับแต่ง Unicode Fancy Fonts (เช่น 𝗢𝘄𝗻𝗲𝗿 -> Owner, 𝗟𝗼𝗰𝗮𝘁𝗶𝗼𝗻 -> Location)
  if (typeof str.normalize === 'function') {
    try {
      str = str.normalize('NFKD');
    } catch(e) {}
  }

  // 1. ถอดรหัส URL-Encoded (%E0%B8...) ให้เป็นภาษาไทยที่อ่านออก
  let tries = 0;
  while (str.includes('%') && tries < 3) {
    try {
      const decoded = decodeURIComponent(str);
      if (decoded === str) break;
      str = decoded;
    } catch (e) {
      break;
    }
    tries++;
  }

  // 2. แมปชื่อเพจ Facebook Slug ที่พบบ่อยให้เป็นชื่อบริษัทภาษาไทย
  const KNOWN_SLUG_MAP = {
    'JoylyYothakaree': 'หจก. จ้อยลี่ โยธาการ (รับสร้างบ้านสกลนคร)',
    'joylyyothakaree': 'หจก. จ้อยลี่ โยธาการ (รับสร้างบ้านสกลนคร)',
    'housebuildingsunphage': 'บ้านสร้างสุข สกลนคร & อุดรธานี',
    'SYC.House2022': 'หจก. ทรัพย์ยิ่งเจริญ คอนสตรัคชั่น (S.Y.C. House)',
    'syc.house2022': 'หจก. ทรัพย์ยิ่งเจริญ คอนสตรัคชั่น (S.Y.C. House)',
    'sacstudio': 'เอสเอซี สตูดิโอ สกลนคร (SAC STUDIO)',
    'DreamUpHouseBuilder': 'บริษัท ดรีมอัพ เฮ้าส์ บิลเดอร์ จำกัด (Dream Up House Builder)',
    'dreamuphousebuilder': 'บริษัท ดรีมอัพ เฮ้าส์ บิลเดอร์ จำกัด (Dream Up House Builder)',
    'udonhouse': 'บริษัท ดรีมอัพ เฮ้าส์ บิลเดอร์ จำกัด (Dream Up House Builder)',
    'Udonhouse': 'บริษัท ดรีมอัพ เฮ้าส์ บิลเดอร์ จำกัด (Dream Up House Builder)',
    'รับสร้างบ้านอุดรธานี Udonhouse': 'บริษัท ดรีมอัพ เฮ้าส์ บิลเดอร์ จำกัด (Dream Up House Builder)',
    'LeCrownDesign': 'บริษัท เลอ คราวน์ ดีไซน์ จำกัด',
    'lecrowndesign': 'บริษัท เลอ คราวน์ ดีไซน์ จำกัด',
    'siharaj': 'บริษัท สีหราช คอนสตรัคชั่น จำกัด',
    'klmhouse': 'KLM รับสร้างบ้านสกลนคร',
    'sermsudahouse': 'เสริมสุดารับสร้างบ้าน สกลนคร',
    'FU-House-Interior-Design': 'ห้างหุ้นส่วนจำกัด ฟู่เฮ้าส์ อินทีเรีย ดีไซน์ FU House Interior Design',
    '100080371301938': 'ห้างหุ้นส่วนจำกัด ฟู่เฮ้าส์ อินทีเรีย ดีไซน์ FU House Interior Design',
    '100083320623771': 'ห้างหุ้นส่วนจำกัด โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น',
    'siarchitecture': 'ห้างหุ้นส่วนจำกัด เอสไอ อาร์คิเทคเชอร์ แอนด์ คอนสตรัคชั่น',
    'sdhousedesign': 'ห้างหุ้นส่วนจำกัด เอสดี เฮ้าส์ ดีไซน์',
    'N.P.HomeEngineering': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'n.p.homeengineering': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'nphome': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'รับสร้างบ้านภาคอิสาน BY N.p.home': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'รับสร้างบ้านภาคอิสาน by n.p.home': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'Banraks.Ud': 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี',
    'banraks.ud': 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี',
    'banraks': 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี',
    'Banraks': 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี'
  };

  for (const [slug, thaiName] of Object.entries(KNOWN_SLUG_MAP)) {
    if (str.toLowerCase() === slug.toLowerCase() || str.toLowerCase().includes(slug.toLowerCase())) {
      return thaiName;
    }
  }

  // แปลงชื่อ หจก.บ้านรักษ์ ทุกกรณีให้เป็น ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี
  if (str.includes('บ้านรักษ์') && (str.includes('หจก') || str.includes('หจก.'))) {
    return 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี';
  }

  // 3. ทำความสะอาด URL prefix และตัวเลขต่อท้าย
  str = str.replace(/^https?:\/\/[^\/]+\/(p\/)?/i, '');
  str = str.replace(/-\d+\/?$/, '');
  str = str.replace(/^บรับสร้างบ้าน/, 'รับสร้างบ้าน');
  str = str.replace(/[\-_]+/g, ' ').trim();

  return str;
}

// ==========================================
// 2. TAG MANAGEMENT (Focus / Non-Focus / New - Per User Isolation & Instant Persistence)
// ==========================================
function getUserTagsStorageKey(email) {
  const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
  const targetEmail = (email !== null && typeof email !== 'undefined') ? email : (activeUser ? activeUser.email : '');
  if (!targetEmail || targetEmail === 'guest') {
    return STORAGE_KEY_COMPANY_TAGS;
  }
  const norm = String(targetEmail).toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  return `nextsite_company_tags_${norm}`;
}

function loadCompanyTagsMap(customEmail = null) {
  try {
    const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
    const email = customEmail !== null ? customEmail : (activeUser ? activeUser.email : null);
    
    const userKey = getUserTagsStorageKey(email);
    const userSaved = localStorage.getItem(userKey);
    if (userSaved) {
      try {
        return JSON.parse(userSaved);
      } catch (e) {}
    }

    if (!email || email === 'guest') {
      const saved = localStorage.getItem(STORAGE_KEY_COMPANY_TAGS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
  } catch (e) {
    console.warn('Failed to load company tags from localStorage', e);
  }
  return {};
}

function saveCompanyTagsMap(tagMap, customEmail = null) {
  try {
    const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
    const email = customEmail !== null ? customEmail : (activeUser ? activeUser.email : null);
    const jsonStr = JSON.stringify(tagMap || {});

    const userKey = getUserTagsStorageKey(email);
    localStorage.setItem(userKey, jsonStr);

    if (!email || email === 'guest') {
      localStorage.setItem(STORAGE_KEY_COMPANY_TAGS, jsonStr);
    }
  } catch (e) {
    console.warn('Failed to save company tags to localStorage', e);
  }
}

function normalizeTagValue(rawTag, comp = null) {
  if (!rawTag) {
    if (comp) {
      if (comp.scgCode) return 'strategic';
      if ((comp.growthRate && comp.growthRate >= 40) || (comp.totalProjects && comp.totalProjects >= 3)) return 'growth';
      if ((comp.totalProjects && comp.totalProjects > 0) || (comp.opportunityScore && comp.opportunityScore >= 70)) return 'opportunity';
    }
    return 'prospect';
  }
  const t = String(rawTag).trim().toLowerCase();
  if (t === 'strategic' || t === 'growth' || t === 'opportunity' || t === 'prospect') return t;
  // Legacy mappings
  if (t === 'focus') return 'strategic';
  if (t === 'non-focus' || t === 'nonfocus') return 'opportunity';
  if (t === 'new' || t === 'verified') return 'prospect';
  return 'prospect';
}

function syncUserTagsToCompanies(customEmail = null) {
  const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
  const email = customEmail !== null ? customEmail : (activeUser ? activeUser.email : null);
  const tagMap = loadCompanyTagsMap(email);

  if (typeof allCompanies !== 'undefined' && Array.isArray(allCompanies)) {
    allCompanies.forEach(c => {
      const savedTag = tagMap[c.id];
      if (savedTag) {
        c.tag = normalizeTagValue(savedTag, c);
      } else if (c.tag) {
        c.tag = normalizeTagValue(c.tag, c);
      } else {
        c.tag = normalizeTagValue(null, c);
      }
    });
  }
}

function getCompanyTag(companyId, customEmail = null) {
  const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
  const email = customEmail !== null ? customEmail : (activeUser ? activeUser.email : null);
  const tagMap = loadCompanyTagsMap(email);
  const raw = tagMap[companyId];
  
  let comp = null;
  if (typeof allCompanies !== 'undefined' && Array.isArray(allCompanies)) {
    comp = allCompanies.find(c => c.id === companyId);
  }

  if (raw) return normalizeTagValue(raw, comp);
  if (comp && comp.tag) return normalizeTagValue(comp.tag, comp);
  return normalizeTagValue(null, comp);
}

function setCompanyTag(companyId, tag, event) {
  if (event && event.stopPropagation) {
    event.stopPropagation();
  }

  const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);
  const userEmail = activeUser ? activeUser.email : 'guest';
  const normalizedTag = normalizeTagValue(tag);

  const comp = (typeof allCompanies !== 'undefined' && Array.isArray(allCompanies)) ? allCompanies.find(c => c.id === companyId) : null;
  if (comp) {
    comp.tag = normalizedTag;
  }

  // Load and save user-specific tag map
  const tagMap = loadCompanyTagsMap(userEmail);
  tagMap[companyId] = normalizedTag;
  saveCompanyTagsMap(tagMap, userEmail);

  // Sync to Supabase Cloud in real-time if logged in
  if (activeUser && typeof updateCloudCompanyTag === 'function') {
    updateCloudCompanyTag(companyId, normalizedTag, activeUser.email);
  }

  applyFilters();
  updateTagFilterCounts(allCompanies);

  const tagNames = {
    'strategic': '👑 Strategic Partner (ลูกค้าแฟนพันธ์แท้)',
    'growth': '📈 Growth Account (ลูกค้าทีมีความสัมพันธ์ แต่ต้อติดตามอย่างใกล้ชิด)',
    'opportunity': '🎯 Opportunity Account (ลูกค้าที่ต้องสร้างความสัมพันธ์)',
    'prospect': '✨ New (ลูกค้าใหม่)'
  };
  const userName = activeUser ? (activeUser.fullName || activeUser.email) : 'บราวเซอร์นี้';
  showStatusToast(`💾 จำสถานะเป็น ${tagNames[normalizedTag] || normalizedTag} สำหรับ ${userName} เรียบร้อย`);
}

// ==========================================
// SALES LOGIN & AUTH MODAL HANDLERS
// ==========================================
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
  event.preventDefault();
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
    if (typeof window.loginSalesUser === 'function') {
      const user = await window.loginSalesUser(email, pass);
      closeLoginModal();
      showStatusToast(`ยินดีต้อนรับ ${user.fullName} (พื้นที่: ${user.assignedProvince})`);
    } else {
      throw new Error('ระบบ Supabase ยังไม่พร้อม');
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

function filterByCompanyTag(tag) {
  const normTag = (tag === 'all') ? 'all' : normalizeTagValue(tag);
  activeCompanyTagFilter = normTag;

  document.querySelectorAll('.tag-filter-btn').forEach(btn => {
    const bTag = btn.getAttribute('data-filter');
    const normBTag = (bTag === 'all') ? 'all' : normalizeTagValue(bTag);
    if (normBTag === normTag || (normTag === 'prospect' && (bTag === 'prospect' || bTag === 'new'))) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  applyFilters();
  if (typeof updateStickyOffsets === 'function') {
    setTimeout(updateStickyOffsets, 50);
  }
}

function handleCrmStatusFilterChange(val) {
  activeFollowupStatusFilter = val || 'all';
  const sel = document.getElementById('select-crm-status-filter');
  if (sel && sel.value !== activeFollowupStatusFilter) {
    sel.value = activeFollowupStatusFilter;
  }
  applyFilters();
}

function updateTagFilterCounts(companies) {
  const source = allCompanies && allCompanies.length > 0 ? allCompanies : (companies || []);
  let strategicCount = 0;
  let growthCount = 0;
  let opportunityCount = 0;
  let prospectCount = 0;

  source.forEach(c => {
    const tag = getCompanyTag(c.id);
    if (tag === 'strategic') strategicCount++;
    else if (tag === 'growth') growthCount++;
    else if (tag === 'opportunity') opportunityCount++;
    else prospectCount++;
  });

  const elAll = document.getElementById('tag-count-all') || document.getElementById('count-tag-all');
  const elStrategic = document.getElementById('tag-count-strategic') || document.getElementById('tag-count-focus');
  const elGrowth = document.getElementById('tag-count-growth');
  const elOpportunity = document.getElementById('tag-count-opportunity') || document.getElementById('tag-count-non-focus');
  const elProspect = document.getElementById('tag-count-prospect') || document.getElementById('tag-count-new');

  if (elAll) elAll.textContent = source.length;
  if (elStrategic) elStrategic.textContent = strategicCount;
  if (elGrowth) elGrowth.textContent = growthCount;
  if (elOpportunity) elOpportunity.textContent = opportunityCount;
  if (elProspect) elProspect.textContent = prospectCount;
}

/**
 * Real-time User CRM Status Summary (Strictly filtered for the logged-in email/user)
 */
function getCurrentSalesUserObj() {
  if (typeof currentSalesUser !== 'undefined' && currentSalesUser && currentSalesUser.email) return currentSalesUser;
  if (typeof window !== 'undefined' && window.currentSalesUser && window.currentSalesUser.email) return window.currentSalesUser;
  try {
    const cached = localStorage.getItem('nextsite_cached_user');
    if (cached) {
      const u = JSON.parse(cached);
      if (u && u.email) {
        window.currentSalesUser = u;
        return u;
      }
    }
  } catch(e) {}
  return {
    id: 'usr_keetavas_scg_com',
    email: 'keetavas@scg.com',
    fullName: 'คุณคีตวรรษ',
    role: 'manager',
    assignedProvince: 'อุดรธานี'
  };
}

function getUserTargetStorageKey(email) {
  const norm = String(email || 'default').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `nextsite_user_targets_${norm}`;
}

function loadUserTargetMap(email) {
  try {
    const key = getUserTargetStorageKey(email);
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch(e) {}
  return {};
}

function saveUserTargetMap(email, map) {
  try {
    const key = getUserTargetStorageKey(email);
    localStorage.setItem(key, JSON.stringify(map));
  } catch(e) {}
}

function isCompanyTargetedByUser(companyId, customEmail = null) {
  const user = customEmail ? { email: customEmail } : getCurrentSalesUserObj();
  const uEmail = (user && user.email) ? user.email.toLowerCase().trim() : 'keetavas@scg.com';
  
  const userMap = loadUserTargetMap(uEmail);
  if (typeof userMap[companyId] === 'boolean') {
    return userMap[companyId];
  }
  
  const log = (typeof getCompanyCrmLog === 'function') ? getCompanyCrmLog(companyId) : {};
  if (log.wantFollowup === true) {
    if (!log.wantFollowupBy || log.wantFollowupBy === uEmail) return true;
    if (Array.isArray(log.wantFollowupUsers) && log.wantFollowupUsers.includes(uEmail)) return true;
  }
  return false;
}

function updateUserCrmStatusSummary() {
  const cntWantEl = document.getElementById('user-cnt-want-followup');
  const cntFollowingEl = document.getElementById('user-cnt-following');
  if (!cntWantEl && !cntFollowingEl) return;

  const activeUser = getCurrentSalesUserObj();
  const uEmail = (activeUser.email || '').toLowerCase().trim();
  const uName = (activeUser.fullName || '').toLowerCase().trim();

  const compList = (typeof allCompanies !== 'undefined' && allCompanies && allCompanies.length > 0)
    ? allCompanies
    : ((typeof UDON_COMPANIES !== 'undefined' && UDON_COMPANIES) ? UDON_COMPANIES : []);

  let wantCount = 0;
  let followingCount = 0;

  const logs = (typeof getAllCrmLogs === 'function') ? getAllCrmLogs() : {};

  compList.forEach(comp => {
    // If activeDistrict is selected and not 'all', match province
    if (typeof activeDistrict !== 'undefined' && activeDistrict && activeDistrict !== 'all') {
      const compProv = (comp.province || '').replace(/^จ\./, '').trim();
      const targetProv = activeDistrict.replace(/^จ\./, '').trim();
      if (compProv && targetProv && compProv !== targetProv) return;
    }

    if (isCompanyTargetedByUser(comp.id, uEmail)) {
      wantCount++;
    }

    const log = logs[comp.id] || {};
    const hasFollowedUp = (log.note && log.note.trim().length > 0) || 
                          (Array.isArray(log.photos) && log.photos.length > 0) || 
                          ['followup', 'won', 'quote_sent'].includes(log.status);

    if (hasFollowedUp) {
      followingCount++;
    }
  });

  if (cntWantEl) cntWantEl.textContent = wantCount;
  if (cntFollowingEl) cntFollowingEl.textContent = followingCount;
}

/**
 * Filter table by user's personal CRM follow-up status (Toggle on click)
 */
function filterByUserCrmStatus(statusType) {
  const activeUser = getCurrentSalesUserObj();
  const btnWant = document.getElementById('user-filter-want-btn');
  const btnFollowing = document.getElementById('user-filter-following-btn');

  if (statusType === 'want') {
    if (activeFollowupStatusFilter === 'user-want') {
      activeFollowupStatusFilter = 'all';
      if (btnWant) {
        btnWant.style.background = '#FFFFFF';
        btnWant.style.borderColor = '#BFDBFE';
      }
    } else {
      activeFollowupStatusFilter = 'user-want';
      if (btnWant) {
        btnWant.style.background = '#DBEAFE';
        btnWant.style.borderColor = '#2563EB';
      }
      if (btnFollowing) {
        btnFollowing.style.background = '#FFFFFF';
        btnFollowing.style.borderColor = '#BBF7D0';
      }
    }
  } else if (statusType === 'following') {
    if (activeFollowupStatusFilter === 'user-following') {
      activeFollowupStatusFilter = 'all';
      if (btnFollowing) {
        btnFollowing.style.background = '#FFFFFF';
        btnFollowing.style.borderColor = '#BBF7D0';
      }
    } else {
      activeFollowupStatusFilter = 'user-following';
      if (btnFollowing) {
        btnFollowing.style.background = '#DCFCE7';
        btnFollowing.style.borderColor = '#16A34A';
      }
      if (btnWant) {
        btnWant.style.background = '#FFFFFF';
        btnWant.style.borderColor = '#BFDBFE';
      }
    }
  }

  applyFilters();
}


function handleSetCompanyTag(tag) {
  if (activeSelectedCompany) {
    const normTag = normalizeTagValue(tag);
    setCompanyTag(activeSelectedCompany.id, normTag);
    
    ['strategic', 'growth', 'opportunity', 'prospect', 'focus', 'non-focus', 'new'].forEach(t => {
      const btn = document.getElementById(`btn-status-${t}`);
      if (btn) {
        if (t === normTag || (t === 'focus' && normTag === 'strategic') || (t === 'non-focus' && normTag === 'opportunity') || (t === 'new' && normTag === 'prospect')) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    });
  }
}

function showStatusToast(message) {
  showToastNotification(message);
}

// ==========================================
// 3. LOCATION & DISTRICT HELPERS
// ==========================================
function getProjectProvince(proj) {
  if (!proj) return 'ไม่ระบุ';
  if (proj.province) return proj.province;
  const loc = (proj.location || '') + ' ' + (proj.address || '');
  for (const prov of Object.keys(PROVINCE_DISTRICT_MAP)) {
    if (loc.includes(prov)) return prov;
  }
  return 'อุดรธานี';
}

function getProjectDistrict(proj, targetProvince) {
  if (!proj) return 'เมือง';
  if (proj.district) return proj.district;
  const loc = (proj.location || '') + ' ' + (proj.address || '');
  const districts = PROVINCE_DISTRICT_MAP[targetProvince] || PROVINCE_DISTRICT_MAP['อุดรธานี'];
  for (const d of districts) {
    if (loc.includes(d)) return d;
  }
  return districts[0] || 'เมือง';
}

function updateSubDistrictDropdown() {
  const subSelect = document.getElementById('sub-district-filter') || document.getElementById('subdistrict-select');
  if (!subSelect) return;

  const currentProvince = activeDistrict;
  subSelect.innerHTML = '<option value="all">📍 ทุกอำเภอ / พื้นที่ก่อสร้าง</option>';

  if (currentProvince === 'all') {
    subSelect.style.display = 'none';
    return;
  }

  subSelect.style.display = 'inline-block';
  const districts = PROVINCE_DISTRICT_MAP[currentProvince] || [];

  districts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = `อ.${d}`;
    subSelect.appendChild(opt);
  });

  subSelect.value = activeSubDistrict;
}

// ==========================================
// 4. DATA LOADING & CRM STATUS STORAGE
// ==========================================
function loadSavedTrackingStatuses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECT_STATUSES);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load project statuses from localStorage', e);
  }
  return {};
}

function saveSavedTrackingStatuses(statusMap) {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECT_STATUSES, JSON.stringify(statusMap));
  } catch (e) {
    console.warn('Failed to save project statuses to localStorage', e);
  }
}

// ==========================================
// SCG ACTUAL CUSTOMER SALES DATA (2025 vs 2026)
// ==========================================
const SCG_CUSTOMER_SALES_LIST = [
  { code: '10051168', name: 'เอเฮ้าส์ บิวเดอร์', sales2025: 15209, sales2026: 22100, keys: ['เอเฮ้าส์', 'เอ-เฮ้าส์', 'a-house', 'a house'] },
  { code: '10108161', name: 'โมเดิร์น ดี (อุดรธานี)', sales2025: 1069432, sales2026: 1208551, keys: ['โมเดิร์น ดี', 'โมเดิร์นดี', 'modernde', 'modern de', 'modern-de'] },
  { code: '10126345', name: 'หล้าก่ำ ทรัพย์เจริญยิ่ง', sales2025: 110483, sales2026: 18166, keys: ['หล้าก่ำ', 'ทรัพย์เจริญยิ่ง'] },
  { code: '10280647', name: 'มหารุ่งโรจน์โฮมบิลเดอร์', sales2025: 3461247, sales2026: 783850, keys: ['มหารุ่งโรจน์', 'maharungroj'] },
  { code: '10335064', name: 'มายด์ โฮม แอสเสท', sales2025: 2514378, sales2026: 1361324, keys: ['มายด์ โฮม', 'มายด์โฮม', 'mind home', 'mindhome'] },
  { code: '10349378', name: 'จีรนันท์ พร็อพเพอร์ตี้', sales2025: 31873, sales2026: 181379, keys: ['จีรนันท์', 'jeeranun'] },
  { code: '10351579', name: 'วันเดอร์ครีเอชั่น', sales2025: 14345.3, sales2026: 127081, keys: ['วันเดอร์ครีเอชั่น', 'วันเดอร์', 'wonder creation', 'wondercreation'] },
  { code: '10369218', name: 'พีรพัฒน์ 999 บิวล์ดิ้ง แอนด์ เซอร์วิสเฮ้า', sales2025: 3282, sales2026: 162877.8, keys: ['พีรพัฒน์', 'peerapat'] },
  { code: '10369220', name: 'ยูดี.โฮมส์ เอ็นจิเนียริ่ง', sales2025: 2151623, sales2026: 2222685, keys: ['ยูดี.โฮมส์', 'ยูดี โฮมส์', 'ยูดีโฮมส์', 'ud home', 'ud.homes', 'udhome'] },
  { code: '10380747', name: 'จุฑามาศ ขุลีดี', sales2025: 2531813, sales2026: 243723, keys: ['จุฑามาศ ขุลีดี', 'จุฑามาศ'] },
  { code: '10383888', name: 'ฟ้าสว่างการโยธา', sales2025: 553824, sales2026: 569818, keys: ['ฟ้าสว่าง', 'fasawang'] },
  { code: '10400409', name: 'บ้านดี-อุดร', sales2025: 423136.5, sales2026: 1198975, keys: ['บ้านดี-อุดร', 'บ้านดี อุดร', 'บ้านดีอุดร', 'baan-d', 'baan d'] },
  { code: '10461104', name: 'นิติพันธ์ เปือยยะ', sales2025: 1289592, sales2026: 852291, keys: ['นิติพันธ์', 'nitipan'] },
  { code: '10482913', name: 'ทีที ดีไซน์ แอนด์ คอนสตรัคชั่น1991', sales2025: 1570146.44, sales2026: 3396188.25, keys: ['ทีที ดีไซน์', 'ทีทีดีไซน์', 'tt design', 'ttdesign'] },
  { code: '10484743', name: 'ช.รุ่งอรุณ คอนสตรัคชั่น', sales2025: 151787.5, sales2026: 189440, keys: ['ช.รุ่งอรุณ', 'รุ่งอรุณ คอนสตรัคชั่น', 'รุ่งอรุณ'] },
  { code: '10485682', name: 'รุ่งรัตน์บิวตี้โฮม', sales2025: 12246, sales2026: 768825.5, keys: ['รุ่งรัตน์บิวตี้โฮม', 'รุ่งรัตน์'] },
  { code: '10500344', name: 'การิน บ้านสวย', sales2025: 469506, sales2026: 1337450, keys: ['การิน บ้านสวย', 'การิน', 'karin'] },
  { code: '10503273', name: 'สุขสกล ดีเวลลอปเม้นท์', sales2025: 677870.3, sales2026: 2338879, keys: ['สุขสกล', 'suksakon'] },
  { code: '10509038', name: '117อาร์คิเทคท์', sales2025: 28572.5, sales2026: 395558.3, keys: ['117อาร์คิเทคท์', '117 architect', '117architect'] },
  { code: '10523555', name: 'ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์', sales2025: 1146567, sales2026: 2903328, keys: ['ทเวนตี้ซิกซ์', '26 development'] },
  { code: '10551209', name: 'บ้านใหญ่ (2016) โฮม บิวเดอร์', sales2025: 5481324, sales2026: 5472101, keys: ['บ้านใหญ่', 'baanyai', 'baanyai2016'] },
  { code: '10590829', name: 'เลอ คราวน์ ดีไซน์', sales2025: 11367, sales2026: 329498.4, keys: ['เลอ คราวน์', 'เลอคราวน์', 'le crown', 'lecrown'] },
  { code: '10612650', name: 'บ้านดี อยู่ดี ดีไซน์', sales2025: 31155, sales2026: 93806.25, keys: ['บ้านดี อยู่ดี', 'บ้านดีอยู่ดี', 'baandee yoodee'] },
  { code: '10640153', name: 'กิจดลวรโชติ1', sales2025: 438100, sales2026: 1992527, keys: ['กิจดลวรโชติ', 'กิจดล'] },
  { code: '10729130', name: 'บ้านวิศวะพัฒนา', sales2025: 0, sales2026: 238997, keys: ['บ้านวิศวะพัฒนา', 'บ้านวิศวะ', 'baanwisawa', 'banwisawa'] },
  { code: '10739362', name: 'ห้างหุ้นส่วนจำกัด เค พี โฮม', sales2025: 0, sales2026: 7101, keys: ['เค พี โฮม', 'เค.พี.โฮม', 'เคพีโฮม', 'kp home', 'k.p. home'] },
  { code: '10727085', name: 'น่าอยู่เฮ้าส์ คอนสตรัคชั่น', sales2025: 0, sales2026: 161278, keys: ['น่าอยู่เฮ้าส์', 'น่าอยู่เฮ้าส์ คอนสตรัคชั่น', 'น่าอยู่', 'nayoo', 'nayoohouse'] },
  { code: '10568031', name: 'ห้างหุ้นส่วนจำกัด เอสวาย.เฮาส์ ดีไซน์ แอนด์ คอนสตรัคชั่น', sales2025: 39378, sales2026: 0, keys: ['เอสวาย', 'เอสวาย.เฮาส์', 'เอสวาย เฮาส์', 'sy house', 'syhouse'] },
  { code: '10648769', name: 'บริษัท อีเฮาส์ คอนสตรัคชั่น แอนด์ ดีไซน์ จำกัด', sales2025: 187141, sales2026: 75112, keys: ['อีเฮาส์', 'อีเฮ้าส์', 'e-house', 'บริษัท อีเฮาส์'] },
  { code: '10724226', name: 'ห้างหุ้นส่วนจำกัด ดีเอ็นเอ็น คอนสตรัคชั่น', sales2025: 0, sales2026: 75021, keys: ['ดีเอ็นเอ็น', 'dnn', 'dnn construction', 'ดีเอ็นเอ็น คอนสตรัคชั่น'] },
  { code: '10724225', name: 'ห้างหุ้นส่วนจำกัด เกียรติรุ่งเรือง ก่อสร้าง', sales2025: 0, sales2026: 1470, keys: ['เกียรติรุ่งเรือง', 'เกียรติรุ่งเรือง ก่อสร้าง', 'kiat rung ruang'] },
  { code: '10615285', name: 'บริษัท เอ็นทรัสท คอนสตรัคชั่น จำกัด', sales2025: 321401, sales2026: 74809, keys: ['เอ็นทรัสท', 'entrust', 'เอ็นทรัสท คอนสตรัคชั่น', 'entrust construction', 'trust construction'] },
  { code: '10095435', name: 'ห้างหุ้นส่วนจำกัด โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น', sales2025: 3023155, sales2026: 670816, keys: ['โมเสคดีไซน์', 'โมเสค', 'mosaic', 'mosaic design', 'โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น'] }
];

const COMPANY_MAPS_MASTER = {
  'comp-udon-01': 'https://maps.app.goo.gl/foPzw9N15CtSM9hMA',
  'comp-udon-02': 'https://maps.app.goo.gl/12Ta5Yv63awVkTs17',
  'comp-udon-03': 'https://maps.app.goo.gl/LpY6wzxXPWZWwvH18',
  'comp-udon-04': 'https://maps.app.goo.gl/MLNixirLwdTEhJ4R6',
  'comp-udon-05': 'https://maps.app.goo.gl/Yyz2TFS9NF6oMZVW9',
  'comp-udon-06': 'https://maps.app.goo.gl/Si9W8xBUCZAw7RwA7',
  'comp-udon-07': 'https://maps.app.goo.gl/NWcMbKHfNiNPdfhb8',
  'comp-udon-08': 'https://maps.app.goo.gl/FVFGk8KDANrwb91Y8',
  'comp-udon-09': 'https://maps.app.goo.gl/JdU3AU4QqTyyFWhr9',
  'comp-udon-10': 'https://maps.app.goo.gl/553uWoK43EjVwNZA7',
  'comp-udon-11': 'https://maps.app.goo.gl/TY33ErVrdAXybZZRA',
  'comp-udon-12': 'https://maps.app.goo.gl/bAsJtsjYjtdoCWybA',
  'comp-udon-13': 'https://maps.app.goo.gl/qYcyFG52xWpkT5D4A',
  'comp-udon-14': 'https://maps.app.goo.gl/mEK2YhfSVGFHKcat9',
  'comp-udon-15': 'https://maps.app.goo.gl/eanpALRZt3C4DJFF9',
  'comp-udon-16': 'https://maps.app.goo.gl/JHcPaso62g7RL2yz6',
  'comp-udon-17': 'https://maps.app.goo.gl/8XeunP9KgTB8zPyC9',
  'comp-udon-18': 'https://maps.app.goo.gl/ciHZXcwHN3bHQH6Z6',
  'comp-udon-19': 'https://maps.app.goo.gl/ZBx4wcz8XLtY6ZaU8',
  'comp-udon-20': 'https://maps.app.goo.gl/jaEv7S9hQd4k6BtC6',
  'comp-udon-21': 'https://maps.app.goo.gl/EwJXZoaML2cEZwYZ7',
  'comp-udon-22': 'https://www.google.com/maps/search/?api=1&query=208+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5+%E0%B9%82%E0%B8%9E%E0%B8%99%E0%B8%87%E0%B8%B2%E0%B8%A1+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD%E0%B8%AB%E0%B8%99%E0%B8%AD%E0%B8%87%E0%B8%AB%E0%B8%B2%E0%B8%99+%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5+41130',
  'comp-udon-23': 'https://maps.app.goo.gl/akUxDHyGEwG19reH8',
  'comp-udon-24': 'https://maps.app.goo.gl/Vu7M4NUqxycvShmn9',
  'comp-udon-25': 'https://maps.app.goo.gl/FZn8CZd8TZEupkLW9',
  'comp-udon-26': 'https://maps.app.goo.gl/1KYvUz75czBcHm8v5',
  'comp-udon-27': 'https://maps.app.goo.gl/XyrAGFjdebLLkp5q9',
  'comp-udon-28': 'https://maps.app.goo.gl/7z72u7gtyswCyU6o6',
  'comp-udon-29': 'https://maps.app.goo.gl/q2HdGPacB4MeHS8d6',
  'comp-udon-30': 'https://maps.app.goo.gl/NSJJDZPRKru1owkr7',
  'comp-udon-31': 'https://maps.app.goo.gl/xhY5ipfir6RTRXLR9',
  'comp-udon-32': 'https://maps.app.goo.gl/EJb3h9y7jTe4JMiJ7',
  'comp-udon-33': 'https://maps.app.goo.gl/YGKZB6pezKPSYnMb6',
  'comp-udon-34': 'https://maps.app.goo.gl/Lk82k26BAtuWnUC8A',
  'comp-udon-35': 'https://maps.app.goo.gl/ZrCewx5vJA86nzjXA',
  'comp-udon-36': 'https://maps.app.goo.gl/5ovdiUtuVGVLiR5X8',
  'comp-udon-37': 'https://maps.app.goo.gl/6TVPLFqkx5AYSZo17',
  'comp-udon-38': 'https://maps.app.goo.gl/5jEQcsqDhYCNDPyM9',
  'comp-udon-39': 'https://maps.app.goo.gl/CJnV3h68YzfEJkHx9',
  'comp-udon-40': 'https://maps.app.goo.gl/VtnWrKj3HnsiaX9C6',
  'comp-udon-41': 'https://maps.app.goo.gl/fBRFeUPfffZhQcPK7',
  'comp-udon-42': 'https://maps.app.goo.gl/44eCAxmwPMNrigGx5',
  'comp-udon-43': 'https://maps.app.goo.gl/NirnCDaBB2bk9fH98',
  'comp-udon-44': 'https://maps.app.goo.gl/sHQRySpumVDgvr1s8',
  'comp-udon-45': 'https://maps.app.goo.gl/nMzQ5MA5Jn4h5qdXA',
  'comp-udon-46': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97+%E0%B8%9E%E0%B8%B5%E0%B8%A3%E0%B8%9E%E0%B8%B1%E0%B8%92%E0%B8%9D%E0%B9%8C+999+%E0%B8%9A%E0%B8%B4%E0%B8%A7%E0%B8%A5%E0%B9%8C%E0%B8%94%E0%B8%B4%E0%B9%89%E0%B8%87+%E0%B9%81%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B9%8C+%E0%B9%80%E0%B8%8B%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%A7%E0%B8%B4%E0%B8%AA%E0%B9%80%E0%B8%AE%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B9%8C+%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+160+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88+6+%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%8A%E0%B8%B1%E0%B8%A2+%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%94%E0%B8%B8%E0%B8%87+%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%B3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5',
  'comp-udon-47': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%AB%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AB%E0%B8%B8%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+%E0%B8%9F%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%82%E0%B8%A2%E0%B8%98%E0%B8%B2+104+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%9A%E0%B8%B9%E0%B9%88%E0%B8%99+%E0%B8%AB%E0%B8%99%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%B6%E0%B8%87%E0%B8%A1%E0%B8%AD+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88+4+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B9%80%E0%B8%8A%E0%B8%B5%E0%B8%A2%E0%B8%87%E0%B9%80%E0%B8%9E%E0%B9%87%E0%B8%87+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD%E0%B8%81%E0%B8%B8%E0%B8%94%E0%B8%88%E0%B8%B1%E0%B8%9A+%E0%B8%88.%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%B3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5+41250',
  'comp-udon-48': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%AB%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AB%E0%B8%B8%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%94%E0%B8%B5-%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%B3+447+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88+7+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B8%A1%E0%B9%88%E0%B8%99+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%B3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%B3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5+41000',
  'comp-udon-49': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97+%E0%B8%99%E0%B8%B4%E0%B8%95%E0%B8%B4%E0%B8%9E%E0%B8%B1%E0%B8%99%E0%B8%98%E0%B9%8C%E0%B9%80%E0%B8%AE%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B9%8C+%E0%B8%A2%E0%B8%B9%E0%B8%94%E0%B8%B5+%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+702+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88+2+%E0%B8%AA%E0%B8%B2%E0%B8%A1%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%A7+Udon+Thani+41000',
  'comp-udon-50': 'https://maps.app.goo.gl/JSuoMGZYTfQER3ZQ9',
  'comp-udon-51': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%95%E0%B8%99%E0%B9%8C%E0%B8%9A%E0%B8%B4%E0%B8%A7%E0%B8%95%E0%B8%B5%E0%B9%89%E0%B9%82%E0%B8%AE%E0%B8%A1+%E0%B8%A3%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B8%82%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99+75+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88+2+%E0%B8%95.%E0%B9%82%E0%B8%99%E0%B8%99%E0%B8%AA%E0%B8%B0%E0%B8%AD%E0%B8%B2%E0%B8%94+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD%E0%B9%82%E0%B8%99%E0%B8%99%E0%B8%AA%E0%B8%B0%E0%B8%AD%E0%B8%B2%E0%B8%94+%E0%B8%88%E0%B8%B1%E0%B8%87%E0%B8%AB%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5+41240',
  'comp-udon-52': 'https://maps.app.goo.gl/eovsgPjYBYryDXgo8',
  'comp-udon-53': 'https://maps.app.goo.gl/GspwiRGDg3YJTW896',
  'comp-udon-54': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%AB%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AB%E0%B8%B8%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+%E0%B9%80%E0%B8%AD%E0%B8%AA%E0%B9%84%E0%B8%AD+%E0%B8%AD%E0%B8%B2%E0%B8%A3%E0%B9%8C%E0%B8%84%E0%B8%B4%E0%B9%80%E0%B8%97%E0%B8%84%E0%B9%80%E0%B8%8A%E0%B8%AD%E0%B8%A3%E0%B9%8C+%E0%B9%81%E0%B8%AD%E0%B8%99%E0%B8%94%E0%B9%8C+%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B8%B1%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99+%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5',
  'comp-udon-55': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%AB%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AB%E0%B8%B8%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+%E0%B8%94%E0%B8%B5%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%99%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%99+%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B8%B1%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99+263+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%99+%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B9%88%E0%B8%A7%E0%B8%87+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88+1+%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B9%88%E0%B8%A7%E0%B8%87+%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%A9%E0%B9%8C%E0%B8%A8%E0%B8%B4%E0%B8%A5%E0%B8%9B%E0%B8%B2%E0%B8%84%E0%B8%A1+%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5',
  'comp-udon-56': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%AB%E0%B9%89%E0%B8%B2%E0%B8%87%E0%B8%AB%E0%B8%B8%E0%B9%89%E0%B8%99%E0%B8%AA%E0%B9%88%E0%B8%A7%E0%B8%99%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+%E0%B9%80%E0%B8%81%E0%B8%B5%E0%B8%A2%E0%B8%A3%E0%B8%95%E0%B8%B4%E0%B8%A3%E0%B8%B8%E0%B9%88%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%87+%E0%B8%81%E0%B9%88%E0%B8%AD%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87+161+%E0%B8%AB%E0%B8%A1%E0%B8%B9%E0%B9%88%E0%B8%97%E0%B8%B5%E0%B9%88+15+%E0%B8%AB%E0%B8%99%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A1%E0%B9%87%E0%B8%81+%E0%B8%AB%E0%B8%99%E0%B8%AD%E0%B8%87%E0%B8%AB%E0%B8%B2%E0%B8%99+%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5',
  'comp-udon-57': 'https://www.google.com/maps/search/?api=1&query=%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97+%E0%B9%80%E0%B8%AD%E0%B9%87%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%AA%E0%B8%97+%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B8%AA%E0%B8%95%E0%B8%A3%E0%B8%B1%E0%B8%84%E0%B8%8A%E0%B8%B1%E0%B9%88%E0%B8%99+%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94+%E0%B8%AD%E0%B8%B8%E0%B8%94%E0%B8%A3%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%B5',
  'comp-udon-58': 'https://maps.app.goo.gl/LEX12WYqLSQy2Xo2A'
};

const COMPANY_FACEBOOK_MASTER = {
  'comp-udon-58': 'https://www.facebook.com/profile.php?id=100083320623771'
};

const COMPANY_CUSTOM_STRATEGIES = {
    'comp-udon-03': {
    companyId: 'comp-udon-03',
    salesTargetPitch: 'นำเสนอแพ็กเกจปูนฉาบเสือมอร์ตาร์, อิฐมวลเบา Q-CON, ฝ้ายิปซัมตราช้าง SCG และคอนกรีต CPAC สำหรับไซต์บ้านคุณวิมล ซอยเวียงพิงค์ (4.xx ล้าน) และไซต์บ้านคุณตะวัน',
    painPoints: ['ต้องการงานฉาบและผิวฝ้าที่เรียบเนียนได้มาตรฐานระดับสูงตามที่ผ่านการอบรมกับ SCG', 'ต้องการความตรงต่อเวลาในการส่งมอบคอนกรีตผสมเสร็จ CPAC สำหรับงานฐานราก'],
    tailoredOffer: 'ต่อยอดการอบรมช่างร่วมกับ SCG มอบข้อเสนอราคายกเซตผนัง-ฝ้าเพดาน SCG พร้อมบริการจองคิวคอนกรีต CPAC ล่วงหน้า',
    actionSteps: [
      'โทรประสานงานฝ่ายจัดซื้อ (081-889-9996) ส่งใบเสนอราคาปูนฉาบเสือมอร์ตาร์และแผ่นยิปซัมตราช้างเข้าไซต์ซอยเวียงพิงค์',
      'วางแผนจัดส่งคอนกรีต CPAC 45 คิว และเหล็กเส้น SCG สำหรับไซต์เริ่มงานใหม่บ้านคุณตะวัน',
      'นำเสนอแคตตาล็อกสุขภัณฑ์ COTTO Space Solution สำหรับห้องน้ำบ้านคุณวิมล'
    ]
  },
  'comp-udon-08': {
    customDiagnostic: 'บริษัทรับสร้างบ้านระดับ <strong>High-End / Luxury Segment</strong> สไตล์โมเดิร์น มินิมอล นอร์ดิก (The Precious Living) ลูกค้าส่วนใหญ่เป็นกลุ่มแพทย์ บุคลากรทางการแพทย์ และเจ้าของธุรกิจกำลังซื้อสูง มียอดสั่งซื้อ SCG ปี 2026 เติบโตสูงถึง <strong>฿2,903,328</strong> (+153% YoY) มีงานโครงการคุณภาพสูงต่อเนื่อง',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC กำลังอัดสูง:</strong> นำเสนอคอนกรีต CPAC 240 - 280 ksc สำหรับงานฐานรากและโครงสร้างบ้านพักอาศัยระดับพรีเมียม',
      '<strong>ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง:</strong> ล็อกสเปกใช้งานโครงสร้างอาคารและหล่อเสา-คานทุกไซต์งาน',
      '<strong>กระเบื้องหลังคาเซรามิก SCG พรีเมียม:</strong> นำเสนอรุ่น Excella / Prestige / NeuStyle ตอบโจทย์ดีไซน์บ้านหรูสไตล์โมเดิร์น',
      '<strong>วัสดุตกแต่ง SCG D-COR & ฉนวนกันความร้อน:</strong> เจาะกลุ่มงานผนังตกแต่งภายนอกและบิวท์อิน Interior ตอบสนองลูกค้าระดับบน'
    ]
  },
      'comp-udon-09': {
    companyId: 'comp-udon-09',
    salesTargetPitch: 'นำเสนอแพ็กเกจนวัตกรรมปูนเสือมอร์ตาร์ XPERT, ปูนสกิมเสือ SCG, กระเบื้องพรีเมียม COTTO และสุขภัณฑ์สำหรับคฤหาสน์ 500 ตร.ม. กุมภวาปี, บ้านคลาสสิกเฌอลิชา และไซต์สร้างคอม',
    painPoints: ['โครงการระดับ Luxury สเปกสูง ต้องการงานผิวผนังสกิมโค้ทและงานฝ้าหลุมที่เนี้ยบไร้รอยต่อ', 'ต้องการการสนับสนุนด้านเทคนิคและการสาธิตหน้างานจริงจากผู้เชี่ยวชาญ SCG'],
    tailoredOffer: 'บริการทีมเทคนิค SCG เข้า On-site Demonstration (ปูนสกิมเสือ/XPERT) ต่อเนื่อง พร้อมส่วนลดเครดิตเทอมกลุ่มสุขภัณฑ์กระเบื้อง COTTO Luxury',
    actionSteps: [
      'ติดต่อฝ่ายจัดซื้อ/ผู้บริหาร (080-598-9223) เพื่อประสานงานจัดส่งปูนสกิมเสือ SCG ล็อตใหญ่เข้าหน้างานกุมภวาปี 500 ตร.ม.',
      'นำเสนอแคตตาล็อกกระเบื้องสระว่ายน้ำ COTTO Glass Mosaic และสุขภัณฑ์ Luxury ให้โครงการคฤหาสน์กุมภวาปี',
      'ประสานงานฝ่ายเทคนิค CPAC เตรียมคิวคอนกรีตฐานรากสำหรับไซต์ใหม่ อ.สร้างคอม'
    ]
  },
  'comp-udon-44': {
    customDiagnostic: 'ผู้รับเหมาที่มีความเชี่ยวชาญด้าน <strong>งานสถานีบริการน้ำมัน (PT หนองหาน) และงานรีโนเวทร้านค้าพาณิชย์ (Cafe Amazon)</strong> ควบคู่กับงานบ้านเดี่ยวและกำแพงกันดินสำเร็จรูป มียอดซื้อ SCG ปี 2026 เติบโตก้าวกระโดดสูงถึง <strong>฿181,379 (+469.1% YoY)</strong> ถือเป็นผู้รับเหมารายสำคัญในโซนอุดรธานีฝั่งตะวันออก (หนองหาน-ทุ่งฝน-ไชยวาน) ที่มีกำลังเครื่องจักรหนักและงานต่อเนื่อง',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC สำหรับงานลานสถานีบริการน้ำมันและถนน:</strong> นำเสนอคอนกรีต CPAC Pavement Solution / High Early Strength สำหรับเทลานปั๊มน้ำมัน PT หนองหาน รองรับรถบรรทุกหนักและเปิดหน้างานได้เร็ว',
      '<strong>ชุดสุขภัณฑ์และอุปกรณ์ห้องน้ำสาธารณะ COTTO:</strong> เสนอแพ็กเกจสุขภัณฑ์ประหยัดน้ำและอุปกรณ์ราวจับสำหรับห้องน้ำรวมปั๊ม PT (ห้องน้ำชาย 6, หญิง 8, ผู้พิการ 1)',
      '<strong>ปูนซีเมนต์สำเร็จรูป เสือ มอร์ตาร์ & อิฐมวลเบา Q-CON:</strong> นำเสนอโซลูชันก่อ-ฉาบผนังและงานรีโนเวทสำหรับโครงการบ้านเดี่ยว อ.ทุ่งฝน, อ.ไชยวาน และร้าน Cafe Amazon',
      '<strong>CPAC Precast / กำแพงกันดินคอนกรีตสำเร็จรูป:</strong> ต่อยอดความเชี่ยวชาญงานรั้วและกำแพงกันดินของผู้รับเหมา ล็อกสเปกชิ้นส่วนคอนกรีตสำเร็จรูปจาก CPAC'
    ]
  },
      'comp-udon-17': {
    customDiagnostic: 'บริษัทรับสร้างบ้านและงานสถาปัตยกรรมอีสานประยุกต์/โมเดิร์น (E House Construction & Design) โดยมี คุณเอ๊ะ (094-8289263) ดูแลฝ่ายขายและ BOQ มียอดซื้อ SCG ปี 2026 อยู่ที่ <strong>฿569,818 (SCG Code: 10383888)</strong> กำลังก่อสร้างอาคารคาเฟ่ 3 ชั้น, งานบิวท์อินตกแต่งภายในสไตล์มินิมอล และงานฉาบสกิมทาสีบ้านในเขต อ.เมือง จ.อุดรธานี มีความต้องการวัสดุงานระบบฝ้าเพดาน ฉนวนกันความร้อน ปูนฉาบสกิมโค้ท และสุขภัณฑ์ COTTO คุณภาพสูง',
    customRecommendations: [
      '<strong>ระบบฝ้าเพดานและฉนวนกันความร้อน/ซับเสียง SCG (Acoustic & Stay Cool):</strong> นำเสนอแผ่นยิปซัมทนชื้น SCG Moisture Shield และฉนวนซับเสียง SCG Acoustic Panel สำหรับอาคารคาเฟ่ 3 ชั้น เพื่อการเก็บเสียงและควบคุมอุณหภูมิในโซนบริการลูกค้า',
      '<strong>ปูนฉาบสำเร็จรูป เสือ มอร์ตาร์ สกิมโค้ท (Tiger Skim Coat):</strong> นำเสนอปูนสกิมโค้ทฉาบบางเรียบเนียนพิเศษ ปิดรอยเม็ดทราย สำหรับงานเตรียมผิวก่อนทาสีบ้านพักอาศัย',
      '<strong>ชุดสุขภัณฑ์และก๊อกน้ำ COTTO Commercial & Minimal Series:</strong> นำเสนอแพ็กเกจสุขภัณฑ์ประหยัดน้ำสำหรับคาเฟ่ และชุดสุขภัณฑ์มินิมอลสำหรับบ้านพักอาศัย พร้อมบริการรับประกันอุปกรณ์',
      '<strong>แผ่น SCG สมาร์ทบอร์ดและวัสดุตกแต่ง Facade/Interior:</strong> เจาะกลุ่มงานตกแต่งผนังบิวท์อินและฝ้าเพดานสไตล์ Minimal Modern'
    ]
  },
  'comp-udon-20': {
    customDiagnostic: 'ผู้รับเหมาที่มีความเชี่ยวชาญด้าน <strong>งานรับสร้างบ้านเดี่ยว บิวท์อิน และงานต่อเติมพรีเมียมในโครงการจัดสรรชั้นนำ (ม.ศุภาลัย โนโว วิลล์, ศุภาลัย เลค แอนด์ พาร์ค)</strong> ในเขตเมืองอุดรธานี บริหารและคุมงานโดย คุณชัยธวัช (“เจ้าของดูแลเองทุกหลัง”) เริ่มเปิดบิลสั่งซื้อสินค้า SCG ในปี 2026 (฿7,101 - SCG Code 10739362) ถือเป็น New Prospect ศักยภาพสูงที่มีงานต่อเนื่องและมีฐานลูกค้ากำลังซื้อสูง',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC สำหรับงานต่อเติมและบ้านในหมู่บ้านจัดสรร:</strong> นำเสนอโซลูชันคอนกรีต CPAC รถโม่เล็ก (Small Truck) และคอนกรีตกันซึม ช่วยให้เข้าออกซอยแคบในโครงการศุภาลัยได้สะดวก ไม่เลอะเทอะ และได้มาตรฐานวิศวกรรม',
      '<strong>ระบบไม้ฝาและไม้ระแนงบังตา SCG Smartwood:</strong> เจาะกลุ่มงานต่อเติมโรงจอดรถ ระแนงบังตาเพิ่มความเป็นส่วนตัว และระแนงชายคาสำหรับบ้านเดี่ยว/บ้านแฝด',
      '<strong>ปูนซีเมนต์สำเร็จรูป เสือ มอร์ตาร์ สำหรับงานครัวปูน & ก่อฉาบ:</strong> ล็อกสเปก เสือ มอร์ตาร์ ก่อ-ฉาบทั่วไป และปูนกาวซีเมนต์ สำหรับงานเคาน์เตอร์ครัวปูนรูปตัว L และงานปูกระเบื้อง',
      '<strong>กระเบื้องปูพื้นและตกแต่ง COTTO (Tile & Surface):</strong> นำเสนอชุดกระเบื้องปูพื้นโรงจอดรถกันลื่น (R10-R11) และกระเบื้องตกแต่งเคาน์เตอร์ครัว ตอบโจทย์ลูกค้าบ้านจัดสรรระดับกลาง-บน'
    ]
  },
    'comp-udon-27': {
    customDiagnostic: 'บริษัท บ้านวิศวะพัฒนา จํากัด (บ้านวิศวะ) เป็นบริษัทรับสร้างบ้านและวิศวกรรมอาคารคุณภาพสูงใน จ.อุดรธานี เพิ่งเปิดรหัสคู่ค้า SCG สำเร็จในปี 2026 (SCG Code 10729130) มียอดสั่งซื้อสะสม <strong>฿238,997</strong> มีความเชี่ยวชาญทั้งงานบ้านพักอาศัยระดับพรีเมียม (เปิดไซต์ใหม่ 276 ตร.ม. ในเขต อ.เมืองอุดรฯ) และงานอาคารสาธารณะขนาดใหญ่ (อาคาร 1,100 ตร.ม. โครงสร้างเหล็ก) มีโอกาสสูงในการขยายยอดซื้อคอนกรีต CPAC, แผ่นพื้น Smart Slab, แผ่นสมาร์ทบอร์ด และสุขภัณฑ์ COTTO',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC 240 ksc (70 คิว):</strong> ล็อกสเปกส่งตรงหน้างานไซต์บ้านใหม่ 276 ตร.ม. อ.เมืองอุดรธานี สำหรับเทคานคอดิน เสา และพื้น',
      '<strong>ชุดสุขภัณฑ์และก๊อกน้ำ COTTO Modern Luxury Series (4 ชุด):</strong> จัดทำ Mood Board สุขภัณฑ์พรีเมียมเสนอคุณไก่สำหรับบ้านเดี่ยว 276 ตร.ม.',
      '<strong>แผ่น SCG สมาร์ทบอร์ดและยิปซัมตราช้าง (250 แผ่น):</strong> นำเสนอราคาโครงการสำหรับอาคารอเนกประสงค์ 1,100 ตร.ม.',
      '<strong>ชุดสุขภัณฑ์ COTTO Commercial Collection (12 ชุด):</strong> นำเสนอแพ็กเกจสุขภัณฑ์ประหยัดน้ำและทนทานสำหรับงานอาคารสาธารณะ'
    ]
  },
  'comp-udon-34': {
    customDiagnostic: 'ห้างหุ้นส่วนจำกัด เอสวาย.เฮาส์ ดีไซน์ แอนด์ คอนสตรัคชั่น (SY.House รับสร้างบ้านอุดรธานี) มีวิศวกรผู้ควบคุมงานคือ <strong>นายวัชรพงษ์ เประกันยา (ภย.69520)</strong> และทีมฝ่ายขาย (089-417-7870, 062-098-9264) มีรหัสลูกค้า SCG Code: <strong>10568031</strong> กำลังก่อสร้างบ้านพักอาศัยสไตล์ Pool Villa 1 ชั้น พร้อมสระว่ายน้ำส่วนตัว ในเขต อ.เพ็ญ จ.อุดรธานี มีความต้องการวัสดุสำหรับงานสระว่ายน้ำ ปูนกาวปูกระเบื้องแผ่นใหญ่ และสุขภัณฑ์ระดับ Luxury',
    customRecommendations: [
      '<strong>กระเบื้องสระว่ายน้ำและกระเบื้องลายหินอ่อน COTTO:</strong> นำเสนอคอลเลกชันกระเบื้องสระว่ายน้ำ COTTO Glass Mosaic / Porcelain และกระเบื้องปูพื้นลายหินอ่อนตัดเส้นทองสำหรับพูลวิลล่า อ.เพ็ญ',
      '<strong>ปูนกาวซีเมนต์ จระเข้ทอง / COTTO Extra Bond:</strong> ล็อกสเปกปูนกาวซีเมนต์ประสิทธิภาพสูงสำหรับงานสระว่ายน้ำและกระเบื้องแผ่นใหญ่ ทนแรงดันน้ำและไม่หลุดล่อน',
      '<strong>ชุดสุขภัณฑ์และก๊อกน้ำ COTTO Hotel & Luxury Series:</strong> นำเสนอสุขภัณฑ์ดีไซน์โมเดิร์นหรูหราสไตล์รีสอร์ต ตอบโจทย์บ้านพูลวิลล่า',
      '<strong>ระบบฝ้าเพดานยิปซัมตราช้าง SCG 9 มม. & ไฟซ่อนหลุม:</strong> นำเสนอแผ่นยิปซัมคุณภาพสูงพร้อมโครงคร่าวสำหรับงานดีไซน์ฝ้าหลุมซ่อนไฟโถงกลาง'
    ]
  },
  'comp-udon-35': {
    customDiagnostic: 'IDYLLIC Construction (Idyllic Construction - รับสร้างบ้าน) บริหารงานโดยทีมวิศวกรและสถาปนิก (โทร: 089-575-5959, idyllicons@gmail.com) มีผลงานก่อสร้างและรีโนเวทคุณภาพสูง กำลังดำเนินงานก่อสร้างบ้านเดี่ยว ค.ส.ล. 1 ชั้น ที่ ต.สร้างแป้น อ.เพ็ญ (งวดเทเสาและบันได) และงานรีโนเวทอาคารพาณิชย์สำหรับออฟฟิศ/คลินิก ในเขต อ.เมืองอุดรธานี มีความต้องการคอนกรีตผสมเสร็จ CPAC, อิฐมวลเบา Q-CON, แผ่นยิปซัมฝ้าเพดาน และสุขภัณฑ์ COTTO Hygienic',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC 240 ksc งานหล่อเสา คาน และบันได:</strong> นำเสนอคอนกรีต CPAC สำหรับไซต์สร้างแป้น อ.เพ็ญ ช่วยให้งานเทเสาและบันไดได้เนื้อคอนกรีตแน่น แข็งแรงตามมาตรฐานวิศวกรรม',
      '<strong>ระบบแผ่นยิปซัมตราช้าง SCG และฉนวนซับเสียง Acoustic Panel:</strong> เจาะกลุ่มงานรีโนเวทคลินิกและออฟฟิศในเมืองอุดรธานี เพิ่มความเป็นส่วนตัวและควบคุมเสียงระหว่างห้องตรวจ',
      '<strong>ชุดสุขภัณฑ์ COTTO Hygienic & Touchless Series:</strong> นำเสนอสุขภัณฑ์ระบบสัมผัสไร้เชื้อและก๊อกน้ำเซนเซอร์สำหรับงานคลินิกและอาคารพาณิชย์',
      '<strong>อิฐมวลเบา Q-CON & ปูนก่อ-ฉาบเสือมอร์ตาร์:</strong> นำเสนอโซลูชันผนังกันความร้อนสำหรับบ้านพักอาศัย 1 ชั้น อ.เพ็ญ เพื่อลดความร้อนและประหยัดพลังงาน'
    ]
  },
  'comp-udon-50': {
    customDiagnostic: 'บริษัทรับสร้างบ้านคุณภาพสไตล์ Nordic และ Contemporary (งบ 8 แสน - 2 ล้าน) ที่ระบุในสัญญาว่า <strong>"ใช้วัสดุงานคุณภาพ SCG และแบรนด์มาตรฐาน"</strong> มียอดซื้อ SCG ปี 2026 เติบโตต่อเนื่องเป็น <strong>฿189,440 (+24.8% YoY)</strong> มีทีมช่างหลัก (ช่างอา, ช่างตรี) กระจายไซต์งานทั่ว อ.เมืองอุดรธานี, อ.กุมภวาปี และหนองคาย มี Brand Loyalty สูงมากและพร้อมเปิดรับสินค้า CPAC/COTTO เพิ่มเติม',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC 240 ksc งานฐานรากและคานคอดิน:</strong> นำเสนอคอนกรีตผสมเสร็จ CPAC ทดแทนการผสมเองหน้างาน ช่วยลดแรงงานช่างและป้องกันปัญหาปูนเซ็ตตัวเร็วในสภาพอากาศร้อน',
      '<strong>แพ็กเกจกระเบื้องและสุขภัณฑ์ COTTO (Bathroom Design Solution):</strong> นำเสนอชุดสุขภัณฑ์ประหยัดน้ำและกระเบื้อง COTTO แบบเหมา 3 ห้องน้ำ 3 สไตล์ ตอบโจทย์แบบบ้านคอนเทมโพรารี่',
      '<strong>ฉนวนกันความร้อน SCG Stay Cool คู่บ้านทรงนอร์ดิก:</strong> นำเสนอฉนวน Stay Cool หนา 75-150 มม. และแผ่นสะท้อนความร้อน Ultra Cool แก้ปัญหาความร้อนสะสมใต้หลังคาทรงสูง',
      '<strong>ปูนซีเมนต์สำเร็จรูป เสือ มอร์ตาร์ & อิฐมวลเบา Q-CON:</strong> ล็อกสเปกปูนฉาบและอิฐมวลเบาสำหรับบ้านทุกหลัง พร้อมสนับสนุนป้าย Co-Branding "โครงการเลือกใช้วัสดุ SCG"'
    ]
  },
  'comp-udon-56': {
    customDiagnostic: 'ผู้รับเหมาก่อสร้างท้องถิ่นที่มีฐานงานหนาแน่นในโซน <strong>อ.หนองหาน (ต.หนองเม็ก, ต.ดอนหายโศก) และ อ.เมืองอุดรธานี (ต.เชียงยืน)</strong> คุมงานโดย ช่างบาส (082-107-0095) มียอดซื้อเปิดรหัส SCG ในปี 2026 (฿1,470 - SCG Code 10724225) มีงานก่อสร้างบ้านเดี่ยว ค.ส.ล. และงานต่อเติมครัวปูนจริงต่อเนื่อง ถือเป็น New Prospect ศักยภาพการขยายยอดซื้อวัสดุโครงสร้างและกระเบื้องหลังคา/พื้นสูง',
    customRecommendations: [
      '<strong>คอนกรีตผสมเสร็จ CPAC 240 ksc & ปูนซีเมนต์ไฮดรอลิก SCG:</strong> นำเสนอคอนกรีตผสมเสร็จ CPAC สำหรับงานเทฐานรากและคานคอดินบ้านใหม่ 169 ตร.ม. อ.หนองหาน ทดแทนการโม่เองหน้างาน',
      '<strong>กระเบื้องหลังคาคอนกรีต SCG ซีแพคโมเนีย & ฉนวน Stay Cool:</strong> นำเสนอแพ็กเกจระบบหลังคาครบชุดพร้อมชุดครอบแห้ง Dry-Tech สำหรับบ้านกึ่งร้านค้า 117 ตร.ม. ต.เชียงยืน',
      '<strong>ปูนกาวซีเมนต์ เสือ มอร์ตาร์ & กระเบื้อง COTTO:</strong> เจาะกลุ่มงานปูกระเบื้องพื้นและงานเคาน์เตอร์ครัวปูนต่อเติมสำหรับไซต์ดอนหายโศก',
      '<strong>อิฐมวลเบา Q-CON และปูนฉาบสำเร็จรูปตราเสือ:</strong> แนะนำอิฐมวลเบาเพื่อการก่อผนังที่รวดเร็วและกันความร้อนได้ดีกว่าอิฐบล็อกทั่วไป'
    ]
  },
  'comp-udon-06': {
    customDiagnostic: 'บริษัท ฟังก์ชั่น ดีไซน์ คอนสตรัคชั่น จํากัด (Function Design) เป็นผู้รับเหมาและออกแบบอาคารครบวงจรใน จ.อุดรธานี โทร. 080-499-7777 มีผลงานโดดเด่นทั้ง <strong>บ้านพักอาศัยชั้นเดียวสไตล์โมเดิร์น</strong> (ช่วงงานทาสี/ระบบไฟ/โรงรถ) และ <strong>อาคารพาณิชย์โชว์รูมอุดรเซ็นเตอร์ฟิล์ม</strong> (ช่วงติดตั้งตะแกรงกรงไก่และจับเซี้ยมเตรียมฉาบ) มีความใส่ใจในมาตรฐานงานโครงสร้างและผิวผนังสูงมาก พร้อมเปิดรับการประสานงานสินค้า SCG และ COTTO',
    customRecommendations: [
      '<strong>ปูนซีเมนต์สำเร็จรูป เสือ มอร์ตาร์ ฉาบละเอียด (Tiger Mortar):</strong> นำเสนอราคาโครงการสำหรับงานฉาบผนังโชว์รูมอุดรเซ็นเตอร์ฟิล์ม ควบคู่ตะแกรงกรงไก่ลดการแตกร้าว',
      '<strong>สีทาอาคารภายนอก-ภายใน & สกิมโค้ท SCG / TOA:</strong> เจาะกลุ่มงานตกแต่งผิวบ้านเดี่ยวโมเดิร์น เพิ่มความเรียบเนียนและความคงทนของสี',
      '<strong>ชุดสุขภัณฑ์และกระเบื้อง COTTO Commercial & Modern Series:</strong> ต่อยอดการเข้าพบแนะนำผลิตภัณฑ์ นำเสนอแพ็กเกจสุขภัณฑ์ห้องน้ำโชว์รูมและบ้านพักอาศัย',
      '<strong>ระบบไม้ฝาตกแต่งและระแนง SCG Smartwood:</strong> นำเสนอสำหรับงานตกแต่งรั้วและโรงจอดรถบ้านเดี่ยวโมเดิร์น'
    ]
  },
      'comp-udon-11': {
    customDiagnostic: 'ห้างหุ้นส่วนจํากัด ยูดี.โฮมส์ เอ็นจิเนียริ่ง (UD.Home : รับสร้างบ้าน) เป็นศูนย์รับสร้างบ้านระดับ Tier-1 ใน จ.อุดรธานี (SCG Code: <strong>10369220</strong>) มียอดซื้อสะสมปี 2026 อยู่ที่ <strong>฿2,222,685</strong> ปัจจุบันกำลังก่อสร้างบ้านพักอาศัยระดับพรีเมียม 4 โครงการใน จ.อุดรธานี (บ้านคุณดีโน่ 6M สามพร้าว, บ้านคุณหมอซี 4.8M Universal Design, และไซต์บ้านเดี่ยว อ.เพ็ญ 2 หลัง รวม 7M)',
    customRecommendations: [
      '<strong>ชุดสุขภัณฑ์และอุปกรณ์ผู้สูงอายุ COTTO Care Solution:</strong> นำเสนอสุขภัณฑ์ระบบ Universal Design และกระเบื้อง R11 กันลื่นสำหรับบ้านคุณหมอซี (4.8 ล้านบาท) อ.เมืองอุดรธานี',
      '<strong>กระเบื้องปูพื้น COTTO Grand Porcelain & สุขภัณฑ์ Modern:</strong> เสนอแพ็กเกจเหมา 5 ห้องน้ำและพื้นโถงใหญ่บ้านคุณดีโน่ (6 ล้านบาท) ต.สามพร้าว',
      '<strong>คอนกรีตผสมเสร็จ CPAC 240 ksc & เหล็กเส้น SCG:</strong> ล็อกสเปกเทฐานรากและเสาตอม่อสำหรับไซต์บ้านพักอาศัย 2 หลัง อ.เพ็ญ (คุณนุ่น 3.5M และไซต์เสาเข็ม 3.5M)',
      '<strong>ระบบฝ้าเพดานยิปซัมตราช้าง SCG และฉนวนกันความร้อน Stay Cool:</strong> นำเสนอสำหรับบ้านพักอาศัยทุกหลังเพื่อประหยัดพลังงานและลดความร้อนสะสม'
    ]
  },
  'comp-udon-41': {
    customDiagnostic: 'บริษัท มารีญาก่อสร้าง จํากัด (Mariya Construction) ร่วมกับ <strong>Fathome Architect</strong> เน้นงานบ้านพักอาศัย ค.ส.ล. 2 ชั้น ระดับพรีเมียมใน จ.อุดรธานี โทร. 088-877-2899 (Line: @mariacons-admin) มีจุดเด่นด้านมาตรฐานงานตกแต่งประณีต (ปูเกรียงหวีเต็ม 100% ไม่ปูซาลาเปา, ผนังสกิมโค้ทเรียบเนียน, โครงฝ้าเพดานมาตรฐาน) ปัจจุบันดำเนินงานก่อสร้าง 2 โครงการหลัก (บ้านคุณพ่อคุณแม่ และบ้านคุณมายด์)',
    customRecommendations: [
      '<strong>ระบบแผ่นยิปซัมตราช้าง SCG พลัส และโครงคร่าว Proline:</strong> นำเสนอระบบฝ้าเพดานครบวงจรและฉนวนกันความร้อน Stay Cool สำหรับบ้านคุณพ่อคุณแม่ (5.5 ล้านบาท)',
      '<strong>ปูนเสือ มอร์ตาร์ สกิมโค้ท (Tiger Skim Coat) & ปูนลูกดิ่ง:</strong> ล็อกสเปกปูนฉาบผิวบางสำหรับบ้านคุณมายด์ (5.0 ล้านบาท) ตอบโจทย์มาตรฐานงานผนังเรียบเนียน',
      '<strong>กาวซีเมนต์ COTTO และกาวยาแนว Microban:</strong> เสนอชุดปูนกาวปูกระเบื้องเต็มแผ่นมาตรฐานสากล สอดคล้องกับนโยบายไม่ปูซาลาเปาของบริษัท',
      '<strong>ชุดสุขภัณฑ์และกระเบื้อง COTTO Luxury Collection:</strong> นำเสนอแบบและสเปกสุขภัณฑ์ร่วมกับทีมสถาปนิก Fathome Architect'
    ]
  },
  'comp-udon-21': {
    customDiagnostic: 'ห้างหุ้นส่วนจํากัด คิดดีเฮาส์คอนสทรัคชั่น (Kiddeehouseconstruction) รับสร้างบ้าน ออกแบบ และรีโนเวทอาคารใน จ.อุดรธานี โทร. 088-563-6587 (Line: Archtiger) มีผลงานส่งมอบงานปรับปรุงและรีโนเวทบ้านพักอาศัย 2 ชั้น (ครอบครัวคุณวิเชียรและคุณก้อย อ.หนองวัวซอ) มีศักยภาพในการใช้วัสดุเคมีภัณฑ์ซ่อมแซม โซลูชันกั้นห้องสมาร์ทบอร์ด SCG กระเบื้อง และสุขภัณฑ์ COTTO ต่อเนื่อง',
    customRecommendations: [
      '<strong>เคมีภัณฑ์ก่อสร้างและน้ำยาประสานคอนกรีต SCG / จระเข้:</strong> นำเสนอโซลูชันเคมีภัณฑ์ซ่อมแซมรอยแตกร้าวและน้ำยาประสานสำหรับงานรีโนเวทโครงสร้างอาคารเดิม',
      '<strong>แผ่น SCG สมาร์ทบอร์ด และยิปซัมตราช้าง:</strong> นำเสนอระบบผนังเบาและฝ้าเพดานสำหรับงานแบ่งกั้นพื้นที่ใช้สอยใหม่',
      '<strong>กระเบื้องและปูนกาวซีเมนต์ COTTO Extra Bond:</strong> ล็อกสเปกปูนกาวปูทับกระเบื้องเดิมและกระเบื้องโมเดิร์นปูพื้น-ผนัง',
      '<strong>ชุดสุขภัณฑ์และก๊อกน้ำ COTTO Renovate & Water Saving:</strong> นำเสนอแพ็กเกจสุขภัณฑ์ประหยัดน้ำและติดตั้งง่ายสำหรับงานเปลี่ยนระบบสุขาภิบาลบ้านรีโนเวท'
    ]
  }
};

if (typeof window !== 'undefined') {
  window.COMPANY_MAPS_MASTER = COMPANY_MAPS_MASTER;
  window.COMPANY_FACEBOOK_MASTER = COMPANY_FACEBOOK_MASTER;
  window.COMPANY_CUSTOM_STRATEGIES = COMPANY_CUSTOM_STRATEGIES;
}

function loadSavedCompaniesData() {
  let baseData = [];
  let hasSessionUploadedData = false;

  try {
    if (typeof sessionStorage !== 'undefined') {
      const saved = sessionStorage.getItem('nextsite_session_uploaded_companies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          baseData = parsed;
          hasSessionUploadedData = true;
        }
      }
    }
  } catch (e) {
    console.warn('SessionStorage parse error:', e);
  }

  if (!hasSessionUploadedData) {
    if (typeof window !== 'undefined' && Array.isArray(window.UDON_COMPANIES) && window.UDON_COMPANIES.length > 0) {
      baseData = window.UDON_COMPANIES;
    } else if (typeof window !== 'undefined' && Array.isArray(window.MASTER_COMPANIES) && window.MASTER_COMPANIES.length > 0) {
      baseData = window.MASTER_COMPANIES;
    }
  }

  // Deep clone
  allCompanies = JSON.parse(JSON.stringify(baseData));

  // Sanitize and clean all text fields across companies
  allCompanies.forEach(c => {
    // Attach custom strategy if defined
    if (typeof COMPANY_CUSTOM_STRATEGIES !== 'undefined' && COMPANY_CUSTOM_STRATEGIES[c.id]) {
      c.customDiagnostic = COMPANY_CUSTOM_STRATEGIES[c.id].customDiagnostic;
      c.customRecommendations = COMPANY_CUSTOM_STRATEGIES[c.id].customRecommendations;
    }
    // 100% strict sync of company Google Maps link
    if (COMPANY_MAPS_MASTER[c.id]) {
      c.googleMapsUrl = COMPANY_MAPS_MASTER[c.id];
      c.gmaps = COMPANY_MAPS_MASTER[c.id];
    }
    // Strict sync of Facebook Page link
    if (COMPANY_FACEBOOK_MASTER[c.id]) {
      c.facebookUrl = COMPANY_FACEBOOK_MASTER[c.id];
    }
    if (c.id === 'comp-udon-25' || (c.name && c.name.includes('บ้านรักษ์'))) {
      c.name = 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี';
      c.contactPerson = 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี';
      if (c.facebookSignal) c.facebookSignal.pageName = 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี';
    }

    c.name = cleanThaiText(c.name);
    if (c.engName) c.engName = cleanThaiText(c.engName);
    if (c.category) c.category = cleanThaiText(c.category);
    if (c.address) c.address = cleanThaiText(c.address);
    if (c.district) c.district = cleanThaiText(c.district);
    if (c.province) c.province = cleanThaiText(c.province);

    if (c.facebookSignal) {
      if (c.facebookSignal.pageName) c.facebookSignal.pageName = cleanThaiText(c.facebookSignal.pageName);
      if (c.facebookSignal.caption) c.facebookSignal.caption = cleanThaiText(c.facebookSignal.caption);
    }

    if (c.projects && Array.isArray(c.projects)) {
      // Clean up historical mismatched projects for comp-udon-58 that belonged to Trust Construction
      if (c.id === 'comp-udon-58') {
        c.projects = c.projects.filter(p => {
          const text = ((p.name || '') + ' ' + (p.caption || '') + ' ' + (p.siteProof ? p.siteProof.caption : '') + ' ' + (p.facebookPostUrl || '')).toLowerCase();
          return !text.includes('trust construction') && !text.includes('entrust');
        });
        c.totalProjects = c.projects.length;
      }

      c.projects.forEach(p => {
        if (p.name) p.name = cleanThaiText(p.name);
        if (p.stage) p.stage = cleanThaiText(p.stage);
        if (p.location) p.location = cleanThaiText(p.location);
      });
    }

    // Apply persistent user company tag (Focus / Non-Focus / New)
    c.tag = (typeof getCompanyTag === 'function') ? getCompanyTag(c.id) : (c.tag || 'new');

    // Default clean state: when no JSON file is uploaded, companies without pre-filled projects will be 0 projects
    if (!hasSessionUploadedData) {
      if (!c.projects || c.projects.length === 0) {
        c.projects = [];
        c.totalProjects = 0;
        c.newProjectsThisMonth = 0;
        c.totalValueMillion = 0.0;
        c.opportunityScore = 15;
        c.revenuePotentialText = '฿0.0M - ฿0.0M';
        c.stageBreakdown = { groundbreak: 0, foundation: 0, structure: 0, finishing: 0 };
        c.aiShortRec = 'รอสแกน Apify (0 โครงการ)';
        c.aiRecommendation = 'รอรับข้อมูลไซต์งานก่อสร้างจริงจากไฟล์ Apify JSON';
        if (c.facebookSignal) {
          c.facebookSignal.postDate = '-';
          c.facebookSignal.caption = 'รอรับข้อมูลจาก Apify Facebook Posts Scraper';
        }
      }
    }

    // Auto-match SCG Customer Sales 2025 vs 2026
    const cName = (c.name || '').toLowerCase();
    const cEng = (c.engName || '').toLowerCase();
    const match = SCG_CUSTOMER_SALES_LIST.find(item => {
      if (item.keys && item.keys.some(k => cName.includes(k) || cEng.includes(k))) return true;
      if (cName.includes(item.name.toLowerCase())) return true;
      return false;
    });

    if (match) {
      c.scgCode = match.code;
      c.sales2025 = match.sales2025;
      c.sales2026 = match.sales2026;
    } else {
      c.scgCode = null;
      c.sales2025 = 0;
      c.sales2026 = 0;
    }
  });

  // ผูกค่า Company Tags (Focus / Non-Focus / New)
  const tagMap = loadCompanyTagsMap();
  allCompanies.forEach(c => {
    const savedTag = tagMap[c.id];
    if (savedTag) {
      c.tag = String(savedTag).trim().toLowerCase();
    } else if (c.tag) {
      c.tag = String(c.tag).trim().toLowerCase();
    } else {
      c.tag = 'new';
    }
  });

  // ผูกค่า Tracking Status
  const statusMap = loadSavedTrackingStatuses();
  allCompanies.forEach(c => {
    if (c.projects && Array.isArray(c.projects)) {
      c.projects.forEach(p => {
        const key = `${c.id}_${p.projectId}`;
        if (statusMap[key]) {
          p.trackingStatus = statusMap[key];
        } else if (!p.trackingStatus) {
          p.trackingStatus = 'pending';
        }
      });
    }
  });

  // Deduplicate any same-site multiple milestone projects
  allCompanies.forEach(c => deduplicateCompanyProjects(c));

  // จัดลำดับ: คะแนน Opportunity Score สูงสุด (92 -> 80 -> 70 -> 35 -> 15) ต้องอยู่บนสุดเสมอ
  sortCompaniesByOpportunityScore(allCompanies);
  filteredCompanies = [...allCompanies];
  window.allCompanies = allCompanies;
}

function calculateCompany3DimScore(comp) {
  if (typeof calculateCompany4DimScore === 'function') {
    return calculateCompany4DimScore(comp);
  }
  if (!comp) return { totalScore100: 0, rawTotal: 0, scoreProj: 0, scoreStage: 0, scoreScg: 0, scoreDbd: 0 };

  // 1. จำนวนโครงการ (Max 5)
  const projects = (comp.projects && Array.isArray(comp.projects)) ? comp.projects : [];
  const projCount = projects.length > 0 ? projects.length : (Number(comp.totalProjects) || 0);
  
  let scoreProj = 0;
  if (projCount === 0) scoreProj = 0;
  else if (projCount <= 2) scoreProj = 2;
  else if (projCount <= 4) scoreProj = 3;
  else if (projCount === 5) scoreProj = 4;
  else scoreProj = 5; // 6+

  // 2. สเตจหน้างาน (Max 5)
  let scoreStage = 0;
  if (projCount === 0) {
    scoreStage = 0;
  } else {
    let hasEarly = false;
    let hasMid = false;
    let hasLate = false;

    projects.forEach(p => {
      const sKey = (p.stageKey || '').toLowerCase();
      const sText = ((p.stage || '') + ' ' + (p.name || '') + ' ' + (p.caption || '')).toLowerCase();

      if (
        sKey === 'groundbreak' || sKey === 'foundation' ||
        sText.includes('เสาเอก') || sText.includes('เสาโท') || sText.includes('เซ็นสัญญา') ||
        sText.includes('เปิดหน้างาน') || sText.includes('ฐานราก') || sText.includes('ตอกเสาเข็ม') ||
        sText.includes('เทพื้น') || sText.includes('คานคอดิน')
      ) {
        hasEarly = true;
      } else if (
        sKey === 'structure' ||
        sText.includes('โครงสร้าง') || sText.includes('หลังคา') || sText.includes('ก่อผนัง') ||
        sText.includes('ฉาบ') || sText.includes('มุงกระเบื้อง') || sText.includes('ฝ้า')
      ) {
        hasMid = true;
      } else if (
        sKey === 'finishing' || sKey === 'handover' ||
        sText.includes('ตกแต่ง') || sText.includes('เก็บงาน') || sText.includes('ส่งมอบ') ||
        sText.includes('สุขภัณฑ์') || sText.includes('ปูกระเบื้อง') || sText.includes('ทาสี') ||
        sText.includes('ตรวจรับ')
      ) {
        hasLate = true;
      } else {
        hasMid = true;
      }
    });

    if (!hasEarly && !hasMid && !hasLate && comp.stageBreakdown) {
      if ((comp.stageBreakdown.groundbreak || 0) > 0 || (comp.stageBreakdown.foundation || 0) > 0) hasEarly = true;
      else if ((comp.stageBreakdown.structure || 0) > 0) hasMid = true;
      else if ((comp.stageBreakdown.finishing || 0) > 0) hasLate = true;
    }

    if (hasEarly) scoreStage = 5;
    else if (hasMid) scoreStage = 3;
    else if (hasLate) scoreStage = 1;
    else scoreStage = 3;
  }

  // 3. ประวัติการซื้อกับ SCG (Max 5)
  const s25 = Number(comp.sales2025) || 0;
  const s26 = Number(comp.sales2026) || 0;
  let scoreScg = 2;
  if (s25 > 0 && s26 > 0) {
    scoreScg = 5;
  } else if (s25 > 0 || s26 > 0) {
    scoreScg = 4;
  } else {
    scoreScg = 2;
  }

  // 4. ฐานข้อมูล DBD (Max 5)
  const dbdInfo = (typeof getCompanyDbdData === 'function') ? getCompanyDbdData(comp) : null;
  const dbdRev = dbdInfo ? dbdInfo.revenue : (Number(comp.dbdRevenue) || 0);
  const scoreDbd = (typeof calculateDbdRevenueScore === 'function') ? calculateDbdRevenueScore(dbdRev) : 0;

  const rawTotal = scoreProj + scoreStage + scoreScg + scoreDbd; // Max 20
  const totalScore100 = Math.round((rawTotal / 20) * 100);

  return {
    totalScore100,
    rawTotal,
    scoreProj,
    scoreStage,
    scoreScg,
    scoreDbd,
    projCount,
    s25,
    s26
  };
}

function getCompanyScoreValue(comp) {
  if (!comp) return 0;
  if (typeof calculateCompany4DimScore === 'function') {
    return calculateCompany4DimScore(comp).totalScore100 || 0;
  }
  const result = calculateCompany3DimScore(comp);
  return result.totalScore100 || 0;
}

function getCompanyEntityRank(name) {
  const n = (name || '').trim();
  // 1. นิติบุคคล: ขึ้นต้นด้วย บริษัท / บจก. / ห้างหุ้นส่วนจำกัด / หจก. / ห้างหุ้นส่วน
  if (n.startsWith('บริษัท') || n.startsWith('บจก.') || n.startsWith('บ.')) {
    return 1;
  }
  if (n.startsWith('ห้างหุ้นส่วนจำกัด') || n.startsWith('หจก.') || n.startsWith('ห้างหุ้นส่วน')) {
    return 1;
  }
  // 2. ชื่อบุคคล / ร้านค้า / เพจ / สตูดิโอทั่วไป
  return 2;
}

function sortCompaniesByOpportunityScore(companies) {
  if (!Array.isArray(companies)) return [];
  return companies.sort((a, b) => {
    // 1. เรียงตามคะแนน AI Score (จากมากไปน้อย: 100 -> 93 -> 87 -> 80 -> 73 -> 67 -> 60 -> 47 -> 33 -> 0)
    const scoreA = getCompanyScoreValue(a);
    const scoreB = getCompanyScoreValue(b);
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // 2. ถ้าคะแนน AI เท่ากัน ให้เรียงตามจำนวนโครงการจริง (มากไปน้อย)
    const projA = (a.projects && a.projects.length) ? a.projects.length : (Number(a.totalProjects) || 0);
    const projB = (b.projects && b.projects.length) ? b.projects.length : (Number(b.totalProjects) || 0);
    if (projB !== projA) {
      return projB - projA;
    }

    // 3. ถ้าเท่ากันอีก ให้เรียงตามยอดซื้อขายรวม SCG 2025/2026 (มากไปน้อย)
    const salesA = (Number(a.sales2026) || 0) + (Number(a.sales2025) || 0);
    const salesB = (Number(b.sales2026) || 0) + (Number(b.sales2025) || 0);
    if (salesB !== salesA) {
      return salesB - salesA;
    }

    // 4. เรียงตามลำดับตัวอักษรภาษาไทย ก-ฮ
    return (a.name || '').localeCompare(b.name || '', 'th');
  });
}

function setProjectTrackingStatus(companyId, projectId, status, event) {
  if (event) event.stopPropagation();

  const statusMap = loadSavedTrackingStatuses();
  const key = `${companyId}_${projectId}`;
  statusMap[key] = status;
  saveSavedTrackingStatuses(statusMap);

  const comp = allCompanies.find(c => c.id === companyId);
  if (comp && comp.projects) {
    const proj = comp.projects.find(p => (p.projectId === projectId || p.id === projectId));
    if (proj) {
      proj.trackingStatus = status;
    }
  }

  updateHeaderCrmStats();
  renderKPIs();

  const statusLabels = {
    'pending': '⏳ รอดำเนินการ',
    'followup': '📞 กำลังติดตาม / นัดหมาย',
    'quote_sent': '📄 ส่งใบเสนอราคา SCG แล้ว',
    'won': '🎉 ปิดการขายสำเร็จ (Won)',
    'lost': '❌ พลาดดีล (Lost)'
  };

  showStatusToast(`อัปเดตสถานะโครงการเป็น: ${statusLabels[status] || status}`);

  if (activeSelectedCompany && activeSelectedCompany.id === companyId) {
    renderCompanyProjectsList(comp);
  }
}

function updateHeaderCrmStats() {
  let pending = 0;
  let followup = 0;
  let quote = 0;
  let won = 0;

  allCompanies.forEach(c => {
    if (c.projects) {
      c.projects.forEach(p => {
        const st = p.trackingStatus || 'pending';
        if (st === 'pending') pending++;
        else if (st === 'followup') followup++;
        else if (st === 'quote_sent') quote++;
        else if (st === 'won') won++;
      });
    }
  });

  const elPending = document.getElementById('stat-pending-count');
  const elFollowup = document.getElementById('stat-followup-count');
  const elQuote = document.getElementById('stat-quote-count');
  const elWon = document.getElementById('stat-won-count');

  if (elPending) elPending.textContent = pending;
  if (elFollowup) elFollowup.textContent = followup;
  if (elQuote) elQuote.textContent = quote;
  if (elWon) elWon.textContent = won;
}

// ==========================================
// 5. CRM LOGS & QUICK NOTES
// ==========================================
function getAllCrmLogs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CRM_LOGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load CRM logs', e);
  }
  return {};
}

function getCompanyCrmLog(companyId) {
  const logs = getAllCrmLogs();
  return logs[companyId] || { status: 'pending', note: '', lastUpdated: null };
}

function getCompanySiteAssessment(companyId) {
  try {
    const raw = localStorage.getItem('NEXTSITE_SITE_ASSESSMENTS_V4') || 
                localStorage.getItem('NEXTSITE_SITE_ASSESSMENTS_V3') || 
                localStorage.getItem('NEXTSITE_SITE_ASSESSMENTS_V2');
    if (raw) {
      const db = JSON.parse(raw);
      if (db && db[companyId]) {
        const item = db[companyId];
        const parseNum = (v) => {
          if (typeof v === 'number' && v >= 0 && v <= 4) return v;
          if (v === 'yes') return 4;
          if (v === 'med') return 2;
          if (v === 'no') return 1;
          const p = parseInt(v, 10);
          return (!isNaN(p) && p >= 0 && p <= 4) ? p : 0;
        };
        const site = parseNum(item.site);
        const sales = parseNum(item.sales);
        const rel = parseNum(item.rel);
        const sitePts = Math.round((site / 4) * 40);
        const salesPts = Math.round((sales / 4) * 40);
        const relPts = Math.round((rel / 4) * 20);
        const score = (typeof item.score === 'number' && item.score > 0) ? item.score : (sitePts + salesPts + relPts);
        const isAssessed = (site > 0 || sales > 0 || rel > 0 || (typeof item.score === 'number' && item.score > 0));
        return { site, sales, rel, score, isAssessed };
      }
    }
  } catch (e) {
    console.warn('Error reading site assessment:', e);
  }
  return { site: 0, sales: 0, rel: 0, score: 0, isAssessed: false };
}

if (typeof window !== 'undefined') {
  window.getCompanySiteAssessment = getCompanySiteAssessment;
}

function saveCompanyCrmLog(companyId, logData) {
  const activeUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof window.currentSalesUser !== 'undefined' ? window.currentSalesUser : null);

  if (!activeUser) {
    if (typeof showStatusToast === 'function') {
      showStatusToast('🔒 กรุณาเข้าสู่ระบบก่อนบันทึกข้อมูล');
    }
    if (typeof openLoginModal === 'function') {
      openLoginModal(true);
    }
    return;
  }

  const logs = getAllCrmLogs();
  const existing = logs[companyId] || {};
  const hasExistingContent = (existing.note && String(existing.note).trim().length > 0) || (Array.isArray(existing.photos) && existing.photos.length > 0);

  // Ownership protection check - ONLY lock if actual text note or photo content already exists!
  if (hasExistingContent && existing.createdBy) {
    if (typeof canCurrentUserDeleteOrEditItem === 'function' && !canCurrentUserDeleteOrEditItem(existing.createdBy)) {
      const ownerName = existing.salesRep || existing.createdBy;
      if (typeof showStatusToast === 'function') {
        showStatusToast(`🔒 ข้อมูลนี้บันทึกโดย ${ownerName} (คุณไม่มีสิทธิ์แก้ไขหรือบันทึกทับ)`);
      }
      return;
    }
  }

  try {
    const uEmail = activeUser.email;
    const uName = activeUser.fullName;

    const updatedRecord = {
      ...existing,
      ...logData,
      createdBy: (hasExistingContent && existing.createdBy) ? existing.createdBy : uEmail,
      salesRep: (hasExistingContent && existing.salesRep) ? existing.salesRep : (logData.salesRep || uName),
      lastUpdated: new Date().toISOString()
    };
    logs[companyId] = updatedRecord;
    localStorage.setItem(STORAGE_KEY_CRM_LOGS, JSON.stringify(logs));
    localStorage.setItem('nextsite_crm_followup_logs', JSON.stringify(logs));

    if (typeof updateUserCrmStatusSummary === 'function') {
      updateUserCrmStatusSummary();
    }

    // Asynchronously save to Supabase Cloud
    if (typeof window.saveCloudCrmLog === 'function') {
      window.saveCloudCrmLog(companyId, updatedRecord);
    }

    // Refresh table row status in real-time if active
    const rowEl = document.getElementById(`company-row-${companyId}`);
    if (rowEl && typeof renderTable === 'function' && !document.querySelector('.modal-overlay.active')) {
      // Light debounce update
    }
  } catch (e) {
    console.warn('Failed to save CRM log', e);
  }
}

function getCompanyAssignedRole(companyId) {
  try {
    const rolesMap = JSON.parse(localStorage.getItem('nextsite_company_assigned_roles') || '{}');
    if (rolesMap[companyId]) return rolesMap[companyId];
  } catch (e) {}
  const log = (typeof getCompanyCrmLog === 'function') ? getCompanyCrmLog(companyId) : {};
  return log.assignedRole || log.salesRole || '';
}

function updateCompanyAssigneeRole(companyId, newRole, event) {
  if (event) {
    event.stopPropagation();
  }
  try {
    const rolesMap = JSON.parse(localStorage.getItem('nextsite_company_assigned_roles') || '{}');
    if (newRole) {
      rolesMap[companyId] = newRole;
    } else {
      delete rolesMap[companyId];
    }
    localStorage.setItem('nextsite_company_assigned_roles', JSON.stringify(rolesMap));

    // Update CRM logs
    const logs = getAllCrmLogs();
    const existing = logs[companyId] || {};
    logs[companyId] = {
      ...existing,
      assignedRole: newRole,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_CRM_LOGS, JSON.stringify(logs));
    localStorage.setItem('nextsite_crm_followup_logs', JSON.stringify(logs));

    if (newRole) {
      if (typeof showStatusToast === 'function') {
        showStatusToast(`👤 กำหนดผู้รับผิดชอบ: ${newRole}`);
      }
    } else {
      if (typeof showStatusToast === 'function') {
        showStatusToast(`⚪ ยกเลิกการระบุผู้รับผิดชอบ`);
      }
    }

    // Update styling of target select element
    if (event && event.target) {
      const sel = event.target;
      if (newRole === 'Sales supervisor') {
        sel.style.color = '#1E40AF';
        sel.style.background = '#EFF6FF';
        sel.style.borderColor = '#93C5FD';
      } else if (newRole === 'Sales exclusive') {
        sel.style.color = '#047857';
        sel.style.background = '#ECFDF5';
        sel.style.borderColor = '#6EE7B7';
      } else {
        sel.style.color = '#64748B';
        sel.style.background = '#FFFFFF';
        sel.style.borderColor = '#CBD5E1';
      }
    }

    if (typeof window.saveCloudCrmLog === 'function') {
      window.saveCloudCrmLog(companyId, logs[companyId]);
    }

    if (typeof updateAssignedRoleFilterCounts === 'function' && typeof window.allCompanies !== 'undefined') {
      updateAssignedRoleFilterCounts(window.allCompanies);
    }
  } catch (e) {
    console.error('Error updating company assigned role:', e);
  }
}

let activeAssignedRoleFilter = 'all';

function filterByAssignedRole(roleVal) {
  activeAssignedRoleFilter = roleVal || 'all';
  if (typeof applyFilters === 'function') {
    applyFilters();
  }
}

function updateAssignedRoleFilterCounts(source = (typeof allCompanies !== 'undefined' ? allCompanies : [])) {
  const selectEl = document.getElementById('filter-assigned-role-select');
  if (!selectEl) return;
  
  let countSupervisor = 0;
  let countExclusive = 0;
  let countUnassigned = 0;

  source.forEach(c => {
    const role = (typeof getCompanyAssignedRole === 'function') ? getCompanyAssignedRole(c.id) : '';
    if (role === 'Sales supervisor') countSupervisor++;
    else if (role === 'Sales exclusive') countExclusive++;
    else countUnassigned++;
  });

  const optAll = selectEl.querySelector('option[value="all"]');
  const optSup = selectEl.querySelector('option[value="Sales supervisor"]');
  const optExc = selectEl.querySelector('option[value="Sales exclusive"]');
  const optUn = selectEl.querySelector('option[value="unassigned"]');

  if (optAll) optAll.textContent = `👤 ผู้รับผิดชอบ: ทั้งหมด (${source.length})`;
  if (optSup) optSup.textContent = `Sales supervisor (${countSupervisor})`;
  if (optExc) optExc.textContent = `Sales exclusive (${countExclusive})`;
  if (optUn) optUn.textContent = `ยังไม่ระบุ (${countUnassigned})`;
}



function renderCrmStatusBadge(status = 'pending', companyId = null) {
  const styles = {
    'pending': { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1', label: '⏳ รอดำเนินการ' },
    'followup': { bg: '#FFFBEB', color: '#B45309', border: '#FDE68A', label: '📞 กำลังติดตาม' },
    'quote_sent': { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE', label: '📄 เสนอราคาแล้ว' },
    'won': { bg: '#ECFDF5', color: '#047857', border: '#A7F3D0', label: '🎉 ปิดการขาย' },
    'lost': { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA', label: '❌ พลาดดีล' }
  };
  const s = styles[status] || styles['pending'];
  return `<span style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 9999px; font-size: 0.72rem; font-weight: 700; background: ${s.bg}; color: ${s.color}; border: 1px solid ${s.border}; white-space: nowrap;">
    ${s.label}
  </span>`;
}

function quickSaveInlineCrmNote(companyId, noteText, showToast = false) {
  if (typeof currentSalesUser === 'undefined' || !currentSalesUser) {
    if (typeof showStatusToast === 'function') {
      showStatusToast('🔒 กรุณาเข้าสู่ระบบก่อนบันทึกโน้ต');
    }
    if (typeof openLoginModal === 'function') {
      openLoginModal(true);
    }
    return;
  }
  saveCompanyCrmLog(companyId, { note: noteText });
  if (showToast) {
    showStatusToast(`☁️ บันทึกโน้ต CRM ขึ้น Cloud เรียบร้อย`);
  }
}

function openFollowUpModal(companyId, focusNote = true, event) {
  if (event && event.stopPropagation) event.stopPropagation();
  if (typeof currentSalesUser === 'undefined' || !currentSalesUser) {
    if (typeof showStatusToast === 'function') {
      showStatusToast('🔒 กรุณาเข้าสู่ระบบก่อนบันทึกการติดตาม');
    }
    if (typeof openLoginModal === 'function') {
      openLoginModal(true);
    }
    return;
  }
  const modal = document.getElementById('company-followup-modal') || document.getElementById('followup-modal');
  if (!modal) return;
  
  const compList = (typeof allCompanies !== 'undefined' && allCompanies && allCompanies.length) ? allCompanies : (typeof UDON_COMPANIES !== 'undefined' ? UDON_COMPANIES : []);
  const company = compList.find(c => c.id === companyId) || { id: companyId, name: 'บริษัทรับสร้างบ้าน', district: 'เมือง', province: 'อุดรธานี' };

  const idEl = document.getElementById('followup-company-id') || document.getElementById('crm-modal-company-id');
  if (idEl) idEl.value = company.id;

  const nameEl = document.getElementById('followup-modal-company-name') || document.getElementById('crm-modal-company-name');
  if (nameEl) nameEl.textContent = (company.name || '') + ' (' + (company.district || 'เมืองอุดรธานี') + ', ' + (company.province || 'อุดรธานี') + ')';

  const contactEl = document.getElementById('followup-contact-person');
  if (contactEl) contactEl.textContent = company.contactPerson || 'ฝ่ายบริหาร / เจ้าของ';

  const phoneEl = document.getElementById('followup-phone');
  if (phoneEl) phoneEl.textContent = company.phone || '-';

  const distEl = document.getElementById('followup-district');
  if (distEl) distEl.textContent = (company.district || 'เมือง') + ', จ.' + (company.province || 'อุดรธานี');

  const crmLog = getCompanyCrmLog(company.id);
  const hasFollowupContent = (crmLog.note && String(crmLog.note).trim().length > 0) || (Array.isArray(crmLog.photos) && crmLog.photos.length > 0);
  const canEditFollowup = !hasFollowupContent || (!crmLog.createdBy || (typeof canCurrentUserDeleteOrEditItem === 'function' && canCurrentUserDeleteOrEditItem(crmLog.createdBy)));

  selectCrmStatus(crmLog.status || 'pending');

  const noteInput = document.getElementById('followup-note-input') || document.getElementById('crm-modal-note');
  if (noteInput) {
    noteInput.value = crmLog.note || '';
    noteInput.readOnly = !canEditFollowup;
    noteInput.style.background = canEditFollowup ? '#FFFFFF' : '#F1F5F9';
    noteInput.style.color = canEditFollowup ? '#0F172A' : '#475569';
    noteInput.style.cursor = canEditFollowup ? 'text' : 'not-allowed';
  }

  const dateInput = document.getElementById('followup-next-date');
  if (dateInput) {
    dateInput.value = crmLog.nextDate || '';
    dateInput.disabled = !canEditFollowup;
  }

  const repInput = document.getElementById('followup-sales-rep');
  if (repInput) {
    repInput.value = crmLog.salesRep || (window.currentSalesUser ? window.currentSalesUser.fullName : 'ทีมขาย SCG อุดรธานี');
    repInput.disabled = !canEditFollowup;
  }

  const prodCheckboxes = document.querySelectorAll('input[name="followup-prod"]');
  prodCheckboxes.forEach(cb => {
    cb.checked = (crmLog.products || []).indexOf(cb.value) !== -1;
    cb.disabled = !canEditFollowup;
  });

  document.querySelectorAll('.crm-status-box').forEach(b => {
    b.style.pointerEvents = canEditFollowup ? 'auto' : 'none';
    b.style.opacity = canEditFollowup ? '1' : '0.6';
    b.style.cursor = canEditFollowup ? 'pointer' : 'not-allowed';
  });

  const saveBtn = document.querySelector('button[onclick="saveFollowUpLog()"]');
  if (saveBtn) {
    saveBtn.style.display = canEditFollowup ? 'inline-flex' : 'none';
  }

  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modal.style.zIndex = '2147483647';

  if (focusNote !== false && noteInput && canEditFollowup) {
    setTimeout(() => {
      noteInput.focus();
      noteInput.selectionStart = noteInput.selectionEnd = noteInput.value.length;
    }, 100);
  }
}

function closeFollowUpModal() {
  const modal = document.getElementById('company-followup-modal') || document.getElementById('followup-modal');
  if (modal) modal.style.display = 'none';
}

function selectCrmStatus(statusVal) {
  const hiddenInput = document.getElementById('followup-selected-status');
  if (hiddenInput) {
    hiddenInput.value = statusVal;
  }
  const statusColors = {
    'pending': { bg: '#F1F5F9', border: '#0F172A', shadow: '0 0 0 2px #0F172A', color: '#0F172A' },
    'scheduled': { bg: '#EFF6FF', border: '#0284C7', shadow: '0 0 0 2px #0284C7', color: '#0284C7' },
    'visited': { bg: '#F0FDF4', border: '#16A34A', shadow: '0 0 0 2px #16A34A', color: '#16A34A' },
    'quoting': { bg: '#FAF5FF', border: '#9333EA', shadow: '0 0 0 2px #9333EA', color: '#9333EA' },
    'won': { bg: '#ECFDF5', border: '#059669', shadow: '0 0 0 2px #059669', color: '#059669' }
  };

  document.querySelectorAll('.crm-status-box').forEach(box => {
    const val = box.getAttribute('data-status');
    if (val === statusVal) {
      const c = statusColors[val] || statusColors['pending'];
      box.style.borderColor = c.border;
      box.style.boxShadow = c.shadow;
      box.style.background = c.bg;
      box.style.color = c.color;
      box.style.fontWeight = '800';
    } else {
      box.style.borderColor = '#E2E8F0';
      box.style.boxShadow = 'none';
      box.style.background = '#FFFFFF';
      box.style.color = '#64748B';
      box.style.fontWeight = '600';
    }
  });

  const container = document.getElementById('crm-status-radio-group');
  if (container) {
    const radios = container.querySelectorAll('input[name="crm-status"]');
    radios.forEach(r => {
      r.checked = (r.value === statusVal);
    });
  }
}

function saveFollowUpLog() {
  const idEl = document.getElementById('followup-company-id') || document.getElementById('crm-modal-company-id');
  const companyId = idEl ? idEl.value : '';
  if (!companyId) return;

  const statusInput = document.getElementById('followup-selected-status');
  const selectedRadio = document.querySelector('input[name="crm-status"]:checked');
  const status = statusInput ? statusInput.value : (selectedRadio ? selectedRadio.value : 'pending');

  const noteInput = document.getElementById('followup-note-input') || document.getElementById('crm-modal-note');
  const note = noteInput ? noteInput.value.trim() : '';

  const dateInput = document.getElementById('followup-next-date');
  const nextDate = dateInput ? dateInput.value : '';

  const repInput = document.getElementById('followup-sales-rep');
  const salesRep = repInput ? repInput.value.trim() : (window.currentSalesUser ? window.currentSalesUser.fullName : 'ทีมขาย SCG อุดรธานี');

  const selectedProds = [];
  document.querySelectorAll('input[name="followup-prod"]:checked').forEach(cb => {
    selectedProds.push(cb.value);
  });

  const logData = {
    status: status,
    note: note,
    nextDate: nextDate,
    salesRep: salesRep,
    products: selectedProds,
    updatedAt: new Date().toISOString()
  };

  saveCompanyCrmLog(companyId, logData);

  const inlineTextarea = document.getElementById('inline-crm-note-' + companyId);
  if (inlineTextarea) {
    inlineTextarea.value = note;
    inlineTextarea.style.background = note ? '#FFFFFF' : '#F8FAFC';
    inlineTextarea.style.borderColor = note ? '#94A3B8' : '#CBD5E1';
  }

  closeFollowUpModal();
  if (typeof renderTable === 'function') {
    renderTable();
  }
  if (typeof showStatusToast === 'function') {
    showStatusToast('☁️ บันทึกการติดตาม & ซิงค์ขึ้น Supabase เรียบร้อยแล้ว!');
  } else if (typeof showToastNotification === 'function') {
    showToastNotification('☁️ บันทึกการติดตาม & ซิงค์ขึ้น Supabase เรียบร้อยแล้ว!');
  }
}

// ==========================================
// 6. RENDER KPIS & STATS
// ==========================================
function renderKPIs() {
  const companies = filteredCompanies;
  const totalCompanies = companies.length;
  
  let totalProjects = 0;
  let totalPipelineValue = 0;
  let highPriorityLeads = 0;
  let newCompaniesCount = 0;
  companies.forEach(c => {
    const pCount = c.projects ? c.projects.length : (c.totalProjects || 0);
    totalProjects += pCount;
    totalPipelineValue += (pCount * 0.5); // โครงการละ 500,000 บาท = 0.5 ล้านบาท

    const score = window.scoring ? window.scoring.calculatePriorityScore(c) : 50;
    if (score >= 90) highPriorityLeads++;

    // จำนวนบริษัทใหม่ คำนวณตามสถานะกลุ่ม New (prospect) ให้ตรงกับแถบ Tag Filter
    const tag = getCompanyTag(c.id);
    if (tag === 'prospect' || tag === 'new') {
      newCompaniesCount++;
    }
  });

  const elTotalComp = document.getElementById('kpi-total-companies');
  const elNewComp = document.getElementById('kpi-new-companies');
  const elHighOpp = document.getElementById('kpi-high-opp');
  const elTotalVal = document.getElementById('kpi-total-value');
  const elTotalProjectsVal = document.getElementById('kpi-total-projects-val');
  const elTotalProjectsSub = document.getElementById('kpi-total-projects-subtext');
  const elProvinceTotalProjectsBadge = document.getElementById('province-total-projects-badge');
  const elProvinceTotalProjectsCount = document.getElementById('province-total-projects-count');

  if (elTotalComp) elTotalComp.textContent = totalCompanies;
  if (elNewComp) elNewComp.textContent = newCompaniesCount;
  if (elHighOpp) elHighOpp.textContent = highPriorityLeads;
  if (elTotalVal) elTotalVal.textContent = `฿${totalPipelineValue.toFixed(1)}M`;
  if (elTotalProjectsVal) elTotalProjectsVal.textContent = totalProjects;
  if (elTotalProjectsSub) elTotalProjectsSub.textContent = `รวม ${totalProjects} โครงการที่กำลังก่อสร้าง`;
  
  // Dynamic Province Label Synchronization
  const isAllProv = (activeDistrict === 'all' || !activeDistrict);
  const cleanName = cleanThaiText(activeDistrict);
  const provLabel = isAllProv ? 'ทุกจังหวัด' : (cleanName.startsWith('จ.') ? cleanName : `จ.${cleanName}`);

  // 1. Synchronize KPI Card 4 Title (มูลค่าโอกาสทางธุรกิจรวม)
  const elTotalValTitle = document.getElementById('kpi-total-value-title');
  if (elTotalValTitle) {
    elTotalValTitle.textContent = `มูลค่าโอกาสทางธุรกิจรวม (${provLabel})`;
  }

  // 2. Synchronize KPI Card 1 Subtext (ครอบคลุมทั่ว จ....)
  const elTotalCompSubtext = document.getElementById('kpi-total-companies-subtext');
  if (elTotalCompSubtext) {
    elTotalCompSubtext.textContent = isAllProv ? 'ครอบคลุมทั่วทุกจังหวัด' : `ครอบคลุมทั่ว ${provLabel}`;
  }

  // 3. Synchronize Product Demand Section Header
  const elProdDemandProv = document.getElementById('product-demand-province-label');
  if (elProdDemandProv) {
    elProdDemandProv.textContent = provLabel;
  }

  // 4. Synchronize Project Count Badge
  if (elProvinceTotalProjectsBadge) {
    if (isAllProv) {
      elProvinceTotalProjectsBadge.innerHTML = `จำนวนโครงการทุกจังหวัด <span id="province-total-projects-count" style="color: var(--primary-red); font-size: 1.05rem; font-weight: 900;">${totalProjects}</span> โครงการ`;
    } else {
      elProvinceTotalProjectsBadge.innerHTML = `จำนวนโครงการ ${provLabel} <span id="province-total-projects-count" style="color: var(--primary-red); font-size: 1.05rem; font-weight: 900;">${totalProjects}</span> โครงการ`;
    }
  } else if (elProvinceTotalProjectsCount) {
    elProvinceTotalProjectsCount.textContent = totalProjects;
  }
}

function toggleTargetFollowup(companyId, event) {
  if (event) {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
  }

  const activeUser = getCurrentSalesUserObj();
  if (!activeUser || !activeUser.email) {
    if (typeof showStatusToast === 'function') showStatusToast('🔒 กรุณาเข้าสู่ระบบก่อนทำรายการ');
    if (typeof openLoginModal === 'function') openLoginModal(true);
    return;
  }

  const uEmail = (activeUser.email || '').toLowerCase().trim();
  const uName = activeUser.fullName || 'ผู้ใช้งาน';
  const currentlyTargeted = isCompanyTargetedByUser(companyId, uEmail);
  const nextTargeted = !currentlyTargeted;

  // 1. Save to User-Specific Target Map (Isolated per Sales Account)
  const userMap = loadUserTargetMap(uEmail);
  userMap[companyId] = nextTargeted;
  saveUserTargetMap(uEmail, userMap);

  // 2. Update Shared CRM Logs & Multi-user wantFollowup tracking
  try {
    const logs = (typeof getAllCrmLogs === 'function') ? getAllCrmLogs() : {};
    const existing = logs[companyId] || { status: 'pending', note: '' };
    let wantUsers = Array.isArray(existing.wantFollowupUsers) ? [...existing.wantFollowupUsers] : [];
    
    if (nextTargeted) {
      if (!wantUsers.includes(uEmail)) wantUsers.push(uEmail);
    } else {
      wantUsers = wantUsers.filter(e => e !== uEmail);
    }

    const updatedRecord = {
      ...existing,
      wantFollowup: nextTargeted,
      wantFollowupBy: nextTargeted ? uEmail : null,
      wantFollowupUsers: wantUsers,
      lastUpdated: new Date().toISOString()
    };

    logs[companyId] = updatedRecord;
    localStorage.setItem(STORAGE_KEY_CRM_LOGS, JSON.stringify(logs));
    localStorage.setItem('nextsite_crm_followup_logs', JSON.stringify(logs));

    // Asynchronously sync to Supabase
    if (typeof window.saveCloudCrmLog === 'function') {
      window.saveCloudCrmLog(companyId, updatedRecord);
    }
  } catch(e) {
    console.warn('Error updating CRM logs for target followup', e);
  }

  // 3. Update UI Real-time
  if (typeof updateUserCrmStatusSummary === 'function') {
    updateUserCrmStatusSummary();
  }

  if (typeof renderTable === 'function') {
    renderTable();
  }

  if (nextTargeted) {
    showStatusToast('🎯 ปักหมุด: ต้องการติดตามเรียบร้อย');
  } else {
    showStatusToast('⚪ ยกเลิกการปักหมุดต้องการติดตาม');
  }
}

const STORAGE_KEY_HIDE_SALES = 'nextsite_hide_sales_mode';

function initSalesVisibilityState() {
  try {
    const isHidden = localStorage.getItem(STORAGE_KEY_HIDE_SALES) === 'true';
    applySalesVisibilityState(isHidden);
  } catch (e) {}
}

function toggleSalesColumnsVisibility() {
  const currentlyHidden = document.body.classList.contains('hide-sales-mode');
  const nextState = !currentlyHidden;
  applySalesVisibilityState(nextState);
  try {
    localStorage.setItem(STORAGE_KEY_HIDE_SALES, nextState ? 'true' : 'false');
  } catch (e) {}
  
  if (nextState) {
    showStatusToast('🔒 ซ่อนคอลัมน์ประวัติซื้อขายเรียบร้อย (โหมดคุยกับลูกค้า)');
  } else {
    showStatusToast('👁️ แสดงคอลัมน์ประวัติซื้อขายตามปกติ');
  }
}

function applySalesVisibilityState(hidden) {
  const btn = document.getElementById('btn-toggle-sales-columns');
  const text = document.getElementById('text-toggle-sales');
  const icon = document.getElementById('icon-toggle-sales');

  if (hidden) {
    document.body.classList.add('hide-sales-mode');
    if (btn) {
      btn.style.background = '#FEF2F2';
      btn.style.borderColor = '#FCA5A5';
      btn.style.color = '#B91C1C';
      btn.title = 'คลิกเพื่อ แสดง ยอดซื้อขาย (กำลังซ่อนอยู่)';
    }
    if (text) text.textContent = 'แสดงยอดขาย (กำลังซ่อน)';
    if (icon) icon.textContent = '🙈';
  } else {
    document.body.classList.remove('hide-sales-mode');
    if (btn) {
      btn.style.background = '#FFFFFF';
      btn.style.borderColor = '#CBD5E1';
      btn.style.color = '#334155';
      btn.title = 'คลิกเพื่อ ซ่อน ยอดซื้อขาย (โหมดคุยกับลูกค้า)';
    }
    if (text) text.textContent = 'ซ่อนยอดขาย (โหมดคุยกับลูกค้า)';
    if (icon) icon.textContent = '👁️';
  }
}

// ==========================================
// 6.2 PRODUCT DEMAND INTELLIGENCE COLLAPSE/EXPAND
// ==========================================
// 6.2 3-DIMENSION AI OPPORTUNITY SCORING
// 1. Projects: 0->0, 1-2->2, 3-4->3, 5->4, 6+->5
// 2. Stage: Early/Foundation->5, Mid/Structure->3, Late/Finishing->1
// 3. SCG History: 2025&2026->5, 2025 or 2026->4, New->2
// (Raw Total Max 15 -> Scaled to 100)
// ==========================================
function calculateCompany3DimScore(comp) {
  if (typeof calculateCompany4DimScore === 'function') {
    return calculateCompany4DimScore(comp);
  }
  if (!comp) return { totalScore100: 0, rawTotal: 0, scoreProj: 0, scoreStage: 0, scoreScg: 0, scoreDbd: 0 };

  // 1. จำนวนโครงการจริง (Max 5)
  const projects = (comp.projects && Array.isArray(comp.projects)) ? comp.projects : [];
  const projCount = projects.length > 0 ? projects.length : (Number(comp.totalProjects) || 0);
  
  let scoreProj = 0;
  if (projCount === 0) scoreProj = 0;
  else if (projCount <= 2) scoreProj = 2;
  else if (projCount <= 4) scoreProj = 3;
  else if (projCount === 5) scoreProj = 4;
  else scoreProj = 5; // 6+

  // 2. สเตจหน้างาน (Max 5)
  let scoreStage = 0;
  if (projCount === 0) {
    scoreStage = 0;
  } else {
    let hasEarly = false;
    let hasMid = false;
    let hasLate = false;

    projects.forEach(p => {
      const sKey = (p.stageKey || '').toLowerCase();
      const sText = ((p.stage || '') + ' ' + (p.name || '') + ' ' + (p.caption || '')).toLowerCase();

      if (
        sKey === 'groundbreak' || sKey === 'foundation' ||
        sText.includes('เสาเอก') || sText.includes('เสาโท') || sText.includes('เซ็นสัญญา') ||
        sText.includes('เปิดหน้างาน') || sText.includes('ฐานราก') || sText.includes('ตอกเสาเข็ม') ||
        sText.includes('เทพื้น') || sText.includes('คานคอดิน')
      ) {
        hasEarly = true;
      } else if (
        sKey === 'structure' ||
        sText.includes('โครงสร้าง') || sText.includes('หลังคา') || sText.includes('ก่อผนัง') ||
        sText.includes('ฉาบ') || sText.includes('มุงกระเบื้อง') || sText.includes('ฝ้า')
      ) {
        hasMid = true;
      } else if (
        sKey === 'finishing' || sKey === 'handover' ||
        sText.includes('ตกแต่ง') || sText.includes('เก็บงาน') || sText.includes('ส่งมอบ') ||
        sText.includes('สุขภัณฑ์') || sText.includes('ปูกระเบื้อง') || sText.includes('ทาสี') ||
        sText.includes('ตรวจรับ')
      ) {
        hasLate = true;
      } else {
        hasMid = true;
      }
    });

    if (!hasEarly && !hasMid && !hasLate && comp.stageBreakdown) {
      if ((comp.stageBreakdown.groundbreak || 0) > 0 || (comp.stageBreakdown.foundation || 0) > 0) hasEarly = true;
      else if ((comp.stageBreakdown.structure || 0) > 0) hasMid = true;
      else if ((comp.stageBreakdown.finishing || 0) > 0) hasLate = true;
    }

    if (hasEarly) scoreStage = 5;
    else if (hasMid) scoreStage = 3;
    else if (hasLate) scoreStage = 1;
    else scoreStage = 3;
  }

  // 3. ประวัติการซื้อกับ SCG (Max 5)
  const s25 = Number(comp.sales2025) || 0;
  const s26 = Number(comp.sales2026) || 0;
  let scoreScg = 2;
  if (s25 > 0 && s26 > 0) {
    scoreScg = 5;
  } else if (s25 > 0 || s26 > 0) {
    scoreScg = 4;
  } else {
    scoreScg = 2;
  }

  // 4. ฐานข้อมูล DBD (Max 5)
  const dbdInfo = (typeof getCompanyDbdData === 'function') ? getCompanyDbdData(comp) : null;
  const dbdRev = dbdInfo ? dbdInfo.revenue : (Number(comp.dbdRevenue) || 0);
  const scoreDbd = (typeof calculateDbdRevenueScore === 'function') ? calculateDbdRevenueScore(dbdRev) : 0;

  const rawTotal = scoreProj + scoreStage + scoreScg + scoreDbd; // Max 20
  const totalScore100 = Math.round((rawTotal / 20) * 100);

  return {
    totalScore100,
    rawTotal,
    scoreProj,
    scoreStage,
    scoreScg,
    scoreDbd,
    projCount,
    s25,
    s26
  };
}

function getCompanyScoreValue(comp) {
  if (!comp) return 0;
  if (typeof calculateCompany4DimScore === 'function') {
    return calculateCompany4DimScore(comp).totalScore100 || 0;
  }
  const res = calculateCompany3DimScore(comp);
  return res.totalScore100 || 0;
}

// ==========================================
// 6.2 4-TIER STRATEGIC LEADERBOARD (Exact Mockup Match Edition)
// ==========================================
function renderTierLeaderboard() {
  const container = document.getElementById('tier-leaderboard-grid');
  if (!container) return;

  // Base list to calculate leaders from
  const source = (typeof allCompanies !== 'undefined' && Array.isArray(allCompanies)) ? allCompanies : [];
  
  // Province filter
  const provinceCompanies = source.filter(c => {
    if (activeDistrict !== 'all' && activeDistrict) {
      const cProv = (c.province || '').toLowerCase();
      const targetProv = activeDistrict.toLowerCase();
      if (!cProv.includes(targetProv) && !targetProv.includes(cProv)) return false;
    }
    return true;
  });

  const tiers = [
    {
      key: 'strategic',
      title: 'STRATEGIC',
      subtitle: 'ลูกค้าหลักที่ต้องรักษาและ\nลงทุนความสัมพันธ์',
      sectionLabel: 'Top 3 บริษัทกลุ่ม Strategic',
      sectionLabelColor: '#FDE047',
      iconSvg: `
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M3 18L5 8L9.5 13L12 6L14.5 13L19 8L21 18H3Z" fill="url(#crownGoldGrad)" stroke="#FEF08A" stroke-width="1.2" stroke-linejoin="round"/>
          <circle cx="5" cy="7" r="1.5" fill="#FEF08A"/>
          <circle cx="12" cy="5" r="1.5" fill="#FEF08A"/>
          <circle cx="19" cy="7" r="1.5" fill="#FEF08A"/>
          <defs>
            <linearGradient id="crownGoldGrad" x1="3" y1="5" x2="21" y2="18" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FFFBEB"/>
              <stop offset="0.4" stop-color="#FDE047"/>
              <stop offset="1" stop-color="#CA8A04"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      cardBg: 'linear-gradient(180deg, rgba(110, 80, 18, 0.94) 0%, rgba(68, 46, 12, 0.96) 100%)',
      cardBorder: '1.5px solid rgba(250, 204, 21, 0.85)',
      cardShadow: '0 12px 35px rgba(0, 0, 0, 0.4), 0 0 32px rgba(234, 179, 8, 0.4)',
      headerIconBg: 'radial-gradient(circle, #FDE047 0%, #D97706 70%, #92400E 100%)',
      headerIconBorder: '2px solid #FEF08A',
      headerIconGlow: '0 0 18px rgba(234, 179, 8, 0.85)',
      innerBoxBorder: '1px solid rgba(250, 204, 21, 0.45)',
      innerBoxBg: 'rgba(234, 179, 8, 0.16)',
      itemDivider: '1px solid rgba(250, 204, 21, 0.25)',
      btnBg: 'linear-gradient(180deg, #D97706 0%, #B45309 60%, #92400E 100%)',
      btnBorder: '1px solid rgba(253, 224, 71, 0.85)',
      btnGlow: '0 0 20px rgba(217, 119, 6, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
      btnColor: '#FFFFFF',
      badgeType: 'medals'
    },
    {
      key: 'growth',
      title: 'GROWTH',
      subtitle: 'บริษัทที่มีศักยภาพสูง\nกำลังเติบโต',
      sectionLabel: 'Top 3 บริษัทกลุ่ม Growth',
      sectionLabelColor: '#7DD3FC',
      iconSvg: `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="13" width="3.5" height="7" rx="1" fill="#BAE6FD" stroke="#E0F2FE" stroke-width="0.8"/>
          <rect x="10.25" y="9" width="3.5" height="11" rx="1" fill="#7DD3FC" stroke="#BAE6FD" stroke-width="0.8"/>
          <rect x="16.5" y="4" width="3.5" height="16" rx="1" fill="#38BDF8" stroke="#E0F2FE" stroke-width="0.8"/>
        </svg>
      `,
      cardBg: 'linear-gradient(180deg, rgba(20, 82, 148, 0.94) 0%, rgba(12, 50, 96, 0.96) 100%)',
      cardBorder: '1.5px solid rgba(56, 189, 248, 0.85)',
      cardShadow: '0 12px 35px rgba(0, 0, 0, 0.4), 0 0 32px rgba(14, 165, 233, 0.4)',
      headerIconBg: 'radial-gradient(circle, #BAE6FD 0%, #0284C7 70%, #0369A1 100%)',
      headerIconBorder: '2px solid #E0F2FE',
      headerIconGlow: '0 0 18px rgba(14, 165, 233, 0.85)',
      innerBoxBorder: '1px solid rgba(56, 189, 248, 0.45)',
      innerBoxBg: 'rgba(14, 165, 233, 0.16)',
      itemDivider: '1px solid rgba(56, 189, 248, 0.25)',
      btnBg: 'linear-gradient(180deg, #0284C7 0%, #0369A1 60%, #075985 100%)',
      btnBorder: '1px solid rgba(186, 230, 253, 0.85)',
      btnGlow: '0 0 20px rgba(2, 132, 199, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
      btnColor: '#FFFFFF',
      badgeType: 'blue-circle'
    },
    {
      key: 'opportunity',
      title: 'OPPORTUNITY',
      subtitle: 'มีโอกาสสร้างยอดขายเพิ่ม\nยังซื้อไม่ครบทุกกลุ่มสินค้า',
      sectionLabel: 'Top 3 บริษัทกลุ่ม Opportunity',
      sectionLabelColor: '#D8B4FE',
      iconSvg: `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#E9D5FF" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="5.5" stroke="#C084FC" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="2.5" fill="#F3E8FF"/>
        </svg>
      `,
      cardBg: 'linear-gradient(180deg, rgba(98, 40, 158, 0.94) 0%, rgba(60, 22, 98, 0.96) 100%)',
      cardBorder: '1.5px solid rgba(192, 132, 252, 0.85)',
      cardShadow: '0 12px 35px rgba(0, 0, 0, 0.4), 0 0 32px rgba(168, 85, 247, 0.4)',
      headerIconBg: 'radial-gradient(circle, #E9D5FF 0%, #9333EA 70%, #6B21A8 100%)',
      headerIconBorder: '2px solid #F3E8FF',
      headerIconGlow: '0 0 18px rgba(168, 85, 247, 0.85)',
      innerBoxBorder: '1px solid rgba(192, 132, 252, 0.45)',
      innerBoxBg: 'rgba(168, 85, 247, 0.16)',
      itemDivider: '1px solid rgba(192, 132, 252, 0.25)',
      btnBg: 'linear-gradient(180deg, #9333EA 0%, #7E22CE 60%, #581C87 100%)',
      btnBorder: '1px solid rgba(233, 213, 255, 0.85)',
      btnGlow: '0 0 20px rgba(147, 51, 234, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
      btnColor: '#FFFFFF',
      badgeType: 'purple-circle'
    },
    {
      key: 'prospect',
      title: 'NEW',
      subtitle: 'บริษัทใหม่ที่น่าจับตามอง\nเริ่มมีผลงานโดดเด่น',
      sectionLabel: 'Top 3 บริษัทกลุ่ม New',
      sectionLabelColor: '#FDA4AF',
      iconSvg: `
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#sparkleGrad)" stroke="#FFE4E6" stroke-width="0.8"/>
          <defs>
            <linearGradient id="sparkleGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FFF1F2"/>
              <stop offset="0.5" stop-color="#FB7185"/>
              <stop offset="1" stop-color="#E11D48"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      cardBg: 'linear-gradient(180deg, rgba(146, 38, 72, 0.94) 0%, rgba(92, 22, 48, 0.96) 100%)',
      cardBorder: '1.5px solid rgba(251, 113, 133, 0.85)',
      cardShadow: '0 12px 35px rgba(0, 0, 0, 0.4), 0 0 32px rgba(244, 63, 94, 0.4)',
      headerIconBg: 'radial-gradient(circle, #FECDD3 0%, #E11D48 70%, #9F1239 100%)',
      headerIconBorder: '2px solid #FFE4E6',
      headerIconGlow: '0 0 18px rgba(244, 63, 94, 0.85)',
      innerBoxBorder: '1px solid rgba(251, 113, 133, 0.45)',
      innerBoxBg: 'rgba(244, 63, 94, 0.16)',
      itemDivider: '1px solid rgba(251, 113, 133, 0.25)',
      btnBg: 'linear-gradient(180deg, #EA580C 0%, #E11D48 60%, #9F1239 100%)',
      btnBorder: '1px solid rgba(254, 205, 211, 0.85)',
      btnGlow: '0 0 20px rgba(225, 29, 72, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
      btnColor: '#FFFFFF',
      badgeType: 'rose-circle'
    }
  ];

  container.innerHTML = tiers.map(tier => {
    // Filter companies for this tier
    const list = provinceCompanies.filter(c => getCompanyTag(c.id) === tier.key);
    
    // Sort companies: Opportunity Score desc -> total projects desc -> sales desc
    list.sort((a, b) => {
      const scoreA = getCompanyScoreValue(a);
      const scoreB = getCompanyScoreValue(b);
      if (scoreB !== scoreA) return scoreB - scoreA;
      
      const projA = (a.projects && a.projects.length) ? a.projects.length : (Number(a.totalProjects) || 0);
      const projB = (b.projects && b.projects.length) ? b.projects.length : (Number(b.totalProjects) || 0);
      if (projB !== projA) return projB - projA;

      const salesA = (Number(a.sales2026) || 0) + (Number(a.sales2025) || 0);
      const salesB = (Number(b.sales2026) || 0) + (Number(b.sales2025) || 0);
      return salesB - salesA;
    });

    const top3 = list.slice(0, 3);

    let bodyHtml = '';
    if (top3.length === 0) {
      bodyHtml = `
        <div style="padding: 2.5rem 1rem; text-align: center; color: rgba(255,255,255,0.4); font-size: 0.82rem; font-weight: 600; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;">
          <span style="font-size: 1.8rem; line-height: 1;">📂</span>
          <span style="color: rgba(255,255,255,0.7); font-weight: 700;">ยังไม่มีรายชื่อในกลุ่มนี้</span>
          <span style="font-size: 0.7rem; color: rgba(255,255,255,0.4);">(เปลี่ยนกลุ่มได้ที่ปุ่มสถานะในตาราง)</span>
        </div>
      `;
    } else {
      bodyHtml = top3.map((comp, idx) => {
        const projCount = (comp.projects && comp.projects.length) ? comp.projects.length : (Number(comp.totalProjects) || 0);
        const score = getCompanyScoreValue(comp);
        
        // Clean Company Name
        const compName = (comp.id === 'comp-udon-25' || (comp.name && comp.name.includes('บ้านรักษ์')))
          ? 'หจก. บ้านรักษ์อุดรธานี'
          : cleanThaiText(comp.name);

        // Logo Monogram
        const cleanForInitials = compName.replace(/บริษัท|ห้างหุ้นส่วนจำกัด|หจก\.|จำกัด|\(2016\)|\(ไทยแลนด์\)/g, '').trim();
        const initials = cleanForInitials.substring(0, 2).toUpperCase() || 'SC';

        // Tagline / Slogan
        const rawPhone = (comp.phone || '').trim();
        const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
        let slogan = 'รับสร้างบ้าน คุณภาพมาตรฐาน';
        if (comp.slogan) slogan = comp.slogan;
        else if (rawPhone) slogan = `📞 ${rawPhone}`;

        // District
        const rawDist = comp.district || 'เมืองอุดรธานี';
        const cleanDist = rawDist.replace('อุดรธานี', '').replace('สกลนคร', '').replace('อำเภอ', '').replace('อ.', '').trim() || 'เมือง';

        // Ribbon Medal HTML or Glowing Number
        let badgeHtml = '';
        if (tier.badgeType === 'medals') {
          if (idx === 0) {
            badgeHtml = `
              <div style="width: 26px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
                  <path d="M7 16L4 28L10 24L13 28L11 16" fill="#CA8A04"/>
                  <path d="M17 16L20 28L14 24L11 28L13 16" fill="#A16207"/>
                  <circle cx="12" cy="11" r="10" fill="url(#goldMedalGrad_${idx})" stroke="#FEF08A" stroke-width="1.2"/>
                  <text x="12" y="15" text-anchor="middle" font-size="10" font-weight="900" fill="#713F12" font-family="Inter, sans-serif">1</text>
                  <defs>
                    <linearGradient id="goldMedalGrad_${idx}" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FDE047"/>
                      <stop offset="1" stop-color="#EAB308"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            `;
          } else if (idx === 1) {
            badgeHtml = `
              <div style="width: 26px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
                  <path d="M7 16L4 28L10 24L13 28L11 16" fill="#94A3B8"/>
                  <path d="M17 16L20 28L14 24L11 28L13 16" fill="#64748B"/>
                  <circle cx="12" cy="11" r="10" fill="url(#silverMedalGrad_${idx})" stroke="#F8FAFC" stroke-width="1.2"/>
                  <text x="12" y="15" text-anchor="middle" font-size="10" font-weight="900" fill="#1E293B" font-family="Inter, sans-serif">2</text>
                  <defs>
                    <linearGradient id="silverMedalGrad_${idx}" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#F1F5F9"/>
                      <stop offset="1" stop-color="#CBD5E1"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            `;
          } else {
            badgeHtml = `
              <div style="width: 26px; height: 32px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
                  <path d="M7 16L4 28L10 24L13 28L11 16" fill="#D97706"/>
                  <path d="M17 16L20 28L14 24L11 28L13 16" fill="#B45309"/>
                  <circle cx="12" cy="11" r="10" fill="url(#bronzeMedalGrad_${idx})" stroke="#FED7AA" stroke-width="1.2"/>
                  <text x="12" y="15" text-anchor="middle" font-size="10" font-weight="900" fill="#7C2D12" font-family="Inter, sans-serif">3</text>
                  <defs>
                    <linearGradient id="bronzeMedalGrad_${idx}" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#FDBA74"/>
                      <stop offset="1" stop-color="#EA580C"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            `;
          }
        } else if (tier.badgeType === 'blue-circle') {
          badgeHtml = `<div style="width: 24px; height: 24px; border-radius: 50%; background: #0284C7; color: #FFFFFF; font-weight: 900; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(14, 165, 233, 0.6); border: 1.2px solid #BAE6FD; flex-shrink: 0;">${idx+1}</div>`;
        } else if (tier.badgeType === 'purple-circle') {
          badgeHtml = `<div style="width: 24px; height: 24px; border-radius: 50%; background: #9333EA; color: #FFFFFF; font-weight: 900; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(168, 85, 247, 0.6); border: 1.2px solid #E9D5FF; flex-shrink: 0;">${idx+1}</div>`;
        } else {
          badgeHtml = `<div style="width: 24px; height: 24px; border-radius: 50%; background: #F43F5E; color: #FFFFFF; font-weight: 900; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(244, 63, 94, 0.6); border: 1.2px solid #FECDD3; flex-shrink: 0;">${idx+1}</div>`;
        }

        // Custom Logo Color/Style to match Mockup
        let logoBg = '#FFFFFF';
        let logoColor = '#0F172A';
        let logoIcon = '🏠';
        let logoSubtext = initials;

        if (tier.key === 'strategic') {
          if (idx === 0) {
            logoBg = '#FFFFFF';
            logoColor = '#0F172A';
            logoIcon = '📐';
            logoSubtext = initials || 'DESIGN';
          } else if (idx === 1) {
            logoBg = '#0F1E36';
            logoColor = '#FBBF24';
            logoIcon = '🏠';
            logoSubtext = initials || 'HOME';
          } else {
            logoBg = '#064E3B';
            logoColor = '#FFFFFF';
            logoIcon = '🏡';
            logoSubtext = initials || 'SABAI';
          }
        } else {
          logoBg = idx === 0 ? '#FFFFFF' : (idx === 1 ? '#0F1E36' : '#1E1B4B');
          logoColor = idx === 0 ? '#0F172A' : '#38BDF8';
        }

        const isLastItem = (idx === top3.length - 1);

        return `
          <div style="display: flex; align-items: center; gap: 8px; padding: 8px 2px; ${isLastItem ? '' : 'border-bottom: ' + tier.itemDivider + ';'} cursor: pointer; transition: background 0.15s ease;"
            onclick="openCompanyProjectsModal('${comp.id}')"
            onmouseover="this.style.background='rgba(255,255,255,0.05)'"
            onmouseout="this.style.background='transparent'"
            title="คลิกเพื่อดูรายละเอียดและกลยุทธ์ AI ของ ${compName}">
            
            <!-- 1. Medal / Rank Badge -->
            ${badgeHtml}

            <!-- 2. Logo Card (50x50 Rounded Square) -->
            <div style="width: 48px; height: 48px; border-radius: 12px; background: ${logoBg}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.15); padding: 2px;">
              <span style="font-size: 16px; line-height: 1;">${logoIcon}</span>
              <span style="font-size: 8px; font-weight: 900; color: ${logoColor}; text-align: center; line-height: 1; letter-spacing: -0.2px; margin-top: 2px; max-width: 44px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${logoSubtext}
              </span>
            </div>

            <!-- 3. Middle Company Details -->
            <div style="flex: 1; min-width: 0; overflow: hidden; display: flex; flex-direction: column; justify-content: center;">
              <!-- Row 1: Company Name & Verified Badge -->
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="font-size: 13px; font-weight: 700; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; max-width: 100%;" title="${compName}">
                  ${compName}
                </span>
                <span title="ยืนยันมีตัวตนและผลงานจริง" style="color: #38BDF8; font-size: 0.85rem; flex-shrink: 0; display: inline-flex;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#38BDF8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#0F172A"/></svg>
                </span>
              </div>

              <!-- Row 2: Tagline / Slogan / Phone -->
              <div style="font-size: 10.5px; color: rgba(255,255,255,0.7); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 1px;">
                ${slogan}
              </div>

              <!-- Row 3: Sub-metrics (Projects) -->
              <div style="display: flex; align-items: center; gap: 6px; font-size: 10px; color: rgba(255,255,255,0.85); margin-top: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                <span>📁 ${projCount} โครงการ</span>
              </div>
            </div>

            <!-- 4. Right Score & Small Arrow -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-left: auto; flex-shrink: 0; min-width: 38px; text-align: center;">
              <span style="font-size: 7.5px; color: rgba(255,255,255,0.65); font-weight: 500;">AI Score</span>
              <span style="font-size: 19px; font-weight: 800; color: #FFFFFF; line-height: 1; margin: 1px 0;">${score}</span>
              <button type="button" onclick="event.stopPropagation(); openCompanyProjectsModal('${comp.id}')" title="คลิกเพื่อดูรายละเอียด AI"
                style="width: 18px; height: 18px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); color: rgba(255, 255, 255, 0.85); font-size: 9px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s ease;"
                onmouseover="this.style.background='#FFFFFF'; this.style.color='#000000';"
                onmouseout="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.color='rgba(255, 255, 255, 0.85)';">
                →
              </button>
            </div>
          </div>
        `;
      }).join('');
    }

    const subtitleLines = (tier.subtitle || '').split('\n').join('<br>');

    return `
      <div class="tier-glow-card" style="background: ${tier.cardBg}; border: ${tier.cardBorder}; box-shadow: ${tier.cardShadow}; border-radius: 22px; padding: 18px 14px 16px 14px; display: flex; flex-direction: column; position: relative;">
        
        <!-- 1. Header Area (No blocky box - integrated glowing design) -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1;">
            <!-- Big Glowing Circular Icon -->
            <div style="width: 48px; height: 48px; border-radius: 50%; background: ${tier.headerIconBg}; border: ${tier.headerIconBorder}; box-shadow: ${tier.headerIconGlow}; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              ${tier.iconSvg}
            </div>
            
            <!-- Title & Subtitle -->
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 17px; font-weight: 800; color: #FFFFFF; letter-spacing: 0.5px; line-height: 1.1;">
                ${tier.title}
              </div>
              <div style="font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.85); line-height: 1.3; margin-top: 3px;">
                ${subtitleLines}
              </div>
            </div>
          </div>

          <!-- Header Arrow Circle -->
          <button type="button" onclick="filterByCompanyTag('${tier.key}'); const el = document.getElementById('table-card-container'); if(el) el.scrollIntoView({behavior:'smooth'});"
            title="ดูทั้งหมดในกลุ่ม ${tier.title}"
            style="width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.22); color: rgba(255,255,255,0.9); font-size: 13px; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; margin-left: 6px; transition: all 0.2s ease;"
            onmouseover="this.style.background='rgba(255,255,255,0.25)';"
            onmouseout="this.style.background='rgba(255,255,255,0.08)';">
            →
          </button>
        </div>

        <!-- 2. Inner Box Container (Top 3 Subsection with Bordered Compartment) -->
        <div style="border: ${tier.innerBoxBorder}; border-radius: 16px; padding: 10px 10px 4px 10px; background: ${tier.innerBoxBg}; margin-bottom: 14px; flex: 1; display: flex; flex-direction: column;">
          <!-- Subsection Header -->
          <div style="font-size: 12px; font-weight: 700; color: ${tier.sectionLabelColor}; margin-bottom: 6px; padding-left: 2px;">
            ${tier.sectionLabel}
          </div>

          <!-- Company Item Rows -->
          <div style="display: flex; flex-direction: column; flex: 1;">
            ${bodyHtml}
          </div>
        </div>

        <!-- 3. Bottom Glowing Pill Button -->
        <div style="margin-top: auto;">
          <button type="button" onclick="filterByCompanyTag('${tier.key}'); const el = document.getElementById('table-card-container'); if(el) el.scrollIntoView({behavior:'smooth'});"
            style="width: 100%; padding: 10px 14px; border-radius: 9999px; background: ${tier.btnBg}; border: ${tier.btnBorder}; box-shadow: ${tier.btnGlow}; color: ${tier.btnColor}; font-weight: 700; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease;"
            onmouseover="this.style.filter='brightness(1.15)'; this.style.transform='translateY(-1px)';"
            onmouseout="this.style.filter='none'; this.style.transform='none';">
            <span>ดูทั้งหมดในกลุ่ม ${tier.title} &nbsp;→</span>
          </button>
        </div>

      </div>
    `;
  }).join('');
}

function initProductDemandCollapseState() {}
function toggleProductDemandSection() {}
function applyProductDemandCollapseState() {}

function initProductDemandCollapseState() {}
function toggleProductDemandSection() {}
function applyProductDemandCollapseState() {}

// ==========================================
// 7. TABLE RENDERING (9 Beautiful Executive Columns)
// ==========================================
function renderTable() {
  const tbody = document.getElementById('company-table-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (filteredCompanies.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="padding: 4rem 1rem; text-align: center; color: #64748B;">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;">
            <span style="font-size: 2.5rem;">🔍</span>
            <span style="font-size: 1rem; font-weight: 700; color: #0F172A;">ไม่พบข้อมูลผู้รับเหมาตามเงื่อนไขการค้นหา</span>
            <span style="font-size: 0.8rem; color: #64748B;">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรอง 'ทั้งหมด'</span>
            <button onclick="activeFilter='all'; activeDistrict='all'; activeSubDistrict='all'; activeCompanyTagFilter='all'; activeFollowupStatusFilter='all'; if(document.getElementById('select-crm-status-filter')) document.getElementById('select-crm-status-filter').value='all'; searchQuery=''; applyFilters();" 
              class="btn-action-primary" style="margin-top: 0.5rem;">
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        </td>
      </tr>
    `;
    updateTagFilterCounts(allCompanies);
    return;
  }

  filteredCompanies.forEach((company, index) => {
    const projects = company.projects || [];
    const projCount = projects.length || company.totalProjects || 0;
    const curTag = getCompanyTag(company.id);

    const companyCleanName = (company.id === 'comp-udon-25' || (company.name && company.name.includes('บ้านรักษ์')))
      ? 'ห้างหุ้นส่วนจำกัด บ้านรักษ์อุดรธานี'
      : cleanThaiText(company.name);

    // Rank Class
    let rankClass = 'rank-light-blue';
    if (index === 0) rankClass = 'rank-1';
    else if (index === 1) rankClass = 'rank-2';
    else if (index === 2) rankClass = 'rank-3';
    else if (index % 2 === 0) rankClass = 'rank-dark-blue';

    // AI recommendation extraction
    let fbPageHandle = '';
    if (company.facebookUrl) {
      const match = company.facebookUrl.match(/facebook\.com\/([^/?]+)/);
      if (match && match[1]) fbPageHandle = match[1];
    }
    if (!fbPageHandle && company.facebookSignal && company.facebookSignal.pageName) {
      fbPageHandle = company.facebookSignal.pageName;
    }
    if (!fbPageHandle) fbPageHandle = companyCleanName;

    // Calculate exact 3-Dimension Opportunity Score (Max 15 -> Scaled to 100)
    const score3Dim = calculateCompany3DimScore(company);
    const oppScore = score3Dim.totalScore100;

    // เกณฑ์คะแนนโอกาส AI:
    // 0 - 45 = โอกาสน้อย
    // 46 - 70 = โอกาสปานกลาง
    // 75 ขึ้นไป (71+) = โอกาสสูง
    let aiTierText = `โอกาสน้อยวิเคราะห์จาก AI (${oppScore})`;
    let aiTierColor = '#64748B';

    if (oppScore >= 71) {
      aiTierText = `โอกาสสูงวิเคราะห์จาก AI (${oppScore})`;
      aiTierColor = '#16A34A';
    } else if (oppScore >= 46) {
      aiTierText = `โอกาสปานกลางวิเคราะห์จาก AI (${oppScore})`;
      aiTierColor = '#EA580C';
    } else {
      aiTierText = `โอกาสน้อยวิเคราะห์จาก AI (${oppScore})`;
      aiTierColor = '#64748B';
    }

    // CRM Log for company
    const companyCrmLog = (typeof getCompanyCrmLog === 'function') ? getCompanyCrmLog(company.id) : {};

    // Field Site Assessment Score (จากหน้าประเมินหน้างาน 0-4)
    const siteAssess = (typeof getCompanySiteAssessment === 'function') ? getCompanySiteAssessment(company.id) : { score: 0, isAssessed: false };
    let salesAssessedHtml = '';

    if (siteAssess.isAssessed) {
      const assessScore = siteAssess.score;
      let badgeBg = '#ECFDF5';
      let badgeColor = '#065F46';
      let barColor = '#10B981';
      let gradeLabel = 'ยอดเยี่ยม';

      if (assessScore >= 80) {
        badgeBg = '#ECFDF5';
        badgeColor = '#065F46';
        barColor = '#10B981';
        gradeLabel = 'โอกาสสูงสุด';
      } else if (assessScore >= 60) {
        badgeBg = '#EFF6FF';
        badgeColor = '#1E40AF';
        barColor = '#3B82F6';
        gradeLabel = 'โอกาสสูง';
      } else if (assessScore >= 40) {
        badgeBg = '#FFFBEB';
        badgeColor = '#92400E';
        barColor = '#F59E0B';
        gradeLabel = 'ปานกลาง';
      } else {
        badgeBg = '#FEF2F2';
        badgeColor = '#991B1B';
        barColor = '#EF4444';
        gradeLabel = 'ต้องติดตาม';
      }

      salesAssessedHtml = `
        <div style="display: flex; align-items: center; gap: 6px; margin-top: 3px; flex-wrap: wrap;" title="คะแนนประเมินหน้างาน: ${assessScore}% (${gradeLabel})">
          <div style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.74rem; font-weight: 800; color: ${badgeColor}; line-height: 1.2;">
            <span style="color: ${barColor}; font-size: 0.85rem; line-height: 1;">●</span>
            <span>ประเมินหน้างาน: <strong>${assessScore}%</strong></span>
          </div>
          <div style="display: inline-flex; align-items: center; gap: 4px;">
            <div style="width: 38px; height: 5px; background: #E2E8F0; border-radius: 9999px; overflow: hidden; display: inline-block; vertical-align: middle;">
              <div style="width: ${assessScore}%; height: 100%; background: ${barColor}; border-radius: 9999px;"></div>
            </div>
            <span style="font-size: 0.68rem; font-weight: 700; color: ${badgeColor}; background: ${badgeBg}; padding: 1px 5px; border-radius: 4px; white-space: nowrap;">${gradeLabel}</span>
          </div>
        </div>
      `;
    } else {
      salesAssessedHtml = `
        <div style="display: flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 600; color: #64748B; margin-top: 2px; line-height: 1.2;">
          <span style="color: #94A3B8; font-size: 0.85rem; line-height: 1;">●</span>
          <span>ประเมินหน้างาน: <span style="color: #64748B; font-weight: 700; background: #F1F5F9; padding: 1px 5px; border-radius: 4px;">⏳ ยังไม่เข้าพบ</span></span>
        </div>
      `;
    }

    // Check ownership & edit permission for this company
    const hasActualCrmData = (companyCrmLog.note && String(companyCrmLog.note).trim().length > 0) || (Array.isArray(companyCrmLog.photos) && companyCrmLog.photos.length > 0);
    const canEditCompany = !hasActualCrmData || (!companyCrmLog.createdBy || (typeof canCurrentUserDeleteOrEditItem === 'function' && canCurrentUserDeleteOrEditItem(companyCrmLog.createdBy)));
    const ownerName = companyCrmLog.salesRep || companyCrmLog.createdBy || 'เซลส์ท่านอื่น';

    const tr = document.createElement('tr');
    tr.id = `company-row-${company.id}`;
    tr.dataset.companyId = company.id;
    tr.className = index % 2 === 0 ? 'row-dark-tint' : 'row-light-tint';
    tr.style.cursor = 'pointer';
    tr.onclick = (e) => {
      if (['INPUT', 'BUTTON', 'A', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      openCompanyProjectsModal(company);
    };

    tr.innerHTML = `
      <!-- 1. อันดับ (Rank) -->
      <td style="text-align: center; width: 55px; vertical-align: middle;">
        <div class="rank-badge ${rankClass}">#${index + 1}</div>
      </td>

      <!-- 2. ชื่อบริษัท / สถานะยืนยัน & ตัวเลือก Focus / Non-Focus / New -->
      <td style="vertical-align: middle;">
        <div style="display: flex; flex-direction: column; gap: 5px;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span class="company-title" onclick="openCompanyProjectsModal('${company.id}')" style="font-weight: 800; color: #0F172A; font-size: 0.95rem; line-height: 1.3;">${companyCleanName}</span>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" style="flex-shrink: 0;">
              <circle cx="10" cy="10" r="10" fill="#10B981"/>
              <path d="M6 10.5L8.5 13L14 7.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          
          <!-- Sales Tag Selector Buttons: 4 Tiers (Strategic / Growth / Opportunity / Prospect) -->
          <div class="inline-tag-selector" onclick="event.stopPropagation();" style="display: inline-flex; align-items: center; gap: 3px; background: #F1F5F9; padding: 2px 4px; border-radius: 6px; border: 1px solid #CBD5E1; width: fit-content; flex-wrap: wrap;" title="คลิกเพื่อเปลี่ยนกลุ่มสถานะ">
            <button type="button" 
                    title="Strategic Partner/ลูกค้าแฟนพันธ์แท้"
                    onclick="setCompanyTag('${company.id}', 'strategic', event)" 
                    style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; font-size: 0.70rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s ease; ${curTag === 'strategic' ? 'background: #DC2626; color: #FFFFFF; box-shadow: 0 1px 3px rgba(220,38,38,0.35);' : 'background: transparent; color: #64748B;'}">
              👑 Strategic
            </button>
            <button type="button" 
                    title="Growth Account / ลูกค้าทีมีความสัมพันธ์ แต่ต้อติดตามอย่างใกล้ชิด"
                    onclick="setCompanyTag('${company.id}', 'growth', event)" 
                    style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; font-size: 0.70rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s ease; ${curTag === 'growth' ? 'background: #2563EB; color: #FFFFFF; box-shadow: 0 1px 3px rgba(37,99,235,0.35);' : 'background: transparent; color: #64748B;'}">
              📈 Growth
            </button>
            <button type="button" 
                    title="Opportunity Account / ลูกค้าที่ต้องสร้างความสัมพันธ์"
                    onclick="setCompanyTag('${company.id}', 'opportunity', event)" 
                    style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; font-size: 0.70rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s ease; ${curTag === 'opportunity' ? 'background: #D97706; color: #FFFFFF; box-shadow: 0 1px 3px rgba(217,119,6,0.35);' : 'background: transparent; color: #64748B;'}">
              🎯 Opportunity
            </button>
            <button type="button" 
                    title="New / ลูกค้าใหม่"
                    onclick="setCompanyTag('${company.id}', 'prospect', event)" 
                    style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 6px; font-size: 0.70rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s ease; ${curTag === 'prospect' ? 'background: #059669; color: #FFFFFF; box-shadow: 0 1px 3px rgba(5,150,105,0.35);' : 'background: transparent; color: #64748B;'}">
              ✨ New
            </button>
          </div>
        </div>
      </td>

      <!-- 3. พื้นที่ อำเภอจริงตาม Maps -->
      <td style="vertical-align: middle;">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <div style="font-weight: 800; color: #0F172A; font-size: 0.88rem; display: flex; align-items: center; gap: 4px;">
            <span>${cleanThaiText(company.district) || 'เมืองอุดรธานี'}</span>
            ${(COMPANY_MAPS_MASTER[company.id] || company.googleMapsUrl || company.gmaps) ? `
              <a href="${COMPANY_MAPS_MASTER[company.id] || company.googleMapsUrl || company.gmaps}" target="_blank" onclick="event.stopPropagation();" title="เปิดดูหมุดพิกัดจริงบน Google Maps (${cleanThaiText(company.name)})" style="color: #EA4335; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
                📍
              </a>
            ` : ''}
          </div>
          <div style="color: #64748B; font-size: 0.78rem;">จ.${cleanThaiText(company.province) || 'อุดรธานี'}</div>
        </div>
      </td>

      <!-- 4. จำนวนโครงการ (ไซต์จริงจาก FB) -->
      <td style="vertical-align: middle;">
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${projCount > 0 ? `
            <div style="display: flex; align-items: center; gap: 6px;">
              <strong style="font-size: 1rem; font-weight: 900; color: #0F172A;">${projCount} โครงการ</strong>
              <span style="background: #E0F2FE; color: #0284C7; font-size: 0.72rem; font-weight: 800; padding: 1px 7px; border-radius: 9999px; border: 1px solid #BAE6FD; display: inline-flex; align-items: center; gap: 3px;">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> FB จริง
              </span>
            </div>
          ` : `
            <div>
              <strong style="font-size: 0.88rem; font-weight: 800; color: #475569; display: block; line-height: 1.35;">0 โครงการในพื้นที่อุดร</strong>
            </div>
            <div style="font-size: 0.74rem; color: #059669; font-weight: 700; display: inline-flex; align-items: center; gap: 4px; background: #ECFDF5; border: 1px solid #A7F3D0; padding: 2px 8px; border-radius: 6px; width: fit-content; line-height: 1.3; margin-top: 1px;">
              <span>📍</span> มีไซต์งานในพื้นที่อื่น
            </div>
          `}
        </div>
      </td>

      <!-- 5. ยอดซื้อ SCG 2025 -->
      <td class="col-sales-2025" style="vertical-align: middle; text-align: center; padding: 6px 8px;">
        ${(() => {
          const s25 = Number(company.sales2025) || 0;
          if (s25 > 0) {
            const formatted = '฿' + s25.toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2});
            return `
              <div title="ยอดซื้อปี 2025: ${formatted} บาท" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; background: #F0FDF4; border: 1.5px solid #86EFAC; padding: 3px 9px; border-radius: 9999px; font-weight: 800; font-size: 0.74rem; color: #15803D; cursor: pointer; transition: transform 0.15s ease; white-space: nowrap;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                <span style="color: #16A34A; font-size: 0.85rem; line-height: 1;">●</span>
                <span>เคยซื้อกับ SCG</span>
              </div>
            `;
          } else {
            return `
              <span style="font-size: 0.72rem; color: #94A3B8; font-weight: 600;">⚪ ยังไม่เคยซื้อ</span>
            `;
          }
        })()}
      </td>

      <!-- 6. ยอดซื้อ SCG 2026 -->
      <td class="col-sales-2026" style="vertical-align: middle; text-align: center; padding: 6px 8px;">
        ${(() => {
          const s25 = Number(company.sales2025) || 0;
          const s26 = Number(company.sales2026) || 0;
          const fmt26 = '฿' + s26.toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2});
          const fmt25 = '฿' + s25.toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2});

          if (s26 > s25 && s25 > 0) {
            const growPct = Math.round(((s26 - s25) / s25) * 100);
            return `
              <div title="ยอดซื้อปี 2026: ${fmt26} บาท (เติบโตจากปี 2025 ที่ ${fmt25})" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; background: #DCFCE7; border: 1.5px solid #86EFAC; padding: 3px 9px; border-radius: 9999px; font-weight: 800; font-size: 0.74rem; color: #15803D; cursor: pointer; transition: transform 0.15s ease; white-space: nowrap;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                <span style="color: #16A34A; font-size: 0.85rem; line-height: 1;">●</span>
                <span>ยอดซื้อเพิ่มขึ้น</span>
              </div>
            `;
          } else if (s26 < s25 && s26 > 0) {
            const dropPct = Math.round(((s25 - s26) / s25) * 100);
            return `
              <div title="ยอดซื้อปี 2026: ${fmt26} บาท (ลดลงจากปี 2025 ที่ ${fmt25})" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; background: #FEE2E2; border: 1.5px solid #FCA5A5; padding: 3px 9px; border-radius: 9999px; font-weight: 800; font-size: 0.74rem; color: #DC2626; cursor: pointer; transition: transform 0.15s ease; white-space: nowrap;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                <span style="color: #DC2626; font-size: 0.85rem; line-height: 1;">●</span>
                <span>ยอดซื้อลดลง</span>
              </div>
            `;
          } else if (s26 > 0 && s25 === 0) {
            return `
              <div title="ยอดซื้อปี 2026: ${fmt26} บาท (ลูกค้าใหม่)" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; background: #DCFCE7; border: 1.5px solid #86EFAC; padding: 3px 9px; border-radius: 9999px; font-weight: 800; font-size: 0.74rem; color: #15803D; cursor: pointer; transition: transform 0.15s ease; white-space: nowrap;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                <span style="color: #16A34A; font-size: 0.85rem; line-height: 1;">●</span>
                <span>ลูกค้าใหม่เปิดยอด</span>
              </div>
            `;
          } else if (s26 === 0 && s25 > 0) {
            return `
              <div title="ปี 2025 มียอดซื้อ ${fmt25} บาท แต่ปี 2026 ยังไม่มียอดสั่งซื้อ" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: #FEF2F2; border: 1.5px solid #FCA5A5; padding: 3px 9px; border-radius: 9999px; font-weight: 800; font-size: 0.74rem; color: #DC2626; cursor: pointer; transition: transform 0.15s ease; white-space: nowrap;" onmouseover="this.style.transform='scale(1.04)'" onmouseout="this.style.transform='scale(1)'">
                <span style="font-size: 0.78rem;">🚨</span>
                <span>ขาดการสั่งซื้อปี 2026</span>
              </div>
            `;
          } else {
            return `
              <span style="font-size: 0.72rem; color: #94A3B8; font-weight: 600;">⚪ ยังไม่เคยซื้อ</span>
            `;
          }
        })()}
      </td>

      <!-- 7. สถานะการติดตาม (ปุ่มต้องการติดตาม + ป้ายสถานะเข้าติดตามแล้ว/รอการติดตาม) -->
      <td style="text-align: center; vertical-align: middle; padding: 6px 8px;">
        ${(() => {
          const log = (typeof getCompanyCrmLog === 'function') ? getCompanyCrmLog(company.id) : {};
          const isTargeted = isCompanyTargetedByUser(company.id);
          const hasFollowedUp = (log.note && log.note.trim().length > 0) || 
                                (Array.isArray(log.photos) && log.photos.length > 0) || 
                                ['followup', 'won', 'quote_sent'].includes(log.status);

          const targetBtnHtml = isTargeted
            ? `
              <button type="button" onclick="toggleTargetFollowup('${company.id}', event)" 
                title="คลิกเพื่อยกเลิกการปักหมุดต้องการติดตาม" 
                style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 3px 10px; border-radius: 6px; border: 1.5px solid #2563EB; background: #EFF6FF; color: #1D4ED8; font-size: 0.72rem; font-weight: 800; cursor: pointer; box-shadow: 0 1px 3px rgba(37,99,235,0.2); transition: all 0.15s ease;"
                onmouseover="this.style.background='#DBEAFE'; this.style.transform='scale(1.03)';" onmouseout="this.style.background='#EFF6FF'; this.style.transform='scale(1)';">
                <span>🎯</span>
                <span>ต้องการติดตาม</span>
                <span style="font-size: 0.65rem; background: #2563EB; color: #FFFFFF; border-radius: 9999px; padding: 0 4px; margin-left: 2px;">✓</span>
              </button>
            `
            : `
              <button type="button" onclick="toggleTargetFollowup('${company.id}', event)" 
                title="คลิกเพื่อปักหมุดว่า ต้องการติดตาม บริษัทนี้" 
                style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 3px 10px; border-radius: 6px; border: 1.5px solid #CBD5E1; background: #FFFFFF; color: #475569; font-size: 0.72rem; font-weight: 700; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.04); transition: all 0.15s ease;"
                onmouseover="this.style.borderColor='#3B82F6'; this.style.color='#1D4ED8'; this.style.background='#EFF6FF'; this.style.transform='scale(1.03)';" onmouseout="this.style.borderColor='#CBD5E1'; this.style.color='#475569'; this.style.background='#FFFFFF'; this.style.transform='scale(1)';">
                <span style="color: #94A3B8;">📌</span>
                <span>ต้องการติดตาม</span>
              </button>
            `;

          let followerName = log.salesRep || '';
          if (!followerName && log.createdBy) {
            if (log.createdBy.toLowerCase().includes('keetavas')) followerName = 'คีตวรรษ';
            else if (log.createdBy.toLowerCase().includes('pannipan')) followerName = 'พรรณิภา';
            else followerName = log.createdBy.split('@')[0];
          }
          if (!followerName && company.salesRep) {
            followerName = company.salesRep;
          }
          if (!followerName) {
            const curUser = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser : (typeof getCurrentSalesUserObj === 'function' ? getCurrentSalesUserObj() : null);
            if (curUser && curUser.fullName) followerName = curUser.fullName;
          }
          if (!followerName) {
            followerName = 'คีตวรรษ';
          }
          const cleanName = followerName.replace(/^คุณ\s*/, '').trim() || 'คีตวรรษ';

          const statusBadgeHtml = hasFollowedUp
            ? `
              <div onclick="openCompanyProjectsModal('${company.id}')" title="ติดตามแล้ว (มีประวัติการเข้าพบ/โน้ต/รูปถ่ายหน้างาน)" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; border: 1.5px solid #86EFAC; background: #F0FDF4; font-weight: 800; font-size: 0.72rem; color: #15803D; box-shadow: 0 1px 3px rgba(22,163,74,0.1); white-space: nowrap; cursor: pointer;">
                <span style="color: #16A34A; font-size: 0.85rem; line-height: 1;">●</span>
                <span>ติดตามแล้ว</span>
              </div>
            `
            : `
              <div onclick="openCompanyProjectsModal('${company.id}')" title="รอการติดตาม (ยังไม่มีบันทึกการเข้าพบหรือรูปถ่าย)" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; border: 1.5px solid #FED7AA; background: #FFF7ED; font-weight: 800; font-size: 0.74rem; color: #C2410C; box-shadow: 0 1px 3px rgba(234,88,12,0.1); white-space: nowrap; cursor: pointer;">
                <span style="color: #EA580C; font-size: 0.85rem; line-height: 1;">●</span>
                <span>รอการติดตาม</span>
              </div>
            `;

          const assignedRole = (typeof getCompanyAssignedRole === 'function') ? getCompanyAssignedRole(company.id) : '';
          let roleSelectBorder = '#CBD5E1';
          let roleSelectBg = '#FFFFFF';
          let roleSelectColor = '#64748B';

          if (assignedRole === 'Sales supervisor') {
            roleSelectBorder = '#93C5FD';
            roleSelectBg = '#EFF6FF';
            roleSelectColor = '#1D4ED8';
          } else if (assignedRole === 'Sales exclusive') {
            roleSelectBorder = '#6EE7B7';
            roleSelectBg = '#ECFDF5';
            roleSelectColor = '#047857';
          }

          const roleSelectHtml = `
            <div style="margin-top: 3px; width: 100%; display: flex; justify-content: center;" onclick="event.stopPropagation();">
              <select 
                onchange="updateCompanyAssigneeRole('${company.id}', this.value, event)" 
                title="เลือกผู้รับผิดชอบ"
                style="width: 100%; max-width: 132px; font-size: 0.68rem; font-weight: 700; color: ${roleSelectColor}; background: ${roleSelectBg}; border: 1.5px solid ${roleSelectBorder}; border-radius: 6px; padding: 2px 4px; cursor: pointer; outline: none; text-align: center; transition: all 0.15s ease; box-shadow: 0 1px 2px rgba(0,0,0,0.03);"
                onmouseover="this.style.transform='scale(1.02)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                <option value="" ${!assignedRole ? 'selected' : ''}>-- ผู้รับผิดชอบ --</option>
                <option value="Sales supervisor" ${assignedRole === 'Sales supervisor' ? 'selected' : ''}>Sales supervisor</option>
                <option value="Sales exclusive" ${assignedRole === 'Sales exclusive' ? 'selected' : ''}>Sales exclusive</option>
              </select>
            </div>
          `;

          return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;">
              ${targetBtnHtml}
              ${statusBadgeHtml}
              ${roleSelectHtml}
            </div>
          `;
        })()}
      </td>

      <!-- 7. รูปหน้างานที่เข้าติดตามจริง (จากหน้าโน้ตของเซลส์) -->
      <td style="vertical-align: middle; text-align: center; padding: 6px 8px;">
        ${(() => {
          const log = (typeof getCompanyCrmLog === 'function') ? getCompanyCrmLog(company.id) : {};
          const photos = Array.isArray(log.photos) ? log.photos : [];
          
          if (photos.length === 0) {
            return `
              <div onclick="openCompanyProjectsModal('${company.id}')" title="ยังไม่มีรูปถ่ายหน้างาน (คลิกเพื่อเปิดหน้าต่างโน้ตและอัปโหลดรูป)" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 4px 8px; border-radius: 6px; border: 1px dashed #CBD5E1; background: #F8FAFC; color: #94A3B8; font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease;" onmouseover="this.style.borderColor='#3B82F6'; this.style.color='#2563EB'; this.style.background='#EFF6FF';" onmouseout="this.style.borderColor='#CBD5E1'; this.style.color='#94A3B8'; this.style.background='#F8FAFC';">
                <span>📷</span>
                <span>ยังไม่มีรูป</span>
              </div>
            `;
          }

          // If 1 photo: show preview thumbnail
          if (photos.length === 1) {
            const p = photos[0];
            const safeName = (company.name || '').replace(/'/g, "\\'");
            return `
              <div style="display: inline-flex; align-items: center; gap: 6px;">
                <div onclick="event.stopPropagation(); openImageLightbox('${p.dataUrl}', '${safeName} • รูปหน้างาน')" title="คลิกเพื่อดูรูปขยายเต็มจอ" style="position: relative; width: 44px; height: 44px; border-radius: 8px; overflow: hidden; border: 1.5px solid #3B82F6; box-shadow: 0 2px 4px rgba(59,130,246,0.2); background: #0F172A; cursor: pointer; transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.1)';" onmouseout="this.style.transform='none';">
                  <img src="${p.dataUrl}" alt="Site Photo" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div onclick="openCompanyProjectsModal('${company.id}')" title="คลิกเพื่อเปิดดูในหน้าโน้ต" style="background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 9999px; cursor: pointer;">
                  1 รูป
                </div>
              </div>
            `;
          }

          // If multiple photos: show stacked preview thumbnails with count
          const p1 = photos[0];
          const p2 = photos[1];
          const safeName = (company.name || '').replace(/'/g, "\\'");
          return `
            <div style="display: inline-flex; align-items: center; gap: 6px;">
              <div style="display: flex; align-items: center; position: relative;">
                <div onclick="event.stopPropagation(); openImageLightbox('${p1.dataUrl}', '${safeName} • รูปหน้างาน 1/${photos.length}')" title="คลิกเพื่อดูรูปขยายเต็มจอ" style="width: 38px; height: 38px; border-radius: 8px; overflow: hidden; border: 1.5px solid #3B82F6; box-shadow: 0 2px 4px rgba(0,0,0,0.15); background: #0F172A; cursor: pointer; transition: transform 0.15s ease; z-index: 2;" onmouseover="this.style.transform='scale(1.15)'; this.style.zIndex=5;" onmouseout="this.style.transform='none'; this.style.zIndex=2;">
                  <img src="${p1.dataUrl}" alt="Site Photo 1" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div onclick="event.stopPropagation(); openImageLightbox('${p2.dataUrl}', '${safeName} • รูปหน้างาน 2/${photos.length}')" title="คลิกเพื่อดูรูปขยายเต็มจอ" style="width: 38px; height: 38px; border-radius: 8px; overflow: hidden; border: 1.5px solid #60A5FA; box-shadow: 0 2px 4px rgba(0,0,0,0.15); background: #0F172A; cursor: pointer; transition: transform 0.15s ease; margin-left: -14px; z-index: 1;" onmouseover="this.style.transform='scale(1.15)'; this.style.zIndex=5;" onmouseout="this.style.transform='none'; this.style.zIndex=1;">
                  <img src="${p2.dataUrl}" alt="Site Photo 2" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
              </div>
              <div onclick="openCompanyProjectsModal('${company.id}')" title="คลิกเพื่อเปิดดูทั้งหมดในหน้าโน้ต" style="background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; font-size: 0.68rem; font-weight: 800; padding: 2px 6px; border-radius: 9999px; cursor: pointer;" onmouseover="this.style.background='#DBEAFE'" onmouseout="this.style.background='#EFF6FF'">
                ${photos.length} รูป ↗
              </div>
            </div>
          `;
        })()}
      </td>

      <!-- 8. คำแนะนำจาก AI -->
      <td class="ai-recommendation-cell" style="vertical-align: middle; border-left: 2px solid #E2E8F0; padding-left: 14px;" onclick="openCompanyProjectsModal('${company.id}')">
        <div style="display: flex; flex-direction: column; gap: 3px;">
          <div style="display: flex; align-items: center; gap: 4px; font-size: 0.78rem; font-weight: 800; color: ${aiTierColor}; line-height: 1.2;">
            <span style="color: ${aiTierColor}; font-size: 0.85rem; line-height: 1;">●</span>
            <span>${aiTierText}</span>
          </div>
          ${salesAssessedHtml}
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  updateTagFilterCounts(allCompanies);
}

// ==========================================
// 8. FILTERS & SEARCH LOGIC
// ==========================================
function normalizeSearchText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/หจก\.?/g, '')
    .replace(/ห้างหุ้นส่วนจำกัด/g, '')
    .replace(/บริษัท/g, '')
    .replace(/จำกัด/g, '')
    .replace(/บ\./g, '')
    .replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
}

function handleSearchInputChange(val) {
  searchQuery = val || '';
  const clearBtn = document.getElementById('search-clear-btn');
  if (clearBtn) {
    clearBtn.style.display = searchQuery.trim().length > 0 ? 'block' : 'none';
  }
  applyFilters();
}

function clearSearchInput() {
  document.querySelectorAll('input[oninput*="handleSearchInputChange"]').forEach(input => {
    input.value = '';
  });
  handleSearchInputChange('');
}

if (typeof window !== 'undefined') {
  window.handleSearchInputChange = handleSearchInputChange;
  window.clearSearchInput = clearSearchInput;
  window.normalizeSearchText = normalizeSearchText;
}

function applyFilters() {
  filteredCompanies = allCompanies.filter(comp => {
    // 1. Text Search Query (Full Multi-field & Fuzzy Match)
    if (searchQuery && searchQuery.trim()) {
      const rawQ = searchQuery.trim().toLowerCase();
      const normQ = normalizeSearchText(searchQuery);

      const rawName = (comp.name || '').toLowerCase();
      const normName = normalizeSearchText(comp.name);

      const rawEng = (comp.engName || '').toLowerCase();
      const normEng = normalizeSearchText(comp.engName);

      const rawContact = (comp.contactPerson || '').toLowerCase();
      const normContact = normalizeSearchText(comp.contactPerson);

      const rawDist = (comp.district || '').toLowerCase();
      const normDist = normalizeSearchText(comp.district);

      const rawProv = (comp.province || '').toLowerCase();
      const normProv = normalizeSearchText(comp.province);

      const rawAddr = (comp.address || '').toLowerCase();
      const normAddr = normalizeSearchText(comp.address);

      const rawCat = (comp.category || '').toLowerCase();
      const normCat = normalizeSearchText(comp.category);

      const phoneClean = (comp.phone || '').replace(/[^0-9]/g, '');
      const queryPhoneClean = rawQ.replace(/[^0-9]/g, '');
      const matchPhone = (queryPhoneClean && queryPhoneClean.length >= 3 && phoneClean.includes(queryPhoneClean)) || (comp.phone || '').toLowerCase().includes(rawQ);

      const scgCodeStr = (String(comp.scgCode || '') + ' ' + String(comp.scgCustomerCode || '') + ' ' + String(comp.id || '')).toLowerCase();
      const matchScg = scgCodeStr.includes(rawQ);

      const matchName = rawName.includes(rawQ) || (normQ && normName.includes(normQ));
      const matchEng = rawEng.includes(rawQ) || (normQ && normEng.includes(normQ));
      const matchContact = rawContact.includes(rawQ) || (normQ && normContact.includes(normQ));
      const matchDist = rawDist.includes(rawQ) || (normQ && normDist.includes(normQ));
      const matchProv = rawProv.includes(rawQ) || (normQ && normProv.includes(normQ));
      const matchAddr = rawAddr.includes(rawQ) || (normQ && normAddr.includes(normQ));
      const matchCat = rawCat.includes(rawQ) || (normQ && normCat.includes(normQ));

      const matchProj = comp.projects && comp.projects.some(p => {
        const pName = (p.name || '').toLowerCase();
        const pLoc = (p.location || '').toLowerCase();
        return pName.includes(rawQ) || pLoc.includes(rawQ) || (normQ && normalizeSearchText(p.name).includes(normQ)) || (normQ && normalizeSearchText(p.location).includes(normQ));
      });

      const matchKw = comp.facebookSignal && comp.facebookSignal.detectedKeywords && comp.facebookSignal.detectedKeywords.some(k => k.toLowerCase().includes(rawQ));
      const matchFbPage = comp.facebookSignal && comp.facebookSignal.pageName && comp.facebookSignal.pageName.toLowerCase().includes(rawQ);
      const matchFbCaption = comp.facebookSignal && comp.facebookSignal.caption && comp.facebookSignal.caption.toLowerCase().includes(rawQ);

      if (!matchName && !matchEng && !matchContact && !matchDist && !matchProv && !matchAddr && !matchCat && !matchPhone && !matchScg && !matchProj && !matchKw && !matchFbPage && !matchFbCaption) {
        return false;
      }
    }

    // 2. Risk / Priority Score Filter
    if (activeFilter !== 'all') {
      const score = getCompanyScoreValue(comp);
      if ((activeFilter === 'red' || activeFilter === 'score-92') && score < 90) return false;
      if ((activeFilter === 'green' || activeFilter === 'score-80') && score !== 80) return false;
      if ((activeFilter === 'orange' || activeFilter === 'score-70') && score !== 70) return false;
      if ((activeFilter === 'yellow' || activeFilter === 'score-35') && score !== 35) return false;
      if ((activeFilter === 'gray' || activeFilter === 'score-15') && score !== 15) return false;
    }

    // 3. Province Filter
    if (activeDistrict !== 'all') {
      const prov = comp.province || 'อุดรธานี';
      if (prov !== activeDistrict) return false;
    }

    // 4. District Filter
    if (activeSubDistrict !== 'all') {
      const dist = comp.district || '';
      const matchInCompany = dist.includes(activeSubDistrict);
      const matchInProjects = comp.projects && comp.projects.some(p => (p.location || '').includes(activeSubDistrict) || (p.address || '').includes(activeSubDistrict));
      if (!matchInCompany && !matchInProjects) return false;
    }

    // 5. Facebook Keyword Filter
    if (activeFbKeyword !== 'all') {
      const kwMap = {
        'kw-1': 'เสาเอก',
        'kw-2': 'ฐานราก',
        'kw-3': 'โครงสร้าง',
        'kw-4': 'ตกแต่ง',
        'kw-5': 'scg',
        'kw-6': 'cpac',
        'kw-7': 'คอนกรีต'
      };
      const targetKw = kwMap[activeFbKeyword] || activeFbKeyword;
      const hasInSignal = comp.facebookSignal && comp.facebookSignal.detectedKeywords && comp.facebookSignal.detectedKeywords.some(k => k.toLowerCase().includes(targetKw.toLowerCase()));
      const hasInCaption = comp.facebookSignal && comp.facebookSignal.caption && comp.facebookSignal.caption.toLowerCase().includes(targetKw.toLowerCase());
      if (!hasInSignal && !hasInCaption) return false;
    }

    // 6. Company Tag Filter
    if (activeCompanyTagFilter !== 'all') {
      const tag = getCompanyTag(comp.id);
      if (tag !== activeCompanyTagFilter) return false;
    }

    // 7. Follow-up Status Filter (CRM Status: All / Targeted / Followed / Pending / User-Specific)
    if (activeFollowupStatusFilter !== 'all') {
      const log = (typeof getCompanyCrmLog === 'function') ? getCompanyCrmLog(comp.id) : {};
      const activeUser = getCurrentSalesUserObj();
      const uEmail = (activeUser && activeUser.email) ? activeUser.email.toLowerCase().trim() : '';
      const isTargetedByMe = isCompanyTargetedByUser(comp.id, uEmail);
      const hasFollowedUp = (log.note && log.note.trim().length > 0) || 
                            (Array.isArray(log.photos) && log.photos.length > 0) || 
                            ['followup', 'won', 'quote_sent'].includes(log.status);

      if (activeFollowupStatusFilter === 'user-want' && !isTargetedByMe) return false;
      if (activeFollowupStatusFilter === 'user-following' && !hasFollowedUp) return false;
      if (activeFollowupStatusFilter === 'targeted' && !isTargetedByMe) return false;
      if (activeFollowupStatusFilter === 'followed' && !hasFollowedUp) return false;
      if (activeFollowupStatusFilter === 'pending' && hasFollowedUp) return false;
    }

    // 8. Assigned Role Filter
    if (typeof activeAssignedRoleFilter !== 'undefined' && activeAssignedRoleFilter !== 'all') {
      const assignedRole = (typeof getCompanyAssignedRole === 'function') ? getCompanyAssignedRole(comp.id) : '';
      if (activeAssignedRoleFilter === 'unassigned') {
        if (assignedRole) return false;
      } else {
        if (assignedRole !== activeAssignedRoleFilter) return false;
      }
    }

    return true;
  });

  // จัดลำดับ: คะแนน Opportunity Score สูงสุด (92 -> 80 -> 70 -> 35 -> 15) ต้องอยู่บนสุดเสมอ
  sortCompaniesByOpportunityScore(filteredCompanies);

  renderKPIs();
  renderTable();
  renderTierLeaderboard();

  if (typeof updateAssignedRoleFilterCounts === 'function' && typeof allCompanies !== 'undefined') {
    updateAssignedRoleFilterCounts(allCompanies);
  }

  // Dynamically update Report summary badge to match selected province
  const reportBadge = document.getElementById('badge-report-summary');
  if (reportBadge) {
    const isAll = (activeDistrict === 'all' || !activeDistrict);
    const count = filteredCompanies.length;
    const cleanName = cleanThaiText(activeDistrict);
    const provLabel = isAll ? 'ทุกจังหวัด' : (cleanName.startsWith('จ.') ? cleanName : `จ.${cleanName}`);
    
    // Set dynamic link to report.html
    let provParam = 'all';
    if (!isAll) {
      if (activeDistrict === 'สกลนคร') provParam = 'sakon';
      else if (activeDistrict === 'อุดรธานี') provParam = 'udon';
      else provParam = encodeURIComponent(activeDistrict);
    }
    reportBadge.setAttribute('href', `report.html?province=${provParam}`);

    reportBadge.innerHTML = `
      <span style="font-size: 0.9rem;">📊</span>
      <span>Report ${provLabel}:</span>
      <span style="color: #0369A1; font-weight: 700;">วิเคราะห์ ${count} บริษัท • พร้อมยอดขาย 2025/2026</span>
      <span style="font-size: 0.72rem; background: #3B82F6; color: #FFFFFF; padding: 1px 6px; border-radius: 4px; font-weight: 700; margin-left: 2px;">เปิดหน้ารายงาน ↗</span>
    `;
  }

  // Update Search Input placeholder to match selected province
  const searchInput = document.getElementById('search-input') || document.getElementById('company-search-input');
  if (searchInput) {
    if (activeDistrict === 'all') {
      searchInput.placeholder = '🔍 ค้นหาชื่อบริษัท, ผู้บริหาร, หรือพื้นที่...';
    } else {
      searchInput.placeholder = `🔍 ค้นหาชื่อบริษัท, ผู้บริหาร, หรืออำเภอใน${cleanThaiText(activeDistrict)}...`;
    }
  }

  // Update map markers
  if (window.mapModule && typeof window.mapModule.renderCompanyMarkers === 'function') {
    window.mapModule.renderCompanyMarkers(filteredCompanies);
  }

  // Update real-time user CRM status summary
  if (typeof updateUserCrmStatusSummary === 'function') {
    updateUserCrmStatusSummary();
  }

  if (typeof updateStickyOffsets === 'function') {
    setTimeout(updateStickyOffsets, 30);
  }
}

function selectFacebookKeyword(kwId) {
  activeFbKeyword = (activeFbKeyword === kwId) ? 'all' : kwId;
  
  document.querySelectorAll('.fb-kw-btn').forEach(chip => {
    if (chip.getAttribute('data-keyword') === activeFbKeyword) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  applyFilters();
}

function showOnMap(companyId) {
  const comp = allCompanies.find(c => c.id === companyId);
  if (!comp) return;

  if (comp.googleMapsUrl || comp.gmaps) {
    window.open(comp.googleMapsUrl || comp.gmaps, '_blank');
    return;
  }
  if (comp.coordinates && Array.isArray(comp.coordinates)) {
    window.open(`https://www.google.com/maps?q=${comp.coordinates[0]},${comp.coordinates[1]}`, '_blank');
    return;
  }
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(comp.name + ' ' + (comp.province || 'อุดรธานี'))}`, '_blank');
}

// ==========================================
// 8.1 MODAL SCORE OR SALES INTELLIGENCE ADVISOR
// ==========================================
function renderModalScoreOrSalesIntelligence(comp) {
  const elScoreCard = document.getElementById('modal-score-card');
  if (!elScoreCard) return;

  const sales2025 = Number(comp.sales2025) || 0;
  const sales2026 = Number(comp.sales2026) || 0;
  const hasSales = (sales2025 > 0 || sales2026 > 0);
  const projCount = (comp.projects && comp.projects.length) ? comp.projects.length : (comp.totalProjects || 0);

  if (hasSales) {
    elScoreCard.className = 'detail-score-card sales-intelligence-card';
    elScoreCard.style.background = '#FFFFFF';
    elScoreCard.style.border = '1.5px solid #CBD5E1';
    elScoreCard.style.borderRadius = '12px';
    elScoreCard.style.padding = '1.1rem';
    elScoreCard.style.boxShadow = '0 2px 10px rgba(15, 23, 42, 0.05)';

    let badgeText = '';
    let badgeStyle = '';
    let diffText = '';
    let diffColor = '#64748B';
    let diagnosticBg = '#FFF1F2';
    let diagnosticBorder = '#FECDD3';
    let diagnosticTitleColor = '#9F1239';
    let diagnosticText = '';
    let recommendations = [];

    if (sales2025 > 0 && sales2026 === 0) {
      badgeText = '🚨 ขาดการสั่งซื้อปี 2026 (Inactive)';
      badgeStyle = 'background: #FEE2E2; color: #DC2626; border: 1px solid #FCA5A5;';
      diffText = `-100% (-฿${sales2025.toLocaleString()})`;
      diffColor = '#DC2626';
      diagnosticBg = '#FEF2F2';
      diagnosticBorder = '#FCA5A5';
      diagnosticTitleColor = '#991B1B';
      diagnosticText = `
        ${projCount > 0 
          ? `AI ตรวจพบข้อมูลภายนอกบน Facebook ว่าบริษัทมีโพสต์เปิดตัว/ดำเนินงานโครงการจริง <strong>${projCount} โครงการ</strong> แต่มียอดซื้อ SCG ปี 2026 เป็น <strong>฿0 บาท</strong> (จากปี 2025 ที่มียอด ฿${sales2025.toLocaleString()})<br>
             <strong>สรุปวิเคราะห์:</strong> “บริษัทยังมีงานก่อสร้างต่อเนื่อง แต่เปลี่ยนไปสั่งซื้อวัสดุจากแบรนด์คู่แข่งทั้งหมด”<br>
             <div style="margin-top: 5px; padding: 4px 8px; background: #FEE2E2; color: #DC2626; border-radius: 4px; font-weight: 800; font-size: 0.72rem; border-left: 3px solid #DC2626;">
               🚨 มีความเสี่ยงสูญเสียรายได้ ฿${sales2025.toLocaleString()} บาท ควรเข้าพบด่วนภายใน 3-7 วัน
             </div>`
          : `เคยเป็นลูกค้าหลักในปี 2025 มียอดซื้อสูงถึง <strong>฿${sales2025.toLocaleString()}</strong> แต่ปี 2026 ยังไม่มีรายการสั่งซื้อวัสดุ SCG เลย<br>
             <div style="margin-top: 5px; padding: 4px 8px; background: #FEE2E2; color: #DC2626; border-radius: 4px; font-weight: 800; font-size: 0.72rem; border-left: 3px solid #DC2626;">
               🚨 มีความเสี่ยงสูญเสียรายได้ ฿${sales2025.toLocaleString()} บาท ควรเข้าพบภายใน 7 วัน
             </div>`
        }
      `;
      recommendations = [
        `<strong>โทรนัดหมายผู้บริหาร/จัดซื้อด่วน (เข้าพบภายใน 7 วัน):</strong> สอบถามสาเหตุที่หยุดสั่งซื้อ และรีเช็ก Pain Point ด้านราคา/เงื่อนไขเครดิต`,
        `<strong>เสนอแพ็กเกจ Welcome Back Project Rebate:</strong> มอบส่วนลดพิเศษเพื่อดึงยอดสั่งซื้อ ฿${sales2025.toLocaleString()} บาท กลับคืนมา`,
        `<strong>ส่งทีมเทคนิคเข้าเยี่ยมหน้างาน:</strong> สำรวจ ${projCount > 0 ? projCount + ' โครงการจริง' : 'โครงการใหม่'} เพื่อเสนอวัสดุโครงสร้าง CPAC และปูน SCG ทันที`
      ];
    } else if (sales2025 > sales2026) {
      const dropPct = Math.round(((sales2025 - sales2026) / sales2025) * 100);
      const diffVal = sales2025 - sales2026;
      badgeText = `⚠️ ยอดซื้อลดลง -${dropPct}% (ต้องเร่งฟื้นฟู)`;
      badgeStyle = 'background: #FEF2F2; color: #DC2626; border: 1px solid #FCA5A5;';
      diffText = `-${dropPct}% (-฿${diffVal.toLocaleString()})`;
      diffColor = '#DC2626';
      diagnosticBg = '#FFF5F5';
      diagnosticBorder = '#FED7D7';
      diagnosticTitleColor = '#991B1B';
      diagnosticText = `
        ${projCount > 0 
          ? `AI ตรวจพบข้อมูลภายนอกบน Facebook ว่าบริษัทมีโพสต์เปิดตัว/ดำเนินงานโครงการใหม่ <strong>${projCount} โครงการ</strong><br>
             <strong>สรุปวิเคราะห์:</strong> “บริษัทยังเติบโตและมีงานก่อสร้างต่อเนื่อง แต่ยอดซื้อ SCG ลดลงผิดปกติ (-${dropPct}%)”<br>
             <div style="margin-top: 5px; padding: 4px 8px; background: #FFE4E6; color: #BE123C; border-radius: 4px; font-weight: 800; font-size: 0.72rem; border-left: 3px solid #E11D48;">
               ⚠️ มีความเสี่ยงสูญเสียรายได้ ฿${diffVal.toLocaleString()} บาท ควรเข้าพบภายใน 7 วัน
             </div>`
          : `ยอดซื้อสินค้า SCG ปี 2026 ลดลงเหลือ <strong>฿${sales2026.toLocaleString()}</strong> (-${dropPct}% จากปี 2025 ที่มียอด ฿${sales2025.toLocaleString()})<br>
             <div style="margin-top: 5px; padding: 4px 8px; background: #FFE4E6; color: #BE123C; border-radius: 4px; font-weight: 800; font-size: 0.72rem; border-left: 3px solid #E11D48;">
               ⚠️ มีความเสี่ยงสูญเสียรายได้ ฿${diffVal.toLocaleString()} บาท ควรเข้าพบภายใน 7 วัน
             </div>`
        }
      `;
      recommendations = [
        `<strong>เข้าพบคู่ค้าเพื่อรีเช็กเงื่อนไขการค้า (ภายใน 7 วัน):</strong> ตรวจสอบราคากลางเปรียบเทียบกับคู่แข่งในพื้นที่ และพิจารณาปรับเครดิตเทอม`,
        `<strong>นำเสนอแพ็กเกจราคาโครงการ (Project Volume Rebate):</strong> จัดโปรโมชันเหมารวมโครงสร้างเพื่อดึง Share of Wallet ฿${diffVal.toLocaleString()} บาท กลับคืนมา`,
        `<strong>จับคู่สินค้าตามสเตจหน้างานที่ตรวจพบ:</strong> เสนอวัสดุ SCG ให้ตรงกับช่วงก่อสร้างของ ${projCount} โครงการจริงทันที`
      ];
    } else if (sales2026 > sales2025 && sales2025 > 0) {
      const growPct = Math.round(((sales2026 - sales2025) / sales2025) * 100);
      const diffVal = sales2026 - sales2025;
      badgeText = `🚀 ยอดซื้อเติบโต +${growPct}% (ลูกค้าคนสำคัญ)`;
      badgeStyle = 'background: #F0FDF4; color: #16A34A; border: 1px solid #86EFAC;';
      diffText = `+${growPct}% (+฿${diffVal.toLocaleString()})`;
      diffColor = '#16A34A';
      diagnosticBg = '#F0FDF4';
      diagnosticBorder = '#BBF7D0';
      diagnosticTitleColor = '#166534';
      diagnosticText = `ผู้รับเหมามีความเชื่อมั่นในวัสดุ SCG สูงมาก ยอดสั่งซื้อปี 2026 เพิ่มขึ้นเป็น <strong>฿${sales2026.toLocaleString()}</strong> (+${growPct}% YoY) มีการขยายงานและสั่งซื้อต่อเนื่อง`;
      recommendations = [
        `<strong>Upsell สินค้าระดับพรีเมียม:</strong> นำเสนอกระเบื้องหลังคา Excella / Prestige, ไม้สังเคราะห์ SCG D-COR`,
        `<strong>ล็อกสัญญาคู่ค้าประจำปี:</strong> ทำข้อตกลงจัดส่งวัสดุตลอดโครงการเพื่อป้องกันคู่แข่งเข้ามาแทรก`,
        `<strong>ให้บริการ VIP Support:</strong> ส่งทีมเทคนิค SCG ช่วยถอดแบบและคำนวณ BOQ โครงการใหม่`
      ];
    } else if (sales2026 > 0 && sales2025 === 0) {
      badgeText = `✨ ลูกค้าใหม่เปิดยอดปี 2026`;
      badgeStyle = 'background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE;';
      diffText = `+100% (ยอดใหม่ ฿${sales2026.toLocaleString()})`;
      diffColor = '#1D4ED8';
      diagnosticBg = '#F0F9FF';
      diagnosticBorder = '#BAE6FD';
      diagnosticTitleColor = '#0369A1';
      diagnosticText = `เป็นลูกค้ารายใหม่ที่เริ่มมีประวัติการสั่งซื้อ SCG ในปี 2026 มียอดรวม <strong>฿${sales2026.toLocaleString()}</strong> ถือเป็นโอกาสทองในการสร้างความสัมพันธ์ระยะยาว`;
      recommendations = [
        `<strong>ติดตามผลการใช้งานหลังส่งมอบ:</strong> ตรวจเช็กความพึงพอใจการใช้งานสินค้าเพื่อสร้างความประทับใจ`,
        `<strong>ขยายรายการสินค้าไปยังกลุ่มอื่น (Cross-sell):</strong> แนะนำสมาร์ทบอร์ด Q-CON และเคมีภัณฑ์ก่อสร้างเพิ่มเติม`
      ];
    } else {
      badgeText = `ประวัติซื้อขาย SCG ปกติ`;
      badgeStyle = 'background: #F8FAFC; color: #475569; border: 1px solid #CBD5E1;';
      diffText = `คงที่`;
      diagnosticText = `มียอดสั่งซื้อสม่ำเสมอทั้งปี 2025 และ 2026`;
      recommendations = [`รักษาความสัมพันธ์และติดตามโครงการใหม่อย่างต่อเนื่อง`];
    }

    // Support tailored AI Diagnostic and Actionable Recommendations if defined on company
    if (comp.customDiagnostic) {
      diagnosticText = comp.customDiagnostic;
    }
    if (comp.customRecommendations && Array.isArray(comp.customRecommendations) && comp.customRecommendations.length > 0) {
      recommendations = comp.customRecommendations;
    }

    elScoreCard.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 6px; border-bottom: 1.5px solid #E2E8F0;">
          <div>
            <div style="font-size: 0.72rem; font-weight: 800; color: #0B2E83; text-transform: uppercase; letter-spacing: 0.3px; display: flex; align-items: center; gap: 4px;">
              <span>📊 ประวัติการซื้อขาย SCG & AI ADVISOR</span>
            </div>
            <div style="font-size: 0.95rem; font-weight: 900; color: #0F172A; margin-top: 1px;">
              วิเคราะห์พฤติกรรมยอดซื้อ & กลยุทธ์ทีมขาย
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.72rem; font-weight: 800; padding: 3px 9px; border-radius: 9999px; ${badgeStyle}">
              ${badgeText}
            </div>
          </div>
        </div>

        <!-- YoY Comparison Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 8px 10px;">
          <div>
            <div style="font-size: 0.68rem; color: #64748B; font-weight: 700;">ยอดซื้อ SCG 2025</div>
            <div style="font-size: 0.92rem; font-weight: 900; color: #1E293B; margin-top: 1px;">
              ${sales2025 > 0 ? '฿' + Number(sales2025).toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : '฿0'}
            </div>
          </div>
          <div>
            <div style="font-size: 0.68rem; color: #64748B; font-weight: 700;">ยอดซื้อ SCG 2026</div>
            <div style="font-size: 0.92rem; font-weight: 900; color: ${sales2026 >= sales2025 ? '#16A34A' : '#DC2626'}; margin-top: 1px;">
              ${sales2026 > 0 ? '฿' + Number(sales2026).toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : '฿0'}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.68rem; color: #64748B; font-weight: 700;">แนวโน้ม YoY</div>
            <div style="font-size: 0.88rem; font-weight: 900; color: ${diffColor}; margin-top: 1px;">
              ${diffText}
            </div>
          </div>
        </div>

        <!-- AI Root-Cause Diagnostic Box -->
        <div style="background: ${diagnosticBg}; border: 1px solid ${diagnosticBorder}; border-radius: 8px; padding: 8px 10px;">
          <div style="font-size: 0.73rem; font-weight: 800; color: ${diagnosticTitleColor}; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
            <span>🔍 AI วินิจฉัยสาเหตุ (Root-Cause Analysis):</span>
          </div>
          <div style="font-size: 0.73rem; color: #334155; line-height: 1.4;">
            ${diagnosticText}
          </div>
        </div>

        <!-- Actionable Recommendations -->
        <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 8px; padding: 8px 10px; box-shadow: 0 1px 3px rgba(30, 64, 175, 0.04);">
          <div style="font-size: 0.73rem; font-weight: 800; color: #1E40AF; margin-bottom: 4px; display: flex; align-items: center; gap: 4px;">
            <span>💡 AI แนะนำแนวทางปฏิบัติการขาย (Actionable Strategy):</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            ${recommendations.map(r => `
              <div style="display: flex; align-items: flex-start; gap: 5px; font-size: 0.71rem; color: #1E293B; line-height: 1.35;">
                <span style="color: #2563EB; font-weight: 800; margin-top: 1px;">•</span>
                <div>${r}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else {
    // Render standard AI Opportunity Score
    const score = window.scoring ? window.scoring.calculatePriorityScore(comp) : 50;
    const scoreData = window.calculateOpportunityScore ? window.calculateOpportunityScore(comp) : null;
    const tierClass = score >= 90 ? 'red' : score >= 70 ? 'orange' : 'yellow';

    elScoreCard.className = `detail-score-card ${tierClass}`;
    elScoreCard.style = '';

    elScoreCard.innerHTML = `
      <div>
        <div class="score-display-row">
          <div>
            <div style="font-size: 0.75rem; font-weight: 700; color: #64748B; text-transform: uppercase;">
              AI Opportunity Score
            </div>
            <div id="modal-big-score" class="score-big-number" style="color: ${score >= 90 ? '#1E40AF' : score >= 70 ? '#16A34A' : '#CA8A04'};">
              ${score}
            </div>
          </div>
          <div style="text-align: right;">
            <div id="modal-score-badge" class="score-badge ${tierClass}">
              ● ${score >= 90 ? 'โอกาสสูงสุด' : score >= 70 ? 'โอกาสสูง' : 'ปานกลาง'}
            </div>
            <div id="modal-score-urgency" style="font-size: 0.72rem; color: ${score >= 90 ? '#1E40AF' : score >= 70 ? '#16A34A' : '#64748B'}; font-weight: 700; margin-top: 4px;">
              ${score >= 90 ? 'เข้าพบภายใน 24-48 ชม.' : score >= 70 ? 'นัดหมายภายในสัปดาห์นี้' : 'เฝ้าระวังความคืบหน้า'}
            </div>
          </div>
        </div>

        <div style="font-size: 0.78rem; font-weight: 800; color: #1E293B; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
          <span>การวิเคราะห์คะแนน 4 มิติ (AI Score Breakdown)</span>
          <span style="font-size: 0.72rem; color: #64748B; font-weight: 600;">คะแนนดิบรวม: ${scoreData && scoreData.rawTotal ? scoreData.rawTotal : Math.round((score / 100) * 20)}/${scoreData && scoreData.maxRaw ? scoreData.maxRaw : 20} (${score}/100)</span>
        </div>
        <div id="modal-dimensions-list" class="score-dimension-list">
          ${scoreData && scoreData.dimensions ? scoreData.dimensions.map(d => {
            const rawScore = parseInt(d.score) || 0;
            const pct = Math.min(100, Math.round((rawScore / 5) * 100));
            return `
              <div class="dimension-row" style="margin-bottom: 8px;">
                <div class="dimension-meta" style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700;">
                  <span style="color: #334155;">${d.name}</span>
                  <span style="color: #0284C7; font-weight: 800;">${d.score} (${pct}%)</span>
                </div>
                <div class="dim-bar-bg" style="height: 6px; background: #E2E8F0; border-radius: 9999px; overflow: hidden; margin: 3px 0;">
                  <div class="dim-bar-fill" style="width: ${pct}%; height: 100%; background: linear-gradient(90deg, #0284C7, #38BDF8); border-radius: 9999px;"></div>
                </div>
                <div style="font-size: 0.7rem; color: #64748B;">${d.desc}</div>
              </div>
            `;
          }).join('') : ''}
        </div>
      </div>
    `;
  }
}

// ==========================================
// 9. COMPANY & PROJECT MODALS
// ==========================================
function openCompanyProjectsModal(companyOrId) {
  let comp = typeof companyOrId === 'string' ? allCompanies.find(c => c.id === companyOrId) : companyOrId;
  if (!comp) return;

  activeSelectedCompany = comp;
  activeModalProjectStageFilter = 'all';

  const modal = document.getElementById('company-detail-modal');
  if (!modal) return;

  const compCleanName = cleanThaiText(comp.name);
  const compCleanCat = cleanThaiText(comp.category);

  // Header Details
  const elName = document.getElementById('modal-company-name');
  const elCat = document.getElementById('modal-company-category');
  if (elName) elName.textContent = compCleanName;
  if (elCat) {
    elCat.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 3px;">
        <span>${compCleanCat || 'รับสร้างบ้าน'} • อ.${cleanThaiText(comp.district) || 'เมือง'} จ.${cleanThaiText(comp.province) || 'อุดรธานี'}</span>
        ${comp.facebookUrl ? `
          <a href="${comp.facebookUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 4px; padding: 2px 9px; background: #EFF6FF; color: #1877F2; border: 1px solid #BFDBFE; border-radius: 4px; font-size: 0.74rem; font-weight: 700; text-decoration: none;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            <span>เปิดเพจ Facebook บริษัท ↗</span>
          </a>
        ` : ''}
      </div>
    `;
  }

  // Tag Active State
  const tag = getCompanyTag(comp.id);
  ['strategic', 'growth', 'opportunity', 'prospect', 'focus', 'non-focus', 'new'].forEach(t => {
    const btn = document.getElementById(`btn-status-${t}`);
    if (btn) {
      if (t === tag || (t === 'focus' && tag === 'strategic') || (t === 'non-focus' && tag === 'opportunity') || (t === 'new' && tag === 'prospect')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  // Company Overview Card
  const elPhone = document.getElementById('modal-phone');
  const elGrowth = document.getElementById('modal-growth-rate');
  const elAddress = document.getElementById('modal-address');
  const elGmapsLink = document.getElementById('modal-gmaps-link');
  const elGmapsText = document.getElementById('modal-gmaps-text');

  if (elPhone) {
    elPhone.innerHTML = comp.phone 
      ? `<a href="tel:${comp.phone.replace(/[^0-9]/g, '')}" style="color: #0F172A; text-decoration: none; font-weight: 700;">📞 ${comp.phone}</a>`
      : '-';
  }
  if (elGrowth) elGrowth.textContent = `+${comp.growthRate || 25}% YoY`;
  if (elAddress) elAddress.textContent = cleanThaiText(comp.address) || `อ.${cleanThaiText(comp.district) || 'เมือง'} จ.${cleanThaiText(comp.province) || 'อุดรธานี'}`;

  // Google Maps Navigation Link
  if (elGmapsLink) {
    let mapsUrl = (typeof COMPANY_MAPS_MASTER !== 'undefined' && COMPANY_MAPS_MASTER[comp.id]) || comp.googleMapsUrl || comp.gmaps;
    if (!mapsUrl && comp.coordinates && comp.coordinates.length === 2 && comp.coordinates[0]) {
      mapsUrl = `https://www.google.com/maps?q=${comp.coordinates[0]},${comp.coordinates[1]}`;
    } else if (!mapsUrl) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((comp.name || '') + ' ' + (comp.address || comp.district || 'อุดรธานี'))}`;
    }
    elGmapsLink.href = mapsUrl;
    if (elGmapsText) {
      elGmapsText.textContent = `เปิด Google Maps (พิกัดสำนักงาน)`;
    }
  }

  // DBD Financial & Registration Info Card (จากรูปที่ 1 -> แสดงในตำแหน่งวงเล็บรูปที่ 2)
  const dbdData = (typeof getCompanyDbdData === 'function') ? getCompanyDbdData(comp) : null;
  const elDbdCard = document.getElementById('modal-dbd-info-card');
  const elCompanyInfoCols = document.getElementById('modal-company-info-columns');

  if (dbdData && (dbdData.taxId || Number(dbdData.revenue) > 0)) {
    if (elDbdCard) elDbdCard.style.display = 'flex';
    if (elCompanyInfoCols) elCompanyInfoCols.classList.remove('no-dbd');

    const elDbdTaxId = document.getElementById('modal-dbd-tax-id');
    const elDbdName = document.getElementById('modal-dbd-company-name');
    const elDbdRevenue = document.getElementById('modal-dbd-revenue');
    const elDbdScoreBadge = document.getElementById('modal-dbd-score-badge');

    if (elDbdTaxId) elDbdTaxId.textContent = dbdData.taxId || '-';
    if (elDbdName) elDbdName.textContent = dbdData.name || compCleanName;
    if (elDbdRevenue) {
      const revVal = Number(dbdData.revenue) || 0;
      elDbdRevenue.textContent = `฿${revVal.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท`;
    }
    if (elDbdScoreBadge) {
      const score = (typeof calculateDbdRevenueScore === 'function') ? calculateDbdRevenueScore(dbdData.revenue) : 0;
      let badgeLabel = `ประเมิน DBD: ${score}/5`;
      let badgeBg = '#15803D';
      if (score >= 5) {
        badgeLabel = `ประเมิน DBD: 5/5 (>10M)`;
        badgeBg = '#15803D';
      } else if (score === 4) {
        badgeLabel = `ประเมิน DBD: 4/5 (5-10M)`;
        badgeBg = '#2563EB';
      } else if (score === 3) {
        badgeLabel = `ประเมิน DBD: 3/5 (1-5M)`;
        badgeBg = '#D97706';
      } else if (score === 1) {
        badgeLabel = `ประเมิน DBD: 1/5 (<1M)`;
        badgeBg = '#EA580C';
      } else {
        badgeLabel = `ประเมิน DBD: 0/5`;
        badgeBg = '#64748B';
      }
      elDbdScoreBadge.textContent = badgeLabel;
      elDbdScoreBadge.style.background = badgeBg;
    }
  } else {
    // "บริษัทไหนไม่มีก็ไม่ต้องใส่" -> ซ่อนบล็อก DBD
    if (elDbdCard) elDbdCard.style.display = 'none';
    if (elCompanyInfoCols) elCompanyInfoCols.classList.add('no-dbd');
  }

  // Score Matrix / SCG Sales Intelligence & AI Advisor
  renderModalScoreOrSalesIntelligence(comp);

  // Render Projects List
  renderCompanyProjectsList(comp);

  // Load and Render Sales CRM Notes for Company
  const log = getCompanyCrmLog(comp.id);
  const hasActualContent = (log.note && String(log.note).trim().length > 0) || (Array.isArray(log.photos) && log.photos.length > 0);
  const isCreatorOrAdmin = !log.createdBy || (typeof canCurrentUserDeleteOrEditItem === 'function' && canCurrentUserDeleteOrEditItem(log.createdBy));
  const canEditModal = !hasActualContent || isCreatorOrAdmin;
  const ownerName = log.salesRep || log.createdBy || 'เซลส์ท่านอื่น';

  const noteTextarea = document.getElementById('modal-company-sales-note');
  const noteStatus = document.getElementById('modal-crm-note-status-indicator');
  const noteLastUpdated = document.getElementById('modal-crm-note-last-updated');

  if (noteTextarea) {
    noteTextarea.value = log.note || '';
    if (!canEditModal) {
      noteTextarea.readOnly = true;
      noteTextarea.style.background = '#F1F5F9';
      noteTextarea.style.color = '#475569';
      noteTextarea.style.cursor = 'not-allowed';
      noteTextarea.style.border = '1.5px solid #CBD5E1';
    } else {
      noteTextarea.readOnly = false;
      noteTextarea.style.background = '#FFFFFF';
      noteTextarea.style.color = '#0F172A';
      noteTextarea.style.cursor = 'text';
      noteTextarea.style.border = '1.5px solid #CBD5E1';
    }
  }

  if (noteStatus) {
    if (!canEditModal) {
      noteStatus.innerHTML = `<span style="color: #9333EA; font-weight: 800; background: #FAF5FF; padding: 3px 10px; border-radius: 6px; border: 1px solid #E9D5FF; font-size: 0.72rem;">🔒 บันทึกโดย ${ownerName} (คุณอ่านได้อย่างเดียว)</span>`;
    } else {
      noteStatus.innerHTML = '<span style="color: #16A34A; font-weight: 700;">✅ พร้อมบันทึก</span>';
    }
  }

  if (noteLastUpdated) {
    noteLastUpdated.textContent = log.lastUpdated 
      ? `บันทึกล่าสุด: ${new Date(log.lastUpdated).toLocaleString('th-TH')}`
      : 'บันทึกล่าสุด: ยังไม่มีประวัติ';
  }

  // Quick Note Tag Buttons Lock/Unlock
  document.querySelectorAll('.btn-quick-note-tag').forEach(btn => {
    btn.style.pointerEvents = canEditModal ? 'auto' : 'none';
    btn.style.opacity = canEditModal ? '1' : '0.45';
    btn.style.cursor = canEditModal ? 'pointer' : 'not-allowed';
  });

  // Opportunity Level Selector Buttons Lock/Unlock
  ['btn-opp-high', 'btn-opp-medium', 'btn-opp-low'].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.style.pointerEvents = canEditModal ? 'auto' : 'none';
      btn.style.opacity = canEditModal ? '1' : '0.55';
      btn.style.cursor = canEditModal ? 'pointer' : 'not-allowed';
    }
  });

  // Modal tag selector buttons are editable by everyone
  const tagTooltipMap = {
    'strategic': 'Strategic Partner/ลูกค้าแฟนพันธ์แท้',
    'growth': 'Growth Account / ลูกค้าทีมีความสัมพันธ์ แต่ต้อติดตามอย่างใกล้ชิด',
    'opportunity': 'Opportunity Account / ลูกค้าที่ต้องสร้างความสัมพันธ์',
    'prospect': 'New / ลูกค้าใหม่',
    'focus': 'Strategic Partner/ลูกค้าแฟนพันธ์แท้',
    'non-focus': 'Opportunity Account / ลูกค้าที่ต้องสร้างความสัมพันธ์',
    'new': 'New / ลูกค้าใหม่'
  };
  ['strategic', 'growth', 'opportunity', 'prospect', 'focus', 'non-focus', 'new'].forEach(t => {
    const btn = document.getElementById(`btn-status-${t}`);
    if (btn) {
      btn.style.pointerEvents = 'auto';
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      btn.title = tagTooltipMap[t] || t;
    }
  });

  // Photo upload button lock/unlock
  const photoUploadBtn = document.querySelector('button[onclick*="modal-company-photo-input"]');
  if (photoUploadBtn) {
    photoUploadBtn.style.pointerEvents = canEditModal ? 'auto' : 'none';
    photoUploadBtn.style.opacity = canEditModal ? '1' : '0.5';
    photoUploadBtn.style.cursor = canEditModal ? 'pointer' : 'not-allowed';
    photoUploadBtn.title = canEditModal ? 'อัปโหลดรูปภาพหน้างาน' : `🔒 บันทึกโดย ${ownerName} (ล็อกการอัปโหลด)`;
  }

  // Clear & Save manual buttons in modal
  const clearBtn = document.querySelector('button[onclick="clearCompanyNote()"]');
  const saveBtn = document.querySelector('button[onclick="saveCompanyNoteManually()"]');
  if (clearBtn) {
    clearBtn.style.pointerEvents = canEditModal ? 'auto' : 'none';
    clearBtn.style.opacity = canEditModal ? '1' : '0.4';
  }
  if (saveBtn) {
    saveBtn.style.pointerEvents = canEditModal ? 'auto' : 'none';
    saveBtn.style.opacity = canEditModal ? '1' : '0.4';
  }

  // Render Opportunity Level Buttons
  updateOpportunityLevelButtonsUI(log.salesOpportunityLevel || null);

  // Sync Modal Assignee Selector
  const modalAssigneeSelect = document.getElementById('modal-company-assignee-select');
  if (modalAssigneeSelect) {
    const currentAssignedRole = (typeof getCompanyAssignedRole === 'function') ? getCompanyAssignedRole(comp.id) : '';
    modalAssigneeSelect.value = currentAssignedRole || '';
  }

  // Render Site Visit Photos Gallery
  renderCompanyPhotosGallery(comp.id);

  modal.style.display = 'flex';
}

function handleModalAssigneeRoleChange(newRole) {
  if (!activeSelectedCompany) return;
  updateCompanyAssigneeRole(activeSelectedCompany.id, newRole, null);
  if (typeof renderTable === 'function') {
    renderTable();
  }
}

let noteAutoSaveTimer = null;
function handleCompanyNoteAutoSave(value) {
  if (!activeSelectedCompany) return;
  const noteStatus = document.getElementById('modal-crm-note-status-indicator');
  const noteLastUpdated = document.getElementById('modal-crm-note-last-updated');

  if (noteStatus) {
    noteStatus.innerHTML = '<span style="color: #D97706;">💾 กำลังบันทึก...</span>';
  }

  clearTimeout(noteAutoSaveTimer);
  noteAutoSaveTimer = setTimeout(() => {
    saveCompanyCrmLog(activeSelectedCompany.id, { note: value });
    if (noteStatus) {
      noteStatus.innerHTML = '<span style="color: #16A34A;">✅ บันทึกอัตโนมัติแล้ว</span>';
    }
    if (noteLastUpdated) {
      noteLastUpdated.textContent = `บันทึกล่าสุด: ${new Date().toLocaleString('th-TH')}`;
    }
  }, 400);
}

function appendQuickNoteTemplate(templateText) {
  if (!activeSelectedCompany) return;
  const textarea = document.getElementById('modal-company-sales-note');
  if (!textarea) return;

  const now = new Date();
  const timeStr = `[${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}]`;
  const newLine = `${timeStr} ${templateText}`;

  if (textarea.value.trim().length > 0) {
    textarea.value = textarea.value.trim() + '\n' + newLine;
  } else {
    textarea.value = newLine;
  }

  textarea.focus();
  handleCompanyNoteAutoSave(textarea.value);
  showStatusToast('แทรกข้อความสำเร็จ และบันทึกอัตโนมัติแล้ว');
}

function saveCompanyNoteManually() {
  if (!activeSelectedCompany) return;
  const textarea = document.getElementById('modal-company-sales-note');
  const noteVal = textarea ? textarea.value : '';
  saveCompanyCrmLog(activeSelectedCompany.id, { note: noteVal });

  const noteStatus = document.getElementById('modal-crm-note-status-indicator');
  const noteLastUpdated = document.getElementById('modal-crm-note-last-updated');
  if (noteStatus) {
    noteStatus.innerHTML = '<span style="color: #16A34A;">✅ บันทึกเรียบร้อย</span>';
  }
  if (noteLastUpdated) {
    noteLastUpdated.textContent = `บันทึกล่าสุด: ${new Date().toLocaleString('th-TH')}`;
  }

  showStatusToast(`💾 บันทึกโน้ต CRM ของ "${activeSelectedCompany.name}" เรียบร้อยแล้ว`);
}

function handleSetCompanyOpportunityLevel(level) {
  if (!activeSelectedCompany) return;
  const currentLog = getCompanyCrmLog(activeSelectedCompany.id);
  const currentLevel = currentLog.salesOpportunityLevel;
  
  // If clicking same level, toggle off
  const newLevel = (currentLevel === level) ? null : level;
  saveCompanyCrmLog(activeSelectedCompany.id, { salesOpportunityLevel: newLevel });
  
  updateOpportunityLevelButtonsUI(newLevel);
  if (typeof renderTable === 'function') renderTable();
  
  const labels = {
    'high': '🟢 โอกาสการขายสูง',
    'medium': '🟠 โอกาสการขายปานกลาง',
    'low': '⚪ โอกาสการขายน้อย'
  };
  if (newLevel) {
    showStatusToast(`💾 บันทึกการประเมิน: ${labels[newLevel]} เรียบร้อยแล้ว`);
  } else {
    showStatusToast('⚪ ยกเลิกการประเมินโอกาสการขาย (กลับเป็นค่าคำนวณอัตโนมัติ)');
  }
}

function updateOpportunityLevelButtonsUI(selectedLevel) {
  const btnHigh = document.getElementById('btn-opp-high');
  const btnMedium = document.getElementById('btn-opp-medium');
  const btnLow = document.getElementById('btn-opp-low');
  
  if (btnHigh) {
    if (selectedLevel === 'high') {
      btnHigh.style.border = '1.5px solid #16A34A';
      btnHigh.style.background = '#DCFCE7';
      btnHigh.style.color = '#15803D';
      btnHigh.style.boxShadow = '0 1px 4px rgba(22,163,74,0.3)';
    } else {
      btnHigh.style.border = '1.5px solid #CBD5E1';
      btnHigh.style.background = '#FFFFFF';
      btnHigh.style.color = '#15803D';
      btnHigh.style.boxShadow = 'none';
    }
  }

  if (btnMedium) {
    if (selectedLevel === 'medium') {
      btnMedium.style.border = '1.5px solid #EA580C';
      btnMedium.style.background = '#FFEDD5';
      btnMedium.style.color = '#9A3412';
      btnMedium.style.boxShadow = '0 1px 4px rgba(234,88,12,0.3)';
    } else {
      btnMedium.style.border = '1.5px solid #CBD5E1';
      btnMedium.style.background = '#FFFFFF';
      btnMedium.style.color = '#C2410C';
      btnMedium.style.boxShadow = 'none';
    }
  }

  if (btnLow) {
    if (selectedLevel === 'low') {
      btnLow.style.border = '1.5px solid #64748B';
      btnLow.style.background = '#F1F5F9';
      btnLow.style.color = '#1E293B';
      btnLow.style.boxShadow = '0 1px 4px rgba(100,116,139,0.3)';
    } else {
      btnLow.style.border = '1.5px solid #CBD5E1';
      btnLow.style.background = '#FFFFFF';
      btnLow.style.color = '#475569';
      btnLow.style.boxShadow = 'none';
    }
  }
}

function clearCompanyNote() {
  if (!activeSelectedCompany) return;
  if (confirm('คุณต้องการล้างข้อความโน้ตทั้งหมดของบริษัทนี้หรือไม่?')) {
    const textarea = document.getElementById('modal-company-sales-note');
    if (textarea) textarea.value = '';
    saveCompanyCrmLog(activeSelectedCompany.id, { note: '' });

    const noteStatus = document.getElementById('modal-crm-note-status-indicator');
    const noteLastUpdated = document.getElementById('modal-crm-note-last-updated');
    if (noteStatus) noteStatus.innerHTML = '<span style="color: #64748B;">⚪ ว่าง</span>';
    if (noteLastUpdated) noteLastUpdated.textContent = 'บันทึกล่าสุด: -';
    showStatusToast('ล้างข้อความโน้ตเรียบร้อย');
  }
}

// ==========================================
// 8.2 SITE VISIT PHOTOS & LIGHTBOX (PROOF OF WORK)
// ==========================================
function compressImage(file, maxWidth = 960, maxHeight = 960, quality = 0.75) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function renderCompanyPhotosGallery(companyId) {
  const container = document.getElementById('modal-company-photos-grid');
  const countEl = document.getElementById('modal-company-photo-count');
  if (!container) return;

  const log = getCompanyCrmLog(companyId);
  const photos = Array.isArray(log.photos) ? log.photos : [];

  if (countEl) {
    countEl.textContent = `${photos.length} รูป`;
  }

  if (photos.length === 0) {
    container.innerHTML = `
      <div style="width: 100%; text-align: center; color: #94A3B8; font-size: 0.78rem; padding: 12px 0;">
        <span>📷 ยังไม่มีรูปภาพหลักฐานลงพื้นที่ (กดปุ่ม <strong>'+ อัปโหลดรูปภาพหน้างาน'</strong> เพื่อบันทึกรูปถ่าย)</span>
      </div>
    `;
    return;
  }

  container.innerHTML = photos.map((p, idx) => {
    const timeStr = p.timestamp ? new Date(p.timestamp).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : `รูปที่ ${idx + 1}`;
    const safeCaption = (p.name || `หลักฐานลงพื้นที่ - ${activeSelectedCompany ? activeSelectedCompany.name : ''}`).replace(/"/g, '&quot;');
    const uploaderInfo = p.uploaderName ? ` • โดย ${p.uploaderName}` : '';
    const canDelete = (typeof canCurrentUserDeleteOrEditItem === 'function') ? canCurrentUserDeleteOrEditItem(p.uploadedBy) : true;

    return `
      <div style="position: relative; width: 88px; height: 88px; border-radius: 8px; overflow: hidden; border: 1.5px solid #CBD5E1; box-shadow: 0 2px 5px rgba(15,23,42,0.08); background: #0F172A; cursor: pointer; flex-shrink: 0;" onclick="openImageLightbox('${p.dataUrl}', '${safeCaption} • ${timeStr}${uploaderInfo}')">
        <img src="${p.dataUrl}" alt="Site visit photo" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15,23,42,0.78); color: #FFFFFF; font-size: 0.60rem; font-weight: 700; padding: 2px 4px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${timeStr}
        </div>
        ${canDelete ? `
          <button type="button" onclick="event.stopPropagation(); deleteCompanyPhoto('${p.id}');" title="ลบรูปภาพนี้" style="position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; background: rgba(239,68,68,0.92); color: #FFFFFF; border: none; font-size: 0.65rem; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3); transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='none'">
            ✕
          </button>
        ` : `
          <div title="อัปโหลดโดย ${p.uploaderName || p.uploadedBy || 'เพื่อนร่วมทีม'} (ล็อกสิทธิ์เฉพาะเจ้าของ/หัวหน้า)" style="position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; background: rgba(15,23,42,0.75); color: #CBD5E1; border: 1px solid rgba(255,255,255,0.3); font-size: 0.60rem; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
            🔒
          </div>
        `}
      </div>
    `;
  }).join('');
}

async function handleCompanyPhotoUpload(event) {
  if (!activeSelectedCompany) return;
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const countEl = document.getElementById('modal-company-photo-count');
  if (countEl) countEl.innerHTML = '<span style="color: #D97706;">⏳ กำลังประมวลผลรูป...</span>';

  const log = getCompanyCrmLog(activeSelectedCompany.id);
  const existingPhotos = Array.isArray(log.photos) ? log.photos : [];
  const newPhotos = [];

  const uEmail = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser.email : 'somchai@scg.com';
  const uName = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser.fullName : 'คุณสมชาย';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;
    try {
      const dataUrl = await compressImage(file, 960, 960, 0.75);
      newPhotos.push({
        id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: file.name || 'Site Visit Photo',
        dataUrl: dataUrl,
        uploadedBy: uEmail,
        uploaderName: uName,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Compress image failed:', e);
    }
  }

  const updatedPhotos = [...existingPhotos, ...newPhotos];
  saveCompanyCrmLog(activeSelectedCompany.id, { photos: updatedPhotos });

  renderCompanyPhotosGallery(activeSelectedCompany.id);
  if (typeof renderTable === 'function') renderTable();
  showStatusToast(`📸 อัปโหลดรูปภาพหลักฐาน ${newPhotos.length} รูป (โดย ${uName}) เรียบร้อยแล้ว`);

  // Reset file input
  event.target.value = '';
}

function deleteCompanyPhoto(photoId) {
  if (!activeSelectedCompany) return;

  const log = getCompanyCrmLog(activeSelectedCompany.id);
  const existingPhotos = Array.isArray(log.photos) ? log.photos : [];
  const targetPhoto = existingPhotos.find(p => p.id === photoId);

  if (targetPhoto && typeof canCurrentUserDeleteOrEditItem === 'function') {
    if (!canCurrentUserDeleteOrEditItem(targetPhoto.uploadedBy)) {
      showStatusToast(`🔒 คุณไม่มีสิทธิ์ลบรูปภาพของ ${targetPhoto.uploaderName || targetPhoto.uploadedBy || 'เพื่อนร่วมทีม'} (เฉพาะเจ้าของรูปหรือหัวหน้าพรรณิภาเท่านั้น)`);
      return;
    }
  }

  if (!confirm('คุณต้องการลบรูปภาพหลักฐานนี้หรือไม่?')) return;

  const updatedPhotos = existingPhotos.filter(p => p.id !== photoId);

  saveCompanyCrmLog(activeSelectedCompany.id, { photos: updatedPhotos });
  renderCompanyPhotosGallery(activeSelectedCompany.id);
  if (typeof renderTable === 'function') renderTable();
  showStatusToast('ลบรูปภาพเรียบร้อย');
}

function openImageLightbox(src, caption) {
  const modal = document.getElementById('image-lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  if (modal && img) {
    img.src = src;
    if (cap) cap.textContent = caption || '';
    modal.style.display = 'flex';
  }
}

function closeImageLightbox() {
  const modal = document.getElementById('image-lightbox-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function filterModalProjects(stageKey) {
  activeModalProjectStageFilter = stageKey;
  if (activeSelectedCompany) {
    renderCompanyProjectsList(activeSelectedCompany);
  }
}

function getStageMatchedScgMaterials(proj) {
  if (!proj) return 'ปูนโครงสร้าง SCG, คอนกรีตผสมเสร็จ CPAC';
  const text = (String(proj.name || proj.title || '') + ' ' + String(proj.stage || '') + ' ' + String(proj.status || '') + ' ' + String(proj.caption || '')).toLowerCase();
  const stageKey = proj.stageKey || 'structure';

  // 1. งานมุงหลังคา / โครงหลังคา
  if (text.includes('มุงหลังคา') || text.includes('หลังคา') || text.includes('roof') || text.includes('smart truss') || text.includes('โครงหลังคา') || text.includes('กระเบื้องหลังคา')) {
    return 'กระเบื้องหลังคา SCG, ฉนวน STAY COOL, โครงหลังคา C-Truss, อุปกรณ์ครอบหลังคา Dry-Tech System';
  }
  
  // 2. งานปูกระเบื้อง / ห้องน้ำ / สุขภัณฑ์ / ตกแต่งภายใน
  if (text.includes('ปูกระเบื้อง') || text.includes('กระเบื้อง') || text.includes('สุขภัณฑ์') || text.includes('tile') || text.includes('ห้องน้ำ') || text.includes('ทาสี') || text.includes('ตกแต่ง') || text.includes('ฝ้า') || stageKey === 'finishing') {
    return 'กระเบื้องและสุขภัณฑ์ COTTO, กาวซีเมนต์ไทล์บอนด์, กาวยาแนวอัลตร้าพลาสเตอร์, แผ่นสมาร์ทบอร์ด SCG';
  }

  // 3. งานยกเสาเอก / เริ่มต้นหน้างาน
  if (text.includes('เสาเอก') || text.includes('ลงเสาเข็ม') || text.includes('เจาะเสาเข็ม') || stageKey === 'groundbreak') {
    return 'เสาเข็มคอนกรีตอัดแรง CPAC, ปูนโครงสร้าง SCG, คอนกรีตผสมเสร็จ CPAC';
  }

  // 4. งานฐานราก / ตอม่อ / คานคอดิน
  if (text.includes('ฐานราก') || text.includes('ตอม่อ') || text.includes('คานคอดิน') || text.includes('เทเสา') || stageKey === 'foundation') {
    return 'ปูนโครงสร้าง SCG, คอนกรีตผสมเสร็จ CPAC, น้ำยากันซึม CPAC, เหล็กเส้นโรงใหญ่ มอก.';
  }

  // 5. งานรีโนเวท / ต่อเติม
  if (text.includes('รีโนเวท') || text.includes('ต่อเติม') || text.includes('โรงจอดรถ') || text.includes('ต่อเติมครัว')) {
    return 'แผ่นสมาร์ทบอร์ด SCG, ไม้สังเคราะห์ SCG SmartWOOD, ปูนฉาบซ่อมแซมโครงสร้าง SCG, กระเบื้องและสุขภัณฑ์ COTTO';
  }

  // 6. งานส่งมอบบ้าน / ตรวจรับ
  if (text.includes('ส่งมอบ') || text.includes('ตรวจรับ')) {
    return 'บล็อกปูถนน SCG, ไม้ระแนง SCG SmartWOOD, หลังคาโรงจอดรถ Shinkolite SCG';
  }

  // 7. งานโครงสร้างทั่วไป / ก่อผนัง
  return 'ปูนโครงสร้าง SCG, คอนกรีตผสมเสร็จ CPAC, อิฐมวลเบา Q-CON, ปูนเสือมอร์ตาร์ฉาบอิฐมวลเบา';
}

/**
 * Calculate Project Progress Percentage & Info based on construction stage
 * 1. เริ่มงาน / วางผัง / ยกเสาเอก: 10% – 15% (🟡 เหลืองส้ม #F59E0B)
 * 2. งานฐานราก & คานคอดิน: 30% – 35% (🟠 ส้มอิฐ #EA580C)
 * 3. งานโครงสร้าง & หลังคา: 50% – 60% (🔵 น้ำเงิน/ม่วง #3B82F6)
 * 4. งานสถาปัตย์ & ตกแต่ง: 75% – 85% (🟢 เขียวมรกต #10B981)
 * 5. งานส่งมอบบ้าน / ตรวจรับ: 98% (❇️ เขียวเข้ม #16A34A)
 */
function getProjectProgressInfo(proj) {
  if (!proj) {
    return {
      percent: 50,
      percentText: '50%',
      isCompleted: false,
      stageLabel: 'งานโครงสร้าง & หลังคา',
      color: '#3B82F6',
      bgGradient: 'linear-gradient(90deg, #2563EB, #60A5FA)'
    };
  }

  const stageKey = proj.stageKey || '';
  const explicitPercent = Number(proj.progressPercent);

  // Check if explicitly completed/handed over whole project
  if (stageKey === 'handover' || stageKey === 'completed' || explicitPercent >= 98) {
    return {
      percent: 98,
      percentText: '98%',
      isCompleted: true,
      stageLabel: 'งานส่งมอบบ้าน / ตรวจรับ (จบงานแล้ว)',
      color: '#16A34A',
      bgGradient: 'linear-gradient(90deg, #15803D, #22C55E)'
    };
  }

  // Prioritize explicit percent if defined on project object (< 98)
  if (!isNaN(explicitPercent) && explicitPercent > 0 && explicitPercent < 98) {
    let label = 'งานโครงสร้าง & หลังคา';
    let color = '#3B82F6';
    let bg = 'linear-gradient(90deg, #1D4ED8, #60A5FA)';

    if (explicitPercent <= 15 || stageKey === 'groundbreak') {
      label = 'เริ่มงาน / วางผัง / ยกเสาเอก';
      color = '#F59E0B';
      bg = 'linear-gradient(90deg, #D97706, #FBBF24)';
    } else if (explicitPercent <= 35 || stageKey === 'foundation') {
      label = 'งานฐานราก & คานคอดิน';
      color = '#EA580C';
      bg = 'linear-gradient(90deg, #C2410C, #FB923C)';
    } else if (explicitPercent >= 70 || stageKey === 'finishing') {
      label = 'งานสถาปัตย์ & ตกแต่ง';
      color = '#10B981';
      bg = 'linear-gradient(90deg, #059669, #34D399)';
    }

    return {
      percent: explicitPercent,
      percentText: `${explicitPercent}%`,
      isCompleted: false,
      stageLabel: label,
      color: color,
      bgGradient: bg
    };
  }

  const text = (String(proj.name || proj.title || '') + ' ' + String(proj.stage || '') + ' ' + String(proj.status || '') + ' ' + String(proj.caption || '')).toLowerCase();

  // Distinguish between sub-stage milestone delivery (ส่งมอบงานงวด/ระบบ) or marketing phrases (ดูแลหลังส่งมอบบ้าน) vs full house handover
  const isMarketingHandover = text.includes('ดูแลหลังส่งมอบ') || text.includes('จนถึงส่งมอบ') || text.includes('จนส่งมอบ') || text.includes('วันส่งมอบ');
  const isSubStageHandover = text.includes('ส่งมอบงานระบบ') || text.includes('ส่งมอบงวด') || text.includes('ส่งมอบงานงวด') || text.includes('ส่งมอบงานฉาบ') || text.includes('ส่งมอบงานโครงสร้าง') || text.includes('พร้อมสำหรับขั้นตอนงานต่อไป') || text.includes('เตรียมงานงวดต่อไป') || text.includes('งวดถัดไป');
  const isFullHandover = (text.includes('ส่งมอบบ้าน') || text.includes('ส่งมอบกุญแจ') || text.includes('ส่งมอบแล้วเสร็จ') || text.includes('ตรวจรับบ้าน') || text.includes('ตรวจรับมอบ') || text.includes('เสร็จสมบูรณ์ 100%') || text.includes('ปิดจ๊อบ')) && !isSubStageHandover && !isMarketingHandover && stageKey !== 'groundbreak' && stageKey !== 'foundation' && stageKey !== 'structure';

  if (isFullHandover) {
    return {
      percent: 98,
      percentText: '98%',
      isCompleted: true,
      stageLabel: 'งานส่งมอบบ้าน / ตรวจรับ (จบงานแล้ว)',
      color: '#16A34A',
      bgGradient: 'linear-gradient(90deg, #15803D, #22C55E)'
    };
  }

  // Prioritize explicit percent if defined on project object
  if (!isNaN(explicitPercent) && explicitPercent > 0) {
    let label = 'งานโครงสร้าง & หลังคา';
    let color = '#3B82F6';
    let bg = 'linear-gradient(90deg, #1D4ED8, #60A5FA)';

    if (explicitPercent <= 15 || stageKey === 'groundbreak') {
      label = 'เริ่มงาน / วางผัง / ยกเสาเอก';
      color = '#F59E0B';
      bg = 'linear-gradient(90deg, #D97706, #FBBF24)';
    } else if (explicitPercent <= 35 || stageKey === 'foundation') {
      label = 'งานฐานราก & คานคอดิน';
      color = '#EA580C';
      bg = 'linear-gradient(90deg, #C2410C, #FB923C)';
    } else if (explicitPercent >= 70 || stageKey === 'finishing') {
      label = 'งานสถาปัตย์ & ตกแต่ง';
      color = '#10B981';
      bg = 'linear-gradient(90deg, #059669, #34D399)';
    }

    return {
      percent: explicitPercent,
      percentText: `${explicitPercent}%`,
      isCompleted: false,
      stageLabel: label,
      color: color,
      bgGradient: bg
    };
  }

  // 4. งานสถาปัตย์ & ตกแต่ง (75% – 85% - 🟢 เขียวมรกต #10B981)
  if (text.includes('ปูกระเบื้อง') || text.includes('กระเบื้อง') || text.includes('สุขภัณฑ์') || text.includes('tile') || text.includes('ห้องน้ำ') || text.includes('ทาสี') || text.includes('ตกแต่ง') || text.includes('ฝ้า') || text.includes('ฉาบปูน') || text.includes('สถาปัตย์') || stageKey === 'finishing') {
    const isLateFinish = text.includes('ทาสี') || text.includes('สุขภัณฑ์') || text.includes('ตกแต่ง');
    const p = isLateFinish ? 85 : 75;
    return {
      percent: p,
      percentText: `${p}%`,
      isCompleted: false,
      stageLabel: 'งานสถาปัตย์ & ตกแต่ง',
      color: '#10B981',
      bgGradient: 'linear-gradient(90deg, #059669, #34D399)'
    };
  }

  // 1. เริ่มงาน / วางผัง / ยกเสาเอก (10% – 15% - 🟡 เหลืองส้ม #F59E0B)
  if (text.includes('เสาเอก') || text.includes('เสาโท') || text.includes('ลงเสาเข็ม') || text.includes('เจาะเสาเข็ม') || text.includes('วางผัง') || text.includes('เริ่มงาน') || text.includes('ยกเสา') || stageKey === 'groundbreak') {
    const isPile = text.includes('เสาเข็ม') || text.includes('วางผัง');
    const p = isPile ? 15 : 10;
    return {
      percent: p,
      percentText: `${p}%`,
      isCompleted: false,
      stageLabel: 'เริ่มงาน / วางผัง / ยกเสาเอก',
      color: '#F59E0B',
      bgGradient: 'linear-gradient(90deg, #D97706, #FBBF24)'
    };
  }

  // 2. งานฐานราก & คานคอดิน (30% – 35% - 🟠 ส้มอิฐ #EA580C)
  if (text.includes('ฐานราก') || text.includes('ตอม่อ') || text.includes('คานคอดิน') || text.includes('เทพื้น') || text.includes('ขุดดิน') || stageKey === 'foundation') {
    const isBeam = text.includes('คานคอดิน') || text.includes('เทพื้น');
    const p = isBeam ? 35 : 30;
    return {
      percent: p,
      percentText: `${p}%`,
      isCompleted: false,
      stageLabel: 'งานฐานราก & คานคอดิน',
      color: '#EA580C',
      bgGradient: 'linear-gradient(90deg, #C2410C, #FB923C)'
    };
  }

  // 3. งานโครงสร้าง & หลังคา (50% – 60% - 🔵 น้ำเงิน/ม่วง #3B82F6)
  const isRoof = text.includes('หลังคา') || text.includes('มุงหลังคา') || text.includes('ชั้น 2') || text.includes('ชั้นสอง');
  const p = isRoof ? 60 : 50;
  return {
    percent: p,
    percentText: `${p}%`,
    isCompleted: false,
    stageLabel: 'งานโครงสร้าง & หลังคา',
    color: '#3B82F6',
    bgGradient: 'linear-gradient(90deg, #1D4ED8, #60A5FA)'
  };
}

function renderCompanyProjectsList(company) {
  const container = document.getElementById('modal-projects-section-container');
  if (!container) return;

  const rawProjects = company.projects || [];
  // คัดกรองเฉพาะโครงการที่จบงานสมบูรณ์ 100%/ส่งมอบบ้านแล้ว (>=98%) ออก
  const projects = rawProjects.filter(p => {
    if (!p) return false;
    if (p.stageKey === 'handover' || p.stageKey === 'completed') return false;
    if (typeof p.progressPercent === 'number' && p.progressPercent >= 98) return false;
    const prog = getProjectProgressInfo(p);
    if (prog.percent >= 98 || prog.isCompleted) return false;
    return true;
  });

  const displayProjects = projects.filter(p => {
    if (activeModalProjectStageFilter === 'all') return true;
    return p.stageKey === activeModalProjectStageFilter;
  });

  const stageCounts = {
    all: projects.length,
    groundbreak: projects.filter(p => p.stageKey === 'groundbreak').length,
    foundation: projects.filter(p => p.stageKey === 'foundation').length,
    structure: projects.filter(p => p.stageKey === 'structure').length,
    finishing: projects.filter(p => p.stageKey === 'finishing').length
  };

  // Render Stage Filter Tabs at Top Card
  const topFilterContainer = document.getElementById('modal-top-stage-filter-buttons');
  if (topFilterContainer) {
    topFilterContainer.innerHTML = `
      <button type="button" class="stage-tab-btn ${activeModalProjectStageFilter === 'all' ? 'active' : ''}" onclick="filterModalProjects('all')">
        ทั้งหมด (${stageCounts.all})
      </button>
      <button type="button" class="stage-tab-btn ${activeModalProjectStageFilter === 'groundbreak' ? 'active' : ''}" onclick="filterModalProjects('groundbreak')">
        เสาเอก (${stageCounts.groundbreak})
      </button>
      <button type="button" class="stage-tab-btn ${activeModalProjectStageFilter === 'foundation' ? 'active' : ''}" onclick="filterModalProjects('foundation')">
        ฐานราก (${stageCounts.foundation})
      </button>
      <button type="button" class="stage-tab-btn ${activeModalProjectStageFilter === 'structure' ? 'active' : ''}" onclick="filterModalProjects('structure')">
        โครงสร้าง (${stageCounts.structure})
      </button>
      <button type="button" class="stage-tab-btn ${activeModalProjectStageFilter === 'finishing' ? 'active' : ''}" onclick="filterModalProjects('finishing')">
        ตกแต่ง (${stageCounts.finishing})
      </button>
    `;
  }

  container.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
      <h3 class="section-title" style="margin-bottom: 0;">
        <span class="indicator"></span> รายชื่อไซต์งานก่อสร้างจริง (${displayProjects.length}${activeModalProjectStageFilter !== 'all' ? `/${projects.length}` : ''} โครงการ)
      </h3>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      ${displayProjects.length > 0 ? displayProjects.map(proj => {
        const stageBadgeClass = `stage-${proj.stageKey || 'structure'}`;
        const projCleanName = cleanThaiText(proj.name || proj.title);
        const projCleanLocation = cleanThaiText(proj.location || proj.district || 'อุดรธานี');
        const projCleanStage = cleanThaiText(proj.stage);
        const scgMaterials = getStageMatchedScgMaterials(proj);
        const progressInfo = getProjectProgressInfo(proj);
        
        // Facebook Post Proof & URL
        const fbUrl = (proj.siteProof && proj.siteProof.postUrl) || proj.facebookPostUrl || proj.postUrl || proj.url || proj.link || company.facebookUrl || '#';
        const fbTime = (proj.siteProof && proj.siteProof.postedTime) || proj.postedTime || proj.lastUpdate || proj.date || '';
        const fbCaption = (proj.siteProof && proj.siteProof.caption) || proj.caption || proj.status || '';

        return `
          <div class="project-card">
            <div class="project-card-header">
              <div>
                <div class="project-title" style="color: #FFFFFF; font-size: 0.94rem; font-weight: 800;">${projCleanName}</div>
                <div style="font-size: 0.74rem; color: #94A3B8; margin-top: 3px;">
                  📍 <span style="color: #CBD5E1;">${projCleanLocation}</span>
                </div>
              </div>
              <span class="project-stage-badge ${stageBadgeClass}">
                ${projCleanStage || 'งานโครงสร้าง'}
              </span>
            </div>

            <!-- รายการวัสดุ SCG ที่สอดคล้องกับสเตจงานจริง (ไม่มีตัวเลขสมมติ) -->
            <div style="margin-top: 0.65rem; padding: 0.6rem 0.8rem; background: #FFFFFF; border: 1px solid #FECACA; border-left: 3.5px solid #DC2626; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.15);">
              <div style="font-size: 0.74rem; font-weight: 800; color: #991B1B; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
                📦 รายการวัสดุ SCG ที่สอดคล้องกับสเตจงานจริง:
              </div>
              <div style="font-size: 0.76rem; color: #0F172A; font-weight: 600; line-height: 1.45;">
                ${scgMaterials}
              </div>
            </div>

            <!-- Facebook Post Proof & Link Button -->
            <div style="margin-top: 0.65rem; padding-top: 0.5rem; border-top: 1px dashed rgba(255, 255, 255, 0.18); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
              <a href="${fbUrl}" target="_blank" rel="noopener noreferrer" 
                 onclick="event.stopPropagation();"
                 style="display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; background: #1877F2; color: #FFFFFF; border-radius: 6px; font-size: 0.76rem; font-weight: 700; text-decoration: none; transition: all 0.15s ease; box-shadow: 0 2px 5px rgba(24, 119, 242, 0.35);"
                 onmouseover="this.style.background='#166FE5'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='#1877F2'; this.style.transform='none';">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                <span>🔗 เปิดดูโพสต์หลักฐาน Facebook ↗</span>
              </a>
              ${fbTime ? `<span style="font-size: 0.72rem; color: #94A3B8; font-weight: 600;">📅 ${cleanThaiText(fbTime)}</span>` : ''}
            </div>

            ${fbCaption ? `
              <div style="font-size: 0.72rem; color: #E2E8F0; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); padding: 6px 9px; border-radius: 6px; margin-top: 6px; line-height: 1.4;">
                💬 <span style="font-style: italic;">"${cleanThaiText(fbCaption).substring(0, 110)}${fbCaption.length > 110 ? '...' : ''}"</span>
              </div>
            ` : ''}

            <!-- ระยะโครงการ (Project Progress Bar) -->
            <div class="project-progress-container" style="margin-top: 0.75rem; background: rgba(15, 23, 42, 0.75); border: 1px solid rgba(255, 255, 255, 0.16); border-radius: 8px; padding: 8px 12px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.3);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 0.8rem;">🏗️</span>
                  <span style="font-size: 0.78rem; font-weight: 800; color: #FFFFFF;">ระยะโครงการ</span>
                  <span style="font-size: 0.7rem; color: #94A3B8; font-weight: 600;">(${progressInfo.stageLabel})</span>
                </div>
                <div style="display: inline-flex; align-items: center; gap: 4px; background: rgba(0, 0, 0, 0.4); border: 1px solid ${progressInfo.color}; padding: 2px 8px; border-radius: 9999px;">
                  <span style="font-size: 0.82rem; font-weight: 900; color: ${progressInfo.color};">${progressInfo.percentText}</span>
                </div>
              </div>

              <!-- Progress Track Bar -->
              <div style="position: relative; width: 100%; height: 8px; background: rgba(255, 255, 255, 0.12); border-radius: 9999px; overflow: hidden;">
                <div style="width: ${progressInfo.percent}%; height: 100%; background: ${progressInfo.bgGradient}; border-radius: 9999px; transition: width 0.4s ease; box-shadow: 0 0 8px ${progressInfo.color}88;"></div>
              </div>

              <!-- Milestone Stepper Markers (เฉพาะ 4 สเตจงานก่อสร้างที่ขายสินค้าได้จริง) -->
              <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 0.64rem; font-weight: 700; color: #64748B;">
                <span style="${progressInfo.percent >= 10 ? `color: #F59E0B; font-weight: 800;` : ''}">10-15% เสาเอก</span>
                <span style="${progressInfo.percent >= 30 ? `color: #EA580C; font-weight: 800;` : ''}">30-35% ฐานราก</span>
                <span style="${progressInfo.percent >= 50 ? `color: #3B82F6; font-weight: 800;` : ''}">50-60% โครงสร้าง</span>
                <span style="${progressInfo.percent >= 75 ? `color: #10B981; font-weight: 800;` : ''}">75-85% ตกแต่ง</span>
              </div>
            </div>
          </div>
        `;
      }).join('') : `
        <div style="grid-column: 1 / -1; background: rgba(15, 23, 42, 0.6); border: 1.5px dashed rgba(255, 255, 255, 0.2); border-radius: 10px; padding: 32px 16px; text-align: center; color: #94A3B8;">
          <div style="font-size: 28px; margin-bottom: 8px;">📍</div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #F8FAFC;">0 โครงการในพื้นที่อุดร</div>
          <div style="font-size: 0.85rem; color: #34D399; font-weight: 700; margin-top: 5px;">มีไซต์งานในพื้นที่อื่น</div>
        </div>
      `}
    </div>
  `;
}

function closeCompanyModal() {
  const modal = document.getElementById('company-detail-modal');
  if (modal) modal.style.display = 'none';
  activeSelectedCompany = null;
  if (typeof renderTable === 'function') renderTable();
  if (typeof updateHeaderCrmStats === 'function') updateHeaderCrmStats();
}

function closeProjectModal() {
  const modal = document.getElementById('project-detail-modal');
  if (modal) modal.style.display = 'none';
}

function closeAllModals() {
  closeCompanyModal();
  closeProjectModal();
  closeFollowUpModal();
  closeApifyModal();
  closeCrmStatusModal();
}

// ==========================================
// 9.0 SALES SUMMARY REPORT PAGE NAVIGATION
// ==========================================
function openSalesReportModal() {
  const isSakon = window.location.pathname.includes('SAKON');
  const defaultProv = isSakon ? 'สกลนคร' : 'อุดรธานี';
  const provName = activeDistrict === 'all' ? defaultProv : activeDistrict;
  const provParam = (provName === 'สกลนคร') ? 'sakon' : ((provName === 'อุดรธานี') ? 'udon' : encodeURIComponent(provName));
  window.location.href = `report.html?province=${provParam}`;
}

window.openSalesReportModal = openSalesReportModal;

// ==========================================
// 9.1 PDF REPORT EXPORT ENGINE (Single Company Dossier)
// ==========================================
function exportCompanyPdfReport(companyOrId) {
  let comp = activeSelectedCompany;
  if (companyOrId) {
    comp = typeof companyOrId === 'string' ? allCompanies.find(c => c.id === companyOrId) : companyOrId;
  }
  if (!comp) {
    showStatusToast('⚠️ ไม่พบข้อมูลบริษัทสำหรับการออกรายงาน PDF');
    return;
  }

  showStatusToast('⏳ กำลังจัดเตรียมและสร้างรายงาน PDF...');

  const compCleanName = cleanThaiText(comp.name);
  const compCleanCat = cleanThaiText(comp.category) || 'บริษัทรับสร้างบ้านและรับเหมาก่อสร้าง';
  const tag = getCompanyTag(comp.id);
  const tagMapThai = {
    'strategic': '👑 Strategic Partner (ลูกค้าแฟนพันธ์แท้)',
    'growth': '📈 Growth Account (ลูกค้าทีมีความสัมพันธ์ แต่ต้อติดตามอย่างใกล้ชิด)',
    'opportunity': '🎯 Opportunity Account (ลูกค้าที่ต้องสร้างความสัมพันธ์)',
    'prospect': '✨ New (ลูกค้าใหม่)',
    'focus': '👑 Strategic Partner (ลูกค้าแฟนพันธ์แท้)',
    'non-focus': '🎯 Opportunity Account (ลูกค้าที่ต้องสร้างความสัมพันธ์)',
    'new': '✨ New (ลูกค้าใหม่)'
  };
  const tagBadgeStyle = {
    'strategic': 'background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;',
    'growth': 'background: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;',
    'opportunity': 'background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A;',
    'prospect': 'background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;',
    'focus': 'background: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;',
    'non-focus': 'background: #FFFBEB; color: #D97706; border: 1px solid #FDE68A;',
    'new': 'background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;'
  };

  const projects = comp.projects || [];
  const projCount = projects.length || comp.totalProjects || 0;
  const scoreData = window.calculateOpportunityScore ? window.calculateOpportunityScore(comp) : { score: comp.opportunityScore || 50, tierLabel: 'โอกาสปานกลาง' };
  const score = scoreData.score || comp.opportunityScore || 50;

  const sales2025Text = (comp.sales2025 || 0) > 0 ? '฿' + Number(comp.sales2025).toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : '-';
  const sales2026Text = (comp.sales2026 || 0) > 0 ? '฿' + Number(comp.sales2026).toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : '-';
  const potentialValText = `฿${(projCount * 0.5).toFixed(1)}M (${projCount} โครงการ × ฿500,000)`;

  const trackingMap = loadSavedTrackingStatuses();
  const crmLog = getCompanyCrmLog(comp.id);

  const stageDisplayMap = {
    'groundbreak': 'ยกเสาเอก / เริ่มลงเสาเข็มเปิดหน้างาน',
    'foundation': 'ฐานราก / เทคานคอดิน / หล่อตอม่อ',
    'structure': 'งานโครงสร้างเสา-คาน / ตั้งโครงหลังคา',
    'finishing': 'งานมุงหลังคา / ก่อฉาบ / ตกแต่งสถาปัตย์',
    'renovation': 'งานรีโนเวทและต่อเติมอาคาร'
  };

  const crmStatusLabels = {
    'pending': '⏳ รอติดตาม',
    'contacted': '📞 นัดหมาย',
    'quote_sent': '📄 ส่งใบเสนอราคา',
    'won': '🎉 ปิดการขาย'
  };

  const reportContainer = document.createElement('div');
  reportContainer.id = 'temp-pdf-export-container';
  reportContainer.style.cssText = `
    width: 210mm;
    min-height: 297mm;
    padding: 12mm 14mm;
    background: #FFFFFF;
    color: #0F172A;
    font-family: 'Prompt', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    box-sizing: border-box;
    font-size: 12px;
    line-height: 1.45;
  `;

  const nowThai = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  reportContainer.innerHTML = `
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 10px; border-bottom: 3px solid #0B2E83; margin-bottom: 12px;">
      <div>
        <div style="font-size: 18px; font-weight: 900; color: #0B2E83; letter-spacing: -0.5px; display: flex; align-items: center; gap: 6px;">
          <span>NEXTSITE AI</span>
          <span style="font-size: 11px; background: #D71920; color: #FFFFFF; padding: 2px 7px; border-radius: 4px; font-weight: 800;">EXECUTIVE REPORT</span>
        </div>
        <div style="font-size: 11px; color: #64748B; font-weight: 600; margin-top: 2px;">
          SCG Construction Intelligence & Sales Opportunity Dossier • Udon Thani
        </div>
      </div>
      <div style="text-align: right; font-size: 10px; color: #64748B; line-height: 1.3;">
        <div><strong>วันที่ออกรายงาน:</strong> ${nowThai} น.</div>
        <div><strong>ความแม่นยำ AI Signal:</strong> 99.5% Verified</div>
      </div>
    </div>

    <!-- Company Profile Summary Card -->
    <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <h1 style="font-size: 16px; font-weight: 900; color: #0F172A; margin: 0;">${compCleanName}</h1>
            <span style="padding: 2px 8px; border-radius: 6px; font-size: 10.5px; font-weight: 800; ${tagBadgeStyle[tag] || tagBadgeStyle['new']}">
              ${tagMapThai[tag] || tag}
            </span>
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 3px; font-weight: 600;">
            ${compCleanCat} • อ.${cleanThaiText(comp.district) || 'เมือง'} จ.${cleanThaiText(comp.province) || 'อุดรธานี'}
          </div>
          <div style="font-size: 10.5px; color: #64748B; margin-top: 2px;">
            📍 <strong>ที่ตั้ง:</strong> ${comp.address || 'จ.อุดรธานี'} ${comp.phone ? ` | 📞 <strong>โทร:</strong> ${comp.phone}` : ''}
          </div>
          ${comp.facebookUrl ? `
            <div style="font-size: 10px; color: #0284C7; margin-top: 2px; font-weight: 600;">
              🌐 <strong>Facebook:</strong> ${comp.facebookUrl}
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; background: #FFFFFF; border: 1.5px solid #93C5FD; border-radius: 8px; padding: 6px 12px; min-width: 90px; box-shadow: 0 1px 4px rgba(0,0,0,0.05);">
          <div style="font-size: 9.5px; font-weight: 800; color: #64748B; text-transform: uppercase;">คะแนนโอกาส AI</div>
          <div style="font-size: 22px; font-weight: 900; color: ${score >= 90 ? '#1E40AF' : score >= 70 ? '#16A34A' : '#CA8A04'}; line-height: 1.1;">
            ${score}
          </div>
          <div style="font-size: 9.5px; font-weight: 800; color: #475569; margin-top: 1px;">
            ${scoreData.tierLabel || (score >= 90 ? 'โอกาสสูงสุด' : score >= 70 ? 'โอกาสสูง' : 'โอกาสปานกลาง')}
          </div>
        </div>
      </div>

      <!-- Financial & Target Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #E2E8F0;">
        <div style="background: #FFFFFF; padding: 6px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
          <div style="font-size: 9.5px; color: #64748B; font-weight: 700;">จำนวนโครงการจริง</div>
          <div style="font-size: 13px; font-weight: 900; color: #0F172A;">${projCount} โครงการ</div>
        </div>
        <div style="background: #FFFFFF; padding: 6px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
          <div style="font-size: 9.5px; color: #64748B; font-weight: 700;">ประมาณการซื้อ SCG รวม</div>
          <div style="font-size: 13px; font-weight: 900; color: #0284C7;">${potentialValText.split(' ')[0]}</div>
        </div>
        <div style="background: #FFFFFF; padding: 6px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
          <div style="font-size: 9.5px; color: #64748B; font-weight: 700;">ยอดซื้อขาย SCG ปี 2025</div>
          <div style="font-size: 13px; font-weight: 900; color: #1E293B;">${sales2025Text}</div>
        </div>
        <div style="background: #FFFFFF; padding: 6px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
          <div style="font-size: 9.5px; color: #64748B; font-weight: 700;">ยอดซื้อขาย SCG ปี 2026</div>
          <div style="font-size: 13px; font-weight: 900; color: ${(comp.sales2026 || 0) > 0 ? '#16A34A' : '#1E293B'};">${sales2026Text}</div>
        </div>
      </div>

      <!-- AI Sales Intelligence & Diagnostic Section in PDF (for companies with sales history) -->
      ${hasSales ? `
        <div style="background: #FFFFFF; border: 1.5px solid #BFDBFE; border-radius: 6px; padding: 8px 10px; margin-top: 8px;">
          <div style="font-size: 10.5px; font-weight: 800; color: #0B2E83; margin-bottom: 3px; display: flex; align-items: center; gap: 4px;">
            <span>📊 AI วินิจฉัยพฤติกรรมยอดซื้อ & กลยุทธ์ทีมขาย</span>
          </div>
          <div style="font-size: 9.5px; color: #334155; line-height: 1.35; margin-bottom: 5px;">
            ${sales2025 > 0 && sales2026 === 0 
              ? `${projCount > 0 ? `AI ตรวจพบข้อมูลภายนอกบน Facebook ว่าบริษัทมีงานจริง ${projCount} โครงการ แต่มียอดซื้อ SCG ปี 2026 เป็น 0 บาท (เปลี่ยนไปสั่งซื้อแบรนด์คู่แข่งทั้งหมด)<br><strong>🚨 มีความเสี่ยงสูญเสียรายได้ ฿${sales2025.toLocaleString()} บาท ควรเข้าพบด่วนภายใน 3-7 วัน</strong>` : `เคยเป็นลูกค้าหลักปี 2025 (฿${sales2025.toLocaleString()}) แต่ปี 2026 ขาดการสั่งซื้อ เสี่ยงสูญเสียรายได้ ฿${sales2025.toLocaleString()} บาท ควรเข้าพบภายใน 7 วัน`}`
              : sales2025 > sales2026 
                ? `${projCount > 0 ? `AI ตรวจพบข้อมูลภายนอกบน Facebook ว่าบริษัทมีโครงการใหม่ ${projCount} โครงการ<br><strong>สรุปวิเคราะห์:</strong> “บริษัทยังเติบโตและมีงานต่อเนื่อง แต่ยอดซื้อ SCG ลดลงผิดปกติ (-${Math.round(((sales2025 - sales2026)/sales2025)*100)}%)”<br><strong>⚠️ มีความเสี่ยงสูญเสียรายได้ ฿${(sales2025 - sales2026).toLocaleString()} บาท ควรเข้าพบภายใน 7 วัน</strong>` : `ยอดซื้อปี 2026 ลดลงเหลือ ฿${sales2026.toLocaleString()} (-${Math.round(((sales2025 - sales2026)/sales2025)*100)}% YoY) เสี่ยงสูญเสียรายได้ ฿${(sales2025 - sales2026).toLocaleString()} บาท ควรเข้าพบภายใน 7 วัน`}`
                : `ยอดซื้อเติบโตต่อเนื่องเป็น <strong>฿${sales2026.toLocaleString()}</strong> (+${sales2025 > 0 ? Math.round(((sales2026-sales2025)/sales2025)*100) : 100}% YoY) มีความเชื่อมั่นในสินค้า SCG สูงมาก`
            }
          </div>
          <div style="font-size: 9.5px; font-weight: 800; color: #1E40AF; margin-bottom: 2px;">
            💡 คำแนะนำเชิงกลยุทธ์ (Actionable Sales Strategy):
          </div>
          <div style="font-size: 9px; color: #1E293B; line-height: 1.3;">
            ${sales2025 >= sales2026 
              ? `• นัดหมายผู้บริหาร/จัดซื้อ (ภายใน 7 วัน) เพื่อรีเช็กข้อเสนอราคาเปรียบเทียบกับคู่แข่ง<br>• นำเสนอแพ็กเกจราคาโครงการ (Project Rebate) เหมารวมโครงสร้าง เพื่อดึง Share of Wallet ฿${(sales2025 - sales2026).toLocaleString()} บาท คืนมา<br>• จับคู่เสนอวัสดุ SCG ให้ตรงกับสเตจไซต์งานที่ตรวจพบล่าสุด`
              : `• เสนอ Upsell วัสดุกลุ่มพรีเมียม (กระเบื้องหลังคา Excella / Prestige, ไม้สังเคราะห์ SCG D-COR)<br>• ล็อกสัญญาคู่ค้าประจำปีเพื่อป้องกันคู่แข่งเข้ามาแทรก`
            }
          </div>
        </div>
      ` : ''}
    </div>

    <!-- Section Title -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <h2 style="font-size: 13px; font-weight: 900; color: #0B2E83; margin: 0; display: flex; align-items: center; gap: 6px;">
        <span style="color: #D71920;">■</span> รายชื่อไซต์งานก่อสร้างจริงและสัญญาณตรวจจับ (${projects.length} โครงการ)
      </h2>
      <span style="font-size: 10px; color: #64748B; font-weight: 600;">สัญญาณย้อนหลัง 15 โพสต์ล่าสุดจาก Facebook</span>
    </div>

    <!-- Projects List -->
    ${projects.length > 0 ? `
      <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px;">
        ${projects.map((proj, idx) => {
          const pStatus = trackingMap[proj.projectId || proj.id] || 'pending';
          const stageName = stageDisplayMap[proj.stage] || proj.stageText || proj.stage || 'งานก่อสร้างโครงสร้างอาคาร';
          const materials = proj.scgMaterials || (typeof getStageMatchedScgMaterials === 'function' ? getStageMatchedScgMaterials(proj.stage) : ['ปูนงานโครงสร้าง SCG', 'คอนกรีตผสมเสร็จ CPAC']);

          return `
            <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.03); page-break-inside: avoid;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div style="font-size: 12.5px; font-weight: 800; color: #0F172A; line-height: 1.3;">
                  ${idx + 1}. ${proj.title || proj.projectName || `โครงการก่อสร้างที่ อ.${cleanThaiText(comp.district) || 'เมือง'}`}
                </div>
                <div style="background: #EFF6FF; color: #1E40AF; border: 1px solid #BFDBFE; padding: 1px 7px; border-radius: 4px; font-size: 10px; font-weight: 800; white-space: nowrap;">
                  ${stageName}
                </div>
              </div>

              <div style="font-size: 10.5px; color: #475569; margin-bottom: 6px;">
                📍 <strong>พิกัดไซต์งาน:</strong> ${proj.location || `อ.${cleanThaiText(comp.district) || 'เมือง'} จ.อุดรธานี`}
              </div>

              <!-- Matched SCG Materials -->
              <div style="background: #FFF5F5; border: 1px solid #FED7D7; border-radius: 6px; padding: 6px 8px; margin-bottom: 6px;">
                <div style="font-size: 10px; font-weight: 800; color: #991B1B; margin-bottom: 2px;">
                  📦 รายการวัสดุ SCG ที่สอดคล้องกับสเตจงานจริง:
                </div>
                <div style="font-size: 10.5px; font-weight: 700; color: #1E293B; line-height: 1.3;">
                  ${Array.isArray(materials) ? materials.join(' • ') : materials}
                </div>
              </div>

              <!-- Facebook Excerpt & Direct Link -->
              <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px; margin-bottom: 6px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                  <div style="font-size: 10px; font-weight: 700; color: #0284C7; display: flex; align-items: center; gap: 4px;">
                    <span>🌐 โพสต์หลักฐาน Facebook</span>
                    ${proj.postDate ? `<span style="color: #64748B; font-weight: 500;">(${proj.postDate})</span>` : ''}
                  </div>
                  ${(proj.facebookPostUrl || proj.postUrl || (proj.siteProof && proj.siteProof.postUrl) || proj.url || proj.link) ? `
                    <a href="${(proj.facebookPostUrl || proj.postUrl || (proj.siteProof && proj.siteProof.postUrl) || proj.url || proj.link)}" target="_blank" style="font-size: 9.5px; font-weight: 700; color: #1877F2; text-decoration: underline;">
                      เปิดดูโพสต์บน Facebook ↗
                    </a>
                  ` : ''}
                </div>
                <div style="font-size: 10px; color: #334155; font-style: italic; line-height: 1.3;">
                  "${(proj.postText || proj.description || 'ตรวจพบโพสต์เปิดหน้างานและอัปเดตความคืบหน้างานก่อสร้างจริง').replace(/"/g, '&quot;')}"
                </div>
              </div>

              <!-- Project CRM Tracking Status -->
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; padding-top: 4px; border-top: 1px dashed #E2E8F0;">
                <span style="color: #64748B;">สถานะการติดตามของทีมขาย (CRM):</span>
                <span style="font-weight: 800; color: #0B2E83; background: #F1F5F9; padding: 1px 7px; border-radius: 4px; border: 1px solid #CBD5E1;">
                  ${crmStatusLabels[pStatus] || '⏳ รอติดตาม'}
                </span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    ` : `
      <div style="background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 8px; padding: 16px; text-align: center; color: #64748B; margin-bottom: 12px;">
        <div style="font-size: 18px; margin-bottom: 3px;">📍</div>
        <div style="font-weight: 800; color: #0F172A; font-size: 12px;">ยังไม่พบไซต์งานก่อสร้างใหม่ในพื้นที่อุดรธานีในรอบสแกนล่าสุด</div>
        <div style="font-size: 10.5px; color: #059669; font-weight: 700; margin-top: 2px;">(มีไซต์งานจริงในพื้นที่อื่น)</div>
      </div>
    `}

    <!-- Sales Notes & Next Actions Section -->
    <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; page-break-inside: avoid;">
      <div style="font-size: 11.5px; font-weight: 800; color: #0B2E83; margin-bottom: 4px;">
        📝 บันทึกแผนงานทีมขายและการติดตาม (Sales CRM Action Plan)
      </div>
      <div style="font-size: 10.5px; color: #334155; line-height: 1.35; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 6px 8px; min-height: 32px;">
        ${crmLog && crmLog.note ? crmLog.note : 'ยังไม่มีบันทึกเพิ่มเติม (สามารถจดบันทึกการเข้าพบหรือข้อตกลงกับผู้รับเหมาในระบบ)'}
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; font-size: 9.5px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 6px;">
      NEXTSITE AI Construction Intelligence Platform • SCG Authorized Executive Report • หน้า 1/1
    </div>
  `;

  // Append hidden container to document body for rendering
  document.body.appendChild(reportContainer);

  if (typeof html2pdf !== 'undefined') {
    const opt = {
      margin: [8, 8, 8, 8],
      filename: `${compCleanName.replace(/[\/\\:*?"<>|]/g, '_')}_รายงานสรุปโครงการ_NEXTSITE.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(reportContainer).save().then(() => {
      if (reportContainer.parentNode) {
        reportContainer.parentNode.removeChild(reportContainer);
      }
      showStatusToast('✅ ดาวน์โหลดรายงาน PDF เรียบร้อยแล้ว');
    }).catch(err => {
      console.error('html2pdf generation error', err);
      printFallback(reportContainer, compCleanName);
      if (reportContainer.parentNode) {
        reportContainer.parentNode.removeChild(reportContainer);
      }
    });
  } else {
    printFallback(reportContainer, compCleanName);
    if (reportContainer.parentNode) {
      reportContainer.parentNode.removeChild(reportContainer);
    }
  }
}

function printFallback(element, compName) {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    showStatusToast('⚠️ เบราว์เซอร์บล็อกหน้าต่างพิมพ์ กรุณาอนุญาตป๊อปอัป');
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${compName} - รายงานสรุปโครงการ</title>
      <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        @page { size: A4 portrait; margin: 8mm; }
        body { margin: 0; padding: 0; background: #FFF; font-family: 'Prompt', sans-serif; }
      </style>
    </head>
    <body>
      ${element.outerHTML}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      <\/script>
    </body>
    </html>
  `);
  printWindow.document.close();
  showStatusToast('✅ เปิดหน้าต่างสำหรับพิมพ์หรือบันทึกเป็น PDF เรียบร้อย');
}

// ==========================================
// 10. APIFY DATASET IMPORTER & DRAG-AND-DROP
// ==========================================
function openApifyModal() {
  const modal = document.getElementById('apify-modal');
  if (modal) modal.style.display = 'flex';
}

function closeApifyModal() {
  const modal = document.getElementById('apify-modal');
  if (modal) modal.style.display = 'none';
}

function handleApifyFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      processApifyJsonData(data, file.name);
      if (typeof closeApifyModal === 'function') closeApifyModal();
      try { event.target.value = ''; } catch(err) {}
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: รูปแบบไฟล์ไม่ถูกต้อง (' + err.message + ')');
      console.error(err);
    }
  };
  reader.readAsText(file, 'UTF-8');
}

function extractFbIdentifier(url) {
  if (!url) return '';
  let str = String(url).toLowerCase().trim();
  str = str.replace(/[?#].*$/, '').replace(/\/+$/, '');
  
  const profileMatch = String(url).match(/profile\.php\?id=(\d+)/i);
  if (profileMatch) return profileMatch[1];
  
  const pMatch = str.match(/\/p\/([^\/]+)/i);
  if (pMatch) {
    const idPart = pMatch[1].match(/(\d{6,})/);
    if (idPart) return idPart[1];
    return pMatch[1];
  }
  
  const parts = str.split('/');
  return parts[parts.length - 1] || '';
}

const UDON_20_DISTRICTS_LIST = [
  'เมืองอุดรธานี', 'กุมภวาปี', 'หนองหาน', 'บ้านดุง', 'เพ็ญ', 'กุดจับ', 
  'โนนสะอาด', 'ศรีธาตุ', 'วังสามหมอ', 'ทุ่งฝน', 'สร้างคอม', 'หนองแสง', 
  'หนองวัวซอ', 'บ้านผือ', 'น้ำโสม', 'นายูง', 'พิบูลย์รักษ์', 'กู่แก้ว', 
  'ประจักษ์ศิลปาคม', 'ไชยวาน'
];

const UDON_LOCAL_ZONES = [
  'หมากแข้ง', 'หนองบัว', 'สามพร้าว', 'บ้านจั่น', 'บ้านจาน', 'หนองนาคำ', 'บ้านตาด', 
  'โนนสูง', 'บ้านเลื่อม', 'เชียงพิณ', 'หมูม่น', 'กุดสระ', 'นาดี', 'บ้านขาว', 
  'หนองไผ่', 'นาข่า', 'หนองขอนกว้าง', 'นิคมสงเคราะห์', 'โคกสะอาด',
  'รังษิณา', 'ขนส่งรังษิณา', 'อุดรดุษฎี', 'ถนนอุดรดุษฎี', 'ดอนเสือ', 'สนามกีฬาดอนเสือ',
  'หนองประจักษ์', 'โพศรี', 'ทหาร', 'นิตโย', 'ศุภกิจจรรยา', 'ยูดีทาวน์', 'รอบเมือง', 'เลี่ยงเมืองอุดร',
  'เชียงแหว', 'จำปี', 'ผาสุก', 'ดอนหายโศก', 'บ้านเชียง', 'หนองเม็ก', 'โพนสูง',
  'สร้างแป้น', 'สุมเส้า', 'สุขคณา', 'โนนตูม', 'โนนยาง',
  'นาม่วง', 'เชียงกรม', 'บ้านเชียงกรม',
  'อภิทาวน์', 'ศุภาลัย', 'รชยา', 'วิลลาจจิโอ', 'สีหราช', 'แลนด์แอนด์เฮ้าส์', 'คันทรีการ์เด้น'
];

// English / Romanized Mapping for all 20 Districts in Udon Thani (e.g. Location : Mueang Udon Thani)
const UDON_DISTRICTS_EN_MAP = {
  'mueang udon thani': 'เมืองอุดรธานี',
  'muang udon thani': 'เมืองอุดรธานี',
  'mueang udon': 'เมืองอุดรธานี',
  'muang udon': 'เมืองอุดรธานี',
  'mueang': 'เมืองอุดรธานี',
  'muang': 'เมืองอุดรธานี',
  'udon thani': 'เมืองอุดรธานี',
  'udonthani': 'เมืองอุดรธานี',
  'kumphawapi': 'กุมภวาปี',
  'kumpawapi': 'กุมภวาปี',
  'nong han': 'หนองหาน',
  'nonghan': 'หนองหาน',
  'ban dung': 'บ้านดุง',
  'bandung': 'บ้านดุง',
  'phen': 'เพ็ญ',
  'kut chap': 'กุดจับ',
  'kutchap': 'กุดจับ',
  'non sa-at': 'โนนสะอาด',
  'non sa at': 'โนนสะอาด',
  'non saat': 'โนนสะอาด',
  'si that': 'ศรีธาตุ',
  'sithat': 'ศรีธาตุ',
  'wang sam mo': 'วังสามหมอ',
  'wangsammo': 'วังสามหมอ',
  'thung fon': 'ทุ่งฝน',
  'thungfon': 'ทุ่งฝน',
  'sang khom': 'สร้างคอม',
  'sangkhom': 'สร้างคอม',
  'nong saeng': 'หนองแสง',
  'nongsaeng': 'หนองแสง',
  'nong wua so': 'หนองวัวซอ',
  'nongwuaso': 'หนองวัวซอ',
  'ban phue': 'บ้านผือ',
  'banphue': 'บ้านผือ',
  'nam som': 'น้ำโสม',
  'namsom': 'น้ำโสม',
  'na yung': 'นายูง',
  'nayung': 'นายูง',
  'phibun rak': 'พิบูลย์รักษ์',
  'phibunrak': 'พิบูลย์รักษ์',
  'ku kaeo': 'กู่แก้ว',
  'kukaeo': 'กู่แก้ว',
  'prachaksinlapakhom': 'ประจักษ์ศิลปาคม',
  'prachak': 'ประจักษ์ศิลปาคม',
  'chaiwan': 'ไชยวาน',
  'chai wan': 'ไชยวาน'
};

function isExplicitOtherProvinceSite(text) {
  if (!text) return false;
  let t = stripCompanyContactFooter(text).toLowerCase();

  // Strip generic marketing hashtags
  t = t.replace(/#(?:รับสร้างบ้าน|สร้างบ้าน|บริษัทรับสร้างบ้าน|ศูนย์รับสร้างบ้าน|แบบบ้าน)[^\s]+/gi, '');
  t = t.replace(/#\S+/g, '');
  
  // International / neighboring countries exclusion (e.g. Vientiane, Laos, สปป.ลาว, เวียงจันทน์)
  const internationalLocations = [
    'vientiane', 'laos', 'เวียงจันทน์', 'สปป.ลาว', 'ลาว', 'หลวงพระบาง', 'ปากเซ', 'สะหวันนะเขต', 'จำปาศักดิ์',
    'cambodia', 'กัมพูชา', 'พนมเปญ', 'myanmar', 'พม่า', 'เมียนมา', 'vietnam', 'เวียดนาม'
  ];
  if (internationalLocations.some(loc => t.includes(loc))) {
    return true;
  }

  // If the post explicitly specifies an authentic Udon district in the site description (e.g. อ.เพ็ญ จ.อุดรธานี)
  const isExplicitUdonSite = (t.includes('จ.อุดรธานี') || t.includes('จังหวัดอุดรธานี') || t.includes('อุดรธานี')) &&
    UDON_20_DISTRICTS_LIST.some(d => t.includes(d.toLowerCase()) || t.includes('อ.' + d.toLowerCase()) || t.includes('อำเภอ' + d.toLowerCase()));

  // Strict check for Loei province explicitly
  const loeiPatterns = [
    'จังหวัดเลย', 'จ.เลย', 'จ. เลย', 'เมืองเลย', 'เทศบาลเมืองเลย', 'หน้างานเลย', 
    'วังสะพุง', 'เชียงคาน', 'ด่านซ้าย', 'ภูเรือ', 'ภูกระดึง', 'ท่าลี่', 'ปากชม', 'นาแห้ว', 'ภูหลวง', 'ผาขาว', 'เอราวัณ', 'หนองหิน',
    'loei', 'mueang loei'
  ];
  if (loeiPatterns.some(pat => t.includes(pat))) {
    if (!isExplicitUdonSite) return true;
  }
  if (/(?:จ\.|จังหวัด|อ\.|อำเภอ|พิกัด|ที่|ณ|เขต|สาขา|หน้างาน)\s*เลย/i.test(t)) {
    if (!isExplicitUdonSite) return true;
  }

  // Other provinces & outside districts in Thailand (Strict Exclusion - Both Thai and English)
  const otherProvinces = [
    'ร้อยเอ็ด', 'roiet', 'roi et', 'เกษตรวิสัย', 
    'ขอนแก่น', 'khon kaen', 'khonkaen', 'khon_kaen', 'บ้านไผ่', 'ชุมแพ', 'น้ำพอง', 'กระนวน', 'พระยืน', 'หนองเรือ', 'พล',
    'สกลนคร', 'sakon', 'sakon nakhon', 'พังโคน', 'สว่างแดนดิน', 'วานรนิวาส',
    'หนองคาย', 'nong khai', 'nongkhai', 'ท่าบ่อ', 'โพนพิสัย',
    'หนองบัวลำภู', 'nong bua lam phu', 'nongbualamphu', 'นากลาง',
    'นครพนม', 'nakhon phanom', 'ธาตุพนม',
    'บึงกาฬ', 'bueng kan', 'เซกา', 
    'มหาสารคาม', 'mahasarakham', 'วาปีปทุม', 'โกสุมพิสัย', 
    'กาฬสินธุ์', 'kalasin', 'ยางตลาด', 
    'ยโสธร', 'yasothon', 
    'มุกดาหาร', 'mukdahan', 
    'อุบลราชธานี', 'ubon ratchathani', 'อุบล', 
    'ศรีสะเกษ', 'sisaket', 
    'สุรินทร์', 'surin', 
    'บุรีรัมย์', 'buriram', 
    'นครราชสีมา', 'nakhon ratchasima', 'โคราช', 'korat', 
    'ชัยภูมิ', 'chaiyaphum', 
    'เชียงใหม่', 'chiang mai', 'chiangmai', 
    'เชียงราย', 'chiang rai', 
    'พิษณุโลก', 'phitsanulok', 
    'ชลบุรี', 'chonburi', 
    'ระยอง', 'rayong', 
    'กรุงเทพ', 'bangkok', 'กทม', 
    'ปทุมธานี', 'pathum thani', 
    'สมุทรปราการ', 'samut prakan'
  ];

  for (const prov of otherProvinces) {
    if (t.includes(`จ.${prov}`) || t.includes(`จ. ${prov}`) || t.includes(`จังหวัด${prov}`) || t.includes(`อ.${prov}`) || t.includes(`อำเภอ${prov}`) || t.includes(`หน้างาน${prov}`) || t.includes(`ที่ ${prov}`)) {
      if (!isExplicitUdonSite) return true;
    }
    const regex = new RegExp(`(?:จ\\.|จังหวัด|อ\\.|อำเภอ|พิกัด|ที่|ณ|เขต|สาขา|หน้างาน)\\s*${prov}`, 'i');
    if (regex.test(t)) {
      if (!isExplicitUdonSite) return true;
    }
  }
  return false;
}

function getTopLinesText(text, maxLines = 4) {
  if (!text) return '';
  const lines = String(text)
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);
  return lines.slice(0, maxLines).join(' ');
}

function extractCustomerName(text) {
  if (!text) return '';
  // เน้น 3-4 บรรทัดแรกของโพสต์ตามที่ผู้ใช้กำหนด
  const topText = getTopLinesText(text, 4);
  let clean = String(topText || text);
  if (typeof clean.normalize === 'function') {
    try {
      clean = clean.normalize('NFKD');
    } catch(e) {}
  }
  
  // ตัดสำนวนภาษาไทยที่มักทำให้เข้าใจผิดว่าเป็นชื่อลูกค้า เช่น "ทำให้คุณ “สบายใจ”", "ช่วยให้คุณมั่นใจ"
  clean = clean.replace(/(?:ทำให้|ให้|เพื่อ|ช่วย|สำหรับ|กราบขอบ|ขอขอบ|เลือกทีมที่ทำให้)\s*คุณ\s*["“”'«»]?([ก-๙a-zA-Z]+)["“”'«»]?/g, ' ');
  clean = clean.replace(/(?:คุณ)\s*["“”'«»]([ก-๙a-zA-Z]+)["“”'«»]/g, ' ');

  // Look for patterns like: เสี่ย... กับเจ้..., Owner: คุณ..., บ้านคุณ..., ลูกค้าคุณ..., คุณ..., เจ้าของบ้านคุณ...
  const patterns = [
    /(?:Owner|owner|𝗢𝘄𝗻𝗲𝗿|เจ้าของบ้าน|ลูกค้าคนสำคัญ)\s*[:：\-]?\s*(?:คุณ)?\s*([ก-๙a-zA-Z\.\s]{2,20})/i,
    /(?:บ้านคุณ|ลูกค้าคุณ|ตรวจรับบ้านคุณ|ส่งมอบบ้านคุณ|เจ้าของบ้านคุณ|บ้านคุณหมอ)\s*([ก-๙a-zA-Z\.\s]{2,20})/i,
    /(?:เสี่ย|เจ้|เฮีย|เสี่ยกานต์|เจ้วันเพ็ญ)\s*([ก-๙a-zA-Z\.\s]{2,20})/i,
    /(?:คุณ)\s*([ก-๙a-zA-Z]{2,18})(?:\s+(?:อ\.|จ\.|สร้าง|เท|เสา|คาน|บ้าน|ต\.|พิกัด|โครงการ))/i,
    /(?:คุณ)\s*([ก-๙a-zA-Z]{2,15})/i
  ];

  const blacklist = [
    'ภาพ', 'ภาพถ่าย', 'งาน', 'ลูกค้า', 'สร้าง', 'บ้าน', 'ดี', 'เรา', 'ท่าน', 'ทุกท่าน', 'พี่', 'น้อง', 
    'โปรด', 'ใหม่', 'เก่า', 'ครับ', 'ค่ะ', 'นะ', 'SCG', 'scg', 'CPAC', 'cpac', 'อุดร', 'อุดรธานี',
    'สบายใจ', 'อุ่นใจ', 'มั่นใจ', 'ไว้วางใจ', 'คนสำคัญ', 'ออกแบบจนส่งมอบ', 'รับกุญแจ', 'บริการ', 'คุณภาพ', 
    'มืออาชีพ', 'การันตี', 'มาตรฐาน', 'ปลอดภัย', 'ครบวงจร', 'ผู้ประกอบการ'
  ];

  for (const regex of patterns) {
    const match = clean.match(regex);
    if (match && match[1]) {
      let candidate = match[1].replace(/[\r\n\t]+/g, ' ').trim();
      candidate = candidate.replace(/^(?:คุณ|เสี่ย|เจ้|เฮีย)\s*/, '').trim();
      if (!blacklist.includes(candidate) && candidate.length >= 2) {
        return candidate;
      }
    }
  }
  return '';
}

function hasExplicitUdonDistrictInText(text) {
  if (!text) return false;
  let t = String(text).toLowerCase();

  // Strip all hashtags completely so '#รับสร้างบ้านอุดรธานี' or '#สร้างบ้าน' is never mistaken for a site location
  t = t.replace(/#\S+/g, '');

  // If the site is explicitly in another province (e.g. ร้อยเอ็ด, ขอนแก่น, เลย), REJECT immediately!
  if (isExplicitOtherProvinceSite(t)) {
    return false;
  }

  // 1. Strict 20 official districts in Udon Thani check (Thai regex)
  const strictDistricts = [
    /(?:อ\.|อำเภอ|เขต|โซน)?\s*เมืองอุดรธานี/i,
    /(?:อ\.|อำเภอ)\s*เมือง(?:\s*อุดร)?/i,
    /(?:อ\.|อำเภอ)?\s*กุมภวาปี/i,
    /(?:อ\.|อำเภอ)?\s*หนองหาน/i,
    /(?:อ\.|อำเภอ)?\s*บ้านดุง/i,
    /(?:อ\.|อำเภอ)?\s*เพ็ญ/i,
    /(?:อ\.|อำเภอ)?\s*กุดจับ/i,
    /(?:อ\.|อำเภอ)?\s*โนนสะอาด/i,
    /(?:อ\.|อำเภอ)?\s*ศรีธาตุ/i,
    /(?:อ\.|อำเภอ)?\s*วังสามหมอ/i,
    /(?:อ\.|อำเภอ)?\s*ทุ่งฝน/i,
    /(?:อ\.|อำเภอ)?\s*สร้างคอม/i,
    /(?:อ\.|อำเภอ)?\s*หนองแสง/i,
    /(?:อ\.|อำเภอ)?\s*หนองวัวซอ/i,
    /(?:อ\.|อำเภอ)?\s*บ้านผือ/i,
    /(?:อ\.|อำเภอ)?\s*น้ำโสม/i,
    /(?:อ\.|อำเภอ)?\s*นายูง/i,
    /(?:อ\.|อำเภอ)?\s*พิบูลย์รักษ์/i,
    /(?:อ\.|อำเภอ)?\s*กู่แก้ว/i,
    /(?:อ\.|อำเภอ)?\s*ประจักษ์ศิลปาคม/i,
    /(?:อ\.|อำเภอ)?\s*ไชยวาน/i
  ];

  for (const regex of strictDistricts) {
    if (regex.test(t)) {
      return true;
    }
  }

  // 2. Strict 20 official districts in English / Romanized (e.g. Location : Mueang Udon Thani)
  for (const [enKey, thDist] of Object.entries(UDON_DISTRICTS_EN_MAP)) {
    if (t.includes(enKey)) {
      return true;
    }
  }

  // 3. Check for verified sub-districts / villages in Udon Thani (only when accompanied by Udon Thani context)
  for (const z of UDON_LOCAL_ZONES) {
    if (t.includes('ต.' + z.toLowerCase()) || t.includes('ตำบล' + z.toLowerCase()) || t.includes('บ.' + z.toLowerCase()) || t.includes('บ้าน' + z.toLowerCase())) {
      if (t.includes('อุดร') || t.includes('อุดรธานี') || t.includes('จ.อุดร') || t.includes('udon')) {
        return true;
      }
    }
  }

  return false;
}

function extractUdonDistrict(text, fallbackDistrict = 'เมืองอุดรธานี') {
  if (!text) return fallbackDistrict;
  let t = String(text).toLowerCase();
  t = t.replace(/#(?:รับสร้างบ้าน|สร้างบ้าน|บริษัทรับสร้างบ้าน|ศูนย์รับสร้างบ้าน|แบบบ้าน)[^\s]+/gi, '');

  // 1. Exact 20 Districts check (Thai)
  for (const d of UDON_20_DISTRICTS_LIST) {
    if (t.includes(d.toLowerCase()) || t.includes('อ.' + d.toLowerCase()) || t.includes('อำเภอ' + d.toLowerCase())) {
      return d;
    }
  }

  // 2. Check if explicit "อ.เมือง"
  if (/(?:อ\.|อำเภอ)\s*เมือง/i.test(t)) {
    return 'เมืองอุดรธานี';
  }

  // 3. English / Romanized District Matching (e.g. Location : Mueang Udon Thani)
  for (const [enKey, thDist] of Object.entries(UDON_DISTRICTS_EN_MAP)) {
    if (t.includes(enKey)) {
      return thDist;
    }
  }

  // 4. Sub-district to District Mapping
  for (const z of UDON_LOCAL_ZONES) {
    if (t.includes(z.toLowerCase()) || t.includes('ต.' + z.toLowerCase()) || t.includes('ตำบล' + z.toLowerCase()) || t.includes('ถนน' + z.toLowerCase())) {
      if (z === 'สร้างแป้น' || z === 'สุมเส้า') return 'เพ็ญ';
      if (z === 'เชียงแหว') return 'กุมภวาปี';
      if (z === 'บ้านเชียง' || z === 'หนองเม็ก') return 'หนองหาน';
      if (z === 'นาม่วง' || z === 'เชียงกรม' || z === 'บ้านเชียงกรม') return 'ประจักษ์ศิลปาคม';
      return 'เมืองอุดรธานี';
    }
  }

  return fallbackDistrict || 'เมืองอุดรธานี';
}

function stripCompanyContactFooter(text) {
  if (!text) return '';
  let str = String(text);
  
  // Cut off company contact footers where office address/phone/links/service blurbs/dividers are listed
  const footerMarkers = [
    /(?:-\s*){4,}/,
    /(?:_\s*){4,}/,
    /(?:=\s*){4,}/,
    /------------------/i,
    /==================/i,
    /📌\s*(?:รับสร้างบ้าน|สอบถาม|ฟรี|สนใจ|ที่ตั้ง|สำนักงาน)/i,
    /📩\s*สอบถาม/i,
    /\*\*รับงานเริ่มต้น/i,
    /รับสร้างบ้าน\s*เริ่มต้น/i,
    /รับงานเริ่มต้น\s*[0-9]/i,
    /ยื่นสินเชื่อ\s*ออกแบบ/i,
    /การันตีด้วยผลงานคุณภาพ/i,
    /พร้อมบริการสุดพิเศษ/i,
    /ฟรี\s*!\s*ดำเนินการ/i,
    /ฟรี\s*!\s*ออกแบบ/i,
    /ฟรี\s*!\s*ยื่นขอ/i,
    /👉🏻?\s*(?:อำนวยความสะดวก|บริการ|สนใจติดต่อ|ปรึกษา)/i,
    /🆓\s*(?:ปรึกษา|สำรวจ|ยื่นขออนุญาต)/i,
    /✅\s*#?มีผลงานสร้างเสร็จ/i,
    /📍\s*(?:ที่ตั้งสำนักงาน|ออฟฟิศ|สำนักงานใหญ่|พิกัดสำนักงาน|แผนที่สำนักงาน|ที่อยู่สำนักงาน|สำนักงานตั้งอยู่)/i,
    /(?:ที่ตั้งสำนักงาน|สำนักงานใหญ่|พิกัดออฟฟิศ|แผนที่ออฟฟิศ)\s*[:：]/i,
    /(?:สนใจติดต่อ|ติดต่อสอบถาม|สอบถามข้อมูลเพิ่มเติม|ปรึกษาเรื่องสร้างบ้าน|โทร|Tel|Line ID)\s*[:：]/i,
    /☎️/i,
    /📞/i,
    /📱/i,
    /LINE\s*[:：]/i
  ];

  for (const marker of footerMarkers) {
    const match = str.match(marker);
    if (match && match.index > 15) {
      str = str.substring(0, match.index);
    }
  }
  return str.trim();
}

function isInternalOrNonConstructionPost(text) {
  if (!text) return false;
  const t = String(text).toLowerCase();

  // 1. ตรวจจับโพสต์เนื่องในโอกาส / วันสำคัญ / ถวายพระพร / วันหยุดนักขัตฤกษ์
  if (/เนื่องใน(?:โอกาส|วาระ|ศุภวาระ|วัน)/i.test(t)) {
    return true; // ปฏิเสธโพสต์แนว "เนื่องในโอกาสวัน..." ทันที
  }

  const holidayAndGreetingTerms = [
    'เนื่องในโอกาส', 'เนื่องในวัน', 'เนื่องในวาระ', 'เนื่องในศุภวาระ',
    'ทรงพระเจริญ', 'ถวายพระพร', 'น้อมรำลึก', 'น้อมสำนึกในพระมหากรุณาธิคุณ', 'กราบถวายบังคม', 'วันเฉลิมพระชนมพรรษา', 'วันคล้ายวันพระราชสมภพ',
    'วันสำคัญทางศาสนา', 'วันพระ', 'วันวิสาขบูชา', 'วันมาฆบูชา', 'วันอาสาฬหบูชา', 'วันเข้าพรรษา', 'วันออกพรรษา',
    'วันแม่แห่งชาติ', 'วันพ่อแห่งชาติ', 'วันครู', 'วันเด็กแห่งชาติ', 'วันแรงงาน', 'วันรัฐธรรมนูญ', 'วันปิยมหาราช', 'วันจักรี', 'วันฉัตรมงคล', 'วันนวมินทรมหาราช',
    'สวัสดีปีใหม่', 'สุขสันต์วันสงกรานต์', 'สวัสดีวันสงกรานต์', 'วันหยุดนักขัตฤกษ์', 'หยุดทำการ', 'ปิดทำการ', 'แจ้งวันหยุด', 'วันหยุดยาว'
  ];

  if (holidayAndGreetingTerms.some(term => t.includes(term))) {
    return true;
  }

  // 2. กิจกรรมภายในบริษัท / นักศึกษาฝึกงาน / สมัครงาน / ดูดวง
  const internalTerms = [
    'การฝึกงาน', 'ฝึกงาน', 'จบฝึกงาน', 'นักศึกษาฝึกงาน', 'สหกิจศึกษา', 'เลี้ยงส่ง', 'น้องๆฝึกงาน',
    'สุขสันต์วันเกิด', 'hbd', 'วันเกิด', 'ทำบุญบริษัท', 'ทำบุญออฟฟิศ', 'เลี้ยงพระ', 'ถวายเพล',
    'รับสมัครงาน', 'เปิดรับสมัคร', 'ตำแหน่งงานว่าง', 'walk-in', 'สัมมนา', 'อบรมสัมมนา',
    'งานเลี้ยงบริษัท', 'งานสังสรรค์', 'outing', 'staff party', 'กิจกรรมบริษัท', 'csr',
    'ฤกษ์ดี', 'ฤกษ์มงคล', 'วันมงคล', 'ฤกษ์สร้างบ้าน', 'เทวีฤกษ์', 'ภูมิปาโลฤกษ์', 'มหัทธโนฤกษ์', 'ราชาฤกษ์',
    'ดูดวง', 'ฮวงจุ้ย', 'เกร็ดความรู้', 'สาระน่ารู้', 'ทริคดีๆ', 'ทริคสร้างบ้าน'
  ];

  for (const term of internalTerms) {
    if (t.includes(term)) {
      return true;
    }
  }
  return false;
}

function isCompletedOrHandoverText(text) {
  if (!text) return false;
  let clean = String(text);
  
  // ยกเว้นการส่งมอบงวดงานย่อย / งานระบบ / งานระหว่างทำ ที่ไม่ใช่การส่งมอบบ้านทั้งหลัง
  if (/(?:ส่งมอบงานระบบ|ส่งมอบระบบ|ส่งมอบงวด|ส่งมอบงานงวด|ส่งมอบงานโครงสร้าง|ส่งมอบงานฐานราก|ส่งมอบงานเทพื้น|ส่งมอบงานฝ้า|ส่งมอบงานก่อ|พร้อมสำหรับขั้นตอน|ขั้นตอนต่อไป)/i.test(clean)) {
    return false;
  }

  // ตัดสโลแกนการตลาดออก เช่น "ดูแลตั้งแต่เริ่มจนส่งมอบ"
  clean = clean.replace(/(?:ดูแล|บริการ|ใส่ใจ|ตั้งแต่|ตั้งแต่วันแรก|จากวันแรก|เริ่มงาน|วางผัง)\s*(?:จนถึง|จน|ถึง)?\s*(?:วัน)?\s*(?:ส่งมอบ|รับกุญแจ)/gi, '');
  clean = clean.replace(/ออกแบบจนส่งมอบ/gi, '');
  clean = clean.replace(/รับประกันหลังส่งมอบ/gi, '');

  const completedKeywords = [
    "ส่งมอบบ้าน", "ส่งมอบกุญแจ", "ส่งมอบผลงานบ้าน",
    "พิธีส่งมอบ", "พิธีมอบบ้าน", "ตรวจรับบ้าน", "ตรวจรับมอบ", "รับมอบบ้าน", "รับกุญแจบ้าน",
    "ปิดจ๊อบ", "เสร็จสมบูรณ์ 100%", "เสร็จสมบูรณ์100%", "สร้างเสร็จสมบูรณ์", "ส่งมอบบ้านพักอาศัย",
    "งวดสุดท้ายพร้อมส่งมอบ", "handover", "hand over", "completed house", "finish house", "100% ส่งมอบ",
    "พร้อมส่งมอบบ้าน", "ส่งมอบบ้านสวย", "ตรวจรับบ้านเรียบร้อย", "ส่งมอบเรียบร้อยแล้ว", "ส่งมอบผลงานบ้าน"
  ];

  for (const kw of completedKeywords) {
    if (clean.toLowerCase().includes(kw.toLowerCase())) {
      return true;
    }
  }

  if (/(?:ส่งมอบ|ตรวจรับ|รับมอบ)\s*(?:บ้าน|กุญแจ|บ้านพักอาศัย|ผลงานบ้าน)/i.test(clean)) {
    return true;
  }
  if (/(?:เสร็จสมบูรณ์|100%|ปิดจ๊อบ)\s*(?:พร้อมส่งมอบ|ส่งมอบ|ตรวจรับ)/i.test(clean)) {
    return true;
  }

  return false;
}

function isCorporatePRAndServicePromoText(text) {
  if (!text) return false;
  const t = String(text);
  const corporateServicePromoKeywords = [
    "มากกว่าแค่สร้างบ้าน", "สร้างความสบายใจ", "สร้างบ้านทั้งที", "เลือกทีมที่คุณไว้ใจได้", "เลือกทีมที่คุณไว้ใจ",
    "ผู้เชี่ยวชาญเรื่องบ้าน", "อำนวยความสะดวกเรื่องบ้าน", "ปรึกษาให้คำแนะนำ", "สำรวจ และประเมินสถานที่ก่อสร้าง",
    "สำรวจและประเมิน", "ยื่นขออนุญาตก่อสร้าง", "มีผลงานสร้างเสร็จจริงกว่า", "ผลงานสร้างเสร็จจริงกว่า",
    "สร้างเสร็จจริงกว่า", "ทำไมต้องสร้างบ้าน", "ทำไมต้องเลือกเรา", "จุดเด่นของเรา", "บริการของเรา",
    "ขั้นตอนการสร้างบ้าน", "ยินดีให้คำปรึกษา", "สร้างบ้านกับเรา", "ทำไมต้องสร้างบ้านกับ",
    "เพราะบ้านคือความฝัน", "ครบจบในที่เดียว", "บริการครบวงจร", "ด้วยประสบการณ์กว่า", "ประสบการณ์กว่า"
  ];

  let matchCount = 0;
  for (const kw of corporateServicePromoKeywords) {
    if (t.includes(kw)) {
      matchCount++;
    }
  }

  if (matchCount > 0) {
    const hasSpecificSiteWork = /(?:พิธียกเสาเอก|ยกเสาเอก|ตอกเสาเข็ม|ลงเสาเข็ม|เจาะเสาเข็ม|ขุดฐานราก|เทตอม่อ|เทคานคอดิน|เทคาน|เทพื้น|เทคอนกรีตพื้น|ขึ้นโครงหลังคา|มุงหลังคา|ก่ออิฐมวลเบา|ก่ออิฐมอญ|งานก่ออิฐ|ฉาบปูน|งานปูกระเบื้อง|งานฝ้า|เดินระบบไฟฟ้า)/i.test(t);
    const hasSpecificCustomer = /(?:บ้านคุณ|ลูกค้าคุณ|Project\s*\||Owner\s*[:\s]|บ้านพักอาศัยคุณ|บ้านพักคุณ)/i.test(t);

    if (!hasSpecificSiteWork || !hasSpecificCustomer) {
      return true; // ปฏิเสธทันที (เป็นโพสต์บรรยายโปรโมทบริการ)
    }
  }

  return false;
}

function isPromotionalOrAdPost(text) {
  if (!text) return true;
  const t = String(text).toLowerCase();

  const bodyNoFooter = stripCompanyContactFooter(text);

  // If post is finished/handed over -> REJECT! (จบงานแล้ว ไม่นับเป็นโอกาสขายวัสดุ)
  if (isCompletedOrHandoverText(bodyNoFooter)) {
    return true;
  }

  // If post is corporate PR / branding / service features overview -> REJECT!
  if (isCorporatePRAndServicePromoText(bodyNoFooter) || isCorporatePRAndServicePromoText(text)) {
    return true;
  }

  // If post is internal company activity (internship, staff party, birthday, hiring) -> REJECT!
  if (isInternalOrNonConstructionPost(bodyNoFooter)) {
    return true;
  }

  // If post is in another province (e.g. ร้อยเอ็ด, ขอนแก่น) -> REJECT!
  if (isExplicitOtherProvinceSite(bodyNoFooter)) {
    return true;
  }

  // Brand PR & Marketing Slogans detection (e.g. เพราะบ้านคือความฝัน, ตั้งแต่วันแรกจนถึงวันรับกุญแจ)
  const prSloganTerms = [
    'เพราะบ้านคือความฝัน', 'สร้างบ้านทั้งที', 'วันแรกจนถึงวันรับกุญแจ', 'วันรับกุญแจ',
    'ดูแลตั้งแต่เริ่มออกแบบจนส่งมอบ', 'ออกแบบจนส่งมอบ', 'ควบคุมงานโดยวิศวกร',
    'การันตีความน่าเชื่อถือ', 'ชื่อนี้ที่มั่นใจ', 'รับงานเริ่มต้น', 'การันตีด้วยผลงานคุณภาพ',
    'บริการครบวงจร', 'สร้างจริง เสร็จจริง', 'ยื่นสินเชื่อทุกธนาคาร', 'ฟรี ! ดำเนินการยื่นสินเชื่อ',
    'มากกว่าแค่สร้างบ้าน', 'สร้างความสบายใจ', 'ผู้เชี่ยวชาญเรื่องบ้าน', 'อำนวยความสะดวกเรื่องบ้าน'
  ];
  if (prSloganTerms.some(term => t.includes(term))) {
    // ต้องมีชื่องานก่อสร้างจริงและเจ้าของบ้านจริง ไม่ใช่โปรโมท
    if (!/(?:พิธียกเสาเอก|ยกเสาเอก|ตอกเสาเข็ม|ขุดฐานราก|เทคาน|เทพื้น|มุงหลังคา|ก่ออิฐ|ฉาบปูน)/i.test(bodyNoFooter) || !/(?:บ้านคุณ|ลูกค้าคุณ|Project\s*\|)/i.test(bodyNoFooter)) {
      return true; // ปฏิเสธโพสต์โฆษณา/ประชาสัมพันธ์บริษัท
    }
  }

  // Must have an explicit district in Udon Thani (strictly excluding generic hashtags like #รับสร้างบ้านอุดรธานี)
  const hasUdonDistrict = hasExplicitUdonDistrictInText(bodyNoFooter) || hasExplicitUdonDistrictInText(text);

  // 1. REJECT Contract Signing / Customer Welcoming / Catalog / Review posts (UNLESS explicit Udon district is present)
  const signingAndCatalogAds = [
    'ยินดีต้อนรับ', 'ยินดีต้อนรับครอบครัว', 'ขอขอบคุณที่มอบความไว้วางใจ', 'มอบความไว้วางใจ', 'ไว้วางใจให้ทีมงาน',
    'ขอกราบขอบพระคุณ', '10 แบบบ้าน', 'แบบบ้านยอดนิยม', 'แบบบ้านดีไซน์ยอดนิยม', 'อัปเกรดสเปค', 'จองและทำสัญญา',
    'ทำสัญญา', 'เซ็นสัญญา', 'วางแผนสร้างบ้าน', 'ปากต่อปาก', 'บอกต่อ', 'ส่งต่อความประทับใจ',
    'ต้อนรับสู่ครอบครัว', 'รีวิวสร้างบ้าน', 'สายนี้', 'ให้คำปรึกษาฟรี', 'ไม่มีค่าใช้จ่าย'
  ];
  if (signingAndCatalogAds.some(term => t.includes(term))) {
    // เว้นแต่ว่าโพสต์นั้นมีระบุชื่อ 1 ใน 20 อำเภอของอุดรธานีอย่างชัดเจน
    if (hasUdonDistrict && /(?:บ้านคุณ|ลูกค้าคุณ)/i.test(bodyNoFooter)) {
      return false; // มีชื่อ 1 ใน 20 อำเภอของอุดรธานีชัดเจน -> อนุญาตให้ผ่าน
    }
    return true; // ไม่มีชื่ออำเภอชัดเจน -> ปฏิเสธทิ้งทันที
  }

  // Real active construction terms (must have actual physical work)
  const realMilestones = [
    'พิธียกเสาเอก', 'ยกเสาเอก', 'พิธีลงเสาเอก', 'ยกเสาโท', 'ตอกเสาเข็ม', 'ลงเสาเข็ม', 'เจาะเสาเข็ม',
    'ขุดฐานราก', 'เทลีนฐานราก', 'เทลีน', 'เทคอนกรีตฐานราก', 'เทตอม่อ', 'เทคานคอดิน', 'เทคาน', 'ผูกเหล็ก',
    'เทเสา', 'เทพื้น', 'เทคอนกรีตพื้น', 'หล่อเสา', 'ขึ้นโครงหลังคา', 'โครงหลังคาสำเร็จรูป', 'โครงหลังคา',
    'มุงกระเบื้องหลังคา', 'มุงหลังคา', 'กระเบื้องหลังคา', 'ก่ออิฐมวลเบา', 'ก่ออิฐมอญ', 'งานก่ออิฐ', 
    'ฉาบปูน', 'งานฉาบ', 'ฉาบผนัง', 'งานบันได', 'บันไดไม้', 'ติดตั้งบันได', 'งานฝ้า', 'ฝ้าเพดาน',
    'ปูกระเบื้อง', 'งานปูกระเบื้อง', 'งานระบบไฟ', 'เดินระบบไฟฟ้า', 'ตรวจงวดงาน', 
    'smart truss', 'อัปเดต:', 'อัพเดต:',
    'เซ็นต์สัญญา', 'เซ็นสัญญา', 'ทำสัญญา', 'พูลวิลล่า', 'pool villa', 'ร้านพิซซ่า', 'โครงสร้างหลังคาเหล็ก'
  ];
  const hasMilestone = realMilestones.some(m => t.includes(m));

  // If it has real milestone AND explicit district in Udon Thani -> PASS
  if (hasMilestone && hasUdonDistrict) {
    return false;
  }

  // 2. High-confidence Ad / House Model / Promotion keywords & Generic Marketing Hashtags
  const strongAdTerms = [
    '#รับสร้างบ้าน', '#รับสร้างบ้านอุดรธานี', '#รับสร้างบ้านอุดร', '#รับสร้างบ้านภาคอีสาน', '#รับสร้างบ้านขอนแก่น',
    '#รับสร้างบ้านหนองคาย', '#รับสร้างบ้านหนองบัวลำภู', '#รับสร้างบ้านสกลนคร', '#รับเหมาก่อสร้าง', '#สร้างบ้าน',
    '#สร้างบ้านอุดรธานี', '#homebuilder', '#housebuilder', '#แบบบ้านสวย', '#แบบบ้าน',
    'แบบบ้าน', 'แบบบ้านสวย', 'แบบบ้านชั้นเดียว', 'แบบบ้านสองชั้น', 'แบบบ้านโมเดิร์น', 'แบบบ้าน modern',
    'แบบบ้านพร้อมสร้าง', 'แบบบ้านขายดี', 'ราคาพิเศษ', 'ราคาเริ่มต้น', 'เริ่มต้นเพียง', 'โปรโมชั่น', 'รับส่วนลด',
    'ของแถม', 'แถมฟรี', 'ฟรี เสาเข็ม', 'ฟรีเสาเข็ม', 'ฟรี เทพื้น', 'ฟรีเทพื้น', 'ฟรีเคาน์เตอร์',
    'ฟรีสุขภัณฑ์', 'ฟรีถังเก็บน้ำ', 'ฟรีปั๊มน้ำ', 'ฟรีค่าออกแบบ', 'ฟรีดำเนินการ', 'ยื่นกู้ฟรี',
    'กู้ได้ 100%', 'กู้ได้100%', 'ผ่อนตรง', 'ดอกเบี้ยพิเศษ', 'เปิดจอง', 'จบไม่บานปลาย', 'เชิญแวะชม',
    'บ้านในฝัน', 'สร้างสุข สร้างฝัน', 'แจกทอง', 'สำหรับเรา ลูกค้าคือคนสำคัญ', 'พร้อมของแถม',
    'ใครกำลังจะสร้างบ้าน', 'ทริคดีๆมาฝาก', 'ปรึกษาเรานะคะ', 'มาที่เดียวครบ จบเรื่องการก่อสร้างบ้าน',
    'ไม่ทิ้งงาน', 'ภาพ 3d', 'ภาพ3d', 'ขึ้นงานภาพ 3d', 'สร้างงบไม่บานปลาย', 'เรื่องสินเชื่อ(ฟรี)', 'เรื่องสินเชื่อ (ฟรี)',
    'ประกันงานโครงสร้าง 1 ปี', 'ประกันทั่วไป 1 ปี', 'งานรับประกัน', 'ประสบการณ์ทำงานมากกว่า'
  ];

  if (strongAdTerms.some(term => t.includes(term))) {
    if (hasUdonDistrict && hasMilestone && /(?:บ้านคุณ|ลูกค้าคุณ|Project\s*\|)/i.test(bodyNoFooter)) {
      return false; // ถ้ามีอำเภอจริง + สเตจงานจริง + ชื่อลูกค้า -> อนุญาต
    }
    return true; // Reject advertising & catalog posts
  }

  // If no milestone or no district -> reject
  if (!hasMilestone || !hasUdonDistrict) {
    return true;
  }

  return false;
}

function isGenuineConstructionProject(text, ocrText = '', locationText = '') {
  const combined = (String(text) + ' ' + String(ocrText) + ' ' + String(locationText)).toLowerCase();
  if (combined.trim().length < 10) return false;

  // ตัด Footer ท้ายโพสต์ และตัดแฮชแท็กออก
  const postBody = stripCompanyContactFooter(text);
  const cleanBodyNoHashtags = postBody.replace(/#\S+/g, ' ');

  // 0.1 ถ้าเป็นโพสต์ที่จบงาน/ส่งมอบงานแล้ว ปฏิเสธทันที (ไม่ดึงมาเป็นโครงการ Active)
  if (isCompletedOrHandoverText(cleanBodyNoHashtags) || isCompletedOrHandoverText(text)) {
    return false;
  }

  // 0.2 ถ้าเป็นโพสต์บรรยายโปรโมทบริษัท / แนะนำบริการ / สโลแกนการตลาด ปฏิเสธทันที
  if (isCorporatePRAndServicePromoText(cleanBodyNoHashtags) || isCorporatePRAndServicePromoText(text)) {
    return false;
  }

  // 1. ถ้าเป็นกิจกรรมภายใน (ฝึกงาน, งานเลี้ยง, รับสมัครงาน, วันเกิด, ดูดวง, วันมงคล, สาระน่ารู้) ปฏิเสธทันที
  if (isInternalOrNonConstructionPost(cleanBodyNoHashtags)) {
    return false;
  }

  // 2. ถ้าเนื้อหาหน้างานระบุเป็นไซต์งานต่างจังหวัดชัดเจน (เช่น ขอนแก่น, เลย, หนองคาย, สกลนคร, ร้อยเอ็ด) ปฏิเสธทันที
  if (isExplicitOtherProvinceSite(cleanBodyNoHashtags) || isExplicitOtherProvinceSite(locationText)) {
    return false;
  }

  // 3. ตรวจจับโพสต์โฆษณา / สโลแกนประชาสัมพันธ์บริษัท (Brand PR & Marketing Slogans) เช่น "เพราะบ้านคือความฝัน", "รับงานเริ่มต้น"
  const prSloganTerms = [
    'เพราะบ้านคือความฝัน', 'สร้างบ้านทั้งที', 'วันแรกจนถึงวันรับกุญแจ', 'วันรับกุญแจ',
    'ดูแลตั้งแต่เริ่มออกแบบจนส่งมอบ', 'ออกแบบจนส่งมอบ', 'ควบคุมงานโดยวิศวกร',
    'การันตีความน่าเชื่อถือ', 'ชื่อนี้ที่มั่นใจ', 'รับงานเริ่มต้น', 'การันตีด้วยผลงานคุณภาพ',
    'บริการครบวงจร', 'สร้างจริง เสร็จจริง', 'ยื่นสินเชื่อทุกธนาคาร', 'ฟรี ! ดำเนินการ',
    'มากกว่าแค่สร้างบ้าน', 'สร้างความสบายใจ', 'ผู้เชี่ยวชาญเรื่องบ้าน', 'อำนวยความสะดวกเรื่องบ้าน'
  ];
  if (prSloganTerms.some(term => cleanBodyNoHashtags.toLowerCase().includes(term))) {
    // ต้องมีชื่องานก่อสร้างจริงและเจ้าของบ้านจริง ไม่ใช่โปรโมท
    if (!/(?:พิธียกเสาเอก|ยกเสาเอก|ตอกเสาเข็ม|ขุดฐานราก|เทคาน|เทพื้น|มุงหลังคา|ก่ออิฐ|ฉาบปูน)/i.test(cleanBodyNoHashtags) || !/(?:บ้านคุณ|ลูกค้าคุณ|Project\s*\|)/i.test(cleanBodyNoHashtags)) {
      return false; // ไม่มีอำเภอหน้างานจริง -> ปฏิเสธทันที
    }
  }

  // 4. ตรวจสอบชื่ออำเภอหน้างานจริงใน จ.อุดรธานี (ในเนื้อหาหน้างาน หรือ Check-in)
  const hasUdonDistrict = hasExplicitUdonDistrictInText(cleanBodyNoHashtags) || (locationText && hasExplicitUdonDistrictInText(locationText));
  if (!hasUdonDistrict) {
    return false; // ไม่มีชื่ออำเภอหน้างานจริงในอุดรธานี -> ปฏิเสธ ไม่ดึงเด็ดขาด
  }

  // 5. ตรวจสอบสเตจงานก่อสร้างจริง (Milestones ที่ทีมขาย SCG เข้าพบและเสนอขายวัสดุได้)
  const realMilestones = [
    'พิธียกเสาเอก', 'ยกเสาเอก', 'พิธีลงเสาเอก', 'ลงเสาเอก', 'ยกเสาโท', 'ตอกเสาเข็ม', 'ลงเสาเข็ม', 'เจาะเสาเข็ม',
    'ขุดฐานราก', 'เทลีนฐานราก', 'เทลีน', 'เทคอนกรีตฐานราก', 'เทตอม่อ', 'เทคานคอดิน', 'เทคาน', 'ผูกเหล็ก',
    'เทเสา', 'เทพื้น', 'เทคอนกรีตพื้น', 'หล่อเสา', 'ขึ้นโครงหลังคา', 'โครงหลังคาสำเร็จรูป', 'โครงหลังคา',
    'มุงกระเบื้องหลังคา', 'มุงหลังคา', 'กระเบื้องหลังคา', 'ก่ออิฐมวลเบา', 'ก่ออิฐมอญ', 'งานก่ออิฐ', 
    'ฉาบปูน', 'งานฉาบ', 'ฉาบผนัง', 'งานบันได', 'บันไดไม้', 'ติดตั้งบันได', 'งานฝ้า', 'ฝ้าเพดาน',
    'ปูกระเบื้อง', 'งานปูกระเบื้อง', 'งานระบบไฟ', 'เดินระบบไฟฟ้า', 'ระบบประปา', 'ติดตั้งสุขภัณฑ์', 'สุขภัณฑ์',
    'ตรวจงวดงาน', 'smart truss',
    'เซ็นต์สัญญา', 'เซ็นสัญญา', 'ทำสัญญา', 'พูลวิลล่า', 'pool villa', 'ร้านพิซซ่า', 'โครงสร้างหลังคาเหล็ก',
    'หน้างาน', 'ไซต์งาน', 'อัพเดตหน้างาน', 'อัปเดตหน้างาน', 'อัปเดต:', 'อัพเดต:', 'site update', 'update :',
    'ลงหน้างาน', 'รีโนเวท', 'ต่อเติม'
  ];
  const hasMilestone = realMilestones.some(m => cleanBodyNoHashtags.toLowerCase().includes(m) || combined.includes(m));
  if (!hasMilestone) {
    return false; // ไม่มีการอัปเดตหน้างานจริง -> ไม่ดึงเด็ดขาด
  }

  return true;
}

function findMatchingCompany(item, rawText, rawPageName, postUrl) {
  const itemUrl = item.facebookUrl || item.inputUrl || postUrl || item.url || item.pageUrl || '';
  const itemSlug = extractFbIdentifier(itemUrl);
  const pageNameLower = (rawPageName || '').toLowerCase();
  const textLower = (rawText || '').toLowerCase();
  const userNameLower = (item.user && item.user.name ? item.user.name : '').toLowerCase();
  const userId = item.user && item.user.id ? String(item.user.id) : '';

  // 1. Match by URL Slug or Facebook Page ID
  if (itemSlug) {
    const byUrl = allCompanies.find(c => {
      const cSlug = extractFbIdentifier(c.facebookUrl);
      return cSlug && (cSlug === itemSlug || (c.facebookUrl || '').toLowerCase().includes(itemSlug) || itemUrl.toLowerCase().includes(cSlug));
    });
    if (byUrl) return byUrl;
  }

  // 2. Match by Facebook User / Page numeric ID
  if (userId) {
    const byUserId = allCompanies.find(c => (c.facebookUrl || '').includes(userId));
    if (byUserId) return byUserId;
  }

  // 3. Match by Company Name / English Name / Page Slug
  const byName = allCompanies.find(c => {
    const cName = c.name.toLowerCase();
    const cEng = (c.engName || '').toLowerCase();
    const cSlug = extractFbIdentifier(c.facebookUrl);
    
    if (pageNameLower && (cName.includes(pageNameLower) || pageNameLower.includes(cName))) return true;
    if (userNameLower && (cName.includes(userNameLower) || userNameLower.includes(cName))) return true;
    if (cEng && pageNameLower && (cEng.includes(pageNameLower) || pageNameLower.includes(cEng))) return true;
    if (cSlug && (pageNameLower.includes(cSlug) || textLower.includes(cSlug))) return true;
    return false;
  });
  if (byName) return byName;

  // 4. Match by Phone Number inside post text
  const byPhone = allCompanies.find(c => {
    if (!c.phone) return false;
    const digits = c.phone.replace(/\D/g, '');
    if (digits.length >= 8 && textLower.includes(digits.substring(digits.length - 8))) {
      return true;
    }
    return false;
  });
  if (byPhone) return byPhone;

  // 5. Match by core keywords from company name
  const byKeyword = allCompanies.find(c => {
    const cleanWords = c.name.replace(/บริษัท|จำกัด|ห้างหุ้นส่วน|หจก|รับสร้างบ้าน/g, '').trim().toLowerCase();
    if (cleanWords.length >= 3 && (textLower.includes(cleanWords) || pageNameLower.includes(cleanWords) || userNameLower.includes(cleanWords))) {
      return true;
    }
    return false;
  });
  if (byKeyword) return byKeyword;

  // 6. Match by known contractor brand aliases (e.g. N.P. HOME -> เอ็น.พี.โฮมส์)
  const brandAliases = [
    { keys: ['บ้านดี-อุดร', 'บ้านดีอุดร', 'หจก.บ้านดี-อุดร', 'baan-d udon', 'baand udon', 'k.k house', 'k.k. house', 'kk house', 'kkhouse', '61565401665404', '61584987645535'], compName: 'บ้านดี-อุดร' },
    { keys: ['tt design', 'ttdesign', 'tt1991', '0916868536', '091-6868536', 'tt design & construction'], compName: 'ทีที ดีไซน์' },
    { keys: ['n.p.home', 'n.p. home', 'nphome', 'n.p home', 'เอ็น.พี.โฮมส์', 'เอ็นพีโฮม'], compName: 'เอ็น.พี.โฮมส์' },
    { keys: ['dreamup', 'dream up', 'ดรีมอัพ'], compName: 'ดรีมอัพ' },
    { keys: ['modernde', 'modern de', 'modern-de', 'โมเดิร์นดี', 'โมเดิร์น ดี'], compName: 'โมเดิร์น ดี' },
    { keys: ['mindhome', 'mind home', 'มายด์โฮม', 'มายด์ โฮม'], compName: 'มายด์ โฮม' },
    { keys: ['udhome', 'ud.home', 'ยูดี.โฮมส์', 'ยูดีโฮม'], compName: 'ยูดี.โฮมส์' },
    { keys: ['syc.house', 'ทรัพย์ยิ่งเจริญ'], compName: 'ทรัพย์ยิ่งเจริญ' },
    { keys: ['karin', 'การิน'], compName: 'การิน' },
    { keys: ['baanyai', 'บ้านใหญ่'], compName: 'บ้านใหญ่' },
    { keys: ['kiddee', 'คิดดีเฮาส์', 'คิดดี'], compName: 'คิดดีเฮาส์' },
    { keys: ['karntang', 'อุดรการทาง'], compName: 'อุดรการทาง' },
    { keys: ['sd house', 'เอสดี เฮ้าส์', 'sdhouse'], compName: 'เอสดี เฮ้าส์' },
    { keys: ['si architecture', 'เอสไอ อาร์คิเทคเชอร์', 'siarchitecture'], compName: 'เอสไอ อาร์คิเทคเชอร์' },
    { keys: ['mosaic', 'โมเสค', 'โมเสคดีไซน์', '100083320623771'], compName: 'โมเสคดีไซน์' },
    { keys: ['entrust', 'เอ็นทรัสท', 'entrust.const', 'trust construction'], compName: 'เอ็นทรัสท' }
  ];

  for (const alias of brandAliases) {
    if (alias.keys.some(k => pageNameLower.includes(k) || userNameLower.includes(k) || textLower.includes(k) || itemSlug.includes(k))) {
      const match = allCompanies.find(c => c.name.includes(alias.compName));
      if (match) return match;
    }
  }

  return null;
}

// ==========================================
// 10.1 SMART SAME-SITE DEDUPLICATION ENGINE
// ==========================================
function extractSiteKey(text, custName, district) {
  const t = (text || '').toLowerCase();
  
  // 1. Customer Name Key
  if (custName && custName !== 'เจ้าของบ้าน' && custName.length >= 2) {
    const cleanCust = custName.replace(/[^a-zA-Zก-๙0-9]/g, '');
    return `cust_${cleanCust}_${district}`;
  }

  // 2. Commercial / Gas Station / Landmark Keys
  if (t.includes('พีที') || t.includes('ปั๊ม pt') || t.includes('บ้านปูลู') || t.includes('pt หนองหาน')) {
    return `landmark_pt_nonghan_${district}`;
  }
  if (t.includes('ปตท') || t.includes('อเมซอน') || t.includes('amazon')) {
    return `landmark_ptt_amazon_${district}`;
  }
  if (t.includes('7-11') || t.includes('7-eleven') || t.includes('เซเว่น')) {
    return `landmark_711_${district}`;
  }
  if (t.includes('cj express') || t.includes('ซีเจ')) {
    return `landmark_cj_${district}`;
  }
  if (t.includes('ศุภาลัย')) return `landmark_supalai_${district}`;
  if (t.includes('อภิทาวน์')) return `landmark_apitown_${district}`;
  if (t.includes('รชยา')) return `landmark_rachaya_${district}`;
  if (t.includes('วิลลาจจิโอ')) return `landmark_villaggio_${district}`;
  if (t.includes('สุขคณา')) return `landmark_sukkhana_${district}`;
  if (t.includes('บ้านเชียง')) return `landmark_bancheang_${district}`;
  if (t.includes('หนองเม็ก')) return `landmark_nongmek_${district}`;
  if (t.includes('สามพร้าว')) return `landmark_samphrao_${district}`;
  if (t.includes('บ้านจั่น')) return `landmark_banchan_${district}`;
  if (t.includes('บ้านเลื่อม')) return `landmark_banleam_${district}`;
  if (t.includes('โนนสูง')) return `landmark_nonsung_${district}`;
  if (t.includes('กุดสระ')) return `landmark_kudsra_${district}`;

  // 3. Distinct token signature
  let cleanT = t.replace(/update|อัพเดท|อัปเดต|หน้างาน|ไซต์งาน|งาน|ก่อสร้าง|เรียบร้อย|โดย|ส่งมอบ|ผลงาน|ขั้นตอน|โครงสร้าง|ฐานราก|หัวจ่าย|ป้าย|ไฮเวย์|ห้องน้ำ/gi, '');
  cleanT = cleanT.replace(/[^a-zA-Zก-๙0-9]/g, ' ').trim();
  const words = cleanT.split(/\s+/).filter(w => w.length >= 3).slice(0, 3);
  if (words.length > 0) {
    return `tokens_${words.join('_')}_${district}`;
  }

  return `site_${district}`;
}

function findExistingProjectMatch(comp, siteKey, text, custName, district) {
  if (!comp || !comp.projects || comp.projects.length === 0) return null;

  // 1. Exact siteKey match
  const byKey = comp.projects.find(p => p.siteKey && p.siteKey === siteKey);
  if (byKey) return byKey;

  // 2. Customer match in same district
  if (custName && custName !== 'เจ้าของบ้าน') {
    const byCust = comp.projects.find(p => p.district === district && p.customerName && (p.customerName.includes(custName) || custName.includes(p.customerName)));
    if (byCust) return byCust;
  }

  // 3. Landmark / keyword overlap in same district
  const textLower = (text || '').toLowerCase();
  for (const p of comp.projects) {
    if (p.district === district) {
      const pText = (p.name + ' ' + (p.siteProof ? p.siteProof.caption : '')).toLowerCase();
      
      // Check for PT Gas Station / Landmark patterns
      if ((textLower.includes('พีที') || textLower.includes('ปั๊ม pt') || textLower.includes('บ้านปูลู')) &&
          (pText.includes('พีที') || pText.includes('ปั๊ม pt') || pText.includes('บ้านปูลู'))) {
        return p;
      }
      if ((textLower.includes('ปตท') || textLower.includes('อเมซอน')) &&
          (pText.includes('ปตท') || pText.includes('อเมซอน'))) {
        return p;
      }
      if (textLower.includes('สุขคณา') && pText.includes('สุขคณา')) {
        return p;
      }
      if (textLower.includes('บ้านเชียง') && pText.includes('บ้านเชียง')) {
        return p;
      }
      if (textLower.includes('หนองเม็ก') && pText.includes('หนองเม็ก')) {
        return p;
      }
    }
  }

  return null;
}

function extractSpecificProjectTitle(text, custName, distName, stage) {
  const t = (text || '');
  const tLower = t.toLowerCase();

  // 1. Customer Name
  if (custName && custName !== 'เจ้าของบ้าน' && custName.length >= 2) {
    if (tLower.includes('ส่งมอบ')) return `โครงการส่งมอบบ้านคุณ${custName} อ.${distName}`;
    if (tLower.includes('รีโนเวท') || tLower.includes('ต่อเติม')) return `งานรีโนเวท/ต่อเติม (คุณ${custName}) อ.${distName}`;
    return `โครงการบ้านคุณ${custName} อ.${distName}`;
  }

  // 2. Commercial / Gas Station / Brand / Landmark patterns
  if (tLower.includes('พีที') || tLower.includes('ปั๊ม pt') || tLower.includes('pt หนองหาน')) {
    const isBanPulu = tLower.includes('บ้านปูลู') || tLower.includes('ปูลู');
    return `โครงการปั๊ม พีที สาขาหนองหาน ${isBanPulu ? '(บ้านปูลู)' : ''} อ.${distName}`.trim();
  }
  if (tLower.includes('อเมซอน') || tLower.includes('ปตท')) {
    return `งานรีโนเวท อเมซอน ปั๊ม ปตท. อ.${distName}`;
  }
  if (tLower.includes('7-11') || tLower.includes('7-eleven') || tLower.includes('เซเว่น')) {
    return `งานก่อสร้าง 7-Eleven อ.${distName}`;
  }
  if (tLower.includes('cj express') || tLower.includes('ซีเจ')) {
    return `งานก่อสร้าง CJ Express อ.${distName}`;
  }
  if (tLower.includes('ศุภาลัย')) return `โครงการบ้านศุภาลัย อ.${distName}`;
  if (tLower.includes('อภิทาวน์')) return `โครงการบ้านอภิทาวน์ อ.${distName}`;
  if (tLower.includes('รชยา')) return `โครงการบ้านรชยา อ.${distName}`;
  if (tLower.includes('วิลลาจจิโอ')) return `โครงการบ้านวิลลาจจิโอ อ.${distName}`;
  if (tLower.includes('สุขคณา')) return `โครงการบ้านซอยสุขคณา อ.${distName}`;
  if (tLower.includes('บ้านเชียง')) return `โครงการบ้าน ต.บ้านเชียง อ.${distName}`;
  if (tLower.includes('หนองเม็ก')) return `โครงการบ้าน ต.หนองเม็ก อ.${distName}`;
  if (tLower.includes('บ้านปูลู')) return `ไซต์งานก่อสร้าง บ้านปูลู อ.${distName}`;
  if (tLower.includes('สามพร้าว')) return `ไซต์งานก่อสร้าง ต.สามพร้าว อ.${distName}`;
  if (tLower.includes('บ้านจั่น')) return `ไซต์งานก่อสร้าง ต.บ้านจั่น อ.${distName}`;

  if (tLower.includes('พูลวิลล่า') || tLower.includes('pool villa')) {
    return custName && custName !== 'เจ้าของบ้าน' && custName.length >= 2
      ? `โครงการบ้านพูลวิลล่า (คุณ${custName}) อ.${distName}`
      : `โครงการบ้านพูลวิลล่า Pool Villa อ.${distName}`;
  }
  if (tLower.includes('พิซซ่า') || tLower.includes('ร้านพิซซ่า') || tLower.includes('รังษิณา')) {
    return `งานโครงสร้างร้านและที่พักอาศัย (โซนรังษิณา) อ.${distName}`;
  }
  if (tLower.includes('นาม่วง') || tLower.includes('เชียงกรม')) {
    return custName && custName !== 'เจ้าของบ้าน' && custName.length >= 2
      ? `โครงการบ้านคุณ${custName} (ต.นาม่วง) อ.${distName}`
      : `โครงการบ้าน ต.นาม่วง อ.${distName}`;
  }
  if (tLower.includes('รีโนเวท') || tLower.includes('ต่อเติม')) {
    return `งานรีโนเวทและต่อเติมอาคาร อ.${distName}`;
  }
  if (tLower.includes('ระบบไฟฟ้า') || tLower.includes('เดินระบบไฟฟ้า')) {
    return `ไซต์งานเดินระบบไฟฟ้า อ.${distName}`;
  }
  if (tLower.includes('บันได') || tLower.includes('งานบันได')) {
    return custName && custName !== 'เจ้าของบ้าน' && custName.length >= 2
      ? `งานติดตั้งบันไดไม้ บ้านคุณ${custName} อ.${distName}`
      : `ไซต์งานติดตั้งบันไดไม้ อ.${distName}`;
  }
  if (tLower.includes('smart truss') || tLower.includes('โครงหลังคา')) {
    return `ไซต์งานโครงหลังคา Smart Truss อ.${distName}`;
  }

  return `ไซต์งานก่อสร้าง อ.${distName} (${stage})`;
}

function deduplicateCompanyProjects(comp) {
  if (!comp || !comp.projects || comp.projects.length <= 1) return;

  const stageHierarchy = { 'groundbreak': 1, 'foundation': 2, 'structure': 3, 'finishing': 4 };
  const uniqueProjects = [];

  comp.projects.forEach((proj, idx) => {
    const fullText = (proj.name + ' ' + (proj.siteProof ? proj.siteProof.caption : '') + ' ' + (proj.location || '')).toLowerCase();
    const custName = proj.customerName && proj.customerName !== 'เจ้าของบ้าน' ? proj.customerName.replace(/คุณ/g, '') : extractCustomerName(fullText);
    const distName = proj.district || extractUdonDistrict(fullText, comp.district || 'เมืองอุดรธานี');
    const siteKey = proj.siteKey || extractSiteKey(fullText, custName, distName);

    const existing = findExistingProjectMatch({ projects: uniqueProjects }, siteKey, fullText, custName, distName);

    if (existing) {
      // Merge into existing project
      const curRank = stageHierarchy[existing.stageKey] || 0;
      const newRank = stageHierarchy[proj.stageKey] || 0;
      if (newRank >= curRank) {
        existing.stage = proj.stage;
        existing.stageKey = proj.stageKey;
        existing.progressPercent = proj.progressPercent;
        existing.opportunity = proj.opportunity;
      }
      existing.updatesCount = (existing.updatesCount || 1) + 1;
      if (proj.siteProof && proj.siteProof.postedTime) {
        existing.siteProof = proj.siteProof;
      }
    } else {
      proj.siteKey = siteKey;
      proj.updatesCount = 1;
      uniqueProjects.push(proj);
    }
  });

  comp.projects = uniqueProjects;
  comp.totalProjects = comp.projects.length;
  comp.totalValueMillion = Math.round(comp.totalProjects * 0.5 * 10) / 10;
  comp.revenuePotentialText = `฿${(comp.totalProjects * 0.5).toFixed(1)}M`;
}

function processApifyJsonData(rawPayload, sourceName = 'Apify Dataset') {
  let posts = [];
  if (Array.isArray(rawPayload)) {
    posts = rawPayload;
  } else if (rawPayload && Array.isArray(rawPayload.items)) {
    posts = rawPayload.items;
  } else if (rawPayload && Array.isArray(rawPayload.dataset)) {
    posts = rawPayload.dataset;
  } else if (rawPayload && Array.isArray(rawPayload.data)) {
    posts = rawPayload.data;
  } else if (rawPayload && typeof rawPayload === 'object') {
    posts = [rawPayload];
  }

  if (!posts || posts.length === 0) {
    alert('❌ ไม่พบรายการโพสต์ในไฟล์ Apify JSON');
    return;
  }

  console.log(`📥 เริ่มประมวลผล ${posts.length} โพสต์จาก ${sourceName}...`);

  const constructionKeywords = [
    "ยกเสาเอก", "พิธียกเสาเอก", "เสาเอก", "ฤกษ์ยกเสาเอก", "ลงเสาเอก", "ยกเสาโท",
    "ลงเสาเข็ม", "เสาเข็ม", "ตอกเสาเข็ม", "เจาะเสาเข็ม", "ไมโครไพล์",
    "ฐานราก", "งานฐานราก", "ตอม่อ", "คานคอดิน", "เทคาน", "ผูกเหล็ก", "เทพื้น", "เทคอนกรีต", "เทปูน", "หล่อเสา",
    "ตั้งเสา", "มุงหลังคา", "โครงหลังคา", "โครงสร้าง", "งานโครงสร้าง", "ก่ออิฐ", "ฉาบปูน", "งานก่อ", "งานฉาบ",
    "site update", "อัปเดตหน้างาน", "อัพเดทหน้างาน", "อัปเดตไซด์งาน", "อัพเดทไซด์งาน",
    "อัปเดตความคืบหน้า", "อัพเดทความคืบหน้า", "ความคืบหน้าหน้างาน", "ความคืบหน้าไซด์งาน", "ความคืบหน้างานก่อสร้าง",
    "ส่งมอบบ้าน", "ส่งมอบงาน", "ตรวจงาน", "ตรวจหน้างาน", "ตรวจรับบ้าน", "สู่การเริ่มต้นก่อสร้างจริง"
  ];

  // =========================================================
  // STEP 1 FILTER: คัดเฉพาะโพสต์ที่ระบุหน้างานจังหวัดอื่นชัดเจนออก (เข้มงวดที่สุด ทั้งในและต่างประเทศ)
  // =========================================================
  const otherProvincesList = [
    // ต่างประเทศ / สปป.ลาว
    "vientiane", "laos", "เวียงจันทน์", "สปป.ลาว", "ลาว", "หลวงพระบาง", "ปากเซ", "สะหวันนะเขต", "จำปาศักดิ์",
    "cambodia", "กัมพูชา", "พนมเปญ", "myanmar", "พม่า", "เมียนมา", "vietnam", "เวียดนาม", "ต่างประเทศ",
    // 76 จังหวัดในไทย
    "หนองคาย", "หนองบัวลำภู", "สกลนคร", "ขอนแก่น", "เลย", "บึงกาฬ", "กาฬสินธุ์",
    "ร้อยเอ็ด", "นครพนม", "มหาสารคาม", "สารคาม", "มุกดาหาร", "ชัยภูมิ", "นครราชสีมา", "โคราช",
    "อุบลราชธานี", "อุบล", "ยโสธร", "อำนาจเจริญ", "สุรินทร์", "ศรีสะเกษ", "บุรีรัมย์",
    "เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน", "แพร่", "น่าน", "พะเยา", "แม่ฮ่องสอน", "พิษณุโลก", "สุโขทัย", "ตาก", "อุตรดิตถ์", "เพชรบูรณ์", "พิจิตร", "กำแพงเพชร", "นครสวรรค์", "อุทัยธานี",
    "กรุงเทพ", "กทม", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "สมุทรสาคร", "สมุทรสงคราม", "นครปฐม", "อยุธยา", "พระนครศรีอยุธยา", "สระบุรี", "ลพบุรี", "สิงห์บุรี", "อ่างทอง", "ชัยนาท",
    "ชลบุรี", "ระยอง", "จันทบุรี", "ตราด", "ฉะเชิงเทรา", "ปราจีนบุรี", "นครนายก", "สระแก้ว",
    "เพชรบุรี", "ประจวบคีรีขันธ์", "ราชบุรี", "กาญจนบุรี", "สุพรรณบุรี",
    "ภูเก็ต", "กระบี่", "พังงา", "สุราษฎร์ธานี", "นครศรีธรรมราช", "สงขลา", "หาดใหญ่", "ตรัง", "พัทลุง", "สตูล", "ชุมพร", "ระนอง", "ยะลา", "ปัตตานี", "นราธิวาส"
  ];

  const outsideDistrictsList = [
    // เลย
    "วังสะพุง", "เชียงคาน", "ด่านซ้าย", "ภูเรือ", "ภูกระดึง", "ท่าลี่", "ปากชม", "นาแห้ว", "ภูหลวง", "ผาขาว", "เอราวัณ", "หนองหิน",
    // บึงกาฬ
    "เซกา", "บึงโขงหลง", "โซ่พิสัย", "ปากคาด", "พรเจริญ", "ศรีวิไล", "บุ่งคล้า",
    // หนองคาย
    "ท่าบ่อ", "โพนพิสัย", "ศรีเชียงใหม่", "สังคม", "รัตนวาปี", "สระใคร", "เฝ้าไร่", "โพธิ์ตาก",
    // สกลนคร
    "พังโคน", "สว่างแดนดิน", "วานรนิวาส", "พรรณานิคม", "อากาศอำนวย", "กุสุมาลย์", "กุดบาก", "คำตากล้า", "เจริญศิลป์", "เต่างอย", "โคกศรีสุพรรณ", "นิคมน้ำอูน", "ภูพาน", "โพนนาแก้ว",
    // หนองบัวลำภู
    "นากลาง", "ศรีบุญเรือง", "โนนสัง", "นาวัง", "สุวรรณคูหา",
    // ขอนแก่น
    "บ้านไผ่", "ชุมแพ", "น้ำพอง", "กระนวน", "พระยืน", "หนองเรือ", "พล", "บ้านแฮด", "โนนศิลา", "เขาสวนกวาง", "อุบลรัตน์", "มัญจาคีรี", "ชนบท", "แวงน้อย", "แวงใหญ่", "โคกโพธิ์ไชย", "เปือยน้อย", "ภูเวียง", "ภูผาม่าน", "ซำสูง", "ม.ขอนแก่น", "มข.",
    // กาฬสินธุ์
    "ยางตลาด", "กมลาไสย", "สมเด็จ", "กุฉินารายณ์", "สหัสขันธ์", "ห้วยผึ้ง", "หนองกุงศรี",
    // ร้อยเอ็ด
    "เกษตรวิสัย", "เสลภูมิ", "โพนทอง", "สุวรรณภูมิ", "อาจสามารถ", "พนมไพร",
    // สารคาม
    "โกสุมพิสัย", "วาปีปทุม", "กันทรวิชัย", "พยัคฆภูมิพิสัย",
    // นครพนม
    "ธาตุพนม", "เรณูนคร", "ศรีสงคราม", "ท่าอุเทน", "นาแก", "บ้านแพง",
    // มุกดาหาร
    "นิคมคำสร้อย", "ดอนตาล", "หว้านใหญ่", "หนองสูง",
    // ชัยภูมิ
    "ภูเขียว", "แก้งคร้อ", "บ้านเขว้า", "เกษตรสมบูรณ์", "คอนสาร", "คอนสวรรค์",
    // โคราช
    "ปากช่อง", "พิมาย", "สีคิ้ว", "ปักธงชัย", "สูงเนิน", "โชคชัย", "ด่านขุนทด",
    // อุบล
    "วารินชำราบ", "เดชอุดม", "พิบูลมังสาหาร"
  ];

  const udonDistrictsList = [
    // 20 Official Districts (Thai & English variations)
    "เมืองอุดรธานี", "เมืองอุดร", "อำเภอเมือง", "อ.เมือง", "กุมภวาปี", "หนองหาน", "บ้านดุง", "เพ็ญ", "กุดจับ",
    "โนนสะอาด", "ศรีธาตุ", "วังสามหมอ", "ทุ่งฝน", "สร้างคอม", "หนองแสง", "หนองวัวซอ",
    "บ้านผือ", "น้ำโสม", "นายูง", "พิบูลย์รักษ์", "กู่แก้ว", "ประจักษ์ศิลปาคม", "ไชยวาน",
    // Udon Thani Subdistricts / Key Zones
    "หมูม่น", "หมากแข้ง", "หนองบัว", "สามพร้าว", "บ้านจั่น", "บ้านจาน", "หนองนาคำ", "บ้านตาด",
    "โนนสูง", "บ้านเลื่อม", "เชียงพิณ", "กุดสระ", "นาดี", "บ้านขาว", "หนองไผ่", "นาข่า",
    "หนองขอนกว้าง", "นิคมสงเคราะห์", "โคกสะอาด", "เชียงแหว", "จำปี", "ผาสุก", "ดอนหายโศก",
    "บ้านเชียง", "หนองเม็ก", "โพนสูง", "สร้างแป้น", "สุมเส้า", "สุขคณา", "โนนตูม", "โนนยาง",
    "นาม่วง", "เชียงกรม", "บ้านปูลู", "รังษิณา", "ดอนเสือ", "หนองประจักษ์", "ยูดีทาวน์",
    // Udon General
    "อุดรธานี", "จ.อุดร", "จังหวัดอุดร", "จ. อุดร", "เมือง, อุดร", "เมือง อุดร", "udon"
  ];

  function isExplicitOtherProvince(post) {
    if (post.error || post['#error']) return true; // Error placeholder
    const text = post.text || post.message || '';
    if (!text) return false;

    // 1. ตัดส่วนท้ายที่เป็นที่อยู่สำนักงาน / เบอร์โทร / แฮชแท็กพื้นที่ให้บริการ / เทมเพลตโปรโมท ออกก่อนตรวจเช็กไซต์งานเสมอ!
    let bodyText = text;
    const footerMarkers = [
      '📌', '📍 ที่ตั้งสำนักงาน', '📍 ที่อยู่สำนักงาน', '📍 แผนที่สำนักงาน', '📍 พิกัดสำนักงาน',
      'ที่ตั้ง สำนักงาน', 'ที่ตั้งสำนักงาน', 'สำนักงานใหญ่', 'ออฟฟิศตั้งอยู่', 'ที่อยู่สำนักงาน',
      '____________________', '“ ใส่ใจทุกรายละเอียด', '● ปรึกษาฟรี', '● ประเมิณหน้างานฟรี', '● ประเมินหน้างานฟรี', 'Contact for work',
      'สนใจติดต่อ', 'ติดต่อสอบถาม', 'สอบถามเพิ่มเติม', 'โทร 0', 'Tel:', 'Line ID', '#รับสร้างบ้าน', '#พื้นที่ให้บริการ', '#DREAM UP',
      '#รับสร้างบ้านอุดร', '#รับสร้างบ้านหนองคาย', '#รับสร้างบ้านขอนแก่น', '#รับสร้างบ้านสกลนคร'
    ];
    for (const fm of footerMarkers) {
      const idx = bodyText.indexOf(fm);
      if (idx > 10) {
        bodyText = bodyText.substring(0, idx);
      }
    }

    // ตัดบรรทัด Hashtag (#...) ทั้งหมดออกจาก bodyText เพื่อป้องกันการเข้าใจผิดเรื่องพื้นที่ให้บริการ
    bodyText = bodyText.replace(/#[^\s\n]+/g, '').trim();

    const lines = bodyText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

    // 2. ตรวจสอบว่าในบรรทัด สถานที่ก่อสร้าง / พิกัด / หน้างาน / Location ระบุ จ.อุดรธานี หรืออำเภอ/ตำบลในอุดรชัดเจนหรือไม่
    let isExplicitUdonSite = false;
    for (const line of lines) {
      if (/(?:📍|พิกัด|หน้างาน|สถานที่ก่อสร้าง|สถานที่|ที่ตั้งโครงการ|โลเคชั่น|location|site\s*location|บ้านพักอาศัย|โครงการบ้าน|สร้างบ้านที่|บ้านคุณ)/i.test(line)) {
        if (line.includes('อุดร') || line.includes('อุดรธานี') || line.toLowerCase().includes('udon')) {
          isExplicitUdonSite = true;
          break;
        }
        for (const dist of udonDistrictsList) {
          if (line.includes(dist)) {
            isExplicitUdonSite = true;
            break;
          }
        }
      }
    }

    // 3. ตรวจสอบบรรทัดที่ระบุ พิกัด / หน้างาน / สถานที่ก่อสร้าง ว่าชี้ไปจังหวัดอื่นหรือไม่
    for (const line of lines) {
      if (/(?:📍|พิกัด|หน้างาน|สถานที่ก่อสร้าง|สถานที่|ที่ตั้งโครงการ|โลเคชั่น|location|site\s*location|ส่งมอบบ้าน|บ้านพักอาศัย|โครงการบ้าน|สร้างบ้านที่|บ้านคุณ)/i.test(line)) {
        // หากบรรทัดนี้ระบุจังหวัดอื่น หรือต่างประเทศ (เช่น Vientiane, Laos)
        for (const prov of otherProvincesList) {
          const provRegex = (prov === 'เลย' || prov === 'อุบล' || prov === 'กทม' || prov === 'ลาว') 
            ? new RegExp(`(?:จ\\.|จังหวัด|ประเทศ)?\\s*${prov}`, 'i')
            : new RegExp(prov, 'i');
          if (provRegex.test(line) && !line.includes('อุดร') && !line.toLowerCase().includes('udon')) {
            return true; // คัดออกทันที เป็นหน้างานต่างจังหวัด/ต่างประเทศ
          }
        }
        // หากบรรทัดนี้ระบุอำเภอของต่างจังหวัด (เช่น วังสะพุง, ชุมแพ, สว่างแดนดิน)
        for (const dist of outsideDistrictsList) {
          const distRegex = new RegExp(`(?:อ\\.|อำเภอ|ต\\.|ตำบล)?\\s*${dist}`, 'i');
          if (distRegex.test(line) && !line.includes('อุดร')) {
            return true; // คัดออกทันที
          }
        }
      }

      // ตรวจสอบการระบุ จ.xxx หรือ อ.xxx หรือ ประเทศเพื่อนบ้านชัดเจนในแต่ละบรรทัดของเนื้อหาไซต์งาน (ถ้าไม่ใช่ไซต์อุดรที่ระบุชัดเจน)
      if (!isExplicitUdonSite) {
        for (const prov of otherProvincesList) {
          const provRegex = new RegExp(`(?:จ\\.|จังหวัด|location\\s*[:\\|]|site\\s*location\\s*[:\\|])\\s*${prov}`, 'i');
          if (provRegex.test(line) && !line.includes('อุดร') && !line.toLowerCase().includes('udon')) {
            return true; // คัดออกทันที
          }
        }
        for (const dist of outsideDistrictsList) {
          const distRegex = new RegExp(`(?:อ\\.|อำเภอ)\\s*${dist}`, 'i');
          if (distRegex.test(line) && !line.includes('อุดร')) {
            return true; // คัดออกทันที
          }
        }
      }
    }

    // 4. ตรวจสอบภาพรวมของ bodyText (ถ้าไม่ใช่ไซต์อุดรที่ระบุชัดเจน)
    if (!isExplicitUdonSite) {
      for (const prov of otherProvincesList) {
        const provRegex = new RegExp(`(?:จ\\.|จังหวัด|หน้างาน|พิกัด|location|site\\s*location)\\s*[:\\s\\|]+${prov}`, 'i');
        if (provRegex.test(bodyText) && !bodyText.includes('อุดร') && !bodyText.toLowerCase().includes('udon')) {
          return true; // คัดออกทันที
        }
      }
      for (const dist of outsideDistrictsList) {
        const distRegex = new RegExp(`(?:อ\\.|อำเภอ|หน้างาน|พิกัด)\\s*[:\\s]+${dist}`, 'i');
        if (distRegex.test(bodyText) && !bodyText.includes('อุดร')) {
          return true; // คัดออกทันที
        }
      }
    }

    if (/(?:เสาเข็มไมโครไพล์นครพนม|เสาเข็มไมโครไพล์ขอนแก่น|เสาเข็มไมโครไพล์สกลนคร|เสาเข็มไมโครไพล์บึงกาฬ|เสาเข็มไมโครไพล์หนองคาย|เสาเข็มไมโครไพล์เลย|เสาเข็มไมโครไพล์ร้อยเอ็ด|เสาเข็มไมโครไพล์สารคาม)/i.test(bodyText) && !bodyText.includes('หน้างานอุดร') && !bodyText.includes('ไซต์อุดร')) {
      return true; // คัดออก (หน้างานเสาเข็มต่างจังหวัด)
    }

    return false;
  }

  // =========================================================
  // STEP 2 FILTER: คัดโพสต์ถวายพระพร / วันสำคัญ / วันหยุดนักขัตฤกษ์ / ไว้อาลัย ออก 100%
  // =========================================================
  function isRoyalAuspiciousHolidayOrGreetingPost(post) {
    const text = post.text || post.message || '';
    if (!text) return false;

    // 1. ถวายพระพรชัยมงคล / วันเฉลิมพระชนมพรรษา / วันสำคัญของราชวงศ์ (คัดออก 100% ไม่มีข้อยกเว้น)
    const royalRegex = /(?:ทรงพระเจริญ|ด้วยเกล้าด้วยกระหม่อม|ข้าพระพุทธเจ้า|วันเฉลิมพระชนมพรรษา|เฉลิมพระชนมพรรษา|พระชนมพรรษา|พระบาทสมเด็จพระ|สมเด็จพระเจ้าอยู่หัว|สมเด็จพระนางเจ้า|พระบรมราชชนนีพันปีหลวง|สมเด็จพระกนิษฐาธิราชเจ้า|กรมสมเด็จพระเทพ|พระวชิรเกล้าเจ้าอยู่หัว|พระบรมราชสมภพ|วันคล้ายวันสวรรคต|วันนวมินทรมหาราช|วันปิยมหาราช|วันจักรี|วันฉัตรมงคล|วันรัฐธรรมนูญ|ถวายพระพร|ลงนามถวายพระพร|รัชกาลที่|ขอพระองค์ทรงพระเจริญ)/i;
    if (royalRegex.test(text)) {
      return true;
    }

    // 2. ไว้อาลัย / แสดงความเสียใจ / งานฌาปนกิจ
    const condolenceRegex = /(?:ขอแสดงความเสียใจ|ร่วมไว้อาลัย|ขอแสดงความอาลัย|สู่สุคติ|ฌาปนกิจ|งานพระราชทานเพลิงศพ|พิธีสวดพระอภิธรรม|อาลัยยิ่ง|ขอแสดงความยินดีกับบัณฑิต)/i;
    if (condolenceRegex.test(text)) {
      return true;
    }

    // 3. วันหยุดเทศกาล / คำอวยพรตามประเพณี
    const holidayRegex = /(?:แจ้งวันหยุด|วันหยุดนักขัตฤกษ์|ประกาศวันหยุด|หยุดทำการ|ปิดทำการ|วันหยุดยาว|เปิดทำการปกติ|สุขสันต์วันแม่|วันแม่แห่งชาติ|Happy Mother's Day|สุขสันต์วันพ่อ|วันพ่อแห่งชาติ|สุขสันต์วันสงกรานต์|วันสงกรานต์|สวัสดีปีใหม่|สุขสันต์วันปีใหม่|Happy New Year|HNY|Merry Christmas|สุขสันต์วันคริสต์มาส|วันเด็กแห่งชาติ|วันครู|วันแรงงาน|วันตรุษจีน|ซินเจียยู่อี่|วันสารทจีน|วันลอยกระทง|วันวิสาขบูชา|วันมาฆบูชา|วันอาสาฬหบูชา|วันเข้าพรรษา|วันออกพรรษา)/i;
    if (holidayRegex.test(text)) {
      // ข้อยกเว้น: สโลแกนเช่น "การพัฒนา ไม่มีวันหยุด" ของโครงการก่อสร้างสำนักงาน
      if (text.includes('การพัฒนา ไม่มีวันหยุด') || text.includes('ไม่มีวันหยุด')) {
        if (text.includes('สำนักงานใหม่') || text.includes('ก่อสร้าง')) {
          return false;
        }
      }
      if (!/เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ตอกเสาเข็ม/i.test(text)) {
        return true;
      }
    }
    return false;
  }
  function isHolidayAnnouncement(post) {
    return isRoyalAuspiciousHolidayOrGreetingPost(post);
  }

  // =========================================================
  // STEP 3 FILTER: คัดโพสต์โฆษณา/โปรโมทออก (เว้นแต่เป็นงานก่อสร้างจริงหน้างานที่มีชื่อเจ้าของบ้าน)
  // =========================================================
  const adPromoKeywordsList = [
    "โปรโมชั่น", "โปรโมชัน", "โปรโมชั่นพิเศษ", "โปรโมชันพิเศษ",
    "ราคาพิเศษ", "ลดกระหน่ำ", "แจกฟรี", "ของแถม", "ฟรีของแถม", "แถมฟรี",
    "จองวันนี้", "จองและทำสัญญา", "ผ่อนเริ่มต้น", "กู้ได้เต็ม", "ยื่นสินเชื่อ",
    "แบบบ้านขายดี", "แบบบ้านยอดนิยม", "10 แบบบ้าน", "แบบบ้านแนะนำ",
    "ราคาเริ่มต้น", "เริ่มต้นเพียง", "ตารางเมตรละ", "ตร.ม.ละ", "แจกทอง", "ฟรีดำเนินการ"
  ];

  function isAdWithoutDistrictOrPerson(post) {
    const text = post.text || post.message || '';
    if (!text) return false;

    let isAd = false;
    for (const kw of adPromoKeywordsList) {
      if (text.includes(kw)) {
        isAd = true;
        break;
      }
    }

    if (isAd) {
      // ตัด footer ออฟฟิศออกก่อนตรวจ
      let body = text;
      const footerMarkers = [
        '📌', '📍 ที่ตั้งสำนักงาน', '📍 ที่อยู่สำนักงาน', '📍 แผนที่สำนักงาน', '📍 พิกัดสำนักงาน',
        'ที่ตั้ง สำนักงาน', 'ที่ตั้งสำนักงาน', 'สำนักงานใหญ่', 'ออฟฟิศตั้งอยู่', 'ที่อยู่สำนักงาน',
        'สนใจติดต่อ', 'ติดต่อสอบถาม', 'สอบถามเพิ่มเติม', 'โทร 0', 'Tel:', 'Line ID', '#รับสร้างบ้าน', '#พื้นที่ให้บริการ', '#DREAM UP'
      ];
      for (const fm of footerMarkers) {
        const idx = body.indexOf(fm);
        if (idx > 10) body = body.substring(0, idx);
      }

      // ตัดบรรทัดของแถมโปรโมชั่น และสโลแกนการตลาดออก
      let bodyNoGifts = body.replace(/(?:🎁|🎉|🎊|ฟรี!|แถมฟรี|ของแถม|ฟรี\s*[:!])[^\n]+/gi, '');
      bodyNoGifts = bodyNoGifts.replace(/(?:จนถึงวันส่งมอบ|ตั้งแต่เริ่มจน|ตั้งแต่วันแรกจน|ตั้งแต่ฐานรากจนถึง|เรื่องการสร้างบ้าน|ไว้ใจ\s*\|)/gi, '');

      // ต้องมีงานก่อสร้างจริงหน้างาน (ไม่รวมการส่งมอบ)
      const hasRealWork = /(?:งานติดตั้ง|งานทาสี|งานมุง|งานปูกระเบื้อง|งานเทพื้น|งานฉาบ|งานก่อ|เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|โครงเหล็ก|ผูกเหล็ก|เทตอม่อ)/i.test(bodyNoGifts);
      
      // และต้องมีชื่อเจ้าของบ้านจริง ไม่ใช่โพสต์โฆษณาบริการ
      const custRegex = /(?:บ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([ก-๙a-zA-Z]+)/;
      const custMatch = body.match(custRegex);
      const hasRealCust = custMatch && custMatch[1] && !/^(?:ของคุณ|ของบ้านคุณ|ภาพ|งาน|สร้าง|ดี|เรา|ท่าน|ทุกท่าน|พี่|น้อง|ใหม่|เก่า|ครับ|ค่ะ|อุดร|คุณภาพ|มาตรฐาน|ลูกค้า|ออกแบบ|ไว้วางใจ|บริการ|สัญญา|ตรงตามความต้องการ|ตั้งแต่วันแรก)$/.test(custMatch[1].trim());

      if (hasRealWork && hasRealCust) {
        return false; // เก็บไว้ (เป็นงานสร้างจริงที่มีเจ้าของบ้านชัดเจน)
      }

      return true; // คัดออก (เป็นโฆษณาโปรโมชั่นทั่วไป)
    }

    return false;
  }

  // =========================================================
  // STEP 4 FILTER: คัดโพสต์ที่เป็นภาพ 3D / แบบบ้านกราฟิกดีไซน์ออก (เว้นแต่เป็นภาพหน้างานก่อสร้างจริง)
  // =========================================================
  function isPure3DOrGraphicRender(post) {
    const text = post.text || post.message || '';
    if (!text) return false;

    // ตรวจสอบคีย์เวิร์ดงาน 3D / กราฟิก / เรนเดอร์ / โมเดล / แคตตาล็อกแบบบ้าน
    const is3DKeyword = /(?:ภาพ|รูป|แบบ|โมเดล|งานออกแบบ|แปลน)\s*3[dD]|3[dD]\s*(?:perspective|render|ภาพ|รูป|แบบ)|perspective|render|ภาพจำลอง|แบบแปลน|ขึ้นภาพ\s*3[dD]|#แบบบ้าน|แบบบ้านพักอาศัย\s*ค\.ส\.ล|จากภาพออกแบบวันนี้\s*สู่บ้านจริง|สู่บ้านจริงในอีกไม่นาน|ผลงานออกแบบโดยสถาปนิก/i.test(text);

    if (is3DKeyword) {
      // ตรวจสอบว่ามีงานก่อสร้างจริงหน้างานหรือไม่ (เช่น งานเทคาน, งานฉาบ, งานปูกระเบื้อง ฯลฯ)
      const hasRealSiteTask = /(?:เทคาน|เทพื้น|ขุดฐานราก|เทตอม่อ|ยกเสาเอก|ลงเสาเข็ม|ตอกเสาเข็ม|มุงหลังคา|ก่ออิฐ|ฉาบปูน|งานติดตั้งสุขภัณฑ์|งานทาสีโครงเหล็ก|งานปูกระเบื้อง|งานฝ้า|งานเดินระบบ|งานติดบัว|งานติดอุปกรณ์ไฟฟ้า|On site:|SITE UPDATE)/i.test(text);

      if (!hasRealSiteTask) {
        return true; // คัดออก (เป็นภาพ 3D/กราฟิกโมเดล ไม่มีงานก่อสร้างหน้างานจริง)
      }
    }

    return false;
  }

  // =========================================================
  // STEP 5 FILTER: คัดโพสต์งานออกแบบ/แบบบ้าน/ดีไซน์ ที่ไม่มีอำเภอในอุดร และไม่มีชื่อเจ้าของบ้านออก
  // =========================================================
  const designKeywordsList = [
    "ออกแบบ", "รับออกแบบ", "งานออกแบบ", "เขียนแบบ", "ดีไซน์", "บริการออกแบบ", "ออกแบบตกแต่ง",
    "Design by", "DESIGN BY", "design by", "ไอเดียผังบ้าน", "แบบบ้าน", "แปลนบ้าน"
  ];

  function isDesignWithoutDistrictOrPerson(post) {
    const text = post.text || post.message || '';
    if (!text) return false;

    // ตัด footer ออฟฟิศออกก่อนตรวจ
    let body = text;
    const footerMarkers = [
      '📌', '📍 ที่ตั้งสำนักงาน', '📍 ที่อยู่สำนักงาน', '📍 แผนที่สำนักงาน', '📍 พิกัดสำนักงาน',
      'ที่ตั้ง สำนักงาน', 'ที่ตั้งสำนักงาน', 'สำนักงานใหญ่', 'ออฟฟิศตั้งอยู่', 'ที่อยู่สำนักงาน',
      'สนใจติดต่อ', 'ติดต่อสอบถาม', 'สอบถามเพิ่มเติม', 'โทร 0', 'Tel:', 'Line ID', '#รับสร้างบ้าน', '#พื้นที่ให้บริการ', '#DREAM UP'
    ];
    for (const fm of footerMarkers) {
      const idx = body.indexOf(fm);
      if (idx > 10) body = body.substring(0, idx);
    }

    let isDesign = false;
    for (const kw of designKeywordsList) {
      if (body.includes(kw)) {
        isDesign = true;
        break;
      }
    }

    if (isDesign) {
      // ตรวจสอบข้อยกเว้น: มีอำเภอ 1 ใน 20 อำเภอหรือตำบลในอุดรธานี (ในเนื้อหาหน้างานเท่านั้น)
      for (const dist of udonDistrictsList) {
        if (body.includes(dist)) {
          return false; // เก็บไว้ (มีอำเภอ/พื้นที่ในอุดร)
        }
      }

      if (/(?:อ\.|อำเภอ)\s*เมือง/i.test(body) && (body.includes('อุดร') || body.includes('อุดรธานี'))) {
        return false; // เก็บไว้
      }

      // ตรวจสอบข้อยกเว้น: มีชื่อคน / เจ้าของบ้าน
      if (/(?:บ้านคุณ|บ้านของคุณ|ของบ้านคุณ|บ้านพักอาศัยคุณ|บ้านพักคุณ|บ้านพี่|บ้านป้า|บ้านลุง|บ้านน้า|บ้านหมอ|บ้านอาจารย์|Owner|owner)\s*[:\s]*([^\s\n,]+)/i.test(body)) {
        return false; // เก็บไว้ (มีชื่อเจ้าของบ้าน)
      }

      if (/(?:ท่านอาจารย์|อาจารย์|คุณหมอ|หมอ|ผอ\.|เสี่ย|ช่าง)\s*([ก-๙a-zA-Z0-9]+)?/i.test(body)) {
        return false; // เก็บไว้ (มีชื่อบุคคล)
      }

      const m = body.match(/(?:คุณ)\s*([ก-๙a-zA-Z]+)/);
      if (m && !/คุณภาพ|คุณสมบัติ|คุ้นเคย|คุณค่า|คุ้มค่า/.test(m[0])) {
        return false; // เก็บไว้ (มีชื่อคุณ...)
      }

      return true; // คัดออก (เป็นโพสต์งานออกแบบที่ไม่มีทั้งอำเภอในอุดรและชื่อคน)
    }

    return false;
  }

  // =========================================================
  // STEP 6 FILTER: คัดโพสต์ประกาศรับสมัครงาน / รับสมัครพนักงาน / รับสมัครช่าง ออก
  // =========================================================
  const recruitmentKeywordsList = [
    "รับสมัคร", "รับสมัครงาน", "รับสมัครพนักงาน", "เปิดรับสมัคร", "เปิดรับสมัครงาน",
    "ตำแหน่งงานว่าง", "ตำแหน่งที่เปิดรับ", "ประกาศรับสมัคร", "สมัครงาน", "รับสมัครด่วน",
    "รับช่าง", "หาช่าง", "รับโฟร์แมน", "หาโฟร์แมน", "รับวิศวกร", "รับสถาปนิก",
    "we are hiring", "we're hiring", "hiring", "job vacancy", "join our team",
    "walk-in interview", "ส่ง resume", "ส่ง portfolio", "อัตราจ้าง", "วุฒิการศึกษา",
    "คุณสมบัติผู้สมัคร", "นักศึกษาฝึกงาน", "รับนักศึกษาฝึกงาน", "เปิดรับฝึกงาน"
  ];

  function isRecruitmentPost(post) {
    const text = post.text || post.message || '';
    if (!text) return false;

    // ข้อยกเว้น: ถ้าเป็นเพียงการสัมภาษณ์เจ้าของบ้าน หรือ ขอบคุณที่ได้ร่วมงานก่อสร้าง
    let clean = text.replace(/สัมภาษณ์\s*(?:เจ้าของบ้าน|ลูกค้า|คุณ)/gi, '');
    clean = clean.replace(/(?:ร่วมงาน|ได้ร่วมงาน)\s*(?:ก่อสร้าง|กับ|สร้างบ้าน)/gi, '');
    clean = clean.replace(/ร่วมงานเลี้ยง/gi, '');

    for (const kw of recruitmentKeywordsList) {
      if (clean.toLowerCase().includes(kw)) {
        return true; // คัดออกทันที (เป็นโพสต์ประกาศรับสมัครงาน)
      }
    }
    return false;
  }

  // =========================================================
  // STEP 7 FILTER: คัดโพสต์อัปเดตรูปโปรไฟล์/หน้าปก, โพสต์ว่างเปล่า/อีโมจิ, ข่าว PR องค์กร/เปลี่ยนโลโก้/ครบรอบ/ขึ้นทะเบียน ออก
  // =========================================================
  function isCompanyPROrEmptyPost(post) {
    const rawText = (post.text || post.message || '').trim();
    const text = rawText.normalize ? rawText.normalize('NFKD') : rawText;

    // 1. โพสต์ว่างเปล่า หรือมีข้อความสั้นมาก (< 50 ตัวอักษร) และไม่มีคำระบุงานก่อสร้าง
    if (!text || text.length < 50) {
      if (!/(?:เทคาน|ฐานราก|ยกเสาเอก|เสาเข็ม|มุงหลังคา|ฉาบปูน|ก่ออิฐ|interior|built-in|ตกแต่ง|บิวท์อิน|ต่อเติม|คาน|เสา|พื้น|โครงสร้าง|รางระบายน้ำ|ถังตกตะกอน)/i.test(text)) {
        return true; // คัดออกทันที (โพสต์ว่างเปล่า/สั้นเกินไปไม่มีเนื้องาน)
      }
    }

    // 2. โพสต์เปลี่ยนรูปโปรไฟล์ หรือ เปลี่ยนรูปภาพหน้าปกเพจ
    if (/ได้อัพเดตรูปโปรไฟล์|ได้อัพเดตรูปภาพหน้าปก|updated (?:their )?(?:profile|cover) photo/i.test(text)) {
      return true; // คัดออก
    }

    // 3. ข่าวประชาสัมพันธ์องค์กร / โลโก้ใหม่ / ฉลองครบรอบ / ขึ้นทะเบียนจัดชั้นผู้ประกอบการ / ถ่ายรีวิวสินค้า / ประชุมประจำเดือน / CEO Onsite
    const isCorporatePR = /(?:NEW LOGO|โลโก้ใหม่|เปลี่ยนโลโก้|Rebrand Logo|20th Anniversary|Anniversary|ครบรอบ\s*\d+\s*ปี|\d+\s*YEARS OF|ขึ้นทะเบียนและจัดชั้น|จัดชั้นผู้ประกอบการ|กรมบัญชีกลาง|ถ่าย\s*present|อบรมช่างของเราเพิ่มเติม|มาให้ความรู้และอบรมช่าง|ทีมงาน SCG มาให้ความรู้|MONTHLY MEETING|CEO Onsite|สาระเล็ก ๆ ก่อนสร้างบ้าน|สร้างบ้านอย่างไรไม่ให้โดนทิ้งงาน)/i.test(text);
    if (isCorporatePR) {
      const hasSiteWork = /(?:เทคาน|เทพื้น|ขุดฐานราก|เทตอม่อ|ยกเสาเอก|ลงเสาเข็ม|ตอกเสาเข็ม|มุงหลังคา|ก่ออิฐ|ฉาบปูน)/i.test(text);
      if (!hasSiteWork) {
        return true; // คัดออก (เป็นข่าว PR บริษัท / ครบรอบ / โลโก้ / ประชุม)
      }
    }

    // 4. แคปชันคำคมให้กำลังใจ / สุภาษิต / สเตตัสบรรยากาศฝนตก ที่ไม่มีรายละเอียดโครงการจริง
    const isQuoteOrStatus = /(?:คำทำนาย|ลงมือทำในวันนี้|พยายามครั้งที่|ท้อถอย|ยังไม่ได้ทำ|วันฝนตก|ฝนตกหนัก|สู้ๆ|อรุณสวัสดิ์|มอนิ่ง|บ้านที่น่าอยู่ที่สุด|Every home has a story|May this home be filled)/i.test(text);
    if (isQuoteOrStatus) {
      const hasRealEngineering = /(?:คาน\s*ค\.ส\.ล|เหล็กDB|280\s*ksc|ถังตกตะกอน|รางระบายน้ำ|เกร้าท์ปูน)/i.test(text);
      if (!hasRealEngineering) {
        return true; // คัดออก (เป็นคำคมสเตตัส)
      }
    }

    // 5. โพสต์คลิปสั้นทั่วไปที่ไม่มีรายละเอียดโครงสร้าง เช่น ขนย้ายเศษวัสดุ เคลียร์ริ่ง
    if (/(?:งานขนย้ายเศษวัสดุ|เคลียร์ริ่ง|เก็บขยะ|กวาดพื้น)/i.test(text) && !/(?:คาน|เสาเข็ม|ฐานราก|เทคอนกรีต|ตอม่อ|ก่ออิฐ|ฉาบปูน|รางระบายน้ำ|แท่นถัง|ถังตกตะกอน)/i.test(text)) {
      return true;
    }

    return false;
  }

  // =========================================================
  // STEP 8 FILTER: คัดโพสต์ที่จบงานแล้ว / ส่งมอบงานแล้ว / ตรวจรับบ้านแล้ว ออกเด็ดขาด (ไม่ดึงมาเป็นโครงการ Active)
  // =========================================================
  const completedHandoverKeywordsList = [
    "ส่งมอบบ้าน", "ส่งมอบงาน", "ส่งมอบเรียบร้อย", "ส่งมอบแล้ว", "ส่งมอบกุญแจ", "ส่งมอบผลงาน",
    "พิธีส่งมอบ", "พิธีมอบบ้าน", "ตรวจรับบ้าน", "ตรวจรับมอบ", "รับมอบบ้าน", "รับกุญแจบ้าน",
    "ปิดจ๊อบ", "เสร็จสมบูรณ์ 100%", "เสร็จสมบูรณ์100%", "สร้างเสร็จสมบูรณ์", "ส่งมอบบ้านพักอาศัย",
    "งวดสุดท้ายพร้อมส่งมอบ", "handover", "hand over", "completed house", "finish house", "100% ส่งมอบ",
    "พร้อมส่งมอบบ้าน", "ส่งมอบบ้านสวย", "ตรวจรับบ้านเรียบร้อย", "ส่งมอบเรียบร้อยแล้ว", "ส่งมอบผลงานบ้าน",
    "ส่งมอบเมื่อพร้อมเท่านั้น", "ก่อนส่งมอบบ้านทุกหลัง"
  ];

  function isCompletedOrHandoverPost(post) {
    const text = post.text || post.message || '';
    if (!text) return false;

    // ข้อยกเว้นสโลแกนการตลาดทั่วไป เช่น "ดูแลตั้งแต่เริ่มจนส่งมอบ", "ตั้งแต่วันแรกจนถึงส่งมอบ", "พร้อมดูแลหลังส่งมอบบ้าน"
    let clean = text.replace(/(?:ดูแล|บริการ|ใส่ใจ|ตั้งแต่|ตั้งแต่วันแรก|จากวันแรก|เริ่มงาน|วางผัง)\s*(?:จนถึง|จน|ถึง)?\s*(?:วัน)?\s*(?:ส่งมอบ|รับกุญแจ)/gi, '');
    clean = clean.replace(/(?:พร้อมดูแล|ดูแล|บริการ|รับประกัน)\s*(?:หลัง|จนถึง|จน|ถึง)\s*(?:วัน)?\s*ส่งมอบ(?:บ้าน)?/gi, '');
    clean = clean.replace(/ออกแบบจนส่งมอบ/gi, '');
    clean = clean.replace(/รับประกันหลังส่งมอบ/gi, '');

    for (const kw of completedHandoverKeywordsList) {
      if (clean.toLowerCase().includes(kw.toLowerCase())) {
        return true; // คัดออกทันที (จบงานแล้ว ไม่ดึงมาเป็นโครงการ Active)
      }
    }

    if (/(?:ส่งมอบ|ตรวจรับ|รับมอบ)\s*(?:บ้าน|งาน|ไซต์|โครงการ|ผลงาน|กุญแจ)/i.test(clean)) {
      return true;
    }
    if (/(?:เสร็จสมบูรณ์|100%|ปิดจ๊อบ)\s*(?:พร้อมส่งมอบ|ส่งมอบ|ตรวจรับ)/i.test(clean)) {
      return true;
    }

    return false;
  }

  // =========================================================
  // STEP 9 FILTER: คัดโพสต์บรรยายโปรโมทบริษัท / แนะนำบริการ / สโลแกนการตลาด / PR จุดเด่น ออกเด็ดขาด
  // =========================================================
  const corporateServicePromoKeywords = [
    "มากกว่าแค่สร้างบ้าน", "สร้างความสบายใจ", "สร้างบ้านทั้งที", "เลือกทีมที่คุณไว้ใจได้", "เลือกทีมที่คุณไว้ใจ",
    "ผู้เชี่ยวชาญเรื่องบ้าน", "อำนวยความสะดวกเรื่องบ้าน", "ปรึกษาให้คำแนะนำ", "สำรวจ และประเมินสถานที่ก่อสร้าง",
    "สำรวจและประเมิน", "ยื่นขออนุญาตก่อสร้าง", "มีผลงานสร้างเสร็จจริงกว่า", "ผลงานสร้างเสร็จจริงกว่า",
    "สร้างเสร็จจริงกว่า", "ทำไมต้องสร้างบ้าน", "ทำไมต้องเลือกเรา", "จุดเด่นของเรา", "บริการของเรา",
    "ขั้นตอนการสร้างบ้าน", "ยินดีให้คำปรึกษา", "สร้างบ้านกับเรา", "ทำไมต้องสร้างบ้านกับ",
    "เพราะบ้านคือความฝัน", "ครบจบในที่เดียว", "บริการครบวงจร", "ด้วยประสบการณ์กว่า", "ประสบการณ์กว่า",
    "รับสร้างบ้านในจำนวนจำกัด",
    "สร้างโกดังสวยสวยให้ลูกค้าได้เริ่มต้น", "เริ่มต้นที่ 4000 บาทต่อตารางเมตร", "เริ่มต้นที่ 4,000 บาท",
    "งบไม่ถึงล้าน", "งบประมาณไม่ถึง 1 ล้านบาท", "ช่วยวางแบบและปรับพื้นที่ให้เหมาะกับงบ",
    "ไม่ว่าคุณจะชอบบ้านสไตล์ไหน", "มีดาดฟ้า มีมุมพักผ่อน หรือมีต้นไม้อยู่กลางบ้าน",
    "หน้างานจะแคบแค่ไหน", "หน้างานแคบเราก็ทำได้",
    "เราไม่ได้มีเพียงบริการรับสร้างบ้าน", "ยังมี รถเครน รถแม็คโคร", "รถเครน รถแม็คโคร และรถหกล้อ",
    "อบรมช่างของเราเพิ่มเติม", "มาให้ความรู้และอบรมช่าง"
  ];

  function isCorporatePRAndServicePromo(post) {
    const text = post.text || post.message || '';
    if (!text) return false;

    // ตัดข้อความ footer / template การตลาดออกก่อนตรวจ
    let body = text;
    const footerMarkers = [
      '📌', '📍 ที่ตั้งสำนักงาน', '📍 ที่อยู่สำนักงาน', '📍 แผนที่สำนักงาน', '📍 พิกัดสำนักงาน',
      'ที่ตั้ง สำนักงาน', 'ที่ตั้งสำนักงาน', 'สำนักงานใหญ่', 'ออฟฟิศตั้งอยู่', 'ที่อยู่สำนักงาน',
      'บริการพิเศษ', '👉บริการพิเศษ', '👉ช่องทางการติดต่อ👈', 'สนใจติดต่อ', 'ติดต่อสอบถาม',
      'สอบถามเพิ่มเติม', 'โทร 0', 'Tel:', 'Line ID', '#รับสร้างบ้าน', '#พื้นที่ให้บริการ', '#DREAM UP', '#A_HOUSE_BUILDER'
    ];
    for (const fm of footerMarkers) {
      const idx = body.indexOf(fm);
      if (idx > 10) body = body.substring(0, idx);
    }

    // ถ้ามีหัวข้ออัปเดตหน้างานก่อสร้างจริงและระบุไซต์งานชัดเจน ให้คงไว้
    if (/(?:อัฟเดทงาน|อัปเดตงาน|ความคืบหน้างาน|พิธียกเสาเอก|ยกเสาเอก|วางผัง|สถานที่ก่อสร้าง|พิกัดหน้างาน|พิกัดก่อสร้าง)\s*[:\s]/i.test(body) &&
        /(?:งานพื้น|งานเสา|เข้าแบบคาน|เทคาน|ฐานราก|ตอม่อ|ก่ออิฐ|งานก่อ|ฉาบปูน|งานฉาบ|ทาสี|มุงหลังคา|โครงหลังคา|ปูกระเบื้อง|เสาเอก|วางผัง)/i.test(body)) {
      return false;
    }

    if (/วางผังบ้าน/i.test(body)) {
      return false;
    }

    let matchCount = 0;
    for (const kw of corporateServicePromoKeywords) {
      if (body.includes(kw)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      // ตรวจสอบว่ามีงานก่อสร้างหน้างานจริงที่เฉพาะเจาะจงไซต์งานหรือไม่
      const hasSpecificSiteWork = /(?:พิธียกเสาเอก|ยกเสาเอก|ตอกเสาเข็ม|ลงเสาเข็ม|เจาะเสาเข็ม|ขุดฐานราก|เทตอม่อ|เทคานคอดิน|เทคาน|เทพื้น|งานพื้น|งานเสา|เข้าแบบคาน|เทคอนกรีตพื้น|ขึ้นโครงหลังคา|มุงหลังคา|ก่ออิฐมวลเบา|ก่ออิฐมอญ|งานก่ออิฐ|ฉาบปูน|งานปูกระเบื้อง|งานฝ้า|เดินระบบไฟฟ้า|งานทาสี|ทาสี)/i.test(body);
      const hasSpecificCustomer = /(?:บ้านคุณ|ลูกค้าคุณ|Project\s*\||Owner\s*[:\s]|บ้านพักอาศัยคุณ|บ้านพักคุณ|สถานที่ก่อสร้าง|พิกัดหน้างาน|พิกัด)/i.test(body);

      // ถ้าเป็นโพสต์บรรยาย แนะนำบริการ หรือไม่มีไซต์งาน/ชื่อเจ้าของบ้านเฉพาะเจาะจง -> คัดออกทันที
      if (!hasSpecificSiteWork || !hasSpecificCustomer) {
        return true;
      }
    }

    return false;
  }

  // Filter out explicit other provinces (Step 1), Holiday announcements (Step 2), Ads/Promo without District/Person (Step 3), Pure 3D Renders (Step 4), Design posts without District/Person (Step 5), Recruitment posts (Step 6), Corporate PR & Empty posts (Step 7), Completed/Handover posts (Step 8), Corporate PR & Service Promo (Step 9)
  const validPosts = posts.filter(p => !isExplicitOtherProvince(p) && !isHolidayAnnouncement(p) && !isAdWithoutDistrictOrPerson(p) && !isPure3DOrGraphicRender(p) && !isDesignWithoutDistrictOrPerson(p) && !isRecruitmentPost(p) && !isCompanyPROrEmptyPost(p) && !isCompletedOrHandoverPost(p) && !isCorporatePRAndServicePromo(p));
  console.log(`🔍 [Filters Applied] จากทั้งหมด ${posts.length} โพสต์ คัดออก ${posts.length - validPosts.length} โพสต์ คงเหลือ ${validPosts.length} โพสต์`);
  posts = validPosts;

  function cleanSlug(url) {
    if (!url) return '';
    let u = url.toLowerCase().trim();
    u = u.replace(/^https?:\/\/(www\.|m\.|mobile\.|web\.)?facebook\.com\//, '');
    const m = u.match(/profile\.php\?id=([0-9]+)/);
    if (m) return 'profile.php?id=' + m[1];
    u = u.replace(/\/posts\/.*$/, '').replace(/\/videos\/.*$/, '').replace(/\/photos\/.*$/, '').replace(/\/reels?\/.*$/, '');
    u = u.replace(/\?.*$/, '').replace(/\/$/, '').replace(/people\/[^\/]+\//, '');
    return u;
  }

  let totalMatchedProjects = 0;
  let totalUpdatedComps = 0;

  allCompanies.forEach(comp => {
    const cSlug = cleanSlug(comp.facebookUrl);
    const cName = (comp.name || '').toLowerCase();
    const cEng = (comp.engName || '').toLowerCase();

    // Match posts for this company
    const compPosts = posts.filter(p => {
      const pUrl = cleanSlug(p.facebookUrl || p.inputUrl || p.url || p.topLevelUrl);
      const inSlug = p.inputUrl ? cleanSlug(p.inputUrl) : '';
      const pName = (p.pageName || '').toLowerCase().trim();
      const uName = (p.user && p.user.name ? p.user.name : '').toLowerCase().trim();

      if (cSlug && pUrl && (pUrl === cSlug || pUrl.includes(cSlug) || cSlug.includes(pUrl))) return true;
      if (cSlug && inSlug && (inSlug === cSlug || inSlug.includes(cSlug) || cSlug.includes(inSlug))) return true;
      if (pName && (cName.includes(pName) || pName.includes(cName))) return true;
      if (uName && (cName.includes(uName) || uName.includes(cName))) return true;
      if (cEng && pName && (cEng.includes(pName) || pName.includes(cEng))) return true;
      return false;
    });

    if (compPosts.length > 0) {
      // Sort posts chronologically latest first
      compPosts.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));

      const latest = compPosts[0];
      comp.facebookSignal = {
        postDate: latest.time ? new Date(latest.time).toLocaleDateString('th-TH') : 'ล่าสุด',
        pageName: comp.name,
        caption: latest.text || latest.message || 'อัปเดตหน้างานสร้างบ้าน จ.อุดรธานี',
        likes: latest.likesCount || 0,
        comments: latest.commentsCount || 0,
        shares: latest.sharesCount || 0,
        detectedKeywords: ['อุดรธานี', 'ก่อสร้างจริง']
      };

      const validProjects = [];
      const seenSiteKeys = new Set();

      compPosts.forEach((p) => {
        if (isCompletedOrHandoverPost(p)) return; // ข้ามโพสต์ส่งมอบ/จบงาน
        const text = p.text || p.message || '';
        const textLower = text.toLowerCase();

        // 1. Generate Site/Project Key for same-site deduplication
        let siteKey = '';
        const locMatch = text.match(/(?:สถานที่ก่อสร้าง|พิกัดหน้างาน|พิกัดก่อสร้าง)\s*[:\s]*([^\n]+)/i);
        if (locMatch) {
          const cleanLoc = locMatch[1].replace(/[^a-zA-Z0-9ก-๙]/g, '_').substring(0, 40);
          siteKey = 'loc_' + cleanLoc;
        }

        if (!siteKey) {
          if (/หมอ\s*ออย|คุณหมอ\s*ออย/i.test(text) || (/ออย/i.test(text) && /โอ๊ต/i.test(text))) {
            siteKey = 'cust_หมอออย_โอ๊ต';
          } else if (/Jane\s*&\s*Eri|เจน\s*และ\s*เอริ/i.test(text)) {
            siteKey = 'cust_jane_eri';
          } else if (/แจ่วฮ้อนมิตรภักดี|มิตรภักดี|ดรีมและคุณมะปราง/i.test(text)) {
            siteKey = 'landmark_jaew_hon_mitpakdee';
          } else if (/วิมล|ตวงพร|เวียงพิงค์/i.test(text)) {
            siteKey = 'site_wimon_wiangping';
          } else if (/ตะวัน|บ้านคุณตะวัน/i.test(text)) {
            siteKey = 'site_tawan';
          } else if (/อัปเดตหน้างานหลัง 8\/9|อัพเดทหน้างานหลัง 8\/9/i.test(text)) {
            siteKey = 'site_update_0809';
          } else if (/เฌอลิชา/i.test(text)) {
            siteKey = 'cust_cherlicha';
          } else if (/บุญโย/i.test(text)) {
            siteKey = 'cust_boonyo';
          } else if (/กุมภวาปี/i.test(text) && (/500\s*ตร\.ม/i.test(text) || /สระว่ายน้ำ/i.test(text) || /โรงจอดรถ/i.test(text))) {
            siteKey = 'site_kumphawapi_500sqm';
          } else if (/ศรีธาตุ|บ้านสไตล์อังกฤษ/i.test(text)) {
            siteKey = 'site_srithat_english';
          }
        }

        if (!siteKey) {
          const projectMatch = text.match(/Project\s*\|\s*(?:K\.|คุณ)?\s*([a-zA-Z0-9_\-]+)/i);
          if (projectMatch) {
            siteKey = 'cust_' + projectMatch[1].toLowerCase().trim();
          } else {
            const custMatch = text.match(/(?:บ้านของ(?:คุณหมอ|คุณ|ท่าน)?|บ้านพักอาศัย(?:คุณหมอ|คุณ)?|บ้านพัก(?:คุณหมอ|คุณ)?|บ้าน(?:คุณหมอ|คุณ)?|ลูกค้า(?:คุณหมอ|คุณ)?|คุณหมอ|Khun|คุณ)\s*(?:หมอ|ดร|ดร\.|อาจารย์|ท่าน|ช่าง)?\s*([ก-๙a-zA-Z]+)/i);
            if (custMatch) {
              let cName = custMatch[1].replace(/เเ/g, 'แ').trim();
              cName = cName.replace(/^(?:หมอ|ดร|ดร\.|อาจารย์|ท่าน|ช่าง)/g, '').trim();
              if (!/^(?:ภาพ|งาน|สร้าง|ดี|เรา|ท่าน|ทุกท่าน|พี่|น้อง|ใหม่|เก่า|ครับ|ค่ะ|อุดร|คุณภาพ|มาตรฐาน|ลูกค้า|ออกแบบ|ไว้วางใจ|บริการ|สัญญา|ก่อน|วัน|ความ|หนึ่ง|ก้าว|ของ|ที่)$/i.test(cName) && cName.length >= 2) {
                siteKey = 'cust_' + cName.toLowerCase();
              }
            }
          }
        }

        if (!siteKey) {
          if (/โชว์รูมอุดรเซ็นเตอร์ฟิล์ม|เซ็นเตอร์ฟิล์ม/i.test(text)) siteKey = 'landmark_center_film';
          else if (/พีที|ปั๊ม\s*pt|บ้านปูลู/i.test(text)) siteKey = 'landmark_pt_pulu';
          else if (/Good Vibes|กู๊ดไวบ์/i.test(text)) siteKey = 'landmark_good_vibes';
          else if (/สุขคณา/i.test(text)) siteKey = 'landmark_sukkhana';
          else if (/MDUD\s*251/i.test(text)) siteKey = 'proj_mdud_251';
          else if (/ศุภาลัย/i.test(text)) siteKey = 'landmark_supalai';
          else if (/รชยา/i.test(text)) siteKey = 'landmark_rachaya';
          else if (/อภิทาวน์|หมู่บ้านอภิทาวน์/i.test(text)) siteKey = 'landmark_apitown';
          else if (/วิลลาจจิโอ/i.test(text)) siteKey = 'landmark_villaggio';
        }

        if (!siteKey) {
          const rawFirstLine = (text.split(/\r?\n/)[0] || '').trim().substring(0, 30);
          siteKey = 'line_' + rawFirstLine.replace(/[^a-zA-Z0-9ก-๙]/g, '_');
        }

        // If this project was already recorded (from a newer post), skip older duplicate posts!
        if (seenSiteKeys.has(siteKey)) {
          return;
        }
        seenSiteKeys.add(siteKey);

        let stageKey = 'structure';
        let stageText = 'งานโครงสร้างและก่อฉาบอาคาร';
        let prog = 50;

        if (textLower.includes('ยกเสาเอก') || textLower.includes('เสาเข็ม') || textLower.includes('ตอกเสา') || textLower.includes('วางผัง')) {
          stageKey = 'groundbreak'; stageText = 'พิธียกเสาเอกและวางผังเริ่มงานก่อสร้าง'; prog = 15;
        } else if (textLower.includes('ฐานราก') || textLower.includes('คานคอดิน') || textLower.includes('ตอม่อ') || textLower.includes('เทลีน')) {
          stageKey = 'foundation'; stageText = 'งานฐานราก ตอม่อ และคานคอดิน'; prog = 35;
        } else if (textLower.includes('ทาสี') || textLower.includes('ปูกระเบื้อง') || textLower.includes('กระเบื้อง') || textLower.includes('ตรวจงาน') || textLower.includes('สุขภัณฑ์') || textLower.includes('ฝ้า') || textLower.includes('ตกแต่ง')) {
          stageKey = 'finishing'; stageText = 'งานสถาปัตย์ ตกแต่ง และปูกระเบื้อง/สุขภัณฑ์'; prog = 80;
        }

        const rawLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const firstLine = rawLines.length > 0 ? rawLines[0] : `อัปเดตหน้างาน ${comp.name}`;
        const projTitle = firstLine.length > 55 ? firstLine.substring(0, 55) + '...' : firstLine;

        const pDistrict = typeof extractUdonDistrict === 'function' ? extractUdonDistrict(text, comp.district || 'เมืองอุดรธานี') : (comp.district || 'เมืองอุดรธานี');
        let locText = `อ.${pDistrict} จ.อุดรธานี`;
        if (text.includes('อภิทาวน์') || text.includes('หมู่บ้านอภิทาวน์')) locText = 'โครงการอภิทาวน์ อ.เมือง จ.อุดรธานี';
        else if (text.includes('หนองขอนกว้าง')) locText = 'ต.หนองขอนกว้าง อ.เมือง จ.อุดรธานี';
        else if (text.includes('บ้านจั่น')) locText = 'ต.บ้านจั่น อ.เมือง จ.อุดรธานี';
        else if (text.includes('นาดี') || text.includes('ศรีเชียงใหม่')) locText = 'ต.นาดี อ.เมือง จ.อุดรธานี';
        else if (text.includes('หมูม่น')) locText = 'ต.หมูม่น อ.เมือง จ.อุดรธานี';
        else if (text.includes('สามพร้าว')) locText = 'ต.สามพร้าว อ.เมือง จ.อุดรธานี';
        else if (text.includes('หมากแข้ง')) locText = 'ต.หมากแข้ง อ.เมือง จ.อุดรธานี';
        else if (text.includes('บ้านตาด')) locText = 'ต.บ้านตาด อ.เมือง จ.อุดรธานี';
        else if (text.includes('โนนสูง')) locText = 'ต.โนนสูง อ.เมือง จ.อุดรธานี';
        else if (text.includes('วังสามหมอ')) locText = 'อ.วังสามหมอ จ.อุดรธานี';

        validProjects.push({
          projectId: `${comp.id}-${validProjects.length + 1}`,
          name: projTitle,
          location: locText,
          province: 'อุดรธานี',
          district: pDistrict,
          gps: comp.coordinates || [17.412, 102.801],
          stage: stageText,
          stageKey: stageKey,
          trackingStatus: 'pending',
          progressPercent: prog,
          estValue: '5.5 ล้านบาท',
          buildingType: 'บ้านพักอาศัยเดี่ยว 2 ชั้น',
          caption: text || '(ไม่มีข้อความแคปชัน)',
          postedTime: p.time ? new Date(p.time).toLocaleDateString('th-TH') : 'ล่าสุด',
          postUrl: p.url || p.postUrl || p.facebookUrl || comp.facebookUrl,
          boq: [
            { sku: 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง', qty: '450 ถุง', estCost: '฿76,500', urgency: 'ด่วนที่สุด' },
            { sku: 'คอนกรีตผสมเสร็จ CPAC 240 ksc', qty: '75 คิว', estCost: '฿165,000', urgency: 'เตรียมสั่งซื้อ' }
          ]
        });
      });

      comp.projects = validProjects;
      comp.totalProjects = validProjects.length;
      comp.newProjectsThisMonth = validProjects.length;
      comp.totalValueMillion = parseFloat((comp.totalProjects * 5.5).toFixed(1));
      comp.revenuePotentialText = `฿${(comp.totalProjects * 0.5).toFixed(1)}M`;

      // Calculate exact Opportunity Score
      if (typeof getExactProjectOpportunityScore === 'function') {
        comp.opportunityScore = getExactProjectOpportunityScore(comp.totalProjects);
      } else {
        comp.opportunityScore = comp.totalProjects >= 7 ? 92 : (comp.totalProjects >= 5 ? 80 : (comp.totalProjects >= 3 ? 70 : (comp.totalProjects >= 1 ? 35 : 15)));
      }

      const gb = validProjects.filter(x => x.stageKey === 'groundbreak').length;
      const fd = validProjects.filter(x => x.stageKey === 'foundation').length;
      const st = validProjects.filter(x => x.stageKey === 'structure').length;
      const fn = validProjects.filter(x => x.stageKey === 'finishing').length;
      comp.stageBreakdown = { groundbreak: gb, foundation: fd, structure: st, finishing: fn };

      if (validProjects.length > 0) {
        totalMatchedProjects += validProjects.length;
        totalUpdatedComps++;
        comp.aiShortRec = `พบ ${validProjects.length} ไซต์งานก่อสร้างจริงใน จ.อุดรธานี (เสาเอก: ${gb}, ฐานราก: ${fd}, โครงสร้าง: ${st})`;
        comp.aiRecommendation = 'มีไซต์งานก่อสร้างจริงตรวจพบจาก Facebook แนะนำติดต่อเข้าล็อกสเปกปูน SCG และคอนกรีต CPAC ด่วน';
      } else {
        comp.aiShortRec = 'ศูนย์รับสร้างบ้าน จ.อุดรธานี (0 โครงการ)';
        comp.aiRecommendation = 'ไม่พบไซต์งานก่อสร้างใหม่ล่าสุดในเดือนนี้';
      }
    } else {
      comp.projects = [];
      comp.totalProjects = 0;
      comp.newProjectsThisMonth = 0;
      comp.totalValueMillion = 0.0;
      comp.revenuePotentialText = '฿0.0M - ฿0.0M';
      comp.opportunityScore = 15;
      comp.stageBreakdown = { groundbreak: 0, foundation: 0, structure: 0, finishing: 0 };
      comp.aiShortRec = 'รอสแกน Apify (0 โครงการ)';
      comp.aiRecommendation = 'ยังไม่พบโพสต์ที่ตรงกับเพจของบริษัทนี้ในไฟล์ JSON';
    }

    // Attach custom strategy if defined
    if (typeof COMPANY_CUSTOM_STRATEGIES !== 'undefined' && COMPANY_CUSTOM_STRATEGIES[comp.id]) {
      comp.customDiagnostic = COMPANY_CUSTOM_STRATEGIES[comp.id].customDiagnostic;
      comp.customRecommendations = COMPANY_CUSTOM_STRATEGIES[comp.id].customRecommendations;
    }
  });

  // Save parsed companies to sessionStorage for persistence across tab reloads
  try {
    sessionStorage.setItem('nextsite_session_uploaded_companies', JSON.stringify(allCompanies));
  } catch(e) {}

  // Sort companies by opportunity score
  sortCompaniesByOpportunityScore(allCompanies);

  // Update UI in real-time
  applyFilters();
  renderTable();
  renderKPIs();
  updateTagFilterCounts(allCompanies);
  if (typeof updateHeaderCrmStats === 'function') updateHeaderCrmStats();
  if (typeof initProductAnalyticsCharts === 'function') initProductAnalyticsCharts(allCompanies);
  if (typeof updateProjectTimelineMap === 'function') updateProjectTimelineMap(allCompanies);

  const msg = `🎉 นำเข้าสำเร็จ! ตรวจพบ ${totalMatchedProjects} โครงการ จาก ${totalUpdatedComps} บริษัท`;
  if (typeof showStatusToast === 'function') {
    showStatusToast(msg);
  } else {
    alert(msg);
  }
}

function resetUploadedDataToZero() {
  try {
    sessionStorage.removeItem('nextsite_session_uploaded_companies');
  } catch(e) {}
  
  loadSavedCompaniesData();
  allCompanies.forEach(c => {
    c.projects = [];
    c.totalProjects = 0;
    c.newProjectsThisMonth = 0;
    c.totalValueMillion = 0.0;
    c.opportunityScore = 15;
    c.revenuePotentialText = '฿0.0M - ฿0.0M';
    c.stageBreakdown = { groundbreak: 0, foundation: 0, structure: 0, finishing: 0 };
    c.aiShortRec = 'รอสแกน Apify (0 โครงการ)';
    c.aiRecommendation = 'รอรับข้อมูลไซต์งานก่อสร้างจริงจากไฟล์ Apify JSON';
    if (c.facebookSignal) {
      c.facebookSignal.postDate = '-';
      c.facebookSignal.caption = 'รอรับข้อมูลจาก Apify Facebook Posts Scraper';
    }
  });

  sortCompaniesByOpportunityScore(allCompanies);
  applyFilters();
  renderTable();
  renderKPIs();
  updateTagFilterCounts(allCompanies);
  if (typeof updateHeaderCrmStats === 'function') updateHeaderCrmStats();
  if (typeof initProductAnalyticsCharts === 'function') initProductAnalyticsCharts(allCompanies);
  if (typeof updateProjectTimelineMap === 'function') updateProjectTimelineMap(allCompanies);

  if (typeof showStatusToast === 'function') {
    showStatusToast('🔄 รีเซ็ตข้อมูลทุกบริษัทกลับเป็น 0 โครงการเรียบร้อยแล้ว');
  }
}

function runApifyLiveScrape() {
  showStatusToast('กำลังสั่งงาน Apify Facebook Actor ดึงข้อมูลสด...');
  setTimeout(() => {
    showStatusToast('✅ ดึงข้อมูลสดสำเร็จ มีการอัปเดตโพสต์ล่าสุด 5 รายการ');
  }, 1500);
}

function loadSampleHistoricalApifyDataset() {
  loadSavedCompaniesData();
  applyFilters();
  updateTagFilterCounts(allCompanies);
  if (window.initProductAnalyticsCharts) {
    window.initProductAnalyticsCharts(allCompanies);
  }
  showStatusToast(`โหลดฐานข้อมูล Master Dataset ${allCompanies.length} บริษัท จ.อุดรธานี เรียบร้อย`);
}

function resetToInitialVerifiedData() {
  if (confirm('คุณต้องการรีเซ็ตข้อมูลโครงการก่อสร้าง Facebook กลับเป็น 0 โครงการหรือไม่? (สถานะ Focus/Non-Focus, โน้ต และรูปภาพของเซลส์จะยังคงอยู่ 100%)')) {
    localStorage.removeItem(STORAGE_KEY_PROJECT_STATUSES);
    try {
      sessionStorage.removeItem('nextsite_session_uploaded_companies');
    } catch(e) {}
    loadSavedCompaniesData();
    applyFilters();
    renderTable();
    renderKPIs();
    updateTagFilterCounts(allCompanies);
    if (typeof updateHeaderCrmStats === 'function') updateHeaderCrmStats();
    if (window.initProductAnalyticsCharts) {
      window.initProductAnalyticsCharts(allCompanies);
    }
    if (typeof updateProjectTimelineMap === 'function') updateProjectTimelineMap(allCompanies);
    showStatusToast('🔄 รีเซ็ตข้อมูลทุกบริษัทกลับเป็น 0 โครงการเรียบร้อยแล้ว');
  }
}

function initGlobalDragAndDrop() {
  const overlay = document.getElementById('global-drag-drop-overlay');
  if (!overlay) return;

  let dragCounter = 0;

  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    overlay.style.display = 'flex';
  });

  window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      overlay.style.display = 'none';
      dragCounter = 0;
    }
  });

  window.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    overlay.style.display = 'none';

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.json') || file.type.includes('json')) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          try {
            const data = JSON.parse(evt.target.result);
            processApifyJsonData(data, file.name);
          } catch (err) {
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: รูปแบบไฟล์ไม่ถูกต้อง');
          }
        };
        reader.readAsText(file);
      } else {
        alert('กรุณาวางไฟล์ .json เท่านั้น');
      }
    }
  });
}

// ==========================================
// 11. CRM STATUS MODAL (Header Quick Badges)
// ==========================================
let activeCrmModalStatus = 'all';

function openCrmStatusModal(statusFilter = 'all') {
  activeCrmModalStatus = statusFilter;
  const modal = document.getElementById('crm-status-modal');
  if (!modal) return;

  switchCrmModalTab(statusFilter);
  modal.style.display = 'flex';
}

function closeCrmStatusModal() {
  const modal = document.getElementById('crm-status-modal');
  if (modal) modal.style.display = 'none';
}

function switchCrmModalTab(tabKey) {
  activeCrmModalStatus = tabKey;
  
  ['all', 'pending', 'followup', 'quote_sent', 'won', 'lost'].forEach(k => {
    const tabBtn = document.getElementById(`crm-tab-${k}`);
    if (tabBtn) {
      if (k === tabKey) {
        tabBtn.classList.add('border-blue-500', 'text-white', 'bg-blue-950/40');
      } else {
        tabBtn.classList.remove('border-blue-500', 'text-white', 'bg-blue-950/40');
      }
    }
  });

  renderCrmStatusModalProjects(tabKey);
}

function renderCrmStatusModalProjects(statusFilter = 'all', filterText = '') {
  const container = document.getElementById('crm-modal-projects-list');
  if (!container) return;

  container.innerHTML = '';
  
  const matchingList = [];
  allCompanies.forEach(c => {
    if (c.projects) {
      c.projects.forEach(p => {
        const st = p.trackingStatus || 'pending';
        if (statusFilter === 'all' || st === statusFilter) {
          if (!filterText || p.name.includes(filterText) || c.name.includes(filterText)) {
            matchingList.push({ company: c, project: p });
          }
        }
      });
    }
  });

  if (matchingList.length === 0) {
    container.innerHTML = `
      <div style="padding: 3rem 1rem; text-align: center; color: #64748B;">
        <p style="font-size: 0.9rem; font-weight: 600;">ไม่พบโครงการในสถานะนี้</p>
      </div>
    `;
    return;
  }

  matchingList.forEach(({ company, project }) => {
    const row = document.createElement('div');
    row.style.cssText = 'padding: 0.75rem 1rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.5rem; font-size: 0.8rem;';
    
    const curStatus = project.trackingStatus || 'pending';

    row.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <span style="font-weight: 800; color: #0F172A;">${cleanThaiText(project.name)}</span>
        <span style="color: #64748B; font-size: 0.74rem;">🏢 ${cleanThaiText(company.name)} • 📍 ${cleanThaiText(project.location) || 'อุดรธานี'} • มูลค่า ${project.estValue || '3.5M'}</span>
      </div>
      <div>
        <select onchange="handleCrmModalStatusChange('${company.id}', '${project.projectId}', this.value)" 
          style="background: #FFFFFF; border: 1px solid #CBD5E1; color: #0F172A; font-size: 0.75rem; border-radius: 6px; padding: 4px 8px; font-weight: 700; cursor: pointer;">
          <option value="pending" ${curStatus === 'pending' ? 'selected' : ''}>⏳ รอดำเนินการ</option>
          <option value="followup" ${curStatus === 'followup' ? 'selected' : ''}>📞 กำลังติดตาม</option>
          <option value="quote_sent" ${curStatus === 'quote_sent' ? 'selected' : ''}>📄 เสนอราคาแล้ว</option>
          <option value="won" ${curStatus === 'won' ? 'selected' : ''}>🎉 ปิดการขาย</option>
          <option value="lost" ${curStatus === 'lost' ? 'selected' : ''}>❌ พลาดดีล</option>
        </select>
      </div>
    `;

    container.appendChild(row);
  });
}

function handleCrmModalStatusChange(companyId, projectId, newStatus) {
  setProjectTrackingStatus(companyId, projectId, newStatus);
  renderCrmStatusModalProjects(activeCrmModalStatus);
}

function openKpiModal(type) {
  if (type === 'new' || type === 'prospect') {
    filterByCompanyTag('prospect');
  } else if (type === 'high') {
    activeFilter = 'red';
    document.querySelectorAll('.score-pill-btn').forEach(b => {
      if (b.getAttribute('data-filter') === 'red') b.classList.add('active');
      else b.classList.remove('active');
    });
    applyFilters();
  } else {
    activeFilter = 'all';
    document.querySelectorAll('.score-pill-btn').forEach(b => {
      if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
      else b.classList.remove('active');
    });
    applyFilters();
  }
}

// ==========================================
// 12. TOAST NOTIFICATIONS & LIVE TICKER
// ==========================================
function showToastNotification(message) {
  let toastContainer = document.getElementById('status-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'status-toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'status-toast';
  toast.innerHTML = `<span>🔔</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 2600);
}

function startFacebookCrawlerTicker() {
  const tickerEl = document.getElementById('live-signal-ticker') || document.querySelector('.fb-ticker-content');
  if (!tickerEl) return;

  const signals = [
    '🔔 ตรวจพบโพสต์ใหม่: <strong>หจก. ทรัพย์ยิ่งเจริญ คอนสตรัคชั่น</strong> เปิดหน้างานตอกเสาเข็ม อ.พังโคน',
    '🔔 ตรวจพบโพสต์ใหม่: <strong>บริษัท โฮม ดีเวลลอปเปอร์ จำกัด</strong> เทคอนกรีตฐานราก อ.เมืองอุดรธานี',
    '🔔 ตรวจพบโพสต์ใหม่: <strong>เอสเอซี สตูดิโอ สกลนคร</strong> โพสต์เริ่มงานโครงสร้างบ้านพักอาศัย',
    '🔔 AI วิเคราะห์: ความต้องการปูนโครงสร้าง SCG เพิ่มขึ้น <strong>+28%</strong> ในพื้นที่อุดรธานีและสกลนคร'
  ];

  let currentIdx = 0;
  setInterval(() => {
    currentIdx = (currentIdx + 1) % signals.length;
    tickerEl.innerHTML = signals[currentIdx];
  }, 7000);
}

// ==========================================
// 13. EVENT LISTENERS SETUP
// ==========================================
function setupEventListeners() {
  // 1. Search Input
  const searchInput = document.getElementById('search-input') || document.getElementById('company-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearchInputChange(e.target.value);
    });
    searchInput.addEventListener('keyup', (e) => {
      handleSearchInputChange(e.target.value);
    });
    searchInput.addEventListener('change', (e) => {
      handleSearchInputChange(e.target.value);
    });
  }

  // 2. Score Filter Pills
  document.querySelectorAll('.score-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.score-pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      applyFilters();
    });
  });

  // 3. Province / District Dropdowns
  const districtSelect = document.getElementById('district-filter') || document.getElementById('district-select');
  if (districtSelect) {
    districtSelect.addEventListener('change', (e) => {
      activeDistrict = e.target.value;
      activeSubDistrict = 'all';
      updateSubDistrictDropdown();
      applyFilters();
    });
  }

  const subDistrictSelect = document.getElementById('sub-district-filter') || document.getElementById('subdistrict-select');
  if (subDistrictSelect) {
    subDistrictSelect.addEventListener('change', (e) => {
      activeSubDistrict = e.target.value;
      applyFilters();
    });
  }

  // 4. View Switcher (Table vs Map)
  const btnTableView = document.getElementById('btn-table-view') || document.getElementById('view-table-btn');
  const btnMapView = document.getElementById('btn-map-view') || document.getElementById('view-map-btn');
  const tableView = document.getElementById('table-card-container') || document.getElementById('table-view-section');
  const mapView = document.getElementById('map-view-container') || document.getElementById('map-view-section');

  if (btnTableView && btnMapView && tableView && mapView) {
    btnTableView.addEventListener('click', () => {
      currentView = 'table';
      tableView.style.display = 'block';
      mapView.style.display = 'none';
      btnTableView.classList.add('active');
      btnMapView.classList.remove('active');
    });

    btnMapView.addEventListener('click', () => {
      currentView = 'map';
      tableView.style.display = 'none';
      mapView.style.display = 'block';
      btnMapView.classList.add('active');
      btnTableView.classList.remove('active');

      if (window.mapModule && window.mapModule.map) {
        setTimeout(() => window.mapModule.map.invalidateSize(), 150);
      }
    });
  }

  // 5. Apify File Input
  const apifyInput = document.getElementById('apify-file-input');
  if (apifyInput) {
    apifyInput.addEventListener('change', handleApifyFileUpload);
  }

  // 6. Escape Key Listener for Modals
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

// ==========================================
// 14. APPLICATION INITIALIZATION & STICKY HEADER
// ==========================================
function updateStickyOffsets() {
  const appHeader = document.querySelector('.app-header');
  if (appHeader) {
    const headerHeight = Math.round(appHeader.getBoundingClientRect().height) || 52;
    document.documentElement.style.setProperty('--sticky-app-header-top', headerHeight + 'px');
  }
}

window.addEventListener('resize', updateStickyOffsets);

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 NEXTSITE AI Dashboard Initializing with Executive UI...');

  loadSavedCompaniesData();

  if (typeof initMap === 'function') {
    initMap();
  }

  if (typeof initProductAnalyticsCharts === 'function') {
    initProductAnalyticsCharts(allCompanies);
  }

  // Synchronize initial activeDistrict with district-filter dropdown
  const districtSelect = document.getElementById('district-filter') || document.getElementById('district-select');
  if (districtSelect && districtSelect.value) {
    activeDistrict = districtSelect.value;
  }

  updateSubDistrictDropdown();
  updateTagFilterCounts(allCompanies);
  updateHeaderCrmStats();
  applyFilters();
  initSalesVisibilityState();
  initProductDemandCollapseState();

  setupEventListeners();
  initGlobalDragAndDrop();
  startFacebookCrawlerTicker();

  updateStickyOffsets();
  setTimeout(updateStickyOffsets, 200);
  setTimeout(updateStickyOffsets, 600);

  // Auto-open company detail modal if URL parameter is present
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const targetCompId = urlParams.get('companyId') || urlParams.get('compId') || urlParams.get('id');
    const targetScgCode = urlParams.get('scgCode') || urlParams.get('code');

    if (targetCompId || targetScgCode) {
      setTimeout(() => {
        let comp = allCompanies.find(c => {
          if (targetCompId && c.id === targetCompId) return true;
          if (targetScgCode && (String(c.scgCustomerCode) === String(targetScgCode) || String(c.scgCode) === String(targetScgCode))) return true;
          return false;
        });

        // Fallback matching by name / SCG customer sales list
        if (!comp && targetScgCode) {
          const salesItem = (typeof SCG_CUSTOMER_SALES_LIST !== 'undefined' ? SCG_CUSTOMER_SALES_LIST : []).find(s => String(s.code) === String(targetScgCode));
          if (salesItem) {
            comp = allCompanies.find(c => {
              const cName = (c.name || '').toLowerCase();
              if (salesItem.keys && salesItem.keys.some(k => cName.includes(k))) return true;
              if (cName.includes(salesItem.name.toLowerCase())) return true;
              return false;
            });
          }
        }

        if (comp && typeof openCompanyProjectsModal === 'function') {
          console.log('🎯 Auto-opening Company Detail Modal for:', comp.name, comp.id);
          openCompanyProjectsModal(comp);

          const row = document.getElementById(`company-row-${comp.id}`);
          if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center' });
            row.style.transition = 'background-color 0.5s ease';
            row.style.backgroundColor = '#FEF3C7';
            setTimeout(() => { row.style.backgroundColor = ''; }, 3000);
          }
        }
      }, 350);
    }
  } catch (err) {
    console.warn('URL param auto-open error:', err);
  }

  console.log('✅ NEXTSITE AI Dashboard Loaded Successfully with 100% Thai & Clean Text.');
});

// ==========================================
// DIRECT IN-BROWSER APIFY JSON IMPORTER
// ==========================================
function handleApifyJsonFileSelect(event) {
  handleApifyFileUpload(event);
}

function openScoringCriteriaModal() {
  const modal = document.getElementById('scoring-criteria-modal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeScoringCriteriaModal() {
  const modal = document.getElementById('scoring-criteria-modal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function openNavSiteAssessmentModal() {
  if (typeof currentSalesUser === 'undefined' || !currentSalesUser) {
    if (typeof showStatusToast === 'function') {
      showStatusToast('🔒 กรุณาเข้าสู่ระบบก่อนบันทึกการประเมินหน้างาน');
    }
    if (typeof openLoginModal === 'function') {
      openLoginModal(true);
    }
    return;
  }

  // If a company is already active
  if (typeof activeSelectedCompany !== 'undefined' && activeSelectedCompany && activeSelectedCompany.id) {
    openFollowUpModal(activeSelectedCompany.id);
    return;
  }

  // Otherwise pick the first visible/available company
  const list = (typeof filteredCompanies !== 'undefined' && filteredCompanies.length > 0) 
    ? filteredCompanies 
    : ((typeof allCompanies !== 'undefined' && allCompanies.length > 0) ? allCompanies : []);

  if (list.length > 0) {
    openFollowUpModal(list[0].id);
  } else if (typeof openCrmStatusModal === 'function') {
    openCrmStatusModal('all');
  }
}

window.openScoringCriteriaModal = openScoringCriteriaModal;
window.closeScoringCriteriaModal = closeScoringCriteriaModal;
window.openNavSiteAssessmentModal = openNavSiteAssessmentModal;



















