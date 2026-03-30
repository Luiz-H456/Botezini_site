const fs = require('fs');
const path = require('path');

const imgDir = 'src/assets/img';
const html = fs.readFileSync('src/index.html', 'utf8');

const blocks = html.split('<div class="product-card">');
const missing = [];
const found = [];

blocks.slice(1).forEach(block => {
  const imgMatch = block.match(/<img src="assets\/img\/([^\"]+)\"/);
  const codeMatch = block.match(/<div class="product-code">([^<]+)<\/div>/);
  const nameMatch = block.match(/<div class="product-name">([^<]+)<\/div>/);
  
  if (imgMatch && codeMatch) {
    const fileName = imgMatch[1];
    const exists = fs.existsSync(path.join(imgDir, fileName));
    if (exists) {
      found.push({code: codeMatch[1], file: fileName});
    } else {
      missing.push({
        code: codeMatch[1],
        name: nameMatch ? nameMatch[1] : 'Unknown',
        attempted: fileName
      });
    }
  }
});

console.log('--- FINAL AUDIT RESULTS ---');
if (missing.length > 0) {
  missing.forEach(m => {
    console.log(`MISSING: Code ${m.code} (${m.name}) -> ${m.attempted}`);
  });
} else {
  console.log('All product images found successfully!');
}
