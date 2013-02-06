/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
'use strict';

function Route(routes) {
    this.routes = compile(routes);
}

function compile(routes) {
    var reified = [],
        SYMBOLS = /([\/.+\^$(){}\[\]])/g,
        NAME_RE = /:(\w+)/g;

    function perRoute(route) {
        route.parts = []; //todo

        if(!route.param) {
            route.param = [];
        }

        function replaceCb(ignored, name) {
            route.parts.push(name);
            return '(\\w+)';
        }

        route.regex = new RegExp(
            route.pattern.replace(SYMBOLS, '\\$1').replace(NAME_RE, replaceCb));

        reified.push(route);
    }

    routes.forEach(perRoute);
    console.log(reified);
    return reified;
};

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
