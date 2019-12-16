const store = require('../store')
const { google } = require('googleapis')

module.exports = async () => {
  const googleCredentials = await store.get('google_credentials')
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris
  } = googleCredentials.installed

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  )
  const token = await store.get('google_token')
  oAuth2Client.setCredentials(token)

  return oAuth2Client
}
