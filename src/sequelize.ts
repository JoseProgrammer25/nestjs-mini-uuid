import type { ModelAttributeColumnOptions } from 'sequelize';
import { Column, DataType, Default } from 'sequelize-typescript';
import { DEFAULT_LENGTH, generateMiniUuid } from './mini-uuid';

export type MiniUuidDefaultValue = () => string;

export interface MiniUuidAttributeOptions
  extends Omit<ModelAttributeColumnOptions, 'defaultValue' | 'type'> {
  length?: number;
  type?: ModelAttributeColumnOptions['type'];
}

export interface MiniUuidPrimaryColumnOptions extends MiniUuidAttributeOptions {
  primaryKey?: boolean;
}

export interface MiniUuidAttribute extends ModelAttributeColumnOptions {
  defaultValue: MiniUuidDefaultValue;
}

export function miniUuidDefaultValue(length?: number): MiniUuidDefaultValue {
  return () => generateMiniUuid(length);
}

export function miniUuidAttribute(
  options: MiniUuidAttributeOptions = {},
): MiniUuidAttribute {
  const { length, type = DataType.STRING(length ?? DEFAULT_LENGTH), ...columnOptions } = options;

  return {
    type,
    defaultValue: miniUuidDefaultValue(length),
    ...columnOptions,
  };
}

function buildColumnOptions(
  options: MiniUuidAttributeOptions,
  defaultType: ModelAttributeColumnOptions['type'],
): Partial<ModelAttributeColumnOptions> {
  const { length, type = defaultType, ...columnOptions } = options;

  return {
    type,
    defaultValue: miniUuidDefaultValue(length),
    ...columnOptions,
  };
}

export function MiniUuidColumn(options: MiniUuidAttributeOptions = {}): PropertyDecorator {
  return Column(
    buildColumnOptions(options, DataType.STRING(options.length ?? DEFAULT_LENGTH)),
  ) as PropertyDecorator;
}

export function MiniUuidPrimaryColumn(
  options: MiniUuidPrimaryColumnOptions = {},
): PropertyDecorator {
  const { primaryKey = true, ...rest } = options;

  return Column(
    buildColumnOptions({ ...rest, primaryKey }, DataType.STRING(rest.length ?? DEFAULT_LENGTH)),
  ) as PropertyDecorator;
}

export function MiniUuidDefault(length?: number): PropertyDecorator {
  return Default(miniUuidDefaultValue(length)) as PropertyDecorator;
}
