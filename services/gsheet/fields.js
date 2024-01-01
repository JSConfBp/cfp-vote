import { nanoid } from 'nanoid'
import { google } from 'googleapis'
import cfpConfig from '../../cfp.config'
import { get, set, hset, hget, rpush, getStagedTalksKey } from '../store'
import createGoogleOauthClient from './oauth-client'
import getFields from './lib/get-fields'
import getColumnData from './lib/get-column-data'
import insertIDs from './lib/insert-ids'
import indexToA1 from './lib/index-to-a1'

export default async function (fields) {
  const oAuth2Client = await createGoogleOauthClient()

  const { spreadSheetId, sheetTitle, sheetId } = await hget('gsheet', 'spreadsheet')

  await hset('gsheet', 'fields', fields)
  // await setFields(fields, hset, hget, oAuth2Client)
  await setStage(cfpConfig, set)

  const cfpData = await getCFPData(fields, hget, oAuth2Client)

  const stage = await get('stage')
  const idColumnValues = []

  const stagedTalkKey = getStagedTalksKey(stage)
  const cfpLength = cfpData.length

  for (let i = 0; i < cfpLength; i++) {
    const id = `gsheet_talk_${nanoid(6)}`
    idColumnValues.push(id)

    Object.entries(cfpData[i]).forEach(async ([key, value]) => {
      await hset(id, key, value)
    })

    await rpush(stagedTalkKey, id)
  }

  await insertIdColumn(spreadSheetId, sheetId, oAuth2Client)
  await insertIDs(idColumnValues, 2, spreadSheetId, sheetTitle, oAuth2Client)

  await hset('gsheet', 'imported', true)

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

const setStage = async (cfpConfig, set) => {
  const stage = Object.keys(cfpConfig.votingStages)[0]
  return set('stage', stage)
}

const getCFPData = async (fields, hget, auth) => {
  const { spreadSheetId, sheetTitle } = await hget('gsheet', 'spreadsheet')
  const selectedFields = await hget('gsheet', 'fields')

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

const setFields = async (fields, hget, hset, auth) => {
  const { spreadSheetId, sheetTitle } = await hget('gsheet', 'spreadsheet')

  const sheetFields = await getFields(spreadSheetId, sheetTitle, auth)
  const selectedFields = sheetFields
    .filter(field => fields.some(el => el === field.id))
    .map(item => item.field)

  return hset('gsheet', 'fields', selectedFields)
}
