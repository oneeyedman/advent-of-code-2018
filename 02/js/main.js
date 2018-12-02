'use strict';

const puzzleData = 'js/puzzle.json';
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');

function getUniqueCriaturas(str) {
  const u = new Set(str);
  return Array.from(u).join('');
}

function getUniqueRepeaters(arr) {
  let ur2 = arr.filter(i=>i[1]===2).length;
  let ur3 = arr.filter(i=>i[1]===3).length;
  ur2 = (ur2 > 1) ? 1 : ur2;
  ur3 = (ur3 > 1) ? 1 : ur3;
  const ur = [['2',ur2],['3',ur3]];
  return ur;
}

function checkIDs(strID) {
  const results = [];
  const uniques = getUniqueCriaturas(strID);
  for (let i = 0; i<uniques.length; i++) {
    const r = strID.match(new RegExp(uniques[i],'gi')).length;
    if (r > 1) {
      results.push([uniques[i],r]);
    }
  }
  return getUniqueRepeaters(results);
}

function checkIdSet(arr) {
  const repeaters = [];
  for (const i of arr) {
    const r = checkIDs(i);
    r.map(i=>repeaters.push(i));
    
  }
  return repeaters;
}

function createChecksum(arr) {
  const r2 = arr.filter(i=>(i[0]=== '2' && i[1] >0 )).length;
  const r3 = arr.filter(i=>(i[0]=== '3' && i[1]>0) ).length;
  return r2*r3;
}

function checkStrs(a,b) {
  const strLength = a.length;
  let diffs = 0;
  for (let i = 0; i<strLength;i++) {
    if (a[i] != b[i]) {
      diffs++;
    }
  }
  return diffs;
}

function findSimilarIDs(arr) {
  const similars = [];
  arr.map((item,index)=>{
    for (let n=0;n<arr.length;n++) {
      if (checkStrs(item,arr[n]) === 1) {
        const pos = [index,n].sort();
        const strs = [item,arr[n]].sort();
        similars.push({
          "position": pos,
          "strs": strs
        });
      }
    }
  });
  return(similars[0]);
}

function getUniqueChars(a,b) {
  const result = [];
  const strLength = a.length;

  for (let i=0;i<strLength;i++) {
    if (a[i] === b[i]) {
      result.push(a[i]);
    }
  }
  const uniqueChars = result.join('');
  return uniqueChars;
}


fetch(puzzleData)
  .then(res => res.json())
  .then(data => {
    // Part 1
    result1.innerHTML = createChecksum(checkIdSet(data));

    // Part 2
    const result = findSimilarIDs(data);
    const firstStr = data[result.position[0]];
    const secondStr = data[result.position[1]];
    result2.innerHTML = getUniqueChars(firstStr, secondStr);
  });
