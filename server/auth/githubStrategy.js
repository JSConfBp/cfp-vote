const GitHubStrategy = require('passport-github').Strategy
const clientCreate = require('../services/client/create')

module.exports = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_REDIRECT_URI,
        scope: 'user:email',
    },
    async function(accessToken, refreshToken, profile, cb) {
        try {
            const user = await clientCreate({
                token: accessToken,
                ...profile
            })
    
            cb(null, user);
        } catch (e) {
            cb(new Error('Unauthorized'))
        }
    }
)