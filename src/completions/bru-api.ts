import {
  CompletionItem,
  CompletionItemKind,
  InsertTextFormat,
  MarkupKind,
} from 'vscode-languageserver/node';

export const bruMethods: CompletionItem[] = [
  {
    label: 'setVar',
    kind: CompletionItemKind.Method,
    detail: 'bru.setVar(name, value)',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Sets a request-scoped variable.\n\n```javascript\nbru.setVar("userId", 123);\n```'
    },
    insertText: 'setVar("${1:name}", ${2:value})',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'getVar',
    kind: CompletionItemKind.Method,
    detail: 'bru.getVar(name)',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Gets a request-scoped variable.\n\n```javascript\nconst userId = bru.getVar("userId");\n```'
    },
    insertText: 'getVar("${1:name}")',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'setEnvVar',
    kind: CompletionItemKind.Method,
    detail: 'bru.setEnvVar(name, value)',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Sets an environment variable.\n\n```javascript\nbru.setEnvVar("token", response.token);\n```'
    },
    insertText: 'setEnvVar("${1:name}", ${2:value})',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'getEnvVar',
    kind: CompletionItemKind.Method,
    detail: 'bru.getEnvVar(name)',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Gets an environment variable.\n\n```javascript\nconst token = bru.getEnvVar("token");\n```'
    },
    insertText: 'getEnvVar("${1:name}")',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'setNextRequest',
    kind: CompletionItemKind.Method,
    detail: 'bru.setNextRequest(name)',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Sets the next request to run.\n\n```javascript\nbru.setNextRequest("Login");\n```'
    },
    insertText: 'setNextRequest("${1:requestName}")',
    insertTextFormat: InsertTextFormat.Snippet,
  },
  {
    label: 'sleep',
    kind: CompletionItemKind.Method,
    detail: 'bru.sleep(ms)',
    documentation: {
      kind: MarkupKind.Markdown,
      value: 'Pauses execution for specified milliseconds.\n\n```javascript\nbru.sleep(1000); // wait 1 second\n```'
    },
    insertText: 'sleep(${1:1000})',
    insertTextFormat: InsertTextFormat.Snippet,
  },
];
