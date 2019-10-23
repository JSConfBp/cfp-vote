const path = require('path')
const Ajv = require('ajv')
const Boom = require('boom')

const rootPath = path.join(__dirname, '..', '..', 'spec', 'schemas')

/**
 * @param {string} schema
 * @param {string} field -- Limit the validation to this JSON field
 * @return {Function}
 */
module.exports = function (schema, field) {
  return async function (value, options) {
    let schemaPath = require(path.join(rootPath, schema))
    let input = value

    if (field) {
      input = input[field]

      if (typeof input === 'string') {
        try {
          input = JSON.parse(input)
        } catch (e) {
          throw Boom.badRequest()
        }
      }
    }

    let err = null

    try {
      err = (new Ajv()).validate(schemaPath, input)
    } catch (e) {
      err = e
    }

    if (err) throw Boom.badRequest()

    return value
  }
}
