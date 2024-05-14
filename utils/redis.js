const redis = require('redis');

class RedisClient {
    constructor () {
        this.client = redis.createClient();

        this.client.on('error', (error) => console.log(error.message));
    }

    isAlive() {
        return this.client.connect;
    }

    async get(key) {
        return await this.client.get(key);
    }

    async set(key, value, duration) {
        this.client.setex(key,duration, value);
    }

    async del(key) {
        this.client.del(key);
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;