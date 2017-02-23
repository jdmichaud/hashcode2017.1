module.exports = {
    getScore: getScore
};

function getScore(input, output) {
    let score = 0, nbRequests = 0;

    input.requests.forEach(req => {
        let endpoint = input.endpoints[req.endpointId],
            latency = endpoint.latencyToD;

        output.allocations.forEach(alloc => {
            if (alloc.videos.indexOf(req.videoId) !== -1) {
                var cs = endpoint.cacheServers.filter(cs => cs.csId === alloc.csId);
                cs[0] && (latency = Math.min(latency, cs[0].latency));
            }
        });

        nbRequests += req.nbRequests;
        score += (endpoint.latencyToD - latency) * req.nbRequests;
    });

    return parseInt(score / nbRequests * 1000);
}


// var input = {
//     "parameters": {
//         "V": 5,
//         "E": 2,
//         "R": 4,
//         "C": 3,
//         "X": 100
//     },
//     vsizes: ['50', '50', '80', '30', '110'],
//     "endpoints": [
//         {
//             "latencyToD": 1000,
//             "nbCS": 3,
//             "cacheServers": [
//                 {csId: 0, latency: 100},
//                 {csId: 2, latency: 200},
//                 {csId: 1, latency: 300}
//             ]
//         },
//         {
//             "latencyToD": 500,
//             "nbCS": 0,
//             "cacheServers": []
//         }
//     ],
//     "requests": [
//         {
//             "videoId": 3,
//             "endpointId": 0,
//             "nbRequests": 1500
//         },
//         {
//             "videoId": 0,
//             "endpointId": 1,
//             "nbRequests": 1000
//         },
//         {
//             "videoId": 4,
//             "endpointId": 0,
//             "nbRequests": 500
//         },
//         {
//             "videoId": 1,
//             "endpointId": 0,
//             "nbRequests": 1000
//         }
//     ]
// };
//
// var output = {
//     nbCS: 3,
//     allocations: [{
//         csId: 0,
//         videos: [2],
//     }, {
//         csId: 1,
//         videos: [3, 1],
//     }, {
//         csId: 2,
//         videos: [0, 1],
//     }]
// };
//
// console.log(getScore(input, output));