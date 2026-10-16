import { test } from 'node:test';
import assert from 'node:assert';
import { diagnose } from './helpers';

const withUrl = (url: string) =>
  `meta {\n  name: T\n  type: http\n  seq: 1\n}\n\nget {\n  url: ${url}\n  body: none\n  auth: none\n}\n`;

const msgs = (v: string) => diagnose(withUrl(`https://x.com/${v}`)).map(d => d.message);

for (const v of ['{{process.env.CMS_USERNAME}}', '{{$randomInt}}', '{{base-url}}', '{{cmsUrl}}']) {
  test(`valid variable: ${v}`, () => {
    assert.deepStrictEqual(msgs(v), []);
  });
}

test('empty variable is reported', () => {
  assert.ok(msgs('{{}}').includes('Empty variable reference'));
});

for (const v of ['{{1abc}}', '{{a b}}']) {
  test(`invalid variable name: ${v}`, () => {
    assert.ok(msgs(v).some(m => m.startsWith('Invalid variable name')));
  });
}
