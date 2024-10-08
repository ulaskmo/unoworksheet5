import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import User from './models/user';

dotenv.config();

// Debug logs to verify that environment variables are being loaded
console.log('DB_CONN_STRING:', process.env.DB_CONN_STRING);
console.log('DB_NAME:', process.env.DB_NAME);

const connectionString: string = process.env.DB_CONN_STRING || "";
const dbName: string = process.env.DB_NAME || "web2_2024";
const client = new MongoClient(connectionString);

let db: Db;
export let usersCollection: Collection<User>;

export const collections: { users?: Collection<User> } = {};

client.connect()
  .then(() => {
    db = client.db(dbName);
    usersCollection = db.collection('users');
    collections.users = usersCollection;
    console.log('Connected to database');
  })
  .catch((error) => {
    if (error instanceof Error) {
      console.log(`Issue with DB connection: ${error.message}`);
    } else {
      console.log(`Error with: ${error}`);
    }
  });
