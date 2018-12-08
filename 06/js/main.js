'use strict';

const puzzleData = 'js/puzzle.json';
const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');
const grid = document.querySelector('.area__grid');
const testPuzzle = [
  [1, 1],
  [1, 6],
  [8, 3],
  [3, 4],
  [5, 5],
  [8, 9]
];

function getDimensions(arr) {
  let max = 0;
  for (const a of arr) {
    if (max<= a[0]) max = a[0];
    if (max<= a[1]) max = a[1];
  }
  return max;
}

function populateCanvas(arr, canvas) {
  for (let i=0; i<arr.length;i++) {
    canvas[arr[i][0]][arr[i][1]] = alphabet[i].toUpperCase();
  }

  return canvas;
}

function createCanvas(arr){
  const d = getDimensions(arr);
  let canvas = [];

  for (let i = 0; i<= d; i++) {
    let row = [];
    for (let j = 0; j<= d; j++) {
      row[j] = '.';
    }
    canvas[i] = row;
  }

  canvas = populateCanvas(arr,canvas);
  console.log(canvas);
  return canvas;
}

function paintCanvas(el,arr){
  let items = '';
  const d = arr.length;

  for (let i=0;i<d;i++) {
    for (let j=0;j<d;j++) {
      items += `<li class="area__grid-item">${arr[j][i]}</li>`;
    }
  }
  el.innerHTML = items;
  el.style = `grid-template-columns: repeat(${d}, 30px);`;
}

function orderMinToMax(arr) {
  arr.sort((a,b)=>{
    return (a.value < b.value) ? -1 : 1;
  });
}

function checkCoord(c,arr){
  const distances = [];
  for (let i=0;i<arr.length;i++) {
    distances[i] = {
      letter: alphabet[i],
      value: Math.abs(arr[i][0]-c[0]) + Math.abs(arr[i][1]-c[1])
    };
  }
  orderMinToMax(distances);
  return (distances[0].value === distances[1].value) ? '.':distances[0].letter;
}

function showAreas(arr) {
  for (let i=0;i<arr.length;i++) {
    for (let j=0;j<arr.length;j++) {
      if (arr[i][j] === '.') {
        arr[i][j] = checkCoord([i,j],testPuzzle);
      }
    }
  }
}

//console.log('>', checkCoord([5,0],testPuzzle));
const canvas = createCanvas(testPuzzle);

showAreas(canvas);

paintCanvas(grid,canvas);


fetch(puzzleData)
  .then(res => res.json())
  .then(data => {

    // Part 1
    result1.innerHTML = '---';

    // Part 2
    result2.innerHTML = '---';
  });

