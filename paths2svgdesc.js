function pathsToSVGDesc(paths, xOfs, yOfs) {
  xOfs = xOfs || 0;
  yOfs = yOfs || 0;

  return paths.paths.map(function(subpaths) {
    return subpaths.map(function(subpath) {
      var moveTo = 'M' + (subpath[0].x + xOfs) + ',' + (subpath[0].y + yOfs);

      return moveTo + subpath.slice(1).map(function lineTo(point, i) {
        return 'L' + (point.x + xOfs) + ',' + (point.y + yOfs);
      }).join('') + 'z';
    }).join('');
  }).join('');
}

if (typeof(module) !== 'undefined') module.exports = pathsToSVGDesc;
