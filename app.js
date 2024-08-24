const express = require('express');
const { MongoClient } = require('mongodb');

// Replace with your MongoDB connection string
const uri = 'mongodb+srv://root:Predator1@cluster0.65pky.mongodb.net/?retryWrites=true&w=majority';

// Create a MongoClient instance with the useUnifiedTopology option
const client = new MongoClient(uri, { useUnifiedTopology: true });

const app = express();
const port = process.env.PORT || 3000;

async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

app.get('/data', async (req, res) => {
  try {
    const db = client.db('myLogs');
    const coll = db.collection('myLogs');

    // Fetch all documents from the collection
    const data = await coll.find().toArray();

    // Format data as plain text with custom separators
    let textResponse = '';
    data.forEach((doc, index) => {
      textResponse += `  [ User: ${index + 1} ]\n`;
      for (const [key, value] of Object.entries(doc)) {
        textResponse += `  ${key}: ${value}\n`;
      }
      textResponse += '\n';
    });

    // Send the formatted text as response
    res.type('text/plain');
    res.send(textResponse);
  } catch (err) {
    console.error('Failed to fetch data', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, async () => {
  await connectToMongo();
  console.log(`Server started on http://localhost:${port}`);
});
