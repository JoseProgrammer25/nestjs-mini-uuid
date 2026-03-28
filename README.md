# NestJS Mini UUID

An extremely lightweight and secure library for generating short, unique identifiers (mini UUIDs) in your NestJS applications. 

Built with zero external dependencies, it uses Node.js' native cryptographic module to guarantee truly random and secure identifiers.

## Features

- **Zero external dependencies:** Keeps your `node_modules` light.
- **Cryptographically secure:** Uses Node.js native `crypto.randomInt`, avoiding the mathematical bias of `Math.random()`.
- **Easy integration:** Global module designed specifically for the NestJS ecosystem.
- **Customizable length:** Generate IDs of the exact size you need (defaults to `8` characters).
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

## License
This project is licensed under MIT License.

## Author
Created by Jose Antonio Becerra Morilla(JoseProgrammer25).