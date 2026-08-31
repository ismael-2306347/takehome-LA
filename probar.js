import { validateDomain } from './src/validate.js';

const inputs = ['google.com', '  GOOGLE.com  ', '', undefined, '; rm -rf /', '$(whoami)', 'sub.dominio.co.uk', 'google..com'];

for (const i of inputs) {
  try {
    console.log(JSON.stringify(i), '->', validateDomain(i));
  } catch (e) {
    console.log(JSON.stringify(i), '-> ERROR:', e.message);
  }
}
