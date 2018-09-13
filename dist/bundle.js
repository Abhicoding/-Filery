(function(modules){
    function require(id) {
      let [fn, mapping] = modules[id]

      function localRequire(name) {
        return require(mapping[name])
      }

      let module = {exports : {}}

      fn (localRequire, module, module.exports)

      return module.exports
    }
  })({1:[function(require, module, exports){
      const name = require('./name');

import team from './team.js';
import goals from './goals.js';
var message = `${name} is a player who plays for ${team} 
  and has scored ${goals} goals.`;
console.log(message);
    }, {"./team.js":2,"./goals.js":3}],2:[function(require, module, exports){
      export default {
  team: 'FC Barcelona'
};
    }, null],3:[function(require, module, exports){
      export default {
  goals: 567
};
    }, null],})