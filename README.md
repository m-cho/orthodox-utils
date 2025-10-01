# Orthodox Utils

**⚠️ Work In Progress - Early Development Stage ⚠️**

A modern TypeScript library for calculating Orthodox Christian liturgical dates, periods, and calendar information. This is a modernized version of the [orthodox-periods](https://bitbucket.org/anothradam/orthodox-periods/src/v3/) npm module, rewritten in TypeScript with support for Deno, Node.js, and modern JavaScript/TypeScript environments.

**Note:** This library is currently in early development and may not fully support all features from the original orthodox-periods library. API and functionality are subject to change.

**Special thanks to Adam Gedney for his excellent work on the original orthodox-periods library that served as the foundation for this project.**

## Installation

### Node.js / npm

```bash
npm install ortodox-utils
```

```javascript
// ES6 imports
import { periods } from 'ortodox-utils';

// CommonJS
const { periods } = require('ortodox-utils');
```

### Deno

```typescript
// Import from JSR (recommended)
import { periods } from "jsr:@m-cho/ortodox-utils";

// Or import directly from this repository
import { periods } from "https://raw.githubusercontent.com/m-cho/orthodox-utils/main/mod.ts";
```

### Bun

```bash
bun add ortodox-utils
```

```typescript
import { periods } from 'ortodox-utils';
```

**Note:** API is subject to change during development. Check the source code in `src/` for the most current available methods.

## Current Features (WIP)

- 📅 Basic Orthodox liturgical date calculations
- 🗓️ Support for both Old (Julian) and New (Gregorian) calendar systems
- 📊 Determine weeks after Pascha and Pentecost
- 🔍 Find liturgical periods for given dates (partial implementation)
- 🚀 Modern TypeScript with type safety
- 🦕 Multi-runtime support: Deno, Node.js, Bun

## Development Status

This library is actively being developed and currently implements:

- ✅ Pascha calculation using Gauss algorithm
- ✅ Basic liturgical date calculations
- ✅ Week calculations after Pascha and Pentecost
- ✅ Period detection for dates
- 🚧 Full liturgical calendar implementation
- 🚧 All fasting periods and feast calculations
- 🚧 Complete feature parity with orthodox-periods

Many features from the original orthodox-periods library are still being implemented or may work differently.

## Development

### Prerequisites

- Deno 1.40+ (for development)
- Node.js 18+ (for npm package testing)

### Development Workflow

```bash
# Clone the repository
git clone https://github.com/m-cho/orthodox-utils.git
cd orthodox-utils

# Run tests in watch mode
deno task dev

# Run tests once
deno test

# Build npm package
deno task build:npm

# Test npm package locally
deno task npm:pack

# Publish to npm (requires npm authentication)
deno task npm:publish
```

### Running Tests

```bash
# With Deno (recommended for development)
deno task dev

# Or run tests once
deno test
```

### Project Structure

```
ortodox-utils/
├── src/
│   ├── dates.ts      # Date calculations for liturgical year
│   ├── pascha.ts     # Pascha calculation using Gauss algorithm
│   ├── periods.ts    # Main periods functionality
│   └── utils.ts      # Utility functions and types
├── tests/           # Test files
├── scripts/         # Build scripts
│   └── build_npm.ts # DNT build script for npm package
├── mod.ts          # Main export file (Deno)
└── deno.json       # Deno configuration
```

## Build System

This project uses [DNT (Deno Node Transform)](https://github.com/denoland/dnt) to create npm-compatible packages from Deno source code. The build process:

1. **Source**: Written in TypeScript for Deno with JSR/npm imports
2. **Transform**: DNT converts Deno code to Node.js compatible modules
3. **Output**: Generates both ESM and CommonJS versions in `npm/` directory
4. **Dependencies**: Properly maps dayjs and its plugins for npm compatibility

The `scripts/build_npm.ts` handles the entire transformation process, including dependency mapping and file copying.

## Contributing

This is a work-in-progress project. Contributions, suggestions, and feedback are welcome! The library aims to eventually provide full feature parity with the original orthodox-periods library while leveraging modern TypeScript capabilities.

## License

MIT License - see LICENSE file for details.

## Acknowledgments

This library is based on the excellent work of **Adam Gedney** and his [orthodox-periods](https://bitbucket.org/anothradam/orthodox-periods/src/v3/) library. The modernization to TypeScript and multi-runtime support builds upon his solid foundation of Orthodox liturgical calculations.

**Build System**: This project uses [DNT (Deno Node Transform)](https://github.com/denoland/dnt) by the Deno team to provide seamless cross-runtime compatibility.

---

*This is an early-stage development project. For production Orthodox liturgical calendar needs, consider using the mature [orthodox-periods](https://www.npmjs.com/package/orthodox-periods) library.*

*For more information about Orthodox liturgical calendar calculations, please consult with your local Orthodox parish or spiritual father.*