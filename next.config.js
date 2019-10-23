const withTM = require('@weco/next-plugin-transpile-modules')
const sass = require('@zeit/next-sass')
const routing = require('./routing')
const withPlugins = require('next-compose-plugins');


const sassConfig = {
	cssModules: false,
	cssLoaderOptions: {
	  importLoaders: 1,
	  localIdentName: "[local]___[hash:base64:5]",
	}
}

const nextConfig = {

	port: process.env.PORT || 3000,
	host: process.env.HOST || "0.0.0.0",

	//transpileModules: [],

	publicRuntimeConfig: {
		asset_url: '',
		gh_scope: 'user:read',
		gh_client_id: process.env.GH_OAUTH_CLIENT_ID,
		gh_redirect_uri: process.env.GH_REDIRECT_URI,
		api_url: process.env.API_URL,
		nonce_state: process.env.PIOSK_NONCE,
		vote_fields: JSON.parse(process.env.CFP_VOTE_FIELDS || "[]")
	},

	exportPathMap: routing,
	useFileSystemPublicRoutes: false,

}

const c = withPlugins([
	[sass, sassConfig],
  ], nextConfig);

module.exports = c('', {})