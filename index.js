/**
 * Copyright (c) 2013 Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the MIT License.
 * See the accompanying LICENSE file for terms.
 */
/*jshint node:true*/
'use strict';

var SYMBOLS = /([\/.+\^$(){}\[\]])/g,
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
    var reified = [];

    function perRoute(route) {
        var pattern;
        route.parts = []; //todo

        if(!route.param) {
            route.param = [];
        }

        function partnames(ignored, name) {
            route.parts.push(name);
            return '(\\w+)';
        }

        pattern = route.isregex ? route.pattern :
            route.pattern.replace(SYMBOLS, '\\$1').replace(NAME_RE, partnames);

        route.regex = new RegExp(pattern);
        reified.push(route);
    }

    routes.forEach(perRoute);
    console.log(reified);
    return reified;
}

module.exports = Byway;
