const shortid = require('shortid')
const { google } = require('googleapis')
const store = require('../../../store')
const createGoogleOauthClient = require('../../../auth/google-oauth')
const {
  getFields,
  indexToA1,
  getColumnData,
  insertIDs,
} = require('../../../lib/gsheet')

const cfpConfig = require('../../../../cfp.config')

const { getStagedTalksKey } = store.keys

module.exports = async function ({ body: fields }) {
  const oAuth2Client = await createGoogleOauthClient()

  const { spreadSheetId, sheetTitle, sheetId } = await store.hget('gsheet', 'spreadsheet')

  await store.hset('gsheet', 'fields', fields)
  // await setFields(fields, store, oAuth2Client)
  await setStage(cfpConfig, store)

  const cfpData = await getCFPData(fields, store, oAuth2Client)

  const stage = await store.get('stage')
  const idColumnValues = []

  const stagedTalkKey = getStagedTalksKey(stage)
  const cfpLength = cfpData.length

  for (let i = 0; i < cfpLength; i++) {
    const id = `gsheet_talk_${shortid.generate()}`
    idColumnValues.push(id)

    Object.entries(cfpData[i]).forEach(async ([key, value]) => {
      await store.hset(id, key, value)
    })

    await store.rpush(stagedTalkKey, id)
  }

  await insertIdColumn(spreadSheetId, sheetId, oAuth2Client)
  await insertIDs(idColumnValues, 2, spreadSheetId, sheetTitle, oAuth2Client)

  await store.hset('gsheet', 'imported', true)

  // put cfpData into redis
  // prepare a batch job during that for IDs

  // write id column data in a batch

  return {
    success: true
  }
}

const insertIdColumn = async (spreadsheetId, sheetId, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')
  sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    auth,
    resource: {
      requests: [
        {
          'insertDimension': {
            'range': {
              'sheetId': sheetId,
              'dimension': 'COLUMNS',
              'startIndex': 0,
              'endIndex': 1
            },
            'inheritFromBefore': false
          }
        },
        {
          'updateCells': {
            'rows': [
              {
                values: {
                  'userEnteredValue': {
                    stringValue: 'CFP_ID'
                  }
                }
              }
            ],
            'fields': '*',
            'range': {
              'sheetId': sheetId,
              'startRowIndex': 0,
              'endRowIndex': 1,
              'startColumnIndex': 0,
              'endColumnIndex': 1
            }
          }
        }
      ]
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

const setStage = async (cfpConfig, store) => {
  const stage = Object.keys(cfpConfig.votingStages)[0]
  return store.set('stage', stage)
}

const getCFPData = async (fields, store, auth) => {
  const { spreadSheetId, sheetTitle } = await store.hget('gsheet', 'spreadsheet')
  const selectedFields = await store.hget('gsheet', 'fields')

  const ranges = fields
    .map(({ field, id: fieldIndex }) => {
      // increment the indexes by 1, because COLUMNS A1 notation is 1-based
      const index = fieldIndex + 1
      const a1 = indexToA1(index)

      return `${a1}2:${a1}`
    })
    .map(field => (`${sheetTitle}!${field}`))

  const columnData = await getColumnData(ranges, spreadSheetId, auth)

  return columnData[0].map((value, valueIndex) => {
    return selectedFields.reduce((talk, {field, id}, fieldIndex) => {
      talk[field] = columnData[fieldIndex][valueIndex][0]
      return talk
    }, {})
  })
}

const setFields = async (fields, store, auth) => {
  const { spreadSheetId, sheetTitle } = await store.hget('gsheet', 'spreadsheet')

  const sheetFields = await getFields(spreadSheetId, sheetTitle, auth)
  const selectedFields = sheetFields
    .filter(field => fields.some(el => el === field.id))
    .map(item => item.field)

  return store.hset('gsheet', 'fields', selectedFields)
}
