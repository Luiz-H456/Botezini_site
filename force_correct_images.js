const fs = require('fs');
const path = require('path');

const imgDir = 'src/assets/img';
const files = fs.readdirSync(imgDir);

function getBestMatch(baseNames) {
  for (const base of baseNames) {
    if (files.includes(base + '.webp')) return 'assets/img/' + base + '.webp';
    if (files.includes(base + '.png')) return 'assets/img/' + base + '.png';
    if (files.includes(base + '.jpg')) return 'assets/img/' + base + '.jpg';
    if (files.includes(base + '.jpeg')) return 'assets/img/' + base + '.jpeg';
  }
  return null;
}

let html = fs.readFileSync('src/index.html', 'utf8');

// Sectional Mapping
const productMappings = {
  'OP-01': ['camisa_op_manga_curta'],
  'OP-02': ['camisa_op_manga_longa'],
  'OP-03': ['calca_op_reforcada'],
  'OP-04': ['calca_jeans_industrial'],
  'OP-05': ['macacao_protecao_total'],
  'OP-06': ['jaleco_operacional'],
  
  'AL-01': ['camiseta_alimentar_pv', 'malha_pv_alimenticia'],
  'AL-02': ['calca_flexivel_sif', 'calca_alimenticia'],
  'AL-03': ['japona_termica', 'japona_alimenticia'],
  'AL-04': ['avental_pvc', 'avental_pc_-_alimenticio'],
  'AL-05': ['touca_arabe', 'touca_arabe_alimenticio'],
  'AL-06': ['jaleco_supervisao', 'macacao_supervisor_area_limpa'],
  
  'SC-01': ['jaleco_saude'],
  'SC-02': ['scrub_saude'],
  'SC-03': ['calca_saude'],
  'SC-04': ['avental_saude'],
  
  'CORP-01': ['tricoline_executiva'],
  'CORP-02': ['polo_piquet'],
  'CORP-03': ['calca_alfaiate'],
  'CORP-04': ['saia_executiva'],
  
  'ESS-01': ['pv_essencial'],
  'ESS-02': ['piquet_essencial'],
  'ESS-03': ['calca_essencial', 'calca_jeans_essencial']
};

for (const [code, baseNames] of Object.entries(productMappings)) {
  const bestPath = getBestMatch(baseNames);
  if (bestPath) {
    const regex = new RegExp('(<img src=")[^"]+(" alt="[^"]+" loading="lazy" decoding="async" width="300" height="300"></div>\\s*<div class="hover-hint">Ver Foto</div>\\s*</div>\\s*<div class="product-code">' + code + ')', 'g');
    html = html.replace(regex, '$1' + bestPath + '$2');
  }
}

fs.writeFileSync('src/index.html', html);
console.log('Final mapping and extension fallback (webp > png) completed.');
