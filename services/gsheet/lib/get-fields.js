
import { google } from 'googleapis'

export default async function (spreadsheetId, sheetTitle, auth) {
  return new Promise((resolve, reject) => {
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
}
