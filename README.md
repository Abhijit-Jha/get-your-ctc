# 💰 Know Your Worth - Developer Salary Estimator

A brutally honest, AI-powered salary estimator that analyzes GitHub profiles to provide realistic CTC (Cost to Company) estimates for the Indian tech market.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## ✨ Features

### 🎯 Core Features
- **Brutally Honest AI Analysis** - Uses Google Gemini 2.5 Flash to provide realistic, no-nonsense salary estimates
- **Comprehensive GitHub Analysis** - Analyzes repos, stars, forks, languages, and activity patterns
- **Smart Filtering** - Ignores tutorial repos, forks, and learning projects to focus on real work
- **Red Flags & Green Flags** - Identifies concerning patterns and highlights strengths
- **Downloadable Results** - Export your salary card as a high-quality PNG image with watermark
- **MongoDB Integration** - Automatically saves all analyses for tracking and insights

### 🎨 Design Features
- **Neo-Brutalist UI** - Bold, modern design with sharp borders and shadows
- **Fully Responsive** - Perfect on mobile, tablet, and desktop devices
- **Dark Mode Support** - Seamless theme switching
- **Professional Typography** - Inter & JetBrains Mono fonts for optimal readability
- **Smooth Animations** - Framer Motion powered interactions

### 📊 Analytics
- **Vercel Analytics** - Track user behavior and page views (no setup needed)
- **Speed Insights** - Monitor performance metrics automatically
- **Database Tracking** - Store every analysis with full GitHub stats

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Google Gemini API key
- MongoDB Atlas account (optional but recommended)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Abhijit-Jha/get-your-ctc.git
cd get-your-ctc
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# Required: Gemini API Key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Optional: MongoDB for saving analyses
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/know-your-worth?retryWrites=true&w=majority
```

**Get your Gemini API key:** [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### Backend
- **Next.js API Routes** - Serverless functions
- **MongoDB & Mongoose** - Database and ODM
- **Octokit** - GitHub API integration
- **Google Gemini AI** - AI-powered analysis

### Analytics & Monitoring
- **@vercel/analytics** - User analytics
- **@vercel/speed-insights** - Performance monitoring

## 📦 Project Structure

```
know-your-worth/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── save-analysis/
│   │   │       └── route.ts       # API endpoint for saving analyses
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout with fonts and analytics
│   │   └── page.tsx              # Main page component
│   ├── components/
│   │   ├── ui/                   # Shadcn UI components
│   │   ├── theme-provider.tsx   # Dark mode provider
│   │   └── theme-toggle.tsx     # Theme switcher
│   ├── lib/
│   │   ├── gemini.ts            # Gemini AI integration
│   │   ├── github.ts            # GitHub API functions
│   │   ├── mongodb.ts           # MongoDB connection
│   │   ├── saveAnalysis.ts      # Database operations
│   │   └── utils.ts             # Utility functions
│   └── models/
│       └── Analysis.ts          # Mongoose schema
├── .env.local                   # Environment variables (create this)
└── package.json
```

## 🎨 Key Features Explained

### Brutal Honesty Mode

The AI performs deep analysis across 8 major criteria:

1. **Repository Quality** - Filters out tutorials, forks, and low-value repos
2. **Impact & Visibility** - Evaluates stars, forks, and community engagement
3. **Technical Depth** - Analyzes specialization vs. breadth
4. **Commitment & Consistency** - Checks activity patterns and gaps
5. **Experience Reality Check** - Validates claims against profile evidence
6. **Market Reality** - Considers current Indian tech market trends (2024-25)
7. **Red Flags Detection** - Identifies concerning patterns
8. **Green Flags Recognition** - Highlights genuine strengths

### Realistic Salary Bands (Indian Market)

- **Fresh Graduate (0-1 yr):** ₹3-8 LPA
- **Junior (1-3 yr):** ₹6-15 LPA
- **Mid-Level (3-5 yr):** ₹12-25 LPA
- **Senior (5-8 yr):** ₹20-45 LPA
- **Lead/Principal (8+ yr):** ₹35-80 LPA

*Estimates consider location (Bangalore, Hyderabad, Pune), company type (startup vs. MNC), and role demand.*

### What Gets Saved to MongoDB

Every analysis stores:
- GitHub username and URL
- Years of experience and target role
- CTC estimate with confidence score
- AI-generated brutally honest message
- GitHub statistics (repos, stars, forks, languages)
- Account age, location, company
- Timestamp for tracking

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Add environment variables**
   - Go to Project Settings → Environment Variables
   - Add `NEXT_PUBLIC_GEMINI_API_KEY`
   - Add `MONGODB_URI` (optional)

4. **Deploy!**
   - Vercel Analytics and Speed Insights work automatically
   - No additional configuration needed

### Build Locally

```bash
npm run build
npm run start
```

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GEMINI_API_KEY` | ✅ Yes | Google Gemini API key for AI analysis |
| `MONGODB_URI` | ⚠️ Optional | MongoDB connection string for storing analyses |

**Note:** The app works without MongoDB, but analyses won't be saved.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Abhijit Jha**
- Twitter: [@JhaAbhijit1](https://twitter.com/JhaAbhijit1)
- GitHub: [@Abhijit-Jha](https://github.com/Abhijit-Jha)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Icons from [Lucide](https://lucide.dev/)
- Hosted on [Vercel](https://vercel.com)

## 📊 Analytics & Monitoring

- **Vercel Analytics** automatically tracks page views and user interactions
- **Speed Insights** monitors Core Web Vitals and performance metrics
- **MongoDB** stores detailed analysis data for insights

No additional setup required - analytics work automatically when deployed to Vercel!

---

**Made with ❤️ by Abhijit Jha for the Devs**

*Know your worth. Negotiate better. Build awesome things.* 🚀

