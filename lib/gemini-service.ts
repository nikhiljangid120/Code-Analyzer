"use server"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"
import { z } from "zod" // For input validation

// Initialize the Google Generative AI with the API key
const API_KEY = process.env.GEMINI_API_KEY
if (!API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(API_KEY)

// Centralized safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

// Centralized model configuration
const getModel = (outputTokens = 4096, temp = 0.2) => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    safetySettings,
    generationConfig: {
      temperature: temp,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: outputTokens,
    },
  })
}

// Helper function to extract and parse JSON from AI responses
function extractJsonFromResponse(text: string) {
  // Try multiple patterns to extract JSON
  const jsonMatch = 
    text.match(/```json\s*([\s\S]*?)\s*```/) || // Match code blocks
    text.match(/{[\s\S]*}/) ||                  // Match bare JSON
    text.match(/\{[\s\S]*?\}/g)                 // Last resort looser matching
    
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

// Fallback responses
const codeAnalysisFallback: CodeAnalysisResult = {
  summary: "Analysis could not be completed",
  complexity: {
    time: "Unknown",
    space: "Unknown",
  },
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
  timeComplexity: {
    best: "Unknown",
    average: "Unknown",
    worst: "Unknown",
  },
  spaceComplexity: "Unknown",
  pseudocode: "Could not generate pseudocode",
  advantages: [],
  disadvantages: [],
  useCases: [],
  visualizationSteps: [],
})

// Rate limiting logic
const requestCache = new Map<string, { timestamp: number, data: any }>()
const RATE_LIMIT_MS = 10000 // 10 seconds

function getRateLimitedCachedResult<T>(cacheKey: string, fallback: T): T | null {
  const cached = requestCache.get(cacheKey)
  
  if (cached) {
    const now = Date.now()
    if (now - cached.timestamp < RATE_LIMIT_MS) {
      return cached.data as T
    }
  }
  
  return null
}

function setCachedResult(cacheKey: string, data: any): void {
  requestCache.set(cacheKey, {
    timestamp: Date.now(),
    data
  })
  
  // Clean old cache entries
  if (requestCache.size > 100) {
    const now = Date.now()
    requestCache.forEach((value, key) => {
      if (now - value.timestamp > 3600000) { // 1 hour
        requestCache.delete(key)
      }
    })
  }
}

/**
 * Analyzes code and provides detailed feedback on quality, performance, and security
 */
export async function analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
  try {
    // Validate inputs
    const parsedInput = codeAnalysisSchema.safeParse({ code, language })
    if (!parsedInput.success) {
      console.warn("Input validation failed:", parsedInput.error)
      return codeAnalysisFallback
    }
    
    // Check rate limit/cache
    const cacheKey = `code:${code.substring(0, 100)}:${language}`
    const cached = getRateLimitedCachedResult(cacheKey, codeAnalysisFallback)
    if (cached) return cached

    // Prepare the prompt with more professional, non-AI language
    const prompt = `
      Analyze the following ${language} code as a senior engineering professional would:
      
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Provide a technical analysis with:
      1. A technical summary of functionality
      2. Time and space complexity analysis with Big O notation
      3. Specific optimization recommendations with examples
      4. Industry best practices that would improve the code
      5. Potential bugs, edge cases and issues
      6. Security vulnerabilities or concerns
      7. Technical scores (1-10) for: readability, performance, maintainability, security
      8. Overall quality score (1-10)
      9. 1-3 code snippets showing specific improvements with technical justification
      
      Format as JSON with this structure:
      {
        "summary": "Technical description of the code",
        "complexity": {
          "time": "Time complexity with explanation",
          "space": "Space complexity with explanation"
        },
        "suggestions": ["Suggestion 1", "Suggestion 2"...],
        "bestPractices": ["Best practice 1", "Best practice 2"...],
        "potentialIssues": ["Issue 1", "Issue 2"...],
        "securityConcerns": ["Security concern 1", "Security concern 2"...],
        "readabilityScore": 7,
        "performanceScore": 6,
        "maintainabilityScore": 8,
        "securityScore": 5,
        "overallScore": 6.5,
        "codeSnippets": [
          {
            "original": "Original code snippet",
            "improved": "Improved code snippet",
            "explanation": "Technical justification for improvements"
          }
        ]
      }
    `

    // Get model with larger token limit for code analysis
    const model = getModel(8192, 0.1) // Lower temperature for more precise results
    
    // Generate content with timeout
    const resultPromise = model.generateContent(prompt)
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 30000) // 30 second timeout
    )
    
    const result = await Promise.race([resultPromise, timeoutPromise])
    if (!result) throw new Error("Request timed out")
    
    const response = await result.response
    const text = response.text()
    
    // Extract and parse JSON
    const analysisResult = extractJsonFromResponse(text) as CodeAnalysisResult
    
    // Cache the result
    setCachedResult(cacheKey, analysisResult)
    
    return analysisResult
  } catch (error) {
    console.error("Code analysis error:", error instanceof Error ? error.message : String(error))
    return codeAnalysisFallback
  }
}

/**
 * Provides in-depth explanation of algorithms with complexity analysis and examples
 */
export async function getAlgorithmExplanation(algorithm: string): Promise<AlgorithmExplanationResult> {
  try {
    // Validate input
    const parsedInput = algorithmSchema.safeParse({ algorithm })
    if (!parsedInput.success) {
      console.warn("Input validation failed:", parsedInput.error)
      return algorithmFallback(algorithm)
    }
    
    // Check rate limit/cache
    const cacheKey = `algorithm:${algorithm.toLowerCase()}`
    const cached = getRateLimitedCachedResult(cacheKey, algorithmFallback(algorithm))
    if (cached) return cached

    // Prepare prompt with more professional language
    const prompt = `
      Provide a technical explanation of the ${algorithm} algorithm from a computer science perspective.
      
      Format as JSON with this structure:
      {
        "name": "Full name of the algorithm",
        "description": "Technical description of how the algorithm works",
        "timeComplexity": {
          "best": "Best case time complexity with mathematical justification",
          "average": "Average case time complexity with mathematical justification",
          "worst": "Worst case time complexity with mathematical justification"
        },
        "spaceComplexity": "Space complexity with mathematical justification",
        "pseudocode": "Pseudocode representation following standard conventions",
        "advantages": ["Technical advantage 1", "Technical advantage 2"...],
        "disadvantages": ["Technical limitation 1", "Technical limitation 2"...],
        "useCases": ["Application 1", "Application 2"...],
        "visualizationSteps": ["Step 1 with technical details", "Step 2 with technical details"...]
      }
      
      Focus on technical correctness and precision.
    `

    const model = getModel(4096, 0.1) // Lower temperature for factual accuracy
    
    // Generate with timeout
    const resultPromise = model.generateContent(prompt)
    const timeoutPromise = new Promise<null>((_, reject) => 
      setTimeout(() => reject(new Error("Request timed out")), 20000) // 20 second timeout
    )
    
    const result = await Promise.race([resultPromise, timeoutPromise])
    if (!result) throw new Error("Request timed out")
    
    const response = await result.response
    const text = response.text()
    
    // Extract and parse JSON
    const explanationResult = extractJsonFromResponse(text) as AlgorithmExplanationResult
    
    // Cache the result
    setCachedResult(cacheKey, explanationResult)
    
    return explanationResult
  } catch (error) {
    console.error("Algorithm explanation error:", error instanceof Error ? error.message : String(error))
    return algorithmFallback(algorithm)
  }
}
