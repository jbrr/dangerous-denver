function parseCSV(data, type) {
  var lines = data.split("\r\n");
  lines = lines.slice(0, -1);
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 0; i < lines.length; i++) {
    var object = {};
    var currentLine = lines[i].split(",");
    for (var j = 0; j < headers.length; j++) {
      object[headers[j]] = currentLine[j];
    }
    result.push(object);
  }
  return result;
}

module.exports = parseCSV;
