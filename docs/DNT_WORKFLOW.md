# DNT Build and Publish Workflow

This project uses DNT (Deno Node Transform) to transform the Deno project into an npm package.

## Available Tasks

- `deno task build:npm` - Build the npm package in the `npm/` directory
- `deno task npm:pack` - Create a tarball of the npm package
- `deno task npm:publish` - Publish the package to npm (requires authentication)

## Build Process

The build script (`scripts/build_npm.ts`) performs the following:

1. Clears the `npm/` directory
2. Transforms Deno code to Node.js compatible code
3. Handles npm dependency mappings for dayjs plugins
4. Copies LICENSE and README.md files
5. Creates both ESM and CommonJS versions

## Publishing

Before publishing to npm:

1. Update the version in `deno.json`
2. Run `deno task build:npm` to rebuild the package
3. Test the package locally if needed: `cd npm && npm pack`
4. Publish: `deno task npm:publish`

## Dependencies

The project uses dayjs for date manipulation with the following plugins:
- weekOfYear
- isLeapYear  
- isoWeek
- weekday

These are properly mapped in the DNT configuration to work with npm.