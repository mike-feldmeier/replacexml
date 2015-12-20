#! /usr/bin/env node

var path    = require('path');
var fs      = require('fs');

var pathutils = require('pathutils');
var dom       = require('xmldom').DOMParser;
var xpath     = require('xpath');

if(module.parent) {
  module.exports = doReplace;
}
else {
  if(process.argv.length == 2) {
    console.log('Usage: replacexml <[xpath=newvalue ...] [dirname ...] [filename ...]>');
    process.exit(0);
  }

  doReplace(process.argv.slice(2));
}

function doReplace(args) {
  var context = determineArguments(args);

  makeFileList(context.locations).forEach(function(file) {
    fs.readFile(file, 'utf-8', function(err, data) {
      if(err) throw err;

      var document = new dom().parseFromString(data);
      var namespaces = determineNamespaces(document);

      context.expressions.forEach(function(expression) {
        var select = xpath.useNamespaces(namespaces);
        select(expression.match, document).forEach(function(node) {
        	console.log('%s: Matched %s: Replacing "%s" with "%s"', file, expression.match, node.firstChild.data, expression.value);
          node.firstChild.data = expression.value;
        });
      });

      fs.writeFile(file, document.toString(), 'utf-8', function(err) {
        if(err) throw err;
      });
    });
  });
}

function determineNamespaces(document) {
	var result = {};

	Object.keys(document.documentElement.attributes).forEach(function(key) {
		var attr = document.documentElement.attributes[key];
		result[attr.localName] = attr.value;
	});

	return result;
}

/**
 * Takes in arguments and determines if they are locations or match parameters
 *
 * @param {Array} argv an array of string arguments
 * @return {Object} result
 */
function determineArguments(argv) {
  var result = {
    expressions: [],
    locations: []
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
