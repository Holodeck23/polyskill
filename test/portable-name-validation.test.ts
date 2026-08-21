import test from 'node:test';
import assert from 'node:assert/strict';
import { PortableAdapter } from '../src/adapters/portable.js';
import { emptyIR } from '../src/ir.js';

const adapter = new PortableAdapter();

function validateName(name: string) {
  const ir = emptyIR(name);
  ir.identity.description.full = 'A test skill.';
  return adapter.validate(ir);
}

test('accepts numeric-leading portable skill names such as 4up', () => {
  const result = validateName('4up');

  assert.equal(result.ok, true);
  assert.deepEqual(result.issues, []);
});

test('continues rejecting invalid portable skill names', () => {
  for (const name of ['Uppercase', 'has_underscore', 'has space', '']) {
    const result = validateName(name);

    assert.equal(result.ok, false, `expected ${JSON.stringify(name)} to be rejected`);
    assert.ok(
      result.issues.some((issue) => issue.field === 'identity.name'),
      `expected an identity.name issue for ${JSON.stringify(name)}`
    );
  }
});
