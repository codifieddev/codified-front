import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

function getLocalPages() {
  try {
    const pagesDir = path.join(process.cwd(), 'src', 'lib', 'pages');
    if (!fs.existsSync(pagesDir)) {
      return [];
    }
    const files = fs.readdirSync(pagesDir).filter((file) => file.endsWith('.json'));
    const pages = files.map((file) => {
      const filePath = path.join(pagesDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      return {
        _id: data._id || data.id || data.slug,
        id: data.id || data._id || data.slug,
        ...data,
      };
    });
    return pages;
  } catch (error) {
    console.error('Failed to read local pages:', error);
    return [];
  }
}

export async function GET(req: Request) {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (uri) {
    try {
      const client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      await client.connect();

      const dbName = process.env.MONGO_DB_NAME || 'kp_codified_web_solution';
      const collectionName = process.env.MONGO_COLLECTION_NAME || 'pages';

      const db = client.db(dbName);
      const pages = await db.collection(collectionName).find({}).toArray();

      await client.close();

      if (pages && pages.length > 0) {
        return NextResponse.json({ success: true, pages, data: pages, source: 'mongodb' });
      }
    } catch (error: any) {
      console.warn('MongoDB query failed, falling back to local files:', error.message);
    }
  }

  // Fallback to local files
  const localPages = getLocalPages();
  return NextResponse.json({
    success: true,
    pages: localPages,
    data: localPages,
    source: 'local',
  });
}
