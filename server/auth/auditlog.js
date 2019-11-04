const store = require('../store')

module.exports =  async (user, action) => {
    const data = {
        timestamp: new Date(),
        user, 
        action
    }

    await store.lpush('auditlog', JSON.stringify(data))
}
