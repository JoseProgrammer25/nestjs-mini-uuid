import * as crypto from 'crypto';

export const DEFAULT_LENGTH = 8;

export const UUID_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export interface MiniUuidOptions {
  length?: number;
}

export function generateMiniUuid(length: number = DEFAULT_LENGTH): string {
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, UUID_ALPHABET.length);
    result += UUID_ALPHABET[randomIndex];
  }

  return result;
}
