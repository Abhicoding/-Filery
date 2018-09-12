const fs = require('fs')
const path = require('path')
// const babylon = require('@babel/parser')
const babylon = require('@babel/core')

var FILE = process.argv[2] || path.resolve(__dirname, 'Test/test.js')

var ID = 0

function createAsset (filepath) {
  var dependencies = []
  
  var data = fs.readFileSync(filepath, 'utf8')
  
  var ast = babylon.parse(data, {
    sourceType: 'module'
  })
  
  babylon.traverse(ast, {ImportDeclaration: ({node}) => {
    dependencies.push(node.source.value)
    }
  })
  
  ID++
  
  var {code} = babylon.transformFromAst(ast) // This step is needed as transformed code has strict mode corrections
  
  return {id: ID, filepath, code, dependencies}
}


function createGraph (entry) {
  var mainAsset = createAsset(entry)
  mainAsset.mapping = {}
  var assetQueue = [mainAsset]
  let dirname = path.dirname(mainAsset.filepath)
  for (asset of assetQueue){
    asset.dependencies.forEach( relativePath => {
      //console.log(typeof dirname, typeof relativePath)
      let absolutePath = path.resolve(dirname, relativePath)
      let child = createAsset(absolutePath)
      mainAsset.mapping[relativePath] = child.id
      assetQueue.push(child)
    });
  }
  return assetQueue
}

console.log(createGraph(FILE))