import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

describe('Content Catalog Integrity', () => {
  const contentDir = path.resolve(process.cwd(), 'src/content');

  it('contains all 10 planned launch brands', () => {
    const brands = fs.readdirSync(path.join(contentDir, 'brands'))
      .filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'))
      .map((f) => path.basename(f, path.extname(f)));

    const expectedBrands = [
      'virpil',
      'vkb',
      'winctrl',
      'thrustmaster',
      'logitech',
      'moza',
      'honeycomb',
      'turtle-beach',
      'mfg',
      'slaw',
    ];

    for (const brand of expectedBrands) {
      expect(brands).toContain(brand);
    }
  });

  it('contains at least 80 components across categories', () => {
    const compDir = path.join(contentDir, 'components');
    let componentCount = 0;
    for (const brandDir of fs.readdirSync(compDir)) {
      const fullPath = path.join(compDir, brandDir);
      if (fs.statSync(fullPath).isDirectory()) {
        const files = fs.readdirSync(fullPath).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
        componentCount += files.length;
      }
    }
    expect(componentCount).toBeGreaterThanOrEqual(80);
  });

  it('contains at least 20 bundles', () => {
    const bundleDir = path.join(contentDir, 'bundles');
    let bundleCount = 0;
    for (const brandDir of fs.readdirSync(bundleDir)) {
      const fullPath = path.join(bundleDir, brandDir);
      if (fs.statSync(fullPath).isDirectory()) {
        const files = fs.readdirSync(fullPath).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));
        bundleCount += files.length;
      }
    }
    expect(bundleCount).toBeGreaterThanOrEqual(20);
  });

  it('ensures all bundles reference real components that exist on disk', () => {
    const bundleDir = path.join(contentDir, 'bundles');
    const compDir = path.join(contentDir, 'components');

    for (const brandDir of fs.readdirSync(bundleDir)) {
      const fullPath = path.join(bundleDir, brandDir);
      if (!fs.statSync(fullPath).isDirectory()) continue;

      for (const file of fs.readdirSync(fullPath)) {
        if (!file.endsWith('.yaml') && !file.endsWith('.yml')) continue;
        const text = fs.readFileSync(path.join(fullPath, file), 'utf-8');
        const lines = text.split('\n');
        let inComponents = false;

        for (const line of lines) {
          if (line.trim().startsWith('components:')) {
            inComponents = true;
            continue;
          }
          if (inComponents) {
            if (line.match(/^[a-zA-Z_]/)) {
              inComponents = false;
              continue;
            }
            const match = line.match(/^\s*-\s*([a-zA-Z0-9_\-\/]+)/);
            if (match) {
              const compRef = match[1].trim();
              const compPathYaml = path.join(compDir, `${compRef}.yaml`);
              const compPathYml = path.join(compDir, `${compRef}.yml`);
              const exists = fs.existsSync(compPathYaml) || fs.existsSync(compPathYml);
              expect(exists, `Bundle ${file} references nonexistent component ${compRef}`).toBe(true);
            }
          }
        }
      }
    }
  });
});
