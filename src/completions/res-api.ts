import {
  CompletionItem,
  CompletionItemKind,
  MarkupKind,
} from 'vscode-languageserver/node';

export const resProperties: CompletionItem[] = [
  {
    label: 'status',
    kind: CompletionItemKind.Property,
    detail: 'res.status: number',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'HTTP status code of the response.\n\n```javascript\nif (res.status === 200) {\n  // success\n}\n```'
    },
  },
  {
    label: 'statusText',
    kind: CompletionItemKind.Property,
    detail: 'res.statusText: string',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'HTTP status text.\n\n```javascript\nconsole.log(res.statusText); // "OK"\n```'
    },
  },
  {
    label: 'headers',
    kind: CompletionItemKind.Property,
    detail: 'res.headers: object',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Response headers object.\n\n```javascript\nconst contentType = res.headers["content-type"];\n```'
    },
  },
  {
    label: 'body',
    kind: CompletionItemKind.Property,
    detail: 'res.body: any',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Parsed response body (JSON, XML, etc).\n\n```javascript\nconst userId = res.body.data.id;\n```'
    },
  },
  {
    label: 'responseTime',
    kind: CompletionItemKind.Property,
    detail: 'res.responseTime: number',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Response time in milliseconds.\n\n```javascript\nconsole.log(`Took ${res.responseTime}ms`);\n```'
    },
  },
  {
    label: 'size',
    kind: CompletionItemKind.Property,
    detail: 'res.size: number',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Response size in bytes.\n\n```javascript\nconsole.log(`Size: ${res.size} bytes`);\n```'
    },
  },
];

export const resMethods: CompletionItem[] = [
  {
    label: 'getStatus',
    kind: CompletionItemKind.Method,
    detail: 'res.getStatus(): number',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Gets the HTTP status code.\n\n```javascript\nconst status = res.getStatus();\n```'
    },
  },
  {
    label: 'getHeader',
    kind: CompletionItemKind.Method,
    detail: 'res.getHeader(name): string',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Gets a specific response header.\n\n```javascript\nconst token = res.getHeader("authorization");\n```'
    },
  },
  {
    label: 'getBody',
    kind: CompletionItemKind.Method,
    detail: 'res.getBody(): any',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Gets the parsed response body.\n\n```javascript\nconst data = res.getBody();\n```'
    },
  },
];
