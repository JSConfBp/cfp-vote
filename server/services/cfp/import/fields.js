const store = require('../../../store')
const shortid = require('shortid')
const { google } = require('googleapis')

const cfpConfig = require('../../../../cfp.config')

const { getStagedTalksKey } = store.keys

module.exports = async function ({ payload }) {
  const fields = payload
  const googleCredentials = await store.get('google_credentials')
  const {
    client_secret: clientSecret,
    client_id: clientId,
    redirect_uris: redirectUris } = googleCredentials.installed

  const auth = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUris[0]
  )

  const token = await store.get('google_token')
  auth.setCredentials(token)

  const { spreadsheetId, sheetTitle, sheetId } = await store.get('google_spreadsheet')

  let selectedFields = await getFields(spreadsheetId, sheetTitle, auth)
  selectedFields = selectedFields.filter((field, i) => fields.includes(i))

  await store.set('vote_fields', selectedFields)
  await insertIdColumn(spreadsheetId, sheetId, auth)

  const ranges = fields
    .map(fieldIndex => {
      // increment the indexes by 1, because COLUMNS A1 notation is 1-based
      // since we prepended an extra column for the IDs,
      // increment index by another 1
      const index = fieldIndex + 2
      const a1 = indexToA1(index)

      return `${a1}2:${a1}`
    })
    .map(field => (`${sheetTitle}!${field}`))

  const columnData = await getColumnData(ranges, spreadsheetId, auth)

  const cfpData = columnData[0].map((value, valueIndex) => {
    return selectedFields.reduce((talk, field, fieldIndex) => {
      talk[field] = columnData[fieldIndex][valueIndex][0]
      return talk
    }, {})
  })

  const stage = Object.keys(cfpConfig.voting_stages)[0]

  await store.set('stage', stage)

  const idColumnValues = []

  const stagedTalkKey = getStagedTalksKey(stage)
  const cfpLength = cfpData.length

  for (let i = 0; i < cfpLength; i++) {
    const id = `talk_${shortid.generate()}`
    idColumnValues.push(id)

    Object.entries(cfpData[i]).forEach(async ([key, value]) => {
      await store.hset(id, key, value)
    })

    await store.rpush(stagedTalkKey, id)
  }

  await insertIds(idColumnValues, spreadsheetId, sheetTitle, auth)

  // put cfpData into redis
  // prepare a batch job during that for IDs

  // write id column data in a batch

  return {
    success: true
  }
}

const getFields = async (spreadsheetId, sheetTitle, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetTitle}!A1:1`,
    auth
  }, (err, response) => {
    if (err) {
      console.error(err)
      reject(err)
      return
    }

    resolve(response.data.values[0])
  })
})

const getColumnData = async (ranges, spreadsheetId, auth) => new Promise((resolve, reject) => {
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

const insertIds = async (values, spreadsheetId, sheetTitle, auth) => new Promise((resolve, reject) => {
  const sheets = google.sheets('v4')

  sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    auth,
    resource: {
      valueInputOption: 'USER_ENTERED',
      data: [
        {
          'range': `${sheetTitle}!A2:A`,
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

const indexToA1 = (index) => {
  const charcodedIndex = index + 64

  if ((charcodedIndex) <= 90) {
    return String.fromCharCode(charcodedIndex)
  }

  const firstLetter = String.fromCharCode(Math.floor(index / 26) + 64)
  const secondLetter = String.fromCharCode((index % 26) + 64)

  return `${firstLetter}${secondLetter}`
}
