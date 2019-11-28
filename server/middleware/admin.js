const ADMINS = JSON.parse(process.env.ADMINS)

module.exports = async (request, response, next) => {
  const {
    user: { login }
  } = request

  if (ADMINS.includes(login)) {
    return next()
  }

  response.sendStatus(401)
}
