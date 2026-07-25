import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!uri) {
      return NextResponse.json({ success: false, message: 'MONGO_URI is missing' }, { status: 500 });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const dbName = process.env.MONGO_DB_NAME || 'kp_codified_web_solution';
    const collectionName = process.env.MONGO_COLLECTION_NAME || 'pages';
    const db = client.db(dbName);

    // Try matching by string id first (since seed might have inserted strings)
    // and fallback to ObjectId if needed.
    const query = { $or: [{ _id: id }] };
    try {
      if (ObjectId.isValid(id)) {
        query.$or.push({ _id: new ObjectId(id) as any });
      }
    } catch(e) {}

    // Remove _id from body to prevent modifying immutable field
    const updateData = { ...body };
    delete updateData._id;
    delete updateData.id;

    const result = await db.collection(collectionName).updateOne(
      query,
      { $set: updateData }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Page updated successfully', data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
