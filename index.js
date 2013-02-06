

function Route(routes) {
    var name_re = /(?=:)\w+/g;

	routes.forEach(function(route) {
		var names = route.pattern.match(name_re);

		console.log(names);
	});
}

Route.prototype.get = 
Route.prototype.for = function (str) {
    
    return {
        action: 1,
        param: 1,
        parts: 1
    }
};

module.exports = Route;