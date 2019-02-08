var PNG = require("png-js");
var charm = require("charm");
var x256 = require("x256");

var { Duplex } = require("stream");

class PictureTube extends Duplex {
  constructor(opts = {}) {
    super();
    this.data = [];
    this.cols = opts.cols || 80;

    this.c = charm();

    this.c.on("data", chunk => {
      this.push(chunk);
    });

    this.c.on("end", () => {
      this.emit("end");
    });
  }

  _read() {}

  _write(chunk, encoding, callback) {
    this.data.push(chunk);
    callback();
  }

  _final(callback) {
    var png = new PNG(Buffer.concat(this.data));

    png.decode(pixels => {
      var dx = png.width / this.cols;
      var dy = 2 * dx;

      for (var y = 0; y < png.height; y += dy) {
        for (var x = 0; x < png.width; x += dx) {
          var i = (Math.floor(y) * png.width + Math.floor(x)) * 4;

          var ix = x256([pixels[i], pixels[i + 1], pixels[i + 2]]);
          if (pixels[i + 3] > 0) {
            this.c.background(ix).write(" ");
          } else {
            this.c.display("reset").write(" ");
          }
        }
        this.c.display("reset").write("\r\n");
      }

      this.c.display("reset").end();
      callback();
    });
  }
}

module.exports = opts => {
  return new PictureTube(opts);
};
