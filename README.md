# Know Your Worth - Developer Salary Estimator

A brutally honest, AI-powered salary estimator that analyzes GitHub profiles to provide realistic CTC (Cost to Company) estimates for the Indian tech market.

## About

This application uses advanced AI analysis to evaluate developer profiles based on their GitHub activity, providing market-realistic salary estimates with no sugar-coating. Unlike generic calculators, it filters out tutorial repos, forks, and learning projects to focus on genuine professional work.

## Core Features

**AI-Powered Analysis**
- Uses Google Gemini 2.5 Flash for intelligent evaluation
- Analyzes repository quality, stars, forks, languages, and activity patterns
- Provides specific, evidence-based feedback instead of generic praise

**Smart Filtering**
- Automatically ignores forked repositories
- Filters out tutorial and learning projects
- Focuses on original, production-ready work
- Detects and flags inflated experience claims

**Comprehensive Evaluation**
- 8-point evaluation system covering repository quality, technical depth, and market reality
- Red flags detection (dead repos, tutorial clones, inactive accounts)
- Green flags recognition (consistent contributions, original projects, community engagement)
- Experience validation against profile age and activity

**Market-Aware Estimates**
- Realistic salary bands for the Indian tech market (2024-25)
- Considers location (Bangalore, Hyderabad, Pune vs tier-2 cities)
- Factors in company type (startups vs MNCs)
- Adjusts for role demand (AI/ML vs traditional development)

**Additional Features**
- Downloadable result cards as high-quality PNG images
- Built-in watermark for sharing
- MongoDB integration for tracking analyses
- Vercel Analytics and Speed Insights
- Fully responsive design for all devices
- Dark mode support

## Technology Stack

**Frontend**
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion for animations

**Backend**
- Next.js API Routes
- MongoDB & Mongoose
- Octokit (GitHub API)
- Google Gemini AI

**Analytics**
- Vercel Analytics
- Vercel Speed Insights

## Evaluation Criteria

The AI performs brutal analysis across these dimensions:

1. **Repository Quality** - Real projects vs tutorial follow-alongs
2. **Impact & Visibility** - Community validation through stars and forks
3. **Technical Depth** - Specialization vs jack-of-all-trades
4. **Commitment & Consistency** - Activity patterns and engagement
5. **Experience Reality Check** - Claims vs evidence
6. **Market Reality** - Current Indian tech market trends
7. **Red Flags** - Warning signs and concerning patterns
8. **Green Flags** - Genuine strengths and achievements

## Salary Bands (Indian Market)

- Fresh Graduate (0-1 yr): Rs. 3-8 LPA
- Junior (1-3 yr): Rs. 6-15 LPA
- Mid-Level (3-5 yr): Rs. 12-25 LPA
- Senior (5-8 yr): Rs. 20-45 LPA
- Lead/Principal (8+ yr): Rs. 35-80 LPA

Estimates are based on current market conditions, location, company type, and role demand.

## What Makes This Different

Unlike typical salary calculators that provide generic ranges based on years of experience alone, this tool:

- Examines actual code contributions and project quality
- Filters noise (tutorials, forks) to see real work
- Provides specific, actionable feedback
- Considers market realities and location factors
- Offers brutally honest assessments without sugarcoating
- Validates experience claims against profile evidence

## Data Collected

Every analysis is saved to MongoDB (if configured) with:
- GitHub username and profile URL
- Years of experience and target role
- CTC estimate with confidence score
- AI-generated feedback message
- GitHub statistics (repos, stars, forks, languages)
- Account age, location, company information
- Timestamp for tracking trends

## Author

Abhijit Jha
- Twitter: @JhaAbhijit1
- GitHub: @Abhijit-Jha

## License

MIT License

---

Made for the Devs. Know your worth. Negotiate better. Build awesome things.
