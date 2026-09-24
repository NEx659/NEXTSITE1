/**
 * NEXTSITE AI - Opportunity Scoring Engine (4 Dimensions)
 * คำนวณคะแนนโอกาส 4 มิติหลัก (คะแนนดิบเต็ม 20 แปลงเทียบเป็น 100):
 * 1. จำนวนโครงการ: 0->0, 1-2->2, 3-4->3, 5->4, 6+->5 (Max 5, น้ำหนัก 25%)
 * 2. สเตจหน้างาน: ยกเสาเอก/เซ็นสัญญา/ฐานราก->5, กลางๆ->3, ใกล้จบงาน->1 (Max 5, น้ำหนัก 25%)
 * 3. ประวัติซื้อกับ SCG: ซื้อทั้ง 2025&2026->5, ซื้อ 2025 หรือ 2026->4, ยังไม่เคยซื้อ->2 (Max 5, น้ำหนัก 25%)
 * 4. ฐานข้อมูลรายได้ DBD: >10 ล้าน->5, 5-10 ล้าน->4, 1-5 ล้าน->3, <1 ล้าน->1, 0 หรือไม่มีข้อมูล->0 (Max 5, น้ำหนัก 25%)
 */

// ฐานข้อมูลรายได้ DBD (39 บริษัท)
const DBD_COMPANY_REVENUE_DB = [
  { taxId: "0415553000609", name: "บริษัท โมเดิร์น ดี (อุดรธานี) จำกัด", revenue: 7466601.47 },
  { taxId: "0345561002373", name: "บริษัท ทเวนตี้ซิกซ์ ดีเวลล็อปเมนท์ จำกัด", revenue: 3462579.70 },
  { taxId: "0415558001417", name: "บริษัท มหารุ่งโรจน์โฮมบิลเดอร์ จำกัด", revenue: 17931638.74 },
  { taxId: "0413561000700", name: "ห้างหุ้นส่วนจำกัด บ้านดี-อุดร", revenue: 12673688.53 },
  { taxId: "0105556003032", name: "บริษัท มายด์ โฮม แอสเสท จำกัด", revenue: 15918262.60 },
  { taxId: "0413559001338", name: "ห้างหุ้นส่วนจำกัด ยูดี.โฮมส์ เอ็นจิเนียริ่ง", revenue: 24620601.40 },
  { taxId: "0413567000086", name: "ห้างหุ้นส่วนจำกัด กิจดลวรโชติ1", revenue: 1368560.35 },
  { taxId: "0415563000865", name: "บริษัท สุขสกล ดีเวลลอปเม้นท์ จำกัด", revenue: 15230632.35 },
  { taxId: "0415564000664", name: "บริษัท ทีที ดีไซน์ แอนด์ คอนสตรัคชั่น1991 จำกัด", revenue: 7559296.00 },
  { taxId: "0415565000277", name: "บริษัท บ้านใหญ่ (2016) โฮม บิวเดอร์ จำกัด", revenue: 4699470.96 },
  { taxId: "0415568003692", name: "บริษัท น่าอยู่เฮ้าส์ คอนสตรัคชั่น จำกัด", revenue: 0 },
  { taxId: "0413566001127", name: "ห้างหุ้นส่วนจำกัด บ้านดี อยู่ดี ดีไซน์", revenue: 1401670.25 },
  { taxId: "0415568005300", name: "บริษัท บ้านวิศวะพัฒนา จำกัด", revenue: 8249981.94 },
  { taxId: "0405565005368", name: "บริษัท ดิ โฟร์ เอสเตท จำกัด", revenue: 3039792.53 },
  { taxId: "0413554001119", name: "PP HOUSE CONSTRUCTION & DESIGN", revenue: 46578566.78 },
  { taxId: "0415546000976", name: "ดรีมอัพรับสร้างบ้าน หน้ากองบิน23 Dream Up House", revenue: 14416496.90 },
  { taxId: "0413561000475", name: "ห้างหุ้นส่วนจำกัด ฟ้าสว่างการโยธา", revenue: 3084531.09 },
  { taxId: "0413563002661", name: "ห้างหุ้นส่วนจำกัด การิน บ้านสวย", revenue: 8537661.08 },
  { taxId: "0413550000282", name: "ห้างหุ้นส่วนจำกัด โมเสคดีไซน์ แอนด์ คอนสตรัคชั่น", revenue: 141975407.09 },
  { taxId: "0415567003681", name: "บริษัท นิติพันธ์เฮ้าส์ ยูดี จำกัด", revenue: 1208274.60 },
  { taxId: "0415566000793", name: "บริษัท เอ็นทรัสท คอนสตรัคชั่น จำกัด", revenue: 29728270.04 },
  { taxId: "0415563001713", name: "บริษัท ช.รุ่งอรุณ คอนสตรัคชั่น จำกัด", revenue: 4793617.87 },
  { taxId: "0413562002200", name: "ห้างหุ้นส่วนจำกัด ซีที การก่อสร้าง 2019", revenue: 374603.37 },
  { taxId: "0413550000924", name: "ห้างหุ้นส่วนจำกัด เอสไอ อาร์คิเทคเชอร์ แอนด์ คอนสตรัคชั่น", revenue: 4921837.79 },
  { taxId: "0413565002618", name: "ห้างหุ้นส่วนจำกัด เอสวาย.เฮาส์ ดีไซน์ แอนด์ คอนสตรัคชั่น", revenue: 4751862.63 },
  { taxId: "0415560001950", name: "บริษัท พีรพัฒน์ 999 บิลดิ้ง แอนด์ เซอร์วิสเฮ้าส์ จำกัด", revenue: 5298154.02 },
  { taxId: "0413562000681", name: "ห้างหุ้นส่วนจำกัด ดีเอ็นเอ็น คอนสตรัคชั่น", revenue: 743214.69 },
  { taxId: "0413566001194", name: "ห้างหุ้นส่วนจำกัด เค พี โฮม", revenue: 2060303.59 },
  { taxId: "0413551001037", name: "ห้างหุ้นส่วนจำกัด หล้าก่ำ ทรัพย์เจริญยิ่ง", revenue: 4213667.96 },
  { taxId: "0413562002692", name: "ห้างหุ้นส่วนจำกัด รุ่งรัตน์บิวต์โฮม", revenue: 3304345.42 },
  { taxId: "0413560001800", name: "ห้างหุ้นส่วนจำกัด จีรนันท์ พร็อพเพอร์ตี้", revenue: 2167289.78 },
  { taxId: "0415563000091", name: "บริษัท ป.รุ่งเรือง พีเอสพีเอส จำกัด", revenue: 1200000.82 },
  { taxId: "0413566002531", name: "ห้างหุ้นส่วนจำกัด ฟูเฮ้าส์ อินทีเรีย ดีไซน์", revenue: 1736698.00 },
  { taxId: "0413562002901", name: "ห้างหุ้นส่วนจำกัด คิดดีเฮาส์คอนสตรัคชั่น", revenue: 1423187.36 },
  { taxId: "0415568001088", name: "บริษัท อ.เจริญก่อสร้าง คอนสตรัคชั่น จำกัด", revenue: 482653.99 },
  { taxId: "0413567000639", name: "ห้างหุ้นส่วนจำกัด เอสดี เฮ้าส์ ดีไซน์", revenue: 1363520.85 },
  { taxId: "0415567001301", name: "บริษัท มารีญาก่อสร้าง จำกัด", revenue: 52104.00 },
  { taxId: "0413560001494", name: "ห้างหุ้นส่วนจำกัด เอ็น.พี.โฮมส์ เอ็นจิเนียริ่ง", revenue: 7164528.08 },
  { taxId: "0415567000941", name: "บริษัท อีเฮาส์ คอนสตรัคชั่น แอนด์ ดีไซน์ จำกัด", revenue: 1736653.09 }
];

function normalizeThaiName(str) {
  if (!str) return '';
  return String(str)
    .replace(/บริษัท|ห้างหุ้นส่วนจำกัด|ห้างหุ้นส่วนจํากัด|หจก\.|บจก\.|จำกัด|จํากัด|\(2016\)|\(อุดรธานี\)|หน้ากองบิน23|Dream Up House|PP HOUSE CONSTRUCTION & DESIGN/gi, '')
    .replace(/[\s\.\-\_\(\)]/g, '')
    .toLowerCase();
}

function getCompanyDbdData(comp) {
  if (!comp) return null;
  
  // 1. ตรวจสอบ taxId โดยตรงจาก verificationStatus / taxId / dbdId
  const compTax = (comp.taxId || comp.dbdId || (comp.verificationStatus && comp.verificationStatus.evidenceSource) || '');
  for (const item of DBD_COMPANY_REVENUE_DB) {
    if (compTax.includes(item.taxId)) {
      return item;
    }
  }

  // 2. ตรวจสอบจากชื่อตรงเป๊ะ
  const compName = (comp.name || '').trim();
  for (const item of DBD_COMPANY_REVENUE_DB) {
    if (compName === item.name) {
      return item;
    }
  }

  // 3. ตรวจสอบจากชื่อคลีน (Normalized)
  const normComp = normalizeThaiName(compName);
  for (const item of DBD_COMPANY_REVENUE_DB) {
    const normItem = normalizeThaiName(item.name);
    if (normComp && normItem && (normComp.includes(normItem) || normItem.includes(normComp))) {
      return item;
    }
  }

  return null;
}

function calculateDbdRevenueScore(revenue) {
  const rev = Number(revenue) || 0;
  if (rev > 10000000) return 5;       // มากกว่า 10 ล้าน -> 5
  if (rev >= 5000000) return 4;       // 5 - 10 ล้าน -> 4
  if (rev >= 1000000) return 3;       // 1 - 5 ล้าน -> 3
  if (rev > 0) return 1;              // น้อยกว่า 1 ล้าน -> 1
  return 0;                           // 0 หรือไม่มีข้อมูล -> 0
}

function calculateCompany4DimScore(comp) {
  if (!comp) return { totalScore100: 0, rawTotal: 0, scoreProj: 0, scoreStage: 0, scoreScg: 0, scoreDbd: 0, dbdRevenue: 0 };

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

  // 4. ฐานข้อมูลรายได้ DBD (Max 5)
  const dbdInfo = getCompanyDbdData(comp);
  const dbdRevenue = dbdInfo ? dbdInfo.revenue : (Number(comp.dbdRevenue) || 0);
  const scoreDbd = calculateDbdRevenueScore(dbdRevenue);

  // คำนวณคะแนนรวมดิบ (เต็ม 20) และแปลงเทียบเต็ม 100
  const rawTotal = scoreProj + scoreStage + scoreScg + scoreDbd; // Max 20
  const totalScore100 = Math.round((rawTotal / 20) * 100);

  return {
    totalScore100,
    rawTotal,
    scoreProj,
    scoreStage,
    scoreScg,
    scoreDbd,
    dbdRevenue,
    dbdTaxId: dbdInfo ? dbdInfo.taxId : null,
    projCount,
    s25,
    s26
  };
}

function calculateOpportunityScore(company) {
  const result = calculateCompany4DimScore(company);
  const finalScore = result.totalScore100;

  let tier = "gray";
  let tierLabel = "โอกาสน้อย";
  let tierColor = "#64748B";
  let urgency = "รอตรวจจับสัญญาณหน้างานใหม่";

  if (finalScore >= 75) {
    tier = "green";
    tierLabel = "โอกาสสูง (75-100)";
    tierColor = "#16A34A";
    urgency = "แนะนำทีมขายเข้าพบและนำเสนอสินค้า SCG";
  } else if (finalScore >= 50) {
    tier = "orange";
    tierLabel = "โอกาสปานกลาง (50-74)";
    tierColor = "#EA580C";
    urgency = "เฝ้าระวังความคืบหน้าหน้างานและติดตามสเตจ";
  } else {
    tier = "gray";
    tierLabel = "โอกาสน้อย (0-49)";
    tierColor = "#64748B";
    urgency = "รอตรวจจับสัญญาณหน้างานใหม่";
  }

  const dbdFormattedRev = result.dbdRevenue > 0 
    ? `฿${(result.dbdRevenue / 1000000).toFixed(2)}M (${result.dbdRevenue.toLocaleString('th-TH')} บาท)` 
    : 'ไม่มีรายได้ / ไม่มีในระบบ';

  let dbdDescText = '';
  if (result.scoreDbd === 5) dbdDescText = `รายได้ DBD > 10 ล้าน (${dbdFormattedRev}) - 5 คะแนน`;
  else if (result.scoreDbd === 4) dbdDescText = `รายได้ DBD 5 - 10 ล้าน (${dbdFormattedRev}) - 4 คะแนน`;
  else if (result.scoreDbd === 3) dbdDescText = `รายได้ DBD 1 - 5 ล้าน (${dbdFormattedRev}) - 3 คะแนน`;
  else if (result.scoreDbd === 1) dbdDescText = `รายได้ DBD < 1 ล้าน (${dbdFormattedRev}) - 1 คะแนน`;
  else dbdDescText = `รายได้ 0 หรือไม่มีข้อมูลในระบบ DBD - 0 คะแนน`;

  return {
    score: finalScore,
    rawTotal: result.rawTotal,
    maxRaw: 20,
    tier,
    tierLabel,
    tierColor,
    urgency,
    dbdRevenue: result.dbdRevenue,
    dbdTaxId: result.dbdTaxId,
    dimensions: [
      { 
        name: "1. จำนวนโครงการจริง", 
        score: `${result.scoreProj}/5`, 
        weight: "25%", 
        desc: `${result.projCount} โครงการ (${result.scoreProj} คะแนน)` 
      },
      { 
        name: "2. สเตจหน้างานก่อสร้าง", 
        score: `${result.scoreStage}/5`, 
        weight: "25%", 
        desc: result.scoreStage === 5 ? "เพิ่งเริ่ม/ยกเสาเอก/ฐานราก (5 คะแนน)" : (result.scoreStage === 3 ? "สเตจกลาง/โครงสร้าง (3 คะแนน)" : (result.scoreStage === 1 ? "ใกล้จบงาน/ตกแต่ง (1 คะแนน)" : "ไม่มีโครงการ (0 คะแนน)"))
      },
      { 
        name: "3. ประวัติซื้อกับ SCG", 
        score: `${result.scoreScg}/5`, 
        weight: "25%", 
        desc: (result.s25 > 0 && result.s26 > 0) ? "ซื้อทั้งปี 2025 & 2026 (5 คะแนน)" : ((result.s25 > 0 || result.s26 > 0) ? "มียอดซื้อปี 2025 หรือ 2026 (4 คะแนน)" : "ยังไม่เคยมียอดซื้อ (2 คะแนน)")
      },
      { 
        name: "4. รายได้รวมจาก DBD", 
        score: `${result.scoreDbd}/5`, 
        weight: "25%", 
        desc: dbdDescText
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

    const scoreData = calculateOpportunityScore({
      ...company,
      projects: activeProjects,
      totalProjects: actualProjectsCount
    });

    return {
      ...company,
      projects: activeProjects,
      totalProjects: actualProjectsCount,
      totalValueMillion: scgTargetMillion,
      revenuePotentialText: calculatedRevenueText,
      dbdRevenue: scoreData.dbdRevenue,
      dbdTaxId: scoreData.dbdTaxId,
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

    // 3. ในกลุ่มที่ไม่มีประวัติซื้อขาย เรียงตาม Opportunity Score -> รายได้ DBD -> จำนวนโครงการ -> มูลค่าโครงการ
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    if ((b.dbdRevenue || 0) !== (a.dbdRevenue || 0)) {
      return (b.dbdRevenue || 0) - (a.dbdRevenue || 0);
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
    getProcessedCompanies,
    calculateCompany4DimScore,
    DBD_COMPANY_REVENUE_DB
  };
  window.calculateOpportunityScore = calculateOpportunityScore;
  window.calculatePriorityScore = calculatePriorityScore;
  window.getProcessedCompanies = getProcessedCompanies;
}

