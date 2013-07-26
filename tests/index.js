//require all .js files in __dirname

var fs = require('fs'),
    resolve = require('path').resolve,

    tap = require('tap'), // global harness
    out = tap.output;     // test result stream


// you can listen to tap events, nice.
//
// out.on('error', function(str) {
//     console.log('ERR>>', str);
// });
// out.on('data', function(str) {
//     console.log('>>', str);
// });
// out.on('end', function(err, count, ok) {
//     console.log('>>', err, count, ok);
// });

function load(name) {
    var path;
    if(name.match(/[.]js$/)) {
        path = resolve(__dirname, name);
        if(path !== __filename) {
            require(path);
        }
    }
}

fs.readdir(__dirname, function onreaddir(err, list) {
    list.forEach(load);
});
