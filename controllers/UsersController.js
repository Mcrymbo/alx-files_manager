import sha1 from 'sha1';
import dbClient from '../utils/db';
import { findUserById, findUserIdByToken } from '../utils/helpers';

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

  /**
   * retrieve suer based on token 
   */

  static async getMe(request, response) {
    const token = request.headers['x-token'];
    if (!token) { return response.status(401).json({ error: 'Unauthorized' }); }

    // Retrieve the user based on the token
    const userId = await findUserIdByToken(request);
    if (!userId) return response.status(401).send({ error: 'Unauthorized' });

    const user = await findUserById(userId);

    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    const processedUser = { id: user._id, ...user };
    delete processedUser._id;
    delete processedUser.password;
    // Return the user object (email and id only)
    return response.status(200).send(processedUser);
  }
}

module.exports = UsersController;
