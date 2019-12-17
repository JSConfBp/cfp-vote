const { google } = require('googleapis')
const store = require('../../../store')
const createGoogleOauthClient = require('../../../auth/google-oauth')

module.exports = async function ({ headers, body }) {
  const { spreadSheetId, sheetId: selectedSheetId } = body

  const oAuth2Client = await createGoogleOauthClient()
  const spreadsheet = await getSpreadsheet(spreadSheetId, oAuth2Client)
  const spreadSheetTitle = spreadsheet.properties.title
  const spreadSheetUrl = spreadsheet.spreadsheetUrl

  if (spreadsheet.sheets.length > 1 && !selectedSheetId) {
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

  if (spreadsheet.sheets.length > 1 && selectedSheetId) {
    sheetTitle = (spreadsheet.sheets.filter(sheet => (sheet.properties.sheetId === selectedSheetId)))[0].properties.title
  }

  const fields = await getFields(spreadSheetId, sheetTitle, oAuth2Client)

  const sheetId = selectedSheetId || spreadsheet.sheets[0].properties.sheetId

  await store.hset('gsheet', 'spreadsheet', { spreadSheetId, sheetTitle, sheetId })

  return {
    spreadSheetTitle,
    spreadSheetUrl,
    sheetTitle,
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
