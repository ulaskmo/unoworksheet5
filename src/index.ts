import { MongoClient } from 'mongodb';

// Hardcode the MongoDB connection string for testing purposes
const uri = "mongodb+srv://s00219971:12345@cluster0.yyvrr.mongodb.net/web2_2024?retryWrites=true&w=majority";

const dbName = 'web2_2024';
const client = new MongoClient(uri);

async function connectToDB() {
    try {
        await client.connect();
        console.log(`Connected to MongoDB successfully. Database: ${dbName}`);

        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        await client.close();
    }
}

connectToDB();  // Ensure this function call is present to actually initiate the connection
