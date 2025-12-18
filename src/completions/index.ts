import { 
  CompletionItem, 
  TextDocumentPositionParams 
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { bruBlocks } from './blocks';
import { commonHeaders } from './headers';
import { bruMethods } from './bru-api';
import { resProperties, resMethods } from './res-api';
import { reqProperties, reqMethods } from './req-api';

export function getCompletions(
  document: TextDocument,
  position: TextDocumentPositionParams
): CompletionItem[] {
  const text = document.getText();
  const offset = document.offsetAt(position.position);
  const lineText = text.split('\n')[position.position.line];

  const beforeCursor = text.substring(0, offset);
  const lastDot = beforeCursor.lastIndexOf('.');
  
  if (lastDot !== -1) {
    const objectName = getObjectBeforeDot(beforeCursor, lastDot);
    
    if (objectName === 'bru') {
      return bruMethods;
    }
    
    if (objectName === 'res') {
      return [...resProperties, ...resMethods];
    }
    
    if (objectName === 'req') {
      return [...reqProperties, ...reqMethods];
    }
  }

  if (isInScriptBlock(beforeCursor)) {
    const wordBeforeCursor = getWordBeforeCursor(beforeCursor);
    
    if (wordBeforeCursor === 'bru' || wordBeforeCursor === 'res' || wordBeforeCursor === 'req') {
      return [];
    }
    
    return getScriptCompletions();
  }

  if (isInHeadersBlock(text, offset, lineText)) {
    return commonHeaders;
  }

  return bruBlocks;
}

function getObjectBeforeDot(text: string, dotPosition: number): string | null {
  let i = dotPosition - 1;
  
  while (i >= 0 && /[\s\n]/.test(text[i])) {
    i--;
  }
  
  let objectName = '';
  while (i >= 0 && /[a-zA-Z0-9_]/.test(text[i])) {
    objectName = text[i] + objectName;
    i--;
  }
  
  return objectName || null;
}

function getWordBeforeCursor(text: string): string {
  let i = text.length - 1;
  
  while (i >= 0 && /[\s\n]/.test(text[i])) {
    i--;
  }
  
  let word = '';
  while (i >= 0 && /[a-zA-Z0-9_]/.test(text[i])) {
    word = text[i] + word;
    i--;
  }
  
  return word;
}

function isInScriptBlock(text: string): boolean {
  const scriptMatch = text.lastIndexOf('script:');
  if (scriptMatch === -1) return false;
  
  const afterScript = text.substring(scriptMatch);
  const openBrace = afterScript.indexOf('{');
  const closeBrace = afterScript.indexOf('}');
  
  return openBrace !== -1 && (closeBrace === -1 || openBrace < closeBrace);
}

function isInHeadersBlock(fullText: string, offset: number, lineText: string): boolean {
  const beforeCursor = fullText.substring(0, offset);
  const headersMatch = beforeCursor.lastIndexOf('headers {');
  
  if (headersMatch === -1) {
    return false;
  }

  const afterHeaders = beforeCursor.substring(headersMatch);
  const closingBrace = afterHeaders.indexOf('}');

  return closingBrace === -1 || lineText.trim().startsWith('headers {');
}

function getScriptCompletions(): CompletionItem[] {
  return [
    {
      label: 'bru',
      kind: 14,
      detail: 'Bruno API object',
    },
    {
      label: 'res',
      kind: 14,
      detail: 'Response object (post-response only)',
    },
    {
      label: 'req',
      kind: 14,
      detail: 'Request object',
    },
    {
      label: 'console',
      kind: 14,
      detail: 'Console object',
    },
  ];
}
