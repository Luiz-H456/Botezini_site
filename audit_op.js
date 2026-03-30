const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('src/index.html', 'utf8');
const blocks = html.split('<div class="product-card">');
const operacional = [];

blocks.slice(1).forEach(block => {
  const imgMatch = block.match(/<img src="([^"]+)"/);
  const codeMatch = block.match(/<div class="product-code">([^<]+)<\/div>/);
  const nameMatch = block.match(/<div class="product-name">([^<]+)<\/div>/);
  
  if (imgMatch && codeMatch && codeMatch[1].startsWith('OP-')) {
    const fileName = imgMatch[1];
    const exists = fs.existsSync(path.join('src', fileName));
    operacional.push({
        code: codeMatch[1],
        name: nameMatch ? nameMatch[1] : 'Unknown',
        file: fileName,
        exists: exists
    });
  }
});

console.log('--- OPERACIONAL LINE AUDIT ---');
operacional.forEach(m => {
  console.log(`Code: ${m.code} | File: ${m.file} | Status: ${m.exists ? 'OK' : '404'}`);
});
