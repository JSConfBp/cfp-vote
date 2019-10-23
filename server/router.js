const express = require('express')
const router = express.Router()

const routeHandle = function (request, response, app, pageName) {
	const page = `/${pageName}`
	const queryParams = request.params
	app.render(request, response, page, queryParams)
}

module.exports = function (app, getRoutes) {

	const routes = getRoutes()

	Object.entries(routes).forEach(([routeId, route]) => {
		router.get(route.path, (req, res) => routeHandle(req, res, app, route.page))
	});

	return router
}