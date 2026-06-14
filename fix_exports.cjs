const fs = require('fs');
let code = fs.readFileSync(process.argv[2], 'utf8');

code = code.replace(/export\s+default\s*\{/, '');
code = code.replace(/([a-zA-Z0-9_]+):\s*\(\)\s*=>\s*\{/g, 'export const $1 = () => {');
code = code.replace(/\n\s*\},/g, '\n}');

code = code.replace(/\}\s*$/, '');

fs.writeFileSync(process.argv[2], code);
