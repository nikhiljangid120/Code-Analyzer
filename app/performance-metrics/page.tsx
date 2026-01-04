"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Book, GraduationCap, Code, Clock, Zap, Database, TrendingUp, Cpu, BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon, Download, Share2, Maximize2, HelpCircle, RefreshCw, AlertTriangle, Info, Search, Network, Map, Navigation, Layers, Loader2 } from "lucide-react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar, Tooltip, Area, AreaChart, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion"
import {
  HoverCard, HoverCardContent, HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"

const algorithmOptions = [
  { id: "bubble", name: "Bubble Sort", color: "hsl(var(--chart-1))", icon: <Clock className="h-4 w-4" />, complexity: "O(n²)", category: "Sorting" },
  { id: "quick", name: "Quick Sort", color: "hsl(var(--chart-2))", icon: <Zap className="h-4 w-4" />, complexity: "O(n log n)", category: "Sorting" },
  { id: "merge", name: "Merge Sort", color: "hsl(var(--chart-3))", icon: <Database className="h-4 w-4" />, complexity: "O(n log n)", category: "Sorting" },
  { id: "insertion", name: "Insertion Sort", color: "hsl(var(--chart-4))", icon: <TrendingUp className="h-4 w-4" />, complexity: "O(n²)", category: "Sorting" },
  { id: "selection", name: "Selection Sort", color: "hsl(var(--chart-5))", icon: <Cpu className="h-4 w-4" />, complexity: "O(n²)", category: "Sorting" },
  { id: "binary", name: "Binary Search", color: "hsl(var(--chart-6))", icon: <Search className="h-4 w-4" />, complexity: "O(log n)", category: "Search" },
  { id: "bfs", name: "Breadth-First Search", color: "hsl(var(--chart-7))", icon: <Network className="h-4 w-4" />, complexity: "O(V + E)", category: "Graph" },
  { id: "dfs", name: "Depth-First Search", color: "hsl(var(--chart-8))", icon: <Map className="h-4 w-4" />, complexity: "O(V + E)", category: "Graph" },
  { id: "dijkstra", name: "Dijkstra's Algorithm", color: "hsl(var(--chart-9))", icon: <Navigation className="h-4 w-4" />, complexity: "O((V + E) log V)", category: "Graph" },
  { id: "floyd", name: "Floyd-Warshall Algorithm", color: "hsl(var(--chart-10))", icon: <Layers className="h-4 w-4" />, complexity: "O(V³)", category: "Graph" },
  { id: "kmp", name: "Knuth-Morris-Pratt", color: "hsl(var(--chart-11))", icon: <Search className="h-4 w-4" />, complexity: "O(n + m)", category: "String" },
  { id: "boyer", name: "Boyer-Moore", color: "hsl(var(--chart-12))", icon: <Search className="h-4 w-4" />, complexity: "O(n/m)", category: "String" },
  { id: "greedy", name: "Greedy Algorithm", color: "hsl(var(--chart-13))", icon: <Zap className="h-4 w-4" />, complexity: "Varies", category: "Other" },
  { id: "kadane", name: "Kadane's Algorithm", color: "hsl(var(--chart-14))", icon: <TrendingUp className="h-4 w-4" />, complexity: "O(n)", category: "Other" },
  { id: "slowfast", name: "Slow & Fast Pointer", color: "hsl(var(--chart-15))", icon: <Clock className="h-4 w-4" />, complexity: "O(n)", category: "Other" },
  { id: "recursive", name: "Recursive Algorithm", color: "hsl(var(--chart-16))", icon: <Cpu className="h-4 w-4" />, complexity: "Varies", category: "Other" },
]

const algorithmDescriptions = {
  bubble: {
    description: "Bubble Sort repeatedly compares and swaps adjacent elements if they are in the wrong order.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    useCases: "Educational purposes, small datasets.",
  },
  quick: {
    description: "Quick Sort uses a pivot to partition the array and recursively sorts sub-arrays.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n²)" },
    spaceComplexity: "O(log n)",
    stable: false,
    inPlace: true,
    useCases: "General-purpose sorting, efficient for large datasets.",
  },
  merge: {
    description: "Merge Sort divides the array into halves, sorts them, and merges the sorted halves.",
    timeComplexity: { best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)" },
    spaceComplexity: "O(n)",
    stable: true,
    inPlace: false,
    useCases: "Stable sorting, linked lists, external sorting.",
  },
  insertion: {
    description: "Insertion Sort builds the sorted array one item at a time.",
    timeComplexity: { best: "O(n)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    useCases: "Small or nearly sorted datasets.",
  },
  selection: {
    description: "Selection Sort repeatedly selects the smallest element and places it in the sorted region.",
    timeComplexity: { best: "O(n²)", average: "O(n²)", worst: "O(n²)" },
    spaceComplexity: "O(1)",
    stable: false,
    inPlace: true,
    useCases: "Small datasets, simple implementation.",
  },
  binary: {
    description: "Binary Search finds an element by repeatedly dividing the search interval in half.",
    timeComplexity: { best: "O(1)", average: "O(log n)", worst: "O(log n)" },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    useCases: "Searching in sorted arrays, efficient for static data.",
  },
  bfs: {
    description: "Breadth-First Search explores nodes level by level in a graph.",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    stable: true,
    inPlace: false,
    useCases: "Shortest path in unweighted graphs, social networks.",
  },
  dfs: {
    description: "Depth-First Search explores as far as possible along each branch before backtracking.",
    timeComplexity: { best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)" },
    spaceComplexity: "O(V)",
    stable: true,
    inPlace: false,
    useCases: "Cycle detection, topological sorting.",
  },
  dijkstra: {
    description: "Dijkstra's Algorithm finds the shortest path in a weighted graph.",
    timeComplexity: { best: "O((V + E) log V)", average: "O((V + E) log V)", worst: "O((V + E) log V)" },
    spaceComplexity: "O(V)",
    stable: true,
    inPlace: false,
    useCases: "Navigation systems, network routing.",
  },
  floyd: {
    description: "Floyd-Warshall Algorithm finds shortest paths between all pairs of nodes.",
    timeComplexity: { best: "O(V³)", average: "O(V³)", worst: "O(V³)" },
    spaceComplexity: "O(V²)",
    stable: true,
    inPlace: true,
    useCases: "Dense graphs, all-pairs shortest paths.",
  },
  kmp: {
    description: "Knuth-Morris-Pratt algorithm efficiently searches for a pattern in a text.",
    timeComplexity: { best: "O(n + m)", average: "O(n + m)", worst: "O(n + m)" },
    spaceComplexity: "O(m)",
    stable: true,
    inPlace: false,
    useCases: "Text searching, pattern matching.",
  },
  boyer: {
    description: "Boyer-Moore algorithm searches for a pattern by skipping sections of the text.",
    timeComplexity: { best: "O(n/m)", average: "O(n/m)", worst: "O(nm)" },
    spaceComplexity: "O(m)",
    stable: true,
    inPlace: false,
    useCases: "Efficient text searching, large texts.",
  },
  greedy: {
    description: "Greedy algorithms make locally optimal choices to find a global solution.",
    timeComplexity: { best: "Varies", average: "Varies", worst: "Varies" },
    spaceComplexity: "Varies",
    stable: true,
    inPlace: true,
    useCases: "Huffman coding, minimum spanning trees.",
  },
  kadane: {
    description: "Kadane's Algorithm finds the maximum subarray sum in linear time.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    useCases: "Financial analysis, signal processing.",
  },
  slowfast: {
    description: "Slow & Fast Pointer technique detects cycles or finds middle elements in linked lists.",
    timeComplexity: { best: "O(n)", average: "O(n)", worst: "O(n)" },
    spaceComplexity: "O(1)",
    stable: true,
    inPlace: true,
    useCases: "Cycle detection, linked list problems.",
  },
  recursive: {
    description: "Recursive algorithms solve problems by breaking them into smaller subproblems.",
    timeComplexity: { best: "Varies", average: "Varies", worst: "Varies" },
    spaceComplexity: "Varies",
    stable: true,
    inPlace: false,
    useCases: "Tree traversals, dynamic programming.",
  },
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#FF6B6B', '#4ECDC4', '#1B263B', '#FFD166', '#06D6A0',
  '#118AB2', '#EF476F', '#073B4C', '#F4A261', '#2A9D8F',
  '#E76F51'
]

const generatePerformanceData = (algorithm, maxSize, dataSeed = Math.random()) => {
  const sizes = []
  for (let i = 10; i <= maxSize; i += Math.floor(maxSize / 20) || 10) {
    sizes.push(i)
  }

  return sizes.map((size) => {
    let time = 0
    let memory = 0
    let operations = 0
    let efficiency = 0
    const seed = dataSeed * size

    switch (algorithm) {
      case "bubble":
        time = size * size * 0.01 + Math.sin(seed) * 5
        memory = size * 0.5 + Math.cos(seed) * 2
        operations = size * size * 0.9 + Math.sin(seed) * size
        efficiency = 95 + Math.sin(seed) * 5
        break
      case "quick":
        time = size * Math.log2(size) * 0.05 + Math.sin(seed) * 3
        memory = size * 0.8 + Math.log2(size) * 2 + Math.cos(seed) * 3
        operations = size * Math.log2(size) * 0.8 + Math.sin(seed) * size
        efficiency = 75 + Math.sin(seed) * 10
        break
      case "merge":
        time = size * Math.log2(size) * 0.06 + Math.sin(seed) * 4
        memory = size * 1.2 + Math.cos(seed) * 5
        operations = size * Math.log2(size) * 0.7 + Math.sin(seed) * size
        efficiency = 98 + Math.sin(seed) * 2
        break
      case "insertion":
        time = size * size * 0.008 + Math.sin(seed) * 2
        memory = size * 0.4 + Math.cos(seed) * 1
        operations = size * size * 0.4 + Math.sin(seed) * size
        efficiency = 97 + Math.sin(seed) * 3
        break
      case "selection":
        time = size * size * 0.009 + Math.sin(seed) * 3
        memory = size * 0.3 + Math.cos(seed) * 1
        operations = size * size * 0.5 + Math.sin(seed) * size
        efficiency = 80 + Math.sin(seed) * 8
        break
      case "binary":
        time = Math.log2(size) * 0.02 + Math.sin(seed) * 1
        memory = 0.1 + Math.cos(seed) * 0.5
        operations = Math.log2(size) + Math.sin(seed) * 2
        efficiency = 99 + Math.sin(seed) * 1
        break
      case "bfs":
        time = size * 0.05 + Math.sin(seed) * 2
        memory = size * 0.7 + Math.cos(seed) * 3
        operations = size * 1.2 + Math.sin(seed) * size * 0.1
        efficiency = 85 + Math.sin(seed) * 5
        break
      case "dfs":
        time = size * 0.06 + Math.sin(seed) * 2
        memory = size * 0.6 + Math.cos(seed) * 3
        operations = size * 1.1 + Math.sin(seed) * size * 0.1
        efficiency = 84 + Math.sin(seed) * 5
        break
      case "dijkstra":
        time = (size + size * Math.log2(size)) * 0.04 + Math.sin(seed) * 3
        memory = size * 0.9 + Math.cos(seed) * 4
        operations = size * Math.log2(size) * 0.5 + Math.sin(seed) * size
        efficiency = 88 + Math.sin(seed) * 4
        break
      case "floyd":
        time = size * size * size * 0.001 + Math.sin(seed) * 5
        memory = size * size * 0.01 + Math.cos(seed) * 5
        operations = size * size * size * 0.002 + Math.sin(seed) * size
        efficiency = 70 + Math.sin(seed) * 10
        break
      case "kmp":
        time = size * 0.03 + Math.sin(seed) * 1
        memory = size * 0.2 + Math.cos(seed) * 1
        operations = size * 0.5 + Math.sin(seed) * size * 0.05
        efficiency = 90 + Math.sin(seed) * 3
        break
      case "boyer":
        time = size * 0.025 + Math.sin(seed) * 1
        memory = size * 0.25 + Math.cos(seed) * 1
        operations = size * 0.4 + Math.sin(seed) * size * 0.05
        efficiency = 92 + Math.sin(seed) * 3
        break
      case "greedy":
        time = size * 0.04 + Math.sin(seed) * 2
        memory = size * 0.5 + Math.cos(seed) * 2
        operations = size * 0.6 + Math.sin(seed) * size * 0.1
        efficiency = 80 + Math.sin(seed) * 10
        break
      case "kadane":
        time = size * 0.01 + Math.sin(seed) * 1
        memory = 0.1 + Math.cos(seed) * 0.5
        operations = size * 0.3 + Math.sin(seed) * size * 0.05
        efficiency = 95 + Math.sin(seed) * 2
        break
      case "slowfast":
        time = size * 0.015 + Math.sin(seed) * 1
        memory = 0.1 + Math.cos(seed) * 0.5
        operations = size * 0.2 + Math.sin(seed) * size * 0.05
        efficiency = 94 + Math.sin(seed) * 2
        break
      case "recursive":
        time = size * Math.log2(size) * 0.05 + Math.sin(seed) * 2
        memory = size * 0.8 + Math.cos(seed) * 3
        operations = size * Math.log2(size) * 0.4 + Math.sin(seed) * size
        efficiency = 85 + Math.sin(seed) * 5
        break
      default:
        time = size * Math.log2(size) * 0.05
        memory = size * 0.8
        operations = size * Math.log2(size)
        efficiency = 90
    }

    return {
      size,
      time: Math.max(0.1, time.toFixed(2)),
      memory: Math.max(0.1, memory.toFixed(2)),
      operations: Math.max(1, Math.floor(operations)),
      efficiency: Math.min(100, Math.max(0, Math.floor(efficiency))),
    }
  })
}

const generateComparisonData = (maxSize, dataSeed = Math.random()) => {
  const sizes = [10, 50, 100, 200, 500, maxSize]
  return sizes.map((size) => {
    const seed = dataSeed * size
    const data = { size }
    algorithmOptions.forEach((algo) => {
      let time = 0
      switch (algo.id) {
        case "bubble":
        case "insertion":
        case "selection":
          time = size * size * 0.01 + Math.sin(seed) * 5
          break
        case "quick":
        case "merge":
          time = size * Math.log2(size) * 0.05 + Math.sin(seed) * 3
          break
        case "binary":
          time = Math.log2(size) * 0.02 + Math.sin(seed) * 1
          break
        case "bfs":
        case "dfs":
          time = size * 0.05 + Math.sin(seed) * 2
          break
        case "dijkstra":
          time = (size + size * Math.log2(size)) * 0.04 + Math.sin(seed) * 3
          break
        case "floyd":
          time = size * size * size * 0.001 + Math.sin(seed) * 5
          break
        case "kmp":
        case "boyer":
          time = size * 0.03 + Math.sin(seed) * 1
          break
        case "greedy":
          time = size * 0.04 + Math.sin(seed) * 2
          break
        case "kadane":
        case "slowfast":
          time = size * 0.01 + Math.sin(seed) * 1
          break
        case "recursive":
          time = size * Math.log2(size) * 0.05 + Math.sin(seed) * 2
          break
        default:
          time = size * 0.05
      }
      data[algo.id] = Math.max(0.1, time.toFixed(2))
    })
    return data
  })
}

const generateTheoreticalData = (maxSize) => {
  const sizes = []
  for (let i = 10; i <= maxSize; i += Math.floor(maxSize / 20) || 10) {
    sizes.push(i)
  }

  return sizes.map((size) => ({
    size,
    "O(1)": 0.1,
    "O(log n)": Math.log2(size) * 0.02,
    "O(n)": size * 0.1,
    "O(n log n)": size * Math.log2(size) * 0.05,
    "O(n²)": size * size * 0.001,
    "O(n³)": size * size * size * 0.0001,
  }))
}

const generateEfficiencyData = () => {
  return algorithmOptions.map((algo) => {
    const seed = Math.random()
    return {
      algorithm: algo.name,
      speed: ['bubble', 'selection', 'insertion', 'floyd'].includes(algo.id) ?
        Math.floor(20 + seed * 30) : Math.floor(70 + seed * 30),
      memory: ['merge', 'floyd'].includes(algo.id) ?
        Math.floor(30 + seed * 30) : Math.floor(60 + seed * 40),
      simplicity: ['quick', 'merge', 'dijkstra', 'floyd', 'kmp', 'boyer'].includes(algo.id) ?
        Math.floor(30 + seed * 30) : Math.floor(70 + seed * 30),
      stability: ['merge', 'bubble', 'insertion', 'binary', 'bfs', 'dfs', 'dijkstra', 'floyd', 'kmp', 'boyer', 'kadane', 'slowfast'].includes(algo.id) ?
        Math.floor(80 + seed * 20) : Math.floor(30 + seed * 40),
    }
  })
}

const generatePerformanceScores = () => {
  return algorithmOptions.map(algo => {
    let score = 0
    switch (algo.id) {
      case 'quick':
      case 'binary':
      case 'kmp':
      case 'boyer':
      case 'kadane':
      case 'slowfast':
        score = 92 + Math.floor(Math.random() * 8)
        break
      case 'merge':
      case 'dijkstra':
      case 'bfs':
      case 'dfs':
        score = 88 + Math.floor(Math.random() * 8)
        break
      case 'insertion':
      case 'greedy':
      case 'recursive':
        score = 65 + Math.floor(Math.random() * 10)
        break
      case 'selection':
      case 'floyd':
        score = 55 + Math.floor(Math.random() * 10)
        break
      case 'bubble':
        score = 45 + Math.floor(Math.random() * 10)
        break
      default:
        score = 50 + Math.floor(Math.random() * 50)
    }
    return {
      name: algo.name,
      value: score,
      color: algo.color.replace("var(--", "").replace(")", "")
    }
  })
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-lg shadow-md text-sm max-w-xs">
        <p className="font-medium truncate">Input Size: {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="truncate">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function PerformanceMetricsPage() {
  const [algorithm, setAlgorithm] = useState("quick")
  const [maxSize, setMaxSize] = useState(200)
  const [showTheoretical, setShowTheoretical] = useState(false)
  const [animateCharts, setAnimateCharts] = useState(true)
  const [chartType, setChartType] = useState("line")
  const [dataSeed, setDataSeed] = useState(Math.random())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chartHeight, setChartHeight] = useState(400)
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [isLoading, setIsLoading] = useState(false)

  const [performanceData, setPerformanceData] = useState(() => generatePerformanceData("quick", 200, dataSeed))
  const [comparisonData, setComparisonData] = useState(() => generateComparisonData(1000, dataSeed))
  const [theoreticalData, setTheoreticalData] = useState(() => generateTheoreticalData(200))
  const [efficiencyData, setEfficiencyData] = useState(() => generateEfficiencyData())
  const [performanceScores, setPerformanceScores] = useState(() => generatePerformanceScores())

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setChartHeight(250)
      } else if (width < 1024) {
        setChartHeight(300)
      } else {
        setChartHeight(isFullscreen ? 500 : 400)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isFullscreen])

  const handleAlgorithmChange = (value) => {
    setAlgorithm(value)
    setPerformanceData(generatePerformanceData(value, maxSize, dataSeed))
  }

  const handleMaxSizeChange = (value) => {
    const newSize = value[0]
    setMaxSize(newSize)
    setPerformanceData(generatePerformanceData(algorithm, newSize, dataSeed))
    setTheoreticalData(generateTheoreticalData(newSize))
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    const newSeed = Math.random()
    setDataSeed(newSeed)
    setPerformanceData(generatePerformanceData(algorithm, maxSize, newSeed))
    setComparisonData(generateComparisonData(maxSize, newSeed))
    setEfficiencyData(generateEfficiencyData())
    setPerformanceScores(generatePerformanceScores())
    setTimeout(() => setIsLoading(false), 500) // Simulate async data fetch
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    setChartHeight(isFullscreen ? 400 : 500)
  }

  const handleExportData = () => {
    const dataToExport = {
      algorithm,
      maxSize,
      performanceData,
      comparisonData,
      timestamp: new Date().toISOString()
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `algorithm-analysis-${algorithm}-${maxSize}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const categories = ["All", ...new Set(algorithmOptions.map(opt => opt.category))]
  const filteredAlgorithms = categoryFilter === "All"
    ? algorithmOptions
    : algorithmOptions.filter(opt => opt.category === categoryFilter)

  const selectedAlgorithm = algorithmOptions.find(opt => opt.id === algorithm)

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-all duration-300 ease-in-out ${isFullscreen ? 'fixed inset-0 z-50 bg-background overflow-y-auto' : 'container'} opacity-0 animate-fade-in`}
    >
      <div className="flex flex-col space-y-4">
        <div
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transform -translate-y-4 opacity-0 animate-slide-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight flex items-center gap-2">
              <BarChart2 className="h-6 w-6 sm:h-8 sm:w-8" />
              Algorithm Performance Analyzer
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">Analyze and compare algorithm performance metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleToggleFullscreen}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle fullscreen</p>
                </TooltipContent>
              </UITooltip>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleExportData}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export data</p>
                </TooltipContent>
              </UITooltip>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share analysis</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 transform translate-y-4 opacity-0 animate-slide-in"
        style={{ animationDelay: '0.4s' }}
      >
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex justify-between items-center text-xl sm:text-2xl">
              <span className="flex items-center gap-2">
                {selectedAlgorithm?.icon}
                Analysis Settings
              </span>
              {selectedAlgorithm && (
                <Badge variant="outline" className="text-xs font-mono">
                  {selectedAlgorithm.complexity}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Configure algorithm and input parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Algorithm</Label>
                <Select value={algorithm} onValueChange={handleAlgorithmChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredAlgorithms.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Max Input Size: {maxSize}</Label>
                <Slider value={[maxSize]} min={10} max={1000} step={10} onValueChange={handleMaxSizeChange} />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Chart Options</Label>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch id="theoretical" checked={showTheoretical} onCheckedChange={setShowTheoretical} />
                    <Label htmlFor="theoretical">Show Theoretical</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="animate" checked={animateCharts} onCheckedChange={setAnimateCharts} />
                    <Label htmlFor="animate">Animate Charts</Label>
                  </div>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chart Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line Chart</SelectItem>
                      <SelectItem value="area">Area Chart</SelectItem>
                      <SelectItem value="bar">Bar Chart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4">
            <Button onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh Data
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
              <Info className="h-4 w-4" />
              Algorithm Details
            </CardTitle>
            <CardDescription>Key characteristics</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {selectedAlgorithm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Algorithm:</span>
                  <span className="font-bold">{selectedAlgorithm.name}</span>
                </div>
                <div>
                  <span className="font-medium">Description:</span>
                  <p className="mt-1 text-sm">{algorithmDescriptions[algorithm]?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Time Complexity</span>
                    <div className="mt-1 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Best:</span>
                        <span className="font-mono">{algorithmDescriptions[algorithm]?.timeComplexity.best}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average:</span>
                        <span className="font-mono">{algorithmDescriptions[algorithm]?.timeComplexity.average}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Worst:</span>
                        <span className="font-mono">{algorithmDescriptions[algorithm]?.timeComplexity.worst}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Properties</span>
                    <div className="mt-1 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Space:</span>
                        <span className="font-mono">{algorithmDescriptions[algorithm]?.spaceComplexity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Stable:</span>
                        <span>{algorithmDescriptions[algorithm]?.stable ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In-place:</span>
                        <span>{algorithmDescriptions[algorithm]?.inPlace ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="font-medium">Use Cases:</span>
                  <p className="mt-1 text-xs">{algorithmDescriptions[algorithm]?.useCases}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select an algorithm to view details.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="time" className="w-full">
        <div
          className="sticky top-0 z-10 bg-background py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 transform translate-y-4 opacity-0 animate-slide-in"
          style={{ animationDelay: '0.6s' }}
        >
          <TabsList className="flex flex-wrap justify-center gap-2 sm:grid sm:grid-cols-5 w-full max-w-full sm:max-w-4xl mx-auto">
            <TabsTrigger value="time" className="flex items-center gap-1 text-xs sm:text-sm py-2 px-3">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Execution Time</span>
              <span className="sm:hidden">Time</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-1 text-xs sm:text-sm py-2 px-3">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Memory Usage</span>
              <span className="sm:hidden">Memory</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-1 text-xs sm:text-sm py-2 px-3">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Comparison</span>
              <span className="sm:hidden">Compare</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-1 text-xs sm:text-sm py-2 px-3">
              <PieChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Additional Metrics</span>
              <span className="sm:hidden">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="flex items-center gap-1 text-xs sm:text-sm py-2 px-3">
              <LineChartIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Efficiency</span>
              <span className="sm:hidden">Efficiency</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="time" className="mt-6">
          <div className="opacity-0 animate-fade-in">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-xl sm:text-2xl">
                  <span>Execution Time Analysis</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 sm:w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">About Execution Time</h4>
                        <p className="text-sm">
                          Shows how execution time scales with input size. Steeper curves indicate worse scalability.
                        </p>
                        {['quick', 'floyd'].includes(algorithm) && (
                          <div className="flex items-center p-2 rounded-md bg-amber-100 dark:bg-amber-900">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            <p className="text-xs">
                              {algorithm === 'quick' ? 'Quick Sort may degrade to O(n²) in worst cases.' : 'Floyd-Warshall is O(V³), inefficient for large graphs.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
                <CardDescription>
                  Time complexity of {selectedAlgorithm?.name || 'selected algorithm'}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden" style={{ height: chartHeight }}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      time: { label: "Execution Time (ms)", color: "hsl(var(--chart-1))" },
                      "O(1)": { label: "O(1) - Constant", color: "hsl(var(--chart-2))" },
                      "O(log n)": { label: "O(log n) - Logarithmic", color: "hsl(var(--chart-3))" },
                      "O(n)": { label: "O(n) - Linear", color: "hsl(var(--chart-4))" },
                      "O(n log n)": { label: "O(n log n) - Linearithmic", color: "hsl(var(--chart-5))" },
                      "O(n²)": { label: "O(n²) - Quadratic", color: "hsl(var(--chart-6))" },
                      "O(n³)": { label: "O(n³) - Cubic", color: "hsl(var(--chart-7))" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "area" ? (
                        <AreaChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                          <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                          <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                          <Area type="monotone" dataKey="time" stroke="var(--color-time)" fill="var(--color-time)" fillOpacity={0.3} name="Execution Time (ms)" isAnimationActive={animateCharts} />
                          {showTheoretical && (
                            <>
                              <Area type="monotone" dataKey="O(1)" data={theoreticalData} stroke="var(--color-o-1)" fill="var(--color-o-1)" fillOpacity={0.1} strokeDasharray="5 5" name="O(1) - Constant" isAnimationActive={animateCharts} />
                              <Area type="monotone" dataKey="O(log n)" data={theoreticalData} stroke="var(--color-o-logn)" fill="var(--color-o-logn)" fillOpacity={0.1} strokeDasharray="5 5" name="O(log n) - Logarithmic" isAnimationActive={animateCharts} />
                              <Area type="monotone" dataKey="O(n)" data={theoreticalData} stroke="var(--color-o-n)" fill="var(--color-o-n)" fillOpacity={0.1} strokeDasharray="5 5" name="O(n) - Linear" isAnimationActive={animateCharts} />
                              <Area type="monotone" dataKey="O(n log n)" data={theoreticalData} stroke="var(--color-o-nlogn)" fill="var(--color-o-nlogn)" fillOpacity={0.1} strokeDasharray="5 5" name="O(n log n) - Linearithmic" isAnimationActive={animateCharts} />
                              <Area type="monotone" dataKey="O(n²)" data={theoreticalData} stroke="var(--color-o-n2)" fill="var(--color-o-n2)" fillOpacity={0.1} strokeDasharray="5 5" name="O(n²) - Quadratic" isAnimationActive={animateCharts} />
                              <Area type="monotone" dataKey="O(n³)" data={theoreticalData} stroke="var(--color-o-n3)" fill="var(--color-o-n3)" fillOpacity={0.1} strokeDasharray="5 5" name="O(n³) - Cubic" isAnimationActive={animateCharts} />
                            </>
                          )}
                        </AreaChart>
                      ) : chartType === "line" ? (
                        <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                          <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                          <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                          <Line type="monotone" dataKey="time" stroke="var(--color-time)" name="Execution Time (ms)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={animateCharts} />
                          {showTheoretical && (
                            <>
                              <Line type="monotone" dataKey="O(1)" data={theoreticalData} stroke="var(--color-o-1)" strokeDasharray="5 5" name="O(1) - Constant" isAnimationActive={animateCharts} />
                              <Line type="monotone" dataKey="O(log n)" data={theoreticalData} stroke="var(--color-o-logn)" strokeDasharray="5 5" name="O(log n) - Logarithmic" isAnimationActive={animateCharts} />
                              <Line type="monotone" dataKey="O(n)" data={theoreticalData} stroke="var(--color-o-n)" strokeDasharray="5 5" name="O(n) - Linear" isAnimationActive={animateCharts} />
                              <Line type="monotone" dataKey="O(n log n)" data={theoreticalData} stroke="var(--color-o-nlogn)" strokeDasharray="5 5" name="O(n log n) - Linearithmic" isAnimationActive={animateCharts} />
                              <Line type="monotone" dataKey="O(n²)" data={theoreticalData} stroke="var(--color-o-n2)" strokeDasharray="5 5" name="O(n²) - Quadratic" isAnimationActive={animateCharts} />
                              <Line type="monotone" dataKey="O(n³)" data={theoreticalData} stroke="var(--color-o-n3)" strokeDasharray="5 5" name="O(n³) - Cubic" isAnimationActive={animateCharts} />
                            </>
                          )}
                        </LineChart>
                      ) : (
                        <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                          <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                          <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="time" fill="var(--color-time)" name="Execution Time (ms)" isAnimationActive={animateCharts} />
                          {showTheoretical && (
                            <>
                              <Bar dataKey="O(1)" data={theoreticalData} fill="var(--color-o-1)" name="O(1) - Constant" isAnimationActive={animateCharts} />
                              <Bar dataKey="O(log n)" data={theoreticalData} fill="var(--color-o-logn)" name="O(log n) - Logarithmic" isAnimationActive={animateCharts} />
                              <Bar dataKey="O(n)" data={theoreticalData} fill="var(--color-o-n)" name="O(n) - Linear" isAnimationActive={animateCharts} />
                              <Bar dataKey="O(n log n)" data={theoreticalData} fill="var(--color-o-nlogn)" name="O(n log n) - Linearithmic" isAnimationActive={animateCharts} />
                              <Bar dataKey="O(n²)" data={theoreticalData} fill="var(--color-o-n2)" name="O(n²) - Quadratic" isAnimationActive={animateCharts} />
                              <Bar dataKey="O(n³)" data={theoreticalData} fill="var(--color-o-n3)" name="O(n³) - Cubic" isAnimationActive={animateCharts} />
                            </>
                          )}
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="memory" className="mt-6">
          <div className="opacity-0 animate-fade-in">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-xl sm:text-2xl">
                  <span>Memory Usage Analysis</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 sm:w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">About Memory Usage</h4>
                        <p className="text-sm">
                          Displays memory requirements as input size grows. Algorithms like Merge Sort and Floyd-Warshall use more memory.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
                <CardDescription>
                  Space complexity of {selectedAlgorithm?.name || 'selected algorithm'}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden" style={{ height: chartHeight }}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <ChartContainer
                    config={{ memory: { label: "Memory Usage (MB)", color: "hsl(var(--chart-2))" } }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "area" ? (
                        <AreaChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                          <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                          <YAxis label={{ value: "Memory (MB)", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                          <Area type="monotone" dataKey="memory" stroke="var(--color-memory)" fill="var(--color-memory)" fillOpacity={0.3} name="Memory Usage (MB)" isAnimationActive={animateCharts} />
                        </AreaChart>
                      ) : chartType === "line" ? (
                        <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                          <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                          <YAxis label={{ value: "Memory (MB)", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                          <Line type="monotone" dataKey="memory" stroke="var(--color-memory)" name="Memory Usage (MB)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} isAnimationActive={animateCharts} />
                        </LineChart>
                      ) : (
                        <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                          <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                          <YAxis label={{ value: "Memory (MB)", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="memory" fill="var(--color-memory)" name="Memory Usage (MB)" isAnimationActive={animateCharts} />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <div className="opacity-0 animate-fade-in">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-xl sm:text-2xl">
                  <span>Algorithm Comparison</span>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 sm:w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">About Comparison</h4>
                        <p className="text-sm">
                          Compares execution times across algorithms. Notice the efficiency of logarithmic and linear algorithms.
                        </p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </CardTitle>
                <CardDescription>Execution time comparison across algorithms</CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden" style={{ height: chartHeight + 100 }}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <ChartContainer
                    config={Object.fromEntries(algorithmOptions.map(opt => [
                      opt.id,
                      { label: opt.name, color: opt.color }
                    ]))}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }} barGap={2} barCategoryGap="10%">
                        <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                        <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                        <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={60} wrapperStyle={{ fontSize: 12, overflow: 'auto', maxHeight: '60px' }} />
                        {filteredAlgorithms.map((opt) => (
                          <Bar key={opt.id} dataKey={opt.id} fill={`var(--color-${opt.id})`} name={opt.name} isAnimationActive={animateCharts} />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="mt-6">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-fade-in"
          >
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Operations Count</CardTitle>
                <CardDescription>
                  Number of operations performed by {selectedAlgorithm?.name || 'selected algorithm'}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden" style={{ height: chartHeight }}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      operations: { label: "Operations", color: "hsl(var(--chart-3))" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                        <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} tick={{ fontSize: 12 }} />
                        <YAxis label={{ value: "Count", angle: -90, position: "insideLeft", offset: 10 }} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                        <Line type="monotone" dataKey="operations" stroke="var(--color-operations)" name="Operations" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive={animateCharts} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Performance Score</CardTitle>
                <CardDescription>
                  Relative performance ranking (higher is better)
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden" style={{ height: chartHeight }}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={performanceScores}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={chartHeight > 350 ? 120 : 80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name.slice(0, 15)}...: ${value}`}
                        isAnimationActive={animateCharts}
                      >
                        {performanceScores.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 12, overflow: 'auto', maxHeight: '36px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="mt-6">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 opacity-0 animate-fade-in"
          >
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Efficiency vs. Performance</CardTitle>
                <CardDescription>
                  Scatter plot of efficiency vs. execution time
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-hidden" style={{ height: chartHeight }}>
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                      <XAxis type="number" dataKey="size" name="Input Size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10, fontSize: 12 }} tick={{ fontSize: 12 }} />
                      <YAxis type="number" dataKey="efficiency" name="Efficiency" label={{ value: "Efficiency Score", angle: -90, position: "insideLeft", offset: 10, fontSize: 12 }} tick={{ fontSize: 12 }} />
                      <ZAxis type="number" dataKey="time" range={[50, 400]} name="Time (ms)" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12 }} />
                      <Scatter
                        name={selectedAlgorithm?.name || 'Selected Algorithm'}
                        data={performanceData}
                        fill={selectedAlgorithm?.color.replace("var(--", "").replace(")", "") || '#8884d8'}
                        isAnimationActive={animateCharts}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Advanced Metrics</CardTitle>
                <CardDescription>
                  Detailed analysis of algorithm characteristics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="time-complexity">
                    <AccordionTrigger className="text-sm sm:text-base">Time Complexity</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>
                          {['bubble', 'insertion', 'selection', 'floyd'].includes(algorithm) ? (
                            <>This algorithm has high time complexity, making it inefficient for large inputs.</>
                          ) : ['binary', 'kadane', 'slowfast', 'kmp', 'boyer'].includes(algorithm) ? (
                            <>This algorithm is highly efficient with low time complexity, ideal for large inputs.</>
                          ) : (
                            <>This algorithm has moderate time complexity, suitable for various applications.</>
                          )}
                        </p>
                        {['quick', 'floyd'].includes(algorithm) && (
                          <div className="flex items-center p-2 rounded-md bg-amber-100 dark:bg-amber-900">
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                            <p className="text-xs">
                              {algorithm === 'quick' ? 'May degrade to O(n²) with poor pivots.' : 'O(V³) complexity limits scalability.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="space-complexity">
                    <AccordionTrigger className="text-sm sm:text-base">Space Complexity</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>
                          {['merge', 'floyd', 'bfs', 'dfs', 'dijkstra'].includes(algorithm) ? (
                            <>Requires significant auxiliary space, impacting memory usage.</>
                          ) : (
                            <>Operates with minimal or constant extra space, highly memory-efficient.</>
                          )}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="stability">
                    <AccordionTrigger className="text-sm sm:text-base">Stability Analysis</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>
                          {algorithmDescriptions[algorithm]?.stable ? (
                            <>Stable algorithm, preserves relative order of equal elements.</>
                          ) : (
                            <>Not stable by default, may reorder equal elements.</>
                          )}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="recommendations">
                    <AccordionTrigger className="text-sm sm:text-base">Usage Recommendations</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        <p>{algorithmDescriptions[algorithm]?.useCases || 'Select an algorithm to view recommendations.'}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div
        className="opacity-0 animate-fade-in"
        style={{ animationDelay: '0.8s' }}
      >
        <Card className="bg-secondary/30 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl sm:text-2xl">Learning Resources</CardTitle>
            <CardDescription>Explore algorithms and complexity analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-background rounded-md border shadow-sm">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Interactive Tutorials
                </h3>
                <p className="text-sm text-muted-foreground">
                  Visualize algorithms with step-by-step animations.
                </p>
              </div>
              <div className="p-4 bg-background rounded-md border shadow-sm">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Complexity Theory
                </h3>
                <p className="text-sm text-muted-foreground">
                  Learn Big O notation and complexity analysis.
                </p>
              </div>
              <div className="p-4 bg-background rounded-md border shadow-sm">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Implementation Guides
                </h3>
                <p className="text-sm text-muted-foreground">
                  Practical coding examples for efficient algorithms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
