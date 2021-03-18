const shortid = require('shortid')

const store = require('../../../store')
const createGoogleOauthClient = require('../../../auth/google-oauth')
const { getStagedTalksKey } = store.keys

const {
  getFields,
  getCFPData,
  insertIDs,
} = require('../../../lib/gsheet')

module.exports = async ({ body }) => {

  const oauthClient = await createGoogleOauthClient()

  const { spreadSheetId, sheetTitle, sheetId } = await store.hget('gsheet', 'spreadsheet')

  const fields = await store.hget('gsheet', 'fields')
  const stage = await store.get('stage')

  fields.unshift({ field: 'CFP_ID', id: 0})
  const data = await getCFPData(fields, store, oauthClient)
  const indexOffset = data.findIndex(elem => !elem.CFP_ID)

  const stagedTalkKey = getStagedTalksKey(stage)
  const idColumnValues = []

  for (let i = indexOffset; i < data.length; i++) {
    const id = `gsheet_talk_${shortid.generate()}`
    idColumnValues.push(id)

    Object.entries(data[i]).forEach(async ([key, value]) => {
      if (key === 'CFP_ID') return;
      await store.hset(id, key, value)
    })
    await store.rpush(stagedTalkKey, id)
  }

  try {
    await insertIDs(idColumnValues, indexOffset + 2, spreadSheetId, sheetTitle, oauthClient)
    return {
      success: true,
    }

  } catch (e) {
    console.error(e);
    return {
      success: false,
      message: e.message,
    }

  }
}
