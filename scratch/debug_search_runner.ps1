$code = @"
const fs = require('fs');

const dataJs = fs.readFileSync('js/data.js', 'utf8');
const match = dataJs.match(/var\s+UDON_COMPANIES\s*=\s*(\[[\s\S]*?\]);\s*if/);
const allCompanies = eval(match[1]);

function normalizeSearchText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/หจก\.?/g, '')
    .replace(/ห้างหุ้นส่วนจำกัด/g, '')
    .replace(/บริษัท/g, '')
    .replace(/จำกัด/g, '')
    .replace(/บ\./g, '')
    .replace(/[\s\-\_\(\)\.\,\/\|\+]/g, '');
}

function testSearch(searchQuery) {
  const filtered = allCompanies.filter(comp => {
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
      const matchPhone = (queryPhoneClean && queryPhoneClean.length >= 3 && phoneClean.includes(queryPhoneClean)) || (comp.phone && (comp.phone || '').toLowerCase().includes(rawQ));

      const scgCodeStr = (String(comp.scgCode || '') + ' ' + String(comp.scgCustomerCode || '')).toLowerCase();
      const matchScg = scgCodeStr.includes(rawQ);

      const matchName = rawName.includes(rawQ) || (normQ.length >= 2 && normName.includes(normQ));
      const matchEng = rawEng.includes(rawQ) || (normQ.length >= 2 && normEng.includes(normQ));
      const matchContact = rawContact.includes(rawQ) || (normQ.length >= 2 && normContact.includes(normQ));
      const matchDist = rawDist.includes(rawQ) || (normQ.length >= 2 && normDist.includes(normQ));
      const matchProv = rawProv.includes(rawQ) || (normQ.length >= 2 && normProv.includes(normQ));
      const matchAddr = rawAddr.includes(rawQ) || (normQ.length >= 2 && normAddr.includes(normQ));
      const matchCat = rawCat.includes(rawQ) || (normQ.length >= 2 && normCat.includes(normCat));

      const matchProj = comp.projects && comp.projects.some(p => {
        const pName = (p.name || '').toLowerCase();
        const pLoc = (p.location || '').toLowerCase();
        return pName.includes(rawQ) || pLoc.includes(rawQ) || (normQ.length >= 2 && normalizeSearchText(p.name).includes(normQ)) || (normQ.length >= 2 && normalizeSearchText(p.location).includes(normQ));
      });

      const matchKw = comp.facebookSignal && comp.facebookSignal.detectedKeywords && comp.facebookSignal.detectedKeywords.some(k => k.toLowerCase().includes(rawQ));
      const matchFbPage = comp.facebookSignal && comp.facebookSignal.pageName && comp.facebookSignal.pageName.toLowerCase().includes(rawQ);
      const matchFbCaption = comp.facebookSignal && comp.facebookSignal.caption && comp.facebookSignal.caption.toLowerCase().includes(rawQ);

      if (!matchName && !matchEng && !matchContact && !matchDist && !matchProv && !matchAddr && !matchCat && !matchPhone && !matchScg && !matchProj && !matchKw && !matchFbPage && !matchFbCaption) {
        return false;
      }
    }
    return true;
  });

  return filtered;
}

const tests = [
  'โมเดิร์น ดี',
  'ทเวนตี้ซิกซ์',
  '10523555',
  'กองบิน',
  'หนองหาน',
  'บ้านรักษ์',
  'INT Design',
  '4ESTATE',
  'โมเสค',
  '117',
  'กุดจับ',
  '082 345 8999'
];

tests.forEach(t => {
  const res = testSearch(t);
  console.log(`Query: "${t}" -> Matched: ${res.length} companies:`);
  res.slice(0, 3).forEach(c => console.log(`   - [${c.id}] ${c.name}`));
});
"@

[System.IO.File]::WriteAllText("c:\Users\pannipan\Downloads\N\scratch\debug_search.js", $code, [System.Text.Encoding]::UTF8)
