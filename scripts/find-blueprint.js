const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function findBlueprint() {
  let uri = process.env.MONGO_URI;
  if (uri && !uri.includes('directConnection=true')) {
    uri += uri.includes('?') ? '&directConnection=true' : '?directConnection=true';
  }
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    const dbNames = dbs.databases.map(d => d.name);
    
    for (const dbName of dbNames) {
      if (dbName.startsWith('kp_') || dbName.startsWith('kalp_')) {
        const db = client.db(dbName);
        const collections = await db.listCollections({ name: 'site_blueprints' }).toArray();
        if (collections.length > 0) {
          const count = await db.collection('site_blueprints').countDocuments();
          if (count > 0) {
            console.log(`Database: ${dbName} | site_blueprints has ${count} documents.`);
          }
        }
      }
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

findBlueprint();
