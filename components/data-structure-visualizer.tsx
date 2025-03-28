"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash, RefreshCw, Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Text, Box, Sphere, Line } from "@react-three/drei"

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
  is3D?: boolean
}

export default function DataStructureVisualizer({ is3D = false }: DataStructureVisualizerProps) {
  const [dataStructure, setDataStructure] = useState<DataStructure>("array")
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
  const [searchResult, setSearchResult] = useState<{ found: boolean; index?: number }>({ found: false })
  const [activeOperation, setActiveOperation] = useState<"insert" | "delete" | "search" | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleDataStructureChange = (value: string) => {
    setDataStructure(value as DataStructure)
    setSearchResult({ found: false })
    setActiveOperation(null)
    setAnimationStep(0)
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

    // Start animation sequence
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
    }, 300)
  }

  const performInsert = (value: number) => {
    switch (dataStructure) {
      case "array":
        setArrayData([...arrayData, value])
        break
      case "tree":
        // Simple BST insertion
        const newNode: Node = { id: (treeData.length + 1).toString(), value }
        const newTreeData = [...treeData]

        const insertNode = (parentId: string) => {
          const parent = newTreeData.find((node) => node.id === parentId)
          if (!parent) return false

          if (value < parent.value) {
            if (!parent.left) {
              parent.left = newNode.id
              return true
            } else {
              return insertNode(parent.left)
            }
          } else {
            if (!parent.right) {
              parent.right = newNode.id
              return true
            } else {
              return insertNode(parent.right)
            }
          }
        }

        if (newTreeData.length === 0) {
          newTreeData.push(newNode)
        } else {
          const inserted = insertNode("1")
          if (inserted) {
            newTreeData.push(newNode)
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
          const lastNode = linkedListData[linkedListData.length - 1]
          lastNode.next = newLinkedListNode.id
        }

        setLinkedListData([...linkedListData, newLinkedListNode])
        break
      case "graph":
        // Add a new node with no edges initially
        const newGraphNode: GraphNode = {
          id: (graphData.length + 1).toString(),
          value,
          edges: [],
          position: [(Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4],
        }
        setGraphData([...graphData, newGraphNode])
        break
      case "stack":
        // Add to the top of the stack
        const newStackNode: StackNode = {
          id: (stackData.length + 1).toString(),
          value,
        }
        setStackData([...stackData, newStackNode])
        break
      case "queue":
        // Add to the end of the queue
        const newQueueNode: QueueNode = {
          id: (queueData.length + 1).toString(),
          value,
        }
        setQueueData([...queueData, newQueueNode])
        break
      case "heap":
        // Add to the heap (max heap)
        const newHeapNode: HeapNode = {
          id: (heapData.length + 1).toString(),
          value,
        }

        // Simple heap insertion (not maintaining heap property for visualization simplicity)
        const newHeapData = [...heapData, newHeapNode]

        // Update positions for visualization
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
          return
        }

        // Simple hash function
        const hash = (key: string) => {
          let hashValue = 0
          for (let i = 0; i < key.length; i++) {
            hashValue += key.charCodeAt(i)
          }
          return hashValue % 10 // 10 buckets
        }

        const index = hash(newKey)
        const newEntry: HashTableEntry = {
          key: newKey,
          value,
          index,
        }

        // Check for collision
        const existingEntry = hashTableData.find((entry) => entry.index === index)
        if (existingEntry) {
          toast({
            title: "Hash collision",
            description: `Collision at index ${index}. In a real hash table, this would be resolved.`,
            variant: "warning",
          })
        }

        setHashTableData([...hashTableData, newEntry])
        setNewKey("")
        break
    }

    setNewValue("")
    setActiveOperation(null)
  }

  const handleDeleteValue = () => {
    setActiveOperation("delete")
    setAnimationStep(0)
    setIsAnimating(true)

    // Start animation sequence
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
    }, 300)
  }

  const performDelete = () => {
    switch (dataStructure) {
      case "array":
        if (arrayData.length > 0) {
          const newArray = [...arrayData]
          newArray.pop()
          setArrayData(newArray)
        }
        break
      case "tree":
        if (treeData.length > 0) {
          // Simple removal of a leaf node for visualization
          const leafNodes = treeData.filter((node) => !node.left && !node.right)
          if (leafNodes.length > 0) {
            const nodeToRemove = leafNodes[leafNodes.length - 1]

            // Find parent and remove reference
            const parent = treeData.find((node) => node.left === nodeToRemove.id || node.right === nodeToRemove.id)

            if (parent) {
              if (parent.left === nodeToRemove.id) {
                parent.left = undefined
              } else if (parent.right === nodeToRemove.id) {
                parent.right = undefined
              }
            }

            // Remove the node
            const newTreeData = treeData.filter((node) => node.id !== nodeToRemove.id)
            setTreeData(newTreeData)
          }
        }
        break
      case "linkedList":
        if (linkedListData.length > 0) {
          const newLinkedList = [...linkedListData]
          newLinkedList.pop()

          // Update next pointer of the new last node
          if (newLinkedList.length > 0) {
            newLinkedList[newLinkedList.length - 1].next = undefined
          }

          setLinkedListData(newLinkedList)
        }
        break
      case "graph":
        if (graphData.length > 0) {
          const nodeToRemove = graphData[graphData.length - 1]

          // Remove references to this node from other nodes
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
        if (stackData.length > 0) {
          const newStack = [...stackData]
          newStack.pop() // Remove from top
          setStackData(newStack)
        }
        break
      case "queue":
        if (queueData.length > 0) {
          const newQueue = [...queueData]
          newQueue.shift() // Remove from front
          setQueueData(newQueue)
        }
        break
      case "heap":
        if (heapData.length > 0) {
          const newHeapData = [...heapData]
          newHeapData.pop()

          // Update positions
          updateHeapPositions(newHeapData)

          setHeapData(newHeapData)
        }
        break
      case "hashTable":
        if (hashTableData.length > 0) {
          const newHashTable = [...hashTableData]
          newHashTable.pop()
          setHashTableData(newHashTable)
        }
        break
    }

    setActiveOperation(null)
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

    // Start animation sequence
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
    }, 300)
  }

  const performSearch = (value: number) => {
    let found = false
    let index: number | undefined = undefined

    switch (dataStructure) {
      case "array":
        index = arrayData.findIndex((item) => item === value)
        found = index !== -1
        break
      case "tree":
        // Simple BST search
        const searchTree = (nodeId: string | undefined): boolean => {
          if (!nodeId) return false

          const node = treeData.find((n) => n.id === nodeId)
          if (!node) return false

          if (node.value === value) {
            return true
          } else if (value < node.value) {
            return searchTree(node.left)
          } else {
            return searchTree(node.right)
          }
        }

        found = searchTree("1") // Start from root
        break
      case "linkedList":
        index = linkedListData.findIndex((node) => node.value === value)
        found = index !== -1
        break
      case "graph":
        index = graphData.findIndex((node) => node.value === value)
        found = index !== -1
        break
      case "stack":
        index = stackData.findIndex((node) => node.value === value)
        found = index !== -1
        break
      case "queue":
        index = queueData.findIndex((node) => node.value === value)
        found = index !== -1
        break
      case "heap":
        index = heapData.findIndex((node) => node.value === value)
        found = index !== -1
        break
      case "hashTable":
        index = hashTableData.findIndex((entry) => entry.value === value)
        found = index !== -1
        break
    }

    setSearchResult({ found, index })
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
  }

  // Helper function to update heap positions for visualization
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
    if (is3D) {
      return render3DDataStructure()
    } else {
      return render2DDataStructure()
    }
  }

  const render2DDataStructure = () => {
    switch (dataStructure) {
      case "array":
        return (
          <div className="flex flex-wrap items-center justify-center gap-2 p-4">
            <AnimatePresence>
              {arrayData.map((value, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    backgroundColor:
                      searchResult.found && searchResult.index === index ? "rgba(34, 197, 94, 0.2)" : "transparent",
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-12 h-12 border border-border flex items-center justify-center rounded-md bg-card text-card-foreground ${
                      activeOperation === "insert" && index === arrayData.length - 1 && animationStep > 0
                        ? "animate-pulse bg-green-500/20"
                        : activeOperation === "delete" && index === arrayData.length - 1 && animationStep > 0
                          ? "animate-pulse bg-red-500/20"
                          : searchResult.found && searchResult.index === index
                            ? "bg-green-500/20 border-green-500"
                            : ""
                    }`}
                  >
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{index}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )
      case "tree":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <svg width="600" height="300" className="overflow-visible">
              {renderTreeNodes(treeData, "1", 300, 30, 150)}
            </svg>
          </div>
        )
      case "linkedList":
        return (
          <div className="flex items-center justify-center p-4 overflow-x-auto">
            <div className="flex items-center">
              <AnimatePresence>
                {linkedListData.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      backgroundColor:
                        searchResult.found && searchResult.index === index ? "rgba(34, 197, 94, 0.2)" : "transparent",
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div
                      className={`w-12 h-12 border border-border flex items-center justify-center rounded-md bg-card text-card-foreground ${
                        activeOperation === "insert" && index === linkedListData.length - 1 && animationStep > 0
                          ? "animate-pulse bg-green-500/20"
                          : activeOperation === "delete" && index === linkedListData.length - 1 && animationStep > 0
                            ? "animate-pulse bg-red-500/20"
                            : searchResult.found && searchResult.index === index
                              ? "bg-green-500/20 border-green-500"
                              : ""
                      }`}
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
          <div className="flex items-center justify-center p-4">
            <svg width="400" height="300" viewBox="0 0 400 300">
              {renderGraphEdges()}
              {renderGraphNodes()}
            </svg>
          </div>
        )
      case "stack":
        return (
          <div className="flex flex-col-reverse items-center justify-center p-4">
            <div className="border-l-2 border-r-2 border-b-2 border-border w-32 h-4 rounded-b-md" />
            <AnimatePresence>
              {stackData.map((node, index) => (
                <motion.div
                  key={node.id}
                  className={`w-32 h-12 border border-border flex items-center justify-center ${
                    index === stackData.length - 1 ? "rounded-t-md" : ""
                  } ${
                    activeOperation === "insert" && index === stackData.length - 1 && animationStep > 0
                      ? "animate-pulse bg-green-500/20"
                      : activeOperation === "delete" && index === stackData.length - 1 && animationStep > 0
                        ? "animate-pulse bg-red-500/20"
                        : searchResult.found && searchResult.index === index
                          ? "bg-green-500/20 border-green-500"
                          : "bg-card"
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {node.value}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="text-xs text-muted-foreground mt-2">{stackData.length > 0 ? "← Top" : "Empty Stack"}</div>
          </div>
        )
      case "queue":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="flex items-center">
              <div className="text-xs text-muted-foreground mr-2">Front →</div>
              <div className="border-t-2 border-b-2 border-l-2 border-border w-4 h-12 rounded-l-md" />
              <AnimatePresence>
                {queueData.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className={`w-12 h-12 border-t-2 border-b-2 border-border flex items-center justify-center ${
                      index === queueData.length - 1 ? "border-r-2 rounded-r-md" : ""
                    } ${
                      activeOperation === "insert" && index === queueData.length - 1 && animationStep > 0
                        ? "animate-pulse bg-green-500/20"
                        : activeOperation === "delete" && index === 0 && animationStep > 0
                          ? "animate-pulse bg-red-500/20"
                          : searchResult.found && searchResult.index === index
                            ? "bg-green-500/20 border-green-500"
                            : "bg-card"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {node.value}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="border-t-2 border-b-2 border-r-2 border-border w-4 h-12 rounded-r-md" />
              <div className="text-xs text-muted-foreground ml-2">← Back</div>
            </div>
          </div>
        )
      case "heap":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <svg width="600" height="300" className="overflow-visible">
              {renderHeapNodes(heapData)}
            </svg>
          </div>
        )
      case "hashTable":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-12 h-12 border border-border flex items-center justify-center rounded-md bg-card text-card-foreground">
                    {index}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Index</div>
                  <AnimatePresence>
                    {hashTableData
                      .filter((entry) => entry.index === index)
                      .map((entry) => (
                        <motion.div
                          key={entry.key}
                          className="flex flex-col items-center mt-2"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="w-24 h-12 border border-border flex items-center justify-center rounded-md bg-card text-card-foreground">
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
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {arrayData.map((value, index) => (
              <Box key={index} position={[index * 1.5 - (arrayData.length - 1) * 0.75, 0, 0]}>
                <meshStandardMaterial color="orange" />
                <Text position={[0, 0, 0.51]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
                  {value}
                </Text>
              </Box>
            ))}
          </Canvas>
        )
      case "tree":
        return (
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {render3DTreeNodes(treeData, "1", [0, 3, 0])}
          </Canvas>
        )
      case "graph":
        return (
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {graphData.map((node) => (
              <Sphere key={node.id} position={node.position || [0, 0, 0]} args={[0.5, 32, 32]}>
                <meshStandardMaterial color="skyblue" />
                <Text position={[0, 0, 0.6]} color="black" fontSize={0.3} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Sphere>
            ))}
            {render3DGraphEdges()}
          </Canvas>
        )
      case "linkedList":
        return (
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {linkedListData.map((node, index) => (
              <Box key={node.id} position={[index * 2 - (linkedListData.length - 1), 0, 0]}>
                <meshStandardMaterial color="lightgreen" />
                <Text position={[0, 0, 0.51]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
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
                    [index * 2 - (linkedListData.length - 1) + 0.5, 0, 0],
                    [(index + 1) * 2 - (linkedListData.length - 1) - 0.5, 0, 0],
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
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {stackData.map((node, index) => (
              <Box key={node.id} position={[0, index - (stackData.length - 1) / 2, 0]}>
                <meshStandardMaterial color="lightblue" />
                <Text position={[0, 0, 0.51]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Box>
            ))}
          </Canvas>
        )
      case "queue":
        return (
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {queueData.map((node, index) => (
              <Box key={node.id} position={[index - (queueData.length - 1) / 2, 0, 0]}>
                <meshStandardMaterial color="lightcoral" />
                <Text position={[0, 0, 0.51]} color="black" fontSize={0.5} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Box>
            ))}
          </Canvas>
        )
      case "heap":
        return (
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {heapData.map((node) => (
              <Sphere key={node.id} position={node.position || [0, 0, 0]} args={[0.5, 32, 32]}>
                <meshStandardMaterial color="lightyellow" />
                <Text position={[0, 0, 0.6]} color="black" fontSize={0.3} anchorX="center" anchorY="middle">
                  {node.value}
                </Text>
              </Sphere>
            ))}
          </Canvas>
        )
      case "hashTable":
        return (
          <Canvas style={{ width: "100%", height: "300px" }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} />
            {hashTableData.map((entry) => (
              <Box key={entry.key} position={[entry.index * 2 - 9, 0, 0]}>
                <meshStandardMaterial color="lavender" />
                <Text position={[0, 0, 0.51]} color="black" fontSize={0.3} anchorX="center" anchorY="middle">
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
        <Sphere position={position} args={[0.5, 32, 32]}>
          <meshStandardMaterial color="lightgreen" />
          <Text position={[0, 0, 0.6]} color="black" fontSize={0.3} anchorX="center" anchorY="middle">
            {node.value}
          </Text>
        </Sphere>
        {node.left && render3DTreeNodes(nodes, node.left, [position[0] - 2, position[1] - 2, position[2]])}
        {node.right && render3DTreeNodes(nodes, node.right, [position[0] + 2, position[1] - 2, position[2]])}
      </group>
    )
  }

  const render3DGraphEdges = () => {
    const edges: JSX.Element[] = []

    graphData.forEach((node) => {
      node.edges.forEach((targetId) => {
        const targetNode = graphData.find((n) => n.id === targetId)
        if (targetNode && node.id < targetNode.id) {
          // Ensure each edge is drawn only once
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

    // Add the current node
    elements.push(
      <g key={node.id}>
        <circle cx={x} cy={y} r={20} fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(var(--primary-foreground))"
          fontSize="12"
        >
          {node.value}
        </text>
      </g>,
    )

    // Recursively render left subtree
    if (node.left) {
      const leftX = x - width / 2
      const leftY = y + 60

      elements.push(
        <line
          key={`${node.id}-${node.left}`}
          x1={x}
          y1={y + 20}
          x2={leftX}
          y2={leftY - 20}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />,
      )

      elements.push(...renderTreeNodes(nodes, node.left, leftX, leftY, width / 2))
    }

    // Recursively render right subtree
    if (node.right) {
      const rightX = x + width / 2
      const rightY = y + 60

      elements.push(
        <line
          key={`${node.id}-${node.right}`}
          x1={x}
          y1={y + 20}
          x2={rightX}
          y2={rightY - 20}
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />,
      )

      elements.push(...renderTreeNodes(nodes, node.right, rightX, rightY, width / 2))
    }

    return elements
  }

  const renderGraphNodes = () => {
    // Calculate positions in a circle
    const centerX = 200
    const centerY = 150
    const radius = 100

    return graphData.map((node, index) => {
      const angle = (index / graphData.length) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      return (
        <g key={node.id}>
          <circle cx={x} cy={y} r={20} fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="hsl(var(--primary-foreground))"
            fontSize="12"
          >
            {node.value}
          </text>
        </g>
      )
    })
  }

  const renderGraphEdges = () => {
    const centerX = 200
    const centerY = 150
    const radius = 100

    const edges: JSX.Element[] = []

    graphData.forEach((node, sourceIndex) => {
      const sourceAngle = (sourceIndex / graphData.length) * 2 * Math.PI
      const sourceX = centerX + radius * Math.cos(sourceAngle)
      const sourceY = centerY + radius * Math.sin(sourceAngle)

      node.edges.forEach((targetId) => {
        const targetIndex = graphData.findIndex((n) => n.id === targetId)
        if (targetIndex > sourceIndex) {
          // Only draw each edge once
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

    return edges
  }

  const renderHeapNodes = (heapData: HeapNode[]) => {
    return heapData.map((node) => (
      <g key={node.id}>
        <circle
          cx={node.position ? node.position[0] * 50 + 300 : 300}
          cy={node.position ? node.position[1] * 50 + 150 : 150}
          r={20}
          fill="hsl(var(--primary))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
        />
        <text
          x={node.position ? node.position[0] * 50 + 300 : 300}
          y={node.position ? node.position[1] * 50 + 150 : 150}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="hsl(var(--primary-foreground))"
          fontSize="12"
        >
          {node.value}
        </text>
      </g>
    ))
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue={dataStructure} className="w-full">
          <TabsList>
            <TabsTrigger value="array" onClick={() => handleDataStructureChange("array")}>
              Array
            </TabsTrigger>
            <TabsTrigger value="tree" onClick={() => handleDataStructureChange("tree")}>
              Tree
            </TabsTrigger>
            <TabsTrigger value="linkedList" onClick={() => handleDataStructureChange("linkedList")}>
              Linked List
            </TabsTrigger>
            <TabsTrigger value="graph" onClick={() => handleDataStructureChange("graph")}>
              Graph
            </TabsTrigger>
            <TabsTrigger value="stack" onClick={() => handleDataStructureChange("stack")}>
              Stack
            </TabsTrigger>
            <TabsTrigger value="queue" onClick={() => handleDataStructureChange("queue")}>
              Queue
            </TabsTrigger>
            <TabsTrigger value="heap" onClick={() => handleDataStructureChange("heap")}>
              Heap
            </TabsTrigger>
            <TabsTrigger value="hashTable" onClick={() => handleDataStructureChange("hashTable")}>
              Hash Table
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2 mt-4">
            {dataStructure === "hashTable" ? (
              <>
                <Input
                  type="text"
                  placeholder="Enter key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-32"
                />
                <Input
                  type="number"
                  placeholder="Enter value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-32"
                />
                <Button variant="outline" size="icon" onClick={handleAddValue}>
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="number"
                  placeholder="Enter value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-32"
                />
                <Button variant="outline" size="icon" onClick={handleAddValue}>
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="outline" size="icon" onClick={handleDeleteValue}>
              <Trash className="h-4 w-4" />
            </Button>
            {dataStructure !== "hashTable" && (
              <>
                <Input
                  type="number"
                  placeholder="Search value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-32"
                />
                <Button variant="outline" size="icon" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="outline" size="icon" onClick={handleReset}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="min-h-[300px] flex items-center justify-center border rounded-md mt-4">
            {renderDataStructure()}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

