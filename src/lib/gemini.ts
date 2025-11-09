import { GoogleGenerativeAI } from "@google/generative-ai";

export interface CTCEstimate {
  ctc: string;
  message: string;
  confidence: number;
}

export async function estimateCTC(
  githubData: any,
  yearsOfExperience: string,
  targetRole: string
): Promise<CTCEstimate> {
  try {
    // You'll need to set your Gemini API key in environment variables
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Using the free Gemini Flash model with JSON mode
    const model = genAI.getGenerativeModel({
      model: "models/gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const prompt = `
You are a BRUTALLY HONEST senior tech hiring manager and compensation analyst with 15+ years of experience reviewing developer profiles for Indian tech companies. Your job is to provide REALISTIC, NO-NONSENSE salary estimates based on actual market data, not sugar-coated optimism.

CRITICAL ANALYSIS REQUIRED - Analyze this GitHub profile with extreme scrutiny:

GitHub Profile Data:
- Username: ${githubData.user.login}
- Name: ${githubData.user.name || 'Not provided'}
- Bio: ${githubData.user.bio || 'Not provided'}
- Public Repositories: ${githubData.user.public_repos}
- Followers: ${githubData.user.followers}
- Following: ${githubData.user.following}
- Account Age: ${new Date(githubData.user.created_at).toLocaleDateString()} (${Math.floor((Date.now() - new Date(githubData.user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))} years old)
- Location: ${githubData.user.location || 'Not specified'}
- Company: ${githubData.user.company || 'Not specified'}
- Total Stars Received: ${githubData.totalStars}
- Total Forks: ${githubData.totalForks}
- Languages Used: ${Object.keys(githubData.languages).join(', ') || 'Not specified'}
- Language Count: ${Object.keys(githubData.languages).length}
- Recent Activity (repos updated in last 6 months): ${githubData.recentActivity}/${githubData.user.public_repos}
- Average Stars per Repo: ${githubData.user.public_repos > 0 ? (githubData.totalStars / githubData.user.public_repos).toFixed(1) : 0}
- Top Languages: ${Object.entries(githubData.languages).sort((a: [string, unknown], b: [string, unknown]) => (b[1] as number) - (a[1] as number)).slice(0, 3).map(([lang]) => lang).join(', ') || 'None'}

Repository Distribution Analysis:
${githubData.repos.slice(0, 5).map((repo: any) => 
  `- ${repo.name}: ${repo.language || 'Unknown'} | ⭐${repo.stargazers_count} | 🍴${repo.forks_count} | ${repo.description || 'No description'}`
).join('\n')}

Target Role: ${targetRole}
Years of Experience: ${yearsOfExperience}

⚠️ CRITICAL INSTRUCTION - IGNORE THESE REPOS WHEN CALCULATING CTC:
1. **Forked Repositories** - These are NOT original work, completely IGNORE them
2. **Tutorial/Course Projects** - Repos like "react-tutorial", "javascript-course", "udemy-clone" etc. DO NOT COUNT
3. **Assignment/Practice Repos** - College assignments, coding challenges, practice problems SHOULD NOT affect CTC
4. **Template/Boilerplate Repos** - Basic starter templates or clones of popular apps DON'T COUNT
5. **Archived/Dead Repos** - Not updated in 1+ years with no stars/forks IGNORE these

ONLY evaluate based on:
✅ Original projects with unique value proposition
✅ Production-ready applications (deployed, documented, maintained)
✅ Open source contributions to ESTABLISHED projects (not their own repos)
✅ Projects with community validation (stars, forks, actual users)
✅ Work that demonstrates real problem-solving, not just following tutorials

When you see names like "todo-app", "calculator", "weather-app", "netflix-clone" - these are LEARNING projects, NOT professional work.

EVALUATION CRITERIA (Be BRUTAL and HONEST):

1. REPOSITORY QUALITY ANALYSIS (IGNORE TUTORIALS & FORKS):
   - Filter out tutorial repos, forks, and learning projects FIRST
   - Only evaluate ORIGINAL, meaningful projects
   - Are the remaining repos real projects or just practice code?
   - Do they show original thinking or copy-paste implementations?
   - Are repos actively maintained or abandoned?
   - Is the code quality production-ready or beginner-level?
   - Red flags: ONLY forks visible, ALL repos are tutorials, no original work, dead repos

2. IMPACT & VISIBILITY:
   - Stars and forks indicate REAL impact, not just quantity
   - Low stars on many repos = potential quality issues
   - High stars = genuine contribution to the community
   - Zero stars on everything = either new or not building valuable things

3. TECHNICAL DEPTH:
   - Language diversity vs. Jack-of-all-trades master-of-none
   - Do they specialize or just dabble?
   - Modern tech stack or outdated technologies?
   - Do they understand system design or just frontend frameworks?

4. COMMITMENT & CONSISTENCY:
   - Recent activity shows current relevance
   - Long gaps = potentially inactive or non-coding role
   - Account age vs. activity = dedication level
   - Sporadic commits = side-project developer, not full-time

5. EXPERIENCE REALITY CHECK:
   - Does their GitHub back up their claimed experience?
   - Junior with 0-1 years should have learning projects
   - Senior with 5-8 years should have substantial, complex projects
   - Red flag: High experience claim but empty/weak profile
   - Account age vs claimed experience (account should be at least as old as professional career)

6. MARKET REALITY (Current Indian Tech Market 2024-25):
   - Startups paying less, FAANG/MNCs paying more
   - Market correction happening, salaries more realistic now
   - Remote opportunities changed compensation bands
   - Role demand: AI/ML hot, basic CRUD developers oversaturated
   - Location matters: Bangalore/Hyderabad/Pune pay more than tier-2 cities

7. RED FLAGS TO CALL OUT (AFTER FILTERING TUTORIALS/FORKS):
   - After removing forks/tutorials, ZERO original repos remain
   - Only tutorial clones visible (todo apps, calculators, clones)
   - No commits in last 6 months = not actively coding
   - Inflated experience claims not matching profile age
   - Zero documentation/README in original repos
   - All toy projects, no production-scale code
   - Following 1000+ people but 10 followers = engagement farming
   - No stars on any personal projects = quality concerns
   - Profile looks padded with tutorials and forks to appear active

8. GREEN FLAGS TO ACKNOWLEDGE:
   - Consistent commit history over time
   - Original projects with good documentation
   - Community engagement (stars, forks, meaningful contributions)
   - Modern tech stack aligned with market demand
   - Projects showing system design thinking
   - Open source contributions to established projects

SALARY ESTIMATION RULES:
- Fresh Graduate (0-1 yr): ₹3-8 LPA (higher ONLY if exceptional projects)
- Junior (1-3 yr): ₹6-15 LPA (depends heavily on current company)
- Mid-Level (3-5 yr): ₹12-25 LPA (must show solid technical depth)
- Senior (5-8 yr): ₹20-45 LPA (requires leadership + system design)
- Lead/Principal (8+ yr): ₹35-80 LPA (only if proven impact)

BE HARSH WHERE NEEDED. If the profile is weak, SAY IT DIRECTLY. If it's impressive, acknowledge it but stay grounded in reality.

YOUR MESSAGE MUST:
- Be 2-4 sentences maximum
- Call out SPECIFIC observations (e.g., "Only 2 stars across 20 repos" or "Strong React expertise evident")
- Include both strengths AND weaknesses (if both exist)
- Be witty and memorable, but NEVER sugarcoat
- Use sharp, direct language ("tutorial-level work" not "room for improvement")
- If someone's profile is genuinely weak, tell them straight up
- If someone's profile is strong, explain WHY with evidence

BAD MESSAGE EXAMPLE: "You have good potential and your projects show promise. Keep learning!"
GOOD MESSAGE EXAMPLE: "Your 47 repos average 0.3 stars each - quantity over quality won't impress hiring managers. Focus on building 2-3 production-grade projects instead of tutorial clones."
ANOTHER GOOD EXAMPLE: "After filtering out 35 forked repos and 12 tutorial projects, you have only 3 original repos with minimal stars. Your claimed 3 years of experience isn't reflected in any substantial original work."

CRITICAL: You MUST respond with ONLY a valid JSON object matching this exact schema. No markdown, no code blocks, no explanatory text.

Required JSON Schema:
{
  "ctc": "string (format: ₹X,XX,XXX - ₹Y,YY,YYY)",
  "message": "string (2-4 sentences)",
  "confidence": "number (0-100)"
}

Example valid response:
{
  "ctc": "₹12,00,000 - ₹18,00,000",
  "message": "Your React skills are solid with 3 well-documented projects, but the 6-month activity gap raises questions. The average 4.2 stars per repo shows decent community validation.",
  "confidence": 72
}

CONFIDENCE SCORING:
- 90-100: Profile is exceptionally detailed, backed by strong evidence
- 70-89: Good indicators present, reasonable estimate possible
- 50-69: Limited data, making educated guesses
- 30-49: Very sparse profile, highly uncertain
- 0-29: Almost no data, wild guess territory

Remember: Your reputation is on the line. Give estimates you'd actually defend to a hiring committee. Be BRUTALLY HONEST but constructively critical.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // console.log('Raw Gemini response:', text);

    // Try to extract JSON from the response
    try {
      // Clean up the text
      let cleanedText = text.trim();
      
      // Remove markdown code blocks if present
      cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
      
      // Remove any leading/trailing whitespace and newlines
      cleanedText = cleanedText.trim();
      
      // Try to find JSON object in the text (look for the first { to last })
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }

      // Parse the JSON
      const parsed = JSON.parse(cleanedText);
      
      // Validate required fields
      if (!parsed.ctc || !parsed.message || typeof parsed.confidence !== 'number') {
        throw new Error('Missing required fields in response');
      }

      // Ensure confidence is within valid range
      const confidence = Math.max(0, Math.min(100, parsed.confidence));

      // console.log('Successfully parsed CTC estimate:', { ctc: parsed.ctc, confidence });

      return {
        ctc: parsed.ctc,
        message: parsed.message,
        confidence: confidence
      };
    } catch (parseError) {
      // Log the error and raw response for debugging
      // console.error('Failed to parse Gemini response:', parseError);
      // console.error('Response text:', text);
      // console.error('Attempted to parse:', text.substring(0, 200));
      
      // Fallback if JSON parsing fails
      return {
        ctc: "₹6,00,000 - ₹12,00,000",
        message: "Analysis system hiccup, but let's be real - this estimate is based on limited data. Your actual worth depends heavily on interview performance and company budget. Don't take this as gospel.",
        confidence: 45
      };
    }
  } catch (error) {
    // console.error('Error estimating CTC with Gemini:', error);

    // Return a fallback estimate
    return {
      ctc: "₹4,00,000 - ₹10,00,000",
      message: "Technical difficulties prevented proper analysis. This is a conservative estimate based on your experience bracket. Get your profile analyzed properly for accurate numbers.",
      confidence: 30
    };
  }
}
