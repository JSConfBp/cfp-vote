const nextConfig = {
  //reactStrictMode: true,
  distDir: 'build',
  //output: 'standalone',
	publicRuntimeConfig: {
		asset_url: '',
		gh_scope: 'user:read',
		api_url: process.env.API_URL,
		vote_fields: JSON.parse(process.env.CFP_VOTE_FIELDS || "[]")
	},

}

module.exports = nextConfig
