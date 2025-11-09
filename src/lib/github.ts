import { Octokit } from "octokit";

export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  location: string | null;
  company: string | null;
}

export interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubProfileData {
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  languages: Record<string, number>;
  recentActivity: number; // commits in last 6 months
}

export async function fetchGitHubProfile(username: string): Promise<GitHubProfileData | null> {
  try {
    // For demo purposes, we'll use a public GitHub API without authentication
    // In production, you should use a GitHub token for higher rate limits
    const octokit = new Octokit();

    // Fetch user profile
    const userResponse = await octokit.request('GET /users/{username}', {
      username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const user: GitHubUser = {
      login: userResponse.data.login,
      name: userResponse.data.name,
      bio: userResponse.data.bio,
      public_repos: userResponse.data.public_repos,
      followers: userResponse.data.followers,
      following: userResponse.data.following,
      created_at: userResponse.data.created_at,
      updated_at: userResponse.data.updated_at,
      location: userResponse.data.location,
      company: userResponse.data.company,
    };

    // Fetch user repositories (limited to 100 for performance)
    const reposResponse = await octokit.request('GET /users/{username}/repos', {
      username,
      type: 'owner',
      sort: 'updated',
      per_page: 100,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const repos: GitHubRepo[] = reposResponse.data.map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      size: repo.size,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }));

    // Calculate stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    // Calculate language usage
    const languages: Record<string, number> = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + repo.size;
      }
    });

    // Calculate recent activity (simplified - just count repos updated in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentActivity = repos.filter(repo =>
      new Date(repo.updated_at) > sixMonthsAgo
    ).length;

    return {
      user,
      repos,
      totalStars,
      totalForks,
      languages,
      recentActivity
    };
  } catch (error) {
    // console.error('Error fetching GitHub profile:', error);
    return null;
  }
}

export function extractUsernameFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'github.com') {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[0] || null;
    }
    return null;
  } catch {
    return null;
  }
}
