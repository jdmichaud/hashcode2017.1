const hashcode = require('./hashcode');
const optimize = require('./optimize');

const setup = hashcode.loadFile(process.argv[2]);
const result = optimize.optimize(setup.pizza, setup.parameters, optimize.smallSliceGenerator);
const results = hashcode.streamResult(bestSlices);
hashcode.saveFile(results, `${process.argv[2].slice(0, -2)}out`);
console.log('--------- BEGIN -----------');
console.log(results);
console.log('---------- END ------------');
