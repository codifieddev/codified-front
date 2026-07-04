const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function inspectBlueprint() {
  let uri = process.env.MONGO_URI;
  if (uri && !uri.includes('directConnection=true')) {
    uri += uri.includes('?') ? '&directConnection=true' : '?directConnection=true';
  }
  
  console.log("Connecting directly to MongoDB...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(process.env.MONGO_DB_NAME || 'kp_codified_web_solution');
    const collection = db.collection('site_blueprints');
    const blueprints = await collection.find({}).toArray();
    console.log("Found blueprints count:", blueprints.length);
    if (blueprints.length > 0) {
      console.log("Blueprint structure keys:", Object.keys(blueprints[0]));
      // Print public theme colors
      console.log("Colors in DB:", JSON.stringify(blueprints[0].payload?.public_theme?.colors, null, 2));
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

inspectBlueprint();
