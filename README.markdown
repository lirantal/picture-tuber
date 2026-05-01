# picture-tuber

Render images on the terminal.

# example

## command

<img width="1094" height="694" alt="image" src="https://github.com/user-attachments/assets/450e745e-1ac0-4144-89fa-51e04422c81d" />

## code

```js
var pictureTube = require("picture-tuber");
var tube = pictureTube();
tube.pipe(process.stdout);

var fs = require("fs");
fs.createReadStream("robot.png").pipe(tube);
```

# usage

```
Usage: picture-tube OPTIONS { file or uri }

Options:
  --cols  number of columns to use for output
```

# methods

```js
var pictureTube = require("picture-tuber");
```

## var tube = pictureTube(opts)

Return a readable/writable stream that reads png image data and writes ansi
terminal codes.

Set the number of columns to display the image as with `opts.cols`.

Right now only png files work.

# install

To install as a library, with [npm](http://npmjs.org) do:

```
npm install picture-tuber
```

To install the command-line tool, with [npm](http://npmjs.org) do:

```
npm install -g picture-tuber
```

# license

MIT
