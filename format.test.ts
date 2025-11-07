import { assertEquals } from "jsr:@std/assert";
import { format } from "./format.ts";

Deno.test("format - simple path object", () => {
  const input = {
    "foo": { "bar": "", "abc": "", "xyz": { "x": "", "y": "" }, "def": "" },
    "baz": { "qux": "" },
    "corge": {
      "grault": { "garply": "" },
    },
  };
  const inputarr = {
    "foo": { bar: "", abc: "", xyz: ["x", "y"], def: "" },
    "baz": ["qux"],
    "corge": {
      "grault": ["garply"],
    },
  };
  const expected = `
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
  assertEquals(format(input), expected);
  assertEquals(format(inputarr), expected);
});
