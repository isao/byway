var test = require('tape'),
    Byway = require('../');

test('matches simple :names', function(t) {
    var config = [{"pattern": "/mojits/:mojitname/:controller.:affinity.js"}],
        byway = new Byway(config);

    t.ok(byway.of('abc/mojits/foo/foo.server.js'));
    t.ok(byway.of('/abc/def/mojits/foo/foo.server.js'));
    t.ok(byway.of('/mojits/foo/foo.server.js'));
    t.ok(byway.of('/mojits/_/ghi.jkl.js'));
    t.end();
});

test('matches :names numbers and underscores', function(t) {
    var config = [{"pattern": "/mojits/:abc_123/:12_34.:affinity.js"}],
        byway = new Byway(config);

    t.ok(byway.of('abc/mojits/foo/foo.server.js'));
    t.ok(byway.of('/abc/def/mojits/foo/foo.server.js'));
    t.ok(byway.of('/mojits/foo/foo.server.js'));
    t.ok(byway.of('/mojits/_/ghi.jkl.js'));
    t.end();
});

test.only('special regex characters in name patterns are allowed', function(t) {
    var config = [{"pattern": "/{m+*.}[(o/)]jits/:abc/:def.:affinity.js"}],
        byway = new Byway(config);

    t.ok(byway.of('abc/{m+*.}[(o/)]jits/foo/foo.server.js'));
    t.end();
});

test('unmatched :routes', function(t) {
    var config = [
            {"pattern": "/modules/:modname/:filename.json"},
            {"pattern": "/mojits/:mojitname/:controller.:affinity.js"}
        ];

    byway = new Byway(config);

    t.notok(byway.of('modules/mymod/config.json')); // missing ^/
    t.notok(byway.of('/mojits//ghi.jkl'));
    t.notok(byway.of('/abc/def/ghi'));
    t.end();
});

test('match /modules/:modname/:filename.json', function(t) {
    var config = [{"pattern": "/modules/:modname/:filename.json"}]
        byway = new Byway(config);

    t.ok(byway.of('abc/modules/mymod/config.json ohhai!'), 'match not $anchored');
    t.ok(byway.of('/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/abc/def/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/modules/MYMODULE/FOOBAR.json'), 'named params match case-insensitively');
    t.ok(byway.of('abc/moDUles/mymod/config.JSON'), 'all letters match case-insensitively');
    t.end();
});

test('match anchored$ /modules/:modname/:filename.json$', function(t) {
    var config = [{"pattern": "/modules/:modname/:filename.json$"}]
        byway = new Byway(config);

    t.ok(byway.of('/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/abc/def/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/modules/MYMODULE/FOOBAR.json'), 'named params match case-insensitively');
    t.ok(byway.of('abc/moDUles/mymod/config.JSON'), 'all letters match case-insensitively');
    t.notok(byway.of('abc/modules/mymod/config.json ohhai!'), 'match is $anchored');
    t.end();
});

test('match ^anchored ^/modules/:modname/:filename.json', function(t) {
    var config = [{"pattern": "^/modules/:modname/:filename.json"}]
        byway = new Byway(config);

    t.ok(byway.of('/modules/mymod/config.json ohhai!'), '^ but not $');
    t.ok(byway.of('/modules/mymod/config.json'), '^');
    t.ok(byway.of('/modules/MYMODULE/FOOBAR.json'), 'named params match case-insensitively');
    t.notok(byway.of('/abc/def/modules/mymod/config.json'), 'match not ^anchored');
    t.notok(byway.of('abc/moDUles/mymod/config.JSON'), 'all letters match case-insensitively');
    t.end();
});

test('match ^anchored$ ^/modules/:modname/:filename.json$', function(t) {
    var config = [{"pattern": "^/modules/:modname/:filename.json$"}]
        byway = new Byway(config);

    t.ok(byway.of('/modules/mymod/config.json'));
    t.notok(byway.of('abc/modules/mymod/config.json'));
    t.notok(byway.of('/modules/mymod/config.json/cheezits'));
    t.end();
});
