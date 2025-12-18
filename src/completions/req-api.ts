import {
  CompletionItem,
  CompletionItemKind,
  MarkupKind,
} from 'vscode-languageserver/node';

export const reqProperties: CompletionItem[] = [
  {
    label: 'url',
    kind: CompletionItemKind.Property,
    detail: 'req.url: string',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'The request URL.\n\n```javascript\nconsole.log(req.url);\n```'
    },
  },
  {
    label: 'method',
    kind: CompletionItemKind.Property,
    detail: 'req.method: string',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'HTTP method (GET, POST, etc).\n\n```javascript\nif (req.method === "POST") {\n  // ...\n}\n```'
    },
  },
  {
    label: 'headers',
    kind: CompletionItemKind.Property,
    detail: 'req.headers: object',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Request headers object.\n\n```javascript\nreq.headers["Authorization"] = "Bearer " + token;\n```'
    },
  },
  {
    label: 'body',
    kind: CompletionItemKind.Property,
    detail: 'req.body: any',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Request body.\n\n```javascript\nreq.body.userId = 123;\n```'
    },
  },
];

export const reqMethods: CompletionItem[] = [
  {
    label: 'setUrl',
    kind: CompletionItemKind.Method,
    detail: 'req.setUrl(url): void',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Sets the request URL.\n\n```javascript\nreq.setUrl("https://api.example.com/users");\n```'
    },
  },
  {
    label: 'setMethod',
    kind: CompletionItemKind.Method,
    detail: 'req.setMethod(method): void',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Sets the HTTP method.\n\n```javascript\nreq.setMethod("POST");\n```'
    },
  },
  {
    label: 'setHeader',
    kind: CompletionItemKind.Method,
    detail: 'req.setHeader(name, value): void',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Sets a request header.\n\n```javascript\nreq.setHeader("Content-Type", "application/json");\n```'
    },
  },
  {
    label: 'setBody',
    kind: CompletionItemKind.Method,
    detail: 'req.setBody(body): void',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Sets the request body.\n\n```javascript\nreq.setBody({ name: "John" });\n```'
    },
  },
];
