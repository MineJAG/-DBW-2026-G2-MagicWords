"use strict";

import { MongoClient } from "mongodb";

async function connectDB() {
    const uri = process.env.MONGODB_URI;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await dblist(client);
        console.log("Connected to MongoDB");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function dblist(client) {
    const list = await client.db().admin().listDatabases();
    console.log("databases:");
    list.databases.forEach(db => {
        console.log(`- ${db.name}`);
    });
}

export default connectDB;
