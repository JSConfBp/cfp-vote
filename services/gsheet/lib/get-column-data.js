import { google } from 'googleapis'

export default async function (ranges, spreadsheetId, auth) {
  return new Promise((resolve, reject) => {
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
}
