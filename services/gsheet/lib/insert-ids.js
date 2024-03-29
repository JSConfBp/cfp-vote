import { google } from 'googleapis'

export default async function (values, startIndex = 2, spreadsheetId, sheetTitle, auth) {
  return new Promise((resolve, reject) => {
    const sheets = google.sheets('v4')

    sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      auth,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            'range': `${sheetTitle}!A${startIndex}:A`,
            'majorDimension': 'COLUMNS',
            'values': [
              values
            ]
          }
        ],
        includeValuesInResponse: false
      }
    }, (err, response) => {
      if (err) {
        console.error(err)
        reject(err)
        return
      }

      resolve()
    })
  })
}
