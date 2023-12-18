import getHistogram from '../../../services/stats/histogram'
import getStats from '../../../services/stats/stats'

export default async function handler(req, res) {
  const { slug } = req.query

  if (req.method === 'GET' && slug && slug[0] === 'histogram') {
    const data = await getHistogram()
    res.end(JSON.stringify(data))
    return;
  }

  if (req.method === 'GET') {
    const data = await getStats()
    res.end(JSON.stringify(data))
    return;
  }

  res.status(405).send()
}
