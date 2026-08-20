import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { TOOLS, CATEGORIES } from '../src/catalog.js';
import { SUPPORTED_OPERATIONS, runOperation } from '../src/operations.js';

const expectedModes = new Set(['calculator','generator','transformer','validator','image']);
const supported = new Set(SUPPORTED_OPERATIONS);
const ids = TOOLS.map((tool) => tool.id);
const slugs = TOOLS.map((tool) => tool.slug);

if (TOOLS.length !== 100) throw new Error(`Expected 100 tools, got ${TOOLS.length}`);
if (new Set(ids).size !== 100 || new Set(slugs).size !== 100) throw new Error('Duplicate tool id or slug detected.');
for (let id = 1; id <= 100; id += 1) if (!ids.includes(id)) throw new Error(`Missing tool id ${id}`);
if (CATEGORIES.length !== 10) throw new Error(`Expected 10 categories, got ${CATEGORIES.length}`);

for (const tool of TOOLS) {
  if (!tool.slug || !/^[a-z0-9-]+$/.test(tool.slug)) throw new Error(`Invalid slug: ${tool.id}`);
  if (!tool.title || !tool.description || !tool.category) throw new Error(`Incomplete metadata: ${tool.id}`);
  if (!expectedModes.has(tool.mode)) throw new Error(`Unsupported mode: ${tool.id}/${tool.mode}`);
  if (!supported.has(tool.operation)) throw new Error(`Operation not registered: ${tool.id}/${tool.operation}`);
  if (!Array.isArray(tool.fields) || tool.fields.length === 0) throw new Error(`Missing fields: ${tool.id}`);
  const keys = tool.fields.map((field) => field.key);
  if (new Set(keys).size !== keys.length) throw new Error(`Duplicate field key: ${tool.id}`);
  for (const field of tool.fields) {
    if (!field.key || !field.label || !field.type) throw new Error(`Incomplete field: ${tool.id}`);
    if (field.type === 'select' && (!Array.isArray(field.options) || field.options.length < 1)) throw new Error(`Missing select options: ${tool.id}/${field.key}`);
  }
  if (tool.operation === 'template' && !tool.template) throw new Error(`Missing template: ${tool.id}`);
  if (tool.operation === 'checklist' && (!Array.isArray(tool.checklist) || tool.checklist.length < 1)) throw new Error(`Missing checklist: ${tool.id}`);
  if (tool.mode !== 'image') {
    const values = Object.fromEntries(tool.fields.map((field) => [field.key, field.type === 'checkbox' ? Boolean(field.sample) : field.sample ?? '']));
    const output = runOperation(tool, values);
    if (!output || !output.title) throw new Error(`Empty output: ${tool.id}/${tool.operation}`);
  }
}

for (const file of [
  'src/catalog.js',
  ...Array.from({length:10}, (_, index) => `src/catalog/tools${String(index+1).padStart(2,'0')}.js`),
  'src/operations.js','src/operations/core.js','src/operations/finance.js','src/operations/product.js','src/operations/inventory.js','src/operations/shipping.js','src/operations/crm.js','src/operations/analytics.js',
  'src/portal.js','src/engine.js','scripts/build.mjs'
]) execFileSync(process.execPath, ['--check', file], {stdio:'inherit'});

const operationsSource = readFileSync('src/operations.js','utf8');
for (const operation of new Set(TOOLS.map((tool) => tool.operation))) if (!operationsSource.includes(`'${operation}'`)) throw new Error(`Operation is not connected in operations.js: ${operation}`);
console.log(`Validated ${TOOLS.length} tools, ${CATEGORIES.length} categories, ${new Set(TOOLS.map((tool) => tool.operation)).size} operations, and sample execution.`);
