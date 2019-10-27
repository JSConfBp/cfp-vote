const express = require('express')
const router = express.Router()


const routeHandle = function (request, response, app, pageName) {
	const page = `/${pageName}`
	const queryParams = request.params
	app.render(request, response, page, queryParams)
}

module.exports = function (app, getRoutes, authMiddleware) {

	const routes = getRoutes()

	Object.values(routes).forEach((route) => {
		const params = [route.path]

		if (route.needAuth) {
			params.push(require('connect-ensure-login').ensureLoggedIn('/'))
		}

		params.push((req, res) => routeHandle(req, res, app, route.page))

		router.get(...params)
	});

	return router
}