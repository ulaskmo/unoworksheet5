import dotenv from 'dotenv';
dotenv.config(); // Load environment variables as soon as possible

import express from 'express';
import { MongoClient } from 'mongodb';
import morgan from 'morgan';
import userRoutes from './routes/users';

// Create an instance of the Express app
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use('/api/v1/users', userRoutes);

// MongoDB connection string and configuration
const dbName = 'web2_2024';

const uri = process.env.DB_CONN_STRING; // Use DB_CONN_STRING instead of MONGO_URI
if (!uri) {
    throw new Error('DB_CONN_STRING is not defined in the .env file');
}


const client = new MongoClient(uri);

async function connectToDB() {
    try {
        await client.connect();
        console.log(`Connected to MongoDB successfully. Database: ${dbName}`);

        const db = client.db(dbName);
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections);

        // Start the server only after successful MongoDB connection
        const port = 3000;
        app.listen(port, () => {
            console.log(`Server is running and listening on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } finally {
        // Close the MongoDB client when the app shuts down
        process.on('SIGINT', async () => {
            await client.close();
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    }
}

// Call the function to connect to MongoDB and start the server
connectToDB();
