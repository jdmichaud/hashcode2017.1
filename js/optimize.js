const lodash = require('lodash');
const constants = require('./constants');

function random(max) {
  return Math.floor((max + 1) * Math.random());
}

function rand_optimize(setup) {
  const result = {};
  result.allocations = [];
  const videos = setup.vsizes.map(x => true);
  for (let csId = 0; csId < setup.parameters.C; csId += 1) {
    const allocation = {};
    allocation.csId = csId;
    allocation.videos = [];
    let usage = 0;
    for (let videoId = videos.length - 1; videoId >= 0; videoId -= 1) {
      // Can we squeeze this video
      if (videos[videoId] && ((usage + setup.vsizes[videoId]) <= setup.parameters.X)) {
        // Yes push it in the allocation
        allocation.videos.push(videoId);
        // Increase usage of the current cache server
        usage += setup.vsizes[videoId];
        // Remove the video from the list
        videos[videoId] = false;
      }
    }
    result.allocations.push(allocation);
  }
  // Filter empty allocation
  result.allocations = result.allocations.filter(allocation => allocation.videos.length > 0);
  result.nbCS = result.allocations.length;
  return result;
}

function optimize(setup) {
  return rand_optimize(setup);
}

module.exports = {
  optimize,
};


// {
//   nbCS: 3,
//   allocations: [{
//     csId: 0,
//     videos: [2],
//   }, {
//     csId: 1,
//     videos: [3, 1],
//   }, {
//     csId: 2,
//     videos: [0, 1],
//   }]
// }
