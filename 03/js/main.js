'use strict';

const puzzleData = 'js/puzzle.json';
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');


function makeDataReadable(arr) {
  const result = [];
  for (const c of arr) {
    const claimId = c.match(/(\#)\w+/g).join().replace('#','');
    const coords = c.match(/([0-9]+,)\w+/g).join().split(',');
    const area = c.match(/([0-9]+x)\w+/g).join().split('x');
    result.push({
      'id': claimId,
      'coords': coords,
      'area': area
    });
  }
  return result;
}

function createFabric(w,h) {
  const arr = [];
  for (let i=0;i<w;i++) {
    arr[i]=[];
    for (let j=0;j<w;j++) {
      arr[i][j]=[];
    }
  }
  return arr;
}

function paintFabric(arr) {
  const w = arr.length;
  const h = arr[0].length;
  for (let i=0;i<w;i++) {
    let row = '';
    for (let j=0;j<w;j++) {
      const cell = arr[i][j];
      if (cell.length === 0) {
        row += '.';
      } else if (cell.length === 1) {
        row += cell.toString()
      } else {
        row += 'X';
      }
    }
    console.log(i,row);
  }
}

function paintMe(data) {
  const elfId = parseInt(data.id);
  const x = parseInt(data.coords[0]);
  const y = parseInt(data.coords[1]);
  const w = parseInt(data.area[0]);
  const h = parseInt(data.area[1]); 

  for (let i = x; i<(x+w); i++) {
    for (let j = y; j<(y+h); j++) {
      if ( fabric[j][i].length === 0) {
        fabric[j][i] = [elfId];
      } else {
        fabric[j][i].push(elfId);
      }
    } 
  }
}

function findCompleteMe(data) {
  const elfId = parseInt(data.id);
  const x = parseInt(data.coords[0]);
  const y = parseInt(data.coords[1]);
  const w = parseInt(data.area[0]);
  const h = parseInt(data.area[1]);
  let complete = true;

  for (let i = x; i<(x+w); i++) {
    for (let j = y; j<(y+h); j++) {
      if ( fabric[j][i].length > 1) {
        complete = false;
      }
    } 
  }
  const result = {
    "id": elfId,
    "complete": complete
  }
  return result;
}

function getOverClaimedInches(arr) {
  const w = arr.length;
  const h = arr[0].length;
  let result = 0;

  for (let i=0;i<w;i++) {
    for (let j=0;j<w;j++) {
      if (arr[i][j].length > 1) {
        result++;
      }
    }
  }

  return result;
}

const fabric = createFabric(1000,1000);
let betterPuzzle;

fetch(puzzleData)
  .then(res => res.json())
  .then(data => {
    // Part 1
    betterPuzzle = makeDataReadable(data);

    for (const claim of betterPuzzle) {
      paintMe(claim);
    }

    result1.innerHTML = getOverClaimedInches(fabric);

    // Part 2
    for (const claim of betterPuzzle) {
      const r = findCompleteMe(claim);
      if (r.complete) {
       result2.innerHTML = r.id;
      }
    }
  });

