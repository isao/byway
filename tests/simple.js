var test = require('tape'),
    Byway = require('../');

test('matched :routes', function(t) {
    var byway,
        config = [
            {"pattern": "/modules/:modname/:filename.json"},
            {"pattern": "/mojits/:mojitname/:controller.:affinity.js"}
        ];

    byway = new Byway(config);

    t.ok(byway.of('abc/modules/mymod/config.json'));
    t.ok(byway.of('/mojits/foo/foo.server.js'));
    t.ok(byway.of('/mojits/_/ghi.jkl.js'));
    t.end();
});

test('unmatched :routes', function(t) {
    var byway,
        config = [
            {"pattern": "/modules/:modname/:filename.json"},
            {"pattern": "/mojits/:mojitname/:controller.:affinity.js"}
        ];

    byway = new Byway(config);

    t.notOk(byway.of('modules/mymod/config.json')); // missing ^/
    t.notOk(byway.of('/mojits//ghi.jkl'));
    t.notOk(byway.of('/abc/def/ghi'));
    t.end();
});
// 
// test('ok regexes', function(t) {
//     var byway,
//         config = [
//             {"pattern": "/\/modules\/(\w+)/(\w+).json", "isregex": true},
//             {"pattern": "\/mojits/(\w+)/(\w+).(\w+).js", "isregex": 1}
//         ];
// 
//     byway = new Byway(config);
// 
//     t.ok(byway.of('abc/modules/mymod/config.json'));
//     t.end();    
// });