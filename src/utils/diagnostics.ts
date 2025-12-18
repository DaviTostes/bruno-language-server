import {
  Diagnostic,
  DiagnosticSeverity,
  DiagnosticRelatedInformation,
} from 'vscode-languageserver/node';
import { DIAGNOSTIC_SOURCE, DiagnosticCode } from '../constants';

interface DiagnosticParams {
  severity: DiagnosticSeverity;
  line: number;
  startChar: number;
  endChar: number;
  message: string;
  code: DiagnosticCode;
  relatedInformation?: DiagnosticRelatedInformation[];
}

export function createDiagnostic(params: DiagnosticParams): Diagnostic {
  return {
    severity: params.severity,
    range: {
      start: { line: params.line, character: params.startChar },
      end: { line: params.line, character: params.endChar }
    },
    message: params.message,
    source: DIAGNOSTIC_SOURCE,
    code: params.code,
    ...(params.relatedInformation && { relatedInformation: params.relatedInformation }),
  };
}

export function createSimpleDiagnostic(
  severity: DiagnosticSeverity,
  line: number,
  message: string,
  code: DiagnosticCode
): Diagnostic {
  return createDiagnostic({
    severity,
    line,
    startChar: 0,
    endChar: 0,
    message,
    code,
  });
}
