const jws = require('jws')
const moment = require('moment')

const internals = {}

const algorithm = 'HS256'
const claims = ['iss', 'sub', 'exp']
const issuer = 'piosk'

internals.errors = {
  TOKEN_DECODE: 'Token cannot be decoded',
  TOKEN_EXPIRED: 'Token has been expired',
  MISSING_TOKEN_CLAIMS: 'One or more claims are missing',
  MISSING_TOKEN_SUBJECT: 'No subject provided',
  UNKNOWN_TOKEN_ISSUER: 'Unknown token issuer',
  INVALID_TOKEN_SIGNATURE: 'Invalid token signature'
}

/**
 * @param {string} token
 * @return {Object}
 */
const decode = function (token) {
  const decoded = jws.decode(token)

  if (decoded === null) {
    error('TOKEN_DECODE')
  }

  return decoded.payload
}

/**
 * @param {string} secret
 * @param {string} token - Raw JSON Web Token
 * @return {*}
 */
const validate = function (token, secret) {
  const payload = decode(token)

  if (!hasAllMandatoryClaims(payload)) {
    error('MISSING_TOKEN_CLAIMS')
  }

  if (isExpired(payload)) {
    error('TOKEN_EXPIRED')
  }

  if (!hasNotEmptySubject(payload)) {
    error('MISSING_TOKEN_SUBJECT')
  }

  if (!hasTrustedIssuer(payload)) {
    error('UNKNOWN_TOKEN_ISSUER')
  }

  if (!hasValidSignature(token, secret)) {
    error('INVALID_TOKEN_SIGNATURE')
  }

  return payload
}

/**
 * @param {Object} payload
 * @return {boolean}
 */
const hasAllMandatoryClaims = function (payload) {
  return claims
    .map((value) => payload[value] !== undefined)
    .reduce((sum, value) => sum && value, true)
}

/**
 * @param {Object} payload
 * @return {boolean}
 */
const hasNotEmptySubject = function (payload) {
  return String(payload.sub).trim().length > 0
}

/**
 * @param {Object} payload
 * @return {boolean}
 */
const hasTrustedIssuer = function (payload) {
  return payload.iss === issuer
}

/**
 * @param {Object} payload
 * @return {boolean}
 */
const isExpired = function (payload) {
  return currentTime() > payload.exp
}

/**
 * @return {number}
 */
const currentTime = function () {
  return moment().unix()
}

/**
 * @param {string} token
 * @param {string} secret
 * @return {boolean}
 */
const hasValidSignature = function (token, secret) {
  return jws.verify(token, algorithm, secret)
}

/**
 * @param {string} code
 */
const error = function (code) {
  let error = new Error(internals.errors[code])
  error.name = code

  throw error
}

const create = function (payload, secret, { exp } = {}) {
  const defaults = {
    iss: issuer,
    exp: exp || moment().add(1, 'hour').unix()
  }

  return new Promise((resolve, reject) => {
    const token = jws.sign({
      header: {
        typ: 'JWT',
        alg: algorithm
      },
      payload: Object.assign(defaults, payload),
      secret: secret
    })

    resolve(token)
  })
}

module.exports = {
  create,
  decode,
  validate
}
