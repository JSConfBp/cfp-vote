import { hset } from '../store'
import createGoogleOauthClient from './oauth-client'

import getFields from './lib/get-fields'
import getSpreadsheet from './lib/get-spreadsheet'


export default async function (spreadSheetId, selectedSheetId) {
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

  await hset('gsheet', 'spreadsheet', { spreadSheetId, sheetTitle, sheetId })

  return {
    spreadSheetTitle,
    spreadSheetUrl,
    sheetTitle,
    needSheet: false,
    fields
  }
}
