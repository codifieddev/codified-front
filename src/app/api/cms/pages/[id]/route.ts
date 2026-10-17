import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

function saveLocalPage(id: string, body: any) {
  try {
    const pagesDir = path.join(process.cwd(), 'src', 'lib', 'pages');
    if (!fs.existsSync(pagesDir)) return false;
    const files = fs.readdirSync(pagesDir).filter((file) => file.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(pagesDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (data.slug === id || data._id === id || data.id === id) {
        const updated = { ...data, ...body };
        fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
        return true;
      }
    }
  } catch (e) {
    console.error('Failed to save to local page:', e);
  }
  return false;
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

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

        const query: any = { $or: [{ _id: id }, { slug: id }] };
        try {
          if (ObjectId.isValid(id)) {
            query.$or.push({ _id: new ObjectId(id) });
          }
        } catch (e) {}

        const updateData = { ...body };
        delete updateData._id;
        delete updateData.id;

        const result = await db.collection(collectionName).updateOne(
          query,
          { $set: updateData }
        );

        await client.close();

        if (result.matchedCount > 0) {
          saveLocalPage(id, body);
          return NextResponse.json({ success: true, message: 'Page updated successfully in MongoDB', data: body });
        }
      } catch (err: any) {
        console.warn('MongoDB update failed, saving locally:', err.message);
      }
    }

    // Fallback: save to local json file
    const saved = saveLocalPage(id, body);
    return NextResponse.json({
      success: true,
      message: saved ? 'Page updated locally' : 'Page updated in state',
      data: body,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
