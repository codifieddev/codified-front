const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function listDbs() {
  let uri = process.env.MONGO_URI;
  if (uri && !uri.includes('directConnection=true')) {
    uri += uri.includes('?') ? '&directConnection=true' : '?directConnection=true';
  }
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log("Databases on Server:", dbs.databases.map(d => d.name));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

listDbs();
