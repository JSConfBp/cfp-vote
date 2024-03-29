const store = require('../../../../store')
const createGoogleOauthClient = require('../../../../auth/google-oauth')

const {
  getCFPData,
} = require('../../../../lib/gsheet')

module.exports = async ({ body }) => {

  const fields = {
    gsheet: await store.hget('gsheet', 'fields'),
  }

  const gsheet = !!(await store.hget('gsheet', 'imported'))

  const count = {
    gsheet: 0
  }

  if (gsheet) {
    let oauthClient
    try {
      oauthClient = await createGoogleOauthClient()
    } catch (e) {
      console.error(e)
      return {
        access: false,
      }
    }

    const fields = await store.hget('gsheet', 'fields')

    fields.unshift({ field: 'CFP_ID', id: 0})
    const data = await getCFPData(fields, store, oauthClient)
    const indexOffset = data.findIndex(elem => !elem.CFP_ID)
    count.gsheet = indexOffset > -1 ? data.length - indexOffset : 0
  }

  return {
    success: true,
    count
  }
}
