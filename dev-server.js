var express = require('express');

var createFont = require('./font/create-font');

var app = express();

var PORT = process.env.PORT || 3000;

app.get('/font/myfont.svg', function(req, res) {
  var svg = createFont.jsonFileToSVG(__dirname + '/font/myfont.json');

  return res.type('text/xml').send(svg);
});

app.get('/font/myfont.ttf', function(req, res) {
  var buf = createFont.jsonFileToTTF(__dirname + '/font/myfont.json');

  return res.type('application/x-font-ttf').send(buf);
});

app.use(express.static(__dirname));

app.listen(PORT, function() {
  console.log("Listening on port " + PORT + ".");
});
