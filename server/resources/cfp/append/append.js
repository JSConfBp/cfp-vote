const { append } = require('../../../services/cfp/append')

module.exports = async (request, response) => {
  const data = await append(request)
  response.send(data)
}
