const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scratch/dataset.json', 'utf8'));
const comp = data.companies.find(c => c.id === 'comp-udon-17' || (c.name && c.name.includes('อีเฮาส์')) || (c.facebook_url && c.facebook_url.includes('esarnthaihouse')));
console.log('Company:', comp ? comp.name : 'Not found', comp ? comp.id : '');
if (comp && comp.posts) {
  comp.posts.forEach((p, idx) => {
    console.log(`\n--- POST #${idx + 1} ---`);
    console.log('ID:', p.id);
    console.log('URL:', p.url);
    console.log('Media:', p.media_count);
    console.log('Text:', p.text);
  });
}
