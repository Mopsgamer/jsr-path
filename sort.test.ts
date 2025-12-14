import {
  assert,
  assertEquals,
  assertGreater,
  assertLess,
} from "jsr:@std/assert";
import * as sort from "./sort.ts";
import { shiftPath } from "./shift.ts";

Deno.test("shiftPath - examples", () => {
  assertEquals(shiftPath("path/to/the/file"), {
    next: "path",
    other: "to/the/file",
    isLast: false,
  });
  assertEquals(shiftPath("file"), {
    next: "file",
    other: "file",
    isLast: true,
  });
  assertEquals(shiftPath("file/"), { next: "file", other: "", isLast: false });
});

Deno.test("sort.isSortName - true/false", () => {
  assert(sort.isSortName("firstFolders"));
  assert(!sort.isSortName("not-a-sort"));
});

Deno.test("mixed comparator orders strings", () => {
  assertLess(sort.cmpMixed("a", "b"), 0);
  assertGreater(sort.cmpMixed("b", "a"), 0);
  assertEquals(sort.cmpMixed("same", "same"), 0);
});

Deno.test("type comparator groups by extension then name", () => {
  assertLess(sort.cmpFileType("file.md", "file.txt"), 0);
  assertLess(sort.cmpFileType("a.txt", "b.txt"), 0);
});

Deno.test("sort.cmpFirstFolders puts folders before files", () => {
  assertEquals(
    ["df", "df/file"].sort(sort.cmpFirstFolders),
    [
      "df/file",
      "df",
    ],
  );
  assertEquals(
    ["df/", "df/file"].sort(sort.cmpFirstFolders),
    [
      "df/",
      "df/file",
    ],
  );
});
Deno.test("sort.cmpFirstFolders puts src/ before src/targets/yarn.ts", () => {
  assertEquals(
    ["src/targets/yarn.ts", "src/"].sort(sort.cmpFirstFolders),
    ["src/", "src/targets/yarn.ts"],
  );
  assertEquals(
    ["src/", "src/targets/yarn.ts"].sort(sort.cmpFirstFolders),
    ["src/", "src/targets/yarn.ts"],
  );
});
Deno.test("sort.cmpFirstFolders puts .vscode/extensions.json before .gitignore", () => {
  assertEquals(
    [".gitignore", ".vscode/extensions.json"].sort(sort.cmpFirstFolders),
    [".vscode/extensions.json", ".gitignore"],
  );
});
Deno.test("sort.cmpFirstFolders puts .gitignore before .vscode/", () => {
  assertEquals(
    [".gitignore", ".vscode/"].sort(sort.cmpFirstFolders),
    [".vscode/", ".gitignore"],
  );
});
Deno.test("sort.cmpFirstFolders puts bin/ before package.json", () => {
  assertEquals(
    ["bin/", "package.json"].sort(sort.cmpFirstFolders),
    ["bin/", "package.json"],
  );
});

Deno.test("sort.cmpFirstFiles puts files before folders", () => {
  assertEquals(["df", "df/file"].sort(sort.cmpFirstFiles), [
    "df",
    "df/file",
  ]);
  assertEquals(["df/", "df/file"].sort(sort.cmpFirstFiles), [
    "df/",
    "df/file",
  ]);
  assertEquals(
    ["src/targets/yarn.ts", "src/"].sort(sort.cmpFirstFiles),
    ["src/", "src/targets/yarn.ts"],
  );
  assertEquals(
    [".vscode/extensions.json", ".gitignore"].sort(sort.cmpFirstFiles),
    [".gitignore", ".vscode/extensions.json"],
  );
  assertEquals(
    [".vscode/", ".gitignore"].sort(sort.cmpFirstFiles),
    [".gitignore", ".vscode/"],
  );
});
Deno.test("sort.cmpFirstFiles puts bin/ before package.json", () => {
  assertEquals(
    ["bin/", "package.json"].sort(sort.cmpFirstFiles),
    ["package.json", "bin/"],
  );
});

Deno.test("sort.isSortName - non-string returns false", () => {
  assert(!sort.isSortName(123));
});

Deno.test("sort.cmpFirstFolders comparator symmetric behaviour", () => {
  assertLess(sort.cmpFirstFolders("df/file", "df"), 0);
  assertGreater(sort.cmpFirstFolders("df", "df/file"), 0);
});

Deno.test("sort.cmpFirstFiles comparator symmetric behaviour", () => {
  assertLess(sort.cmpFirstFiles("df", "df/file"), 0);
  assertGreater(sort.cmpFirstFiles("df/file", "df"), 0);
});

Deno.test("modified comparator", () => {
  assertEquals(sort.cmpModified("a/file", "a/file", 200, 200), 0);

  // Different files, different modified times
  assertLess(sort.cmpModified("a/file", "b/file", 200, 100), 0);
  assertGreater(sort.cmpModified("a/file", "b/file", 100, 200), 0);

  // File vs folder (folders first)
  assertLess(sort.cmpModified("a/file", "a/folder", 200, 100), 0);
  assertGreater(sort.cmpModified("a/folder", "a/file", 100, 200), 0);

  // Folder vs folder, different dates
  assertLess(sort.cmpModified("a/folder1", "a/folder2", 200, 100), 0);
  assertGreater(sort.cmpModified("a/folder1", "a/folder2", 100, 200), 0);

  // Files with same modified date
  assertLess(sort.cmpModified("a/file1", "a/file2", 200, 200), 0);

  // Folder with same modified date as file
  assertGreater(sort.cmpModified("a/fzlder/b", "a/file", 200, 200), 0);
  assertGreater(sort.cmpModified("a/fzlder/b/c", "a/file", 200, 200), 0);
  assertGreater(sort.cmpModified("a/fzlder/b/c/d", "a/file", 200, 200), 0);
  assertLess(sort.cmpModified("a/file/b", "a/file", 200, 200), 0);

  assertLess(sort.cmpModified("a/file", "a/fzlder/b", 200, 200), 0);
  assertLess(sort.cmpModified("a/file", "a/fzlder/b/c", 200, 200), 0);
  assertLess(sort.cmpModified("a/file", "a/fzlder/b/c/d", 200, 200), 0);
  assertGreater(sort.cmpModified("a/file", "a/file/b", 200, 200), 0);
});

Deno.test("type comparator folder vs file branch", () => {
  assertGreater(sort.cmpFileType("dir", "dir/file"), 0);
  assertLess(sort.cmpFileType("dir/file", "dir"), 0);
  assertEquals(sort.cmpFileType("dir", "dir"), 0);
});

Deno.test("sort.cmpFirstFolders - name differs early returns comparison", () => {
  assertLess(sort.cmpFirstFolders("a/x", "b/x"), 0);
});

Deno.test("sort.cmpFirstFiles - name differs early returns comparison", () => {
  assertLess(sort.cmpFirstFiles("a/x", "b/x"), 0);
});

Deno.test("sort.cmpFirstFolders/sort.cmpFirstFiles equal names return 0", () => {
  assertEquals(sort.cmpFirstFolders("same", "same"), 0);
  assertEquals(sort.cmpFirstFiles("same", "same"), 0);
});

Deno.test("sort-iterable: sortFirstFolders basic", () => {
  assertEquals(sort.sortFirstFolders(["df", "df/file"]), ["df/file", "df"]);
  assertEquals(sort.sortFirstFolders(["df/file", "df"]), ["df/file", "df"]);
});

Deno.test("sort-iterable: sortsort.cmpFirstFiles basic", () => {
  assertEquals(sort.sortFirstFiles(["df", "df/file"]), ["df", "df/file"]);
  assertEquals(sort.sortFirstFiles(["df/file", "df"]), ["df", "df/file"]);
});

Deno.test("sort-iterable: sortFileType basic", () => {
  assertEquals(sort.sortFileType(["a.a", "b.a", "a.b"]), [
    "a.a",
    "b.a",
    "a.b",
  ]);
});

Deno.test("sort-iterable: sortMixed basic", () => {
  assertEquals(sort.sortMixed(["b", "a", "c"]), ["a", "b", "c"]);
});

Deno.test("sort-iterable: sortModified basic", () => {
  const input: [string, number?][] = [
    ["a/file", 100],
    ["b/file", 200],
    ["a/fzlder", 150],
  ];
  const out = sort.sortModified(input);
  assertEquals(out[0][0], "b/file");
  assertEquals(out.length, 3);
});
