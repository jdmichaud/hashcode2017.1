const lodash = require('lodash');
const constants = require('./constants');

function random(max) {
  return Math.floor((max + 1) * Math.random());
}

/*
 * Just assign videos to cache server in the order there appear in the size list
 */
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

/*
 * Sort the requests by their occurence. Then assign the video to the fastest
 * cache server.
 */
function rank_optimize(setup) {
  function usage(allocation) {
    return allocation.reduce((acc, videoId) => acc + setup.vsizes[videoId], 0);
  }

  const result = {};
  result.allocations = [];
  // Sort the request by the number of request * the latency of the endpoint to the datacenter
  const sortedRequests = lodash.sortBy(setup.requests, [function(request) {
    return -(request.nbRequests * setup.endpoints[request.endpointId].latencyToD);
  }]);

  const availableVideos = setup.vsizes.map(x => true);
  allocations = {};
  sortedRequests.forEach((request) => {
    // console.log('request', request);
    const sortedCacheServers = lodash.sortBy(setup.endpoints[request.endpointId].cacheServers, function(cacheServer) {
     return cacheServer.latency;
    });
    // console.log('sortedCacheServers:', sortedCacheServers);
    for (var i = 0; i < sortedCacheServers.length; i++) {
      const fastest = sortedCacheServers[i];
      // console.log('fastest', fastest);
      // Check if the cache server already has videos associated
      if (!lodash.has(allocations, fastest.csId)) {
        allocations[fastest.csId] = [];
      }
      // Can we squeeze this video
      if ((usage(allocations[fastest.csId]) + setup.vsizes[request.videoId]) <= setup.parameters.X) {
        // Yes push it in the allocation
        allocations[fastest.csId].push(request.videoId);
        // Break the loop
        // console.log('break!');
        break ;
      }
    }
    // console.log(allocations);
  })
  lodash.forOwn(allocations, function (videos, csId) {
    result.allocations.push({ csId: parseInt(csId, 10), videos: videos });
  })
  // Filter empty allocation
  result.allocations = result.allocations.filter(allocation => allocation.videos.length > 0);
  // Remove duplicate
  result.allocations.forEach(allocation => allocation.videos = lodash.uniq(allocation.videos))
  result.nbCS = result.allocations.length;
  return result;
}


function optimize(setup) {
  return rank_optimize(setup);
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
