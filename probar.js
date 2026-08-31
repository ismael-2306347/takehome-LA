import { analyze } from './src/analyze.js';

for (const d of ['google.com', 'example.com', 'dominio-que-no-existe-99xyz.com']) {
  console.log('==', d);
  console.log(JSON.stringify(await analyze(d), null, 2));
}
