const fs = require('fs')
const path = require('path')
// const babylon = require('@babel/parser')
const babylon = require('@babel/core')

var entry = process.argv[2] || path.resolve(__dirname, 'Test/test.js')

var ID = 0

function createAsset (filePath) {
  var dependencies = []
  
  var data = fs.readFileSync(filePath, 'utf8')
  
  var ast = babylon.parse(data, {
    sourceType: 'module'
  })
  
  babylon.traverse(ast, {ImportDeclaration: ({node}) => {
    dependencies.push(node.source.value)
    }
  })
  
  ID++
  
  var {code} = babylon.transformFromAst(ast) // This step is needed as transformed code has strict mode corrections
  
  return {id: ID, filePath, code, dependencies}
}

var mainAsset = createAsset(entry)