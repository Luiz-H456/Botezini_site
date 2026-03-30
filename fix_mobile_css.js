const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Harmonize Carousel Scenes
css = css.replace(/\.pillars-scene\s*\{\s*height:320px;\s*\}/, 
    '.pillars-scene, .var-carousel-scene { height:360px; perspective:1000px; position:relative; overflow:visible; width:100%; display:flex; align-items:center; justify-content:center; touch-action:pan-y; }');

// 2. Harmonize Carousel Cards
css = css.replace(/\.pillar\s*\{\s*width:240px;\s*margin-left:-120px;\s*padding:30px 20px;\s*\}/,
    '.pillar, .var-card { width:240px; position:absolute; left:50%; margin-left:-120px; transition:all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor:pointer; list-style:none; } .pillar { padding:30px 20px; } .var-card { padding:24px 20px; background:var(--ink2); border:1px solid rgba(201,168,76,0.15); border-radius:12px; }');

// 3. Status transforms
css = css.replace(/\.pillar\[data-pos=\"1\"\]\s*\{\s*transform:translateX\(180px\)\s*rotateY\(-15deg\)\s*scale\(0\.8\);\s*\}/,
    '.pillar[data-pos="0"], .var-card[data-pos="0"] { transform:translateX(0) rotateY(0) scale(1); opacity:1; z-index:10; } .pillar[data-pos="1"], .var-card[data-pos="1"] { transform:translateX(180px) rotateY(-15deg) scale(0.85); opacity:0.4; z-index:5; }');

css = css.replace(/\.pillar\[data-pos=\"-1\"\]\s*\{\s*transform:translateX\(-180px\)\s*rotateY\(15deg\)\s*scale\(0\.8\);\s*\}/,
    '.pillar[data-pos="-1"], .var-card[data-pos="-1"] { transform:translateX(-180px) rotateY(15deg) scale(0.85); opacity:0.4; z-index:5; }');

css = css.replace(/\.pillar\[data-pos=\"2\"\]\s*,\s*\.pillar\[data-pos=\"-2\"\]\s*\{\s*opacity:0;\s*pointer-events:none;\s*\}/,
    '.pillar[data-pos="2"], .pillar[data-pos="-2"], .var-card[data-pos="2"], .var-card[data-pos="-2"] { opacity:0; pointer-events:none; z-index:1; }');

// 4. Financial Card
css = css.replace(/\.vs-card\s*\{\s*padding:24px 16px\s*!important;\s*transform:none\s*!important;\s*opacity:1\s*!important;\s*border: 1px solid rgba\(201,168,76,\s*0\.2\)\s*!important;\s*min-height:100%\s*!important;\s*display:flex;\s*flex-direction:column;\s*\}/,
    '.vs-card { padding:24px 16px !important; transform:none !important; opacity:1 !important; border: 1px solid rgba(201,168,76, 0.2) !important; min-height:100% !important; display:flex; flex-direction:column; background:var(--ink3); } .vs-card.tr-dim { opacity:0.85 !important; filter: brightness(1.2) contrast(1.1); }');

// 5. Remove old var-card block
const oldVarBlock = /\/\* Segunda Galeria \(Var-Card\) Mobile \*\/[\s\S]*?\.var-arrow\s*\{\s*display:none\s*!important;\s*\}/;
css = css.replace(oldVarBlock, '/* Carousel 2 Sub-styles */ .var-card-num { font-size:32px; color:var(--gold); } .var-card-title { font-size:18px; line-height:1.2; } .var-card-grid { gap:10px; margin-top:15px; } .var-card-item { padding:8px; gap:8px; background:rgba(255,255,255,0.03); border-radius:6px; } .var-card-icon { width:32px; height:32px; } .var-card-icon svg { width:18px; height:18px; } .var-card-name { font-size:10px; letter-spacing:1px; }');

fs.writeFileSync(cssPath, css);
console.log('Mobile harmonization applied successfully.');
