import 'reflect-metadata';
import { DataTypes } from 'sequelize';
import { Column, Model, PrimaryKey, Sequelize, Table } from 'sequelize-typescript';
import { DEFAULT_LENGTH } from './mini-uuid';
import {
  MiniUuidColumn,
  MiniUuidDefault,
  MiniUuidPrimaryColumn,
  miniUuidAttribute,
} from './sequelize';

describe('sequelize-typescript integration (sqlite in-memory)', () => {
  @Table({ tableName: 'users', timestamps: false })
  class User extends Model {
    @MiniUuidPrimaryColumn()
    declare id: string;

    @MiniUuidColumn()
    declare name: string;

    @MiniUuidColumn({ length: 12, unique: true })
    declare slug: string;
  }

  @Table({ tableName: 'tokens', timestamps: false })
  class Token extends Model {
    @MiniUuidPrimaryColumn({ length: 16 })
    declare id: string;

    @MiniUuidDefault(10)
    @Column
    declare code: string;
  }

  @Table({ tableName: 'invites', timestamps: false })
  class Invite extends Model {
    @MiniUuidDefault(10)
    @PrimaryKey
    @Column
    declare code: string;
  }

  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
    sequelize.addModels([User, Token, Invite]);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('auto-generates the primary key when creating a record', async () => {
    const user = await User.create({ name: 'John' });

    expect(user.id).toBeDefined();
    expect(user.id).toHaveLength(DEFAULT_LENGTH);
  });

  it('auto-generates non-primary columns declared with @MiniUuidColumn', async () => {
    const user = await User.create({ name: 'Jane' });

    expect(user.slug).toBeDefined();
    expect(user.slug).toHaveLength(12);
  });

  it('persists the generated id and retrieves it with findByPk', async () => {
    const user = await User.create({ name: 'Alice' });
    const found = await User.findByPk(user.id);

    expect(found).not.toBeNull();
    expect(found!.id).toBe(user.id);
    expect(found!.name).toBe('Alice');
  });

  it('retrieves the record with findOne using the generated id', async () => {
    const user = await User.create({ name: 'Bob' });
    const found = await User.findOne({ where: { id: user.id } });

    expect(found).not.toBeNull();
    expect(found!.id).toBe(user.id);
    expect(found!.name).toBe('Bob');
  });

  it('generates a unique id for every created record', async () => {
    const a = await User.create({ name: 'u1' });
    const b = await User.create({ name: 'u2' });
    const c = await User.create({ name: 'u3' });

    const ids = [a.id, b.id, c.id];
    expect(new Set(ids).size).toBe(3);
  });

  it('respects custom lengths on primary key and default columns', async () => {
    const token = await Token.create({});

    expect(token.id).toHaveLength(16);
    expect(token.code).toHaveLength(10);
  });

  it('combines @MiniUuidDefault with @PrimaryKey and @Column', async () => {
    const invite = await Invite.create({});
    const found = await Invite.findByPk(invite.code);

    expect(invite.code).toHaveLength(10);
    expect(found).not.toBeNull();
    expect(found!.code).toBe(invite.code);
  });

  it('does not overwrite a manually provided primary key', async () => {
    const manualId = 'MANUAL-ID';
    const user = await User.create({ id: manualId, name: 'Dave' });

    expect(user.id).toBe(manualId);
  });

  it('enforces the unique constraint on the mini uuid column', async () => {
    const slug = 'fixed-slug';
    await User.create({ name: 'x', slug });

    await expect(User.create({ name: 'y', slug })).rejects.toThrow();
  });
});

describe('classic sequelize.define integration (sqlite in-memory)', () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('inserts the generated id via defaultValue on create()', async () => {
    const User = sequelize.define(
      'UserClassicDefault',
      {
        id: miniUuidAttribute({ primaryKey: true }),
        name: { type: DataTypes.STRING, allowNull: false },
      },
      { timestamps: false },
    );
    await User.sync({ force: true });

    const user = await User.create({ name: 'Bob' });

    expect(user.get('id')).toBeDefined();
    expect(String(user.get('id'))).toHaveLength(DEFAULT_LENGTH);
  });

  it('queries the inserted record by its generated id', async () => {
    const User = sequelize.define(
      'UserClassicQuery',
      {
        id: miniUuidAttribute({ primaryKey: true }),
        name: { type: DataTypes.STRING, allowNull: false },
      },
      { timestamps: false },
    );
    await User.sync({ force: true });

    const user = await User.create({ name: 'Carol' });
    const id = String(user.get('id'));

    const byPk = await User.findByPk(id);
    expect(byPk).not.toBeNull();
    expect(String(byPk!.get('id'))).toBe(id);

    const byWhere = await User.findOne({ where: { id } });
    expect(byWhere).not.toBeNull();
    expect(String(byWhere!.get('name'))).toBe('Carol');
  });

  it('generates a distinct id for every row', async () => {
    const User = sequelize.define(
      'UserClassicDistinct',
      {
        id: miniUuidAttribute({ primaryKey: true }),
        name: { type: DataTypes.STRING, allowNull: false },
      },
      { timestamps: false },
    );
    await User.sync({ force: true });

    const a = await User.create({ name: 'a' });
    const b = await User.create({ name: 'b' });
    const c = await User.create({ name: 'c' });

    const ids = [a.get('id'), b.get('id'), c.get('id')].map(String);
    expect(new Set(ids).size).toBe(3);
  });

  it('does not overwrite a manually provided id', async () => {
    const User = sequelize.define(
      'UserClassicManual',
      {
        id: miniUuidAttribute({ primaryKey: true }),
        name: { type: DataTypes.STRING, allowNull: false },
      },
      { timestamps: false },
    );
    await User.sync({ force: true });

    const manualId = 'MANUAL-123';
    const user = await User.create({ id: manualId, name: 'Eve' });

    expect(String(user.get('id'))).toBe(manualId);
  });
});
