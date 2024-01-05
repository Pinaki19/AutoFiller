var express = require('express');
var router = express.Router();
const path = require('path');
const ejs = require('ejs');
const { incrementVisitCount } = require('./increamentCounts')
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Pinaki_Toll_system:Pinaki_toll_6070@cluster0.wsag3nu.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
router.get('/', async function (req, res, next) {
    try {
        const htmlFilePath = path.join(__dirname, '../public/html', 'about.html');

        await client.connect();

        // Fetch data from MongoDB
        const database = client.db("Autofiller"); // Replace with your actual database name
        const collection = database.collection("Sitedata"); // Replace with your actual collection name
        const documentId = "6598621e8ff960e1666b3217"; // Replace with your actual document id

        const siteData = await collection.findOne({ _id: new ObjectId(documentId) });

        // Render HTML with data using EJS
        const renderedHtml = await ejs.renderFile(htmlFilePath, {
            formsFilled: siteData.formsFilled,
            questionsAnswered: siteData.questionsAnswered,
            totalVisits: siteData.totalVisits,
            timeSaved: siteData.timeSaved
        });
        res.send(renderedHtml);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

module.exports = router;
