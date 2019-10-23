const store = require('../../../store')
const { google } = require('googleapis')

module.exports = async function ({ headers, payload }) {
  const { spreadsheetId, sheetId } = payload

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
  const token = await store.get('google_token')
  oAuth2Client.setCredentials(token)

  const spreadsheet = await getSpreadsheet(spreadsheetId, oAuth2Client)

  if (spreadsheet.sheets.length > 1 && !sheetId) {
    return {
      needSheet: true,
      sheets: spreadsheet.sheets.map(sheet => {
        return {
          title: sheet.properties.title,
          sheetId: sheet.properties.sheetId
        }
      })
    }
  }

  let sheetTitle = spreadsheet.sheets[0].properties.title

  if (spreadsheet.sheets.length > 1 && sheetId) {
    sheetTitle = (spreadsheet.sheets.filter(sheet => (sheet.properties.sheetId === sheetId)))[0].properties.title
  }

  const fields = await getFields(spreadsheetId, sheetTitle, oAuth2Client)

  await store.set('google_spreadsheet', { spreadsheetId, sheetTitle, sheetId })

  return {
    needSheet: false,
    fields
  }
}

const getFields = async (spreadsheetId, sheetTitle, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetTitle}!A1:1`,
    auth
  }, (err, response) => {
    if (err) reject(err)

    resolve(response.data.values[0])
  })
})

const getSpreadsheet = async (spreadsheetId, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')
  sheets.spreadsheets.get({
    spreadsheetId,
    auth
  }, (err, response) => {
    if (err) reject(err)

    resolve(response.data)
  })
})
