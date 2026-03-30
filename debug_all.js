const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(walk(file));
        else results.push(file);
    });
    return results;
}

const allFiles = walk('src');
const images = allFiles.filter(f => f.match(/\.(webp|png|jpg|jpeg)$/));

fs.writeFileSync('debug_all.txt', images.join('\n'));
console.log('List of all ' + images.length + ' image files in src/ saved to debug_all.txt');
