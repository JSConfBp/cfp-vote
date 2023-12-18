import getUsers from '../../../services/users/read_full'
import createUser from '../../../services/users/create'
import removeUser from '../../../services/users/remove'
import writeAuditLog from '../../../services/auditlog/write'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  const { users } = req.query
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    if (users[0] === 'full') {
        const data = await getUsers()
        res.end(JSON.stringify(data))
        return;
    }
  }

  if (req.method === 'POST') {
    writeAuditLog(session.login, `add user ${req.body.login}`)
    const data = await createUser(req.body.login)
    res.end(JSON.stringify(data))
    return;
  }

  if (req.method === 'DELETE') {
    const user = users[0]
    writeAuditLog(session.login, `delete user ${user}`)
    const data = await removeUser(user)
    res.end(JSON.stringify(data))
    return;
  }

  res.status(404).send()
}
