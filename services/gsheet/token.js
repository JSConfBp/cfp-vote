
import { hset, hget } from '../store'
import { google } from 'googleapis'

const getToken = async (code) => {
  const googleCredentials = await hget('gsheet', 'credentials')
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris
  } = googleCredentials.web

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

export default async function (code) {
  try {
    const token = await getToken(code)
    await hset('gsheet', 'token', token)

    return {
      success: true
    }
  } catch (e) {
    console.error(e)

    return {
      success: false
    }
  }
}
