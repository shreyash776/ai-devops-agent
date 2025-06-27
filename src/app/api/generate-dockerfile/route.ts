import { NextRequest, NextResponse } from 'next/server';
import { generateDockerfile } from '@/lib/agent';

export async function POST(req: NextRequest) {
  const { analysis } = await req.json();
  if (!analysis) {
    return NextResponse.json({ error: 'No analysis provided' }, { status: 400 });
  }

  try {
    const dockerfile = await generateDockerfile(analysis);
    return NextResponse.json({ dockerfile });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
