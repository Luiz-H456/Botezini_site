const fs = require('fs');
let html = fs.readFileSync('src/index.html', 'utf8');

// Force all assets/img/*.extension to .webp
// We match both double and single quotes
html = html.replace(/assets\/img\/([^\.\"]+)\.(png|jpg|jpeg|webp)/g, 'assets/img/$1.webp');
html = html.replace(/assets\/img\/([^\.\']+)\.(png|jpg|jpeg|webp)/g, 'assets/img/$1.webp');

fs.writeFileSync('src/index.html', html);
console.log('Forced 100% WebP migration in index.html.');
