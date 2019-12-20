const { google } = require('googleapis')

module.exports = async (spreadsheetId, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')
  sheets.spreadsheets.get({
    spreadsheetId,
    auth
  }, (err, response) => {
    if (err) reject(err)

    resolve(response.data)
  })
})
