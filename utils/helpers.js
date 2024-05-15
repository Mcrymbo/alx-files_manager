import redisClient from "./redis";
import dbClient from './db';

async function getAuthToken(req, res) {
    const token = req.headers['x-token'];
    return `auth_${token}`;
}

// return user by auth token
async function findUserIdByToken(req, res) {
    const key = await getAuthToken(req, res);
    const userId = await redisClient.get(key);
    return userId || null;
}

// get user by ID
async function findUserById(userId) {
    const userArray = await dbClient.users.find(`ObjectId("${userId}")`).toArray();
    return userArray[0] || null;
}

export {
    findUserIdByToken, findUserById,
}