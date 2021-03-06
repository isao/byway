var test = require('tap').test,
    Byway = require('../');

test('match •name route (i.e. want a name to capture .+? not just \\w)', function(t) {
    var config = [{"pattern": "/archetype/•subpath/package.json"}],
        byway = new Byway(config),
        actual;

    actual = byway.of('/archetype/a/b/c/package.json');
    t.same(actual.parts.subpath, 'a/b/c');

    actual = byway.of('/archetype/abc%20def+123///package.json');
    t.same(actual.parts.subpath, 'abc%20def+123//');

    actual = byway.of('/archetype/abc/////package.json');
    t.same(actual.parts.subpath, 'abc////');

    t.end();
});

test('parts is an object for name-routes', function(t) {
    var config = [{pattern:'app/modules/:module/:file.:ext$'}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.ok(actual.input);
    t.ok(actual.param);
    t.ok(actual.parts);
    t.equal(actual.input, uri);
    t.same(actual.parts, {module:'foo', file:'bar', ext:'js'});
    t.same(actual.param, []);
    t.end();
});

test('parts is an array for regex-routes', function(t) {
    var config = [{pattern:'app\\/modules\\/(.+?)\\/(.+)$', isregex:1}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
    t.same(actual.param, []);
    t.same(actual.parts, ['foo', 'bar.js']);
    t.end();
});

test('parts is an empty array if regex-route has no parens', function(t) {
    var config = [{pattern:'app\\/modules\\/.+?\\/.+$', isregex:1}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
    t.same(actual.parts, []);
    t.end();
});

test('param is copied from source configs, if truthy', function(t) {
    var config = [{pattern:'app/modules/:module/:file.:ext$', param:{z:'abc'}}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.ok(actual.input);
    t.ok(actual.param);
    t.ok(actual.parts);
    t.equal(actual.input, uri);
    t.same(actual.parts, {module:'foo', file:'bar', ext:'js'});
    t.same(actual.param, {z:'abc'});
    t.end();
});

test('param is copied from source configs, even if it’s a string', function(t) {
    var config = [{pattern:'app/modules/:module/:file.:ext$', param:'abc'}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
    t.same(actual.param, 'abc');
    t.end();
});


test('param is copied from source configs, even if it’s a function', function(t) {

    function square(num) {
        return num * num;
    }

    var config = [{pattern:'app/modules/:module/:file.:ext$', param:square}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
    t.same(actual.param, square);
    t.equal(actual.param(10), 100);
    t.end();
});


test('param is an array, if source config was falsey', function(t) {
    var config = [{pattern:'app/modules/:module/:file.:ext$', param:null}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
    t.same(actual.param, []);

    config = [{pattern:'app/modules/:module/:file.:ext$', param:0}];
    byway = new Byway(config);
    actual = byway.of(uri);
    t.same(actual.param, []);

    config = [{pattern:'app/modules/:module/:file.:ext$', param:''}];
    byway = new Byway(config);
    actual = byway.of(uri);
    t.same(actual.param, []);

    config = [{pattern:'app/modules/:module/:file.:ext$'}];
    byway = new Byway(config);
    actual = byway.of(uri);
    t.same(actual.param, []);

    t.end();
});
