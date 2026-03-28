import { Module, DynamicModule } from '@nestjs/common';
import { MiniUuidService } from './mini-uuid.service';

@Module({
  providers: [MiniUuidService],
  exports: [MiniUuidService],
})
export class MiniUuidModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: MiniUuidModule,
      providers: [MiniUuidService],
      exports: [MiniUuidService],
    };
  }
}