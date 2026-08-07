import { DEFAULT_LENGTH, UUID_ALPHABET, generateMiniUuid } from './mini-uuid';

describe('generateMiniUuid', () => {
  it('generates an 8-character ID by default', () => {
    const id = generateMiniUuid();
    expect(id).toHaveLength(DEFAULT_LENGTH);
  });

  it('respects a custom length', () => {
    expect(generateMiniUuid(16)).toHaveLength(16);
    expect(generateMiniUuid(0)).toHaveLength(0);
  });

  it('only uses characters from the alphabet', () => {
    const id = generateMiniUuid(64);
    for (const char of id) {
      expect(UUID_ALPHABET).toContain(char);
    }
  });

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateMiniUuid()));
    expect(ids.size).toBe(1000);
  });
});
