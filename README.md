# replacexml
Node-based utility for replacing values in one or more XML files.  Can be used as a command-line utility or as a Node module.

## Command-line usage

    npm install -g replacexml
    replacexml //node1=value1 /doc/path/node2=value2 test.xml testdir

## Module usage

    var replacexml = require('replacexml');
    replacexml([ '//node1=value1', '/doc/path/node2=value2', 'test.xml', 'testdir' ]);

## General information

Both of the usage examples take in an array of arguments.  Arguments are processed as follows:

* Arguments containing an equal sign ('=') are treated as expressions.  The left side should be a valid XPath expression, the right side should be a text value that the text content of any matches will be set to.
* All other arguments will be treated as locations.  They can refer to a single file, or a directory.
* Directories will be recursively traversed.
* Arguments can be in any number and in any order.
