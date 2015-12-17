# replacexml
Node-based CLI utility for replacing values in one or more XML files

# Usage
    npm install -g replacexml
    replacexml //node1=value1 /doc/path/node2=value2 test.xml testdir

The above will target test.xml and all files under testdir and its subdirectories, and replace the value of both xpath expressions with the specified values.
