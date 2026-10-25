import { existsSync, readFileSync } from 'node:fs';
import type { DuelVote } from '../src/lib/fit-duel.ts';

export const VOTES_DIR = 'research-tools/fit-duel';
export const VOTES_FILE = `${VOTES_DIR}/votes.jsonl`;

export function readVotes(): DuelVote[] {
  if (!existsSync(VOTES_FILE)) return [];
  return readFileSync(VOTES_FILE, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}
