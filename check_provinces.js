const fs = require('fs');
const content = fs.readFileSync('js/data.js', 'utf8');
const jsonStr = content.replace(/^\s*var\s+UDON_COMPANIES\s*=\s*/, '').replace(/;\s*$/, '');
const companies = JSON.parse(jsonStr);

console.log('Total companies in data.js:', companies.length);

const provMap = {};
const nonUdon = [];

companies.forEach(c => {
  const p = c.province || 'UNKNOWN';
  provMap[p] = (provMap[p] || 0) + 1;
  if (p !== 'อุดรธานี') {
    nonUdon.push(c);
  }
});

console.log('=== Province Breakdown ===');
console.log(provMap);

console.log('=== Companies NOT in อุดรธานี ===');
nonUdon.forEach(c => {
  console.log(`ID: ${c.id} | Name: ${c.name} | Province: ${c.province} | District: ${c.district}`);
});
