import { lpush } from '../store'

export default async function (user, action) {
    const data = {
        timestamp: new Date(),
        user,
        action
    }

    await lpush('auditlog', JSON.stringify(data))
}
