const { google } = require('googleapis')
const store = require('../../store')
const getColumnData = require('./get-column-data')
const indexToA1 = require('./index-to-a1')

module.exports = async (fields, store, auth) => {
  const { spreadSheetId, sheetTitle } = await store.hget('gsheet', 'spreadsheet')
  const selectedFields = await store.get('fields')

  selectedFields.unshift('CFP_ID')

  const ranges = fields
    .map(fieldIndex => {
      // increment the indexes by 1, because COLUMNS A1 notation is 1-based
      const index = fieldIndex + 1
      const a1 = indexToA1(index)

      return `${a1}2:${a1}`
    })
    .map(field => (`${sheetTitle}!${field}`))

  const columnData = await getColumnData(ranges, spreadSheetId, auth)

  return columnData[1].map((value, valueIndex) => {
    return selectedFields.reduce((talk, field, fieldIndex) => {
      if (fieldIndex === 0 && !columnData[fieldIndex][valueIndex]) {
        talk[field] = null
      } else {
        talk[field] = columnData[fieldIndex][valueIndex][0]
      }
      return talk
    }, {})
  })
}



