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