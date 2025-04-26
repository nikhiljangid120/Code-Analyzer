"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface VisualizerProps {
  algorithm: string
  data: number[]
  width?: number
  height?: number
  colorMode?: "default" | "rainbow" | "heat"
}

interface BarData {
  value: number
  state: "default" | "comparing" | "sorted" | "pivot" | "selected" | "current"
  originalIndex?: number
}

export default function AlgorithmVisualizer({
  algorithm,
  data,
  width = 800,
  height = 400,
  colorMode = "default",
}: VisualizerProps) {
  const [barData, setBarData] = useState<BarData[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<BarData[][]>([])
  const [totalSteps, setTotalSteps] = useState(0)
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)
  const animationRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)

  // Initialize the visualization
  useEffect(() => {
    const initialData = data.map((value, index) => ({
      value,
      state: "default" as const,
      originalIndex: index,
    }))
    setBarData(initialData)

    // Generate steps based on the selected algorithm
    const { steps: generatedSteps, comparisons, swaps } = generateSteps(initialData, algorithm)
    setSteps(generatedSteps)
    setTotalSteps(generatedSteps.length)
    setComparisons(comparisons)
    setSwaps(swaps)
    setCurrentStep(0)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [data, algorithm])

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const animate = (timestamp: number) => {
        if (!lastStepTimeRef.current) {
          lastStepTimeRef.current = timestamp
        }

        const elapsed = timestamp - lastStepTimeRef.current
        const stepDuration = 1000 - speed * 9 // Map 1-100 to 910-10ms

        if (elapsed > stepDuration) {
          if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1)
            lastStepTimeRef.current = timestamp
          } else {
            setIsPlaying(false)
            return
          }
        }

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, currentStep, steps, speed])

  // Update bar data when current step changes
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      setBarData(steps[currentStep])
    }
  }, [currentStep, steps])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    lastStepTimeRef.current = 0
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    lastStepTimeRef.current = 0
  }

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSpeedChange = (value: number[]) => {
    setSpeed(value[0])
  }

  // Calculate bar dimensions
  const barWidth = Math.floor((width - 100) / barData.length)
  const maxValue = Math.max(...data)
  const scale = (height - 80) / maxValue

  // Get color based on state and color mode
  const getBarColor = (bar: BarData, index: number) => {
    if (colorMode === "rainbow" && bar.state === "default") {
      // Rainbow gradient for default state in rainbow mode
      const hue = (bar.originalIndex || index) * (360 / data.length)
      return `hsl(${hue}, 80%, 60%)`
    } else if (colorMode === "heat" && bar.state === "default") {
      // Heat map (red to blue) based on value
      const percentage = bar.value / maxValue
      const hue = percentage * 240 // 0 (red) to 240 (blue)
      return `hsl(${hue}, 80%, 60%)`
    } else {
      // Default colors based on state
      switch (bar.state) {
        case "comparing":
          return "bg-yellow-500"
        case "sorted":
          return "bg-green-500"
        case "pivot":
          return "bg-red-500"
        case "selected":
          return "bg-purple-500"
        case "current":
          return "bg-blue-500"
        default:
          return "bg-primary"
      }
    }
  }

  return (
    <Card className="border border-border/40 shadow-lg overflow-hidden glass-effect">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative bg-secondary/30 rounded-md" style={{ width: `${width}px`, height: `${height}px` }}>
            <div className="absolute inset-0 flex items-end justify-center">
              <AnimatePresence initial={false}>
                {barData.map((bar, index) => {
                  const barHeight = Math.max(bar.value * scale, 2)
                  const barColor = getBarColor(bar, index)

                  return (
                    <motion.div
                      key={bar.originalIndex !== undefined ? bar.originalIndex : index}
                      className={cn(
                        "mx-0.5 rounded-t-sm",
                        typeof barColor === "string" && barColor.startsWith("bg-") ? barColor : "",
                      )}
                      style={{
                        height: `${barHeight}px`,
                        width: `${barWidth}px`,
                        backgroundColor: !barColor.startsWith("bg-") ? barColor : undefined,
                        boxShadow: bar.state !== "default" ? "0 0 8px rgba(255, 255, 255, 0.5)" : "none",
                        zIndex: bar.state !== "default" ? 10 : 1,
                      }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        height: `${barHeight}px`,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.3,
                      }}
                      aria-label={`Bar ${index + 1} with value ${bar.value}`}
                    />
                  )
                })}
              </AnimatePresence>
            </div>

            {/* Step information overlay */}
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span>Step:</span>
                  <span className="font-medium">
                    {currentStep + 1} / {totalSteps}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Comparisons:</span>
                  <span className="font-medium">{comparisons}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Swaps:</span>
                  <span className="font-medium">{swaps}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={reset}
                  aria-label="Reset"
                  className="hover:bg-secondary/50"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stepBackward}
                  disabled={currentStep === 0}
                  aria-label="Step backward"
                  className="hover:bg-secondary/50"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  variant={isPlaying ? "default" : "outline"}
                  size="icon"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className={cn(
                    "transition-all duration-300",
                    isPlaying ? "bg-primary hover:bg-primary/90" : "hover:bg-secondary/50",
                  )}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={stepForward}
                  disabled={currentStep === steps.length - 1}
                  aria-label="Step forward"
                  className="hover:bg-secondary/50"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <Slider value={[speed]} min={1} max={100} step={1} onValueChange={handleSpeedChange} className="w-32" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                  <span>Default</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Sorted</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Pivot</span>
                </div>
              </div>

              <div>Progress: {Math.round((currentStep / (totalSteps - 1)) * 100) || 0}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to generate visualization steps
function generateSteps(
  initialData: BarData[],
  algorithm: string,
): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const data = [...initialData]
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const comparisons = 0
  const swaps = 0

  switch (algorithm) {
    case "bubble":
      return generateBubbleSortSteps(data)
    case "quick":
      return generateQuickSortSteps(data)
    case "merge":
      return generateMergeSortSteps(data)
    case "heap":
      return generateHeapSortSteps(data)
    case "insertion":
      return generateInsertionSortSteps(data)
    case "selection":
      return generateSelectionSortSteps(data)
    case "radix":
      return generateRadixSortSteps(data)
    case "shell":
      return generateShellSortSteps(data)
    default:
      return { steps: [data], comparisons: 0, swaps: 0 }
  }
}

function generateBubbleSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Mark elements being compared
      arr[j].state = "comparing"
      arr[j + 1].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      comparisons++

      if (arr[j].value > arr[j + 1].value) {
        // Swap elements
        const temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
        steps.push(JSON.parse(JSON.stringify(arr)))
        swaps++
      }

      // Reset state
      arr[j].state = "default"
      arr[j + 1].state = "default"
    }

    // Mark sorted element
    arr[n - i - 1].state = "sorted"
    steps.push(JSON.parse(JSON.stringify(arr)))
  }

  return { steps, comparisons, swaps }
}

function generateQuickSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  let comparisons = 0
  let swaps = 0

  function quickSort(arr: BarData[], low: number, high: number) {
    if (low < high) {
      const pivotIndex = partition(arr, low, high)
      quickSort(arr, low, pivotIndex - 1)
      quickSort(arr, pivotIndex + 1, high)
    }
  }

  function partition(arr: BarData[], low: number, high: number): number {
    // Mark pivot
    arr[high].state = "pivot"
    steps.push(JSON.parse(JSON.stringify(arr)))

    const pivot = arr[high].value
    let i = low - 1

    for (let j = low; j < high; j++) {
      // Mark current element
      arr[j].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      comparisons++

      if (arr[j].value <= pivot) {
        i++

        // Swap elements
        const temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp
        swaps++

        steps.push(JSON.parse(JSON.stringify(arr)))
      }

      // Reset state
      arr[j].state = "default"
    }

    // Swap pivot to its final position
    const temp = arr[i + 1]
    arr[i + 1] = arr[high]
    arr[high] = temp
    swaps++

    // Mark pivot in its final position
    arr[i + 1].state = "sorted"
    steps.push(JSON.parse(JSON.stringify(arr)))

    // Reset states
    for (let k = 0; k < arr.length; k++) {
      if (arr[k].state !== "sorted") {
        arr[k].state = "default"
      }
    }

    return i + 1
  }

  quickSort(arr, 0, arr.length - 1)

  // Mark all as sorted in the final step
  for (let i = 0; i < arr.length; i++) {
    arr[i].state = "sorted"
  }
  steps.push(JSON.parse(JSON.stringify(arr)))

  return { steps, comparisons, swaps }
}

function generateMergeSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  let comparisons = 0
  let swaps = 0

  function mergeSort(arr: BarData[], start: number, end: number) {
    if (start < end) {
      const mid = Math.floor((start + end) / 2)

      mergeSort(arr, start, mid)
      mergeSort(arr, mid + 1, end)

      merge(arr, start, mid, end)
    }
  }

  function merge(arr: BarData[], start: number, mid: number, end: number) {
    const leftSize = mid - start + 1
    const rightSize = end - mid

    const leftArr: BarData[] = []
    const rightArr: BarData[] = []

    // Copy data to temp arrays
    for (let i = 0; i < leftSize; i++) {
      leftArr[i] = JSON.parse(JSON.stringify(arr[start + i]))
      arr[start + i].state = "comparing"
    }

    for (let j = 0; j < rightSize; j++) {
      rightArr[j] = JSON.parse(JSON.stringify(arr[mid + 1 + j]))
      arr[mid + 1 + j].state = "comparing"
    }

    steps.push(JSON.parse(JSON.stringify(arr)))

    // Merge the temp arrays back
    let i = 0
    let j = 0
    let k = start

    while (i < leftSize && j < rightSize) {
      comparisons++

      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = JSON.parse(JSON.stringify(leftArr[i]))
        i++
      } else {
        arr[k] = JSON.parse(JSON.stringify(rightArr[j]))
        j++
        swaps++
      }

      arr[k].state = "sorted"
      steps.push(JSON.parse(JSON.stringify(arr)))
      k++
    }

    // Copy remaining elements
    while (i < leftSize) {
      arr[k] = JSON.parse(JSON.stringify(leftArr[i]))
      arr[k].state = "sorted"
      steps.push(JSON.parse(JSON.stringify(arr)))
      i++
      k++
    }

    while (j < rightSize) {
      arr[k] = JSON.parse(JSON.stringify(rightArr[j]))
      arr[k].state = "sorted"
      steps.push(JSON.parse(JSON.stringify(arr)))
      j++
      k++
    }
  }

  mergeSort(arr, 0, arr.length - 1)

  return { steps, comparisons, swaps }
}

function generateHeapSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  // Build heap (rearrange array)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i)
  }

  // One by one extract an element from heap
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    arr[0].state = "comparing"
    arr[i].state = "comparing"
    steps.push(JSON.parse(JSON.stringify(arr)))

    // Swap
    const temp = arr[0]
    arr[0] = arr[i]
    arr[i] = temp
    swaps++

    arr[0].state = "default"
    arr[i].state = "sorted"
    steps.push(JSON.parse(JSON.stringify(arr)))

    // Call max heapify on the reduced heap
    heapify(arr, i, 0)
  }

  // Mark the first element as sorted
  if (arr.length > 0) {
    arr[0].state = "sorted"
    steps.push(JSON.parse(JSON.stringify(arr)))
  }

  function heapify(arr: BarData[], n: number, i: number) {
    let largest = i // Initialize largest as root
    const left = 2 * i + 1
    const right = 2 * i + 2

    // Mark the current node
    arr[i].state = "current"
    steps.push(JSON.parse(JSON.stringify(arr)))

    // If left child is larger than root
    if (left < n) {
      arr[left].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      comparisons++

      if (arr[left].value > arr[largest].value) {
        if (largest !== i) {
          arr[largest].state = "default"
        }
        largest = left
        arr[largest].state = "selected"
        steps.push(JSON.parse(JSON.stringify(arr)))
      } else {
        arr[left].state = "default"
        steps.push(JSON.parse(JSON.stringify(arr)))
      }
    }

    // If right child is larger than largest so far
    if (right < n) {
      arr[right].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      comparisons++

      if (arr[right].value > arr[largest].value) {
        if (largest !== i) {
          arr[largest].state = "default"
        }
        largest = right
        arr[largest].state = "selected"
        steps.push(JSON.parse(JSON.stringify(arr)))
      } else {
        arr[right].state = "default"
        steps.push(JSON.parse(JSON.stringify(arr)))
      }
    }

    // If largest is not root
    if (largest !== i) {
      arr[i].state = "comparing"
      arr[largest].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))

      // Swap
      const temp = arr[i]
      arr[i] = arr[largest]
      arr[largest] = temp
      swaps++

      arr[i].state = "default"
      arr[largest].state = "default"
      steps.push(JSON.parse(JSON.stringify(arr)))

      // Recursively heapify the affected sub-tree
      heapify(arr, n, largest)
    } else {
      arr[i].state = "default"
      steps.push(JSON.parse(JSON.stringify(arr)))
    }
  }

  return { steps, comparisons, swaps }
}

function generateInsertionSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  // Mark first element as sorted
  arr[0].state = "sorted"
  steps.push(JSON.parse(JSON.stringify(arr)))

  for (let i = 1; i < n; i++) {
    // Mark current element
    arr[i].state = "current"
    steps.push(JSON.parse(JSON.stringify(arr)))

    const key = arr[i].value
    const keyObj = JSON.parse(JSON.stringify(arr[i]))
    let j = i - 1

    // Compare key with each element on the left until smaller element is found
    while (j >= 0) {
      arr[j].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      comparisons++

      if (arr[j].value > key) {
        // Shift elements
        arr[j + 1] = JSON.parse(JSON.stringify(arr[j]))
        arr[j + 1].state = "default"
        steps.push(JSON.parse(JSON.stringify(arr)))
        swaps++
        j--
      } else {
        arr[j].state = "sorted"
        steps.push(JSON.parse(JSON.stringify(arr)))
        break
      }

      arr[j + 1].state = "sorted"
      steps.push(JSON.parse(JSON.stringify(arr)))
    }

    // Place key at correct position
    if (j + 1 !== i) {
      arr[j + 1] = keyObj
      arr[j + 1].state = "sorted"
      steps.push(JSON.parse(JSON.stringify(arr)))
    } else {
      arr[i].state = "sorted"
      steps.push(JSON.parse(JSON.stringify(arr)))
    }
  }

  return { steps, comparisons, swaps }
}

function generateSelectionSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  for (let i = 0; i < n - 1; i++) {
    // Mark current position
    arr[i].state = "current"
    steps.push(JSON.parse(JSON.stringify(arr)))

    let minIndex = i

    // Find the minimum element in unsorted array
    for (let j = i + 1; j < n; j++) {
      arr[j].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      comparisons++

      if (arr[j].value < arr[minIndex].value) {
        // Reset previous min
        if (minIndex !== i) {
          arr[minIndex].state = "default"
        }

        minIndex = j
        arr[minIndex].state = "selected"
        steps.push(JSON.parse(JSON.stringify(arr)))
      } else {
        arr[j].state = "default"
        steps.push(JSON.parse(JSON.stringify(arr)))
      }
    }

    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      arr[i].state = "comparing"
      arr[minIndex].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))

      const temp = arr[i]
      arr[i] = arr[minIndex]
      arr[minIndex] = temp
      swaps++

      arr[minIndex].state = "default"
    }

    // Mark current position as sorted
    arr[i].state = "sorted"
    steps.push(JSON.parse(JSON.stringify(arr)))
  }

  // Mark the last element as sorted
  if (arr.length > 0) {
    arr[n - 1].state = "sorted"
    steps.push(JSON.parse(JSON.stringify(arr)))
  }

  return { steps, comparisons, swaps }
}

function generateRadixSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  const comparisons = 0
  let swaps = 0

  // Find the maximum number to know number of digits
  let max = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].value > max) {
      max = arr[i].value
    }
  }

  // Do counting sort for every digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output: BarData[] = new Array(arr.length).fill(null)
    const count: number[] = new Array(10).fill(0)

    // Store count of occurrences in count[]
    for (let i = 0; i < arr.length; i++) {
      const digit = Math.floor(arr[i].value / exp) % 10
      count[digit]++

      // Mark current element
      arr[i].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      arr[i].state = "default"
    }

    // Change count[i] so that count[i] now contains actual position of this digit in output[]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1]
    }

    // Build the output array
    for (let i = arr.length - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i].value / exp) % 10

      arr[i].state = "selected"
      steps.push(JSON.parse(JSON.stringify(arr)))

      output[count[digit] - 1] = JSON.parse(JSON.stringify(arr[i]))
      output[count[digit] - 1].state = "default"
      count[digit]--

      arr[i].state = "default"
      swaps++
    }

    // Copy the output array to arr[], so that arr[] now contains sorted numbers according to current digit
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i]
      arr[i].state = "comparing"
      steps.push(JSON.parse(JSON.stringify(arr)))
      arr[i].state = "default"
    }
  }

  // Mark all elements as sorted in the final step
  for (let i = 0; i < arr.length; i++) {
    arr[i].state = "sorted"
  }
  steps.push(JSON.parse(JSON.stringify(arr)))

  return { steps, comparisons, swaps }
}

function generateShellSortSteps(data: BarData[]): {
  steps: BarData[][]
  comparisons: number
  swaps: number
} {
  const steps: BarData[][] = [JSON.parse(JSON.stringify(data))]
  const arr = JSON.parse(JSON.stringify(data))
  const n = arr.length
  let comparisons = 0
  let swaps = 0

  // Start with a big gap, then reduce the gap
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Do a gapped insertion sort for this gap size
    for (let i = gap; i < n; i++) {
      // Mark current element
      arr[i].state = "current"
      steps.push(JSON.parse(JSON.stringify(arr)))

      // Add arr[i] to the elements that have been gap sorted
      const temp = JSON.parse(JSON.stringify(arr[i]))
      let j

      // Shift earlier gap-sorted elements up until the correct location for arr[i] is found
      for (j = i; j >= gap; j -= gap) {
        arr[j - gap].state = "comparing"
        steps.push(JSON.parse(JSON.stringify(arr)))
        comparisons++

        if (arr[j - gap].value > temp.value) {
          arr[j] = JSON.parse(JSON.stringify(arr[j - gap]))
          steps.push(JSON.parse(JSON.stringify(arr)))
          swaps++

          arr[j - gap].state = "default"
        } else {
          arr[j - gap].state = "default"
          break
        }
      }

      // Put temp in its correct location
      arr[j] = temp
      arr[j].state = "selected"
      steps.push(JSON.parse(JSON.stringify(arr)))
      arr[j].state = "default"
    }
  }

  // Mark all elements as sorted in the final step
  for (let i = 0; i < arr.length; i++) {
    arr[i].state = "sorted"
  }
  steps.push(JSON.parse(JSON.stringify(arr)))

  return { steps, comparisons, swaps }
}
