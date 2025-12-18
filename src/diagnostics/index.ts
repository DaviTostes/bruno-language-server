import {
  Diagnostic,
  DiagnosticSeverity,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { checkDuplicateBlocks } from './duplicates';
import {
  HTTP_METHODS,
  VALID_META_TYPES,
  REQUIRED_META_FIELDS,
  VALID_BLOCKS,
  DiagnosticCode,
} from '../constants';
import { createDiagnostic, createSimpleDiagnostic } from '../utils/diagnostics';

export function validateBruDocument(textDocument: TextDocument): Diagnostic[] {
  const text = textDocument.getText();
  const lines = text.split('\n');
  const diagnostics: Diagnostic[] = [];

  diagnostics.push(...checkDuplicateBlocks(lines, textDocument.uri));

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

      if (HTTP_METHODS.includes(currentBlock as any)) {
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
    diagnostics.push(
      createSimpleDiagnostic(
        DiagnosticSeverity.Error,
        0,
        'Missing HTTP method block (get, post, put, patch, delete)',
        DiagnosticCode.MissingHttpMethod
      )
    );
  }

  if (!hasMeta) {
    diagnostics.push(
      createSimpleDiagnostic(
        DiagnosticSeverity.Warning,
        0,
        'Missing meta block (recommended)',
        DiagnosticCode.MissingMeta
      )
    );
  }

  return diagnostics;
}

function validateBlockName(blockName: string, line: number, lineText: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  if (!VALID_BLOCKS.includes(blockName as any)) {
    const startChar = lineText.indexOf(blockName);
    diagnostics.push(
      createDiagnostic({
        severity: DiagnosticSeverity.Error,
        line,
        startChar,
        endChar: startChar + blockName.length,
        message: `Unknown block type: '${blockName}'`,
        code: DiagnosticCode.UnknownBlock,
      })
    );
  }

  return diagnostics;
}

function validateMetaBlock(lines: string[], startLine: number, endLine: number): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const foundFields = new Set<string>();

  for (let i = startLine + 1; i < endLine; i++) {
    const line = lines[i].trim();
    const match = line.match(/^(\w+):\s*(.+)/);
    
    if (match) {
      const [, field, value] = match;
      foundFields.add(field);

      if (field === 'type' && !VALID_META_TYPES.includes(value.trim() as any)) {
        const startChar = lines[i].indexOf(value);
        diagnostics.push(
          createDiagnostic({
            severity: DiagnosticSeverity.Error,
            line: i,
            startChar,
            endChar: startChar + value.length,
            message: `Invalid meta type: '${value}'. Must be 'http' or 'graphql'`,
            code: DiagnosticCode.InvalidMetaType,
          })
        );
      }

      if (field === 'seq') {
        const seqValue = parseInt(value.trim());
        if (isNaN(seqValue) || seqValue < 0) {
          const startChar = lines[i].indexOf(value);
          diagnostics.push(
            createDiagnostic({
              severity: DiagnosticSeverity.Error,
              line: i,
              startChar,
              endChar: startChar + value.length,
              message: 'Sequence number must be a positive integer',
              code: DiagnosticCode.InvalidSeq,
            })
          );
        }
      }
    }
  }

  for (const required of REQUIRED_META_FIELDS) {
    if (!foundFields.has(required)) {
      diagnostics.push(
        createDiagnostic({
          severity: DiagnosticSeverity.Error,
          line: startLine,
          startChar: 0,
          endChar: 4,
          message: `Missing required field in meta block: '${required}'`,
          code: DiagnosticCode.MissingMetaField,
        })
      );
    }
  }

  return diagnostics;
}

function validateBlockContent(blockName: string, line: string, lineNum: number): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const trimmed = line.trim();

  if (HTTP_METHODS.includes(blockName as any)) {
    const urlMatch = trimmed.match(/^url:\s*(.+)/);
    if (urlMatch) {
      const url = urlMatch[1].trim();
      if (!isValidUrl(url)) {
        const startChar = line.indexOf(url);
        diagnostics.push(
          createDiagnostic({
            severity: DiagnosticSeverity.Warning,
            line: lineNum,
            startChar,
            endChar: startChar + url.length,
            message: 'Invalid URL format',
            code: DiagnosticCode.InvalidUrl,
          })
        );
      }
    }
  }

  if (blockName === 'headers') {
    if (trimmed && !trimmed.startsWith('~') && !trimmed.includes(':')) {
      diagnostics.push(
        createDiagnostic({
          severity: DiagnosticSeverity.Error,
          line: lineNum,
          startChar: 0,
          endChar: line.length,
          message: 'Invalid header format. Expected: "Header-Name: value"',
          code: DiagnosticCode.InvalidHeader,
        })
      );
    }
  }

  if (blockName.startsWith('body:json')) {
    if (trimmed && !trimmed.startsWith('{') && !trimmed.startsWith('[') && !trimmed.startsWith('"')) {
      try {
        JSON.parse(trimmed);
      } catch (e) {
        diagnostics.push(
          createDiagnostic({
            severity: DiagnosticSeverity.Warning,
            line: lineNum,
            startChar: 0,
            endChar: line.length,
            message: 'Invalid JSON syntax',
            code: DiagnosticCode.InvalidJson,
          })
        );
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
      diagnostics.push(
        createDiagnostic({
          severity: DiagnosticSeverity.Error,
          line: lineNum,
          startChar: match.index,
          endChar: match.index + match[0].length,
          message: 'Empty variable reference',
          code: DiagnosticCode.EmptyVariable,
        })
      );
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(variableName)) {
      diagnostics.push(
        createDiagnostic({
          severity: DiagnosticSeverity.Warning,
          line: lineNum,
          startChar: match.index,
          endChar: match.index + match[0].length,
          message: `Invalid variable name: '${variableName}'. Use alphanumeric and underscores only`,
          code: DiagnosticCode.InvalidVariable,
        })
      );
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
