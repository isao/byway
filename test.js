var test = require('tape'),
    Route = require('./');

test('1', function(t) {
    var route,
        config = [
            {
                "pattern": "/modules/:modname/:filename.json",
                "isregex": false,
                "action": "modconfig"
            },
            {
                "pattern": "/mojits/:mojitname/:controller.:affinity.js",
                "action": "controller"
            }
        ];

    route = new Route(config);

    t.ok(route.of('abc/modules/mymod/config.json'));
    t.ok(route.of('/mojits/foo/foo.server.js'));
    t.ok(route.of('/mojits/_/ghi.jkl.js'));

    t.notOk(route.of('modules/mymod/config.json'));
    t.notOk(route.of('/mojits//ghi.jkl'));
    t.notOk(route.of('/abc/def/ghi'));
    t.end();
});

