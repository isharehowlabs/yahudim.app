import { readFileSync, writeFileSync } from 'fs';

const html = readFileSync('dist/index.html', 'utf8');
const updated = html.replace(/index-[^.]*\.css/g, 'index.generated.css');
writeFileSync('dist/index.html', updated);
console.log('✓ CSS reference updated');
