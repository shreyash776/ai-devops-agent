import { NextRequest, NextResponse } from 'next/server';
import { generateDocs } from '@/lib/filegen';

export async function POST(req: NextRequest) {
  const { analysis } = await req.json();
  if (!analysis) {
    return NextResponse.json({ error: 'No analysis provided' }, { status: 400 });
  }
  try {
    const docs = await generateDocs(analysis);
    return NextResponse.json({ docs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
