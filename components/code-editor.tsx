"use client"

import React, { useState, useEffect, useRef } from "react"
import { Editor, useMonaco } from "@monaco-editor/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Copy, Download, Upload, Code, Check, Trash2, Save, Undo, Redo, Info } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"

const languageOptions = [
  { id: "javascript", name: "JavaScript", extension: "js" },
  { id: "python", name: "Python", extension: "py" },
  { id: "java", name: "Java", extension: "java" },
  { id: "cpp", name: "C++", extension: "cpp" },
  { id: "c", name: "C", extension: "c" },
  { id: "csharp", name: "C#", extension: "cs" },
]

const defaultCode = {
  javascript: `// Two Sum: Find indices of two numbers that add up to target
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]`,
  python: `# Two Sum: Find indices of two numbers that add up to target
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]`,
  java: `// Two Sum: Find indices of two numbers that add up to target
import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}

public class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        int[] result = sol.twoSum(new int[] {2, 7, 11, 15}, 9);
        System.out.println("[" + result[0] + ", " + result[1] + "]"); // [0, 1]
    }
}`,
  cpp: `// Two Sum: Find indices of two numbers that add up to target
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.find(complement) != map.end()) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}

int main() {
    std::vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    std::vector<int> result = twoSum(nums, target);
    std::cout << "[" << result[0] << ", " << result[1] << "]" << std::endl; // [0, 1]
    return 0;
}`,
  c: `// Two Sum: Find indices of two numbers that add up to target
#include <stdlib.h>
#include <stdio.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    *returnSize = 0;
    return result;
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int returnSize;
    int* result = twoSum(nums, 4, target, &returnSize);
    printf("[%d, %d]\n", result[0], result[1]); // [0, 1]
    free(result);
    return 0;
}`,
  csharp: `// Two Sum: Find indices of two numbers that add up to target
using System;
using System.Collections.Generic;

class Solution {
    public int[] TwoSum(int[] nums, int target) {
        Dictionary<int, int> map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (map.ContainsKey(complement)) {
                return new int[] { map[complement], i };
            }
            map[nums[i]] = i;
        }
        return new int[] {};
    }
}

class Program {
    static void Main() {
        Solution sol = new Solution();
        int[] result = sol.TwoSum(new int[] {2, 7, 11, 15}, 9);
        Console.WriteLine($"[{result[0]}, {result[1]}]"); // [0, 1]
    }
}`,
}

const themes = [
  { id: "vs-dark", name: "Dark" },
  { id: "vs", name: "Light" },
  { id: "hc-black", name: "High Contrast Dark" },
  { id: "solarized-dark", name: "Solarized Dark" },
  { id: "solarized-light", name: "Solarized Light" },
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
  height = "400px",
  defaultLanguage = "javascript",
  defaultValue,
  readOnly = false,
}: CodeEditorProps) {
  const [language, setLanguage] = useState(externalLanguage || defaultLanguage)
  const [code, setCode] = useState(defaultValue || defaultCode[language as keyof typeof defaultCode] || "")
  const [theme, setTheme] = useState("vs-dark")
  const [copied, setCopied] = useState(false)
  const [autoSave, setAutoSave] = useState(false)
  const [stats, setStats] = useState({ words: 0, chars: 0 })
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
      monaco.editor.defineTheme("custom-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#1e1e2e",
          "editor.foreground": "#cdd6f4",
          "editor.lineHighlightBackground": "#313244",
          "editorCursor.foreground": "#f5e0dc",
        },
      })
      monaco.editor.defineTheme("solarized-dark", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#002b36",
          "editor.foreground": "#839496",
          "editor.lineHighlightBackground": "#073642",
          "editorCursor.foreground": "#93a1a1",
        },
      })
      monaco.editor.defineTheme("solarized-light", {
        base: "vs",
        inherit: true,
        rules: [],
        colors: {
          "editor.background": "#fdf6e3",
          "editor.foreground": "#657b83",
          "editor.lineHighlightBackground": "#eee8d5",
          "editorCursor.foreground": "#586e75",
        },
      })
      setTheme("custom-dark")
    }
  }, [monaco])

  useEffect(() => {
    const words = code.trim().split(/\s+/).filter(Boolean).length
    const chars = code.length
    setStats({ words, chars })

    if (autoSave) {
      localStorage.setItem(`code-editor-${language}`, code)
    }
  }, [code, autoSave, language])

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
  }

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    setCode(defaultCode[value as keyof typeof defaultCode] || "")
    if (onChange) onChange(defaultCode[value as keyof typeof defaultCode] || "")
    if (onLanguageChange) onLanguageChange(value)
  }

  const handleThemeChange = (value: string) => {
    setTheme(value)
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      if (onChange) onChange(value)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
      duration: 2000,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = () => {
    const langOption = languageOptions.find((opt) => opt.id === language)
    const extension = langOption?.extension || "txt"
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `two-sum.${extension}`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Downloaded!",
      description: `Saved as two-sum.${extension}`,
      duration: 2000,
    })
  }

  const handleUploadCode = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const extension = file.name.split(".").pop()?.toLowerCase()
    const langOption = languageOptions.find((opt) => opt.extension === extension)
    if (langOption) {
      setLanguage(langOption.id)
      if (onLanguageChange) onLanguageChange(langOption.id)
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCode(content)
      if (onChange) onChange(content)
    }
    reader.readAsText(file)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run()
      toast({
        title: "Formatted!",
        description: "Code has been formatted",
        duration: 2000,
      })
    }
  }

  const handleClearCode = () => {
    setCode("")
    if (onChange) onChange("")
    toast({
      title: "Cleared!",
      description: "Code editor has been cleared",
      duration: 2000,
    })
  }

  const handleSaveCode = () => {
    localStorage.setItem(`code-editor-${language}`, code)
    toast({
      title: "Saved!",
      description: "Code saved to local storage",
      duration: 2000,
    })
  }

  const handleUndo = () => {
    if (editorRef.current) {
      editorRef.current.trigger("undo", "undo", null)
      toast({
        title: "Undo!",
        description: "Last action undone",
        duration: 2000,
      })
    }
  }

  const handleRedo = () => {
    if (editorRef.current) {
      editorRef.current.trigger("redo", "redo", null)
      toast({
        title: "Redo!",
        description: "Last action redone",
        duration: 2000,
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="border border-border/20 shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-b border-border/20 bg-background/95 gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[140px] sm:w-[120px] bg-background">
                <SelectValue placeholder="Language" />
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
              <SelectTrigger className="w-[140px] sm:w-[120px] bg-background">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                {themes.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Switch
                checked={autoSave}
                onCheckedChange={setAutoSave}
                className="scale-75"
              />
              <span>Auto-save</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <TooltipProvider>
              {/* File Operations */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleSaveCode}>
                    <Save className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Save code</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleUploadCode}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Upload code</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleDownloadCode}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download code</TooltipContent>
              </Tooltip>
              {/* Edit Operations */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy code</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleFormatCode}>
                    <Code className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Format code</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleUndo}>
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleRedo}>
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Redo</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleClearCode}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear code</TooltipContent>
              </Tooltip>
              {/* Stats */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" disabled className="flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    <span className="text-xs">{`${stats.words} words, ${stats.chars} chars`}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Code statistics</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".js,.py,.java,.cpp,.c,.cs"
            />
          </div>
        </div>
        <CardContent className="p-0 h-[400px] sm:h-[500px] overflow-auto">
          <Editor
            height="100%"
            language={language}
            value={code}
            theme={theme}
            onChange={handleCodeChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: "on",
              readOnly,
              renderLineHighlight: "line",
              cursorBlinking: "smooth",
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              quickSuggestions: {
                other: true,
                comments: false,
                strings: false,
              },
              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
            }}
            className="w-full"
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}