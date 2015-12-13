var fs = require('fs');
var svg2ttf = require('svg2ttf');

var asciiToGrid = require('../ascii2grid');
var gridToPaths = require('../grid2paths');

var a = [
  '*****',
  '*   *',
  '*****',
  '*   *',
  '*   *',
];

var b = [
  '****',
  '*   *',
  '**** ',
  '*   *',
  '**** '
];

var c = [
  '*****',
  '*   ',
  '*   ',
  '*   ',
  '*****'
];

var d = [
  '****',
  '*   *',
  '*   *',
  '*   *',
  '**** '
];

var e = [
  '*****',
  '*   ',
  '*****',
  '*',
  '*****'
];

var f = [
  '*****',
  '*   ',
  '*****',
  '*',
  '*'
];

var r = [
  '**** ',
  '*   *',
  '**** ',
  '*  *',
  '*   *',
];

var toSVGPath = function(lines) {
  lines = lines.slice();
  lines.reverse();
  var grid = asciiToGrid(lines.join('\n'));
  var paths = gridToPaths(grid, 150, 0);
  var d = paths.paths.map(function(subpaths) {
    return subpaths.map(function(subpath) {
      var moveTo = 'M' + subpath[0].x + ',' + subpath[0].y;

      return moveTo + subpath.slice(1).map(function lineTo(point, i) {
        return 'L' + point.x + ',' + point.y;
      }).join('') + 'z';
    }).join('');
  }).join('');

  return d;
};

var svg = [
  '<font id="Font1" horiz-adv-x="1000">',
  '<font-face font-family="My Font" font-style="normal"',
  '           units-per-em="1000" cap-height="600" x-height="400"',
  '           ascent="700" descent="300"',
  '           alphabetic="0" mathematical="350" ideographic="400" ',
  '           hanging="500">',
  '  <font-face-src>',
  '    <font-face-name name="My Font"/>',
  '  </font-face-src>',
  '</font-face>',
  '<glyph unicode="a" d="' + toSVGPath(a) + '"></glyph>',
  '<glyph unicode="b" d="' + toSVGPath(b) + '"></glyph>',
  '<glyph unicode="c" d="' + toSVGPath(c) + '"></glyph>',
  '<glyph unicode="d" d="' + toSVGPath(d) + '"></glyph>',
  '<glyph unicode="e" d="' + toSVGPath(e) + '"></glyph>',
  '<glyph unicode="f" d="' + toSVGPath(f) + '"></glyph>',
  '<glyph unicode="r" d="' + toSVGPath(r) + '"></glyph>',
  '</font>',
].join('\n');

var ttf = svg2ttf(svg, {});

fs.writeFileSync(__dirname + '/myfont.ttf', new Buffer(ttf.buffer));
