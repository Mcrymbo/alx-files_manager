import { v4 as uuid4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
import sha1 from 'sha1';

class AuthController {
    /**
     *  The model generates a new authentication token
     */

    static async getConnect(req, res) {
        const Authorization = req.header('Authorization') || '';
        const credential = Authorization.split(' ')[1];

        if (!credential) return res.status(401).send({ error: 'Unauthorized'});
        const decodedCredentials = Buffer.from(credential, 'base64').toString('utf-8');

        const [email, password] = decodedCredentials.split(':');
        if (!email || !password) return res.status(401).send({error: 'Unauthorized'});

        const hasPassword = sha1(password);

        // find the user with email and password
        const cred = {
            email, password: hasPassword,
        }

        const user = await dbClient.users.findOne(cred);
        if (!user) return res.status(401).send({error: 'Unauthorized'});

        // generating a random string using uuid4
        const token = uuid4();
        const key = `auth_${token}`;
        const expiryTime = 24;

        // use key for storing in Redis the user ID in 24hrs
        await redisClient.set(key, user._id.toString(), expiryTime * 3600);

        return res.status(200).send({ token });
    }

    /**
     * sign-out user based on token
     */

    static async getDisconnect(request, response) {
        // retrieve the user from the token
        const token = request.headers['x-token'];
        const user = await redisClient.get(`auth_${token}`);
        if (!user) return response.status(401).send({ error: 'Unauthorized' });
    
        // delete the token in Redis
        await redisClient.del(`auth_${token}`);
        return response.status(204).end();
      }
}

module.exports = AuthController;