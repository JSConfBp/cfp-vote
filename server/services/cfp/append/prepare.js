const store = require('../../../store')
const createGoogleOauthClient = require('../../../auth/google-oauth')

const {
  getFields,
  getCFPData,
} = require('../../../lib/gsheet')

module.exports = async ({ body }) => {

  let oauthClient
  try {
    oauthClient = await createGoogleOauthClient()
  } catch (e) {
    console.error(e)
    return {
      access: false,
    }
  }

  const { spreadSheetId, sheetTitle, sheetId } = await store.hget('gsheet', 'spreadsheet')
  const sheetFields = await getFields(spreadSheetId, sheetTitle, oauthClient)
  const fields = await store.get('fields')
  const fieldIndexes = fields.map(field => sheetFields.indexOf(field))

  const data = await getCFPData([0, ...fieldIndexes], store, oauthClient)
  const indexOffset = data.findIndex(elem => !elem.CFP_ID)

  return {
    success: true,
    count: data.length - indexOffset
  }
}
