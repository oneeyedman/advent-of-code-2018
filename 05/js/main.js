'use strict';

const puzzleData = 'js/puzzle.json';
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const reactionCases = new RegExp(createCasesList(alphabet).join('|'),'g');
const unitCases = createUnitsList(alphabet);
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');

function createCasesList(str) {
  const result = [];
  for (const r of str.split('')) {
    const i = [r.toLowerCase() + r.toUpperCase(), r.toUpperCase() + r.toLowerCase()];
    result.push(i);
  }
  return result.flat();
}

function createUnitsList(str) {
  const result = [];
  for (const r of str.split('')) {
    const i = [r.toLowerCase() + '|' +r.toUpperCase()];
    result.push(i);
  }
  return result.flat();
}

function activateReaction(polymer) {
  let newPolymer = polymer;
  if (polymer.match(reactionCases)) {
    newPolymer = polymer.replace(reactionCases, '');
    return activateReaction(newPolymer);
  } else {
    return newPolymer.length;
  }
}

function getLowerCount(arr) {
  arr.sort((a,b)=> a.count - b.count);
  return arr[0].count;
}

function getUnitActivationResult(str) {
  let results = [];
  for (const unit of unitCases) {
    const test = str.replace( new RegExp(unit, 'g'), '' );
    results.push({unit: unit[0].toLowerCase(), count: activateReaction(test)});
  }
  return getLowerCount(results);
}

fetch(puzzleData)
  .then(res => res.json())
  .then(data => {

    // Part 1
    result1.innerHTML = activateReaction(data.polymer);

    // Part 2
    result2.innerHTML = getUnitActivationResult(data.polymer);
  });

