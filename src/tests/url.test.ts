import { test } from 'node:test';
import assert from 'node:assert';
import { diagnose } from './helpers';

const withUrl = (url: string) =>
  `meta {\n  name: T\n  type: http\n  seq: 1\n}\n\nget {\n  url: ${url}\n  body: none\n  auth: none\n}\n`;

const urlErrors = (url: string) =>
  diagnose(withUrl(url)).filter(d => d.message === 'Invalid URL format');

for (const url of ['{{baseUrl}}/path', '{{a}}{{b}}', 'https://x.com/{{id}}']) {
  test(`url with variable is valid: ${url}`, () => {
    assert.strictEqual(urlErrors(url).length, 0);
  });
}

for (const url of ['not a url', 'ftp//bad']) {
  test(`malformed url is reported: ${url}`, () => {
    assert.strictEqual(urlErrors(url).length, 1);
  });
}
