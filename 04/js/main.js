'use strict';

const puzzleData = 'js/puzzle.json';
const result1 = document.querySelector('#result-1');
const result2 = document.querySelector('#result-2');
let strategy2Data = [];

/*
  RegExp
  
  Date: /([0-9]+\-[0-9]+\-[0-9]+)/g
  time: /([0-9]+\:[0-9]+)/g
  hours: /([0-9]+[:])/g
  minutes: /([:][0-9][0-9])/g
  id: /(#[0-9]+)/g
  
*/

function checkIntegrity(arr) {
  let guards = 0;
  let sleeps = 0;
  let result = true;

  for (const a of arr) {
    if (a.match('Guard')) {
      guards++;
    } else if (a.match('falls')) {
      sleeps++;
    }
  }

  const items = guards + (sleeps*2);
  
  if (items !== arr.length) {
    result =  false;
  }
  return result;
}

function getGuardId(str) {
  const gId = str.match(/(#[0-9]+)/g).toString().replace('#','');
  return gId;
}

function getMinutes(str) {
  const min = str.match(/([:][0-9][0-9])/g).toString().replace(':','');
  return min;
}

function markGoodGuards(arr) {
  const results = [];

  for (let i=0;i<arr.length;i++) {
    if (arr[i].match('Guard')) {
      if (arr[i+1].match('Guard')) {
          //const guardId = getGuardid(arr[i]);
          arr[i] = '---';
      }
    }
  }
}

function getSleepMinutes(arr) {
  let results = [];
  let guards = {};
  let gId = 0;
  let sleepMinute = 0;
  let wakes = 0;

  for (let i=0;i<arr.length;i++) {
    if (arr[i].match('Guard')) {
      gId = getGuardId(arr[i])
    } else if (arr[i].match('falls')) {
      sleepMinute = getMinutes(arr[i]);
    } else if (arr[i].match('wakes')) {
      wakes = getMinutes(arr[i]);
      results.push({
        id: parseInt(gId),
        sleepMinute: parseInt(sleepMinute),
        sleepTime: parseInt(wakes) - parseInt(sleepMinute)
      });
    }
  }
  return results;
}

function findWorstGuard(arr) {
  let guardId = 0;
  let minutes = 0;
  for (let i=0;i<arr.length;i++) {
    if (arr[i] >= minutes) {
      minutes = arr[i];
      guardId =  i;
    }
  }
  return {
    id: guardId,
    mins: minutes
  };
}

function findMostSharedMinute(arr) {
  let timetable = [];
  let count = 0;
  let selectedMinute = 0;
  
  for (const a of arr) {
    const mins = a.minutes;
    for (let i = 0; i < mins.length; i++) {
      if (timetable[mins[i]] === undefined) {
        timetable[mins[i]] = 1;
      } else {
        timetable[mins[i]] += 1;
      }
    }
  }

  for (let i = 0; i < timetable.length; i++) {
    if (timetable[i] !== undefined) {
      if (count <= timetable[i]) {
        count = timetable[i];
        selectedMinute = i;
      }
    }
  }

  const newResult = {
    minute: selectedMinute,
    count: count
  };
  return newResult;
  
}

function writeResult(id, minute) {
  return `${id} * ${minute} = ${id * minute}`;
}

function orderIdData(arr) {
  const bulkResults = [];
  for (const a of arr) {
    if (bulkResults[a.id] === undefined) {
      bulkResults[a.id] = a.sleepTime;
    } else {
      bulkResults[a.id] += a.sleepTime;
    }
  }

  const results = bulkResults;
  const guard = findWorstGuard(results);
  
  const guardsAndSleepMinutes = arr.map(item=>{
    let mins = [];
    for (let i=item.sleepMinute;i<(item.sleepMinute + item.sleepTime);i++) {
      mins.push(i);
    }
    return {
      id: item.id,
      minutes: mins
    };
  });

  // make a copy for part II
  strategy2Data = guardsAndSleepMinutes.slice(0);
  
  const guardTimetable = guardsAndSleepMinutes.filter(i=>i.id === guard.id);
  const m = findMostSharedMinute(guardTimetable);

  console.log(writeResult(guard.id, m.minute));
  return guard.id * m.minute;
}

function findS2guard(arr) {
  let result = {
    id:0,
    minute: 0,
    count: 0
  };

  for (const a of arr) {
    if (result.count <= a.count) {
      result = a;
    }
  }
  
  console.log(writeResult(result.id, result.minute));
  return result.id * result.minute;
}

function createSecondTimetable(arr) {
  let guardIds = [];
  let result = [];

  for (const s2 of arr) {
    if (!guardIds.includes(s2.id)) {
      guardIds.push(s2.id);
    }
  }

  for (const g of guardIds) {
    const r = arr.filter(i=>i.id === g);
    const m = findMostSharedMinute(r);
    result.push({
      id: g,
      minute: m.minute,
      count: m.count
    })
  }  
        
  return result
}

fetch(puzzleData)
  .then(res => res.json())
  .then(data => {
    const orderedData = data.map(i=>i).sort();

    if (checkIntegrity(orderedData)) {
     
     // Part 1 
      markGoodGuards(orderedData);
      const badGuardsData = orderedData.filter(i=>i !== '---');
      const betterData = getSleepMinutes(badGuardsData);
      result1.innerHTML = orderIdData(betterData);
    }

    
    // Part 2
    const s2timetable = createSecondTimetable(strategy2Data)
    result2.innerHTML = findS2guard(s2timetable);
  });

