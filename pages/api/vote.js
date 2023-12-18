import { getServerSession } from 'next-auth'
import addVote from '../../services/votes/add'
import { authOptions } from './auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (req.method === 'POST') {
    const data = await addVote(session.login, req.body)

    res.end(JSON.stringify(data))
    return;
  }

  res.status(405).send()
}
