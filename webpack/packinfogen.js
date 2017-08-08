var fs = require('fs')
var path = require('path')

var content = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')
var json = JSON.parse(content)

module.exports = function gen (debug) {
  var packinfo = {
    name: json.name,
    version: json.version,
    timestamp: (new Date()).getTime(),
    debug: !!debug
  }

  fs.writeFileSync(path.resolve(__dirname, '../packinfo.js'), '/* packinfo */\r\nexport default ' + JSON.stringify(packinfo, null, 2), {
    encoding: 'utf-8'
  })
}
