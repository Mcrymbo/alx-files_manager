import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    // check for email and password
    if (!email) return res.status(400).send({ error: 'missing email' });
    if (!password) return res.status(400).send({ error: 'Missing password' });

    // check if email exists in DB
    const emailExist = await dbClient.users.findOne({ email });
    if (emailExist) return res.status(400).send({ error: 'Already exist' });

    // inserting a new user
    const hasPassword = sha1(password);
    let result;

    try {
      result = await dbClient.users.insertOne({
        email, password: hasPassword,
      });
    } catch (err) {
      return res.status(500).send({ error: 'Error creating user' });
    }

    const user = {
      id: result.insertedId,
      email,
    };

    return res.status(200).send(user);
  }
}

module.exports = UsersController;
