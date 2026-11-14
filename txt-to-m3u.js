const fs = require('fs');

const inputPath = './live.txt';
const outputPath = './live.m3u';

if (!fs.existsSync(inputPath)) {
  console.error(`Missing ${inputPath}`);
  process.exit(1);
}

const lines = fs.readFileSync(inputPath, 'utf8').split(/\r?\n/);
const entries = ['#EXTM3U'];
let group = '未分组';

for (const line of lines) {
  const value = line.trim();
  if (!value || value.startsWith('#')) continue;

  if (value.endsWith(',#genre#')) {
    group = value.slice(0, -',#genre#'.length).trim() || '未分组';
    continue;
  }

  const comma = value.indexOf(',');
  if (comma < 1) continue;

  const name = value.slice(0, comma).trim();
  const url = value.slice(comma + 1).trim();
  if (!name || !/^https?:\/\//i.test(url)) continue;

  const safeName = name.replace(/["\r\n]/g, ' ').trim();
  const safeGroup = group.replace(/["\r\n]/g, ' ').trim();

  entries.push(`#EXTINF:-1 tvg-name="${safeName}" group-title="${safeGroup}",${safeName}`);
  entries.push(url);
}

fs.writeFileSync(outputPath, `${entries.join('\n')}\n`, 'utf8');
console.log(`Generated ${outputPath} with ${Math.floor(entries.length / 2)} channels.`);
