/**
 * NEXTSITE AI - Opportunity Scoring Engine
 * คำนวณคะแนนโอกาส 3 มิติหลัก (คะแนนเต็ม 15 แปลงเทียบเป็น 100):
 * 1. จำนวนโครงการ: 0->0, 1-2->2, 3-4->3, 5->4, 6+->5 (Max 5)
 * 2. สเตจหน้างาน: ยกเสาเอก/เซ็นสัญญา/ฐานราก->5, กลางๆ->3, ใกล้จบงาน->1 (Max 5)
 * 3. ประวัติซื้อกับ SCG: ซื้อทั้ง 2025&2026->5, ซื้อ 2025 หรือ 2026->4, ยังไม่เคยซื้อ->2 (Max 5)
 * (มิติที่ 4 กำไร DBD รอเปิดใช้งานเมื่อมีข้อมูลงบการเงินจริง)
 */

function calculateCompany3DimScore(comp) {
  if (!comp) return { totalScore100: 0, rawTotal: 0, scoreProj: 0, scoreStage: 0, scoreScg: 0 };

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

  // คำนวณคะแนนรวมดิบ (เต็ม 15) และแปลงเทียบเต็ม 100
  const rawTotal = scoreProj + scoreStage + scoreScg; // Max 15
  const totalScore100 = Math.round((rawTotal / 15) * 100);

  return {
    totalScore100,
    rawTotal,
    scoreProj,
    scoreStage,
    scoreScg,
    projCount,
    s25,
    s26
  };
}

function calculateOpportunityScore(company) {
  const result = calculateCompany3DimScore(company);
  const finalScore = result.totalScore100;

  let tier = "yellow";
  let tierLabel = "โอกาสปานกลาง";
  let tierColor = "#64748B";
  let urgency = "ติดตามตามรอบปกติ";

  if (finalScore >= 85) {
    tier = "red";
    tierLabel = "โอกาสสูงสุด (85-100)";
    tierColor = "#1E40AF";
    urgency = "แนะนำทีมขายเข้าพบด่วนที่สุด";
  } else if (finalScore >= 70) {
    tier = "orange";
    tierLabel = "โอกาสระดับสูง (70-84)";
    tierColor = "#16A34A";
    urgency = "แนะนำนำเสนอแพ็กเกจสินค้า SCG";
  } else if (finalScore >= 50) {
    tier = "yellow";
    tierLabel = "โอกาสปานกลาง (50-69)";
    tierColor = "#CA8A04";
    urgency = "เฝ้าระวังความคืบหน้าหน้างาน";
  } else {
    tier = "yellow";
    tierLabel = "โอกาสเริ่มต้น (<50)";
    tierColor = "#64748B";
    urgency = "รอตรวจจับสัญญาณหน้างานใหม่";
  }

  return {
    score: finalScore,
    rawTotal: result.rawTotal,
    maxRaw: 15,
    tier,
    tierLabel,
    tierColor,
    urgency,
    dimensions: [
      { 
        name: "1. จำนวนโครงการจริง", 
        score: `${result.scoreProj}/5`, 
        weight: "33.3%", 
        desc: `${result.projCount} โครงการ (${result.scoreProj} คะแนน)` 
      },
      { 
        name: "2. สเตจหน้างานก่อสร้าง", 
        score: `${result.scoreStage}/5`, 
        weight: "33.3%", 
        desc: result.scoreStage === 5 ? "เพิ่งเริ่ม/ยกเสาเอก/ฐานราก (5 คะแนน)" : (result.scoreStage === 3 ? "สเตจกลาง/โครงสร้าง (3 คะแนน)" : (result.scoreStage === 1 ? "ใกล้จบงาน/ตกแต่ง (1 คะแนน)" : "ไม่มีโครงการ (0 คะแนน)"))
      },
      { 
        name: "3. ประวัติซื้อกับ SCG", 
        score: `${result.scoreScg}/5`, 
        weight: "33.3%", 
        desc: (result.s25 > 0 && result.s26 > 0) ? "ซื้อทั้งปี 2025 & 2026 (5 คะแนน)" : ((result.s25 > 0 || result.s26 > 0) ? "มียอดซื้อปี 2025 หรือ 2026 (4 คะแนน)" : "ยังไม่เคยมียอดซื้อ (2 คะแนน)")
      }
    ]
  };
}

// ผูกคะแนนเข้ากับ Dataset และจัดลำดับ
function getProcessedCompanies() {
  let companiesSource = (typeof UDON_COMPANIES !== 'undefined') ? UDON_COMPANIES : [];
  
  // ล้างแคชเก่าใน LocalStorage ทันที เพื่อไม่ให้เก็บข้อมูลค้างเมื่อปิดหรือรีเฟรชหน้าเว็บ
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('nextsite_saved_companies');
    localStorage.removeItem('nextsite_saved_detected_count');
    localStorage.removeItem('nextsite_last_synced_time');
  }

  const processed = companiesSource.map(company => {
    // กรองเฉพาะโครงการที่ยังไม่จบงาน (< 98%)
    const activeProjects = (company.projects && Array.isArray(company.projects)) ? company.projects.filter(p => {
      if (!p) return false;
      const txt = (String(p.name || '') + ' ' + String(p.stage || '') + ' ' + String(p.caption || '')).toLowerCase();
      if (txt.includes('ส่งมอบ') || txt.includes('ตรวจรับ') || txt.includes('เสร็จสมบูรณ์') || txt.includes('งวดสุดท้าย') || txt.includes('ทำความสะอาด') || txt.includes('ปิดจ๊อบ') || p.stageKey === 'handover' || p.stageKey === 'completed' || p.progressPercent >= 98) {
        return false;
      }
      return true;
    }) : [];

    const actualProjectsCount = (company.projects && Array.isArray(company.projects)) ? activeProjects.length : (company.totalProjects || 0);
    const scgTargetMillion = (actualProjectsCount * 0.5); // โครงการละ 500,000 บาท = 0.5 ล้านบาท
    const calculatedRevenueText = `฿${scgTargetMillion.toFixed(1)}M`;

    const updatedCompany = {
      ...company,
      projects: activeProjects,
      totalProjects: actualProjectsCount,
      totalValueMillion: scgTargetMillion,
      revenuePotentialText: calculatedRevenueText
    };

    const scoreData = calculateOpportunityScore(updatedCompany);
    return {
      ...updatedCompany,
      opportunityScore: scoreData.score,
      scoreDetails: scoreData
    };
  });

  // จัดอันดับ: บริษัทที่มีประวัติการซื้อขาย 2025 และ 2026 ขึ้นก่อนเสมอ
  processed.sort((a, b) => {
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

    const scoreA = Number(a.opportunityScore) || 0;
    const scoreB = Number(b.opportunityScore) || 0;

    const aProj = a.totalProjects || (a.projects ? a.projects.length : 0);
    const bProj = b.totalProjects || (b.projects ? b.projects.length : 0);

    // 2. ในกลุ่มที่มีประวัติซื้อขาย ให้เรียงตาม Opportunity Score -> จำนวนโครงการ -> ยอดซื้อขาย
    if (hasSalesA === 1 && hasSalesB === 1) {
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      if (bProj !== aProj) {
        return bProj - aProj;
      }
      if (totalSalesB !== totalSalesA) {
        return totalSalesB - totalSalesA;
      }
    }

    // 3. ในกลุ่มที่ไม่มีประวัติซื้อขาย เรียงตาม Opportunity Score -> จำนวนโครงการ -> มูลค่าโครงการ
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    if (bProj !== aProj) {
      return bProj - aProj;
    }
    return (b.totalValueMillion || 0) - (a.totalValueMillion || 0);
  });

  return processed.map((c, idx) => ({
    ...c,
    rank: idx + 1
  }));
}

function calculatePriorityScore(company) {
  if (!company) return 50;
  const res = calculateOpportunityScore(company);
  return res && typeof res.score === 'number' ? res.score : 50;
}

if (typeof window !== 'undefined') {
  window.scoring = {
    calculateOpportunityScore,
    calculatePriorityScore,
    getProcessedCompanies
  };
  window.calculateOpportunityScore = calculateOpportunityScore;
  window.calculatePriorityScore = calculatePriorityScore;
  window.getProcessedCompanies = getProcessedCompanies;
}
