const store = require('../../../store')
const { google } = require('googleapis')

const getToken = async (code) => {
  const googleCredentials = await store.get('google_credentials')
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris } = googleCredentials.installed
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  )

  return new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (err, token) => {
      if (err) reject(err)

      resolve(token)
    })
  })
}

module.exports = async function ({ headers, payload }) {
  const code = payload

  try {
    const token = await getToken(code)
    await store.set('google_token', token)

    return {
      succcess: true
    }
  } catch (e) {
    console.error(e)

    return {
      succcess: false
    }
  }
}
