const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const imgDir = 'src/assets/img';

if (!fs.existsSync(imgDir)) {
  console.error('Directory src/assets/img does not exist.');
  process.exit(1);
}

const files = fs.readdirSync(imgDir);

// Identify PNG/JPG files that lack a WebP version
const toConvert = files.filter(f => {
  const ext = path.extname(f).toLowerCase();
  if (['.png', '.jpg', '.jpeg'].includes(ext)) {
    const base = f.slice(0, -ext.length);
    // Only convert if the common base + .webp doesn't exist
    return !fs.readdirSync(imgDir).some(existingFile => existingFile.toLowerCase() === (base.toLowerCase() + '.webp'));
  }
  return false;
});

console.log('Files to convert: ' + toConvert.length);

toConvert.forEach(file => {
  const input = path.join(imgDir, file);
  const ext = path.extname(file);
  const outputBase = file.slice(0, -ext.length);
  const output = path.join(imgDir, outputBase + '.webp');
  
  try {
    console.log('Converting: ' + file);
    // Use npx imagemin-webp-cli for individual files
    // Use quotes for paths in case of unusual characters
    execSync('npx -y imagemin-webp-cli "' + input + '" --out-dir="' + imgDir + '"', { stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to convert: ' + file + ' - ' + err.message);
  }
});

console.log('Conversion process finished.');
