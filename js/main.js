const hashcode = require('./hashcode');
const optimize = require('./optimize');
const scoreModule = require('./score');

console.log('--------- BEGIN -----------');
const setup = hashcode.loadFile(process.argv[2]);
console.log('setup:', JSON.stringify(setup, null, 4));
const result = optimize.optimize(setup);
console.log('result:', JSON.stringify(result, null, 4));
const score = scoreModule.getScore(setup, result);
console.log('score:', score);
hashcode.saveFile(hashcode.streamResult(result), `${process.argv[2].slice(0, -2)}out`);
console.log('---------- END ------------');
