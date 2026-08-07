# NestJS Mini UUID

An extremely lightweight and secure library for generating short, unique identifiers (mini UUIDs) in your NestJS applications. 

Built with zero external dependencies, it uses Node.js' native cryptographic module to guarantee truly random and secure identifiers.

## Features

- **Zero external dependencies:** Keeps your `node_modules` light.
- **Cryptographically secure:** Uses Node.js native `crypto.randomInt`, avoiding the mathematical bias of `Math.random()`.
- **Easy integration:** Global module designed specifically for the NestJS ecosystem.
- **Customizable length:** Generate IDs of the exact size you need (defaults to `8` characters).
- **Sequelize ready:** First-class support for both `sequelize-typescript` decorators and classic `sequelize.define` models.
- **Universal:** Full support for TypeScript, CommonJS (Require), and ESM (Import).

## Installation

You can install the library using your favorite package manager:

```bash
npm install nestjs-mini-uuid
```

## Quick Start

Import the MiniUuidModule into your main module. By using .fortRoot(), the service will be available globally throughout your application.

```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MiniUuidModule } from 'nestjs-mini-uuid';

@Module({
  imports: [
    MiniUuidModule.forRoot(), // Global import
  ],
  controllers: [AppController],
})
export class AppModule {}
```

## Inject and use the Service
Now you can inject the MiniUuidService into any Controller or Service in your application to generate your IDs

```
import { Controller, Get } from '@nestjs/common';
import { MiniUuidService } from 'nestjs-mini-uuid';

@Controller('users')
export class AppController {
  constructor(private readonly miniUuidService: MiniUuidService) {}

  @Get('new-id')
  generateId() {
    // Generates a secure 8-character ID (default)
    const defaultId = this.miniUuidService.generate(); 
    
    // Generates a secure 12-character ID
    const customId = this.miniUuidService.generate(12); 

    return {
      defaultId, // Example: "aB7k9Pq2"
      customId   // Example: "Xm3pF9vL1cR4"
    };
  }
}
```

## API Reference
```
MiniUuidService
```
```
generate(length?: number): string
```
Generates a random alphanumeric string.
- ```length``` (optional): The desired length for the generated ID. The default value is ```8```.
- Returns: A ```string``` with secure random characters (A-Z, a-z, 0-9).

The standalone function ```generateMiniUuid(length?)``` is also exported from the main entry point, so you can use it anywhere (including custom Sequelize defaults) without instantiating the service:

```
import { generateMiniUuid } from 'nestjs-mini-uuid';

generateMiniUuid();    // Example: "aB7k9Pq2"
generateMiniUuid(16);  // Example: "Xm3pF9vL1cR4qT8Zw"
```

## Sequelize Integration

NestJS Mini UUID provides optional, first-class support for **Sequelize** and **sequelize-typescript**. The generated value is registered as a ```defaultValue``` function on the column, so Sequelize evaluates a fresh, unique ID for every new record automatically.

### Installation

Sequelize support is optional and lives in the `nestjs-mini-uuid/sequelize` entry point, keeping the main package dependency-free. Install the peer dependencies you plan to use:

```bash
npm install sequelize sequelize-typescript reflect-metadata
```

### Helpers and decorators

```
import {
  MiniUuidColumn,           // Decorator: column with auto-generated default value
  MiniUuidPrimaryColumn,    // Decorator: primary key column with auto-generated default value
  MiniUuidDefault,          // Decorator: sets the generated value as the default (use with @Column)
  miniUuidAttribute,        // Function: ready-to-use Sequelize attribute options object
  miniUuidDefaultValue,     // Function: returns a () => string generator for defaultValue
} from 'nestjs-mini-uuid/sequelize';
```

### With sequelize-typescript (classes and decorators)

```ts
import { Model, Table } from 'sequelize-typescript';
import {
  MiniUuidPrimaryColumn,
  MiniUuidColumn,
} from 'nestjs-mini-uuid/sequelize';

@Table({ tableName: 'users' })
export class User extends Model {
  @MiniUuidPrimaryColumn()
  declare id: string;

  @MiniUuidPrimaryColumn({ length: 16 })
  declare resetToken: string;

  @MiniUuidColumn()
  declare inviteCode: string;

  @MiniUuidColumn({ length: 12, unique: true })
  declare slug: string;
}
```

The decorators accept any Sequelize column option (`length`, `type`, `unique`, `allowNull`, `comment`, `validate`, ...). If no `type` is provided, a `STRING(length)` column is created.

You can also combine the standard `@Column` decorator with `@MiniUuidDefault`. Note the order: `@MiniUuidDefault` must be **above** `@Column`:

```ts
import { Column, Model, Table } from 'sequelize-typescript';
import { MiniUuidDefault } from 'nestjs-mini-uuid/sequelize';

@Table({ tableName: 'coupons' })
export class Coupon extends Model {
  @MiniUuidDefault(10)
  @Column
  declare code: string;
}
```

### With classic Sequelize (sequelize.define)

Use `miniUuidAttribute` as a ready-made attribute definition:

```ts
import { Sequelize } from 'sequelize';
import { miniUuidAttribute } from 'nestjs-mini-uuid/sequelize';

const sequelize = new Sequelize(/* connection config */);

const User = sequelize.define('User', {
  id: miniUuidAttribute({ primaryKey: true }),
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  inviteCode: miniUuidAttribute(),
});
```

Or build the column manually with `miniUuidDefaultValue`:

```ts
const User = sequelize.define('User', {
  id: {
    type: Sequelize.STRING(8),
    primaryKey: true,
    defaultValue: miniUuidDefaultValue(),
  },
});
```

### Generating values manually

If you prefer to assign the ID in your code instead of relying on `defaultValue`, use the exported `generateMiniUuid` function from the main entry point:

```ts
import { generateMiniUuid } from 'nestjs-mini-uuid';

const user = await User.create({
  id: generateMiniUuid(8),
  name: 'Jane',
});
```

## License
This project is licensed under MIT License.

## Author
Created by Jose Antonio Becerra Morilla(JoseProgrammer25).