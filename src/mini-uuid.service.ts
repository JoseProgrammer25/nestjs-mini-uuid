import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class MiniUuidService {
  /**
   * Genera un identificador corto y criptográficamente seguro.
   * @param length Longitud del string generado (por defecto 8)
   * @returns string Mini UUID seguro
   */
  generate(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      result += chars[randomIndex];
    }

    return result;
  }
}