const fs = require('fs');
let content = fs.readFileSync('src/index.html', 'utf8');

// 1. Substituir extensões para WebP (exceto favicon e parceiros PNG que baixamos como PNG)
// Parceiros que baixamos como PNG: alfred, granhaligas, queijo_sao_vicente, bozel
const pngToKeep = ['alfred', 'granhaligas', 'queijo_sao_vicente', 'bozel', 'amg.svg', 'favicon'];

content = content.replace(/(src|url\()([\"\'\(])([^\"]+?)\.(png|jpg|jpeg)([\"\'\)])/g, (match, p1, p2, p3, p4, p5) => {
    const isExternal = p3.startsWith('http');
    const filename = p3.split('/').pop();
    const shouldKeep = pngToKeep.some(k => filename.includes(k));
    
    if (isExternal || shouldKeep) return match;
    return p1 + p2 + p3 + '.webp' + p5;
});

// 2. Adicionar lazy loading e decoding async em imagens que não o tenham
// Exceto as marcadas com fetchpriority="high"
content = content.replace(/<img (?![^>]*loading=)([^>]+)>/g, (match, p1) => {
    if (p1.includes('fetchpriority="high"')) return match;
    return `<img ${p1} loading="lazy" decoding="async">`;
});

// 3. Adicionar dimensões padrão onde faltar (para evitar CLS)
// Vou focar nos cards de produto que conheço o padrão
content = content.replace(/(<div class=\"product-photo\"><img [^>]+)(>)/g, (match, p1, p2) => {
    if (p1.includes('width=')) return match;
    return `${p1} width="300" height="300"${p2}`;
});

fs.writeFileSync('src/index.html', content);
console.log('HTML updated successfully');
