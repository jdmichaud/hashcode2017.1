/* eslint no-mixed-operators: 0 */

const fs = require('fs');
const iconv = require('iconv-lite');
const lodash = require('lodash');

const constants = require('./constants');

/**
 * Convert from the original latin1 to proper utf8
 * @param buffer {Buffer} Take a javascript Buffer object as returned by readfile
 * @returns a utf-8 encoded string
 */
function fixEncoding(buffer) {
  // Convert from an encoded buffer to js string.
  return iconv.decode(buffer, 'latin1');
}

function decodeParameters(line) {
  const values = line.split(/\W+/);
  return {
    R: parseInt(values[0], 10),
    C: parseInt(values[1], 10),
    L: parseInt(values[2], 10),
    H: parseInt(values[3], 10),
  };
}

function loadFile(filepath) {
  const lines = fixEncoding(fs.readFileSync(filepath)).split('\n');
  const parameters = decodeParameters(lines[0]);
  // Create the pizza
  const pizza = Array(parameters.R);
  for (let i = 0; i < parameters.R; i += 1) {
    pizza[i] = new Array(parameters.C).fill('.');
  }
  // Load rest of file
  for (let i = 0; i < parameters.R; i += 1) {
    for (let j = 0; j < parameters.C; j += 1) {
      pizza[i][j] = lines[i + 1][j];
    }
  }
  return {
    parameters: parameters,
    pizza: pizza,
  };
}

function streamResult(slices) {
  let output = `${slices.length}`;
  // Build output
  slices.forEach((slice) => {
    output += '\n';
    output += `${slice[0][0]} ${slice[0][1]} ${slice[1][0]} ${slice[1][1]}`;
  });
  return output;
}

function getSliceSice(slice) {
  return (slice[1][0] - slice[0][0] + 1) * (slice[1][1] - slice[0][1] + 1);
}

function score(slices) {
  return slices.reduce((accumulator, slice) =>
    accumulator + getSliceSice(slice),
  0);
}

function saveFile(results, filepath) {
  fs.writeFileSync(filepath, results);
}

module.exports = {
  loadFile,
  streamResult,
  saveFile,
  score,
};
