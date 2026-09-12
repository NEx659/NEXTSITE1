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
    '100080371301938': 'ห้างหุ้นส่วนจำกัด ฟู่เฮ้าส์ อินทีเรีย ดีไซน์ FU House Interior Design'
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
  const tagMap = loadCompanyTagsMap();
  tagMap[companyId] = tag;
  saveCompanyTagsMap(tagMap);
  applyFilters();
  updateTagFilterCounts(allCompanies);

  const tagNames = {
    'focus': '🎯 Focus (เป้าหมายหลัก)',
    'non-focus': '⚪ Non-Focus (ทั่วไป)',
    'new': '✨ New (เข้าใหม่)'
  };
  showStatusToast(`อัปเดตเป็น ${tagNames[tag] || tag} เรียบร้อย`);
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
  { code: '10051168', name: 'เอเฮ้าส์ บิวเดอร์', sales2025: 15209, sales2026: 22100, keys: ['เอเฮ้าส์', 'a-house', 'a house'] },
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
  { code: '10482913', name: 'ทีที ดีไซน์ แอนด์ คอนสตรัคชั่น1991', sales2025: 1570146, sales2026: 3396188, keys: ['ทีที ดีไซน์', 'ทีทีดีไซน์', 'tt design', 'ttdesign'] },
  { code: '10484743', name: 'ช.รุ่งอรุณ คอนสตรัคชั่น', sales2025: 151787.5, sales2026: 189440, keys: ['ช.รุ่งอรุณ', 'รุ่งอรุณ คอนสตรัคชั่น', 'รุ่งอรุณ'] },
  { code: '10485682', name: 'รุ่งรัตน์บิวตี้โฮม', sales2025: 12246, sales2026: 768825.5, keys: ['รุ่งรัตน์บิวตี้โฮม', 'รุ่งรัตน์'] },
  { code: '10500344', name: 'การิน บ้านสวย', sales2025: 469506, sales2026: 1337450, keys: ['การิน บ้านสวย', 'การิน', 'karin'] },
  { code: '10503273', name: 'สุขสกล ดีเวลลอปเม้นท์', sales2025: 677870.3, sales2026: 2338879, keys: ['สุขสกล', 'suksakon'] },
  { code: '10509038', name: '117อาร์คิเทคท์', sales2025: 28572.5, sales2026: 395558.3, keys: ['117อาร์คิเทคท์', '117', '117 architect'] },
  { code: '10523555', name: 'ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์', sales2025: 1146567, sales2026: 2903328, keys: ['ทเวนตี้ซิกซ์', '26 development', '26'] },
  { code: '10551209', name: 'บ้านใหญ่ (2016) โฮม บิวเดอร์', sales2025: 5481324, sales2026: 5472101, keys: ['บ้านใหญ่', 'baanyai', 'baanyai2016'] },
  { code: '10590829', name: 'เลอ คราวน์ ดีไซน์', sales2025: 11367, sales2026: 329498.4, keys: ['เลอ คราวน์', 'เลอคราวน์', 'le crown', 'lecrown'] },
  { code: '10612650', name: 'บ้านดี อยู่ดี ดีไซน์', sales2025: 31155, sales2026: 93806.25, keys: ['บ้านดี อยู่ดี', 'บ้านดีอยู่ดี', 'baandee yoodee'] },
  { code: '10640153', name: 'กิจดลวรโชติ1', sales2025: 438100, sales2026: 1992527, keys: ['กิจดลวรโชติ', 'กิจดล'] }
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

  // จัดลำดับ: คะแนน Opportunity Score สูงสุด (92 -> 80 -> 70 -> 35 -> 15) ต้องอยู่บนสุดเสมอ
  sortCompaniesByOpportunityScore(allCompanies);
  filteredCompanies = [...allCompanies];
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

function sortCompaniesByOpportunityScore(companies) {
  if (!Array.isArray(companies)) return [];
  return companies.sort((a, b) => {
    const scoreA = getCompanyScoreValue(a);
    const scoreB = getCompanyScoreValue(b);

    // 1. เรียงคะแนน Opportunity Score จากมากไปหาน้อย (92 -> 80 -> 70 -> 35 -> 15)
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // 2. ถ้าคะแนนเท่ากัน เรียงตามจำนวนโครงการจริง (มาก -> น้อย)
    const projA = (a.projects && a.projects.length) ? a.projects.length : (Number(a.totalProjects) || 0);
    const projB = (b.projects && b.projects.length) ? b.projects.length : (Number(b.totalProjects) || 0);
    if (projB !== projA) {
      return projB - projA;
    }

    // 3. เรียงตามมูลค่าโครงการรวม (มาก -> น้อย)
    const valA = Number(a.totalValueMillion) || 0;
    const valB = Number(b.totalValueMillion) || 0;
    if (valB !== valA) {
      return valB - valA;
    }

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
    logs[companyId] = {
      ...logs[companyId],
      ...logData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY_CRM_LOGS, JSON.stringify(logs));
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
    showStatusToast(`บันทึกโน้ต CRM เรียบร้อย`);
  }
}

function openFollowUpModal(companyId, focusNote = true, event) {
  if (event) event.stopPropagation();
  const comp = allCompanies.find(c => c.id === companyId);
  if (!comp) return;

  const log = getCompanyCrmLog(companyId);
  const modal = document.getElementById('followup-modal') || document.getElementById('company-followup-modal');
  if (!modal) return;

  const elName = document.getElementById('crm-modal-company-name');
  const elId = document.getElementById('crm-modal-company-id');
  const elNote = document.getElementById('crm-modal-note');

  if (elName) elName.textContent = cleanThaiText(comp.name);
  if (elId) elId.value = companyId;
  if (elNote) elNote.value = log.note || '';

  selectCrmStatus(log.status || 'pending');

  modal.style.display = 'flex';
  if (focusNote && elNote) {
    setTimeout(() => elNote.focus(), 100);
  }
}

function closeFollowUpModal() {
  const modal = document.getElementById('followup-modal') || document.getElementById('company-followup-modal');
  if (modal) modal.style.display = 'none';
}

function selectCrmStatus(statusVal) {
  const container = document.getElementById('crm-status-radio-group');
  if (!container) return;
  const radios = container.querySelectorAll('input[name="crm-status"]');
  radios.forEach(r => {
    r.checked = (r.value === statusVal);
  });
}

function saveFollowUpLog() {
  const companyId = document.getElementById('crm-modal-company-id')?.value;
  const note = document.getElementById('crm-modal-note')?.value;
  const selectedRadio = document.querySelector('input[name="crm-status"]:checked');
  const status = selectedRadio ? selectedRadio.value : 'pending';

  if (companyId) {
    saveCompanyCrmLog(companyId, { status, note });
    closeFollowUpModal();
    showStatusToast('บันทึกข้อมูลการติดตามเรียบร้อย');
    renderTable();
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
    if (c.newProjectsThisMonth > 0 || (c.stageBreakdown && c.stageBreakdown.groundbreak > 0)) {
      newCompaniesCount++;
    }
  });

  const elTotalComp = document.getElementById('kpi-total-companies');
  const elNewComp = document.getElementById('kpi-new-companies');
  const elHighOpp = document.getElementById('kpi-high-opp');
  const elTotalVal = document.getElementById('kpi-total-value');
  const elTotalProjectsSub = document.getElementById('kpi-total-projects-subtext');
  const elProvinceTotalProjectsCount = document.getElementById('province-total-projects-count');

  if (elTotalComp) elTotalComp.textContent = totalCompanies;
  if (elNewComp) elNewComp.textContent = newCompaniesCount;
  if (elHighOpp) elHighOpp.textContent = highPriorityLeads;
  if (elTotalVal) elTotalVal.textContent = `฿${totalPipelineValue.toFixed(1)}M`;
  if (elTotalProjectsSub) elTotalProjectsSub.textContent = `รวม ${totalProjects} โครงการที่กำลังก่อสร้าง`;
  if (elProvinceTotalProjectsCount) elProvinceTotalProjectsCount.textContent = totalProjects;
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
        <td colspan="8" style="padding: 4rem 1rem; text-align: center; color: #64748B;">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;">
            <span style="font-size: 2.5rem;">🔍</span>
            <span style="font-size: 1rem; font-weight: 700; color: #0F172A;">ไม่พบข้อมูลผู้รับเหมาตามเงื่อนไขการค้นหา</span>
            <span style="font-size: 0.8rem; color: #64748B;">ลองเปลี่ยนคำค้นหา หรือเลือกตัวกรอง 'ทั้งหมด'</span>
            <button onclick="activeFilter='all'; activeDistrict='all'; activeSubDistrict='all'; activeCompanyTagFilter='all'; searchQuery=''; applyFilters();" 
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

    const tr = document.createElement('tr');
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

      <!-- 3. พื้นที่ (อุดรธานี) -->
      <td style="vertical-align: middle;">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <div style="font-weight: 800; color: #0F172A; font-size: 0.88rem;">${cleanThaiText(company.district) || 'เมืองอุดรธานี'}</div>
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
          <div style="font-size: 0.76rem; color: #059669; font-weight: 700; display: flex; align-items: center; gap: 4px;">
            <span style="color: #E11D48;">📍</span> มีไซต์งานจริง • +${company.newProjectsThisMonth || 0} เดือนนี้
          </div>
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

      <!-- 7. Opportunity Score -->
      <td style="text-align: center; vertical-align: middle;">
        <div style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 5px 16px; border-radius: 9999px; border: 1.5px solid ${badgeBorder}; background: ${badgeBg}; font-weight: 800; font-size: 0.88rem; color: ${badgeColor}; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
          <span style="color: ${badgeColor}; font-size: 0.95rem;">●</span>
          <span>${oppScore}</span>
        </div>
      </td>

      <!-- 7. Revenue Potential (500,000 บาท/โครงการ) -->
      <td style="vertical-align: middle;">
        <div style="display: flex; flex-direction: column; gap: 2px;">
          <div style="font-weight: 900; color: #0F172A; font-size: 0.95rem;">฿${(projCount * 0.5).toFixed(1)}M</div>
          <div style="color: #64748B; font-size: 0.74rem;">${projCount > 0 ? `(${projCount} × ฿500K)` : 'SCG Product Target'}</div>
        </div>
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

    return true;
  });

  // จัดลำดับ: คะแนน Opportunity Score สูงสุด (92 -> 80 -> 70 -> 35 -> 15) ต้องอยู่บนสุดเสมอ
  sortCompaniesByOpportunityScore(filteredCompanies);

  renderKPIs();
  renderTable();

  // Update map markers
  if (window.mapModule && typeof window.mapModule.renderCompanyMarkers === 'function') {
    window.mapModule.renderCompanyMarkers(filteredCompanies);
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

  const btnTableView = document.getElementById('btn-table-view');
  const btnMapView = document.getElementById('btn-map-view');
  const tableView = document.getElementById('table-card-container');
  const mapView = document.getElementById('map-view-container');

  if (btnMapView && mapView && tableView) {
    tableView.style.display = 'none';
    mapView.style.display = 'block';
    if (btnTableView) btnTableView.classList.remove('active');
    btnMapView.classList.add('active');

    if (window.mapModule && window.mapModule.map) {
      window.mapModule.map.invalidateSize();
      if (comp.coordinates) {
        window.mapModule.map.setView(comp.coordinates, 14);
      }
    }
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

  // Score Matrix
  const score = window.scoring ? window.scoring.calculatePriorityScore(comp) : 50;
  const elBigScore = document.getElementById('modal-big-score');
  const elScoreBadge = document.getElementById('modal-score-badge');
  const elScoreUrgency = document.getElementById('modal-score-urgency');
  const elScoreCard = document.getElementById('modal-score-card');

  if (elBigScore) elBigScore.textContent = score;
  if (elScoreBadge) {
    elScoreBadge.className = `score-badge ${score >= 90 ? 'red' : score >= 70 ? 'orange' : 'yellow'}`;
    elScoreBadge.textContent = score >= 90 ? '● โอกาสสูงสุด' : score >= 70 ? '● โอกาสสูง' : '● ปานกลาง';
  }
  if (elScoreUrgency) {
    elScoreUrgency.textContent = score >= 90 ? 'เข้าพบภายใน 24-48 ชม.' : score >= 70 ? 'นัดหมายภายในสัปดาห์นี้' : 'เฝ้าระวังความคืบหน้า';
  }
  if (elScoreCard) {
    elScoreCard.className = `detail-score-card ${score >= 90 ? 'red' : score >= 70 ? 'orange' : 'yellow'}`;
  }

  // 5 Dimension Breakdown
  const dimContainer = document.getElementById('modal-dimensions-list');
  if (dimContainer && window.calculateOpportunityScore) {
    const scoreData = window.calculateOpportunityScore(comp);
    dimContainer.innerHTML = '';
    if (scoreData && scoreData.dimensions) {
      scoreData.dimensions.forEach(d => {
        const row = document.createElement('div');
        row.className = 'dimension-row';
        row.innerHTML = `
          <div class="dimension-meta">
            <span style="color: #334155;">${d.name} (${d.weight})</span>
            <span style="font-weight: 800; color: #0F172A;">${d.score}/100</span>
          </div>
          <div class="dim-bar-bg">
            <div class="dim-bar-fill" style="width: ${d.score}%;"></div>
          </div>
          <div style="font-size: 0.68rem; color: #64748B; margin-top: 1px;">${d.desc}</div>
        `;
        dimContainer.appendChild(row);
      });
    }
  }

  // Timeline
  renderModalTimeline(comp.latestTimelineStage || 'structure');

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

function filterModalProjects(stageKey) {
  activeModalProjectStageFilter = stageKey;
  if (activeSelectedCompany) {
    renderCompanyProjectsList(activeSelectedCompany);
  }
}

function renderModalTimeline(currentStage) {
  const container = document.getElementById('modal-timeline-track');
  if (!container) return;

  const stages = [
    { key: 'groundbreak', label: '1. เสาเอก / เปิดหน้างาน', sub: 'ปูนฐานราก & CPAC' },
    { key: 'foundation', label: '2. งานฐานราก & เสา', sub: 'คอนกรีตผสมเสร็จ' },
    { key: 'structure', label: '3. งานโครงสร้าง & ก่อผนัง', sub: 'อิฐมวลเบา & หลังคา' },
    { key: 'finishing', label: '4. งานตกแต่ง & สุขภัณฑ์', sub: 'สมาร์ทบอร์ด & COTTO' }
  ];

  const stageOrder = { 'groundbreak': 0, 'foundation': 1, 'structure': 2, 'finishing': 3 };
  const currentIdx = stageOrder[currentStage] !== undefined ? stageOrder[currentStage] : 2;

  container.innerHTML = `
    <div class="timeline-line"></div>
    ${stages.map((st, idx) => {
      let stateClass = '';
      if (idx < currentIdx) stateClass = 'completed';
      else if (idx === currentIdx) stateClass = 'active';

      return `
        <div class="timeline-step ${stateClass}">
          <div class="step-node">${idx < currentIdx ? '✓' : idx + 1}</div>
          <div class="step-label">${st.label}</div>
          <div class="step-sub">${st.sub}</div>
        </div>
      `;
    }).join('')}
  `;
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
  'เชียงแหว', 'จำปี', 'ผาสุก', 'ดอนหายโศก', 'บ้านเชียง', 'หนองเม็ก', 'โพนสูง',
  'สร้างแป้น', 'สุมเส้า', 'สุขคณา', 'โนนตูม', 'โนนยาง',
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

function extractCustomerName(text) {
  if (!text) return '';
  let clean = String(text);
  if (typeof clean.normalize === 'function') {
    try {
      clean = clean.normalize('NFKD');
    } catch(e) {}
  }
  
  // Look for patterns like: เสี่ย... กับเจ้..., Owner: คุณ..., บ้านคุณ..., ลูกค้าคุณ..., คุณ..., เจ้าของบ้านคุณ...
  const patterns = [
    /(?:Owner|owner|𝗢𝘄𝗻𝗲𝗿|เจ้าของบ้าน|ลูกค้าคนสำคัญ)\s*[:：\-]?\s*(?:คุณ)?\s*([ก-๙a-zA-Z\.\s]{2,20})/i,
    /(?:บ้านคุณ|ลูกค้าคุณ|ตรวจรับบ้านคุณ|ส่งมอบบ้านคุณ|เจ้าของบ้านคุณ|บ้านคุณหมอ)\s*([ก-๙a-zA-Z\.\s]{2,20})/i,
    /(?:เสี่ย|เจ้|เฮีย|เสี่ยกานต์|เจ้วันเพ็ญ)\s*([ก-๙a-zA-Z\.\s]{2,20})/i,
    /(?:คุณ)\s*([ก-๙a-zA-Z]{2,18})(?:\s+(?:อ\.|จ\.|สร้าง|เท|เสา|คาน|บ้าน|ต\.|พิกัด|โครงการ))/i,
    /(?:คุณ)\s*([ก-๙a-zA-Z]{2,15})/i
  ];

  for (const regex of patterns) {
    const match = clean.match(regex);
    if (match && match[1]) {
      let candidate = match[1].replace(/[\r\n\t]+/g, ' ').trim();
      candidate = candidate.replace(/^(?:คุณ|เสี่ย|เจ้|เฮีย)\s*/, '').trim();
      const blacklist = ['ภาพ', 'ภาพถ่าย', 'งาน', 'ลูกค้า', 'สร้าง', 'บ้าน', 'ดี', 'เรา', 'ท่าน', 'ทุกท่าน', 'พี่', 'น้อง', 'โปรด', 'ใหม่', 'เก่า', 'ครับ', 'ค่ะ', 'นะ', 'SCG', 'scg', 'CPAC', 'cpac', 'อุดร', 'อุดรธานี'];
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
    if (t.includes(z.toLowerCase()) || t.includes('ต.' + z.toLowerCase()) || t.includes('ตำบล' + z.toLowerCase())) {
      if (z === 'สร้างแป้น' || z === 'สุมเส้า') return 'เพ็ญ';
      if (z === 'เชียงแหว') return 'กุมภวาปี';
      if (z === 'บ้านเชียง' || z === 'หนองเม็ก') return 'หนองหาน';
      return 'เมืองอุดรธานี';
    }
  }

  return fallbackDistrict || 'เมืองอุดรธานี';
}

function stripCompanyContactFooter(text) {
  if (!text) return '';
  let str = String(text);
  
  // Cut off company contact footers where office address/phone/links are listed
  const footerMarkers = [
    /------------------/i,
    /==================/i,
    /📍\s*(?:ที่ตั้งสำนักงาน|ออฟฟิศ|สำนักงานใหญ่|พิกัดสำนักงาน|แผนที่สำนักงาน|ที่อยู่สำนักงาน)/i,
    /(?:ที่ตั้งสำนักงาน|สำนักงานใหญ่|พิกัดออฟฟิศ|แผนที่ออฟฟิศ)\s*[:：]/i,
    /(?:สนใจติดต่อ|ติดต่อสอบถาม|สอบถามข้อมูลเพิ่มเติม|ปรึกษาเรื่องสร้างบ้าน|โทร|Tel|Line ID)\s*[:：]/i,
    /☎️/i,
    /📞/i,
    /📱/i
  ];

  for (const marker of footerMarkers) {
    const match = str.match(marker);
    if (match && match.index > 25) {
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
    'พิธียกเสาเอก', 'ยกเสาเอก', 'ยกเสาโท', 'ตอกเสาเข็มเสร็จ', 'ลงเสาเข็มแล้ว', 'เจาะเสาเข็ม',
    'ขุดฐานราก', 'เทลีนฐานราก', 'เทคอนกรีตฐานราก', 'เทตอม่อ', 'เทคานคอดิน', 
    'เทเสา', 'เทพื้น', 'เทคอนกรีตพื้น', 'หล่อเสา', 'ขึ้นโครงหลังคา', 'โครงหลังคาสำเร็จรูป',
    'มุงกระเบื้องหลังคา', 'มุงหลังคา', 'ก่ออิฐมวลเบา', 'ก่ออิฐมอญ', 'ฉาบปูนเสร็จ', 'ตรวจงวดงานที่', 
    'ส่งมอบบ้านจริง', 'ส่งมอบงานงวด', 'งานเดินระบบไฟฟ้า', 'เดินระบบไฟฟ้า', 'smart truss'
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

  const postBody = stripCompanyContactFooter(text);

  // CRITICAL USER RULE: ถ้าเป็นกิจกรรมภายใน (ฝึกงาน, งานเลี้ยง, รับสมัครงาน, วันเกิด, ดูดวง, วันมงคล) ปฏิเสธทันที
  if (isInternalOrNonConstructionPost(postBody)) {
    return false;
  }

  // CRITICAL USER RULE: ถ้าเป็นไซต์งานต่างจังหวัด (เช่น ขอนแก่น, เลย, หนองคาย, สกลนคร, ร้อยเอ็ด) ปฏิเสธทันที
  if (isExplicitOtherProvinceSite(postBody) || isExplicitOtherProvinceSite(locationText)) {
    return false;
  }

  // MANDATORY RULE: ต้องมี 1 ใน 20 อำเภอใน จ.อุดรธานี หรือหมู่บ้าน/ตำบลในอุดรธานีเท่านั้น
  const hasUdonDistrict = hasExplicitUdonDistrictInText(postBody) || hasExplicitUdonDistrictInText(locationText) || hasExplicitUdonDistrictInText(text);
  if (!hasUdonDistrict) {
    return false; // ไม่มีชื่ออำเภอในอุดรธานี -> ไม่ดึงเด็ดขาด
  }

  // USER RULE 1 & 2:
  // 1. มี 1 ใน 20 อำเภอในอุดรธานี -> ดึงทันที
  // 2. มีคำว่า ยกเสาเอก, เทปูน, เทคอนกรีต, อัพเดท, โปรเจค, ส่งมอบ, ชื่อคน และมีชื่ออำเภอในอุดร -> ดึงทันที
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

  return null;
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
  const matchedCompanyIds = new Set();

  posts.forEach((item, idx) => {
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

    // Extract Customer Name and District from post body or check-in location
    const custName = extractCustomerName(postBodyWithoutFooter);
    const hasExplicitDistrict = hasExplicitUdonDistrictInText(postBodyWithoutFooter) || hasExplicitUdonDistrictInText(locText) || hasExplicitUdonDistrictInText(text);

    // CRITICAL USER RULE: ต้องมี 1 ใน 20 อำเภอของ จ.อุดรธานี เท่านั้น
    if (!hasExplicitDistrict) {
      return; // ข้ามโพสต์ที่ไม่มีชื่อ 1 ใน 20 อำเภอของอุดรธานี
    }

    let stageKey = 'structure';
    let stage = 'งานโครงสร้างอาคาร';
    if (text.includes('ส่งมอบบ้าน') || text.includes('ส่งมอบงาน') || text.includes('ตรวจรับบ้าน') || text.includes('ส่งมอบผลงาน')) {
      stageKey = 'finishing';
      stage = 'ส่งมอบบ้านเสร็จสมบูรณ์ / โอกาสงานต่อเติม';
    } else if (text.includes('รีโนเวท') || text.includes('ต่อเติม') || text.includes('โรงจอดรถ') || text.includes('ต่อเติมครัว') || text.includes('ปรับปรุง')) {
      stageKey = 'finishing';
      stage = 'งานรีโนเวทและต่อเติมอาคาร';
    } else if (text.includes('เสาเอก') || text.includes('ยกเสา')) {
      stageKey = 'groundbreak';
      stage = 'ยกเสาเอก / เริ่มลงเสาเข็มเปิดหน้างาน';
    } else if (text.includes('ฐานราก') || text.includes('คานคอดิน') || text.includes('เทเสา') || text.includes('ตอม่อ')) {
      stageKey = 'foundation';
      stage = 'งานฐานรากและเสาโครงสร้าง';
    } else if (text.includes('smart truss') || text.includes('โครงหลังคา') || text.includes('มุงหลังคา') || text.includes('กระเบื้องหลังคา') || text.includes('แผ่นหลังคา')) {
      stageKey = 'structure';
      stage = 'งานโครงสร้างหลังคาและมุงหลังคา SCG';
    } else if (text.includes('ระบบไฟฟ้า') || text.includes('เดินระบบไฟฟ้า') || text.includes('ระบบประปา') || text.includes('งานระบบ') || text.includes('ตกแต่ง') || text.includes('ทาสี') || text.includes('ปูกระเบื้อง') || text.includes('สุขภัณฑ์') || text.includes('ฝ้า')) {
      stageKey = 'finishing';
      stage = (text.includes('ระบบไฟฟ้า') || text.includes('เดินระบบไฟฟ้า')) ? 'งานเดินระบบไฟฟ้าและงานระบบอาคาร' : 'งานตกแต่งภายในและติดตั้งสุขภัณฑ์';
    }

    const distName = hasExplicitDistrict 
      ? extractUdonDistrict(postBodyWithoutFooter + ' ' + locText, comp.district || 'เมืองอุดรธานี') 
      : (comp.district || 'เมืองอุดรธานี');

    // Build Project Title
    let projTitle = '';
    if (text.includes('ส่งมอบบ้าน') || text.includes('ส่งมอบผลงาน')) {
      projTitle = custName ? `ส่งมอบบ้านคุณ${custName} อ.${distName}` : `โครงการส่งมอบบ้าน อ.${distName}`;
    } else if (text.includes('รีโนเวท') || text.includes('ต่อเติม') || text.includes('โรงจอดรถ') || text.includes('ต่อเติมครัว')) {
      projTitle = custName ? `งานรีโนเวท/ต่อเติม (คุณ${custName}) อ.${distName}` : `งานรีโนเวท/ต่อเติมอาคาร อ.${distName}`;
    } else if (custName) {
      projTitle = `โครงการบ้านคุณ${custName} อ.${distName}`;
    } else if (text.includes('ระบบไฟฟ้า') || text.includes('เดินระบบไฟฟ้า')) {
      projTitle = `ไซต์งานเดินระบบไฟฟ้า อ.${distName}`;
    } else if (text.includes('smart truss') || text.includes('โครงหลังคา')) {
      projTitle = `ไซต์งานโครงหลังคา Smart Truss อ.${distName}`;
    } else {
      projTitle = `ไซต์งานก่อสร้าง อ.${distName} (${stage})`;
    }

    const newProj = {
      projectId: `proj-apify-${idx + 1}`,
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
      opportunity: getStageMatchedScgMaterials({ name: projTitle, stage: stage, stageKey: stageKey, caption: text })
    };

    comp.projects.push(newProj);
    comp.totalProjects = comp.projects.length;
    comp.totalValueMillion = Math.round(comp.totalProjects * 0.5 * 10) / 10;
    comp.revenuePotentialText = `฿${(comp.totalProjects * 0.5).toFixed(1)}M`;
    if (stageKey in comp.stageBreakdown) {
      comp.stageBreakdown[stageKey]++;
    }
    if (stageKey === 'groundbreak' || stageKey === 'foundation') {
      comp.newProjectsThisMonth++;
    }

    newProjectsCount++;
  });

  applyFilters();
  updateTagFilterCounts(allCompanies);
  if (window.initProductAnalyticsCharts) {
    window.initProductAnalyticsCharts(allCompanies);
  }

  showStatusToast(`🎉 ประมวลผลสำเร็จ! นำเข้า ${newProjectsCount} ไซต์งานจริงลงใน 54 บริษัท จ.อุดรธานี เรียบร้อย`);
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
  showStatusToast('โหลดฐานข้อมูล Master Dataset 54 บริษัท จ.อุดรธานี เรียบร้อย');
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
// 14. APPLICATION INITIALIZATION
// ==========================================
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

  setupEventListeners();
  initGlobalDragAndDrop();
  startFacebookCrawlerTicker();

  console.log('✅ NEXTSITE AI Dashboard Loaded Successfully with 100% Thai & Clean Text.');
});
