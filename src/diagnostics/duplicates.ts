import {
  Diagnostic,
  DiagnosticSeverity,
} from 'vscode-languageserver/node';
import {
  HTTP_METHODS,
  UNIQUE_BLOCKS,
  BLOCK_START_PATTERN,
  DiagnosticCode,
} from '../constants';
import { createDiagnostic } from '../utils/diagnostics';

interface BlockInfo {
  name: string;
  line: number;
  startChar: number;
  endChar: number;
}

export function checkDuplicateBlocks(
  lines: string[],
  documentUri: string
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const blocks: BlockInfo[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    const blockMatch = trimmed.match(BLOCK_START_PATTERN);
    if (blockMatch) {
      const blockName = blockMatch[1];
      const startChar = line.indexOf(blockName);

      blocks.push({
        name: blockName,
        line: i,
        startChar,
        endChar: startChar + blockName.length,
      });
    }
  }

  const httpMethods = blocks.filter(b =>
    HTTP_METHODS.includes(b.name as any)
  );
  
  if (httpMethods.length > 1) {
    httpMethods.forEach((block, idx) => {
      if (idx > 0) {
        diagnostics.push(
          createDiagnostic({
            severity: DiagnosticSeverity.Error,
            line: block.line,
            startChar: block.startChar,
            endChar: block.endChar,
            message: `Multiple HTTP method blocks found. Only one HTTP method (${httpMethods[0].name}) is allowed per request. First occurrence at line ${httpMethods[0].line + 1}.`,
            code: DiagnosticCode.DuplicateHttpMethod,
          })
        );
      }
    });
  }

  const blockCounts = new Map<string, BlockInfo[]>();
  blocks.forEach(block => {
    if (!blockCounts.has(block.name)) {
      blockCounts.set(block.name, []);
    }
    blockCounts.get(block.name)!.push(block);
  });

  blockCounts.forEach((occurrences, blockName) => {
    if (occurrences.length > 1 && UNIQUE_BLOCKS.has(blockName)) {
      occurrences.forEach((block, idx) => {
        if (idx > 0) {
          diagnostics.push(
            createDiagnostic({
              severity: DiagnosticSeverity.Error,
              line: block.line,
              startChar: block.startChar,
              endChar: block.endChar,
              message: `Duplicate '${blockName}' block. This block can only appear once. First occurrence at line ${occurrences[0].line + 1}.`,
              code: DiagnosticCode.DuplicateBlock,
              relatedInformation: [
                {
                  location: {
                    uri: documentUri,
                    range: {
                      start: { line: occurrences[0].line, character: occurrences[0].startChar },
                      end: { line: occurrences[0].line, character: occurrences[0].endChar },
                    },
                  },
                  message: 'First occurrence here',
                },
              ],
            })
          );
        }
      });
    }
  });

  const bodyBlocks = blocks.filter(b => b.name.startsWith('body:'));
  if (bodyBlocks.length > 1) {
    bodyBlocks.forEach((block, idx) => {
      if (idx > 0) {
        diagnostics.push(
          createDiagnostic({
            severity: DiagnosticSeverity.Error,
            line: block.line,
            startChar: block.startChar,
            endChar: block.endChar,
            message: `Multiple body blocks found. Only one body type is allowed per request. First occurrence at line ${bodyBlocks[0].line + 1}.`,
            code: DiagnosticCode.DuplicateBody,
          })
        );
      }
    });
  }

  const authBlocks = blocks.filter(b => b.name.startsWith('auth:'));
  if (authBlocks.length > 1) {
    authBlocks.forEach((block, idx) => {
      if (idx > 0) {
        diagnostics.push(
          createDiagnostic({
            severity: DiagnosticSeverity.Error,
            line: block.line,
            startChar: block.startChar,
            endChar: block.endChar,
            message: `Multiple auth blocks found. Only one authentication method is allowed per request. First occurrence at line ${authBlocks[0].line + 1}.`,
            code: DiagnosticCode.DuplicateAuth,
          })
        );
      }
    });
  }

  const scriptTypes = new Map<string, BlockInfo[]>();
  blocks
    .filter(b => b.name.startsWith('script:'))
    .forEach(block => {
      if (!scriptTypes.has(block.name)) {
        scriptTypes.set(block.name, []);
      }
      scriptTypes.get(block.name)!.push(block);
    });

  scriptTypes.forEach((occurrences, scriptType) => {
    if (occurrences.length > 1) {
      occurrences.forEach((block, idx) => {
        if (idx > 0) {
          diagnostics.push(
            createDiagnostic({
              severity: DiagnosticSeverity.Error,
              line: block.line,
              startChar: block.startChar,
              endChar: block.endChar,
              message: `Duplicate '${scriptType}' block. Each script type can only appear once. First occurrence at line ${occurrences[0].line + 1}.`,
              code: DiagnosticCode.DuplicateScript,
            })
          );
        }
      });
    }
  });

  return diagnostics;
}
