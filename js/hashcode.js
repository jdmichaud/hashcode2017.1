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
    V: parseInt(values[0], 10),
    E: parseInt(values[1], 10),
    R: parseInt(values[2], 10),
    C: parseInt(values[3], 10),
    X: parseInt(values[4], 10),
  };
}

function loadEndpoint(lines, startIndex, endpoint) {
  // Latency to DataCenter
  endpoint.latencyToD = parseInt(lines[startIndex].split(/\W+/)[0], 10);
  // Number of Cache Servers
  endpoint.nbCS = parseInt(lines[startIndex].split(/\W+/)[1], 10);
  endpoint.cacheServers = [];
  for (let i = 0; i < endpoint.nbCS; i += 1) {
    const cs = {};
    cs.csId = parseInt(lines[startIndex + i + 1].split(/\W+/)[0], 10);
    cs.latency = parseInt(lines[startIndex + i + 1].split(/\W+/)[1], 10);
    endpoint.cacheServers.push(cs);
  }
  return startIndex + endpoint.nbCS + 1;
}

function loadRequest(lines, startIndex) {
  const request = {};
  request.videoId = parseInt(lines[startIndex].split(/\W+/)[0], 10);
  request.endpointId = parseInt(lines[startIndex].split(/\W+/)[1], 10);
  request.nbRequests = parseInt(lines[startIndex].split(/\W+/)[2], 10);
  return request;
}

function loadFile(filepath) {
  const lines = fixEncoding(fs.readFileSync(filepath)).split('\n');
  const parameters = decodeParameters(lines[0]);
  const vsizes = lines[1].split(/\W+/).map(size => parseInt(size, 10));
  // Create the Endpoint
  const endpoints = Array(parameters.E);
  let nextIndex = 2;
  for (let i = 0; i < parameters.E; i += 1) {
    endpoints[i] = {};
    nextIndex = loadEndpoint(lines, nextIndex, endpoints[i]);
  }
  // Load request
  const requests = Array(parameters.E);
  for (let j = 0; j < parameters.R; j += 1) {
    requests[j] = loadRequest(lines, nextIndex + j);
  }
  return {
    parameters: parameters,
    endpoints: endpoints,
    requests: requests,
    vsizes: vsizes,
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
