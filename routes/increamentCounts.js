const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = "Redacted"; // url has been redacted

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function incrementVisitCount() {
    try {
        await client.connect();

        const database = client.db("Autofiller"); // Replace "your_database_name" with your actual database name
        const collection = database.collection("Sitedata"); // Replace "your_collection_name" with your actual collection name

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId("6598621e8ff960e1666b3217") },
            { $inc: { totalVisits: 1 } },
            { upsert: true, returnDocument: 'after' }
        );
    } finally {
        await client.close();
    }
}

async function incrementAnsweredCount(n) {
    try {
        await client.connect();

        const database = client.db("Autofiller"); // Replace "your_database_name" with your actual database name
        const collection = database.collection("Sitedata"); // Replace "your_collection_name" with your actual collection name

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId("6598621e8ff960e1666b3217") },
            { $inc: { questionsAnswered: n*randint(10,25) } },
            { upsert: true, returnDocument: 'after' }
        );
    } finally {
        await client.close();
    }
}

async function incrementFilledCount(n) {
    try {
        await client.connect();

        const database = client.db("Autofiller"); // Replace "your_database_name" with your actual database name
        const collection = database.collection("Sitedata"); // Replace "your_collection_name" with your actual collection name

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId("6598621e8ff960e1666b3217") },
            { $inc: { formsFilled: n } },
            { upsert: true, returnDocument: 'after' }
        );
    } finally {
        await client.close();
    }
}

async function incrementTimeSaved(n) {
    try {
        await client.connect();

        const database = client.db("Autofiller"); // Replace "your_database_name" with your actual database name
        const collection = database.collection("Sitedata"); // Replace "your_collection_name" with your actual collection name

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId("6598621e8ff960e1666b3217") },
            { $inc: { timeSaved: n } },
            { upsert: true, returnDocument: 'after' }
        );
    } finally {
        await client.close();
    }
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Call the function with the provided ObjectId
module.exports = { incrementVisitCount, incrementAnsweredCount, incrementFilledCount, incrementTimeSaved };
