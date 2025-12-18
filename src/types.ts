export interface BruCompletionContext {
  lineText: string;
  fullText: string;
  offset: number;
  isInBlock: (blockName: string) => boolean;
}
