"use server"
import { z } from "zod"

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const MODEL_NAME = "llama-3.3-70b-versatile"

if (!GROQ_API_KEY) {
  console.warn("Missing GROQ_API_KEY environment variable. AI features will use fallback.")
}

// Types
export interface CodeAnalysisResult {
  summary: string
  complexity: {
    time: string
    space: string
  }
  suggestions: string[]
  bestPractices: string[]
  potentialIssues: string[]
  securityConcerns: string[]
  readabilityScore: number
  performanceScore: number
  maintainabilityScore: number
  securityScore: number
  overallScore: number
  codeSnippets: {
    original: string
    improved: string
    explanation: string
  }[]
}

export interface AlgorithmExplanationResult {
  name: string
  description: string
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  pseudocode: string
  advantages: string[]
  disadvantages: string[]
  useCases: string[]
  visualizationSteps: string[]
}

// Input validators
const codeAnalysisSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Language is required"),
})

const algorithmSchema = z.object({
  algorithm: z.string().min(1, "Algorithm name is required"),
})

// Helper function to call Groq API
async function callGroqAPI(messages: { role: string; content: string }[]): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured")
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      temperature: 0.1,
      max_tokens: 4096,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Groq API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ""
}

// Helper function to extract and parse JSON from AI responses
function extractJsonFromResponse(text: string) {
  const jsonMatch =
    text.match(/```json\s*([\s\S]*?)\s*```/) ||
    text.match(/\{[\s\S]*\}/)

  if (!jsonMatch) {
    throw new Error("Could not extract JSON from response")
  }

  const jsonString = jsonMatch[1] || jsonMatch[0]
  try {
    return JSON.parse(jsonString.replace(/^```json|```$/g, "").trim())
  } catch (parseError) {
    console.error("JSON parse error:", parseError)
    throw new Error("Failed to parse response data")
  }
}

// Fallback responses
const codeAnalysisFallback: CodeAnalysisResult = {
  summary: "Analysis could not be completed",
  complexity: { time: "Unknown", space: "Unknown" },
  suggestions: ["Try again with a different code sample"],
  bestPractices: [],
  potentialIssues: [],
  securityConcerns: [],
  readabilityScore: 0,
  performanceScore: 0,
  maintainabilityScore: 0,
  securityScore: 0,
  overallScore: 0,
  codeSnippets: [],
}

const algorithmFallback = (algorithm: string): AlgorithmExplanationResult => ({
  name: algorithm,
  description: "Explanation could not be generated",
  timeComplexity: { best: "Unknown", average: "Unknown", worst: "Unknown" },
  spaceComplexity: "Unknown",
  pseudocode: "Could not generate pseudocode",
  advantages: [],
  disadvantages: [],
  useCases: [],
  visualizationSteps: [],
})

function performStaticAnalysis(code: string, language: string): CodeAnalysisResult {
  const lines = code.split("\n")
  const lineCount = lines.length
  const nonEmptyLines = lines.filter(l => l.trim().length > 0).length
  const comments = lines.filter(l => l.trim().startsWith("//") || l.trim().startsWith("#") || l.trim().startsWith("/*")).length

  let maxDepth = 0
  lines.forEach(line => {
    const indentation = line.search(/\S/)
    if (indentation > maxDepth) maxDepth = indentation
  })
  const estimatedComplexity = Math.min(10, Math.ceil(maxDepth / 4) + 1)
  const readabilityScore = Math.min(10, Math.max(1, 10 - (lineCount > 100 ? 2 : 0) - (comments / lineCount < 0.1 ? 2 : 0)))

  return {
    summary: `Static Analysis: Code contains ${lineCount} lines (${nonEmptyLines} non-empty). Language: ${language}.`,
    complexity: {
      time: `Estimated O(n) - O(n^${estimatedComplexity}) based on nesting depth`,
      space: "Unknown (Static Analysis only)"
    },
    suggestions: [
      "Add more comments to explain complex logic.",
      "Use meaningful variable names.",
      "Consider breaking down large functions."
    ],
    bestPractices: [
      "Follow language-specific style guides.",
      "Keep functions focused on a single task.",
      "Validate all inputs."
    ],
    potentialIssues: [
      comments === 0 ? "No comments detected." : "Review comment quality.",
      lineCount > 50 ? "File length is growing." : "Code length is manageable."
    ],
    securityConcerns: [
      "Static analysis cannot detect deep security flaws.",
      "Ensure sensitive data is not hardcoded."
    ],
    readabilityScore,
    performanceScore: 7,
    maintainabilityScore: 7,
    securityScore: 5,
    overallScore: Math.round((readabilityScore + 19) / 4 * 10) / 10,
    codeSnippets: [{
      original: code.substring(0, 100) + "...",
      improved: "// Example improvement\n" + code.substring(0, 100) + "...",
      explanation: "Static analysis mode. Connect API for advanced suggestions."
    }]
  }
}

export async function analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
  try {
    const parsedInput = codeAnalysisSchema.safeParse({ code, language })
    if (!parsedInput.success) {
      return performStaticAnalysis(code, language)
    }

    if (!GROQ_API_KEY) {
      return performStaticAnalysis(code, language)
    }

    const prompt = `Analyze the following ${language} code as a senior engineering professional:

\`\`\`${language}
${code}
\`\`\`

Provide analysis with:
1. Technical summary
2. Time and space complexity (Big O)
3. Optimization recommendations
4. Best practices
5. Potential bugs and issues
6. Security vulnerabilities
7. Scores (1-10): readability, performance, maintainability, security
8. Overall quality score (1-10)
9. 1-3 code snippets showing improvements

Format as JSON:
{
  "summary": "...",
  "complexity": { "time": "...", "space": "..." },
  "suggestions": ["..."],
  "bestPractices": ["..."],
  "potentialIssues": ["..."],
  "securityConcerns": ["..."],
  "readabilityScore": 7,
  "performanceScore": 6,
  "maintainabilityScore": 8,
  "securityScore": 5,
  "overallScore": 6.5,
  "codeSnippets": [{ "original": "...", "improved": "...", "explanation": "..." }]
}`

    const text = await callGroqAPI([
      { role: "system", content: "You are an expert code analyst. Respond with valid JSON only." },
      { role: "user", content: prompt }
    ])

    const analysisResult = extractJsonFromResponse(text) as CodeAnalysisResult
    return analysisResult

  } catch (error: any) {
    console.error("Code analysis error:", error.message || error)
    const staticResult = performStaticAnalysis(code, language)
    return {
      ...staticResult,
      summary: `[Offline Mode] ${staticResult.summary} (API Error: ${error.message?.includes("429") ? "Rate Limit" : "Connection Failed"})`
    }
  }
}

export async function getAlgorithmExplanation(algorithm: string): Promise<AlgorithmExplanationResult> {
  try {
    const parsedInput = algorithmSchema.safeParse({ algorithm })
    if (!parsedInput.success) {
      return algorithmFallback(algorithm)
    }

    if (!GROQ_API_KEY) {
      return algorithmFallback(algorithm)
    }

    const prompt = `Explain the ${algorithm} algorithm technically.

Format as JSON:
{
  "name": "Full name",
  "description": "How it works",
  "timeComplexity": { "best": "...", "average": "...", "worst": "..." },
  "spaceComplexity": "...",
  "pseudocode": "...",
  "advantages": ["..."],
  "disadvantages": ["..."],
  "useCases": ["..."],
  "visualizationSteps": ["..."]
}`

    const text = await callGroqAPI([
      { role: "system", content: "You are an expert algorithm tutor. Respond with valid JSON only." },
      { role: "user", content: prompt }
    ])

    const explanationResult = extractJsonFromResponse(text) as AlgorithmExplanationResult
    return explanationResult

  } catch (error) {
    console.error("Algorithm explanation error:", error)
    return algorithmFallback(algorithm)
  }
}
