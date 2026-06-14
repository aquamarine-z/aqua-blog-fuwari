import fs from 'fs';
let code = fs.readFileSync(process.argv[2], 'utf8');

// 1. Find the export default { and remove it.
// 2. Change DiagramX: () => { to export const DiagramX = () => {
// 3. Change closing }, to }

code = code.replace(/export\s+default\s*\{/, '');
code = code.replace(/([a-zA-Z0-9_]+):\s*\(\)\s*=>\s*\{/g, 'export const  = () => {');
code = code.replace(/\n\s*\},/g, '\n}');

// remove trailing } at end of file if it exists because of the closed object
code = code.replace(/\}\s*$/, '');

fs.writeFileSync(process.argv[2], code);
