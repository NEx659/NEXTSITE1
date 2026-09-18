/**
 * NEXTSITE AI - SCG Product Analytics & Summary Charts Engine
 * แสดงสรุปยอดสินค้าในหน้าแรก และเปิดดูกราฟเจาะลึกเมื่อคลิกรายสินค้า
 */

let cachedProductTotals = {};
let cachedStageDemand = {};
let cachedAllCompanies = [];
let productModalChartInstance = null;

const scgProductCategoriesConfig = {
  cementMortar: {
    key: 'cementMortar',
    name: 'ปูนซีเมนต์ และมอร์ตาร์',
    icon: '🏗️',
    color: '#D9251D',
    weight: 0.22,
    relevantStages: ['groundbreak', 'foundation', 'structure', 'finishing'],
    stageDesc: 'ฐานราก • เสา-คาน • ก่อฉาบ',
    unit: 'ไซต์งาน',
    subItems: [
      'ปูนซีเมนต์ปอร์ตแลนด์',
      'ปูนงานโครงสร้าง SCG',
      'ปูนงานหล่อคอนกรีต',
      'ปูนฉาบ / ปูนก่อ',
      'กาวซีเมนต์ปูกระเบื้องไทล์บอนด์',
      'ยาแนวกระเบื้อง',
      'ปูนปรับระดับพื้น'
    ],
    searchKeywords: ['ปูน', 'มอร์ตาร์', 'ซีเมนต์', 'ปอร์ตแลนด์', 'ปูนฉาบ', 'ปูนก่อ', 'กาวซีเมนต์', 'ยาแนว', 'ปรับระดับ']
  },
  concreteProducts: {
    key: 'concreteProducts',
    name: 'คอนกรีต และผลิตภัณฑ์คอนกรีต',
    icon: '🚛',
    color: '#0284C7',
    weight: 0.20,
    relevantStages: ['groundbreak', 'foundation', 'structure'],
    stageDesc: 'เปิดหน้างาน • ตอกเสาเข็ม • เทพื้น',
    unit: 'ไซต์งาน',
    subItems: [
      'CPAC คอนกรีตผสมเสร็จ',
      'เสาเข็มคอนกรีตอัดแรง',
      'แผ่นพื้นสำเร็จรูป CPAC',
      'คอนกรีตสำเร็จรูป',
      'บล็อกปูพื้น CPAC',
      'รั้วคอนกรีตสำเร็จรูป'
    ],
    searchKeywords: ['cpac', 'คอนกรีต', 'เสาเข็ม', 'แผ่นพื้น', 'รั้วคอนกรีต', 'บล็อกปูพื้น', 'ผสมเสร็จ', 'สำเร็จรูป']
  },
  roofing: {
    key: 'roofing',
    name: 'หลังคา และโครงหลังคา',
    icon: '🏠',
    color: '#EA580C',
    weight: 0.15,
    relevantStages: ['structure'],
    stageDesc: 'ขึ้นโครงหลังคา • มุงกระเบื้อง',
    unit: 'ไซต์งาน',
    subItems: [
      'กระเบื้องหลังคา SCG Prestige / Neustile',
      'กระเบื้องหลังคาเซรามิก Excella',
      'โครงหลังคาสำเร็จรูป C-Truss',
      'แผ่นหลังคาโปร่งแสง Shinkolite',
      'อุปกรณ์ยึดครอบหลังคา Dry Ridge'
    ],
    searchKeywords: ['หลังคา', 'กระเบื้องหลังคา', 'excella', 'prestige', 'neustile', 'ซีแพค', 'shinkolite', 'ไฟเบอร์ซีเมนต์', 'โครงหลังคา']
  },
  wallCeiling: {
    key: 'wallCeiling',
    name: 'ผนัง และฝ้าเพดาน',
    icon: '🧱',
    color: '#CA8A04',
    weight: 0.11,
    relevantStages: ['structure', 'finishing'],
    stageDesc: 'งานก่อผนัง • แผ่นฝ้าเพดาน',
    unit: 'ไซต์งาน',
    subItems: [
      'สมาร์ทบอร์ด SCG (Smartboard)',
      'สมาร์ทวอลล์ (Smart Wall)',
      'อิฐมวลเบา Q-CON',
      'แผ่นยิปซัม SCG / ตราช้าง',
      'ฝ้าชายคาระบายอากาศ',
      'ระบบผนังเบาป้องกันเสียง'
    ],
    searchKeywords: ['สมาร์ทบอร์ด', 'smartboard', 'smart wall', 'ยิปซัม', 'ผนังเบา', 'ฝ้า', 'ชายคา', 'q-con', 'มวลเบา']
  },
  syntheticWood: {
    key: 'syntheticWood',
    name: 'ไม้สังเคราะห์ SCG',
    icon: '🪵',
    color: '#9333EA',
    weight: 0.08,
    relevantStages: ['finishing'],
    stageDesc: 'งานตกแต่ง • ฝ้าชายคา • พื้นไม้',
    unit: 'ไซต์งาน',
    subItems: [
      'SCG SmartWOOD ไม้ฝา',
      'ไม้พื้นสังเคราะห์ SCG D-COR',
      'ไม้เชิงชาย SCG',
      'ไม้ระแนงบังตา / ไม้รั้ว',
      'ไม้บันไดสังเคราะห์'
    ],
    searchKeywords: ['smartwood', 'ไม้สังเคราะห์', 'ไม้พื้น', 'ไม้ฝา', 'เชิงชาย', 'ไม้รั้ว', 'ไม้บันได', 'd-cor']
  },
  insulationAcoustic: {
    key: 'insulationAcoustic',
    name: 'ฉนวน และวัสดุกันเสียง',
    icon: '🛡️',
    color: '#0D9488',
    weight: 0.04,
    relevantStages: ['structure', 'finishing'],
    stageDesc: 'ปูเหนือฝ้า • กันร้อนใต้หลังคา',
    unit: 'ไซต์งาน',
    subItems: [
      'ฉนวนกันความร้อน STAY COOL',
      'ฉนวนกันเสียงและซับเสียง Cylence',
      'แผ่นซับเสียงตกแต่ง Zandera'
    ],
    searchKeywords: ['stay cool', 'ฉนวน', 'กันความร้อน', 'กันเสียง', 'ซับเสียง', 'cylence']
  },
  flooringExterior: {
    key: 'flooringExterior',
    name: 'งานพื้น และตกแต่งภายนอก',
    icon: '🌿',
    color: '#16A34A',
    weight: 0.05,
    relevantStages: ['finishing'],
    stageDesc: 'ทางเดินสวน • บล็อกตกแต่ง',
    unit: 'ไซต์งาน',
    subItems: [
      'บล็อกปูถนน / ทางเดิน SCG',
      'กระเบื้องปูพื้นภายนอก',
      'หญ้าเทียมและอุปกรณ์จัดสวน',
      'ฟาซาดตกแต่งอาคาร'
    ],
    searchKeywords: ['พื้นสมาร์ทวูด', 'ทางเดินสวน', 'ระแนง', 'ฟาซาด', 'ตกแต่งภายนอก', 'ภูมิทัศน์', 'บล็อก']
  },
  steelStructure: {
    key: 'steelStructure',
    name: 'เหล็ก และโครงสร้าง',
    icon: '⚙️',
    color: '#475569',
    weight: 0.07,
    relevantStages: ['groundbreak', 'foundation', 'structure'],
    stageDesc: 'ผูกเหล็กเสา-คาน • โครงสร้าง',
    unit: 'ไซต์งาน',
    subItems: [
      'เหล็กเส้นกลม / ข้ออ้อย มอก.',
      'เหล็กรูปพรรณ / เหล็กกล่อง',
      'ลวดอัดแรง PC Strand',
      'เหล็กชุบกัลวาไนซ์'
    ],
    searchKeywords: ['เหล็ก', 'เหล็กเส้น', 'เหล็กรูปพรรณ', 'เหล็กกล่อง', 'pc strand', 'กัลวาไนซ์', 'โครงสร้างเหล็ก']
  },
  buildingSystems: {
    key: 'buildingSystems',
    name: 'ระบบบ้านและอาคาร / Solar',
    icon: '☀️',
    color: '#E11D48',
    weight: 0.04,
    relevantStages: ['structure', 'finishing'],
    stageDesc: 'รางน้ำฝน • Solar Roof • ระบายอากาศ',
    unit: 'ไซต์งาน',
    subItems: [
      'SCG Solar Roof Solutions',
      'รางน้ำฝนไวนิล SCG',
      'ระบบ Active AIRflow System',
      'ท่อระบายน้ำและข้อต่อ'
    ],
    searchKeywords: ['รางน้ำ', 'ระบายอากาศ', 'solar', 'solar roof', 'โซลาร์', 'ระบบบ้าน', 'ติดตั้ง', 'airflow']
  },
  sanitaryDecor: {
    key: 'sanitaryDecor',
    name: 'สุขภัณฑ์ และกระเบื้อง (COTTO)',
    icon: '🚿',
    color: '#2563EB',
    weight: 0.05,
    relevantStages: ['finishing'],
    stageDesc: 'ปูกระเบื้องห้องน้ำ • สุขภัณฑ์',
    unit: 'ไซต์งาน',
    subItems: [
      'กระเบื้องปูพื้น COTTO / SCG Decor',
      'สุขภัณฑ์ประหยัดน้ำ COTTO',
      'ก๊อกน้ำและอุปกรณ์ตกแต่งห้องน้ำ',
      'อ่างล้างหน้าและเคาน์เตอร์'
    ],
    searchKeywords: ['cotto', 'สุขภัณฑ์', 'กระเบื้องปูพื้น', 'กระเบื้องบุผนัง', 'ก๊อกน้ำ', 'อ่างล้างหน้า', 'scg decor', 'แกรนิตโต้', 'ห้องน้ำ']
  }
};

function initProductAnalyticsCharts(companies) {
  cachedAllCompanies = companies;

  // รวบรวมโครงการก่อสร้างทั้งหมดจากทุกบริษัท
  let allActiveProjects = [];
  companies.forEach(c => {
    if (c.projects && Array.isArray(c.projects)) {
      c.projects.forEach(p => {
        allActiveProjects.push({ ...p, companyName: c.name, district: c.district });
      });
    }
  });

  const totalProjectsCount = allActiveProjects.length;

  cachedProductTotals = {};
  cachedStageDemand = {};

  Object.keys(scgProductCategoriesConfig).forEach(key => {
    const conf = scgProductCategoriesConfig[key];
    
    // นับจำนวนโครงการจริงที่สเตจงานตรงกับความต้องการใช้วัสดุกลุ่มนี้
    let matchedProjects = [];
    if (totalProjectsCount > 0) {
      matchedProjects = allActiveProjects.filter(p => {
        const sKey = p.stageKey || 'groundbreak';
        return conf.relevantStages.includes(sKey);
      });
    }

    const siteCount = matchedProjects.length;
    const percent = totalProjectsCount > 0 ? ((siteCount / totalProjectsCount) * 100).toFixed(0) : 0;

    cachedProductTotals[key] = {
      key: conf.key,
      name: conf.name,
      icon: conf.icon,
      color: conf.color,
      unit: conf.unit,
      relevantStages: conf.relevantStages,
      stageDesc: conf.stageDesc,
      subItems: conf.subItems,
      searchKeywords: conf.searchKeywords,
      siteCount: siteCount,
      percent: percent,
      matchedProjects: matchedProjects,
      description: conf.subItems.slice(0, 4).join(', ') + ' ฯลฯ'
    };
  });

  // Render Product Summary Cards Bar (Clickable 10 Cards)
  renderProductSummaryCards(cachedProductTotals, totalProjectsCount);
}

function renderProductSummaryCards(productTotals, totalProjectsCount) {
  const container = document.getElementById('product-summary-cards-container');
  if (!container) return;

  container.innerHTML = Object.keys(productTotals).map(key => {
    const item = productTotals[key];
    const siteCount = item.siteCount || 0;
    const percent = item.percent || 0;

    return `
      <div class="product-metric-card" onclick="openProductAnalyticsModal('${key}')" style="cursor: pointer; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.8rem; transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 4px;">
            <span style="font-size: 0.76rem; font-weight: 800; color: #0F172A; line-height: 1.25; min-height: 1.9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${item.name}">
              <span style="font-size: 0.95rem; flex-shrink: 0; vertical-align: middle; margin-right: 2px;">${item.icon}</span>${item.name}
            </span>
            <span style="font-size: 0.68rem; font-weight: 800; color: #1E40AF; background: #EFF6FF; padding: 1px 6px; border-radius: 5px; border: 1px solid #BFDBFE; flex-shrink: 0;">${siteCount > 0 ? percent + '%' : '0%'}</span>
          </div>
          
          <div style="font-size: 1.15rem; font-weight: 900; color: #0F172A; letter-spacing: -0.4px; margin: 3px 0 2px 0;">
            ${siteCount} <span style="font-size: 0.75rem; font-weight: 700; color: #64748B;">ไซต์งาน</span>
          </div>

          <div style="font-size: 0.68rem; color: #64748B; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.stageDesc}">
            🎯 ${item.stageDesc}
          </div>

          <!-- Micro Visual Bar -->
          <div style="width: 100%; height: 4px; background: #F1F5F9; border-radius: 999px; overflow: hidden;">
            <div style="width: ${percent}%; height: 100%; background: ${item.color}; border-radius: 999px; transition: width 0.6s ease;"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openProductAnalyticsModal(productKey) {
  if (typeof closeAllModals === 'function') closeAllModals();
  const product = cachedProductTotals[productKey];
  if (!product) return;

  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  const siteCount = product.siteCount || 0;
  const percent = product.percent || 0;

  // Set Title & Subtitle
  document.getElementById('prodmodal-title').innerHTML = `${product.icon} ${product.name}`;
  document.getElementById('prodmodal-subtitle').innerHTML = `
    ความต้องการใช้งานใน จ.อุดรธานี: <strong style="color: #0F172A; font-size: 0.9rem;">${siteCount} ไซต์งาน</strong> (สอดคล้องกับสเตจงานก่อสร้าง ${percent}% ของไซต์ทั้งหมด)
  `;

  // Badge
  const badgeContainer = document.getElementById('prodmodal-badge-container');
  badgeContainer.innerHTML = `
    <span style="background: #1E40AF; color: #FFFFFF; font-weight: 700; font-size: 0.78rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); box-shadow: var(--shadow-sm);">
      ความต้องการ ${siteCount} ไซต์งาน (${percent}%)
    </span>
  `;

  // Render Sub-items Grid in Modal (แสดงรายการผลิตภัณฑ์ย่อยที่คลิกเข้ามาดู)
  const subItemsContainer = document.getElementById('prodmodal-subitems-container');
  if (subItemsContainer && product.subItems && product.subItems.length > 0) {
    subItemsContainer.innerHTML = `
      <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 0.9rem 1.15rem; margin-bottom: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 6px;">
          <div style="font-size: 0.84rem; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 6px;">
            <span>📦</span> รายการผลิตภัณฑ์ SCG ในกลุ่ม "${product.name}" (${product.subItems.length} รายการ)
          </div>
          <span style="font-size: 0.7rem; color: #64748B; background: #FFFFFF; border: 1px solid #E2E8F0; padding: 2px 8px; border-radius: 4px; font-weight: 700;">
            SCG Professional Portfolio
          </span>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${product.subItems.map(item => `
            <span style="background: #FFFFFF; border: 1px solid #94A3B8; color: #0F172A; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <span style="color: ${product.color}; font-size: 0.72rem;">●</span> ${item}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }

  // Find all matching projects in the province
  const matchingProjects = [];
  const sourceComps = (cachedAllCompanies && cachedAllCompanies.length > 0) ? cachedAllCompanies : (typeof allCompanies !== 'undefined' ? allCompanies : []);
  
  sourceComps.forEach(comp => {
    if (comp.projects && comp.projects.length > 0) {
      comp.projects.forEach(proj => {
        const sKey = proj.stageKey || 'groundbreak';
        const isRelevantStage = (product.relevantStages || []).includes(sKey);

        if (isRelevantStage) {
          let recMaterial = product.subItems[0];
          if (sKey === 'groundbreak' || sKey === 'foundation') {
            recMaterial = product.subItems.find(i => i.includes('โครงสร้าง') || i.includes('คอนกรีต') || i.includes('ฐานราก') || i.includes('เสา')) || product.subItems[0];
          } else if (sKey === 'structure') {
            recMaterial = product.subItems.find(i => i.includes('หลังคา') || i.includes('ผนัง') || i.includes('โครง') || i.includes('ฉนวน')) || product.subItems[0];
          } else {
            recMaterial = product.subItems.find(i => i.includes('ฉาบ') || i.includes('กระเบื้อง') || i.includes('ฝ้า') || i.includes('ไม้') || i.includes('สุขภัณฑ์')) || product.subItems[0];
          }

          const postLink = proj.postUrl || (proj.siteProof && proj.siteProof.postUrl) || comp.facebookUrl || 'https://www.facebook.com';
          matchingProjects.push({
            companyId: comp.id,
            companyName: comp.name,
            district: comp.district || 'เมืองอุดรธานี',
            projectId: proj.projectId,
            projectName: proj.name,
            stage: proj.stage,
            stageKey: proj.stageKey,
            recMaterial: recMaterial,
            postUrl: postLink
          });
        }
      });
    }
  });

  // คำนวณจำนวนโครงการแยกตามระยะงานก่อสร้างจากข้อมูลจริง
  const stageCounts = {
    groundbreak: matchingProjects.filter(p => p.stageKey === 'groundbreak').length,
    foundation: matchingProjects.filter(p => p.stageKey === 'foundation').length,
    structure: matchingProjects.filter(p => p.stageKey === 'structure').length,
    finishing: matchingProjects.filter(p => p.stageKey === 'finishing').length
  };

  const stages = {
    groundbreak: stageCounts.groundbreak,
    foundation: stageCounts.foundation,
    structure: stageCounts.structure,
    finishing: stageCounts.finishing
  };

  // Render Chart for this product
  renderSingleProductStageChart(product, stages);

  // Render Stage Breakdown Cards on the Right (Show real site counts per stage)
  const stageBreakdownContainer = document.getElementById('prodmodal-stage-breakdown');
  stageBreakdownContainer.innerHTML = `
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #1E40AF;">🔵 ระยะตอกเสาเข็ม/เปิดหน้างาน</div>
        <div style="font-size: 0.68rem; color: #64748B;">ช่วงนำเสนอวัสดุหลักล็อตแรก</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">${stageCounts.groundbreak} <span style="font-size: 0.75rem; font-weight: 600; color: #64748B;">ไซต์</span></div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #0284C7;">🌊 ระยะฐานราก-คานคอดิน</div>
        <div style="font-size: 0.68rem; color: #64748B;">ช่วงสั่งส่งคอนกรีต/ปูนโครงสร้าง</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">${stageCounts.foundation} <span style="font-size: 0.75rem; font-weight: 600; color: #64748B;">ไซต์</span></div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #475569;">🏛️ ระยะโครงสร้าง-หลังคา</div>
        <div style="font-size: 0.68rem; color: #64748B;">ช่วงล็อกสเปกกระเบื้องหลังคา/ฝ้า/ฉนวน</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">${stageCounts.structure} <span style="font-size: 0.75rem; font-weight: 600; color: #64748B;">ไซต์</span></div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #16A34A;">🟢 ระยะงานตกแต่ง-เก็บงาน</div>
        <div style="font-size: 0.68rem; color: #64748B;">ช่วงปูกระเบื้อง/สุขภัณฑ์/ทาสี</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">${stageCounts.finishing} <span style="font-size: 0.75rem; font-weight: 600; color: #64748B;">ไซต์</span></div>
    </div>
  `;

  // Render Matching Projects List (Direct link to Facebook Post)
  document.getElementById('prodmodal-project-count').textContent = `พบ ${matchingProjects.length} ไซต์งานจริงในอุดรธานีที่อยู่ในระยะใช้วัสดุนี้`;
  const projectsListContainer = document.getElementById('prodmodal-projects-list');

  if (matchingProjects.length > 0) {
    projectsListContainer.innerHTML = matchingProjects.map(item => `
      <div style="background: #FFFFFF; border: 1.5px solid #E2E8F0; border-radius: 9px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 1px 3px rgba(0,0,0,0.04); gap: 12px;"
           onmouseover="this.style.background='#F8FAFC'; this.style.borderColor='#1877F2'; this.style.transform='translateY(-1px)';"
           onmouseout="this.style.background='#FFFFFF'; this.style.borderColor='#E2E8F0'; this.style.transform='translateY(0)';"
           onclick="window.open('${item.postUrl}', '_blank')"
           title="คลิกเพื่อเปิดดูโพสต์จริงบน Facebook ในแท็บใหม่">
        <div style="min-width: 0; flex: 1;">
          <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; margin-bottom: 3px;">
            <strong style="color: #0F172A; font-size: 0.86rem; font-weight: 800;">${item.projectName}</strong>
            <span style="font-size: 0.68rem; color: #475569; background: #F1F5F9; border: 1px solid #E2E8F0; padding: 1px 6px; border-radius: 4px; font-weight: 700;">${item.district}</span>
          </div>
          <div style="font-size: 0.74rem; color: #64748B; line-height: 1.3;">
            ${item.companyName} • สเตจปัจจุบัน: <span style="color: #1E40AF; font-weight: 700;">${item.stage || 'งานก่อสร้าง'}</span>
          </div>
        </div>
        <div style="text-align: right; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
          <div style="font-size: 0.76rem; font-weight: 800; color: ${product.color}; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 2px 8px; border-radius: 5px;">
            แนะนำ: ${item.recMaterial}
          </div>
          <a href="${item.postUrl}" target="_blank" onclick="event.stopPropagation();" 
             style="font-size: 0.72rem; color: #1877F2; font-weight: 800; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; background: #EFF6FF; border: 1px solid #BFDBFE; padding: 2px 8px; border-radius: 5px; transition: all 0.15s;"
             onmouseover="this.style.background='#DBEAFE';"
             onmouseout="this.style.background='#EFF6FF';">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <span>เปิดดูโพสต์บน Facebook ↗</span>
          </a>
        </div>
      </div>
    `).join('');
  } else {
    projectsListContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 1.5rem; font-size: 0.8rem;">
        ไม่พบไซต์งานที่อยู่ในระยะที่ต้องใช้วัสดุนี้ในขณะนี้ (นำเข้าไฟล์ JSON จาก Apify เพื่อสแกนไซต์งานใหม่)
      </div>
    `;
  }

  modal.style.display = 'flex';
}

function closeProductAnalyticsModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) modal.style.display = 'none';
}

/**
 * สร้างกราฟแท่งสำหรับสินค้ารายตัวใน Modal
 */
function renderSingleProductStageChart(product, stages) {
  const ctx = document.getElementById('productModalStageChart');
  if (!ctx) return;

  if (productModalChartInstance) {
    productModalChartInstance.destroy();
  }

  const stageLabels = ['1. เสาเข็ม/เปิดหน้างาน', '2. ฐานราก/คานคอดิน', '3. โครงสร้าง/หลังคา', '4. ตกแต่ง/เก็บงาน'];
  const stageData = [
    stages.groundbreak || 0,
    stages.foundation || 0,
    stages.structure || 0,
    stages.finishing || 0
  ];

  productModalChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stageLabels,
      datasets: [{
        label: `จำนวนไซต์งาน`,
        data: stageData,
        backgroundColor: [
          '#1E40AF',
          '#0284C7',
          '#475569',
          '#16A34A'
        ],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Prompt', size: 10 } }
        },
        y: {
          grid: { color: '#F1F5F9' },
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: { family: 'Prompt', size: 10 },
            callback: function (value) { return value + ' ไซต์'; }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ` จำนวน: ${context.raw} ไซต์งาน`;
            }
          }
        }
      }
    }
  });
}
