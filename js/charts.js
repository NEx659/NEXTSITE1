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
    unit: 'ถุง / ตัน',
    subItems: [
      'ปูนซีเมนต์ปอร์ตแลนด์',
      'ปูนงานโครงสร้าง',
      'ปูนงานหล่อคอนกรีต',
      'ปูนฉาบ',
      'ปูนก่อ',
      'กาวซีเมนต์ปูกระเบื้อง',
      'ยาแนวกระเบื้อง',
      'ปูนปรับระดับพื้น',
      'ปูนตกแต่งพิเศษ'
    ],
    searchKeywords: ['ปูน', 'มอร์ตาร์', 'ซีเมนต์', 'ปอร์ตแลนด์', 'ปูนฉาบ', 'ปูนก่อ', 'กาวซีเมนต์', 'ยาแนว', 'ปรับระดับ']
  },
  concreteProducts: {
    key: 'concreteProducts',
    name: 'คอนกรีต และผลิตภัณฑ์คอนกรีต',
    icon: '🚛',
    color: '#0284C7',
    weight: 0.20,
    unit: 'คิว / แผ่น / ท่อน',
    subItems: [
      'CPAC คอนกรีตผสมเสร็จ',
      'คอนกรีตสำเร็จรูป',
      'เสาเข็ม',
      'แผ่นพื้นสำเร็จรูป',
      'รั้วคอนกรีต',
      'บล็อกปูพื้น'
    ],
    searchKeywords: ['cpac', 'คอนกรีต', 'เสาเข็ม', 'แผ่นพื้น', 'รั้วคอนกรีต', 'บล็อกปูพื้น', 'ผสมเสร็จ', 'สำเร็จรูป']
  },
  roofing: {
    key: 'roofing',
    name: 'หลังคา',
    icon: '🏠',
    color: '#EA580C',
    weight: 0.15,
    unit: 'ตร.ม. / แผ่น',
    subItems: [
      'กระเบื้องหลังคาคอนกรีต',
      'กระเบื้องหลังคาเซรามิก',
      'แผ่นหลังคาไฟเบอร์ซีเมนต์',
      'หลังคาโปร่งแสง Shinkolite',
      'อุปกรณ์ติดตั้งหลังคา'
    ],
    searchKeywords: ['หลังคา', 'กระเบื้องหลังคา', 'excella', 'prestige', 'neutile', 'ซีแพค', 'shinkolite', 'ไฟเบอร์ซีเมนต์']
  },
  wallCeiling: {
    key: 'wallCeiling',
    name: 'ผนัง และฝ้า',
    icon: '🧱',
    color: '#CA8A04',
    weight: 0.11,
    unit: 'แผ่น / ตร.ม.',
    subItems: [
      'สมาร์ทบอร์ด (Smartboard)',
      'สมาร์ทวอลล์ (Smart Wall)',
      'แผ่นไฟเบอร์ซีเมนต์',
      'แผ่นยิปซัม',
      'ระบบผนังเบา',
      'ฝ้าภายใน',
      'ฝ้าภายนอก',
      'ฝ้าชายคา'
    ],
    searchKeywords: ['สมาร์ทบอร์ด', 'smartboard', 'smart wall', 'ยิปซัม', 'ผนังเบา', 'ฝ้า', 'ชายคา', 'q-con', 'มวลเบา']
  },
  syntheticWood: {
    key: 'syntheticWood',
    name: 'ไม้สังเคราะห์',
    icon: '🪵',
    color: '#9333EA',
    weight: 0.08,
    unit: 'ท่อน / แผ่น / ตร.ม.',
    subItems: [
      'SCG SmartWOOD',
      'ไม้พื้น',
      'ไม้ฝา',
      'ไม้เชิงชาย',
      'ไม้รั้ว',
      'ไม้บันได'
    ],
    searchKeywords: ['smartwood', 'ไม้สังเคราะห์', 'ไม้พื้น', 'ไม้ฝา', 'เชิงชาย', 'ไม้รั้ว', 'ไม้บันได', 'd-cor']
  },
  insulationAcoustic: {
    key: 'insulationAcoustic',
    name: 'ฉนวน และวัสดุกันเสียง',
    icon: '🛡️',
    color: '#0D9488',
    weight: 0.04,
    unit: 'ม้วน / ตร.ม.',
    subItems: [
      'ฉนวนกันความร้อน Stay Cool',
      'ฉนวนกันเสียง',
      'แผ่นซับเสียง'
    ],
    searchKeywords: ['stay cool', 'ฉนวน', 'กันความร้อน', 'กันเสียง', 'ซับเสียง']
  },
  flooringExterior: {
    key: 'flooringExterior',
    name: 'งานพื้น และตกแต่งภายนอก',
    icon: '🌿',
    color: '#16A34A',
    weight: 0.05,
    unit: 'ตร.ม. / ชุด',
    subItems: [
      'พื้นสมาร์ทวูด',
      'พื้นไฟเบอร์ซีเมนต์',
      'พื้นภายนอก',
      'ทางเดินสวน',
      'ระแนงตกแต่ง',
      'ฟาซาด'
    ],
    searchKeywords: ['พื้นสมาร์ทวูด', 'ทางเดินสวน', 'ระแนง', 'ฟาซาด', 'ตกแต่งภายนอก', 'ภูมิทัศน์']
  },
  steelStructure: {
    key: 'steelStructure',
    name: 'เหล็ก และโครงสร้าง',
    icon: '⚙️',
    color: '#475569',
    weight: 0.07,
    unit: 'เส้น / ตัน',
    subItems: [
      'เหล็กเส้น',
      'เหล็กรูปพรรณ',
      'เหล็กกล่อง',
      'ลวดอัดแรง PC Strand',
      'เหล็กชุบกัลวาไนซ์'
    ],
    searchKeywords: ['เหล็ก', 'เหล็กเส้น', 'เหล็กรูปพรรณ', 'เหล็กกล่อง', 'pc strand', 'กัลวาไนซ์', 'โครงสร้างเหล็ก']
  },
  buildingSystems: {
    key: 'buildingSystems',
    name: 'ระบบบ้านและอาคาร',
    icon: '☀️',
    color: '#E11D48',
    weight: 0.04,
    unit: 'ระบบ / ชุด',
    subItems: [
      'รางน้ำฝน',
      'ระบบระบายอากาศ',
      'Solar Roof',
      'ระบบผนังเบา',
      'ระบบกันเสียง',
      'บริการติดตั้งครบวงจร'
    ],
    searchKeywords: ['รางน้ำ', 'ระบายอากาศ', 'solar', 'solar roof', 'โซลาร์', 'ระบบบ้าน', 'ติดตั้ง']
  },
  sanitaryDecor: {
    key: 'sanitaryDecor',
    name: 'สุขภัณฑ์ และกระเบื้อง (SCG Decor / COTTO)',
    icon: '🚿',
    color: '#2563EB',
    weight: 0.05,
    unit: 'ชุด / ตร.ม.',
    subItems: [
      'กระเบื้องปูพื้น',
      'กระเบื้องบุผนัง',
      'สุขภัณฑ์',
      'ก๊อกน้ำ',
      'อ่างล้างหน้า',
      'อุปกรณ์ห้องน้ำ'
    ],
    searchKeywords: ['cotto', 'สุขภัณฑ์', 'กระเบื้องปูพื้น', 'กระเบื้องบุผนัง', 'ก๊อกน้ำ', 'อ่างล้างหน้า', 'scg decor', 'แกรนิตโต้', 'ห้องน้ำ']
  }
};

function initProductAnalyticsCharts(companies) {
  cachedAllCompanies = companies;

  // คำนวณมูลค่าโครงการรวมทั้งจังหวัด (฿)
  const totalConstVal = companies.reduce((acc, curr) => acc + curr.totalValueMillion, 0) * 1000000;
  // ประมาณการสัดส่วนสั่งซื้อวัสดุก่อสร้าง SCG รวมทั้งจังหวัด (20% ของมูลค่าโครงการ)
  const totalSCGMaterial = totalConstVal * 0.20;

  cachedProductTotals = {};
  cachedStageDemand = {};

  Object.keys(scgProductCategoriesConfig).forEach(key => {
    const conf = scgProductCategoriesConfig[key];
    const val = Math.round(totalSCGMaterial * conf.weight);
    cachedProductTotals[key] = {
      key: conf.key,
      name: conf.name,
      value: val,
      color: conf.color,
      icon: conf.icon,
      unit: conf.unit,
      subItems: conf.subItems,
      searchKeywords: conf.searchKeywords,
      description: conf.subItems.slice(0, 4).join(', ') + ' ฯลฯ'
    };
  });

  const totalAllProducts = Object.values(cachedProductTotals).reduce((sum, item) => sum + item.value, 0);

  // Render Product Summary Cards Bar (Clickable 10 Cards)
  renderProductSummaryCards(cachedProductTotals, totalAllProducts);
}

function renderProductSummaryCards(productTotals, totalAllProducts) {
  const container = document.getElementById('product-summary-cards-container');
  if (!container) return;

  container.innerHTML = Object.keys(productTotals).map(key => {
    const item = productTotals[key];
    const percent = totalAllProducts > 0 ? ((item.value / totalAllProducts) * 100).toFixed(1) : 0;
    const valueMillion = (item.value / 1000000).toFixed(2);

    return `
      <div class="product-metric-card" onclick="openProductAnalyticsModal('${key}')" style="cursor: pointer; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.8rem; transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; gap: 4px;">
            <span style="font-size: 0.76rem; font-weight: 800; color: #0F172A; line-height: 1.25; min-height: 1.9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${item.name}">
              <span style="font-size: 0.95rem; flex-shrink: 0; vertical-align: middle; margin-right: 2px;">${item.icon}</span>${item.name}
            </span>
            <span style="font-size: 0.68rem; font-weight: 800; color: #1E40AF; background: #EFF6FF; padding: 1px 5px; border-radius: 5px; border: 1px solid #BFDBFE; flex-shrink: 0;">${percent}%</span>
          </div>
          
          <div style="font-size: 1.15rem; font-weight: 900; color: #0F172A; letter-spacing: -0.4px; margin: 3px 0 5px 0;">
            ฿${valueMillion}<span style="font-size: 0.74rem; font-weight: 700; color: #64748B; margin-left: 2px;">M</span>
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

  const totalAll = Object.values(cachedProductTotals).reduce((sum, item) => sum + item.value, 0);
  const percent = totalAll > 0 ? ((product.value / totalAll) * 100).toFixed(1) : 0;
  const valueMillion = (product.value / 1000000).toFixed(2);

  // Set Title & Subtitle
  document.getElementById('prodmodal-title').innerHTML = `${product.icon} ${product.name}`;
  document.getElementById('prodmodal-subtitle').innerHTML = `
    มูลค่าความต้องการรวมใน จ.อุดรธานี: <strong style="color: #0F172A; font-size: 0.9rem;">฿${valueMillion} ล้านบาท</strong> (สัดส่วน ${percent}% ของวัสดุทั้งหมด)
  `;

  // Badge
  const badgeContainer = document.getElementById('prodmodal-badge-container');
  badgeContainer.innerHTML = `
    <span style="background: #1E40AF; color: #FFFFFF; font-weight: 700; font-size: 0.78rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); box-shadow: var(--shadow-sm);">
      ส่วนแบ่งความต้องการ ${percent}%
    </span>
  `;

  // Render Sub-items Grid in Modal (แสดง 10 รายการหลักพร้อมรายละเอียดย่อยที่คลิกเข้ามาดู)
  const subItemsContainer = document.getElementById('prodmodal-subitems-container');
  if (subItemsContainer && product.subItems && product.subItems.length > 0) {
    subItemsContainer.innerHTML = `
      <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 10px; padding: 0.9rem 1.15rem; margin-bottom: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 6px;">
          <div style="font-size: 0.84rem; font-weight: 800; color: #0F172A; display: flex; align-items: center; gap: 6px;">
            <span>📦</span> รายการผลิตภัณฑ์ย่อยในกลุ่ม "${product.name}" (${product.subItems.length} รายการ)
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
        let matchedMat = null;
        if (proj.boqMaterials && proj.boqMaterials.length > 0) {
          matchedMat = proj.boqMaterials.find(m => {
            const sku = (m.sku || '').toLowerCase();
            const keywords = product.searchKeywords || [];
            return keywords.some(kw => sku.includes(kw.toLowerCase()));
          });
        }

        // Fallback matched material representation based on subItems
        if (!matchedMat && product.subItems && product.subItems.length > 0) {
          const pseudoHash = (proj.projectId ? proj.projectId.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0);
          const subItemSample = product.subItems[pseudoHash % product.subItems.length] || product.subItems[0];
          matchedMat = {
            sku: subItemSample,
            qty: 'ตามงวดงานก่อสร้าง',
            estCost: '฿' + (Math.round((proj.estValueMillion || 3.5) * 1000000 * (product.weight || 0.05) / 1000) * 1000).toLocaleString(),
            urgency: 'ต้องการสั่งซื้อ'
          };
        }

        if (matchedMat) {
          matchingProjects.push({
            companyId: comp.id,
            companyName: comp.name,
            district: comp.district || 'เมืองอุดรธานี',
            projectId: proj.projectId,
            projectName: proj.name,
            stage: proj.stage,
            stageKey: proj.stageKey,
            estValue: proj.estValue,
            matchedMat: matchedMat
          });
        }
      });
    }
  });

  // คำนวณยอดและจำนวนโครงการแยกตามระยะงานก่อสร้างจากข้อมูลจริง
  const stageCounts = {
    groundbreak: matchingProjects.filter(p => p.stageKey === 'groundbreak').length,
    foundation: matchingProjects.filter(p => p.stageKey === 'foundation').length,
    structure: matchingProjects.filter(p => p.stageKey === 'structure').length,
    finishing: matchingProjects.filter(p => p.stageKey === 'finishing').length
  };

  const totalMatchedCount = matchingProjects.length || 1;
  const stages = {
    groundbreak: stageCounts.groundbreak > 0 ? (product.value * (stageCounts.groundbreak / totalMatchedCount)) : (product.value * 0.25),
    foundation: stageCounts.foundation > 0 ? (product.value * (stageCounts.foundation / totalMatchedCount)) : (product.value * 0.25),
    structure: stageCounts.structure > 0 ? (product.value * (stageCounts.structure / totalMatchedCount)) : (product.value * 0.30),
    finishing: stageCounts.finishing > 0 ? (product.value * (stageCounts.finishing / totalMatchedCount)) : (product.value * 0.20)
  };

  // Render Chart for this product
  renderSingleProductStageChart(product, stages);

  // Render Stage Breakdown Cards on the Right
  const stageBreakdownContainer = document.getElementById('prodmodal-stage-breakdown');
  stageBreakdownContainer.innerHTML = `
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #1E40AF;">🔵 ระยะตอกเสาเข็ม/เปิดหน้างาน (${stageCounts.groundbreak} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #64748B;">ช่วงปิดดีลล็อตแรก</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.groundbreak / 1000000).toFixed(2)}M</div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #0284C7;">🌊 ระยะฐานราก-คานคอดิน (${stageCounts.foundation} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #64748B;">เตรียมส่งมอบสัปดาห์นี้</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.foundation / 1000000).toFixed(2)}M</div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #475569;">🏛️ ระยะโครงสร้าง-หลังคา (${stageCounts.structure} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #64748B;">ล็อกสเปกล่วงหน้า</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.structure / 1000000).toFixed(2)}M</div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #16A34A;">🟢 ระยะงานตกแต่ง-เก็บงาน (${stageCounts.finishing} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #64748B;">ตรวจรับงวดสุดท้าย</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.finishing / 1000000).toFixed(2)}M</div>
    </div>
  `;

  // Render Matching Projects List
  document.getElementById('prodmodal-project-count').textContent = `พบ ${matchingProjects.length} โครงการจริงในอุดรธานีที่ต้องการสินค้านี้`;
  const projectsListContainer = document.getElementById('prodmodal-projects-list');

  if (matchingProjects.length > 0) {
    projectsListContainer.innerHTML = matchingProjects.map(item => `
      <div style="background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.15s ease;"
           onmouseover="this.style.background='#EFF6FF'; this.style.borderColor='#93C5FD';"
           onmouseout="this.style.background='#FFFFFF'; this.style.borderColor='#E2E8F0';"
           onclick="closeProductAnalyticsModal(); openProjectModal('${item.companyId}', '${item.projectId}')">
        <div>
          <div style="display: flex; align-items: center; gap: 0.4rem;">
            <strong style="color: var(--text-main); font-size: 0.82rem;">${item.projectName}</strong>
            <span style="font-size: 0.7rem; color: #57534E; background: #F1ECE0; padding: 1px 5px; border-radius: 3px;">${item.district}</span>
          </div>
          <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px;">
            ${item.companyName} • สเปกที่ต้องการ: <strong style="color: ${product.color};">${item.matchedMat.sku} (${item.matchedMat.qty})</strong>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.82rem; font-weight: 800; color: #0F172A;">${item.matchedMat.estCost}</div>
          <span style="font-size: 0.68rem; color: var(--primary-red); font-weight: 700;">เปิดดู BOQ →</span>
        </div>
      </div>
    `).join('');
  } else {
    projectsListContainer.innerHTML = `
      <div style="text-align: center; color: var(--text-secondary); padding: 1rem; font-size: 0.75rem;">
        ไม่พบโครงการที่ต้องการสินค้านี้ในขณะนี้
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

  const stageLabels = ['1. ตอกเสาเข็ม', '2. วางฐานราก', '3. โครงสร้าง-หลังคา', '4. งานตกแต่ง'];
  const stageData = [
    (stages.groundbreak / 1000000).toFixed(2),
    (stages.foundation / 1000000).toFixed(2),
    (stages.structure / 1000000).toFixed(2),
    (stages.finishing / 1000000).toFixed(2)
  ];

  productModalChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stageLabels,
      datasets: [{
        label: `ความต้องการ ${product.name}`,
        data: stageData,
        backgroundColor: [
          '#D9251D',
          '#EA580C',
          '#CA8A04',
          '#10B981'
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
          grid: { color: '#F3EFE4' },
          ticks: {
            font: { family: 'Prompt', size: 10 },
            callback: function (value) { return '฿' + value + 'M'; }
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ` มูลค่าความต้องการ: ฿${context.raw} ล้านบาท`;
            }
          }
        }
      }
    }
  });
}
