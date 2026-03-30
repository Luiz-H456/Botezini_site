const fs = require('fs');
const path = require('path');

const imgDir = 'src/assets/img';
let html = fs.readFileSync('src/index.html', 'utf8');

const imgRegex = /<div class="product-photo"><img src="([^"]+)" alt="([^"]+)"/g;
const codeRegex = /<div class="product-code">([^<]+)<\/div>\s*<div class="product-name">([^<]+)<\/div>/g;

// We'll search for blocks to be precise
const blocks = html.split('<div class="product-card">');
const missing = [];

blocks.slice(1).forEach(block => {
  const imgMatch = block.match(/<img src="([^"]+)"/);
  const codeMatch = block.match(/<div class="product-code">([^<]+)<\/div>/);
  const nameMatch = block.match(/<div class="product-name">([^<]+)<\/div>/);
  
  if (imgMatch && codeMatch) {
    const imgSrc = imgMatch[1];
    const fileName = path.basename(imgSrc);
    if (!fs.existsSync(path.join(imgDir, fileName))) {
      missing.push({
        code: codeMatch[1],
        name: nameMatch ? nameMatch[1] : 'Unknown',
        attempted: fileName
      });
    }
  }
});

if (missing.length > 0) {
  console.log('--- MISSING IMAGES AUDIT ---');
  missing.forEach(m => {
    console.log(`Code: ${m.code} | Name: ${m.name} | Attempted: ${m.attempted}`);
  });
} else {
  console.log('All product images exist in assets/img!');
}
