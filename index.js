var PNG = require('png-js');
var charmer = require('charm');
var x256 = require('x256');
var buffers = require('buffers');

var Stream = require('stream').Stream;

module.exports = function (opts) {
    if (!opts) opts = {};
    if (!opts.cols) opts.cols = 80;
    
    var s = new Stream;
    s.readable = true;
    s.writable = true;
    
    var out = new Stream;
    out.writable = true;
    out.write = function (buf) { s.emit('data', buf) };
    out.end = function () { s.emit('end') };
    
    var charm = charmer(out);
    
    var bufs = buffers();
    s.write = function (buf) {
        if (typeof buf === 'string') buf = new Buffer(buf);
        bufs.push(buf);
    };
    
    s.destroy = s.end = function () {
        var png = new PNG(bufs.slice());
        png.decode(function (pixels) {
            var dx = png.width / opts.cols;
            var dy = 2 * dx;
            
            for (var y = 0; y < png.height; y += dy) {
                for (var x = 0; x < png.width; x += dx) {
                    var i = (Math.floor(y) * png.width + Math.floor(x)) * 4;
                    
                    var ix = x256([ pixels[i], pixels[i+1], pixels[i+2] ]);
                    if (pixels[i+3] > 0) {
                        charm.background(ix).write(' ');
                    }
                    else {
                        charm.display('reset').write(' ');
                    }
                }
                charm.display('reset').write('\r\n');
            }
            
            charm.display('reset');
            out.emit('end');
        });
    };
    
    return s;
};
