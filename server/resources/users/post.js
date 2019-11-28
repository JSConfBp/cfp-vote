const { create } = require('../../services/users')

module.exports = async (request, response) => {
  const {
    user: { login }
  } = request

  const data = await create(login)
  response.send(data)
}

