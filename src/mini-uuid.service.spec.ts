import { MiniUuidService } from './mini-uuid.service';

describe('MiniUuidService', () => {
  let service: MiniUuidService;

  beforeEach(() => {
    service = new MiniUuidService();
  });

  it('should generate an 8-character ID by default.', () => {
    const id = service.generate();
    expect(id.length).toBe(8);
  });

  it('should generate an ID of the requested length (e.g., 12)', () => {
    const id = service.generate(12);
    expect(id.length).toBe(12);
  });

  it('should generate unique IDs', () => {
    const id1 = service.generate();
    const id2 = service.generate();
    expect(id1).not.toBe(id2);
  });
});