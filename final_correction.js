const fs = require('fs');
const path = require('path');

let html = fs.readFileSync('src/index.html', 'utf8');

// Final Correction Map (Product Codes to exact files)
const correctionMap = {
  'OP-01': 'camisa_op_manga_curta.webp',
  'OP-02': 'camisa_op_manga_longa.webp',
  'OP-03': 'calca_op_reforcada.webp',
  'OP-04': 'calca_jeans_industrial.webp',
  'OP-05': 'macacao_protecao_total.webp',
  'OP-06': 'jaleco_operacional.webp',
  
  'AL-01': 'camiseta_alimentar_pv.webp',
  'AL-02': 'calca_flexivel_sif.webp',
  'AL-03': 'japona_termica.webp',
  'AL-04': 'avental_pvc.webp',
  'AL-05': 'touca_arabe.webp',
  'AL-06': 'jaleco_supervisao.webp',
  
  'SC-01': 'jaleco_saude.webp',
  'SC-02': 'scrub_saude.webp',
  'SC-03': 'calca_saude.webp',
  'SC-04': 'avental_saude.webp',
  
  'CORP-01': 'tricoline_executiva.webp',
  'CORP-02': 'polo_piquet.webp',
  'CORP-03': 'calca_alfaiate.webp',
  'CORP-04': 'saia_executiva.webp',
  
  'ESS-01': 'pv_essencial.webp',
  'ESS-02': 'piquet_essencial.webp',
  'ESS-03': 'calca_essencial.webp'
};

// Replace based on context (Product Code in next line after image)
// We look for patterns like <img src="..."><div class="product-code">CODE</div>
for (const [code, file] of Object.entries(correctionMap)) {
  const regex = new RegExp('(<img src=")[^"]+(" alt="[^"]+" loading="lazy" decoding="async" width="300" height="300"></div>\\s*<div class="hover-hint">Ver Foto</div>\\s*</div>\\s*<div class="product-code">' + code + ')', 'g');
  html = html.replace(regex, '$1assets/img/' + file + '$2');
}

fs.writeFileSync('src/index.html', html);
console.log('Final mapping and swap correction completed.');
