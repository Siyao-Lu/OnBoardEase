const bcrypt = require('bcryptjs');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const url = process.env.MONGO_URI;
const db = 'onBoardEase';

async function createAdmin() {
    const client = new MongoClient(url, { useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db(db);
        const collection = database.collection('users');

        const username = 'admin';
        const email = 'admin@gmail.com';
        const password = 'admin123';
        const role = 'admin';
        const status = 'approved';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminUser = {
            username,
            email,
            password: hashedPassword,
            role,
            status,
        };
        await collection.insertOne(adminUser);
        console.log('Admin created successfully.');
    } catch (error) {
        console.log('Error creating admin:', error);
    } finally {
        await client.close();
    }
}

createAdmin();