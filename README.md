# NestJS Mini UUID

Una librería extremadamente ligera y segura para generar identificadores cortos y únicos (mini UUIDs) en tus aplicaciones NestJS. 

Construida sin dependencias externas, utiliza el módulo criptográfico nativo de Node.js para garantizar identificadores verdaderamente aleatorios y seguros.

## Características

- **Cero dependencias externas:** Mantiene tu `node_modules` ligero.
- **Criptográficamente seguro:** Utiliza `crypto.randomInt` nativo de Node.js, evitando el sesgo matemático de `Math.random()`.
- **Fácil integración:** Módulo global diseñado específicamente para el ecosistema NestJS.
- **Longitud personalizable:** Genera IDs del tamaño exacto que necesites (por defecto 8 caracteres).
- **Universal:** Soporte total para TypeScript, CommonJS (Require) y ESM (Import).

## Instalación

Puedes instalar la librería usando tu gestor de paquetes favorito:

```bash
npm install nestjs-mini-uuid