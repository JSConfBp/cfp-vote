import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import getSettings from '../../services/settings/read'
import updateSettings from '../../services/settings/update'
import writeAuditLog from '../../services/auditlog/write'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    const data = await getSettings()
    res.end(JSON.stringify(data))
    return;
  }

  if (req.method === 'PUT') {
    writeAuditLog(session.login, `update settings ${JSON.stringify(req.body)}`)
    const data = await updateSettings(req.body, session.login)
    res.end(JSON.stringify(data))
    return;
  }

  res.status(405).send()
}
