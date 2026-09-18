const fs = require('fs');

const raw = fs.readFileSync('scratch/dataset.json', 'utf8');
const dataset = JSON.parse(raw);

console.log('Total items:', dataset.length);

const keywords = ['เอสดี', 'SD House', 'sd house', 'SD HOUSE', 'sdhouse', 'SD ดีไซน์', 'เอส ดี'];

const matched = dataset.filter(item => {
  const str = JSON.stringify(item);
  return keywords.some(k => str.includes(k));
});

console.log('Matched items count:', matched.length);

fs.writeFileSync('scratch/sd_posts.json', JSON.stringify(matched, null, 2), 'utf8');

let out = '';
matched.forEach((item, idx) => {
  out += '==================================================\n';
  out += `POST_${idx + 1}\n`;
  out += `TIME: ${item.time || ''}\n`;
  out += `URL: ${item.url || ''}\n`;
  out += `LIKES: ${item.likes || 0} | COMMENTS: ${item.comments || 0} | SHARES: ${item.shares || 0}\n`;
  out += 'TEXT:\n';
  out += `${item.text || ''}\n`;
  out += '==================================================\n\n';
});

fs.writeFileSync('scratch/sd_10posts_clean.txt', out, 'utf8');
console.log('Saved to scratch/sd_10posts_clean.txt');

// Also search in data.js
const dataJsRaw = fs.readFileSync('js/data.js', 'utf8');
const jsonMatch = dataJsRaw.substring(dataJsRaw.indexOf('['), dataJsRaw.lastIndexOf(']') + 1);
const companies = JSON.parse(jsonMatch);

companies.forEach((c, idx) => {
  const s = JSON.stringify(c);
  if (keywords.some(k => s.includes(k))) {
    console.log(`Found in data.js at index ${idx}: ID=${c.id} | Name=${c.name} | Eng=${c.engName}`);
  }
});
