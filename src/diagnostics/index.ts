import {
  Diagnostic,
  DiagnosticSeverity,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

const VALID_HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
const VALID_META_TYPES = ['http', 'graphql'];
const REQUIRED_META_FIELDS = ['name', 'type'];

export function validateBruDocument(textDocument: TextDocument): Diagnostic[] {
  const text = textDocument.getText();
  const lines = text.split('\n');
  const diagnostics: Diagnostic[] = [];

  let hasHttpMethod = false;
  let hasMeta = false;
  let currentBlock: string | null = null;
  let blockStartLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine === '') continue;

    const blockMatch = trimmedLine.match(/^(\w+(?::\w+)?)\s*\{/);
    if (blockMatch) {
      currentBlock = blockMatch[1];
      blockStartLine = i;

      if (VALID_HTTP_METHODS.includes(currentBlock)) {
        hasHttpMethod = true;
      }

      if (currentBlock === 'meta') {
        hasMeta = true;
      }

      diagnostics.push(...validateBlockName(currentBlock, i, line));
    }

    if (trimmedLine === '}') {
      if (currentBlock === 'meta') {
        diagnostics.push(...validateMetaBlock(lines, blockStartLine, i));
      }
      currentBlock = null;
    }

    if (currentBlock && !trimmedLine.endsWith('{') && trimmedLine !== '}') {
      diagnostics.push(...validateBlockContent(currentBlock, line, i));
    }

    diagnostics.push(...validateVariableSyntax(line, i));
  }

  if (!hasHttpMethod) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 }
      },
      message: 'Missing HTTP method block (get, post, put, patch, delete)',
      source: 'bruno-lsp'
    });
  }

  if (!hasMeta) {
    diagnostics.push({
      severity: DiagnosticSeverity.Warning,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 }
      },
      message: 'Missing meta block (recommended)',
      source: 'bruno-lsp'
    });
  }

  return diagnostics;
}

function validateBlockName(blockName: string, line: number, lineText: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const validBlocks = [
    ...VALID_HTTP_METHODS,
    'meta',
    'headers',
    'params:query',
    'params:path',
    'body:json',
    'body:xml',
    'body:text',
    'body:form-urlencoded',
    'body:multipart-form',
    'auth:basic',
    'auth:bearer',
    'auth:digest',
    'script:pre-request',
    'script:post-response',
    'tests',
    'assert',
    'vars',
    'docs'
  ];

  if (!validBlocks.includes(blockName)) {
    const startChar = lineText.indexOf(blockName);
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: {
        start: { line, character: startChar },
        end: { line, character: startChar + blockName.length }
      },
      message: `Unknown block type: '${blockName}'`,
      source: 'bruno-lsp'
    });
  }

  return diagnostics;
}

function validateMetaBlock(lines: string[], startLine: number, endLine: number): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const metaContent = lines.slice(startLine + 1, endLine).join('\n');
  const foundFields = new Set<string>();

  for (let i = startLine + 1; i < endLine; i++) {
    const line = lines[i].trim();
    const match = line.match(/^(\w+):\s*(.+)/);

    if (match) {
      const [, field, value] = match;
      foundFields.add(field);

      if (field === 'type' && !VALID_META_TYPES.includes(value.trim())) {
        const startChar = lines[i].indexOf(value);
        diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: i, character: startChar },
            end: { line: i, character: startChar + value.length }
          },
          message: `Invalid meta type: '${value}'. Must be 'http' or 'graphql'`,
          source: 'bruno-lsp'
        });
      }

      if (field === 'seq') {
        const seqValue = parseInt(value.trim());
        if (isNaN(seqValue) || seqValue < 0) {
          const startChar = lines[i].indexOf(value);
          diagnostics.push({
            severity: DiagnosticSeverity.Error,
            range: {
              start: { line: i, character: startChar },
              end: { line: i, character: startChar + value.length }
            },
            message: 'Sequence number must be a positive integer',
            source: 'bruno-lsp'
          });
        }
      }
    }
  }

  for (const required of REQUIRED_META_FIELDS) {
    if (!foundFields.has(required)) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: startLine, character: 0 },
          end: { line: startLine, character: 4 }
        },
        message: `Missing required field in meta block: '${required}'`,
        source: 'bruno-lsp'
      });
    }
  }

  return diagnostics;
}

function validateBlockContent(blockName: string, line: string, lineNum: number): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const trimmed = line.trim();

  if (VALID_HTTP_METHODS.includes(blockName)) {
    const urlMatch = trimmed.match(/^url:\s*(.+)/);
    if (urlMatch) {
      const url = urlMatch[1].trim();
      if (!isValidUrl(url)) {
        const startChar = line.indexOf(url);
        diagnostics.push({
          severity: DiagnosticSeverity.Warning,
          range: {
            start: { line: lineNum, character: startChar },
            end: { line: lineNum, character: startChar + url.length }
          },
          message: 'Invalid URL format',
          source: 'bruno-lsp'
        });
      }
    }
  }

  if (blockName === 'headers') {
    if (trimmed && !trimmed.startsWith('~') && !trimmed.includes(':')) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: 0 },
          end: { line: lineNum, character: line.length }
        },
        message: 'Invalid header format. Expected: "Header-Name: value"',
        source: 'bruno-lsp'
      });
    }
  }

  if (blockName.startsWith('body:json')) {
    if (trimmed && !trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"')) {
      try {
        JSON.parse(trimmed);
      } catch (e) {
        diagnostics.push({
          severity: DiagnosticSeverity.Warning,
          range: {
            start: { line: lineNum, character: 0 },
            end: { line: lineNum, character: line.length }
          },
          message: 'Invalid JSON syntax',
          source: 'bruno-lsp'
        });
      }
    }
  }

  return diagnostics;
}

function validateVariableSyntax(line: string, lineNum: number): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const variableRegex = /\{\{([^}]*)\}\}/g;
  let match;

  while ((match = variableRegex.exec(line)) !== null) {
    const variableName = match[1].trim();

    if (variableName === '') {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: match.index },
          end: { line: lineNum, character: match.index + match[0].length }
        },
        message: 'Empty variable reference',
        source: 'bruno-lsp'
      });
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableName)) {
      diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range: {
          start: { line: lineNum, character: match.index },
          end: { line: lineNum, character: match.index + match[0].length }
        },
        message: `Invalid variable name: '${variableName}'. Use alphanumeric and underscores only`,
        source: 'bruno-lsp'
      });
    }
  }

  return diagnostics;
}

function isValidUrl(url: string): boolean {
  if (url.startsWith('{{') && url.endsWith('}}')) {
    return true;
  }

  try {
    new URL(url);
    return true;
  } catch {
    return url.startsWith('http://') || url.startsWith('https://');
  }
}
