"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Editor, useMonaco } from "@monaco-editor/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Copy, Download, Upload, Code, Check, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

const languageOptions = [
  { id: "javascript", name: "JavaScript", extension: "js" },
  { id: "typescript", name: "TypeScript", extension: "ts" },
  { id: "python", name: "Python", extension: "py" },
  { id: "java", name: "Java", extension: "java" },
  { id: "cpp", name: "C++", extension: "cpp" },
  { id: "csharp", name: "C#", extension: "cs" },
  { id: "go", name: "Go", extension: "go" },
  { id: "rust", name: "Rust", extension: "rs" },
  { id: "ruby", name: "Ruby", extension: "rb" },
  { id: "php", name: "PHP", extension: "php" },
  { id: "swift", name: "Swift", extension: "swift" },
  { id: "kotlin", name: "Kotlin", extension: "kt" },
]

const defaultCode = {
  javascript: `// JavaScript code example
function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}

// Example usage
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array));`,
  typescript: `// TypeScript code example
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}

// Example usage
const array: number[] = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array));`,
  python: `# Python code example
def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    
    return arr

# Example usage
array = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(array))`,
  java: `// Java code example
import java.util.Arrays;

public class BubbleSort {
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        bubbleSort(array);
        System.out.println(Arrays.toString(array));
    }
    
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
  cpp: `// C++ code example
#include <iostream>
#include <vector>

std::vector<int> bubbleSort(std::vector<int> arr) {
    int n = arr.size();
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
    
    return arr;
}

int main() {
    std::vector<int> array = {64, 34, 25, 12, 22, 11, 90};
    std::vector<int> sorted = bubbleSort(array);
    
    for (int num : sorted) {
        std::cout << num << " ";
    }
    
    return 0;
}`,
  csharp: `// C# code example
using System;

class BubbleSort {
    static int[] Sort(int[] arr) {
        int n = arr.Length;
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        
        return arr;
    }
    
    static void Main() {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        int[] sorted = Sort(array);
        
        Console.WriteLine(string.Join(", ", sorted));
    }
}`,
  go: `// Go code example
package main

import "fmt"

func bubbleSort(arr []int) []int {
    n := len(arr)
    
    for i := 0; i < n; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                // Swap elements
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
    
    return arr
}

func main() {
    array := []int{64, 34, 25, 12, 22, 11, 90}
    sorted := bubbleSort(array)
    
    fmt.Println(sorted)
}`,
  rust: `// Rust code example
fn bubble_sort(mut arr: Vec<i32>) -> Vec<i32> {
    let n = arr.len();
    
    for i in 0..n {
        for j in 0..n-i-1 {
            if arr[j] > arr[j+1] {
                // Swap elements
                arr.swap(j, j+1);
            }
        }
    }
    
    arr
}

fn main() {
    let array = vec![64, 34, 25, 12, 22, 11, 90];
    let sorted = bubble_sort(array);
    
    println!("{:?}", sorted);
}`,
  ruby: `# Ruby code example
def bubble_sort(arr)
  n = arr.length
  
  for i in 0...n
    for j in 0...(n-i-1)
      if arr[j] > arr[j+1]
        # Swap elements
        arr[j], arr[j+1] = arr[j+1], arr[j]
      end
    end
  end
  
  arr
end

# Example usage
array = [64, 34, 25, 12, 22, 11, 90]
puts bubble_sort(array).inspect`,
  php: `<?php
// PHP code example
function bubbleSort($arr) {
    $n = count($arr);
    
    for ($i = 0; $i < $n; $i++) {
        for ($j = 0; $j < $n - $i - 1; $j++) {
            if ($arr[$j] > $arr[$j + 1]) {
                // Swap elements
                $temp = $arr[$j];
                $arr[$j] = $arr[$j + 1];
                $arr[$j + 1] = $temp;
            }
        }
    }
    
    return $arr;
}

// Example usage
$array = [64, 34, 25, 12, 22, 11, 90];
print_r(bubbleSort($array));
?>`,
  swift: `// Swift code example
func bubbleSort(_ arr: [Int]) -> [Int] {
    var array = arr
    let n = array.count
    
    for i in 0..<n {
        for j in 0..<(n-i-1) {
            if array[j] > array[j+1] {
                // Swap elements
                let temp = array[j]
                array[j] = array[j+1]
                array[j+1] = temp
            }
        }
    }
    
    return array
}

// Example usage
let array = [64, 34, 25, 12, 22, 11, 90]
print(bubbleSort(array))`,
  kotlin: `// Kotlin code example
fun bubbleSort(arr: IntArray): IntArray {
    val n = arr.size
    
    for (i in 0 until n) {
        for (j in 0 until n - i - 1) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                val temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    
    return arr
}

fun main() {
    val array = intArrayOf(64, 34, 25, 12, 22, 11, 90)
    val sorted = bubbleSort(array)
    
    println(sorted.joinToString())
}`,
}

const themes = [
  { id: "vs-dark", name: "Dark" },
  { id: "light", name: "Light" },
  { id: "hc-black", name: "High Contrast Dark" },
  { id: "hc-light", name: "High Contrast Light" },
]

interface CodeEditorProps {
  onChange?: (value: string) => void
  onLanguageChange?: (language: string) => void
  language?: string
  height?: string
  defaultLanguage?: string
  defaultValue?: string
  readOnly?: boolean
}

export default function CodeEditor({
  onChange,
  onLanguageChange,
  language: externalLanguage,
  height = "500px",
  defaultLanguage = "javascript",
  defaultValue,
  readOnly = false,
}: CodeEditorProps) {
  const [language, setLanguage] = useState(externalLanguage || defaultLanguage)
  const [code, setCode] = useState(defaultValue || defaultCode[language as keyof typeof defaultCode] || "")
  const [theme, setTheme] = useState("vs-dark")
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const editorRef = useRef<any>(null)
  const monaco = useMonaco()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (externalLanguage && externalLanguage !== language) {
      setLanguage(externalLanguage)
      setCode(defaultCode[externalLanguage as keyof typeof defaultCode] || "")
    }
  }, [externalLanguage, language])

  useEffect(() => {
    if (monaco) {
      // Customize editor here
      monaco.editor.defineTheme("custom-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1a1b26",
          "editor.foreground": "#a9b1d6",
          "editor.lineHighlightBackground": "#2a2b36",
          "editorCursor.foreground": "#c0caf5",
          "editorWhitespace.foreground": "#3b3d4d",
          "editorIndentGuide.background": "#3b3d4d",
        },
      })

      setTheme("custom-dark")
    }
  }, [monaco])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setCode(defaultCode[value as keyof typeof defaultCode] || "")
    if (onChange) {
      onChange(defaultCode[value as keyof typeof defaultCode] || "")
    }
    if (onLanguageChange) {
      onLanguageChange(value)
    }
  }

  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      if (onChange) {
        onChange(value)
      }
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast({
      title: "Code copied to clipboard",
      description: "You can now paste it anywhere you need",
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = () => {
    const langOption = languageOptions.find((opt) => opt.id === language)
    const extension = langOption ? langOption.extension : "txt"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Code downloaded",
      description: `Saved as code.${extension}`,
      duration: 2000,
    })
  }

  const handleUploadCode = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Detect language from file extension
    const extension = file.name.split(".").pop()?.toLowerCase()
    const langOption = languageOptions.find((opt) => opt.extension === extension)

    if (langOption) {
      setLanguage(langOption.id)
      if (onLanguageChange) {
        onLanguageChange(langOption.id)
      }
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCode(content)
      if (onChange) {
        onChange(content)
      }
    }
    reader.readAsText(file)

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run()
      toast({
        title: "Code formatted",
        description: "Your code has been formatted",
        duration: 2000,
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect">
        <div className="flex items-center justify-between p-4 border-b border-border/40">
          <div className="flex items-center space-x-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px] bg-background/60">
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger className="w-[180px] bg-background/60">
                <SelectValue placeholder="Select Theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleDownloadCode}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleUploadCode}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleFormatCode}>
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Format code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".js,.ts,.py,.java,.cpp,.cs,.go,.rs,.rb,.php,.swift,.kt"
            />
          </div>
        </div>
        <CardContent className="p-0 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          <Editor
            height={height}
            language={language}
            value={code}
            theme={theme}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              readOnly: readOnly,
              renderLineHighlight: "all",
              cursorBlinking: "smooth",
              smoothScrolling: true,
              contextmenu: true,
              folding: true,
              showFoldingControls: "always",
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
              quickSuggestions: true,
            }}
            className="border-0"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

