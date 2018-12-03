'use strict';

const puzzleData = 'js/puzzle.json';
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');

const puzzle = [
  "#1 @ 1,3: 4x4",
  "#2 @ 3,1: 4x4",
  "#3 @ 5,5: 2x2",
];

const betterPuzzle = [];

function makeDataReadable(arr) {
  for (const c of arr) {
    // /(\#)\w+/g
    const claimId = c.match(/(\#)\w+/g).join().replace('#','');
    
    // /([0-9],)\w+/g
    const coords = c.match(/([0-9],)\w+/g).join().split(',');
    const area = c.match(/([0-9]x)\w+/g).join().split('x');

    console.log('>',claimId);
    console.log('>',coords);
    console.log('>',area);
    betterPuzzle.push({
      'id': claimId,
      'coords': coords,
      'area': area
    });
  }
  console.log('>>', betterPuzzle );
}
makeDataReadable(puzzle);

/*
fetch(puzzleData)
  .then(res => res.json())
  .then(data => {
    // Part 1
    //result1.innerHTML = createChecksum(checkIdSet(data));

    // Part 2
    //result2.innerHTML = getUniqueChars(firstStr, secondStr);
  });
  */
