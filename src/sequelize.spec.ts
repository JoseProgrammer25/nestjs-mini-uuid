import 'reflect-metadata';
import { DataTypes, type AbstractDataType } from 'sequelize';
import { Column, Model, Sequelize, Table } from 'sequelize-typescript';
import { DEFAULT_LENGTH, UUID_ALPHABET } from './mini-uuid';
import {
  MiniUuidColumn,
  MiniUuidDefault,
  MiniUuidPrimaryColumn,
  miniUuidAttribute,
  miniUuidDefaultValue,
} from './sequelize';

const fakeSqlite3 = {
  Database: class Database {
    serialize() {}
    close() {}
    on() {}
    run() {}
  },
  verbose() {
    return fakeSqlite3;
  },
};

function createSequelize(): Sequelize {
  return new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    dialectModule: fakeSqlite3,
    logging: false,
  });
}

describe('miniUuidDefaultValue', () => {
  it('returns a function that generates an 8-character ID by default', () => {
    const defaultValue = miniUuidDefaultValue();
    expect(typeof defaultValue).toBe('function');

    const id = defaultValue();
    expect(id).toHaveLength(DEFAULT_LENGTH);
    expect(id).toMatch(new RegExp(`^[${UUID_ALPHABET}]+$`));
  });

  it('respects a custom length', () => {
    const defaultValue = miniUuidDefaultValue(12);
    expect(defaultValue()).toHaveLength(12);
  });

  it('generates unique values on each call', () => {
    const defaultValue = miniUuidDefaultValue();
    const ids = new Set(Array.from({ length: 100 }, () => defaultValue()));
    expect(ids.size).toBe(100);
  });
});

describe('miniUuidAttribute', () => {
  it('builds STRING(8) attribute options with a per-instance default', () => {
    const attribute = miniUuidAttribute();
    const type = attribute.type as AbstractDataType;

    expect(type.key).toBe('STRING');
    expect(type.toSql()).toBe('VARCHAR(8)');
    expect(typeof attribute.defaultValue).toBe('function');
    expect(attribute.defaultValue()).toHaveLength(DEFAULT_LENGTH);
  });

  it('supports a custom length', () => {
    const attribute = miniUuidAttribute({ length: 12 });
    expect((attribute.type as AbstractDataType).toSql()).toBe('VARCHAR(12)');
    expect(attribute.defaultValue()).toHaveLength(12);
  });

  it('allows overriding the column type', () => {
    const attribute = miniUuidAttribute({ length: 10, type: DataTypes.CHAR(10) });
    expect((attribute.type as AbstractDataType).toSql()).toBe('CHAR(10)');
    expect(attribute.defaultValue()).toHaveLength(10);
  });

  it('merges additional column options', () => {
    const attribute = miniUuidAttribute({ primaryKey: true, allowNull: false, unique: true });
    expect(attribute.primaryKey).toBe(true);
    expect(attribute.allowNull).toBe(false);
    expect(attribute.unique).toBe(true);
  });
});

describe('sequelize-typescript integration', () => {
  const sequelize = createSequelize();

  @Table({ tableName: 'users' })
  class User extends Model {
    @MiniUuidPrimaryColumn()
    declare id: string;

    @MiniUuidColumn()
    declare name: string;

    @MiniUuidColumn({ length: 12, unique: true })
    declare slug: string;
  }

  @Table({ tableName: 'tokens' })
  class Token extends Model {
    @MiniUuidPrimaryColumn({ length: 16 })
    declare id: string;

    @MiniUuidColumn()
    declare code: string;
  }

  beforeAll(() => {
    sequelize.addModels([User, Token]);
  });

  it('auto-generates the primary key on build()', () => {
    const user = User.build({ name: 'John' });

    expect(user.id).toBeDefined();
    expect(user.id).toHaveLength(DEFAULT_LENGTH);
  });

  it('auto-generates non-primary columns declared with @MiniUuidColumn', () => {
    const user = User.build({ name: 'Jane' });

    expect(user.slug).toBeDefined();
    expect(user.slug).toHaveLength(12);
  });

  it('respects the length configured on the primary column', () => {
    const token = Token.build({});

    expect(token.id).toBeDefined();
    expect(token.id).toHaveLength(16);
    expect(token.code).toHaveLength(DEFAULT_LENGTH);
  });

  it('keeps the primary key flag on the attribute', () => {
    const attributes = User.getAttributes();
    expect(attributes.id.primaryKey).toBe(true);
    expect(attributes.slug.unique).toBe(true);
  });

  it('generates a fresh id for every instance', () => {
    const first = User.build({ name: 'a' });
    const second = User.build({ name: 'b' });

    expect(first.id).not.toBe(second.id);
  });
});

describe('@MiniUuidDefault with @Column', () => {
  const sequelize = createSequelize();

  @Table({ tableName: 'coupons' })
  class Coupon extends Model {
    @MiniUuidDefault(10)
    @Column
    declare code: string;
  }

  beforeAll(() => {
    sequelize.addModels([Coupon]);
  });

  it('applies the generated default value', () => {
    const coupon = Coupon.build({});
    expect(coupon.code).toBeDefined();
    expect(coupon.code).toHaveLength(10);
  });
});

describe('classic sequelize.define', () => {
  const sequelize = createSequelize();

  it('uses miniUuidAttribute as primary key with auto-generated value', () => {
    const User = sequelize.define('User', {
      id: miniUuidAttribute({ primaryKey: true }),
      email: { type: DataTypes.STRING, allowNull: false },
    });

    const user = User.build({ email: 'john@example.com' });

    expect(user.get('id')).toBeDefined();
    expect(user.get('id')).toHaveLength(DEFAULT_LENGTH);
  });
});
