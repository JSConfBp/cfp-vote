const store = require('../../../store')
const { google } = require('googleapis')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

module.exports = async function ({ headers, body: credentials }) {
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris
  } = credentials.installed

  await store.hset('gsheet', 'credentials', credentials)

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  )

  const googleToken = await store.hget('gsheet', 'token')

  if (!googleToken) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })

    return {
      needAuth: true,
      authUrl
    }
  }

  oAuth2Client.setCredentials(googleToken)

  return {
    needAuth: false
  }
}
