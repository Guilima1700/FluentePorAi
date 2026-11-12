import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const marker = /^(?:<{7}(?: |$)|={7}$|>{7}(?: |$)|\|{7}(?: |$))/;
const extensions = new Set(['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.css', '.json']);
const conflicts = [];
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', '.next-dev', 'out'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (extensions.has(path.extname(entry.name))) {
      readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, index) => {
        if (marker.test(line)) conflicts.push(`${path.relative(process.cwd(), file)}:${index + 1}`);
      });
    }
  }
}
for (const directory of ['app', 'components', 'scripts']) scan(path.resolve(directory));
if (conflicts.length) {
  process.stderr.write(`\nConflitos de Git não resolvidos:\n${conflicts.join('\n')}\nResolva os trechos antes de executar ou publicar o site.\n\n`);
  process.exit(1);
}
