const GitHubStrategy = require('passport-github2').Strategy
const boom = require('boom')
const auditlog = require('./auditlog')
const clientCreate = require('../services/client/create')
const getUserById = require('../services/client/readById')
const getSettings = require('../services/settings/read')
const getUsers = require('../services/users/read')
const addUser = require('../services/users/create')
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
            const settings = await getSettings()

            if (!settings.freeLogin) {
                const users = await getUsers()

                if(!users.find( user => user.login === profile.username)){
                    auditlog(profile.username, 'unauthorized')
                    throw boom.unauthorized(`Unauthorized user "${profile.username}"`)
                }
            } else {
                await addUser(profile.username)
            }

            auditlog(profile.username, 'login')

            const user = await clientCreate({
                token: accessToken,
                ...profile
            })

            logger.debug('clientCreate', user);

            cb(null, user);
        } catch (e) {
            cb(e)
        }
    }
)

module.exports.serializeUser = async (user, done) => {
    logger.debug('serializeUser', user.id, user);
    done(null, user.id)
}

module.exports.deserializeUser = async (userId, done) => {
    const data = await getUserById(userId)

    logger.debug('deserializeUser', userId, data);

    const {
        id,
        admin,
        login,
        githubId,
        name
    } = data

    done(null, {
        id,
        admin,
        login,
        githubId,
        name
    })
}
