#!/usr/bin/env -S deno run -A

import { build, emptyDir } from "https://deno.land/x/dnt@0.40.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  test: false, // Disable tests for now since they have Deno-specific imports
  package: {
    // package.json properties
    name: "ortodox-utils",
    version: Deno.args[0] ?? "0.1.0",
    description: "Orthodox Christian liturgical calendar utilities",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/m-cho/orthodox-utils.git",
    },
    bugs: {
      url: "https://github.com/m-cho/orthodox-utils/issues",
    },
    keywords: [
      "orthodox",
      "christian",
      "liturgical",
      "calendar",
      "pascha",
      "easter",
      "deno",
    ],
    dependencies: {
      "dayjs": "^1.11.18",
    },
  },
  mappings: {
    "npm:dayjs": {
      name: "dayjs",
      version: "^1.11.18",
    },
    "npm:dayjs/plugin/weekOfYear.js": {
      name: "dayjs",
      version: "^1.11.18",
      subPath: "plugin/weekOfYear.js",
    },
    "npm:dayjs/plugin/isLeapYear.js": {
      name: "dayjs",
      version: "^1.11.18", 
      subPath: "plugin/isLeapYear.js",
    },
    "npm:dayjs/plugin/isoWeek.js": {
      name: "dayjs",
      version: "^1.11.18",
      subPath: "plugin/isoWeek.js",
    },
    "npm:dayjs/plugin/weekday.js": {
      name: "dayjs",
      version: "^1.11.18",
      subPath: "plugin/weekday.js",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});