var fs = require('fs');
var svg2ttf = require('svg2ttf');

var asciiToGrid = require('../ascii2grid');
var gridToPaths = require('../grid2paths');

var toSVGPath = function(lines) {
  lines = lines.slice();
  lines.reverse();
  var yOfs = -40;
  var xOfs = 180;
  var grid = asciiToGrid(lines.join('\n'));
  var paths = gridToPaths(grid, 130, 0);
  var d = paths.paths.map(function(subpaths) {
    return subpaths.map(function(subpath) {
      var moveTo = 'M' + (subpath[0].x + xOfs) + ',' + (subpath[0].y + yOfs);

      return moveTo + subpath.slice(1).map(function lineTo(point, i) {
        return 'L' + (point.x + xOfs) + ',' + (point.y + yOfs);
      }).join('') + 'z';
    }).join('');
  }).join('');

  return d;
};

var jsonToSVG = function(glyphs) {
  var svg = [
    '<font horiz-adv-x="1000">',
    '<font-face font-family="My Font" font-style="normal"',
    '           units-per-em="1000" ',
    '           ascent="700" descent="300">',
    '  <font-face-src>',
    '    <font-face-name name="My Font"/>',
    '  </font-face-src>',
    '</font-face>'
  ];

  Object.keys(glyphs).forEach(function(glyphName) {
    var glyphData = glyphs[glyphName];

    svg.push('<glyph unicode="' + glyphName + '" d="' +
             toSVGPath(glyphData) + '"></glyph>');
  });

  svg.push('</font>');

  return svg.join('\n');
}

var jsonFileToTTF = function(filename) {
  var glyphs = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  var ttf = svg2ttf(jsonToSVG(glyphs), {});

  return new Buffer(ttf.buffer);
};

exports.jsonFileToTTF = jsonFileToTTF;

if (!module.parent) {
  fs.writeFileSync(__dirname + '/myfont.ttf',
                   jsonFileToTTF(__dirname + '/myfont.json'));
  console.log('wrote myfont.ttf.');
}
