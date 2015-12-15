var fs = require('fs');
var svg2ttf = require('svg2ttf');
var Mustache = require('mustache');

var asciiToGrid = require('../ascii2grid');
var gridToPaths = require('../grid2paths');
var pathsToSVGDesc = require('../paths2svgdesc');

var toSVGPathDesc = function(lines, fontMeta) {
  lines = lines.slice();
  lines.reverse();

  var grid = asciiToGrid(lines.join('\n'));
  var paths = gridToPaths(grid, fontMeta.pixelSize, 0);

  return pathsToSVGDesc(paths, fontMeta.xOfs, fontMeta.yOfs);
};

var jsonToSVG = function(glyphs) {
  var template = fs.readFileSync(__dirname + '/font.mustache.svg', 'utf-8');

  return Mustache.render(template, {
    meta: glyphs._meta,
    glyphs: Object.keys(glyphs).filter(function(name) {
      return name !== '_meta';
    }).map(function(name) {
      return {
        name: name,
        pathDesc: toSVGPathDesc(glyphs[name], glyphs._meta)
      };
    })
  });
};

var jsonFileToSVG = function(filename) {
  var glyphs = JSON.parse(fs.readFileSync(filename, 'utf-8'));
  return jsonToSVG(glyphs);
};

var jsonFileToTTF = function(filename) {
  var ttf = svg2ttf(jsonFileToSVG(filename), {});
  return new Buffer(ttf.buffer);
};

exports.jsonFileToSVG = jsonFileToSVG;
exports.jsonFileToTTF = jsonFileToTTF;

if (!module.parent) {
  fs.writeFileSync(__dirname + '/myfont.ttf',
                   jsonFileToTTF(__dirname + '/myfont.json'));
  console.log('wrote myfont.ttf.');
}
