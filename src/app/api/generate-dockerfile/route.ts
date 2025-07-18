import { NextRequest, NextResponse } from 'next/server';
import { generateDockerfileForRepo } from '@/lib/agent';

export async function POST(req: NextRequest) {
  const { repo } = await req.json();
  if (!repo) {
    return NextResponse.json({ error: 'No repo provided' }, { status: 400 });
  }
    
  try {
    // Destructure to extract only the string
    const { dockerfile } = await generateDockerfileForRepo(repo);
    return NextResponse.json({ dockerfile });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

