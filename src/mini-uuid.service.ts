import { Injectable } from '@nestjs/common';
import { DEFAULT_LENGTH, generateMiniUuid } from './mini-uuid';

@Injectable()
export class MiniUuidService {
  /**
   * Genera un identificador corto y criptográficamente seguro.
   * @param length Longitud del string generado (por defecto 8)
   * @returns string Mini UUID seguro
   */
  generate(length: number = DEFAULT_LENGTH): string {
    return generateMiniUuid(length);
  }
}
