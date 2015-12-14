var fs = require('fs');
var svg2ttf = require('svg2ttf');

var asciiToGrid = require('../ascii2grid');
var gridToPaths = require('../grid2paths');

var toSVGPath = function(lines, fontMeta) {
  lines = lines.slice();
  lines.reverse();
  var yOfs = fontMeta.yOfs;
  var xOfs = fontMeta.xOfs;
  var grid = asciiToGrid(lines.join('\n'));
  var paths = gridToPaths(grid, fontMeta.pixelSize, 0);
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
  var fontMeta = glyphs._meta;
  var svg = [
    '<font horiz-adv-x="' + fontMeta.unitsPerEm + '">',
    '<font-face font-family="' + fontMeta.name + '" font-style="normal"',
    '           units-per-em="' + fontMeta.unitsPerEm + '" ',
    '           ascent="' + fontMeta.ascent + '" ',
    '           descent="' + fontMeta.descent + '">',
    '  <font-face-src>',
    '    <font-face-name name="' + fontMeta.name + '"/>',
    '  </font-face-src>',
    '</font-face>'
  ];

  Object.keys(glyphs).forEach(function(glyphName) {
    if (glyphName == '_meta') return;

    var glyphData = glyphs[glyphName];

    svg.push('<glyph unicode="' + glyphName + '" d="' +
             toSVGPath(glyphData, fontMeta) + '"></glyph>');
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
