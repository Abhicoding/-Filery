var fs = require('fs')
var path = require('path')
var babylon = require('@babel/parser')

var entry = process.argv[2] || path.resolve(__dirname, 'Test/test.js')

function createAsset (filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      var ast = babylon.parse(data, {
        sourceType: 'module'
      })
      console.log(ast)
    }
  })
}

createAsset(entry)