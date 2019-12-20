const { google } = require('googleapis')

module.exports = async (ranges, spreadsheetId, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')

  sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges,
    auth
  }, (err, response) => {
    if (err) {
      console.error(err)
      reject(err)
      return
    }

    resolve(response.data.valueRanges.map(valueRange => valueRange.values))
  })
})
