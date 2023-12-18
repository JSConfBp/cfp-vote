
import { createClient } from 'redis';


const store = await createClient(process.env.REDIS_URL)
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

// migrate(store)

export const hset = async (hash, key, value) => store.hSet(hash, key, JSON.stringify(value))
export const hget = async (hash, key) => store.hGet(hash, key).then(value => JSON.parse(value))
export const hgetall = async (hash) => store.hGetAll(hash)
export const getkeys = async (str) => store.keys(str)
export const rpush = async (list, ...values) => store.rPush(list, ...values)
export const lpush = async (list, ...values) => store.lPush(list, ...values)
export const lrange = async (list, from, to) => store.lRange(list, from, to)
export const llen = async (list) => store.lLen(list)
export const lindex = async (list, index) => store.lIndex(list, index)
export const lrem = async (list, index) => store.lRem(list, index)
export const zcard = async (set) => store.zCard(set)
export const zadd = async (set, score, item) => store.zAdd(set, score, item)
export const zrange = async (set, from, to) => store.zRange(set, from, to)
export const sadd = async (key, ...members) => store.sAdd(key, ...members)
export const smembers = async (key) => store.sMembers(key)
export const srem = async (key, ...members) => store.sRem(key, ...members)
export const sismember = async (key, member) => store.sIsMember(key, member)
export const set = async (key, value) => store.set(key, JSON.stringify(value))
export const get = async (key) => store.get(key).then(value => JSON.parse(value))

export const del = async (key) => {
  if (key instanceof Array) {
    return store.del(...key).then(value => value)
  } else {
    return store.del(key).then(value => value)
  }
}
export { getUserStagedVotesKey, getStagedTalksKey } from './keys'

