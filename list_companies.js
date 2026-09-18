const fs = require('fs');

const dataStr = fs.readFileSync('js/data.js', 'utf8');
// remove var UDON_COMPANIES =
const jsonStr = dataStr.replace(/^\s*var\s+UDON_COMPANIES\s*=\s*/, '').replace(/;\s*$/, '');
try {
    const companies = JSON.parse(jsonStr);
    console.log('Total companies:', companies.length);
    companies.forEach((c, idx) => {
        console.log(`${idx + 1}. [${c.id}] ${c.name} | ${c.phone} | TotalProjects: ${c.totalProjects}`);
    });
} catch(e) {
    console.error('Parse error:', e.message);
}
