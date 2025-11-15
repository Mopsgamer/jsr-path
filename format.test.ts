import { assertEquals } from "jsr:@std/assert";
import { format } from "./format.ts";
import { pathObjectFrom } from "./convert.ts";

const expected = `
├── empty
├── foo
│   ├── bar
│   ├── abc
│   ├── xyz
│   │   ├── x
│   │   └── y
│   └── def
├── baz
│   └── qux
└── corge
    └── grault
        └── garply
`.trimStart();

Deno.test("format - simple path object", () => {
  const inputarr = [
    "empty",
    "foo/bar",
    "foo/abc",
    "foo/xyz/x",
    "foo/xyz/y",
    "foo/def",
    "baz/qux",
    "corge/grault/garply",
  ];
  const o = pathObjectFrom(inputarr);
  assertEquals(format(o), expected);
});

Deno.test("format - simple path object", () => {
  const input = {
    "empty": "",
    "foo": { "bar": "", "abc": "", "xyz": { "x": "", "y": "" }, "def": "" },
    "baz": { "qux": "" },
    "corge": {
      "grault": { "garply": "" },
    },
  };
  const inputarr = {
    "empty": "",
    "foo": { bar: "", abc: "", xyz: ["x", "y"], def: "" },
    "baz": ["qux"],
    "corge": {
      "grault": ["garply"],
    },
  };
  assertEquals(format(input), expected);
  assertEquals(format(inputarr), expected);
});
