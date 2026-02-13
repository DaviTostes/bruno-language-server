import { DiagnosticSeverity, DiagnosticRelatedInformation } from "vscode-languageserver";
import { DiagnosticCode } from "./constants";

export interface BruCompletionContext {
  lineText: string;
  fullText: string;
  offset: number;
  isInBlock: (blockName: string) => boolean;
}

export interface DiagnosticParams {
  severity: DiagnosticSeverity;
  line: number;
  startChar: number;
  endChar: number;
  message: string;
  code: DiagnosticCode;
  relatedInformation?: DiagnosticRelatedInformation[];
}
