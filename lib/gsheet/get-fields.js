const { google } = require('googleapis')

module.exports = async (spreadsheetId, sheetTitle, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetTitle}!A1:1`,
    auth
  }, (err, response) => {
    if (err) reject(err)

    const data = response.data.values[0].map((item, i) => ({ field: item, id: i }))
    resolve(data)
  })
})
