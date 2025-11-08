require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB;
const client = new MongoClient(uri);
const dataDir = path.join(__dirname, 'data');

async function migrateAllJSON() {
  try { 
    await client.connect();
    const db = client.db(dbName);

    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const raw = fs.readFileSync(filePath);
      const json = JSON.parse(raw);

      const collectionName = path.basename(file, '.json');
      const collection = db.collection(collectionName);

      const docs = Array.isArray(json) ? json : [json];
      const result = await collection.insertMany(docs);

      console.log(`[${new Date().toISOString()}] ✅ Migrated ${result.insertedCount} documents to '${collectionName}'`);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Migration failed:`, err);
  } finally {
    await client.close();
  }
}

// Run immediately
migrateAllJSON();

// Repeat every 6 hours (21600000 ms)
setInterval(() => {
  console.log(`[${new Date().toISOString()}] 🔄 Starting scheduled migration...`);
  migrateAllJSON();
}, 21600000);
