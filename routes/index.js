var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const ejs = require('ejs');
const { incrementVisitCount } = require('./increamentCounts');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const htmlFilePath = path.join(__dirname, '../public/html', 'index.html');
    let siteData;

    // Use Promise.race to add a timeout for MongoDB connection
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB connection timed out')), 2000);
    });

    try {
      // Wait for either MongoDB connection or timeout
      await Promise.race([connectPromise, timeoutPromise]);
    } catch (error) {
      // Handle timeout by providing dummy data
      console.error(error.message); // Log the timeout error
      const countsJson = await fs.readFile(path.join(__dirname, 'Counts.json'), 'utf-8');
      siteData = JSON.parse(countsJson);
    }

    if (client.topology.isConnected()) {
      // Fetch data from MongoDB
      const database = client.db("Autofiller");
      const collection = database.collection("Sitedata");
      const documentId = "6598621e8ff960e1666b3217";
      siteData = await collection.findOne({ _id: new ObjectId(documentId) });

      // Update the Counts.json file with the latest data
      await fs.writeFile(path.join(__dirname, 'Counts.json'), JSON.stringify(siteData, null, 2));
    }

    // Render HTML with data using EJS
    const renderedHtml = await ejs.renderFile(htmlFilePath, {
      formsFilled: siteData.formsFilled || 500,
      questionsAnswered: siteData.questionsAnswered || 2000,
      totalVisits: siteData.totalVisits || 200,
      timeSaved: siteData.timeSaved || 101
    });
    res.send(renderedHtml);

    incrementVisitCount();
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

module.exports = router;
