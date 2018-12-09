'use strict';

const puzzleData = 'js/puzzle.json';
const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'aa',
  'ab',
  'ac',
  'ad',
  'ae',
  'af',
  'ag',
  'ah',
  'ai',
  'aj',
  'ak',
  'al',
  'am',
  'an',
  'ao',
  'ap',
  'aq',
  'ar',
  'as',
  'at',
  'au',
  'av',
  'aw',
  'ax',
  'ay',
  'az',
  'ba',
  'bb',
  'bc',
  'bd',
  'be',
  'bf',
  'bg',
  'bh',
  'bi',
  'bj',
  'bk',
  'bl',
  'bm',
  'bn',
  'bo',
  'bp',
  'bq',
  'br',
  'bs',
  'bt',
  'bu',
  'bv',
  'bw',
  'bx',
  'by',
  'bz',
  ]
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');
const grid = document.querySelector('.area__grid');
const gridAlt = document.querySelector('.area__grid-alt');
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

function getDistances(c,arr) {
  const results = [];
  for (let i=0;i<arr.length;i++) {
    results[i] = {
      letter: alphabet[i],
      value: Math.abs(arr[i][0]-c[0]) + Math.abs(arr[i][1]-c[1])
    };
  }
  return results;
}

function checkCoord(c,arr){
  const distances = getDistances(c,arr);
  orderMinToMax(distances);
  return (distances[0].value === distances[1].value) ? '.':distances[0].letter;
}

function showAreas(arr,originalData) {
  for (let i=0;i<arr.length;i++) {
    for (let j=0;j<arr.length;j++) {
      if (arr[i][j] === '.') {
        arr[i][j] = checkCoord([i,j],originalData);
      }
    }
  }
}

function getUniqueAreas(arr) {
  const u = new Set(arr.map(i=>i.toLowerCase()));
  return Array.from(u).filter(i=>i!=='.').sort();
}

function getAreaSizes(arr,areaNames,infiniteAreas) {
  let sizes = [];
  for (const a of areaNames) {
    let area = arr.filter(i=>i===a);
    sizes.push({
      area: a,
      finite: !infiniteAreas.includes(a),
      size: area.length
    });
  }
  return sizes;
}

function excludeAndOrderInfiniteItems(arr) {
  let finiteArr = arr.filter(i=>i.finite);
  return finiteArr.sort((a,b)=>(a.size<b.size)? 1: -1);
}

function findLargerFiniteArea(infinite,arr){
  const areas = arr.flat().map(i=>i.toLowerCase());
  const totalAreas = getUniqueAreas(areas).filter(i=>i!=='.');
  const sizes = getAreaSizes(areas,totalAreas,infinite);
  const finiteSizes = excludeAndOrderInfiniteItems(sizes);
  return finiteSizes[0];
}

function findInfiniteAreas(arr) {
  let borderAreas = [];
  for (let i=0;i<arr.length;i++) {
    borderAreas.push(arr[i][0]);
    borderAreas.push(arr[i][arr.length-1]);
  }
  for (let i=0;i<arr.length;i++) {
    borderAreas.push(arr[0][i]);
    borderAreas.push(arr[arr.length-1][i]);
  }
  const infiniteAreas = getUniqueAreas(borderAreas);
  return findLargerFiniteArea(infiniteAreas,arr);
}

function getCoordDistances(c,arr){
  const distances = getDistances(c,arr);
  orderMinToMax(distances);
  return distances;
}

function getTotalDistanceValue(arr) {
  return arr.reduce((acc,i)=>acc += i.value, 0);
}

function markMinArea(arr, coords) {
  let minArea = 0;
  for (let i=0;i<arr.length;i++) {
    for (let j=0;j<arr.length;j++) {
      const d = getTotalDistanceValue( getCoordDistances([i,j],coords) );
      if (d<32) {
        arr[i][j] = '#';
        minArea++;
      } else {
        arr[i][j] = '-';
      }
    }
  }
  console.log(minArea);
}

fetch(puzzleData)
  .then(res => res.json())
  .then(data => {

    // Part 1
    const canvas = createCanvas(testPuzzle);
    showAreas(canvas, testPuzzle);
    const canvasS2 = canvas.slice(0)
    findInfiniteAreas(canvas);
    //paintCanvas(grid,canvas);
    result1.innerHTML = findInfiniteAreas(canvas).size;

    // Part 2
    paintCanvas(grid,canvasS2);
    markMinArea(canvasS2,testPuzzle);
    paintCanvas(gridAlt,canvasS2)
    result2.innerHTML = '---';
  });

