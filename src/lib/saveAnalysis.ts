import connectDB from './mongodb';
import Analysis from '@/models/Analysis';

interface SaveAnalysisParams {
  githubUsername: string;
  githubUrl: string;
  yearsOfExperience: string;
  targetRole: string;
  ctc: string;
  message: string;
  confidence: number;
  githubData: {
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    totalForks: number;
    languages: Record<string, number>;
    recentActivity: number;
    accountAge: string;
    location?: string | null;
    company?: string | null;
  };
}

export async function saveAnalysis(params: SaveAnalysisParams) {
  try {
    const connection = await connectDB();
    
    // If MongoDB is not configured, silently skip
    if (!connection) {
      // console.log('MongoDB not configured, skipping save');
      return { success: true, skipped: true };
    }

    const analysis = new Analysis({
      githubUsername: params.githubUsername,
      githubUrl: params.githubUrl,
      yearsOfExperience: params.yearsOfExperience,
      targetRole: params.targetRole,
      ctc: params.ctc,
      message: params.message,
      confidence: params.confidence,
      githubData: params.githubData,
    });

    await analysis.save();
    // console.log('Analysis saved successfully:', params.githubUsername);
    return { success: true, id: analysis._id };
  } catch (error) {
    // console.error('Error saving analysis:', error);
    return { success: false, error: String(error) };
  }
}

export async function getAnalysisHistory(githubUsername: string, limit = 10) {
  try {
    const connection = await connectDB();
    if (!connection) {
      return { success: false, error: 'MongoDB not configured' };
    }
    
    const analyses = await Analysis.find({ githubUsername })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v')
      .lean();

    return { success: true, data: analyses };
  } catch (error) {
    // console.error('Error fetching analysis history:', error);
    return { success: false, error: String(error) };
  }
}

export async function getAllAnalyses(limit = 100) {
  try {
    const connection = await connectDB();
    if (!connection) {
      return { success: false, error: 'MongoDB not configured' };
    }
    
    const analyses = await Analysis.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v')
      .lean();

    return { success: true, data: analyses };
  } catch (error) {
    // console.error('Error fetching all analyses:', error);
    return { success: false, error: String(error) };
  }
}

