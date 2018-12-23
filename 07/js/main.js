'use strict';

const puzzleData = 'js/puzzle.json';
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');

let startPoint;
let endPoint;
let paths;
let path;

const testPuzzle = [
  "Step C must be finished before step A can begin.",
  "Step C must be finished before step F can begin.",
  "Step A must be finished before step B can begin.",
  "Step A must be finished before step D can begin.",
  "Step B must be finished before step E can begin.",
  "Step D must be finished before step E can begin.",
  "Step F must be finished before step E can begin."
];

function extractRules(arr) {
  const result = arr.map(i=>{
    const first = i.match(/(Step [A-Z])/g).toString().replace('Step ','');
    const second = i.match(/(step [A-Z])/g).toString().replace('step ','');
    return [first,second];
  });
  return result;
}

function getUniqueItems(arr) {
  const u = new Set(arr.flat());
  return Array.from(u);
}

function getNotIncludedLetter(arr1,arr2) {
  return arr1.filter((item, index)=>{
    if (!arr2.includes(item))
      return item;
  });
}

function getStartPoint(arr) {
  let zeroLetters = getUniqueItems(arr.map(i=>i[0]));
  let unoLetters = getUniqueItems(arr.map(i=>i[1]));
  let startLetter = getNotIncludedLetter(zeroLetters, unoLetters);

  return startLetter.toString();
}

function getEndPoint(arr) {
  let zeroLetters = getUniqueItems(arr.map(i=>i[0]));
  let unoLetters = getUniqueItems(arr.map(i=>i[1]));
  let endLetter = getNotIncludedLetter(unoLetters, zeroLetters);

  return endLetter.toString();
}

function getTotalPaths(letter,arr) {
  return arr.filter(item=>item[1]===letter).length;
}

function getNextStep(letter, steps) {
  return steps.filter(i=>i[0]===letter).map(i=>i[1]);
}

function getPaths(letter,steps, acc) {
  if (letter === startPoint) {
    acc.push(letter);
  }
  const n = getNextStep(letter, steps);
  console.log(n);
  if (n.length > 1) {
    for (const i of n) {
      console.log(i);
      acc.push(i);
      getPaths(i,steps, acc);

    }
  } else if (n[0] === endPoint) {
    console.log('fin');
    acc.push(n[0]);
    return;
  } else {
    acc.push(n[0]);
  }
}


// ---

fetch(puzzleData)
  .then(res => res.json())
  .then(data => {

    // Part 1
      const rules = extractRules(testPuzzle);
      console.log(rules);
      startPoint = getStartPoint(rules);
      endPoint = getEndPoint(rules);
      paths = getTotalPaths(endPoint,rules);
      path = [];
      console.log('>', startPoint);
      console.log('>', endPoint);
      console.log('>', paths);


      getPaths(startPoint, rules, path);
      console.log('>>', path);
    //result1.innerHTML = ;

    // Part 2
    //result2.innerHTML = ;
  });

