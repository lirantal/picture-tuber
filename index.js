var PNG = require("png-js");
var charm = require("charm");
var x256 = require("x256");

var { Duplex } = require("stream");

class PictureTube extends Duplex {
  constructor(opts = {}) {
    super();
    this.data = [];
    this.cols = opts.cols > 0 ? opts.cols : 80;

    this.c = charm();

    this.c.on("data", chunk => {
      if (!this.push(chunk)) {
        this.c.pause();
      }
    });

    this.c.on("end", () => {
      this.push(null);
    });

    this.c.on("error", err => {
      this.destroy(err);
    });
  }

  _read() {
    this.c.resume();
  }

  _write(chunk, encoding, callback) {
    this.data.push(chunk);
    callback();
  }

  _final(callback) {
    var png;
    try {
      png = new PNG(Buffer.concat(this.data));
    } catch (err) {
      return callback(err);
    }

    png.decode(pixels => {
      try {
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
      } catch (err) {
        callback(err);
      }
    });
  }
}

module.exports = opts => {
  return new PictureTube(opts);
};
