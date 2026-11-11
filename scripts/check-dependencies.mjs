import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const missing = Object.keys(manifest.dependencies).filter(name => {
  try { return !existsSync(require.resolve(name)); } catch { return true; }
});
if (missing.length) {
  if (!process.argv.includes('--quiet')) {
    process.stderr.write(`\nInstalação incompleta: ${missing.join(', ')}.\nExecute npm install na pasta que contém este package.json e tente novamente.\nNo Windows, você também pode abrir INICIAR-WINDOWS.cmd.\n\n`);
  }
  process.exit(1);
}
