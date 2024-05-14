import { MongoClient } from 'mongodb';
//const { MongoClient } = require("mongodb");

const host = process.env.DB_HOST || 'localhost';
const port = process.env.DB_PORT || 27017;
const database = process.env.DB_DATABASE || "file_manager";
const url = `mongodb://${host}:${port}`;


class DBClient {
    constructor() {        
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if(err) {
                console.log(err.message);
                this.db = false;
            } else {
                this.db = client.db(database);
                this.users = this.db.collection('users');
                this.files = this.db.collection('files')
            }
        });
    }

    isAlive() {return !!this.db};

    async nbUsers() {return this.users.countDocuments();}

    async nbfiles() {return this.files.countDocuments();}
}

const dbClient = new DBClient();

module.exports = dbClient;