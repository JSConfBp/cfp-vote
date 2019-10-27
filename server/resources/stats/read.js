const { read } = require('../../services/stats')
const StatsReadResponse = require('../../responses/StatsRead')

module.exports = async (request, response) => {
  const data = await read(request)
  response.send(StatsReadResponse(data))
}
