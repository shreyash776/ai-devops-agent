import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepo } from '@/lib/github';

export async function POST(req: NextRequest) {
  const { repo } = await req.json();
  if (!repo) {
    return NextResponse.json({ error: 'No repo provided' }, { status: 400 });
  }

  try {
    const analysis = await analyzeRepo(repo);

    // Suggest services based on analysis
    const services: string[] = [];
    if (analysis.dockerfileContent) services.push('review-dockerfile');
    else services.push('generate-dockerfile');
    if (analysis.fileTree.some(f => f.startsWith('.github/workflows/'))) services.push('review-workflow');
    else services.push('generate-workflow');
    services.push('security-audit');
    services.push('generate-docs');
    if (analysis.dockerfileContent) services.push('explain-dockerfile');
    if (analysis.fileTree.some(f => f.startsWith('.github/workflows/'))) services.push('explain-workflow');

    return NextResponse.json({ ...analysis, services });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
