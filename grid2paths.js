var gridToPaths = (function() {
  function unifyStraightLines(path) {
    function unify(pathSoFar, point) {
      if (pathSoFar.length < 2) return pathSoFar.concat(point);

      var prevPoint = pathSoFar[pathSoFar.length - 1];
      var prevPrevPoint = pathSoFar[pathSoFar.length - 2];

      if ((prevPrevPoint.x == prevPoint.x && prevPoint.x == point.x) ||
          (prevPrevPoint.y == prevPoint.y && prevPoint.y == point.y)) {
        return pathSoFar.slice(0, -1).concat(point);
      }

      return pathSoFar.concat(point);
    }

    var newPath;

    while (true) {
      newPath = path.reduce(unify, []);
      if (newPath.length === path.length)
        return newPath;
      newPath.push(newPath[0]);
      newPath.splice(0, 1);
      path = newPath;
    }
  }

  function unifySubpaths(subpaths) {
    function unifyOne() {
      for (var i = 0; i < subpaths.length; i++) {
        for (var j = 0; j < subpaths.length; j++) {
          if (j == i) continue;

          var iStart = subpaths[i][0];
          var iEnd = subpaths[i][subpaths[i].length - 1];
          var jStart = subpaths[j][0];
          var jEnd = subpaths[j][subpaths[j].length - 1];

          if (iStart.x == jEnd.x && iStart.y == jEnd.y) {
            // Append subpath i to subpath j, remove subpath i
            subpaths[j].push.apply(subpaths[j], subpaths[i].slice(1));
            subpaths.splice(i, 1);
            return true;
          }
        }
      }

      return false;
    }

    while (unifyOne()) {}

    return subpaths;
  }

  return function gridToPaths(grid, squareSize, offset) {
    offset = offset || 0;

    var gridInfo = [];
    var paths = [];
    var i, j;

    var addToPath = function(pathId, x1, y1, x2, y2) {
      var subpaths = paths[pathId];

      if (subpaths.length == 0) {
        subpaths.push([{x: x1, y: y1}, {x: x2, y: y2}]);
      } else {
        for (var i = 0; i < subpaths.length; i++) {
          var start = subpaths[i][0];
          var end = subpaths[i][subpaths[i].length - 1];

          if (start.x == x2 && start.y == y2) {
            subpaths[i].unshift({x: x1, y: y1});
            return;
          }
          if (end.x == x1 && end.y == y1) {
            subpaths[i].push({x: x2, y: y2});
            return;
          }
        }
        subpaths.push([{x: x1, y: y1}, {x: x2, y: y2}]);
      }
    };

    var visit = function(x, y, pathId) {
      if (gridInfo[y][x].visited) return;
      gridInfo[y][x].visited = true;

      if (pathId === null) {
        pathId = paths.length;
        paths.push([]);
      }

      var top = y * squareSize + offset;
      var left = x * squareSize + offset;
      var bottom = top + squareSize;
      var right = left + squareSize;

      if (getSquare(x, y - 1) === grid.EMPTY) {
        // Add top edge to path
        addToPath(pathId, left, top, right, top);
      } else {
        visit(x, y - 1, pathId);
      }

      if (getSquare(x + 1, y) === grid.EMPTY) {
        // Add right edge to path
        addToPath(pathId, right, top, right, bottom);
      } else {
        visit(x + 1, y, pathId);
      }

      if (getSquare(x, y + 1) === grid.EMPTY) {
        // Add bottom edge to path
        addToPath(pathId, right, bottom, left, bottom);
      } else {
        visit(x, y + 1, pathId);
      }

      if (getSquare(x - 1, y) === grid.EMPTY) {
        // Add left edge to path
        addToPath(pathId, left, bottom, left, top);
      } else {
        visit(x - 1, y, pathId);
      }
    };

    var getSquare = function(x, y) {
      if (x < 0 || x >= grid.width ||
          y < 0 || y >= grid.height)
        return grid.EMPTY;
      return grid.getSquare(x, y);
    };

    for (i = 0; i < grid.height; i++) {
      gridInfo.push([]);
      for (j = 0; j < grid.width; j++) {
        gridInfo[i].push({
          visited: false
        });
      }
    }

    for (i = 0; i < grid.height; i++) {
      for (j = 0; j < grid.width; j++) {
        if (getSquare(j, i) !== grid.EMPTY) {
          visit(j, i, null);
        }
      }
    }

    return {
      width: grid.width * squareSize + offset * 2,
      height: grid.height * squareSize + offset * 2,
      paths: paths.map(unifySubpaths).map(function(subpaths) {
        return subpaths.map(unifyStraightLines);
      })
    };
  };
})();

if (typeof(module) !== 'undefined') module.exports = gridToPaths;
