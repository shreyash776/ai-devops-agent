import { NextRequest, NextResponse } from 'next/server';
import { generateDevOpsFiles } from '@/lib/agent';

export async function POST(req: NextRequest) {
  const { repo } = await req.json();
  if (!repo) {
    return NextResponse.json({ error: 'No repo provided' }, { status: 400 });
  }

  try {
    const files = await generateDevOpsFiles(repo);
    return NextResponse.json(files);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
