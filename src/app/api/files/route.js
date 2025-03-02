import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';


export async function GET() {
  try {

    const publicDirectory = path.join(process.cwd(), '/public/uploads');
    const Files = await fs.readdir(publicDirectory);
    const files = Files.map(key=> key.endsWith('pdf') ? `./uploads/${key}`:'').filter(Boolean)
    return NextResponse.json({ success: true, files }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
