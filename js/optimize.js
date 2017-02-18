const lodash = require('lodash');

const constants = require('./constants');

// Generate all the possible slices that satisfies the conditions
function* smallSliceGenerator(L, H) {
  for (let i = 0; i < H; i += 1) {
    for (let j = 0; (i + 1) * (j + 1) <= H; j += 1) {
      if (((i + 1) * (j + 1)) >= L * 2) {
        yield [[0, 0], [i, j]];
      }
    }
  }
}

function* bigSliceGenerator(L, H) {
  for (let i = H - 1; i >= 0; i -= 1) {
    for (let j = Math.floor((H / (i + 1)) - 1); j >= 0; j -= 1) {
      if (((i + 1) * (j + 1)) >= L * 2) {
        yield [[0, 0], [i, j]];
      }
    }
  }
}


function isSliceValid(pizza, parameters, slice) {
  let T = 0;
  let M = 0;
  let taken = 0;
  for (let i = slice[0][0]; i <= slice[1][0]; i += 1) {
    for (let j = slice[0][1]; j <= slice[1][1]; j += 1) {
      if (i >= parameters.R || j >= parameters.C) return false;
      else if (pizza[i][j] === 'M') M += 1;
      else if (pizza[i][j] === 'T') T += 1;
      else if (pizza[i][j] === '.') taken += 1;
    }
  }
  if (taken === 0 && T >= parameters.L && M >= parameters.L) {
    return true;
  }
  return false;
}

// Once a slice is taken, mark the pizza with '.'
function takeSlice(pizza, parameters, slice) {
  for (let i = slice[0][0]; i <= slice[1][0] && i < parameters.R; i += 1) {
    for (let j = slice[0][1]; j <= slice[1][1] && j < parameters.C; j += 1) {
      pizza[i][j] = '.';
    }
  }
  return pizza;
}

function optimize(_pizza, parameters, generator) {
  let pizza = lodash.cloneDeep(_pizza);
  const validSlices = [];
  for (let i = 0; i < parameters.R; i += 1) {
    for (let j = 0; j < parameters.C; j += 1) {
      const slices = generator(parameters.L, parameters.H);
      let slice = slices.next().value;
      while (slice) {
        // Move the slice in position
        slice[0][0] += i;
        slice[1][0] += i;
        slice[0][1] += j;
        slice[1][1] += j;
        if (isSliceValid(pizza, parameters, slice)) {
          validSlices.push(slice);
          pizza = takeSlice(pizza, parameters, slice);
          break;
        }
        slice = slices.next().value;
      }
    }
  }
  return validSlices;
}

module.exports = {
  optimize,
  smallSliceGenerator,
  bigSliceGenerator,
};
