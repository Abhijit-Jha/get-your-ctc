"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { fetchGitHubProfile, extractUsernameFromUrl } from "@/lib/github";
import { estimateCTC } from "@/lib/gemini";
import { Github, Twitter, Download } from "lucide-react";
import { toPng } from "html-to-image";

export default function Home() {
  const [githubUrl, setGithubUrl] = useState("");
  const [yoe, setYoe] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [result, setResult] = useState<{
    ctc: string;
    message: string;
    confidence: number;
  } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!githubUrl || !yoe || !role) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const username = extractUsernameFromUrl(githubUrl);
      if (!username) {
        toast.error("Please enter a valid GitHub URL");
        setIsLoading(false);
        return;
      }

      const githubData = await fetchGitHubProfile(username);
      if (!githubData) {
        toast.error("Failed to fetch GitHub profile. Please check the URL and try again.");
        setIsLoading(false);
        return;
      }

      const ctcEstimate = await estimateCTC(githubData, yoe, role);

      setResult({
        ctc: ctcEstimate.ctc,
        message: ctcEstimate.message,
        confidence: ctcEstimate.confidence
      });

      // Save analysis to MongoDB via API route
      try {
        const accountAge = Math.floor((Date.now() - new Date(githubData.user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365));
        
        await fetch('/api/save-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            githubUsername: username,
            githubUrl: githubUrl,
            yearsOfExperience: yoe,
            targetRole: role,
            ctc: ctcEstimate.ctc,
            message: ctcEstimate.message,
            confidence: ctcEstimate.confidence,
            githubData: {
              publicRepos: githubData.user.public_repos,
              followers: githubData.user.followers,
              following: githubData.user.following,
              totalStars: githubData.totalStars,
              totalForks: githubData.totalForks,
              languages: githubData.languages,
              recentActivity: githubData.recentActivity,
              accountAge: `${accountAge} years`,
              location: githubData.user.location,
              company: githubData.user.company,
            }
          }),
        });
        // console.log('Analysis saved to database');
      } catch (dbError) {
        // console.error('Error saving to database:', dbError);
        // Don't block the user experience if DB save fails
      }

      toast.success("Analysis complete! 🎉");
    } catch (error) {
      // console.error("Error analyzing profile:", error);
      toast.error("An error occurred while analyzing your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#38BDF8',
      });

      const link = document.createElement('a');
      link.download = `know-your-worth-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success("Card downloaded successfully! 🎉");
    } catch (error) {
      // console.error('Error downloading card:', error);
      toast.error("Failed to download card. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b-4 border-black dark:border-white bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <motion.h1 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black tracking-tight"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            Know Your Worth
          </motion.h1>
          
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="neo-brutal-button cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
                onClick={() => window.open("https://twitter.com/JhaAbhijit1", "_blank")}
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="neo-brutal-button cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
                onClick={() => window.open("https://github.com/Abhijit-Jha/get-your-ctc", "_blank")}
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 max-w-xl lg:max-w-2xl">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-4 border-black dark:border-white rounded-none neo-brutal-shadow bg-white dark:bg-gray-800 overflow-hidden">
                <CardHeader className="bg-[#38BDF8] border-b-4 border-black dark:border-white p-5 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-black text-black text-center tracking-tight leading-tight">
                    Discover Your Worth
                  </CardTitle>
                  <CardDescription className="text-center text-black text-xs sm:text-sm md:text-base font-bold mt-2 leading-relaxed">
                    Enter your GitHub profile and get your market value estimate
                  </CardDescription>
                </CardHeader>

            <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
              {/* GitHub Profile Input */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wide">
                  GitHub Profile Link
                </label>
                <div className="relative">
                  <Github className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  <Input
                    placeholder="https://github.com/yourusername"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="pl-10 sm:pl-12 h-12 sm:h-14 border-3 border-black dark:border-gray-300 rounded-none focus-visible:border-[#38BDF8] focus-visible:ring-4 focus-visible:ring-[#38BDF8]/20 transition-all text-sm sm:text-base font-medium"
                  />
                </div>
              </div>

              {/* Years of Experience */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wide">
                  Years of Experience
                </label>
                <Select value={yoe} onValueChange={setYoe}>
                  <SelectTrigger className="h-12 sm:h-14 border-3 border-black dark:border-gray-300 rounded-none focus:ring-4 focus:ring-[#38BDF8]/20 text-sm sm:text-base font-medium w-full cursor-pointer bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select your experience" />
                  </SelectTrigger>
                  <SelectContent className="border-3 border-black dark:border-gray-300 rounded-none bg-white dark:bg-gray-800">
                    <SelectItem value="0-1" className="cursor-pointer">0-1 years (Fresh Graduate)</SelectItem>
                    <SelectItem value="1-3" className="cursor-pointer">1-3 years (Junior)</SelectItem>
                    <SelectItem value="3-5" className="cursor-pointer">3-5 years (Mid-level)</SelectItem>
                    <SelectItem value="5-8" className="cursor-pointer">5-8 years (Senior)</SelectItem>
                    <SelectItem value="8+" className="cursor-pointer">8+ years (Lead/Principal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Target Role */}
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-bold uppercase tracking-wide">
                  Target Role
                </label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-12 sm:h-14 border-3 border-black dark:border-gray-300 rounded-none focus:ring-4 focus:ring-[#38BDF8]/20 text-sm sm:text-base font-medium w-full cursor-pointer bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent className="border-3 border-black dark:border-gray-300 rounded-none bg-white dark:bg-gray-800">
                    <SelectItem value="frontend" className="cursor-pointer">Frontend Developer</SelectItem>
                    <SelectItem value="backend" className="cursor-pointer">Backend Developer</SelectItem>
                    <SelectItem value="fullstack" className="cursor-pointer">Full Stack Developer</SelectItem>
                    <SelectItem value="mobile" className="cursor-pointer">Mobile Developer</SelectItem>
                    <SelectItem value="devops" className="cursor-pointer">DevOps Engineer</SelectItem>
                    <SelectItem value="datascience" className="cursor-pointer">Data Scientist</SelectItem>
                    <SelectItem value="ml" className="cursor-pointer">Machine Learning Engineer</SelectItem>
                    <SelectItem value="blockchain" className="cursor-pointer">Blockchain Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Analyze Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-2 sm:pt-3"
              >
                <Button
                  onClick={handleAnalyze}
                  disabled={!githubUrl || !yoe || !role || isLoading}
                  className="w-full h-12 sm:h-14 bg-[#38BDF8] hover:bg-[#0EA5E9] text-black font-black text-sm sm:text-base border-4 border-black dark:border-white rounded-none neo-brutal-shadow-sm hover:neo-brutal-shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 sm:gap-3">
                      <motion.div
                        className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-black border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="text-sm sm:text-base md:text-lg">Analyzing your repos...</span>
                    </span>
                  ) : (
                    "Know Your Worth"
                  )}
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <Card ref={cardRef} className="border-4 border-black dark:border-white rounded-none neo-brutal-shadow bg-[#38BDF8] overflow-hidden">
                <CardHeader className="border-b-4 border-black dark:border-white p-5 sm:p-6 bg-white dark:bg-gray-800">
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl font-black text-center tracking-tight leading-tight">
                    Your Market Value
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5">
                  {/* CTC Display */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black text-black mb-3 leading-none wrap-break-word px-2">
                      {result.ctc}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-black/80">
                      Confidence: {result.confidence}%
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 border-4 border-black dark:border-white p-4 sm:p-5 rounded-none"
                  >
                    <p className="text-sm sm:text-base md:text-lg font-bold text-center leading-relaxed">
                      "{result.message}"
                    </p>
                  </motion.div>

                  {/* Watermark */}
                  <div className="text-center pb-3">
                    <p className="text-xs sm:text-sm font-bold text-black/60">
                      Generated by @JhaAbhijit1
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Download and Reset Buttons - Outside of card so they don't appear in download */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                {/* Download Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleDownloadCard}
                    disabled={isDownloading}
                    className="w-full h-11 sm:h-12 bg-[#38BDF8] text-black hover:bg-[#0EA5E9] font-bold text-sm sm:text-base border-4 border-black dark:border-white rounded-none neo-brutal-shadow-sm transition-all uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </Button>
                </motion.div>

                {/* Reset Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => {
                      setResult(null);
                      setGithubUrl("");
                      setYoe("");
                      setRole("");
                    }}
                    className="w-full h-11 sm:h-12 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-bold text-sm sm:text-base border-4 border-black dark:border-white rounded-none neo-brutal-shadow-sm transition-all uppercase tracking-wider cursor-pointer"
                  >
                    Try Again
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t-4 border-black dark:border-white py-6 sm:py-8 md:py-10 mt-12 sm:mt-16 md:mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm sm:text-base md:text-lg font-bold leading-relaxed">
            Made by{" "}
            <a
              href="https://github.com/Abhijit-Jha"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38BDF8] hover:underline transition-all hover:scale-105 inline-block cursor-pointer"
            >
              Abhijit Jha
            </a>
            {" "}for the Devs
          </p>
        </div>
      </footer>
    </div>
  );
}
