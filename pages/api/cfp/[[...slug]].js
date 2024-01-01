import readCfp from '../../../services/cfp/read'
import uploadCfp from '../../../services/cfp/create'
import removeCfp from '../../../services/cfp/remove'
import updateCfp from '../../../services/cfp/update'
import writeAuditLog from '../../../services/auditlog/write'
import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)


  if (req.method === 'GET') {
    const data = await readCfp()
    res.end(JSON.stringify(data))
    return
  }

  if (req.method === 'POST') {
    const stage = req.headers['x-cfp-stage']
    const fields = JSON.parse(req.headers['x-cfp-fields'])

    writeAuditLog(session.login, `uploaded CFP data from CSV, using fields ${req.headers['x-cfp-fields']}`)
    const data = await uploadCfp(stage, fields, req.body)
    res.end(JSON.stringify(data))
    return
  }

  if (req.method === 'PUT') {
    const { stage, topCount } = req.body
    writeAuditLog(session.login, `update cfp stage to ${stage} including the top ${topCount} talks`)

    const data = await updateCfp( stage, topCount );
    res.end(JSON.stringify(data))
    return
  }

  if (req.method === 'DELETE') {
    writeAuditLog(session.login, `removed CFP data`)
    const data = await removeCfp()
    res.end(JSON.stringify(data))
    return
  }

  res.status(405).send()
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
