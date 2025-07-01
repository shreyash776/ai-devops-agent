import { NextRequest, NextResponse } from 'next/server';
import { explainFile } from '@/lib/filegen';

export async function POST(req: NextRequest) {
  const { fileContent, fileType } = await req.json();
  if (!fileContent || !fileType) {
    return NextResponse.json({ error: 'File content or type missing' }, { status: 400 });
  }
  try {
    const explanation = await explainFile(fileContent, fileType);
    return NextResponse.json({ explanation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
