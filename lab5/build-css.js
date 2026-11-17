/* ЛР5: збирає site/css/styles.css + lab4.css + responsive.css в один файл
   site/css/bundle.min.css, додає вендорні префікси та мінімізує.
   Запуск: npm install && npm run build */
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const dir = path.join(__dirname, 'site', 'css');
const sources = ['styles.css', 'lab4.css', 'responsive.css'];
const css = sources.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');

postcss([autoprefixer(), cssnano({ preset: 'default' })])
  .process(css, { from: undefined })
  .then(result => {
    fs.writeFileSync(path.join(dir, 'bundle.min.css'), result.css);
    const kb = n => (n / 1024).toFixed(1) + ' KB';
    console.log(`bundle.min.css: ${kb(Buffer.byteLength(css))} -> ${kb(Buffer.byteLength(result.css))}`);
    result.warnings().forEach(w => console.warn(w.toString()));
  });
