import { resolveAll } from './src/dns.js';

for (const d of ['google.com', 'example.com', 'nxdomain-que-no-existe-1234567.com']) {
  console.log('==', d);
  console.log(JSON.stringify(await resolveAll(d), null, 2));
}
