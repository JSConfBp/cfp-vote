import {get, hget, llen,  getStagedTalksKey } from '../store'

export default async function () {
  const stage = await get('stage')

  const fields = {
    imported: await hget('import', 'fields'),
    gsheet: await hget('gsheet', 'fields'),
    sessionize: await hget('sessionize', 'fields')
  }

  const count = await llen(getStagedTalksKey(stage))
  const gsheet = !!(await hget('gsheet', 'imported'))
  const sessionize = !!(await hget('sessionize', 'imported'))

  return {
    count,
    stage,
    fields,
    gsheet,
    sessionize
  }
}
