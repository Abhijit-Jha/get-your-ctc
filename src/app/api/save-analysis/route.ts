import { NextRequest, NextResponse } from 'next/server';
import { saveAnalysis } from '@/lib/saveAnalysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const result = await saveAnalysis({
      githubUsername: body.githubUsername,
      githubUrl: body.githubUrl,
      yearsOfExperience: body.yearsOfExperience,
      targetRole: body.targetRole,
      ctc: body.ctc,
      message: body.message,
      confidence: body.confidence,
      githubData: body.githubData,
    });

    return NextResponse.json(result);
  } catch (error) {
    // console.error('Error in save-analysis API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save analysis' },
      { status: 500 }
    );
  }
}

