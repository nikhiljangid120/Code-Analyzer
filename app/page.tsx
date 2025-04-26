"use client"

import { useState } from "react"
import CodeEditor from "@/components/code-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader2, Code, CheckCircle, AlertCircle, Lightbulb, Shield, FileCode, Zap, Sparkles } from "lucide-react"
import { analyzeCode, type CodeAnalysisResult } from "@/lib/gemini-service"
import { toast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function CodeAnalyzerPage() {
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null)
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const handleCodeChange = (value: string) => {
    setCode(value)
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
  }

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      toast({
        title: "No code to analyze",
        description: "Please enter some code before analyzing.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    setAnalysisError(null)

    try {
      // Set a timeout to handle potential API delays
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Analysis request timed out")), 30000) // 30 second timeout
      })

      // Race between the actual API call and the timeout
      const result = (await Promise.race([analyzeCode(code, language), timeoutPromise])) as CodeAnalysisResult

      setAnalysisResult(result)
      setRetryCount(0)
    } catch (error) {
      console.error("Error analyzing code:", error)

      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setAnalysisError(errorMessage)

      toast({
        title: "Analysis failed",
        description: errorMessage.includes("timed out")
          ? "The analysis request timed out. Please try again or use a smaller code sample."
          : "There was an error analyzing your code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    handleAnalyzeCode()
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500"
    if (score >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getProgressColor = (score: number) => {
    if (score >= 8) return "bg-green-500"
    if (score >= 6) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight font-heading">
          <span className="text-primary glow-text">AI-Powered</span> Code Analyzer
        </h1>
        <p className="text-muted-foreground text-lg">
          Analyze your code for complexity, best practices, and get AI-powered optimization suggestions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CodeEditor
            onChange={handleCodeChange}
            onLanguageChange={handleLanguageChange}
            language={language}
            height="600px"
          />
          <Button
            onClick={handleAnalyzeCode}
            disabled={isAnalyzing || !code.trim()}
            className="w-full relative overflow-hidden group"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Analyze Code with AI
                <span className="absolute inset-0 rounded-md bg-primary/20 group-hover:bg-primary/30 transition-all duration-300"></span>
              </>
            )}
          </Button>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect">
                  <CardHeader className="pb-4">
                    <CardTitle>Analyzing Code</CardTitle>
                    <CardDescription>Please wait while our AI analyzes your code...</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="relative">
                      <Loader2 className="h-16 w-16 animate-spin text-primary" />
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                    </div>
                    <p className="text-muted-foreground text-center max-w-md">
                      Our AI is examining your code for complexity, best practices, potential issues, and optimization
                      opportunities.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : analysisError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-red-500">Analysis Failed</CardTitle>
                    <CardDescription>There was an error analyzing your code</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                    <AlertCircle className="h-16 w-16 text-red-500" />
                    <p className="text-muted-foreground text-center max-w-md">
                      {analysisError.includes("timed out")
                        ? "The analysis request timed out. This can happen with large code samples or when the API is experiencing high traffic."
                        : "There was an error processing your code. This might be due to API limitations or server issues."}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleRetry} className="w-full">
                      Retry Analysis ({retryCount})
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : analysisResult ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Analysis Results</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {language.toUpperCase()}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("font-bold", getScoreColor(analysisResult.overallScore))}
                        >
                          Score: {analysisResult.overallScore.toFixed(1)}/10
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>AI-powered insights to improve your code</CardDescription>
                  </CardHeader>

                  <div className="px-6 pt-2 pb-0">
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid grid-cols-4 w-full">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="issues">Issues</TabsTrigger>
                        <TabsTrigger value="improvements">Improvements</TabsTrigger>
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Code Summary</h3>
                          <p className="text-sm text-muted-foreground">{analysisResult.summary}</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Complexity Analysis</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                                <h4 className="font-medium">Time Complexity</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{analysisResult.complexity.time}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center">
                                <FileCode className="h-4 w-4 mr-2 text-blue-500" />
                                <h4 className="font-medium">Space Complexity</h4>
                              </div>
                              <p className="text-sm text-muted-foreground">{analysisResult.complexity.space}</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="issues" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Potential Issues</h3>
                          <ul className="space-y-2">
                            {analysisResult.potentialIssues.length > 0 ? (
                              analysisResult.potentialIssues.map((issue, index) => (
                                <li key={index} className="flex items-start">
                                  <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{issue}</span>
                                </li>
                              ))
                            ) : (
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">No significant issues detected</span>
                              </li>
                            )}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Security Concerns</h3>
                          <ul className="space-y-2">
                            {analysisResult.securityConcerns.length > 0 ? (
                              analysisResult.securityConcerns.map((concern, index) => (
                                <li key={index} className="flex items-start">
                                  <Shield className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{concern}</span>
                                </li>
                              ))
                            ) : (
                              <li className="flex items-start">
                                <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">No security concerns detected</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </TabsContent>

                      <TabsContent value="improvements" className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Optimization Suggestions</h3>
                          <ul className="space-y-2">
                            {analysisResult.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start">
                                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Best Practices</h3>
                          <ul className="space-y-2">
                            {analysisResult.bestPractices.map((practice, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm">{practice}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {analysisResult.codeSnippets.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Improved Code Snippets</h3>
                            <div className="space-y-2">
                              <div className="flex space-x-2">
                                {analysisResult.codeSnippets.map((_, index) => (
                                  <Button
                                    key={index}
                                    variant={activeSnippetIndex === index ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveSnippetIndex(index)}
                                  >
                                    Snippet {index + 1}
                                  </Button>
                                ))}
                              </div>

                              <div className="p-4 border rounded-md bg-secondary/30">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Original Code:</h4>
                                    <pre className="p-3 bg-secondary/50 rounded-md overflow-x-auto text-xs">
                                      <code>{analysisResult.codeSnippets[activeSnippetIndex]?.original}</code>
                                    </pre>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Improved Code:</h4>
                                    <pre className="p-3 bg-primary/10 rounded-md overflow-x-auto text-xs">
                                      <code>{analysisResult.codeSnippets[activeSnippetIndex]?.improved}</code>
                                    </pre>
                                  </div>

                                  <div>
                                    <h4 className="text-sm font-medium mb-2">Explanation:</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {analysisResult.codeSnippets[activeSnippetIndex]?.explanation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="metrics" className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Readability</h4>
                                <span className={cn("font-bold", getScoreColor(analysisResult.readabilityScore))}>
                                  {analysisResult.readabilityScore}/10
                                </span>
                              </div>
                              <Progress
                                value={analysisResult.readabilityScore * 10}
                                className={getProgressColor(analysisResult.readabilityScore)}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Performance</h4>
                                <span className={cn("font-bold", getScoreColor(analysisResult.performanceScore))}>
                                  {analysisResult.performanceScore}/10
                                </span>
                              </div>
                              <Progress
                                value={analysisResult.performanceScore * 10}
                                className={getProgressColor(analysisResult.performanceScore)}
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Maintainability</h4>
                                <span className={cn("font-bold", getScoreColor(analysisResult.maintainabilityScore))}>
                                  {analysisResult.maintainabilityScore}/10
                                </span>
                              </div>
                              <Progress
                                value={analysisResult.maintainabilityScore * 10}
                                className={getProgressColor(analysisResult.maintainabilityScore)}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">Security</h4>
                                <span className={cn("font-bold", getScoreColor(analysisResult.securityScore))}>
                                  {analysisResult.securityScore}/10
                                </span>
                              </div>
                              <Progress
                                value={analysisResult.securityScore * 10}
                                className={getProgressColor(analysisResult.securityScore)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-semibold">Overall Score</h3>
                              <span className={cn("text-xl font-bold", getScoreColor(analysisResult.overallScore))}>
                                {analysisResult.overallScore.toFixed(1)}/10
                              </span>
                            </div>
                            <Progress
                              value={analysisResult.overallScore * 10}
                              className={getProgressColor(analysisResult.overallScore)}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <CardFooter className="flex justify-between border-t mt-6 py-4">
                    <p className="text-xs text-muted-foreground">Powered by Nikhil Jangid</p>
                    <Button variant="outline" size="sm" onClick={() => setAnalysisResult(null)}>
                      Reset Analysis
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect h-[600px] flex flex-col justify-center items-center">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
                      <Code className="absolute inset-0 m-5 h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">AI Code Analysis</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                      Enter your code in the editor and click "Analyze Code" to get AI-powered insights, optimization
                      suggestions, and best practices.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <Zap className="h-6 w-6 text-yellow-500 mb-2" />
                        <span className="text-sm font-medium">Complexity Analysis</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-green-500 mb-2" />
                        <span className="text-sm font-medium">Optimization Tips</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-red-500 mb-2" />
                        <span className="text-sm font-medium">Issue Detection</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <Shield className="h-6 w-6 text-blue-500 mb-2" />
                        <span className="text-sm font-medium">Security Checks</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
