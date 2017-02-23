const fs = require('fs');
const path = require('path');

const hashcode = require('./hashcode');
const optimize = require('./optimize');
const scoreModule = require('./score');

const inputDir = '../input';

function apply(fileName) {
   let time = Date.now();

    console.log('\n--------- BEGIN -----------');
    console.log('file:', fileName)
    const setup = hashcode.loadFile(path.join(inputDir, fileName));
    //console.log('setup:', setup);
    const result = optimize.optimize(setup);
    //console.log('result:', JSON.stringify(result, null, 4));
    const score = scoreModule.getScore(setup, result);
    console.log('time:', (Date.now() - time) + 'ms');
    console.log('score:', score);
    console.log('---------- END ------------');
    hashcode.saveFile(hashcode.streamResult(result), `${fileName.slice(0, -2)}out`);
    // const results = hashcode.streamResult(bestSlices);
    // hashcode.saveFile(results, `${process.argv[2].slice(0, -2)}out`);
    // console.log('--------- BEGIN -----------');
    // console.log(results);
    // console.log('---------- END ------------');

    return score;
}

function applyAll() {
    let fileNames = fs.readdirSync(inputDir).filter(fileName => /^[a-z_]+\.in$/.test(fileName)),
        totalScore = 0;

    fileNames.forEach(fileName => {
        totalScore += apply(fileName);
    });

    console.log('\nTotal score:', totalScore, '\n');
}

applyAll();