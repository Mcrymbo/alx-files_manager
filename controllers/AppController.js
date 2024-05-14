import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    res.status(200).send(status);
  }

  /* implementing the number of users and file in DB
    * {"users": 12, "files": 2323}
    * returns with status code 200
    */
  static async getStats(req, res) {
    const stats = {
      users: dbClient.nbUsers(),
      files: dbClient.nbFiles(),
    };
    res.status(200).send(stats);
  }
}

module.exports = AppController;
