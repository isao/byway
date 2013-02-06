function Route(routes) {
    var self = this,
        SYMBOLS = /([\/.+\^$(){}\[\]])/g,
        NAME_RE = /:(\w+)/g;

    self.routes = [];
    if(!self.param) {
        self.param = [];
    }

    function perRoute(route) {
        route.parts = [];

        function replaceCb(ignored, name) {
            route.parts.push(name);
            return '(\\w+)';
        }

        route.regex = new RegExp(
            route.pattern.replace(SYMBOLS, '\\$1').replace(NAME_RE, replaceCb));

        self.routes.push(route);
    }

    routes.forEach(perRoute);
}

Route.prototype.given = function (str) {
    var i = 0,
        found = false;

    for(; i < this.routes.length; i++) {
        if(this.routes[i].regex.test(str)) {
            found = this.routes[i];
            break;
        }
    }

    return found;
};


var test = require('tape');

test('1', function(t) {

    var config = [
            {
                "pattern": "/modules/:modname/:filename.json",
                "action": "modconfig"
            },
            {
                "pattern": "/mojits/:mojitname/:controller.:affinity.js",
                "action": "controller"
            }
        ],
        route = new Route(config);

    t.ok(route.given('abc/modules/mymod/config.json'));
    t.ok(route.given('/mojits/foo/foo.server.js'));
    t.notOk(route.given('/abc/def/ghi'));

//     t.true('action' in match);
//     t.true('parts' in match);
//     t.true('param' in match);
    t.end();
});