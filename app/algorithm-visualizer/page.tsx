"use client"

import type React from "react"
 
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import AlgorithmVisualizer from "@/components/algorithm-visualizer"
import DataStructureVisualizer from "@/components/data-structure-visualizer"
import { getAlgorithmExplanation, type AlgorithmExplanationResult } from "@/lib/gemini-service"
import { RefreshCw, Play, Sparkles, Loader2, Info, BarChart2, Database, Box } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const sortingAlgorithmOptions = [
  { id: "bubble", name: "Bubble Sort", complexity: "O(n²)" },
  { id: "insertion", name: "Insertion Sort", complexity: "O(n²)" },
  { id: "selection", name: "Selection Sort", complexity: "O(n²)" },
  { id: "merge", name: "Merge Sort", complexity: "O(n log n)" },
  { id: "quick", name: "Quick Sort", complexity: "O(n log n)" },
  { id: "heap", name: "Heap Sort", complexity: "O(n log n)" },
  { id: "radix", name: "Radix Sort", complexity: "O(nk)" },
  { id: "shell", name: "Shell Sort", complexity: "O(n log² n)" },
]

const dataStructureOptions = [
  { id: "array", name: "Array" },
  { id: "linkedList", name: "Linked List" },
  { id: "stack", name: "Stack" },
  { id: "queue", name: "Queue" },
  { id: "tree", name: "Binary Tree" },
  { id: "graph", name: "Graph" },
  { id: "heap", name: "Heap" },
  { id: "hashTable", name: "Hash Table" },
]

const colorModeOptions = [
  { id: "default", name: "Default" },
  { id: "rainbow", name: "Rainbow" },
  { id: "heat", name: "Heat Map" },
]

export default function AlgorithmVisualizerPage() {
  const [algorithm, setAlgorithm] = useState("quick")
  const [dataStructure, setDataStructure] = useState("array")
  const [arraySize, setArraySize] = useState(30)
  const [data, setData] = useState<number[]>(() => generateRandomArray(30))
  const [customInput, setCustomInput] = useState("")
  const [colorMode, setColorMode] = useState<"default" | "rainbow" | "heat">("default")
  const [showExplanation, setShowExplanation] = useState(false)
  const [algorithmExplanation, setAlgorithmExplanation] = useState<AlgorithmExplanationResult | null>(null)
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false)
  const [is3D, setIs3D] = useState(false)
  const [sortingIn3D, setSortingIn3D] = useState(false)
  const [visualizerHeight, setVisualizerHeight] = useState(400)

  // Adjust height based on 3D mode to ensure proper rendering
  useEffect(() => {
    if (is3D || sortingIn3D) {
      setVisualizerHeight(500); // Increase height for 3D visualization
    } else {
      setVisualizerHeight(400);
    }
  }, [is3D, sortingIn3D]);

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value)
    setAlgorithmExplanation(null)
  }

  const handleDataStructureChange = (value: string) => {
    setDataStructure(value)
  }

  const handleArraySizeChange = (value: number[]) => {
    const newSize = value[0]
    setArraySize(newSize)
    setData(generateRandomArray(newSize))
  }

  const handleRandomize = () => {
    setData(generateRandomArray(arraySize))
  }

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value)
  }

  const handleCustomInputSubmit = () => {
    try {
      // Parse the input as a comma-separated list of numbers
      const parsedData = customInput
        .split(",")
        .map((item) => Number.parseInt(item.trim(), 10))
        .filter((num) => !isNaN(num))

      if (parsedData.length > 0) {
        setData(parsedData)
        setArraySize(parsedData.length)
      } else {
        toast({
          title: "Invalid input",
          description: "Please enter valid comma-separated numbers",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error parsing custom input:", error)
      toast({
        title: "Invalid input",
        description: "Please enter valid comma-separated numbers",
        variant: "destructive",
      })
    }
  }

  const handleColorModeChange = (value: string) => {
    setColorMode(value as "default" | "rainbow" | "heat")
  }

  const handleToggleExplanation = async () => {
    setShowExplanation(!showExplanation)

    if (!algorithmExplanation && !isLoadingExplanation) {
      setIsLoadingExplanation(true)
      try {
        const selectedAlgorithm = sortingAlgorithmOptions.find((opt) => opt.id === algorithm)
        if (selectedAlgorithm) {
          const explanation = await getAlgorithmExplanation(selectedAlgorithm.name)
          setAlgorithmExplanation(explanation)
        }
      } catch (error) {
        console.error("Error fetching algorithm explanation:", error)
        toast({
          title: "Failed to load explanation",
          description: "There was an error loading the algorithm explanation",
          variant: "destructive",
        })
      } finally {
        setIsLoadingExplanation(false)
      }
    }
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
          <span className="text-primary glow-text">Interactive</span> Algorithm Visualizer
        </h1>
        <p className="text-muted-foreground text-lg">
          Visualize sorting algorithms and data structures with stunning animations and detailed explanations.
        </p>
      </motion.div>

      <Tabs defaultValue="sorting" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
          <TabsTrigger value="sorting" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Sorting Algorithms</span>
          </TabsTrigger>
          <TabsTrigger value="dataStructures" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Data Structures</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sorting" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Sorting Algorithm Controls
                    </CardTitle>
                    <CardDescription>Configure the algorithm and input data for visualization</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="sorting-3d-mode" checked={sortingIn3D} onCheckedChange={setSortingIn3D} />
                      <Label htmlFor="sorting-3d-mode" className="flex items-center gap-1">
                        <Box className="h-4 w-4" />
                        3D View
                      </Label>
                    </div>
                    <Button
                      variant={showExplanation ? "default" : "outline"}
                      size="sm"
                      onClick={handleToggleExplanation}
                      className="flex items-center gap-2"
                      disabled={isLoadingExplanation}
                    >
                      {isLoadingExplanation ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Info className="h-4 w-4" />
                          {showExplanation ? "Hide" : "Show"} Explanation
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label>Algorithm</Label>
                    <Select value={algorithm} onValueChange={handleAlgorithmChange}>
                      <SelectTrigger className="bg-background/60">
                        <SelectValue placeholder="Select Algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortingAlgorithmOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{option.name}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {option.complexity}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Array Size: {arraySize}</Label>
                    <Slider value={[arraySize]} min={5} max={100} step={1} onValueChange={handleArraySizeChange} />
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Input</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="e.g., 5, 3, 8, 1, 2"
                        value={customInput}
                        onChange={handleCustomInputChange}
                        className="bg-background/60"
                      />
                      <Button variant="outline" size="icon" onClick={handleCustomInputSubmit}>
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Visualization Style</Label>
                      <Select value={colorMode} onValueChange={handleColorModeChange}>
                        <SelectTrigger className="w-[140px] bg-background/60">
                          <SelectValue placeholder="Color Mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorModeOptions.map((option) => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={handleRandomize} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Randomize Array
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={cn("space-y-4", showExplanation ? "lg:col-span-1" : "lg:col-span-2")}
            >
              <AlgorithmVisualizer
                algorithm={algorithm}
                data={data}
                width={showExplanation ? 500 : 800}
                height={visualizerHeight}
                colorMode={colorMode}
                is3D={sortingIn3D}
              />
            </motion.div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-4"
              >
                <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect h-[400px] overflow-y-auto">
                  <CardHeader className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/40">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      {algorithmExplanation?.name || sortingAlgorithmOptions.find((opt) => opt.id === algorithm)?.name}{" "}
                      Explanation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-2">
                    {isLoadingExplanation ? (
                      <div className="flex items-center justify-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : algorithmExplanation ? (
                      <>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Description</h3>
                          <p className="text-sm text-muted-foreground">{algorithmExplanation.description}</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Time Complexity</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <div className="bg-secondary/30 p-3 rounded-md">
                              <p className="text-xs font-medium">Best Case</p>
                              <p className="text-sm">{algorithmExplanation.timeComplexity.best}</p>
                            </div>
                            <div className="bg-secondary/30 p-3 rounded-md">
                              <p className="text-xs font-medium">Average Case</p>
                              <p className="text-sm">{algorithmExplanation.timeComplexity.average}</p>
                            </div>
                            <div className="bg-secondary/30 p-3 rounded-md">
                              <p className="text-xs font-medium">Worst Case</p>
                              <p className="text-sm">{algorithmExplanation.timeComplexity.worst}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Space Complexity</h3>
                          <p className="text-sm text-muted-foreground">{algorithmExplanation.spaceComplexity}</p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Pseudocode</h3>
                          <pre className="p-3 bg-secondary/50 rounded-md overflow-x-auto text-xs">
                            <code>{algorithmExplanation.pseudocode}</code>
                          </pre>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Advantages</h3>
                            <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                              {algorithmExplanation.advantages.map((advantage, index) => (
                                <li key={index}>{advantage}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Disadvantages</h3>
                            <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                              {algorithmExplanation.disadvantages.map((disadvantage, index) => (
                                <li key={index}>{disadvantage}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">Use Cases</h3>
                          <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                            {algorithmExplanation.useCases.map((useCase, index) => (
                              <li key={index}>{useCase}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-center">
                        <Info className="h-12 w-12 text-primary mb-4" />
                        <p className="text-muted-foreground">
                          Click "Show Explanation" to get a detailed explanation of the selected algorithm.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dataStructures" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect mb-6">
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Data Structure Visualization
                    </CardTitle>
                    <CardDescription>Explore and interact with different data structures</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="3d-mode" checked={is3D} onCheckedChange={setIs3D} />
                    <Label htmlFor="3d-mode" className="flex items-center gap-1">
                      <Box className="h-4 w-4" />
                      3D Visualization
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Data Structure</Label>
                    <Select value={dataStructure} onValueChange={handleDataStructureChange}>
                      <SelectTrigger className="bg-background/60">
                        <SelectValue placeholder="Select Data Structure" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataStructureOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Visualization Options</Label>
                    <Select value={colorMode} onValueChange={handleColorModeChange}>
                      <SelectTrigger className="bg-background/60">
                        <SelectValue placeholder="Color Theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorModeOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Interactive Controls</Label>
                    <Button onClick={handleRandomize} className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Randomize Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DataStructureVisualizer 
              dataStructure={dataStructure} 
              data={data}
              is3D={is3D} 
              colorMode={colorMode}
              height={visualizerHeight}
            />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to generate a random array
function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
}
