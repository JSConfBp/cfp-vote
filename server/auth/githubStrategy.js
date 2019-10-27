const GitHubStrategy = require('passport-github').Strategy
const clientCreate = require('../services/client/create')
const getUserById = require('../services/client/readById')
const logger = require('../logger')

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

            logger.debug('clientCreate', user);
            
            cb(null, user);
        } catch (e) {
            cb(new Error('Unauthorized'))
        }
    }
)

module.exports.serializeUser = async (user, done) => {
    logger.debug('serializeUser', user.id, user);
    done(null, user.id)
}

module.exports.deserializeUser = async (id, done) => {
    const user = await getUserById(id)

    logger.debug('deserializeUser', id, user);
    
    done(null, user)
}
