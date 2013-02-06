/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
'use strict';

function Route(routes) {
    //this.routes = this.compile(routes);
    this.compile(routes);
}

Route.prototype.compile = function(routes) {
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

Route.prototype.of =
Route.prototype.given = function (str) {
    var found = false;

    function checkRoute(route) {
        if(route.regex.test(str)) {
            found = route;
            return true;
        }
    }

    this.routes.some(checkRoute);
    return found;
};

module.exports = Route;
