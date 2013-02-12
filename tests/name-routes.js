var test = require('tape'),
    Byway = require('../');

test(':names match complete filename', function(t) {
    var config = [{"pattern": "/mojits/:mojitname/:file"}],
        byway = new Byway(config),
        uri = 'abc/mojits/foo/bar.js';

    t.ok(byway.of(uri));
    t.equal(byway.of(uri).parts.mojitname, 'foo');
    t.equal(byway.of(uri).parts.file, 'bar.js');
    t.end();
});

test(':names match filename without the ".js"', function(t) {
    var config = [{"pattern": "/mojits/:mojitname/:file.js"}],
        byway = new Byway(config),
        uri = 'abc/mojits/foo/bar.js';

    t.ok(byway.of(uri));
    t.equal(byway.of(uri).parts.mojitname, 'foo');
    t.equal(byway.of(uri).parts.file, 'bar');
    t.end();
});

test(':names used to match mojito-style selectors', function(t) {
    var config = [{"pattern": "/mojits/:mojitname/:controller.:affinity.js"}],
        byway = new Byway(config);

    t.ok(byway.of('abc/mojits/foo/foo.server.js'));
    t.ok(byway.of('/abc/def/mojits/foo/foo.server.js'));
    t.ok(byway.of('/mojits/foo/foo.server.js'));
    t.ok(byway.of('/mojits/_/ghi.jkl.js'));
    t.end();
});

test(':names matches strings containing dots and dashes', function(t) {
    var config = [{"pattern": "/mojits/:mojitname/:file.js"}],
        uri = '/abc/def/mojits/foo-bar/b.a.z._server.js',
        byway = new Byway(config);

    t.ok(byway.of(uri));
    t.equal(byway.of(uri).parts.mojitname, 'foo-bar');
    t.equal(byway.of(uri).parts.file, 'b.a.z._server');
    t.end();
});

test('matches partial :names separated by dots', function(t) {
    var config = [{"pattern": "/mojits/:mojit.name/:file.server.js"}],
        uri = '/abc/def/mojits/foo-bar.name/b.a.z-b_a_h.server.js',
        byway = new Byway(config);

    t.ok(byway.of(uri));
    t.equal(byway.of(uri).parts.mojit, 'foo-bar');
    t.equal(byway.of(uri).parts.file, 'b.a.z-b_a_h');
    t.end();
});


test('match •name route (i.e. want a name to capture .+? not just \\w)', function(t) {
    var config = [{"pattern": "/archetype/•subpath/package.json"}],
        byway = new Byway(config);

    t.ok(byway.of('/archetype/a/b/c/package.json'));
    //                        ^^^^^ gets matched by name "•subpath"
    //                              returned object has parts.subpath:"a/b/c"

    t.ok(byway.of('/archetype/abc%20def+123///package.json'));
    //                        ^^^^^^^^^^^^^^^ gets matched by name "•subpath"
    //                                        parts.subpath: "abc%20def+123//"

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

test('special regex characters in name patterns are allowed', function(t) {
    var config = [{"pattern": "/{m+*.}[(o/)]jits/:abc/:def.:affinity.js"}],
        byway = new Byway(config);

    t.ok(byway.of('abc/{m+*.}[(o/)]jits/foo/foo.server.js'));
    t.end();
});

test('unmatched :routes', function(t) {
    var config = [
            {"pattern": "/modules/:modname/:filename.json"},
            {"pattern": "/mojits/:mojitname/:controller.:affinity.js"}
        ],
        byway = new Byway(config);

    t.notok(byway.of('modules/mymod/config.json')); // missing ^/
    t.notok(byway.of('/mojits//ghi.jkl'));
    t.notok(byway.of('/abc/def/ghi'));
    t.end();
});

test('match /modules/:modname/:filename.json', function(t) {
    var config = [{"pattern": "/modules/:modname/:filename.json"}],
        byway = new Byway(config);

    t.ok(byway.of('abc/modules/mymod/config.json ohhai!'), 'match not $anchored');
    t.ok(byway.of('/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/abc/def/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/modules/MYMODULE/FOOBAR.json'), 'named params match case-insensitively');
    t.ok(byway.of('abc/moDUles/mymod/config.JSON'), 'all letters match case-insensitively');
    t.end();
});

test('match anchored$ /modules/:modname/:filename.json$', function(t) {
    var config = [{"pattern": "/modules/:modname/:filename.json$"}],
        byway = new Byway(config);

    t.ok(byway.of('/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/abc/def/modules/mymod/config.json'), 'match not ^anchored');
    t.ok(byway.of('/modules/MYMODULE/FOOBAR.json'), 'named params match case-insensitively');
    t.ok(byway.of('abc/moDUles/mymod/config.JSON'), 'all letters match case-insensitively');
    t.notok(byway.of('abc/modules/mymod/config.json ohhai!'), 'match is $anchored');
    t.end();
});

test('match ^anchored ^/modules/:modname/:filename.json', function(t) {
    var config = [{"pattern": "^/modules/:modname/:filename.json"}],
        byway = new Byway(config);

    t.ok(byway.of('/modules/mymod/config.json ohhai!'), '^ but not $');
    t.ok(byway.of('/modules/mymod/config.json'), '^');
    t.ok(byway.of('/modules/MYMODULE/FOOBAR.json'), 'named params match case-insensitively');
    t.notok(byway.of('/abc/def/modules/mymod/config.json'), 'match not ^anchored');
    t.notok(byway.of('abc/moDUles/mymod/config.JSON'), 'all letters match case-insensitively');
    t.end();
});

test('match ^anchored$ ^/modules/:modname/:filename.json$', function(t) {
    var config = [{"pattern": "^/modules/:modname/:filename.json$"}],
        byway = new Byway(config);

    t.ok(byway.of('/modules/mymod/config.json'));
    t.notok(byway.of('abc/modules/mymod/config.json'));
    t.notok(byway.of('/modules/mymod/config.json/cheezits'));
    t.end();
});

test('robots are coming', function(t) {
    var config = [
            {"pattern": "^/robots.txt$"},
            {"pattern": "^/cache.manifest$"}
        ],
        byway = new Byway(config);

    t.ok(byway.of('/robots.txt'));
    t.ok(byway.of('/cache.manifest'));
    t.end();
});
