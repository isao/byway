var test = require('tape'),
    Byway = require('../');

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
    t.end();
});

test('parts is an array for regex-routes', function(t) {
    var config = [{pattern:'app\\/modules\\/(.+?)\\/(.+)$', isregex:1}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
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

test('param is copied, if truthy', function(t) {
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

test('param is copied, even if it’s a string', function(t) {
    var config = [{pattern:'app/modules/:module/:file.:ext$', param:'abc'}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
    t.same(actual.param, 'abc');
    t.end();
});

test('param is an array, if source was falsey', function(t) {
    var config = [{pattern:'app/modules/:module/:file.:ext$', param:null}],
        byway = new Byway(config),
        uri = '/proj/app/modules/foo/bar.js',
        actual = byway.of(uri);

    t.equal(actual.input, uri);
    t.same(actual.param, []);

    config = [{pattern:'app/modules/:module/:file.:ext$', param:undefined}];
    byway = new Byway(config);
    actual = byway.of(uri);
    t.same(actual.param, []);

    config = [{pattern:'app/modules/:module/:file.:ext$'}];
    byway = new Byway(config);
    actual = byway.of(uri);
    t.same(actual.param, []);

    t.end();
});
