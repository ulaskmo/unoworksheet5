import { Request, Response } from 'express';
import { usersCollection } from "../database";  // Assumes usersCollection is coming from a central database connection handler
import User from '../models/user';
import { ObjectId } from 'mongodb';

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = (await usersCollection.find({}).toArray()) as User[];
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send("Oops! Something went wrong.");
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const user = (await usersCollection.findOne(query)) as User;

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = req.body as User;

        const result = await usersCollection.insertOne(newUser);

        if (result) {
            res.status(201).location(`${result.insertedId}`).json({ message: `Created a new user with id ${result.insertedId}` });
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(`Unable to create new user.`);
    }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
    const id: string = req.params.id;
    const newData = req.body;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.updateOne(query, { $set: newData });

        if (result.matchedCount > 0) {
            res.status(200).json({ message: `User with id ${id} updated successfully` });
        } else {
            res.status(404).json({ message: `No user found with id ${id}` });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('An error occurred while updating the user.');
    }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
    let id: string = req.params.id;
    try {
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).json({ message: `Successfully removed user with id ${id}` });
        } else if (!result) {
            res.status(400).json({ message: `Failed to remove user with id ${id}` });
        } else if (!result.deletedCount) {
            res.status(404).json({ message: `No user found with id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
};

