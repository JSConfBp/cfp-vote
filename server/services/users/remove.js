const store = require('../../store')

module.exports = async function (request) {
    const { body: data } = request
    await store.srem('users', data.user)
    
    return { success: true }
}
