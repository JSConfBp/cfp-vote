const { create } = require('../../services/cfp')
const CfpCreatedResponse = require('../../responses/CfpCreated')

module.exports = async (request, response) => {


  console.log(request.headers, request.body);
  
  const data = await create(request.headers, request.body)
  response.send(CfpCreatedResponse(data))
}
