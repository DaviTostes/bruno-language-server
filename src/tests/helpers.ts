import { TextDocument } from 'vscode-languageserver-textdocument';
import { validateBruDocument } from '../diagnostics';

export function diagnose(text: string) {
  return validateBruDocument(TextDocument.create('file:///test.bru', 'bru', 1, text));
}
