const fetch =  require('isomorphic-unfetch')
const store = require('../../store')

const getUser = (user) => fetch(`https://api.github.com/users/${user}?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`)
.then(res => res.json())

module.exports = async function () {

  const users = await store.smembers('users')
  
  
  const data = await Promise.all(users.map(user => getUser(user)))

  return { success: true, users: data }
}
