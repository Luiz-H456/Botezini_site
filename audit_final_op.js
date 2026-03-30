const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('src/index.html', 'utf8');
const blocks = html.split('<div class="product-card">');
const operacional = [];

blocks.slice(1).forEach(block => {
  const imgMatch = block.match(/<img src="([^"]+)"/);
  const codeMatch = block.match(/<div class="product-code">([^<]+)<\/div>/);
  
  if (imgMatch && codeMatch && codeMatch[1].startsWith('OP-')) {
    const fileName = imgMatch[1];
    const absPath = path.join('src', ...fileName.split('/'));
    const exists = fs.existsSync(absPath);
    operacional.push({
        code: codeMatch[1],
        file: fileName,
        exists: exists,
        fullPath: absPath
    });
  }
});

console.log('--- FINAL OPERACIONAL LINE AUDIT ---');
operacional.forEach(m => {
  console.log(`Code: ${m.code} | File: ${m.file} | Status: ${m.exists ? 'OK' : '404'}`);
});
