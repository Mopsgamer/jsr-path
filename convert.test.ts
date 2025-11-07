import { assertEquals } from "jsr:@std/assert";
import {
  pathObjectFrom,
  type PathRecord,
  pathRecordFilesSet,
  pathRecordToGenerator,
} from "./convert.ts";

Deno.test("pathRecordFilesSet - simple path object", () => {
  const input: PathRecord = {
    "foo": { "bar": "" },
    "baz": { "qux": "" },
  };
  const expected = new Set(["foo/bar", "baz/qux"]);
  assertEquals(pathRecordFilesSet(input), expected);
});

Deno.test("pathRecordFilesSet - nested path object", () => {
  const input: PathRecord = {
    "foo": {
      "bar": { "baz": "" },
    },
    "qux": { "quux": "" },
  };
  const expected = new Set(["foo/bar/baz", "qux/quux"]);
  assertEquals(pathRecordFilesSet(input), expected);
});

Deno.test("pathRecordFilesSet - throws on invalid type (array)", () => {
  const input: PathRecord = {
    "foo": [],
  };
  const expected = new Set([]);
  assertEquals(pathRecordFilesSet(input), expected);
});

Deno.test("pathObjectFrom - simple paths", () => {
  const input = ["foo/bar", "baz/qux"];
  const expected = {
    "foo": { "bar": "" },
    "baz": { "qux": "" },
  };
  assertEquals(pathObjectFrom(input), expected);
});

Deno.test("pathObjectFrom - nested paths", () => {
  const input = ["foo/bar/baz", "qux/quux"];
  const expected = {
    "foo": {
      "bar": { "baz": "" },
    },
    "qux": { "quux": "" },
  };
  assertEquals(pathObjectFrom(input), expected);
});

Deno.test("pathRecordToGenerator - simple paths", () => {
  const obj: PathRecord = {
    "src": {
      "components": { "Button.tsx": "" },
      "utils": { "helpers.ts": "" },
    },
    "public": { "index.html": "" },
  };

  const list = Array.from(
    pathRecordToGenerator(obj),
    ({ path, indent }) => ({ path, indent }),
  );
  assertEquals(list, [
    { path: "src", indent: ["first"] },
    { path: "src/components", indent: ["first", "first"] },
    { path: "src/components/Button.tsx", indent: ["first", "first", "last"] },
    { path: "src/utils", indent: ["first", "last"] },
    { path: "src/utils/helpers.ts", indent: ["first", "last", "last"] },
    { path: "public", indent: ["last"] },
    { path: "public/index.html", indent: ["last", "last"] },
  ]);
});

Deno.test("pathRecordToGenerator - empty object", () => {
  const obj: PathRecord = {};

  const list = Array.from(pathRecordToGenerator(obj));
  assertEquals(list, []);
});

Deno.test("pathRecordToGenerator - single level paths", () => {
  const obj: PathRecord = {
    "dir1": { "content.txt": "" },
    "dir2": { "data.json": "" },
  };

  const list = Array.from(
    pathRecordToGenerator(obj),
    ({ path, indent }) => ({ path, indent }),
  );
  assertEquals(list, [
    { path: "dir1", indent: ["first"] },
    { path: "dir1/content.txt", indent: ["first", "last"] },
    { path: "dir2", indent: ["last"] },
    { path: "dir2/data.json", indent: ["last", "last"] },
  ]);
});

Deno.test("pathRecordToGenerator - nested paths", () => {
  const obj: PathRecord = {
    "app": {
      "src": {
        "components": {
          "ui": { "Button.tsx": "" },
        },
      },
    },
  };

  const list = Array.from(
    pathRecordToGenerator(obj),
    ({ path, indent }) => ({ path, indent }),
  );
  assertEquals(list, [
    {
      path: "app",
      indent: ["last"],
    },
    {
      path: "app/src",
      indent: ["last", "last"],
    },
    {
      path: "app/src/components",
      indent: ["last", "last", "last"],
    },
    {
      path: "app/src/components/ui",
      indent: ["last", "last", "last", "last"],
    },
    {
      path: "app/src/components/ui/Button.tsx",
      indent: ["last", "last", "last", "last", "last"],
    },
  ]);
});

Deno.test("pathRecordToGenerator - throws on invalid type (array)", () => {
  const obj: PathRecord = {
    "foo": [],
  };
  const iterator = Array.from(
    pathRecordToGenerator(obj),
    ({ path, indent }) => ({ path, indent }),
  );
  assertEquals(iterator, [{ path: "foo", indent: ["last"] }]);
});

Deno.test("pathRecordToGenerator - accepts string argument", () => {
  const input: PathRecord = "file.txt";
  const list = Array.from(
    pathRecordToGenerator(input),
    ({ path, indent }) => ({ path, indent }),
  );
  assertEquals(list, [{ path: "file.txt", indent: ["last"] }]);
});

Deno.test("pathRecordToGenerator - accepts array argument", () => {
  const input: PathRecord = ["a/b.txt", "c/d.txt"];
  const list = Array.from(
    pathRecordToGenerator(input),
    ({ path, indent }) => ({ path, indent }),
  );
  assertEquals(list, [
    { path: "a", indent: ["first"] },
    { path: "a/b.txt", indent: ["first", "last"] },
    { path: "c", indent: ["last"] },
    { path: "c/d.txt", indent: ["last", "last"] },
  ]);
});
