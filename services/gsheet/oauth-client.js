import { hget } from '../store'
import { google } from 'googleapis'

export default async function () {
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
  const token = await hget('gsheet', 'token')
  oAuth2Client.setCredentials(token)

  return oAuth2Client
}
