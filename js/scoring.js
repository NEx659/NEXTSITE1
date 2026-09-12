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
  projectVolume: 0.35,      // 35% จำนวนโครงการ & โครงการใหม่
  projectValue: 0.25,       // 25% มูลค่าโครงการรวม
  companyGrowth: 0.10,      // 10% การเติบโตของบริษัท
  areaExpansion: 0.10,      // 10% การขยายพื้นที่ดำเนินงาน
  scgProductFit: 0.20       // 20% ความเหมาะสมกับสินค้า SCG
};

function getExactProjectOpportunityScore(projCount) {
  const count = Number(projCount) || 0;
  if (count <= 0) return 15;
  if (count <= 2) return 35;
  if (count <= 4) return 70;
  if (count <= 6) return 80;
  return 92; // 7 โครงการขึ้นไป
}

/**
 * คำนวณคะแนนแต่ละมิติและคะแนนรวม
 * @param {Object} company ข้อมูลบริษัท
 * @returns {Object} ผลการคำนวณและรายละเอียด
 */
function calculateOpportunityScore(company) {
  const totalProj = (company.projects && Array.isArray(company.projects)) ? company.projects.length : (Number(company.totalProjects) || 0);
  const finalScore = getExactProjectOpportunityScore(totalProj);

  // กำหนดระดับ Tier, สี และคำแนะนำความเร่งด่วนตามเกณฑ์ของคะแนน
  let tier = "yellow";
  let tierLabel = "โอกาสปานกลาง";
  let tierColor = "#64748B";
  let urgency = "ติดตามตามรอบปกติ";

  if (finalScore >= 90) { // 7 โครงการขึ้นไป = 92
    tier = "red";
    tierLabel = "โอกาสสูงสุด (>90)";
    tierColor = "#1E40AF";
    urgency = "แนะนำทีมขายเข้าพบด่วน (ตรวจพบ 7 โครงการขึ้นไป)";
  } else if (finalScore >= 70) { // 3-4 โครงการ = 70, 5-6 โครงการ = 80
    tier = "orange";
    tierLabel = finalScore >= 80 ? "โอกาสระดับสูงมาก (80)" : "โอกาสระดับสูง (70)";
    tierColor = "#16A34A";
    urgency = `แนะนำนำเสนอแพ็กเกจวัสดุโครงสร้าง SCG (${totalProj} โครงการ)`;
  } else if (totalProj > 0) { // 1-2 โครงการ = 35
    tier = "yellow";
    tierLabel = "โอกาสเริ่มต้น (35)";
    tierColor = "#CA8A04";
    urgency = "เฝ้าระวังความคืบหน้าหน้างาน (1-2 โครงการ)";
  } else { // 0 โครงการ = 15
    tier = "yellow";
    tierLabel = "รอตรวจจับไซต์ใหม่ (15)";
    tierColor = "#64748B";
    urgency = "รอตรวจจับโพสต์เปิดหน้างานใหม่จาก Facebook";
  }

  // สร้างคำอธิบายประกอบ
  const reasons = [];
  if (totalProj >= 7) {
    reasons.push(`ตรวจพบไซต์งานก่อสร้างจริง ${totalProj} โครงการ (โอกาสสูงสุด 92 คะแนน)`);
    reasons.push(`มีความต้องการสั่งซื้อวัสดุก่อสร้าง SCG ปริมาณมากต่อเนื่อง`);
  } else if (totalProj >= 5) {
    reasons.push(`ตรวจพบไซต์งานก่อสร้างจริง ${totalProj} โครงการ (โอกาสระดับสูง 80 คะแนน)`);
  } else if (totalProj >= 3) {
    reasons.push(`ตรวจพบไซต์งานก่อสร้างจริง ${totalProj} โครงการ (โอกาสระดับสูง 70 คะแนน)`);
  } else if (totalProj >= 1) {
    reasons.push(`ตรวจพบไซต์งานก่อสร้างจริง ${totalProj} โครงการ (โอกาสเริ่มต้น 35 คะแนน)`);
  } else {
    reasons.push(`ยังไม่พบไซต์งานก่อสร้างใหม่ในรอบนี้ (คะแนนฐาน 15 คะแนน)`);
  }

  const valueMil = company.totalValueMillion || (totalProj * 3.5);

  return {
    score: finalScore,
    tier,
    tierLabel,
    tierColor,
    urgency,
    reasons,
    dimensions: [
      { 
        name: "จำนวนโครงการจริงใน จ.อุดรธานี", 
        score: finalScore, 
        weight: "100%", 
        desc: totalProj > 0 ? `${totalProj} โครงการ (ตรงตามเกณฑ์ ${finalScore} คะแนน)` : `0 โครงการ (คะแนนฐาน 15 คะแนน)` 
      },
      { 
        name: "ประมาณการมูลค่าสินค้า SCG รวม (฿500K/ไซต์)", 
        score: finalScore, 
        weight: "เป้าหมาย", 
        desc: totalProj > 0 ? `฿${(totalProj * 0.5).toFixed(1)}M (${totalProj} โครงการ × ฿500,000)` : `฿0.0M` 
      },
      { 
        name: "การขยายพื้นที่ดำเนินงาน", 
        score: finalScore, 
        weight: "พื้นที่", 
        desc: company.address || `อ.${company.district || 'เมือง'} จ.อุดรธานี` 
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
    const actualProjectsCount = (company.projects && company.projects.length) ? company.projects.length : (company.totalProjects || 0);
    const scgTargetMillion = (actualProjectsCount * 0.5); // โครงการละ 500,000 บาท = 0.5 ล้านบาท
    const calculatedRevenueText = `฿${scgTargetMillion.toFixed(1)}M`;

    const updatedCompany = {
      ...company,
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

  // จัดอันดับ: คะแนน Opportunity Score สูงสุด (92 -> 80 -> 70 -> 35 -> 15) ต้องอยู่บนสุดเสมอ
  processed.sort((a, b) => {
    const scoreA = Number(a.opportunityScore) || 0;
    const scoreB = Number(b.opportunityScore) || 0;

    // 1. คะแนน Opportunity Score สูงสุดอยู่บนสุด
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // 2. ถ้าคะแนนเท่ากัน ให้เรียงตามจำนวนโครงการจริง (มาก -> น้อย)
    const aProj = a.totalProjects || (a.projects ? a.projects.length : 0);
    const bProj = b.totalProjects || (b.projects ? b.projects.length : 0);
    if (bProj !== aProj) {
      return bProj - aProj;
    }

    // 3. เรียงตามมูลค่าโครงการ (มาก -> น้อย)
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
