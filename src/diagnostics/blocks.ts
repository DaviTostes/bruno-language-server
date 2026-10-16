import { BLOCK_START_PATTERN } from '../constants';

interface BruBlock {
  name: string;
  startLine: number;
  endLine: number;
}

// Headers open a block only outside one, and only a bare `}` at column 0 closes it,
// so JS/JSON braces inside script, tests and docs blocks are never mistaken for headers.
// An unclosed block ends at lines.length.
export function findBlocks(lines: string[]): BruBlock[] {
  const blocks: BruBlock[] = [];
  let open: BruBlock | null = null;

  for (let i = 0; i < lines.length; i++) {
    if (open) {
      if (/^}\s*$/.test(lines[i])) {
        open.endLine = i;
        blocks.push(open);
        open = null;
      }
      continue;
    }

    const match = lines[i].match(BLOCK_START_PATTERN);
    if (match) {
      open = { name: match[1], startLine: i, endLine: lines.length };
    }
  }

  if (open) blocks.push(open);
  return blocks;
}
