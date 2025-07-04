import { NextRequest, NextResponse } from 'next/server';
import { createPullRequestWithFile } from '@/lib/github';

export async function POST(req: NextRequest) {
  const { repoUrl, filePath, fileContent, prTitle, prBody } = await req.json();
  try {
    const prUrl = await createPullRequestWithFile({
      repoUrl,
      filePath,
      fileContent,
      prTitle,
      prBody,
    });
    return NextResponse.json({ prUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
