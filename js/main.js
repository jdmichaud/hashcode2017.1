const hashcode = require('./hashcode');
const optimize = require('./optimize');
const scoreModule = require('./score');

console.log('--------- BEGIN -----------');
const setup = hashcode.loadFile(process.argv[2]);
console.log('setup:', setup);
const result = optimize.optimize(setup);
console.log('result:', JSON.stringify(result, null, 4));
const score = scoreModule.getScore(setup, result);
console.log('score:', score);
console.log('---------- END ------------');
// const results = hashcode.streamResult(bestSlices);
// hashcode.saveFile(results, `${process.argv[2].slice(0, -2)}out`);
// console.log('--------- BEGIN -----------');
// console.log(results);
// console.log('---------- END ------------');
