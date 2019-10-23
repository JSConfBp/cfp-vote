/**
 * @param {string} token - JWS token
 */
module.exports = function (payload) {
  if (payload.jwt) return payload.jwt

  return payload
}
