const redis = require('redis')
const {
    REDIS_CONFIG
} = require('../config/db')

const redisClient = redis.createClient(REDIS_CONFIG.port, REDIS_CONFIG.host)
// redisClient.auth('2691716451Yang')
redisClient.on('error', err => console.log(err)) // 错误处理

module.exports = {
    redisClient
}