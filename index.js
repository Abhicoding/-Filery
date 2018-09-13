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
  
  babylon.traverse(ast, 
    {
      ImportDeclaration: ({node}) => {
        dependencies.push(node.source.value)
      },
      
      VariableDeclarator: ({node}) => {
        if (handleRequire(node)) {
          dependencies.push(handleRequire(node))
        }
      }
  })
  
  ID++
  
  var {code} = babylon.transformFromAst(ast) // This step is needed as transformed code has strict mode corrections
  
  return {id: ID, filepath, code, dependencies}
}

// console.log(createAsset(FILE))

function handleRequire (variableObj) {
  if (variableObj.init.type === "CallExpression" && variableObj.init.callee.name === "require"){
    return variableObj.init.arguments[0].value
  }
  return null
}

function createGraph (entry) {
  var mainAsset = createAsset(entry)
  mainAsset.mapping = {}
  var assetQueue = [mainAsset]
  let dirname = path.dirname(mainAsset.filepath)
  for (asset of assetQueue){
    asset.dependencies.forEach( relativePath => {
      let absolutePath = path.resolve(dirname, relativePath)
      let child = createAsset(absolutePath)
      mainAsset.mapping[relativePath] = child.id
      assetQueue.push(child)
    });
  }
  return assetQueue
}

function bundle (graph) {
  return graph
  // modules = ''
  // graph.forEach(mod => {
  //   modules += `${mod.id}:[function(require, module, exports){
  //     ${mod.code}
  //   }, ${JSON.stringify(mod.mapping || null)}],`
  // })
  
  // let result = `(function(modules){
  //   function require(id) {
  //     let [fn, mapping] = modules[id]

  //     function localRequire(name) {
  //       return require(mapping[name])
  //     }

  //     let module = {exports : {}}

  //     fn (localRequire, module, module.exports)

  //     return module.exports
  //   }
  // })({${modules}})`

  // return result
}

// function outPut (code, outputPath) {
//   // console.log(code, 'CODE')
//   // console.log(outputPath, 'OUTPUTPATH')
//   var dir = path.dirname(outputPath)
//   if (!fs.existsSync(dir)){
//     fs.mkdirSync(dir);
//   }
//   fs.writeFileSync(outputPath, code)
// }
var graph = createGraph(FILE)
var bundleCode = bundle(graph)
console.log(bundleCode)
// eval(bundleCode)
// outPut(bundleCode, path.join(__dirname, './dist/bundle.js'))