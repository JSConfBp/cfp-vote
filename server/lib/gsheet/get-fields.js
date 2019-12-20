const { google } = require('googleapis')

module.exports = async (spreadsheetId, sheetTitle, auth) => new Promise((resolve, reject) => {
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
