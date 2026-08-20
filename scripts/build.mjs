import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TOOLS } from '../src/catalog.js';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, 'assets', 'catalog'), { recursive: true });

for (const file of ['catalog.js', 'operations.js', 'portal.js', 'engine.js', 'styles.css']) {
  cpSync(resolve(root, 'src', file), resolve(dist, 'assets', file));
}
cpSync(resolve(root, 'src', 'catalog'), resolve(dist, 'assets', 'catalog'), { recursive: true });

const portal = `<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#f2efe7">
<title>SellerTools | 온라인 판매자 운영 도구 100개</title>
<meta name="description" content="판매가·마진·광고·상품등록·재고·배송·고객응대·매출 운영을 브라우저에서 처리하는 셀러 도구 100개.">
<meta property="og:title" content="SellerTools · 온라인 판매자 운영 도구 100개"><meta property="og:description" content="판매 전 계산부터 배송 후 고객관리까지, 입력 데이터는 현재 브라우저에서 처리합니다."><meta property="og:type" content="website">
<link rel="canonical" href="https://beerandnacho.github.io/SellerTools/"><link rel="stylesheet" href="/SellerTools/assets/styles.css">
</head><body><script type="module" src="/SellerTools/assets/portal.js"></script></body></html>`;
writeFileSync(resolve(dist, 'index.html'), portal);

for (const tool of TOOLS) {
  const directory = resolve(dist, 'tools', tool.slug);
  mkdirSync(directory, { recursive: true });
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    description: tool.description,
    url: `https://beerandnacho.github.io/SellerTools/tools/${tool.slug}/`
  }).replace(/</g, '\\u003c');
  const html = `<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="index,follow"><meta name="theme-color" content="#f2efe7">
<title>${tool.title} | SellerTools</title><meta name="description" content="${tool.description}">
<meta property="og:title" content="${tool.title} | SellerTools"><meta property="og:description" content="${tool.description}"><meta property="og:type" content="website">
<link rel="canonical" href="https://beerandnacho.github.io/SellerTools/tools/${tool.slug}/"><link rel="stylesheet" href="/SellerTools/assets/styles.css">
<script type="application/ld+json">${jsonLd}</script></head><body>
<script>window.SELLER_TOOL_SLUG=${JSON.stringify(tool.slug)};</script><script type="module" src="/SellerTools/assets/engine.js"></script>
</body></html>`;
  writeFileSync(resolve(directory, 'index.html'), html);
}

const urls = [
  'https://beerandnacho.github.io/SellerTools/',
  ...TOOLS.map((tool) => `https://beerandnacho.github.io/SellerTools/tools/${tool.slug}/`)
];
writeFileSync(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((url) => `  <url><loc>${url}</loc><lastmod>2026-08-21</lastmod></url>`)
    .join('\n')}\n</urlset>\n`
);
writeFileSync(
  resolve(dist, 'robots.txt'),
  'User-agent: *\nAllow: /\nSitemap: https://beerandnacho.github.io/SellerTools/sitemap.xml\n'
);
writeFileSync(resolve(dist, '.nojekyll'), '');
writeFileSync(
  resolve(dist, 'manifest.json'),
  JSON.stringify(
    {
      name: 'SellerTools 100',
      count: TOOLS.length,
      categories: [...new Set(TOOLS.map((tool) => tool.category))],
      builtAt: new Date().toISOString()
    },
    null,
    2
  )
);
console.log(`Built SellerTools portal and ${TOOLS.length} independent tool routes.`);
