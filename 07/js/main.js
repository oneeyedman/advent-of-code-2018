'use strict';

const puzzleData = 'js/puzzle.json';
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');

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

function getUniqueSteps(arr) {
  const u = new Set(arr.flat());
  return Array.from(u);
}

const rules = extractRules(testPuzzle);
const steps = getUniqueSteps(rules);
console.log(steps);


steps.sort((a,b)=>{
  if (a==='C' && b == 'A') {
    return -1;
  } else if (a==='C' && b == 'F') {
    return -1;
  } else if (a==='C' && b == 'F') {
    return -1;
  } else if (a==='A' && b == 'B') {
    return -1;
  } else if (a==='A' && b == 'D') {
    return -1;
  } else if (a==='B' && b == 'E') {
    return -1;
  } else if (a==='D' && b == 'E') {
    return -1;
  } else if (a==='F' && b == 'E') {
    return -1;
  } else {
    return 0;
  }
});
console.log('---');
console.log(steps);

console.log(
  '%cHave a nice day!',
  'font-size: 20px; background-color: yellow; color:red; margin-left: 20px;'
);

for (let i=0;i<10;i++) {
  console.log(i);
}


fetch(puzzleData)
  .then(res => res.json())
  .then(data => {

    // Part 1
    //result1.innerHTML = ;

    // Part 2
    //result2.innerHTML = ;
  });

