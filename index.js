/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
'use strict';

var SYMBOLS = /([\/.+\^$(){}\[\]])/g, //symbols to escape for non-regex patterns
    NAME_RE = /:(\w+)/g;


function Byway(routes) {
    this.routes = compile(routes);
}

Byway.prototype.of = function(str) {
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

function compile(routes) {
    var out = [];

    function perRoute(route) {
        var pattern;
        route.names = []; //todo

        if(!route.param) {
            route.param = [];
        }

        function partnames(ignored, name) {
            route.names.push(name);
            return '(\\w+)';
        }

        pattern = route.isregex ? route.pattern :
            route.pattern.replace(SYMBOLS, '\\$1').replace(NAME_RE, partnames);

        route.regex = new RegExp(pattern);
        out.push(route);
    }

    routes.forEach(perRoute);
    return out;
}

module.exports = Byway;
