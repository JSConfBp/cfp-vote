const Boom = require('boom')
const { read } = require('../../services/client')

module.exports = async (request, response) => {
    const data = await read(request)

    if (!data) {
      return response.send(Boom.notFound())
    }

    response.send(data) 
}
