function asciiToGrid(text) {
  var lines = text.split('\n');
  var grid = [];
  var char;

  grid.EMPTY = false;
  grid.FILLED = true;
  grid.height = lines.length;
  grid.width = Math.max.apply(Math, lines.map(function(line) {
    return line.length;
  }));

  for (var i = 0; i < grid.height; i++) {
    grid.push([]);
    for (var j = 0; j < grid.width; j++) {
      char = lines[i].charAt(j);
      grid[i].push((!char || char == ' ') ? grid.EMPTY : grid.FILLED);
    }
  }

  grid.getSquare = function(x, y) {
    return grid[y][x];
  };

  return grid;
}
