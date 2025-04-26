"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash, RefreshCw, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere, Line } from "@react-three/drei"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Node {
  id: string
  value: number
  left?: string
  right?: string
}

interface GraphNode {
  id: string
  value: number
  edges: string[]
  position?: [number, number, number]
}

interface LinkedListNode {
  id: string
  value: number
  next?: string
}

interface StackNode {
  id: string
  value: number
}

interface QueueNode {
  id: string
  value: number
}

interface HeapNode {
  id: string
  value: number
  position?: [number, number, number]
}

interface HashTableEntry {
  key: string
  value: number
  index: number
}

type DataStructure = "array" | "tree" | "linkedList" | "graph" | "stack" | "queue" | "heap" | "hashTable"

interface DataStructureVisualizerProps {
  dataStructure: DataStructure
  is3D?: boolean
  colorMode?: "default" | "rainbow" | "heat"
  height?: number
}

export default function DataStructureVisualizer({
  dataStructure,
  is3D = false,
  colorMode = "default",
  height = 400,
}: DataStructureVisualizerProps) {
  const [arrayData, setArrayData] = useState<number[]>([10, 20, 30, 40, 50])
  const [treeData, setTreeData] = useState<Node[]>([
    { id: "1", value: 50 },
    { id: "2", value: 30, left: "4", right: "5" },
    { id: "3", value: 70, left: "6", right: "7" },
    { id: "4", value: 20 },
    { id: "5", value: 40 },
    { id: "6", value: 60 },
    { id: "7", value: 80 },
  ])
  const [linkedListData, setLinkedListData] = useState<LinkedListNode[]>([
    { id: "1", value: 10, next: "2" },
    { id: "2", value: 20, next: "3" },
    { id: "3", value: 30, next: "4" },
    { id: "4", value: 40, next: "5" },
    { id: "5", value: 50 },
  ])
  const [graphData, setGraphData] = useState<GraphNode[]>([
    { id: "1", value: 1, edges: ["2", "3"], position: [0, 0, 0] },
    { id: "2", value: 2, edges: ["1", "4", "5"], position: [2, 1, 0] },
    { id: "3", value: 3, edges: ["1", "5"], position: [-2, 1, 0] },
    { id: "4", value: 4, edges: ["2"], position: [3, -1, 0] },
    { id: "5", value: 5, edges: ["2", "3"], position: [-1, -2, 0] },
  ])
  const [stackData, setStackData] = useState<StackNode[]>([
    { id: "1", value: 10 },
    { id: "2", value: 20 },
    { id: "3", value: 30 },
    { id: "4", value: 40 },
  ])
  const [queueData, setQueueData] = useState<QueueNode[]>([
    { id: "1", value: 10 },
    { id: "2", value: 20 },
    { id: "3", value: 30 },
    { id: "4", value: 40 },
  ])
  const [heapData, setHeapData] = useState<HeapNode[]>([
    { id: "1", value: 100, position: [0, 3, 0] },
    { id: "2", value: 80, position: [-2, 1.5, 0] },
    { id: "3", value: 70, position: [2, 1.5, 0] },
    { id: "4", value: 50, position: [-3, 0, 0] },
    { id: "5", value: 60, position: [-1, 0, 0] },
    { id: "6", value: 30, position: [1, 0, 0] },
    { id: "7", value: 40, position: [3, 0, 0] },
  ])
  const [hashTableData, setHashTableData] = useState<HashTableEntry[]>([
    { key: "apple", value: 10, index: 0 },
    { key: "banana", value: 20, index: 1 },
    { key: "orange", value: 30, index: 2 },
    { key: "grape", value: 40, index: 4 },
    { key: "kiwi", value: 50, index: 7 },
  ])

  const [newValue, setNewValue] = useState("")
  const [newKey, setNewKey] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState<{ found: boolean; index?: number; id?: string }>({ found: false })
  const [activeOperation, setActiveOperation] = useState<"insert" | "delete" | "search" | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Handle window resize for responsive canvas
  useEffect(() => {
    const handleResize = () => {
      // Trigger re-render or adjust canvas size if needed
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Color logic based on colorMode
  const getNodeColor = (isHighlighted: boolean, index?: number, totalLength?: number) => {
    if (isHighlighted) return "lightgreen"
    if (colorMode === "rainbow" && index !== undefined && totalLength !== undefined) {
      const hue = (index * 360 / totalLength) % 360
      return `hsl(${hue}, 70%, 60%)`
    }
    if (colorMode === "heat" && index !== undefined && totalLength !== undefined) {
      const intensity = index / totalLength
      return `hsl(0, 100%, ${50 + intensity * 50}%)`
    }
    return {
      array: "orange",
      tree: "lightgreen",
      linkedList: "lightgreen",
      graph: "skyblue",
      stack: "lightblue",
      queue: "lightcoral",
      heap: "lightyellow",
      hashTable: "lavender",
    }[dataStructure]
  }

  const handleAddValue = () => {
    const value = Number.parseInt(newValue)
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setActiveOperation("insert")
    setAnimationStep(0)
    setIsAnimating(true)

    const animationSteps = 5
    let step = 0

    const animationInterval = setInterval(() => {
      setAnimationStep(step)
      step++

      if (step > animationSteps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        performInsert(value)
      }
    }, 200)
  }

  const performInsert = (value: number) => {
    switch (dataStructure) {
      case "array":
        setArrayData([...arrayData, value])
        break
      case "tree":
        const newNode: Node = { id: (treeData.length + 1).toString(), value }
        const newTreeData = [...treeData]
        const insertNode = (parentId: string) => {
          const parent = newTreeData.find((node) => node.id === parentId)
          if (!parent) return false
          if (value < parent.value) {
            if (!parent.left) {
              parent.left = newNode.id
              return true
            }
            return insertNode(parent.left)
          } else {
            if (!parent.right) {
              parent.right = newNode.id
              return true
            }
            return insertNode(parent.right)
          }
        }
        if (newTreeData.length === 0) {
          newTreeData.push(newNode)
        } else {
          const inserted = insertNode("1")
          if (inserted) {
            newTreeData.push(newNode)
          } else {
            toast({
              title: "Insert failed",
              description: "Could not insert value into tree",
              variant: "destructive",
            })
          }
        }
        setTreeData(newTreeData)
        break
      case "linkedList":
        const newLinkedListNode: LinkedListNode = {
          id: (linkedListData.length + 1).toString(),
          value,
        }
        if (linkedListData.length > 0) {
          linkedListData[linkedListData.length - 1].next = newLinkedListNode.id
        }
        setLinkedListData([...linkedListData, newLinkedListNode])
        break
      case "graph":
        const newGraphNode: GraphNode = {
          id: (graphData.length + 1).toString(),
          value,
          edges: [],
          position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4],
        }
        setGraphData([...graphData, newGraphNode])
        break
      case "stack":
        const newStackNode: StackNode = {
          id: (stackData.length + 1).toString(),
          value,
        }
        setStackData([...stackData, newStackNode])
        break
      case "queue":
        const newQueueNode: QueueNode = {
          id: (queueData.length + 1).toString(),
          value,
        }
        setQueueData([...queueData, newQueueNode])
        break
      case "heap":
        const newHeapNode: HeapNode = {
          id: (heapData.length + 1).toString(),
          value,
          position: [0, 0, 0],
        }
        const newHeapData = [...heapData, newHeapNode]
        updateHeapPositions(newHeapData)
        setHeapData(newHeapData)
        break
      case "hashTable":
        if (!newKey.trim()) {
          toast({
            title: "Missing key",
            description: "Please enter a key for the hash table entry",
            variant: "destructive",
          })
          setIsAnimating(false)
          setActiveOperation(null)
          return
        }
        const hash = (key: string) => {
          let hashValue = 0
          for (let i = 0; i < key.length; i++) {
            hashValue += key.charCodeAt(i)
          }
          return hashValue % 10
        }
        const index = hash(newKey)
        const newEntry: HashTableEntry = { key: newKey, value, index }
        const existingEntry = hashTableData.find((entry) => entry.index === index && entry.key === newKey)
        if (existingEntry) {
          toast({
            title: "Key exists",
            description: `Key "${newKey}" already exists at index ${index}.`,
            variant: "destructive",
          })
          setIsAnimating(false)
          setActiveOperation(null)
          return
        }
        setHashTableData([...hashTableData, newEntry])
        setNewKey("")
        break
    }
    setNewValue("")
    setActiveOperation(null)
  }

  const handleDeleteValue = () => {
    if (
      (dataStructure === "array" && arrayData.length === 0) ||
      (dataStructure === "tree" && treeData.length === 0) ||
      (dataStructure === "linkedList" && linkedListData.length === 0) ||
      (dataStructure === "graph" && graphData.length === 0) ||
      (dataStructure === "stack" && stackData.length === 0) ||
      (dataStructure === "queue" && queueData.length === 0) ||
      (dataStructure === "heap" && heapData.length === 0) ||
      (dataStructure === "hashTable" && hashTableData.length === 0)
    ) {
      toast({
        title: "Empty structure",
        description: `The ${dataStructure} is empty. Nothing to delete.`,
        variant: "destructive",
      })
      return
    }

    setActiveOperation("delete")
    setAnimationStep(0)
    setIsAnimating(true)

    const animationSteps = 5
    let step = 0

    const animationInterval = setInterval(() => {
      setAnimationStep(step)
      step++

      if (step > animationSteps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        performDelete()
      }
    }, 200)
  }

  const performDelete = () => {
    switch (dataStructure) {
      case "array":
        setArrayData(arrayData.slice(0, -1))
        break
      case "tree":
        const leafNodes = treeData.filter((node) => !node.left && !node.right)
        if (leafNodes.length > 0) {
          const nodeToRemove = leafNodes[leafNodes.length - 1]
          const parent = treeData.find((node) => node.left === nodeToRemove.id || node.right === nodeToRemove.id)
          if (parent) {
            if (parent.left === nodeToRemove.id) parent.left = undefined
            else if (parent.right === nodeToRemove.id) parent.right = undefined
          }
          setTreeData(treeData.filter((node) => node.id !== nodeToRemove.id))
        } else if (treeData.length === 1) {
          setTreeData([])
        }
        break
      case "linkedList":
        setLinkedListData(linkedListData.slice(0, -1))
        if (linkedListData.length > 1) {
          linkedListData[linkedListData.length - 2].next = undefined
        }
        break
      case "graph":
        if (graphData.length > 0) {
          const nodeToRemove = graphData[graphData.length - 1]
          const newGraphData = graphData
            .filter((node) => node.id !== nodeToRemove.id)
            .map((node) => ({
              ...node,
              edges: node.edges.filter((edge) => edge !== nodeToRemove.id),
            }))
          setGraphData(newGraphData)
        }
        break
      case "stack":
        setStackData(stackData.slice(0, -1))
        break
      case "queue":
        setQueueData(queueData.slice(1))
        break
      case "heap":
        const newHeapData = heapData.slice(0, -1)
        updateHeapPositions(newHeapData)
        setHeapData(newHeapData)
        break
      case "hashTable":
        setHashTableData(hashTableData.slice(0, -1))
        break
    }
    setActiveOperation(null)
    setSearchResult({ found: false })
  }

  const handleSearch = () => {
    const value = Number.parseInt(searchValue)
    if (isNaN(value)) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid number to search",
        variant: "destructive",
      })
      return
    }

    setActiveOperation("search")
    setAnimationStep(0)
    setIsAnimating(true)

    const animationSteps = 5
    let step = 0

    const animationInterval = setInterval(() => {
      setAnimationStep(step)
      step++

      if (step > animationSteps) {
        clearInterval(animationInterval)
        setIsAnimating(false)
        performSearch(value)
      }
    }, 200)
  }

  const performSearch = (value: number) => {
    let found = false
    let index: number | undefined = undefined
    let id: string | undefined = undefined

    switch (dataStructure) {
      case "array":
        index = arrayData.findIndex((item) => item === value)
        found = index !== -1
        break
      case "tree":
        const searchTree = (nodeId: string | undefined): string | undefined => {
          if (!nodeId) return undefined
          const node = treeData.find((n) => n.id === nodeId)
          if (!node) return undefined
          if (node.value === value) return node.id
          if (value < node.value) return searchTree(node.left)
          return searchTree(node.right)
        }
        id = searchTree("1")
        found = !!id
        break
      case "linkedList":
        index = linkedListData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? linkedListData[index].id : undefined
        break
      case "graph":
        index = graphData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? graphData[index].id : undefined
        break
      case "stack":
        index = stackData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? stackData[index].id : undefined
        break
      case "queue":
        index = queueData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? queueData[index].id : undefined
        break
      case "heap":
        index = heapData.findIndex((node) => node.value === value)
        found = index !== -1
        id = found ? heapData[index].id : undefined
        break
      case "hashTable":
        index = hashTableData.findIndex((entry) => entry.value === value)
        found = index !== -1
        id = found ? hashTableData[index].key : undefined
        break
    }

    setSearchResult({ found, index, id })
    setSearchValue("")
    setActiveOperation(null)

    toast({
      title: found ? "Value found!" : "Value not found",
      description: found
        ? `The value ${value} was found${index !== undefined ? ` at position ${index}` : ""}.`
        : `The value ${value} was not found in the ${dataStructure}.`,
      variant: found ? "default" : "destructive",
    })
  }

  const handleReset = () => {
    switch (dataStructure) {
      case "array":
        setArrayData([10, 20, 30, 40, 50])
        break
      case "tree":
        setTreeData([
          { id: "1", value: 50 },
          { id: "2", value: 30, left: "4", right: "5" },
          { id: "3", value: 70, left: "6", right: "7" },
          { id: "4", value: 20 },
          { id: "5", value: 40 },
          { id: "6", value: 60 },
          { id: "7", value: 80 },
        ])
        break
      case "linkedList":
        setLinkedListData([
          { id: "1", value: 10, next: "2" },
          { id: "2", value: 20, next: "3" },
          { id: "3", value: 30, next: "4" },
          { id: "4", value: 40, next: "5" },
          { id: "5", value: 50 },
        ])
        break
      case "graph":
        setGraphData([
          { id: "1", value: 1, edges: ["2", "3"], position: [0, 0, 0] },
          { id: "2", value: 2, edges: ["1", "4", "5"], position: [2, 1, 0] },
          { id: "3", value: 3, edges: ["1", "5"], position: [-2, 1, 0] },
          { id: "4", value: 4, edges: ["2"], position: [3, -1, 0] },
          { id: "5", value: 5, edges: ["2", "3"], position: [-1, -2, 0] },
        ])
        break
      case "stack":
        setStackData([
          { id: "1", value: 10 },
          { id: "2", value: 20 },
          { id: "3", value: 30 },
          { id: "4", value: 40 },
        ])
        break
      case "queue":
        setQueueData([
          { id: "1", value: 10 },
          { id: "2", value: 20 },
          { id: "3", value: 30 },
          { id: "4", value: 40 },
        ])
        break
      case "heap":
        setHeapData([
          { id: "1", value: 100, position: [0, 3, 0] },
          { id: "2", value: 80, position: [-2, 1.5, 0] },
          { id: "3", value: 70, position: [2, 1.5, 0] },
          { id: "4", value: 50, position: [-3, 0, 0] },
          { id: "5", value: 60, position: [-1, 0, 0] },
          { id: "6", value: 30, position: [1, 0, 0] },
          { id: "7", value: 40, position: [3, 0, 0] },
        ])
        break
      case "hashTable":
        setHashTableData([
          { key: "apple", value: 10, index: 0 },
          { key: "banana", value: 20, index: 1 },
          { key: "orange", value: 30, index: 2 },
          { key: "grape", value: 40, index: 4 },
          { key: "kiwi", value: 50, index: 7 },
        ])
        break
    }
    setSearchResult({ found: false })
    setActiveOperation(null)
    setAnimationStep(0)
    setNewValue("")
    setNewKey("")
    setSearchValue("")
  }

  const handleRandomize = () => {
    switch (dataStructure) {
      case "array":
        setArrayData(Array.from({ length: 5 }, () => Math.floor(Math.random() * 100) + 1))
        break
      case "linkedList":
        setLinkedListData(
          Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
            next: i < 4 ? (i + 2).toString() : undefined,
          }))
        )
        break
      case "stack":
        setStackData(
          Array.from({ length: 4 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
          }))
        )
        break
      case "queue":
        setQueueData(
          Array.from({ length: 4 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
          }))
        )
        break
      case "tree":
        const randomTree: Node[] = [
          { id: "1", value: Math.floor(Math.random() * 100) + 1 },
          { id: "2", value: Math.floor(Math.random() * 100) + 1, left: "4", right: "5" },
          { id: "3", value: Math.floor(Math.random() * 100) + 1, left: "6", right: "7" },
          { id: "4", value: Math.floor(Math.random() * 100) + 1 },
          { id: "5", value: Math.floor(Math.random() * 100) + 1 },
          { id: "6", value: Math.floor(Math.random() * 100) + 1 },
          { id: "7", value: Math.floor(Math.random() * 100) + 1 },
        ]
        setTreeData(randomTree)
        break
      case "graph":
        setGraphData(
          Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            value: Math.floor(Math.random() * 100) + 1,
            edges: i < 4 ? [(i + 2).toString()] : [],
            position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4],
          }))
        )
        break
      case "heap":
        const randomHeap = Array.from({ length: 7 }, (_, i) => ({
          id: (i + 1).toString(),
          value: Math.floor(Math.random() * 100) + 1,
          position: [0, 0, 0],
        }))
        updateHeapPositions(randomHeap)
        setHeapData(randomHeap)
        break
      case "hashTable":
        setHashTableData(
          Array.from({ length: 5 }, (_, i) => ({
            key: `key${i + 1}`,
            value: Math.floor(Math.random() * 100) + 1,
            index: i % 10,
          }))
        )
        break
    }
    setSearchResult({ found: false })
    setActiveOperation(null)
    setAnimationStep(0)
    setNewValue("")
    setNewKey("")
    setSearchValue("")
  }

  const updateHeapPositions = (heapData: HeapNode[]) => {
    const levels = Math.ceil(Math.log2(heapData.length + 1))
    const width = Math.pow(2, levels - 1) * 2
    for (let i = 0; i < heapData.length; i++) {
      const level = Math.floor(Math.log2(i + 1))
      const position = i + 1 - Math.pow(2, level)
      const nodesInLevel = Math.pow(2, level)
      const x = (position * width) / nodesInLevel - width / 2 + width / nodesInLevel / 2
      const y = 3 - level * 1.5
      heapData[i].position = [x, y, 0]
    }
  }

  const renderDataStructure = () => {
    return is3D ? render3DDataStructure() : render2DDataStructure()
  }

  const render2DDataStructure = () => {
    switch (dataStructure) {
      case "array":
        return (
          <div className="flex flex-wrap items-center justify-center gap-4 p-4 w-full overflow-auto">
            <AnimatePresence>
              {arrayData.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                 
 initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 border-2 border-gray-300 flex items-center justify-center rounded-lg text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                      activeOperation === "insert" && index === arrayData.length - 1 && animationStep > 0
                        ? "animate-pulse bg-green-100 border-green-500"
                        : activeOperation === "delete" && index === arrayData.length - 1 && animationStep > 0
                        ? "animate-pulse bg-red-100 border-red-500"
                        : ""
                    }`}
                    style={{ backgroundColor: getNodeColor(searchResult.found && searchResult.index === index, index, arrayData.length) }}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{index}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      case "tree":
        return (
          <div className="flex flex-col items-center justify-center p-4 w-full overflow-auto">
            <svg width="100%" height="400" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
              {renderTreeNodes(treeData, "1", 400, 50, 300)}
            </svg>
          </div>
        )
      case "linkedList":
        return (
          <div className="flex items-center justify-center p-4 w-full overflow-x-auto">
            <div className="flex items-center space-x-4">
              <AnimatePresence>
                {linkedListData.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 border-2 border-gray-300 flex items-center justify-center rounded-lg text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                        activeOperation === "insert" && index === linkedListData.length - 1 && animationStep > 0
                          ? "animate-pulse bg-green-100 border-green-500"
                          : activeOperation === "delete" && index === linkedListData.length - 1 && animationStep > 0
                          ? "animate-pulse bg-red-100 border-red-500"
                          : ""
                      }`}
                      style={{ backgroundColor: getNodeColor(searchResult.found && searchResult.id === node.id, index, linkedListData.length) }}
                    >
                      {node.value}
                    </div>
                    {node.next && (
                      <div className="w-8 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )
      case "graph":
        return (
          <div className="flex items-center justify-center p-4 w-full overflow-auto">
            <svg width="100%" height="400" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
              {renderGraphEdges()}
              {renderGraphNodes()}
            </svg>
          </div>
        )
      case "stack":
        return (
          <div className="flex flex-col-reverse items-center justify-center p-4 w-full overflow-auto">
            <div className="border-l-2 border-r-2 border-b-2 border-gray-300 w-28 sm:w-32 h-4 rounded-b-md" />
            <AnimatePresence>
              {stackData.map((node, index) => (
                <motion.div
                  key={node.id}
                  className={`w-28 sm:w-32 h-14 border-2 border-gray-300 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 ${
                    activeOperation === "insert" && index === stackData.length - 1 && animationStep > 0
                      ? "animate-pulse bg-green-100 border-green-500"
                      : activeOperation === "delete" && index === stackData.length - 1 && animationStep > 0
                      ? "animate-pulse bg-red-100 border-red-500"
                      : ""
                  } ${index === stackData.length - 1 ? "rounded-t-md" : ""}`}
                  style={{ backgroundColor: getNodeColor(searchResult.found && searchResult.id === node.id, index, stackData.length) }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {node.value}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-xs text-gray-500 mt-2">{stackData.length > 0 ? "← Top" : "Empty Stack"}</div>
          </div>
        )
      case "queue":
        return (
          <div className="flex flex-col items-center justify-center p-4 w-full overflow-x-auto">
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500">Front →</div>
              <div className="border-t-2 border-b-2 border-l-2 border-gray-300 w-4 h-14 rounded-l-md" />
              <AnimatePresence>
                {queueData.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className={`w-14 sm:w-16 h-14 border-t-2 border-b-2 border-gray-300 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300 ${
                      activeOperation === "insert" && index === queueData.length - 1 && animationStep > 0
                        ? "animate-pulse bg-green-100 border-green-500"
                        : activeOperation === "delete" && index === 0 && animationStep > 0
                        ? "animate-pulse bg-red-100 border-red-500"
                        : ""
                    } ${index === queueData.length - 1 ? "border-r-2 rounded-r-md" : ""}`}
                    style={{ backgroundColor: getNodeColor(searchResult.found && searchResult.id === node.id, index, queueData.length) }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {node.value}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="border-t-2 border-b-2 border-r-2 border-gray-300 w-4 h-14 rounded-r-md" />
              <div className="text-xs text-gray-500">← Back</div>
            </div>
          </div>
        )
      case "heap":
        return (
          <div className="flex flex-col items-center justify-center p-4 w-full overflow-auto">
            <svg width="100%" height="400" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
              {renderHeapNodes(heapData)}
            </svg>
          </div>
        )
      case "hashTable":
        return (
          <div className="flex flex-col items-center justify-center p-4 w-full overflow-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 border-2 border-gray-300 flex items-center justify-center rounded-lg bg-white text-gray-800 shadow-md">
                    {index}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Index</div>
                  <AnimatePresence>
                    {hashTableData
                      .filter((entry) => entry.index === index)
                      .map((entry) => (
                        <motion.div
                          key={entry.key}
                          className="flex flex-col items-center mt-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div
                            className={`w-20 sm:w-24 h-14 border-2 border-gray-300 flex items-center justify-center rounded-lg text-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                              activeOperation === "insert" &&
                              hashTableData[hashTableData.length - 1]?.key === entry.key &&
                              animationStep > 0
                                ? "animate-pulse bg-green-100 border-green-500"
                                : activeOperation === "delete" &&
                                  hashTableData[hashTableData.length - 1]?.key === entry.key &&
                                  animationStep > 0
                                ? "animate-pulse bg-red-100 border-red-500"
                                : ""
                            }`}
                            style={{ backgroundColor: getNodeColor(searchResult.found && searchResult.id === entry.key, index, hashTableData.length) }}
                          >
                            {entry.key}: {entry.value}
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const render3DDataStructure = () => {
    switch (dataStructure) {
      case "array":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {arrayData.map((value, index) => (
              <Box
                key={index}
                position={[index * 2 - (arrayData.length - 1), 0, 0]}
                args={[1.5, 1.5, 1.5]}
                castShadow
              >
                <meshStandardMaterial
                  color={getNodeColor(searchResult.found && searchResult.index === index, index, arrayData.length)}
                  roughness={0.5}
                  metalness={0.2}
                />
                <Text position={[0, 0, 0.76]} color="black" fontSize={0.8} anchorX="center" anchorY="middle">
                  {value}
                </Text>
              </Box>
            ))}
          </Canvas>
        )
      case "tree":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {render3DTreeNodes(treeData, "1", [0, 5, 0])}
          </Canvas>
        )
      case "graph":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {graphData.map((node, index) => (
              <Sphere
                key={node.id}
                position={node.position || [0, 0, 0]}
                args={[0.8, 32, 32]}
                castShadow
              >
                <meshStandardMaterial
                  color={getNodeColor(searchResult.found && searchResult.id === node.id, index, graphData.length)}
                  roughness={0.5}
                  metalness={0.2}
                />
                <Text position={[0, 0, 0.9]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Sphere>
            ))}
            {render3DGraphEdges()}
          </Canvas>
        )
      case "linkedList":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {linkedListData.map((node, index) => (
              <Box
                key={node.id}
                position={[index * 2.5 - (linkedListData.length - 1) * 1.25, 0, 0]}
                args={[1.5, 1.5, 1.5]}
                castShadow
              >
                <meshStandardMaterial
                  color={getNodeColor(searchResult.found && searchResult.id === node.id, index, linkedListData.length)}
                  roughness={0.5}
                  metalness={0.2}
                />
                <Text position={[0, 0, 0.76]} color="black" fontSize={0.8} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Box>
            ))}
            {linkedListData.slice(0, -1).map((node, index) => {
              const nextNode = linkedListData[index + 1]
              return (
                <Line
                  key={`${node.id}-${nextNode.id}`}
                  points={[
                    [index * 2.5 - (linkedListData.length - 1) * 1.25 + 0.75, 0, 0],
                    [(index + 1) * 2.5 - (linkedListData.length - 1) * 1.25 - 0.75, 0, 0],
                  ]}
                  color="gray"
                  lineWidth={5}
                />
              )
            })}
          </Canvas>
        )
      case "stack":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {stackData.map((node, index) => (
              <Box
                key={node.id}
                position={[0, index * 1.5 - (stackData.length - 1) * 0.75, 0]}
                args={[1.5, 1.5, 1.5]}
                castShadow
              >
                <meshStandardMaterial
                  color={getNodeColor(searchResult.found && searchResult.id === node.id, index, stackData.length)}
                  roughness={0.5}
                  metalness={0.2}
                />
                <Text position={[0, 0, 0.76]} color="black" fontSize={0.8} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Box>
            ))}
          </Canvas>
        )
      case "queue":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {queueData.map((node, index) => (
              <Box
                key={node.id}
                position={[index * 2.5 - (queueData.length - 1) * 1.25, 0, 0]}
                args={[1.5, 1.5, 1.5]}
                castShadow
              >
                <meshStandardMaterial
                  color={getNodeColor(searchResult.found && searchResult.id === node.id, index, queueData.length)}
                  roughness={0.5}
                  metalness={0.2}
                />
                <Text position={[0, 0, 0.76]} color="black" fontSize={0.8} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Box>
            ))}
          </Canvas>
        )
      case "heap":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {heapData.map((node, index) => (
              <Sphere
                key={node.id}
                position={node.position ? [node.position[0] * 2, node.position[1] * 2, node.position[2]] : [0, 0, 0]}
                args={[0.8, 32, 32]}
                castShadow
              >
                <meshStandardMaterial
                  color={getNodeColor(searchResult.found && searchResult.id === node.id, index, heapData.length)}
                  roughness={0.5}
                  metalness={0.2}
                />
                <Text position={[0, 0, 0.9]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Sphere>
            ))}
          </Canvas>
        )
      case "hashTable":
        return (
          <Canvas style={{ width: "100%", height: `${height}px` }} camera={{ position: [0, 5, 15], fov: 60 }}>
            <OrbitControls />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            {hashTableData.map((entry, index) => (
              <Box
                key={entry.key}
                position={[entry.index * 2.5 - 11.25, 0, 0]}
                args={[1.5, 1.5, 1.5]}
                castShadow
              >
                <meshStandardMaterial
                  color={getNodeColor(searchResult.found && searchResult.id === entry.key, index, hashTableData.length)}
                  roughness={0.5}
                  metalness={0.2}
                />
                <Text position={[0, 0, 0.76]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
                  {entry.key}: {entry.value}
                </Text>
              </Box>
            ))}
          </Canvas>
        )
      default:
        return null
    }
  }

  const render3DTreeNodes = (
    nodes: Node[],
    nodeId: string | undefined,
    position: [number, number, number],
  ): JSX.Element | null => {
    if (!nodeId) return null
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return null
    return (
      <group key={node.id}>
        <Sphere position={position} args={[0.8, 32, 32]} castShadow>
          <meshStandardMaterial
            color={getNodeColor(searchResult.found && searchResult.id === node.id, undefined, treeData.length)}
            roughness={0.5}
            metalness={0.2}
          />
          <Text position={[0, 0, 0.9]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
            {node.value}
          </Text>
        </Sphere>
        {node.left && (
          <>
            <Line
              points={[position, [position[0] - 3, position[1] - 3, position[2]]]}
              color="gray"
              lineWidth={5}
            />
            {render3DTreeNodes(nodes, node.left, [position[0] - 3, position[1] - 3, position[2]])}
          </>
        )}
        {node.right && (
          <>
            <Line
              points={[position, [position[0] + 3, position[1] - 3, position[2]]]}
              color="gray"
              lineWidth={5}
            />
            {render3DTreeNodes(nodes, node.right, [position[0] + 3, position[1] - 3, position[2]])}
          </>
        )}
      </group>
    )
  }

  const render3DGraphEdges = () => {
    const edges: JSX.Element[] = []
    graphData.forEach((node) => {
      node.edges.forEach((targetId) => {
        const targetNode = graphData.find((n) => n.id === targetId)
        if (targetNode && node.id < targetNode.id) {
          edges.push(
            <Line
              key={`${node.id}-${targetId}`}
              points={[node.position || [0, 0, 0], targetNode.position || [0, 0, 0]]}
              color="gray"
              lineWidth={5}
            />,
          )
        }
      })
    })
    return edges
  }

  const renderTreeNodes = (
    nodes: Node[],
    nodeId: string | undefined,
    x: number,
    y: number,
    width: number,
  ): JSX.Element[] => {
    if (!nodeId) return []
    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return []
    const elements: JSX.Element[] = []
    elements.push(
      <g key={node.id}>
        <circle
          cx={x}
          cy={y}
          r={25}
          fill={getNodeColor(searchResult.found && searchResult.id === node.id, undefined, treeData.length)}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="shadow-md hover:shadow-lg transition-shadow duration-300"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(var(--primary-foreground))"
          fontSize="14"
        >
          {node.value}
        </text>
      </g>,
    )
    if (node.left) {
      const leftX = x - width / 2
      const leftY = y + 80
      elements.push(
        <line
          key={`${node.id}-${node.left}`}
          x1={x}
          y1={y + 25}
          x2={leftX}
          y2={leftY - 25}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />,
      )
      elements.push(...renderTreeNodes(nodes, node.left, leftX, leftY, width / 2))
    }
    if (node.right) {
      const rightX = x + width / 2
      const rightY = y + 80
      elements.push(
        <line
          key={`${node.id}-${node.right}`}
          x1={x}
          y1={y + 25}
          x2={rightX}
          y2={rightY - 25}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />,
      )
      elements.push(...renderTreeNodes(nodes, node.right, rightX, rightY, width / 2))
    }
    return elements
  }

  const renderGraphNodes = () => {
    const centerX = 300
    const centerY = 200
    const radius = 150
    return graphData.map((node, index) => {
      const angle = (index / graphData.length) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      return (
        <g key={node.id}>
          <circle
            cx={x}
            cy={y}
            r={25}
            fill={getNodeColor(searchResult.found && searchResult.id === node.id, index, graphData.length)}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="shadow-md hover:shadow-lg transition-shadow duration-300"
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="hsl(var(--primary-foreground))"
            fontSize="14"
          >
            {node.value}
          </text>
        </g>
      )
    })
  }

  const renderGraphEdges = () => {
    const centerX = 300
    const centerY = 200
    const radius = 150
    const edges: JSX.Element[] = []
    graphData.forEach((node, sourceIndex) => {
      const sourceAngle = (sourceIndex / graphData.length) * 2 * Math.PI
      const sourceX = centerX + radius * Math.cos(sourceAngle)
      const sourceY = centerY + radius * Math.sin(sourceAngle)
      node.edges.forEach((targetId) => {
        const targetIndex = graphData.findIndex((n) => n.id === targetId)
        if (targetIndex > sourceIndex) {
          const targetAngle = (targetIndex / graphData.length) * 2 * Math.PI
          const targetX = centerX + radius * Math.cos(targetAngle)
          const targetY = centerY + radius * Math.sin(targetAngle)
          edges.push(
            <line
              key={`${node.id}-${targetId}`}
              x1={sourceX}
              y1={sourceY}
              x2={targetX}
              y2={targetY}
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />,
          )
        }
      })
    })
    return lines
  }

  const renderHeapNodes = (heapData: HeapNode[]) => {
    return heapData.map((node, index) => (
      <g key={node.id}>
        <circle
          cx={node.position ? node.position[0] * 80 + 400 : 400}
          cy={node.position ? node.position[1] * 80 + 200 : 200}
          r={25}
          fill={getNodeColor(searchResult.found && searchResult.id === node.id, index, heapData.length)}
          stroke="hsl(var(--border))"
          strokeWidth="2"
          className="shadow-md hover:shadow-lg transition-shadow duration-300"
        />
        <text
          x={node.position ? node.position[0] * 80 + 400 : 400}
          y={node.position ? node.position[1] * 80 + 200 : 200}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(var(--primary-foreground))"
          fontSize="14"
        >
          {node.value}
        </text>
      </g>
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-5xl bg-white/80 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {dataStructure === "hashTable" ? (
                <>
                  <Input
                    type="text"
                    placeholder="Enter key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    className="w-full sm:w-40 text-sm sm:text-base"
                  />
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="w-full sm:w-40 text-sm sm:text-base"
                  />
                </>
              ) : (
                <Input
                  type="number"
                  placeholder="Enter value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full sm:w-40 text-sm sm:text-base"
                />
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleAddValue}
                      className="w-12 h-12"
                      disabled={isAnimating}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add a new value</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleDeleteValue}
                      className="w-12 h-12"
                      disabled={isAnimating}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete the last value</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              {dataStructure !== "hashTable" && (
                <>
                  <Input
                    type="number"
                    placeholder="Search value"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full sm:w-40 text-sm sm:text-base"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleSearch}
                          className="w-12 h-12"
                          disabled={isAnimating}
                        >
                          <Search className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Search for a value</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      className="w-12 h-12"
                      disabled={isAnimating}
                    >
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset to default values</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleRandomize}
                      className="w-12 h-12"
                      disabled={isAnimating}
                    >
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Randomize data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="min-h-[400px] flex items-center justify-center border rounded-lg mt-6 bg-white/50">
            {renderDataStructure()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
