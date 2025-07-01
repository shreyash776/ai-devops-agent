import { NextRequest, NextResponse } from 'next/server';
import { reviewWorkflow } from '@/lib/filegen';

export async function POST(req: NextRequest) {
  const { workflowContent } = await req.json();
  if (!workflowContent) {
    return NextResponse.json({ error: 'No workflow content provided' }, { status: 400 });
  }
  try {
    const review = await reviewWorkflow(workflowContent);
    return NextResponse.json({ review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
