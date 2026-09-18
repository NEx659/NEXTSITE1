const fs = require('fs');

const data = fs.readFileSync('js/data.js', 'utf8');
const app = fs.readFileSync('js/app.js', 'utf8');

// Find all companies in data.js
const lines = data.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('โมเสค') || line.includes('mosaic') || line.includes('100083320623771')) {
    console.log(`data.js Line ${idx + 1}: ${line}`);
  }
});

// Also check app.js
const appLines = app.split('\n');
appLines.forEach((line, idx) => {
  if (line.includes('โมเสค') || line.includes('mosaic') || line.includes('100083320623771')) {
    console.log(`app.js Line ${idx + 1}: ${line}`);
  }
});
