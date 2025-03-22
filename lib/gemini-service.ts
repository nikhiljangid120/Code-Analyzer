"use server"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Configure safety settings
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

export async function analyzeCode(code: string, language: string): Promise<CodeAnalysisResult> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      safetySettings,
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      },
    })

    // Prepare the prompt for code analysis
    const prompt = `
      You are an expert code analyzer and software engineer. Analyze the following ${language} code thoroughly:
      
      \`\`\`${language}
      ${code}
      \`\`\`
      
      Provide a detailed analysis including:
      1. A comprehensive summary of what the code does
      2. Detailed time and space complexity analysis with Big O notation and explanation
      3. Specific suggestions for optimization with examples
      4. Best practices that could be applied to improve the code
      5. Potential issues, bugs, or edge cases
      6. Security concerns or vulnerabilities if applicable
      7. Provide scores from 1-10 for readability, performance, maintainability, and security
      8. Calculate an overall score from 1-10 based on the above metrics
      9. Provide 1-3 code snippets showing how specific parts could be improved, with explanations
      
      Format your response as JSON with the following structure:
      {
        "summary": "Detailed description of the code",
        "complexity": {
          "time": "Time complexity with explanation",
          "space": "Space complexity with explanation"
        },
        "suggestions": ["Suggestion 1", "Suggestion 2", ...],
        "bestPractices": ["Best practice 1", "Best practice 2", ...],
        "potentialIssues": ["Issue 1", "Issue 2", ...],
        "securityConcerns": ["Security concern 1", "Security concern 2", ...],
        "readabilityScore": 7,
        "performanceScore": 6,
        "maintainabilityScore": 8,
        "securityScore": 5,
        "overallScore": 6.5,
        "codeSnippets": [
          {
            "original": "Original code snippet",
            "improved": "Improved code snippet",
            "explanation": "Explanation of improvements"
          }
        ]
      }
      
      Ensure your analysis is thorough, accurate, and helpful for improving the code.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/)
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

    try {
      // Parse the JSON response
      const analysisResult = JSON.parse(jsonString.replace(/^```json|```$/g, "").trim())
      return analysisResult as CodeAnalysisResult
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      // Fallback response if JSON parsing fails
      return {
        summary: "Unable to parse analysis results. The AI response was not in the expected format.",
        complexity: {
          time: "Unknown",
          space: "Unknown",
        },
        suggestions: ["Error analyzing code"],
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
    }
  } catch (error) {
    console.error("Error analyzing code:", error)
    throw new Error("Failed to analyze code. Please try again later.")
  }
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

export async function getAlgorithmExplanation(algorithm: string): Promise<AlgorithmExplanationResult> {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      safetySettings,
      generationConfig: {
        temperature: 0.2,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 4096,
      },
    })

    // Prepare the prompt for algorithm explanation
    const prompt = `
      You are an expert computer scientist specializing in algorithms and data structures. Provide a detailed explanation of the ${algorithm} algorithm.
      
      Format your response as JSON with the following structure:
      {
        "name": "Full name of the algorithm",
        "description": "Detailed description of how the algorithm works",
        "timeComplexity": {
          "best": "Best case time complexity with explanation",
          "average": "Average case time complexity with explanation",
          "worst": "Worst case time complexity with explanation"
        },
        "spaceComplexity": "Space complexity with explanation",
        "pseudocode": "Pseudocode representation of the algorithm",
        "advantages": ["Advantage 1", "Advantage 2", ...],
        "disadvantages": ["Disadvantage 1", "Disadvantage 2", ...],
        "useCases": ["Use case 1", "Use case 2", ...],
        "visualizationSteps": ["Step 1 description", "Step 2 description", ...]
      }
      
      Ensure your explanation is thorough, accurate, and educational.
    `

    // Generate content
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/)
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text

    try {
      // Parse the JSON response
      const explanationResult = JSON.parse(jsonString.replace(/^```json|```$/g, "").trim())
      return explanationResult as AlgorithmExplanationResult
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError)
      // Fallback response if JSON parsing fails
      return {
        name: algorithm,
        description: "Unable to parse explanation results",
        timeComplexity: {
          best: "Unknown",
          average: "Unknown",
          worst: "Unknown",
        },
        spaceComplexity: "Unknown",
        pseudocode: "Unable to generate pseudocode",
        advantages: [],
        disadvantages: [],
        useCases: [],
        visualizationSteps: [],
      }
    }
  } catch (error) {
    console.error("Error getting algorithm explanation:", error)
    throw new Error("Failed to get algorithm explanation. Please try again later.")
  }
}

