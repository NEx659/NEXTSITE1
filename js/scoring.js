/**
 * NEXTSITE AI - Opportunity Scoring Engine
 * คำนวณคะแนนโอกาส 0-100 จาก 5 ปัจจัย พร้อมอธิบายเหตุผล
 * 
 * เกณฑ์สี:
 * - สีแดง (> 90 คะแนน) : โอกาสสูงสุด เซลส์ต้องเข้าพบด่วน (โครงการพึ่งเริ่มก่อสร้าง)
 * - สีส้ม (70-89 คะแนน) : โอกาสระดับสูง อยู่ในช่วงวางรากฐาน/ขยายงาน
 * - สีเหลือง (50-69 คะแนน) : โอกาสปานกลาง โครงการอยู่ช่วงกลาง-ปลาย
 */

const SCORING_WEIGHTS = {
  projectVolume: 0.25,      // 25% จำนวนโครงการ & โครงการใหม่ที่พึ่งเริ่ม
  projectValue: 0.25,       // 25% มูลค่าโครงการรวม
  companyGrowth: 0.15,      // 15% การเติบโตของบริษัท
  areaExpansion: 0.15,      // 15% การขยายพื้นที่ดำเนินงาน
  scgProductFit: 0.20       // 20% ความเหมาะสมกับสินค้าของ SCG
};

/**
 * คำนวณคะแนนแต่ละมิติและคะแนนรวม
 * @param {Object} company ข้อมูลบริษัท
 * @returns {Object} ผลการคำนวณและรายละเอียด
 */
function calculateOpportunityScore(company) {
  // 1. คะแนนจำนวนโครงการ (0-100) -> ให้น้ำหนักสูงเป็นพิเศษกับโครงการที่พึ่งเริ่มตอกเสาเข็ม
  let volumeScore = 0;
  const newProjects = company.newProjectsThisMonth || 0;
  const groundbreakCount = (company.stageBreakdown && company.stageBreakdown.groundbreak) || 0;
  const totalProj = company.totalProjects || 1;

  volumeScore = Math.min(100, (totalProj * 8) + (newProjects * 18) + (groundbreakCount * 20));

  // 2. คะแนนมูลค่าโครงการรวม (0-100)
  // อิงจากมูลค่าโครงการ 5M - 70M ใน จ.อุดรธานี
  const valueMil = company.totalValueMillion || 10;
  let valueScore = Math.min(100, Math.round((valueMil / 65) * 100));

  // 3. คะแนนการเติบโตของบริษัท (0-100)
  const growthRate = company.growthRate || 10;
  let growthScore = Math.min(100, Math.round((growthRate / 40) * 100));

  // 4. คะแนนการขยายพื้นที่ดำเนินงาน (0-100)
  let areaScore = 60;
  if (company.areaExpansion.includes("3") || company.areaExpansion.includes("ครอบคลุม") || company.areaExpansion.split(",").length >= 3) {
    areaScore = 95;
  } else if (company.areaExpansion.split(",").length >= 2 || company.areaExpansion.includes("สู่อำเภอ")) {
    areaScore = 82;
  } else {
    areaScore = 65;
  }

  // 5. ความเหมาะสมกับสินค้า SCG (0-100)
  // ถ้ามีโครงการพึ่งเริ่มตอกเสาเข็ม/ฐานราก จะสอดคล้องกับปูนซีเมนต์ไฮดรอลิก & คอนกรีต CPAC สูงสุด (100)
  let scgFitScore = 70;
  if (groundbreakCount >= 2) {
    scgFitScore = 98;
  } else if (groundbreakCount >= 1 || (company.stageBreakdown && company.stageBreakdown.foundation >= 2)) {
    scgFitScore = 88;
  } else if (company.stageBreakdown && company.stageBreakdown.structure >= 2) {
    scgFitScore = 78;
  } else {
    scgFitScore = 60;
  }

  // คำนวณคะแนนรวมถ่วงน้ำหนัก
  const finalScore = Math.round(
    (volumeScore * SCORING_WEIGHTS.projectVolume) +
    (valueScore * SCORING_WEIGHTS.projectValue) +
    (growthScore * SCORING_WEIGHTS.companyGrowth) +
    (areaScore * SCORING_WEIGHTS.areaExpansion) +
    (scgFitScore * SCORING_WEIGHTS.scgProductFit)
  );

  // กำหนดสีและระดับโอกาส
  let tier = "yellow";
  let tierLabel = "โอกาสปานกลาง";
  let tierColor = "#CA8A04";
  let urgency = "ติดตามตามรอบปกติ";

  if (finalScore >= 90) {
    tier = "red";
    tierLabel = "โอกาสสูงสุด (ด่วนที่สุด)";
    tierColor = "#DC2626";
    urgency = "เซลส์ต้องเข้าพบภายใน 24-48 ชม. (โครงการพึ่งเริ่ม)";
  } else if (finalScore >= 70) {
    tier = "orange";
    tierLabel = "โอกาสระดับสูง";
    tierColor = "#EA580C";
    urgency = "เข้าพบภายในสัปดาห์นี้ (ช่วงฐานราก/โครงสร้าง)";
  }

  // สร้างเหตุผลประกอบคะแนน
  const reasons = [];
  if (groundbreakCount > 0) {
    reasons.push(`ตรวจพบงานตอกเสาเข็มใหม่ ${groundbreakCount} โครงการ (ซื้อปูน/คอนกรีตล็อตแรก)`);
  }
  if (valueMil >= 40) {
    reasons.push(`มูลค่าโครงการสะสมสูง ฿${valueMil}M มีกำลังซื้อต่อเนื่อง`);
  }
  if (growthRate >= 25) {
    reasons.push(`อัตราการเติบโตโดดเด่น +${growthRate}% YoY`);
  }
  if (scgFitScore >= 85) {
    reasons.push(`ความเข้ากันได้กับกลุ่มสินค้า SCG Structure & CPAC อยู่ในเกณฑ์สูงมาก`);
  }

  return {
    score: finalScore,
    tier,
    tierLabel,
    tierColor,
    urgency,
    reasons,
    dimensions: [
      { name: "จำนวนโครงการ & โครงการใหม่", score: volumeScore, weight: "25%", desc: `${company.totalProjects} โครงการ (${newProjects} โครงการใหม่)` },
      { name: "มูลค่าโครงการรวม", score: valueScore, weight: "25%", desc: `฿${valueMil} ล้านบาท` },
      { name: "การเติบโตของบริษัท", score: growthScore, weight: "15%", desc: `+${growthRate}% YoY` },
      { name: "การขยายพื้นที่ดำเนินงาน", score: areaScore, weight: "15%", desc: company.areaExpansion },
      { name: "ความเหมาะสมกับสินค้า SCG", score: scgFitScore, weight: "20%", desc: groundbreakCount > 0 ? "ตรงกับปูนไฮดรอลิก/CPAC 100%" : "ตรงกับสินค้าหลังคา/ตกแต่ง" }
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
    const actualProjectsCount = (company.projects && company.projects.length) ? company.projects.length : (company.totalProjects || 0);
    const minSCG = Math.round((company.totalValueMillion || 0) * 0.18 * 10) / 10;
    const maxSCG = Math.round((company.totalValueMillion || 0) * 0.22 * 10) / 10;
    const calculatedRevenueText = `฿${minSCG.toFixed(1)}M - ฿${maxSCG.toFixed(1)}M`;

    const updatedCompany = {
      ...company,
      totalProjects: actualProjectsCount,
      revenuePotentialText: calculatedRevenueText
    };

    const scoreData = calculateOpportunityScore(updatedCompany);
    return {
      ...updatedCompany,
      opportunityScore: actualProjectsCount > 0 ? scoreData.score : (company.growthRate || 50),
      scoreDetails: scoreData
    };
  });

  // จัดอันดับจากคะแนนมากไปน้อย (Rank 1, 2, 3...)
  processed.sort((a, b) => (b.opportunityScore || 0) - (a.opportunityScore || 0));

  return processed.map((c, idx) => ({
    ...c,
    rank: idx + 1
  }));
}
