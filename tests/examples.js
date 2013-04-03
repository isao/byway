var test = require('tap').test,
    Byway = require('../');

test('named route', function(t) {
    var routes = [{pattern: '/def/ghi/:dir/:file.html$'}],
        byway = new Byway(routes),
        match;

    match = byway.of('/abc/def/ghi/cannot/drive55.html');
    /* match contains:
        { input: '/abc/def/ghi/cannot/drive55.html',
          param: [],
          parts: { dir: 'cannot', file: 'drive55' } }
    */
    t.same(match.input, '/abc/def/ghi/cannot/drive55.html');
    t.same(match.param, []);
    t.same(match.parts, { dir: 'cannot', file: 'drive55' });
    t.end();
});

test('named spot route to match any non-space run of text', function(t) {
    var routes = [{pattern: '/abc/•mysubpath/:myfile.html'}],
        byway = new Byway(routes),
        match;

    match = byway.of('/abc/i/can/not/drive/fifty_five.html');
    /* match contains:
        { input: '/abc/i/can/not/drive/fifty_five.html',
          param: [],
          parts: { mysubpath: 'i/can/not/drive', myfile: 'fifty_five' } }
    */
    t.same(match.input, '/abc/i/can/not/drive/fifty_five.html');
    t.same(match.param, []);
    t.same(match.parts, { mysubpath: 'i/can/not/drive', myfile: 'fifty_five' });
    t.end();
});

test('string regex route, if you need to use json or love backslashes', function(t) {
    var routes = [{pattern: '\\/abc\\/def\\/(\\w+)/(\\w+)\\.html', isregex: true}],
        byway = new Byway(routes),
        match;

    match = byway.of('/abc/def/cannot/drive55.html');
    /* match contains:
        { input: '/abc/def/cannot/drive55.html',
          param: [],
          parts: [ 'cannot', 'drive55' ] }
    */
    t.same(match.input, '/abc/def/cannot/drive55.html');
    t.same(match.param, []);
    t.same(match.parts, ['cannot', 'drive55']);
    t.end();
});

test('literal regex route', function(t) {
    var routes = [{pattern: /\/abc\/def\/(\w+)\/(\w+)\.html/i}],
        byway = new Byway(routes),
        match;

    match = byway.of('/abc/def/cannot/drive55.html');
    /* match contains:
        { input: '/abc/def/cannot/drive55.html',
          param: [],
          parts: [ 'cannot', 'drive55' ] }
    */
    t.same(match.input, '/abc/def/cannot/drive55.html');
    t.same(match.param, []);
    t.same(match.parts, ['cannot', 'drive55']);
    t.end();
});
