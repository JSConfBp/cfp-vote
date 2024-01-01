import { hset, hget } from '../store'
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

export default async function (credentials) {
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris
  } = credentials.web

  await hset('gsheet', 'credentials', credentials)

  console.log(credentials)

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  )

  const googleToken = await hget('gsheet', 'token')

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
