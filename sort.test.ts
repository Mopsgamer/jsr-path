import {
  assert,
  assertEquals,
  assertGreater,
  assertLess,
} from "jsr:@std/assert";
import * as sort from "./sort.ts";
import { shiftPath } from "./shift.ts";

Deno.test("shiftPath - examples", () => {
  assertEquals(shiftPath("path/to/the/file"), ["path", "to/the/file", false]);
  assertEquals(shiftPath("file"), ["file", "file", true]);
  assertEquals(shiftPath("file/"), ["file", "", false]);
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
  assertEquals(["dir", "dir/file"].sort(sort.cmpFirstFolders), [
    "dir/file",
    "dir",
  ]);
  assertEquals(
    ["src/targets/yarn.ts", "src/...+16"].sort(sort.cmpFirstFolders),
    ["src/...+16", "src/targets/yarn.ts"],
  );
});

Deno.test("sort.cmpFirstFiles puts files before folders", () => {
  assertEquals(["dir", "dir/file"].sort(sort.cmpFirstFiles), [
    "dir",
    "dir/file",
  ]);
  assertEquals(["src/targets/yarn.ts", "src/...+16"].sort(sort.cmpFirstFiles), [
    "src/...+16",
    "src/targets/yarn.ts",
  ]);
});

Deno.test("sort.isSortName - non-string returns false", () => {
  assert(!sort.isSortName(123));
});

Deno.test("sort.cmpFirstFolders comparator symmetric behaviour", () => {
  assertLess(sort.cmpFirstFolders("dir/file", "dir"), 0);
  assertGreater(sort.cmpFirstFolders("dir", "dir/file"), 0);
});

Deno.test("sort.cmpFirstFiles comparator symmetric behaviour", () => {
  assert(sort.cmpFirstFiles("dir", "dir/file") < 0);
  assert(sort.cmpFirstFiles("dir/file", "dir") > 0);
});

Deno.test("modified comparator", () => {
  assertEquals(sort.cmpModified("a/file", "a/file", 200, 200), 0);

  // Different files, different modified times
  assertLess(sort.cmpModified("a/file", "b/file", 200, 100), 0);
  assertGreater(sort.cmpModified("a/file", "b/file", 100, 200), 0);

  // File vs folder (folders first)
  assertLess(sort.cmpModified("a/file", "a/folder", 200, 100), 1);
  assertGreater(sort.cmpModified("a/folder", "a/file", 100, 200), -1);

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
  assertEquals(sort.sortFirstFolders(["dir", "dir/file"]), ["dir/file", "dir"]);
});

Deno.test("sort-iterable: sortsort.cmpFirstFiles basic", () => {
  assertEquals(sort.sortFirstFiles(["dir", "dir/file"]), ["dir", "dir/file"]);
});

Deno.test("sort-iterable: sortFileType basic", () => {
  assertEquals(sort.sortFileType(["a.txt", "b.md", "a.md"]), [
    "a.md",
    "b.md",
    "a.txt",
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
