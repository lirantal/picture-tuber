#!/usr/bin/env node
var argv = require("optimist")
  .usage("Usage: picture-tube OPTIONS { file }")
  .demand(1)
  .describe("cols", "number of columns to use for output").argv;
var tube = require("../")(argv);
var fs = require("fs");

var file = argv._[0];

if (file === "-") {
  process.stdin.pipe(tube);
} else {
  fs.createReadStream(file).pipe(tube);
}

tube.pipe(process.stdout);
