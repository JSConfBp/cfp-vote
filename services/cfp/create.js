import { set, rpush, hset, getStagedTalksKey } from '../store'
import { parse } from 'csv-parse'
import { nanoid } from 'nanoid'

const parseCsv = async function (data) {
  return new Promise((resolve, reject) => {
    parse(data, { columns: true }, (err, csvData) => {
      if (err) return reject(err)

      resolve(csvData)
    })
  })
}

export default async function (stage, fields, payload) {

  await hset('import', 'fields', fields)

  const cfps = await parseCsv(payload)
  const cfpLength = cfps.length

  const stagedTalkKey = getStagedTalksKey(stage)

  for (let i = 0; i < cfpLength; i++) {
    const id = `imported_talk_${nanoid(6)}`
    Object.entries(cfps[i]).forEach(async ([key, value]) => {
      await hset(id, key, value)
    })
    await rpush(stagedTalkKey, id)
  }

  await set('stage', stage)

  return { count: cfpLength }
}
