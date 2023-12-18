import { getServerSession } from 'next-auth'
import getTalk from '../../services/talks/read'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'GET') {
    const data = await getTalk(session.login)
    res.end(JSON.stringify(data))
    return;
  }

  res.status(405).send()
}
