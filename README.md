# @m234/path

[![JSR](https://jsr.io/badges/@m234/path)](https://jsr.io/@m234/path)
![Tests](https://raw.githubusercontent.com/Mopsgamer/jsr-path/refs/heads/main/assets/badge-tests.svg)
![Tests coverage](https://raw.githubusercontent.com/Mopsgamer/jsr-path/refs/heads/main/assets/badge-cov.svg)

Sort, parse and format a path array/object.

## Usage

Convert between string iterable and objects:

```ts
import { pathObjectFrom, pathRecordFilesSet } from "@m234/path";

const paths = [
  "src/components/Button.tsx",
  "src/utils/helpers.ts",
  "public/index.html",
];

const obj = pathObjectFrom(paths);
// {
//   "src": {
//     "components": { "Button.tsx": "" },
//     "utils": { "helpers.ts": "" }
//   },
//   "public": { "index.html": "" }
// }

const pathSet = pathRecordFilesSet(obj);
// Set(3) {
//   "src/components/Button.tsx",
//   "src/utils/helpers.ts",
//   "public/index.html"
// }
```

Iterate over paths using generator:

```ts
import { type PathRecord, pathRecordToGenerator } from "@m234/path";

const obj: PathRecord = {
  "src": {
    "components": { "Button.tsx": "" },
    "utils": { "helpers.ts": "" },
  },
  "public": { "index.html": "" },
};

const iterator = pathRecordToGenerator(obj);
for (const { parent, path } of iterator) {
  console.log(`path: ${path}`);
}
// Output:
// path: src
// path: src/components
// path: src/components/Button.tsx
// path: src/utils
// path: src/utils/helpers.ts
// path: public
// path: public/index.html
```

Sort paths:

```ts
import { sortFirstFolders } from "@m234/path";

const paths = [
  "z/file.txt",
  "a/deep/path/file.txt",
  "a/file.txt",
];

sortFirstFolders(paths);
// paths == [
//   "a/deep/path/file.txt",
//   "a/file.txt",
//   "z/file.txt"
// ]
```
