module.exports = function (validators) {
  return async function (value, options) {
    let clonedValidators = [...validators]

    const validate = async function (err) {
      if (err) {
        throw err
      }

      let validator = clonedValidators.shift()

      if (validator !== undefined) {
        return validator(value, options, validate)
      }

      return null
    }

    let err

    try {
      err = await validate()
    } catch (e) {
      err = e
    }

    if (err) throw err

    return value
  }
}

module.exports.json = require('./json')
