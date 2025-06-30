import { NextRequest, NextResponse } from 'next/server';
import { generateWorkflowForRepo } from '@/lib/agent';

export async function POST(req: NextRequest) {
  const { repo } = await req.json();
  if (!repo) {
    return NextResponse.json({ error: 'No repo provided' }, { status: 400 });
  }

  try {
   
    const { workflow } = await generateWorkflowForRepo(repo);
    return NextResponse.json({ workflow });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
