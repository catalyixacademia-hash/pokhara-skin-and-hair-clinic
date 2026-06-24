import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const adminDist = path.join(root, 'admin', 'dist');
const target = path.join(root, 'dist', 'admin');

if (!existsSync(adminDist)) {
  console.error('Admin build output not found. Run admin build first.');
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(adminDist, target, { recursive: true });
console.log('Copied admin build to dist/admin');
