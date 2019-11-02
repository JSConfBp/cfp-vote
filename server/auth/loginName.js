
module.exports = async (request) => {
  const { login } = request.user
    
  return login
}
