import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepo } from '@/lib/github';

export async function POST(req: NextRequest) {
  const { repo } = await req.json();
  if (!repo) {
    return NextResponse.json({ error: 'No repo provided' }, { status: 400 });
  }

  try {
    const analysis = await analyzeRepo(repo);

    
    let documentation = 0, security = 0, ci = 0, hygiene = 0;

    
    if (analysis.fileTree.some(f => f.toLowerCase() === 'readme.md')) documentation += 40;
    if (analysis.fileTree.some(f => f.toLowerCase().includes('contribut'))) documentation += 30;
    if (analysis.fileTree.some(f => f.toLowerCase().includes('license'))) documentation += 30;

    // Security: Check for dependabot, branch protection, secret scanning, etc.
    if (analysis.fileTree.some(f => f.startsWith('.github/dependabot'))) security += 30;
   
  
    if (analysis.fileTree.filter(f => f.startsWith('.github/workflows/')).length > 1) security += 30;

  
    if (analysis.fileTree.some(f => f.startsWith('.github/workflows/'))) ci += 100;

    
    if (analysis.fileTree.some(f => f.toLowerCase() === '.gitignore')) hygiene += 40;
    if (analysis.fileTree.some(f => f.toLowerCase().includes('codeowner'))) hygiene += 30;
    if (analysis.fileTree.some(f => f.toLowerCase().includes('changelog'))) hygiene += 30;

  
    documentation = Math.min(documentation, 100);
    security = Math.min(security, 100);
    ci = Math.min(ci, 100);
    hygiene = Math.min(hygiene, 100);

   
    const overall = Math.round((documentation + security + ci + hygiene) / 4);

    const scores = { documentation, security, ci, hygiene, overall };
   

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

    return NextResponse.json({ ...analysis, services, scores });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
