/**
 * NEXTSITE AI - SCG Product Analytics & Summary Charts Engine
 * แสดงสรุปยอดสินค้าในหน้าแรก และเปิดดูกราฟเจาะลึกเมื่อคลิกรายสินค้า
 */

let cachedProductTotals = {};
let cachedStageDemand = {};
let cachedAllCompanies = [];
let productModalChartInstance = null;

function initProductAnalyticsCharts(companies) {
  cachedAllCompanies = companies;

  // คำนวณมูลค่าโครงการรวมทั้งจังหวัด (฿)
  const totalConstVal = companies.reduce((acc, curr) => acc + curr.totalValueMillion, 0) * 1000000;
  // ประมาณการสัดส่วนสั่งซื้อวัสดุก่อสร้าง SCG รวมทั้งจังหวัด (20% ของมูลค่าโครงการ)
  const totalSCGMaterial = totalConstVal * 0.20;

  // คำนวณยอดรวมความต้องการสินค้าแต่ละหมวดตามสัดส่วนจริงของงานก่อสร้าง
  cachedProductTotals = {
    cementCpac: {
      key: 'cementCpac',
      name: 'ปูนซีเมนต์ SCG & คอนกรีต CPAC',
      value: Math.round(totalSCGMaterial * 0.48), // 48%
      color: '#D9251D',
      icon: '🏗️',
      unit: 'ถุง / คิว',
      description: 'ปูนซีเมนต์ไฮดรอลิก SCG งานโครงสร้าง, คอนกรีตผสมเสร็จ CPAC Super Plus 240/280 ksc'
    },
    roofing: {
      key: 'roofing',
      name: 'ระบบหลังคา SCG (Excella/Prestige/NeuTile)',
      value: Math.round(totalSCGMaterial * 0.24), // 24%
      color: '#EA580C',
      icon: '🏠',
      unit: 'ตร.ม.',
      description: 'กระเบื้องเซรามิก Excella, คอนกรีต Prestige, NeuTile, ซีแพคโมเนีย และระบบครอบแห้ง Dry-Tech'
    },
    qconMortar: {
      key: 'qconMortar',
      name: 'อิฐมวลเบา Q-CON & ปูนเสือมอร์ตาร์',
      value: Math.round(totalSCGMaterial * 0.13), // 13%
      color: '#CA8A04',
      icon: '🧱',
      unit: 'ก้อน / ถุง',
      description: 'บล็อกมวลเบา Q-CON 7.5 ซม., ปูนก่อ-ฉาบมวลเบา ตราเสือ มอร์ตาร์'
    },
    woodDecor: {
      key: 'woodDecor',
      name: 'ไม้สังเคราะห์ SCG D-COR & สมาร์ทบอร์ด',
      value: Math.round(totalSCGMaterial * 0.09), // 9%
      color: '#0284C7',
      icon: '🪵',
      unit: 'ตร.ม.',
      description: 'ไม้ฝา ไม้ระแนง SCG D-COR, แผ่นสมาร์ทบอร์ดฝ้าผนัง, ฉนวน STAY COOL'
    },
    cotto: {
      key: 'cotto',
      name: 'สุขภัณฑ์และกระเบื้อง COTTO',
      value: Math.round(totalSCGMaterial * 0.06), // 6%
      color: '#10B981',
      icon: '🚿',
      unit: 'ชุด / ตร.ม.',
      description: 'กระเบื้องปูพื้นแกรนิตโต้ COTTO, กาวซีเมนต์, สุขภัณฑ์และอุปกรณ์ห้องน้ำครบวงจร'
    }
  };

  // ข้อมูลแยกตามระยะงานก่อสร้าง (Stage Demand)
  cachedStageDemand = {
    cementCpac: {
      groundbreak: Math.round(cachedProductTotals.cementCpac.value * 0.35),
      foundation: Math.round(cachedProductTotals.cementCpac.value * 0.30),
      structure: Math.round(cachedProductTotals.cementCpac.value * 0.30),
      finishing: Math.round(cachedProductTotals.cementCpac.value * 0.05)
    },
    roofing: {
      groundbreak: Math.round(cachedProductTotals.roofing.value * 0.05),
      foundation: Math.round(cachedProductTotals.roofing.value * 0.15),
      structure: Math.round(cachedProductTotals.roofing.value * 0.65),
      finishing: Math.round(cachedProductTotals.roofing.value * 0.15)
    },
    qconMortar: {
      groundbreak: Math.round(cachedProductTotals.qconMortar.value * 0.05),
      foundation: Math.round(cachedProductTotals.qconMortar.value * 0.10),
      structure: Math.round(cachedProductTotals.qconMortar.value * 0.70),
      finishing: Math.round(cachedProductTotals.qconMortar.value * 0.15)
    },
    woodDecor: {
      groundbreak: Math.round(cachedProductTotals.woodDecor.value * 0.05),
      foundation: Math.round(cachedProductTotals.woodDecor.value * 0.05),
      structure: Math.round(cachedProductTotals.woodDecor.value * 0.20),
      finishing: Math.round(cachedProductTotals.woodDecor.value * 0.70)
    },
    cotto: {
      groundbreak: Math.round(cachedProductTotals.cotto.value * 0.02),
      foundation: Math.round(cachedProductTotals.cotto.value * 0.03),
      structure: Math.round(cachedProductTotals.cotto.value * 0.10),
      finishing: Math.round(cachedProductTotals.cotto.value * 0.85)
    }
  };

  const totalAllProducts = Object.values(cachedProductTotals).reduce((sum, item) => sum + item.value, 0);

  // Render Product Summary Cards Bar (Clickable)
  renderProductSummaryCards(cachedProductTotals, totalAllProducts);
}

/**
 * เรนเดอร์การ์ดสรุป 5 หมวดสินค้าในหน้าแรก (เมื่อคลิกจะเปิดกราฟเจาะลึก)
 */
function renderProductSummaryCards(productTotals, totalAllProducts) {
  const container = document.getElementById('product-summary-cards-container');
  if (!container) return;

  container.innerHTML = Object.keys(productTotals).map(key => {
    const item = productTotals[key];
    const percent = totalAllProducts > 0 ? ((item.value / totalAllProducts) * 100).toFixed(1) : 0;
    const valueMillion = (item.value / 1000000).toFixed(2);

    return `
      <div class="product-metric-card" onclick="openProductAnalyticsModal('${key}')" style="cursor: pointer;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: 0.76rem; font-weight: 700; color: #292524; display: flex; align-items: center; gap: 4px;">
            <span style="font-size: 1rem;">${item.icon}</span> ${item.name}
          </span>
          <span style="font-size: 0.72rem; font-weight: 800; color: ${item.color}; background: #FAF7F0; padding: 2px 7px; border-radius: 6px; border: 1px solid var(--border-color);">${percent}%</span>
        </div>
        
        <div style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px; margin: 4px 0;">
          ฿${valueMillion}<span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-left: 2px;">M</span>
        </div>

        <!-- Micro Visual Bar -->
        <div style="width: 100%; height: 5px; background: #F3EFE4; border-radius: 999px; overflow: hidden; margin: 6px 0;">
          <div style="width: ${percent}%; height: 100%; background: ${item.color}; border-radius: 999px; transition: width 0.6s ease;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: var(--text-muted); margin-top: 4px;">
          <span>ความต้องการทั่วสกลนคร</span>
          <span style="color: var(--primary-red); font-weight: 700; display: inline-flex; align-items: center; gap: 2px;">
            ดูกราฟ →
          </span>
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
    มูลค่าความต้องการรวมใน จ.สกลนคร: <strong style="color: var(--text-main); font-size: 0.9rem;">฿${valueMillion} ล้านบาท</strong> (สัดส่วน ${percent}% ของวัสดุทั้งหมด)
  `;

  // Badge
  const badgeContainer = document.getElementById('prodmodal-badge-container');
  badgeContainer.innerHTML = `
    <span style="background: ${product.color}; color: #FFFFFF; font-weight: 700; font-size: 0.78rem; padding: 0.35rem 0.85rem; border-radius: var(--radius-full); box-shadow: var(--shadow-sm);">
      ส่วนแบ่งความต้องการ ${percent}%
    </span>
  `;

  // Find all matching projects in Sakon Nakhon
  const matchingProjects = [];
  const sourceComps = (cachedAllCompanies && cachedAllCompanies.length > 0) ? cachedAllCompanies : (typeof allCompanies !== 'undefined' ? allCompanies : []);
  
  sourceComps.forEach(comp => {
    if (comp.projects && comp.projects.length > 0) {
      comp.projects.forEach(proj => {
        let matchedMat = null;
        if (proj.boqMaterials && proj.boqMaterials.length > 0) {
          matchedMat = proj.boqMaterials.find(m => {
            const sku = (m.sku || '').toLowerCase();
            if (productKey === 'cementCpac') {
              return (sku.includes('ปูน') || sku.includes('cpac') || sku.includes('คอนกรีต') || sku.includes('ไฮดรอลิก') || sku.includes('ฐานราก') || sku.includes('เสา'));
            }
            if (productKey === 'roofing') {
              return (sku.includes('หลังคา') || sku.includes('excella') || sku.includes('prestige') || sku.includes('neutile') || sku.includes('ซีแพค') || sku.includes('กระเบื้องหลังคา'));
            }
            if (productKey === 'qconMortar') {
              return (sku.includes('q-con') || sku.includes('มวลเบา') || sku.includes('เสือ') || sku.includes('เสือมอร์ตาร์') || sku.includes('ก่อฉาบ') || sku.includes('ฉาบละเอียด'));
            }
            if (productKey === 'woodDecor') {
              return (sku.includes('d-cor') || sku.includes('ไม้') || sku.includes('สมาร์ทบอร์ด') || sku.includes('ฉนวน') || sku.includes('stay cool') || sku.includes('ระแนง'));
            }
            if (productKey === 'cotto') {
              return (sku.includes('cotto') || sku.includes('สุขภัณฑ์') || sku.includes('แกรนิตโต้') || sku.includes('ปูพื้น') || sku.includes('กระเบื้องปูพื้น') || sku.includes('ห้องน้ำ'));
            }
            return false;
          });
        }

        // เฉพาะโครงการที่มีสินค้าตรงหมวดจริงๆ
        if (matchedMat) {
          matchingProjects.push({
            companyId: comp.id,
            companyName: comp.name,
            district: comp.district || 'เมืองสกลนคร',
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
    groundbreak: stageCounts.groundbreak > 0 ? (product.value * (stageCounts.groundbreak / totalMatchedCount)) : 0,
    foundation: stageCounts.foundation > 0 ? (product.value * (stageCounts.foundation / totalMatchedCount)) : 0,
    structure: stageCounts.structure > 0 ? (product.value * (stageCounts.structure / totalMatchedCount)) : 0,
    finishing: stageCounts.finishing > 0 ? (product.value * (stageCounts.finishing / totalMatchedCount)) : 0
  };

  // Render Chart for this product
  renderSingleProductStageChart(product, stages);

  // Render Stage Breakdown Cards on the Right
  const stageBreakdownContainer = document.getElementById('prodmodal-stage-breakdown');
  stageBreakdownContainer.innerHTML = `
    <div style="background: #FAF7F0; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #D9251D;">🔴 ระยะตอกเสาเข็ม/เปิดหน้างาน (${stageCounts.groundbreak} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #57534E;">ช่วงปิดดีลล็อตแรก</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.groundbreak / 1000000).toFixed(2)}M</div>
    </div>

    <div style="background: #FAF7F0; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #EA580C;">🟠 ระยะฐานราก-คานคอดิน (${stageCounts.foundation} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #57534E;">เตรียมส่งมอบสัปดาห์นี้</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.foundation / 1000000).toFixed(2)}M</div>
    </div>

    <div style="background: #FAF7F0; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #CA8A04;">🟡 ระยะโครงสร้าง-หลังคา (${stageCounts.structure} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #57534E;">ล็อกสเปกล่วงหน้า</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.structure / 1000000).toFixed(2)}M</div>
    </div>

    <div style="background: #FAF7F0; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-size: 0.75rem; font-weight: 700; color: #10B981;">🟢 ระยะงานตกแต่ง-เก็บงาน (${stageCounts.finishing} โครงการ)</div>
        <div style="font-size: 0.68rem; color: #57534E;">ตรวจรับงวดสุดท้าย</div>
      </div>
      <div style="font-weight: 800; font-size: 0.95rem; color: #0F172A;">฿${(stages.finishing / 1000000).toFixed(2)}M</div>
    </div>
  `;

  // Render Matching Projects List
  document.getElementById('prodmodal-project-count').textContent = `พบ ${matchingProjects.length} โครงการจริงในสกลนครที่ต้องการสินค้านี้`;
  const projectsListContainer = document.getElementById('prodmodal-projects-list');

  if (matchingProjects.length > 0) {
    projectsListContainer.innerHTML = matchingProjects.map(item => `
      <div style="background: #FCFAF5; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.65rem 0.85rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.15s ease;"
           onmouseover="this.style.background='#F3EFE4'; this.style.borderColor='#D6CDB8';"
           onmouseout="this.style.background='#FCFAF5'; this.style.borderColor='var(--border-color)';"
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
