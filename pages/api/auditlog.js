import getAuditLog from '../../services/auditlog/read'

export default async function handler(req, res) {
  const data = await getAuditLog()
  res.end(JSON.stringify(data))
}
