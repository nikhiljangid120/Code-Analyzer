"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { RefreshCw } from "lucide-react"

const algorithmOptions = [
  { id: "bubble", name: "Bubble Sort" },
  { id: "quick", name: "Quick Sort" },
  { id: "merge", name: "Merge Sort" },
  { id: "insertion", name: "Insertion Sort" },
  { id: "selection", name: "Selection Sort" },
]

// Simulated performance data
const generatePerformanceData = (algorithm: string, maxSize: number) => {
  const sizes = []
  for (let i = 10; i <= maxSize; i += 10) {
    sizes.push(i)
  }

  return sizes.map((size) => {
    let time = 0
    let memory = 0

    switch (algorithm) {
      case "bubble":
        time = size * size * 0.01 + Math.random() * 5
        memory = size * 0.5 + Math.random() * 2
        break
      case "quick":
        time = size * Math.log2(size) * 0.05 + Math.random() * 3
        memory = size * 0.8 + Math.log2(size) * 2 + Math.random() * 3
        break
      case "merge":
        time = size * Math.log2(size) * 0.06 + Math.random() * 4
        memory = size * 1.2 + Math.random() * 5
        break
      case "insertion":
        time = size * size * 0.008 + Math.random() * 2
        memory = size * 0.4 + Math.random() * 1
        break
      case "selection":
        time = size * size * 0.009 + Math.random() * 3
        memory = size * 0.3 + Math.random() * 1
        break
      default:
        time = size * Math.log2(size) * 0.05
        memory = size * 0.8
    }

    return {
      size,
      time: Math.max(0.1, time.toFixed(2)),
      memory: Math.max(0.1, memory.toFixed(2)),
    }
  })
}

// Simulated comparison data
const generateComparisonData = (maxSize: number) => {
  const sizes = [10, 50, 100, 200, 500, 1000]
  return sizes.map((size) => {
    return {
      size,
      bubble: (size * size * 0.01 + Math.random() * 5).toFixed(2),
      quick: (size * Math.log2(size) * 0.05 + Math.random() * 3).toFixed(2),
      merge: (size * Math.log2(size) * 0.06 + Math.random() * 4).toFixed(2),
      insertion: (size * size * 0.008 + Math.random() * 2).toFixed(2),
      selection: (size * size * 0.009 + Math.random() * 3).toFixed(2),
    }
  })
}

export default function PerformanceMetricsPage() {
  const [algorithm, setAlgorithm] = useState("quick")
  const [maxSize, setMaxSize] = useState(100)
  const [performanceData, setPerformanceData] = useState(() => generatePerformanceData("quick", 100))
  const [comparisonData, setComparisonData] = useState(() => generateComparisonData(1000))

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value)
    setPerformanceData(generatePerformanceData(value, maxSize))
  }

  const handleMaxSizeChange = (value: number[]) => {
    const newSize = value[0]
    setMaxSize(newSize)
    setPerformanceData(generatePerformanceData(algorithm, newSize))
  }

  const handleRefresh = () => {
    setPerformanceData(generatePerformanceData(algorithm, maxSize))
    setComparisonData(generateComparisonData(1000))
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Performance Metrics</h1>
        <p className="text-muted-foreground">Analyze and compare algorithm performance with different input sizes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Settings</CardTitle>
          <CardDescription>Configure the algorithm and input size for performance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Algorithm</label>
              <Select value={algorithm} onValueChange={handleAlgorithmChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Algorithm" />
                </SelectTrigger>
                <SelectContent>
                  {algorithmOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Input Size: {maxSize}</label>
              <Slider value={[maxSize]} min={10} max={1000} step={10} onValueChange={handleMaxSizeChange} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <Button onClick={handleRefresh} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="time" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="time">Execution Time</TabsTrigger>
          <TabsTrigger value="memory">Memory Usage</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="time" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Time Analysis</CardTitle>
              <CardDescription>
                Time complexity of {algorithmOptions.find((opt) => opt.id === algorithm)?.name} with different input
                sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  time: {
                    label: "Execution Time (ms)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} />
                    <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="time" stroke="var(--color-time)" name="Execution Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage Analysis</CardTitle>
              <CardDescription>
                Space complexity of {algorithmOptions.find((opt) => opt.id === algorithm)?.name} with different input
                sizes
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ChartContainer
                config={{
                  memory: {
                    label: "Memory Usage (MB)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} />
                    <YAxis label={{ value: "Memory (MB)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="memory" stroke="var(--color-memory)" name="Memory Usage (MB)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Comparison</CardTitle>
              <CardDescription>Execution time comparison of different sorting algorithms</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ChartContainer
                config={{
                  bubble: {
                    label: "Bubble Sort",
                    color: "hsl(var(--chart-1))",
                  },
                  quick: {
                    label: "Quick Sort",
                    color: "hsl(var(--chart-2))",
                  },
                  merge: {
                    label: "Merge Sort",
                    color: "hsl(var(--chart-3))",
                  },
                  insertion: {
                    label: "Insertion Sort",
                    color: "hsl(var(--chart-4))",
                  },
                  selection: {
                    label: "Selection Sort",
                    color: "hsl(var(--chart-5))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="size" label={{ value: "Input Size", position: "insideBottomRight", offset: -10 }} />
                    <YAxis label={{ value: "Time (ms)", angle: -90, position: "insideLeft" }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="bubble" fill="var(--color-bubble)" name="Bubble Sort" />
                    <Bar dataKey="quick" fill="var(--color-quick)" name="Quick Sort" />
                    <Bar dataKey="merge" fill="var(--color-merge)" name="Merge Sort" />
                    <Bar dataKey="insertion" fill="var(--color-insertion)" name="Insertion Sort" />
                    <Bar dataKey="selection" fill="var(--color-selection)" name="Selection Sort" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

