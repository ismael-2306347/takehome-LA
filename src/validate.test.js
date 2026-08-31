import test from 'node:test';
import assert from 'node:assert/strict';
import { validateDomain } from './validate.js';

test('acepta dominios válidos y los normaliza', () => {
  assert.equal(validateDomain('google.com'), 'google.com');
  assert.equal(validateDomain('  GOOGLE.com  '), 'google.com');
  assert.equal(validateDomain('sub.dominio.co.uk'), 'sub.dominio.co.uk');
});

test('rechaza input que no es string', () => {
  assert.throws(() => validateDomain(undefined));
  assert.throws(() => validateDomain(123));
  assert.throws(() => validateDomain(null));
});

test('rechaza input vacío o con formato inválido', () => {
  assert.throws(() => validateDomain(''));
  assert.throws(() => validateDomain('hola mundo'));
  assert.throws(() => validateDomain('google..com'));
});

test('rechaza inputs maliciosos sin ejecutarlos', () => {
  assert.throws(() => validateDomain('; rm -rf /'));
  assert.throws(() => validateDomain('$(whoami)'));
  assert.throws(() => validateDomain('google.com; ls'));
});
