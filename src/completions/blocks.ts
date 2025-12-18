import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
} from 'vscode-languageserver/node';

export const bruBlocks: CompletionItem[] = [
  {
    label: 'meta',
    kind: CompletionItemKind.Keyword,
    detail: 'Request metadata',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines metadata for the API request including name, type, and sequence.\n\n```bru\nmeta {\n  name: Get Users\n  type: http\n  seq: 1\n}\n```'
    },
    insertText: 'meta {\n  name: ${1:Request Name}\n  type: ${2|http,graphql|}\n  seq: ${3:1}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'get',
    kind: CompletionItemKind.Method,
    detail: 'HTTP GET request',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines a GET request.\n\n```bru\nget {\n  url: https://api.example.com/users\n  body: none\n  auth: none\n}\n```'
    },
    insertText: 'get {\n  url: ${1:https://api.example.com}\n  body: none\n  auth: none\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'post',
    kind: CompletionItemKind.Method,
    detail: 'HTTP POST request',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines a POST request.\n\n```bru\npost {\n  url: https://api.example.com/users\n  body: json\n  auth: none\n}\n```'
    },
    insertText: 'post {\n  url: ${1:https://api.example.com}\n  body: ${2|json,xml,form-urlencoded,multipart-form|}\n  auth: none\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'put',
    kind: CompletionItemKind.Method,
    detail: 'HTTP PUT request',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines a PUT request for updating resources.'
    },
    insertText: 'put {\n  url: ${1:https://api.example.com}\n  body: ${2|json,xml,form-urlencoded|}\n  auth: none\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'patch',
    kind: CompletionItemKind.Method,
    detail: 'HTTP PATCH request',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines a PATCH request for partial updates.'
    },
    insertText: 'patch {\n  url: ${1:https://api.example.com}\n  body: ${2|json,xml|}\n  auth: none\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'delete',
    kind: CompletionItemKind.Method,
    detail: 'HTTP DELETE request',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines a DELETE request.'
    },
    insertText: 'delete {\n  url: ${1:https://api.example.com}\n  body: none\n  auth: none\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'headers',
    kind: CompletionItemKind.Property,
    detail: 'Request headers',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines HTTP headers for the request.\n\n```bru\nheaders {\n  Content-Type: application/json\n  Authorization: Bearer {{token}}\n}\n```'
    },
    insertText: 'headers {\n  ${1:Content-Type}: ${2:application/json}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'params:query',
    kind: CompletionItemKind.Property,
    detail: 'Query parameters',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines URL query parameters.\n\n```bru\nparams:query {\n  page: 1\n  limit: 10\n}\n```'
    },
    insertText: 'params:query {\n  ${1:key}: ${2:value}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'params:path',
    kind: CompletionItemKind.Property,
    detail: 'Path parameters',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines path parameters for the URL.'
    },
    insertText: 'params:path {\n  ${1:key}: ${2:value}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'body:json',
    kind: CompletionItemKind.Property,
    detail: 'JSON request body',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines a JSON request body.\n\n```bru\nbody:json {\n  "name": "John Doe",\n  "email": "john@example.com"\n}\n```'
    },
    insertText: 'body:json {\n  ${1}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'body:xml',
    kind: CompletionItemKind.Property,
    detail: 'XML request body',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines an XML request body.'
    },
    insertText: 'body:xml {\n  ${1}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'body:text',
    kind: CompletionItemKind.Property,
    detail: 'Plain text request body',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines a plain text request body.'
    },
    insertText: 'body:text {\n  ${1}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'auth:basic',
    kind: CompletionItemKind.Property,
    detail: 'Basic authentication',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'HTTP Basic authentication.\n\n```bru\nauth:basic {\n  username: user\n  password: pass\n}\n```'
    },
    insertText: 'auth:basic {\n  username: ${1:username}\n  password: ${2:password}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'auth:bearer',
    kind: CompletionItemKind.Property,
    detail: 'Bearer token authentication',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Bearer token authentication.\n\n```bru\nauth:bearer {\n  token: {{accessToken}}\n}\n```'
    },
    insertText: 'auth:bearer {\n  token: ${1:{{token}}}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'script:pre-request',
    kind: CompletionItemKind.Function,
    detail: 'Pre-request script',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'JavaScript code executed before the request.\n\n```bru\nscript:pre-request {\n  bru.setVar("timestamp", Date.now());\n}\n```'
    },
    insertText: 'script:pre-request {\n  \n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'script:post-response',
    kind: CompletionItemKind.Function,
    detail: 'Post-response script',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'JavaScript code executed after receiving response.\n\n```bru\nscript:post-response {\n  if (res.status === 200) {\n    bru.setEnvVar("userId", res.body.id);\n  }\n}\n```'
    },
    insertText: 'script:post-response {\n  \n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'tests',
    kind: CompletionItemKind.Function,
    detail: 'Test assertions',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Defines test assertions for the response.\n\n```bru\ntests {\n  test("Status is 200", function() {\n    expect(res.status).to.equal(200);\n  });\n}\n```'
    },
    insertText: 'tests {\n  test("${1:Test name}", function() {\n    expect(${2:res.status}).to.equal(${3:200});\n  });\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'assert',
    kind: CompletionItemKind.Function,
    detail: 'Response assertions',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Assertions for validating responses.'
    },
    insertText: 'assert {\n  ${1}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'vars',
    kind: CompletionItemKind.Variable,
    detail: 'Request variables',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Define local variables for this request.\n\n```bru\nvars {\n  baseUrl: https://api.example.com\n  apiKey: secret123\n}\n```'
    },
    insertText: 'vars {\n  ${1:key}: ${2:value}\n}',
    insertTextFormat: InsertTextFormat.Snippet,
  },
];
