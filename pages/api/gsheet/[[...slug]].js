

import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import writeAuditLog from '../../../services/auditlog/write'
import activateGSheetApi from '../../../services/gsheet/activate'
import requestGSheetToken from '../../../services/gsheet/token'
import selectSheet from '../../../services/gsheet/sheet'
import importFields from '../../../services/gsheet/fields'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)
  const { slug } = req.query

  if (req.method === 'POST' && slug[0] === 'activate') {
    writeAuditLog(session.login, `activate gsheet import api`)
    const data = await activateGSheetApi(req.body)
    res.status(200).send(JSON.stringify(data));
    return;
  }

  if (req.method === 'GET' && slug[0] === 'code') {
    const data = await requestGSheetToken(req.query.code)
    res.status(200).send(JSON.stringify(data));
    return;
  }

  if (req.method === 'POST' && slug[0] === 'fields') {
    writeAuditLog(session.login, `selected fields ${JSON.stringify(req.body)}`)
    const data = await importFields(req.body)
    res.status(200).send(JSON.stringify(data));
    return;
  }

  if (req.method === 'POST' && slug[0] === 'sheet') {
    writeAuditLog(session.login, `selected sheet ${req.body.spreadSheetId}`)
    const data = await selectSheet(req.body.spreadSheetId, req.body.selectedSheetId)
    res.status(200).send(JSON.stringify(data));
    return;
  }

  res.status(405).send()
}
