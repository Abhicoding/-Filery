var fs = require('fs')
var path = require('path')
var babylon = require('babylon')

var entry = process.argv[2] || path.resolve(__dirname, 'Test/test.js')

function createAsset (filePath) {
  var ast = babylon.parse(filePath)
  console.log(createAsset)
}

createAsset(entry)