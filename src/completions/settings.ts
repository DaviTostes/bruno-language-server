import { CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';

export const settingsProperties: CompletionItem[] = [
  {
    label: 'encodeUrl',
    kind: CompletionItemKind.Property,
    detail: 'Boolean field to encode the url',
    insertText: 'encodeUrl: true',
  },
  {
    label: 'timeout',
    kind: CompletionItemKind.Property,
    detail: 'Timeout of the request',
    insertText: 'timeout: 0',
  }
];
