const fs = require('fs');
const path = require('path');

const hashcode = require('./hashcode');
const optimize = require('./optimize');
const scoreModule = require('./score');

const inputDir = '../input';
const outputDir = '../output';

function apply(fileName) {
    let time = Date.now();

    console.log('\n--------- BEGIN -----------');
    console.log('file:', fileName);
    const setup = hashcode.loadFile(path.join(inputDir, fileName));
    const result = optimize.optimize(setup);
    const score = scoreModule.getScore(setup, result);
    console.log('time:', (Date.now() - time) + 'ms');
    console.log('score:', score);
    console.log('---------- END ------------');

    return {
        result: result,
        score: score
    };
}

function applyAll() {
    let fileNames = fs.readdirSync(inputDir).filter(fileName => /^[a-z_]+\.in$/.test(fileName)),
        outputs = [],
        totalScore = 0;

    fileNames.forEach(fileName => {
        var res = apply(fileName);
        outputs.push({
            fileName: fileName,
            result: res.result
        });
        totalScore += res.score;
    });

    console.log('\nTotal score:', totalScore, '\n');

    let outputFolder = path.join(outputDir, Date.now() + ' ' + totalScore);

    fs.mkdirSync(outputFolder);

    outputs.forEach(output => hashcode.saveFile(hashcode.streamResult(output.result), path.join(outputFolder, output.fileName.slice(0, -2) + 'out')));
}

applyAll();