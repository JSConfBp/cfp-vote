const { download } = require('../../services/cfp')

module.exports = async (request, response) => {
  const data = await download(request)

  response.send(data)
}
