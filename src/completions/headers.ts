import { CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';

export const commonHeaders: CompletionItem[] = [
  { 
    label: 'Content-Type', 
    kind: CompletionItemKind.Property, 
    detail: 'Media type of the resource',
    insertText: 'Content-Type: ${1|application/json,application/xml,text/html,text/plain,multipart/form-data|}',
  },
  { 
    label: 'Authorization', 
    kind: CompletionItemKind.Property, 
    detail: 'Authentication credentials',
    insertText: 'Authorization: ${1|Bearer,Basic|} ${2:token}',
  },
  { 
    label: 'Accept', 
    kind: CompletionItemKind.Property, 
    detail: 'Media types acceptable for the response',
    insertText: 'Accept: ${1:application/json}',
  },
  { 
    label: 'User-Agent', 
    kind: CompletionItemKind.Property,
    detail: 'User agent string',
    insertText: 'User-Agent: ${1:MyApp/1.0}',
  },
  { 
    label: 'Cache-Control', 
    kind: CompletionItemKind.Property,
    detail: 'Caching directives',
    insertText: 'Cache-Control: ${1|no-cache,no-store,max-age=3600|}',
  },
  { 
    label: 'Cookie', 
    kind: CompletionItemKind.Property,
    detail: 'HTTP cookies',
    insertText: 'Cookie: ${1:name}=${2:value}',
  },
  { 
    label: 'X-API-Key', 
    kind: CompletionItemKind.Property,
    detail: 'API key authentication',
    insertText: 'X-API-Key: ${1:your-api-key}',
  },
];
