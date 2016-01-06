'use strict';

const fs = require('fs');
const _ = require('lodash');
var parseCSV = require('./parse-csv');

console.time('entire process');

let trafficData = fs.readFileSync('./data/traffic-accidents.csv').toString();
let crimeData = fs.readFileSync('./data/crime.csv').toString();
var frequency = {};
var trafficDataObjects = parseCSV(trafficData);
var crimeDataObjects = parseCSV(crimeData);

function sortByFrequency(data) {
  if (frequency.hasOwnProperty(data)) {
    frequency[data] += 1;
  } else {
    frequency[data] = 1;
  }
  return frequency;
}

function dataSort(type, arrayType) {
  var array;
  if (arrayType === "traffic") {
    array = trafficDataObjects;
  } else {
    array = crimeDataObjects;
  }
  for (var i = 0; i < array.length; i++) {
    if (!(arrayType === "crime" && array[i].OFFENSE_CATEGORY_ID === "traffic-accident") && array[i][type] !== '') {
      sortByFrequency(array[i][type]);
    }
  }
  let frequencyPairs = _.pairs(frequency);

  return frequencyPairs.sort(function(a, b) {
    return b[1] - a[1];
  });
}


console.log("Traffic accidents by intersection: \n", dataSort("INCIDENT_ADDRESS", "traffic").slice(0, 5));
frequency = {};
console.log("Traffic accidents by neighborhood: \n", dataSort("NEIGHBORHOOD_ID", "traffic").slice(0, 5));
frequency = {};
console.log("Crime incidents by neighborhood: \n", dataSort("NEIGHBORHOOD_ID", "crime").slice(0, 5));

console.timeEnd('entire process');
