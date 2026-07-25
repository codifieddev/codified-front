import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(req: Request) {
  try {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json(
        { success: false, message: 'MONGO_URI is missing' },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();

    const dbName = process.env.MONGO_DB_NAME || 'kp_codified_web_solution';
    const collectionName = process.env.MONGO_COLLECTION_NAME || 'pages';

    const db = client.db(dbName);
    const pages = await db.collection(collectionName).find({}).toArray();

    await client.close();

    return NextResponse.json({ success: true, pages: pages, data: pages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
