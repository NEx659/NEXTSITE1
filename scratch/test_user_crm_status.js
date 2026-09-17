const fs = require('fs');

// Read app.js and index.html to verify function definitions and elements
const appJs = fs.readFileSync('c:/Users/pannipan/Downloads/N/js/app.js', 'utf8');
const indexHtml = fs.readFileSync('c:/Users/pannipan/Downloads/N/index.html', 'utf8');
const sakonHtml = fs.readFileSync('c:/Users/pannipan/Downloads/N/NEX SAKON.html', 'utf8');

console.log('1. Check HTML elements in index.html:');
console.log(' - user-cnt-want-followup:', indexHtml.includes('id="user-cnt-want-followup"'));
console.log(' - user-cnt-following:', indexHtml.includes('id="user-cnt-following"'));
console.log(' - user-filter-want-btn:', indexHtml.includes('id="user-filter-want-btn"'));
console.log(' - user-filter-following-btn:', indexHtml.includes('id="user-filter-following-btn"'));

console.log('\n2. Check HTML elements in NEX SAKON.html:');
console.log(' - user-cnt-want-followup:', sakonHtml.includes('id="user-cnt-want-followup"'));
console.log(' - user-cnt-following:', sakonHtml.includes('id="user-cnt-following"'));

console.log('\n3. Check functions in js/app.js:');
console.log(' - updateUserCrmStatusSummary exists:', appJs.includes('function updateUserCrmStatusSummary()'));
console.log(' - filterByUserCrmStatus exists:', appJs.includes('function filterByUserCrmStatus('));
console.log(' - user-want filter in applyFilters:', appJs.includes("activeFollowupStatusFilter === 'user-want'"));
console.log(' - user-following filter in applyFilters:', appJs.includes("activeFollowupStatusFilter === 'user-following'"));
