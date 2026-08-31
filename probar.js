import { lookupRegistrar } from './src/whois.js';

for (const d of ['google.com', 'github.com', 'wikipedia.org', 'ALGO999999RARO.COM']) {
  console.log(d, '->', await lookupRegistrar(d));
}
