#! /usr/bin/env node

var path    = require('path');
var fs      = require('fs');

var pathutils = require('pathutils');
var dom       = require('xmldom').DOMParser;
var xpath     = require('xpath');

if(process.argv.length == 2) {
  console.log('Usage: replacexml <[xpath=newvalue ...] [dirname ...] [filename ...]>');
  process.exit(0);
}

var context = determineArguments(process.argv.slice(2));

makeFileList(context.locations).forEach(function(file) {
  fs.readFile(file, 'utf-8', function(err, data) {
    if(err) throw err;

    var document = new dom().parseFromString(data);

    context.expressions.forEach(function(expression) {
      xpath.select(expression.match, document).forEach(function(node) {
        node.firstChild.data = expression.value;
      });
    });

    fs.writeFile(file, document.toString(), 'utf-8', function(err) {
      if(err) throw err;
    });
  });
});

/**
 * Takes in arguments and determines if they are locations or match parameters
 *
 * @param {Array} argv an array of string arguments
 * @return {Object} result
 */
function determineArguments(argv) {
  var result = {
    expressions: [],
    locations: [],
    cwd: process.cwd()
  };

  argv.forEach(function(value, index, array) {
    if(value.indexOf('=') > -1) {
      var parts = value.split('=');
      result.expressions.push({ match: parts[0], value: parts[1] });
    }
    else {
      result.locations.push(value);
    }
  });

  return result;
}

/**
 * Convert the given {@code locations} into a list of files
 *
 * @param {Array} locations
 * @return {Array} result
 */
function makeFileList(locations) {
  var result = [];

  locations.forEach(function(location) {
    pathutils.walkFiles(path.resolve(location), function(err, file) {
      result.push(file);
    });
  });

  return result;
}
