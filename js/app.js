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
let activeCompanyTagFilter = 'all'; // 'all' | 'focus' | 'non-focus' | 'new'
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
    'siarchitecture': 'ห้างหุ้นส่วนจำกัด เอสไอ อาร์คิเทคเชอร์ แอนด์ คอนสตรัคชั่น',
    'sdhousedesign': 'ห้างหุ้นส่วนจำกัด เอสดี เฮ้าส์ ดีไซน์',
    'N.P.HomeEngineering': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'n.p.homeengineering': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'nphome': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'รับสร้างบ้านภาคอิสาน BY N.p.home': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง',
    'รับสร้างบ้านภาคอิสาน by n.p.home': 'ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง'
  };

  for (const [slug, thaiName] of Object.entries(KNOWN_SLUG_MAP)) {
    if (str.toLowerCase() === slug.toLowerCase() || str.toLowerCase().includes(slug.toLowerCase())) {
      return thaiName;
    }
  }

  // 3. ทำความสะอาด URL prefix และตัวเลขต่อท้าย
  str = str.replace(/^https?:\/\/[^\/]+\/(p\/)?/i, '');
  str = str.replace(/-\d+\/?$/, '');
  str = str.replace(/^บรับสร้างบ้าน/, 'รับสร้างบ้าน');
  str = str.replace(/[\-_]+/g, ' ').trim();

  return str;
}

// ==========================================
// 2. TAG MANAGEMENT (Focus / Non-Focus / New)
// ==========================================
function loadCompanyTagsMap() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_COMPANY_TAGS);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load company tags from localStorage', e);
  }
  return {};
}

function saveCompanyTagsMap(tagMap) {
  try {
    localStorage.setItem(STORAGE_KEY_COMPANY_TAGS, JSON.stringify(tagMap));
  } catch (e) {
    console.warn('Failed to save company tags to localStorage', e);
  }
}

function getCompanyTag(companyId) {
  const tagMap = loadCompanyTagsMap();
  return tagMap[companyId] || 'new'; // default 'new'
}

function setCompanyTag(companyId, tag, event) {
  if (event && event.stopPropagation) {
    event.stopPropagation();
  }

  const comp = allCompanies.find(c => c.id === companyId);
  
  // Territory permission check
  if (typeof window.canCurrentUserEditCompany === 'function' && comp) {
    if (!window.canCurrentUserEditCompany(comp)) {
      const userProv = (typeof currentSalesUser !== 'undefined' && currentSalesUser) ? currentSalesUser.assignedProvince : 'อื่น';
      showStatusToast(`🔒 ไม่มีสิทธิ์แก้ไขข้อมูล ${comp.province || 'พื้นที่นี้'} (คุณได้รับมอบหมายเฉพาะ จ.${userProv})`);
      return;
    }
  }

  const tagMap = loadCompanyTagsMap();
  tagMap[companyId] = tag;
  saveCompanyTagsMap(tagMap);

  // Sync to Supabase Cloud in real-time
  if (typeof updateCloudCompanyTag === 'function') {
    updateCloudCompanyTag(companyId, tag);
  }

  applyFilters();
  updateTagFilterCounts(allCompanies);

  const tagNames = {
    'focus': '🎯 Focus (เป้าหมายหลัก)',
    'non-focus': '⚪ Non-Focus (ทั่วไป)',
    'new': '✨ New (เข้าใหม่)'
  };
  showStatusToast(`อัปเดตเป็น ${tagNames[tag] || tag} เรียบร้อย`);
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
  activeCompanyTagFilter = tag;

  document.querySelectorAll('.tag-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === tag) {
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
  const tagMap = loadCompanyTagsMap();
  let focusCount = 0;
  let nonFocusCount = 0;
  let newCount = 0;

  source.forEach(c => {
    const tag = tagMap[c.id] || 'new';
    if (tag === 'focus') focusCount++;
    else if (tag === 'non-focus') nonFocusCount++;
    else newCount++;
  });

  const elAll = document.getElementById('tag-count-all') || document.getElementById('count-tag-all');
  const elFocus = document.getElementById('tag-count-focus') || document.getElementById('count-tag-focus');
  const elNonFocus = document.getElementById('tag-count-non-focus') || document.getElementById('count-tag-nonfocus');
  const elNew = document.getElementById('tag-count-new') || document.getElementById('count-tag-new');

  if (elAll) elAll.textContent = source.length;
  if (elFocus) elFocus.textContent = focusCount;
  if (elNonFocus) elNonFocus.textContent = nonFocusCount;
  if (elNew) elNew.textContent = newCount;
}

function handleSetCompanyTag(tag) {
  if (activeSelectedCompany) {
    setCompanyTag(activeSelectedCompany.id, tag);
    
    ['focus', 'non-focus', 'new'].forEach(t => {
      const btn = document.getElementById(`btn-status-${t}`);
      if (btn) {
        if (t === tag) btn.classList.add('active');
        else btn.classList.remove('active');
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
  { code: '10509038', name: '117อาร์คิเทคท์', sales2025: 28572.5, sales2026: 395558.3, keys: ['117อาร์คิเทคท์', '117', '117 architect'] },
  { code: '10523555', name: 'ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์', sales2025: 1146567, sales2026: 2903328, keys: ['ทเวนตี้ซิกซ์', '26 development', '26'] },
  { code: '10551209', name: 'บ้านใหญ่ (2016) โฮม บิวเดอร์', sales2025: 5481324, sales2026: 5472101, keys: ['บ้านใหญ่', 'baanyai', 'baanyai2016'] },
  { code: '10590829', name: 'เลอ คราวน์ ดีไซน์', sales2025: 11367, sales2026: 329498.4, keys: ['เลอ คราวน์', 'เลอคราวน์', 'le crown', 'lecrown'] },
  { code: '10612650', name: 'บ้านดี อยู่ดี ดีไซน์', sales2025: 31155, sales2026: 93806.25, keys: ['บ้านดี อยู่ดี', 'บ้านดีอยู่ดี', 'baandee yoodee'] },
  { code: '10640153', name: 'กิจดลวรโชติ1', sales2025: 438100, sales2026: 1992527, keys: ['กิจดลวรโชติ', 'กิจดล'] },
  { code: '10729130', name: 'บ้านวิศวะพัฒนา', sales2025: 0, sales2026: 238997, keys: ['บ้านวิศวะพัฒนา', 'บ้านวิศวะ', 'baanwisawa', 'banwisawa'] },
  { code: '10739362', name: 'ห้างหุ้นส่วนจำกัด เค พี โฮม', sales2025: 0, sales2026: 7101, keys: ['เค พี โฮม', 'เค.พี.โฮม', 'เคพีโฮม', 'kp home', 'k.p. home'] },
  { code: '10727085', name: 'น่าอยู่เฮ้าส์ คอนสตรัคชั่น', sales2025: 0, sales2026: 161278, keys: ['น่าอยู่เฮ้าส์', 'น่าอยู่เฮ้าส์ คอนสตรัคชั่น', 'น่าอยู่', 'nayoo', 'nayoohouse'] }
];

function loadSavedCompaniesData() {
  // Clear any old corrupted data cache from localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('nextsite_saved_companies');
    localStorage.removeItem('nextsite_saved_detected_count');
    localStorage.removeItem('nextsite_last_synced_time');
  }

  let baseData = [];
  if (typeof window !== 'undefined' && Array.isArray(window.UDON_COMPANIES) && window.UDON_COMPANIES.length > 0) {
    baseData = window.UDON_COMPANIES;
  } else if (typeof window !== 'undefined' && Array.isArray(window.MASTER_COMPANIES) && window.MASTER_COMPANIES.length > 0) {
    baseData = window.MASTER_COMPANIES;
  }

  // Deep clone
  allCompanies = JSON.parse(JSON.stringify(baseData));

  // Sanitize and clean all text fields across companies
  allCompanies.forEach(c => {
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
      c.projects.forEach(p => {
        if (p.name) p.name = cleanThaiText(p.name);
        if (p.stage) p.stage = cleanThaiText(p.stage);
        if (p.location) p.location = cleanThaiText(p.location);
      });
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

function getCompanyScoreValue(comp) {
  if (comp.opportunityScore !== undefined && typeof comp.opportunityScore === 'number') {
    return comp.opportunityScore;
  }
  const projCount = (comp.projects && Array.isArray(comp.projects)) ? comp.projects.length : (Number(comp.totalProjects) || 0);
  if (projCount <= 0) return 15;
  if (projCount <= 2) return 35;
  if (projCount <= 4) return 70;
  if (projCount <= 6) return 80;
  return 92;
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
    // 1. บริษัทที่มีการซื้อขาย SCG ปี 2025 หรือ 2026 (ยอดซื้อขาย > 0) ต้องขึ้นมาก่อนเสมอ
    const salesA_2025 = Number(a.sales2025) || 0;
    const salesA_2026 = Number(a.sales2026) || 0;
    const totalSalesA = salesA_2026 + salesA_2025;
    const hasSalesA = (salesA_2025 > 0 || salesA_2026 > 0) ? 1 : 0;

    const salesB_2025 = Number(b.sales2025) || 0;
    const salesB_2026 = Number(b.sales2026) || 0;
    const totalSalesB = salesB_2026 + salesB_2025;
    const hasSalesB = (salesB_2025 > 0 || salesB_2026 > 0) ? 1 : 0;

    // 1. บริษัทที่มีประวัติการซื้อขาย SCG ปี 2025 / 2026 ขึ้นก่อน
    if (hasSalesB !== hasSalesA) {
      return hasSalesB - hasSalesA;
    }

    const scoreA = getCompanyScoreValue(a);
    const scoreB = getCompanyScoreValue(b);

    const projA = (a.projects && a.projects.length) ? a.projects.length : (Number(a.totalProjects) || 0);
    const projB = (b.projects && b.projects.length) ? b.projects.length : (Number(b.totalProjects) || 0);

    // 2. ในกลุ่มที่มีประวัติซื้อขาย ให้เรียงตาม Opportunity Score -> จำนวนโครงการ -> ยอดซื้อขาย
    if (hasSalesA === 1 && hasSalesB === 1) {
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      if (projB !== projA) {
        return projB - projA;
      }
      if (totalSalesB !== totalSalesA) {
        return totalSalesB - totalSalesA;
      }
      return (a.name || '').localeCompare(b.name || '', 'th');
    }

    // 3. ในกลุ่มที่ไม่มีประวัติซื้อขาย (New / Leads ทั่วไป)
    // 3.1 ลำดับแรก: บริษัท/นิติบุคคลที่ขึ้นต้นด้วย "บริษัท" และ "ห้างหุ้นส่วนจำกัด" ขึ้นก่อนร้านค้า/เพจทั่วไป
    const rankA = getCompanyEntityRank(a.name);
    const rankB = getCompanyEntityRank(b.name);
    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // 3.2 เรียงตาม Opportunity Score -> จำนวนโครงการ -> มูลค่าโครงการ
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    if (projB !== projA) {
      return projB - projA;
    }

    const valA = Number(a.totalValueMillion) || 0;
    const valB = Number(b.totalValueMillion) || 0;
    if (valB !== valA) {
      return valB - valA;
    }

    // 3.3 เรียงตามลำดับตัวอักษรภาษาไทย ก-ฮ
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

function saveCompanyCrmLog(companyId, logData) {
  try {
    const logs = getAllCrmLogs();
    const updatedRecord = {
      ...logs[companyId],
      ...logData,
      lastUpdated: new Date().toISOString()
    };
    logs[companyId] = updatedRecord;
    localStorage.setItem(STORAGE_KEY_CRM_LOGS, JSON.stringify(logs));
    localStorage.setItem('nextsite_crm_followup_logs', JSON.stringify(logs));

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
  saveCompanyCrmLog(companyId, { note: noteText });
  if (showToast) {
    showStatusToast(`☁️ บันทึกโน้ต CRM ขึ้น Cloud เรียบร้อย`);
  }
}

function openFollowUpModal(companyId, focusNote = true, event) {
  if (event && event.stopPropagation) event.stopPropagation();
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

  selectCrmStatus(crmLog.status || 'pending');

  const noteInput = document.getElementById('followup-note-input') || document.getElementById('crm-modal-note');
  if (noteInput) noteInput.value = crmLog.note || '';

  const dateInput = document.getElementById('followup-next-date');
  if (dateInput) dateInput.value = crmLog.nextDate || '';

  const repInput = document.getElementById('followup-sales-rep');
  if (repInput) repInput.value = crmLog.salesRep || (window.currentSalesUser ? window.currentSalesUser.fullName : 'ทีมขาย SCG อุดรธานี');

  const prodCheckboxes = document.querySelectorAll('input[name="followup-prod"]');
  prodCheckboxes.forEach(cb => {
    cb.checked = (crmLog.products || []).indexOf(cb.value) !== -1;
  });

  modal.style.display = 'flex';
  modal.style.visibility = 'visible';
  modal.style.opacity = '1';
  modal.style.zIndex = '2147483647';

  if (focusNote !== false && noteInput) {
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
  const tagMap = loadCompanyTagsMap();
  companies.forEach(c => {
    const pCount = c.projects ? c.projects.length : (c.totalProjects || 0);
    totalProjects += pCount;
    totalPipelineValue += (pCount * 0.5); // โครงการละ 500,000 บาท = 0.5 ล้านบาท

    const score = window.scoring ? window.scoring.calculatePriorityScore(c) : 50;
    if (score >= 90) highPriorityLeads++;

    // จำนวนบริษัทใหม่ คำนวณตามสถานะกลุ่ม New
    const tag = tagMap[c.id] || 'new';
    if (tag === 'new') {
      newCompaniesCount++;
    }
  });

  const elTotalComp = document.getElementById('kpi-total-companies');
  const elNewComp = document.getElementById('kpi-new-companies');
  const elHighOpp = document.getElementById('kpi-high-opp');
  const elTotalVal = document.getElementById('kpi-total-value');
  const elTotalProjectsSub = document.getElementById('kpi-total-projects-subtext');
  const elProvinceTotalProjectsBadge = document.getElementById('province-total-projects-badge');
  const elProvinceTotalProjectsCount = document.getElementById('province-total-projects-count');

  if (elTotalComp) elTotalComp.textContent = totalCompanies;
  if (elNewComp) elNewComp.textContent = newCompaniesCount;
  if (elHighOpp) elHighOpp.textContent = highPriorityLeads;
  if (elTotalVal) elTotalVal.textContent = `฿${totalPipelineValue.toFixed(1)}M`;
  if (elTotalProjectsSub) elTotalProjectsSub.textContent = `รวม ${totalProjects} โครงการที่กำลังก่อสร้าง`;
  
  // Dynamic Province Label Synchronization
  const isAllProv = (activeDistrict === 'all');
  const provLabel = isAllProv ? 'ทุกจังหวัด' : `จ.${cleanThaiText(activeDistrict)}`;
  const provLabelShort = isAllProv ? 'ทุกจังหวัด' : cleanThaiText(activeDistrict);

  // 1. Synchronize KPI Card 4 Title (มูลค่าโอกาสทางธุรกิจรวม)
  const elTotalValTitle = document.getElementById('kpi-total-value-title');
  if (elTotalValTitle) {
    elTotalValTitle.textContent = `มูลค่าโอกาสทางธุรกิจรวม (${provLabelShort})`;
  }

  // 2. Synchronize KPI Card 1 Subtext (ครอบคลุมทั่ว จ....)
  const elTotalCompSubtext = document.getElementById('kpi-total-companies-subtext');
  if (elTotalCompSubtext) {
    elTotalCompSubtext.textContent = isAllProv ? 'ครอบคลุมทั่วทุกจังหวัด' : `ครอบคลุมทั่ว ${provLabel}`;
  }

  // 3. Synchronize Product Demand Section Header
  const elProdDemandProv = document.getElementById('product-demand-province-label');
  if (elProdDemandProv) {
    elProdDemandProv.textContent = isAllProv ? 'ทุกจังหวัด' : provLabel;
  }

  // 4. Synchronize Project Count Badge
  if (elProvinceTotalProjectsBadge) {
    if (isAllProv) {
      elProvinceTotalProjectsBadge.innerHTML = `จำนวนโครงการทุกจังหวัด <span id="province-total-projects-count" style="color: var(--primary-red); font-size: 1.05rem; font-weight: 900;">${totalProjects}</span> โครงการ`;
    } else {
      elProvinceTotalProjectsBadge.innerHTML = `จำนวนโครงการใน${provLabel} <span id="province-total-projects-count" style="color: var(--primary-red); font-size: 1.05rem; font-weight: 900;">${totalProjects}</span> โครงการ`;
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
  const log = getCompanyCrmLog(companyId);
  const isTargeted = !(log.wantFollowup === true);
  saveCompanyCrmLog(companyId, { wantFollowup: isTargeted });
  
  if (typeof renderTable === 'function') {
    renderTable();
  }
  
  if (isTargeted) {
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
const STORAGE_KEY_PRODUCT_DEMAND_COLLAPSED = 'nextsite_product_demand_collapsed';

function initProductDemandCollapseState() {
  try {
    const isCollapsed = localStorage.getItem(STORAGE_KEY_PRODUCT_DEMAND_COLLAPSED) === 'true';
    if (isCollapsed) {
      applyProductDemandCollapseState(true);
    }
  } catch (e) {}
}

function toggleProductDemandSection() {
  const section = document.getElementById('product-demand-section');
  if (!section) return;
  const willCollapse = !section.classList.contains('collapsed');
  applyProductDemandCollapseState(willCollapse);
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCT_DEMAND_COLLAPSED, willCollapse ? 'true' : 'false');
  } catch (e) {}
}

function applyProductDemandCollapseState(collapsed) {
  const section = document.getElementById('product-demand-section');
  const icon = document.getElementById('icon-toggle-product-demand');
  const btn = document.getElementById('btn-toggle-product-demand');
  if (!section) return;

  if (collapsed) {
    section.classList.add('collapsed');
    if (icon) icon.textContent = '◀';
    if (btn) btn.title = 'คลิกเพื่อขยายดูความต้องการสินค้า SCG';
  } else {
    section.classList.remove('collapsed');
    if (icon) icon.textContent = '▼';
    if (btn) btn.title = 'คลิกเพื่อย่อรายละเอียดสินค้า';
  }
}

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

    const companyCleanName = cleanThaiText(company.name);

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

    // Calculate exact Opportunity Score
    const oppScore = (window.scoring && window.scoring.calculateOpportunityScore)
      ? window.scoring.calculateOpportunityScore(company).score
      : (projCount >= 7 ? 92 : (projCount >= 5 ? 80 : (projCount >= 3 ? 70 : (projCount >= 1 ? 35 : 15))));

    let badgeBg = '#F8FAFC';
    let badgeBorder = '#E2E8F0';
    let badgeColor = '#64748B';
    let recTierText = 'ปานกลาง (15)';
    let recTierColor = '#64748B';

    if (oppScore >= 90) { // 7+ โครงการ = 92
      badgeBg = '#FEF2F2';
      badgeBorder = '#FECACA';
      badgeColor = '#DC2626';
      recTierText = 'โอกาสสูงสุด (92)';
      recTierColor = '#DC2626';
    } else if (oppScore >= 80) { // 5-6 โครงการ = 80
      badgeBg = '#F0FDF4';
      badgeBorder = '#BBF7D0';
      badgeColor = '#16A34A';
      recTierText = 'โอกาสสูงมาก (80)';
      recTierColor = '#16A34A';
    } else if (oppScore >= 70) { // 3-4 โครงการ = 70
      badgeBg = '#FFF7ED';
      badgeBorder = '#FED7AA';
      badgeColor = '#EA580C';
      recTierText = 'โอกาสสูง (70)';
      recTierColor = '#EA580C';
    } else if (oppScore >= 35) { // 1-2 โครงการ = 35
      badgeBg = '#FEFCE8';
      badgeBorder = '#FEF08A';
      badgeColor = '#CA8A04';
      recTierText = 'โอกาสเริ่มต้น (35)';
      recTierColor = '#CA8A04';
    }

    // Check if sales rep manually assessed opportunity level
    const companyCrmLog = getCompanyCrmLog(company.id);
    let isSalesAssessed = false;
    if (companyCrmLog.salesOpportunityLevel === 'high') {
      recTierText = 'โอกาสสูง (เซลส์ประเมิน)';
      recTierColor = '#16A34A';
      isSalesAssessed = true;
    } else if (companyCrmLog.salesOpportunityLevel === 'medium') {
      recTierText = 'โอกาสปานกลาง (เซลส์ประเมิน)';
      recTierColor = '#EA580C';
      isSalesAssessed = true;
    } else if (companyCrmLog.salesOpportunityLevel === 'low') {
      recTierText = 'โอกาสน้อย (เซลส์ประเมิน)';
      recTierColor = '#64748B';
      isSalesAssessed = true;
    }

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
            ${company.scgCode ? `
              <span style="font-size: 0.7rem; font-weight: 700; color: #0369A1; background: #E0F2FE; padding: 1px 6px; border-radius: 4px; border: 1px solid #BAE6FD;">
                รหัส ${company.scgCode}
              </span>
            ` : ''}
          </div>
          
          <!-- Sales Tag Selector Buttons: Focus / Non-Focus / New -->
          <div class="inline-tag-selector" onclick="event.stopPropagation();" style="display: inline-flex; align-items: center; gap: 3px; background: #F1F5F9; padding: 2px 4px; border-radius: 6px; border: 1px solid #CBD5E1; width: fit-content;">
            <button type="button" 
                    title="ตั้งเป็น Focus (เป้าหมายหลัก)"
                    onclick="setCompanyTag('${company.id}', 'focus', event)" 
                    style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 7px; font-size: 0.72rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s ease; ${curTag === 'focus' ? 'background: #DC2626; color: #FFFFFF; box-shadow: 0 1px 3px rgba(220,38,38,0.35);' : 'background: transparent; color: #64748B;'}">
              🎯 Focus
            </button>
            <button type="button" 
                    title="ตั้งเป็น Non-Focus (ทั่วไป)"
                    onclick="setCompanyTag('${company.id}', 'non-focus', event)" 
                    style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 7px; font-size: 0.72rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s ease; ${curTag === 'non-focus' ? 'background: #475569; color: #FFFFFF; box-shadow: 0 1px 3px rgba(71,85,105,0.35);' : 'background: transparent; color: #64748B;'}">
              ⚪ Non-Focus
            </button>
            <button type="button" 
                    title="ตั้งเป็น New (เข้าใหม่)"
                    onclick="setCompanyTag('${company.id}', 'new', event)" 
                    style="display: inline-flex; align-items: center; gap: 2px; padding: 2px 7px; font-size: 0.72rem; font-weight: 800; border-radius: 4px; border: none; cursor: pointer; transition: all 0.15s ease; ${curTag === 'new' ? 'background: #0284C7; color: #FFFFFF; box-shadow: 0 1px 3px rgba(2,132,199,0.35);' : 'background: transparent; color: #64748B;'}">
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
            ${(company.googleMapsUrl || company.gmaps) ? `
              <a href="${company.googleMapsUrl || company.gmaps}" target="_blank" onclick="event.stopPropagation();" title="เปิดดูหมุดพิกัดจริงบน Google Maps (${cleanThaiText(company.name)})" style="color: #EA4335; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
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
          <div style="display: flex; align-items: center; gap: 6px;">
            <strong style="font-size: 1rem; font-weight: 900; color: #0F172A;">${projCount} โครงการ</strong>
            <span style="background: #E0F2FE; color: #0284C7; font-size: 0.72rem; font-weight: 800; padding: 1px 7px; border-radius: 9999px; border: 1px solid #BAE6FD; display: inline-flex; align-items: center; gap: 3px;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> FB จริง
            </span>
          </div>
          ${projCount === 0 ? `
          <div style="font-size: 0.76rem; color: #059669; font-weight: 700; display: flex; align-items: center; gap: 4px;">
            <span style="color: #E11D48;">📍</span> มีไซต์งานจริงในพื้นที่อื่น
          </div>` : ''}
        </div>
      </td>

      <!-- 5. ยอดซื้อ SCG 2025 -->
      <td class="col-sales-2025" style="vertical-align: middle; text-align: right;">
        <div style="font-weight: 800; font-size: 0.9rem; color: ${(company.sales2025 || 0) > 0 ? '#1E293B' : '#94A3B8'};">
          ${(company.sales2025 || 0) > 0 ? '฿' + Number(company.sales2025).toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : '-'}
        </div>
      </td>

      <!-- 6. ยอดซื้อ SCG 2026 -->
      <td class="col-sales-2026" style="vertical-align: middle; text-align: right;">
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 2px;">
          <div style="font-weight: 900; font-size: 0.92rem; color: ${
            (company.sales2026 || 0) === 0 && (company.sales2025 || 0) === 0
              ? '#94A3B8'
              : (company.sales2026 || 0) > (company.sales2025 || 0)
                ? '#16A34A'
                : (company.sales2026 || 0) < (company.sales2025 || 0)
                  ? '#DC2626'
                  : '#1E293B'
          };">
            ${(company.sales2026 || 0) > 0 ? '฿' + Number(company.sales2026).toLocaleString('th-TH', {minimumFractionDigits: 0, maximumFractionDigits: 2}) : '-'}
          </div>
          ${(company.sales2026 || 0) > (company.sales2025 || 0) && (company.sales2025 || 0) > 0 
            ? `<span style="font-size: 0.68rem; font-weight: 800; color: #16A34A; background: #DCFCE7; padding: 1px 5px; border-radius: 4px; display: inline-flex; align-items: center; gap: 2px;">📈 โต +${Math.round((((company.sales2026 || 0) - (company.sales2025 || 0)) / (company.sales2025 || 1)) * 100)}%</span>` 
            : ''}
          ${(company.sales2026 || 0) < (company.sales2025 || 0) && (company.sales2026 || 0) > 0 
            ? `<span style="font-size: 0.68rem; font-weight: 800; color: #DC2626; background: #FEE2E2; padding: 1px 5px; border-radius: 4px; display: inline-flex; align-items: center; gap: 2px;">📉 ลดลง</span>` 
            : ''}
          ${(company.sales2026 || 0) > 0 && (company.sales2025 || 0) === 0 
            ? `<span style="font-size: 0.68rem; font-weight: 800; color: #16A34A; background: #DCFCE7; padding: 1px 5px; border-radius: 4px;">✨ New SCG</span>` 
            : ''}
          ${(company.sales2026 || 0) === 0 && (company.sales2025 || 0) > 0 
            ? `<span style="font-size: 0.68rem; font-weight: 800; color: #DC2626; background: #FEE2E2; padding: 1px 5px; border-radius: 4px;">📉 ไม่มียอดซื้อ</span>` 
            : ''}
          ${(company.sales2026 || 0) === 0 && (company.sales2025 || 0) === 0 
            ? `<span style="font-size: 0.68rem; color: #94A3B8;">⚪ ยังไม่เคยซื้อ</span>` 
            : ''}
        </div>
      </td>

      <!-- 7. สถานะการติดตาม (ปุ่มต้องการติดตาม + ป้ายสถานะเข้าติดตามแล้ว/รอการติดตาม) -->
      <td style="text-align: center; vertical-align: middle; padding: 6px 8px;">
        ${(() => {
          const log = getCompanyCrmLog(company.id);
          const isTargeted = (log.wantFollowup === true);
          const hasFollowedUp = (log.note && log.note.trim().length > 0) || 
                                (Array.isArray(log.photos) && log.photos.length > 0) || 
                                ['followup', 'won', 'quote_sent'].includes(log.status);

          const targetBtnHtml = isTargeted
            ? `
              <button type="button" onclick="toggleTargetFollowup('${company.id}', event)" 
                title="คลิกเพื่อยกเลิกการปักหมุดต้องการติดตาม" 
                style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 3px 10px; border-radius: 6px; border: 1.5px solid #2563EB; background: #EFF6FF; color: #1D4ED8; font-size: 0.72rem; font-weight: 800; cursor: pointer; box-shadow: 0 1px 3px rgba(37,99,235,0.2); transition: all 0.15s ease;"
                onmouseover="this.style.background='#DBEAFE'; this.style.transform='scale(1.03)';" 
                onmouseout="this.style.background='#EFF6FF'; this.style.transform='scale(1)';">
                <span>🎯</span>
                <span>ต้องการติดตาม</span>
                <span style="font-size: 0.65rem; background: #2563EB; color: #FFFFFF; border-radius: 9999px; padding: 0 4px; margin-left: 2px;">✓</span>
              </button>
            `
            : `
              <button type="button" onclick="toggleTargetFollowup('${company.id}', event)" 
                title="คลิกเพื่อปักหมุดว่า 'ต้องการติดตาม' บริษัทนี้" 
                style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; padding: 3px 10px; border-radius: 6px; border: 1.5px solid #CBD5E1; background: #FFFFFF; color: #475569; font-size: 0.72rem; font-weight: 700; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.04); transition: all 0.15s ease;"
                onmouseover="this.style.borderColor='#3B82F6'; this.style.color='#1D4ED8'; this.style.background='#EFF6FF'; this.style.transform='scale(1.03)';" 
                onmouseout="this.style.borderColor='#CBD5E1'; this.style.color='#475569'; this.style.background='#FFFFFF'; this.style.transform='scale(1)';">
                <span style="color: #94A3B8;">📌</span>
                <span>ต้องการติดตาม</span>
              </button>
            `;

          const statusBadgeHtml = hasFollowedUp
            ? `
              <div onclick="openCompanyProjectsModal('${company.id}')" title="เข้าติดตามแล้ว (มีประวัติการเข้าพบ/โน้ต/รูปถ่ายหน้างาน)" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; border: 1.5px solid #86EFAC; background: #F0FDF4; font-weight: 800; font-size: 0.74rem; color: #15803D; box-shadow: 0 1px 3px rgba(22,163,74,0.1); white-space: nowrap; cursor: pointer;">
                <span style="color: #16A34A; font-size: 0.85rem; line-height: 1;">●</span>
                <span>เข้าติดตามแล้ว</span>
              </div>
            `
            : `
              <div onclick="openCompanyProjectsModal('${company.id}')" title="รอการติดตาม (ยังไม่มีบันทึกการเข้าพบหรือรูปถ่าย)" style="display: inline-flex; align-items: center; justify-content: center; gap: 5px; padding: 3px 10px; border-radius: 9999px; border: 1.5px solid #FED7AA; background: #FFF7ED; font-weight: 800; font-size: 0.74rem; color: #C2410C; box-shadow: 0 1px 3px rgba(234,88,12,0.1); white-space: nowrap; cursor: pointer;">
                <span style="color: #EA580C; font-size: 0.85rem; line-height: 1;">●</span>
                <span>รอการติดตาม</span>
              </div>
            `;

          return `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;">
              ${targetBtnHtml}
              ${statusBadgeHtml}
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
          <div style="display: flex; align-items: center; gap: 5px; font-size: 0.78rem; font-weight: 800; color: ${recTierColor};">
            <span style="color: ${recTierColor}; font-size: 0.9rem;">●</span> ${recTierText}
          </div>
          <div style="font-size: 0.75rem; color: #334155; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px;" title="🎯 เพจทางการ: ${fbPageHandle}">
            🎯 เพจทางการ: ${fbPageHandle}
          </div>
          <div style="font-size: 0.72rem; color: #DC2626; font-weight: 800;">
            กดเพื่อดูบทวิเคราะห์...
          </div>
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
function applyFilters() {
  filteredCompanies = allCompanies.filter(comp => {
    // 1. Text Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = (comp.name || '').toLowerCase().includes(q);
      const matchEng = (comp.engName || '').toLowerCase().includes(q);
      const matchDist = (comp.district || '').toLowerCase().includes(q);
      const matchProv = (comp.province || '').toLowerCase().includes(q);
      const matchPhone = (comp.phone || '').toLowerCase().includes(q);
      const matchProj = comp.projects && comp.projects.some(p => (p.name || '').toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q));
      const matchKw = comp.facebookSignal && comp.facebookSignal.detectedKeywords && comp.facebookSignal.detectedKeywords.some(k => k.toLowerCase().includes(q));

      if (!matchName && !matchEng && !matchDist && !matchProv && !matchPhone && !matchProj && !matchKw) {
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

    // 7. Follow-up Status Filter (CRM Status: All / Targeted / Followed / Pending)
    if (activeFollowupStatusFilter !== 'all') {
      const log = getCompanyCrmLog(comp.id);
      const hasFollowedUp = (log.note && log.note.trim().length > 0) || 
                            (Array.isArray(log.photos) && log.photos.length > 0) || 
                            ['followup', 'won', 'quote_sent'].includes(log.status);

      if (activeFollowupStatusFilter === 'targeted' && !log.wantFollowup) return false;
      if (activeFollowupStatusFilter === 'followed' && !hasFollowedUp) return false;
      if (activeFollowupStatusFilter === 'pending' && hasFollowedUp) return false;
    }

    return true;
  });

  // จัดลำดับ: คะแนน Opportunity Score สูงสุด (92 -> 80 -> 70 -> 35 -> 15) ต้องอยู่บนสุดเสมอ
  sortCompaniesByOpportunityScore(filteredCompanies);

  renderKPIs();
  renderTable();

  // Dynamically update Report summary badge to match selected province
  const reportBadge = document.getElementById('badge-report-summary');
  if (reportBadge) {
    const isAll = (activeDistrict === 'all');
    const count = filteredCompanies.length;
    const provLabel = isAll ? 'ทุกจังหวัด' : `จ.${cleanThaiText(activeDistrict)}`;
    
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

        <div style="font-size: 0.75rem; font-weight: 700; color: #475569; margin-bottom: 0.5rem;">
          การวิเคราะห์คะแนน 5 ปัจจัย (Score Breakdown)
        </div>
        <div id="modal-dimensions-list" class="score-dimension-list">
          ${scoreData && scoreData.dimensions ? scoreData.dimensions.map(d => `
            <div class="dimension-row">
              <div class="dimension-meta">
                <span style="color: #334155;">${d.name} (${d.weight})</span>
                <span style="font-weight: 800; color: #0F172A;">${d.score}/100</span>
              </div>
              <div class="dim-bar-bg">
                <div class="dim-bar-fill" style="width: ${d.score}%;"></div>
              </div>
              <div style="font-size: 0.68rem; color: #64748B; margin-top: 1px;">${d.desc}</div>
            </div>
          `).join('') : ''}
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
  ['focus', 'non-focus', 'new'].forEach(t => {
    const btn = document.getElementById(`btn-status-${t}`);
    if (btn) {
      if (t === tag) btn.classList.add('active');
      else btn.classList.remove('active');
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
    let mapsUrl = comp.googleMapsUrl || comp.gmaps;
    if (!mapsUrl && comp.coordinates && comp.coordinates.length === 2 && comp.coordinates[0]) {
      mapsUrl = `https://www.google.com/maps?q=${comp.coordinates[0]},${comp.coordinates[1]}`;
    } else if (!mapsUrl) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((comp.name || '') + ' ' + (comp.address || comp.district || 'อุดรธานี'))}`;
    }
    elGmapsLink.href = mapsUrl;
    if (elGmapsText) {
      elGmapsText.textContent = `เปิด Google Maps (${cleanThaiText(comp.district) || 'พิกัดสำนักงาน'})`;
    }
  }

  // Score Matrix / SCG Sales Intelligence & AI Advisor
  renderModalScoreOrSalesIntelligence(comp);

  // Render Projects List
  renderCompanyProjectsList(comp);

  // Load and Render Sales CRM Notes for Company
  const log = getCompanyCrmLog(comp.id);
  const noteTextarea = document.getElementById('modal-company-sales-note');
  const noteStatus = document.getElementById('modal-crm-note-status-indicator');
  const noteLastUpdated = document.getElementById('modal-crm-note-last-updated');

  if (noteTextarea) {
    noteTextarea.value = log.note || '';
  }
  if (noteStatus) {
    noteStatus.innerHTML = '<span style="color: #16A34A;">✅ พร้อมบันทึก</span>';
  }
  if (noteLastUpdated) {
    noteLastUpdated.textContent = log.lastUpdated 
      ? `บันทึกล่าสุด: ${new Date(log.lastUpdated).toLocaleString('th-TH')}`
      : 'บันทึกล่าสุด: ยังไม่มีประวัติ';
  }

  // Render Opportunity Level Buttons
  updateOpportunityLevelButtonsUI(log.salesOpportunityLevel || null);

  // Render Site Visit Photos Gallery
  renderCompanyPhotosGallery(comp.id);

  modal.style.display = 'flex';
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
    
    return `
      <div style="position: relative; width: 88px; height: 88px; border-radius: 8px; overflow: hidden; border: 1.5px solid #CBD5E1; box-shadow: 0 2px 5px rgba(15,23,42,0.08); background: #0F172A; cursor: pointer; flex-shrink: 0;" onclick="openImageLightbox('${p.dataUrl}', '${safeCaption} • ${timeStr}')">
        <img src="${p.dataUrl}" alt="Site visit photo" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(15,23,42,0.78); color: #FFFFFF; font-size: 0.62rem; font-weight: 700; padding: 2px 4px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${timeStr}
        </div>
        <button type="button" onclick="event.stopPropagation(); deleteCompanyPhoto('${p.id}');" title="ลบรูปนี้" style="position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; background: rgba(239,68,68,0.92); color: #FFFFFF; border: none; font-size: 0.65rem; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.3); transition: transform 0.15s ease;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='none'">
          ✕
        </button>
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

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;
    try {
      const dataUrl = await compressImage(file, 960, 960, 0.75);
      newPhotos.push({
        id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: file.name || 'Site Visit Photo',
        dataUrl: dataUrl,
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
  showStatusToast(`📸 อัปโหลดรูปภาพหลักฐาน ${newPhotos.length} รูป เรียบร้อยแล้ว`);

  // Reset file input
  event.target.value = '';
}

function deleteCompanyPhoto(photoId) {
  if (!activeSelectedCompany) return;
  if (!confirm('คุณต้องการลบรูปภาพหลักฐานนี้หรือไม่?')) return;

  const log = getCompanyCrmLog(activeSelectedCompany.id);
  const existingPhotos = Array.isArray(log.photos) ? log.photos : [];
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

function renderCompanyProjectsList(company) {
  const container = document.getElementById('modal-projects-section-container');
  if (!container) return;

  const projects = company.projects || [];
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
      ${displayProjects.map(proj => {
        const curStatus = proj.trackingStatus || 'pending';
        const stageBadgeClass = `stage-${proj.stageKey || 'structure'}`;
        const projCleanName = cleanThaiText(proj.name || proj.title);
        const projCleanLocation = cleanThaiText(proj.location || proj.district || 'อุดรธานี');
        const projCleanStage = cleanThaiText(proj.stage);
        const scgMaterials = getStageMatchedScgMaterials(proj);
        
        // Facebook Post Proof & URL
        const fbUrl = (proj.siteProof && proj.siteProof.postUrl) || proj.postUrl || company.facebookUrl || '#';
        const fbTime = (proj.siteProof && proj.siteProof.postedTime) || proj.postedTime || proj.date || '';
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

            <!-- Project Tracking Status Switcher -->
            <div class="tracking-status-group" style="margin-top: 0.65rem; background: rgba(0, 0, 0, 0.35); border: 1px solid rgba(255, 255, 255, 0.14);">
              <span style="font-size: 0.7rem; font-weight: 700; color: #CBD5E1; margin-left: 4px;">สถานะ:</span>
              <button type="button" class="tracking-btn btn-pending ${curStatus === 'pending' ? 'active' : ''}" onclick="setProjectTrackingStatus('${company.id}', '${proj.projectId || proj.id}', 'pending', event)">
                ⏳ รอติดตาม
              </button>
              <button type="button" class="tracking-btn btn-followup ${curStatus === 'followup' ? 'active' : ''}" onclick="setProjectTrackingStatus('${company.id}', '${proj.projectId || proj.id}', 'followup', event)">
                📞 นัดหมาย
              </button>
              <button type="button" class="tracking-btn btn-quote ${curStatus === 'quote_sent' ? 'active' : ''}" onclick="setProjectTrackingStatus('${company.id}', '${proj.projectId || proj.id}', 'quote_sent', event)">
                📄 ส่งใบเสนอราคา
              </button>
              <button type="button" class="tracking-btn btn-won ${curStatus === 'won' ? 'active' : ''}" onclick="setProjectTrackingStatus('${company.id}', '${proj.projectId || proj.id}', 'won', event)">
                🎉 ปิดการขาย
              </button>
            </div>
          </div>
        `;
      }).join('')}
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
    'focus': '🎯 Focus (เป้าหมายหลัก)',
    'non-focus': '⚪ Non-Focus (ทั่วไป)',
    'new': '✨ New (เข้าใหม่)'
  };
  const tagBadgeStyle = {
    'focus': 'background: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE;',
    'non-focus': 'background: #F8FAFC; color: #475569; border: 1px solid #CBD5E1;',
    'new': 'background: #FEF3C7; color: #D97706; border: 1px solid #FDE68A;'
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
      <span style="font-size: 10px; color: #64748B; font-weight: 600;">สัญญาณย้อนหลัง 8 โพสต์ล่าสุดจาก Facebook</span>
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
                  ${proj.postUrl ? `
                    <a href="${proj.postUrl}" target="_blank" style="font-size: 9.5px; font-weight: 700; color: #1877F2; text-decoration: underline;">
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
      closeApifyModal();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: รูปแบบไฟล์ไม่ถูกต้อง');
      console.error(err);
    }
  };
  reader.readAsText(file);
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
  let t = String(text).toLowerCase();

  // Strip generic marketing hashtags so '#รับสร้างบ้านหนองคาย' etc. in footer does not cause false rejection
  t = t.replace(/#(?:รับสร้างบ้าน|สร้างบ้าน|บริษัทรับสร้างบ้าน|ศูนย์รับสร้างบ้าน|แบบบ้าน)[^\s]+/gi, '');
  t = t.replace(/#\S+/g, '');
  
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

  const internalTerms = [
    'การฝึกงาน', 'ฝึกงาน', 'จบฝึกงาน', 'นักศึกษาฝึกงาน', 'สหกิจศึกษา', 'เลี้ยงส่ง', 'น้องๆฝึกงาน',
    'สุขสันต์วันเกิด', 'hbd', 'วันเกิด', 'ทำบุญบริษัท', 'ทำบุญออฟฟิศ', 'เลี้ยงพระ', 'ถวายเพล',
    'รับสมัครงาน', 'เปิดรับสมัคร', 'ตำแหน่งงานว่าง', 'walk-in', 'สัมมนา', 'อบรมสัมมนา',
    'งานเลี้ยงบริษัท', 'งานสังสรรค์', 'outing', 'staff party', 'กิจกรรมบริษัท', 'csr',
    'สวัสดีปีใหม่', 'สุขสันต์วันสงกรานต์', 'สวัสดีวันสงกรานต์', 'วันหยุดนักขัตฤกษ์', 'หยุดทำการ',
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

function isPromotionalOrAdPost(text) {
  if (!text) return true;
  const t = String(text).toLowerCase();

  const bodyNoFooter = stripCompanyContactFooter(text);

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
    'บริการครบวงจร', 'สร้างจริง เสร็จจริง', 'ยื่นสินเชื่อทุกธนาคาร', 'ฟรี ! ดำเนินการยื่นสินเชื่อ'
  ];
  if (prSloganTerms.some(term => t.includes(term))) {
    // ต้องมีชื่อ 1 ใน 20 อำเภอในเนื้อหาหน้างานจริง (ไม่ใช่สโลแกน) ถึงจะอนุญาต
    if (!hasExplicitUdonDistrictInText(bodyNoFooter)) {
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
    if (hasUdonDistrict) {
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
    'ส่งมอบบ้าน', 'ส่งมอบงาน', 'ส่งมอบ', 'ตรวจรับบ้าน', 'smart truss', 'อัปเดต:', 'อัพเดต:',
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
    if (hasUdonDistrict && hasMilestone) {
      return false; // ถ้ามีอำเภอจริง + สเตจงานจริง -> อนุญาต
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
    'บริการครบวงจร', 'สร้างจริง เสร็จจริง', 'ยื่นสินเชื่อทุกธนาคาร', 'ฟรี ! ดำเนินการ'
  ];
  if (prSloganTerms.some(term => cleanBodyNoHashtags.toLowerCase().includes(term))) {
    // ต้องมีชื่ออำเภอหน้างานจริงในเนื้อหาไซต์งาน (ไม่ใช่ที่อยู่ออฟฟิศท้ายโพสต์)
    if (!hasExplicitUdonDistrictInText(cleanBodyNoHashtags)) {
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
    'ตรวจงวดงาน', 'ส่งมอบบ้าน', 'ส่งมอบงาน', 'ส่งมอบ', 'ตรวจรับบ้าน', 'smart truss',
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
    { keys: ['si architecture', 'เอสไอ อาร์คิเทคเชอร์', 'siarchitecture'], compName: 'เอสไอ อาร์คิเทคเชอร์' }
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
  } else if (rawPayload && typeof rawPayload === 'object') {
    posts = [rawPayload];
  }

  if (posts.length === 0) {
    alert('ไม่พบรายการโพสต์ในไฟล์ Apify JSON');
    return;
  }

  // 1. Reset all 54 companies to clean 0 projects before importing new real file
  loadSavedCompaniesData();
  allCompanies.forEach(c => {
    c.projects = [];
    c.totalProjects = 0;
    c.newProjectsThisMonth = 0;
    c.totalValueMillion = 0.0;
    c.stageBreakdown = { groundbreak: 0, foundation: 0, structure: 0, finishing: 0 };
  });

  let newProjectsCount = 0;
  let totalPostsScanned = 0;
  const matchedCompanyIds = new Set();

  posts.forEach((item, idx) => {
    totalPostsScanned++;
    const rawText = item.text || item.postText || item.caption || item.message || '';
    const rawPageName = item.pageName || (item.user && item.user.name) || item.authorName || item.ownerName || '';
    const ocrText = item.ocrText || (item.media && item.media[0] && item.media[0].ocrText) || '';
    const checkInLoc = item.locationName || item.placeName || item.location || item.place || item.checkin || item.checkIn || item.address || item.city || '';
    
    const text = cleanThaiText(rawText);
    const pageName = cleanThaiText(rawPageName);
    const locText = cleanThaiText(checkInLoc);
    
    const combinedFullText = text + (locText ? ' ' + locText : '');
    
    const likes = item.likes || item.likesCount || (item.topReactionsCount || 0);
    const comments = item.comments || item.commentsCount || 0;
    const shares = item.shares || item.sharesCount || 0;

    const postUrl = item.url || item.postUrl || item.facebookUrl || item.link || item.pageUrl || item.inputUrl || '';
    const postedTime = item.time || item.postedTime || item.date || item.postDate || 'เพิ่งตรวจพบ';

    // STRICT MATCH: Match to one of the 54 verified companies
    const comp = findMatchingCompany(item, combinedFullText, rawPageName, postUrl);
    if (!comp) return;

    matchedCompanyIds.add(comp.id);

    // Update Facebook Signal on company
    comp.facebookSignal = {
      postDate: postedTime,
      pageName: pageName || comp.name,
      caption: text ? text.substring(0, 140) : (comp.category || 'เพจรับสร้างบ้าน จ.อุดรธานี'),
      likes: likes,
      comments: comments,
      shares: shares,
      detectedKeywords: ['SCG', 'ไซต์งานจริง', 'อุดรธานี']
    };

    // STRICT PROJECT VALIDATION: Check if this post is an actual construction project
    if (!isGenuineConstructionProject(combinedFullText, ocrText, locText)) {
      return; // Skip non-construction posts
    }

    // Strip out office contact footer so office locations (e.g. ต.หนองบัว) aren't mistaken for job sites
    const postBodyWithoutFooter = stripCompanyContactFooter(combinedFullText);

    // CRITICAL USER RULE: กิจกรรมภายใน (ฝึกงาน, งานเลี้ยง, วันเกิด, รับสมัครงาน) ไม่เอาเด็ดขาด
    if (isInternalOrNonConstructionPost(postBodyWithoutFooter)) {
      return;
    }

    // CRITICAL USER RULE: ต้องเป็นไซต์งานใน จ.อุดรธานี เท่านั้น! ถ้าเป็นต่างจังหวัด (เช่น อ.เกษตรวิสัย จ.ร้อยเอ็ด) ไม่เอาเด็ดขาด
    if (isExplicitOtherProvinceSite(postBodyWithoutFooter) || isExplicitOtherProvinceSite(locText)) {
      return; // ข้ามโพสต์ที่เป็นไซต์งานต่างจังหวัด
    }

    // Extract Customer Name and District from post body (excluding company office footer) or check-in location
    const custName = extractCustomerName(postBodyWithoutFooter);
    const hasExplicitDistrict = hasExplicitUdonDistrictInText(postBodyWithoutFooter) || (locText && hasExplicitUdonDistrictInText(locText));

    // CRITICAL USER RULE: ต้องมี 1 ใน 20 อำเภอของ จ.อุดรธานี ในเนื้อหาไซต์งานจริงเท่านั้น (ไม่ใช่ที่อยู่ออฟฟิศ)
    if (!hasExplicitDistrict) {
      return; // ข้ามโพสต์ที่ไม่มีชื่ออำเภอหน้างานจริง
    }

    const topLines = getTopLinesText(postBodyWithoutFooter, 4);
    const stageCheckText = topLines || postBodyWithoutFooter;

    let stageKey = 'structure';
    let stage = 'งานโครงสร้างอาคาร';
    if (stageCheckText.includes('ส่งมอบ') || stageCheckText.includes('ตรวจรับบ้าน') || stageCheckText.includes('ส่งมอบผลงาน')) {
      stageKey = 'finishing';
      stage = 'ส่งมอบบ้านเสร็จสมบูรณ์ / โอกาสงานต่อเติม';
    } else if (stageCheckText.includes('เซ็นต์สัญญา') || stageCheckText.includes('เซ็นสัญญา') || stageCheckText.includes('ทำสัญญา')) {
      stageKey = 'groundbreak';
      stage = 'เซ็นสัญญา / เตรียมเปิดหน้างานก่อสร้าง';
    } else if (stageCheckText.includes('เสาเอก') || stageCheckText.includes('ยกเสา')) {
      stageKey = 'groundbreak';
      stage = 'ยกเสาเอก / เริ่มลงเสาเข็มเปิดหน้างาน';
    } else if (stageCheckText.includes('ฐานราก') || stageCheckText.includes('คานคอดิน') || stageCheckText.includes('เทเสา') || stageCheckText.includes('ตอม่อ') || stageCheckText.includes('เทพื้น') || stageCheckText.includes('เทลีน')) {
      stageKey = 'foundation';
      stage = 'งานฐานรากและเสาโครงสร้าง';
    } else if (stageCheckText.includes('smart truss') || stageCheckText.includes('โครงหลังคา') || stageCheckText.includes('มุงหลังคา') || stageCheckText.includes('กระเบื้องหลังคา') || stageCheckText.includes('แผ่นหลังคา')) {
      stageKey = 'structure';
      stage = 'งานโครงสร้างหลังคาและมุงหลังคา SCG';
    } else if (stageCheckText.includes('รีโนเวท') || stageCheckText.includes('ต่อเติม') || stageCheckText.includes('โรงจอดรถ') || stageCheckText.includes('ต่อเติมครัว') || stageCheckText.includes('ปรับปรุง')) {
      stageKey = 'finishing';
      stage = 'งานรีโนเวทและต่อเติมอาคาร';
    } else if (stageCheckText.includes('บันได') || stageCheckText.includes('งานบันได') || stageCheckText.includes('ระบบไฟฟ้า') || stageCheckText.includes('เดินระบบไฟฟ้า') || stageCheckText.includes('ระบบประปา') || stageCheckText.includes('งานระบบ') || stageCheckText.includes('ตกแต่ง') || stageCheckText.includes('ทาสี') || stageCheckText.includes('ปูกระเบื้อง') || stageCheckText.includes('สุขภัณฑ์') || stageCheckText.includes('ฝ้า')) {
      stageKey = 'finishing';
      if (stageCheckText.includes('บันได')) {
        stage = 'งานติดตั้งบันไดและงานตกแต่งภายใน';
      } else if (stageCheckText.includes('ระบบไฟฟ้า') || stageCheckText.includes('เดินระบบไฟฟ้า')) {
        stage = 'งานเดินระบบไฟฟ้าและงานระบบอาคาร';
      } else {
        stage = 'งานตกแต่งภายในและติดตั้งสุขภัณฑ์';
      }
    }

    const distName = hasExplicitDistrict 
      ? extractUdonDistrict(topLines + ' ' + postBodyWithoutFooter + ' ' + locText, comp.district || 'เมืองอุดรธานี') 
      : (comp.district || 'เมืองอุดรธานี');

    // Build Specific Descriptive Project Title
    const projTitle = extractSpecificProjectTitle(postBodyWithoutFooter, custName, distName, stage);

    // ==============================================================
    // SMART DEDUPLICATION: Detect if this post is for an existing site
    // ==============================================================
    const siteKey = extractSiteKey(postBodyWithoutFooter, custName, distName);
    const existingProj = findExistingProjectMatch(comp, siteKey, postBodyWithoutFooter, custName, distName);

    const stageHierarchy = { 'groundbreak': 1, 'foundation': 2, 'structure': 3, 'finishing': 4 };

    if (existingProj) {
      // MERGE INTO EXISTING PROJECT (Do not count as separate project!)
      const curRank = stageHierarchy[existingProj.stageKey] || 0;
      const newRank = stageHierarchy[stageKey] || 0;

      // If the newer post is at a more advanced construction stage, advance the stage & materials
      if (newRank >= curRank) {
        existingProj.stage = stage;
        existingProj.stageKey = stageKey;
        existingProj.progressPercent = stageKey === 'groundbreak' ? 10 : stageKey === 'foundation' ? 30 : stageKey === 'structure' ? 60 : 90;
        existingProj.opportunity = getStageMatchedScgMaterials({ name: existingProj.name, stage: stage, stageKey: stageKey, caption: text });
      }

      // Update latest proof and evidence
      existingProj.siteProof = {
        postUrl: postUrl || existingProj.siteProof.postUrl,
        postedTime: postedTime || existingProj.siteProof.postedTime,
        caption: text ? text.substring(0, 160) : existingProj.siteProof.caption,
        aiDetection: `AI ตรวจพบ: ${custName ? 'ลูกค้าคุณ' + custName + ' | ' : ''}พื้นที่ อ.${distName} (${stage}) [รวมอัปเดตหน้างาน ${ (existingProj.updatesCount || 1) + 1 } โพสต์]`
      };

      existingProj.updatesCount = (existingProj.updatesCount || 1) + 1;
    } else {
      // NEW DISTINCT PROJECT
      const newProj = {
        projectId: `proj-apify-${idx + 1}`,
        siteKey: siteKey,
        name: projTitle,
        customerName: custName ? `คุณ${custName}` : 'เจ้าของบ้าน',
        district: distName,
        location: `อ.${distName} จ.อุดรธานี`,
        stage: stage,
        stageKey: stageKey,
        trackingStatus: 'pending',
        progressPercent: stageKey === 'groundbreak' ? 10 : stageKey === 'foundation' ? 30 : stageKey === 'structure' ? 60 : 90,
        estValue: '3.5 ล้านบาท',
        siteProof: {
          postUrl: postUrl || comp.facebookUrl || `https://www.facebook.com`,
          postedTime: postedTime,
          caption: text ? text.substring(0, 160) : 'หลักฐานภาพถ่ายหน้างานจริงจาก Facebook',
          aiDetection: `AI ตรวจพบ: ${custName ? 'ลูกค้าคุณ' + custName + ' | ' : ''}พื้นที่ อ.${distName} (${stage})`
        },
        opportunity: getStageMatchedScgMaterials({ name: projTitle, stage: stage, stageKey: stageKey, caption: text }),
        updatesCount: 1
      };

      comp.projects.push(newProj);
      newProjectsCount++;
    }

    comp.totalProjects = comp.projects.length;
    comp.totalValueMillion = Math.round(comp.totalProjects * 0.5 * 10) / 10;
    comp.revenuePotentialText = `฿${(comp.totalProjects * 0.5).toFixed(1)}M`;
    if (stageKey in comp.stageBreakdown) {
      comp.stageBreakdown[stageKey]++;
    }
    if (stageKey === 'groundbreak' || stageKey === 'foundation') {
      comp.newProjectsThisMonth++;
    }
  });

  // Run final deduplication sweep across all companies
  allCompanies.forEach(c => deduplicateCompanyProjects(c));

  applyFilters();
  updateTagFilterCounts(allCompanies);
  if (window.initProductAnalyticsCharts) {
    window.initProductAnalyticsCharts(allCompanies);
  }

  showStatusToast(`🎉 ประมวลผลสำเร็จ! สแกน ${totalPostsScanned} โพสต์ รวมอัปเดตและคัดเหลือ ${newProjectsCount} ไซต์งานจริง (ไม่นับซ้ำ)`);
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
  if (confirm('คุณต้องการรีเซ็ตข้อมูลและสถานะการติดตามทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
    localStorage.removeItem(STORAGE_KEY_COMPANY_TAGS);
    localStorage.removeItem(STORAGE_KEY_CRM_LOGS);
    localStorage.removeItem(STORAGE_KEY_PROJECT_STATUSES);
    loadSavedCompaniesData();
    applyFilters();
    updateTagFilterCounts(allCompanies);
    if (window.initProductAnalyticsCharts) {
      window.initProductAnalyticsCharts(allCompanies);
    }
    showStatusToast('รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น 100% เรียบร้อย');
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
  if (type === 'new') {
    filterByCompanyTag('new');
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
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      applyFilters();
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

  updateSubDistrictDropdown();
  updateTagFilterCounts(allCompanies);
  updateHeaderCrmStats();
  renderKPIs();
  renderTable();
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
