import { test } from 'node:test';
import assert from 'node:assert';
import { diagnose } from './helpers';

const VALID = `meta {
  name: Test
  type: http
  seq: 1
}

get {
  url: https://example.com
  body: none
  auth: none
}
`;

test('minimal valid file yields no diagnostics', () => {
  assert.deepStrictEqual(diagnose(VALID), []);
});

test('missing HTTP method is reported', () => {
  const msgs = diagnose('meta {\n  name: T\n  type: http\n  seq: 1\n}\n').map(d => d.message);
  assert.ok(msgs.some(m => m.includes('Missing HTTP method')));
});

test('unknown top-level block is reported', () => {
  const msgs = diagnose(VALID + '\nfoo {\n  a: b\n}\n').map(d => d.message);
  assert.ok(msgs.some(m => m.includes("Unknown block type: 'foo'")));
});

test('invalid meta type is reported', () => {
  const msgs = diagnose(VALID.replace('type: http', 'type: bogus')).map(d => d.message);
  assert.ok(msgs.some(m => m.includes('Invalid meta type')));
});
