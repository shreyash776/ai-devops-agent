import { NextRequest, NextResponse } from 'next/server';
import { reviewDockerfile } from '@/lib/filegen';

export async function POST(req: NextRequest) {
  const { dockerfileContent } = await req.json();
  if (!dockerfileContent) {
    return NextResponse.json({ error: 'No Dockerfile content provided' }, { status: 400 });
  }
  try {
    const review = await reviewDockerfile(dockerfileContent);
    return NextResponse.json({ review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
