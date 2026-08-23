import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(__dirname, 'frontend');
const viteBin = resolve(frontendDir, 'node_modules', '.bin', 'vite');
const viteJs = resolve(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('Building frontend...');
console.log('vite bin exists:', existsSync(viteBin));
console.log('vite.js exists:', existsSync(viteJs));

const cmd = existsSync(viteBin) ? `"${viteBin}" build` : `node "${viteJs}" build`;

try {
  execSync(cmd, {
    cwd: frontendDir,
    stdio: 'inherit',
  });
  console.log('✅ Build completed!');
} catch (err) {
  console.error('❌ Build failed:', err.message);
  process.exit(1);
}
