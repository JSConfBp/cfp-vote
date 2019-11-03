const { read } = require('../../services/settings')

module.exports = async (request, response) => {
  const data = await read()
  response.send(data)
}
