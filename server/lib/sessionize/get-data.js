const fetch = require('isomorphic-unfetch')
const cache = require('./cache')

module.exports = async (url, noCache = '') => {

  try {
    if (noCache === 'no-cache') {
      throw "Requesting fresh data"
    }

    const cachedData = await cache.read(url)
    const data = JSON.parse(cachedData)
    return data
  } catch (e) {
    console.log(e)

    const response = await fetch(url, {
      headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
    })

    if (response.statusCode >= 400) {
      throw response
    }

    const data = await response.json()
    await cache.write(url, JSON.stringify(data))
    return data
  }
}



