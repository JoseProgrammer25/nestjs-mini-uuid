import { Injectable, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MiniUuidModule } from './mini-uuid.module';
import { MiniUuidService } from './mini-uuid.service';
import { DEFAULT_LENGTH } from './mini-uuid';

@Injectable()
class ConsumerService {
  constructor(readonly miniUuid: MiniUuidService) {}
}

@Module({ providers: [ConsumerService] })
class ConsumerModule {}

describe('MiniUuidModule', () => {
  it('provides MiniUuidService through the root dynamic module', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MiniUuidModule.forRoot()],
    }).compile();

    const service = moduleRef.get(MiniUuidService);
    expect(service).toBeInstanceOf(MiniUuidService);
    expect(service.generate()).toHaveLength(DEFAULT_LENGTH);

    await moduleRef.close();
  });

  it('resolves MiniUuidService in a consumer module without importing it (global)', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [MiniUuidModule.forRoot(), ConsumerModule],
    }).compile();

    const consumer = moduleRef.get(ConsumerService);
    expect(consumer.miniUuid).toBeInstanceOf(MiniUuidService);
    expect(consumer.miniUuid.generate(12)).toHaveLength(12);

    await moduleRef.close();
  });
});
